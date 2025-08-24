Tool calling | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/tool_calling.mdx)Tool calling Prerequisites [Tools](/docs/concepts/tools/) [Chat Models](/docs/concepts/chat_models/) Overview[​](#overview) Many AI applications interact directly with humans. In these cases, it is appropriate for models to respond in natural language. But what about cases where we want a model to also interact directly with systems, such as databases or an API? These systems often have a particular input schema; for example, APIs frequently have a required payload structure. This need motivates the concept of tool calling. You can use [tool calling](https://platform.openai.com/docs/guides/function-calling/example-use-cases) to request model responses that match a particular schema. infoYou will sometimes hear the term function calling. We use this term interchangeably with tool calling. ![Conceptual overview of tool calling ](/assets/images/tool_calling_concept-552a73031228ff9144c7d59f26dedbbf.png) Key concepts[​](#key-concepts) Tool Creation:** Use the [@tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) decorator to create a [tool](/docs/concepts/tools/). A tool is an association between a function and its schema.**Tool Binding:** The tool needs to be connected to a model that supports tool calling. This gives the model awareness of the tool and the associated input schema required by the tool.**Tool Calling:** When appropriate, the model can decide to call a tool and ensure its response conforms to the tool&#x27;s input schema.**Tool Execution:** The tool can be executed using the arguments provided by the model.

![Conceptual parts of tool calling ](/assets/images/tool_calling_components-bef9d2bcb9d3706c2fe58b57bf8ccb60.png)

## Recommended usage[​](#recommended-usage)

This pseudocode illustrates the recommended workflow for using tool calling. Created tools are passed to `.bind_tools()` method as a list. This model can be called, as usual. If a tool call is made, model&#x27;s response will contain the tool call arguments. The tool call arguments can be passed directly to the tool.

```python
# Tool creation
tools = [my_tool]
# Tool binding
model_with_tools = model.bind_tools(tools)
# Tool calling
response = model_with_tools.invoke(user_input)

```**Tool creation[​](#tool-creation) The recommended way to create a tool is using the @tool decorator.

```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multiply a and b."""
    return a * b

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

Further reading - See our conceptual guide on [tools](/docs/concepts/tools/) for more details. - See our [model integrations](/docs/integrations/chat/) that support tool calling. - See our [how-to guide](/docs/how_to/tool_calling/) on tool calling. ## Tool binding[​](#tool-binding) [Many](https://platform.openai.com/docs/guides/function-calling) [model providers](https://platform.openai.com/docs/guides/function-calling) support tool calling.

tipSee our [model integration page](/docs/integrations/chat/) for a list of providers that support tool calling.

The central concept to understand is that LangChain provides a standardized interface for connecting tools to models. The `.bind_tools()` method can be used to specify which tools are available for a model to call.

```python
model_with_tools = model.bind_tools(tools_list)

```

As a specific example, let&#x27;s take a function `multiply` and bind it as a tool to a model that supports tool calling.

```python
def multiply(a: int, b: int) -> int:
    """Multiply a and b.

    Args:
        a: first int
        b: second int
    """
    return a * b

llm_with_tools = tool_calling_model.bind_tools([multiply])

```

## Tool calling[​](#tool-calling-1) ![Diagram of a tool call by a model ](/assets/images/tool_call_example-2348b869f9a5d0d2a45dfbe614c177a4.png)

A key principle of tool calling is that the model decides when to use a tool based on the input&#x27;s relevance. The model doesn&#x27;t always need to call a tool. For example, given an unrelated input, the model would not call the tool:

```python
result = llm_with_tools.invoke("Hello world!")

```

The result would be an `AIMessage` containing the model&#x27;s response in natural language (e.g., "Hello!"). However, if we pass an input *relevant to the tool*, the model should choose to call it:

```python
result = llm_with_tools.invoke("What is 2 multiplied by 3?")

```

As before, the output `result` will be an `AIMessage`. But, if the tool was called, `result` will have a `tool_calls` [attribute](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html#langchain_core.messages.ai.AIMessage.tool_calls). This attribute includes everything needed to execute the tool, including the tool name and input arguments:

```text
result.tool_calls
[{&#x27;name&#x27;: &#x27;multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 2, &#x27;b&#x27;: 3}, &#x27;id&#x27;: &#x27;xxx&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}]

```

For more details on usage, see our [how-to guides](/docs/how_to/#tools)!

## Tool execution[​](#tool-execution)

[Tools](/docs/concepts/tools/) implement the [Runnable](/docs/concepts/runnables/) interface, which means that they can be invoked (e.g., `tool.invoke(args)`) directly.

[LangGraph](https://langchain-ai.github.io/langgraph/) offers pre-built components (e.g., [ToolNode](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.tool_node.ToolNode)) that will often invoke the tool in behalf of the user.

Further reading - See our [how-to guide](/docs/how_to/tool_calling/) on tool calling. - See the [LangGraph documentation on using ToolNode](https://langchain-ai.github.io/langgraph/how-tos/tool-calling/). ## Forcing tool use[​](#forcing-tool-use) By default, the model has the freedom to choose which tool to use based on the user&#x27;s input. However, in certain scenarios, you might want to influence the model&#x27;s decision-making process. LangChain allows you to enforce tool choice (using `tool_choice`), ensuring the model uses either a particular tool or *any* tool from a given list. This is useful for structuring the model&#x27;s behavior and guiding it towards a desired outcome.

Further reading - See our [how-to guide](/docs/how_to/tool_choice/) on forcing tool use. ## Best practices[​](#best-practices) When designing [tools](/docs/concepts/tools/) to be used by a model, it is important to keep in mind that:

- Models that have explicit [tool-calling APIs](/docs/concepts/tool_calling/) will be better at tool calling than non-fine-tuned models.

- Models will perform better if the tools have well-chosen names and descriptions.

- Simple, narrowly scoped tools are easier for models to use than complex tools.

- Asking the model to select from a large list of tools poses challenges for the model.

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/tool_calling.mdx)

- [Overview](#overview)
- [Key concepts](#key-concepts)
- [Recommended usage](#recommended-usage)
- [Tool creation](#tool-creation)
- [Tool binding](#tool-binding)
- [Tool calling](#tool-calling-1)
- [Tool execution](#tool-execution)
- [Forcing tool use](#forcing-tool-use)
- [Best practices](#best-practices)

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