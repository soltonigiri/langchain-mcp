How to pass tool outputs to chat models | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_results_pass_to_model.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_results_pass_to_model.ipynb)How to pass tool outputs to chat models PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Tools](/docs/concepts/tools/) [Function/tool calling](/docs/concepts/tool_calling/) [Using chat models to call tools](/docs/how_to/tool_calling/) [Defining custom tools](/docs/how_to/custom_tools/) Some models are capable of [tool calling](/docs/concepts/tool_calling/) - generating arguments that conform to a specific user-provided schema. This guide will demonstrate how to use those tool calls to actually call a function and properly pass the results back to the model. ![Diagram of a tool call invocation ](/assets/images/tool_invocation-7f277888701ee431a17607f1a035c080.png) ![Diagram of a tool call result ](/assets/images/tool_results-71b4b90f33a56563c102d91e7821a993.png) First, let&#x27;s define our tools and our model: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

```

```python
from langchain_core.tools import tool

@tool
def add(a: int, b: int) -> int:
    """Adds a and b."""
    return a + b

@tool
def multiply(a: int, b: int) -> int:
    """Multiplies a and b."""
    return a * b

tools = [add, multiply]

llm_with_tools = llm.bind_tools(tools)

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) Now, let&#x27;s get the model to call a tool. We&#x27;ll add it to a list of messages that we&#x27;ll treat as conversation history:

```python
from langchain_core.messages import HumanMessage

query = "What is 3 * 12? Also, what is 11 + 49?"

messages = [HumanMessage(query)]

ai_msg = llm_with_tools.invoke(messages)

print(ai_msg.tool_calls)

messages.append(ai_msg)

```**API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```output
[{&#x27;name&#x27;: &#x27;multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_GPGPE943GORirhIAYnWv00rK&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}, {&#x27;name&#x27;: &#x27;add&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 11, &#x27;b&#x27;: 49}, &#x27;id&#x27;: &#x27;call_dm8o64ZrY3WFZHAvCh1bEJ6i&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}]

``` Next let&#x27;s invoke the tool functions using the args the model populated! Conveniently, if we invoke a LangChain Tool with a ToolCall, we&#x27;ll automatically get back a ToolMessage that can be fed back to the model: CompatibilityThis functionality was added in langchain-core == 0.2.19. Please make sure your package is up to date.If you are on earlier versions of langchain-core, you will need to extract the args field from the tool and construct a ToolMessage manually.

```python
for tool_call in ai_msg.tool_calls:
    selected_tool = {"add": add, "multiply": multiply}[tool_call["name"].lower()]
    tool_msg = selected_tool.invoke(tool_call)
    messages.append(tool_msg)

messages

```

```output
[HumanMessage(content=&#x27;What is 3 * 12? Also, what is 11 + 49?&#x27;),
 AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_loT2pliJwJe3p7nkgXYF48A1&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"a": 3, "b": 12}&#x27;, &#x27;name&#x27;: &#x27;multiply&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}, {&#x27;id&#x27;: &#x27;call_bG9tYZCXOeYDZf3W46TceoV4&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"a": 11, "b": 49}&#x27;, &#x27;name&#x27;: &#x27;add&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 50, &#x27;prompt_tokens&#x27;: 87, &#x27;total_tokens&#x27;: 137}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_661538dc1f&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-e3db3c46-bf9e-478e-abc1-dc9a264f4afe-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_loT2pliJwJe3p7nkgXYF48A1&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}, {&#x27;name&#x27;: &#x27;add&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 11, &#x27;b&#x27;: 49}, &#x27;id&#x27;: &#x27;call_bG9tYZCXOeYDZf3W46TceoV4&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 87, &#x27;output_tokens&#x27;: 50, &#x27;total_tokens&#x27;: 137}),
 ToolMessage(content=&#x27;36&#x27;, name=&#x27;multiply&#x27;, tool_call_id=&#x27;call_loT2pliJwJe3p7nkgXYF48A1&#x27;),
 ToolMessage(content=&#x27;60&#x27;, name=&#x27;add&#x27;, tool_call_id=&#x27;call_bG9tYZCXOeYDZf3W46TceoV4&#x27;)]

``` And finally, we&#x27;ll invoke the model with the tool results. The model will use this information to generate a final answer to our original query:

```python
llm_with_tools.invoke(messages)

```

```output
AIMessage(content=&#x27;The result of \\(3 \\times 12\\) is 36, and the result of \\(11 + 49\\) is 60.&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 31, &#x27;prompt_tokens&#x27;: 153, &#x27;total_tokens&#x27;: 184}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_661538dc1f&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-87d1ef0a-1223-4bb3-9310-7b591789323d-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 153, &#x27;output_tokens&#x27;: 31, &#x27;total_tokens&#x27;: 184})

``` Note that each ToolMessage must include a tool_call_id that matches an id in the original tool calls that the model generates. This helps the model match tool responses with tool calls. Tool calling agents, like those in [LangGraph](https://langchain-ai.github.io/langgraph/tutorials/introduction/), use this basic flow to answer queries and solve tasks. ## Related[​](#related) [LangGraph quickstart](https://langchain-ai.github.io/langgraph/tutorials/introduction/)

- Few shot prompting [with tools](/docs/how_to/tools_few_shot/)

- Stream [tool calls](/docs/how_to/tool_streaming/)

- Pass [runtime values to tools](/docs/how_to/tool_runtime/)

- Getting [structured outputs](/docs/how_to/structured_output/) from models

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tool_results_pass_to_model.ipynb)

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