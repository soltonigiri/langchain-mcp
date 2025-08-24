How to pass callbacks in at runtime | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/callbacks_runtime.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/callbacks_runtime.ipynb)How to pass callbacks in at runtime PrerequisitesThis guide assumes familiarity with the following concepts: [Callbacks](/docs/concepts/callbacks/) [Custom callback handlers](/docs/how_to/custom_callbacks/) In many cases, it is advantageous to pass in handlers instead when running the object. When we pass through [CallbackHandlers](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.BaseCallbackHandler.html#langchain-core-callbacks-base-basecallbackhandler) using the callbacks keyword arg when executing a run, those callbacks will be issued by all nested objects involved in the execution. For example, when a handler is passed through to an Agent, it will be used for all callbacks related to the agent and all the objects involved in the agent&#x27;s execution, in this case, the Tools and LLM. This prevents us from having to manually attach the handlers to each individual nested object. Here&#x27;s an example:

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
llm = ChatAnthropic(model="claude-3-7-sonnet-20250219")
prompt = ChatPromptTemplate.from_template("What is 1 + {number}?")

chain = prompt | llm

chain.invoke({"number": "2"}, config={"callbacks": callbacks})

```API Reference:**[BaseCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.BaseCallbackHandler.html) | [BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [LLMResult](https://python.langchain.com/api_reference/core/outputs/langchain_core.outputs.llm_result.LLMResult.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
Error in LoggingHandler.on_chain_start callback: AttributeError("&#x27;NoneType&#x27; object has no attribute &#x27;get&#x27;")
``````output
Chain ChatPromptTemplate started
Chain ended, outputs: messages=[HumanMessage(content=&#x27;What is 1 + 2?&#x27;, additional_kwargs={}, response_metadata={})]
Chat model started
Chat model ended, response: generations=[[ChatGeneration(text=&#x27;1 + 2 = 3&#x27;, message=AIMessage(content=&#x27;1 + 2 = 3&#x27;, additional_kwargs={}, response_metadata={&#x27;id&#x27;: &#x27;msg_019ieJt8K32iC77qBbQmSa9m&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--2f596356-99c9-45ef-94ff-fb170072abdf-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 29, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}}))]] llm_output={&#x27;id&#x27;: &#x27;msg_019ieJt8K32iC77qBbQmSa9m&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;} run=None type=&#x27;LLMResult&#x27;
Chain ended, outputs: content=&#x27;1 + 2 = 3&#x27; additional_kwargs={} response_metadata={&#x27;id&#x27;: &#x27;msg_019ieJt8K32iC77qBbQmSa9m&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;} id=&#x27;run--2f596356-99c9-45ef-94ff-fb170072abdf-0&#x27; usage_metadata={&#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 29, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}}

```

```output
AIMessage(content=&#x27;1 + 2 = 3&#x27;, additional_kwargs={}, response_metadata={&#x27;id&#x27;: &#x27;msg_019ieJt8K32iC77qBbQmSa9m&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--2f596356-99c9-45ef-94ff-fb170072abdf-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 29, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}})

``` If there are already existing callbacks associated with a module, these will run in addition to any passed in at runtime. ## Next steps[​](#next-steps) You&#x27;ve now learned how to pass callbacks at runtime. Next, check out the other how-to guides in this section, such as how to [pass callbacks into a module constructor](/docs/how_to/custom_callbacks/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/callbacks_runtime.ipynb)[Next steps](#next-steps)

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