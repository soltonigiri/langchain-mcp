How to use built-in tools and toolkits | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_builtin.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_builtin.ipynb) # How to use built-in tools and toolkits PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Tools](/docs/concepts/tools/)

- [LangChain Toolkits](/docs/concepts/tools/)

## Tools[​](#tools)

LangChain has a large collection of 3rd party tools. Please visit [Tool Integrations](/docs/integrations/tools/) for a list of the available tools.

importantWhen using 3rd party tools, make sure that you understand how the tool works, what permissions it has. Read over its documentation and check if anything is required from you from a security point of view. Please see our [security](https://python.langchain.com/docs/security/) guidelines for more information.

Let&#x27;s try out the [Wikipedia integration](/docs/integrations/tools/wikipedia/).

```python
!pip install -qU langchain-community wikipedia

```

```python
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=100)
tool = WikipediaQueryRun(api_wrapper=api_wrapper)

print(tool.invoke({"query": "langchain"}))

```

```output
Page: LangChain
Summary: LangChain is a framework designed to simplify the creation of applications

``` The tool has the following defaults associated with it:

```python
print(f"Name: {tool.name}")
print(f"Description: {tool.description}")
print(f"args schema: {tool.args}")
print(f"returns directly?: {tool.return_direct}")

```

```output
Name: wikipedia
Description: A wrapper around Wikipedia. Useful for when you need to answer general questions about people, places, companies, facts, historical events, or other subjects. Input should be a search query.
args schema: {&#x27;query&#x27;: {&#x27;description&#x27;: &#x27;query to look up on wikipedia&#x27;, &#x27;title&#x27;: &#x27;Query&#x27;, &#x27;type&#x27;: &#x27;string&#x27;}}
returns directly?: False

``` ## Customizing Default Tools[​](#customizing-default-tools) We can also modify the built in name, description, and JSON schema of the arguments.

When defining the JSON schema of the arguments, it is important that the inputs remain the same as the function, so you shouldn&#x27;t change that. But you can define custom descriptions for each input easily.

```python
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from pydantic import BaseModel, Field

class WikiInputs(BaseModel):
    """Inputs to the wikipedia tool."""

    query: str = Field(
        description="query to look up in Wikipedia, should be 3 or less words"
    )

tool = WikipediaQueryRun(
    name="wiki-tool",
    description="look up things in wikipedia",
    args_schema=WikiInputs,
    api_wrapper=api_wrapper,
    return_direct=True,
)

print(tool.run("langchain"))

```

```output
Page: LangChain
Summary: LangChain is a framework designed to simplify the creation of applications

```

```python
print(f"Name: {tool.name}")
print(f"Description: {tool.description}")
print(f"args schema: {tool.args}")
print(f"returns directly?: {tool.return_direct}")

```

```output
Name: wiki-tool
Description: look up things in wikipedia
args schema: {&#x27;query&#x27;: {&#x27;description&#x27;: &#x27;query to look up in Wikipedia, should be 3 or less words&#x27;, &#x27;title&#x27;: &#x27;Query&#x27;, &#x27;type&#x27;: &#x27;string&#x27;}}
returns directly?: True

``` ## How to use built-in toolkits[​](#how-to-use-built-in-toolkits) Toolkits are collections of tools that are designed to be used together for specific tasks. They have convenient loading methods.

All Toolkits expose a `get_tools` method which returns a list of tools.

You&#x27;re usually meant to use them this way:

```python
# Initialize a toolkit
toolkit = ExampleTookit(...)

# Get list of tools
tools = toolkit.get_tools()

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tools_builtin.ipynb)

- [Tools](#tools)
- [Customizing Default Tools](#customizing-default-tools)
- [How to use built-in toolkits](#how-to-use-built-in-toolkits)

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