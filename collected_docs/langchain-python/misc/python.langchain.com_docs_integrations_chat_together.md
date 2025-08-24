ChatTogether | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/together.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/together.ipynb)ChatTogether This page will help you get started with Together AI [chat models](/docs/concepts/chat_models/). For detailed documentation of all ChatTogether features and configurations, head to the [API reference](https://python.langchain.com/api_reference/together/chat_models/langchain_together.chat_models.ChatTogether.html). [Together AI](https://www.together.ai/) offers an API to query [50+ leading open-source models](https://docs.together.ai/docs/chat-models) Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/togetherai)Package downloadsPackage latest[ChatTogether](https://python.langchain.com/api_reference/together/chat_models/langchain_together.chat_models.ChatTogether.html)[langchain-together](https://python.langchain.com/api_reference/together/index.html)❌beta✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain-together?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain-together?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅✅✅✅✅❌✅✅ Setup[​](#setup) To access Together models you&#x27;ll need to create a/an Together account, get an API key, and install the langchain-together integration package. Credentials[​](#credentials) Head to [this page](https://api.together.ai) to sign up to Together and generate an API key. Once you&#x27;ve done this, set the TOGETHER_API_KEY environment variable:

```python
import getpass
import os

if "TOGETHER_API_KEY" not in os.environ:
    os.environ["TOGETHER_API_KEY"] = getpass.getpass("Enter your Together API key: ")

``` To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"

``` Installation[​](#installation) The LangChain Together integration is included in the langchain-together package:

```python
%pip install -qU langchain-together

``` Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```python
from langchain_together import ChatTogether

llm = ChatTogether(
    model="meta-llama/Llama-3-70b-chat-hf",
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
AIMessage(content="J&#x27;adore la programmation.", response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 9, &#x27;prompt_tokens&#x27;: 35, &#x27;total_tokens&#x27;: 44}, &#x27;model_name&#x27;: &#x27;meta-llama/Llama-3-70b-chat-hf&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-eabcbe33-cdd8-45b8-ab0b-f90b6e7dfad8-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 35, &#x27;output_tokens&#x27;: 9, &#x27;total_tokens&#x27;: 44})

```

```python
print(ai_msg.content)

```

```output
J&#x27;adore la programmation.

``` Chaining[​](#chaining) We can [chain](/docs/how_to/sequence/) our model with a prompt template as follows:

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
AIMessage(content=&#x27;Ich liebe das Programmieren.&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 7, &#x27;prompt_tokens&#x27;: 30, &#x27;total_tokens&#x27;: 37}, &#x27;model_name&#x27;: &#x27;meta-llama/Llama-3-70b-chat-hf&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-a249aa24-ee31-46ba-9bf9-f4eb135b0a95-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 30, &#x27;output_tokens&#x27;: 7, &#x27;total_tokens&#x27;: 37})

``` ## API reference[​](#api-reference) For detailed documentation of all ChatTogether features and configurations, head to the API reference: [https://python.langchain.com/api_reference/together/chat_models/langchain_together.chat_models.ChatTogether.html](https://python.langchain.com/api_reference/together/chat_models/langchain_together.chat_models.ChatTogether.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/together.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
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