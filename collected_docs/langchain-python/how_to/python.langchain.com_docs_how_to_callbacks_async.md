How to use callbacks in async environments | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/callbacks_async.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/callbacks_async.ipynb)How to use callbacks in async environments PrerequisitesThis guide assumes familiarity with the following concepts: [Callbacks](/docs/concepts/callbacks/) [Custom callback handlers](/docs/how_to/custom_callbacks/) If you are planning to use the async APIs, it is recommended to use and extend [AsyncCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.AsyncCallbackHandler.html) to avoid blocking the event. warningIf you use a sync CallbackHandler while using an async method to run your LLM / Chain / Tool / Agent, it will still work. However, under the hood, it will be called with [run_in_executor](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor) which can cause issues if your CallbackHandler is not thread-safe. dangerIf you&#x27;re on python[AsyncCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.AsyncCallbackHandler.html) | [BaseCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.BaseCallbackHandler.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [LLMResult](https://python.langchain.com/api_reference/core/outputs/langchain_core.outputs.llm_result.LLMResult.html)

```output
zzzz....
Hi! I just woke up. Your llm is starting
Sync handler being called in a `thread_pool_executor`: token:
Sync handler being called in a `thread_pool_executor`: token: Why
Sync handler being called in a `thread_pool_executor`: token:  don&#x27;t scientists trust atoms?

Because they make up
Sync handler being called in a `thread_pool_executor`: token:  everything!
Sync handler being called in a `thread_pool_executor`: token:
zzzz....
Hi! I just woke up. Your llm is ending

```

```output
LLMResult(generations=[[ChatGeneration(text="Why don&#x27;t scientists trust atoms?\n\nBecause they make up everything!", message=AIMessage(content="Why don&#x27;t scientists trust atoms?\n\nBecause they make up everything!", additional_kwargs={}, response_metadata={&#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None}, id=&#x27;run--a596349d-8a7c-45fe-8691-bb1f9cfd6c08-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 11, &#x27;output_tokens&#x27;: 17, &#x27;total_tokens&#x27;: 28, &#x27;input_token_details&#x27;: {&#x27;cache_creation&#x27;: 0, &#x27;cache_read&#x27;: 0}}))]], llm_output={}, run=[RunInfo(run_id=UUID(&#x27;a596349d-8a7c-45fe-8691-bb1f9cfd6c08&#x27;))], type=&#x27;LLMResult&#x27;)

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to create your own custom callback handlers. Next, check out the other how-to guides in this section, such as [how to attach callbacks to a runnable](/docs/how_to/callbacks_attach/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/callbacks_async.ipynb)[Next steps](#next-steps)

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