How to load HTML | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_html.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_html.ipynb) # How to load HTML The HyperText Markup Language or [HTML](https://en.wikipedia.org/wiki/HTML) is the standard markup language for documents designed to be displayed in a web browser. This covers how to load HTML documents into a LangChain [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html#langchain_core.documents.base.Document) objects that we can use downstream. Parsing HTML files often requires specialized tools. Here we demonstrate parsing via [Unstructured](https://docs.unstructured.io) and [BeautifulSoup4](https://beautiful-soup-4.readthedocs.io/en/latest/), which can be installed via pip. Head over to the integrations page to find integrations with additional services, such as [Azure AI Document Intelligence](/docs/integrations/document_loaders/azure_document_intelligence/) or [FireCrawl](/docs/integrations/document_loaders/firecrawl/). ## Loading HTML with Unstructured[​](#loading-html-with-unstructured)

```python
%pip install unstructured

```

```python
from langchain_community.document_loaders import UnstructuredHTMLLoader

file_path = "../../docs/integrations/document_loaders/example_data/fake-content.html"

loader = UnstructuredHTMLLoader(file_path)
data = loader.load()

print(data)

```

```output
[Document(page_content=&#x27;My First Heading\n\nMy first paragraph.&#x27;, metadata={&#x27;source&#x27;: &#x27;../../docs/integrations/document_loaders/example_data/fake-content.html&#x27;})]

``` ## Loading HTML with BeautifulSoup4[​](#loading-html-with-beautifulsoup4) We can also use BeautifulSoup4 to load HTML documents using the BSHTMLLoader. This will extract the text from the HTML into page_content, and the page title as title into metadata.

```python
%pip install bs4

```

```python
from langchain_community.document_loaders import BSHTMLLoader

loader = BSHTMLLoader(file_path)
data = loader.load()

print(data)

```

```output
[Document(page_content=&#x27;\nTest Title\n\n\nMy First Heading\nMy first paragraph.\n\n\n&#x27;, metadata={&#x27;source&#x27;: &#x27;../../docs/integrations/document_loaders/example_data/fake-content.html&#x27;, &#x27;title&#x27;: &#x27;Test Title&#x27;})]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/document_loader_html.ipynb)[Loading HTML with Unstructured](#loading-html-with-unstructured)
- [Loading HTML with BeautifulSoup4](#loading-html-with-beautifulsoup4)

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