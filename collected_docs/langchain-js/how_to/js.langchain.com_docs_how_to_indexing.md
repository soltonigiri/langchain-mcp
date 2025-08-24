How to reindex data to keep your vectorstore in-sync with the underlying data source | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to reindex data to keep your vectorstore in-sync with the underlying data sourcePrerequisitesThis guide assumes familiarity with the following concepts:Retrieval-augmented generation (RAG)](/docs/tutorials/rag/)
- [Vector stores](/docs/concepts/#vectorstores)

Here, we will look at a basic indexing workflow using the LangChain indexing API.

The indexing API lets you load and keep in sync documents from any source into a vector store. Specifically, it helps:

- Avoid writing duplicated content into the vector store
- Avoid re-writing unchanged content
- Avoid re-computing embeddings over unchanged content

All of which should save you time and money, as well as improve your vector search results.

Crucially, the indexing API will work even with documents that have gone through several transformation steps (e.g., via text chunking) with respect to the original source documents.

## How it works[​](#how-it-works)

LangChain indexing makes use of a record manager (`RecordManager`) that keeps track of document writes into the vector store.

When indexing content, hashes are computed for each document, and the following information is stored in the record manager:

- the document hash (hash of both page content and metadata)
- write time
- the source ID - each document should include information in its metadata to allow us to determine the ultimate source of this document

## Deletion Modes[​](#deletion-modes)

When indexing documents into a vector store, it&#x27;s possible that some existing documents in the vector store should be deleted. In certain situations you may want to remove any existing documents that are derived from the same sources as the new documents being indexed. In others you may want to delete all existing documents wholesale. The indexing API deletion modes let you pick the behavior you want:

| Cleanup Mode | De-Duplicates Content | Parallelizable | Cleans Up Deleted Source Docs | Cleans Up Mutations of Source Docs and/or Derived Docs | Clean Up Timing |

| None | ✅ | ✅ | ❌ | ❌ | - |

| Incremental | ✅ | ✅ | ❌ | ✅ | Continuously |

| Full | ✅ | ❌ | ✅ | ✅ | At end of indexing |

`None` does not do any automatic clean up, allowing the user to manually do clean up of old content.

`incremental` and `full` offer the following automated clean up:

- If the content of the source document or derived documents has changed, both incremental or full modes will clean up (delete) previous versions of the content.
- If the source document has been deleted (meaning it is not included in the documents currently being indexed), the full cleanup mode will delete it from the vector store correctly, but the incremental mode will not.

When content is mutated (e.g., the source PDF file was revised) there will be a period of time during indexing when both the new and old versions may be returned to the user. This happens after the new content was written, but before the old version was deleted.

- incremental indexing minimizes this period of time as it is able to do clean up continuously, as it writes.
- full mode does the clean up after all batches have been written.

## Requirements[​](#requirements)

- Do not use with a store that has been pre-populated with content independently of the indexing API, as the record manager will not know that records have been inserted previously.
- Only works with LangChain vectorstore&#x27;s that support: a). document addition by id (addDocuments method with ids argument) b). delete by id (delete method with ids argument)

Compatible Vectorstores: [PGVector](/docs/integrations/vectorstores/pgvector), [Chroma](/docs/integrations/vectorstores/chroma), [CloudflareVectorize](/docs/integrations/vectorstores/cloudflare_vectorize), [ElasticVectorSearch](/docs/integrations/vectorstores/elasticsearch), [FAISS](/docs/integrations/vectorstores/faiss), [MariaDB](/docs/integrations/vectorstores/mariadb), [MomentoVectorIndex](/docs/integrations/vectorstores/momento_vector_index), [Pinecone](/docs/integrations/vectorstores/pinecone), [SupabaseVectorStore](/docs/integrations/vectorstores/supabase), [VercelPostgresVectorStore](/docs/integrations/vectorstores/vercel_postgres), [Weaviate](/docs/integrations/vectorstores/weaviate), [Xata](/docs/integrations/vectorstores/xata)

## Caution[​](#caution)

The record manager relies on a time-based mechanism to determine what content can be cleaned up (when using `full` or `incremental` cleanup modes).

If two tasks run back-to-back, and the first task finishes before the clock time changes, then the second task may not be able to clean up content.

This is unlikely to be an issue in actual settings for the following reasons:

- The RecordManager uses higher resolution timestamps.
- The data would need to change between the first and the second tasks runs, which becomes unlikely if the time interval between the tasks is small.
- Indexing tasks typically take more than a few ms.

## Quickstart[​](#quickstart)

```typescript
import { PostgresRecordManager } from "@langchain/community/indexes/postgres";
import { index } from "langchain/indexes";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { PoolConfig } from "pg";
import { OpenAIEmbeddings } from "@langchain/openai";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { BaseDocumentLoader } from "@langchain/core/document_loaders/base";

// First, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pgvector

const config = {
  postgresConnectionOptions: {
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    user: "myuser",
    password: "ChangeMe",
    database: "api",
  } as PoolConfig,
  tableName: "testlangchain",
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
};

const vectorStore = await PGVectorStore.initialize(
  new OpenAIEmbeddings(),
  config
);

// Create a new record manager
const recordManagerConfig = {
  postgresConnectionOptions: {
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    user: "myuser",
    password: "ChangeMe",
    database: "api",
  } as PoolConfig,
  tableName: "upsertion_records",
};
const recordManager = new PostgresRecordManager(
  "test_namespace",
  recordManagerConfig
);

// Create the schema if it doesn&#x27;t exist
await recordManager.createSchema();

// Index some documents
const doc1 = {
  pageContent: "kitty",
  metadata: { source: "kitty.txt" },
};

const doc2 = {
  pageContent: "doggy",
  metadata: { source: "doggy.txt" },
};

/**
 * Hacky helper method to clear content. See the `full` mode section to to understand why it works.
 */
async function clear() {
  await index({
    docsSource: [],
    recordManager,
    vectorStore,
    options: {
      cleanup: "full",
      sourceIdKey: "source",
    },
  });
}

// No cleanup
await clear();
// This mode does not do automatic clean up of old versions of content; however, it still takes care of content de-duplication.

console.log(
  await index({
    docsSource: [doc1, doc1, doc1, doc1, doc1, doc1],
    recordManager,
    vectorStore,
    options: {
      cleanup: undefined,
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 1,
        numUpdated: 0,
        numDeleted: 0,
        numSkipped: 0,
    }
*/

await clear();

console.log(
  await index({
    docsSource: [doc1, doc2],
    recordManager,
    vectorStore,
    options: {
      cleanup: undefined,
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 2,
        numUpdated: 0,
        numDeleted: 0,
        numSkipped: 0,
    }
*/

// Second time around all content will be skipped

console.log(
  await index({
    docsSource: [doc1, doc2],
    recordManager,
    vectorStore,
    options: {
      cleanup: undefined,
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 0,
        numUpdated: 0,
        numDeleted: 0,
        numSkipped: 2,
    }
*/

// Updated content will be added, but old won&#x27;t be deleted

const doc1Updated = {
  pageContent: "kitty updated",
  metadata: { source: "kitty.txt" },
};

console.log(
  await index({
    docsSource: [doc1Updated, doc2],
    recordManager,
    vectorStore,
    options: {
      cleanup: undefined,
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 1,
        numUpdated: 0,
        numDeleted: 0,
        numSkipped: 1,
    }
*/

/*
Resulting records in the database:
    [
        {
            pageContent: "kitty",
            metadata: { source: "kitty.txt" },
        },
        {
            pageContent: "doggy",
            metadata: { source: "doggy.txt" },
        },
        {
            pageContent: "kitty updated",
            metadata: { source: "kitty.txt" },
        }
    ]
*/

// Incremental mode
await clear();

console.log(
  await index({
    docsSource: [doc1, doc2],
    recordManager,
    vectorStore,
    options: {
      cleanup: "incremental",
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 2,
        numUpdated: 0,
        numDeleted: 0,
        numSkipped: 0,
    }
*/

// Indexing again should result in both documents getting skipped – also skipping the embedding operation!

console.log(
  await index({
    docsSource: [doc1, doc2],
    recordManager,
    vectorStore,
    options: {
      cleanup: "incremental",
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 0,
        numUpdated: 0,
        numDeleted: 0,
        numSkipped: 2,
    }
*/

// If we provide no documents with incremental indexing mode, nothing will change.
console.log(
  await index({
    docsSource: [],
    recordManager,
    vectorStore,
    options: {
      cleanup: "incremental",
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 0,
        numUpdated: 0,
        numDeleted: 0,
        numSkipped: 0,
    }
*/

// If we mutate a document, the new version will be written and all old versions sharing the same source will be deleted.
// This only affects the documents with the same source id!

const changedDoc1 = {
  pageContent: "kitty updated",
  metadata: { source: "kitty.txt" },
};
console.log(
  await index({
    docsSource: [changedDoc1],
    recordManager,
    vectorStore,
    options: {
      cleanup: "incremental",
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 1,
        numUpdated: 0,
        numDeleted: 1,
        numSkipped: 0,
    }
*/

// Full mode
await clear();
// In full mode the user should pass the full universe of content that should be indexed into the indexing function.

// Any documents that are not passed into the indexing function and are present in the vectorStore will be deleted!

// This behavior is useful to handle deletions of source documents.
const allDocs = [doc1, doc2];
console.log(
  await index({
    docsSource: allDocs,
    recordManager,
    vectorStore,
    options: {
      cleanup: "full",
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 2,
        numUpdated: 0,
        numDeleted: 0,
        numSkipped: 0,
    }
*/

// Say someone deleted the first doc:

const doc2Only = [doc2];

// Using full mode will clean up the deleted content as well.
// This afffects all documents regardless of source id!

console.log(
  await index({
    docsSource: doc2Only,
    recordManager,
    vectorStore,
    options: {
      cleanup: "full",
      sourceIdKey: "source",
    },
  })
);

/*
    {
        numAdded: 0,
        numUpdated: 0,
        numDeleted: 1,
        numSkipped: 1,
    }
*/

await clear();

const newDoc1 = {
  pageContent: "kitty kitty kitty kitty kitty",
  metadata: { source: "kitty.txt" },
};

const newDoc2 = {
  pageContent: "doggy doggy the doggy",
  metadata: { source: "doggy.txt" },
};

const splitter = new CharacterTextSplitter({
  separator: "t",
  keepSeparator: true,
  chunkSize: 12,
  chunkOverlap: 2,
});

const newDocs = await splitter.splitDocuments([newDoc1, newDoc2]);
console.log(newDocs);
/*
[
  {
    pageContent: &#x27;kitty kit&#x27;,
    metadata: {source: &#x27;kitty.txt&#x27;}
  },
  {
    pageContent: &#x27;tty kitty ki&#x27;,
    metadata: {source: &#x27;kitty.txt&#x27;}
  },
  {
    pageContent: &#x27;tty kitty&#x27;,
    metadata: {source: &#x27;kitty.txt&#x27;},
  },
  {
    pageContent: &#x27;doggy doggy&#x27;,
    metadata: {source: &#x27;doggy.txt&#x27;},
  {
    pageContent: &#x27;the doggy&#x27;,
    metadata: {source: &#x27;doggy.txt&#x27;},
  }
]
*/

console.log(
  await index({
    docsSource: newDocs,
    recordManager,
    vectorStore,
    options: {
      cleanup: "incremental",
      sourceIdKey: "source",
    },
  })
);
/*
{
    numAdded: 5,
    numUpdated: 0,
    numDeleted: 0,
    numSkipped: 0,
}
*/

const changedDoggyDocs = [
  {
    pageContent: "woof woof",
    metadata: { source: "doggy.txt" },
  },
  {
    pageContent: "woof woof woof",
    metadata: { source: "doggy.txt" },
  },
];

console.log(
  await index({
    docsSource: changedDoggyDocs,
    recordManager,
    vectorStore,
    options: {
      cleanup: "incremental",
      sourceIdKey: "source",
    },
  })
);

/*
{
    numAdded: 2,
    numUpdated: 0,
    numDeleted: 2,
    numSkipped: 0,
}
*/

// Usage with document loaders

// Create a document loader
class MyCustomDocumentLoader extends BaseDocumentLoader {
  load() {
    return Promise.resolve([
      {
        pageContent: "kitty",
        metadata: { source: "kitty.txt" },
      },
      {
        pageContent: "doggy",
        metadata: { source: "doggy.txt" },
      },
    ]);
  }
}

await clear();

const loader = new MyCustomDocumentLoader();

console.log(
  await index({
    docsSource: loader,
    recordManager,
    vectorStore,
    options: {
      cleanup: "incremental",
      sourceIdKey: "source",
    },
  })
);

/*
{
    numAdded: 2,
    numUpdated: 0,
    numDeleted: 0,
    numSkipped: 0,
}
*/

// Closing resources
await recordManager.end();
await vectorStore.end();

```

#### API Reference: - PostgresRecordManager from @langchain/community/indexes/postgres - index from langchain/indexes - PGVectorStore from @langchain/community/vectorstores/pgvector - OpenAIEmbeddings from @langchain/openai - CharacterTextSplitter from @langchain/textsplitters - BaseDocumentLoader from @langchain/core/document_loaders/base ## Next steps[​](#next-steps) You&#x27;ve now learned how to use indexing in your RAG pipelines.

Next, check out some of the other sections on retrieval.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [How it works](#how-it-works)
- [Deletion Modes](#deletion-modes)
- [Requirements](#requirements)
- [Caution](#caution)
- [Quickstart](#quickstart)
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