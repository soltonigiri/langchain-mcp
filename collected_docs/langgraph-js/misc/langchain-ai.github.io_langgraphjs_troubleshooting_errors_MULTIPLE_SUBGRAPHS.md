- MULTIPLE_SUBGRAPHS [Skip to content](#multiple_subgraphs) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- Resources

- [UNREACHABLE_NODE](../UNREACHABLE_NODE/)

- [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)

- [Agents](../../../agents/overview/)

- [API reference](../../../reference/)

- [Versions](../../../versions/)

[MULTIPLE_SUBGRAPHS¶](#multiple_subgraphs)

You are calling subgraphs multiple times within a single LangGraph node with checkpointing enabled for each subgraph.

This is currently not allowed due to internal restrictions on how checkpoint namespacing for subgraphs works.

## Troubleshooting[¶](#troubleshooting)

The following may help resolve this error:

- If you don't need to interrupt/resume from a subgraph, pass checkpointer=false when compiling it like this: .compile({ checkpointer: false })

- Don't imperatively call graphs multiple times in the same node, and instead use the [Send](https://langchain-ai.github.io/langgraphjs/reference/classes/langgraph.Send.html) API.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)