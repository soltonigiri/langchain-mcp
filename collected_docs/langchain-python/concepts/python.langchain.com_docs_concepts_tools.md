Tools | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/tools.mdx)Tools Prerequisites [Chat models](/docs/concepts/chat_models/) Overview[​](#overview) The tool** abstraction in LangChain associates a Python **function** with a **schema** that defines the function&#x27;s **name**, **description** and **expected arguments**. **Tools** can be passed to [chat models](/docs/concepts/chat_models/) that support [tool calling](/docs/concepts/tool_calling/) allowing the model to request the execution of a specific function with specific inputs. ## Key concepts[​](#key-concepts) Tools are a way to encapsulate a function and its schema in a way that can be passed to a chat model.

- Create tools using the [@tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) decorator, which simplifies the process of tool creation, supporting the following: Automatically infer the tool&#x27;s **name**, **description** and **expected arguments**, while also supporting customization.

- Defining tools that return **artifacts** (e.g. images, dataframes, etc.)

- Hiding input arguments from the schema (and hence from the model) using **injected tool arguments**.

## Tool interface[​](#tool-interface)

The tool interface is defined in the [BaseTool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.base.BaseTool.html#langchain_core.tools.base.BaseTool) class which is a subclass of the [Runnable Interface](/docs/concepts/runnables/).

The key attributes that correspond to the tool&#x27;s **schema**:

- **name**: The name of the tool.

- **description**: A description of what the tool does.

- **args**: Property that returns the JSON schema for the tool&#x27;s arguments.

The key methods to execute the function associated with the **tool**:

- **invoke**: Invokes the tool with the given arguments.

- **ainvoke**: Invokes the tool with the given arguments, asynchronously. Used for [async programming with LangChain](/docs/concepts/async/).

## Create tools using the @tool decorator[​](#create-tools-using-the-tool-decorator)

The recommended way to create tools is using the [@tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) decorator. This decorator is designed to simplify the process of tool creation and should be used in most cases. After defining a function, you can decorate it with [@tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) to create a tool that implements the [Tool Interface](#tool-interface).

```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
   """Multiply two numbers."""
   return a * b

```**API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

For more details on how to create tools, see the [how to create custom tools](/docs/how_to/custom_tools/) guide.

noteLangChain has a few other ways to create tools; e.g., by sub-classing the [BaseTool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.base.BaseTool.html#langchain_core.tools.base.BaseTool) class or by using `StructuredTool`. These methods are shown in the [how to create custom tools guide](/docs/how_to/custom_tools/), but we generally recommend using the `@tool` decorator for most cases.

## Use the tool directly[​](#use-the-tool-directly)

Once you have defined a tool, you can use it directly by calling the function. For example, to use the `multiply` tool defined above:

```python
multiply.invoke({"a": 2, "b": 3})

```**Inspect[​](#inspect) You can also inspect the tool&#x27;s schema and other properties:

```python
print(multiply.name) # multiply
print(multiply.description) # Multiply two numbers.
print(multiply.args)
# {
# &#x27;type&#x27;: &#x27;object&#x27;,
# &#x27;properties&#x27;: {&#x27;a&#x27;: {&#x27;type&#x27;: &#x27;integer&#x27;}, &#x27;b&#x27;: {&#x27;type&#x27;: &#x27;integer&#x27;}},
# &#x27;required&#x27;: [&#x27;a&#x27;, &#x27;b&#x27;]
# }

``` noteIf you&#x27;re using pre-built LangChain or LangGraph components like [create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent),you might not need to interact with tools directly. However, understanding how to use them can be valuable for debugging and testing. Additionally, when building custom LangGraph workflows, you may find it necessary to work with tools directly. Configuring the schema[​](#configuring-the-schema) The @tool decorator offers additional options to configure the schema of the tool (e.g., modify name, description or parse the function&#x27;s doc-string to infer the schema). Please see the [API reference for @tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) for more details and review the [how to create custom tools](/docs/how_to/custom_tools/) guide for examples. Tool artifacts[​](#tool-artifacts) Tools** are utilities that can be called by a model, and whose outputs are designed to be fed back to a model. Sometimes, however, there are artifacts of a tool&#x27;s execution that we want to make accessible to downstream components in our chain or agent, but that we don&#x27;t want to expose to the model itself. For example if a tool returns a custom object, a dataframe or an image, we may want to pass some metadata about this output to the model without passing the actual output. At the same time, we may want to be able to access this full output elsewhere, for example in downstream tools.

```python
@tool(response_format="content_and_artifact")
def some_tool(...) -> Tuple[str, Any]:
    """Tool that does something."""
    ...
    return &#x27;Message for chat model&#x27;, some_artifact

```**See [how to return artifacts from tools](/docs/how_to/tool_artifacts/) for more details. Special type annotations[​](#special-type-annotations) There are a number of special type annotations that can be used in the tool&#x27;s function signature to configure the run time behavior of the tool. The following type annotations will end up removing** the argument from the tool&#x27;s schema. This can be useful for arguments that should not be exposed to the model and that the model should not be able to control.

- **InjectedToolArg**: Value should be injected manually at runtime using .invoke or .ainvoke.

- **RunnableConfig**: Pass in the RunnableConfig object to the tool.

- **InjectedState**: Pass in the overall state of the LangGraph graph to the tool.

- **InjectedStore**: Pass in the LangGraph store object to the tool.

You can also use the `Annotated` type with a string literal to provide a **description** for the corresponding argument that **WILL** be exposed in the tool&#x27;s schema.

- **Annotated[..., "string literal"]** -- Adds a description to the argument that will be exposed in the tool&#x27;s schema.

### InjectedToolArg[​](#injectedtoolarg)

There are cases where certain arguments need to be passed to a tool at runtime but should not be generated by the model itself. For this, we use the `InjectedToolArg` annotation, which allows certain parameters to be hidden from the tool&#x27;s schema.

For example, if a tool requires a `user_id` to be injected dynamically at runtime, it can be structured in this way:

```python
from langchain_core.tools import tool, InjectedToolArg

@tool
def user_specific_tool(input_data: str, user_id: InjectedToolArg) -> str:
    """Tool that processes input data."""
    return f"User {user_id} processed {input_data}"

```**API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) | [InjectedToolArg](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.base.InjectedToolArg.html)

Annotating the `user_id` argument with `InjectedToolArg` tells LangChain that this argument should not be exposed as part of the tool&#x27;s schema.

See [how to pass run time values to tools](/docs/how_to/tool_runtime/) for more details on how to use `InjectedToolArg`.

### RunnableConfig[​](#runnableconfig)

You can use the `RunnableConfig` object to pass custom run time values to tools.

If you need to access the [RunnableConfig](/docs/concepts/runnables/#runnableconfig) object from within a tool. This can be done by using the `RunnableConfig` annotation in the tool&#x27;s function signature.

```python
from langchain_core.runnables import RunnableConfig

@tool
async def some_func(..., config: RunnableConfig) -> ...:
    """Tool that does something."""
    # do something with config
    ...

await some_func.ainvoke(..., config={"configurable": {"value": "some_value"}})

```**API Reference:**[RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html)

The `config` will not be part of the tool&#x27;s schema and will be injected at runtime with appropriate values.

noteYou may need to access the `config` object to manually propagate it to subclass. This happens if you&#x27;re working with python 3.9 / 3.10 in an [async](/docs/concepts/async/) environment and need to manually propagate the `config` object to sub-calls.

Please read [Propagation RunnableConfig](/docs/concepts/runnables/#propagation-of-runnableconfig) for more details to learn how to propagate the `RunnableConfig` down the call chain manually (or upgrade to Python 3.11 where this is no longer an issue).

### InjectedState[​](#injectedstate)

Please see the [InjectedState](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.tool_node.InjectedState) documentation for more details.

### InjectedStore[​](#injectedstore)

Please see the [InjectedStore](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.tool_node.InjectedStore) documentation for more details.

## Tool Artifacts vs. Injected State[​](#tool-artifacts-vs-injected-state)

Although similar conceptually, tool artifacts in LangChain and [injected state in LangGraph](https://langchain-ai.github.io/langgraph/reference/agents/#langgraph.prebuilt.tool_node.InjectedState) serve different purposes and operate at different levels of abstraction.

**Tool Artifacts**

- **Purpose:** Store and pass data between tool executions within a single chain/workflow

- **Scope:** Limited to tool-to-tool communication

- **Lifecycle:** Tied to individual tool calls and their immediate context

- **Usage:** Temporary storage for intermediate results that tools need to share

**Injected State (LangGraph)**

- **Purpose:** Maintain persistent state across the entire graph execution

- **Scope:** Global to the entire graph workflow

- **Lifecycle:** Persists throughout the entire graph execution and can be saved/restored

- **Usage:** Long-term state management, conversation memory, user context, workflow checkpointing

Tool artifacts are ephemeral data passed between tools, while injected state is persistent workflow-level state that survives across multiple steps, tool calls, and even execution sessions in LangGraph.

## Best practices[​](#best-practices)

When designing tools to be used by models, keep the following in mind:

- Tools that are well-named, correctly-documented and properly type-hinted are easier for models to use.

- Design simple and narrowly scoped tools, as they are easier for models to use correctly.

- Use chat models that support [tool-calling](/docs/concepts/tool_calling/) APIs to take advantage of tools.

## Toolkits[​](#toolkits)

LangChain has a concept of **toolkits**. This a very thin abstraction that groups tools together that are designed to be used together for specific tasks.

### Interface[​](#interface)

All Toolkits expose a `get_tools` method which returns a list of tools. You can therefore do:

```python
# Initialize a toolkit
toolkit = ExampleToolkit(...)

# Get list of tools
tools = toolkit.get_tools()

```

## Related resources[​](#related-resources) See the following resources for more information:

- [API Reference for @tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

- [How to create custom tools](/docs/how_to/custom_tools/)

- [How to pass run time values to tools](/docs/how_to/tool_runtime/)

- [All LangChain tool how-to guides](https://docs.langchain.com/docs/how_to/#tools)

- [Additional how-to guides that show usage with LangGraph](https://langchain-ai.github.io/langgraph/how-tos/tool-calling/)

- Tool integrations, see the [tool integration docs](https://docs.langchain.com/docs/integrations/tools/).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/tools.mdx)

- [Overview](#overview)
- [Key concepts](#key-concepts)
- [Tool interface](#tool-interface)
- [Create tools using the @tool decorator](#create-tools-using-the-tool-decorator)
- [Use the tool directly](#use-the-tool-directly)[Inspect](#inspect)

- [Configuring the schema](#configuring-the-schema)
- [Tool artifacts](#tool-artifacts)
- [Special type annotations](#special-type-annotations)[InjectedToolArg](#injectedtoolarg)
- [RunnableConfig](#runnableconfig)
- [InjectedState](#injectedstate)
- [InjectedStore](#injectedstore)

- [Tool Artifacts vs. Injected State](#tool-artifacts-vs-injected-state)
- [Best practices](#best-practices)
- [Toolkits](#toolkits)[Interface](#interface)

- [Related resources](#related-resources)

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