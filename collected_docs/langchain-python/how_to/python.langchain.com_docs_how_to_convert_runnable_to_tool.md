How to convert Runnables to Tools | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/convert_runnable_to_tool.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/convert_runnable_to_tool.ipynb)How to convert Runnables to Tools PrerequisitesThis guide assumes familiarity with the following concepts: [Runnables](/docs/concepts/runnables/) [Tools](/docs/concepts/tools/) [Agents](/docs/tutorials/agents/) Here we will demonstrate how to convert a LangChain Runnable into a tool that can be used by agents, chains, or chat models. Dependencies[​](#dependencies) Note**: this guide requires langchain-core >= 0.2.13. We will also use [OpenAI](/docs/integrations/providers/openai/) for embeddings, but any LangChain embeddings should suffice. We will use a simple [LangGraph](https://langchain-ai.github.io/langgraph/) agent for demonstration purposes.

```python
%%capture --no-stderr
%pip install -U langchain-core langchain-openai langgraph

```**LangChain [tools](/docs/concepts/tools/) are interfaces that an agent, chain, or chat model can use to interact with the world. See [here](/docs/how_to/#tools) for how-to guides covering tool-calling, built-in tools, custom tools, and more information. LangChain tools-- instances of [BaseTool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.BaseTool.html)-- are [Runnables](/docs/concepts/runnables/) with additional constraints that enable them to be invoked effectively by language models: Their inputs are constrained to be serializable, specifically strings and Python dict objects; They contain names and descriptions indicating how and when they should be used; They may contain a detailed [args_schema](https://python.langchain.com/docs/how_to/custom_tools/) for their arguments. That is, while a tool (as a Runnable) might accept a single dict input, the specific keys and type information needed to populate a dict should be specified in the args_schema. Runnables that accept string or dict input can be converted to tools using the [as_tool](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.as_tool) method, which allows for the specification of names, descriptions, and additional schema information for arguments. Basic usage[​](#basic-usage) With typed dict input:

```python
from typing import List

from langchain_core.runnables import RunnableLambda
from typing_extensions import TypedDict

class Args(TypedDict):
    a: int
    b: List[int]

def f(x: Args) -> str:
    return str(x["a"] * max(x["b"]))

runnable = RunnableLambda(f)
as_tool = runnable.as_tool(
    name="My tool",
    description="Explanation of when to use tool.",
)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```python
print(as_tool.description)

as_tool.args_schema.model_json_schema()

```**

```output
Explanation of when to use tool.

```

```output
{&#x27;properties&#x27;: {&#x27;a&#x27;: {&#x27;title&#x27;: &#x27;A&#x27;, &#x27;type&#x27;: &#x27;integer&#x27;},
  &#x27;b&#x27;: {&#x27;items&#x27;: {&#x27;type&#x27;: &#x27;integer&#x27;}, &#x27;title&#x27;: &#x27;B&#x27;, &#x27;type&#x27;: &#x27;array&#x27;}},
 &#x27;required&#x27;: [&#x27;a&#x27;, &#x27;b&#x27;],
 &#x27;title&#x27;: &#x27;My tool&#x27;,
 &#x27;type&#x27;: &#x27;object&#x27;}

```

```python
as_tool.invoke({"a": 3, "b": [1, 2]})

```

```output
&#x27;6&#x27;

``` Without typing information, arg types can be specified via arg_types:

```python
from typing import Any, Dict

def g(x: Dict[str, Any]) -> str:
    return str(x["a"] * max(x["b"]))

runnable = RunnableLambda(g)
as_tool = runnable.as_tool(
    name="My tool",
    description="Explanation of when to use tool.",
    arg_types={"a": int, "b": List[int]},
)

``` Alternatively, the schema can be fully specified by directly passing the desired [args_schema](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.BaseTool.html#langchain_core.tools.BaseTool.args_schema) for the tool:

```python
from pydantic import BaseModel, Field

class GSchema(BaseModel):
    """Apply a function to an integer and list of integers."""

    a: int = Field(..., description="Integer")
    b: List[int] = Field(..., description="List of ints")

runnable = RunnableLambda(g)
as_tool = runnable.as_tool(GSchema)

``` String input is also supported:

```python
def f(x: str) -> str:
    return x + "a"

def g(x: str) -> str:
    return x + "z"

runnable = RunnableLambda(f) | g
as_tool = runnable.as_tool()

```

```python
as_tool.invoke("b")

```

```output
&#x27;baz&#x27;

``` In agents[​](#in-agents) Below we will incorporate LangChain Runnables as tools in an [agent](/docs/concepts/agents/) application. We will demonstrate with: a document [retriever](/docs/concepts/retrievers/); a simple [RAG](/docs/tutorials/rag/) chain, allowing an agent to delegate relevant queries to it. We first instantiate a chat model that supports [tool calling](/docs/how_to/tool_calling/): Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` Following the [RAG tutorial](/docs/tutorials/rag/), let&#x27;s first construct a retriever:

```python
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings

documents = [
    Document(
        page_content="Dogs are great companions, known for their loyalty and friendliness.",
    ),
    Document(
        page_content="Cats are independent pets that often enjoy their own space.",
    ),
]

vectorstore = InMemoryVectorStore.from_documents(
    documents, embedding=OpenAIEmbeddings()
)

retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 1},
)

```API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) | [InMemoryVectorStore](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.in_memory.InMemoryVectorStore.html) We next create use a simple pre-built [LangGraph agent](https://python.langchain.com/docs/tutorials/agents/) and provide it the tool:

```python
from langgraph.prebuilt import create_react_agent

tools = [
    retriever.as_tool(
        name="pet_info_retriever",
        description="Get information about pets.",
    )
]
agent = create_react_agent(llm, tools)

```**API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```python
for chunk in agent.stream({"messages": [("human", "What are dogs known for?")]}):
    print(chunk)
    print("----")

```**

```output
{&#x27;agent&#x27;: {&#x27;messages&#x27;: [AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_W8cnfOjwqEn4cFcg19LN9mYD&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"__arg1":"dogs"}&#x27;, &#x27;name&#x27;: &#x27;pet_info_retriever&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 19, &#x27;prompt_tokens&#x27;: 60, &#x27;total_tokens&#x27;: 79}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-d7f81de9-1fb7-4caf-81ed-16dcdb0b2ab4-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;pet_info_retriever&#x27;, &#x27;args&#x27;: {&#x27;__arg1&#x27;: &#x27;dogs&#x27;}, &#x27;id&#x27;: &#x27;call_W8cnfOjwqEn4cFcg19LN9mYD&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 60, &#x27;output_tokens&#x27;: 19, &#x27;total_tokens&#x27;: 79})]}}
----
{&#x27;tools&#x27;: {&#x27;messages&#x27;: [ToolMessage(content="[Document(id=&#x27;86f835fe-4bbe-4ec6-aeb4-489a8b541707&#x27;, page_content=&#x27;Dogs are great companions, known for their loyalty and friendliness.&#x27;)]", name=&#x27;pet_info_retriever&#x27;, tool_call_id=&#x27;call_W8cnfOjwqEn4cFcg19LN9mYD&#x27;)]}}
----
{&#x27;agent&#x27;: {&#x27;messages&#x27;: [AIMessage(content=&#x27;Dogs are known for being great companions, known for their loyalty and friendliness.&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 18, &#x27;prompt_tokens&#x27;: 134, &#x27;total_tokens&#x27;: 152}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-9ca5847a-a5eb-44c0-a774-84cc2c5bbc5b-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 134, &#x27;output_tokens&#x27;: 18, &#x27;total_tokens&#x27;: 152})]}}
----

``` See [LangSmith trace](https://smith.langchain.com/public/44e438e3-2faf-45bd-b397-5510fc145eb9/r) for the above run. Going further, we can create a simple [RAG](/docs/tutorials/rag/) chain that takes an additional parameter-- here, the "style" of the answer.

```python
from operator import itemgetter

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

system_prompt = """
You are an assistant for question-answering tasks.
Use the below context to answer the question. If
you don&#x27;t know the answer, say you don&#x27;t know.
Use three sentences maximum and keep the answer
concise.

Answer in the style of {answer_style}.

Question: {question}

Context: {context}
"""

prompt = ChatPromptTemplate.from_messages([("system", system_prompt)])

rag_chain = (
    {
        "context": itemgetter("question") | retriever,
        "question": itemgetter("question"),
        "answer_style": itemgetter("answer_style"),
    }
    | prompt
    | llm
    | StrOutputParser()
)

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) Note that the input schema for our chain contains the required arguments, so it converts to a tool without further specification:

```python
rag_chain.input_schema.model_json_schema()

```

```output
{&#x27;properties&#x27;: {&#x27;question&#x27;: {&#x27;title&#x27;: &#x27;Question&#x27;},
  &#x27;answer_style&#x27;: {&#x27;title&#x27;: &#x27;Answer Style&#x27;}},
 &#x27;required&#x27;: [&#x27;question&#x27;, &#x27;answer_style&#x27;],
 &#x27;title&#x27;: &#x27;RunnableParallel<context,question,answer_style>Input&#x27;,
 &#x27;type&#x27;: &#x27;object&#x27;}

```

```python
rag_tool = rag_chain.as_tool(
    name="pet_expert",
    description="Get information about pets.",
)

``` Below we again invoke the agent. Note that the agent populates the required parameters in its tool_calls:

```python
agent = create_react_agent(llm, [rag_tool])

for chunk in agent.stream(
    {"messages": [("human", "What would a pirate say dogs are known for?")]}
):
    print(chunk)
    print("----")

```

```output
{&#x27;agent&#x27;: {&#x27;messages&#x27;: [AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_17iLPWvOD23zqwd1QVQ00Y63&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"question":"What are dogs known for according to pirates?","answer_style":"quote"}&#x27;, &#x27;name&#x27;: &#x27;pet_expert&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 28, &#x27;prompt_tokens&#x27;: 59, &#x27;total_tokens&#x27;: 87}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-7fef44f3-7bba-4e63-8c51-2ad9c5e65e2e-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;pet_expert&#x27;, &#x27;args&#x27;: {&#x27;question&#x27;: &#x27;What are dogs known for according to pirates?&#x27;, &#x27;answer_style&#x27;: &#x27;quote&#x27;}, &#x27;id&#x27;: &#x27;call_17iLPWvOD23zqwd1QVQ00Y63&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 59, &#x27;output_tokens&#x27;: 28, &#x27;total_tokens&#x27;: 87})]}}
----
{&#x27;tools&#x27;: {&#x27;messages&#x27;: [ToolMessage(content=&#x27;"Dogs are known for their loyalty and friendliness, making them great companions for pirates on long sea voyages."&#x27;, name=&#x27;pet_expert&#x27;, tool_call_id=&#x27;call_17iLPWvOD23zqwd1QVQ00Y63&#x27;)]}}
----
{&#x27;agent&#x27;: {&#x27;messages&#x27;: [AIMessage(content=&#x27;According to pirates, dogs are known for their loyalty and friendliness, making them great companions for pirates on long sea voyages.&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 27, &#x27;prompt_tokens&#x27;: 119, &#x27;total_tokens&#x27;: 146}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-5a30edc3-7be0-4743-b980-ca2f8cad9b8d-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 119, &#x27;output_tokens&#x27;: 27, &#x27;total_tokens&#x27;: 146})]}}
----

``` See [LangSmith trace](https://smith.langchain.com/public/147ae4e6-4dfb-4dd9-8ca0-5c5b954f08ac/r) for the above run.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/convert_runnable_to_tool.ipynb)[Dependencies](#dependencies)
- [Basic usage](#basic-usage)
- [In agents](#in-agents)

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