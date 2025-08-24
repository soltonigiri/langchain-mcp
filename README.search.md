### LangChain ドキュメント検索ガイド（BM25 + ベクトル ハイブリッド）

このリポジトリは、収集済みの LangChain 系ドキュメント（Markdown）からインデックスを構築し、コマンドラインで高速に検索するためのツール群を提供します。検索は以下をサポートします。

- BM25（キーワード）検索
- ベクトル埋め込みによる意味検索
- 両者を組み合わせたハイブリッド検索（推奨）

本ガイドでは、実行コマンド、主要フラグ、チューニングの要点をまとめます。

---

### 前提

- Node.js 18+（ESM）
- 収集済みMarkdownは既定で `collected_docs/` 配下に存在
- インデックス出力先は `collected_docs/_index/`

任意の環境変数/既定値:

- `OUTPUT_DIR`（既定: `collected_docs`）
- `CHUNK_TOKENS`（既定: 400）
- `OVERLAP_TOKENS`（既定: 60）

チャンクは「原文Markdownを保持」したまま作成されます（スニペットの可読性向上）。

---

### インデックスの作成

BM25のみ（まずはこれでOK）

```bash
node build-index.mjs build --pretty
```

BM25 + 埋め込みを同時に構築（初回はモデルDLあり）

```bash
node build-index.mjs build --pretty --with-embeddings [--model Xenova/all-MiniLM-L6-v2] [--embedBatch 16] [--project langchain-js] [--category how_to]
```

埋め込みを後から個別に作成/更新したい場合:

```bash
node build-index.mjs build-embeddings [--model Xenova/all-MiniLM-L6-v2] [--embedBatch 16] [--project ...] [--category ...] [--embed-limit 10000]
```

出力ファイル:

- `collected_docs/_index/bm25_index.json`（BM25インデックス）
- `collected_docs/_index/embeddings.json`（ベクトル埋め込み）

---

### 検索の使い方

基本（BM25のみ）

```bash
node build-index.mjs search "your query" --topk 10 [--project langchain-js] [--category how_to]
```

ハイブリッド（BM25 + ベクトル、推奨）

```bash
node build-index.mjs search "your query" --hybrid --alpha 0.6 --topk 10 \
  [--project langchain-js] [--category how_to] [--bm25_k 50] [--model Xenova/all-MiniLM-L6-v2]
```

- `--alpha`: BM25 と ベクトルの重み（0.0〜1.0、既定 0.6）。上げるほどキーワード寄り、下げるほど意味類似寄り。
- `--bm25_k`: ハイブリッド時のBM25候補幅（既定 50）。

ベクトルのみ（意味検索の挙動を単独で確認したい場合）

```bash
node build-index.mjs search "your query" --vector-only --topk 10 [--model Xenova/all-MiniLM-L6-v2]
```

出力形式（例）:

```
1. [0.8986] langchain-js/how_to :: Key features
   source: https://js.langchain.com/docs/how_to/
   path: langchain-js/how_to/js.langchain.com_docs_how_to.md
   snippet: ...（原文Markdownの先頭〜240文字を表示）
```

- `score`: ランキング用スコア（BM25 or ハイブリッド/ベクトル）。
- `project/category`: ドキュメントの所属。
- `source`: もし `.source_url.txt` が存在すれば元URLを表示。
- `path`: リポジトリ内の相対パス。
- `snippet`: 原文の一部（コード等もMarkdownのまま保持）。

---

### 実行例

BM25 検索（RAG/リトリーバー関連）

```bash
node build-index.mjs search "RAG retriever vectorstores" --topk 5 --project langchain-js
```

ハイブリッド検索（LangSmith/トレーシング関連）

```bash
node build-index.mjs search "LangSmith tracing observability" --hybrid --alpha 0.6 --topk 5 --project langchain-python
```

エージェント/ツール呼び出し（ハイブリッド）

```bash
node build-index.mjs search "tool calling agents" --hybrid --alpha 0.6 --topk 5 --project langchain-js
```

---

### チューニングのポイント

- `--alpha`: 0.4〜0.7 で調整。曖昧検索を強くしたい場合は低め（0.4付近）。
- チャンクサイズ: `CHUNK_TOKENS`（既定 400）、オーバーラップ `OVERLAP_TOKENS`（既定 60）。
- 埋め込みモデル: 既定は `Xenova/all-MiniLM-L6-v2`（軽量・高速）。精度を重視したい場合は別モデルに切替も可。
- バッチ: `--embedBatch`（メモリ状況に合わせて増減）。

---

### トラブルシューティング

- `Index not found`: `node build-index.mjs build --pretty` を先に実行。
- `Embeddings not found`: `node build-index.mjs build --with-embeddings` または `node build-index.mjs build-embeddings` を実行。
- `Cannot find module '@xenova/transformers'`: `npm i @xenova/transformers` を実行。
- メモリ不足: `--embedBatch` を小さく、または `--project/--category` でスコープを絞る、`--embed-limit` を使用。
- 初回ダウンロードが長い: モデルの初回DLが走ります。2回目以降は高速化します。

---

### 設計メモ（概要）

- Markdown を見出し単位でセクション化後、トークン窓で分割（原文保持）。
- BM25 用インデックス: `bm25_index.json` に DF/ポスティング/メタ/文書長を格納。
- ベクトル用: `embeddings.json` に `docIds` と `vectors` を保存（正規化済みベクトル前提）。
- ハイブリッド: BM25上位候補に対し、クエリ埋め込みとのコサイン類似で再スコア、`alpha` で重み付け。

---

### 参考

- Transformers.js Pipelines（埋め込み生成）: [https://huggingface.co/docs/transformers.js/en/api/pipelines](https://huggingface.co/docs/transformers.js/en/api/pipelines)
- Transformers.js Releases（埋め込み例）: [https://github.com/xenova/transformers.js/releases](https://github.com/xenova/transformers.js/releases)
- モデル例: `Xenova/all-MiniLM-L6-v2`（Hugging Face）: [https://huggingface.co/Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2)


