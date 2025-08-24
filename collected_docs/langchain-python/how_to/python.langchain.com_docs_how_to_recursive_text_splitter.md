How to recursively split text by characters | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/recursive_text_splitter.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/recursive_text_splitter.ipynb) # How to recursively split text by characters This [text splitter](/docs/concepts/text_splitters/) is the recommended one for generic text. It is parameterized by a list of characters. It tries to split on them in order until the chunks are small enough. The default list is ["\n\n", "\n", " ", ""]. This has the effect of trying to keep all paragraphs (and then sentences, and then words) together as long as possible, as those would generically seem to be the strongest semantically related pieces of text. How the text is split: by list of characters.

- How the chunk size is measured: by number of characters.

Below we show example usage.

To obtain the string content directly, use `.split_text`.

To create LangChain [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) objects (e.g., for use in downstream tasks), use `.create_documents`.

```python
%pip install -qU langchain-text-splitters

```

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load example document
with open("state_of_the_union.txt") as f:
    state_of_the_union = f.read()

text_splitter = RecursiveCharacterTextSplitter(
    # Set a really small chunk size, just to show.
    chunk_size=100,
    chunk_overlap=20,
    length_function=len,
    is_separator_regex=False,
)
texts = text_splitter.create_documents([state_of_the_union])
print(texts[0])
print(texts[1])

```

```output
page_content=&#x27;Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and&#x27;
page_content=&#x27;of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.&#x27;

```

```python
text_splitter.split_text(state_of_the_union)[:2]

```

```output
[&#x27;Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and&#x27;,
 &#x27;of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.&#x27;]

``` Let&#x27;s go through the parameters set above for `RecursiveCharacterTextSplitter`:

- chunk_size: The maximum size of a chunk, where size is determined by the length_function.

- chunk_overlap: Target overlap between chunks. Overlapping chunks helps to mitigate loss of information when context is divided between chunks.

- length_function: Function determining the chunk size.

- is_separator_regex: Whether the separator list (defaulting to ["\n\n", "\n", " ", ""]) should be interpreted as regex.

## Splitting text from languages without word boundaries[​](#splitting-text-from-languages-without-word-boundaries)

Some writing systems do not have [word boundaries](https://en.wikipedia.org/wiki/Category:Writing_systems_without_word_boundaries), for example Chinese, Japanese, and Thai. Splitting text with the default separator list of `["\n\n", "\n", " ", ""]` can cause words to be split between chunks. To keep words together, you can override the list of separators to include additional punctuation:

- Add ASCII full-stop ".", [Unicode fullwidth](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)) full stop "．" (used in Chinese text), and [ideographic full stop](https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation) "。" (used in Japanese and Chinese)

- Add [Zero-width space](https://en.wikipedia.org/wiki/Zero-width_space) used in Thai, Myanmar, Kmer, and Japanese.

- Add ASCII comma ",", Unicode fullwidth comma "，", and Unicode ideographic comma "、"

```python
text_splitter = RecursiveCharacterTextSplitter(
    separators=[
        "\n\n",
        "\n",
        " ",
        ".",
        ",",
        "\u200b",  # Zero-width space
        "\uff0c",  # Fullwidth comma
        "\u3001",  # Ideographic comma
        "\uff0e",  # Fullwidth full stop
        "\u3002",  # Ideographic full stop
        "",
    ],
    # Existing args
)

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/recursive_text_splitter.ipynb)

- [Splitting text from languages without word boundaries](#splitting-text-from-languages-without-word-boundaries)

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