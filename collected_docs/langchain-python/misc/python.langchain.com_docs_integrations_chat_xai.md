ChatXAI | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/xai.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/xai.ipynb)ChatXAI This page will help you get started with xAI [chat models](/docs/concepts/chat_models/). For detailed documentation of all ChatXAI features and configurations, head to the [API reference](https://python.langchain.com/api_reference/xai/chat_models/langchain_xai.chat_models.ChatXAI.html). [xAI](https://console.x.ai/) offers an API to interact with Grok models. Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/xai)Package downloadsPackage latest[ChatXAI](https://python.langchain.com/api_reference/xai/chat_models/langchain_xai.chat_models.ChatXAI.html)[langchain-xai](https://python.langchain.com/api_reference/xai/index.html)❌beta✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain-xai?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain-xai?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌❌❌❌✅❌✅✅ Setup[​](#setup) To access xAI models, you&#x27;ll need to create an xAI account, get an API key, and install the langchain-xai integration package. Credentials[​](#credentials) Head to [this page](https://console.x.ai/) to sign up for xAI and generate an API key. Once you&#x27;ve done this, set the XAI_API_KEY environment variable:

```python
import getpass
import os

if "XAI_API_KEY" not in os.environ:
    os.environ["XAI_API_KEY"] = getpass.getpass("Enter your xAI API key: ")

``` To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"

``` Installation[​](#installation) The LangChain xAI integration lives in the langchain-xai package:

```python
%pip install -qU langchain-xai

``` Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```python
from langchain_xai import ChatXAI

llm = ChatXAI(
    model="grok-beta",
    temperature=0,
    max_tokens=None,
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
AIMessage(content="J&#x27;adore programmer.", additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 6, &#x27;prompt_tokens&#x27;: 30, &#x27;total_tokens&#x27;: 36, &#x27;completion_tokens_details&#x27;: None, &#x27;prompt_tokens_details&#x27;: None}, &#x27;model_name&#x27;: &#x27;grok-beta&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_14b89b2dfc&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-adffb7a3-e48a-4f52-b694-340d85abe5c3-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 30, &#x27;output_tokens&#x27;: 6, &#x27;total_tokens&#x27;: 36, &#x27;input_token_details&#x27;: {}, &#x27;output_token_details&#x27;: {}})

```

```python
print(ai_msg.content)

```

```output
J&#x27;adore programmer.

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
AIMessage(content=&#x27;Ich liebe das Programmieren.&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 7, &#x27;prompt_tokens&#x27;: 25, &#x27;total_tokens&#x27;: 32, &#x27;completion_tokens_details&#x27;: None, &#x27;prompt_tokens_details&#x27;: None}, &#x27;model_name&#x27;: &#x27;grok-beta&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_14b89b2dfc&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-569fc8dc-101b-4e6d-864e-d4fa80df2b63-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 25, &#x27;output_tokens&#x27;: 7, &#x27;total_tokens&#x27;: 32, &#x27;input_token_details&#x27;: {}, &#x27;output_token_details&#x27;: {}})

``` ## Tool calling[​](#tool-calling) ChatXAI has a [tool calling](https://docs.x.ai/docs#capabilities) (we use "tool calling" and "function calling" interchangeably here) API that lets you describe tools and their arguments, and have the model return a JSON object with a tool to invoke and the inputs to that tool. Tool-calling is extremely useful for building tool-using chains and agents, and for getting structured outputs from models more generally. ### ChatXAI.bind_tools()[​](#chatxaibind_tools) With ChatXAI.bind_tools, we can easily pass in Pydantic classes, dict schemas, LangChain tools, or even functions as tools to the model. Under the hood, these are converted to an OpenAI tool schema, which looks like:

```text
{
    "name": "...",
    "description": "...",
    "parameters": {...}  # JSONSchema
}

``` and passed in every model invocation.

```python
from pydantic import BaseModel, Field

class GetWeather(BaseModel):
    """Get the current weather in a given location"""

    location: str = Field(..., description="The city and state, e.g. San Francisco, CA")

llm_with_tools = llm.bind_tools([GetWeather])

```

```python
ai_msg = llm_with_tools.invoke(
    "what is the weather like in San Francisco",
)
ai_msg

```

```output
AIMessage(content=&#x27;I am retrieving the current weather for San Francisco.&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;0&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"location":"San Francisco, CA"}&#x27;, &#x27;name&#x27;: &#x27;GetWeather&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 11, &#x27;prompt_tokens&#x27;: 151, &#x27;total_tokens&#x27;: 162, &#x27;completion_tokens_details&#x27;: None, &#x27;prompt_tokens_details&#x27;: None}, &#x27;model_name&#x27;: &#x27;grok-beta&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_14b89b2dfc&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-73707da7-afec-4a52-bee1-a176b0ab8585-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;GetWeather&#x27;, &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;San Francisco, CA&#x27;}, &#x27;id&#x27;: &#x27;0&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 151, &#x27;output_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 162, &#x27;input_token_details&#x27;: {}, &#x27;output_token_details&#x27;: {}})

``` ## Live Search[​](#live-search) xAI supports a [Live Search](https://docs.x.ai/docs/guides/live-search) feature that enables Grok to ground its answers using results from web searches:

```python
from langchain_xai import ChatXAI

llm = ChatXAI(
    model="grok-3-latest",
    search_parameters={
        "mode": "auto",
        # Example optional parameters below:
        "max_search_results": 3,
        "from_date": "2025-05-26",
        "to_date": "2025-05-27",
    },
)

llm.invoke("Provide me a digest of world news in the last 24 hours.")

``` See [xAI docs](https://docs.x.ai/docs/guides/live-search) for the full set of web search options. ## API reference[​](#api-reference) For detailed documentation of all ChatXAI features and configurations, head to the [API reference](https://python.langchain.com/api_reference/xai/chat_models/langchain_xai.chat_models.ChatXAI.html). ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/xai.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Chaining](#chaining)
- [Tool calling](#tool-calling)[ChatXAI.bind_tools()](#chatxaibind_tools)

- [Live Search](#live-search)
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