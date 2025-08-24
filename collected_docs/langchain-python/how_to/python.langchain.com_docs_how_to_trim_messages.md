How to trim messages | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/trim_messages.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/trim_messages.ipynb)How to trim messages PrerequisitesThis guide assumes familiarity with the following concepts: [Messages](/docs/concepts/messages/) [Chat models](/docs/concepts/chat_models/) [Chaining](/docs/how_to/sequence/) [Chat history](/docs/concepts/chat_history/) The methods in this guide also require langchain-core>=0.2.9. All models have finite context windows, meaning there&#x27;s a limit to how many [tokens](/docs/concepts/tokens/) they can take as input. If you have very long messages or a chain/agent that accumulates a long message history, you&#x27;ll need to manage the length of the messages you&#x27;re passing in to the model. [trim_messages](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.trim_messages.html) can be used to reduce the size of a chat history to a specified token count or specified message count. If passing the trimmed chat history back into a chat model directly, the trimmed chat history should satisfy the following properties: The resulting chat history should be valid**. Usually this means that the following properties should be satisfied: The chat history **starts** with either (1) a HumanMessage or (2) a [SystemMessage](/docs/concepts/messages/#systemmessage) followed by a HumanMessage.

- The chat history **ends** with either a HumanMessage or a ToolMessage.

- A ToolMessage can only appear after an AIMessage that involved a tool call.

This can be achieved by setting `start_on="human"` and `ends_on=("human", "tool")`.

- It includes recent messages and drops old messages in the chat history. This can be achieved by setting strategy="last".

- Usually, the new chat history should include the SystemMessage if it was present in the original chat history since the SystemMessage includes special instructions to the chat model. The SystemMessage is almost always the first message in the history if present. This can be achieved by setting include_system=True.

## Trimming based on token count[​](#trimming-based-on-token-count)

Here, we&#x27;ll trim the chat history based on token count. The trimmed chat history will produce a **valid** chat history that includes the `SystemMessage`.

To keep the most recent messages, we set `strategy="last"`. We&#x27;ll also set `include_system=True` to include the `SystemMessage`, and `start_on="human"` to make sure the resulting chat history is valid.

This is a good default configuration when using `trim_messages` based on token count. Remember to adjust `token_counter` and `max_tokens` for your use case. Keep in mind that new queries added to the chat history will be included in the token count unless you trim prior to adding the new query.

Notice that for our `token_counter` we can pass in a function (more on that below) or a language model (since language models have a message token counting method). It makes sense to pass in a model when you&#x27;re trimming your messages to fit into the context window of that specific model:

```python
pip install -qU langchain-openai

```**

```python
from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
    trim_messages,
)
from langchain_core.messages.utils import count_tokens_approximately

messages = [
    SystemMessage("you&#x27;re a good assistant, you always respond with a joke."),
    HumanMessage("i wonder why it&#x27;s called langchain"),
    AIMessage(
        &#x27;Well, I guess they thought "WordRope" and "SentenceString" just didn\&#x27;t have the same ring to it!&#x27;
    ),
    HumanMessage("and who is harrison chasing anyways"),
    AIMessage(
        "Hmmm let me think.\n\nWhy, he&#x27;s probably chasing after the last cup of coffee in the office!"
    ),
    HumanMessage("what do you call a speechless parrot"),
]

trim_messages(
    messages,
    # Keep the last <= n_count tokens of the messages.
    strategy="last",
    # Remember to adjust based on your model
    # or else pass a custom token_counter
    token_counter=count_tokens_approximately,
    # Most chat models expect that chat history starts with either:
    # (1) a HumanMessage or
    # (2) a SystemMessage followed by a HumanMessage
    # Remember to adjust based on the desired conversation
    # length
    max_tokens=45,
    # Most chat models expect that chat history starts with either:
    # (1) a HumanMessage or
    # (2) a SystemMessage followed by a HumanMessage
    start_on="human",
    # Most chat models expect that chat history ends with either:
    # (1) a HumanMessage or
    # (2) a ToolMessage
    end_on=("human", "tool"),
    # Usually, we want to keep the SystemMessage
    # if it&#x27;s present in the original history.
    # The SystemMessage has special instructions for the model.
    include_system=True,
    allow_partial=False,
)

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html) | [trim_messages](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.trim_messages.html) | [count_tokens_approximately](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.count_tokens_approximately.html)

```output
[SystemMessage(content="you&#x27;re a good assistant, you always respond with a joke.", additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;what do you call a speechless parrot&#x27;, additional_kwargs={}, response_metadata={})]

```**Trimming based on message count[​](#trimming-based-on-message-count) Alternatively, we can trim the chat history based on message count**, by setting `token_counter=len`. In this case, each message will count as a single token, and `max_tokens` will control
the maximum number of messages.

This is a good default configuration when using `trim_messages` based on message count. Remember to adjust `max_tokens` for your use case.

```python
trim_messages(
    messages,
    # Keep the last <= n_count tokens of the messages.
    strategy="last",
    token_counter=len,
    # When token_counter=len, each message
    # will be counted as a single token.
    # Remember to adjust for your use case
    max_tokens=5,
    # Most chat models expect that chat history starts with either:
    # (1) a HumanMessage or
    # (2) a SystemMessage followed by a HumanMessage
    start_on="human",
    # Most chat models expect that chat history ends with either:
    # (1) a HumanMessage or
    # (2) a ToolMessage
    end_on=("human", "tool"),
    # Usually, we want to keep the SystemMessage
    # if it&#x27;s present in the original history.
    # The SystemMessage has special instructions for the model.
    include_system=True,
)

```**

```output
[SystemMessage(content="you&#x27;re a good assistant, you always respond with a joke.", additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;and who is harrison chasing anyways&#x27;, additional_kwargs={}, response_metadata={}),
 AIMessage(content="Hmmm let me think.\n\nWhy, he&#x27;s probably chasing after the last cup of coffee in the office!", additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;what do you call a speechless parrot&#x27;, additional_kwargs={}, response_metadata={})]

``` Advanced Usage[​](#advanced-usage) You can use trim_messages as a building-block to create more complex processing logic. If we want to allow splitting up the contents of a message we can specify allow_partial=True:

```python
trim_messages(
    messages,
    max_tokens=56,
    strategy="last",
    token_counter=count_tokens_approximately,
    include_system=True,
    allow_partial=True,
)

```

```output
[SystemMessage(content="you&#x27;re a good assistant, you always respond with a joke.", additional_kwargs={}, response_metadata={}),
 AIMessage(content="\nWhy, he&#x27;s probably chasing after the last cup of coffee in the office!", additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;what do you call a speechless parrot&#x27;, additional_kwargs={}, response_metadata={})]

``` By default, the SystemMessage will not be included, so you can drop it by either setting include_system=False or by dropping the include_system argument.

```python
trim_messages(
    messages,
    max_tokens=45,
    strategy="last",
    token_counter=count_tokens_approximately,
)

```

```output
[AIMessage(content="Hmmm let me think.\n\nWhy, he&#x27;s probably chasing after the last cup of coffee in the office!", additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;what do you call a speechless parrot&#x27;, additional_kwargs={}, response_metadata={})]

``` We can perform the flipped operation of getting the first max_tokens by specifying strategy="first":

```python
trim_messages(
    messages,
    max_tokens=45,
    strategy="first",
    token_counter=count_tokens_approximately,
)

```

```output
[SystemMessage(content="you&#x27;re a good assistant, you always respond with a joke.", additional_kwargs={}, response_metadata={}),
 HumanMessage(content="i wonder why it&#x27;s called langchain", additional_kwargs={}, response_metadata={})]

``` Using ChatModel as a token counter[​](#using-chatmodel-as-a-token-counter) You can pass a ChatModel as a token-counter. This will use ChatModel.get_num_tokens_from_messages. Let&#x27;s demonstrate how to use it with OpenAI:

```python
from langchain_openai import ChatOpenAI

trim_messages(
    messages,
    max_tokens=45,
    strategy="first",
    token_counter=ChatOpenAI(model="gpt-4o"),
)

```

```output
[SystemMessage(content="you&#x27;re a good assistant, you always respond with a joke.", additional_kwargs={}, response_metadata={}),
 HumanMessage(content="i wonder why it&#x27;s called langchain", additional_kwargs={}, response_metadata={})]

``` Writing a custom token counter[​](#writing-a-custom-token-counter) We can write a custom token counter function that takes in a list of messages and returns an int.

```python
pip install -qU tiktoken

```

```python
from typing import List

import tiktoken
from langchain_core.messages import BaseMessage, ToolMessage

def str_token_counter(text: str) -> int:
    enc = tiktoken.get_encoding("o200k_base")
    return len(enc.encode(text))

def tiktoken_counter(messages: List[BaseMessage]) -> int:
    """Approximately reproduce https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb

    For simplicity only supports str Message.contents.
    """
    num_tokens = 3  # every reply is primed with <|start|>assistant<|message|>
    tokens_per_message = 3
    tokens_per_name = 1
    for msg in messages:
        if isinstance(msg, HumanMessage):
            role = "user"
        elif isinstance(msg, AIMessage):
            role = "assistant"
        elif isinstance(msg, ToolMessage):
            role = "tool"
        elif isinstance(msg, SystemMessage):
            role = "system"
        else:
            raise ValueError(f"Unsupported messages type {msg.__class__}")
        num_tokens += (
            tokens_per_message
            + str_token_counter(role)
            + str_token_counter(msg.content)
        )
        if msg.name:
            num_tokens += tokens_per_name + str_token_counter(msg.name)
    return num_tokens

trim_messages(
    messages,
    token_counter=tiktoken_counter,
    # Keep the last <= n_count tokens of the messages.
    strategy="last",
    # When token_counter=len, each message
    # will be counted as a single token.
    # Remember to adjust for your use case
    max_tokens=45,
    # Most chat models expect that chat history starts with either:
    # (1) a HumanMessage or
    # (2) a SystemMessage followed by a HumanMessage
    start_on="human",
    # Most chat models expect that chat history ends with either:
    # (1) a HumanMessage or
    # (2) a ToolMessage
    end_on=("human", "tool"),
    # Usually, we want to keep the SystemMessage
    # if it&#x27;s present in the original history.
    # The SystemMessage has special instructions for the model.
    include_system=True,
)

```API Reference:**[BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html)

```output
[SystemMessage(content="you&#x27;re a good assistant, you always respond with a joke.", additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;what do you call a speechless parrot&#x27;, additional_kwargs={}, response_metadata={})]

```**Chaining[​](#chaining) trim_messages can be used imperatively (like above) or declaratively, making it easy to compose with other components in a chain

```python
llm = ChatOpenAI(model="gpt-4o")

# Notice we don&#x27;t pass in messages. This creates
# a RunnableLambda that takes messages as input
trimmer = trim_messages(
    token_counter=llm,
    # Keep the last <= n_count tokens of the messages.
    strategy="last",
    # When token_counter=len, each message
    # will be counted as a single token.
    # Remember to adjust for your use case
    max_tokens=45,
    # Most chat models expect that chat history starts with either:
    # (1) a HumanMessage or
    # (2) a SystemMessage followed by a HumanMessage
    start_on="human",
    # Most chat models expect that chat history ends with either:
    # (1) a HumanMessage or
    # (2) a ToolMessage
    end_on=("human", "tool"),
    # Usually, we want to keep the SystemMessage
    # if it&#x27;s present in the original history.
    # The SystemMessage has special instructions for the model.
    include_system=True,
)

chain = trimmer | llm
chain.invoke(messages)

```

```output
AIMessage(content=&#x27;A "polly-no-wanna-cracker"!&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 11, &#x27;prompt_tokens&#x27;: 32, &#x27;total_tokens&#x27;: 43, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_90d33c15d4&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-b1f8b63b-6bc2-4df4-b3b9-dfc4e3e675fe-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 32, &#x27;output_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 43, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})

``` Looking at [the LangSmith trace](https://smith.langchain.com/public/65af12c4-c24d-4824-90f0-6547566e59bb/r) we can see that before the messages are passed to the model they are first trimmed. Looking at just the trimmer, we can see that it&#x27;s a Runnable object that can be invoked like all Runnables:

```python
trimmer.invoke(messages)

```

```output
[SystemMessage(content="you&#x27;re a good assistant, you always respond with a joke.", additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;what do you call a speechless parrot&#x27;, additional_kwargs={}, response_metadata={})]

``` Using with ChatMessageHistory[​](#using-with-chatmessagehistory) Trimming messages is especially useful when [working with chat histories](/docs/how_to/message_history/), which can get arbitrarily long:

```python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

chat_history = InMemoryChatMessageHistory(messages=messages[:-1])

def dummy_get_session_history(session_id):
    if session_id != "1":
        return InMemoryChatMessageHistory()
    return chat_history

trimmer = trim_messages(
    max_tokens=45,
    strategy="last",
    token_counter=llm,
    # Usually, we want to keep the SystemMessage
    # if it&#x27;s present in the original history.
    # The SystemMessage has special instructions for the model.
    include_system=True,
    # Most chat models expect that chat history starts with either:
    # (1) a HumanMessage or
    # (2) a SystemMessage followed by a HumanMessage
    # start_on="human" makes sure we produce a valid chat history
    start_on="human",
)

chain = trimmer | llm
chain_with_history = RunnableWithMessageHistory(chain, dummy_get_session_history)
chain_with_history.invoke(
    [HumanMessage("what do you call a speechless parrot")],
    config={"configurable": {"session_id": "1"}},
)

```API Reference:**[InMemoryChatMessageHistory](https://python.langchain.com/api_reference/core/chat_history/langchain_core.chat_history.InMemoryChatMessageHistory.html) | [RunnableWithMessageHistory](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.history.RunnableWithMessageHistory.html)

```output
AIMessage(content=&#x27;A "polygon"!&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 4, &#x27;prompt_tokens&#x27;: 32, &#x27;total_tokens&#x27;: 36, &#x27;completion_tokens_details&#x27;: {&#x27;reasoning_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-05-13&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c17d3befe7&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-71d9fce6-bb0c-4bb3-acc8-d5eaee6ae7bc-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 32, &#x27;output_tokens&#x27;: 4, &#x27;total_tokens&#x27;: 36})

```

Looking at [the LangSmith trace](https://smith.langchain.com/public/17dd700b-9994-44ca-930c-116e00997315/r) we can see that we retrieve all of our messages but before the messages are passed to the model they are trimmed to be just the system message and last human message.

## API reference[​](#api-reference)

For a complete description of all arguments head to the [API reference](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.trim_messages.html).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/trim_messages.ipynb)

- [Trimming based on token count](#trimming-based-on-token-count)
- [Trimming based on message count](#trimming-based-on-message-count)
- [Advanced Usage](#advanced-usage)
- [Using ChatModel as a token counter](#using-chatmodel-as-a-token-counter)
- [Writing a custom token counter](#writing-a-custom-token-counter)
- [Chaining](#chaining)
- [Using with ChatMessageHistory](#using-with-chatmessagehistory)
- [API reference](#api-reference)

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