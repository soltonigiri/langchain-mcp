How to cache embedding results | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to cache embedding resultsPrerequisitesThis guide assumes familiarity with the following concepts:Embeddings](/docs/concepts/embedding_models)Embeddings can be stored or temporarily cached to avoid needing to recompute them.Caching embeddings can be done using a CacheBackedEmbeddings instance.The cache backed embedder is a wrapper around an embedder that caches embeddings in a key-value store.The text is hashed and the hash is used as the key in the cache.The main supported way to initialized a CacheBackedEmbeddings is the fromBytesStore static method. This takes in the following parameters:underlyingEmbeddings: The embeddings model to use.documentEmbeddingCache: The cache to use for storing document embeddings.namespace: (optional, defaults to "") The namespace to use for document cache. This namespace is used to avoid collisions with other caches. For example, you could set it to the name of the embedding model used.Attention:** Be sure to set the namespace parameter to avoid collisions of the same text embedded using different embeddings models. ## In-memory[​](#in-memory) tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- Yarn
- pnpm

```bash
npm install @langchain/openai @langchain/community @langchain/core

```

```bash
yarn add @langchain/openai @langchain/community @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/community @langchain/core

```Here&#x27;s a basic test example with an in memory cache. This type of cache is primarily useful for unit tests or prototyping. Do not use this cache if you need to actually store the embeddings for an extended period of time:

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { CacheBackedEmbeddings } from "langchain/embeddings/cache_backed";
import { InMemoryStore } from "@langchain/core/stores";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { TextLoader } from "langchain/document_loaders/fs/text";

const underlyingEmbeddings = new OpenAIEmbeddings();

const inMemoryStore = new InMemoryStore();

const cacheBackedEmbeddings = CacheBackedEmbeddings.fromBytesStore(
  underlyingEmbeddings,
  inMemoryStore,
  {
    namespace: underlyingEmbeddings.model,
  }
);

const loader = new TextLoader("./state_of_the_union.txt");
const rawDocuments = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0,
});
const documents = await splitter.splitDocuments(rawDocuments);

// No keys logged yet since the cache is empty
for await (const key of inMemoryStore.yieldKeys()) {
  console.log(key);
}

let time = Date.now();
const vectorstore = await FaissStore.fromDocuments(
  documents,
  cacheBackedEmbeddings
);
console.log(`Initial creation time: ${Date.now() - time}ms`);
/*
  Initial creation time: 1905ms
*/

// The second time is much faster since the embeddings for the input docs have already been added to the cache
time = Date.now();
const vectorstore2 = await FaissStore.fromDocuments(
  documents,
  cacheBackedEmbeddings
);
console.log(`Cached creation time: ${Date.now() - time}ms`);
/*
  Cached creation time: 8ms
*/

// Many keys logged with hashed values
const keys = [];
for await (const key of inMemoryStore.yieldKeys()) {
  keys.push(key);
}

console.log(keys.slice(0, 5));
/*
  [
    &#x27;text-embedding-ada-002ea9b59e760e64bec6ee9097b5a06b0d91cb3ab64&#x27;,
    &#x27;text-embedding-ada-0023b424f5ed1271a6f5601add17c1b58b7c992772e&#x27;,
    &#x27;text-embedding-ada-002fec5d021611e1527297c5e8f485876ea82dcb111&#x27;,
    &#x27;text-embedding-ada-00262f72e0c2d711c6b861714ee624b28af639fdb13&#x27;,
    &#x27;text-embedding-ada-00262d58882330038a4e6e25ea69a938f4391541874&#x27;
  ]
*/

```

#### API Reference: - OpenAIEmbeddings from @langchain/openai - CacheBackedEmbeddings from langchain/embeddings/cache_backed - InMemoryStore from @langchain/core/stores - RecursiveCharacterTextSplitter from @langchain/textsplitters - FaissStore from @langchain/community/vectorstores/faiss - TextLoader from langchain/document_loaders/fs/text ## Redis[​](#redis) Here&#x27;s an example with a Redis cache.

You&#x27;ll first need to install `ioredis` as a peer dependency and pass in an initialized client:

- npm
- Yarn
- pnpm

```bash
npm install ioredis

```

```bash
yarn add ioredis

```

```bash
pnpm add ioredis

```

```typescript
import { Redis } from "ioredis";

import { OpenAIEmbeddings } from "@langchain/openai";
import { CacheBackedEmbeddings } from "langchain/embeddings/cache_backed";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RedisByteStore } from "@langchain/community/storage/ioredis";
import { TextLoader } from "langchain/document_loaders/fs/text";

const underlyingEmbeddings = new OpenAIEmbeddings();

// Requires a Redis instance running at http://localhost:6379.
// See https://github.com/redis/ioredis for full config options.
const redisClient = new Redis();
const redisStore = new RedisByteStore({
  client: redisClient,
});

const cacheBackedEmbeddings = CacheBackedEmbeddings.fromBytesStore(
  underlyingEmbeddings,
  redisStore,
  {
    namespace: underlyingEmbeddings.model,
  }
);

const loader = new TextLoader("./state_of_the_union.txt");
const rawDocuments = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0,
});
const documents = await splitter.splitDocuments(rawDocuments);

let time = Date.now();
const vectorstore = await FaissStore.fromDocuments(
  documents,
  cacheBackedEmbeddings
);
console.log(`Initial creation time: ${Date.now() - time}ms`);
/*
  Initial creation time: 1808ms
*/

// The second time is much faster since the embeddings for the input docs have already been added to the cache
time = Date.now();
const vectorstore2 = await FaissStore.fromDocuments(
  documents,
  cacheBackedEmbeddings
);
console.log(`Cached creation time: ${Date.now() - time}ms`);
/*
  Cached creation time: 33ms
*/

// Many keys logged with hashed values
const keys = [];
for await (const key of redisStore.yieldKeys()) {
  keys.push(key);
}

console.log(keys.slice(0, 5));
/*
  [
    &#x27;text-embedding-ada-002fa9ac80e1bf226b7b4dfc03ea743289a65a727b2&#x27;,
    &#x27;text-embedding-ada-0027dbf9c4b36e12fe1768300f145f4640342daaf22&#x27;,
    &#x27;text-embedding-ada-002ea9b59e760e64bec6ee9097b5a06b0d91cb3ab64&#x27;,
    &#x27;text-embedding-ada-002fec5d021611e1527297c5e8f485876ea82dcb111&#x27;,
    &#x27;text-embedding-ada-002c00f818c345da13fed9f2697b4b689338143c8c7&#x27;
  ]
*/

``` #### API Reference: - OpenAIEmbeddings from @langchain/openai - CacheBackedEmbeddings from langchain/embeddings/cache_backed - RecursiveCharacterTextSplitter from @langchain/textsplitters - FaissStore from @langchain/community/vectorstores/faiss - RedisByteStore from @langchain/community/storage/ioredis - TextLoader from langchain/document_loaders/fs/text ## Next steps[​](#next-steps) You&#x27;ve now learned how to use caching to avoid recomputing embeddings.

Next, check out the [full tutorial on retrieval-augmented generation](/docs/tutorials/rag).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [In-memory](#in-memory)
- [Redis](#redis)
- [Next steps](#next-steps)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.