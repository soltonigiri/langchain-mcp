How to filter messages | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/filter_messages.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/filter_messages.ipynb)How to filter messages In more complex chains and agents we might track state with a list of [messages](/docs/concepts/messages/). This list can start to accumulate messages from multiple different models, speakers, sub-chains, etc., and we may only want to pass subsets of this full list of messages to each model call in the chain/agent. The filter_messages utility makes it easy to filter messages by type, id, or name. Basic usage[​](#basic-usage)

```python
from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    filter_messages,
)

messages = [
    SystemMessage("you are a good assistant", id="1"),
    HumanMessage("example input", id="2", name="example_user"),
    AIMessage("example output", id="3", name="example_assistant"),
    HumanMessage("real input", id="4", name="bob"),
    AIMessage("real output", id="5", name="alice"),
]

filter_messages(messages, include_types="human")

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [filter_messages](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.filter_messages.html)

```output
[HumanMessage(content=&#x27;example input&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;example_user&#x27;, id=&#x27;2&#x27;),
 HumanMessage(content=&#x27;real input&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;bob&#x27;, id=&#x27;4&#x27;)]

```

```python
filter_messages(messages, exclude_names=["example_user", "example_assistant"])

```

```output
[SystemMessage(content=&#x27;you are a good assistant&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;1&#x27;),
 HumanMessage(content=&#x27;real input&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;bob&#x27;, id=&#x27;4&#x27;),
 AIMessage(content=&#x27;real output&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;alice&#x27;, id=&#x27;5&#x27;)]

```

```python
filter_messages(messages, include_types=[HumanMessage, AIMessage], exclude_ids=["3"])

```

```output
[HumanMessage(content=&#x27;example input&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;example_user&#x27;, id=&#x27;2&#x27;),
 HumanMessage(content=&#x27;real input&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;bob&#x27;, id=&#x27;4&#x27;),
 AIMessage(content=&#x27;real output&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;alice&#x27;, id=&#x27;5&#x27;)]

``` ## Chaining[​](#chaining) filter_messages can be used imperatively (like above) or declaratively, making it easy to compose with other components in a chain:

```python
%pip install -qU langchain-anthropic

```

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-7-sonnet-20250219", temperature=0)
# Notice we don&#x27;t pass in messages. This creates
# a RunnableLambda that takes messages as input
filter_ = filter_messages(exclude_names=["example_user", "example_assistant"])
chain = filter_ | llm
chain.invoke(messages)

```

```output
AIMessage(content=[], additional_kwargs={}, response_metadata={&#x27;id&#x27;: &#x27;msg_01At8GtCiJ79M29yvNwCiQaB&#x27;, &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 3, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--b3db2b91-0edf-4c48-99e7-35e641b8229d-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 16, &#x27;output_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 19, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}})

``` Looking at the LangSmith trace we can see that before the messages are passed to the model they are filtered: [https://smith.langchain.com/public/f808a724-e072-438e-9991-657cc9e7e253/r](https://smith.langchain.com/public/f808a724-e072-438e-9991-657cc9e7e253/r) Looking at just the filter_, we can see that it&#x27;s a Runnable object that can be invoked like all Runnables:

```python
filter_.invoke(messages)

```

```output
[SystemMessage(content=&#x27;you are a good assistant&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;1&#x27;),
 HumanMessage(content=&#x27;real input&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;bob&#x27;, id=&#x27;4&#x27;),
 AIMessage(content=&#x27;real output&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;alice&#x27;, id=&#x27;5&#x27;)]

``` ## API reference[​](#api-reference) For a complete description of all arguments head to the API reference: [https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.filter_messages.html](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.filter_messages.html)[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/filter_messages.ipynb)[Basic usage](#basic-usage)
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