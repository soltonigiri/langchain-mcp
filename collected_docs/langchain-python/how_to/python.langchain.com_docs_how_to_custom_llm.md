How to create a custom LLM class | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_llm.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/custom_llm.ipynb)How to create a custom LLM class This notebook goes over how to create a custom LLM wrapper, in case you want to use your own LLM or a different wrapper than one that is supported in LangChain. Wrapping your LLM with the standard LLM interface allow you to use your LLM in existing LangChain programs with minimal code modifications. As an bonus, your LLM will automatically become a LangChain Runnable and will benefit from some optimizations out of the box, async support, the astream_events API, etc. cautionYou are currently on a page documenting the use of [text completion models](/docs/concepts/text_llms/). Many of the latest and most popular models are [chat completion models](/docs/concepts/chat_models/).Unless you are specifically using more advanced prompting techniques, you are probably looking for [this page instead](/docs/how_to/custom_chat_model/). Implementation[​](#implementation) There are only two required things that a custom LLM needs to implement: MethodDescription_callTakes in a string and some optional stop words, and returns a string. Used by invoke._llm_typeA property that returns a string, used for logging purposes only. Optional implementations: MethodDescription_identifying_paramsUsed to help with identifying the model and printing the LLM; should return a dictionary. This is a @property**._acallProvides an async native implementation of _call, used by ainvoke._streamMethod to stream the output token by token._astreamProvides an async native implementation of _stream; in newer LangChain versions, defaults to _stream. Let&#x27;s implement a simple custom LLM that just returns the first n characters of the input.

```python
from typing import Any, Dict, Iterator, List, Mapping, Optional

from langchain_core.callbacks.manager import CallbackManagerForLLMRun
from langchain_core.language_models.llms import LLM
from langchain_core.outputs import GenerationChunk

class CustomLLM(LLM):
    """A custom chat model that echoes the first `n` characters of the input.

    When contributing an implementation to LangChain, carefully document
    the model including the initialization parameters, include
    an example of how to initialize the model and include any relevant
    links to the underlying models documentation or API.

    Example:

        .. code-block:: python

            model = CustomChatModel(n=2)
            result = model.invoke([HumanMessage(content="hello")])
            result = model.batch([[HumanMessage(content="hello")],
                                 [HumanMessage(content="world")]])
    """

    n: int
    """The number of characters from the last message of the prompt to be echoed."""

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        """Run the LLM on the given input.

        Override this method to implement the LLM logic.

        Args:
            prompt: The prompt to generate from.
            stop: Stop words to use when generating. Model output is cut off at the
                first occurrence of any of the stop substrings.
                If stop tokens are not supported consider raising NotImplementedError.
            run_manager: Callback manager for the run.
            **kwargs: Arbitrary additional keyword arguments. These are usually passed
                to the model provider API call.

        Returns:
            The model output as a string. Actual completions SHOULD NOT include the prompt.
        """
        if stop is not None:
            raise ValueError("stop kwargs are not permitted.")
        return prompt[: self.n]

    def _stream(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> Iterator[GenerationChunk]:
        """Stream the LLM on the given prompt.

        This method should be overridden by subclasses that support streaming.

        If not implemented, the default behavior of calls to stream will be to
        fallback to the non-streaming version of the model and return
        the output as a single chunk.

        Args:
            prompt: The prompt to generate from.
            stop: Stop words to use when generating. Model output is cut off at the
                first occurrence of any of these substrings.
            run_manager: Callback manager for the run.
            **kwargs: Arbitrary additional keyword arguments. These are usually passed
                to the model provider API call.

        Returns:
            An iterator of GenerationChunks.
        """
        for char in prompt[: self.n]:
            chunk = GenerationChunk(text=char)
            if run_manager:
                run_manager.on_llm_new_token(chunk.text, chunk=chunk)

            yield chunk

    @property
    def _identifying_params(self) -> Dict[str, Any]:
        """Return a dictionary of identifying parameters."""
        return {
            # The model name allows users to specify custom token counting
            # rules in LLM monitoring applications (e.g., in LangSmith users
            # can provide per token pricing for their model and monitor
            # costs for the given LLM.)
            "model_name": "CustomChatModel",
        }

    @property
    def _llm_type(self) -> str:
        """Get the type of language model used by this chat model. Used for logging purposes only."""
        return "custom"

```**API Reference:**[CallbackManagerForLLMRun](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.CallbackManagerForLLMRun.html) | [LLM](https://python.langchain.com/api_reference/core/language_models/langchain_core.language_models.llms.LLM.html) | [GenerationChunk](https://python.langchain.com/api_reference/core/outputs/langchain_core.outputs.generation.GenerationChunk.html) ### Let&#x27;s test it 🧪[​](#lets-test-it-) This LLM will implement the standard Runnable interface of LangChain which many of the LangChain abstractions support!

```python
llm = CustomLLM(n=5)
print(llm)

```**

```output
[1mCustomLLM[0m
Params: {&#x27;model_name&#x27;: &#x27;CustomChatModel&#x27;}

```

```python
llm.invoke("This is a foobar thing")

```

```output
&#x27;This &#x27;

```

```python
await llm.ainvoke("world")

```

```output
&#x27;world&#x27;

```

```python
llm.batch(["woof woof woof", "meow meow meow"])

```

```output
[&#x27;woof &#x27;, &#x27;meow &#x27;]

```

```python
await llm.abatch(["woof woof woof", "meow meow meow"])

```

```output
[&#x27;woof &#x27;, &#x27;meow &#x27;]

```

```python
async for token in llm.astream("hello"):
    print(token, end="|", flush=True)

```

```output
h|e|l|l|o|

``` Let&#x27;s confirm that in integrates nicely with other LangChain APIs.

```python
from langchain_core.prompts import ChatPromptTemplate

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```python
prompt = ChatPromptTemplate.from_messages(
    [("system", "you are a bot"), ("human", "{input}")]
)

```

```python
llm = CustomLLM(n=7)
chain = prompt | llm

```

```python
idx = 0
async for event in chain.astream_events({"input": "hello there!"}, version="v1"):
    print(event)
    idx += 1
    if idx > 7:
        # Truncate
        break

```

```output
{&#x27;event&#x27;: &#x27;on_chain_start&#x27;, &#x27;run_id&#x27;: &#x27;05f24b4f-7ea3-4fb6-8417-3aa21633462f&#x27;, &#x27;name&#x27;: &#x27;RunnableSequence&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;input&#x27;: {&#x27;input&#x27;: &#x27;hello there!&#x27;}}}
{&#x27;event&#x27;: &#x27;on_prompt_start&#x27;, &#x27;name&#x27;: &#x27;ChatPromptTemplate&#x27;, &#x27;run_id&#x27;: &#x27;7e996251-a926-4344-809e-c425a9846d21&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;input&#x27;: {&#x27;input&#x27;: &#x27;hello there!&#x27;}}}
{&#x27;event&#x27;: &#x27;on_prompt_end&#x27;, &#x27;name&#x27;: &#x27;ChatPromptTemplate&#x27;, &#x27;run_id&#x27;: &#x27;7e996251-a926-4344-809e-c425a9846d21&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;input&#x27;: {&#x27;input&#x27;: &#x27;hello there!&#x27;}, &#x27;output&#x27;: ChatPromptValue(messages=[SystemMessage(content=&#x27;you are a bot&#x27;), HumanMessage(content=&#x27;hello there!&#x27;)])}}
{&#x27;event&#x27;: &#x27;on_llm_start&#x27;, &#x27;name&#x27;: &#x27;CustomLLM&#x27;, &#x27;run_id&#x27;: &#x27;a8766beb-10f4-41de-8750-3ea7cf0ca7e2&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;input&#x27;: {&#x27;prompts&#x27;: [&#x27;System: you are a bot\nHuman: hello there!&#x27;]}}}
{&#x27;event&#x27;: &#x27;on_llm_stream&#x27;, &#x27;name&#x27;: &#x27;CustomLLM&#x27;, &#x27;run_id&#x27;: &#x27;a8766beb-10f4-41de-8750-3ea7cf0ca7e2&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: &#x27;S&#x27;}}
{&#x27;event&#x27;: &#x27;on_chain_stream&#x27;, &#x27;run_id&#x27;: &#x27;05f24b4f-7ea3-4fb6-8417-3aa21633462f&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;name&#x27;: &#x27;RunnableSequence&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: &#x27;S&#x27;}}
{&#x27;event&#x27;: &#x27;on_llm_stream&#x27;, &#x27;name&#x27;: &#x27;CustomLLM&#x27;, &#x27;run_id&#x27;: &#x27;a8766beb-10f4-41de-8750-3ea7cf0ca7e2&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: &#x27;y&#x27;}}
{&#x27;event&#x27;: &#x27;on_chain_stream&#x27;, &#x27;run_id&#x27;: &#x27;05f24b4f-7ea3-4fb6-8417-3aa21633462f&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;name&#x27;: &#x27;RunnableSequence&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: &#x27;y&#x27;}}

``` ## Contributing[​](#contributing) We appreciate all chat model integration contributions. Here&#x27;s a checklist to help make sure your contribution gets added to LangChain: Documentation: The model contains doc-strings for all initialization arguments, as these will be surfaced in the [APIReference](https://python.langchain.com/api_reference/langchain/index.html).

- The class doc-string for the model contains a link to the model API if the model is powered by a service.

Tests:

- Add unit or integration tests to the overridden methods. Verify that invoke, ainvoke, batch, stream work if you&#x27;ve over-ridden the corresponding code.

Streaming (if you&#x27;re implementing it):

- Make sure to invoke the on_llm_new_token callback

- on_llm_new_token is invoked BEFORE yielding the chunk

Stop Token Behavior:

- Stop token should be respected

- Stop token should be INCLUDED as part of the response

Secret API Keys:

- If your model connects to an API it will likely accept API keys as part of its initialization. Use Pydantic&#x27;s SecretStr type for secrets, so they don&#x27;t get accidentally printed out when folks print the model.

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/custom_llm.ipynb)

- [Implementation](#implementation)[Let's test it 🧪](#lets-test-it-)

- [Contributing](#contributing)

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