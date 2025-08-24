Custom Retriever | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_retriever.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_retriever.ipynb)How to create a custom Retriever Overview[​](#overview) Many LLM applications involve retrieving information from external data sources using a [Retriever](/docs/concepts/retrievers/). A retriever is responsible for retrieving a list of relevant [Documents](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) to a given user query. The retrieved documents are often formatted into prompts that are fed into an LLM, allowing the LLM to use the information in the to generate an appropriate response (e.g., answering a user question based on a knowledge base). Interface[​](#interface) To create your own retriever, you need to extend the BaseRetriever class and implement the following methods: MethodDescriptionRequired/Optional_get_relevant_documentsGet documents relevant to a query.Required_aget_relevant_documentsImplement to provide async native support.Optional The logic inside of _get_relevant_documents can involve arbitrary calls to a database or to the web using requests. tipBy inherting from BaseRetriever, your retriever automatically becomes a LangChain [Runnable](/docs/concepts/runnables/) and will gain the standard Runnable functionality out of the box! infoYou can use a RunnableLambda or RunnableGenerator to implement a retriever.The main benefit of implementing a retriever as a BaseRetriever vs. a RunnableLambda (a custom [runnable function](/docs/how_to/functions/)) is that a BaseRetriever is a well known LangChain entity so some tooling for monitoring may implement specialized behavior for retrievers. Another difference is that a BaseRetriever will behave slightly differently from RunnableLambda in some APIs; e.g., the start event in astream_events API will be on_retriever_start instead of on_chain_start. Example[​](#example) Let&#x27;s implement a toy retriever that returns all documents whose text contains the text in the user query.

```python
from typing import List

from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever

class ToyRetriever(BaseRetriever):
    """A toy retriever that contains the top k documents that contain the user query.

    This retriever only implements the sync method _get_relevant_documents.

    If the retriever were to involve file access or network access, it could benefit
    from a native async implementation of `_aget_relevant_documents`.

    As usual, with Runnables, there&#x27;s a default async implementation that&#x27;s provided
    that delegates to the sync implementation running on another thread.
    """

    documents: List[Document]
    """List of documents to retrieve from."""
    k: int
    """Number of top results to return"""

    def _get_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:
        """Sync implementations for retriever."""
        matching_documents = []
        for document in self.documents:
            if len(matching_documents) > self.k:
                return matching_documents

            if query.lower() in document.page_content.lower():
                matching_documents.append(document)
        return matching_documents

    # Optional: Provide a more efficient native implementation by overriding
    # _aget_relevant_documents
    # async def _aget_relevant_documents(
    #     self, query: str, *, run_manager: AsyncCallbackManagerForRetrieverRun
    # ) -> List[Document]:
    #     """Asynchronously get documents relevant to a query.

    #     Args:
    #         query: String to find relevant documents for
    #         run_manager: The callbacks handler to use

    #     Returns:
    #         List of relevant documents
    #     """

```API Reference:**[CallbackManagerForRetrieverRun](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.CallbackManagerForRetrieverRun.html) | [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) | [BaseRetriever](https://python.langchain.com/api_reference/core/retrievers/langchain_core.retrievers.BaseRetriever.html) ## Test it 🧪[​](#test-it-)

```python
documents = [
    Document(
        page_content="Dogs are great companions, known for their loyalty and friendliness.",
        metadata={"type": "dog", "trait": "loyalty"},
    ),
    Document(
        page_content="Cats are independent pets that often enjoy their own space.",
        metadata={"type": "cat", "trait": "independence"},
    ),
    Document(
        page_content="Goldfish are popular pets for beginners, requiring relatively simple care.",
        metadata={"type": "fish", "trait": "low maintenance"},
    ),
    Document(
        page_content="Parrots are intelligent birds capable of mimicking human speech.",
        metadata={"type": "bird", "trait": "intelligence"},
    ),
    Document(
        page_content="Rabbits are social animals that need plenty of space to hop around.",
        metadata={"type": "rabbit", "trait": "social"},
    ),
]
retriever = ToyRetriever(documents=documents, k=3)

```**

```python
retriever.invoke("that")

```

```output
[Document(page_content=&#x27;Cats are independent pets that often enjoy their own space.&#x27;, metadata={&#x27;type&#x27;: &#x27;cat&#x27;, &#x27;trait&#x27;: &#x27;independence&#x27;}),
 Document(page_content=&#x27;Rabbits are social animals that need plenty of space to hop around.&#x27;, metadata={&#x27;type&#x27;: &#x27;rabbit&#x27;, &#x27;trait&#x27;: &#x27;social&#x27;})]

``` It&#x27;s a runnable** so it&#x27;ll benefit from the standard Runnable Interface! 🤩

```python
await retriever.ainvoke("that")

```

```output
[Document(page_content=&#x27;Cats are independent pets that often enjoy their own space.&#x27;, metadata={&#x27;type&#x27;: &#x27;cat&#x27;, &#x27;trait&#x27;: &#x27;independence&#x27;}),
 Document(page_content=&#x27;Rabbits are social animals that need plenty of space to hop around.&#x27;, metadata={&#x27;type&#x27;: &#x27;rabbit&#x27;, &#x27;trait&#x27;: &#x27;social&#x27;})]

```

```python
retriever.batch(["dog", "cat"])

```

```output
[[Document(page_content=&#x27;Dogs are great companions, known for their loyalty and friendliness.&#x27;, metadata={&#x27;type&#x27;: &#x27;dog&#x27;, &#x27;trait&#x27;: &#x27;loyalty&#x27;})],
 [Document(page_content=&#x27;Cats are independent pets that often enjoy their own space.&#x27;, metadata={&#x27;type&#x27;: &#x27;cat&#x27;, &#x27;trait&#x27;: &#x27;independence&#x27;})]]

```

```python
async for event in retriever.astream_events("bar", version="v1"):
    print(event)

```

```output
{&#x27;event&#x27;: &#x27;on_retriever_start&#x27;, &#x27;run_id&#x27;: &#x27;f96f268d-8383-4921-b175-ca583924d9ff&#x27;, &#x27;name&#x27;: &#x27;ToyRetriever&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;bar&#x27;}}
{&#x27;event&#x27;: &#x27;on_retriever_stream&#x27;, &#x27;run_id&#x27;: &#x27;f96f268d-8383-4921-b175-ca583924d9ff&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;name&#x27;: &#x27;ToyRetriever&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: []}}
{&#x27;event&#x27;: &#x27;on_retriever_end&#x27;, &#x27;name&#x27;: &#x27;ToyRetriever&#x27;, &#x27;run_id&#x27;: &#x27;f96f268d-8383-4921-b175-ca583924d9ff&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;output&#x27;: []}}

``` ## Contributing[​](#contributing) We appreciate contributions of interesting retrievers! Here&#x27;s a checklist to help make sure your contribution gets added to LangChain: Documentation: The retriever contains doc-strings for all initialization arguments, as these will be surfaced in the [API Reference](https://python.langchain.com/api_reference/langchain/index.html).

- The class doc-string for the model contains a link to any relevant APIs used for the retriever (e.g., if the retriever is retrieving from wikipedia, it&#x27;ll be good to link to the wikipedia API!)

Tests:

- Add unit or integration tests to verify that invoke and ainvoke work.

Optimizations:

If the retriever is connecting to external data sources (e.g., an API or a file), it&#x27;ll almost certainly benefit from an async native optimization!

- Provide a native async implementation of _aget_relevant_documents (used by ainvoke)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/custom_retriever.ipynb)

- [Overview](#overview)
- [Interface](#interface)
- [Example](#example)
- [Test it 🧪](#test-it-)
- [Contributing](#contributing)

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