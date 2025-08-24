- Overview **[Skip to content](#tools) Initializing search [GitHub](https://github.com/langchain-ai/langgraph) LangGraph APIs Core capabilities [Call tools](../../how-tos/tool-calling/) [Human-in-the-loop](../human_in_the_loop/) [Time travel](../time-travel/) [Subgraphs](../subgraphs/) [Multi-agent](../multi_agent/) [MCP](../mcp/) [Tracing](../tracing/) [Reference](../../reference/) [Examples](../../examples/) [Additional resources](../../additional-resources/) [](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/concepts/tools.md) Tools[¶](#tools) Many AI applications interact with users via natural language. However, some use cases require models to interface directly with external systems—such as APIs, databases, or file systems—using structured input. In these scenarios, [tool calling](../../how-tos/tool-calling/) enables models to generate requests that conform to a specified input schema. Tools** encapsulate a callable function and its input schema. These can be passed to compatible [chat models](https://python.langchain.com/docs/concepts/chat_models), allowing the model to decide whether to invoke a tool and with what arguments. ## Tool calling[¶](#tool-calling) ![Diagram of a tool call by a model ](../img/tool_call.png) Tool calling is typically **conditional**. Based on the user input and available tools, the model may choose to issue a tool call request. This request is returned in an AIMessage object, which includes a tool_calls field that specifies the tool name and input arguments:

```
llm_with_tools.invoke("What is 2 multiplied by 3?")
# -> AIMessage(tool_calls=[{'name': 'multiply', 'args': {'a': 2, 'b': 3}, ...}])

```

```
AIMessage(
  tool_calls=[
    ToolCall(name="multiply", args={"a": 2, "b": 3}),
    ...
  ]
)

``` If the input is unrelated to any tool, the model returns only a natural language message:

```
llm_with_tools.invoke("Hello world!")  # -> AIMessage(content="Hello!")

``` Importantly, the model does not execute the tool—it only generates a request. A separate executor (such as a runtime or agent) is responsible for handling the tool call and returning the result. See the [tool calling guide](../../how-tos/tool-calling/) for more details. ## Prebuilt tools[¶](#prebuilt-tools) LangChain provides prebuilt tool integrations for common external systems including APIs, databases, file systems, and web data. Browse the [integrations directory](https://python.langchain.com/docs/integrations/tools/) for available tools. Common categories: **Search**: Bing, SerpAPI, Tavily

- **Code execution**: Python REPL, Node.js REPL

- **Databases**: SQL, MongoDB, Redis

- **Web data**: Scraping and browsing

- **APIs**: OpenWeatherMap, NewsAPI, etc.

## Custom tools[¶](#custom-tools)

You can define custom tools using the `@tool` decorator or plain Python functions. For example:

*API Reference: [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)*

```
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b

```

See the [tool calling guide](../../how-tos/tool-calling/) for more details.

## Tool execution[¶](#tool-execution)

While the model determines when to call a tool, execution of the tool call must be handled by a runtime component.

LangGraph provides prebuilt components for this:

- [ToolNode](https://langchain-ai.github.io/langgraph/reference/agents/#langgraph.prebuilt.tool_node.ToolNode): A prebuilt node that executes tools.

- [create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent): Constructs a full agent that manages tool calling automatically.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)