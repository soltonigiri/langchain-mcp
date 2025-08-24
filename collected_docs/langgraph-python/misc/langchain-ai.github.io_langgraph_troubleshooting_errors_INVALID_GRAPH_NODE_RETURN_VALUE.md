- INVALID_GRAPH_NODE_RETURN_VALUE [Skip to content](#invalid_graph_node_return_value) Initializing search [GitHub](https://github.com/langchain-ai/langgraph)

- [MULTIPLE_SUBGRAPHS](../MULTIPLE_SUBGRAPHS/)

- [INVALID_CHAT_HISTORY](../INVALID_CHAT_HISTORY/)

- [INVALID_LICENSE](../INVALID_LICENSE/)

[](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/troubleshooting/errors/INVALID_GRAPH_NODE_RETURN_VALUE.md)

# INVALID_GRAPH_NODE_RETURN_VALUE[¶](#invalid_graph_node_return_value)

A LangGraph [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) received a non-dict return type from a node. Here's an example:

```
class State(TypedDict):
    some_key: str

def bad_node(state: State):
    # Should return a dict with a value for "some_key", not a list
    return ["whoops"]

builder = StateGraph(State)
builder.add_node(bad_node)
...

graph = builder.compile()

```

Invoking the above graph will result in an error like this:

```
graph.invoke({ "some_key": "someval" });

```

```
InvalidUpdateError: Expected dict, got ['whoops']
For troubleshooting, visit: https://python.langchain.com/docs/troubleshooting/errors/INVALID_GRAPH_NODE_RETURN_VALUE

```

Nodes in your graph must return a dict containing one or more keys defined in your state.

## Troubleshooting[¶](#troubleshooting)

The following may help resolve this error:

- If you have complex logic in your node, make sure all code paths return an appropriate dict for your defined state.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)