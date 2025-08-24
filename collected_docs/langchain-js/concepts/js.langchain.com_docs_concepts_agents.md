Agents | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageAgentsBy themselves, language models can&#x27;t take actions - they just output text. Agents are systems that take a high-level task and use an LLM as a reasoning engine to decide what actions to take and execute those actions.LangGraph](/docs/concepts/architecture#langgraph) is an extension of LangChain specifically aimed at creating highly controllable and customizable agents. We recommend that you use LangGraph for building agents.Please see the following resources for more information:LangGraph docs on [common agent architectures](https://langchain-ai.github.io/langgraphjs/concepts/agentic_concepts/)
- [Pre-built agents in LangGraph](https://langchain-ai.github.io/langgraphjs/reference/functions/langgraph_prebuilt.createReactAgent.html)

## Legacy agent concept: AgentExecutor[​](#legacy-agent-concept-agentexecutor)

LangChain previously introduced the `AgentExecutor` as a runtime for agents. While it served as an excellent starting point, its limitations became apparent when dealing with more sophisticated and customized agents. As a result, we&#x27;re gradually phasing out `AgentExecutor` in favor of more flexible solutions in LangGraph.

### Transitioning from AgentExecutor to langgraph[​](#transitioning-from-agentexecutor-to-langgraph)

If you&#x27;re currently using `AgentExecutor`, don&#x27;t worry! We&#x27;ve prepared resources to help you:

- For those who still need to use AgentExecutor, we offer a comprehensive guide on [how to use AgentExecutor](/docs/how_to/agent_executor).
- However, we strongly recommend transitioning to LangGraph for improved flexibility and control. To facilitate this transition, we&#x27;ve created a detailed [migration guide](/docs/how_to/migrate_agent) to help you move from AgentExecutor to LangGraph seamlessly.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Legacy agent concept: AgentExecutor](#legacy-agent-concept-agentexecutor)[Transitioning from AgentExecutor to langgraph](#transitioning-from-agentexecutor-to-langgraph)

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