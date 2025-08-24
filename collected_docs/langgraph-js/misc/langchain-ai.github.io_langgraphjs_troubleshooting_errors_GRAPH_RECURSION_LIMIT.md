- GRAPH_RECURSION_LIMIT [Skip to content](#graph_recursion_limit) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- Resources

- [INVALID_CONCURRENT_GRAPH_UPDATE](../INVALID_CONCURRENT_GRAPH_UPDATE/)

- [INVALID_GRAPH_NODE_RETURN_VALUE](../INVALID_GRAPH_NODE_RETURN_VALUE/)

- [MULTIPLE_SUBGRAPHS](../MULTIPLE_SUBGRAPHS/)

- [UNREACHABLE_NODE](../UNREACHABLE_NODE/)

- [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)

- [Agents](../../../agents/overview/)

- [API reference](../../../reference/)

- [Versions](../../../versions/)

[GRAPH_RECURSION_LIMIT¶](#graph_recursion_limit)

Your LangGraph [StateGraph](https://langchain-ai.github.io/langgraphjs/reference/classes/langgraph.StateGraph.html) reached the maximum number of steps before hitting a stop condition. This is often due to an infinite loop caused by code like the example below:

```
const graph = new StateGraph(...)
  .addNode("a", ...)
  .addNode("b", ...)
  .addEdge("a", "b")
  .addEdge("b", "a")
  ...
  .compile();

```

However, complex graphs may hit the default limit naturally.

## Troubleshooting[¶](#troubleshooting)

- If you are not expecting your graph to go through many iterations, you likely have a cycle. Check your logic for infinite loops.

- If you have a complex graph, you can pass in a higher recursionLimit value into your config object when invoking your graph like this:

```
await graph.invoke({...}, { recursionLimit: 100 });

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)