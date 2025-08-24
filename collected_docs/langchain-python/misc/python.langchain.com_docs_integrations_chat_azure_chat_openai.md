AzureChatOpenAI | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/azure_chat_openai.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/azure_chat_openai.ipynb)AzureChatOpenAI This guide will help you get started with AzureOpenAI [chat models](/docs/concepts/chat_models/). For detailed documentation of all AzureChatOpenAI features and configurations head to the [API reference](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.azure.AzureChatOpenAI.html). Azure OpenAI has several chat models. You can find information about their latest models and their costs, context windows, and supported input types in the [Azure docs](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models). Azure OpenAI vs OpenAIAzure OpenAI refers to OpenAI models hosted on the [Microsoft Azure platform](https://azure.microsoft.com/en-us/products/ai-services/openai-service). OpenAI also provides its own model APIs. To access OpenAI services directly, use the [ChatOpenAI integration](/docs/integrations/chat/openai/). Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/azure)Package downloadsPackage latest[AzureChatOpenAI](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.azure.AzureChatOpenAI.html)[langchain-openai](https://python.langchain.com/api_reference/openai/index.html)❌beta✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain-openai?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain-openai?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅✅❌❌✅✅✅✅ Setup[​](#setup) To access AzureOpenAI models you&#x27;ll need to create an Azure account, create a deployment of an Azure OpenAI model, get the name and endpoint for your deployment, get an Azure OpenAI API key, and install the langchain-openai integration package. Credentials[​](#credentials) Head to the [Azure docs](https://learn.microsoft.com/en-us/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython-new&pivots=programming-language-python) to create your deployment and generate an API key. Once you&#x27;ve done this set the AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT environment variables:

```python
import getpass
import os

if "AZURE_OPENAI_API_KEY" not in os.environ:
    os.environ["AZURE_OPENAI_API_KEY"] = getpass.getpass(
        "Enter your AzureOpenAI API key: "
    )
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://YOUR-ENDPOINT.openai.azure.com/"

``` To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"

``` Installation[​](#installation) The LangChain AzureOpenAI integration lives in the langchain-openai package:

```python
%pip install -qU langchain-openai

``` Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions. Replace azure_deployment with the name of your deployment, You can find the latest supported api_version here: [https://learn.microsoft.com/en-us/azure/ai-services/openai/reference](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference).

```python
from langchain_openai import AzureChatOpenAI

llm = AzureChatOpenAI(
    azure_deployment="gpt-35-turbo",  # or your deployment
    api_version="2023-06-01-preview",  # or your api version
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
AIMessage(content="J&#x27;adore la programmation.", response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 8, &#x27;prompt_tokens&#x27;: 31, &#x27;total_tokens&#x27;: 39}, &#x27;model_name&#x27;: &#x27;gpt-35-turbo&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;prompt_filter_results&#x27;: [{&#x27;prompt_index&#x27;: 0, &#x27;content_filter_results&#x27;: {&#x27;hate&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;self_harm&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;sexual&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;violence&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}}}], &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None, &#x27;content_filter_results&#x27;: {&#x27;hate&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;self_harm&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;sexual&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;violence&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}}}, id=&#x27;run-bea4b46c-e3e1-4495-9d3a-698370ad963d-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 31, &#x27;output_tokens&#x27;: 8, &#x27;total_tokens&#x27;: 39})

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
AIMessage(content=&#x27;Ich liebe das Programmieren.&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 6, &#x27;prompt_tokens&#x27;: 26, &#x27;total_tokens&#x27;: 32}, &#x27;model_name&#x27;: &#x27;gpt-35-turbo&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;prompt_filter_results&#x27;: [{&#x27;prompt_index&#x27;: 0, &#x27;content_filter_results&#x27;: {&#x27;hate&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;self_harm&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;sexual&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;violence&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}}}], &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None, &#x27;content_filter_results&#x27;: {&#x27;hate&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;self_harm&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;sexual&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}, &#x27;violence&#x27;: {&#x27;filtered&#x27;: False, &#x27;severity&#x27;: &#x27;safe&#x27;}}}, id=&#x27;run-cbc44038-09d3-40d4-9da2-c5910ee636ca-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 26, &#x27;output_tokens&#x27;: 6, &#x27;total_tokens&#x27;: 32})

``` ## Specifying model version[​](#specifying-model-version) Azure OpenAI responses contain model_name response metadata property, which is name of the model used to generate the response. However unlike native OpenAI responses, it does not contain the specific version of the model, which is set on the deployment in Azure. E.g. it does not distinguish between gpt-35-turbo-0125 and gpt-35-turbo-0301. This makes it tricky to know which version of the model was used to generate the response, which as result can lead to e.g. wrong total cost calculation with OpenAICallbackHandler. To solve this problem, you can pass model_version parameter to AzureChatOpenAI class, which will be added to the model name in the llm output. This way you can easily distinguish between different versions of the model.

```python
%pip install -qU langchain-community

```

```python
from langchain_community.callbacks import get_openai_callback

with get_openai_callback() as cb:
    llm.invoke(messages)
    print(
        f"Total Cost (USD): ${format(cb.total_cost, &#x27;.6f&#x27;)}"
    )  # without specifying the model version, flat-rate 0.002 USD per 1k input and output tokens is used

```

```output
Total Cost (USD): $0.000063

```

```python
llm_0301 = AzureChatOpenAI(
    azure_deployment="gpt-35-turbo",  # or your deployment
    api_version="2023-06-01-preview",  # or your api version
    model_version="0301",
)
with get_openai_callback() as cb:
    llm_0301.invoke(messages)
    print(f"Total Cost (USD): ${format(cb.total_cost, &#x27;.6f&#x27;)}")

```

```output
Total Cost (USD): $0.000074

``` ## API reference[​](#api-reference) For detailed documentation of all AzureChatOpenAI features and configurations head to the API reference: [https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.azure.AzureChatOpenAI.html](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.azure.AzureChatOpenAI.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/azure_chat_openai.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Chaining](#chaining)
- [Specifying model version](#specifying-model-version)
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