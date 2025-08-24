How to create and query vector stores | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to create and query vector storesinfoHead to Integrations](/docs/integrations/vectorstores) for documentation on built-in integrations with vectorstore providers.PrerequisitesThis guide assumes familiarity with the following concepts:[Vector stores](/docs/concepts/#vectorstores)
- [Embeddings](/docs/concepts/embedding_models)
- [Document loaders](/docs/concepts/document_loaders)

One of the most common ways to store and search over unstructured data is to embed it and store the resulting embedding vectors, and then at query time to embed the unstructured query and retrieve the embedding vectors that are &#x27;most similar&#x27; to the embedded query. A vector store takes care of storing embedded data and performing vector search for you.

This walkthrough uses a basic, unoptimized implementation called [MemoryVectorStore](https://api.js.langchain.com/classes/langchain.vectorstores_memory.MemoryVectorStore.html) that stores embeddings in-memory and does an exact, linear search for the most similar embeddings. LangChain contains many built-in integrations - see [this section](/docs/how_to/vectorstores/#which-one-to-pick) for more, or the [full list of integrations](/docs/integrations/vectorstores/).

## Creating a new index[​](#creating-a-new-index)

Most of the time, you&#x27;ll need to load and prepare the data you want to search over. Here&#x27;s an example that loads a recent speech from a file:

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";

// Create docs with a loader
const loader = new TextLoader("src/document_loaders/example_data/example.txt");
const docs = await loader.load();

// Load the docs into the vector store
const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings()
);

// Search for the most similar document
const resultOne = await vectorStore.similaritySearch("hello world", 1);

console.log(resultOne);

/*
  [
    Document {
      pageContent: "Hello world",
      metadata: { id: 2 }
    }
  ]
*/

```

#### API Reference: - MemoryVectorStore from langchain/vectorstores/memory - OpenAIEmbeddings from @langchain/openai - TextLoader from langchain/document_loaders/fs/text Most of the time, you&#x27;ll need to split the loaded text as a preparation step. See [this section](/docs/concepts/text_splitters) to learn more about text splitters.

## Creating a new index from texts[​](#creating-a-new-index-from-texts)

If you have already prepared the data you want to search over, you can initialize a vector store directly from text chunks:

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- Yarn
- pnpm

```bash
npm install @langchain/openai @langchain/core

```

```bash
yarn add @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/core

```

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const vectorStore = await MemoryVectorStore.fromTexts(
  ["Hello world", "Bye bye", "hello nice world"],
  [{ id: 2 }, { id: 1 }, { id: 3 }],
  new OpenAIEmbeddings()
);

const resultOne = await vectorStore.similaritySearch("hello world", 1);
console.log(resultOne);

/*
  [
    Document {
      pageContent: "Hello world",
      metadata: { id: 2 }
    }
  ]
*/

``` #### API Reference: - MemoryVectorStore from langchain/vectorstores/memory - OpenAIEmbeddings from @langchain/openai ## Which one to pick?[​](#which-one-to-pick) Here&#x27;s a quick guide to help you pick the right vector store for your use case:

- If you&#x27;re after something that can just run inside your Node.js application, in-memory, without any other servers to stand up, then go for [HNSWLib](/docs/integrations/vectorstores/hnswlib), [Faiss](/docs/integrations/vectorstores/faiss), [LanceDB](/docs/integrations/vectorstores/lancedb) or [CloseVector](/docs/integrations/vectorstores/closevector)
- If you&#x27;re looking for something that can run in-memory in browser-like environments, then go for [MemoryVectorStore](/docs/integrations/vectorstores/memory) or [CloseVector](/docs/integrations/vectorstores/closevector)
- If you come from Python and you were looking for something similar to FAISS, try [HNSWLib](/docs/integrations/vectorstores/hnswlib) or [Faiss](/docs/integrations/vectorstores/faiss)
- If you&#x27;re looking for an open-source full-featured vector database that you can run locally in a docker container, then go for [Chroma](/docs/integrations/vectorstores/chroma)
- If you&#x27;re looking for an open-source vector database that offers low-latency, local embedding of documents and supports apps on the edge, then go for [Zep](/docs/integrations/vectorstores/zep)
- If you&#x27;re looking for an open-source production-ready vector database that you can run locally (in a docker container) or hosted in the cloud, then go for [Weaviate](/docs/integrations/vectorstores/weaviate).
- If you&#x27;re using Supabase already then look at the [Supabase](/docs/integrations/vectorstores/supabase) vector store to use the same Postgres database for your embeddings too
- If you&#x27;re looking for a production-ready vector store you don&#x27;t have to worry about hosting yourself, then go for [Pinecone](/docs/integrations/vectorstores/pinecone)
- If you are already utilizing SingleStore, or if you find yourself in need of a distributed, high-performance database, you might want to consider the [SingleStore](/docs/integrations/vectorstores/singlestore) vector store.
- If you are looking for an online MPP (Massively Parallel Processing) data warehousing service, you might want to consider the [AnalyticDB](/docs/integrations/vectorstores/analyticdb) vector store.
- If you&#x27;re in search of a cost-effective vector database that allows run vector search with SQL, look no further than [MyScale](/docs/integrations/vectorstores/myscale).
- If you&#x27;re in search of a vector database that you can load from both the browser and server side, check out [CloseVector](/docs/integrations/vectorstores/closevector). It&#x27;s a vector database that aims to be cross-platform.
- If you&#x27;re looking for a scalable, open-source columnar database with excellent performance for analytical queries, then consider [ClickHouse](/docs/integrations/vectorstores/clickhouse).

## Next steps[​](#next-steps)

You&#x27;ve now learned how to load data into a vectorstore.

Next, check out the [full tutorial on retrieval-augmented generation](/docs/tutorials/rag).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Creating a new index](#creating-a-new-index)
- [Creating a new index from texts](#creating-a-new-index-from-texts)
- [Which one to pick?](#which-one-to-pick)
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