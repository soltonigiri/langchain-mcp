Llama.cpp | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/llamacpp.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/llamacpp.ipynb)Llama.cpp [llama.cpp python](https://github.com/abetlen/llama-cpp-python) library is a simple Python bindings for @ggerganov [llama.cpp](https://github.com/ggerganov/llama.cpp). This package provides: Low-level access to C API via ctypes interface. High-level Python API for text completion OpenAI-like API LangChain compatibility LlamaIndex compatibility OpenAI compatible web server Local Copilot replacement Function Calling support Vision API support Multiple Models Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializableJS support[ChatLlamaCpp](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.llamacpp.ChatLlamaCpp.html)[langchain-community](https://python.langchain.com/api_reference/community/index.html)✅❌❌ Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON modeImage inputAudio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌❌❌❌✅❌❌✅ Setup[​](#setup) To get started and use all** the features shown below, we recommend using a model that has been fine-tuned for tool-calling. We will use [Hermes-2-Pro-Llama-3-8B-GGUF](https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B-GGUF) from NousResearch. **Hermes 2 Pro is an upgraded version of Nous Hermes 2, consisting of an updated and cleaned version of the OpenHermes 2.5 Dataset, as well as a newly introduced Function Calling and JSON Mode dataset developed in-house. This new version of Hermes maintains its excellent general task and conversation capabilities - but also excels at Function Calling See our guides on local models to go deeper: [Run LLMs locally](https://python.langchain.com/v0.1/docs/guides/development/local_llms/) [Using local models with RAG](https://python.langchain.com/v0.1/docs/use_cases/question_answering/local_retrieval_qa/) Installation[​](#installation) The LangChain LlamaCpp integration lives in the langchain-community and llama-cpp-python packages:

```python
%pip install -qU langchain-community llama-cpp-python

``` Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```python
# Path to your model weights
local_model = "local/path/to/Hermes-2-Pro-Llama-3-8B-Q8_0.gguf"

```

```python
import multiprocessing

from langchain_community.chat_models import ChatLlamaCpp

llm = ChatLlamaCpp(
    temperature=0.5,
    model_path=local_model,
    n_ctx=10000,
    n_gpu_layers=8,
    n_batch=300,  # Should be between 1 and n_ctx, consider the amount of VRAM in your GPU.
    max_tokens=512,
    n_threads=multiprocessing.cpu_count() - 1,
    repeat_penalty=1.5,
    top_p=0.5,
    verbose=True,
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

```python
print(ai_msg.content)

```

```output
J&#x27;aime programmer. (In France, "programming" is often used in its original sense of scheduling or organizing events.)

If you meant computer-programming:
Je suis amoureux de la programmation informatique.

(You might also say simply &#x27;programmation&#x27;, which would be understood as both meanings - depending on context).

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

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) ## Tool calling[​](#tool-calling) Firstly, it works mostly the same as OpenAI Function Calling OpenAI has a [tool calling](https://platform.openai.com/docs/guides/function-calling) (we use "tool calling" and "function calling" interchangeably here) API that lets you describe tools and their arguments, and have the model return a JSON object with a tool to invoke and the inputs to that tool. tool-calling is extremely useful for building tool-using chains and agents, and for getting structured outputs from models more generally. With ChatLlamaCpp.bind_tools, we can easily pass in Pydantic classes, dict schemas, LangChain tools, or even functions as tools to the model. Under the hood, these are converted to an OpenAI tool schema, which looks like:

```text
{
    "name": "...",
    "description": "...",
    "parameters": {...}  # JSONSchema
}

```**and passed in every model invocation. However, it cannot automatically trigger a function/tool, we need to force it by specifying the &#x27;tool choice&#x27; parameter. This parameter is typically formatted as described below. {"type": "function", "function": {"name": >}}.

```python
from langchain_core.tools import tool
from pydantic import BaseModel, Field

class WeatherInput(BaseModel):
    location: str = Field(description="The city and state, e.g. San Francisco, CA")
    unit: str = Field(enum=["celsius", "fahrenheit"])

@tool("get_current_weather", args_schema=WeatherInput)
def get_weather(location: str, unit: str):
    """Get the current weather in a given location"""
    return f"Now the weather in {location} is 22 {unit}"

llm_with_tools = llm.bind_tools(
    tools=[get_weather],
    tool_choice={"type": "function", "function": {"name": "get_current_weather"}},
)

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```python
ai_msg = llm_with_tools.invoke(
    "what is the weather like in HCMC in celsius",
)

```**

```python
ai_msg.tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;get_current_weather&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;Ho Chi Minh City&#x27;, &#x27;unit&#x27;: &#x27;celsius&#x27;},
  &#x27;id&#x27;: &#x27;call__0_get_current_weather_cmpl-394d9943-0a1f-425b-8139-d2826c1431f2&#x27;}]

```

```python
class MagicFunctionInput(BaseModel):
    magic_function_input: int = Field(description="The input value for magic function")

@tool("get_magic_function", args_schema=MagicFunctionInput)
def magic_function(magic_function_input: int):
    """Get the value of magic function for an input."""
    return magic_function_input + 2

llm_with_tools = llm.bind_tools(
    tools=[magic_function],
    tool_choice={"type": "function", "function": {"name": "get_magic_function"}},
)

ai_msg = llm_with_tools.invoke(
    "What is magic function of 3?",
)

ai_msg

```

```python
ai_msg.tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;get_magic_function&#x27;,
  &#x27;args&#x27;: {&#x27;magic_function_input&#x27;: 3},
  &#x27;id&#x27;: &#x27;call__0_get_magic_function_cmpl-cd83a994-b820-4428-957c-48076c68335a&#x27;}]

``` Structured output

```python
from langchain_core.utils.function_calling import convert_to_openai_tool
from pydantic import BaseModel

class Joke(BaseModel):
    """A setup to a joke and the punchline."""

    setup: str
    punchline: str

dict_schema = convert_to_openai_tool(Joke)
structured_llm = llm.with_structured_output(dict_schema)
result = structured_llm.invoke("Tell me a joke about birds")
result

```API Reference:**[convert_to_openai_tool](https://python.langchain.com/api_reference/core/utils/langchain_core.utils.function_calling.convert_to_openai_tool.html)

```python
result

```

```output
{&#x27;setup&#x27;: &#x27;- Why did the chicken cross the playground?&#x27;,
 &#x27;punchline&#x27;: &#x27;\n\n- To get to its gilded cage on the other side!&#x27;}

``` # Streaming

```python
for chunk in llm.stream("what is 25x5"):
    print(chunk.content, end="\n", flush=True)

``` ## API reference[​](#api-reference) For detailed documentation of all ChatLlamaCpp features and configurations, head to the API reference: [https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.llamacpp.ChatLlamaCpp.html](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.llamacpp.ChatLlamaCpp.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/llamacpp.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Chaining](#chaining)
- [Tool calling](#tool-calling)
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