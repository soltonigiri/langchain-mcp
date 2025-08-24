- Prebuilt chat UI [Skip to content](#ui) Initializing search [GitHub](https://github.com/langchain-ai/langgraph)

- [Graph runs in LangSmith](../../how-tos/run-id-langsmith/)

- [Additional resources](../../additional-resources/)

[](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/agents/ui.md)

# UI[¶](#ui)

You can use a prebuilt chat UI for interacting with any LangGraph agent through the [Agent Chat UI](https://github.com/langchain-ai/agent-chat-ui). Using the [deployed version](https://agentchat.vercel.app) is the quickest way to get started, and allows you to interact with both local and deployed graphs.

## Run agent in UI[¶](#run-agent-in-ui)

First, set up LangGraph API server [locally](../../tutorials/langgraph-platform/local-server/) or deploy your agent on [LangGraph Platform](https://langchain-ai.github.io/langgraph/cloud/quick_start/).

Then, navigate to [Agent Chat UI](https://agentchat.vercel.app), or clone the repository and [run the dev server locally](https://github.com/langchain-ai/agent-chat-ui?tab=readme-ov-file#setup):

Tip

UI has out-of-box support for rendering tool calls, and tool result messages. To customize what messages are shown, see the [Hiding Messages in the Chat](https://github.com/langchain-ai/agent-chat-ui?tab=readme-ov-file#hiding-messages-in-the-chat) section in the Agent Chat UI documentation.

## Add human-in-the-loop[¶](#add-human-in-the-loop)

Agent Chat UI has full support for [human-in-the-loop](../../concepts/human_in_the_loop/) workflows. To try it out, replace the agent code in `src/agent/graph.py` (from the [deployment](../../tutorials/langgraph-platform/local-server/) guide) with this [agent implementation](../../how-tos/human_in_the_loop/add-human-in-the-loop/#add-interrupts-to-any-tool):

Important

Agent Chat UI works best if your LangGraph agent interrupts using the [HumanInterrupt schema](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.interrupt.HumanInterrupt). If you do not use that schema, the Agent Chat UI will be able to render the input passed to the `interrupt` function, but it will not have full support for resuming your graph.

## Generative UI[¶](#generative-ui)

You can also use generative UI in the Agent Chat UI.

Generative UI allows you to define [React](https://react.dev/) components, and push them to the UI from the LangGraph server. For more documentation on building generative UI LangGraph agents, read [these docs](https://langchain-ai.github.io/langgraph/cloud/how-tos/generative_ui_react/).

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)