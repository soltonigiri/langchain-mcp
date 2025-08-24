Document loaders | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/document_loaders.mdx) # Document loaders Prerequisites [Document loaders API reference](/docs/how_to/#document-loaders)

Document loaders are designed to load document objects. LangChain has hundreds of integrations with various data sources to load data from: Slack, Notion, Google Drive, etc.

## Integrations[​](#integrations)

You can find available integrations on the [Document loaders integrations page](/docs/integrations/document_loaders/).

## Interface[​](#interface)

Documents loaders implement the [BaseLoader interface](https://python.langchain.com/api_reference/core/document_loaders/langchain_core.document_loaders.base.BaseLoader.html).

Each DocumentLoader has its own specific parameters, but they can all be invoked in the same way with the `.load` method or `.lazy_load`.

Here&#x27;s a simple example:

```python
from langchain_community.document_loaders.csv_loader import CSVLoader

loader = CSVLoader(
    ...  # <-- Integration specific parameters here
)
data = loader.load()

```

When working with large datasets, you can use the `.lazy_load` method:

```python
for document in loader.lazy_load():
    print(document)

```

## Related resources[​](#related-resources) Please see the following resources for more information:

- [How-to guides for document loaders](/docs/how_to/#document-loaders)

- [Document API reference](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html)

- [Document loaders integrations](/docs/integrations/document_loaders/)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/document_loaders.mdx)

- [Integrations](#integrations)
- [Interface](#interface)
- [Related resources](#related-resources)

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