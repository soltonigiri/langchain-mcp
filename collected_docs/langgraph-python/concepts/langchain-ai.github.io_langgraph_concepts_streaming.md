- Overview **[Skip to content](#streaming) Initializing search [GitHub](https://github.com/langchain-ai/langgraph) LangGraph APIs Core capabilities [Stream outputs](../../how-tos/streaming/) [Persistence](../persistence/) [Durable execution](../durable_execution/) [Memory](../memory/) [Context](../../agents/context/) [Models](../../agents/models/) [Tools](../tools/) [Human-in-the-loop](../human_in_the_loop/) [Time travel](../time-travel/) [Subgraphs](../subgraphs/) [Multi-agent](../multi_agent/) [MCP](../mcp/) [Tracing](../tracing/) [Reference](../../reference/) [Examples](../../examples/) [Additional resources](../../additional-resources/) [](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/concepts/streaming.md) Streaming[¶](#streaming) LangGraph implements a streaming system to surface real-time updates, allowing for responsive and transparent user experiences. LangGraph’s streaming system lets you surface live feedback from graph runs to your app. There are three main categories of data you can stream: Workflow progress** — get state updates after each graph node is executed.

- **LLM tokens** — stream language model tokens as they’re generated.

- **Custom updates** — emit user-defined signals (e.g., “Fetched 10/100 records”).

## What’s possible with LangGraph streaming[¶](#whats-possible-with-langgraph-streaming)

- [Stream LLM tokens](../../how-tos/streaming/#messages) — capture token streams from anywhere: inside nodes, subgraphs, or tools.

- [Emit progress notifications from tools](../../how-tos/streaming/#stream-custom-data) — send custom updates or progress signals directly from tool functions.

- [Stream from subgraphs](../../how-tos/streaming/#stream-subgraph-outputs) — include outputs from both the parent graph and any nested subgraphs.

- [Use any LLM](../../how-tos/streaming/#use-with-any-llm) — stream tokens from any LLM, even if it's not a LangChain model using the custom streaming mode.

- [Use multiple streaming modes](../../how-tos/streaming/#stream-multiple-modes) — choose from values (full state), updates (state deltas), messages (LLM tokens + metadata), custom (arbitrary user data), or debug (detailed traces).

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)