- MULTIPLE_SUBGRAPHS [Skip to content](#multiple_subgraphs) Initializing search [GitHub](https://github.com/langchain-ai/langgraph)

- [INVALID_CHAT_HISTORY](../INVALID_CHAT_HISTORY/)

- [INVALID_LICENSE](../INVALID_LICENSE/)

[](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/troubleshooting/errors/MULTIPLE_SUBGRAPHS.md)

# MULTIPLE_SUBGRAPHS[¶](#multiple_subgraphs)

You are calling subgraphs multiple times within a single LangGraph node with checkpointing enabled for each subgraph.

This is currently not allowed due to internal restrictions on how checkpoint namespacing for subgraphs works.

## Troubleshooting[¶](#troubleshooting)

The following may help resolve this error:

- If you don't need to interrupt/resume from a subgraph, pass checkpointer=False when compiling it like this: .compile(checkpointer=False)

- Don't imperatively call graphs multiple times in the same node, and instead use the [Send](https://langchain-ai.github.io/langgraph/concepts/low_level/#send) API.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)