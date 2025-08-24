How to split Markdown by Headers | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/markdown_header_metadata_splitter.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/markdown_header_metadata_splitter.ipynb) # How to split Markdown by Headers ### Motivation[​](#motivation) Many chat or Q+A applications involve chunking input documents prior to embedding and vector storage. [These notes](https://www.pinecone.io/learn/chunking-strategies/) from Pinecone provide some useful tips:

```text
When a full paragraph or document is embedded, the embedding process considers both the overall context and the relationships between the sentences and phrases within the text. This can result in a more comprehensive vector representation that captures the broader meaning and themes of the text.

``` As mentioned, chunking often aims to keep text with common context together. With this in mind, we might want to specifically honor the structure of the document itself. For example, a markdown file is organized by headers. Creating chunks within specific header groups is an intuitive idea. To address this challenge, we can use [MarkdownHeaderTextSplitter](https://python.langchain.com/api_reference/text_splitters/markdown/langchain_text_splitters.markdown.MarkdownHeaderTextSplitter.html). This will split a markdown file by a specified set of headers. For example, if we want to split this markdown:

```text
md = &#x27;# Foo\n\n ## Bar\n\nHi this is Jim  \nHi this is Joe\n\n ## Baz\n\n Hi this is Molly&#x27;

``` We can specify the headers to split on:

```text
[("#", "Header 1"),("##", "Header 2")]

``` And content is grouped or split by common headers:

```text
{&#x27;content&#x27;: &#x27;Hi this is Jim  \nHi this is Joe&#x27;, &#x27;metadata&#x27;: {&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Bar&#x27;}}
{&#x27;content&#x27;: &#x27;Hi this is Molly&#x27;, &#x27;metadata&#x27;: {&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Baz&#x27;}}

``` Let&#x27;s have a look at some examples below. ### Basic usage:[​](#basic-usage)

```python
%pip install -qU langchain-text-splitters

```

```python
from langchain_text_splitters import MarkdownHeaderTextSplitter

```

```python
markdown_document = "# Foo\n\n    ## Bar\n\nHi this is Jim\n\nHi this is Joe\n\n ### Boo \n\n Hi this is Lance \n\n ## Baz\n\n Hi this is Molly"

headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]

markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on)
md_header_splits = markdown_splitter.split_text(markdown_document)
md_header_splits

```

```output
[Document(page_content=&#x27;Hi this is Jim  \nHi this is Joe&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Bar&#x27;}),
 Document(page_content=&#x27;Hi this is Lance&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Bar&#x27;, &#x27;Header 3&#x27;: &#x27;Boo&#x27;}),
 Document(page_content=&#x27;Hi this is Molly&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Baz&#x27;})]

```

```python
type(md_header_splits[0])

```

```output
langchain_core.documents.base.Document

``` By default, MarkdownHeaderTextSplitter strips headers being split on from the output chunk&#x27;s content. This can be disabled by setting strip_headers = False.

```python
markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on, strip_headers=False)
md_header_splits = markdown_splitter.split_text(markdown_document)
md_header_splits

```

```output
[Document(page_content=&#x27;# Foo  \n## Bar  \nHi this is Jim  \nHi this is Joe&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Bar&#x27;}),
 Document(page_content=&#x27;### Boo  \nHi this is Lance&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Bar&#x27;, &#x27;Header 3&#x27;: &#x27;Boo&#x27;}),
 Document(page_content=&#x27;## Baz  \nHi this is Molly&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Baz&#x27;})]

``` noteThe default MarkdownHeaderTextSplitter strips white spaces and new lines. To preserve the original formatting of your Markdown documents, check out [ExperimentalMarkdownSyntaxTextSplitter](https://python.langchain.com/api_reference/text_splitters/markdown/langchain_text_splitters.markdown.ExperimentalMarkdownSyntaxTextSplitter.html). ### How to return Markdown lines as separate documents[​](#how-to-return-markdown-lines-as-separate-documents) By default, MarkdownHeaderTextSplitter aggregates lines based on the headers specified in headers_to_split_on. We can disable this by specifying return_each_line:

```python
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on,
    return_each_line=True,
)
md_header_splits = markdown_splitter.split_text(markdown_document)
md_header_splits

```

```output
[Document(page_content=&#x27;Hi this is Jim&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Bar&#x27;}),
 Document(page_content=&#x27;Hi this is Joe&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Bar&#x27;}),
 Document(page_content=&#x27;Hi this is Lance&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Bar&#x27;, &#x27;Header 3&#x27;: &#x27;Boo&#x27;}),
 Document(page_content=&#x27;Hi this is Molly&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Foo&#x27;, &#x27;Header 2&#x27;: &#x27;Baz&#x27;})]

``` Note that here header information is retained in the metadata for each document. ### How to constrain chunk size:[​](#how-to-constrain-chunk-size) Within each markdown group we can then apply any text splitter we want, such as RecursiveCharacterTextSplitter, which allows for further control of the chunk size.

```python
markdown_document = "# Intro \n\n    ## History \n\n Markdown[9] is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as a markup language that is appealing to human readers in its source code form.[9] \n\n Markdown is widely used in blogging, instant messaging, online forums, collaborative software, documentation pages, and readme files. \n\n ## Rise and divergence \n\n As Markdown popularity grew rapidly, many Markdown implementations appeared, driven mostly by the need for \n\n additional features such as tables, footnotes, definition lists,[note 1] and Markdown inside HTML blocks. \n\n #### Standardization \n\n From 2012, a group of people, including Jeff Atwood and John MacFarlane, launched what Atwood characterised as a standardisation effort. \n\n ## Implementations \n\n Implementations of Markdown are available for over a dozen programming languages."

headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
]

# MD splits
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=headers_to_split_on, strip_headers=False
)
md_header_splits = markdown_splitter.split_text(markdown_document)

# Char-level splits
from langchain_text_splitters import RecursiveCharacterTextSplitter

chunk_size = 250
chunk_overlap = 30
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=chunk_size, chunk_overlap=chunk_overlap
)

# Split
splits = text_splitter.split_documents(md_header_splits)
splits

```

```output
[Document(page_content=&#x27;# Intro  \n## History  \nMarkdown[9] is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as a markup language that is appealing to human readers in its source code form.[9]&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Intro&#x27;, &#x27;Header 2&#x27;: &#x27;History&#x27;}),
 Document(page_content=&#x27;Markdown is widely used in blogging, instant messaging, online forums, collaborative software, documentation pages, and readme files.&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Intro&#x27;, &#x27;Header 2&#x27;: &#x27;History&#x27;}),
 Document(page_content=&#x27;## Rise and divergence  \nAs Markdown popularity grew rapidly, many Markdown implementations appeared, driven mostly by the need for  \nadditional features such as tables, footnotes, definition lists,[note 1] and Markdown inside HTML blocks.&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Intro&#x27;, &#x27;Header 2&#x27;: &#x27;Rise and divergence&#x27;}),
 Document(page_content=&#x27;#### Standardization  \nFrom 2012, a group of people, including Jeff Atwood and John MacFarlane, launched what Atwood characterised as a standardisation effort.&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Intro&#x27;, &#x27;Header 2&#x27;: &#x27;Rise and divergence&#x27;}),
 Document(page_content=&#x27;## Implementations  \nImplementations of Markdown are available for over a dozen programming languages.&#x27;, metadata={&#x27;Header 1&#x27;: &#x27;Intro&#x27;, &#x27;Header 2&#x27;: &#x27;Implementations&#x27;})]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/markdown_header_metadata_splitter.ipynb)[Motivation](#motivation)
- [Basic usage:](#basic-usage)
- [How to return Markdown lines as separate documents](#how-to-return-markdown-lines-as-separate-documents)
- [How to constrain chunk size:](#how-to-constrain-chunk-size)

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