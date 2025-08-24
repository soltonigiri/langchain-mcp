How to use few-shot prompting with tool calling | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_few_shot.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_few_shot.ipynb)How to use few-shot prompting with tool calling For more complex tool use it&#x27;s very useful to add [few-shot examples](/docs/concepts/few_shot_prompting/) to the prompt. We can do this by adding AIMessages with ToolCalls and corresponding ToolMessages to our prompt. First let&#x27;s define our tools and model.

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

```**Let&#x27;s run our model where we can notice that even with some special instructions our model can get tripped up by order of operations.

```python
llm_with_tools.invoke(
    "Whats 119 times 8 minus 20. Don&#x27;t do any math yourself, only use tools for math. Respect order of operations"
).tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;Multiply&#x27;,
  &#x27;args&#x27;: {&#x27;a&#x27;: 119, &#x27;b&#x27;: 8},
  &#x27;id&#x27;: &#x27;call_T88XN6ECucTgbXXkyDeC2CQj&#x27;},
 {&#x27;name&#x27;: &#x27;Add&#x27;,
  &#x27;args&#x27;: {&#x27;a&#x27;: 952, &#x27;b&#x27;: -20},
  &#x27;id&#x27;: &#x27;call_licdlmGsRqzup8rhqJSb1yZ4&#x27;}]

``` The model shouldn&#x27;t be trying to add anything yet, since it technically can&#x27;t know the results of 119 * 8 yet. By adding a prompt with some examples we can correct this behavior:

```python
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

examples = [
    HumanMessage(
        "What&#x27;s the product of 317253 and 128472 plus four", name="example_user"
    ),
    AIMessage(
        "",
        name="example_assistant",
        tool_calls=[
            {"name": "Multiply", "args": {"x": 317253, "y": 128472}, "id": "1"}
        ],
    ),
    ToolMessage("16505054784", tool_call_id="1"),
    AIMessage(
        "",
        name="example_assistant",
        tool_calls=[{"name": "Add", "args": {"x": 16505054784, "y": 4}, "id": "2"}],
    ),
    ToolMessage("16505054788", tool_call_id="2"),
    AIMessage(
        "The product of 317253 and 128472 plus four is 16505054788",
        name="example_assistant",
    ),
]

system = """You are bad at math but are an expert at using a calculator.

Use past tool usage as an example of how to correctly use the tools."""
few_shot_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        *examples,
        ("human", "{query}"),
    ]
)

chain = {"query": RunnablePassthrough()} | few_shot_prompt | llm_with_tools
chain.invoke("Whats 119 times 8 minus 20").tool_calls

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
[{&#x27;name&#x27;: &#x27;Multiply&#x27;,
  &#x27;args&#x27;: {&#x27;a&#x27;: 119, &#x27;b&#x27;: 8},
  &#x27;id&#x27;: &#x27;call_9MvuwQqg7dlJupJcoTWiEsDo&#x27;}]

``` And we get the correct output this time. Here&#x27;s what the [LangSmith trace](https://smith.langchain.com/public/f70550a1-585f-4c9d-a643-13148ab1616f/r) looks like.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tools_few_shot.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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