How to combine results from multiple retrievers | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/ensemble_retriever.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/ensemble_retriever.ipynb)How to combine results from multiple retrievers The [EnsembleRetriever](https://python.langchain.com/api_reference/langchain/retrievers/langchain.retrievers.ensemble.EnsembleRetriever.html) supports ensembling of results from multiple [retrievers](/docs/concepts/retrievers/). It is initialized with a list of [BaseRetriever](https://python.langchain.com/api_reference/core/retrievers/langchain_core.retrievers.BaseRetriever.html) objects. EnsembleRetrievers rerank the results of the constituent retrievers based on the [Reciprocal Rank Fusion](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf) algorithm. By leveraging the strengths of different algorithms, the EnsembleRetriever can achieve better performance than any single algorithm. The most common pattern is to combine a sparse retriever (like BM25) with a dense retriever (like embedding similarity), because their strengths are complementary. It is also known as "hybrid search". The sparse retriever is good at finding relevant documents based on keywords, while the dense retriever is good at finding relevant documents based on semantic similarity. Basic usage[​](#basic-usage) Below we demonstrate ensembling of a [BM25Retriever](https://python.langchain.com/api_reference/community/retrievers/langchain_community.retrievers.bm25.BM25Retriever.html) with a retriever derived from the [FAISS vector store](https://python.langchain.com/api_reference/community/vectorstores/langchain_community.vectorstores.faiss.FAISS.html).

```python
%pip install --upgrade --quiet  rank_bm25 > /dev/null

```

```python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

doc_list_1 = [
    "I like apples",
    "I like oranges",
    "Apples and oranges are fruits",
]

# initialize the bm25 retriever and faiss retriever
bm25_retriever = BM25Retriever.from_texts(
    doc_list_1, metadatas=[{"source": 1}] * len(doc_list_1)
)
bm25_retriever.k = 2

doc_list_2 = [
    "You like apples",
    "You like oranges",
]

embedding = OpenAIEmbeddings()
faiss_vectorstore = FAISS.from_texts(
    doc_list_2, embedding, metadatas=[{"source": 2}] * len(doc_list_2)
)
faiss_retriever = faiss_vectorstore.as_retriever(search_kwargs={"k": 2})

# initialize the ensemble retriever
ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, faiss_retriever], weights=[0.5, 0.5]
)

```

```python
docs = ensemble_retriever.invoke("apples")
docs

```

```output
[Document(page_content=&#x27;I like apples&#x27;, metadata={&#x27;source&#x27;: 1}),
 Document(page_content=&#x27;You like apples&#x27;, metadata={&#x27;source&#x27;: 2}),
 Document(page_content=&#x27;Apples and oranges are fruits&#x27;, metadata={&#x27;source&#x27;: 1}),
 Document(page_content=&#x27;You like oranges&#x27;, metadata={&#x27;source&#x27;: 2})]

``` Runtime Configuration[​](#runtime-configuration) We can also configure the individual retrievers at runtime using [configurable fields](/docs/how_to/configure/). Below we update the "top-k" parameter for the FAISS retriever specifically:

```python
from langchain_core.runnables import ConfigurableField

faiss_retriever = faiss_vectorstore.as_retriever(
    search_kwargs={"k": 2}
).configurable_fields(
    search_kwargs=ConfigurableField(
        id="search_kwargs_faiss",
        name="Search Kwargs",
        description="The search kwargs to use",
    )
)

ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, faiss_retriever], weights=[0.5, 0.5]
)

```API Reference:**[ConfigurableField](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.utils.ConfigurableField.html)

```python
config = {"configurable": {"search_kwargs_faiss": {"k": 1}}}
docs = ensemble_retriever.invoke("apples", config=config)
docs

```

```output
[Document(page_content=&#x27;I like apples&#x27;, metadata={&#x27;source&#x27;: 1}),
 Document(page_content=&#x27;You like apples&#x27;, metadata={&#x27;source&#x27;: 2}),
 Document(page_content=&#x27;Apples and oranges are fruits&#x27;, metadata={&#x27;source&#x27;: 1})]

``` Notice that this only returns one source from the FAISS retriever, because we pass in the relevant configuration at run time[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/ensemble_retriever.ipynb)[Basic usage](#basic-usage)
- [Runtime Configuration](#runtime-configuration)

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