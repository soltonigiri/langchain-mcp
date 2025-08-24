How to retrieve the whole document for a chunk | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to retrieve the whole document for a chunkPrerequisitesThis guide assumes familiarity with the following concepts:Retrievers](/docs/concepts/retrievers)
- [Text splitters](/docs/concepts/text_splitters)
- [Retrieval-augmented generation (RAG)](/docs/tutorials/rag)

When splitting documents for retrieval, there are often conflicting desires:

- You may want to have small documents, so that their embeddings can most accurately reflect their meaning. If documents are too long, then the embeddings can lose meaning.
- You want to have long enough documents that the context of each chunk is retained.

The [ParentDocumentRetriever](https://api.js.langchain.com/classes/langchain.retrievers_parent_document.ParentDocumentRetriever.html) strikes that balance by splitting and storing small chunks of data. During retrieval, it first fetches the small chunks but then looks up the parent ids for those chunks and returns those larger documents.

Note that "parent document" refers to the document that a small chunk originated from. This can either be the whole raw document OR a larger chunk.

This is a more specific form of [generating multiple embeddings per document](/docs/how_to/multi_vector).

## Usage[​](#usage)

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
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ParentDocumentRetriever } from "langchain/retrievers/parent_document";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { InMemoryStore } from "@langchain/core/stores";

const vectorstore = new MemoryVectorStore(new OpenAIEmbeddings());
const byteStore = new InMemoryStore<Uint8Array>();

const retriever = new ParentDocumentRetriever({
  vectorstore,
  byteStore,
  // Optional, not required if you&#x27;re already passing in split documents
  parentSplitter: new RecursiveCharacterTextSplitter({
    chunkOverlap: 0,
    chunkSize: 500,
  }),
  childSplitter: new RecursiveCharacterTextSplitter({
    chunkOverlap: 0,
    chunkSize: 50,
  }),
  // Optional `k` parameter to search for more child documents in VectorStore.
  // Note that this does not exactly correspond to the number of final (parent) documents
  // retrieved, as multiple child documents can point to the same parent.
  childK: 20,
  // Optional `k` parameter to limit number of final, parent documents returned from this
  // retriever and sent to LLM. This is an upper-bound, and the final count may be lower than this.
  parentK: 5,
});
const textLoader = new TextLoader("../examples/state_of_the_union.txt");
const parentDocuments = await textLoader.load();

// We must add the parent documents via the retriever&#x27;s addDocuments method
await retriever.addDocuments(parentDocuments);

const retrievedDocs = await retriever.invoke("justice breyer");

// Retrieved chunks are the larger parent chunks
console.log(retrievedDocs);
/*
  [
    Document {
      pageContent: &#x27;Tonight, I call on the Senate to pass — pass the Freedom to Vote Act. Pass the John Lewis Act — Voting Rights Act. And while you’re at it, pass the DISCLOSE Act so Americans know who is funding our elections.\n&#x27; +
        &#x27;\n&#x27; +
        &#x27;Look, tonight, I’d — I’d like to honor someone who has dedicated his life to serve this country: Justice Breyer — an Army veteran, Constitutional scholar, retiring Justice of the United States Supreme Court.&#x27;,
      metadata: { source: &#x27;../examples/state_of_the_union.txt&#x27;, loc: [Object] }
    },
    Document {
      pageContent: &#x27;As I did four days ago, I’ve nominated a Circuit Court of Appeals — Ketanji Brown Jackson. One of our nation’s top legal minds who will continue in just Brey- — Justice Breyer’s legacy of excellence. A former top litigator in private practice, a former federal public defender from a family of public-school educators and police officers — she’s a consensus builder.&#x27;,
      metadata: { source: &#x27;../examples/state_of_the_union.txt&#x27;, loc: [Object] }
    },
    Document {
      pageContent: &#x27;Justice Breyer, thank you for your service. Thank you, thank you, thank you. I mean it. Get up. Stand — let me see you. Thank you.\n&#x27; +
        &#x27;\n&#x27; +
        &#x27;And we all know — no matter what your ideology, we all know one of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.&#x27;,
      metadata: { source: &#x27;../examples/state_of_the_union.txt&#x27;, loc: [Object] }
    }
  ]
*/

``` #### API Reference: - OpenAIEmbeddings from @langchain/openai - MemoryVectorStore from langchain/vectorstores/memory - ParentDocumentRetriever from langchain/retrievers/parent_document - RecursiveCharacterTextSplitter from @langchain/textsplitters - TextLoader from langchain/document_loaders/fs/text - InMemoryStore from @langchain/core/stores ## With Score Threshold[​](#with-score-threshold) By setting the options in `scoreThresholdOptions` we can force the `ParentDocumentRetriever` to use the `ScoreThresholdRetriever` under the hood. This sets the vector store inside `ScoreThresholdRetriever` as the one we passed when initializing `ParentDocumentRetriever`, while also allowing us to also set a score threshold for the retriever.

This can be helpful when you&#x27;re not sure how many documents you want (or if you are sure, just set the `maxK` option), but you want to make sure that the documents you do get are within a certain relevancy threshold.

Note: if a retriever is passed, `ParentDocumentRetriever` will default to use it for retrieving small chunks, as well as adding documents via the `addDocuments` method.

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { InMemoryStore } from "@langchain/core/stores";
import { ParentDocumentRetriever } from "langchain/retrievers/parent_document";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";

const vectorstore = new MemoryVectorStore(new OpenAIEmbeddings());
const byteStore = new InMemoryStore<Uint8Array>();

const childDocumentRetriever = ScoreThresholdRetriever.fromVectorStore(
  vectorstore,
  {
    minSimilarityScore: 0.01, // Essentially no threshold
    maxK: 1, // Only return the top result
  }
);
const retriever = new ParentDocumentRetriever({
  vectorstore,
  byteStore,
  childDocumentRetriever,
  // Optional, not required if you&#x27;re already passing in split documents
  parentSplitter: new RecursiveCharacterTextSplitter({
    chunkOverlap: 0,
    chunkSize: 500,
  }),
  childSplitter: new RecursiveCharacterTextSplitter({
    chunkOverlap: 0,
    chunkSize: 50,
  }),
});
const textLoader = new TextLoader("../examples/state_of_the_union.txt");
const parentDocuments = await textLoader.load();

// We must add the parent documents via the retriever&#x27;s addDocuments method
await retriever.addDocuments(parentDocuments);

const retrievedDocs = await retriever.invoke("justice breyer");

// Retrieved chunk is the larger parent chunk
console.log(retrievedDocs);
/*
  [
    Document {
      pageContent: &#x27;Tonight, I call on the Senate to pass — pass the Freedom to Vote Act. Pass the John Lewis Act — Voting Rights Act. And while you’re at it, pass the DISCLOSE Act so Americans know who is funding our elections.\n&#x27; +
        &#x27;\n&#x27; +
        &#x27;Look, tonight, I’d — I’d like to honor someone who has dedicated his life to serve this country: Justice Breyer — an Army veteran, Constitutional scholar, retiring Justice of the United States Supreme Court.&#x27;,
      metadata: { source: &#x27;../examples/state_of_the_union.txt&#x27;, loc: [Object] }
    },
  ]
*/

```

#### API Reference: - OpenAIEmbeddings from @langchain/openai - MemoryVectorStore from langchain/vectorstores/memory - InMemoryStore from @langchain/core/stores - ParentDocumentRetriever from langchain/retrievers/parent_document - RecursiveCharacterTextSplitter from @langchain/textsplitters - TextLoader from langchain/document_loaders/fs/text - ScoreThresholdRetriever from langchain/retrievers/score_threshold ## With Contextual chunk headers[​](#with-contextual-chunk-headers) Consider a scenario where you want to store collection of documents in a vector store and perform Q&A tasks on them. Simply splitting documents with overlapping text may not provide sufficient context for LLMs to determine if multiple chunks are referencing the same information, or how to resolve information from contradictory sources.

Tagging each document with metadata is a solution if you know what to filter against, but you may not know ahead of time exactly what kind of queries your vector store will be expected to handle. Including additional contextual information directly in each chunk in the form of headers can help deal with arbitrary queries.

This is particularly important if you have several fine-grained child chunks that need to be correctly retrieved from the vector store.

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { InMemoryStore } from "@langchain/core/stores";
import { ParentDocumentRetriever } from "langchain/retrievers/parent_document";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1500,
  chunkOverlap: 0,
});

const jimDocs = await splitter.createDocuments([`My favorite color is blue.`]);
const jimChunkHeaderOptions = {
  chunkHeader: "DOC NAME: Jim Interview\n---\n",
  appendChunkOverlapHeader: true,
};

const pamDocs = await splitter.createDocuments([`My favorite color is red.`]);
const pamChunkHeaderOptions = {
  chunkHeader: "DOC NAME: Pam Interview\n---\n",
  appendChunkOverlapHeader: true,
};

const vectorstore = await HNSWLib.fromDocuments([], new OpenAIEmbeddings());
const byteStore = new InMemoryStore<Uint8Array>();

const retriever = new ParentDocumentRetriever({
  vectorstore,
  byteStore,
  // Very small chunks for demo purposes.
  // Use a bigger chunk size for serious use-cases.
  childSplitter: new RecursiveCharacterTextSplitter({
    chunkSize: 10,
    chunkOverlap: 0,
  }),
  childK: 50,
  parentK: 5,
});

// We pass additional option `childDocChunkHeaderOptions`
// that will add the chunk header to child documents
await retriever.addDocuments(jimDocs, {
  childDocChunkHeaderOptions: jimChunkHeaderOptions,
});
await retriever.addDocuments(pamDocs, {
  childDocChunkHeaderOptions: pamChunkHeaderOptions,
});

// This will search child documents in vector store with the help of chunk header,
// returning the unmodified parent documents
const retrievedDocs = await retriever.invoke("What is Pam&#x27;s favorite color?");

// Pam&#x27;s favorite color is returned first!
console.log(JSON.stringify(retrievedDocs, null, 2));
/*
  [
    {
      "pageContent": "My favorite color is red.",
      "metadata": {
        "loc": {
          "lines": {
            "from": 1,
            "to": 1
          }
        }
      }
    },
    {
      "pageContent": "My favorite color is blue.",
      "metadata": {
        "loc": {
          "lines": {
            "from": 1,
            "to": 1
          }
        }
      }
    }
  ]
*/

const rawDocs = await vectorstore.similaritySearch(
  "What is Pam&#x27;s favorite color?"
);

// Raw docs in vectorstore are short but have chunk headers
console.log(JSON.stringify(rawDocs, null, 2));

/*
  [
    {
      "pageContent": "DOC NAME: Pam Interview\n---\n(cont&#x27;d) color is",
      "metadata": {
        "loc": {
          "lines": {
            "from": 1,
            "to": 1
          }
        },
        "doc_id": "affdcbeb-6bfb-42e9-afe5-80f4f2e9f6aa"
      }
    },
    {
      "pageContent": "DOC NAME: Pam Interview\n---\n(cont&#x27;d) favorite",
      "metadata": {
        "loc": {
          "lines": {
            "from": 1,
            "to": 1
          }
        },
        "doc_id": "affdcbeb-6bfb-42e9-afe5-80f4f2e9f6aa"
      }
    },
    {
      "pageContent": "DOC NAME: Pam Interview\n---\n(cont&#x27;d) red.",
      "metadata": {
        "loc": {
          "lines": {
            "from": 1,
            "to": 1
          }
        },
        "doc_id": "affdcbeb-6bfb-42e9-afe5-80f4f2e9f6aa"
      }
    },
    {
      "pageContent": "DOC NAME: Pam Interview\n---\nMy",
      "metadata": {
        "loc": {
          "lines": {
            "from": 1,
            "to": 1
          }
        },
        "doc_id": "affdcbeb-6bfb-42e9-afe5-80f4f2e9f6aa"
      }
    }
  ]
*/

```

#### API Reference: - OpenAIEmbeddings from @langchain/openai - HNSWLib from @langchain/community/vectorstores/hnswlib - InMemoryStore from @langchain/core/stores - ParentDocumentRetriever from langchain/retrievers/parent_document - RecursiveCharacterTextSplitter from @langchain/textsplitters ## With Reranking[​](#with-reranking) With many documents from the vector store that are passed to LLM, final answers sometimes consist of information from irrelevant chunks, making it less precise and sometimes incorrect. Also, passing multiple irrelevant documents makes it more expensive. So there are two reasons to use rerank - precision and costs.

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { CohereRerank } from "@langchain/cohere";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { InMemoryStore } from "@langchain/core/stores";
import {
  ParentDocumentRetriever,
  type SubDocs,
} from "langchain/retrievers/parent_document";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// init Cohere Rerank. Remember to add COHERE_API_KEY to your .env
const reranker = new CohereRerank({
  topN: 50,
  model: "rerank-multilingual-v2.0",
});

export function documentCompressorFiltering({
  relevanceScore,
}: { relevanceScore?: number } = {}) {
  return (docs: SubDocs) => {
    let outputDocs = docs;

    if (relevanceScore) {
      const docsRelevanceScoreValues = docs.map(
        (doc) => doc?.metadata?.relevanceScore
      );
      outputDocs = docs.filter(
        (_doc, index) =>
          (docsRelevanceScoreValues?.[index] || 1) >= relevanceScore
      );
    }

    return outputDocs;
  };
}

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 0,
});

const jimDocs = await splitter.createDocuments([`Jim favorite color is blue.`]);

const pamDocs = await splitter.createDocuments([`Pam favorite color is red.`]);

const vectorstore = await HNSWLib.fromDocuments([], new OpenAIEmbeddings());
const byteStore = new InMemoryStore<Uint8Array>();

const retriever = new ParentDocumentRetriever({
  vectorstore,
  byteStore,
  // Very small chunks for demo purposes.
  // Use a bigger chunk size for serious use-cases.
  childSplitter: new RecursiveCharacterTextSplitter({
    chunkSize: 10,
    chunkOverlap: 0,
  }),
  childK: 50,
  parentK: 5,
  // We add Reranker
  documentCompressor: reranker,
  documentCompressorFilteringFn: documentCompressorFiltering({
    relevanceScore: 0.3,
  }),
});

const docs = jimDocs.concat(pamDocs);
await retriever.addDocuments(docs);

// This will search for documents in vector store and return for LLM already reranked and sorted document
// with appropriate minimum relevance score
const retrievedDocs = await retriever.invoke("What is Pam&#x27;s favorite color?");

// Pam&#x27;s favorite color is returned first!
console.log(JSON.stringify(retrievedDocs, null, 2));
/*
  [
    {
      "pageContent": "My favorite color is red.",
      "metadata": {
        "relevanceScore": 0.9
        "loc": {
          "lines": {
            "from": 1,
            "to": 1
          }
        }
      }
    }
  ]
*/

```

#### API Reference: - OpenAIEmbeddings from @langchain/openai - CohereRerank from @langchain/cohere - HNSWLib from @langchain/community/vectorstores/hnswlib - InMemoryStore from @langchain/core/stores - ParentDocumentRetriever from langchain/retrievers/parent_document - SubDocs from langchain/retrievers/parent_document - RecursiveCharacterTextSplitter from @langchain/textsplitters ## Next steps[​](#next-steps) You&#x27;ve now learned how to use the `ParentDocumentRetriever`.

Next, check out the more general form of [generating multiple embeddings per document](/docs/how_to/multi_vector), the [broader tutorial on RAG](/docs/tutorials/rag), or this section to learn how to [create your own custom retriever over any data source](/docs/how_to/custom_retriever/).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Usage](#usage)
- [With Score Threshold](#with-score-threshold)
- [With Contextual chunk headers](#with-contextual-chunk-headers)
- [With Reranking](#with-reranking)
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