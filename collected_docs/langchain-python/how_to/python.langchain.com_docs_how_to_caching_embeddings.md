Caching | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/caching_embeddings.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/caching_embeddings.ipynb)Caching [Embeddings](/docs/concepts/embedding_models/) can be stored or temporarily cached to avoid needing to recompute them. Caching embeddings can be done using a CacheBackedEmbeddings. The cache backed embedder is a wrapper around an embedder that caches embeddings in a key-value store. The text is hashed and the hash is used as the key in the cache. The main supported way to initialize a CacheBackedEmbeddings is from_bytes_store. It takes the following parameters: underlying_embedder: The embedder to use for embedding. document_embedding_cache: Any [ByteStore](/docs/integrations/stores/) for caching document embeddings. batch_size: (optional, defaults to None) The number of documents to embed between store updates. namespace: (optional, defaults to "") The namespace to use for document cache. This namespace is used to avoid collisions with other caches. For example, set it to the name of the embedding model used. query_embedding_cache: (optional, defaults to None or not caching) A [ByteStore](/docs/integrations/stores/) for caching query embeddings, or True to use the same store as document_embedding_cache. Attention**: Be sure to set the namespace parameter to avoid collisions of the same text embedded using different embeddings models.

- CacheBackedEmbeddings does not cache query embeddings by default. To enable query caching, one needs to specify a query_embedding_cache.

```python
from langchain.embeddings import CacheBackedEmbeddings

```

## Using with a Vector Store[​](#using-with-a-vector-store) First, let&#x27;s see an example that uses the local file system for storing embeddings and uses FAISS vector store for retrieval.

```python
%pip install --upgrade --quiet  langchain-openai faiss-cpu

```

```python
from langchain.storage import LocalFileStore
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter

underlying_embeddings = OpenAIEmbeddings()

store = LocalFileStore("./cache/")

cached_embedder = CacheBackedEmbeddings.from_bytes_store(
    underlying_embeddings, store, namespace=underlying_embeddings.model
)

``` The cache is empty prior to embedding:

```python
list(store.yield_keys())

```

```output
[]

``` Load the document, split it into chunks, embed each chunk and load it into the vector store.

```python
raw_documents = TextLoader("state_of_the_union.txt").load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
documents = text_splitter.split_documents(raw_documents)

```

Create the vector store:

```python
%%time
db = FAISS.from_documents(documents, cached_embedder)

```

```output
CPU times: user 218 ms, sys: 29.7 ms, total: 248 ms
Wall time: 1.02 s

``` If we try to create the vector store again, it&#x27;ll be much faster since it does not need to re-compute any embeddings.

```python
%%time
db2 = FAISS.from_documents(documents, cached_embedder)

```

```output
CPU times: user 15.7 ms, sys: 2.22 ms, total: 18 ms
Wall time: 17.2 ms

``` And here are some of the embeddings that got created:

```python
list(store.yield_keys())[:5]

```

```output
[&#x27;text-embedding-ada-00217a6727d-8916-54eb-b196-ec9c9d6ca472&#x27;,
 &#x27;text-embedding-ada-0025fc0d904-bd80-52da-95c9-441015bfb438&#x27;,
 &#x27;text-embedding-ada-002e4ad20ef-dfaa-5916-9459-f90c6d8e8159&#x27;,
 &#x27;text-embedding-ada-002ed199159-c1cd-5597-9757-f80498e8f17b&#x27;,
 &#x27;text-embedding-ada-0021297d37a-2bc1-5e19-bf13-6c950f075062&#x27;]

``` # Swapping the ByteStore In order to use a different `ByteStore`, just use it when creating your `CacheBackedEmbeddings`. Below, we create an equivalent cached embeddings object, except using the non-persistent `InMemoryByteStore` instead:

```python
from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import InMemoryByteStore

store = InMemoryByteStore()

cached_embedder = CacheBackedEmbeddings.from_bytes_store(
    underlying_embeddings, store, namespace=underlying_embeddings.model
)

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/caching_embeddings.ipynb)

- [Using with a Vector Store](#using-with-a-vector-store)

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