Vector stores | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/vectorstores/index.mdx)Vector stores A [vector store](/docs/concepts/vectorstores/) stores [embedded](/docs/concepts/embedding_models/) data and performs similarity search. Select embedding model:** Select [embeddings model](/docs/integrations/text_embedding/):**OpenAI▾[OpenAI](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[HuggingFace](#)[Ollama](#)[Cohere](#)[MistralAI](#)[Nomic](#)[NVIDIA](#)[Voyage AI](#)[IBM watsonx](#)[Fake](#)

```bash
pip install -qU langchain-openai

```

```python
import getpass
import os

if not os.environ.get("OPENAI_API_KEY"):
  os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")

from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

``` Select vector store:** Select [vector store](/docs/integrations/vectorstores/):In-memory▾[In-memory](#)
- [AstraDB](#)
- [Chroma](#)
- [FAISS](#)
- [Milvus](#)
- [MongoDB](#)
- [PGVector](#)
- [PGVectorStore](#)
- [Pinecone](#)
- [Qdrant](#)

```bash
pip install -qU langchain-core

```

```python
from langchain_core.vectorstores import InMemoryVectorStore

vector_store = InMemoryVectorStore(embeddings)

```

| Vectorstore | Delete by ID | Filtering | Search by Vector | Search with score | Async | Passes Standard Tests | Multi Tenancy | IDs in add Documents |

| [AstraDBVectorStore](astradb) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

| [Chroma](chroma) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

| [Clickhouse](clickhouse) | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

| [CouchbaseSearchVectorStore](couchbase) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |

| [DatabricksVectorSearch](databricks_vector_search) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

| [ElasticsearchStore](elasticsearch) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

| [FAISS](faiss) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

| [InMemoryVectorStore](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.in_memory.InMemoryVectorStore.html) | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |

| [Milvus](milvus) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

| [MongoDBAtlasVectorSearch](mongodb_atlas) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

| [openGauss](openGauss) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |

| [PGVector](pgvector) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

| [PGVectorStore](pgvectorstore) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

| [PineconeVectorStore](pinecone) | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |

| [QdrantVectorStore](qdrant) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |

| [Redis](redis) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

| [Weaviate](weaviate) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |

| [SQLServer](sqlserver) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |

## All Vectorstores[​](#all-vectorstores)

| Name | Description |

| [Activeloop Deep Lake](/docs/integrations/vectorstores/activeloop_deeplake) | Activeloop Deep Lake as a Multi-Modal Vector Store that stores embedd... |

| [Aerospike](/docs/integrations/vectorstores/aerospike) | Aerospike Vector Search (AVS) is an |

| [Alibaba Cloud OpenSearch](/docs/integrations/vectorstores/alibabacloud_opensearch) | Alibaba Cloud Opensearch is a one-stop platform to develop intelligen... |

| [AnalyticDB](/docs/integrations/vectorstores/analyticdb) | AnalyticDB for PostgreSQL is a massively parallel processing (MPP) da... |

| [Annoy](/docs/integrations/vectorstores/annoy) | Annoy (Approximate Nearest Neighbors Oh Yeah) is a C++ library with P... |

| [Apache Doris](/docs/integrations/vectorstores/apache_doris) | Apache Doris is a modern data warehouse for real-time analytics. |

| [ApertureDB](/docs/integrations/vectorstores/aperturedb) | ApertureDB is a database that stores, indexes, and manages multi-moda... |

| [Astra DB Vector Store](/docs/integrations/vectorstores/astradb) | This page provides a quickstart for using Astra DB as a Vector Store. |

| [Atlas](/docs/integrations/vectorstores/atlas) | Atlas is a platform by Nomic made for interacting with both small and... |

| [AwaDB](/docs/integrations/vectorstores/awadb) | AwaDB is an AI Native database for the search and storage of embeddin... |

| [Azure Cosmos DB Mongo vCore](/docs/integrations/vectorstores/azure_cosmos_db) | This notebook shows you how to leverage this integrated vector databa... |

| [Azure Cosmos DB No SQL](/docs/integrations/vectorstores/azure_cosmos_db_no_sql) | This notebook shows you how to leverage this integrated vector databa... |

| [Azure AI Search](/docs/integrations/vectorstores/azuresearch) | Azure AI Search (formerly known as Azure Search and Azure Cognitive S... |

| [Bagel](/docs/integrations/vectorstores/bagel) | Bagel (Open Inference platform for AI), is like GitHub for AI data. |

| [BagelDB](/docs/integrations/vectorstores/bageldb) | BagelDB (Open Vector Database for AI), is like GitHub for AI data. |

| [Baidu Cloud ElasticSearch VectorSearch](/docs/integrations/vectorstores/baiducloud_vector_search) | Baidu Cloud VectorSearch is a fully managed, enterprise-level distrib... |

| [Baidu VectorDB](/docs/integrations/vectorstores/baiduvectordb) | Baidu VectorDB is a robust, enterprise-level distributed database ser... |

| [Apache Cassandra](/docs/integrations/vectorstores/cassandra) | This page provides a quickstart for using Apache Cassandra® as a Vect... |

| [Chroma](/docs/integrations/vectorstores/chroma) | This notebook covers how to get started with the Chroma vector store. |

| [Clarifai](/docs/integrations/vectorstores/clarifai) | Clarifai is an AI Platform that provides the full AI lifecycle rangin... |

| [ClickHouse](/docs/integrations/vectorstores/clickhouse) | ClickHouse is the fastest and most resource efficient open-source dat... |

| [CloudflareVectorize](/docs/integrations/vectorstores/cloudflare_vectorize) | This notebook covers how to get started with the CloudflareVectorize ... |

| [Couchbase](/docs/integrations/vectorstores/couchbase) | Couchbase is an award-winning distributed NoSQL cloud database that d... |

| [DashVector](/docs/integrations/vectorstores/dashvector) | DashVector is a fully-managed vectorDB service that supports high-dim... |

| [Databricks](/docs/integrations/vectorstores/databricks_vector_search) | Databricks Vector Search is a serverless similarity search engine tha... |

| [IBM Db2 Vector Store and Vector Search](/docs/integrations/vectorstores/db2) | LangChain&#x27;s Db2 integration (langchain-db2) provides vector store and... |

| [DingoDB](/docs/integrations/vectorstores/dingo) | DingoDB is a distributed multi-mode vector database, which combines t... |

| [DocArray HnswSearch](/docs/integrations/vectorstores/docarray_hnsw) | DocArrayHnswSearch is a lightweight Document Index implementation pro... |

| [DocArray InMemorySearch](/docs/integrations/vectorstores/docarray_in_memory) | DocArrayInMemorySearch is a document index provided by Docarray that ... |

| [Amazon Document DB](/docs/integrations/vectorstores/documentdb) | Amazon DocumentDB (with MongoDB Compatibility) makes it easy to set u... |

| [DuckDB](/docs/integrations/vectorstores/duckdb) | This notebook shows how to use DuckDB as a vector store. |

| [China Mobile ECloud ElasticSearch VectorSearch](/docs/integrations/vectorstores/ecloud_vector_search) | China Mobile ECloud VectorSearch is a fully managed, enterprise-level... |

| [Elasticsearch](/docs/integrations/vectorstores/elasticsearch) | Elasticsearch is a distributed, RESTful search and analytics engine, ... |

| [Epsilla](/docs/integrations/vectorstores/epsilla) | Epsilla is an open-source vector database that leverages the advanced... |

| [Faiss](/docs/integrations/vectorstores/faiss) | Facebook AI Similarity Search (FAISS) is a library for efficient simi... |

| [Faiss (Async)](/docs/integrations/vectorstores/faiss_async) | Facebook AI Similarity Search (Faiss) is a library for efficient simi... |

| [FalkorDBVectorStore](/docs/integrations/vectorstores/falkordbvector) | FalkorDB is an open-source graph database with integrated support for... |

| [Gel](/docs/integrations/vectorstores/gel) | An implementation of LangChain vectorstore abstraction using gel as t... |

| [Google AlloyDB for PostgreSQL](/docs/integrations/vectorstores/google_alloydb) | AlloyDB is a fully managed relational database service that offers hi... |

| [Google BigQuery Vector Search](/docs/integrations/vectorstores/google_bigquery_vector_search) | Google Cloud BigQuery Vector Search lets you use GoogleSQL to do sema... |

| [Google Cloud SQL for MySQL](/docs/integrations/vectorstores/google_cloud_sql_mysql) | Cloud SQL is a fully managed relational database service that offers ... |

| [Google Cloud SQL for PostgreSQL](/docs/integrations/vectorstores/google_cloud_sql_pg) | Cloud SQL is a fully managed relational database service that offers ... |

| [Firestore](/docs/integrations/vectorstores/google_firestore) | Firestore is a serverless document-oriented database that scales to m... |

| [Google Memorystore for Redis](/docs/integrations/vectorstores/google_memorystore_redis) | Google Memorystore for Redis is a fully-managed service that is power... |

| [Google Spanner](/docs/integrations/vectorstores/google_spanner) | Spanner is a highly scalable database that combines unlimited scalabi... |

| [Google Vertex AI Feature Store](/docs/integrations/vectorstores/google_vertex_ai_feature_store) | Google Cloud Vertex Feature Store streamlines your ML feature managem... |

| [Google Vertex AI Vector Search](/docs/integrations/vectorstores/google_vertex_ai_vector_search) | This notebook shows how to use functionality related to the Google Cl... |

| [Hippo](/docs/integrations/vectorstores/hippo) | Transwarp Hippo is an enterprise-level cloud-native distributed vecto... |

| [Hologres](/docs/integrations/vectorstores/hologres) | Hologres is a unified real-time data warehousing service developed by... |

| [Infinispan](/docs/integrations/vectorstores/infinispanvs) | Infinispan is an open-source key-value data grid, it can work as sing... |

| [Jaguar Vector Database](/docs/integrations/vectorstores/jaguar) | 1. It is a distributed vector database |

| [KDB.AI](/docs/integrations/vectorstores/kdbai) | KDB.AI is a powerful knowledge-based vector database and search engin... |

| [Kinetica](/docs/integrations/vectorstores/kinetica) | Kinetica is a database with integrated support for vector similarity ... |

| [LanceDB](/docs/integrations/vectorstores/lancedb) | LanceDB is an open-source database for vector-search built with persi... |

| [Lantern](/docs/integrations/vectorstores/lantern) | Lantern is an open-source vector similarity search for Postgres |

| [Lindorm](/docs/integrations/vectorstores/lindorm) | This notebook covers how to get started with the Lindorm vector store. |

| [LLMRails](/docs/integrations/vectorstores/llm_rails) | LLMRails is a API platform for building GenAI applications. It provid... |

| [ManticoreSearch VectorStore](/docs/integrations/vectorstores/manticore_search) | ManticoreSearch is an open-source search engine that offers fast, sca... |

| [MariaDB](/docs/integrations/vectorstores/mariadb) | LangChain&#x27;s MariaDB integration (langchain-mariadb) provides vector c... |

| [Marqo](/docs/integrations/vectorstores/marqo) | This notebook shows how to use functionality related to the Marqo vec... |

| [Meilisearch](/docs/integrations/vectorstores/meilisearch) | Meilisearch is an open-source, lightning-fast, and hyper relevant sea... |

| [Amazon MemoryDB](/docs/integrations/vectorstores/memorydb) | Vector Search introduction and langchain integration guide. |

| [Milvus](/docs/integrations/vectorstores/milvus) | Milvus is a database that stores, indexes, and manages massive embedd... |

| [Momento Vector Index (MVI)](/docs/integrations/vectorstores/momento_vector_index) | MVI: the most productive, easiest to use, serverless vector index for... |

| [MongoDB Atlas](/docs/integrations/vectorstores/mongodb_atlas) | This notebook covers how to MongoDB Atlas vector search in LangChain,... |

| [MyScale](/docs/integrations/vectorstores/myscale) | MyScale is a cloud-based database optimized for AI applications and s... |

| [Neo4j Vector Index](/docs/integrations/vectorstores/neo4jvector) | Neo4j is an open-source graph database with integrated support for ve... |

| [NucliaDB](/docs/integrations/vectorstores/nucliadb) | You can use a local NucliaDB instance or use Nuclia Cloud. |

| [Oceanbase](/docs/integrations/vectorstores/oceanbase) | This notebook covers how to get started with the Oceanbase vector sto... |

| [openGauss](/docs/integrations/vectorstores/opengauss) | This notebook covers how to get started with the openGauss VectorStor... |

| [OpenSearch](/docs/integrations/vectorstores/opensearch) | OpenSearch is a scalable, flexible, and extensible open-source softwa... |

| [Oracle AI Vector Search: Vector Store](/docs/integrations/vectorstores/oracle) | Oracle AI Vector Search is designed for Artificial Intelligence (AI) ... |

| [Pathway](/docs/integrations/vectorstores/pathway) | Pathway is an open data processing framework. It allows you to easily... |

| [Postgres Embedding](/docs/integrations/vectorstores/pgembedding) | Postgres Embedding is an open-source vector similarity search for Pos... |

| [PGVecto.rs](/docs/integrations/vectorstores/pgvecto_rs) | This notebook shows how to use functionality related to the Postgres ... |

| [PGVector](/docs/integrations/vectorstores/pgvector) | An implementation of LangChain vectorstore abstraction using postgres... |

| [PGVectorStore](/docs/integrations/vectorstores/pgvectorstore) | PGVectorStore is an implementation of a LangChain vectorstore using p... |

| [Pinecone](/docs/integrations/vectorstores/pinecone) | Pinecone is a vector database with broad functionality. |

| [Pinecone (sparse)](/docs/integrations/vectorstores/pinecone_sparse) | Pinecone is a vector database with broad functionality. |

| [Qdrant](/docs/integrations/vectorstores/qdrant) | Qdrant (read: quadrant) is a vector similarity search engine. It prov... |

| [Redis](/docs/integrations/vectorstores/redis) | This notebook covers how to get started with the Redis vector store. |

| [Relyt](/docs/integrations/vectorstores/relyt) | Relyt is a cloud native data warehousing service that is designed to ... |

| [Rockset](/docs/integrations/vectorstores/rockset) | Rockset is a real-time search and analytics database built for the cl... |

| [SAP HANA Cloud Vector Engine](/docs/integrations/vectorstores/sap_hanavector) | SAP HANA Cloud Vector Engine is a vector store fully integrated into ... |

| [ScaNN](/docs/integrations/vectorstores/scann) | ScaNN (Scalable Nearest Neighbors) is a method for efficient vector s... |

| [SemaDB](/docs/integrations/vectorstores/semadb) | SemaDB from SemaFind is a no fuss vector similarity database for buil... |

| [SingleStore](/docs/integrations/vectorstores/singlestore) | SingleStore is a robust, high-performance distributed SQL database so... |

| [scikit-learn](/docs/integrations/vectorstores/sklearn) | scikit-learn is an open-source collection of machine learning algorit... |

| [SQLiteVec](/docs/integrations/vectorstores/sqlitevec) | This notebook covers how to get started with the SQLiteVec vector sto... |

| [SQLite-VSS](/docs/integrations/vectorstores/sqlitevss) | SQLite-VSS is an SQLite extension designed for vector search, emphasi... |

| [SQLServer](/docs/integrations/vectorstores/sqlserver) | Azure SQL provides a dedicated Vector data type that simplifies the c... |

| [StarRocks](/docs/integrations/vectorstores/starrocks) | StarRocks is a High-Performance Analytical Database. |

| [Supabase (Postgres)](/docs/integrations/vectorstores/supabase) | Supabase is an open-source Firebase alternative. Supabase is built on... |

| [SurrealDBVectorStore](/docs/integrations/vectorstores/surrealdb) | SurrealDB is a unified, multi-model database purpose-built for AI sys... |

| [Tablestore](/docs/integrations/vectorstores/tablestore) | Tablestore is a fully managed NoSQL cloud database service. |

| [Tair](/docs/integrations/vectorstores/tair) | Tair is a cloud native in-memory database service developed by Alibab... |

| [Tencent Cloud VectorDB](/docs/integrations/vectorstores/tencentvectordb) | Tencent Cloud VectorDB is a fully managed, self-developed, enterprise... |

| [ThirdAI NeuralDB](/docs/integrations/vectorstores/thirdai_neuraldb) | NeuralDB is a CPU-friendly and fine-tunable vector store developed by... |

| [TiDB Vector](/docs/integrations/vectorstores/tidb_vector) | TiDB Cloud, is a comprehensive Database-as-a-Service (DBaaS) solution... |

| [Tigris](/docs/integrations/vectorstores/tigris) | Tigris is an open-source Serverless NoSQL Database and Search Platfor... |

| [TileDB](/docs/integrations/vectorstores/tiledb) | TileDB is a powerful engine for indexing and querying dense and spars... |

| [Timescale Vector (Postgres)](/docs/integrations/vectorstores/timescalevector) | Timescale Vector is PostgreSQL++ vector database for AI applications. |

| [Typesense](/docs/integrations/vectorstores/typesense) | Typesense is an open-source, in-memory search engine, that you can ei... |

| [Upstash Vector](/docs/integrations/vectorstores/upstash) | Upstash Vector is a serverless vector database designed for working w... |

| [USearch](/docs/integrations/vectorstores/usearch) | USearch is a Smaller & Faster Single-File Vector Search Engine |

| [Vald](/docs/integrations/vectorstores/vald) | Vald is a highly scalable distributed fast approximate nearest neighb... |

| [VDMS](/docs/integrations/vectorstores/vdms) | This notebook covers how to get started with VDMS as a vector store. |

| [Vearch](/docs/integrations/vectorstores/vearch) | Vearch is the vector search infrastructure for deeping learning and A... |

| [Vectara](/docs/integrations/vectorstores/vectara) | Vectara is the trusted AI Assistant and Agent platform which focuses ... |

| [Vespa](/docs/integrations/vectorstores/vespa) | Vespa is a fully featured search engine and vector database. It suppo... |

| [viking DB](/docs/integrations/vectorstores/vikingdb) | viking DB is a database that stores, indexes, and manages massive emb... |

| [vlite](/docs/integrations/vectorstores/vlite) | VLite is a simple and blazing fast vector database that allows you to... |

| [Weaviate](/docs/integrations/vectorstores/weaviate) | This notebook covers how to get started with the Weaviate vector stor... |

| [Xata](/docs/integrations/vectorstores/xata) | Xata is a serverless data platform, based on PostgreSQL. It provides ... |

| [YDB](/docs/integrations/vectorstores/ydb) | YDB is a versatile open source Distributed SQL Database that combines... |

| [Yellowbrick](/docs/integrations/vectorstores/yellowbrick) | Yellowbrick is an elastic, massively parallel processing (MPP) SQL da... |

| [Zep](/docs/integrations/vectorstores/zep) | Recall, understand, and extract data from chat histories. Power perso... |

| [Zep Cloud](/docs/integrations/vectorstores/zep_cloud) | Recall, understand, and extract data from chat histories. Power perso... |

| [Zilliz](/docs/integrations/vectorstores/zilliz) | Zilliz Cloud is a fully managed service on cloud for LF AI Milvus®, |

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/vectorstores/index.mdx)

- [All Vectorstores](#all-vectorstores)

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