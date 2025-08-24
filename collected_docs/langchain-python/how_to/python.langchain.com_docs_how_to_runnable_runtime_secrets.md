How to pass runtime secrets to runnables | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/runnable_runtime_secrets.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/runnable_runtime_secrets.ipynb)How to pass runtime secrets to runnables Requires langchain-core >= 0.2.22 We can pass in secrets to our [runnables](/docs/concepts/runnables/) at runtime using the RunnableConfig. Specifically we can pass in secrets with a __ prefix to the configurable field. This will ensure that these secrets aren&#x27;t traced as part of the invocation:

```python
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool

@tool
def foo(x: int, config: RunnableConfig) -> int:
    """Sum x and a secret int"""
    return x + config["configurable"]["__top_secret_int"]

foo.invoke({"x": 5}, {"configurable": {"__top_secret_int": 2, "traced_key": "bar"}})

```API Reference:**[RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
7

``` Looking at the LangSmith trace for this run, we can see that "traced_key" was recorded (as part of Metadata) while our secret int was not: [https://smith.langchain.com/public/aa7e3289-49ca-422d-a408-f6b927210170/r](https://smith.langchain.com/public/aa7e3289-49ca-422d-a408-f6b927210170/r)[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/runnable_runtime_secrets.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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