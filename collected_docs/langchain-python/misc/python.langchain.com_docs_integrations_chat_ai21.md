ChatAI21 | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/ai21.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/ai21.ipynb)ChatAI21 This notebook covers how to get started with AI21 chat models. Note that different chat models support different parameters. See the [AI21 documentation](https://docs.ai21.com/reference) to learn more about the parameters in your chosen model. [See all AI21&#x27;s LangChain components.](https://pypi.org/project/langchain-ai21/) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/__package_name_short_snake__)Package downloadsPackage latest[ChatAI21](https://python.langchain.com/api_reference/ai21/chat_models/langchain_ai21.chat_models.ChatAI21.html#langchain_ai21.chat_models.ChatAI21)[langchain-ai21](https://python.langchain.com/api_reference/ai21/index.html)❌beta✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain-ai21?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain-ai21?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌❌❌❌✅✅✅❌ Setup[​](#setup) Credentials[​](#credentials) We&#x27;ll need to get an [AI21 API key](https://docs.ai21.com/) and set the AI21_API_KEY environment variable:

```python
import os
from getpass import getpass

if "AI21_API_KEY" not in os.environ:
    os.environ["AI21_API_KEY"] = getpass()

``` To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")

``` Installation[​](#installation) !pip install -qU langchain-ai21 Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```python
from langchain_ai21 import ChatAI21

llm = ChatAI21(model="jamba-instruct", temperature=0)

``` Invocation[​](#invocation)

```python
messages = [
    (
        "system",
        "You are a helpful assistant that translates English to French. Translate the user sentence.",
    ),
    ("human", "I love programming."),
]
ai_msg = llm.invoke(messages)
ai_msg

``` Chaining[​](#chaining) We can [chain](/docs/how_to/sequence/) our model with a prompt template like so:

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate(
    [
        (
            "system",
            "You are a helpful assistant that translates {input_language} to {output_language}.",
        ),
        ("human", "{input}"),
    ]
)

chain = prompt | llm
chain.invoke(
    {
        "input_language": "English",
        "output_language": "German",
        "input": "I love programming.",
    }
)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) # Tool Calls / Function Calling This example shows how to use tool calling with AI21 models:

```python
import os
from getpass import getpass

from langchain_ai21.chat_models import ChatAI21
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langchain_core.utils.function_calling import convert_to_openai_tool

if "AI21_API_KEY" not in os.environ:
    os.environ["AI21_API_KEY"] = getpass()

@tool
def get_weather(location: str, date: str) -> str:
    """“Provide the weather for the specified location on the given date.”"""
    if location == "New York" and date == "2024-12-05":
        return "25 celsius"
    elif location == "New York" and date == "2024-12-06":
        return "27 celsius"
    elif location == "London" and date == "2024-12-05":
        return "22 celsius"
    return "32 celsius"

llm = ChatAI21(model="jamba-1.5-mini")

llm_with_tools = llm.bind_tools([convert_to_openai_tool(get_weather)])

chat_messages = [
    SystemMessage(
        content="You are a helpful assistant. You can use the provided tools "
        "to assist with various tasks and provide accurate information"
    )
]

human_messages = [
    HumanMessage(
        content="What is the forecast for the weather in New York on December 5, 2024?"
    ),
    HumanMessage(content="And what about the 2024-12-06?"),
    HumanMessage(content="OK, thank you."),
    HumanMessage(content="What is the expected weather in London on December 5, 2024?"),
]

for human_message in human_messages:
    print(f"User: {human_message.content}")
    chat_messages.append(human_message)
    response = llm_with_tools.invoke(chat_messages)
    chat_messages.append(response)
    if response.tool_calls:
        tool_call = response.tool_calls[0]
        if tool_call["name"] == "get_weather":
            weather = get_weather.invoke(
                {
                    "location": tool_call["args"]["location"],
                    "date": tool_call["args"]["date"],
                }
            )
            chat_messages.append(
                ToolMessage(content=weather, tool_call_id=tool_call["id"])
            )
            llm_answer = llm_with_tools.invoke(chat_messages)
            print(f"Assistant: {llm_answer.content}")
    else:
        print(f"Assistant: {response.content}")

```**API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) | [convert_to_openai_tool](https://python.langchain.com/api_reference/core/utils/langchain_core.utils.function_calling.convert_to_openai_tool.html) ## API reference[​](#api-reference) For detailed documentation of all ChatAI21 features and configurations head to the API reference: [https://python.langchain.com/api_reference/ai21/chat_models/langchain_ai21.chat_models.ChatAI21.html](https://python.langchain.com/api_reference/ai21/chat_models/langchain_ai21.chat_models.ChatAI21.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/ai21.ipynb)

- [Integration details](#integration-details)
- [Model features](#model-features)
- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Chaining](#chaining)
- [API reference](#api-reference)
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