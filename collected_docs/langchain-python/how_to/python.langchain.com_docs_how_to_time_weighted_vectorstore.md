How to use a time-weighted vector store retriever | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/time_weighted_vectorstore.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/time_weighted_vectorstore.ipynb)How to use a time-weighted vector store retriever This [retriever](/docs/concepts/retrievers/) uses a combination of semantic [similarity](/docs/concepts/embedding_models/#measure-similarity) and a time decay. The algorithm for scoring them is:

```text
semantic_similarity + (1.0 - decay_rate) ^ hours_passed

``` Notably, hours_passed refers to the hours passed since the object in the retriever was last accessed**, not since it was created. This means that frequently accessed objects remain "fresh".

```python
from datetime import datetime, timedelta

import faiss
from langchain.retrievers import TimeWeightedVectorStoreRetriever
from langchain_community.docstore import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings

```**API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) ## Low decay rate[​](#low-decay-rate) A low decay rate (in this, to be extreme, we will set it close to 0) means memories will be "remembered" for longer. A decay rate of 0 means memories never be forgotten, making this retriever equivalent to the vector lookup.

```python
# Define your embedding model
embeddings_model = OpenAIEmbeddings()
# Initialize the vectorstore as empty
embedding_size = 1536
index = faiss.IndexFlatL2(embedding_size)
vectorstore = FAISS(embeddings_model, index, InMemoryDocstore({}), {})
retriever = TimeWeightedVectorStoreRetriever(
    vectorstore=vectorstore, decay_rate=0.0000000000000000000000001, k=1
)

```**

```python
yesterday = datetime.now() - timedelta(days=1)
retriever.add_documents(
    [Document(page_content="hello world", metadata={"last_accessed_at": yesterday})]
)
retriever.add_documents([Document(page_content="hello foo")])

```

```output
[&#x27;73679bc9-d425-49c2-9d74-de6356c73489&#x27;]

```

```python
# "Hello World" is returned first because it is most salient, and the decay rate is close to 0., meaning it&#x27;s still recent enough
retriever.invoke("hello world")

```

```output
[Document(metadata={&#x27;last_accessed_at&#x27;: datetime.datetime(2024, 10, 22, 16, 37, 40, 818583), &#x27;created_at&#x27;: datetime.datetime(2024, 10, 22, 16, 37, 37, 975074), &#x27;buffer_idx&#x27;: 0}, page_content=&#x27;hello world&#x27;)]

``` High decay rate[​](#high-decay-rate) With a high decay rate (e.g., several 9&#x27;s), the recency score quickly goes to 0! If you set this all the way to 1, recency is 0 for all objects, once again making this equivalent to a vector lookup.

```python
# Define your embedding model
embeddings_model = OpenAIEmbeddings()
# Initialize the vectorstore as empty
embedding_size = 1536
index = faiss.IndexFlatL2(embedding_size)
vectorstore = FAISS(embeddings_model, index, InMemoryDocstore({}), {})
retriever = TimeWeightedVectorStoreRetriever(
    vectorstore=vectorstore, decay_rate=0.999, k=1
)

```

```python
yesterday = datetime.now() - timedelta(days=1)
retriever.add_documents(
    [Document(page_content="hello world", metadata={"last_accessed_at": yesterday})]
)
retriever.add_documents([Document(page_content="hello foo")])

```

```output
[&#x27;379631f0-42c2-4773-8cc2-d36201e1e610&#x27;]

```

```python
# "Hello Foo" is returned first because "hello world" is mostly forgotten
retriever.invoke("hello world")

```

```output
[Document(metadata={&#x27;last_accessed_at&#x27;: datetime.datetime(2024, 10, 22, 16, 37, 46, 553633), &#x27;created_at&#x27;: datetime.datetime(2024, 10, 22, 16, 37, 43, 927429), &#x27;buffer_idx&#x27;: 1}, page_content=&#x27;hello foo&#x27;)]

``` Virtual time[​](#virtual-time) Using some utils in LangChain, you can mock out the time component.

```python
from langchain_core.utils import mock_now

```API Reference:**[mock_now](https://python.langchain.com/api_reference/core/utils/langchain_core.utils.utils.mock_now.html)

```python
# Notice the last access time is that date time

tomorrow = datetime.now() + timedelta(days=1)

with mock_now(tomorrow):
    print(retriever.invoke("hello world"))

```

```output
[Document(metadata={&#x27;last_accessed_at&#x27;: MockDateTime(2024, 10, 23, 16, 38, 19, 66711), &#x27;created_at&#x27;: datetime.datetime(2024, 10, 22, 16, 37, 43, 599877), &#x27;buffer_idx&#x27;: 0}, page_content=&#x27;hello world&#x27;)]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/time_weighted_vectorstore.ipynb)[Low decay rate](#low-decay-rate)
- [High decay rate](#high-decay-rate)
- [Virtual time](#virtual-time)

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