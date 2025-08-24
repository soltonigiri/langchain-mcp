How to cache chat model responses | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/chat_model_caching.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/chat_model_caching.ipynb)How to cache chat model responses PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) [LLMs](/docs/concepts/text_llms/) LangChain provides an optional caching layer for [chat models](/docs/concepts/chat_models/). This is useful for two main reasons: It can save you money by reducing the number of API calls you make to the LLM provider, if you&#x27;re often requesting the same completion multiple times. This is especially useful during app development. It can speed up your application by reducing the number of API calls you make to the LLM provider. This guide will walk you through how to enable this in your apps. Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

```

```python
# <!-- ruff: noqa: F821 -->
from langchain_core.globals import set_llm_cache

```API Reference:**[set_llm_cache](https://python.langchain.com/api_reference/core/globals/langchain_core.globals.set_llm_cache.html) ## In Memory Cache[​](#in-memory-cache) This is an ephemeral cache that stores model calls in memory. It will be wiped when your environment restarts, and is not shared across processes.

```python
%%time
from langchain_core.caches import InMemoryCache

set_llm_cache(InMemoryCache())

# The first time, it is not yet in cache, so it should take longer
llm.invoke("Tell me a joke")

```**API Reference:**[InMemoryCache](https://python.langchain.com/api_reference/core/caches/langchain_core.caches.InMemoryCache.html)

```output
CPU times: user 645 ms, sys: 214 ms, total: 859 ms
Wall time: 829 ms

```

```output
AIMessage(content="Why don&#x27;t scientists trust atoms?\n\nBecause they make up everything!", response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 13, &#x27;prompt_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 24}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-b6836bdd-8c30-436b-828f-0ac5fc9ab50e-0&#x27;)

```

```python
%%time
# The second time it is, so it goes faster
llm.invoke("Tell me a joke")

```

```output
CPU times: user 822 µs, sys: 288 µs, total: 1.11 ms
Wall time: 1.06 ms

```

```output
AIMessage(content="Why don&#x27;t scientists trust atoms?\n\nBecause they make up everything!", response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 13, &#x27;prompt_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 24}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-b6836bdd-8c30-436b-828f-0ac5fc9ab50e-0&#x27;)

``` ## SQLite Cache[​](#sqlite-cache) This cache implementation uses a SQLite database to store responses, and will last across process restarts.

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
CPU times: user 9.91 ms, sys: 7.68 ms, total: 17.6 ms
Wall time: 657 ms

```

```output
AIMessage(content=&#x27;Why did the scarecrow win an award? Because he was outstanding in his field!&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 17, &#x27;prompt_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 28}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-39d9e1e8-7766-4970-b1d8-f50213fd94c5-0&#x27;)

```

```python
%%time
# The second time it is, so it goes faster
llm.invoke("Tell me a joke")

```

```output
CPU times: user 52.2 ms, sys: 60.5 ms, total: 113 ms
Wall time: 127 ms

```

```output
AIMessage(content=&#x27;Why did the scarecrow win an award? Because he was outstanding in his field!&#x27;, id=&#x27;run-39d9e1e8-7766-4970-b1d8-f50213fd94c5-0&#x27;)

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to cache model responses to save time and money. Next, check out the other how-to guides chat models in this section, like [how to get a model to return structured output](/docs/how_to/structured_output/) or [how to create your own custom chat model](/docs/how_to/custom_chat_model/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/chat_model_caching.ipynb)[In Memory Cache](#in-memory-cache)
- [SQLite Cache](#sqlite-cache)
- [Next steps](#next-steps)

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