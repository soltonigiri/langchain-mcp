How to add ad-hoc tool calling capability to LLMs and Chat Models | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_prompting.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_prompting.ipynb)How to add ad-hoc tool calling capability to LLMs and Chat Models cautionSome models have been fine-tuned for tool calling and provide a dedicated API for tool calling. Generally, such models are better at tool calling than non-fine-tuned models, and are recommended for use cases that require tool calling. Please see the [how to use a chat model to call tools](/docs/how_to/tool_calling/) guide for more information. PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Tools](/docs/concepts/tools/) [Function/tool calling](https://python.langchain.com/docs/concepts/tool_calling) [Chat models](/docs/concepts/chat_models/) [LLMs](/docs/concepts/text_llms/) In this guide, we&#x27;ll see how to add ad-hoc** tool calling support to a chat model. This is an alternative method to invoke tools if you&#x27;re using a model that does not natively support [tool calling](/docs/how_to/tool_calling/). We&#x27;ll do this by simply writing a prompt that will get the model to invoke the appropriate tools. Here&#x27;s a diagram of the logic: ![chain ](/assets/images/tool_chain-3571e7fbc481d648aff93a2630f812ab.svg) ## Setup[​](#setup) We&#x27;ll need to install the following packages:

```python
%pip install --upgrade --quiet langchain langchain-community

```**If you&#x27;d like to use LangSmith, uncomment the below:

```python
import getpass
import os
# os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` You can select any of the given models for this how-to guide. Keep in mind that most of these models already [support native tool calling](/docs/integrations/chat/), so using the prompting strategy shown here doesn&#x27;t make sense for these models, and instead you should follow the [how to use a chat model to call tools](/docs/how_to/tool_calling/) guide. Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

``` To illustrate the idea, we&#x27;ll use phi3 via Ollama, which does NOT** have native support for tool calling. If you&#x27;d like to use Ollama as well follow [these instructions](/docs/integrations/chat/ollama/).

```python
from langchain_community.llms import Ollama

model = Ollama(model="phi3")

```**Create a tool[​](#create-a-tool) First, let&#x27;s create an add and multiply tools. For more information on creating custom tools, please see [this guide](/docs/how_to/custom_tools/).

```python
from langchain_core.tools import tool

@tool
def multiply(x: float, y: float) -> float:
    """Multiply two numbers together."""
    return x * y

@tool
def add(x: int, y: int) -> int:
    "Add two numbers."
    return x + y

tools = [multiply, add]

# Let&#x27;s inspect the tools
for t in tools:
    print("--")
    print(t.name)
    print(t.description)
    print(t.args)

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
--
multiply
Multiply two numbers together.
{&#x27;x&#x27;: {&#x27;title&#x27;: &#x27;X&#x27;, &#x27;type&#x27;: &#x27;number&#x27;}, &#x27;y&#x27;: {&#x27;title&#x27;: &#x27;Y&#x27;, &#x27;type&#x27;: &#x27;number&#x27;}}
--
add
Add two numbers.
{&#x27;x&#x27;: {&#x27;title&#x27;: &#x27;X&#x27;, &#x27;type&#x27;: &#x27;integer&#x27;}, &#x27;y&#x27;: {&#x27;title&#x27;: &#x27;Y&#x27;, &#x27;type&#x27;: &#x27;integer&#x27;}}

```**

```python
multiply.invoke({"x": 4, "y": 5})

```

```output
20.0

``` Creating our prompt[​](#creating-our-prompt) We&#x27;ll want to write a prompt that specifies the tools the model has access to, the arguments to those tools, and the desired output format of the model. In this case we&#x27;ll instruct it to output a JSON blob of the form {"name": "...", "arguments": {...}}.

```python
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import render_text_description

rendered_tools = render_text_description(tools)
print(rendered_tools)

```API Reference:**[JsonOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.json.JsonOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [render_text_description](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.render.render_text_description.html)

```output
multiply(x: float, y: float) -> float - Multiply two numbers together.
add(x: int, y: int) -> int - Add two numbers.

```**

```python
system_prompt = f"""\
You are an assistant that has access to the following set of tools.
Here are the names and descriptions for each tool:

{rendered_tools}

Given the user input, return the name and input of the tool to use.
Return your response as a JSON blob with &#x27;name&#x27; and &#x27;arguments&#x27; keys.

The `arguments` should be a dictionary, with keys corresponding
to the argument names and the values corresponding to the requested values.
"""

prompt = ChatPromptTemplate.from_messages(
    [("system", system_prompt), ("user", "{input}")]
)

```

```python
chain = prompt | model
message = chain.invoke({"input": "what&#x27;s 3 plus 1132"})

# Let&#x27;s take a look at the output from the model
# if the model is an LLM (not a chat model), the output will be a string.
if isinstance(message, str):
    print(message)
else:  # Otherwise it&#x27;s a chat model
    print(message.content)

```

```output
{
    "name": "add",
    "arguments": {
        "x": 3,
        "y": 1132
    }
}

``` Adding an output parser[​](#adding-an-output-parser) We&#x27;ll use the JsonOutputParser for parsing our models output to JSON.

```python
from langchain_core.output_parsers import JsonOutputParser

chain = prompt | model | JsonOutputParser()
chain.invoke({"input": "what&#x27;s thirteen times 4"})

```API Reference:**[JsonOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.json.JsonOutputParser.html)

```output
{&#x27;name&#x27;: &#x27;multiply&#x27;, &#x27;arguments&#x27;: {&#x27;x&#x27;: 13.0, &#x27;y&#x27;: 4.0}}

```**important🎉 Amazing! 🎉 We now instructed our model on how to request** that a tool be invoked.Now, let&#x27;s create some logic to actually run the tool! ## Invoking the tool 🏃[​](#invoking-the-tool-) Now that the model can request that a tool be invoked, we need to write a function that can actually invoke the tool. The function will select the appropriate tool by name, and pass to it the arguments chosen by the model.

```python
from typing import Any, Dict, Optional, TypedDict

from langchain_core.runnables import RunnableConfig

class ToolCallRequest(TypedDict):
    """A typed dict that shows the inputs into the invoke_tool function."""

    name: str
    arguments: Dict[str, Any]

def invoke_tool(
    tool_call_request: ToolCallRequest, config: Optional[RunnableConfig] = None
):
    """A function that we can use the perform a tool invocation.

    Args:
        tool_call_request: a dict that contains the keys name and arguments.
            The name must match the name of a tool that exists.
            The arguments are the arguments to that tool.
        config: This is configuration information that LangChain uses that contains
            things like callbacks, metadata, etc.See LCEL documentation about RunnableConfig.

    Returns:
        output from the requested tool
    """
    tool_name_to_tool = {tool.name: tool for tool in tools}
    name = tool_call_request["name"]
    requested_tool = tool_name_to_tool[name]
    return requested_tool.invoke(tool_call_request["arguments"], config=config)

```**API Reference:**[RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html) Let&#x27;s test this out 🧪!

```python
invoke_tool({"name": "multiply", "arguments": {"x": 3, "y": 5}})

```**

```output
15.0

``` Let&#x27;s put it together[​](#lets-put-it-together) Let&#x27;s put it together into a chain that creates a calculator with add and multiplication capabilities.

```python
chain = prompt | model | JsonOutputParser() | invoke_tool
chain.invoke({"input": "what&#x27;s thirteen times 4.14137281"})

```

```output
53.83784653

``` Returning tool inputs[​](#returning-tool-inputs) It can be helpful to return not only tool outputs but also tool inputs. We can easily do this with LCEL by RunnablePassthrough.assign-ing the tool output. This will take whatever the input is to the RunnablePassrthrough components (assumed to be a dictionary) and add a key to it while still passing through everything that&#x27;s currently in the input:

```python
from langchain_core.runnables import RunnablePassthrough

chain = (
    prompt | model | JsonOutputParser() | RunnablePassthrough.assign(output=invoke_tool)
)
chain.invoke({"input": "what&#x27;s thirteen times 4.14137281"})

```API Reference:**[RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
{&#x27;name&#x27;: &#x27;multiply&#x27;,
 &#x27;arguments&#x27;: {&#x27;x&#x27;: 13, &#x27;y&#x27;: 4.14137281},
 &#x27;output&#x27;: 53.83784653}

``` ## What&#x27;s next?[​](#whats-next) This how-to guide shows the "happy path" when the model correctly outputs all the required tool information. In reality, if you&#x27;re using more complex tools, you will start encountering errors from the model, especially for models that have not been fine tuned for tool calling and for less capable models. You will need to be prepared to add strategies to improve the output from the model; e.g., Provide few shot examples.

- Add error handling (e.g., catch the exception and feed it back to the LLM to ask it to correct its previous output).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tools_prompting.ipynb)

- [Setup](#setup)
- [Create a tool](#create-a-tool)
- [Creating our prompt](#creating-our-prompt)
- [Adding an output parser](#adding-an-output-parser)
- [Invoking the tool 🏃](#invoking-the-tool-)
- [Let's put it together](#lets-put-it-together)
- [Returning tool inputs](#returning-tool-inputs)
- [What's next?](#whats-next)

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