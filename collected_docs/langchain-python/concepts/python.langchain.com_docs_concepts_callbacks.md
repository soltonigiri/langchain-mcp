Callbacks | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/callbacks.mdx)Callbacks Prerequisites [Runnable interface](/docs/concepts/runnables/) LangChain provides a callback system that allows you to hook into the various stages of your LLM application. This is useful for logging, monitoring, streaming, and other tasks. You can subscribe to these events by using the callbacks argument available throughout the API. This argument is a list of handler objects, which are expected to implement one or more of the methods described below in more detail. Callback events[​](#callback-events) EventEvent TriggerAssociated MethodChat model startWhen a chat model startson_chat_model_startLLM startWhen a llm startson_llm_startLLM new tokenWhen an llm OR chat model emits a new tokenon_llm_new_tokenLLM endsWhen an llm OR chat model endson_llm_endLLM errorsWhen an llm OR chat model errorson_llm_errorChain startWhen a chain starts runningon_chain_startChain endWhen a chain endson_chain_endChain errorWhen a chain errorson_chain_errorTool startWhen a tool starts runningon_tool_startTool endWhen a tool endson_tool_endTool errorWhen a tool errorson_tool_errorAgent actionWhen an agent takes an actionon_agent_actionAgent finishWhen an agent endson_agent_finishRetriever startWhen a retriever startson_retriever_startRetriever endWhen a retriever endson_retriever_endRetriever errorWhen a retriever errorson_retriever_errorTextWhen arbitrary text is runon_textRetryWhen a retry event is runon_retry Callback handlers[​](#callback-handlers) Callback handlers can either be sync or async: Sync callback handlers implement the [BaseCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.BaseCallbackHandler.html) interface. Async callback handlers implement the [AsyncCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.AsyncCallbackHandler.html) interface. During run-time LangChain configures an appropriate callback manager (e.g., [CallbackManager](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.CallbackManager.html) or [AsyncCallbackManager](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.AsyncCallbackManager.html) which will be responsible for calling the appropriate method on each "registered" callback handler when the event is triggered. Passing callbacks[​](#passing-callbacks) The callbacks property is available on most objects throughout the API (Models, Tools, Agents, etc.) in two different places: Request time callbacks**: Passed at the time of the request in addition to the input data. Available on all standard Runnable objects. These callbacks are INHERITED by all children of the object they are defined on. For example, chain.invoke({"number": 25}, {"callbacks": [handler]}).

- **Constructor callbacks**: chain = TheNameOfSomeChain(callbacks=[handler]). These callbacks are passed as arguments to the constructor of the object. The callbacks are scoped only to the object they are defined on, and are **not** inherited by any children of the object.

warningConstructor callbacks are scoped only to the object they are defined on. They are **not** inherited by children of the object.

If you&#x27;re creating a custom chain or runnable, you need to remember to propagate request time callbacks to any child objects.

Async in Python

For specifics on how to use callbacks, see the [relevant how-to guides here](/docs/how_to/#callbacks).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/callbacks.mdx)

- [Callback events](#callback-events)
- [Callback handlers](#callback-handlers)
- [Passing callbacks](#passing-callbacks)

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