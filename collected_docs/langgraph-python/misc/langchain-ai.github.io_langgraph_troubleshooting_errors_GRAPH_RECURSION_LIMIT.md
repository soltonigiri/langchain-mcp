- GRAPH_RECURSION_LIMIT [Skip to content](#graph_recursion_limit) Initializing search [GitHub](https://github.com/langchain-ai/langgraph)

- [INVALID_CONCURRENT_GRAPH_UPDATE](../INVALID_CONCURRENT_GRAPH_UPDATE/)

- [INVALID_GRAPH_NODE_RETURN_VALUE](../INVALID_GRAPH_NODE_RETURN_VALUE/)

- [MULTIPLE_SUBGRAPHS](../MULTIPLE_SUBGRAPHS/)

- [INVALID_CHAT_HISTORY](../INVALID_CHAT_HISTORY/)

- [INVALID_LICENSE](../INVALID_LICENSE/)

[](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/troubleshooting/errors/GRAPH_RECURSION_LIMIT.md)

# GRAPH_RECURSION_LIMIT[¶](#graph_recursion_limit)

Your LangGraph [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) reached the maximum number of steps before hitting a stop condition. This is often due to an infinite loop caused by code like the example below:

```
class State(TypedDict):
    some_key: str

builder = StateGraph(State)
builder.add_node("a", ...)
builder.add_node("b", ...)
builder.add_edge("a", "b")
builder.add_edge("b", "a")
...

graph = builder.compile()

```

However, complex graphs may hit the default limit naturally.

## Troubleshooting[¶](#troubleshooting)

- If you are not expecting your graph to go through many iterations, you likely have a cycle. Check your logic for infinite loops.

- If you have a complex graph, you can pass in a higher recursion_limit value into your config object when invoking your graph like this:

```
graph.invoke({...}, {"recursion_limit": 100})

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)