ChatAnthropic | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/anthropic.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/anthropic.ipynb)ChatAnthropic This notebook provides a quick overview for getting started with Anthropic [chat models](/docs/concepts/chat_models/). For detailed documentation of all ChatAnthropic features and configurations head to the [API reference](https://python.langchain.com/api_reference/anthropic/chat_models/langchain_anthropic.chat_models.ChatAnthropic.html). Anthropic has several chat models. You can find information about their latest models and their costs, context windows, and supported input types in the [Anthropic docs](https://docs.anthropic.com/en/docs/models-overview). AWS Bedrock and Google VertexAINote that certain Anthropic models can also be accessed via AWS Bedrock and Google VertexAI. See the [ChatBedrock](/docs/integrations/chat/bedrock/) and [ChatVertexAI](/docs/integrations/chat/google_vertex_ai_palm/) integrations to use Anthropic models via these services. Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/anthropic)Package downloadsPackage latest[ChatAnthropic](https://python.langchain.com/api_reference/anthropic/chat_models/langchain_anthropic.chat_models.ChatAnthropic.html)[langchain-anthropic](https://python.langchain.com/api_reference/anthropic/index.html)❌beta✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain-anthropic?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain-anthropic?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌✅❌❌✅✅✅❌ Setup[​](#setup) To access Anthropic models you&#x27;ll need to create an Anthropic account, get an API key, and install the langchain-anthropic integration package. Credentials[​](#credentials) Head to [https://console.anthropic.com/](https://console.anthropic.com/) to sign up for Anthropic and generate an API key. Once you&#x27;ve done this set the ANTHROPIC_API_KEY environment variable:

```python
import getpass
import os

if "ANTHROPIC_API_KEY" not in os.environ:
    os.environ["ANTHROPIC_API_KEY"] = getpass.getpass("Enter your Anthropic API key: ")

``` To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"

``` Installation[​](#installation) The LangChain Anthropic integration lives in the langchain-anthropic package:

```python
%pip install -qU langchain-anthropic

``` This guide requires langchain-anthropic>=0.3.13 Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-3-5-sonnet-latest",
    temperature=0,
    max_tokens=1024,
    timeout=None,
    max_retries=2,
    # other params...
)

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

```

```output
AIMessage(content="J&#x27;adore la programmation.", response_metadata={&#x27;id&#x27;: &#x27;msg_018Nnu76krRPq8HvgKLW4F8T&#x27;, &#x27;model&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;input_tokens&#x27;: 29, &#x27;output_tokens&#x27;: 11}}, id=&#x27;run-57e9295f-db8a-48dc-9619-babd2bedd891-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 29, &#x27;output_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 40})

```

```python
print(ai_msg.content)

```

```output
J&#x27;adore la programmation.

``` Chaining[​](#chaining) We can [chain](/docs/how_to/sequence/) our model with a prompt template like so:

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages(
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

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
AIMessage(content="Here&#x27;s the German translation:\n\nIch liebe Programmieren.", response_metadata={&#x27;id&#x27;: &#x27;msg_01GhkRtQZUkA5Ge9hqmD8HGY&#x27;, &#x27;model&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;input_tokens&#x27;: 23, &#x27;output_tokens&#x27;: 18}}, id=&#x27;run-da5906b4-b200-4e08-b81a-64d4453643b6-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 23, &#x27;output_tokens&#x27;: 18, &#x27;total_tokens&#x27;: 41})

```**Content blocks[​](#content-blocks) Content from a single Anthropic AI message can either be a single string or a list of content blocks**. For example when an Anthropic model invokes a tool, the tool invocation is part of the message content (as well as being exposed in the standardized AIMessage.tool_calls):

```python
from pydantic import BaseModel, Field

class GetWeather(BaseModel):
    """Get the current weather in a given location"""

    location: str = Field(..., description="The city and state, e.g. San Francisco, CA")

llm_with_tools = llm.bind_tools([GetWeather])
ai_msg = llm_with_tools.invoke("Which city is hotter today: LA or NY?")
ai_msg.content

```**

```output
[{&#x27;text&#x27;: "To answer this question, we&#x27;ll need to check the current weather in both Los Angeles (LA) and New York (NY). I&#x27;ll use the GetWeather function to retrieve this information for both cities.",
  &#x27;type&#x27;: &#x27;text&#x27;},
 {&#x27;id&#x27;: &#x27;toolu_01Ddzj5PkuZkrjF4tafzu54A&#x27;,
  &#x27;input&#x27;: {&#x27;location&#x27;: &#x27;Los Angeles, CA&#x27;},
  &#x27;name&#x27;: &#x27;GetWeather&#x27;,
  &#x27;type&#x27;: &#x27;tool_use&#x27;},
 {&#x27;id&#x27;: &#x27;toolu_012kz4qHZQqD4qg8sFPeKqpP&#x27;,
  &#x27;input&#x27;: {&#x27;location&#x27;: &#x27;New York, NY&#x27;},
  &#x27;name&#x27;: &#x27;GetWeather&#x27;,
  &#x27;type&#x27;: &#x27;tool_use&#x27;}]

```

```python
ai_msg.tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;GetWeather&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;Los Angeles, CA&#x27;},
  &#x27;id&#x27;: &#x27;toolu_01Ddzj5PkuZkrjF4tafzu54A&#x27;},
 {&#x27;name&#x27;: &#x27;GetWeather&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;New York, NY&#x27;},
  &#x27;id&#x27;: &#x27;toolu_012kz4qHZQqD4qg8sFPeKqpP&#x27;}]

``` Multimodal[​](#multimodal) Claude supports image and PDF inputs as content blocks, both in Anthropic&#x27;s native format (see docs for [vision](https://docs.anthropic.com/en/docs/build-with-claude/vision#base64-encoded-image-example) and [PDF support](https://docs.anthropic.com/en/docs/build-with-claude/pdf-support)) as well as LangChain&#x27;s [standard format](/docs/how_to/multimodal_inputs/). Files API[​](#files-api) Claude also supports interactions with files through its managed [Files API](https://docs.anthropic.com/en/docs/build-with-claude/files). See examples below. The Files API can also be used to upload files to a container for use with Claude&#x27;s built-in code-execution tools. See the [code execution](#code-execution) section below, for details. Images

```python
# Upload image

import anthropic

client = anthropic.Anthropic()
file = client.beta.files.upload(
    # Supports image/jpeg, image/png, image/gif, image/webp
    file=("image.png", open("/path/to/image.png", "rb"), "image/png"),
)
image_file_id = file.id

# Run inference
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    betas=["files-api-2025-04-14"],
)

input_message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Describe this image.",
        },
        {
            "type": "image",
            "source": {
                "type": "file",
                "file_id": image_file_id,
            },
        },
    ],
}
llm.invoke([input_message])

``` PDFs

```python
# Upload document

import anthropic

client = anthropic.Anthropic()
file = client.beta.files.upload(
    file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
pdf_file_id = file.id

# Run inference
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    betas=["files-api-2025-04-14"],
)

input_message = {
    "role": "user",
    "content": [
        {"type": "text", "text": "Describe this document."},
        {"type": "document", "source": {"type": "file", "file_id": pdf_file_id}}
    ],
}
llm.invoke([input_message])

``` Extended thinking[​](#extended-thinking) Claude 3.7 Sonnet supports an [extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking) feature, which will output the step-by-step reasoning process that led to its final answer. To use it, specify the thinking parameter when initializing ChatAnthropic. It can also be passed in as a kwarg during invocation. You will need to specify a token budget to use this feature. See usage example below:

```python
import json

from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-3-7-sonnet-latest",
    max_tokens=5000,
    thinking={"type": "enabled", "budget_tokens": 2000},
)

response = llm.invoke("What is the cube root of 50.653?")
print(json.dumps(response.content, indent=2))

```

```output
[
  {
    "signature": "ErUBCkYIARgCIkCx7bIPj35jGPHpoVOB2y5hvPF8MN4lVK75CYGftmVNlI4axz2+bBbSexofWsN1O/prwNv8yPXnIXQmwT6zrJsKEgwJzvks0yVRZtaGBScaDOm9xcpOxbuhku1zViIw9WDgil/KZL8DsqWrhVpC6TzM0RQNCcsHcmgmyxbgG9g8PR0eJGLxCcGoEw8zMQu1Kh1hQ1/03hZ2JCOgigpByR9aNPTwwpl64fQUe6WwIw==",
    "thinking": "To find the cube root of 50.653, I need to find the value of $x$ such that $x^3 = 50.653$.\n\nI can try to estimate this first. \n$3^3 = 27$\n$4^3 = 64$\n\nSo the cube root of 50.653 will be somewhere between 3 and 4, but closer to 4.\n\nLet me try to compute this more precisely. I can use the cube root function:\n\ncube root of 50.653 = 50.653^(1/3)\n\nLet me calculate this:\n50.653^(1/3) \u2248 3.6998\n\nLet me verify:\n3.6998^3 \u2248 50.6533\n\nThat&#x27;s very close to 50.653, so I&#x27;m confident that the cube root of 50.653 is approximately 3.6998.\n\nActually, let me compute this more precisely:\n50.653^(1/3) \u2248 3.69981\n\nLet me verify once more:\n3.69981^3 \u2248 50.652998\n\nThat&#x27;s extremely close to 50.653, so I&#x27;ll say that the cube root of 50.653 is approximately 3.69981.",
    "type": "thinking"
  },
  {
    "text": "The cube root of 50.653 is approximately 3.6998.\n\nTo verify: 3.6998\u00b3 = 50.6530, which is very close to our original number.",
    "type": "text"
  }
]

``` Prompt caching[​](#prompt-caching) Anthropic supports [caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) of [elements of your prompts](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#what-can-be-cached), including messages, tool definitions, tool results, images and documents. This allows you to re-use large documents, instructions, [few-shot documents](/docs/concepts/few_shot_prompting/), and other data to reduce latency and costs. To enable caching on an element of a prompt, mark its associated content block using the cache_control key. See examples below: Messages[​](#messages)

```python
import requests
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-7-sonnet-20250219")

# Pull LangChain readme
get_response = requests.get(
    "https://raw.githubusercontent.com/langchain-ai/langchain/master/README.md"
)
readme = get_response.text

messages = [
    {
        "role": "system",
        "content": [
            {
                "type": "text",
                "text": "You are a technology expert.",
            },
            {
                "type": "text",
                "text": f"{readme}",
                "cache_control": {"type": "ephemeral"},
            },
        ],
    },
    {
        "role": "user",
        "content": "What&#x27;s LangChain, according to its README?",
    },
]

response_1 = llm.invoke(messages)
response_2 = llm.invoke(messages)

usage_1 = response_1.usage_metadata["input_token_details"]
usage_2 = response_2.usage_metadata["input_token_details"]

print(f"First invocation:\n{usage_1}")
print(f"\nSecond:\n{usage_2}")

```

```output
First invocation:
{&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 1458}

Second:
{&#x27;cache_read&#x27;: 1458, &#x27;cache_creation&#x27;: 0}

``` Extended cachingThe cache lifetime is 5 minutes by default. If this is too short, you can apply one hour caching by enabling the "extended-cache-ttl-2025-04-11" beta header:

```python
llm = ChatAnthropic(
    model="claude-3-7-sonnet-20250219",
    betas=["extended-cache-ttl-2025-04-11"],
)

```and specifying "cache_control": {"type": "ephemeral", "ttl": "1h"}.Details of cached token counts will be included on the InputTokenDetails of response&#x27;s usage_metadata:

```python
response = llm.invoke(messages)
response.usage_metadata

```

```text
{
    "input_tokens": 1500,
    "output_tokens": 200,
    "total_tokens": 1700,
    "input_token_details": {
        "cache_read": 0,
        "cache_creation": 1000,
        "ephemeral_1h_input_tokens": 750,
        "ephemeral_5m_input_tokens": 250,
    }
}

``` Tools[​](#tools)

```python
from langchain_anthropic import convert_to_anthropic_tool
from langchain_core.tools import tool

# For demonstration purposes, we artificially expand the
# tool description.
description = (
    f"Get the weather at a location. By the way, check out this readme: {readme}"
)

@tool(description=description)
def get_weather(location: str) -> str:
    return "It&#x27;s sunny."

# Enable caching on the tool
weather_tool = convert_to_anthropic_tool(get_weather)
weather_tool["cache_control"] = {"type": "ephemeral"}

llm = ChatAnthropic(model="claude-3-7-sonnet-20250219")
llm_with_tools = llm.bind_tools([weather_tool])
query = "What&#x27;s the weather in San Francisco?"

response_1 = llm_with_tools.invoke(query)
response_2 = llm_with_tools.invoke(query)

usage_1 = response_1.usage_metadata["input_token_details"]
usage_2 = response_2.usage_metadata["input_token_details"]

print(f"First invocation:\n{usage_1}")
print(f"\nSecond:\n{usage_2}")

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
First invocation:
{&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 1809}

Second:
{&#x27;cache_read&#x27;: 1809, &#x27;cache_creation&#x27;: 0}

```**Incremental caching in conversational applications[​](#incremental-caching-in-conversational-applications) Prompt caching can be used in [multi-turn conversations](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#continuing-a-multi-turn-conversation) to maintain context from earlier messages without redundant processing. We can enable incremental caching by marking the final message with cache_control. Claude will automatically use the longest previously-cached prefix for follow-up messages. Below, we implement a simple chatbot that incorporates this feature. We follow the LangChain [chatbot tutorial](/docs/tutorials/chatbot/), but add a custom [reducer](https://langchain-ai.github.io/langgraph/concepts/low_level/#reducers) that automatically marks the last content block in each user message with cache_control. See below:

```python
import requests
from langchain_anthropic import ChatAnthropic
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph, add_messages
from typing_extensions import Annotated, TypedDict

llm = ChatAnthropic(model="claude-3-7-sonnet-20250219")

# Pull LangChain readme
get_response = requests.get(
    "https://raw.githubusercontent.com/langchain-ai/langchain/master/README.md"
)
readme = get_response.text

def messages_reducer(left: list, right: list) -> list:
    # Update last user message
    for i in range(len(right) - 1, -1, -1):
        if right[i].type == "human":
            right[i].content[-1]["cache_control"] = {"type": "ephemeral"}
            break

    return add_messages(left, right)

class State(TypedDict):
    messages: Annotated[list, messages_reducer]

workflow = StateGraph(state_schema=State)

# Define the function that calls the model
def call_model(state: State):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# Define the (single) node in the graph
workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

# Add memory
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```API Reference:**[MemorySaver](https://langchain-ai.github.io/langgraph/reference/checkpoints/#langgraph.checkpoint.memory.MemorySaver) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) | [add_messages](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.message.add_messages)

```python
from langchain_core.messages import HumanMessage

config = {"configurable": {"thread_id": "abc123"}}

query = "Hi! I&#x27;m Bob."

input_message = HumanMessage([{"type": "text", "text": query}])
output = app.invoke({"messages": [input_message]}, config)
output["messages"][-1].pretty_print()
print(f"\n{output[&#x27;messages&#x27;][-1].usage_metadata[&#x27;input_token_details&#x27;]}")

```**API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```output
==================================[1m Ai Message [0m==================================

Hello, Bob! It&#x27;s nice to meet you. How are you doing today? Is there something I can help you with?

{&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}

```**

```python
query = f"Check out this readme: {readme}"

input_message = HumanMessage([{"type": "text", "text": query}])
output = app.invoke({"messages": [input_message]}, config)
output["messages"][-1].pretty_print()
print(f"\n{output[&#x27;messages&#x27;][-1].usage_metadata[&#x27;input_token_details&#x27;]}")

```

```output
==================================[1m Ai Message [0m==================================

I can see you&#x27;ve shared the README from the LangChain GitHub repository. This is the documentation for LangChain, which is a popular framework for building applications powered by Large Language Models (LLMs). Here&#x27;s a summary of what the README contains:

LangChain is:
- A framework for developing LLM-powered applications
- Helps chain together components and integrations to simplify AI application development
- Provides a standard interface for models, embeddings, vector stores, etc.

Key features/benefits:
- Real-time data augmentation (connect LLMs to diverse data sources)
- Model interoperability (swap models easily as needed)
- Large ecosystem of integrations

The LangChain ecosystem includes:
- LangSmith - For evaluations and observability
- LangGraph - For building complex agents with customizable architecture
- LangGraph Platform - For deployment and scaling of agents

The README also mentions installation instructions (`pip install -U langchain`) and links to various resources including tutorials, how-to guides, conceptual guides, and API references.

Is there anything specific about LangChain you&#x27;d like to know more about, Bob?

{&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 1498}

```

```python
query = "What was my name again?"

input_message = HumanMessage([{"type": "text", "text": query}])
output = app.invoke({"messages": [input_message]}, config)
output["messages"][-1].pretty_print()
print(f"\n{output[&#x27;messages&#x27;][-1].usage_metadata[&#x27;input_token_details&#x27;]}")

```

```output
==================================[1m Ai Message [0m==================================

Your name is Bob. You introduced yourself at the beginning of our conversation.

{&#x27;cache_read&#x27;: 1498, &#x27;cache_creation&#x27;: 269}

``` In the [LangSmith trace](https://smith.langchain.com/public/4d0584d8-5f9e-4b91-8704-93ba2ccf416a/r), toggling "raw output" will show exactly what messages are sent to the chat model, including cache_control keys. Token-efficient tool use[​](#token-efficient-tool-use) Anthropic supports a (beta) [token-efficient tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/token-efficient-tool-use) feature. To use it, specify the relevant beta-headers when instantiating the model.

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool

llm = ChatAnthropic(
    model="claude-3-7-sonnet-20250219",
    temperature=0,
    model_kwargs={
        "extra_headers": {"anthropic-beta": "token-efficient-tools-2025-02-19"}
    },
)

@tool
def get_weather(location: str) -> str:
    """Get the weather at a location."""
    return "It&#x27;s sunny."

llm_with_tools = llm.bind_tools([get_weather])
response = llm_with_tools.invoke("What&#x27;s the weather in San Francisco?")
print(response.tool_calls)
print(f"\nTotal tokens: {response.usage_metadata[&#x27;total_tokens&#x27;]}")

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
[{&#x27;name&#x27;: &#x27;get_weather&#x27;, &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;San Francisco&#x27;}, &#x27;id&#x27;: &#x27;toolu_01EoeE1qYaePcmNbUvMsWtmA&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}]

Total tokens: 408

```**Citations[​](#citations) Anthropic supports a [citations](https://docs.anthropic.com/en/docs/build-with-claude/citations) feature that lets Claude attach context to its answers based on source documents supplied by the user. When [document](https://docs.anthropic.com/en/docs/build-with-claude/citations#document-types) or search result content blocks with "citations": {"enabled": True} are included in a query, Claude may generate citations in its response. Simple example[​](#simple-example) In this example we pass a [plain text document](https://docs.anthropic.com/en/docs/build-with-claude/citations#plain-text-documents). In the background, Claude [automatically chunks](https://docs.anthropic.com/en/docs/build-with-claude/citations#plain-text-documents) the input text into sentences, which are used when generating citations.

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-5-haiku-latest")

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "text",
                    "media_type": "text/plain",
                    "data": "The grass is green. The sky is blue.",
                },
                "title": "My Document",
                "context": "This is a trustworthy document.",
                "citations": {"enabled": True},
            },
            {"type": "text", "text": "What color is the grass and sky?"},
        ],
    }
]
response = llm.invoke(messages)
response.content

```

```output
[{&#x27;text&#x27;: &#x27;Based on the document, &#x27;, &#x27;type&#x27;: &#x27;text&#x27;},
 {&#x27;text&#x27;: &#x27;the grass is green&#x27;,
  &#x27;type&#x27;: &#x27;text&#x27;,
  &#x27;citations&#x27;: [{&#x27;type&#x27;: &#x27;char_location&#x27;,
    &#x27;cited_text&#x27;: &#x27;The grass is green. &#x27;,
    &#x27;document_index&#x27;: 0,
    &#x27;document_title&#x27;: &#x27;My Document&#x27;,
    &#x27;start_char_index&#x27;: 0,
    &#x27;end_char_index&#x27;: 20}]},
 {&#x27;text&#x27;: &#x27;, and &#x27;, &#x27;type&#x27;: &#x27;text&#x27;},
 {&#x27;text&#x27;: &#x27;the sky is blue&#x27;,
  &#x27;type&#x27;: &#x27;text&#x27;,
  &#x27;citations&#x27;: [{&#x27;type&#x27;: &#x27;char_location&#x27;,
    &#x27;cited_text&#x27;: &#x27;The sky is blue.&#x27;,
    &#x27;document_index&#x27;: 0,
    &#x27;document_title&#x27;: &#x27;My Document&#x27;,
    &#x27;start_char_index&#x27;: 20,
    &#x27;end_char_index&#x27;: 36}]},
 {&#x27;text&#x27;: &#x27;.&#x27;, &#x27;type&#x27;: &#x27;text&#x27;}]

``` In tool results (agentic RAG)[​](#in-tool-results-agentic-rag) Requires langchain-anthropic>=0.3.17 Claude supports a [search_result](https://docs.anthropic.com/en/docs/build-with-claude/search-results) content block representing citable results from queries against a knowledge base or other custom source. These content blocks can be passed to claude both top-line (as in the above example) and within a tool result. This allows Claude to cite elements of its response using the result of a tool call. To pass search results in response to tool calls, define a tool that returns a list of search_result content blocks in Anthropic&#x27;s native format. For example:

```python
def retrieval_tool(query: str) -> list[dict]:
    """Access my knowledge base."""

    # Run a search (e.g., with a LangChain vector store)
    results = vector_store.similarity_search(query=query, k=2)

    # Package results into search_result blocks
    return [
        {
            "type": "search_result",
            # Customize fields as desired, using document metadata or otherwise
            "title": "My Document Title",
            "source": "Source description or provenance",
            "citations": {"enabled": True},
            "content": [{"type": "text", "text": doc.page_content}],
        }
        for doc in results
    ]

``` We also need to specify the search-results-2025-06-09 beta when instantiating ChatAnthropic. You can see an end-to-end example below. End to end example with LangGraphHere we demonstrate an end-to-end example in which we populate a LangChain [vector store](/docs/concepts/vectorstores/) with sample documents and equip Claude with a tool that queries those documents. The tool here takes a search query and a category string literal, but any valid tool signature can be used.

```python
from typing import Literal

from langchain.chat_models import init_chat_model
from langchain.embeddings import init_embeddings
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.prebuilt import create_react_agent

# Set up vector store
embeddings = init_embeddings("openai:text-embedding-3-small")
vector_store = InMemoryVectorStore(embeddings)

document_1 = Document(
    id="1",
    page_content=(
        "To request vacation days, submit a leave request form through the "
        "HR portal. Approval will be sent by email."
    ),
    metadata={
        "category": "HR Policy",
        "doc_title": "Leave Policy",
        "provenance": "Leave Policy - page 1",
    },
)
document_2 = Document(
    id="2",
    page_content="Managers will review vacation requests within 3 business days.",
    metadata={
        "category": "HR Policy",
        "doc_title": "Leave Policy",
        "provenance": "Leave Policy - page 2",
    },
)
document_3 = Document(
    id="3",
    page_content=(
        "Employees with over 6 months tenure are eligible for 20 paid vacation days "
        "per year."
    ),
    metadata={
        "category": "Benefits Policy",
        "doc_title": "Benefits Guide 2025",
        "provenance": "Benefits Policy - page 1",
    },
)

documents = [document_1, document_2, document_3]
vector_store.add_documents(documents=documents)

# Define tool
async def retrieval_tool(
    query: str, category: Literal["HR Policy", "Benefits Policy"]
) -> list[dict]:
    """Access my knowledge base."""

    def _filter_function(doc: Document) -> bool:
        return doc.metadata.get("category") == category

    results = vector_store.similarity_search(
        query=query, k=2, filter=_filter_function
    )

    return [
        {
            "type": "search_result",
            "title": doc.metadata["doc_title"],
            "source": doc.metadata["provenance"],
            "citations": {"enabled": True},
            "content": [{"type": "text", "text": doc.page_content}],
        }
        for doc in results
    ]

# Create agent
llm = init_chat_model(
    "anthropic:claude-3-5-haiku-latest",
    betas=["search-results-2025-06-09"],
)

checkpointer = InMemorySaver()
agent = create_react_agent(llm, [retrieval_tool], checkpointer=checkpointer)

# Invoke on a query
config = {"configurable": {"thread_id": "session_1"}}

input_message = {
    "role": "user",
    "content": "How do I request vacation days?",
}
async for step in agent.astream(
    {"messages": [input_message]},
    config,
    stream_mode="values",
):
    step["messages"][-1].pretty_print()

```API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) | [InMemoryVectorStore](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.in_memory.InMemoryVectorStore.html) | [create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent) ### Using with text splitters[​](#using-with-text-splitters) Anthropic also lets you specify your own splits using [custom document](https://docs.anthropic.com/en/docs/build-with-claude/citations#custom-content-documents) types. LangChain [text splitters](/docs/concepts/text_splitters/) can be used to generate meaningful splits for this purpose. See the below example, where we split the LangChain README (a markdown document) and pass it to Claude as context:

```python
import requests
from langchain_anthropic import ChatAnthropic
from langchain_text_splitters import MarkdownTextSplitter

def format_to_anthropic_documents(documents: list[str]):
    return {
        "type": "document",
        "source": {
            "type": "content",
            "content": [{"type": "text", "text": document} for document in documents],
        },
        "citations": {"enabled": True},
    }

# Pull readme
get_response = requests.get(
    "https://raw.githubusercontent.com/langchain-ai/langchain/master/README.md"
)
readme = get_response.text

# Split into chunks
splitter = MarkdownTextSplitter(
    chunk_overlap=0,
    chunk_size=50,
)
documents = splitter.split_text(readme)

# Construct message
message = {
    "role": "user",
    "content": [
        format_to_anthropic_documents(documents),
        {"type": "text", "text": "Give me a link to LangChain&#x27;s tutorials."},
    ],
}

# Query LLM
llm = ChatAnthropic(model="claude-3-5-haiku-latest")
response = llm.invoke([message])

response.content

```**

```output
[{&#x27;text&#x27;: "You can find LangChain&#x27;s tutorials at https://python.langchain.com/docs/tutorials/\n\nThe tutorials section is recommended for those looking to build something specific or who prefer a hands-on learning approach. It&#x27;s considered the best place to get started with LangChain.",
  &#x27;type&#x27;: &#x27;text&#x27;,
  &#x27;citations&#x27;: [{&#x27;type&#x27;: &#x27;content_block_location&#x27;,
    &#x27;cited_text&#x27;: "[Tutorials](https://python.langchain.com/docs/tutorials/):If you&#x27;re looking to build something specific orare more of a hands-on learner, check out ourtutorials. This is the best place to get started.",
    &#x27;document_index&#x27;: 0,
    &#x27;document_title&#x27;: None,
    &#x27;start_block_index&#x27;: 243,
    &#x27;end_block_index&#x27;: 248}]}]

``` Built-in tools[​](#built-in-tools) Anthropic supports a variety of [built-in tools](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/text-editor-tool), which can be bound to the model in the [usual way](/docs/how_to/tool_calling/). Claude will generate tool calls adhering to its internal schema for the tool: Web search[​](#web-search) Claude can use a [web search tool](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/web-search-tool) to run searches and ground its responses with citations. Web search tool is supported since langchain-anthropic>=0.3.13

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-5-sonnet-latest")

tool = {"type": "web_search_20250305", "name": "web_search", "max_uses": 3}
llm_with_tools = llm.bind_tools([tool])

response = llm_with_tools.invoke("How do I update a web app to TypeScript 5.5?")

``` Web search + structured output[​](#web-search--structured-output) When combining web search tools with structured output, it&#x27;s important to bind the tools first and then apply structured output**:

```python
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic

# Define structured output schema
class ResearchResult(BaseModel):
    """Structured research result from web search."""

    topic: str = Field(description="The research topic")
    summary: str = Field(description="Summary of key findings")
    key_points: list[str] = Field(description="List of important points discovered")

# Configure web search tool
websearch_tools = [
    {
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 10,
    }
]

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")

# Correct order: bind tools first, then structured output
llm_with_search = llm.bind_tools(websearch_tools)
research_llm = llm_with_search.with_structured_output(ResearchResult)

# Now you can use both web search and get structured output
result = research_llm.invoke("Research the latest developments in quantum computing")
print(f"Topic: {result.topic}")
print(f"Summary: {result.summary}")
print(f"Key Points: {result.key_points}")

``` ### Code execution[​](#code-execution) Claude can use a [code execution tool](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool) to execute Python code in a sandboxed environment. Code execution is supported since langchain-anthropic>=0.3.14

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    betas=["code-execution-2025-05-22"],
)

tool = {"type": "code_execution_20250522", "name": "code_execution"}
llm_with_tools = llm.bind_tools([tool])

response = llm_with_tools.invoke(
    "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
)

``` Use with Files APIUsing the Files API, Claude can write code to access files for data analysis and other purposes. See example below:

```python
# Upload file

import anthropic

client = anthropic.Anthropic()
file = client.beta.files.upload(
    file=open("/path/to/sample_data.csv", "rb")
)
file_id = file.id

# Run inference
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    betas=["code-execution-2025-05-22"],
)

tool = {"type": "code_execution_20250522", "name": "code_execution"}
llm_with_tools = llm.bind_tools([tool])

input_message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Please plot these data and tell me what you see.",
        },
        {
            "type": "container_upload",
            "file_id": file_id,
        },
    ]
}
llm_with_tools.invoke([input_message])

```Note that Claude may generate files as part of its code execution. You can access these files using the Files API:

```python
# Take all file outputs for demonstration purposes
file_ids = []
for block in response.content:
    if block["type"] == "code_execution_tool_result":
        file_ids.extend(
            content["file_id"]
            for content in block.get("content", {}).get("content", [])
            if "file_id" in content
        )

for i, file_id in enumerate(file_ids):
    file_content = client.beta.files.download(file_id)
    file_content.write_to_file(f"/path/to/file_{i}.png")

``` ### Remote MCP[​](#remote-mcp) Claude can use a [MCP connector tool](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector) for model-generated calls to remote MCP servers. Remote MCP is supported since langchain-anthropic>=0.3.14

```python
from langchain_anthropic import ChatAnthropic

mcp_servers = [
    {
        "type": "url",
        "url": "https://mcp.deepwiki.com/mcp",
        "name": "deepwiki",
        "tool_configuration": {  # optional configuration
            "enabled": True,
            "allowed_tools": ["ask_question"],
        },
        "authorization_token": "PLACEHOLDER",  # optional authorization
    }
]

llm = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    betas=["mcp-client-2025-04-04"],
    mcp_servers=mcp_servers,
)

response = llm.invoke(
    "What transport protocols does the 2025-03-26 version of the MCP "
    "spec (modelcontextprotocol/modelcontextprotocol) support?"
)

``` ### Text editor[​](#text-editor) The text editor tool can be used to view and modify text files. See docs [here](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/text-editor-tool) for details.

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-7-sonnet-20250219")

tool = {"type": "text_editor_20250124", "name": "str_replace_editor"}
llm_with_tools = llm.bind_tools([tool])

response = llm_with_tools.invoke(
    "There&#x27;s a syntax error in my primes.py file. Can you help me fix it?"
)
print(response.text())
response.tool_calls

```

```output
I&#x27;d be happy to help you fix the syntax error in your primes.py file. First, let&#x27;s look at the current content of the file to identify the error.

```

```output
[{&#x27;name&#x27;: &#x27;str_replace_editor&#x27;,
  &#x27;args&#x27;: {&#x27;command&#x27;: &#x27;view&#x27;, &#x27;path&#x27;: &#x27;/repo/primes.py&#x27;},
  &#x27;id&#x27;: &#x27;toolu_01VdNgt1YV7kGfj9LFLm6HyQ&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;}]

``` ## API reference[​](#api-reference) For detailed documentation of all ChatAnthropic features and configurations head to the API reference: [https://python.langchain.com/api_reference/anthropic/chat_models/langchain_anthropic.chat_models.ChatAnthropic.html](https://python.langchain.com/api_reference/anthropic/chat_models/langchain_anthropic.chat_models.ChatAnthropic.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/anthropic.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Chaining](#chaining)
- [Content blocks](#content-blocks)
- [Multimodal](#multimodal)[Files API](#files-api)

- [Extended thinking](#extended-thinking)
- [Prompt caching](#prompt-caching)[Messages](#messages)
- [Tools](#tools)
- [Incremental caching in conversational applications](#incremental-caching-in-conversational-applications)

- [Token-efficient tool use](#token-efficient-tool-use)
- [Citations](#citations)[Simple example](#simple-example)
- [In tool results (agentic RAG)](#in-tool-results-agentic-rag)
- [Using with text splitters](#using-with-text-splitters)

- [Built-in tools](#built-in-tools)[Web search](#web-search)
- [Code execution](#code-execution)
- [Remote MCP](#remote-mcp)
- [Text editor](#text-editor)

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