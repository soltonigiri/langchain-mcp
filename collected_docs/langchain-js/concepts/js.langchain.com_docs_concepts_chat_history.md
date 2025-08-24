Chat history | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChat historyPrerequisitesMessages](/docs/concepts/messages)[Chat models](/docs/concepts/chat_models)[Tool calling](/docs/concepts/tool_calling)Chat history is a record of the conversation between the user and the chat model. It is used to maintain context and state throughout the conversation. The chat history is sequence of [messages](/docs/concepts/messages), each of which is associated with a specific [role](/docs/concepts/messages#role), such as "user", "assistant", "system", or "tool".Conversation patterns[​](#conversation-patterns)![Conversation patterns ](/assets/images/conversation_patterns-0e4c2311b54fae7412f74b1408615432.png)Most conversations start with a system message** that sets the context for the conversation. This is followed by a **user message** containing the user&#x27;s input, and then an **assistant message** containing the model&#x27;s response.The **assistant** may respond directly to the user or if configured with tools request that a [tool](/docs/concepts/tool_calling) be invoked to perform a specific task.So a full conversation often involves a combination of two patterns of alternating messages:The **user** and the **assistant** representing a back-and-forth conversation.
- The **assistant** and **tool messages** representing an ["agentic" workflow](/docs/concepts/agents) where the assistant is invoking tools to perform specific tasks.

## Managing chat history[​](#managing-chat-history)

Since chat models have a maximum limit on input size, it&#x27;s important to manage chat history and trim it as needed to avoid exceeding the [context window](/docs/concepts/chat_models#context_window).

While processing chat history, it&#x27;s essential to preserve a correct conversation structure.

Key guidelines for managing chat history:

- The conversation should follow one of these structures:The first message is either a "user" message or a "system" message, followed by a "user" and then an "assistant" message.
- The last message should be either a "user" message or a "tool" message containing the result of a tool call.

- When using [tool calling](/docs/concepts/tool_calling), a "tool" message should only follow an "assistant" message that requested the tool invocation.

tipUnderstanding correct conversation structure is essential for being able to properly implement [memory](https://langchain-ai.github.io/langgraphjs/concepts/memory/) in chat models.

## Related resources[​](#related-resources)

- [How to trim messages](/docs/how_to/trim_messages/)
- [Memory guide](https://langchain-ai.github.io/langgraphjs/concepts/memory/) for information on implementing short-term and long-term memory in chat models using [LangGraph](https://langchain-ai.github.io/langgraphjs/).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Conversation patterns](#conversation-patterns)
- [Managing chat history](#managing-chat-history)
- [Related resources](#related-resources)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.