ChatNVIDIA | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/nvidia_ai_endpoints.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/nvidia_ai_endpoints.ipynb)ChatNVIDIA This will help you get started with NVIDIA [chat models](/docs/concepts/chat_models/). For detailed documentation of all ChatNVIDIA features and configurations head to the [API reference](https://python.langchain.com/api_reference/nvidia_ai_endpoints/chat_models/langchain_nvidia_ai_endpoints.chat_models.ChatNVIDIA.html). Overview[​](#overview) The langchain-nvidia-ai-endpoints package contains LangChain integrations building applications with models on NVIDIA NIM inference microservice. NIM supports models across domains like chat, embedding, and re-ranking models from the community as well as NVIDIA. These models are optimized by NVIDIA to deliver the best performance on NVIDIA accelerated infrastructure and deployed as a NIM, an easy-to-use, prebuilt containers that deploy anywhere using a single command on NVIDIA accelerated infrastructure. NVIDIA hosted deployments of NIMs are available to test on the [NVIDIA API catalog](https://build.nvidia.com/). After testing, NIMs can be exported from NVIDIA’s API catalog using the NVIDIA AI Enterprise license and run on-premises or in the cloud, giving enterprises ownership and full control of their IP and AI application. NIMs are packaged as container images on a per model basis and are distributed as NGC container images through the NVIDIA NGC Catalog. At their core, NIMs provide easy, consistent, and familiar APIs for running inference on an AI model. This example goes over how to use LangChain to interact with NVIDIA supported via the ChatNVIDIA class. For more information on accessing the chat models through this api, check out the [ChatNVIDIA](https://python.langchain.com/docs/integrations/chat/nvidia_ai_endpoints/) documentation. Integration details[​](#integration-details) ClassPackageLocalSerializableJS supportPackage downloadsPackage latest[ChatNVIDIA](https://python.langchain.com/api_reference/nvidia_ai_endpoints/chat_models/langchain_nvidia_ai_endpoints.chat_models.ChatNVIDIA.html)[langchain-nvidia-ai-endpoints](https://python.langchain.com/api_reference/nvidia_ai_endpoints/index.html)✅beta❌![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain_nvidia_ai_endpoints?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain_nvidia_ai_endpoints?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅✅❌❌✅✅✅❌ Setup[​](#setup) To get started:** Create a free account with [NVIDIA](https://build.nvidia.com/), which hosts NVIDIA AI Foundation models.

- Click on your model of choice.

- Under Input select the Python tab, and click Get API Key. Then click Generate Key.

- Copy and save the generated key as NVIDIA_API_KEY. From there, you should have access to the endpoints.

### Credentials[​](#credentials)

```python
import getpass
import os

if not os.getenv("NVIDIA_API_KEY"):
    # Note: the API key should start with "nvapi-"
    os.environ["NVIDIA_API_KEY"] = getpass.getpass("Enter your NVIDIA API key: ")

```**To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")

``` Installation[​](#installation) The LangChain NVIDIA AI Endpoints integration lives in the langchain-nvidia-ai-endpoints package:

```python
%pip install --upgrade --quiet langchain-nvidia-ai-endpoints

``` Instantiation[​](#instantiation) Now we can access models in the NVIDIA API Catalog:

```python
## Core LC Chat Interface
from langchain_nvidia_ai_endpoints import ChatNVIDIA

llm = ChatNVIDIA(model="mistralai/mixtral-8x7b-instruct-v0.1")

``` Invocation[​](#invocation)

```python
result = llm.invoke("Write a ballad about LangChain.")
print(result.content)

``` Working with NVIDIA NIMs[​](#working-with-nvidia-nims) When ready to deploy, you can self-host models with NVIDIA NIM—which is included with the NVIDIA AI Enterprise software license—and run them anywhere, giving you ownership of your customizations and full control of your intellectual property (IP) and AI applications. [Learn more about NIMs](https://developer.nvidia.com/blog/nvidia-nim-offers-optimized-inference-microservices-for-deploying-ai-models-at-scale/)

```python
from langchain_nvidia_ai_endpoints import ChatNVIDIA

# connect to an embedding NIM running at localhost:8000, specifying a specific model
llm = ChatNVIDIA(base_url="http://localhost:8000/v1", model="meta/llama3-8b-instruct")

``` Stream, Batch, and Async[​](#stream-batch-and-async) These models natively support streaming, and as is the case with all LangChain LLMs they expose a batch method to handle concurrent requests, as well as async methods for invoke, stream, and batch. Below are a few examples.

```python
print(llm.batch(["What&#x27;s 2*3?", "What&#x27;s 2*6?"]))
# Or via the async API
# await llm.abatch(["What&#x27;s 2*3?", "What&#x27;s 2*6?"])

```

```python
for chunk in llm.stream("How far can a seagull fly in one day?"):
    # Show the token separations
    print(chunk.content, end="|")

```

```python
async for chunk in llm.astream(
    "How long does it take for monarch butterflies to migrate?"
):
    print(chunk.content, end="|")

``` Supported models[​](#supported-models) Querying available_models will still give you all of the other models offered by your API credentials. The playground_ prefix is optional.

```python
ChatNVIDIA.get_available_models()
# llm.get_available_models()

``` Model types[​](#model-types) All of these models above are supported and can be accessed via ChatNVIDIA. Some model types support unique prompting techniques and chat messages. We will review a few important ones below. To find out more about a specific model, please navigate to the API section of an AI Foundation model [as linked here](https://catalog.ngc.nvidia.com/orgs/nvidia/teams/ai-foundation/models/codellama-13b/api).**

### General Chat[​](#general-chat)

Models such as `meta/llama3-8b-instruct` and `mistralai/mixtral-8x22b-instruct-v0.1` are good all-around models that you can use for with any LangChain chat messages. Example below.

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_nvidia_ai_endpoints import ChatNVIDIA

prompt = ChatPromptTemplate.from_messages(
    [("system", "You are a helpful AI assistant named Fred."), ("user", "{input}")]
)
chain = prompt | ChatNVIDIA(model="meta/llama3-8b-instruct") | StrOutputParser()

for txt in chain.stream({"input": "What&#x27;s your name?"}):
    print(txt, end="")

```**API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

### Code Generation[​](#code-generation)

These models accept the same arguments and input structure as regular chat models, but they tend to perform better on code-generation and structured code tasks. An example of this is `meta/codellama-70b`.

```python
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an expert coding AI. Respond only in valid python; no narration whatsoever.",
        ),
        ("user", "{input}"),
    ]
)
chain = prompt | ChatNVIDIA(model="meta/codellama-70b") | StrOutputParser()

for txt in chain.stream({"input": "How do I solve this fizz buzz problem?"}):
    print(txt, end="")

```**Multimodal[​](#multimodal) NVIDIA also supports multimodal inputs, meaning you can provide both images and text for the model to reason over. An example model supporting multimodal inputs is nvidia/neva-22b. Below is an example use:

```python
import IPython
import requests

image_url = "https://www.nvidia.com/content/dam/en-zz/Solutions/research/ai-playground/nvidia-picasso-3c33-p@2x.jpg"  ## Large Image
image_content = requests.get(image_url).content

IPython.display.Image(image_content)

```

```python
from langchain_nvidia_ai_endpoints import ChatNVIDIA

llm = ChatNVIDIA(model="nvidia/neva-22b")

``` Passing an image as a URL[​](#passing-an-image-as-a-url)

```python
from langchain_core.messages import HumanMessage

llm.invoke(
    [
        HumanMessage(
            content=[
                {"type": "text", "text": "Describe this image:"},
                {"type": "image_url", "image_url": {"url": image_url}},
            ]
        )
    ]
)

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

#### Passing an image as a base64 encoded string[​](#passing-an-image-as-a-base64-encoded-string)

At the moment, some extra processing happens client-side to support larger images like the one above. But for smaller images (and to better illustrate the process going on under the hood), we can directly pass in the image as shown below:

```python
import IPython
import requests

image_url = "https://picsum.photos/seed/kitten/300/200"
image_content = requests.get(image_url).content

IPython.display.Image(image_content)

```**

```python
import base64

from langchain_core.messages import HumanMessage

## Works for simpler images. For larger images, see actual implementation
b64_string = base64.b64encode(image_content).decode("utf-8")

llm.invoke(
    [
        HumanMessage(
            content=[
                {"type": "text", "text": "Describe this image:"},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{b64_string}"},
                },
            ]
        )
    ]
)

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

#### Directly within the string[​](#directly-within-the-string)

The NVIDIA API uniquely accepts images as base64 images inlined within `` HTML tags. While this isn&#x27;t interoperable with other LLMs, you can directly prompt the model accordingly.

```python
base64_with_mime_type = f"data:image/png;base64,{b64_string}"
llm.invoke(f&#x27;What\&#x27;s in this image?\n<img src="{base64_with_mime_type}" />&#x27;)

```**Example usage within a RunnableWithMessageHistory[​](#example-usage-within-a-runnablewithmessagehistory) Like any other integration, ChatNVIDIA is fine to support chat utilities like RunnableWithMessageHistory which is analogous to using ConversationChain. Below, we show the [LangChain RunnableWithMessageHistory](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.history.RunnableWithMessageHistory.html) example applied to the mistralai/mixtral-8x22b-instruct-v0.1 model.

```python
%pip install --upgrade --quiet langchain

```

```python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# store is a dictionary that maps session IDs to their corresponding chat histories.
store = {}  # memory is maintained outside the chain

# A function that returns the chat history for a given session ID.
def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

chat = ChatNVIDIA(
    model="mistralai/mixtral-8x22b-instruct-v0.1",
    temperature=0.1,
    max_tokens=100,
    top_p=1.0,
)

#  Define a RunnableConfig object, with a `configurable` key. session_id determines thread
config = {"configurable": {"session_id": "1"}}

conversation = RunnableWithMessageHistory(
    chat,
    get_session_history,
)

conversation.invoke(
    "Hi I&#x27;m Srijan Dubey.",  # input or query
    config=config,
)

```API Reference:**[InMemoryChatMessageHistory](https://python.langchain.com/api_reference/core/chat_history/langchain_core.chat_history.InMemoryChatMessageHistory.html) | [RunnableWithMessageHistory](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.history.RunnableWithMessageHistory.html)

```python
conversation.invoke(
    "I&#x27;m doing well! Just having a conversation with an AI.",
    config=config,
)

```**

```python
conversation.invoke(
    "Tell me about yourself.",
    config=config,
)

``` Tool calling[​](#tool-calling) Starting in v0.2, ChatNVIDIA supports [bind_tools](https://python.langchain.com/api_reference/core/language_models/langchain_core.language_models.chat_models.BaseChatModel.html#langchain_core.language_models.chat_models.BaseChatModel.bind_tools). ChatNVIDIA provides integration with the variety of models on [build.nvidia.com](https://build.nvidia.com) as well as local NIMs. Not all these models are trained for tool calling. Be sure to select a model that does have tool calling for your experimention and applications. You can get a list of models that are known to support tool calling with,

```python
tool_models = [
    model for model in ChatNVIDIA.get_available_models() if model.supports_tools
]
tool_models

``` With a tool capable model,

```python
from langchain_core.tools import tool
from pydantic import Field

@tool
def get_current_weather(
    location: str = Field(..., description="The location to get the weather for."),
):
    """Get the current weather for a location."""
    ...

llm = ChatNVIDIA(model=tool_models[0].id).bind_tools(tools=[get_current_weather])
response = llm.invoke("What is the weather in Boston?")
response.tool_calls

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

See [How to use chat models to call tools](https://python.langchain.com/docs/how_to/tool_calling/) for additional examples.

## Chaining[​](#chaining)

We can [chain](/docs/how_to/sequence/) our model with a prompt template like so:

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

```**API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

## API reference[​](#api-reference)

For detailed documentation of all `ChatNVIDIA` features and configurations head to the API reference: [https://python.langchain.com/api_reference/nvidia_ai_endpoints/chat_models/langchain_nvidia_ai_endpoints.chat_models.ChatNVIDIA.html](https://python.langchain.com/api_reference/nvidia_ai_endpoints/chat_models/langchain_nvidia_ai_endpoints.chat_models.ChatNVIDIA.html)

## Related[​](#related)

- Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/nvidia_ai_endpoints.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Working with NVIDIA NIMs](#working-with-nvidia-nims)
- [Stream, Batch, and Async](#stream-batch-and-async)
- [Supported models](#supported-models)
- [Model types](#model-types)[General Chat](#general-chat)
- [Code Generation](#code-generation)

- [Multimodal](#multimodal)
- [Example usage within a RunnableWithMessageHistory](#example-usage-within-a-runnablewithmessagehistory)
- [Tool calling](#tool-calling)
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