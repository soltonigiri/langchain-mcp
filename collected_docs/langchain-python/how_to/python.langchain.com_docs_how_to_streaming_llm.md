How to stream responses from an LLM | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/streaming_llm.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/streaming_llm.ipynb)How to stream responses from an LLM All LLMs implement the [Runnable interface](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable), which comes with default** implementations of standard runnable methods (i.e. ainvoke, batch, abatch, stream, astream, astream_events). The **default** streaming implementations provide anIterator (or AsyncIterator for asynchronous streaming) that yields a single value: the final output from the underlying chat model provider. The ability to stream the output token-by-token depends on whether the provider has implemented proper streaming support. See which [integrations support token-by-token streaming here](/docs/integrations/llms/). noteThe **default** implementation does **not** provide support for token-by-token streaming, but it ensures that the model can be swapped in for any other model as it supports the same standard interface. ## Sync stream[​](#sync-stream) Below we use a | to help visualize the delimiter between tokens.

```python
from langchain_openai import OpenAI

llm = OpenAI(model="gpt-3.5-turbo-instruct", temperature=0, max_tokens=512)
for chunk in llm.stream("Write me a 1 verse song about sparkling water."):
    print(chunk, end="|", flush=True)

```

```output
|Spark|ling| water|,| oh| so clear|
|Bubbles dancing|,| without| fear|
|Refreshing| taste|,| a| pure| delight|
|Spark|ling| water|,| my| thirst|&#x27;s| delight||

``` ## Async streaming[​](#async-streaming) Let&#x27;s see how to stream in an async setting using astream.

```python
from langchain_openai import OpenAI

llm = OpenAI(model="gpt-3.5-turbo-instruct", temperature=0, max_tokens=512)
async for chunk in llm.astream("Write me a 1 verse song about sparkling water."):
    print(chunk, end="|", flush=True)

```

```output
|Spark|ling| water|,| oh| so clear|
|Bubbles dancing|,| without| fear|
|Refreshing| taste|,| a| pure| delight|
|Spark|ling| water|,| my| thirst|&#x27;s| delight||

``` ## Async event streaming[​](#async-event-streaming) LLMs also support the standard [astream events](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.astream_events) method. tipastream_events is most useful when implementing streaming in a larger LLM application that contains multiple steps (e.g., an application that involves an agent).

```python
from langchain_openai import OpenAI

llm = OpenAI(model="gpt-3.5-turbo-instruct", temperature=0, max_tokens=512)

idx = 0

async for event in llm.astream_events(
    "Write me a 1 verse song about goldfish on the moon", version="v1"
):
    idx += 1
    if idx >= 5:  # Truncate the output
        print("...Truncated")
        break
    print(event)

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/streaming_llm.ipynb)[Sync stream](#sync-stream)
- [Async streaming](#async-streaming)
- [Async event streaming](#async-event-streaming)

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