How to do retrieval with contextual compression | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to do retrieval with contextual compressionPrerequisitesThis guide assumes familiarity with the following concepts:Retrievers](/docs/concepts/retrievers)
- [Retrieval-augmented generation (RAG)](/docs/tutorials/rag)

One challenge with retrieval is that usually you don&#x27;t know the specific queries your document storage system will face when you ingest data into the system. This means that the information most relevant to a query may be buried in a document with a lot of irrelevant text. Passing that full document through your application can lead to more expensive LLM calls and poorer responses.

Contextual compression is meant to fix this. The idea is simple: instead of immediately returning retrieved documents as-is, you can compress them using the context of the given query, so that only the relevant information is returned. “Compressing” here refers to both compressing the contents of an individual document and filtering out documents wholesale.

To use the Contextual Compression Retriever, you&#x27;ll need:

- a base retriever
- a Document Compressor

The Contextual Compression Retriever passes queries to the base retriever, takes the initial documents and passes them through the Document Compressor. The Document Compressor takes a list of documents and shortens it by reducing the contents of documents or dropping documents altogether.

## Using a vanilla vector store retriever[​](#using-a-vanilla-vector-store-retriever)

Let&#x27;s start by initializing a simple vector store retriever and storing the 2023 State of the Union speech (in chunks). Given an example question, our retriever returns one or two relevant docs and a few irrelevant docs, and even the relevant docs have a lot of irrelevant information in them. To extract all the context we can, we use an `LLMChainExtractor`, which will iterate over the initially returned documents and extract from each only the content that is relevant to the query.

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
import * as fs from "fs";

import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";

const model = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
});
const baseCompressor = LLMChainExtractor.fromLLM(model);

const text = fs.readFileSync("state_of_the_union.txt", "utf8");

const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);

// Create a vector store from the documents.
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

const retriever = new ContextualCompressionRetriever({
  baseCompressor,
  baseRetriever: vectorStore.asRetriever(),
});

const retrievedDocs = await retriever.invoke(
  "What did the speaker say about Justice Breyer?"
);

console.log({ retrievedDocs });

/*
  {
    retrievedDocs: [
      Document {
        pageContent: &#x27;One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.&#x27;,
        metadata: [Object]
      },
      Document {
        pageContent: &#x27;"Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service."&#x27;,
        metadata: [Object]
      },
      Document {
        pageContent: &#x27;The onslaught of state laws targeting transgender Americans and their families is wrong.&#x27;,
        metadata: [Object]
      }
    ]
  }
*/

``` #### API Reference: - OpenAI from @langchain/openai - OpenAIEmbeddings from @langchain/openai - RecursiveCharacterTextSplitter from @langchain/textsplitters - HNSWLib from @langchain/community/vectorstores/hnswlib - ContextualCompressionRetriever from langchain/retrievers/contextual_compression - LLMChainExtractor from langchain/retrievers/document_compressors/chain_extract ## EmbeddingsFilter[​](#embeddingsfilter) Making an extra LLM call over each retrieved document is expensive and slow. The `EmbeddingsFilter` provides a cheaper and faster option by embedding the documents and query and only returning those documents which have sufficiently similar embeddings to the query.

This is most useful for non-vector store retrievers where we may not have control over the returned chunk size, or as part of a pipeline, outlined below.

Here&#x27;s an example:

```typescript
import * as fs from "fs";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { EmbeddingsFilter } from "langchain/retrievers/document_compressors/embeddings_filter";

const baseCompressor = new EmbeddingsFilter({
  embeddings: new OpenAIEmbeddings(),
  similarityThreshold: 0.8,
});

const text = fs.readFileSync("state_of_the_union.txt", "utf8");

const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);

// Create a vector store from the documents.
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

const retriever = new ContextualCompressionRetriever({
  baseCompressor,
  baseRetriever: vectorStore.asRetriever(),
});

const retrievedDocs = await retriever.invoke(
  "What did the speaker say about Justice Breyer?"
);
console.log({ retrievedDocs });

/*
  {
    retrievedDocs: [
      Document {
        pageContent: &#x27;And I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;A former top litigator in private practice. A former federal public defender. And from a family of public school educators and police officers. A consensus builder. Since she’s been nominated, she’s received a broad range of support—from the Fraternal Order of Police to former judges appointed by Democrats and Republicans. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;And if we are to advance liberty and justice, we need to secure the Border and fix the immigration system. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;We can do both. At our border, we’ve installed new technology like cutting-edge scanners to better detect drug smuggling.  \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;We’ve set up joint patrols with Mexico and Guatemala to catch more human traffickers.  \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;We’re putting in place dedicated immigration judges so families fleeing persecution and violence can have their cases heard faster.&#x27;,
        metadata: [Object]
      },
      Document {
        pageContent: &#x27;In state after state, new laws have been passed, not only to suppress the vote, but to subvert entire elections. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;We cannot let this happen. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;And I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.&#x27;,
        metadata: [Object]
      }
    ]
  }
*/

```

#### API Reference: - RecursiveCharacterTextSplitter from @langchain/textsplitters - HNSWLib from @langchain/community/vectorstores/hnswlib - OpenAIEmbeddings from @langchain/openai - ContextualCompressionRetriever from langchain/retrievers/contextual_compression - EmbeddingsFilter from langchain/retrievers/document_compressors/embeddings_filter ## Stringing compressors and document transformers together[​](#stringing-compressors-and-document-transformers-together) Using the `DocumentCompressorPipeline` we can also easily combine multiple compressors in sequence. Along with compressors we can add BaseDocumentTransformers to our pipeline, which don&#x27;t perform any contextual compression but simply perform some transformation on a set of documents. For example `TextSplitters` can be used as document transformers to split documents into smaller pieces, and the `EmbeddingsFilter` can be used to filter out documents based on similarity of the individual chunks to the input query.

Below we create a compressor pipeline by first splitting raw webpage documents retrieved from the [Tavily web search API retriever](/docs/integrations/retrievers/tavily) into smaller chunks, then filtering based on relevance to the query. The result is smaller chunks that are semantically similar to the input query. This skips the need to add documents to a vector store to perform similarity search, which can be useful for one-off use cases:

```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { EmbeddingsFilter } from "langchain/retrievers/document_compressors/embeddings_filter";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { DocumentCompressorPipeline } from "langchain/retrievers/document_compressors";

const embeddingsFilter = new EmbeddingsFilter({
  embeddings: new OpenAIEmbeddings(),
  similarityThreshold: 0.8,
  k: 5,
});

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 0,
});

const compressorPipeline = new DocumentCompressorPipeline({
  transformers: [textSplitter, embeddingsFilter],
});

const baseRetriever = new TavilySearchAPIRetriever({
  includeRawContent: true,
});

const retriever = new ContextualCompressionRetriever({
  baseCompressor: compressorPipeline,
  baseRetriever,
});

const retrievedDocs = await retriever.invoke(
  "What did the speaker say about Justice Breyer in the 2022 State of the Union?"
);
console.log({ retrievedDocs });

/*
  {
    retrievedDocs: [
      Document {
        pageContent: &#x27;Justice Stephen Breyer talks to President Joe Biden ahead of the State of the Union address on Tuesday. (jabin botsford/Agence France-Presse/Getty Images)&#x27;,
        metadata: [Object]
      },
      Document {
        pageContent: &#x27;President Biden recognized outgoing US Supreme Court Justice Stephen Breyer during his State of the Union on Tuesday.&#x27;,
        metadata: [Object]
      },
      Document {
        pageContent: &#x27;What we covered here\n&#x27; +
          &#x27;Biden recognized outgoing Supreme Court Justice Breyer during his speech&#x27;,
        metadata: [Object]
      },
      Document {
        pageContent: &#x27;States Supreme Court. Justice Breyer, thank you for your service,” the president said.&#x27;,
        metadata: [Object]
      },
      Document {
        pageContent: &#x27;Court," Biden said. "Justice Breyer, thank you for your service."&#x27;,
        metadata: [Object]
      }
    ]
  }
*/

```

#### API Reference: - RecursiveCharacterTextSplitter from @langchain/textsplitters - OpenAIEmbeddings from @langchain/openai - ContextualCompressionRetriever from langchain/retrievers/contextual_compression - EmbeddingsFilter from langchain/retrievers/document_compressors/embeddings_filter - TavilySearchAPIRetriever from @langchain/community/retrievers/tavily_search_api - DocumentCompressorPipeline from langchain/retrievers/document_compressors ## Next steps[​](#next-steps) You&#x27;ve now learned a few ways to use contextual compression to remove bad data from your results.

See the individual sections for deeper dives on specific retrievers, the [broader tutorial on RAG](/docs/tutorials/rag), or this section to learn how to [create your own custom retriever over any data source](/docs/how_to/custom_retriever/).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Using a vanilla vector store retriever](#using-a-vanilla-vector-store-retriever)
- [EmbeddingsFilter](#embeddingsfilter)
- [Stringing compressors and document transformers together](#stringing-compressors-and-document-transformers-together)
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