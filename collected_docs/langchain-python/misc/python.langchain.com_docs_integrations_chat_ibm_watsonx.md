ChatWatsonx | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/ibm_watsonx.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/ibm_watsonx.ipynb)ChatWatsonx ChatWatsonx is a wrapper for IBM [watsonx.ai](https://www.ibm.com/products/watsonx-ai) foundation models. The aim of these examples is to show how to communicate with watsonx.ai models using LangChain LLMs API. Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/ibm/)Package downloadsPackage latest[ChatWatsonx](https://python.langchain.com/api_reference/ibm/chat_models/langchain_ibm.chat_models.ChatWatsonx.html)[langchain-ibm](https://python.langchain.com/api_reference/ibm/index.html)❌❌✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain-ibm?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain-ibm?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON modeImage inputAudio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅✅❌❌✅❌✅✅ Setup[​](#setup) To access IBM watsonx.ai models you&#x27;ll need to create an IBM watsonx.ai account, get an API key, and install the langchain-ibm integration package. Credentials[​](#credentials) The cell below defines the credentials required to work with watsonx Foundation Model inferencing. Action:** Provide the IBM Cloud user API key. For details, see [Managing user API keys](https://cloud.ibm.com/docs/account?topic=account-userapikey&interface=ui).

```python
import os
from getpass import getpass

watsonx_api_key = getpass()
os.environ["WATSONX_APIKEY"] = watsonx_api_key

```**Additionally you are able to pass additional secrets as an environment variable.

```python
import os

os.environ["WATSONX_URL"] = "your service instance url"
os.environ["WATSONX_TOKEN"] = "your token for accessing the CPD cluster"
os.environ["WATSONX_PASSWORD"] = "your password for accessing the CPD cluster"
os.environ["WATSONX_USERNAME"] = "your username for accessing the CPD cluster"
os.environ["WATSONX_INSTANCE_ID"] = "your instance_id for accessing the CPD cluster"

``` Installation[​](#installation) The LangChain IBM integration lives in the langchain-ibm package:

```python
!pip install -qU langchain-ibm

``` Instantiation[​](#instantiation) You might need to adjust model parameters for different models or tasks. For details, refer to [Available TextChatParameters](https://ibm.github.io/watsonx-ai-python-sdk/fm_schema.html#ibm_watsonx_ai.foundation_models.schema.TextChatParameters).

```python
parameters = {
    "temperature": 0.9,
    "max_tokens": 200,
}

``` Initialize the WatsonxLLM class with the previously set parameters. Note**: To provide context for the API call, you must pass the project_id or space_id. To get your project or space ID, open your project or space, go to the **Manage** tab, and click **General**. For more information see: [Project documentation](https://www.ibm.com/docs/en/watsonx-as-a-service?topic=projects) or [Deployment space documentation](https://www.ibm.com/docs/en/watsonx/saas?topic=spaces-creating-deployment).

- Depending on the region of your provisioned service instance, use one of the urls listed in [watsonx.ai API Authentication](https://ibm.github.io/watsonx-ai-python-sdk/setup_cloud.html#authentication).

In this example, we’ll use the `project_id` and Dallas URL.

You need to specify the `model_id` that will be used for inferencing. You can find the list of all the available models in [Supported chat models](https://ibm.github.io/watsonx-ai-python-sdk/fm_helpers.html#ibm_watsonx_ai.foundation_models_manager.FoundationModelsManager.get_chat_model_specs).

```python
from langchain_ibm import ChatWatsonx

chat = ChatWatsonx(
    model_id="ibm/granite-34b-code-instruct",
    url="https://us-south.ml.cloud.ibm.com",
    project_id="PASTE YOUR PROJECT_ID HERE",
    params=parameters,
)

```**Alternatively, you can use Cloud Pak for Data credentials. For details, see [watsonx.ai software setup](https://ibm.github.io/watsonx-ai-python-sdk/setup_cpd.html).

```python
chat = ChatWatsonx(
    model_id="ibm/granite-34b-code-instruct",
    url="PASTE YOUR URL HERE",
    username="PASTE YOUR USERNAME HERE",
    password="PASTE YOUR PASSWORD HERE",
    instance_id="openshift",
    version="4.8",
    project_id="PASTE YOUR PROJECT_ID HERE",
    params=parameters,
)

``` Instead of model_id, you can also pass the deployment_id of the previously [deployed model with reference to a Prompt Template](https://cloud.ibm.com/apidocs/watsonx-ai#deployments-text-chat).

```python
chat = ChatWatsonx(
    deployment_id="PASTE YOUR DEPLOYMENT_ID HERE",
    url="https://us-south.ml.cloud.ibm.com",
    project_id="PASTE YOUR PROJECT_ID HERE",
    params=parameters,
)

``` For certain requirements, there is an option to pass the IBM&#x27;s [APIClient](https://ibm.github.io/watsonx-ai-python-sdk/base.html#apiclient) object into the ChatWatsonx class.

```python
from ibm_watsonx_ai import APIClient

api_client = APIClient(...)

chat = ChatWatsonx(
    model_id="ibm/granite-34b-code-instruct",
    watsonx_client=api_client,
)

``` Invocation[​](#invocation) To obtain completions, you can call the model directly using a string prompt.

```python
# Invocation

messages = [
    ("system", "You are a helpful assistant that translates English to French."),
    (
        "human",
        "I love you for listening to Rock.",
    ),
]

chat.invoke(messages)

```

```output
AIMessage(content="J&#x27;adore que tu escois de écouter de la rock ! ", additional_kwargs={}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 19, &#x27;prompt_tokens&#x27;: 34, &#x27;total_tokens&#x27;: 53}, &#x27;model_name&#x27;: &#x27;ibm/granite-34b-code-instruct&#x27;, &#x27;system_fingerprint&#x27;: &#x27;&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;}, id=&#x27;chat-ef888fc41f0d4b37903b622250ff7528&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 34, &#x27;output_tokens&#x27;: 19, &#x27;total_tokens&#x27;: 53})

```

```python
# Invocation multiple chat
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
)

system_message = SystemMessage(
    content="You are a helpful assistant which telling short-info about provided topic."
)
human_message = HumanMessage(content="horse")

chat.invoke([system_message, human_message])

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html)

```output
AIMessage(content=&#x27;horses are quadrupedal mammals that are members of the family Equidae. They are typically farm animals, competing in horse racing and other forms of equine competition. With over 200 breeds, horses are diverse in their physical appearance and behavior. They are intelligent, social animals that are often used for transportation, food, and entertainment.&#x27;, additional_kwargs={}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 89, &#x27;prompt_tokens&#x27;: 29, &#x27;total_tokens&#x27;: 118}, &#x27;model_name&#x27;: &#x27;ibm/granite-34b-code-instruct&#x27;, &#x27;system_fingerprint&#x27;: &#x27;&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;}, id=&#x27;chat-9a6e28abb3d448aaa4f83b677a9fd653&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 29, &#x27;output_tokens&#x27;: 89, &#x27;total_tokens&#x27;: 118})

```**Chaining[​](#chaining) Create ChatPromptTemplate objects which will be responsible for creating a random question.

```python
from langchain_core.prompts import ChatPromptTemplate

system = (
    "You are a helpful assistant that translates {input_language} to {output_language}."
)
human = "{input}"
prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

Provide a inputs and run the chain.

```python
chain = prompt | chat
chain.invoke(
    {
        "input_language": "English",
        "output_language": "German",
        "input": "I love Python",
    }
)

```

```output
AIMessage(content=&#x27;Ich liebe Python.&#x27;, additional_kwargs={}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 7, &#x27;prompt_tokens&#x27;: 28, &#x27;total_tokens&#x27;: 35}, &#x27;model_name&#x27;: &#x27;ibm/granite-34b-code-instruct&#x27;, &#x27;system_fingerprint&#x27;: &#x27;&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;}, id=&#x27;chat-fef871190b6047a7a3e68c58b3810c33&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 28, &#x27;output_tokens&#x27;: 7, &#x27;total_tokens&#x27;: 35})

``` ## Streaming the Model output[​](#streaming-the-model-output) You can stream the model output.

```python
system_message = SystemMessage(
    content="You are a helpful assistant which telling short-info about provided topic."
)
human_message = HumanMessage(content="moon")

for chunk in chat.stream([system_message, human_message]):
    print(chunk.content, end="")

```

```output
The Moon is the fifth largest moon in the solar system and the largest relative to its host planet. It is the fifth brightest object in Earth&#x27;s night sky after the Sun, the stars, the Milky Way, and the Moon itself. It orbits around the Earth at an average distance of 238,855 miles (384,400 kilometers). The Moon&#x27;s gravity is about one-sixthth of Earth&#x27;s and thus allows for the formation of tides on Earth. The Moon is thought to have formed around 4.5 billion years ago from debris from a collision between Earth and a Mars-sized body named Theia. The Moon is effectively immutable, with its current characteristics remaining from formation. Aside from Earth, the Moon is the only other natural satellite of Earth. The most widely accepted theory is that it formed from the debris of a collision

``` ## Batch the Model output[​](#batch-the-model-output) You can batch the model output.

```python
message_1 = [
    SystemMessage(
        content="You are a helpful assistant which telling short-info about provided topic."
    ),
    HumanMessage(content="cat"),
]
message_2 = [
    SystemMessage(
        content="You are a helpful assistant which telling short-info about provided topic."
    ),
    HumanMessage(content="dog"),
]

chat.batch([message_1, message_2])

```

```output
[AIMessage(content=&#x27;The cat is a popular domesticated carnivorous mammal that belongs to the family Felidae. Cats arefriendly, intelligent, and independent animals that are well-known for their playful behavior, agility, and ability to hunt prey. cats come in a wide range of breeds, each with their own unique physical and behavioral characteristics. They are kept as pets worldwide due to their affectionate nature and companionship. Cats are important members of the household and are often involved in everything from childcare to entertainment.&#x27;, additional_kwargs={}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 127, &#x27;prompt_tokens&#x27;: 28, &#x27;total_tokens&#x27;: 155}, &#x27;model_name&#x27;: &#x27;ibm/granite-34b-code-instruct&#x27;, &#x27;system_fingerprint&#x27;: &#x27;&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;}, id=&#x27;chat-fa452af0a0fa4a668b6a704aecd7d718&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 28, &#x27;output_tokens&#x27;: 127, &#x27;total_tokens&#x27;: 155}),
 AIMessage(content=&#x27;Dogs are domesticated animals that belong to the Canidae family, also known as wolves. They are one of the most popular pets worldwide, known for their loyalty and affection towards their owners. Dogs come in various breeds, each with unique characteristics, and are trained for different purposes such as hunting, herding, or guarding. They require a lot of exercise and mental stimulation to stay healthy and happy, and they need proper training and socialization to be well-behaved. Dogs are also known for their playful and energetic nature, making them great companions for people of all ages.&#x27;, additional_kwargs={}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 144, &#x27;prompt_tokens&#x27;: 28, &#x27;total_tokens&#x27;: 172}, &#x27;model_name&#x27;: &#x27;ibm/granite-34b-code-instruct&#x27;, &#x27;system_fingerprint&#x27;: &#x27;&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;}, id=&#x27;chat-cae7663c50cf4f3499726821cc2f0ec7&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 28, &#x27;output_tokens&#x27;: 144, &#x27;total_tokens&#x27;: 172})]

``` ## Tool calling[​](#tool-calling) ### ChatWatsonx.bind_tools()[​](#chatwatsonxbind_tools)

```python
from langchain_ibm import ChatWatsonx

chat = ChatWatsonx(
    model_id="mistralai/mistral-large",
    url="https://us-south.ml.cloud.ibm.com",
    project_id="PASTE YOUR PROJECT_ID HERE",
    params=parameters,
)

```

```python
from pydantic import BaseModel, Field

class GetWeather(BaseModel):
    """Get the current weather in a given location"""

    location: str = Field(..., description="The city and state, e.g. San Francisco, CA")

llm_with_tools = chat.bind_tools([GetWeather])

```

```python
ai_msg = llm_with_tools.invoke(
    "Which city is hotter today: LA or NY?",
)
ai_msg

```

```output
AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;chatcmpl-tool-6c06a19bbe824d78a322eb193dbde12d&#x27;, &#x27;type&#x27;: &#x27;function&#x27;, &#x27;function&#x27;: {&#x27;name&#x27;: &#x27;GetWeather&#x27;, &#x27;arguments&#x27;: &#x27;{"location": "Los Angeles, CA"}&#x27;}}, {&#x27;id&#x27;: &#x27;chatcmpl-tool-493542e46f1141bfbfeb5deae6c9e086&#x27;, &#x27;type&#x27;: &#x27;function&#x27;, &#x27;function&#x27;: {&#x27;name&#x27;: &#x27;GetWeather&#x27;, &#x27;arguments&#x27;: &#x27;{"location": "New York, NY"}&#x27;}}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 46, &#x27;prompt_tokens&#x27;: 95, &#x27;total_tokens&#x27;: 141}, &#x27;model_name&#x27;: &#x27;mistralai/mistral-large&#x27;, &#x27;system_fingerprint&#x27;: &#x27;&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;}, id=&#x27;chat-027f2bdb217e4238909cb26d3e8a8fbf&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;GetWeather&#x27;, &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;Los Angeles, CA&#x27;}, &#x27;id&#x27;: &#x27;chatcmpl-tool-6c06a19bbe824d78a322eb193dbde12d&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}, {&#x27;name&#x27;: &#x27;GetWeather&#x27;, &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;New York, NY&#x27;}, &#x27;id&#x27;: &#x27;chatcmpl-tool-493542e46f1141bfbfeb5deae6c9e086&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 95, &#x27;output_tokens&#x27;: 46, &#x27;total_tokens&#x27;: 141})

``` ### AIMessage.tool_calls[​](#aimessagetool_calls) Notice that the AIMessage has a `tool_calls` attribute. This contains in a standardized ToolCall format that is model-provider agnostic.

```python
ai_msg.tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;GetWeather&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;Los Angeles, CA&#x27;},
  &#x27;id&#x27;: &#x27;chatcmpl-tool-6c06a19bbe824d78a322eb193dbde12d&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;},
 {&#x27;name&#x27;: &#x27;GetWeather&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;New York, NY&#x27;},
  &#x27;id&#x27;: &#x27;chatcmpl-tool-493542e46f1141bfbfeb5deae6c9e086&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;}]

``` ## API reference[​](#api-reference) For detailed documentation of all `ChatWatsonx` features and configurations head to the [API reference](https://python.langchain.com/api_reference/ibm/chat_models/langchain_ibm.chat_models.ChatWatsonx.html).

## Related[​](#related)

- Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/ibm_watsonx.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Chaining](#chaining)
- [Streaming the Model output](#streaming-the-model-output)
- [Batch the Model output](#batch-the-model-output)
- [Tool calling](#tool-calling)[ChatWatsonx.bind_tools()](#chatwatsonxbind_tools)
- [AIMessage.tool_calls](#aimessagetool_calls)

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