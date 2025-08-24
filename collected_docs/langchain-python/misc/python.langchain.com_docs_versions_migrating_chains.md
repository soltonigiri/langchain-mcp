How to migrate from v0.0 chains | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/versions/migrating_chains/index.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/versions/migrating_chains/index.ipynb)How to migrate from v0.0 chains LangChain has evolved since its initial release, and many of the original "Chain" classes have been deprecated in favor of the more flexible and powerful frameworks of LCEL and LangGraph. This guide will help you migrate your existing v0.0 chains to the new abstractions. How deprecated implementations workEven though many of these implementations are deprecated, they are still supported** in the codebase. However, they are not recommended for new development, and we recommend re-implementing them using the following guides!To see the planned removal version for each deprecated implementation, check their API reference. PrerequisitesThese guides assume some familiarity with the following concepts: [LangChain Expression Language](/docs/concepts/lcel/)

- [LangGraph](https://langchain-ai.github.io/langgraph/)

LangChain maintains a number of legacy abstractions. Many of these can be reimplemented via short combinations of LCEL and LangGraph primitives.

### LCEL[​](#lcel)

[LCEL](/docs/concepts/lcel/) is designed to streamline the process of building useful apps with LLMs and combining related components. It does this by providing:

- **A unified interface**: Every LCEL object implements the Runnable interface, which defines a common set of invocation methods (invoke, batch, stream, ainvoke, ...). This makes it possible to also automatically and consistently support useful operations like streaming of intermediate steps and batching, since every chain composed of LCEL objects is itself an LCEL object.

- **Composition primitives**: LCEL provides a number of primitives that make it easy to compose chains, parallelize components, add fallbacks, dynamically configure chain internals, and more.

### LangGraph[​](#langgraph)

[LangGraph](https://langchain-ai.github.io/langgraph/), built on top of LCEL, allows for performant orchestrations of application components while maintaining concise and readable code. It includes built-in persistence, support for cycles, and prioritizes controllability. If LCEL grows unwieldy for larger or more complex chains, they may benefit from a LangGraph implementation.

### Advantages[​](#advantages)

Using these frameworks for existing v0.0 chains confers some advantages:

- The resulting chains typically implement the full Runnable interface, including streaming and asynchronous support where appropriate;

- The chains may be more easily extended or modified;

- The parameters of the chain are typically surfaced for easier customization (e.g., prompts) over previous versions, which tended to be subclasses and had opaque parameters and internals.

- If using LangGraph, the chain supports built-in persistence, allowing for conversational experiences via a "memory" of the chat history.

- If using LangGraph, the steps of the chain can be streamed, allowing for greater control and customizability.

The below pages assist with migration from various specific chains to LCEL and LangGraph:

- [LLMChain](/docs/versions/migrating_chains/llm_chain/)

- [ConversationChain](/docs/versions/migrating_chains/conversation_chain/)

- [RetrievalQA](/docs/versions/migrating_chains/retrieval_qa/)

- [ConversationalRetrievalChain](/docs/versions/migrating_chains/conversation_retrieval_chain/)

- [StuffDocumentsChain](/docs/versions/migrating_chains/stuff_docs_chain/)

- [MapReduceDocumentsChain](/docs/versions/migrating_chains/map_reduce_chain/)

- [MapRerankDocumentsChain](/docs/versions/migrating_chains/map_rerank_docs_chain/)

- [RefineDocumentsChain](/docs/versions/migrating_chains/refine_docs_chain/)

- [LLMRouterChain](/docs/versions/migrating_chains/llm_router_chain/)

- [MultiPromptChain](/docs/versions/migrating_chains/multi_prompt_chain/)

- [LLMMathChain](/docs/versions/migrating_chains/llm_math_chain/)

- [ConstitutionalChain](/docs/versions/migrating_chains/constitutional_chain/)

Check out the [LCEL conceptual docs](/docs/concepts/lcel/) and [LangGraph docs](https://langchain-ai.github.io/langgraph/) for more background information.

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/versions/migrating_chains/index.ipynb)

- [LCEL](#lcel)
- [LangGraph](#langgraph)
- [Advantages](#advantages)

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