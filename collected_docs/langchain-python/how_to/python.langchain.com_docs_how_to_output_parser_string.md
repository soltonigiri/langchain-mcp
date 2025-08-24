How to parse text from message objects | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_string.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_string.ipynb)How to parse text from message objects PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) [Messages](/docs/concepts/messages/) [Output parsers](/docs/concepts/output_parsers/) [LangChain Expression Language (LCEL)](/docs/concepts/lcel/) LangChain [message](/docs/concepts/messages/) objects support content in a [variety of formats](/docs/concepts/messages/#content), including text, [multimodal data](/docs/concepts/multimodality/), and a list of [content block](/docs/concepts/messages/#aimessage) dicts. The format of [Chat model](/docs/concepts/chat_models/) response content may depend on the provider. For example, the chat model for [Anthropic](/docs/integrations/chat/anthropic/) will return string content for typical string input:

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-5-haiku-latest")

response = llm.invoke("Hello")
response.content

```

```output
&#x27;Hi there! How are you doing today? Is there anything I can help you with?&#x27;

``` But when tool calls are generated, the response content is structured into content blocks that convey the model&#x27;s reasoning process:

```python
from langchain_core.tools import tool

@tool
def get_weather(location: str) -> str:
    """Get the weather from a location."""

    return "Sunny."

llm_with_tools = llm.bind_tools([get_weather])

response = llm_with_tools.invoke("What&#x27;s the weather in San Francisco, CA?")
response.content

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
[{&#x27;text&#x27;: "I&#x27;ll help you get the current weather for San Francisco, California. Let me check that for you right away.",
  &#x27;type&#x27;: &#x27;text&#x27;},
 {&#x27;id&#x27;: &#x27;toolu_015PwwcKxWYctKfY3pruHFyy&#x27;,
  &#x27;input&#x27;: {&#x27;location&#x27;: &#x27;San Francisco, CA&#x27;},
  &#x27;name&#x27;: &#x27;get_weather&#x27;,
  &#x27;type&#x27;: &#x27;tool_use&#x27;}]

```**To automatically parse text from message objects irrespective of the format of the underlying content, we can use [StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html). We can compose it with a chat model as follows:

```python
from langchain_core.output_parsers import StrOutputParser

chain = llm_with_tools | StrOutputParser()

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) [StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) simplifies the extraction of text from message objects:

```python
response = chain.invoke("What&#x27;s the weather in San Francisco, CA?")
print(response)

```

```output
I&#x27;ll help you check the weather in San Francisco, CA right away.

``` This is particularly useful in streaming contexts:

```python
for chunk in chain.stream("What&#x27;s the weather in San Francisco, CA?"):
    print(chunk, end="|")

```

```output
|I&#x27;ll| help| you get| the current| weather for| San Francisco, California|. Let| me retrieve| that| information for you.||||||||||

``` See the [API Reference](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) for more information.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/output_parser_string.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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