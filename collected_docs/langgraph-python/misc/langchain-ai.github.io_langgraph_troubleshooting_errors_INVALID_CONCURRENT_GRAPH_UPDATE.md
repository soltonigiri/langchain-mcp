- INVALID_CONCURRENT_GRAPH_UPDATE [Skip to content](#invalid_concurrent_graph_update) Initializing search [GitHub](https://github.com/langchain-ai/langgraph)

- [INVALID_GRAPH_NODE_RETURN_VALUE](../INVALID_GRAPH_NODE_RETURN_VALUE/)

- [MULTIPLE_SUBGRAPHS](../MULTIPLE_SUBGRAPHS/)

- [INVALID_CHAT_HISTORY](../INVALID_CHAT_HISTORY/)

- [INVALID_LICENSE](../INVALID_LICENSE/)

[](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/troubleshooting/errors/INVALID_CONCURRENT_GRAPH_UPDATE.md)

# INVALID_CONCURRENT_GRAPH_UPDATE[¶](#invalid_concurrent_graph_update)

A LangGraph [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) received concurrent updates to its state from multiple nodes to a state property that doesn't support it.

One way this can occur is if you are using a [fanout](https://langchain-ai.github.io/langgraph/how-tos/map-reduce/) or other parallel execution in your graph and you have defined a graph like this:

```
class State(TypedDict):
    some_key: str

def node(state: State):
    return {"some_key": "some_string_value"}

def other_node(state: State):
    return {"some_key": "some_string_value"}

builder = StateGraph(State)
builder.add_node(node)
builder.add_node(other_node)
builder.add_edge(START, "node")
builder.add_edge(START, "other_node")
graph = builder.compile()

```

If a node in the above graph returns `{ "some_key": "some_string_value" }`, this will overwrite the state value for `"some_key"` with `"some_string_value"`. However, if multiple nodes in e.g. a fanout within a single step return values for `"some_key"`, the graph will throw this error because there is uncertainty around how to update the internal state.

To get around this, you can define a reducer that combines multiple values:

```
import operator
from typing import Annotated

class State(TypedDict):
    # The operator.add reducer fn makes this append-only
    some_key: Annotated[list, operator.add]

```

This will allow you to define logic that handles the same key returned from multiple nodes executed in parallel.

## Troubleshooting[¶](#troubleshooting)

The following may help resolve this error:

- If your graph executes nodes in parallel, make sure you have defined relevant state keys with a reducer.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)