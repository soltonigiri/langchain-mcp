How to use chat models to call tools | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_calling.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_calling.ipynb)How to use chat models to call tools PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) [Tool calling](/docs/concepts/tool_calling/) [Tools](/docs/concepts/tools/) [Output parsers](/docs/concepts/output_parsers/) [Tool calling](/docs/concepts/tool_calling/) allows a chat model to respond to a given prompt by "calling a tool". Remember, while the name "tool calling" implies that the model is directly performing some action, this is actually not the case! The model only generates the arguments to a tool, and actually running the tool (or not) is up to the user. Tool calling is a general technique that generates structured output from a model, and you can use it even when you don&#x27;t intend to invoke any tools. An example use-case of that is [extraction from unstructured text](/docs/tutorials/extraction/). ![Diagram of calling a tool ](/assets/images/tool_call-8d4a8b18e90cacd03f62e94071eceace.png) If you want to see how to use the model-generated tool call to actually run a tool [check out this guide](/docs/how_to/tool_results_pass_to_model/). Supported modelsTool calling is not universal, but is supported by many popular LLM providers. You can find a [list of all models that support tool calling here](/docs/integrations/chat/). LangChain implements standard interfaces for defining tools, passing them to LLMs, and representing tool calls. This guide will cover how to bind tools to an LLM, then invoke the LLM to generate these arguments. Defining tool schemas[​](#defining-tool-schemas) For a model to be able to call tools, we need to pass in tool schemas that describe what the tool does and what it&#x27;s arguments are. Chat models that support tool calling features implement a .bind_tools() method for passing tool schemas to the model. Tool schemas can be passed in as Python functions (with typehints and docstrings), Pydantic models, TypedDict classes, or LangChain [Tool objects](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.base.BaseTool.html#basetool). Subsequent invocations of the model will pass in these tool schemas along with the prompt. Python functions[​](#python-functions) Our tool schemas can be Python functions:

```python
# The function name, type hints, and docstring are all part of the tool
# schema that&#x27;s passed to the model. Defining good, descriptive schemas
# is an extension of prompt engineering and is an important part of
# getting models to perform well.
def add(a: int, b: int) -> int:
    """Add two integers.

    Args:
        a: First integer
        b: Second integer
    """
    return a + b

def multiply(a: int, b: int) -> int:
    """Multiply two integers.

    Args:
        a: First integer
        b: Second integer
    """
    return a * b

``` LangChain Tool[​](#langchain-tool) LangChain also implements a @tool decorator that allows for further control of the tool schema, such as tool names and argument descriptions. See the how-to guide [here](/docs/how_to/custom_tools/#creating-tools-from-functions) for details. Pydantic class[​](#pydantic-class) You can equivalently define the schemas without the accompanying functions using [Pydantic](https://docs.pydantic.dev). Note that all fields are required unless provided a default value.

```python
from pydantic import BaseModel, Field

class add(BaseModel):
    """Add two integers."""

    a: int = Field(..., description="First integer")
    b: int = Field(..., description="Second integer")

class multiply(BaseModel):
    """Multiply two integers."""

    a: int = Field(..., description="First integer")
    b: int = Field(..., description="Second integer")

``` TypedDict class[​](#typeddict-class) Requires langchain-core>=0.2.25 Or using TypedDicts and annotations:

```python
from typing_extensions import Annotated, TypedDict

class add(TypedDict):
    """Add two integers."""

    # Annotations must have the type and can optionally include a default value and description (in that order).
    a: Annotated[int, ..., "First integer"]
    b: Annotated[int, ..., "Second integer"]

class multiply(TypedDict):
    """Multiply two integers."""

    a: Annotated[int, ..., "First integer"]
    b: Annotated[int, ..., "Second integer"]

tools = [add, multiply]

``` To actually bind those schemas to a chat model, we&#x27;ll use the .bind_tools() method. This handles converting the add and multiply schemas to the proper format for the model. The tool schema will then be passed it in each time the model is invoked. Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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
llm_with_tools = llm.bind_tools(tools)

query = "What is 3 * 12?"

llm_with_tools.invoke(query)

```

```output
AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_iXj4DiW1p7WLjTAQMRO0jxMs&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"a":3,"b":12}&#x27;, &#x27;name&#x27;: &#x27;multiply&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 17, &#x27;prompt_tokens&#x27;: 80, &#x27;total_tokens&#x27;: 97}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_483d39d857&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-0b620986-3f62-4df7-9ba3-4595089f9ad4-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_iXj4DiW1p7WLjTAQMRO0jxMs&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 80, &#x27;output_tokens&#x27;: 17, &#x27;total_tokens&#x27;: 97})

``` As we can see our LLM generated arguments to a tool! You can look at the docs for [bind_tools()](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.BaseChatOpenAI.html#langchain_openai.chat_models.base.BaseChatOpenAI.bind_tools) to learn about all the ways to customize how your LLM selects tools, as well as [this guide on how to force the LLM to call a tool](/docs/how_to/tool_choice/) rather than letting it decide. Tool calls[​](#tool-calls) If tool calls are included in a LLM response, they are attached to the corresponding [message](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html#langchain_core.messages.ai.AIMessage) or [message chunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessageChunk.html#langchain_core.messages.ai.AIMessageChunk) as a list of [tool call](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolCall.html#langchain_core.messages.tool.ToolCall) objects in the .tool_calls attribute. Note that chat models can call multiple tools at once. A ToolCall is a typed dict that includes a tool name, dict of argument values, and (optionally) an identifier. Messages with no tool calls default to an empty list for this attribute.

```python
query = "What is 3 * 12? Also, what is 11 + 49?"

llm_with_tools.invoke(query).tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;multiply&#x27;,
  &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12},
  &#x27;id&#x27;: &#x27;call_1fyhJAbJHuKQe6n0PacubGsL&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;},
 {&#x27;name&#x27;: &#x27;add&#x27;,
  &#x27;args&#x27;: {&#x27;a&#x27;: 11, &#x27;b&#x27;: 49},
  &#x27;id&#x27;: &#x27;call_fc2jVkKzwuPWyU7kS9qn1hyG&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;}]

``` The .tool_calls attribute should contain valid tool calls. Note that on occasion, model providers may output malformed tool calls (e.g., arguments that are not valid JSON). When parsing fails in these cases, instances of [InvalidToolCall](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.InvalidToolCall.html#langchain_core.messages.tool.InvalidToolCall) are populated in the .invalid_tool_calls attribute. An InvalidToolCall can have a name, string arguments, identifier, and error message. Parsing[​](#parsing) If desired, [output parsers](/docs/how_to/#output-parsers) can further process the output. For example, we can convert existing values populated on the .tool_calls to Pydantic objects using the [PydanticToolsParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.openai_tools.PydanticToolsParser.html):

```python
from langchain_core.output_parsers import PydanticToolsParser
from pydantic import BaseModel, Field

class add(BaseModel):
    """Add two integers."""

    a: int = Field(..., description="First integer")
    b: int = Field(..., description="Second integer")

class multiply(BaseModel):
    """Multiply two integers."""

    a: int = Field(..., description="First integer")
    b: int = Field(..., description="Second integer")

chain = llm_with_tools | PydanticToolsParser(tools=[add, multiply])
chain.invoke(query)

```API Reference:**[PydanticToolsParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.openai_tools.PydanticToolsParser.html)

```output
[multiply(a=3, b=12), add(a=11, b=49)]

``` ## Next steps[​](#next-steps) Now you&#x27;ve learned how to bind tool schemas to a chat model and have the model call the tool. Next, check out this guide on actually using the tool by invoking the function and passing the results back to the model: Pass [tool results back to model](/docs/how_to/tool_results_pass_to_model/)

You can also check out some more specific uses of tool calling:

- Getting [structured outputs](/docs/how_to/structured_output/) from models

- Few shot prompting [with tools](/docs/how_to/tools_few_shot/)

- Stream [tool calls](/docs/how_to/tool_streaming/)

- Pass [runtime values to tools](/docs/how_to/tool_runtime/)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tool_calling.ipynb)

- [Defining tool schemas](#defining-tool-schemas)[Python functions](#python-functions)
- [LangChain Tool](#langchain-tool)
- [Pydantic class](#pydantic-class)
- [TypedDict class](#typeddict-class)

- [Tool calls](#tool-calls)
- [Parsing](#parsing)
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