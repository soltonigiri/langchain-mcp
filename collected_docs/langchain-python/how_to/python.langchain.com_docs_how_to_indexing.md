How to use the LangChain indexing API | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/indexing.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/indexing.ipynb)How to use the LangChain indexing API Here, we will look at a basic indexing workflow using the LangChain indexing API. The indexing API lets you load and keep in sync documents from any source into a [vector store](/docs/concepts/vectorstores/). Specifically, it helps: Avoid writing duplicated content into the vector store Avoid re-writing unchanged content Avoid re-computing embeddings over unchanged content All of which should save you time and money, as well as improve your vector search results. Crucially, the indexing API will work even with documents that have gone through several transformation steps (e.g., via text chunking) with respect to the original source documents. How it works[​](#how-it-works) LangChain indexing makes use of a record manager (RecordManager) that keeps track of document writes into the vector store. When indexing content, hashes are computed for each document, and the following information is stored in the record manager: the document hash (hash of both page content and metadata) write time the source id -- each document should include information in its metadata to allow us to determine the ultimate source of this document Deletion modes[​](#deletion-modes) When indexing documents into a vector store, it&#x27;s possible that some existing documents in the vector store should be deleted. In certain situations you may want to remove any existing documents that are derived from the same sources as the new documents being indexed. In others you may want to delete all existing documents wholesale. The indexing API deletion modes let you pick the behavior you want: Cleanup ModeDe-Duplicates ContentParallelizableCleans Up Deleted Source DocsCleans Up Mutations of Source Docs and/or Derived DocsClean Up TimingNone✅✅❌❌-Incremental✅✅❌✅ContinuouslyFull✅❌✅✅At end of indexingScoped_Full✅✅❌✅At end of indexing None does not do any automatic clean up, allowing the user to manually do clean up of old content. incremental, full and scoped_full offer the following automated clean up: If the content of the source document or derived documents has changed**, all 3 modes will clean up (delete) previous versions of the content.

- If the source document has been **deleted** (meaning it is not included in the documents currently being indexed), the full cleanup mode will delete it from the vector store correctly, but the incremental and scoped_full mode will not.

When content is mutated (e.g., the source PDF file was revised) there will be a period of time during indexing when both the new and old versions may be returned to the user. This happens after the new content was written, but before the old version was deleted.

- incremental indexing minimizes this period of time as it is able to do clean up continuously, as it writes.

- full and scoped_full mode does the clean up after all batches have been written.

## Requirements[​](#requirements)

- Do not use with a store that has been pre-populated with content independently of the indexing API, as the record manager will not know that records have been inserted previously.

- Only works with LangChain vectorstore&#x27;s that support: document addition by id (add_documents method with ids argument)

- delete by id (delete method with ids argument)

Compatible Vectorstores: `Aerospike`, `AnalyticDB`, `AstraDB`, `AwaDB`, `AzureCosmosDBNoSqlVectorSearch`, `AzureCosmosDBVectorSearch`, `AzureSearch`, `Bagel`, `Cassandra`, `Chroma`, `CouchbaseVectorStore`, `DashVector`, `DatabricksVectorSearch`, `DeepLake`, `Dingo`, `ElasticVectorSearch`, `ElasticsearchStore`, `FAISS`, `HanaDB`, `Milvus`, `MongoDBAtlasVectorSearch`, `MyScale`, `OpenSearchVectorSearch`, `PGVector`, `Pinecone`, `Qdrant`, `Redis`, `Rockset`, `ScaNN`, `SingleStoreDB`, `SupabaseVectorStore`, `SurrealDBStore`, `TimescaleVector`, `Vald`, `VDMS`, `Vearch`, `VespaStore`, `Weaviate`, `Yellowbrick`, `ZepVectorStore`, `TencentVectorDB`, `OpenSearchVectorSearch`.

## Caution[​](#caution)

The record manager relies on a time-based mechanism to determine what content can be cleaned up (when using `full` or `incremental` or `scoped_full` cleanup modes).

If two tasks run back-to-back, and the first task finishes before the clock time changes, then the second task may not be able to clean up content.

This is unlikely to be an issue in actual settings for the following reasons:

- The RecordManager uses higher resolution timestamps.

- The data would need to change between the first and the second tasks runs, which becomes unlikely if the time interval between the tasks is small.

- Indexing tasks typically take more than a few ms.

## Quickstart[​](#quickstart)

```python
from langchain.indexes import SQLRecordManager, index
from langchain_core.documents import Document
from langchain_elasticsearch import ElasticsearchStore
from langchain_openai import OpenAIEmbeddings

```**API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html)

Initialize a vector store and set up the embeddings:

```python
collection_name = "test_index"

embedding = OpenAIEmbeddings()

vectorstore = ElasticsearchStore(
    es_url="http://localhost:9200", index_name="test_index", embedding=embedding
)

```**Initialize a record manager with an appropriate namespace. Suggestion:** Use a namespace that takes into account both the vector store and the collection name in the vector store; e.g., &#x27;redis/my_docs&#x27;, &#x27;chromadb/my_docs&#x27; or &#x27;postgres/my_docs&#x27;.

```python
namespace = f"elasticsearch/{collection_name}"
record_manager = SQLRecordManager(
    namespace, db_url="sqlite:///record_manager_cache.sql"
)

```**Create a schema before using the record manager.

```python
record_manager.create_schema()

``` Let&#x27;s index some test documents:

```python
doc1 = Document(page_content="kitty", metadata={"source": "kitty.txt"})
doc2 = Document(page_content="doggy", metadata={"source": "doggy.txt"})

``` Indexing into an empty vector store:

```python
def _clear():
    """Hacky helper method to clear content. See the `full` mode section to understand why it works."""
    index([], record_manager, vectorstore, cleanup="full", source_id_key="source")

``` None deletion mode[​](#none-deletion-mode) This mode does not do automatic clean up of old versions of content; however, it still takes care of content de-duplication.

```python
_clear()

```

```python
index(
    [doc1, doc1, doc1, doc1, doc1],
    record_manager,
    vectorstore,
    cleanup=None,
    source_id_key="source",
)

```

```output
{&#x27;num_added&#x27;: 1, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 0, &#x27;num_deleted&#x27;: 0}

```

```python
_clear()

```

```python
index([doc1, doc2], record_manager, vectorstore, cleanup=None, source_id_key="source")

```

```output
{&#x27;num_added&#x27;: 2, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 0, &#x27;num_deleted&#x27;: 0}

``` Second time around all content will be skipped:

```python
index([doc1, doc2], record_manager, vectorstore, cleanup=None, source_id_key="source")

```

```output
{&#x27;num_added&#x27;: 0, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 2, &#x27;num_deleted&#x27;: 0}

``` "incremental" deletion mode[​](#incremental-deletion-mode)

```python
_clear()

```

```python
index(
    [doc1, doc2],
    record_manager,
    vectorstore,
    cleanup="incremental",
    source_id_key="source",
)

```

```output
{&#x27;num_added&#x27;: 2, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 0, &#x27;num_deleted&#x27;: 0}

``` Indexing again should result in both documents getting skipped** -- also skipping the embedding operation!

```python
index(
    [doc1, doc2],
    record_manager,
    vectorstore,
    cleanup="incremental",
    source_id_key="source",
)

```**

```output
{&#x27;num_added&#x27;: 0, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 2, &#x27;num_deleted&#x27;: 0}

``` If we provide no documents with incremental indexing mode, nothing will change.

```python
index([], record_manager, vectorstore, cleanup="incremental", source_id_key="source")

```

```output
{&#x27;num_added&#x27;: 0, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 0, &#x27;num_deleted&#x27;: 0}

``` If we mutate a document, the new version will be written and all old versions sharing the same source will be deleted.

```python
changed_doc_2 = Document(page_content="puppy", metadata={"source": "doggy.txt"})

```

```python
index(
    [changed_doc_2],
    record_manager,
    vectorstore,
    cleanup="incremental",
    source_id_key="source",
)

```

```output
{&#x27;num_added&#x27;: 1, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 0, &#x27;num_deleted&#x27;: 1}

``` "full" deletion mode[​](#full-deletion-mode) In full mode the user should pass the full universe of content that should be indexed into the indexing function. Any documents that are not passed into the indexing function and are present in the vectorstore will be deleted! This behavior is useful to handle deletions of source documents.

```python
_clear()

```

```python
all_docs = [doc1, doc2]

```

```python
index(all_docs, record_manager, vectorstore, cleanup="full", source_id_key="source")

```

```output
{&#x27;num_added&#x27;: 2, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 0, &#x27;num_deleted&#x27;: 0}

``` Say someone deleted the first doc:

```python
del all_docs[0]

```

```python
all_docs

```

```output
[Document(page_content=&#x27;doggy&#x27;, metadata={&#x27;source&#x27;: &#x27;doggy.txt&#x27;})]

``` Using full mode will clean up the deleted content as well.

```python
index(all_docs, record_manager, vectorstore, cleanup="full", source_id_key="source")

```

```output
{&#x27;num_added&#x27;: 0, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 1, &#x27;num_deleted&#x27;: 1}

``` Source[​](#source) The metadata attribute contains a field called source. This source should be pointing at the ultimate provenance associated with the given document. For example, if these documents are representing chunks of some parent document, the source for both documents should be the same and reference the parent document. In general, source should always be specified. Only use a None, if you never** intend to use `incremental` mode, and for some reason can&#x27;t specify the `source` field correctly.

```python
from langchain_text_splitters import CharacterTextSplitter

```**

```python
doc1 = Document(
    page_content="kitty kitty kitty kitty kitty", metadata={"source": "kitty.txt"}
)
doc2 = Document(page_content="doggy doggy the doggy", metadata={"source": "doggy.txt"})

```

```python
new_docs = CharacterTextSplitter(
    separator="t", keep_separator=True, chunk_size=12, chunk_overlap=2
).split_documents([doc1, doc2])
new_docs

```

```output
[Document(page_content=&#x27;kitty kit&#x27;, metadata={&#x27;source&#x27;: &#x27;kitty.txt&#x27;}),
 Document(page_content=&#x27;tty kitty ki&#x27;, metadata={&#x27;source&#x27;: &#x27;kitty.txt&#x27;}),
 Document(page_content=&#x27;tty kitty&#x27;, metadata={&#x27;source&#x27;: &#x27;kitty.txt&#x27;}),
 Document(page_content=&#x27;doggy doggy&#x27;, metadata={&#x27;source&#x27;: &#x27;doggy.txt&#x27;}),
 Document(page_content=&#x27;the doggy&#x27;, metadata={&#x27;source&#x27;: &#x27;doggy.txt&#x27;})]

```

```python
_clear()

```

```python
index(
    new_docs,
    record_manager,
    vectorstore,
    cleanup="incremental",
    source_id_key="source",
)

```

```output
{&#x27;num_added&#x27;: 5, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 0, &#x27;num_deleted&#x27;: 0}

```

```python
changed_doggy_docs = [
    Document(page_content="woof woof", metadata={"source": "doggy.txt"}),
    Document(page_content="woof woof woof", metadata={"source": "doggy.txt"}),
]

``` This should delete the old versions of documents associated with doggy.txt source and replace them with the new versions.

```python
index(
    changed_doggy_docs,
    record_manager,
    vectorstore,
    cleanup="incremental",
    source_id_key="source",
)

```

```output
{&#x27;num_added&#x27;: 2, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 0, &#x27;num_deleted&#x27;: 2}

```

```python
vectorstore.similarity_search("dog", k=30)

```

```output
[Document(page_content=&#x27;woof woof&#x27;, metadata={&#x27;source&#x27;: &#x27;doggy.txt&#x27;}),
 Document(page_content=&#x27;woof woof woof&#x27;, metadata={&#x27;source&#x27;: &#x27;doggy.txt&#x27;}),
 Document(page_content=&#x27;tty kitty&#x27;, metadata={&#x27;source&#x27;: &#x27;kitty.txt&#x27;}),
 Document(page_content=&#x27;tty kitty ki&#x27;, metadata={&#x27;source&#x27;: &#x27;kitty.txt&#x27;}),
 Document(page_content=&#x27;kitty kit&#x27;, metadata={&#x27;source&#x27;: &#x27;kitty.txt&#x27;})]

``` Using with loaders[​](#using-with-loaders) Indexing can accept either an iterable of documents or else any loader. Attention:** The loader **must** set source keys correctly.

```python
from langchain_core.document_loaders import BaseLoader

class MyCustomLoader(BaseLoader):
    def lazy_load(self):
        text_splitter = CharacterTextSplitter(
            separator="t", keep_separator=True, chunk_size=12, chunk_overlap=2
        )
        docs = [
            Document(page_content="woof woof", metadata={"source": "doggy.txt"}),
            Document(page_content="woof woof woof", metadata={"source": "doggy.txt"}),
        ]
        yield from text_splitter.split_documents(docs)

    def load(self):
        return list(self.lazy_load())

```**API Reference:**[BaseLoader](https://python.langchain.com/api_reference/core/document_loaders/langchain_core.document_loaders.base.BaseLoader.html)

```python
_clear()

```

```python
loader = MyCustomLoader()

```

```python
loader.load()

```

```output
[Document(page_content=&#x27;woof woof&#x27;, metadata={&#x27;source&#x27;: &#x27;doggy.txt&#x27;}),
 Document(page_content=&#x27;woof woof woof&#x27;, metadata={&#x27;source&#x27;: &#x27;doggy.txt&#x27;})]

```

```python
index(loader, record_manager, vectorstore, cleanup="full", source_id_key="source")

```

```output
{&#x27;num_added&#x27;: 2, &#x27;num_updated&#x27;: 0, &#x27;num_skipped&#x27;: 0, &#x27;num_deleted&#x27;: 0}

```

```python
vectorstore.similarity_search("dog", k=30)

```

```output
[Document(page_content=&#x27;woof woof&#x27;, metadata={&#x27;source&#x27;: &#x27;doggy.txt&#x27;}),
 Document(page_content=&#x27;woof woof woof&#x27;, metadata={&#x27;source&#x27;: &#x27;doggy.txt&#x27;})]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/indexing.ipynb)

- [How it works](#how-it-works)
- [Deletion modes](#deletion-modes)
- [Requirements](#requirements)
- [Caution](#caution)
- [Quickstart](#quickstart)[None deletion mode](#none-deletion-mode)
- ["incremental" deletion mode](#incremental-deletion-mode)
- ["full" deletion mode](#full-deletion-mode)

- [Source](#source)
- [Using with loaders](#using-with-loaders)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)
- [Slack](https://www.langchain.com/join-community)

GitHub

- [Organization](https://github.com/langchain-ai)
- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)
- [YouTube](https://www.youtube.com/@LangChain)

Copyright © 2025 LangChain, Inc.