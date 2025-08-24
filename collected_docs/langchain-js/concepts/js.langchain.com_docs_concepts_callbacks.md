Callbacks | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageCallbacksPrerequisitesRunnable interface](/docs/concepts/runnables)LangChain provides a callback system that allows you to hook into the various stages of your LLM application. This is useful for logging, monitoring, streaming, and other tasks.You can subscribe to these events by using the callbacks argument available throughout the API. This argument is list of handler objects, which are expected to implement one or more of the methods described below in more detail.Callback events[​](#callback-events)EventEvent TriggerAssociated MethodChat model startWhen a chat model startshandleChatModelStartLLM startWhen a llm startshandleLlmStartLLM new tokenWhen an llm OR chat model emits a new tokenhandleLlmNewTokenLLM endsWhen an llm OR chat model endshandleLlmEndLLM errorsWhen an llm OR chat model errorshandleLlmErrorChain startWhen a chain starts runninghandleChainStartChain endWhen a chain endshandleChainEndChain errorWhen a chain errorshandleChainErrorTool startWhen a tool starts runninghandleToolStartTool endWhen a tool endshandleToolEndTool errorWhen a tool errorshandleToolErrorRetriever startWhen a retriever startshandleRetrieverStartRetriever endWhen a retriever endshandleRetrieverEndRetriever errorWhen a retriever errorshandleRetrieverErrorCallback handlers[​](#callback-handlers)Callback handlers implement the [BaseCallbackHandler](https://api.js.langchain.com/classes/_langchain_core.callbacks_base.BaseCallbackHandler.html) interface.During run-time LangChain configures an appropriate callback manager (e.g., [CallbackManager](https://api.js.langchain.com/classes/_langchain_core.callbacks_manager.BaseCallbackManager.html)) which will be responsible for calling the appropriate method on each "registered" callback handler when the event is triggered.Passing callbacks[​](#passing-callbacks)The callbacks property is available on most objects throughout the API (Models, Tools, Agents, etc.) in two different places:Request time callbacks**: Passed at the time of the request in addition to the input data. Available on all standard Runnable objects. These callbacks are INHERITED by all children of the object they are defined on. For example, await chain.invoke({ number: 25 }, { callbacks: [handler] }).
- **Constructor callbacks**: const chain = new TheNameOfSomeChain({ callbacks: [handler] }). These callbacks are passed as arguments to the constructor of the object. The callbacks are scoped only to the object they are defined on, and are **not** inherited by any children of the object.

dangerConstructor callbacks are scoped only to the object they are defined on. They are **not** inherited by children of the object.

If you&#x27;re creating a custom chain or runnable, you need to remember to propagate request time callbacks to any child objects.

For specifics on how to use callbacks, see the [relevant how-to guides here](/docs/how_to/#callbacks).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Callback events](#callback-events)
- [Callback handlers](#callback-handlers)
- [Passing callbacks](#passing-callbacks)

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