Custom Embeddings | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_embeddings.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_embeddings.ipynb)Custom Embeddings LangChain is integrated with many [3rd party embedding models](/docs/integrations/text_embedding/). In this guide we&#x27;ll show you how to create a custom Embedding class, in case a built-in one does not already exist. Embeddings are critical in natural language processing applications as they convert text into a numerical form that algorithms can understand, thereby enabling a wide range of applications such as similarity search, text classification, and clustering. Implementing embeddings using the standard [Embeddings](https://python.langchain.com/api_reference/core/embeddings/langchain_core.embeddings.embeddings.Embeddings.html) interface will allow your embeddings to be utilized in existing LangChain abstractions (e.g., as the embeddings powering a [VectorStore](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.base.VectorStore.html) or cached using [CacheBackedEmbeddings](/docs/how_to/caching_embeddings/)). Interface[​](#interface) The current Embeddings abstraction in LangChain is designed to operate on text data. In this implementation, the inputs are either single strings or lists of strings, and the outputs are lists of numerical arrays (vectors), where each vector represents an embedding of the input text into some n-dimensional space. Your custom embedding must implement the following methods: Method/PropertyDescriptionRequired/Optionalembed_documents(texts)Generates embeddings for a list of strings.Requiredembed_query(text)Generates an embedding for a single text query.Requiredaembed_documents(texts)Asynchronously generates embeddings for a list of strings.Optionalaembed_query(text)Asynchronously generates an embedding for a single text query.Optional These methods ensure that your embedding model can be integrated seamlessly into the LangChain framework, providing both synchronous and asynchronous capabilities for scalability and performance optimization. noteEmbeddings do not currently implement the [Runnable](/docs/concepts/runnables/) interface and are also not** instances of pydantic BaseModel. ### Embedding queries vs documents[​](#embedding-queries-vs-documents) The embed_query and embed_documents methods are required. These methods both operate on string inputs. The accessing of Document.page_content attributes is handled by the vector store using the embedding model for legacy reasons. embed_query takes in a single string and returns a single embedding as a list of floats. If your model has different modes for embedding queries vs the underlying documents, you can implement this method to handle that. embed_documents takes in a list of strings and returns a list of embeddings as a list of lists of floats. noteembed_documents takes in a list of plain text, not a list of LangChain Document objects. The name of this method may change in future versions of LangChain. ## Implementation[​](#implementation) As an example, we&#x27;ll implement a simple embeddings model that returns a constant vector. This model is for illustrative purposes only.

```python
from typing import List

from langchain_core.embeddings import Embeddings

class ParrotLinkEmbeddings(Embeddings):
    """ParrotLink embedding model integration.

    # TODO: Populate with relevant params.
    Key init args — completion params:
        model: str
            Name of ParrotLink model to use.

    See full list of supported init args and their descriptions in the params section.

    # TODO: Replace with relevant init params.
    Instantiate:
        .. code-block:: python

            from langchain_parrot_link import ParrotLinkEmbeddings

            embed = ParrotLinkEmbeddings(
                model="...",
                # api_key="...",
                # other params...
            )

    Embed single text:
        .. code-block:: python

            input_text = "The meaning of life is 42"
            embed.embed_query(input_text)

        .. code-block:: python

            # TODO: Example output.

    # TODO: Delete if token-level streaming isn&#x27;t supported.
    Embed multiple text:
        .. code-block:: python

             input_texts = ["Document 1...", "Document 2..."]
            embed.embed_documents(input_texts)

        .. code-block:: python

            # TODO: Example output.

    # TODO: Delete if native async isn&#x27;t supported.
    Async:
        .. code-block:: python

            await embed.aembed_query(input_text)

            # multiple:
            # await embed.aembed_documents(input_texts)

        .. code-block:: python

            # TODO: Example output.

    """

    def __init__(self, model: str):
        self.model = model

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed search docs."""
        return [[0.5, 0.6, 0.7] for _ in texts]

    def embed_query(self, text: str) -> List[float]:
        """Embed query text."""
        return self.embed_documents([text])[0]

    # optional: add custom async implementations here
    # you can also delete these, and the base class will
    # use the default implementation, which calls the sync
    # version in an async executor:

    # async def aembed_documents(self, texts: List[str]) -> List[List[float]]:
    #     """Asynchronous Embed search docs."""
    #     ...

    # async def aembed_query(self, text: str) -> List[float]:
    #     """Asynchronous Embed query text."""
    #     ...

```**API Reference:**[Embeddings](https://python.langchain.com/api_reference/core/embeddings/langchain_core.embeddings.embeddings.Embeddings.html) ### Let&#x27;s test it 🧪[​](#lets-test-it-)

```python
embeddings = ParrotLinkEmbeddings("test-model")
print(embeddings.embed_documents(["Hello", "world"]))
print(embeddings.embed_query("Hello"))

```

```output
[[0.5, 0.6, 0.7], [0.5, 0.6, 0.7]]
[0.5, 0.6, 0.7]

``` ## Contributing[​](#contributing) We welcome contributions of Embedding models to the LangChain code base. If you aim to contribute an embedding model for a new provider (e.g., with a new set of dependencies or SDK), we encourage you to publish your implementation in a separate langchain-* integration package. This will enable you to appropriately manage dependencies and version your package. Please refer to our [contributing guide](/docs/contributing/how_to/integrations/) for a walkthrough of this process.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/custom_embeddings.ipynb)[Interface](#interface)[Embedding queries vs documents](#embedding-queries-vs-documents)

- [Implementation](#implementation)[Let's test it 🧪](#lets-test-it-)

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