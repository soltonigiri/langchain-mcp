How to merge consecutive messages of the same type | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/merge_message_runs.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/merge_message_runs.ipynb)How to merge consecutive messages of the same type Certain models do not support passing in consecutive [messages](/docs/concepts/messages/) of the same type (a.k.a. "runs" of the same message type). The merge_message_runs utility makes it easy to merge consecutive messages of the same type. Setup[​](#setup)

```python
%pip install -qU langchain-core langchain-anthropic

``` Basic usage[​](#basic-usage)

```python
from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    merge_message_runs,
)

messages = [
    SystemMessage("you&#x27;re a good assistant."),
    SystemMessage("you always respond with a joke."),
    HumanMessage([{"type": "text", "text": "i wonder why it&#x27;s called langchain"}]),
    HumanMessage("and who is harrison chasing anyways"),
    AIMessage(
        &#x27;Well, I guess they thought "WordRope" and "SentenceString" just didn\&#x27;t have the same ring to it!&#x27;
    ),
    AIMessage("Why, he&#x27;s probably chasing after the last cup of coffee in the office!"),
]

merged = merge_message_runs(messages)
print("\n\n".join([repr(x) for x in merged]))

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [merge_message_runs](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.merge_message_runs.html)

```output
SystemMessage(content="you&#x27;re a good assistant.\nyou always respond with a joke.", additional_kwargs={}, response_metadata={})

HumanMessage(content=[{&#x27;type&#x27;: &#x27;text&#x27;, &#x27;text&#x27;: "i wonder why it&#x27;s called langchain"}, &#x27;and who is harrison chasing anyways&#x27;], additional_kwargs={}, response_metadata={})

AIMessage(content=&#x27;Well, I guess they thought "WordRope" and "SentenceString" just didn\&#x27;t have the same ring to it!\nWhy, he\&#x27;s probably chasing after the last cup of coffee in the office!&#x27;, additional_kwargs={}, response_metadata={})

```**Notice that if the contents of one of the messages to merge is a list of content blocks then the merged message will have a list of content blocks. And if both messages to merge have string contents then those are concatenated with a newline character. Chaining[​](#chaining) merge_message_runs can be used imperatively (like above) or declaratively, making it easy to compose with other components in a chain:

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-7-sonnet-20250219", temperature=0)
# Notice we don&#x27;t pass in messages. This creates
# a RunnableLambda that takes messages as input
merger = merge_message_runs()
chain = merger | llm
chain.invoke(messages)

```

```output
AIMessage(content=&#x27;\n\nAs for the actual answer, LangChain is named for connecting (chaining) language models together with other components. And Harrison Chase is one of the co-founders of LangChain, not someone being chased! \n\nBut I like to think he\&#x27;s running after runaway tokens that escaped from the embedding space. "Come back here, you vectors!"&#x27;, additional_kwargs={}, response_metadata={&#x27;id&#x27;: &#x27;msg_018MF8xBrM1ztw69XTx3Uxcy&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 84, &#x27;output_tokens&#x27;: 80, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--caa1b9d6-a554-40ad-95cd-268938d8223b-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 84, &#x27;output_tokens&#x27;: 80, &#x27;total_tokens&#x27;: 164, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}})

``` Looking at the LangSmith trace we can see that before the messages are passed to the model they are merged: [https://smith.langchain.com/public/ab558677-cac9-4c59-9066-1ecce5bcd87c/r](https://smith.langchain.com/public/ab558677-cac9-4c59-9066-1ecce5bcd87c/r) Looking at just the merger, we can see that it&#x27;s a Runnable object that can be invoked like all Runnables:

```python
merger.invoke(messages)

```

```output
[SystemMessage(content="you&#x27;re a good assistant.\nyou always respond with a joke.", additional_kwargs={}, response_metadata={}),
 HumanMessage(content=[{&#x27;type&#x27;: &#x27;text&#x27;, &#x27;text&#x27;: "i wonder why it&#x27;s called langchain"}, &#x27;and who is harrison chasing anyways&#x27;], additional_kwargs={}, response_metadata={}),
 AIMessage(content=&#x27;Well, I guess they thought "WordRope" and "SentenceString" just didn\&#x27;t have the same ring to it!\nWhy, he\&#x27;s probably chasing after the last cup of coffee in the office!&#x27;, additional_kwargs={}, response_metadata={})]

``` merge_message_runs can also be placed after a prompt:

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate(
    [
        ("system", "You&#x27;re great a {skill}"),
        ("system", "You&#x27;re also great at explaining things"),
        ("human", "{query}"),
    ]
)
chain = prompt | merger | llm
chain.invoke({"skill": "math", "query": "what&#x27;s the definition of a convergent series"})

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
AIMessage(content="# Definition of a Convergent Series\n\nA series is a sum of terms in a sequence, typically written as:\n\n$$\\sum_{n=1}^{\\infty} a_n = a_1 + a_2 + a_3 + \\ldots$$\n\nA series is called **convergent** if the sequence of partial sums approaches a finite limit.\n\n## Formal Definition\n\nLet&#x27;s define the sequence of partial sums:\n$$S_N = \\sum_{n=1}^{N} a_n = a_1 + a_2 + \\ldots + a_N$$\n\nA series $\\sum_{n=1}^{\\infty} a_n$ is convergent if and only if:\n- The limit of the partial sums exists and is finite\n- That is, there exists a finite number $S$ such that $\\lim_{N \\to \\infty} S_N = S$\n\nIf this limit exists, we say the series converges to $S$, and we write:\n$$\\sum_{n=1}^{\\infty} a_n = S$$\n\nIf the limit doesn&#x27;t exist or is infinite, the series is called divergent.", additional_kwargs={}, response_metadata={&#x27;id&#x27;: &#x27;msg_018ypyi2MTjV6S7jCydSqDn9&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 29, &#x27;output_tokens&#x27;: 273, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--5de0ca29-d031-48f7-bc75-671eade20b74-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 29, &#x27;output_tokens&#x27;: 273, &#x27;total_tokens&#x27;: 302, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}})

``` [LangSmith Trace](https://smith.langchain.com/public/432150b6-9909-40a7-8ae7-944b7e657438/r/f4ad5fb2-4d38-42a6-b780-25f62617d53f) ## API reference[​](#api-reference) For a complete description of all arguments head to the [API reference](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.merge_message_runs.html)[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/merge_message_runs.ipynb)[Setup](#setup)
- [Basic usage](#basic-usage)
- [Chaining](#chaining)
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