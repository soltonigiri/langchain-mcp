How to disable parallel tool calling | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_calling_parallel.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_calling_parallel.ipynb)How to disable parallel tool calling Provider-specificThis API is currently only supported by OpenAI and Anthropic. OpenAI tool calling performs tool calling in parallel by default. That means that if we ask a question like "What is the weather in Tokyo, New York, and Chicago?" and we have a tool for getting the weather, it will call the tool 3 times in parallel. We can force it to call only a single tool once by using the parallel_tool_call parameter. First let&#x27;s set up our tools and model:

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

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```python
import os
from getpass import getpass

from langchain.chat_models import init_chat_model

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()

llm = init_chat_model("openai:gpt-4.1-mini")

``` Now let&#x27;s show a quick example of how disabling parallel tool calls work:

```python
llm_with_tools = llm.bind_tools(tools, parallel_tool_calls=False)
llm_with_tools.invoke("Please call the first tool two times").tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;add&#x27;,
  &#x27;args&#x27;: {&#x27;a&#x27;: 2, &#x27;b&#x27;: 2},
  &#x27;id&#x27;: &#x27;call_Hh4JOTCDM85Sm9Pr84VKrWu5&#x27;}]

``` As we can see, even though we explicitly told the model to call a tool twice, by disabling parallel tool calls the model was constrained to only calling one.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tool_calling_parallel.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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