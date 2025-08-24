How to add examples to the prompt for query analysis | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/query_few_shot.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/query_few_shot.ipynb)How to add examples to the prompt for query analysis As our query analysis becomes more complex, the LLM may struggle to understand how exactly it should respond in certain scenarios. In order to improve performance here, we can [add examples](/docs/concepts/few_shot_prompting/) to the prompt to guide the LLM. Let&#x27;s take a look at how we can add examples for a LangChain YouTube video query analyzer. Setup[​](#setup) Install dependencies[​](#install-dependencies)

```python
# %pip install -qU langchain-core langchain-openai

``` Set environment variables[​](#set-environment-variables) We&#x27;ll use OpenAI in this example:

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass()

# Optional, uncomment to trace runs with LangSmith. Sign up here: https://smith.langchain.com.
# os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` Query schema[​](#query-schema) We&#x27;ll define a query schema that we want our model to output. To make our query analysis a bit more interesting, we&#x27;ll add a sub_queries field that contains more narrow questions derived from the top level question.

```python
from typing import List, Optional

from pydantic import BaseModel, Field

sub_queries_description = """\
If the original question contains multiple distinct sub-questions, \
or if there are more generic questions that would be helpful to answer in \
order to answer the original question, write a list of all relevant sub-questions. \
Make sure this list is comprehensive and covers all parts of the original question. \
It&#x27;s ok if there&#x27;s redundancy in the sub-questions. \
Make sure the sub-questions are as narrowly focused as possible."""

class Search(BaseModel):
    """Search over a database of tutorial videos about a software library."""

    query: str = Field(
        ...,
        description="Primary similarity search query applied to video transcripts.",
    )
    sub_queries: List[str] = Field(
        default_factory=list, description=sub_queries_description
    )
    publish_year: Optional[int] = Field(None, description="Year video was published")

``` Query generation[​](#query-generation)

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

system = """You are an expert at converting user questions into database queries. \
You have access to a database of tutorial videos about a software library for building LLM-powered applications. \
Given a question, return a list of database queries optimized to retrieve the most relevant results.

If there are acronyms or words you are not familiar with, do not try to rephrase them."""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        MessagesPlaceholder("examples", optional=True),
        ("human", "{question}"),
    ]
)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
structured_llm = llm.with_structured_output(Search)
query_analyzer = {"question": RunnablePassthrough()} | prompt | structured_llm

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) Let&#x27;s try out our query analyzer without any examples in the prompt:

```python
query_analyzer.invoke(
    "what&#x27;s the difference between web voyager and reflection agents? do both use langgraph?"
)

```**

```output
Search(query=&#x27;difference between web voyager and reflection agents&#x27;, sub_queries=[&#x27;what is web voyager&#x27;, &#x27;what are reflection agents&#x27;, &#x27;do both web voyager and reflection agents use langgraph?&#x27;], publish_year=None)

``` Adding examples and tuning the prompt[​](#adding-examples-and-tuning-the-prompt) This works pretty well, but we probably want it to decompose the question even further to separate the queries about Web Voyager and Reflection Agents. To tune our query generation results, we can add some examples of inputs questions and gold standard output queries to our prompt.

```python
examples = []

```

```python
question = "What&#x27;s chat langchain, is it a langchain template?"
query = Search(
    query="What is chat langchain and is it a langchain template?",
    sub_queries=["What is chat langchain", "What is a langchain template"],
)
examples.append({"input": question, "tool_calls": [query]})

```

```python
question = "How to build multi-agent system and stream intermediate steps from it"
query = Search(
    query="How to build multi-agent system and stream intermediate steps from it",
    sub_queries=[
        "How to build multi-agent system",
        "How to stream intermediate steps from multi-agent system",
        "How to stream intermediate steps",
    ],
)

examples.append({"input": question, "tool_calls": [query]})

```

```python
question = "LangChain agents vs LangGraph?"
query = Search(
    query="What&#x27;s the difference between LangChain agents and LangGraph? How do you deploy them?",
    sub_queries=[
        "What are LangChain agents",
        "What is LangGraph",
        "How do you deploy LangChain agents",
        "How do you deploy LangGraph",
    ],
)
examples.append({"input": question, "tool_calls": [query]})

``` Now we need to update our prompt template and chain so that the examples are included in each prompt. Since we&#x27;re working with OpenAI function-calling, we&#x27;ll need to do a bit of extra structuring to send example inputs and outputs to the model. We&#x27;ll create a tool_example_to_messages helper function to handle this for us:

```python
import uuid
from typing import Dict

from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)

def tool_example_to_messages(example: Dict) -> List[BaseMessage]:
    messages: List[BaseMessage] = [HumanMessage(content=example["input"])]
    openai_tool_calls = []
    for tool_call in example["tool_calls"]:
        openai_tool_calls.append(
            {
                "id": str(uuid.uuid4()),
                "type": "function",
                "function": {
                    "name": tool_call.__class__.__name__,
                    "arguments": tool_call.json(),
                },
            }
        )
    messages.append(
        AIMessage(content="", additional_kwargs={"tool_calls": openai_tool_calls})
    )
    tool_outputs = example.get("tool_outputs") or [
        "You have correctly called this tool."
    ] * len(openai_tool_calls)
    for output, tool_call in zip(tool_outputs, openai_tool_calls):
        messages.append(ToolMessage(content=output, tool_call_id=tool_call["id"]))
    return messages

example_msgs = [msg for ex in examples for msg in tool_example_to_messages(ex)]

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html)

```python
from langchain_core.prompts import MessagesPlaceholder

query_analyzer_with_examples = (
    {"question": RunnablePassthrough()}
    | prompt.partial(examples=example_msgs)
    | structured_llm
)

```**API Reference:**[MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html)

```python
query_analyzer_with_examples.invoke(
    "what&#x27;s the difference between web voyager and reflection agents? do both use langgraph?"
)

```

```output
Search(query="What&#x27;s the difference between web voyager and reflection agents? Do both use langgraph?", sub_queries=[&#x27;What is web voyager&#x27;, &#x27;What are reflection agents&#x27;, &#x27;Do web voyager and reflection agents use langgraph?&#x27;], publish_year=None)

``` Thanks to our examples we get a slightly more decomposed search query. With some more prompt engineering and tuning of our examples we could improve query generation even more. You can see that the examples are passed to the model as messages in the [LangSmith trace](https://smith.langchain.com/public/aeaaafce-d2b1-4943-9a61-bc954e8fc6f2/r).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/query_few_shot.ipynb)[Setup](#setup)
- [Query schema](#query-schema)
- [Query generation](#query-generation)
- [Adding examples and tuning the prompt](#adding-examples-and-tuning-the-prompt)

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