How to create a time-weighted retriever | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to create a time-weighted retrieverPrerequisitesThis guide assumes familiarity with the following concepts:Retrievers](/docs/concepts/retrievers)[Vector stores](/docs/concepts/#vectorstores)[Retrieval-augmented generation (RAG)](/docs/tutorials/rag)This guide covers the [TimeWeightedVectorStoreRetriever](https://api.js.langchain.com/classes/langchain.retrievers_time_weighted.TimeWeightedVectorStoreRetriever.html), which uses a combination of semantic similarity and a time decay.The algorithm for scoring them is:

```text
semantic_similarity + (1.0 - decay_rate) ^ hours_passed

```Notably, hours_passed refers to the hours passed since the object in the retriever was last accessed**, not since it was created. This means that frequently accessed objects remain "fresh."

```typescript
let score = (1.0 - this.decayRate) ** hoursPassed + vectorRelevance;

```**this.decayRate is a configurable decimal number between 0 and 1. A lower number means that documents will be "remembered" for longer, while a higher number strongly weights more recently accessed documents.Note that setting a decay rate of exactly 0 or 1 makes hoursPassed irrelevant and makes this retriever equivalent to a standard vector lookup.It is important to note that due to required metadata, all documents must be added to the backing vector store using the addDocuments method on the retriever**, not the vector store itself.tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
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
import { TimeWeightedVectorStoreRetriever } from "langchain/retrievers/time_weighted";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

const retriever = new TimeWeightedVectorStoreRetriever({
  vectorStore,
  memoryStream: [],
  searchKwargs: 2,
});

const documents = [
  "My name is John.",
  "My name is Bob.",
  "My favourite food is pizza.",
  "My favourite food is pasta.",
  "My favourite food is sushi.",
].map((pageContent) => ({ pageContent, metadata: {} }));

// All documents must be added using this method on the retriever (not the vector store!)
// so that the correct access history metadata is populated
await retriever.addDocuments(documents);

const results1 = await retriever.invoke("What is my favourite food?");

console.log(results1);

/*
[
  Document { pageContent: &#x27;My favourite food is pasta.&#x27;, metadata: {} }
]
 */

const results2 = await retriever.invoke("What is my favourite food?");

console.log(results2);

/*
[
  Document { pageContent: &#x27;My favourite food is pasta.&#x27;, metadata: {} }
]
 */

``` #### API Reference: - TimeWeightedVectorStoreRetriever from langchain/retrievers/time_weighted - MemoryVectorStore from langchain/vectorstores/memory - OpenAIEmbeddings from @langchain/openai ## Next steps[​](#next-steps) You&#x27;ve now learned how to use time as a factor when performing retrieval.

Next, check out the [broader tutorial on RAG](/docs/tutorials/rag), or this section to learn how to [create your own custom retriever over any data source](/docs/how_to/custom_retriever/).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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