How to force models to call a tool | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_choice.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_choice.ipynb)How to force models to call a tool PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) [LangChain Tools](/docs/concepts/tools/) [How to use a model to call tools](/docs/how_to/tool_calling/) In order to force our LLM to select a specific [tool](/docs/concepts/tools/), we can use the tool_choice parameter to ensure certain behavior. First, let&#x27;s define our model and tools:

```python
from langchain_core.tools import tool

@tool
def add(a: int, b: int) -> int:
    """Adds a and b."""
    return a + b

@tool
def multiply(a: int, b: int) -> int:
    """Multiplies a and b."""
    return a * b

tools = [add, multiply]

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) For example, we can force our tool to call the multiply tool by using the following code:

```python
llm_forced_to_multiply = llm.bind_tools(tools, tool_choice="multiply")
llm_forced_to_multiply.invoke("what is 2 + 4")

```

```output
AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_9cViskmLvPnHjXk9tbVla5HA&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"a":2,"b":4}&#x27;, &#x27;name&#x27;: &#x27;Multiply&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 9, &#x27;prompt_tokens&#x27;: 103, &#x27;total_tokens&#x27;: 112}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-095b827e-2bdd-43bb-8897-c843f4504883-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 2, &#x27;b&#x27;: 4}, &#x27;id&#x27;: &#x27;call_9cViskmLvPnHjXk9tbVla5HA&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 103, &#x27;output_tokens&#x27;: 9, &#x27;total_tokens&#x27;: 112})

``` Even if we pass it something that doesn&#x27;t require multiplcation - it will still call the tool! We can also just force our tool to select at least one of our tools by passing in the "any" (or "required" [which is OpenAI specific](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.BaseChatOpenAI.html#langchain_openai.chat_models.base.BaseChatOpenAI.bind_tools)) keyword to the tool_choice parameter.

```python
llm_forced_to_use_tool = llm.bind_tools(tools, tool_choice="any")
llm_forced_to_use_tool.invoke("What day is today?")

```

```output
AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_mCSiJntCwHJUBfaHZVUB2D8W&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"a":1,"b":2}&#x27;, &#x27;name&#x27;: &#x27;Add&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 15, &#x27;prompt_tokens&#x27;: 94, &#x27;total_tokens&#x27;: 109}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-28f75260-9900-4bed-8cd3-f1579abb65e5-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 1, &#x27;b&#x27;: 2}, &#x27;id&#x27;: &#x27;call_mCSiJntCwHJUBfaHZVUB2D8W&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 94, &#x27;output_tokens&#x27;: 15, &#x27;total_tokens&#x27;: 109})

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tool_choice.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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