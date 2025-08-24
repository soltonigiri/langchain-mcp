How to propagate callbacks  constructor | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/callbacks_constructor.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/callbacks_constructor.ipynb)How to propagate callbacks constructor PrerequisitesThis guide assumes familiarity with the following concepts: [Callbacks](/docs/concepts/callbacks/) [Custom callback handlers](/docs/how_to/custom_callbacks/) Most LangChain modules allow you to pass callbacks directly into the constructor (i.e., initializer). In this case, the callbacks will only be called for that instance (and any nested runs). warningConstructor callbacks are scoped only to the object they are defined on. They are not** inherited by children of the object. This can lead to confusing behavior, and it&#x27;s generally better to pass callbacks as a run time argument. Here&#x27;s an example:

```python
from typing import Any, Dict, List

from langchain_anthropic import ChatAnthropic
from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.messages import BaseMessage
from langchain_core.outputs import LLMResult
from langchain_core.prompts import ChatPromptTemplate

class LoggingHandler(BaseCallbackHandler):
    def on_chat_model_start(
        self, serialized: Dict[str, Any], messages: List[List[BaseMessage]], **kwargs
    ) -> None:
        print("Chat model started")

    def on_llm_end(self, response: LLMResult, **kwargs) -> None:
        print(f"Chat model ended, response: {response}")

    def on_chain_start(
        self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs
    ) -> None:
        print(f"Chain {serialized.get(&#x27;name&#x27;)} started")

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs) -> None:
        print(f"Chain ended, outputs: {outputs}")

callbacks = [LoggingHandler()]
llm = ChatAnthropic(model="claude-3-7-sonnet-20250219", callbacks=callbacks)
prompt = ChatPromptTemplate.from_template("What is 1 + {number}?")

chain = prompt | llm

chain.invoke({"number": "2"})

```**API Reference:**[BaseCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.BaseCallbackHandler.html) | [BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [LLMResult](https://python.langchain.com/api_reference/core/outputs/langchain_core.outputs.llm_result.LLMResult.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
Chat model started
Chat model ended, response: generations=[[ChatGeneration(text=&#x27;1 + 2 = 3&#x27;, message=AIMessage(content=&#x27;1 + 2 = 3&#x27;, additional_kwargs={}, response_metadata={&#x27;id&#x27;: &#x27;msg_01DQMbSk263KpY2vouHM5gsC&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--ab896e4e-c3fd-48b1-a41a-b6b525cbc041-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 29, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}}))]] llm_output={&#x27;id&#x27;: &#x27;msg_01DQMbSk263KpY2vouHM5gsC&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;} run=None type=&#x27;LLMResult&#x27;

```

```output
AIMessage(content=&#x27;1 + 2 = 3&#x27;, additional_kwargs={}, response_metadata={&#x27;id&#x27;: &#x27;msg_01DQMbSk263KpY2vouHM5gsC&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--ab896e4e-c3fd-48b1-a41a-b6b525cbc041-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 29, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}})

``` You can see that we only see events from the chat model run - no chain events from the prompt or broader chain. ## Next steps[​](#next-steps) You&#x27;ve now learned how to pass callbacks into a constructor. Next, check out the other how-to guides in this section, such as how to [pass callbacks at runtime](/docs/how_to/callbacks_runtime/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/callbacks_constructor.ipynb)[Next steps](#next-steps)

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