How to load Markdown | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_markdown.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_markdown.ipynb)How to load Markdown [Markdown](https://en.wikipedia.org/wiki/Markdown) is a lightweight markup language for creating formatted text using a plain-text editor. Here we cover how to load Markdown documents into LangChain [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html#langchain_core.documents.base.Document) objects that we can use downstream. We will cover: Basic usage; Parsing of Markdown into elements such as titles, list items, and text. LangChain implements an [UnstructuredMarkdownLoader](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.markdown.UnstructuredMarkdownLoader.html) object which requires the [Unstructured](https://docs.unstructured.io/welcome/) package. First we install it:

```python
%pip install "unstructured[md]" nltk

``` Basic usage will ingest a Markdown file to a single document. Here we demonstrate on LangChain&#x27;s readme:

```python
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_core.documents import Document

markdown_path = "../../../README.md"
loader = UnstructuredMarkdownLoader(markdown_path)

data = loader.load()
assert len(data) == 1
assert isinstance(data[0], Document)
readme_content = data[0].page_content
print(readme_content[:250])

```API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html)

```output
🦜️🔗 LangChain

⚡ Build context-aware reasoning applications ⚡

Looking for the JS/TS library? Check out LangChain.js.

To help you ship LangChain apps to production faster, check out LangSmith.
LangSmith is a unified developer platform for building,

``` ## Retain Elements[​](#retain-elements) Under the hood, Unstructured creates different "elements" for different chunks of text. By default we combine those together, but you can easily keep that separation by specifying mode="elements".

```python
loader = UnstructuredMarkdownLoader(markdown_path, mode="elements")

data = loader.load()
print(f"Number of documents: {len(data)}\n")

for document in data[:2]:
    print(f"{document}\n")

```

```output
Number of documents: 66

page_content=&#x27;🦜️🔗 LangChain&#x27; metadata={&#x27;source&#x27;: &#x27;../../../README.md&#x27;, &#x27;category_depth&#x27;: 0, &#x27;last_modified&#x27;: &#x27;2024-06-28T15:20:01&#x27;, &#x27;languages&#x27;: [&#x27;eng&#x27;], &#x27;filetype&#x27;: &#x27;text/markdown&#x27;, &#x27;file_directory&#x27;: &#x27;../../..&#x27;, &#x27;filename&#x27;: &#x27;README.md&#x27;, &#x27;category&#x27;: &#x27;Title&#x27;}

page_content=&#x27;⚡ Build context-aware reasoning applications ⚡&#x27; metadata={&#x27;source&#x27;: &#x27;../../../README.md&#x27;, &#x27;last_modified&#x27;: &#x27;2024-06-28T15:20:01&#x27;, &#x27;languages&#x27;: [&#x27;eng&#x27;], &#x27;parent_id&#x27;: &#x27;200b8a7d0dd03f66e4f13456566d2b3a&#x27;, &#x27;filetype&#x27;: &#x27;text/markdown&#x27;, &#x27;file_directory&#x27;: &#x27;../../..&#x27;, &#x27;filename&#x27;: &#x27;README.md&#x27;, &#x27;category&#x27;: &#x27;NarrativeText&#x27;}

``` Note that in this case we recover three distinct element types:

```python
print(set(document.metadata["category"] for document in data))

```

```output
{&#x27;ListItem&#x27;, &#x27;NarrativeText&#x27;, &#x27;Title&#x27;}

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/document_loader_markdown.ipynb)[Retain Elements](#retain-elements)

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