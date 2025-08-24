- INVALID_CONCURRENT_GRAPH_UPDATE [Skip to content](#invalid_concurrent_graph_update) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- Resources

- [INVALID_GRAPH_NODE_RETURN_VALUE](../INVALID_GRAPH_NODE_RETURN_VALUE/)

- [MULTIPLE_SUBGRAPHS](../MULTIPLE_SUBGRAPHS/)

- [UNREACHABLE_NODE](../UNREACHABLE_NODE/)

- [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)

- [Agents](../../../agents/overview/)

- [API reference](../../../reference/)

- [Versions](../../../versions/)

[INVALID_CONCURRENT_GRAPH_UPDATE¶](#invalid_concurrent_graph_update)

A LangGraph [StateGraph](https://langchain-ai.github.io/langgraphjs/reference/classes/langgraph.StateGraph.html) received concurrent updates to its state from multiple nodes to a state property that doesn't support it.

One way this can occur is if you are using a [fanout](https://langchain-ai.github.io/langgraphjs/how-tos/map-reduce/) or other parallel execution in your graph and you have defined a state with a value like this:

```
const StateAnnotation = Annotation.Root({
  someKey: Annotation<string>,
});

const graph = new StateGraph(StateAnnotation)
  .addNode(...)
  ...
  .compile();

```

If a node in the above graph returns `{ someKey: "someStringValue" }`, this will overwrite the state value for `someKey` with `"someStringValue"`. However, if multiple nodes in e.g. a fanout within a single step return values for `"someKey"`, the graph will throw this error because there is uncertainty around how to update the internal state.

To get around this, you can define a reducer that combines multiple values:

```
const StateAnnotation = Annotation.Root({
  someKey: Annotation<string[]>({
    default: () => [],
    reducer: (a, b) => a.concat(b),
  }),
});

```

This will allow you to define logic that handles the same key returned from multiple nodes executed in parallel.

## Troubleshooting[¶](#troubleshooting)

The following may help resolve this error:

- If your graph executes nodes in parallel, make sure you have defined relevant state keys with a reducer.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)