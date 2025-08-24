How to track token usage in ChatModels | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/chat_token_usage_tracking.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/chat_token_usage_tracking.ipynb)How to track token usage in ChatModels PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) Tracking [token](/docs/concepts/tokens/) usage to calculate cost is an important part of putting your app in production. This guide goes over how to obtain this information from your LangChain model calls. This guide requires langchain-anthropic and langchain-openai >= 0.3.11.

```python
%pip install -qU langchain-anthropic langchain-openai

``` A note on streaming with OpenAIOpenAI&#x27;s Chat Completions API does not stream token usage statistics by default (see API reference [here](https://platform.openai.com/docs/api-reference/completions/create#completions-create-stream_options)). To recover token counts when streaming with ChatOpenAI or AzureChatOpenAI, set stream_usage=True as demonstrated in this guide. Using LangSmith[​](#using-langsmith) You can use [LangSmith](https://www.langchain.com/langsmith) to help track token usage in your LLM application. See the [LangSmith quick start guide](https://docs.smith.langchain.com/). Using AIMessage.usage_metadata[​](#using-aimessageusage_metadata) A number of model providers return token usage information as part of the chat generation response. When available, this information will be included on the AIMessage objects produced by the corresponding model. LangChain AIMessage objects include a [usage_metadata](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html#langchain_core.messages.ai.AIMessage.usage_metadata) attribute. When populated, this attribute will be a [UsageMetadata](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.UsageMetadata.html) dictionary with standard keys (e.g., "input_tokens" and "output_tokens"). They will also include information on cached token usage and tokens from multi-modal data. Examples: OpenAI**:

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model(model="gpt-4o-mini")
openai_response = llm.invoke("hello")
openai_response.usage_metadata

```**

```output
{&#x27;input_tokens&#x27;: 8, &#x27;output_tokens&#x27;: 9, &#x27;total_tokens&#x27;: 17}

``` Anthropic**:

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-haiku-20240307")
anthropic_response = llm.invoke("hello")
anthropic_response.usage_metadata

```**

```output
{&#x27;input_tokens&#x27;: 8, &#x27;output_tokens&#x27;: 12, &#x27;total_tokens&#x27;: 20}

``` Streaming[​](#streaming) Some providers support token count metadata in a streaming context. OpenAI[​](#openai) For example, OpenAI will return a message [chunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessageChunk.html) at the end of a stream with token usage information. This behavior is supported by langchain-openai >= 0.1.9 and can be enabled by setting stream_usage=True. This attribute can also be set when ChatOpenAI is instantiated. noteBy default, the last message chunk in a stream will include a "finish_reason" in the message&#x27;s response_metadata attribute. If we include token usage in streaming mode, an additional chunk containing usage metadata will be added to the end of the stream, such that "finish_reason" appears on the second to last message chunk.

```python
llm = init_chat_model(model="gpt-4o-mini")

aggregate = None
for chunk in llm.stream("hello", stream_usage=True):
    print(chunk)
    aggregate = chunk if aggregate is None else aggregate + chunk

```

```output
content=&#x27;&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27;Hello&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27;!&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27; How&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27; can&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27; I&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27; assist&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27; you&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27; today&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27;?&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27;&#x27; response_metadata={&#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;} id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27;
content=&#x27;&#x27; id=&#x27;run-adb20c31-60c7-43a2-99b2-d4a53ca5f623&#x27; usage_metadata={&#x27;input_tokens&#x27;: 8, &#x27;output_tokens&#x27;: 9, &#x27;total_tokens&#x27;: 17}

``` Note that the usage metadata will be included in the sum of the individual message chunks:

```python
print(aggregate.content)
print(aggregate.usage_metadata)

```

```output
Hello! How can I assist you today?
{&#x27;input_tokens&#x27;: 8, &#x27;output_tokens&#x27;: 9, &#x27;total_tokens&#x27;: 17}

``` To disable streaming token counts for OpenAI, set stream_usage to False, or omit it from the parameters:

```python
aggregate = None
for chunk in llm.stream("hello"):
    print(chunk)

```

```output
content=&#x27;&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27;Hello&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27;!&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27; How&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27; can&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27; I&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27; assist&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27; you&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27; today&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27;?&#x27; id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;
content=&#x27;&#x27; response_metadata={&#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;} id=&#x27;run-8e758550-94b0-4cca-a298-57482793c25d&#x27;

``` You can also enable streaming token usage by setting stream_usage when instantiating the chat model. This can be useful when incorporating chat models into LangChain [chains](/docs/concepts/lcel/): usage metadata can be monitored when [streaming intermediate steps](/docs/how_to/streaming/#using-stream-events) or using tracing software such as [LangSmith](https://docs.smith.langchain.com/). See the below example, where we return output structured to a desired schema, but can still observe token usage streamed from intermediate steps.

```python
from pydantic import BaseModel, Field

class Joke(BaseModel):
    """Joke to tell user."""

    setup: str = Field(description="question to set up a joke")
    punchline: str = Field(description="answer to resolve the joke")

llm = init_chat_model(
    model="gpt-4o-mini",
    stream_usage=True,
)
# Under the hood, .with_structured_output binds tools to the
# chat model and appends a parser.
structured_llm = llm.with_structured_output(Joke)

async for event in structured_llm.astream_events("Tell me a joke"):
    if event["event"] == "on_chat_model_end":
        print(f"Token usage: {event[&#x27;data&#x27;][&#x27;output&#x27;].usage_metadata}\n")
    elif event["event"] == "on_chain_end" and event["name"] == "RunnableSequence":
        print(event["data"]["output"])
    else:
        pass

```

```output
Token usage: {&#x27;input_tokens&#x27;: 79, &#x27;output_tokens&#x27;: 23, &#x27;total_tokens&#x27;: 102}

setup=&#x27;Why was the math book sad?&#x27; punchline=&#x27;Because it had too many problems.&#x27;

``` Token usage is also visible in the corresponding [LangSmith trace](https://smith.langchain.com/public/fe6513d5-7212-4045-82e0-fefa28bc7656/r) in the payload from the chat model. Using callbacks[​](#using-callbacks) Requires langchain-core>=0.3.49 LangChain implements a callback handler and context manager that will track token usage across calls of any chat model that returns usage_metadata. There are also some API-specific callback context managers that maintain pricing for different models, allowing for cost estimation in real time. They are currently only implemented for the OpenAI API and Bedrock Anthropic API, and are available in langchain-community: [get_openai_callback](https://python.langchain.com/api_reference/community/callbacks/langchain_community.callbacks.manager.get_openai_callback.html) [get_bedrock_anthropic_callback](https://python.langchain.com/api_reference/community/callbacks/langchain_community.callbacks.manager.get_bedrock_anthropic_callback.html) Below, we demonstrate the general-purpose usage metadata callback manager. We can track token usage through configuration or as a context manager. Tracking token usage through configuration[​](#tracking-token-usage-through-configuration) To track token usage through configuration, instantiate a UsageMetadataCallbackHandler and pass it into the config:

```python
from langchain.chat_models import init_chat_model
from langchain_core.callbacks import UsageMetadataCallbackHandler

llm_1 = init_chat_model(model="openai:gpt-4o-mini")
llm_2 = init_chat_model(model="anthropic:claude-3-5-haiku-latest")

callback = UsageMetadataCallbackHandler()
result_1 = llm_1.invoke("Hello", config={"callbacks": [callback]})
result_2 = llm_2.invoke("Hello", config={"callbacks": [callback]})
callback.usage_metadata

```API Reference:**[UsageMetadataCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.usage.UsageMetadataCallbackHandler.html)

```output
{&#x27;gpt-4o-mini-2024-07-18&#x27;: {&#x27;input_tokens&#x27;: 8,
  &#x27;output_tokens&#x27;: 10,
  &#x27;total_tokens&#x27;: 18,
  &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0},
  &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}},
 &#x27;claude-3-5-haiku-20241022&#x27;: {&#x27;input_tokens&#x27;: 8,
  &#x27;output_tokens&#x27;: 21,
  &#x27;total_tokens&#x27;: 29,
  &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}}}

```**Tracking token usage using a context manager[​](#tracking-token-usage-using-a-context-manager) You can also use get_usage_metadata_callback to create a context manager and aggregate usage metadata there:

```python
from langchain.chat_models import init_chat_model
from langchain_core.callbacks import get_usage_metadata_callback

llm_1 = init_chat_model(model="openai:gpt-4o-mini")
llm_2 = init_chat_model(model="anthropic:claude-3-5-haiku-latest")

with get_usage_metadata_callback() as cb:
    llm_1.invoke("Hello")
    llm_2.invoke("Hello")
    print(cb.usage_metadata)

```API Reference:**[get_usage_metadata_callback](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.usage.get_usage_metadata_callback.html)

```output
{&#x27;gpt-4o-mini-2024-07-18&#x27;: {&#x27;input_tokens&#x27;: 8, &#x27;output_tokens&#x27;: 10, &#x27;total_tokens&#x27;: 18, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}}, &#x27;claude-3-5-haiku-20241022&#x27;: {&#x27;input_tokens&#x27;: 8, &#x27;output_tokens&#x27;: 21, &#x27;total_tokens&#x27;: 29, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}}}

```**Either of these methods will aggregate token usage across multiple calls to each model. For example, you can use it in an [agent](https://python.langchain.com/docs/concepts/agents/) to track token usage across repeated calls to one model:

```python
%pip install -qU langgraph

```

```python
from langgraph.prebuilt import create_react_agent

# Create a tool
def get_weather(location: str) -> str:
    """Get the weather at a location."""
    return "It&#x27;s sunny."

callback = UsageMetadataCallbackHandler()

tools = [get_weather]
agent = create_react_agent("openai:gpt-4o-mini", tools)
for step in agent.stream(
    {"messages": [{"role": "user", "content": "What&#x27;s the weather in Boston?"}]},
    stream_mode="values",
    config={"callbacks": [callback]},
):
    step["messages"][-1].pretty_print()

print(f"\nTotal usage: {callback.usage_metadata}")

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
================================[1m Human Message [0m=================================

What&#x27;s the weather in Boston?
==================================[1m Ai Message [0m==================================
Tool Calls:
  get_weather (call_izMdhUYpp9Vhx7DTNAiybzGa)
 Call ID: call_izMdhUYpp9Vhx7DTNAiybzGa
  Args:
    location: Boston
=================================[1m Tool Message [0m=================================
Name: get_weather

It&#x27;s sunny.
==================================[1m Ai Message [0m==================================

The weather in Boston is sunny.

Total usage: {&#x27;gpt-4o-mini-2024-07-18&#x27;: {&#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;input_tokens&#x27;: 125, &#x27;total_tokens&#x27;: 149, &#x27;output_tokens&#x27;: 24, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}}}

``` ## Next steps[​](#next-steps) You&#x27;ve now seen a few examples of how to track token usage for supported providers. Next, check out the other how-to guides chat models in this section, like [how to get a model to return structured output](/docs/how_to/structured_output/) or [how to add caching to your chat models](/docs/how_to/chat_model_caching/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/chat_token_usage_tracking.ipynb)[Using LangSmith](#using-langsmith)
- [Using AIMessage.usage_metadata](#using-aimessageusage_metadata)[Streaming](#streaming)

- [Using callbacks](#using-callbacks)[Tracking token usage through configuration](#tracking-token-usage-through-configuration)
- [Tracking token usage using a context manager](#tracking-token-usage-using-a-context-manager)

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