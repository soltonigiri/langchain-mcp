How to access the RunnableConfig from a tool | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_configure.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_configure.ipynb)How to access the RunnableConfig from a tool PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Tools](/docs/concepts/tools/) [Custom tools](/docs/how_to/custom_tools/) [LangChain Expression Language (LCEL)](/docs/concepts/lcel/) [Configuring runnable behavior](/docs/how_to/configure/) If you have a [tool](/docs/concepts/tools/) that calls [chat models](/docs/concepts/chat_models/), [retrievers](/docs/concepts/retrievers/), or other [runnables](/docs/concepts/runnables/), you may want to access internal events from those runnables or configure them with additional properties. This guide shows you how to manually pass parameters properly so that you can do this using the astream_events() method. Tools are [runnables](/docs/concepts/runnables/), and you can treat them the same way as any other runnable at the interface level - you can call invoke(), batch(), and stream() on them as normal. However, when writing custom tools, you may want to invoke other runnables like chat models or retrievers. In order to properly trace and configure those sub-invocations, you&#x27;ll need to manually access and pass in the tool&#x27;s current [RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html) object. This guide show you some examples of how to do that. CompatibilityThis guide requires langchain-core>=0.2.16. Inferring by parameter type[​](#inferring-by-parameter-type) To access reference the active config object from your custom tool, you&#x27;ll need to add a parameter to your tool&#x27;s signature typed as RunnableConfig. When you invoke your tool, LangChain will inspect your tool&#x27;s signature, look for a parameter typed as RunnableConfig, and if it exists, populate that parameter with the correct value. Note:** The actual name of the parameter doesn&#x27;t matter, only the typing. To illustrate this, define a custom tool that takes a two parameters - one typed as a string, the other typed as RunnableConfig:

```python
%pip install -qU langchain_core

```**

```python
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool

@tool
async def reverse_tool(text: str, special_config_param: RunnableConfig) -> str:
    """A test tool that combines input text with a configurable parameter."""
    return (text + special_config_param["configurable"]["additional_field"])[::-1]

```API Reference:**[RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) Then, if we invoke the tool with a config containing a configurable field, we can see that additional_field is passed through correctly:

```python
await reverse_tool.ainvoke(
    {"text": "abc"}, config={"configurable": {"additional_field": "123"}}
)

```

```output
&#x27;321cba&#x27;

``` ## Next steps[​](#next-steps) You&#x27;ve now seen how to configure and stream events from within a tool. Next, check out the following guides for more on using tools: [Stream events from child runs within a custom tool](/docs/how_to/tool_stream_events/)

- Pass [tool results back to a model](/docs/how_to/tool_results_pass_to_model/)

You can also check out some more specific uses of tool calling:

- Building [tool-using chains and agents](/docs/how_to/#tools)

- Getting [structured outputs](/docs/how_to/structured_output/) from models

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tool_configure.ipynb)

- [Inferring by parameter type](#inferring-by-parameter-type)
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