How to create a custom chat model class | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_chat_model.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_chat_model.ipynb)How to create a custom chat model class PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) In this guide, we&#x27;ll learn how to create a custom [chat model](/docs/concepts/chat_models/) using LangChain abstractions. Wrapping your LLM with the standard [BaseChatModel](https://python.langchain.com/api_reference/core/language_models/langchain_core.language_models.chat_models.BaseChatModel.html) interface allow you to use your LLM in existing LangChain programs with minimal code modifications! As a bonus, your LLM will automatically become a LangChain [Runnable](/docs/concepts/runnables/) and will benefit from some optimizations out of the box (e.g., batch via a threadpool), async support, the astream_events API, etc. Inputs and outputs[​](#inputs-and-outputs) First, we need to talk about [messages](/docs/concepts/messages/)**, which are the inputs and outputs of chat models. ### Messages[​](#messages) Chat models take messages as inputs and return a message as output. LangChain has a few [built-in message types](/docs/concepts/messages/): Message TypeDescriptionSystemMessageUsed for priming AI behavior, usually passed in as the first of a sequence of input messages.HumanMessageRepresents a message from a person interacting with the chat model.AIMessageRepresents a message from the chat model. This can be either text or a request to invoke a tool.FunctionMessage / ToolMessageMessage for passing the results of tool invocation back to the model.AIMessageChunk / HumanMessageChunk / ...Chunk variant of each type of message. noteToolMessage and FunctionMessage closely follow OpenAI&#x27;s function and tool roles.This is a rapidly developing field and as more models add function calling capabilities. Expect that there will be additions to this schema.

```python
from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    FunctionMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)

```**API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [FunctionMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.function.FunctionMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html) ### Streaming Variant[​](#streaming-variant) All the chat messages have a streaming variant that contains Chunk in the name.

```python
from langchain_core.messages import (
    AIMessageChunk,
    FunctionMessageChunk,
    HumanMessageChunk,
    SystemMessageChunk,
    ToolMessageChunk,
)

```**API Reference:**[AIMessageChunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessageChunk.html) | [FunctionMessageChunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.function.FunctionMessageChunk.html) | [HumanMessageChunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessageChunk.html) | [SystemMessageChunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessageChunk.html) | [ToolMessageChunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessageChunk.html) These chunks are used when streaming output from chat models, and they all define an additive property!

```python
AIMessageChunk(content="Hello") + AIMessageChunk(content=" World!")

```**

```output
AIMessageChunk(content=&#x27;Hello World!&#x27;)

``` Base Chat Model[​](#base-chat-model) Let&#x27;s implement a chat model that echoes back the first n characters of the last message in the prompt! To do so, we will inherit from BaseChatModel and we&#x27;ll need to implement the following: Method/PropertyDescriptionRequired/Optional_generateUse to generate a chat result from a promptRequired_llm_type (property)Used to uniquely identify the type of the model. Used for logging.Required_identifying_params (property)Represent model parameterization for tracing purposes.Optional_streamUse to implement streaming.Optional_agenerateUse to implement a native async method.Optional_astreamUse to implement async version of _stream.Optional tipThe _astream implementation uses run_in_executor to launch the sync _stream in a separate thread if _stream is implemented, otherwise it fallsback to use _agenerate.You can use this trick if you want to reuse the _stream implementation, but if you&#x27;re able to implement code that&#x27;s natively async that&#x27;s a better solution since that code will run with less overhead. Implementation[​](#implementation)

```python
from typing import Any, Dict, Iterator, List, Optional

from langchain_core.callbacks import (
    CallbackManagerForLLMRun,
)
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import (
    AIMessage,
    AIMessageChunk,
    BaseMessage,
)
from langchain_core.messages.ai import UsageMetadata
from langchain_core.outputs import ChatGeneration, ChatGenerationChunk, ChatResult
from pydantic import Field

class ChatParrotLink(BaseChatModel):
    """A custom chat model that echoes the first `parrot_buffer_length` characters
    of the input.

    When contributing an implementation to LangChain, carefully document
    the model including the initialization parameters, include
    an example of how to initialize the model and include any relevant
    links to the underlying models documentation or API.

    Example:

        .. code-block:: python

            model = ChatParrotLink(parrot_buffer_length=2, model="bird-brain-001")
            result = model.invoke([HumanMessage(content="hello")])
            result = model.batch([[HumanMessage(content="hello")],
                                 [HumanMessage(content="world")]])
    """

    model_name: str = Field(alias="model")
    """The name of the model"""
    parrot_buffer_length: int
    """The number of characters from the last message of the prompt to be echoed."""
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    timeout: Optional[int] = None
    stop: Optional[List[str]] = None
    max_retries: int = 2

    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> ChatResult:
        """Override the _generate method to implement the chat model logic.

        This can be a call to an API, a call to a local model, or any other
        implementation that generates a response to the input prompt.

        Args:
            messages: the prompt composed of a list of messages.
            stop: a list of strings on which the model should stop generating.
                  If generation stops due to a stop token, the stop token itself
                  SHOULD BE INCLUDED as part of the output. This is not enforced
                  across models right now, but it&#x27;s a good practice to follow since
                  it makes it much easier to parse the output of the model
                  downstream and understand why generation stopped.
            run_manager: A run manager with callbacks for the LLM.
        """
        # Replace this with actual logic to generate a response from a list
        # of messages.
        last_message = messages[-1]
        tokens = last_message.content[: self.parrot_buffer_length]
        ct_input_tokens = sum(len(message.content) for message in messages)
        ct_output_tokens = len(tokens)
        message = AIMessage(
            content=tokens,
            additional_kwargs={},  # Used to add additional payload to the message
            response_metadata={  # Use for response metadata
                "time_in_seconds": 3,
                "model_name": self.model_name,
            },
            usage_metadata={
                "input_tokens": ct_input_tokens,
                "output_tokens": ct_output_tokens,
                "total_tokens": ct_input_tokens + ct_output_tokens,
            },
        )
        ##

        generation = ChatGeneration(message=message)
        return ChatResult(generations=[generation])

    def _stream(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> Iterator[ChatGenerationChunk]:
        """Stream the output of the model.

        This method should be implemented if the model can generate output
        in a streaming fashion. If the model does not support streaming,
        do not implement it. In that case streaming requests will be automatically
        handled by the _generate method.

        Args:
            messages: the prompt composed of a list of messages.
            stop: a list of strings on which the model should stop generating.
                  If generation stops due to a stop token, the stop token itself
                  SHOULD BE INCLUDED as part of the output. This is not enforced
                  across models right now, but it&#x27;s a good practice to follow since
                  it makes it much easier to parse the output of the model
                  downstream and understand why generation stopped.
            run_manager: A run manager with callbacks for the LLM.
        """
        last_message = messages[-1]
        tokens = str(last_message.content[: self.parrot_buffer_length])
        ct_input_tokens = sum(len(message.content) for message in messages)

        for token in tokens:
            usage_metadata = UsageMetadata(
                {
                    "input_tokens": ct_input_tokens,
                    "output_tokens": 1,
                    "total_tokens": ct_input_tokens + 1,
                }
            )
            ct_input_tokens = 0
            chunk = ChatGenerationChunk(
                message=AIMessageChunk(content=token, usage_metadata=usage_metadata)
            )

            if run_manager:
                # This is optional in newer versions of LangChain
                # The on_llm_new_token will be called automatically
                run_manager.on_llm_new_token(token, chunk=chunk)

            yield chunk

        # Let&#x27;s add some other information (e.g., response metadata)
        chunk = ChatGenerationChunk(
            message=AIMessageChunk(
                content="",
                response_metadata={"time_in_sec": 3, "model_name": self.model_name},
            )
        )
        if run_manager:
            # This is optional in newer versions of LangChain
            # The on_llm_new_token will be called automatically
            run_manager.on_llm_new_token(token, chunk=chunk)
        yield chunk

    @property
    def _llm_type(self) -> str:
        """Get the type of language model used by this chat model."""
        return "echoing-chat-model-advanced"

    @property
    def _identifying_params(self) -> Dict[str, Any]:
        """Return a dictionary of identifying parameters.

        This information is used by the LangChain callback system, which
        is used for tracing purposes make it possible to monitor LLMs.
        """
        return {
            # The model name allows users to specify custom token counting
            # rules in LLM monitoring applications (e.g., in LangSmith users
            # can provide per token pricing for their model and monitor
            # costs for the given LLM.)
            "model_name": self.model_name,
        }

```API Reference:**[CallbackManagerForLLMRun](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.CallbackManagerForLLMRun.html) | [BaseChatModel](https://python.langchain.com/api_reference/core/language_models/langchain_core.language_models.chat_models.BaseChatModel.html) | [AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [AIMessageChunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessageChunk.html) | [BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [UsageMetadata](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.UsageMetadata.html) | [ChatGeneration](https://python.langchain.com/api_reference/core/outputs/langchain_core.outputs.chat_generation.ChatGeneration.html) | [ChatGenerationChunk](https://python.langchain.com/api_reference/core/outputs/langchain_core.outputs.chat_generation.ChatGenerationChunk.html) | [ChatResult](https://python.langchain.com/api_reference/core/outputs/langchain_core.outputs.chat_result.ChatResult.html) ### Let&#x27;s test it 🧪[​](#lets-test-it-) The chat model will implement the standard Runnable interface of LangChain which many of the LangChain abstractions support!

```python
model = ChatParrotLink(parrot_buffer_length=3, model="my_custom_model")

model.invoke(
    [
        HumanMessage(content="hello!"),
        AIMessage(content="Hi there human!"),
        HumanMessage(content="Meow!"),
    ]
)

```

```output
AIMessage(content=&#x27;Meo&#x27;, additional_kwargs={}, response_metadata={&#x27;time_in_seconds&#x27;: 3}, id=&#x27;run-cf11aeb6-8ab6-43d7-8c68-c1ef89b6d78e-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 26, &#x27;output_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 29})

```

```python
model.invoke("hello")

```

```output
AIMessage(content=&#x27;hel&#x27;, additional_kwargs={}, response_metadata={&#x27;time_in_seconds&#x27;: 3}, id=&#x27;run-618e5ed4-d611-4083-8cf1-c270726be8d9-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 5, &#x27;output_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 8})

```

```python
model.batch(["hello", "goodbye"])

```

```output
[AIMessage(content=&#x27;hel&#x27;, additional_kwargs={}, response_metadata={&#x27;time_in_seconds&#x27;: 3}, id=&#x27;run-eea4ed7d-d750-48dc-90c0-7acca1ff388f-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 5, &#x27;output_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 8}),
 AIMessage(content=&#x27;goo&#x27;, additional_kwargs={}, response_metadata={&#x27;time_in_seconds&#x27;: 3}, id=&#x27;run-07cfc5c1-3c62-485f-b1e0-3d46e1547287-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 7, &#x27;output_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 10})]

```

```python
for chunk in model.stream("cat"):
    print(chunk.content, end="|")

```

```output
c|a|t||

``` Please see the implementation of _astream in the model! If you do not implement it, then no output will stream.!

```python
async for chunk in model.astream("cat"):
    print(chunk.content, end="|")

```

```output
c|a|t||

``` Let&#x27;s try to use the astream events API which will also help double check that all the callbacks were implemented!

```python
async for event in model.astream_events("cat", version="v1"):
    print(event)

```

```output
{&#x27;event&#x27;: &#x27;on_chat_model_start&#x27;, &#x27;run_id&#x27;: &#x27;3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, &#x27;name&#x27;: &#x27;ChatParrotLink&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;cat&#x27;}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;run_id&#x27;: &#x27;3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;name&#x27;: &#x27;ChatParrotLink&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;c&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 3, &#x27;output_tokens&#x27;: 1, &#x27;total_tokens&#x27;: 4})}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;run_id&#x27;: &#x27;3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;name&#x27;: &#x27;ChatParrotLink&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;a&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 0, &#x27;output_tokens&#x27;: 1, &#x27;total_tokens&#x27;: 1})}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;run_id&#x27;: &#x27;3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;name&#x27;: &#x27;ChatParrotLink&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;t&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run-3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 0, &#x27;output_tokens&#x27;: 1, &#x27;total_tokens&#x27;: 1})}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;run_id&#x27;: &#x27;3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;name&#x27;: &#x27;ChatParrotLink&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={}, response_metadata={&#x27;time_in_sec&#x27;: 3}, id=&#x27;run-3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;)}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_end&#x27;, &#x27;name&#x27;: &#x27;ChatParrotLink&#x27;, &#x27;run_id&#x27;: &#x27;3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;output&#x27;: AIMessageChunk(content=&#x27;cat&#x27;, additional_kwargs={}, response_metadata={&#x27;time_in_sec&#x27;: 3}, id=&#x27;run-3f0b5501-5c78-45b3-92fc-8322a6a5024a&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 3, &#x27;output_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 6})}, &#x27;parent_ids&#x27;: []}

``` ## Contributing[​](#contributing) We appreciate all chat model integration contributions. Here&#x27;s a checklist to help make sure your contribution gets added to LangChain: Documentation: The model contains doc-strings for all initialization arguments, as these will be surfaced in the [API Reference](https://python.langchain.com/api_reference/langchain/index.html).

- The class doc-string for the model contains a link to the model API if the model is powered by a service.

Tests:

- Add unit or integration tests to the overridden methods. Verify that invoke, ainvoke, batch, stream work if you&#x27;ve over-ridden the corresponding code.

Streaming (if you&#x27;re implementing it):

- Implement the _stream method to get streaming working

Stop Token Behavior:

- Stop token should be respected

- Stop token should be INCLUDED as part of the response

Secret API Keys:

- If your model connects to an API it will likely accept API keys as part of its initialization. Use Pydantic&#x27;s SecretStr type for secrets, so they don&#x27;t get accidentally printed out when folks print the model.

Identifying Params:

- Include a model_name in identifying params

Optimizations:

Consider providing native async support to reduce the overhead from the model!

- Provided a native async of _agenerate (used by ainvoke)

- Provided a native async of _astream (used by astream)

## Next steps[​](#next-steps)

You&#x27;ve now learned how to create your own custom chat models.

Next, check out the other how-to guides chat models in this section, like [how to get a model to return structured output](/docs/how_to/structured_output/) or [how to track chat model token usage](/docs/how_to/chat_token_usage_tracking/).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/custom_chat_model.ipynb)

- [Inputs and outputs](#inputs-and-outputs)[Messages](#messages)
- [Streaming Variant](#streaming-variant)

- [Base Chat Model](#base-chat-model)[Implementation](#implementation)
- [Let's test it 🧪](#lets-test-it-)

- [Contributing](#contributing)
- [Next steps](#next-steps)

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