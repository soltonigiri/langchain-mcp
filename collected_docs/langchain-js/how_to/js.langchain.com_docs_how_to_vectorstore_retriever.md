How use a vector store to retrieve data | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow use a vector store to retrieve dataPrerequisitesThis guide assumes familiarity with the following concepts:Vector stores](/docs/concepts/#vectorstores)
- [Retrievers](/docs/concepts/retrievers)
- [Text splitters](/docs/concepts/text_splitters)
- [Chaining runnables](/docs/how_to/sequence/)

Vector stores can be converted into retrievers using the [.asRetriever()](https://api.js.langchain.com/classes/langchain_core.vectorstores.VectorStore.html#asRetriever) method, which allows you to more easily compose them in chains.

Below, we show a retrieval-augmented generation (RAG) chain that performs question answering over documents using the following steps:

- Initialize an vector store
- Create a retriever from that vector store
- Compose a question answering chain
- Ask questions!

Each of the steps has multiple sub steps and potential configurations, but we&#x27;ll go through one common flow. First, install the required dependency:

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

```You can download the `state_of_the_union.txt` file [here](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/state_of_the_union.txt).

```typescript
import * as fs from "node:fs";

import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { Document } from "@langchain/core/documents";

const formatDocumentsAsString = (documents: Document[]) => {
  return documents.map((document) => document.pageContent).join("\n\n");
};

// Initialize the LLM to use to answer the question.
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});
const text = fs.readFileSync("state_of_the_union.txt", "utf8");
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);
// Create a vector store from the documents.
const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings()
);

// Initialize a retriever wrapper around the vector store
const vectorStoreRetriever = vectorStore.asRetriever();

// Create a system & human prompt for the chat model
const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the question at the end.
If you don&#x27;t know the answer, just say that you don&#x27;t know, don&#x27;t try to make up an answer.
----------------
{context}`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_TEMPLATE],
  ["human", "{question}"],
]);

const chain = RunnableSequence.from([
  {
    context: vectorStoreRetriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const answer = await chain.invoke(
  "What did the president say about Justice Breyer?"
);

console.log({ answer });

/*
  {
    answer: &#x27;The president honored Justice Stephen Breyer by recognizing his dedication to serving the country as an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. He thanked Justice Breyer for his service.&#x27;
  }
*/

```

#### API Reference: - OpenAIEmbeddings from @langchain/openai - ChatOpenAI from @langchain/openai - RecursiveCharacterTextSplitter from @langchain/textsplitters - MemoryVectorStore from langchain/vectorstores/memory - RunnablePassthrough from @langchain/core/runnables - RunnableSequence from @langchain/core/runnables - StringOutputParser from @langchain/core/output_parsers - ChatPromptTemplate from @langchain/core/prompts - Document from @langchain/core/documents Let&#x27;s walk through what&#x27;s happening here.

- We first load a long text and split it into smaller documents using a text splitter. We then load those documents (which also embeds the documents using the passed OpenAIEmbeddings instance) into HNSWLib, our vector store, creating our index.
- Though we can query the vector store directly, we convert the vector store into a retriever to return retrieved documents in the right format for the question answering chain.
- We initialize a retrieval chain, which we&#x27;ll call later in step 4.
- We ask questions!

## Next steps[​](#next-steps)

You&#x27;ve now learned how to convert a vector store as a retriever.

See the individual sections for deeper dives on specific retrievers, the [broader tutorial on RAG](/docs/tutorials/rag), or this section to learn how to [create your own custom retriever over any data source](/docs/how_to/custom_retriever/).

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