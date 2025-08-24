ChatVertexAI | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/google_vertex_ai_palm.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/google_vertex_ai_palm.ipynb)ChatVertexAI This page provides a quick overview for getting started with VertexAI [chat models](/docs/concepts/chat_models/). For detailed documentation of all ChatVertexAI features and configurations head to the [API reference](https://python.langchain.com/api_reference/google_vertexai/chat_models/langchain_google_vertexai.chat_models.ChatVertexAI.html). ChatVertexAI exposes all foundational models available in Google Cloud, like gemini-2.5-pro, gemini-2.5-flash, etc. For a full and updated list of available models visit [VertexAI documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/models). Google Cloud VertexAI vs Google PaLMThe Google Cloud VertexAI integration is separate from the [Google PaLM integration](/docs/integrations/chat/google_generative_ai/). Google has chosen to offer an enterprise version of PaLM through GCP, and this supports the models made available through there. Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/google_vertex_ai)Package downloadsPackage latest[ChatVertexAI](https://python.langchain.com/api_reference/google_vertexai/chat_models/langchain_google_vertexai.chat_models.ChatVertexAI.html)[langchain-google-vertexai](https://python.langchain.com/api_reference/google_vertexai/index.html)❌beta✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain-google-vertexai?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain-google-vertexai?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌✅✅✅✅✅✅❌ Setup[​](#setup) To access VertexAI models you&#x27;ll need to create a Google Cloud Platform account, set up credentials, and install the langchain-google-vertexai integration package. Credentials[​](#credentials) To use the integration you must either: Have credentials configured for your environment (gcloud, workload identity, etc...) Store the path to a service account JSON file as the GOOGLE_APPLICATION_CREDENTIALS environment variable This codebase uses the google.auth library which first looks for the application credentials variable mentioned above, and then looks for system-level auth. For more information, see: [https://cloud.google.com/docs/authentication/application-default-credentials#GAC](https://cloud.google.com/docs/authentication/application-default-credentials#GAC) [https://googleapis.dev/python/google-auth/latest/reference/google.auth.html#module-google.auth](https://googleapis.dev/python/google-auth/latest/reference/google.auth.html#module-google.auth) To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"

``` Installation[​](#installation) The LangChain VertexAI integration lives in the langchain-google-vertexai package:

```python
%pip install -qU langchain-google-vertexai

```

```output
Note: you may need to restart the kernel to use updated packages.

``` Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```python
from langchain_google_vertexai import ChatVertexAI

llm = ChatVertexAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_tokens=None,
    max_retries=6,
    stop=None,
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
AIMessage(content="J&#x27;adore programmer. \n", response_metadata={&#x27;is_blocked&#x27;: False, &#x27;safety_ratings&#x27;: [{&#x27;category&#x27;: &#x27;HARM_CATEGORY_HATE_SPEECH&#x27;, &#x27;probability_label&#x27;: &#x27;NEGLIGIBLE&#x27;, &#x27;blocked&#x27;: False}, {&#x27;category&#x27;: &#x27;HARM_CATEGORY_DANGEROUS_CONTENT&#x27;, &#x27;probability_label&#x27;: &#x27;NEGLIGIBLE&#x27;, &#x27;blocked&#x27;: False}, {&#x27;category&#x27;: &#x27;HARM_CATEGORY_HARASSMENT&#x27;, &#x27;probability_label&#x27;: &#x27;NEGLIGIBLE&#x27;, &#x27;blocked&#x27;: False}, {&#x27;category&#x27;: &#x27;HARM_CATEGORY_SEXUALLY_EXPLICIT&#x27;, &#x27;probability_label&#x27;: &#x27;NEGLIGIBLE&#x27;, &#x27;blocked&#x27;: False}], &#x27;usage_metadata&#x27;: {&#x27;prompt_token_count&#x27;: 20, &#x27;candidates_token_count&#x27;: 7, &#x27;total_token_count&#x27;: 27}}, id=&#x27;run-7032733c-d05c-4f0c-a17a-6c575fdd1ae0-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 20, &#x27;output_tokens&#x27;: 7, &#x27;total_tokens&#x27;: 27})

```

```python
print(ai_msg.content)

```

```output
J&#x27;adore programmer.

``` Built-in tools[​](#built-in-tools) Gemini supports a range of tools that are executed server-side. Google search[​](#google-search) Requires langchain-google-vertexai>=2.0.11 Gemini can execute a Google search and use the results to [ground its responses](https://ai.google.dev/gemini-api/docs/grounding):

```python
from langchain_google_vertexai import ChatVertexAI

llm = ChatVertexAI(model="gemini-2.5-flash").bind_tools([{"google_search": {}}])

response = llm.invoke("What is today&#x27;s news?")

``` Code execution[​](#code-execution) Requires langchain-google-vertexai>=2.0.25 Gemini can [generate and execute Python code](https://ai.google.dev/gemini-api/docs/code-execution):

```python
from langchain_google_vertexai import ChatVertexAI

llm = ChatVertexAI(model="gemini-2.5-flash").bind_tools([{"code_execution": {}}])

response = llm.invoke("What is 3^3?")

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
AIMessage(content=&#x27;Ich liebe Programmieren. \n&#x27;, response_metadata={&#x27;is_blocked&#x27;: False, &#x27;safety_ratings&#x27;: [{&#x27;category&#x27;: &#x27;HARM_CATEGORY_HATE_SPEECH&#x27;, &#x27;probability_label&#x27;: &#x27;NEGLIGIBLE&#x27;, &#x27;blocked&#x27;: False}, {&#x27;category&#x27;: &#x27;HARM_CATEGORY_DANGEROUS_CONTENT&#x27;, &#x27;probability_label&#x27;: &#x27;NEGLIGIBLE&#x27;, &#x27;blocked&#x27;: False}, {&#x27;category&#x27;: &#x27;HARM_CATEGORY_HARASSMENT&#x27;, &#x27;probability_label&#x27;: &#x27;NEGLIGIBLE&#x27;, &#x27;blocked&#x27;: False}, {&#x27;category&#x27;: &#x27;HARM_CATEGORY_SEXUALLY_EXPLICIT&#x27;, &#x27;probability_label&#x27;: &#x27;NEGLIGIBLE&#x27;, &#x27;blocked&#x27;: False}], &#x27;usage_metadata&#x27;: {&#x27;prompt_token_count&#x27;: 15, &#x27;candidates_token_count&#x27;: 8, &#x27;total_token_count&#x27;: 23}}, id=&#x27;run-c71955fd-8dc1-422b-88a7-853accf4811b-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 15, &#x27;output_tokens&#x27;: 8, &#x27;total_tokens&#x27;: 23})

``` ## API reference[​](#api-reference) For detailed documentation of all ChatVertexAI features and configurations, like how to send multimodal inputs and configure safety settings, head to the API reference: [https://python.langchain.com/api_reference/google_vertexai/chat_models/langchain_google_vertexai.chat_models.ChatVertexAI.html](https://python.langchain.com/api_reference/google_vertexai/chat_models/langchain_google_vertexai.chat_models.ChatVertexAI.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/google_vertex_ai_palm.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Built-in tools](#built-in-tools)[Google search](#google-search)
- [Code execution](#code-execution)

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