ChatFireworks | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/fireworks.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/fireworks.ipynb)ChatFireworks This doc helps you get started with Fireworks AI [chat models](/docs/concepts/chat_models/). For detailed documentation of all ChatFireworks features and configurations head to the [API reference](https://python.langchain.com/api_reference/fireworks/chat_models/langchain_fireworks.chat_models.ChatFireworks.html). Fireworks AI is an AI inference platform to run and customize models. For a list of all models served by Fireworks see the [Fireworks docs](https://fireworks.ai/models). Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/fireworks)Package downloadsPackage latest[ChatFireworks](https://python.langchain.com/api_reference/fireworks/chat_models/langchain_fireworks.chat_models.ChatFireworks.html)[langchain-fireworks](https://python.langchain.com/api_reference/fireworks/index.html)❌beta✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain-fireworks?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain-fireworks?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅❌❌❌✅✅✅✅ Setup[​](#setup) To access Fireworks models you&#x27;ll need to create a Fireworks account, get an API key, and install the langchain-fireworks integration package. Credentials[​](#credentials) Head to ([https://fireworks.ai/login](https://fireworks.ai/login) to sign up to Fireworks and generate an API key. Once you&#x27;ve done this set the FIREWORKS_API_KEY environment variable:

```python
import getpass
import os

if "FIREWORKS_API_KEY" not in os.environ:
    os.environ["FIREWORKS_API_KEY"] = getpass.getpass("Enter your Fireworks API key: ")

``` To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"

``` Installation[​](#installation) The LangChain Fireworks integration lives in the langchain-fireworks package:

```python
%pip install -qU langchain-fireworks

``` Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions: TODO: Update model instantiation with relevant params.

```python
from langchain_fireworks import ChatFireworks

llm = ChatFireworks(
    model="accounts/fireworks/models/llama-v3-70b-instruct",
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
AIMessage(content="J&#x27;adore la programmation.", response_metadata={&#x27;token_usage&#x27;: {&#x27;prompt_tokens&#x27;: 35, &#x27;total_tokens&#x27;: 44, &#x27;completion_tokens&#x27;: 9}, &#x27;model_name&#x27;: &#x27;accounts/fireworks/models/llama-v3-70b-instruct&#x27;, &#x27;system_fingerprint&#x27;: &#x27;&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-df28e69a-ff30-457e-a743-06eb14d01cb0-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 35, &#x27;output_tokens&#x27;: 9, &#x27;total_tokens&#x27;: 44})

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
AIMessage(content=&#x27;Ich liebe das Programmieren.&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;prompt_tokens&#x27;: 30, &#x27;total_tokens&#x27;: 37, &#x27;completion_tokens&#x27;: 7}, &#x27;model_name&#x27;: &#x27;accounts/fireworks/models/llama-v3-70b-instruct&#x27;, &#x27;system_fingerprint&#x27;: &#x27;&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-ff3f91ad-ed81-4acf-9f59-7490dc8d8f48-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 30, &#x27;output_tokens&#x27;: 7, &#x27;total_tokens&#x27;: 37})

``` ## API reference[​](#api-reference) For detailed documentation of all ChatFireworks features and configurations head to the API reference: [https://python.langchain.com/api_reference/fireworks/chat_models/langchain_fireworks.chat_models.ChatFireworks.html](https://python.langchain.com/api_reference/fireworks/chat_models/langchain_fireworks.chat_models.ChatFireworks.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/fireworks.ipynb)

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