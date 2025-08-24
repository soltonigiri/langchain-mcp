How to stream chat model responses | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/chat_streaming.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/chat_streaming.ipynb)How to stream chat model responses All [chat models](https://python.langchain.com/api_reference/core/language_models/langchain_core.language_models.chat_models.BaseChatModel.html) implement the [Runnable interface](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable), which comes with a default** implementations of standard runnable methods (i.e. ainvoke, batch, abatch, stream, astream, astream_events). The **default** streaming implementation provides anIterator (or AsyncIterator for asynchronous streaming) that yields a single value: the final output from the underlying chat model provider. tipThe **default** implementation does **not** provide support for token-by-token streaming, but it ensures that the model can be swapped in for any other model as it supports the same standard interface. The ability to stream the output token-by-token depends on whether the provider has implemented proper streaming support. See which [integrations support token-by-token streaming here](/docs/integrations/chat/). ## Sync streaming[​](#sync-streaming) Below we use a | to help visualize the delimiter between tokens.

```python
from langchain_anthropic.chat_models import ChatAnthropic

chat = ChatAnthropic(model="claude-3-haiku-20240307")
for chunk in chat.stream("Write me a 1 verse song about goldfish on the moon"):
    print(chunk.content, end="|", flush=True)

```

```output
Here| is| a| |1| |verse| song| about| gol|dfish| on| the| moon|:|

Floating| up| in| the| star|ry| night|,|
Fins| a|-|gl|im|mer| in| the| pale| moon|light|.|
Gol|dfish| swimming|,| peaceful| an|d free|,|
Se|ren|ely| |drif|ting| across| the| lunar| sea|.|

``` ## Async Streaming[​](#async-streaming)

```python
from langchain_anthropic.chat_models import ChatAnthropic

chat = ChatAnthropic(model="claude-3-haiku-20240307")
async for chunk in chat.astream("Write me a 1 verse song about goldfish on the moon"):
    print(chunk.content, end="|", flush=True)

```

```output
Here| is| a| |1| |verse| song| about| gol|dfish| on| the| moon|:|

Floating| up| above| the| Earth|,|
Gol|dfish| swim| in| alien| m|irth|.|
In| their| bowl| of| lunar| dust|,|
Gl|it|tering| scales| reflect| the| trust|
Of| swimming| free| in| this| new| worl|d,|
Where| their| aqu|atic| dream|&#x27;s| unf|ur|le|d.|

``` ## Astream events[​](#astream-events) Chat models also support the standard [astream events](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.astream_events) method. This method is useful if you&#x27;re streaming output from a larger LLM application that contains multiple steps (e.g., an LLM chain composed of a prompt, llm and parser).

```python
from langchain_anthropic.chat_models import ChatAnthropic

chat = ChatAnthropic(model="claude-3-haiku-20240307")
idx = 0

async for event in chat.astream_events(
    "Write me a 1 verse song about goldfish on the moon"
):
    idx += 1
    if idx >= 5:  # Truncate the output
        print("...Truncated")
        break
    print(event)

```

```output
{&#x27;event&#x27;: &#x27;on_chat_model_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;Write me a 1 verse song about goldfish on the moon&#x27;}, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [], &#x27;run_id&#x27;: &#x27;1d430164-52b1-4d00-8c00-b16460f7737e&#x27;, &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: None, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;run_id&#x27;: &#x27;1d430164-52b1-4d00-8c00-b16460f7737e&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: None, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-1d430164-52b1-4d00-8c00-b16460f7737e&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 21, &#x27;output_tokens&#x27;: 2, &#x27;total_tokens&#x27;: 23, &#x27;input_token_details&#x27;: {&#x27;cache_creation&#x27;: 0, &#x27;cache_read&#x27;: 0}})}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;run_id&#x27;: &#x27;1d430164-52b1-4d00-8c00-b16460f7737e&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: None, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content="Here&#x27;s", additional_kwargs={}, response_metadata={}, id=&#x27;run-1d430164-52b1-4d00-8c00-b16460f7737e&#x27;)}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;run_id&#x27;: &#x27;1d430164-52b1-4d00-8c00-b16460f7737e&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: None, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27; a short one-verse song&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-1d430164-52b1-4d00-8c00-b16460f7737e&#x27;)}, &#x27;parent_ids&#x27;: []}
...Truncated

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/chat_streaming.ipynb)[Sync streaming](#sync-streaming)
- [Async Streaming](#async-streaming)
- [Astream events](#astream-events)

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