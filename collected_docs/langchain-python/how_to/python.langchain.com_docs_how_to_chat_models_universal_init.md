How to init any model in one line | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/chat_models_universal_init.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/chat_models_universal_init.ipynb) # How to init any model in one line Many LLM applications let end users specify what model provider and model they want the application to be powered by. This requires writing some logic to initialize different [chat models](/docs/concepts/chat_models/) based on some user configuration. The init_chat_model() helper method makes it easy to initialize a number of different model integrations without having to worry about import paths and class names. Supported modelsSee the [init_chat_model()](https://python.langchain.com/api_reference/langchain/chat_models/langchain.chat_models.base.init_chat_model.html) API reference for a full list of supported integrations.Make sure you have the [integration packages](/docs/integrations/chat/) installed for any model providers you want to support. E.g. you should have langchain-openai installed to init an OpenAI model.

```python
%pip install -qU langchain langchain-openai langchain-anthropic langchain-google-genai

``` ## Basic usage[​](#basic-usage)

```python
from langchain.chat_models import init_chat_model

# Don&#x27;t forget to set your environment variables for the API keys of the respective providers!
# For example, you can set them in your terminal or in a .env file:
# export OPENAI_API_KEY="your_openai_api_key"

# Returns a langchain_openai.ChatOpenAI instance.
gpt_4o = init_chat_model("gpt-4o", model_provider="openai", temperature=0)
# Returns a langchain_anthropic.ChatAnthropic instance.
claude_opus = init_chat_model(
    "claude-3-opus-20240229", model_provider="anthropic", temperature=0
)
# Returns a langchain_google_vertexai.ChatVertexAI instance.
gemini_15 = init_chat_model(
    "gemini-2.5-pro", model_provider="google_genai", temperature=0
)

# Since all model integrations implement the ChatModel interface, you can use them in the same way.
print("GPT-4o: " + gpt_4o.invoke("what&#x27;s your name").content + "\n")
print("Claude Opus: " + claude_opus.invoke("what&#x27;s your name").content + "\n")
print("Gemini 2.5: " + gemini_15.invoke("what&#x27;s your name").content + "\n")

```

```output
GPT-4o: I’m called ChatGPT. How can I assist you today?

Claude Opus: My name is Claude. It&#x27;s nice to meet you!

Gemini 2.5: I do not have a name. I am a large language model, trained by Google.

``` ## Inferring model provider[​](#inferring-model-provider) For common and distinct model names init_chat_model() will attempt to infer the model provider. See the [API reference](https://python.langchain.com/api_reference/langchain/chat_models/langchain.chat_models.base.init_chat_model.html) for a full list of inference behavior. E.g. any model that starts with gpt-3... or gpt-4... will be inferred as using model provider openai.

```python
gpt_4o = init_chat_model("gpt-4o", temperature=0)
claude_opus = init_chat_model("claude-3-opus-20240229", temperature=0)
gemini_15 = init_chat_model("gemini-2.5-pro", temperature=0)

``` ## Creating a configurable model[​](#creating-a-configurable-model) You can also create a runtime-configurable model by specifying configurable_fields. If you don&#x27;t specify a model value, then "model" and "model_provider" be configurable by default.

```python
configurable_model = init_chat_model(temperature=0)

configurable_model.invoke(
    "what&#x27;s your name", config={"configurable": {"model": "gpt-4o"}}
)

```

```output
AIMessage(content=&#x27;I’m called ChatGPT. How can I assist you today?&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 13, &#x27;prompt_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 24, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_07871e2ad8&#x27;, &#x27;id&#x27;: &#x27;chatcmpl-BwCyyBpMqn96KED6zPhLm4k9SQMiQ&#x27;, &#x27;service_tier&#x27;: &#x27;default&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--fada10c3-4128-406c-b83d-a850d16b365f-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 11, &#x27;output_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 24, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})

```

```python
configurable_model.invoke(
    "what&#x27;s your name", config={"configurable": {"model": "claude-3-5-sonnet-latest"}}
)

```

```output
AIMessage(content="My name is Claude. It&#x27;s nice to meet you!", additional_kwargs={}, response_metadata={&#x27;id&#x27;: &#x27;msg_01VDGrG9D6yefanbBG9zPJrc&#x27;, &#x27;model&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0, &#x27;cache_read_input_tokens&#x27;: 0, &#x27;input_tokens&#x27;: 11, &#x27;output_tokens&#x27;: 15, &#x27;server_tool_use&#x27;: None, &#x27;service_tier&#x27;: &#x27;standard&#x27;}, &#x27;model_name&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;}, id=&#x27;run--f0156087-debf-4b4b-9aaa-f3328a81ef92-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 11, &#x27;output_tokens&#x27;: 15, &#x27;total_tokens&#x27;: 26, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 0}})

``` ### Configurable model with default values[​](#configurable-model-with-default-values) We can create a configurable model with default model values, specify which parameters are configurable, and add prefixes to configurable params:

```python
first_llm = init_chat_model(
    model="gpt-4o",
    temperature=0,
    configurable_fields=("model", "model_provider", "temperature", "max_tokens"),
    config_prefix="first",  # useful when you have a chain with multiple models
)

first_llm.invoke("what&#x27;s your name")

```

```output
AIMessage(content="I&#x27;m an AI created by OpenAI, and I don&#x27;t have a personal name. How can I assist you today?", additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 23, &#x27;prompt_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 34}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-05-13&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_25624ae3a5&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-3380f977-4b89-4f44-bc02-b64043b3166f-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 11, &#x27;output_tokens&#x27;: 23, &#x27;total_tokens&#x27;: 34})

```

```python
first_llm.invoke(
    "what&#x27;s your name",
    config={
        "configurable": {
            "first_model": "claude-3-5-sonnet-latest",
            "first_temperature": 0.5,
            "first_max_tokens": 100,
        }
    },
)

```

```output
AIMessage(content="My name is Claude. It&#x27;s nice to meet you!", additional_kwargs={}, response_metadata={&#x27;id&#x27;: &#x27;msg_01EFKSWpmsn2PSYPQa4cNHWb&#x27;, &#x27;model&#x27;: &#x27;claude-3-5-sonnet-20240620&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;input_tokens&#x27;: 11, &#x27;output_tokens&#x27;: 15}}, id=&#x27;run-3c58f47c-41b9-4e56-92e7-fb9602e3787c-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 11, &#x27;output_tokens&#x27;: 15, &#x27;total_tokens&#x27;: 26})

``` ### Using a configurable model declaratively[​](#using-a-configurable-model-declaratively) We can call declarative operations like bind_tools, with_structured_output, with_configurable, etc. on a configurable model and chain a configurable model in the same way that we would a regularly instantiated chat model object.

```python
from pydantic import BaseModel, Field

class GetWeather(BaseModel):
    """Get the current weather in a given location"""

    location: str = Field(..., description="The city and state, e.g. San Francisco, CA")

class GetPopulation(BaseModel):
    """Get the current population in a given location"""

    location: str = Field(..., description="The city and state, e.g. San Francisco, CA")

llm = init_chat_model(temperature=0)
llm_with_tools = llm.bind_tools([GetWeather, GetPopulation])

llm_with_tools.invoke(
    "what&#x27;s bigger in 2024 LA or NYC", config={"configurable": {"model": "gpt-4o"}}
).tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;GetPopulation&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;Los Angeles, CA&#x27;},
  &#x27;id&#x27;: &#x27;call_Ga9m8FAArIyEjItHmztPYA22&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;},
 {&#x27;name&#x27;: &#x27;GetPopulation&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;New York, NY&#x27;},
  &#x27;id&#x27;: &#x27;call_jh2dEvBaAHRaw5JUDthOs7rt&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;}]

```

```python
llm_with_tools.invoke(
    "what&#x27;s bigger in 2024 LA or NYC",
    config={"configurable": {"model": "claude-3-5-sonnet-latest"}},
).tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;GetPopulation&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;Los Angeles, CA&#x27;},
  &#x27;id&#x27;: &#x27;toolu_01JMufPf4F4t2zLj7miFeqXp&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;},
 {&#x27;name&#x27;: &#x27;GetPopulation&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;New York City, NY&#x27;},
  &#x27;id&#x27;: &#x27;toolu_01RQBHcE8kEEbYTuuS8WqY1u&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;}]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/chat_models_universal_init.ipynb)[Basic usage](#basic-usage)
- [Inferring model provider](#inferring-model-provider)
- [Creating a configurable model](#creating-a-configurable-model)[Configurable model with default values](#configurable-model-with-default-values)
- [Using a configurable model declaratively](#using-a-configurable-model-declaratively)

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