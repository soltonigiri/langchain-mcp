### LangChain Docs Indexer / Searcher

LangChain / LangGraph / LangSmith 系の公式ドキュメントをローカルに収集し、Markdownへ正規化した上で、BM25 と ベクトル埋め込みのハイブリッド検索で高速に参照できるようにするプロジェクトです。開発AIエージェントの RAG 基盤として、そのまま利用できます。

---

### 採用技術

- Node.js 18+（ESM）
- 収集/正規化:
  - HTML → Markdown 変換（独自実装）
  - ディレクトリ再帰走査、I/O（`fs/promises`）
- インデックス:
  - BM25（Okapi BM25）による転置インデックス
  - Markdown チャンク化（見出しベース + トークン窓、原文保持）
  - メタデータ抽出（`project/category/relPath/title/headings/sourceUrl`）
- 意味検索:
  - `@xenova/transformers` によるローカル埋め込み（既定: `Xenova/all-MiniLM-L6-v2`）
  - 正規化済みベクトル（コサイン類似）
- ハイブリッド:
  - BM25 上位候補に対してベクトル類似を計算し、`alpha` で線形結合

---

### ディレクトリ構成（抜粋）

- `collect-docs.mjs`: 収集・HTML→Markdown変換・後処理（HTML/TXTクリーンアップ）
- `build-index.mjs`: インデックス構築/検索CLI（BM25・ベクトル・ハイブリッド）
- `collected_docs/`: 収集済みMarkdown
  - `<project>/<category>/.../*.md`
  - `_index/bm25_index.json`（BM25インデックス）
  - `_index/embeddings.json`（埋め込み）
- `README.search.md`: 検索の使い方（詳細）

---

### 仕組み（アーキテクチャ）

1) 収集・正規化
- サイトマップ/URL群から取得した HTML を `htmlToMarkdown` で Markdown に正規化
- 既存の `.html` を一括変換 → `.html`/`.txt` をクリーンアップ
- 収集した Markdown は 
  `collected_docs/<project>/<category>/...` に保存（同名 `.source_url.txt` で元URL保持）

2) チャンク化
- Markdown を見出し単位に分割（主に H1/H2 を境界）
- さらに単語ベースのウィンドウで分割（既定: 400 tokens, 60 tokens overlap）
- 表示用テキストは「原文サブストリング」を保持（コード/表も可読）

3) インデックス（BM25）
- 各チャンクをトークナイズ（英数・小文字化・停止語除去）
- `postings(term -> [docId, tf])` と `df`, `N`, `avgdl`, `docLengths` を構築
- JSON にシリアライズして `_index/bm25_index.json` に保存

4) 埋め込み
- `@xenova/transformers` の `pipeline('feature-extraction')` を用い、mean pooling + normalize
- クエリ/チャンクとも正規化ベクトルにし、内積=コサイン類似
- `embeddings.json` に `docIds` と `vectors` を保存

5) 検索
- BM25のみ: BM25スコア降順で上位を返却
- ベクトルのみ: コサイン類似降順で上位を返却
- ハイブリッド: BM25上位K（既定50）を候補集合とし、
  - `score = alpha * bm25_norm + (1 - alpha) * vec_norm`
  - min-max 正規化でスケール整合
  - `alpha` 既定 0.6（0.4〜0.7で調整）

---

### 使い方（要約）

1) インデックス構築

```bash
node build-index.mjs build --pretty --with-embeddings
```

2) 検索（推奨: ハイブリッド）

```bash
node build-index.mjs search "your query" --hybrid --alpha 0.6 --topk 10 [--project ...] [--category ...]
```

詳細は `README.search.md` を参照。

---

### 設計上の意図

- 参照可能性: 原文保持スニペットで「LLM/人間の両者」が読みやすい
- 再現性/根拠: `sourceUrl` や `path` を必ず返す（幻覚対策）
- 拡張性: ベクトルモデル差し替え、MMR/再ランク等の導入が容易
- パフォーマンス: BM25で候補を絞ってからベクトル計算（高速/軽量）

---

### 今後の拡張例

- タイトル/H2出現語のブースト、MMR（冗長性抑制）
- 小型クロスエンコーダで最終再ランク
- HTTP ラッパー（`/search?q=...`）の提供、JSON 応答
- CI キャッシュ・部分再構築（プロジェクト/カテゴリ単位）


