Architecture | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/architecture.mdx)Architecture LangChain is a framework that consists of a number of packages. ![Diagram outlining the hierarchical organization of the LangChain framework, displaying the interconnected parts across multiple layers. ](/svg/langchain_stack_112024.svg)![Diagram outlining the hierarchical organization of the LangChain framework, displaying the interconnected parts across multiple layers. ](/svg/langchain_stack_112024_dark.svg) langchain-core[​](#langchain-core) This package contains base abstractions for different components and ways to compose them together. The interfaces for core components like chat models, vector stores, tools and more are defined here. No third-party integrations are defined here.** The dependencies are kept purposefully very lightweight. ## langchain[​](#langchain) The main langchain package contains chains and retrieval strategies that make up an application&#x27;s cognitive architecture. These are NOT third-party integrations. All chains, agents, and retrieval strategies here are NOT specific to any one integration, but rather generic across all integrations. ## Integration packages[​](#integration-packages) Popular integrations have their own packages (e.g. langchain-openai, langchain-anthropic, etc) so that they can be properly versioned and appropriately lightweight. For more information see: A list [integrations packages](/docs/integrations/providers/)

- The [API Reference](https://python.langchain.com/api_reference/) where you can find detailed information about each of the integration package.

## langchain-community[​](#langchain-community)

This package contains third-party integrations that are maintained by the LangChain community. Key integration packages are separated out (see above). This contains integrations for various components (chat models, vector stores, tools, etc). All dependencies in this package are optional to keep the package as lightweight as possible.

## langgraph[​](#langgraph)

`langgraph` is an extension of `langchain` aimed at building robust and stateful multi-actor applications with LLMs by modeling steps as edges and nodes in a graph.

LangGraph exposes high level interfaces for creating common types of agents, as well as a low-level API for composing custom flows.

Further reading - See our LangGraph overview [here](https://langchain-ai.github.io/langgraph/concepts/high_level/#core-principles). - See our LangGraph Academy Course [here](https://academy.langchain.com/courses/intro-to-langgraph). ## langserve[​](#langserve) A package to deploy LangChain chains as REST APIs. Makes it easy to get a production ready API up and running.

importantLangServe is designed to primarily deploy simple Runnables and work with well-known primitives in langchain-core.

If you need a deployment option for LangGraph, you should instead be looking at LangGraph Platform (beta) which will be better suited for deploying LangGraph applications.

For more information, see the [LangServe documentation](/docs/langserve/).

## LangSmith[​](#langsmith)

A developer platform that lets you debug, test, evaluate, and monitor LLM applications.

For more information, see the [LangSmith documentation](https://docs.smith.langchain.com)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/architecture.mdx)

- [langchain-core](#langchain-core)
- [langchain](#langchain)
- [Integration packages](#integration-packages)
- [langchain-community](#langchain-community)
- [langgraph](#langgraph)
- [langserve](#langserve)
- [LangSmith](#langsmith)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)
- [Slack](https://www.langchain.com/join-community)

GitHub

- [Organization](https://github.com/langchain-ai)
- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)
- [YouTube](https://www.youtube.com/@LangChain)

Copyright © 2025 LangChain, Inc.