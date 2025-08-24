How to use a vectorstore as a retriever | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/vectorstore_retriever.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/vectorstore_retriever.ipynb) # How to use a vectorstore as a retriever A vector store retriever is a [retriever](/docs/concepts/retrievers/) that uses a [vector store](/docs/concepts/vectorstores/) to retrieve documents. It is a lightweight wrapper around the vector store class to make it conform to the retriever [interface](/docs/concepts/runnables/). It uses the search methods implemented by a vector store, like similarity search and MMR, to query the texts in the vector store. In this guide we will cover: How to instantiate a retriever from a vectorstore;

- How to specify the search type for the retriever;

- How to specify additional search parameters, such as threshold scores and top-k.

## Creating a retriever from a vectorstore[​](#creating-a-retriever-from-a-vectorstore)

You can build a retriever from a vectorstore using its [.as_retriever](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.base.VectorStore.html#langchain_core.vectorstores.base.VectorStore.as_retriever) method. Let&#x27;s walk through an example.

First we instantiate a vectorstore. We will use an in-memory [FAISS](https://python.langchain.com/api_reference/community/vectorstores/langchain_community.vectorstores.faiss.FAISS.html) vectorstore:

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter

loader = TextLoader("state_of_the_union.txt")

documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(texts, embeddings)

```

We can then instantiate a retriever:

```python
retriever = vectorstore.as_retriever()

```

This creates a retriever (specifically a [VectorStoreRetriever](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.base.VectorStoreRetriever.html)), which we can use in the usual way:

```python
docs = retriever.invoke("what did the president say about ketanji brown jackson?")

```

## Maximum marginal relevance retrieval[​](#maximum-marginal-relevance-retrieval) By default, the vector store retriever uses similarity search. If the underlying vector store supports maximum marginal relevance search, you can specify that as the search type.

This effectively specifies what method on the underlying vectorstore is used (e.g., `similarity_search`, `max_marginal_relevance_search`, etc.).

```python
retriever = vectorstore.as_retriever(search_type="mmr")

```

```python
docs = retriever.invoke("what did the president say about ketanji brown jackson?")

``` ## Passing search parameters[​](#passing-search-parameters) We can pass parameters to the underlying vectorstore&#x27;s search methods using `search_kwargs`.

### Similarity score threshold retrieval[​](#similarity-score-threshold-retrieval)

For example, we can set a similarity score threshold and only return documents with a score above that threshold.

```python
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold", search_kwargs={"score_threshold": 0.5}
)

```

```python
docs = retriever.invoke("what did the president say about ketanji brown jackson?")

``` ### Specifying top k[​](#specifying-top-k) We can also limit the number of documents `k` returned by the retriever.

```python
retriever = vectorstore.as_retriever(search_kwargs={"k": 1})

```

```python
docs = retriever.invoke("what did the president say about ketanji brown jackson?")
len(docs)

```

```output
1

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/vectorstore_retriever.ipynb)

- [Creating a retriever from a vectorstore](#creating-a-retriever-from-a-vectorstore)
- [Maximum marginal relevance retrieval](#maximum-marginal-relevance-retrieval)
- [Passing search parameters](#passing-search-parameters)[Similarity score threshold retrieval](#similarity-score-threshold-retrieval)
- [Specifying top k](#specifying-top-k)

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