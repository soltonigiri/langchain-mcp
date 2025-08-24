// collect-docs.mjs
// Node 18+ で動作。外部依存なし。
// 収集結果は <OUTPUT_DIR>/<project>/<category>/... に保存。

import { mkdir, writeFile, readFile, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const OUTPUT_DIR = process.env.OUTPUT_DIR || "collected_docs";
const MAX_CONCURRENCY = Number(process.env.MAX_CONCURRENCY || 8);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const ARGS = new Set(process.argv.slice(2));
const NO_CLEANUP = ARGS.has("--no-cleanup");
const PURGE_SOURCES = ARGS.has("--purge-sources");

// ---- 収集対象の定義 ----
const SOURCES = [
  // llms.txt 系（公式で管理される厳選リンク）
  { type: "llms", project: "langchain-python", url: "https://python.langchain.com/llms.txt" },
  { type: "llms", project: "langchain-js",     url: "https://js.langchain.com/llms.txt" },
  { type: "llms", project: "langgraph-python", url: "https://langchain-ai.github.io/langgraph/llms.txt" },
  { type: "llms", project: "langgraph-js",     url: "https://langchain-ai.github.io/langgraphjs/llms.txt" },

  // 必要に応じてサイトマップ巡回（全ページを取りにいきたい時）
  // { type: "sitemap", project: "langchain-python", url: "https://python.langchain.com/sitemap.xml" },

  // GitHub の docs ソース（Markdown/MDX ベース）
  { type: "github", project: "langsmith", repo: { owner: "langchain-ai", name: "langsmith-docs", branch: "main", includeDirs: ["docs"] } },
  { type: "github", project: "langsmith-cookbook", repo: { owner: "langchain-ai", name: "langsmith-cookbook", branch: "main", includeDirs: [""] } },
];

// ---- 汎用ユーティリティ ----
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

function sha1(s) {
  return crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
}

function sanitizeName(s) {
  return s.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").replace(/\s+/g, "_");
}

function inferCategoryFromUrl(u) {
  // URL パスからカテゴリを推定
  const p = new URL(u).pathname.toLowerCase();
  if (p.includes("how_to") || p.includes("how-to") || p.includes("/howtos") || p.includes("/how-tos")) return "how_to";
  if (p.includes("tutorial")) return "tutorials";
  if (p.includes("concept")) return "concepts";
  if (p.includes("api") || p.includes("reference")) return "api_reference";
  if (p.includes("agents") || p.includes("/agent")) return "agents";
  if (p.includes("observability")) return "observability";
  if (p.includes("evaluation") || p.includes("/eval")) return "evaluation";
  if (p.includes("prompt")) return "prompt_engineering";
  if (p.includes("platform") || p.includes("deployment")) return "platform";
  return "misc";
}

function shouldSkipUrl(u) {
  // ノイズを省くフィルタ
  if (u.includes("#")) return true;           // 同一ページ内リンク
  if (u.includes("/search")) return true;
  if (u.includes("/tags")) return true;
  if (u.includes("/assets/")) return true;
  if (/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tgz|gz|mp4|webm)(\?|$)/i.test(u)) return true;
  return false;
}

async function fetchText(url, headers = {}) {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(url, { headers });
    if (res.status === 429 || res.status >= 500) {
      await sleep(1000 * (i + 1));
      continue;
    }
    if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
    return await res.text();
  }
  throw new Error(`Fetch failed after retries for ${url}`);
}

function extractUrlsFromLlmstxt(text) {
  // llms.txt/llms-full.txt から URL を抽出（括弧リンク/裸URLどちらも拾う）
  const urls = new Set();
  const rx = /(https?:\/\/[^\s)\]]+)/g;
  for (const m of text.matchAll(rx)) {
    const u = m[1].trim();
    if (!shouldSkipUrl(u)) urls.add(u);
  }
  return [...urls];
}

function extractLocsFromSitemap(xml) {
  const locs = new Set();
  // 非厳密 XML パーサ（依存を増やさないため）
  const rx = /<loc>\s*([^<\s]+)\s*<\/loc>/gim;
  for (const m of xml.matchAll(rx)) {
    const u = m[1].trim();
    if (!shouldSkipUrl(u)) locs.add(u);
  }
  return [...locs];
}

// HTML をそのまま保存しつつ、テキスト版も（最低限）落とす
function htmlToRudimentaryText(html) {
  // ざっくりタグ除去（簡易）：<script>,<style>,<nav>,<aside> を消してからテキスト化
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "");

  s = s.replace(/<[^>]+>/g, "\n"); // タグ→改行
  s = s.replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

// 簡易 HTML→Markdown 変換（外部依存なし・主要タグのみ）
function htmlToMarkdown(html) {
  if (!html || typeof html !== "string") return "";

  // 1) 雑音除去
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "");

  // 2) 事前に <pre> ブロックを退避
  const preBlocks = [];
  s = s.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, (m) => {
    const idx = preBlocks.length;
    preBlocks.push(m);
    return `\u0000PRE_BLOCK_${idx}\u0000`;
  });

  const decode = (t) => t
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const stripTags = (t) => t.replace(/<[^>]+>/g, "");
  const inline = (t) => decode(stripTags(t)).replace(/[\t\n\r]+/g, " ").replace(/\s{2,}/g, " ").trim();

  const getAttr = (tag, name) => {
    const r = new RegExp(name + "\\s*=\\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)", "i");
    const m = tag.match(r);
    if (!m) return "";
    const v = m[1];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
    return v;
  };

  // 3) 画像 → ![alt](src)
  s = s.replace(/<img[^>]*>/gi, (tag) => {
    const src = getAttr(tag, "src");
    const alt = getAttr(tag, "alt");
    if (!src) return "";
    return `![${decode(alt || "")} ](${decode(src)})`;
  });

  // 4) リンク → [text](href)
  s = s.replace(/<a[^>]*>[\s\S]*?<\/a>/gi, (full) => {
    const href = getAttr(full, "href");
    const text = full.replace(/<a[^>]*>/i, "").replace(/<\/a>/i, "");
    const label = inline(text);
    if (!href) return label;
    return `[${label}](${decode(href)})`;
  });

  // 5) 強調
  s = s
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, (m, _t, inner) => `**${inline(inner)}**`)
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, (m, _t, inner) => `*${inline(inner)}*`)
    .replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, (m, inner) => `_${inline(inner)}_`);

  // 6) 見出し
  s = s.replace(/<h([1-6])[^>]*>[\s\S]*?<\/h\1>/gi, (full, lvl) => {
    const inner = full.replace(/<h[1-6][^>]*>/i, "").replace(/<\/h[1-6]>/i, "");
    const hashes = "#".repeat(Math.max(1, Math.min(6, Number(lvl) || 1)));
    return `\n\n${hashes} ${inline(inner)}\n\n`;
  });

  // 7) 引用
  s = s.replace(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/gi, (blk) => {
    const inner = decode(stripTags(blk.replace(/<blockquote[^>]*>/i, "").replace(/<\/blockquote>/i, ""))).trim();
    return "\n\n" + inner.split(/\r?\n/).map((l) => "> " + l.trim()).join("\n") + "\n\n";
  });

  // 8) リスト
  s = s.replace(/<li[^>]*>[\s\S]*?<\/li>/gi, (li) => {
    const t = inline(li.replace(/<li[^>]*>/i, "").replace(/<\/li>/i, ""));
    if (!t) return "";
    return `\n- ${t}`;
  });
  s = s.replace(/<\/(ul|ol)>/gi, "\n\n").replace(/<(ul|ol)[^>]*>/gi, "\n\n");

  // 9) インラインコード（pre 以外）
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (m, inner) => `\`${inline(inner)}\``);

  // 10) 改行・段落
  s = s.replace(/<br\s*\/?\s*>/gi, "  \n");
  s = s.replace(/<p[^>]*>[\s\S]*?<\/p>/gi, (p) => `\n\n${inline(p.replace(/<p[^>]*>/i, "").replace(/<\/p>/i, ""))}\n\n`);

  // 11) テーブル（簡易・行を | で連結）
  s = s.replace(/<tr[^>]*>[\s\S]*?<\/tr>/gi, (tr) => {
    const cells = [];
    const row = tr
      .replace(/<th[^>]*>[\s\S]*?<\/th>/gi, (th) => { cells.push(inline(th.replace(/<th[^>]*>/i, "").replace(/<\/th>/i, ""))); return ""; })
      .replace(/<td[^>]*>[\s\S]*?<\/td>/gi, (td) => { cells.push(inline(td.replace(/<td[^>]*>/i, "").replace(/<\/td>/i, ""))); return ""; });
    if (cells.length === 0) return "";
    return "\n" + "| " + cells.join(" | ") + " |\n";
  });
  s = s.replace(/<table[^>]*>/gi, "\n\n").replace(/<\/table>/gi, "\n\n");

  // 12) 残りのタグを除去
  s = s.replace(/<[^>]+>/g, "");

  // 13) 退避した <pre> を復元（```lang ...```）
  s = s.replace(/\u0000PRE_BLOCK_(\d+)\u0000/g, (m, idxStr) => {
    const idx = Number(idxStr);
    const orig = preBlocks[idx] || "";
    const langMatch = orig.match(/class\s*=\s*(["'])[^"]*language-([^\s"']+)/i) || orig.match(/data-language\s*=\s*(["'])([^\1>]+)\1/i) || orig.match(/lang\s*=\s*(["'])([^\1>]+)\1/i);
    const lang = langMatch ? (langMatch[2] || "").trim() : "";
    let inner = orig.replace(/<pre[^>]*>/i, "").replace(/<\/pre>/i, "");
    inner = inner.replace(/<code[^>]*>/i, "").replace(/<\/code>/i, "");
    inner = inner.replace(/<br\s*\/?\s*>/gi, "\n");
    inner = decode(inner.replace(/<[^>]+>/g, ""));
    // フェンス内はそのまま
    const fence = "```" + (lang ? lang : "");
    return `\n\n${fence}\n${inner.trim()}\n\n\`\`\``.replace(/\\`\\`\\`$/, "```");
  });

  // 14) ホワイトスペース整形
  s = s.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+\n/g, "\n");
  return s.trim();
}

async function walkFilesRecursively(startDir) {
  const results = [];
  const stack = [startDir];
  while (stack.length) {
    const dir = stack.pop();
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) stack.push(full);
        else if (ent.isFile()) results.push(full);
      }
    } catch {
      // 読めないディレクトリはスキップ
    }
  }
  return results;
}

async function convertAllHtmlToMarkdownAndCleanup(baseDir, { deleteSourceNotes = false } = {}) {
  const all = await walkFilesRecursively(baseDir);
  const htmlFiles = all.filter((p) => p.toLowerCase().endsWith('.html'));
  const txtFiles = all.filter((p) => p.toLowerCase().endsWith('.txt'));

  // 1) HTML→MD 変換
  const htmlTasks = htmlFiles.map((htmlPath) => async () => {
    try {
      const html = await readFile(htmlPath, 'utf-8');
      const md = htmlToMarkdown(html);
      const mdPath = htmlPath.replace(/\.html$/i, '.md');
      await writeFile(mdPath, md, 'utf-8');
      // 変換できたら元の .html を削除
      await unlink(htmlPath).catch(() => {});
      // 付随する .txt があれば削除（rudimentary テキスト）
      const txtCandidate = htmlPath.replace(/\.html$/i, '.txt');
      if (existsSync(txtCandidate)) await unlink(txtCandidate).catch(() => {});
    } catch (e) {
      console.error('[cleanup] HTML→MD 変換失敗:', htmlPath, e.message);
    }
  });
  await runPool(htmlTasks, Math.max(2, Math.floor(MAX_CONCURRENCY / 2)));

  // 2) 余分な .txt を削除（source_url は残す）
  const txtTasks = txtFiles
    .filter((p) => deleteSourceNotes ? true : !p.toLowerCase().endsWith('.source_url.txt'))
    .map((p) => async () => {
      try {
        await unlink(p);
      } catch {
        /* noop */
      }
    });
  await runPool(txtTasks, Math.max(2, Math.floor(MAX_CONCURRENCY / 2)));
}

async function savePage(project, category, url, content, kind = "html") {
  const u = new URL(url);
  // ドメイン＋パスでファイル名を決める（長すぎる/重複はハッシュで回避）
  const base = sanitizeName(`${u.hostname}${u.pathname.replace(/\/$/, "") || "_root"}`);
  const name = base.length > 200 ? base.slice(0, 200) + "-" + sha1(base) : base;

  const dir = path.join(OUTPUT_DIR, project, category);
  await ensureDir(dir);

  if (kind === "html") {
    // 収集時点で Markdown で保存（後処理を軽くする）
    const md = htmlToMarkdown(content);
    await writeFile(path.join(dir, `${name}.md`), md, "utf-8");
  } else if (kind === "md") {
    await writeFile(path.join(dir, `${name}.md`), content, "utf-8");
  } else {
    await writeFile(path.join(dir, `${name}`), content, "utf-8");
  }
  // ソースURLをメモ
  await writeFile(path.join(dir, `${name}.source_url.txt`), url + "\n", "utf-8");
}

async function downloadHtml(project, url) {
  const html = await fetchText(url, { "User-Agent": "docs-collector/1.0" });
  const category = inferCategoryFromUrl(url);
  await savePage(project, category, url, html, "html");
}

async function collectFromLlmstxt(project, url) {
  const text = await fetchText(url, { "User-Agent": "docs-collector/1.0" });
  const urls = extractUrlsFromLlmstxt(text)
    // 明らかに外部の巨大APIリファレンス等を避けたい場合はここでフィルタ
    .filter(u => !/\/api\.python\.langchain\.com\/|\/js\.langchain\.com\/api\//.test(u) ? true : true);

  const tasks = urls.map(u => () => downloadHtml(project, u));
  await runPool(tasks, MAX_CONCURRENCY);
}

async function collectFromSitemap(project, url) {
  const xml = await fetchText(url, { "User-Agent": "docs-collector/1.0" });
  const urls = extractLocsFromSitemap(xml);
  const tasks = urls.map(u => () => downloadHtml(project, u));
  await runPool(tasks, MAX_CONCURRENCY);
}

// ---- GitHub 収集（Markdown/MDX をそのまま保存） ----
async function githubTree(owner, repo, branch) {
  const api = `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`;
  const headers = { "User-Agent": "docs-collector/1.0", "Accept": "application/vnd.github+json" };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  const json = JSON.parse(await fetchText(api, headers));
  if (!json.tree) throw new Error("Invalid GitHub tree response");
  return json.tree; // [{path, type, ...}, ...]
}

async function githubRaw(owner, repo, branch, filepath) {
  const raw = `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${filepath}`;
  const headers = { "User-Agent": "docs-collector/1.0" };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  return await fetchText(raw, headers);
}

async function collectFromGithub(project, { owner, name, branch, includeDirs }) {
  const tree = await githubTree(owner, name, branch);
  const targets = tree
    .filter(n => n.type === "blob")
    .filter(n => {
      // 指定ディレクトリ配下のみ
      if (includeDirs && includeDirs.length > 0) {
        if (!includeDirs.some(d => (d === "" ? true : n.path.startsWith(d + "/")))) return false;
      }
      // docs らしい拡張子のみ拾う
      return /\.(md|mdx|markdown|ipynb|txt)$/i.test(n.path);
    });

  const tasks = targets.map(n => async () => {
    const raw = await githubRaw(owner, name, branch, n.path);
    // カテゴリ推定はパス/ファイル名/親ディレクトリから
    const base = n.path.toLowerCase();
    let category = "misc";
    if (base.includes("/how_to") || base.includes("/how-to")) category = "how_to";
    else if (base.includes("/tutorial") || base.includes("/quickstart")) category = "tutorials";
    else if (base.includes("/concept")) category = "concepts";
    else if (base.includes("/reference") || base.includes("/api")) category = "api_reference";
    else if (base.includes("/observability")) category = "observability";
    else if (base.includes("/evaluation") || base.includes("/evaluator") || base.includes("/testing")) category = "evaluation";
    else if (base.includes("/prompt")) category = "prompt_engineering";

    // MD/MDX/その他を拡張子温存で保存
    const ext = path.extname(n.path) || "";
    const leaf = sanitizeName(n.path.replace(/\//g, "__"));
    const dir = path.join(OUTPUT_DIR, project, category);
    await ensureDir(dir);
    await writeFile(path.join(dir, `${leaf}${ext ? "" : ".md"}`), raw, "utf-8");
    const sourceNote = `github:${owner}/${name}@${branch}/${n.path}\n`;
    await writeFile(path.join(dir, `${leaf}.source_url.txt`), sourceNote, "utf-8");
  });

  await runPool(tasks, Math.max(2, Math.floor(MAX_CONCURRENCY / 2)));
}

// ---- 並列制御 ----
async function runPool(taskFns, concurrency) {
  const q = [...taskFns];
  let running = 0;
  let done = 0;
  const total = q.length;
  const errs = [];

  return new Promise((resolve) => {
    const next = () => {
      if (q.length === 0 && running === 0) return resolve({ done, total, errs });
      while (running < concurrency && q.length) {
        const fn = q.shift();
        running++;
        fn()
          .catch(e => { errs.push(e); })
          .finally(() => {
            running--;
            done++;
            if (done % 50 === 0) {
              console.log(`Progress: ${done}/${total}`);
            }
            next();
          });
      }
    };
    next();
  });
}

// ---- 実行 ----
(async () => {
  await ensureDir(OUTPUT_DIR);
  const manifestPath = path.join(OUTPUT_DIR, "manifest.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, "utf-8")) : { runs: [] };

  for (const src of SOURCES) {
    const startedAt = new Date().toISOString();
    console.log(`\n=== Collect from ${src.type} :: ${src.project} ===`);
    try {
      if (src.type === "llms")       await collectFromLlmstxt(src.project, src.url);
      else if (src.type === "sitemap") await collectFromSitemap(src.project, src.url);
      else if (src.type === "github")  await collectFromGithub(src.project, src.repo);
      else throw new Error(`Unknown source type: ${src.type}`);

      manifest.runs.push({ source: src, ok: true, startedAt, finishedAt: new Date().toISOString() });
    } catch (e) {
      console.error(`[ERROR] ${src.project} (${src.type}):`, e.message);
      manifest.runs.push({ source: src, ok: false, error: e.message, startedAt, finishedAt: new Date().toISOString() });
    }
    // 小休止（礼儀）
    await sleep(250);
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  if (!NO_CLEANUP) {
    console.log("\n=== Post-process: Convert HTML to Markdown & cleanup .txt ===");
    await convertAllHtmlToMarkdownAndCleanup(OUTPUT_DIR, { deleteSourceNotes: PURGE_SOURCES });
  } else {
    console.log("\n[skip] Post-process cleanup is disabled by --no-cleanup");
  }

  console.log(`\nDone. Output -> ${path.resolve(OUTPUT_DIR)}`);
})();
