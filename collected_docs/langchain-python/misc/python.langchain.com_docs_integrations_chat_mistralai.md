ChatMistralAI | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/mistralai.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/mistralai.ipynb)ChatMistralAI This will help you get started with Mistral [chat models](/docs/concepts/chat_models/). For detailed documentation of all ChatMistralAI features and configurations head to the [API reference](https://python.langchain.com/api_reference/mistralai/chat_models/langchain_mistralai.chat_models.ChatMistralAI.html). The ChatMistralAI class is built on top of the [Mistral API](https://docs.mistral.ai/api/). For a list of all the models supported by Mistral, check out [this page](https://docs.mistral.ai/getting-started/models/). Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/mistral)Package downloadsPackage latest[ChatMistralAI](https://python.langchain.com/api_reference/mistralai/chat_models/langchain_mistralai.chat_models.ChatMistralAI.html)[langchain-mistralai](https://python.langchain.com/api_reference/mistralai/index.html)❌beta✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain_mistralai?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain_mistralai?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅❌❌❌✅✅✅❌ Setup[​](#setup) To access ChatMistralAI models you&#x27;ll need to create a Mistral account, get an API key, and install the langchain-mistralai integration package. Credentials[​](#credentials) A valid [API key](https://console.mistral.ai/api-keys/) is needed to communicate with the API. Once you&#x27;ve done this set the MISTRAL_API_KEY environment variable:

```python
import getpass
import os

if "MISTRAL_API_KEY" not in os.environ:
    os.environ["MISTRAL_API_KEY"] = getpass.getpass("Enter your Mistral API key: ")

``` To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"

``` Installation[​](#installation) The LangChain Mistral integration lives in the langchain-mistralai package:

```python
%pip install -qU langchain-mistralai

``` Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```python
from langchain_mistralai import ChatMistralAI

llm = ChatMistralAI(
    model="mistral-large-latest",
    temperature=0,
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
AIMessage(content=&#x27;Sure, I\&#x27;d be happy to help you translate that sentence into French! The English sentence "I love programming" translates to "J\&#x27;aime programmer" in French. Let me know if you have any other questions or need further assistance!&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;prompt_tokens&#x27;: 32, &#x27;total_tokens&#x27;: 84, &#x27;completion_tokens&#x27;: 52}, &#x27;model&#x27;: &#x27;mistral-small&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;}, id=&#x27;run-64bac156-7160-4b68-b67e-4161f63e021f-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 32, &#x27;output_tokens&#x27;: 52, &#x27;total_tokens&#x27;: 84})

```

```python
print(ai_msg.content)

```

```output
Sure, I&#x27;d be happy to help you translate that sentence into French! The English sentence "I love programming" translates to "J&#x27;aime programmer" in French. Let me know if you have any other questions or need further assistance!

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
AIMessage(content=&#x27;Ich liebe Programmierung. (German translation)&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;prompt_tokens&#x27;: 26, &#x27;total_tokens&#x27;: 38, &#x27;completion_tokens&#x27;: 12}, &#x27;model&#x27;: &#x27;mistral-small&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;}, id=&#x27;run-dfd4094f-e347-47b0-9056-8ebd7ea35fe7-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 26, &#x27;output_tokens&#x27;: 12, &#x27;total_tokens&#x27;: 38})

``` ## API reference[​](#api-reference) Head to the [API reference](https://python.langchain.com/api_reference/mistralai/chat_models/langchain_mistralai.chat_models.ChatMistralAI.html) for detailed documentation of all attributes and methods. ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/mistralai.ipynb)

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