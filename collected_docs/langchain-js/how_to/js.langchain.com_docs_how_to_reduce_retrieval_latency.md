How to reduce retrieval latency | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to reduce retrieval latencyPrerequisitesThis guide assumes familiarity with the following concepts:Retrievers](/docs/concepts/retrievers)[Embeddings](/docs/concepts/embedding_models)[Vector stores](/docs/concepts/#vectorstores)[Retrieval-augmented generation (RAG)](/docs/tutorials/rag)One way to reduce retrieval latency is through a technique called "Adaptive Retrieval". The [MatryoshkaRetriever](https://api.js.langchain.com/classes/langchain.retrievers_matryoshka_retriever.MatryoshkaRetriever.html) uses the Matryoshka Representation Learning (MRL) technique to retrieve documents for a given query in two steps:First-pass**: Uses a lower dimensional sub-vector from the MRL embedding for an initial, fast, but less accurate search.
- **Second-pass**: Re-ranks the top results from the first pass using the full, high-dimensional embedding for higher accuracy.

![Matryoshka Retriever ](/assets/images/adaptive_retrieval-2abb9f6f280c11a424ae6978d39eb011.png)

It is based on this [Supabase](https://supabase.com/) blog post ["Matryoshka embeddings: faster OpenAI vector search using Adaptive Retrieval"](https://supabase.com/blog/matryoshka-embeddings).

### Setup[​](#setup)

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
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

```To follow the example below, you need an OpenAI API key:

```bash
export OPENAI_API_KEY=your-api-key

```

We&#x27;ll also be using `chroma` for our vector store. Follow the instructions [here](/docs/integrations/vectorstores/chroma) to setup.

```typescript
import { MatryoshkaRetriever } from "langchain/retrievers/matryoshka_retriever";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { faker } from "@faker-js/faker";

const smallEmbeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  dimensions: 512, // Min number for small
});

const largeEmbeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  dimensions: 3072, // Max number for large
});

const vectorStore = new Chroma(smallEmbeddings, {
  numDimensions: 512,
});

const retriever = new MatryoshkaRetriever({
  vectorStore,
  largeEmbeddingModel: largeEmbeddings,
  largeK: 5,
});

const irrelevantDocs = Array.from({ length: 250 }).map(
  () =>
    new Document({
      pageContent: faker.lorem.word(7), // Similar length to the relevant docs
    })
);
const relevantDocs = [
  new Document({
    pageContent: "LangChain is an open source github repo",
  }),
  new Document({
    pageContent: "There are JS and PY versions of the LangChain github repos",
  }),
  new Document({
    pageContent: "LangGraph is a new open source library by the LangChain team",
  }),
  new Document({
    pageContent: "LangChain announced GA of LangSmith last week!",
  }),
  new Document({
    pageContent: "I heart LangChain",
  }),
];
const allDocs = [...irrelevantDocs, ...relevantDocs];

/**
 * IMPORTANT:
 * The `addDocuments` method on `MatryoshkaRetriever` will
 * generate the small AND large embeddings for all documents.
 */
await retriever.addDocuments(allDocs);

const query = "What is LangChain?";
const results = await retriever.invoke(query);
console.log(results.map(({ pageContent }) => pageContent).join("\n"));

/**
  I heart LangChain
  LangGraph is a new open source library by the LangChain team
  LangChain is an open source github repo
  LangChain announced GA of LangSmith last week!
  There are JS and PY versions of the LangChain github repos
*/

```

#### API Reference: - MatryoshkaRetriever from langchain/retrievers/matryoshka_retriever - Chroma from @langchain/community/vectorstores/chroma - OpenAIEmbeddings from @langchain/openai - Document from @langchain/core/documents noteDue to the constraints of some vector stores, the large embedding metadata field is stringified (`JSON.stringify`) before being stored. This means that the metadata field will need to be parsed (`JSON.parse`) when retrieved from the vector store.

## Next steps[​](#next-steps)

You&#x27;ve now learned a technique that can help speed up your retrieval queries.

Next, check out the [broader tutorial on RAG](/docs/tutorials/rag), or this section to learn how to [create your own custom retriever over any data source](/docs/how_to/custom_retriever/).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
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