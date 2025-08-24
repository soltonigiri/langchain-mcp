How to stream tool calls | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_streaming.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_streaming.ipynb)How to stream tool calls When [tools](/docs/concepts/tools/) are called in a streaming context, [message chunks](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessageChunk.html#langchain_core.messages.ai.AIMessageChunk) will be populated with [tool call chunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolCallChunk.html#langchain_core.messages.tool.ToolCallChunk) objects in a list via the .tool_call_chunks attribute. A ToolCallChunk includes optional string fields for the tool name, args, and id, and includes an optional integer field index that can be used to join chunks together. Fields are optional because portions of a tool call may be streamed across different chunks (e.g., a chunk that includes a substring of the arguments may have null values for the tool name and id). Because message chunks inherit from their parent message class, an [AIMessageChunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessageChunk.html#langchain_core.messages.ai.AIMessageChunk) with tool call chunks will also include .tool_calls and .invalid_tool_calls fields. These fields are parsed best-effort from the message&#x27;s tool call chunks. Note that not all providers currently support streaming for tool calls. Before we start let&#x27;s define our tools and our model.

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

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```python
import os
from getpass import getpass

from langchain_openai import ChatOpenAI

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
llm_with_tools = llm.bind_tools(tools)

```**Now let&#x27;s define our query and stream our output:

```python
query = "What is 3 * 12? Also, what is 11 + 49?"

async for chunk in llm_with_tools.astream(query):
    print(chunk.tool_call_chunks)

```

```output
[]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;&#x27;, &#x27;id&#x27;: &#x27;call_3aQwTP9CYlFxwOvQZPHDu6wL&#x27;, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: None, &#x27;args&#x27;: &#x27;{"a"&#x27;, &#x27;id&#x27;: None, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: None, &#x27;args&#x27;: &#x27;: 3, &#x27;, &#x27;id&#x27;: None, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: None, &#x27;args&#x27;: &#x27;"b": 1&#x27;, &#x27;id&#x27;: None, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: None, &#x27;args&#x27;: &#x27;2}&#x27;, &#x27;id&#x27;: None, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: &#x27;&#x27;, &#x27;id&#x27;: &#x27;call_SQUoSsJz2p9Kx2x73GOgN1ja&#x27;, &#x27;index&#x27;: 1}]
[{&#x27;name&#x27;: None, &#x27;args&#x27;: &#x27;{"a"&#x27;, &#x27;id&#x27;: None, &#x27;index&#x27;: 1}]
[{&#x27;name&#x27;: None, &#x27;args&#x27;: &#x27;: 11,&#x27;, &#x27;id&#x27;: None, &#x27;index&#x27;: 1}]
[{&#x27;name&#x27;: None, &#x27;args&#x27;: &#x27; "b": &#x27;, &#x27;id&#x27;: None, &#x27;index&#x27;: 1}]
[{&#x27;name&#x27;: None, &#x27;args&#x27;: &#x27;49}&#x27;, &#x27;id&#x27;: None, &#x27;index&#x27;: 1}]
[]

``` Note that adding message chunks will merge their corresponding tool call chunks. This is the principle by which LangChain&#x27;s various [tool output parsers](/docs/how_to/output_parser_structured/) support streaming. For example, below we accumulate tool call chunks:

```python
first = True
async for chunk in llm_with_tools.astream(query):
    if first:
        gathered = chunk
        first = False
    else:
        gathered = gathered + chunk

    print(gathered.tool_call_chunks)

```

```output
[]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a"&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a": 3, &#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a": 3, "b": 1&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a": 3, "b": 12}&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a": 3, "b": 12}&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: &#x27;&#x27;, &#x27;id&#x27;: &#x27;call_b4iMiB3chGNGqbt5SjqqD2Wh&#x27;, &#x27;index&#x27;: 1}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a": 3, "b": 12}&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: &#x27;{"a"&#x27;, &#x27;id&#x27;: &#x27;call_b4iMiB3chGNGqbt5SjqqD2Wh&#x27;, &#x27;index&#x27;: 1}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a": 3, "b": 12}&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: &#x27;{"a": 11,&#x27;, &#x27;id&#x27;: &#x27;call_b4iMiB3chGNGqbt5SjqqD2Wh&#x27;, &#x27;index&#x27;: 1}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a": 3, "b": 12}&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: &#x27;{"a": 11, "b": &#x27;, &#x27;id&#x27;: &#x27;call_b4iMiB3chGNGqbt5SjqqD2Wh&#x27;, &#x27;index&#x27;: 1}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a": 3, "b": 12}&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: &#x27;{"a": 11, "b": 49}&#x27;, &#x27;id&#x27;: &#x27;call_b4iMiB3chGNGqbt5SjqqD2Wh&#x27;, &#x27;index&#x27;: 1}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: &#x27;{"a": 3, "b": 12}&#x27;, &#x27;id&#x27;: &#x27;call_AkL3dVeCjjiqvjv8ckLxL3gP&#x27;, &#x27;index&#x27;: 0}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: &#x27;{"a": 11, "b": 49}&#x27;, &#x27;id&#x27;: &#x27;call_b4iMiB3chGNGqbt5SjqqD2Wh&#x27;, &#x27;index&#x27;: 1}]

```

```python
print(type(gathered.tool_call_chunks[0]["args"]))

```

```output
<class &#x27;str&#x27;>

``` And below we accumulate tool calls to demonstrate partial parsing:

```python
first = True
async for chunk in llm_with_tools.astream(query):
    if first:
        gathered = chunk
        first = False
    else:
        gathered = gathered + chunk

    print(gathered.tool_calls)

```

```output
[]
[]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 1}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: {}, &#x27;id&#x27;: &#x27;call_54Hx3DGjZitFlEjgMe1DYonh&#x27;}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 11}, &#x27;id&#x27;: &#x27;call_54Hx3DGjZitFlEjgMe1DYonh&#x27;}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 11}, &#x27;id&#x27;: &#x27;call_54Hx3DGjZitFlEjgMe1DYonh&#x27;}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 11, &#x27;b&#x27;: 49}, &#x27;id&#x27;: &#x27;call_54Hx3DGjZitFlEjgMe1DYonh&#x27;}]
[{&#x27;name&#x27;: &#x27;Multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 3, &#x27;b&#x27;: 12}, &#x27;id&#x27;: &#x27;call_4p0D4tHVXSiae9Mu0e8jlI1m&#x27;}, {&#x27;name&#x27;: &#x27;Add&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 11, &#x27;b&#x27;: 49}, &#x27;id&#x27;: &#x27;call_54Hx3DGjZitFlEjgMe1DYonh&#x27;}]

```

```python
print(type(gathered.tool_calls[0]["args"]))

```

```output
<class &#x27;dict&#x27;>

``` Note the key difference: accumulating tool_call_chunks captures the raw tool arguments as an unparsed string as they are streamed. In contrast, accumulating** tool_calls demonstrates partial parsing by progressively converting the streamed argument string into a valid, usable dictionary at each step of the process.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tool_streaming.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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