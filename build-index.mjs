// build-index.mjs
// Node 18+ / 外部依存なしで、Markdownをチャンク化してBM25インデックスを構築・検索するツール。
// - インデックス構築:   node build-index.mjs build [--output-dir collected_docs] [--pretty]
// - 検索:               node build-index.mjs search "query" [--topk 10] [--project x] [--category y] [--output-dir collected_docs]

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUTPUT_DIR = process.env.OUTPUT_DIR || "collected_docs";
const DEFAULT_INDEX_DIR_NAME = "_index";
const DEFAULT_EMBED_MODEL = process.env.EMBED_MODEL || "Xenova/all-MiniLM-L6-v2"; // 384-dim sentence embeddings

// ---------------- CLI ----------------
const ARGV = process.argv.slice(2);
const CMD = ARGV[0] || "help";

function parseFlags(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.includes("=") ? a.split("=", 2) : [a, null];
      const key = k.replace(/^--/, "");
      if (v != null) out[key] = v;
      else {
        const nxt = argv[i + 1];
        if (nxt && !nxt.startsWith("--")) { out[key] = nxt; i++; }
        else out[key] = true;
      }
    } else {
      out._.push(a);
    }
  }
  return out;
}

const FLAGS = parseFlags(ARGV.slice(1));
const INDEX_OUTPUT_DIR = path.join(FLAGS["output-dir"] || OUTPUT_DIR, DEFAULT_INDEX_DIR_NAME);
const PRETTY = Boolean(FLAGS.pretty);
const WITH_EMBEDDINGS = Boolean(FLAGS["with-embeddings"] || FLAGS.withEmbeddings);

// ---------------- 小ユーティリティ ----------------
async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

function isMarkdownFile(filePath) {
  const lower = filePath.toLowerCase();
  return lower.endsWith(".md") || lower.endsWith(".markdown") || lower.endsWith(".mdx");
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

function normalizeWhitespace(s) {
  // NOTE: 検索用の正規化に使用していたが、表示テキストは原文を保持したい。
  //       以降、インデックス用トークン化には影響しないため、
  //       表示用テキストにはこの関数を適用しない。
  return s.replace(/[\t\r]+/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ---------------- トークナイザ & 停止語 ----------------
const STOPWORDS = new Set([
  "a","an","the","and","or","but","if","then","else","when","so","of","to","in","on","for","by","with",
  "as","is","are","was","were","be","been","being","at","from","that","this","these","those","it","its",
  "we","you","they","he","she","i","me","my","our","your","their","them","his","her","not","no","yes",
  "do","does","did","can","could","should","would","will","shall","may","might","must","have","has","had",
  "about","into","over","under","again","further","then","once","here","there","all","any","both","each",
  "few","more","most","other","some","such","only","own","same","than","too","very"
]);

function tokenize(text) {
  if (!text) return [];
  const lowered = text.toLowerCase();
  const tokens = lowered.split(/[^a-z0-9]+/).filter(Boolean);
  return tokens.filter(t => !STOPWORDS.has(t));
}

// ---------------- Embeddings（Transformers.js を動的ロード） ----------------
let _embedExtractor = null;
async function getEmbedExtractor(modelName = DEFAULT_EMBED_MODEL) {
  if (_embedExtractor) return _embedExtractor;
  const { pipeline } = await import("@xenova/transformers");
  _embedExtractor = await pipeline("feature-extraction", modelName);
  return _embedExtractor;
}

async function embedTexts(texts, { model = DEFAULT_EMBED_MODEL } = {}) {
  const extractor = await getEmbedExtractor(model);
  const res = await extractor(texts, { pooling: "mean", normalize: true });
  // res 形式へ柔軟対応
  if (Array.isArray(res)) {
    // 既に配列ベクトル
    return res.map(r => (Array.isArray(r) ? r : r.data || r.tolist?.() || r));
  }
  if (res?.data && res?.dims) {
    const dims = res.dims;
    const data = Array.from(res.data);
    if (dims.length === 1) return [data];
    if (dims.length === 2) {
      const [batch, hidden] = dims;
      const out = [];
      for (let i = 0; i < batch; i++) out.push(data.slice(i * hidden, (i + 1) * hidden));
      return out;
    }
  }
  // フォールバック
  if (res?.tolist) return res.tolist();
  if (res && typeof res === "object") return Object.values(res);
  return res;
}

// ---------------- Markdown チャンク化 ----------------
const DEFAULT_CHUNK_TOKENS = Number(process.env.CHUNK_TOKENS || 400);
const DEFAULT_OVERLAP_TOKENS = Number(process.env.OVERLAP_TOKENS || 60);

function splitMarkdownIntoSections(md) {
  // 見出しを拾いながらセクションに分割（優先: h2/h3）。
  const lines = md.split(/\r?\n/);
  const sections = [];
  let current = { headingPath: [], content: [] };
  let currentHeadingPath = [];

  function pushCurrent() {
    if (current.content.length > 0) {
      sections.push({ headingPath: [...current.headingPath], text: current.content.join("\n").trim() });
    }
    current = { headingPath: [...currentHeadingPath], content: [] };
  }

  for (const line of lines) {
    const m = line.match(/^\s*(#{1,6})\s+(.+?)\s*$/);
    if (m) {
      const level = m[1].length;
      const title = m[2].trim();
      if (level <= 2 && current.content.length > 0) pushCurrent();
      currentHeadingPath = updateHeadingPath(currentHeadingPath, level, title);
      current.content.push(line);
    } else {
      current.content.push(line);
    }
  }
  pushCurrent();
  return sections.filter(s => s.text);
}

function updateHeadingPath(pathArr, level, title) {
  const next = [...pathArr];
  const idx = Math.max(0, level - 1);
  next.length = idx; // levelに応じて切り詰め
  next[idx] = title;
  return next;
}

// チャンクは原文サブストリングで保持しつつ、ウィンドウ幅の判定は単語境界で行う
function windowedChunksByTokens(text, maxTokens = DEFAULT_CHUNK_TOKENS, overlap = DEFAULT_OVERLAP_TOKENS) {
  // ウィンドウ判定用: 停止語を含めた素の単語トークンとその位置を抽出
  const wordMatches = [];
  const re = /[a-z0-9]+/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    wordMatches.push({ start: m.index, end: m.index + m[0].length });
  }

  if (wordMatches.length === 0) {
    return [{ text, tokenCount: tokenize(text).length }];
  }

  const stride = Math.max(1, maxTokens - overlap);
  const chunks = [];
  for (let startIdx = 0; startIdx < wordMatches.length; startIdx += stride) {
    const endIdx = Math.min(wordMatches.length - 1, startIdx + maxTokens - 1);
    const charStart = wordMatches[startIdx].start;
    const charEnd = wordMatches[endIdx].end;
    const substr = text.slice(charStart, charEnd);
    const tokenCount = tokenize(substr).length; // 検索用トークン数（停止語除去）
    chunks.push({ text: substr, tokenCount });
    if (endIdx >= wordMatches.length - 1) break;
  }
  return chunks;
}

function chunkMarkdown(md, opts = {}) {
  const maxTokens = Number(opts.maxTokens || DEFAULT_CHUNK_TOKENS);
  const overlap = Number(opts.overlap || DEFAULT_OVERLAP_TOKENS);
  const sections = splitMarkdownIntoSections(md);
  const out = [];
  for (const sec of sections) {
    const chunks = windowedChunksByTokens(sec.text, maxTokens, overlap);
    for (const ch of chunks) {
      out.push({ headingPath: sec.headingPath, text: ch.text, tokenCount: ch.tokenCount });
    }
  }
  // セクション検出ができなかった場合は全文で
  if (out.length === 0) {
    const chunks = windowedChunksByTokens(md, maxTokens, overlap);
    for (const ch of chunks) out.push({ headingPath: [], text: ch.text, tokenCount: ch.tokenCount });
  }
  return out;
}

// ---------------- メタデータ抽出 ----------------
function inferProjectCategoryFromPath(mdPath) {
  // <OUTPUT_DIR>/<project>/<category>/.../file.md を想定
  const rel = path.relative(OUTPUT_DIR, mdPath).replace(/\\/g, "/");
  const segs = rel.split("/");
  const project = segs[0] || "unknown";
  const category = segs[1] || "misc";
  return { project, category, relPath: rel };
}

async function readSourceUrlSidecar(mdPath) {
  const base = mdPath.replace(/\.(md|markdown|mdx)$/i, "");
  const sidecar = base + ".source_url.txt";
  if (!existsSync(sidecar)) return null;
  try {
    const s = await readFile(sidecar, "utf-8");
    return s.trim() || null;
  } catch {
    return null;
  }
}

function extractTitleAndHeadings(md) {
  const lines = md.split(/\r?\n/);
  let title = null;
  const headings = [];
  for (const line of lines) {
    const m = line.match(/^\s*(#{1,6})\s+(.+?)\s*$/);
    if (m) {
      const level = m[1].length;
      const text = m[2].trim();
      if (level === 1 && !title) title = text;
      if (level === 2) headings.push(text);
    }
  }
  return { title: title || headings[0] || null, headings };
}

// ---------------- BM25 インデックス ----------------
function buildBm25IndexFromDocs(docs) {
  // docs: [{ id, text, ...meta, tokenFreq: Map, length: number }]
  const postings = new Map(); // term -> Array<[docId, tf]>
  let totalLen = 0;
  for (const d of docs) {
    totalLen += d.length;
    for (const [term, tf] of d.tokenFreq.entries()) {
      if (!postings.has(term)) postings.set(term, []);
      postings.get(term).push([d.id, tf]);
    }
  }
  const N = docs.length;
  const avgdl = N ? totalLen / N : 0;
  const df = Object.fromEntries([...postings.entries()].map(([t, arr]) => [t, arr.length]));
  return { N, avgdl, postings: mapToObjectOfArrays(postings), df };
}

function mapToObjectOfArrays(m) {
  const o = {};
  for (const [k, v] of m.entries()) o[k] = v;
  return o;
}

function computeIdf(N, df) {
  // Okapi BM25 idf: log(1 + (N - df + 0.5) / (df + 0.5))
  return Math.log(1 + (N - df + 0.5) / (df + 0.5));
}

function scoreBm25(query, index, docLengths, k1 = 1.2, b = 0.75) {
  const qTokens = tokenize(query);
  const scores = new Map();
  for (const term of qTokens) {
    const plist = index.postings[term];
    if (!plist) continue;
    const idf = computeIdf(index.N, index.df[term] || 0);
    for (const [docId, tf] of plist) {
      const dl = docLengths[docId] || 0;
      const denom = tf + k1 * (1 - b + b * (dl / (index.avgdl || 1)));
      const s = idf * (tf * (k1 + 1)) / (denom || 1);
      scores.set(docId, (scores.get(docId) || 0) + s);
    }
  }
  return scores;
}

// ---------------- ビルド/検索 実装 ----------------
async function buildIndex({ outputDir = OUTPUT_DIR, indexDir = INDEX_OUTPUT_DIR, pretty = false } = {}) {
  const allFiles = await walkFilesRecursively(outputDir);
  const mdFiles = allFiles.filter(isMarkdownFile);

  const docs = [];
  let docId = 0;
  for (const mdPath of mdFiles) {
    const md = await readFile(mdPath, "utf-8");
    const { title, headings } = extractTitleAndHeadings(md);
    const { project, category, relPath } = inferProjectCategoryFromPath(mdPath);
    const sourceUrl = await readSourceUrlSidecar(mdPath);
    const chunks = chunkMarkdown(md);
    for (const ch of chunks) {
      const text = ch.text; // 原文保持
      const toks = tokenize(text); // 検索用トークンは正規化・停止語除去
      const tokenFreq = new Map();
      for (const t of toks) tokenFreq.set(t, (tokenFreq.get(t) || 0) + 1);
      const length = toks.length;
      docs.push({
        id: docId,
        project,
        category,
        relPath,
        title,
        headings,
        headingPath: ch.headingPath,
        sourceUrl,
        text,
        length,
        tokenFreq
      });
      docId++;
    }
  }

  const docLengths = [];
  for (const d of docs) docLengths[d.id] = d.length;

  const bm25 = buildBm25IndexFromDocs(docs);

  // JSON へシリアライズ（tokenFreqは落とす）
  const serializableDocs = docs.map(d => ({
    id: d.id,
    project: d.project,
    category: d.category,
    relPath: d.relPath,
    title: d.title,
    headings: d.headings,
    headingPath: d.headingPath,
    sourceUrl: d.sourceUrl,
    text: d.text,
    length: d.length
  }));

  const indexPayload = {
    version: 1,
    builtAt: new Date().toISOString(),
    N: bm25.N,
    avgdl: bm25.avgdl,
    df: bm25.df,
    postings: bm25.postings, // term -> [ [docId, tf], ... ]
    docLengths,
    docs: serializableDocs
  };

  await ensureDir(indexDir);
  const filePath = path.join(indexDir, "bm25_index.json");
  await writeFile(filePath, JSON.stringify(indexPayload, null, pretty ? 2 : 0), "utf-8");
  console.log(`Index built: ${filePath}`);
}

async function buildEmbeddings({ indexDir = INDEX_OUTPUT_DIR, model = DEFAULT_EMBED_MODEL, batchSize = Number(FLAGS.embedBatch || 16), project, category, limit } = {}) {
  const idxPath = path.join(indexDir, "bm25_index.json");
  if (!existsSync(idxPath)) {
    console.error(`Index not found: ${idxPath}\nPlease run: node build-index.mjs build`);
    process.exit(1);
  }
  const raw = await readFile(idxPath, "utf-8");
  const idx = JSON.parse(raw);

  // フィルタ対象のdocIdリストを作成
  let docIds = idx.docs.map(d => d.id);
  if (project || category) {
    docIds = docIds.filter(id => {
      const d = idx.docs[id];
      if (!d) return false;
      if (project && d.project !== project) return false;
      if (category && d.category !== category) return false;
      return true;
    });
  }
  if (limit) docIds = docIds.slice(0, Number(limit));

  console.log(`Embedding ${docIds.length} chunks using model: ${model}`);
  const texts = docIds.map(id => idx.docs[id]?.text || "");

  const vectors = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const embs = await embedTexts(batch, { model });
    for (const v of embs) vectors.push(v);
    if (i % (batchSize * 10) === 0) console.log(`  embedded: ${Math.min(i + batch.length, texts.length)}/${texts.length}`);
  }

  // 保存（JSON: docIdsと並行配列）
  const embPath = path.join(indexDir, "embeddings.json");
  const meta = { model, dims: vectors[0]?.length || 0, count: vectors.length };
  const payload = { version: 1, builtAt: new Date().toISOString(), ...meta, docIds, vectors };
  await writeFile(embPath, JSON.stringify(payload), "utf-8");
  console.log(`Embeddings built: ${embPath}`);
}

async function searchCli(query, { outputDir = OUTPUT_DIR, indexDir = INDEX_OUTPUT_DIR, topk = 10, project, category, hybrid = false, alpha = 0.6, bm25_k = 50, vector_only = false, model = DEFAULT_EMBED_MODEL } = {}) {
  const filePath = path.join(indexDir, "bm25_index.json");
  if (!existsSync(filePath)) {
    console.error(`Index not found: ${filePath}\nPlease run: node build-index.mjs build`);
    process.exit(1);
  }
  const raw = await readFile(filePath, "utf-8");
  const idx = JSON.parse(raw);

  // ----- BM25 スコア -----
  let bm25Scores = null;
  if (!vector_only) {
    bm25Scores = scoreBm25(query, idx, idx.docLengths);
  }

  // まずBM25上位候補を抽出（vector_onlyなら空）
  let bm25Candidates = [];
  if (bm25Scores) {
    let temp = [...bm25Scores.entries()].map(([docId, score]) => ({ docId: Number(docId), score }));
    // メタデータフィルタ
    if (project || category) {
      temp = temp.filter(r => {
        const d = idx.docs[r.docId];
        if (!d) return false;
        if (project && d.project !== project) return false;
        if (category && d.category !== category) return false;
        return true;
      });
    }
    temp.sort((a, b) => b.score - a.score);
    bm25Candidates = temp.slice(0, Number(bm25_k) || 50).map(x => x.docId);
  }

  if (!hybrid && !vector_only) {
    // BM25のみ
    const top = [...bm25Scores.entries()].map(([docId, score]) => ({ docId: Number(docId), score }))
      .filter(r => {
        const d = idx.docs[r.docId];
        if (!d) return false;
        if (project && d.project !== project) return false;
        if (category && d.category !== category) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(topk) || 10);
    return printResults(top, idx);
  }

  // ----- ベクトル検索（hybrid または vector_only） -----
  const embPath = path.join(indexDir, "embeddings.json");
  if (!existsSync(embPath)) {
    console.error(`Embeddings not found: ${embPath}\nPlease run: node build-index.mjs build --with-embeddings`);
    process.exit(1);
  }
  const embRaw = await readFile(embPath, "utf-8");
  const embIdx = JSON.parse(embRaw);
  const idToVec = new Map();
  for (let i = 0; i < embIdx.docIds.length; i++) idToVec.set(embIdx.docIds[i], embIdx.vectors[i]);

  // クエリ埋め込み
  const [qVec] = await embedTexts([query], { model });

  // 候補セット
  let candidateIds = vector_only ? embIdx.docIds.slice() : bm25Candidates.filter(id => idToVec.has(id));
  if (project || category) {
    candidateIds = candidateIds.filter(id => {
      const d = idx.docs[id];
      if (!d) return false;
      if (project && d.project !== project) return false;
      if (category && d.category !== category) return false;
      return true;
    });
  }

  // 類似度（ベクトルは正規化済みを想定 → ドット積=コサイン類似）
  const vecScores = new Map();
  for (const id of candidateIds) {
    const v = idToVec.get(id);
    let dot = 0;
    for (let i = 0; i < Math.min(v.length, qVec.length); i++) dot += v[i] * qVec[i];
    vecScores.set(id, dot);
  }

  if (vector_only) {
    const top = [...vecScores.entries()].map(([docId, score]) => ({ docId, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(topk) || 10);
    return printResults(top, idx);
  }

  // ハイブリッド: スコア正規化して線形結合
  const bm25Sub = new Map();
  for (const id of candidateIds) bm25Sub.set(id, bm25Scores.get(id) || 0);
  const bm25Norm = minMaxNormalize(bm25Sub);
  const vecNorm = minMaxNormalize(vecScores);
  const final = [];
  for (const id of candidateIds) {
    const s = alpha * (bm25Norm.get(id) || 0) + (1 - alpha) * (vecNorm.get(id) || 0);
    final.push({ docId: id, score: s });
  }
  final.sort((a, b) => b.score - a.score);
  return printResults(final.slice(0, Number(topk) || 10), idx);
}

function minMaxNormalize(map) {
  const values = [...map.values()];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const out = new Map();
  if (!isFinite(min) || !isFinite(max) || max === min) {
    for (const [k, v] of map.entries()) out.set(k, 0.5); // 変化なし → 中央に寄せる
    return out;
  }
  for (const [k, v] of map.entries()) out.set(k, (v - min) / (max - min));
  return out;
}

function printResults(results, idx) {
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const d = idx.docs[r.docId];
    if (!d) continue;
    const snippet = d.text.length > 240 ? d.text.slice(0, 240) + "…" : d.text;
    console.log(`${i + 1}. [${r.score.toFixed(4)}] ${d.project}/${d.category} :: ${d.title || d.relPath}`);
    if (d.sourceUrl) console.log(`   source: ${d.sourceUrl}`);
    console.log(`   path: ${d.relPath}`);
    console.log(`   snippet: ${snippet}`);
  }
}

function printHelp() {
  console.log(`Usage:\n  node build-index.mjs build [--output-dir DIR] [--pretty]\n  node build-index.mjs search "query" [--topk 10] [--project NAME] [--category NAME] [--output-dir DIR]\n`);
}

// ---------------- エントリポイント ----------------
(async () => {
  if (CMD === "build") {
    await ensureDir(OUTPUT_DIR);
    await buildIndex({ outputDir: FLAGS["output-dir"] || OUTPUT_DIR, indexDir: INDEX_OUTPUT_DIR, pretty: PRETTY });
    if (WITH_EMBEDDINGS) {
      await buildEmbeddings({
        indexDir: INDEX_OUTPUT_DIR,
        model: FLAGS.model || DEFAULT_EMBED_MODEL,
        batchSize: Number(FLAGS.embedBatch || 16),
        project: FLAGS.project,
        category: FLAGS.category,
        limit: FLAGS["embed-limit"] || FLAGS.embedLimit
      });
    }
  } else if (CMD === "search") {
    const q = FLAGS._[0];
    if (!q) { console.error("query is required"); process.exit(1); }
    await searchCli(q, {
      outputDir: FLAGS["output-dir"] || OUTPUT_DIR,
      indexDir: INDEX_OUTPUT_DIR,
      topk: Number(FLAGS.topk || 10),
      project: FLAGS.project,
      category: FLAGS.category,
      hybrid: Boolean(FLAGS.hybrid),
      alpha: Number(FLAGS.alpha || 0.6),
      bm25_k: Number(FLAGS.bm25_k || FLAGS.bm25K || 50),
      vector_only: Boolean(FLAGS["vector-only"] || FLAGS.vectorOnly),
      model: FLAGS.model || DEFAULT_EMBED_MODEL
    });
  } else if (CMD === "build-embeddings" || CMD === "embeddings") {
    await buildEmbeddings({
      indexDir: INDEX_OUTPUT_DIR,
      model: FLAGS.model || DEFAULT_EMBED_MODEL,
      batchSize: Number(FLAGS.embedBatch || 16),
      project: FLAGS.project,
      category: FLAGS.category,
      limit: FLAGS["embed-limit"] || FLAGS.embedLimit
    });
  } else {
    printHelp();
  }
})();


