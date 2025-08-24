- INVALID_GRAPH_NODE_RETURN_VALUE [Skip to content](#invalid_graph_node_return_value) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- Resources

- [MULTIPLE_SUBGRAPHS](../MULTIPLE_SUBGRAPHS/)

- [UNREACHABLE_NODE](../UNREACHABLE_NODE/)

- [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)

- [Agents](../../../agents/overview/)

- [API reference](../../../reference/)

- [Versions](../../../versions/)

[INVALID_GRAPH_NODE_RETURN_VALUE¶](#invalid_graph_node_return_value)

A LangGraph [StateGraph](https://langchain-ai.github.io/langgraphjs/reference/classes/langgraph.StateGraph.html) received a non-object return type from a node. Here's an example:

```
const StateAnnotation = Annotation.Root({
  someKey: Annotation<string>,
});

const graph = new StateGraph(StateAnnotation)
  .addNode("badNode", async (state) => {
    // Should return an empty object, one with a value for "someKey", or undefined
    return ["whoops!"];
  })
  ...
  .compile();

```

Invoking the above graph will result in an error like this:

```
await graph.invoke({ someKey: "someval" });

```

```
InvalidUpdateError: Expected node "badNode" to return an object, received number

Troubleshooting URL: https://js.langchain.com/troubleshooting/errors/INVALID_GRAPH_NODE_RETURN_VALUE

```

Nodes in your graph must return an object containing one or more keys defined in your state.

## Troubleshooting[¶](#troubleshooting)

The following may help resolve this error:

- If you have complex logic in your node, make sure all code paths return an appropriate object for your defined state.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)