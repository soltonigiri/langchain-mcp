How to generate multiple embeddings per document | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to generate multiple embeddings per documentPrerequisitesThis guide assumes familiarity with the following concepts:Retrievers](/docs/concepts/retrievers)
- [Text splitters](/docs/concepts/text_splitters)
- [Retrieval-augmented generation (RAG)](/docs/tutorials/rag)

Embedding different representations of an original document, then returning the original document when any of the representations result in a search hit, can allow you to tune and improve your retrieval performance. LangChain has a base [MultiVectorRetriever](https://api.js.langchain.com/classes/langchain.retrievers_multi_vector.MultiVectorRetriever.html) designed to do just this!

A lot of the complexity lies in how to create the multiple vectors per document. This guide covers some of the common ways to create those vectors and use the `MultiVectorRetriever`.

Some methods to create multiple vectors per document include:

- smaller chunks: split a document into smaller chunks, and embed those (e.g. the [ParentDocumentRetriever](/docs/how_to/parent_document_retriever))
- summary: create a summary for each document, embed that along with (or instead of) the document
- hypothetical questions: create hypothetical questions that each document would be appropriate to answer, embed those along with (or instead of) the document

Note that this also enables another method of adding embeddings - manually. This is great because you can explicitly add questions or queries that should lead to a document being recovered, giving you more control.

## Smaller chunks[​](#smaller-chunks)

Often times it can be useful to retrieve larger chunks of information, but embed smaller chunks. This allows for embeddings to capture the semantic meaning as closely as possible, but for as much context as possible to be passed downstream. NOTE: this is what the ParentDocumentRetriever does. Here we show what is going on under the hood.

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

```

```typescript
import * as uuid from "uuid";

import { MultiVectorRetriever } from "langchain/retrievers/multi_vector";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { InMemoryStore } from "@langchain/core/stores";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { Document } from "@langchain/core/documents";

const textLoader = new TextLoader("../examples/state_of_the_union.txt");
const parentDocuments = await textLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 10000,
  chunkOverlap: 20,
});

const docs = await splitter.splitDocuments(parentDocuments);

const idKey = "doc_id";
const docIds = docs.map((_) => uuid.v4());

const childSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 400,
  chunkOverlap: 0,
});

const subDocs = [];
for (let i = 0; i < docs.length; i += 1) {
  const childDocs = await childSplitter.splitDocuments([docs[i]]);
  const taggedChildDocs = childDocs.map((childDoc) => {
    // eslint-disable-next-line no-param-reassign
    childDoc.metadata[idKey] = docIds[i];
    return childDoc;
  });
  subDocs.push(...taggedChildDocs);
}

// The byteStore to use to store the original chunks
const byteStore = new InMemoryStore<Uint8Array>();

// The vectorstore to use to index the child chunks
const vectorstore = await FaissStore.fromDocuments(
  subDocs,
  new OpenAIEmbeddings()
);

const retriever = new MultiVectorRetriever({
  vectorstore,
  byteStore,
  idKey,
  // Optional `k` parameter to search for more child documents in VectorStore.
  // Note that this does not exactly correspond to the number of final (parent) documents
  // retrieved, as multiple child documents can point to the same parent.
  childK: 20,
  // Optional `k` parameter to limit number of final, parent documents returned from this
  // retriever and sent to LLM. This is an upper-bound, and the final count may be lower than this.
  parentK: 5,
});

const keyValuePairs: [string, Document][] = docs.map((originalDoc, i) => [
  docIds[i],
  originalDoc,
]);

// Use the retriever to add the original chunks to the document store
await retriever.docstore.mset(keyValuePairs);

// Vectorstore alone retrieves the small chunks
const vectorstoreResult = await retriever.vectorstore.similaritySearch(
  "justice breyer"
);
console.log(vectorstoreResult[0].pageContent.length);
/*
  390
*/

// Retriever returns larger result
const retrieverResult = await retriever.invoke("justice breyer");
console.log(retrieverResult[0].pageContent.length);
/*
  9770
*/

``` #### API Reference: - MultiVectorRetriever from langchain/retrievers/multi_vector - FaissStore from @langchain/community/vectorstores/faiss - OpenAIEmbeddings from @langchain/openai - RecursiveCharacterTextSplitter from @langchain/textsplitters - InMemoryStore from @langchain/core/stores - TextLoader from langchain/document_loaders/fs/text - Document from @langchain/core/documents ## Summary[​](#summary) Oftentimes a summary may be able to distill more accurately what a chunk is about, leading to better retrieval. Here we show how to create summaries, and then embed those.

```typescript
import * as uuid from "uuid";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MultiVectorRetriever } from "langchain/retrievers/multi_vector";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { InMemoryStore } from "@langchain/core/stores";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";

const textLoader = new TextLoader("../examples/state_of_the_union.txt");
const parentDocuments = await textLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 10000,
  chunkOverlap: 20,
});

const docs = await splitter.splitDocuments(parentDocuments);

const chain = RunnableSequence.from([
  { content: (doc: Document) => doc.pageContent },
  PromptTemplate.fromTemplate(`Summarize the following document:\n\n{content}`),
  new ChatOpenAI({
    model: "gpt-4o-mini",
    maxRetries: 0,
  }),
  new StringOutputParser(),
]);

const summaries = await chain.batch(docs, {
  maxConcurrency: 5,
});

const idKey = "doc_id";
const docIds = docs.map((_) => uuid.v4());
const summaryDocs = summaries.map((summary, i) => {
  const summaryDoc = new Document({
    pageContent: summary,
    metadata: {
      [idKey]: docIds[i],
    },
  });
  return summaryDoc;
});

// The byteStore to use to store the original chunks
const byteStore = new InMemoryStore<Uint8Array>();

// The vectorstore to use to index the child chunks
const vectorstore = await FaissStore.fromDocuments(
  summaryDocs,
  new OpenAIEmbeddings()
);

const retriever = new MultiVectorRetriever({
  vectorstore,
  byteStore,
  idKey,
});

const keyValuePairs: [string, Document][] = docs.map((originalDoc, i) => [
  docIds[i],
  originalDoc,
]);

// Use the retriever to add the original chunks to the document store
await retriever.docstore.mset(keyValuePairs);

// We could also add the original chunks to the vectorstore if we wish
// const taggedOriginalDocs = docs.map((doc, i) => {
//   doc.metadata[idKey] = docIds[i];
//   return doc;
// });
// retriever.vectorstore.addDocuments(taggedOriginalDocs);

// Vectorstore alone retrieves the small chunks
const vectorstoreResult = await retriever.vectorstore.similaritySearch(
  "justice breyer"
);
console.log(vectorstoreResult[0].pageContent.length);
/*
  1118
*/

// Retriever returns larger result
const retrieverResult = await retriever.invoke("justice breyer");
console.log(retrieverResult[0].pageContent.length);
/*
  9770
*/

```

#### API Reference: - ChatOpenAI from @langchain/openai - OpenAIEmbeddings from @langchain/openai - MultiVectorRetriever from langchain/retrievers/multi_vector - FaissStore from @langchain/community/vectorstores/faiss - RecursiveCharacterTextSplitter from @langchain/textsplitters - InMemoryStore from @langchain/core/stores - TextLoader from langchain/document_loaders/fs/text - PromptTemplate from @langchain/core/prompts - StringOutputParser from @langchain/core/output_parsers - RunnableSequence from @langchain/core/runnables - Document from @langchain/core/documents ## Hypothetical queries[​](#hypothetical-queries) An LLM can also be used to generate a list of hypothetical questions that could be asked of a particular document. These questions can then be embedded and used to retrieve the original document:

```typescript
import * as uuid from "uuid";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MultiVectorRetriever } from "langchain/retrievers/multi_vector";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { InMemoryStore } from "@langchain/core/stores";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";
import { JsonKeyOutputFunctionsParser } from "@langchain/core/output_parsers/openai_functions";

const textLoader = new TextLoader("../examples/state_of_the_union.txt");
const parentDocuments = await textLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 10000,
  chunkOverlap: 20,
});

const docs = await splitter.splitDocuments(parentDocuments);

const functionsSchema = [
  {
    name: "hypothetical_questions",
    description: "Generate hypothetical questions",
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["questions"],
    },
  },
];

const functionCallingModel = new ChatOpenAI({
  maxRetries: 0,
  model: "gpt-4",
})
  .bindTools(functionsSchema)
  .withConfig({
    function_call: { name: "hypothetical_questions" },
  });

const chain = RunnableSequence.from([
  { content: (doc: Document) => doc.pageContent },
  PromptTemplate.fromTemplate(
    `Generate a list of 3 hypothetical questions that the below document could be used to answer:\n\n{content}`
  ),
  functionCallingModel,
  new JsonKeyOutputFunctionsParser<string[]>({ attrName: "questions" }),
]);

const hypotheticalQuestions = await chain.batch(docs, {
  maxConcurrency: 5,
});

const idKey = "doc_id";
const docIds = docs.map((_) => uuid.v4());
const hypotheticalQuestionDocs = hypotheticalQuestions
  .map((questionArray, i) => {
    const questionDocuments = questionArray.map((question) => {
      const questionDocument = new Document({
        pageContent: question,
        metadata: {
          [idKey]: docIds[i],
        },
      });
      return questionDocument;
    });
    return questionDocuments;
  })
  .flat();

// The byteStore to use to store the original chunks
const byteStore = new InMemoryStore<Uint8Array>();

// The vectorstore to use to index the child chunks
const vectorstore = await FaissStore.fromDocuments(
  hypotheticalQuestionDocs,
  new OpenAIEmbeddings()
);

const retriever = new MultiVectorRetriever({
  vectorstore,
  byteStore,
  idKey,
});

const keyValuePairs: [string, Document][] = docs.map((originalDoc, i) => [
  docIds[i],
  originalDoc,
]);

// Use the retriever to add the original chunks to the document store
await retriever.docstore.mset(keyValuePairs);

// We could also add the original chunks to the vectorstore if we wish
// const taggedOriginalDocs = docs.map((doc, i) => {
//   doc.metadata[idKey] = docIds[i];
//   return doc;
// });
// retriever.vectorstore.addDocuments(taggedOriginalDocs);

// Vectorstore alone retrieves the small chunks
const vectorstoreResult = await retriever.vectorstore.similaritySearch(
  "justice breyer"
);
console.log(vectorstoreResult[0].pageContent);
/*
  "What measures will be taken to crack down on corporations overcharging American businesses and consumers?"
*/

// Retriever returns larger result
const retrieverResult = await retriever.invoke("justice breyer");
console.log(retrieverResult[0].pageContent.length);
/*
  9770
*/

```

#### API Reference: - ChatOpenAI from @langchain/openai - OpenAIEmbeddings from @langchain/openai - MultiVectorRetriever from langchain/retrievers/multi_vector - FaissStore from @langchain/community/vectorstores/faiss - RecursiveCharacterTextSplitter from @langchain/textsplitters - InMemoryStore from @langchain/core/stores - TextLoader from langchain/document_loaders/fs/text - PromptTemplate from @langchain/core/prompts - RunnableSequence from @langchain/core/runnables - Document from @langchain/core/documents - JsonKeyOutputFunctionsParser from @langchain/core/output_parsers/openai_functions ## Next steps[​](#next-steps) You&#x27;ve now learned a few ways to generate multiple embeddings per document.

Next, check out the individual sections for deeper dives on specific retrievers, the [broader tutorial on RAG](/docs/tutorials/rag), or this section to learn how to [create your own custom retriever over any data source](/docs/how_to/custom_retriever/).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Smaller chunks](#smaller-chunks)
- [Summary](#summary)
- [Hypothetical queries](#hypothetical-queries)
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