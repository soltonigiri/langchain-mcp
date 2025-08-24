How to stream events from a tool | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_stream_events.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_stream_events.ipynb)How to stream events from a tool PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Tools](/docs/concepts/tools/) [Custom tools](/docs/how_to/custom_tools/) [Using stream events](/docs/how_to/streaming/#using-stream-events) [Accessing RunnableConfig within a custom tool](/docs/how_to/tool_configure/) If you have [tools](/docs/concepts/tools/) that call [chat models](/docs/concepts/chat_models/), [retrievers](/docs/concepts/retrievers/), or other [runnables](/docs/concepts/runnables/), you may want to access [internal events](https://python.langchain.com/docs/how_to/streaming/#event-reference) from those runnables or configure them with additional properties. This guide shows you how to manually pass parameters properly so that you can do this using the astream_events() method. CompatibilityLangChain cannot automatically propagate configuration, including callbacks necessary for astream_events(), to child runnables if you are running async code in python=3.11, the RunnableConfig will automatically propagate to child runnables in async environment. However, it is still a good idea to propagate the RunnableConfig manually if your code may run in older Python versions.This guide also requires langchain-core>=0.2.16. Say you have a custom tool that calls a chain that condenses its input by prompting a chat model to return only 10 words, then reversing the output. First, define it in a naive way: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

```

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool

@tool
async def special_summarization_tool(long_text: str) -> str:
    """A tool that summarizes input text using advanced techniques."""
    prompt = ChatPromptTemplate.from_template(
        "You are an expert writer. Summarize the following text in 10 words or less:\n\n{long_text}"
    )

    def reverse(x: str):
        return x[::-1]

    chain = prompt | model | StrOutputParser() | reverse
    summary = await chain.ainvoke({"long_text": long_text})
    return summary

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) Invoking the tool directly works just fine:

```python
LONG_TEXT = """
NARRATOR:
(Black screen with text; The sound of buzzing bees can be heard)
According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don&#x27;t care what humans think is impossible.
BARRY BENSON:
(Barry is picking out a shirt)
Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let&#x27;s shake it up a little.
JANET BENSON:
Barry! Breakfast is ready!
BARRY:
Coming! Hang on a second.
"""

await special_summarization_tool.ainvoke({"long_text": LONG_TEXT})

```**

```output
&#x27;.yad noitaudarg rof tiftuo sesoohc yrraB ;scisyhp seifed eeB&#x27;

``` But if you wanted to access the raw output from the chat model rather than the full tool, you might try to use the [astream_events()](/docs/how_to/streaming/#using-stream-events) method and look for an on_chat_model_end event. Here&#x27;s what happens:

```python
stream = special_summarization_tool.astream_events({"long_text": LONG_TEXT})

async for event in stream:
    if event["event"] == "on_chat_model_end":
        # Never triggers in python<=3.10!
        print(event)

``` You&#x27;ll notice (unless you&#x27;re running through this guide in python>=3.11) that there are no chat model events emitted from the child run! This is because the example above does not pass the tool&#x27;s config object into the internal chain. To fix this, redefine your tool to take a special parameter typed as RunnableConfig (see [this guide](/docs/how_to/tool_configure/) for more details). You&#x27;ll also need to pass that parameter through into the internal chain when executing it:

```python
from langchain_core.runnables import RunnableConfig

@tool
async def special_summarization_tool_with_config(
    long_text: str, config: RunnableConfig
) -> str:
    """A tool that summarizes input text using advanced techniques."""
    prompt = ChatPromptTemplate.from_template(
        "You are an expert writer. Summarize the following text in 10 words or less:\n\n{long_text}"
    )

    def reverse(x: str):
        return x[::-1]

    chain = prompt | model | StrOutputParser() | reverse
    # Pass the "config" object as an argument to any executed runnables
    summary = await chain.ainvoke({"long_text": long_text}, config=config)
    return summary

```API Reference:**[RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html) And now try the same astream_events() call as before with your new tool:

```python
stream = special_summarization_tool_with_config.astream_events({"long_text": LONG_TEXT})

async for event in stream:
    if event["event"] == "on_chat_model_end":
        print(event)

```

```output
{&#x27;event&#x27;: &#x27;on_chat_model_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: AIMessage(content=&#x27;Bee defies physics; Barry chooses outfit for graduation day.&#x27;, additional_kwargs={}, response_metadata={&#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None}, id=&#x27;run-337ac14e-8da8-4c6d-a69f-1573f93b651e&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 182, &#x27;output_tokens&#x27;: 19, &#x27;total_tokens&#x27;: 201, &#x27;input_token_details&#x27;: {&#x27;cache_creation&#x27;: 0, &#x27;cache_read&#x27;: 0}}), &#x27;input&#x27;: {&#x27;messages&#x27;: [[HumanMessage(content="You are an expert writer. Summarize the following text in 10 words or less:\n\n\nNARRATOR:\n(Black screen with text; The sound of buzzing bees can be heard)\nAccording to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don&#x27;t care what humans think is impossible.\nBARRY BENSON:\n(Barry is picking out a shirt)\nYellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let&#x27;s shake it up a little.\nJANET BENSON:\nBarry! Breakfast is ready!\nBARRY:\nComing! Hang on a second.\n", additional_kwargs={}, response_metadata={})]]}}, &#x27;run_id&#x27;: &#x27;337ac14e-8da8-4c6d-a69f-1573f93b651e&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;225beaa6-af73-4c91-b2d3-1afbbb88d53e&#x27;]}

``` Awesome! This time there&#x27;s an event emitted. For streaming, astream_events() automatically calls internal runnables in a chain with streaming enabled if possible, so if you wanted to a stream of tokens as they are generated from the chat model, you could simply filter to look for on_chat_model_stream events with no other changes:

```python
stream = special_summarization_tool_with_config.astream_events({"long_text": LONG_TEXT})

async for event in stream:
    if event["event"] == "on_chat_model_stream":
        print(event)

```

```output
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 182, &#x27;output_tokens&#x27;: 2, &#x27;total_tokens&#x27;: 184, &#x27;input_token_details&#x27;: {&#x27;cache_creation&#x27;: 0, &#x27;cache_read&#x27;: 0}})}, &#x27;run_id&#x27;: &#x27;f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;51858043-b301-4b76-8abb-56218e405283&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;Bee&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;)}, &#x27;run_id&#x27;: &#x27;f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;51858043-b301-4b76-8abb-56218e405283&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27; defies physics;&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;)}, &#x27;run_id&#x27;: &#x27;f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;51858043-b301-4b76-8abb-56218e405283&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27; Barry chooses outfit for&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;)}, &#x27;run_id&#x27;: &#x27;f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;51858043-b301-4b76-8abb-56218e405283&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27; graduation day.&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;)}, &#x27;run_id&#x27;: &#x27;f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;51858043-b301-4b76-8abb-56218e405283&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={}, response_metadata={&#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None}, id=&#x27;run-f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 0, &#x27;output_tokens&#x27;: 17, &#x27;total_tokens&#x27;: 17, &#x27;input_token_details&#x27;: {}})}, &#x27;run_id&#x27;: &#x27;f5e049f7-4e98-4236-87ab-8cd1ce85a2d5&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;51858043-b301-4b76-8abb-56218e405283&#x27;]}

``` ## Next steps[​](#next-steps) You&#x27;ve now seen how to stream events from within a tool. Next, check out the following guides for more on using tools: Pass [runtime values to tools](/docs/how_to/tool_runtime/)

- Pass [tool results back to a model](/docs/how_to/tool_results_pass_to_model/)

- [Dispatch custom callback events](/docs/how_to/callbacks_custom_events/)

You can also check out some more specific uses of tool calling:

- Building [tool-using chains and agents](/docs/how_to/#tools)

- Getting [structured outputs](/docs/how_to/structured_output/) from models

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tool_stream_events.ipynb)

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