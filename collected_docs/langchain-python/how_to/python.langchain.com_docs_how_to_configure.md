How to configure runtime chain internals | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/configure.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/configure.ipynb)How to configure runtime chain internals PrerequisitesThis guide assumes familiarity with the following concepts: [The Runnable interface](/docs/concepts/runnables/) [Chaining runnables](/docs/how_to/sequence/) [Binding runtime arguments](/docs/how_to/binding/) Sometimes you may want to experiment with, or even expose to the end user, multiple different ways of doing things within your chains. This can include tweaking parameters such as temperature or even swapping out one model for another. In order to make this experience as easy as possible, we have defined two methods. A configurable_fields method. This lets you configure particular fields of a runnable. This is related to the [.bind](/docs/how_to/binding/) method on runnables, but allows you to specify parameters for a given step in a chain at runtime rather than specifying them beforehand. A configurable_alternatives method. With this method, you can list out alternatives for any particular runnable that can be set during runtime, and swap them for those specified alternatives. Configurable Fields[​](#configurable-fields) Let&#x27;s walk through an example that configures chat model fields like temperature at runtime:

```python
%pip install --upgrade --quiet langchain langchain-openai

import os
from getpass import getpass

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()

``` Configuring fields on a chat model[​](#configuring-fields-on-a-chat-model) If using [init_chat_model](/docs/how_to/chat_models_universal_init/) to create a chat model, you can specify configurable fields in the constructor:

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model(
    "openai:gpt-4o-mini",
    configurable_fields=("temperature",),
)

``` You can then set the parameter at runtime using .with_config:

```python
response = llm.with_config({"temperature": 0}).invoke("Hello")
print(response.content)

```

```output
Hello! How can I assist you today?

``` tipIn addition to invocation parameters like temperature, configuring fields this way extends to clients and other attributes. Use with tools[​](#use-with-tools) This method is applicable when [binding tools](/docs/concepts/tool_calling/) as well:

```python
from langchain_core.tools import tool

@tool
def get_weather(location: str):
    """Get the weather."""
    return "It&#x27;s sunny."

llm_with_tools = llm.bind_tools([get_weather])
response = llm_with_tools.with_config({"temperature": 0}).invoke(
    "What&#x27;s the weather in SF?"
)
response.tool_calls

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
[{&#x27;name&#x27;: &#x27;get_weather&#x27;,
  &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;San Francisco&#x27;},
  &#x27;id&#x27;: &#x27;call_B93EttzlGyYUhzbIIiMcl3bE&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;}]

```**In addition to .with_config, we can now include the parameter when passing a configuration directly. See example below, where we allow the underlying model temperature to be configurable inside of a [langgraph agent](/docs/tutorials/agents/):

```python
! pip install --upgrade langgraph

```

```python
from langgraph.prebuilt import create_react_agent

agent = create_react_agent(llm, [get_weather])

response = agent.invoke(
    {"messages": "What&#x27;s the weather in Boston?"},
    {"configurable": {"temperature": 0}},
)

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent) ### Configuring fields on arbitrary Runnables[​](#configuring-fields-on-arbitrary-runnables) You can also use the .configurable_fields method on arbitrary [Runnables](/docs/concepts/runnables/), as shown below:

```python
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import ConfigurableField
from langchain_openai import ChatOpenAI

model = ChatOpenAI(temperature=0).configurable_fields(
    temperature=ConfigurableField(
        id="llm_temperature",
        name="LLM Temperature",
        description="The temperature of the LLM",
    )
)

model.invoke("pick a random number")

```**API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html) | [ConfigurableField](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.utils.ConfigurableField.html)

```output
AIMessage(content=&#x27;17&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 1, &#x27;prompt_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 12}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-ba26a0da-0a69-4533-ab7f-21178a73d303-0&#x27;)

```**Above, we defined temperature as a [ConfigurableField](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.utils.ConfigurableField.html#langchain_core.runnables.utils.ConfigurableField) that we can set at runtime. To do so, we use the [with_config](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.with_config) method like this:

```python
model.with_config(configurable={"llm_temperature": 0.9}).invoke("pick a random number")

```

```output
AIMessage(content=&#x27;12&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 1, &#x27;prompt_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 12}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-ba8422ad-be77-4cb1-ac45-ad0aae74e3d9-0&#x27;)

``` Note that the passed llm_temperature entry in the dict has the same key as the id of the ConfigurableField. We can also do this to affect just one step that&#x27;s part of a chain:

```python
prompt = PromptTemplate.from_template("Pick a random number above {x}")
chain = prompt | model

chain.invoke({"x": 0})

```

```output
AIMessage(content=&#x27;27&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 1, &#x27;prompt_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 15}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-ecd4cadd-1b72-4f92-b9a0-15e08091f537-0&#x27;)

```

```python
chain.with_config(configurable={"llm_temperature": 0.9}).invoke({"x": 0})

```

```output
AIMessage(content=&#x27;35&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 1, &#x27;prompt_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 15}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-a916602b-3460-46d3-a4a8-7c926ec747c0-0&#x27;)

``` Configurable Alternatives[​](#configurable-alternatives) The configurable_alternatives() method allows us to swap out steps in a chain with an alternative. Below, we swap out one chat model for another:

```python
%pip install --upgrade --quiet langchain-anthropic

import os
from getpass import getpass

if "ANTHROPIC_API_KEY" not in os.environ:
    os.environ["ANTHROPIC_API_KEY"] = getpass()

```

```output
[33mWARNING: You are using pip version 22.0.4; however, version 24.0 is available.
You should consider upgrading via the &#x27;/Users/jacoblee/.pyenv/versions/3.10.5/bin/python -m pip install --upgrade pip&#x27; command.[0m[33m
[0mNote: you may need to restart the kernel to use updated packages.

```

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import ConfigurableField
from langchain_openai import ChatOpenAI

llm = ChatAnthropic(
    model="claude-3-haiku-20240307", temperature=0
).configurable_alternatives(
    # This gives this field an id
    # When configuring the end runnable, we can then use this id to configure this field
    ConfigurableField(id="llm"),
    # This sets a default_key.
    # If we specify this key, the default LLM (ChatAnthropic initialized above) will be used
    default_key="anthropic",
    # This adds a new option, with name `openai` that is equal to `ChatOpenAI()`
    openai=ChatOpenAI(),
    # This adds a new option, with name `gpt4` that is equal to `ChatOpenAI(model="gpt-4")`
    gpt4=ChatOpenAI(model="gpt-4"),
    # You can add more configuration options here
)
prompt = PromptTemplate.from_template("Tell me a joke about {topic}")
chain = prompt | llm

# By default it will call Anthropic
chain.invoke({"topic": "bears"})

```API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html) | [ConfigurableField](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.utils.ConfigurableField.html)

```output
AIMessage(content="Here&#x27;s a bear joke for you:\n\nWhy don&#x27;t bears wear socks? \nBecause they have bear feet!\n\nHow&#x27;s that? I tried to come up with a simple, silly pun-based joke about bears. Puns and wordplay are a common way to create humorous bear jokes. Let me know if you&#x27;d like to hear another one!", response_metadata={&#x27;id&#x27;: &#x27;msg_018edUHh5fUbWdiimhrC3dZD&#x27;, &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;input_tokens&#x27;: 13, &#x27;output_tokens&#x27;: 80}}, id=&#x27;run-775bc58c-28d7-4e6b-a268-48fa6661f02f-0&#x27;)

```

```python
# We can use `.with_config(configurable={"llm": "openai"})` to specify an llm to use
chain.with_config(configurable={"llm": "openai"}).invoke({"topic": "bears"})

```

```output
AIMessage(content="Why don&#x27;t bears like fast food?\n\nBecause they can&#x27;t catch it!", response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 15, &#x27;prompt_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 28}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-7bdaa992-19c9-4f0d-9a0c-1f326bc992d4-0&#x27;)

```

```python
# If we use the `default_key` then it uses the default
chain.with_config(configurable={"llm": "anthropic"}).invoke({"topic": "bears"})

```

```output
AIMessage(content="Here&#x27;s a bear joke for you:\n\nWhy don&#x27;t bears wear socks? \nBecause they have bear feet!\n\nHow&#x27;s that? I tried to come up with a simple, silly pun-based joke about bears. Puns and wordplay are a common way to create humorous bear jokes. Let me know if you&#x27;d like to hear another one!", response_metadata={&#x27;id&#x27;: &#x27;msg_01BZvbmnEPGBtcxRWETCHkct&#x27;, &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;input_tokens&#x27;: 13, &#x27;output_tokens&#x27;: 80}}, id=&#x27;run-59b6ee44-a1cd-41b8-a026-28ee67cdd718-0&#x27;)

``` ### With Prompts[​](#with-prompts) We can do a similar thing, but alternate between prompts

```python
llm = ChatAnthropic(model="claude-3-haiku-20240307", temperature=0)
prompt = PromptTemplate.from_template(
    "Tell me a joke about {topic}"
).configurable_alternatives(
    # This gives this field an id
    # When configuring the end runnable, we can then use this id to configure this field
    ConfigurableField(id="prompt"),
    # This sets a default_key.
    # If we specify this key, the default prompt (asking for a joke, as initialized above) will be used
    default_key="joke",
    # This adds a new option, with name `poem`
    poem=PromptTemplate.from_template("Write a short poem about {topic}"),
    # You can add more configuration options here
)
chain = prompt | llm

# By default it will write a joke
chain.invoke({"topic": "bears"})

```

```output
AIMessage(content="Here&#x27;s a bear joke for you:\n\nWhy don&#x27;t bears wear socks? \nBecause they have bear feet!", response_metadata={&#x27;id&#x27;: &#x27;msg_01DtM1cssjNFZYgeS3gMZ49H&#x27;, &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;input_tokens&#x27;: 13, &#x27;output_tokens&#x27;: 28}}, id=&#x27;run-8199af7d-ea31-443d-b064-483693f2e0a1-0&#x27;)

```

```python
# We can configure it write a poem
chain.with_config(configurable={"prompt": "poem"}).invoke({"topic": "bears"})

```

```output
AIMessage(content="Here is a short poem about bears:\n\nMajestic bears, strong and true,\nRoaming the forests, wild and free.\nPowerful paws, fur soft and brown,\nCommanding respect, nature&#x27;s crown.\n\nForaging for berries, fishing streams,\nProtecting their young, fierce and keen.\nMighty bears, a sight to behold,\nGuardians of the wilderness, untold.\n\nIn the wild they reign supreme,\nEmbodying nature&#x27;s grand theme.\nBears, a symbol of strength and grace,\nCaptivating all who see their face.", response_metadata={&#x27;id&#x27;: &#x27;msg_01Wck3qPxrjURtutvtodaJFn&#x27;, &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;usage&#x27;: {&#x27;input_tokens&#x27;: 13, &#x27;output_tokens&#x27;: 134}}, id=&#x27;run-69414a1e-51d7-4bec-a307-b34b7d61025e-0&#x27;)

``` ### With Prompts and LLMs[​](#with-prompts-and-llms) We can also have multiple things configurable! Here&#x27;s an example doing that with both prompts and LLMs.

```python
llm = ChatAnthropic(
    model="claude-3-haiku-20240307", temperature=0
).configurable_alternatives(
    # This gives this field an id
    # When configuring the end runnable, we can then use this id to configure this field
    ConfigurableField(id="llm"),
    # This sets a default_key.
    # If we specify this key, the default LLM (ChatAnthropic initialized above) will be used
    default_key="anthropic",
    # This adds a new option, with name `openai` that is equal to `ChatOpenAI()`
    openai=ChatOpenAI(),
    # This adds a new option, with name `gpt4` that is equal to `ChatOpenAI(model="gpt-4")`
    gpt4=ChatOpenAI(model="gpt-4"),
    # You can add more configuration options here
)
prompt = PromptTemplate.from_template(
    "Tell me a joke about {topic}"
).configurable_alternatives(
    # This gives this field an id
    # When configuring the end runnable, we can then use this id to configure this field
    ConfigurableField(id="prompt"),
    # This sets a default_key.
    # If we specify this key, the default prompt (asking for a joke, as initialized above) will be used
    default_key="joke",
    # This adds a new option, with name `poem`
    poem=PromptTemplate.from_template("Write a short poem about {topic}"),
    # You can add more configuration options here
)
chain = prompt | llm

# We can configure it write a poem with OpenAI
chain.with_config(configurable={"prompt": "poem", "llm": "openai"}).invoke(
    {"topic": "bears"}
)

```

```output
AIMessage(content="In the forest deep and wide,\nBears roam with grace and pride.\nWith fur as dark as night,\nThey rule the land with all their might.\n\nIn winter&#x27;s chill, they hibernate,\nIn spring they emerge, hungry and great.\nWith claws sharp and eyes so keen,\nThey hunt for food, fierce and lean.\n\nBut beneath their tough exterior,\nLies a gentle heart, warm and superior.\nThey love their cubs with all their might,\nProtecting them through day and night.\n\nSo let us admire these majestic creatures,\nIn awe of their strength and features.\nFor in the wild, they reign supreme,\nThe mighty bears, a timeless dream.", response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 133, &#x27;prompt_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 146}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-5eec0b96-d580-49fd-ac4e-e32a0803b49b-0&#x27;)

```

```python
# We can always just configure only one if we want
chain.with_config(configurable={"llm": "openai"}).invoke({"topic": "bears"})

```

```output
AIMessage(content="Why don&#x27;t bears wear shoes?\n\nBecause they have bear feet!", response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 13, &#x27;prompt_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 26}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-c1b14c9c-4988-49b8-9363-15bfd479973a-0&#x27;)

``` ### Saving configurations[​](#saving-configurations) We can also easily save configured chains as their own objects

```python
openai_joke = chain.with_config(configurable={"llm": "openai"})

openai_joke.invoke({"topic": "bears"})

```

```output
AIMessage(content="Why did the bear break up with his girlfriend? \nBecause he couldn&#x27;t bear the relationship anymore!", response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 20, &#x27;prompt_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 33}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-391ebd55-9137-458b-9a11-97acaff6a892-0&#x27;)

``` ## Next steps[​](#next-steps) You now know how to configure a chain&#x27;s internal steps at runtime. To learn more, see the other how-to guides on runnables in this section, including: Using [.bind()](/docs/how_to/binding/) as a simpler way to set a runnable&#x27;s runtime parameters

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/configure.ipynb)

- [Configurable Fields](#configurable-fields)[Configuring fields on a chat model](#configuring-fields-on-a-chat-model)
- [Configuring fields on arbitrary Runnables](#configuring-fields-on-arbitrary-runnables)

- [Configurable Alternatives](#configurable-alternatives)[With Prompts](#with-prompts)
- [With Prompts and LLMs](#with-prompts-and-llms)
- [Saving configurations](#saving-configurations)

- [Next steps](#next-steps)

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