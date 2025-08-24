Cohere | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/cohere.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/cohere.ipynb)Cohere This notebook covers how to get started with [Cohere chat models](https://cohere.com/chat). Head to the [API reference](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.cohere.ChatCohere.html) for detailed documentation of all attributes and methods. Setup[​](#setup) The integration lives in the langchain-cohere package. We can install these with:

```bash
pip install -U langchain-cohere

``` We&#x27;ll also need to get a [Cohere API key](https://cohere.com/) and set the COHERE_API_KEY environment variable:

```python
import getpass
import os

os.environ["COHERE_API_KEY"] = getpass.getpass()

``` It&#x27;s also helpful (but not needed) to set up [LangSmith](https://smith.langchain.com/) for best-in-class observability

```python
# os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")

``` Usage[​](#usage) ChatCohere supports all [ChatModel](/docs/how_to/#chat-models) functionality:

```python
from langchain_cohere import ChatCohere
from langchain_core.messages import HumanMessage

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```python
chat = ChatCohere()

```**

```python
messages = [HumanMessage(content="1"), HumanMessage(content="2 3")]
chat.invoke(messages)

```

```output
AIMessage(content=&#x27;4 && 5 \n6 || 7 \n\nWould you like to play a game of odds and evens?&#x27;, additional_kwargs={&#x27;documents&#x27;: None, &#x27;citations&#x27;: None, &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;2076b614-52b3-4082-a259-cc92cd3d9fea&#x27;, &#x27;token_count&#x27;: {&#x27;prompt_tokens&#x27;: 68, &#x27;response_tokens&#x27;: 23, &#x27;total_tokens&#x27;: 91, &#x27;billed_tokens&#x27;: 77}}, response_metadata={&#x27;documents&#x27;: None, &#x27;citations&#x27;: None, &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;2076b614-52b3-4082-a259-cc92cd3d9fea&#x27;, &#x27;token_count&#x27;: {&#x27;prompt_tokens&#x27;: 68, &#x27;response_tokens&#x27;: 23, &#x27;total_tokens&#x27;: 91, &#x27;billed_tokens&#x27;: 77}}, id=&#x27;run-3475e0c8-c89b-4937-9300-e07d652455e1-0&#x27;)

```

```python
await chat.ainvoke(messages)

```

```output
AIMessage(content=&#x27;4 && 5&#x27;, additional_kwargs={&#x27;documents&#x27;: None, &#x27;citations&#x27;: None, &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;f0708a92-f874-46ee-9b93-334d616ad92e&#x27;, &#x27;token_count&#x27;: {&#x27;prompt_tokens&#x27;: 68, &#x27;response_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 71, &#x27;billed_tokens&#x27;: 57}}, response_metadata={&#x27;documents&#x27;: None, &#x27;citations&#x27;: None, &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;f0708a92-f874-46ee-9b93-334d616ad92e&#x27;, &#x27;token_count&#x27;: {&#x27;prompt_tokens&#x27;: 68, &#x27;response_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 71, &#x27;billed_tokens&#x27;: 57}}, id=&#x27;run-1635e63e-2994-4e7f-986e-152ddfc95777-0&#x27;)

```

```python
for chunk in chat.stream(messages):
    print(chunk.content, end="", flush=True)

```

```output
4 && 5

```

```python
chat.batch([messages])

```

```output
[AIMessage(content=&#x27;4 && 5&#x27;, additional_kwargs={&#x27;documents&#x27;: None, &#x27;citations&#x27;: None, &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;6770ca86-f6c3-4ba3-a285-c4772160612f&#x27;, &#x27;token_count&#x27;: {&#x27;prompt_tokens&#x27;: 68, &#x27;response_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 71, &#x27;billed_tokens&#x27;: 57}}, response_metadata={&#x27;documents&#x27;: None, &#x27;citations&#x27;: None, &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;6770ca86-f6c3-4ba3-a285-c4772160612f&#x27;, &#x27;token_count&#x27;: {&#x27;prompt_tokens&#x27;: 68, &#x27;response_tokens&#x27;: 3, &#x27;total_tokens&#x27;: 71, &#x27;billed_tokens&#x27;: 57}}, id=&#x27;run-8d6fade2-1b39-4e31-ab23-4be622dd0027-0&#x27;)]

``` Chaining[​](#chaining) You can also easily combine with a prompt template for easy structuring of user input. We can do this using [LCEL](/docs/concepts/lcel/)

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")
chain = prompt | chat

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```python
chain.invoke({"topic": "bears"})

```**

```output
AIMessage(content=&#x27;What color socks do bears wear?\n\nThey don’t wear socks, they have bear feet. \n\nHope you laughed! If not, maybe this will help: laughter is the best medicine, and a good sense of humor is infectious!&#x27;, additional_kwargs={&#x27;documents&#x27;: None, &#x27;citations&#x27;: None, &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;6edccf44-9bc8-4139-b30e-13b368f3563c&#x27;, &#x27;token_count&#x27;: {&#x27;prompt_tokens&#x27;: 68, &#x27;response_tokens&#x27;: 51, &#x27;total_tokens&#x27;: 119, &#x27;billed_tokens&#x27;: 108}}, response_metadata={&#x27;documents&#x27;: None, &#x27;citations&#x27;: None, &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;6edccf44-9bc8-4139-b30e-13b368f3563c&#x27;, &#x27;token_count&#x27;: {&#x27;prompt_tokens&#x27;: 68, &#x27;response_tokens&#x27;: 51, &#x27;total_tokens&#x27;: 119, &#x27;billed_tokens&#x27;: 108}}, id=&#x27;run-ef7f9789-0d4d-43bf-a4f7-f2a0e27a5320-0&#x27;)

``` Tool calling[​](#tool-calling) Cohere supports tool calling functionalities!

```python
from langchain_core.messages import (
    HumanMessage,
    ToolMessage,
)
from langchain_core.tools import tool

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```python
@tool
def magic_function(number: int) -> int:
    """Applies a magic operation to an integer
    Args:
        number: Number to have magic operation performed on
    """
    return number + 10

def invoke_tools(tool_calls, messages):
    for tool_call in tool_calls:
        selected_tool = {"magic_function": magic_function}[tool_call["name"].lower()]
        tool_output = selected_tool.invoke(tool_call["args"])
        messages.append(ToolMessage(tool_output, tool_call_id=tool_call["id"]))
    return messages

tools = [magic_function]

```

```python
llm_with_tools = chat.bind_tools(tools=tools)
messages = [HumanMessage(content="What is the value of magic_function(2)?")]

```

```python
res = llm_with_tools.invoke(messages)
while res.tool_calls:
    messages.append(res)
    messages = invoke_tools(res.tool_calls, messages)
    res = llm_with_tools.invoke(messages)

res

```

```output
AIMessage(content=&#x27;The value of magic_function(2) is 12.&#x27;, additional_kwargs={&#x27;documents&#x27;: [{&#x27;id&#x27;: &#x27;magic_function:0:2:0&#x27;, &#x27;output&#x27;: &#x27;12&#x27;, &#x27;tool_name&#x27;: &#x27;magic_function&#x27;}], &#x27;citations&#x27;: [ChatCitation(start=34, end=36, text=&#x27;12&#x27;, document_ids=[&#x27;magic_function:0:2:0&#x27;])], &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;96a55791-0c58-4e2e-bc2a-8550e137c46d&#x27;, &#x27;token_count&#x27;: {&#x27;input_tokens&#x27;: 998, &#x27;output_tokens&#x27;: 59}}, response_metadata={&#x27;documents&#x27;: [{&#x27;id&#x27;: &#x27;magic_function:0:2:0&#x27;, &#x27;output&#x27;: &#x27;12&#x27;, &#x27;tool_name&#x27;: &#x27;magic_function&#x27;}], &#x27;citations&#x27;: [ChatCitation(start=34, end=36, text=&#x27;12&#x27;, document_ids=[&#x27;magic_function:0:2:0&#x27;])], &#x27;search_results&#x27;: None, &#x27;search_queries&#x27;: None, &#x27;is_search_required&#x27;: None, &#x27;generation_id&#x27;: &#x27;96a55791-0c58-4e2e-bc2a-8550e137c46d&#x27;, &#x27;token_count&#x27;: {&#x27;input_tokens&#x27;: 998, &#x27;output_tokens&#x27;: 59}}, id=&#x27;run-f318a9cf-55c8-44f4-91d1-27cf46c6a465-0&#x27;)

``` ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/cohere.ipynb)

- [Setup](#setup)
- [Usage](#usage)
- [Chaining](#chaining)
- [Tool calling](#tool-calling)
- [Related](#related)

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