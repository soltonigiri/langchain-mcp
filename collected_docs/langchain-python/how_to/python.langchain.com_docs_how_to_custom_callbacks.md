How to create custom callback handlers | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_callbacks.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_callbacks.ipynb)How to create custom callback handlers PrerequisitesThis guide assumes familiarity with the following concepts: [Callbacks](/docs/concepts/callbacks/) LangChain has some built-in callback handlers, but you will often want to create your own handlers with custom logic. To create a custom callback handler, we need to determine the [event(s)](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.BaseCallbackHandler.html#langchain-core-callbacks-base-basecallbackhandler) we want our callback handler to handle as well as what we want our callback handler to do when the event is triggered. Then all we need to do is attach the callback handler to the object, for example via [the constructor](/docs/how_to/callbacks_constructor/) or [at runtime](/docs/how_to/callbacks_runtime/). In the example below, we&#x27;ll implement streaming with a custom handler. In our custom callback handler MyCustomHandler, we implement the on_llm_new_token handler to print the token we have just received. We then attach our custom handler to the model object as a constructor callback.

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.prompts import ChatPromptTemplate

class MyCustomHandler(BaseCallbackHandler):
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        print(f"My custom handler, token: {token}")

prompt = ChatPromptTemplate.from_messages(["Tell me a joke about {animal}"])

# To enable streaming, we pass in `streaming=True` to the ChatModel constructor
# Additionally, we pass in our custom handler as a list to the callbacks parameter
model = ChatAnthropic(
    model="claude-3-7-sonnet-20250219", streaming=True, callbacks=[MyCustomHandler()]
)

chain = prompt | model

response = chain.invoke({"animal": "bears"})

```API Reference:**[BaseCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.BaseCallbackHandler.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
My custom handler, token:
My custom handler, token: Why
My custom handler, token:  don&#x27;t bears wear shoes?

Because they
My custom handler, token:  prefer to go bear-foot!
My custom handler, token:

``` You can see [this reference page](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.BaseCallbackHandler.html#langchain-core-callbacks-base-basecallbackhandler) for a list of events you can handle. Note that the handle_chain_* events run for most LCEL runnables. ## Next steps[​](#next-steps) You&#x27;ve now learned how to create your own custom callback handlers. Next, check out the other how-to guides in this section, such as [how to attach callbacks to a runnable](/docs/how_to/callbacks_attach/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/custom_callbacks.ipynb)[Next steps](#next-steps)

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