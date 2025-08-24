Text embedding models | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/embed_text.mdx) # Text embedding models infoHead to [Integrations](/docs/integrations/text_embedding/) for documentation on built-in integrations with text embedding model providers. The Embeddings class is a class designed for interfacing with text embedding models. There are lots of embedding model providers (OpenAI, Cohere, Hugging Face, etc) - this class is designed to provide a standard interface for all of them. Embeddings create a vector representation of a piece of text. This is useful because it means we can think about text in the vector space, and do things like semantic search where we look for pieces of text that are most similar in the vector space. The base Embeddings class in LangChain provides two methods: one for embedding documents and one for embedding a query. The former, .embed_documents, takes as input multiple texts, while the latter, .embed_query, takes a single text. The reason for having these as two separate methods is that some embedding providers have different embedding methods for documents (to be searched over) vs queries (the search query itself). .embed_query will return a list of floats, whereas .embed_documents returns a list of lists of floats. ## Get started[​](#get-started) ### Setup[​](#setup) Select [embeddings model](/docs/integrations/text_embedding/):OpenAI▾[OpenAI](#)
- [Azure](#)
- [Google Gemini](#)
- [Google Vertex](#)
- [AWS](#)
- [HuggingFace](#)
- [Ollama](#)
- [Cohere](#)
- [MistralAI](#)
- [Nomic](#)
- [NVIDIA](#)
- [Voyage AI](#)
- [IBM watsonx](#)
- [Fake](#)

```bash
pip install -qU langchain-openai

```

```python
import getpass
import os

if not os.environ.get("OPENAI_API_KEY"):
  os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")

from langchain_openai import OpenAIEmbeddings

embeddings_model = OpenAIEmbeddings(model="text-embedding-3-large")

``` ### embed_documents[​](#embed_documents) #### Embed list of texts[​](#embed-list-of-texts) Use `.embed_documents` to embed a list of strings, recovering a list of embeddings:

```python
embeddings = embeddings_model.embed_documents(
    [
        "Hi there!",
        "Oh, hello!",
        "What&#x27;s your name?",
        "My friends call me World",
        "Hello World!"
    ]
)
len(embeddings), len(embeddings[0])

```

```output
(5, 1536)

``` ### embed_query[​](#embed_query) #### Embed single query[​](#embed-single-query) Use `.embed_query` to embed a single piece of text (e.g., for the purpose of comparing to other embedded pieces of texts).

```python
embedded_query = embeddings_model.embed_query("What was the name mentioned in the conversation?")
embedded_query[:5]

```

```output
[0.0053587136790156364,
 -0.0004999046213924885,
 0.038883671164512634,
 -0.003001077566295862,
 -0.00900818221271038]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/embed_text.mdx)

- [Get started](#get-started)[Setup](#setup)
- [embed_documents](#embed_documents)
- [embed_query](#embed_query)

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