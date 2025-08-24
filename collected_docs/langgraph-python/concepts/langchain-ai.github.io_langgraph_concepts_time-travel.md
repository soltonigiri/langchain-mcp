- Overview **[Skip to content](#time-travel) Initializing search [GitHub](https://github.com/langchain-ai/langgraph) LangGraph APIs Core capabilities [Subgraphs](../subgraphs/) [Multi-agent](../multi_agent/) [MCP](../mcp/) [Tracing](../tracing/) [Reference](../../reference/) [Examples](../../examples/) [Additional resources](../../additional-resources/) [](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/concepts/time-travel.md) Time Travel ⏱️[¶](#time-travel) When working with non-deterministic systems that make model-based decisions (e.g., agents powered by LLMs), it can be useful to examine their decision-making process in detail: 🤔 Understand reasoning**: Analyze the steps that led to a successful result.

- 🐞 **Debug mistakes**: Identify where and why errors occurred.

- 🔍 **Explore alternatives**: Test different paths to uncover better solutions.

LangGraph provides [time travel functionality](../../how-tos/human_in_the_loop/time-travel/) to support these use cases. Specifically, you can resume execution from a prior checkpoint — either replaying the same state or modifying it to explore alternatives. In all cases, resuming past execution produces a new fork in the history.

Tip

For information on how to use time travel, see [Use time travel](../../how-tos/human_in_the_loop/time-travel/) and [Time travel using Server API](../../cloud/how-tos/human_in_the_loop_time_travel/).

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)