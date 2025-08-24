How to cache LLM responses | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/llm_caching.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/llm_caching.ipynb)How to cache LLM responses LangChain provides an optional [caching](/docs/concepts/chat_models/#caching) layer for LLMs. This is useful for two reasons: It can save you money by reducing the number of API calls you make to the LLM provider, if you&#x27;re often requesting the same completion multiple times. It can speed up your application by reducing the number of API calls you make to the LLM provider.

```python
%pip install -qU langchain_openai langchain_community

import os
from getpass import getpass

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()
# Please manually enter OpenAI Key

```

```python
from langchain_core.globals import set_llm_cache
from langchain_openai import OpenAI

# To make the caching really obvious, let&#x27;s use a slower and older model.
# Caching supports newer chat models as well.
llm = OpenAI(model="gpt-3.5-turbo-instruct", n=2, best_of=2)

```API Reference:**[set_llm_cache](https://python.langchain.com/api_reference/core/globals/langchain_core.globals.set_llm_cache.html)

```python
%%time
from langchain_core.caches import InMemoryCache

set_llm_cache(InMemoryCache())

# The first time, it is not yet in cache, so it should take longer
llm.invoke("Tell me a joke")

```**API Reference:**[InMemoryCache](https://python.langchain.com/api_reference/core/caches/langchain_core.caches.InMemoryCache.html)

```output
CPU times: user 546 ms, sys: 379 ms, total: 925 ms
Wall time: 1.11 s

```

```output
"\nWhy don&#x27;t scientists trust atoms?\n\nBecause they make up everything!"

```

```python
%%time
# The second time it is, so it goes faster
llm.invoke("Tell me a joke")

```

```output
CPU times: user 192 µs, sys: 77 µs, total: 269 µs
Wall time: 270 µs

```

```output
"\nWhy don&#x27;t scientists trust atoms?\n\nBecause they make up everything!"

``` ## SQLite Cache[​](#sqlite-cache)

```python
!rm .langchain.db

```

```python
# We can do the same thing with a SQLite cache
from langchain_community.cache import SQLiteCache

set_llm_cache(SQLiteCache(database_path=".langchain.db"))

```

```python
%%time
# The first time, it is not yet in cache, so it should take longer
llm.invoke("Tell me a joke")

```

```output
CPU times: user 10.6 ms, sys: 4.21 ms, total: 14.8 ms
Wall time: 851 ms

```

```output
"\n\nWhy don&#x27;t scientists trust atoms?\n\nBecause they make up everything!"

```

```python
%%time
# The second time it is, so it goes faster
llm.invoke("Tell me a joke")

```

```output
CPU times: user 59.7 ms, sys: 63.6 ms, total: 123 ms
Wall time: 134 ms

```

```output
"\n\nWhy don&#x27;t scientists trust atoms?\n\nBecause they make up everything!"

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/llm_caching.ipynb)[SQLite Cache](#sqlite-cache)

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