How to migrate from legacy LangChain agents to LangGraph | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/migrate_agent.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/migrate_agent.ipynb)How to migrate from legacy LangChain agents to LangGraph PrerequisitesThis guide assumes familiarity with the following concepts: [Agents](/docs/concepts/agents/) [LangGraph](https://langchain-ai.github.io/langgraph/) [Tool calling](/docs/how_to/tool_calling/) Here we focus on how to move from legacy LangChain agents to more flexible [LangGraph](https://langchain-ai.github.io/langgraph/) agents. LangChain agents (the [AgentExecutor](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor) in particular) have multiple configuration parameters. In this notebook we will show how those parameters map to the LangGraph react agent executor using the [create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent) prebuilt helper method. noteIn LangGraph, the graph replaces LangChain&#x27;s agent executor. It manages the agent&#x27;s cycles and tracks the scratchpad as messages within its state. The LangChain "agent" corresponds to the prompt and LLM you&#x27;ve provided. Prerequisites[​](#prerequisites) This how-to guide uses OpenAI as the LLM. Install the dependencies to run.

```python
%%capture --no-stderr
%pip install -U langgraph langchain langchain-openai

``` Then, set your OpenAI API key.

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API key:\n")

``` Basic Usage[​](#basic-usage) For basic creation and usage of a tool-calling ReAct-style agent, the functionality is the same. First, let&#x27;s define a model and tool(s), then we&#x27;ll use those to create an agent.

```python
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")

@tool
def magic_function(input: int) -> int:
    """Applies a magic function to an input."""
    return input + 2

tools = [magic_function]

query = "what is the value of magic_function(3)?"

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) For the LangChain [AgentExecutor](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor), we define a prompt with a placeholder for the agent&#x27;s scratchpad. The agent can be invoked as follows:

```python
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant"),
        ("human", "{input}"),
        # Placeholders fill up a **list** of messages
        ("placeholder", "{agent_scratchpad}"),
    ]
)

agent = create_tool_calling_agent(model, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)

agent_executor.invoke({"input": query})

```**API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
{&#x27;input&#x27;: &#x27;what is the value of magic_function(3)?&#x27;,
 &#x27;output&#x27;: &#x27;The value of `magic_function(3)` is 5.&#x27;}

```**LangGraph&#x27;s [react agent executor](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent) manages a state that is defined by a list of messages. It will continue to process the list until there are no tool calls in the agent&#x27;s output. To kick it off, we input a list of messages. The output will contain the entire state of the graph-- in this case, the conversation history.

```python
from langgraph.prebuilt import create_react_agent

langgraph_agent_executor = create_react_agent(model, tools)

messages = langgraph_agent_executor.invoke({"messages": [("human", query)]})
{
    "input": query,
    "output": messages["messages"][-1].content,
}

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
{&#x27;input&#x27;: &#x27;what is the value of magic_function(3)?&#x27;,
 &#x27;output&#x27;: &#x27;The value of `magic_function(3)` is 5.&#x27;}

```**

```python
message_history = messages["messages"]

new_query = "Pardon?"

messages = langgraph_agent_executor.invoke(
    {"messages": message_history + [("human", new_query)]}
)
{
    "input": new_query,
    "output": messages["messages"][-1].content,
}

```

```output
{&#x27;input&#x27;: &#x27;Pardon?&#x27;,
 &#x27;output&#x27;: &#x27;The result of applying `magic_function` to the input value 3 is 5.&#x27;}

``` Prompt Templates[​](#prompt-templates) With legacy LangChain agents you have to pass in a prompt template. You can use this to control the agent. With LangGraph [react agent executor](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent), by default there is no prompt. You can achieve similar control over the agent in a few ways: Pass in a system message as input Initialize the agent with a system message Initialize the agent with a function to transform messages in the graph state before passing to the model. Initialize the agent with a [Runnable](/docs/concepts/lcel/) to transform messages in the graph state before passing to the model. This includes passing prompt templates as well. Let&#x27;s take a look at all of these below. We will pass in custom instructions to get the agent to respond in Spanish. First up, using AgentExecutor:

```python
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant. Respond only in Spanish."),
        ("human", "{input}"),
        # Placeholders fill up a **list** of messages
        ("placeholder", "{agent_scratchpad}"),
    ]
)

agent = create_tool_calling_agent(model, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)

agent_executor.invoke({"input": query})

```

```output
{&#x27;input&#x27;: &#x27;what is the value of magic_function(3)?&#x27;,
 &#x27;output&#x27;: &#x27;El valor de magic_function(3) es 5.&#x27;}

``` Now, let&#x27;s pass a custom system message to [react agent executor](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent). LangGraph&#x27;s prebuilt create_react_agent does not take a prompt template directly as a parameter, but instead takes a [prompt](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent) parameter. This modifies the graph state before the llm is called, and can be one of four values: A SystemMessage, which is added to the beginning of the list of messages. A string, which is converted to a SystemMessage and added to the beginning of the list of messages. A Callable, which should take in full graph state. The output is then passed to the language model. Or a [Runnable](/docs/concepts/lcel/), which should take in full graph state. The output is then passed to the language model. Here&#x27;s how it looks in action:

```python
from langchain_core.messages import SystemMessage
from langgraph.prebuilt import create_react_agent

system_message = "You are a helpful assistant. Respond only in Spanish."
# This could also be a SystemMessage object
# system_message = SystemMessage(content="You are a helpful assistant. Respond only in Spanish.")

langgraph_agent_executor = create_react_agent(model, tools, prompt=system_message)

messages = langgraph_agent_executor.invoke({"messages": [("user", query)]})

```API Reference:**[SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent) We can also pass in an arbitrary function or a runnable. This function/runnable should take in a graph state and output a list of messages. We can do all types of arbitrary formatting of messages here. In this case, let&#x27;s add a SystemMessage to the start of the list of messages and append another user message at the end.

```python
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.prebuilt import create_react_agent
from langgraph.prebuilt.chat_agent_executor import AgentState

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant. Respond only in Spanish."),
        ("placeholder", "{messages}"),
        ("user", "Also say &#x27;Pandamonium!&#x27; after the answer."),
    ]
)

# alternatively, this can be passed as a function, e.g.
# def prompt(state: AgentState):
#     return (
#         [SystemMessage(content="You are a helpful assistant. Respond only in Spanish.")] +
#         state["messages"] +
#         [HumanMessage(content="Also say &#x27;Pandamonium!&#x27; after the answer.")]
#     )

langgraph_agent_executor = create_react_agent(model, tools, prompt=prompt)

messages = langgraph_agent_executor.invoke({"messages": [("human", query)]})
print(
    {
        "input": query,
        "output": messages["messages"][-1].content,
    }
)

```**API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
{&#x27;input&#x27;: &#x27;what is the value of magic_function(3)?&#x27;, &#x27;output&#x27;: &#x27;El valor de magic_function(3) es 5. ¡Pandamonium!&#x27;}

```**Memory[​](#memory) In LangChain[​](#in-langchain) With LangChain&#x27;s [AgentExecutor](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor.iter), you could add chat [Memory](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor.memory) so it can engage in a multi-turn conversation.

```python
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")
memory = InMemoryChatMessageHistory(session_id="test-session")
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        # First put the history
        ("placeholder", "{chat_history}"),
        # Then the new input
        ("human", "{input}"),
        # Finally the scratchpad
        ("placeholder", "{agent_scratchpad}"),
    ]
)

@tool
def magic_function(input: int) -> int:
    """Applies a magic function to an input."""
    return input + 2

tools = [magic_function]

agent = create_tool_calling_agent(model, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)

agent_with_chat_history = RunnableWithMessageHistory(
    agent_executor,
    # This is needed because in most real world scenarios, a session id is needed
    # It isn&#x27;t really used here because we are using a simple in memory ChatMessageHistory
    lambda session_id: memory,
    input_messages_key="input",
    history_messages_key="chat_history",
)

config = {"configurable": {"session_id": "test-session"}}
print(
    agent_with_chat_history.invoke(
        {"input": "Hi, I&#x27;m polly! What&#x27;s the output of magic_function of 3?"}, config
    )["output"]
)
print("---")
print(agent_with_chat_history.invoke({"input": "Remember my name?"}, config)["output"])
print("---")
print(
    agent_with_chat_history.invoke({"input": "what was that output again?"}, config)[
        "output"
    ]
)

```API Reference:**[InMemoryChatMessageHistory](https://python.langchain.com/api_reference/core/chat_history/langchain_core.chat_history.InMemoryChatMessageHistory.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnableWithMessageHistory](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.history.RunnableWithMessageHistory.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
The output of the magic function when the input is 3 is 5.
---
Yes, you mentioned your name is Polly.
---
The output of the magic function when the input is 3 is 5.

```**In LangGraph[​](#in-langgraph) Memory is just [persistence](https://langchain-ai.github.io/langgraph/how-tos/persistence/), aka [checkpointing](https://langchain-ai.github.io/langgraph/reference/checkpoints/). Add a checkpointer to the agent and you get chat memory for free.

```python
from langgraph.checkpoint.memory import MemorySaver  # an in-memory checkpointer
from langgraph.prebuilt import create_react_agent

system_message = "You are a helpful assistant."
# This could also be a SystemMessage object
# system_message = SystemMessage(content="You are a helpful assistant. Respond only in Spanish.")

memory = MemorySaver()
langgraph_agent_executor = create_react_agent(
    model, tools, prompt=system_message, checkpointer=memory
)

config = {"configurable": {"thread_id": "test-thread"}}
print(
    langgraph_agent_executor.invoke(
        {
            "messages": [
                ("user", "Hi, I&#x27;m polly! What&#x27;s the output of magic_function of 3?")
            ]
        },
        config,
    )["messages"][-1].content
)
print("---")
print(
    langgraph_agent_executor.invoke(
        {"messages": [("user", "Remember my name?")]}, config
    )["messages"][-1].content
)
print("---")
print(
    langgraph_agent_executor.invoke(
        {"messages": [("user", "what was that output again?")]}, config
    )["messages"][-1].content
)

```API Reference:**[MemorySaver](https://langchain-ai.github.io/langgraph/reference/checkpoints/#langgraph.checkpoint.memory.MemorySaver) | [create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
The output of the magic function for the input 3 is 5.
---
Yes, you mentioned that your name is Polly.
---
The output of the magic function for the input 3 was 5.

```**Iterating through steps[​](#iterating-through-steps) In LangChain[​](#in-langchain-1) With LangChain&#x27;s [AgentExecutor](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor.iter), you could iterate over the steps using the [stream](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.stream) (or async astream) methods or the [iter](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor.iter) method. LangGraph supports stepwise iteration using [stream](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.stream)

```python
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        ("human", "{input}"),
        # Placeholders fill up a **list** of messages
        ("placeholder", "{agent_scratchpad}"),
    ]
)

@tool
def magic_function(input: int) -> int:
    """Applies a magic function to an input."""
    return input + 2

tools = [magic_function]

agent = create_tool_calling_agent(model, tools, prompt=prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)

for step in agent_executor.stream({"input": query}):
    print(step)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
{&#x27;actions&#x27;: [ToolAgentAction(tool=&#x27;magic_function&#x27;, tool_input={&#x27;input&#x27;: 3}, log="\nInvoking: `magic_function` with `{&#x27;input&#x27;: 3}`\n\n\n", message_log=[AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;index&#x27;: 0, &#x27;id&#x27;: &#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":3}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;}, id=&#x27;run-7a3a5ada-52ec-4df0-bf7d-81e5051b01b4&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: 3}, &#x27;id&#x27;: &#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], tool_call_chunks=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: &#x27;{"input":3}&#x27;, &#x27;id&#x27;: &#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;, &#x27;index&#x27;: 0, &#x27;type&#x27;: &#x27;tool_call_chunk&#x27;}])], tool_call_id=&#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;)], &#x27;messages&#x27;: [AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;index&#x27;: 0, &#x27;id&#x27;: &#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":3}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;}, id=&#x27;run-7a3a5ada-52ec-4df0-bf7d-81e5051b01b4&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: 3}, &#x27;id&#x27;: &#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], tool_call_chunks=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: &#x27;{"input":3}&#x27;, &#x27;id&#x27;: &#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;, &#x27;index&#x27;: 0, &#x27;type&#x27;: &#x27;tool_call_chunk&#x27;}])]}
{&#x27;steps&#x27;: [AgentStep(action=ToolAgentAction(tool=&#x27;magic_function&#x27;, tool_input={&#x27;input&#x27;: 3}, log="\nInvoking: `magic_function` with `{&#x27;input&#x27;: 3}`\n\n\n", message_log=[AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;index&#x27;: 0, &#x27;id&#x27;: &#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":3}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;}, id=&#x27;run-7a3a5ada-52ec-4df0-bf7d-81e5051b01b4&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: 3}, &#x27;id&#x27;: &#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], tool_call_chunks=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: &#x27;{"input":3}&#x27;, &#x27;id&#x27;: &#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;, &#x27;index&#x27;: 0, &#x27;type&#x27;: &#x27;tool_call_chunk&#x27;}])], tool_call_id=&#x27;call_yyetzabaDBRX9Ml2KyqfKzZM&#x27;), observation=5)], &#x27;messages&#x27;: [FunctionMessage(content=&#x27;5&#x27;, additional_kwargs={}, response_metadata={}, name=&#x27;magic_function&#x27;)]}
{&#x27;output&#x27;: &#x27;The value of `magic_function(3)` is 5.&#x27;, &#x27;messages&#x27;: [AIMessage(content=&#x27;The value of `magic_function(3)` is 5.&#x27;, additional_kwargs={}, response_metadata={})]}

```**In LangGraph[​](#in-langgraph-1) In LangGraph, things are handled natively using [stream](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.graph.CompiledGraph.stream) or the asynchronous astream method.

```python
from langgraph.prebuilt import create_react_agent
from langgraph.prebuilt.chat_agent_executor import AgentState

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        ("placeholder", "{messages}"),
    ]
)

langgraph_agent_executor = create_react_agent(model, tools, prompt=prompt)

for step in langgraph_agent_executor.stream(
    {"messages": [("human", query)]}, stream_mode="updates"
):
    print(step)

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
{&#x27;agent&#x27;: {&#x27;messages&#x27;: [AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_IHTMrjvIHn8gFOX42FstIpr9&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":3}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 61, &#x27;total_tokens&#x27;: 75, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-1a6970da-163a-4e4d-b9b7-7e73b1057f42-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: 3}, &#x27;id&#x27;: &#x27;call_IHTMrjvIHn8gFOX42FstIpr9&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 61, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 75, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}})]}}
{&#x27;tools&#x27;: {&#x27;messages&#x27;: [ToolMessage(content=&#x27;5&#x27;, name=&#x27;magic_function&#x27;, id=&#x27;51a9d3e4-734d-426f-a5a1-c6597e4efe25&#x27;, tool_call_id=&#x27;call_IHTMrjvIHn8gFOX42FstIpr9&#x27;)]}}
{&#x27;agent&#x27;: {&#x27;messages&#x27;: [AIMessage(content=&#x27;The value of `magic_function(3)` is 5.&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 84, &#x27;total_tokens&#x27;: 98, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a20a4ee344&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-73001576-a3dc-4552-8d81-c9ce8aec05b3-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 84, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 98, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}})]}}

```**return_intermediate_steps[​](#return_intermediate_steps) In LangChain[​](#in-langchain-2) Setting this parameter on AgentExecutor allows users to access intermediate_steps, which pairs agent actions (e.g., tool invocations) with their outcomes.

```python
agent_executor = AgentExecutor(agent=agent, tools=tools, return_intermediate_steps=True)
result = agent_executor.invoke({"input": query})
print(result["intermediate_steps"])

```

```output
[(ToolAgentAction(tool=&#x27;magic_function&#x27;, tool_input={&#x27;input&#x27;: 3}, log="\nInvoking: `magic_function` with `{&#x27;input&#x27;: 3}`\n\n\n", message_log=[AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;index&#x27;: 0, &#x27;id&#x27;: &#x27;call_njTvl2RsVf4q1aMUxoYnJuK1&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":3}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;}, id=&#x27;run-c9dfe3ab-2db6-4592-851e-89e056aeab32&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: 3}, &#x27;id&#x27;: &#x27;call_njTvl2RsVf4q1aMUxoYnJuK1&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], tool_call_chunks=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: &#x27;{"input":3}&#x27;, &#x27;id&#x27;: &#x27;call_njTvl2RsVf4q1aMUxoYnJuK1&#x27;, &#x27;index&#x27;: 0, &#x27;type&#x27;: &#x27;tool_call_chunk&#x27;}])], tool_call_id=&#x27;call_njTvl2RsVf4q1aMUxoYnJuK1&#x27;), 5)]

``` In LangGraph[​](#in-langgraph-2) By default the [react agent executor](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent) in LangGraph appends all messages to the central state. Therefore, it is easy to see any intermediate steps by just looking at the full state.

```python
from langgraph.prebuilt import create_react_agent

langgraph_agent_executor = create_react_agent(model, tools=tools)

messages = langgraph_agent_executor.invoke({"messages": [("human", query)]})

messages

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
{&#x27;messages&#x27;: [HumanMessage(content=&#x27;what is the value of magic_function(3)?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;1abb52c2-4bc2-4d82-bd32-5a24c3976b0f&#x27;),
  AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_XfQD6C7rAalcmicQubkhJVFq&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":3}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 55, &#x27;total_tokens&#x27;: 69, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a20a4ee344&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-34f02786-5b5c-4bb1-bd9e-406c81944a24-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: 3}, &#x27;id&#x27;: &#x27;call_XfQD6C7rAalcmicQubkhJVFq&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 55, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 69, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}}),
  ToolMessage(content=&#x27;5&#x27;, name=&#x27;magic_function&#x27;, id=&#x27;cbc9fadf-1962-4ed7-b476-348c774652be&#x27;, tool_call_id=&#x27;call_XfQD6C7rAalcmicQubkhJVFq&#x27;),
  AIMessage(content=&#x27;The value of `magic_function(3)` is 5.&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 78, &#x27;total_tokens&#x27;: 92, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-547e03d2-872d-4008-a38d-b7f739a77df5-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 78, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 92, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}})]}

```**max_iterations[​](#max_iterations) In LangChain[​](#in-langchain-3) AgentExecutor implements a max_iterations parameter, allowing users to abort a run that exceeds a specified number of iterations.

```python
@tool
def magic_function(input: str) -> str:
    """Applies a magic function to an input."""
    return "Sorry, there was an error. Please try again."

tools = [magic_function]

```

```python
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant. Respond only in Spanish."),
        ("human", "{input}"),
        # Placeholders fill up a **list** of messages
        ("placeholder", "{agent_scratchpad}"),
    ]
)

agent = create_tool_calling_agent(model, tools, prompt)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=3,
)

agent_executor.invoke({"input": query})

```

```output
[1m> Entering new AgentExecutor chain...[0m
[32;1m[1;3mLo siento, no puedo decirte directamente el valor de `magic_function(3)`. Si deseas, puedo usar la función mágica para calcularlo. ¿Te gustaría que lo hiciera?[0m

[1m> Finished chain.[0m

```

```output
{&#x27;input&#x27;: &#x27;what is the value of magic_function(3)?&#x27;,
 &#x27;output&#x27;: &#x27;Lo siento, no puedo decirte directamente el valor de `magic_function(3)`. Si deseas, puedo usar la función mágica para calcularlo. ¿Te gustaría que lo hiciera?&#x27;}

``` In LangGraph[​](#in-langgraph-3) In LangGraph this is controlled via recursion_limit configuration parameter. Note that in AgentExecutor, an "iteration" includes a full turn of tool invocation and execution. In LangGraph, each step contributes to the recursion limit, so we will need to multiply by two (and add one) to get equivalent results. If the recursion limit is reached, LangGraph raises a specific exception type, that we can catch and manage similarly to AgentExecutor.

```python
from langgraph.errors import GraphRecursionError
from langgraph.prebuilt import create_react_agent

RECURSION_LIMIT = 2 * 3 + 1

langgraph_agent_executor = create_react_agent(model, tools=tools)

try:
    for chunk in langgraph_agent_executor.stream(
        {"messages": [("human", query)]},
        {"recursion_limit": RECURSION_LIMIT},
        stream_mode="values",
    ):
        print(chunk["messages"][-1])
except GraphRecursionError:
    print({"input": query, "output": "Agent stopped due to max iterations."})

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
content=&#x27;what is the value of magic_function(3)?&#x27; additional_kwargs={} response_metadata={} id=&#x27;c2489fe8-e69c-4163-876d-3cce26b28521&#x27;
content=&#x27;&#x27; additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_OyNTcO6SDAvZcBlIEknPRrTR&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":"3"}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None} response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 55, &#x27;total_tokens&#x27;: 69, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None} id=&#x27;run-b65504bb-fa23-4f8a-8d6c-7edb6d16e7ff-0&#x27; tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: &#x27;3&#x27;}, &#x27;id&#x27;: &#x27;call_OyNTcO6SDAvZcBlIEknPRrTR&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}] usage_metadata={&#x27;input_tokens&#x27;: 55, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 69, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}}
content=&#x27;Sorry, there was an error. Please try again.&#x27; name=&#x27;magic_function&#x27; id=&#x27;f00e0bff-54fe-4726-a1a7-127a59d8f7ed&#x27; tool_call_id=&#x27;call_OyNTcO6SDAvZcBlIEknPRrTR&#x27;
content="It seems there was an error when trying to compute the value of the magic function with input 3. Let&#x27;s try again." additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_Q020rQoJh4cnh8WglIMnDm4z&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":"3"}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None} response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 40, &#x27;prompt_tokens&#x27;: 88, &#x27;total_tokens&#x27;: 128, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None} id=&#x27;run-556d8cb2-b47a-4826-b17d-b520982c2475-0&#x27; tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: &#x27;3&#x27;}, &#x27;id&#x27;: &#x27;call_Q020rQoJh4cnh8WglIMnDm4z&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}] usage_metadata={&#x27;input_tokens&#x27;: 88, &#x27;output_tokens&#x27;: 40, &#x27;total_tokens&#x27;: 128, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}}
content=&#x27;Sorry, there was an error. Please try again.&#x27; name=&#x27;magic_function&#x27; id=&#x27;777212cd-8381-44db-9762-3f81951ea73e&#x27; tool_call_id=&#x27;call_Q020rQoJh4cnh8WglIMnDm4z&#x27;
content="It seems there is a persistent issue in computing the value of the magic function with the input 3. Unfortunately, I can&#x27;t provide the value at this time. If you have any other questions or need further assistance, feel free to ask!" additional_kwargs={&#x27;refusal&#x27;: None} response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 49, &#x27;prompt_tokens&#x27;: 150, &#x27;total_tokens&#x27;: 199, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None} id=&#x27;run-92ec0b90-bc8e-4851-9139-f1d976145ab7-0&#x27; usage_metadata={&#x27;input_tokens&#x27;: 150, &#x27;output_tokens&#x27;: 49, &#x27;total_tokens&#x27;: 199, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}}

```**max_execution_time[​](#max_execution_time) In LangChain[​](#in-langchain-4) AgentExecutor implements a max_execution_time parameter, allowing users to abort a run that exceeds a total time limit.

```python
import time

@tool
def magic_function(input: str) -> str:
    """Applies a magic function to an input."""
    time.sleep(2.5)
    return "Sorry, there was an error. Please try again."

tools = [magic_function]

agent = create_tool_calling_agent(model, tools, prompt)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_execution_time=2,
    verbose=True,
)

agent_executor.invoke({"input": query})

```

```output
[1m> Entering new AgentExecutor chain...[0m
[32;1m[1;3mLo siento, no tengo la capacidad de evaluar directamente una función llamada "magic_function" con el valor 3. Sin embargo, si me proporcionas más detalles sobre qué hace la función o cómo está definida, podría intentar ayudarte a comprender su comportamiento o resolverlo de otra manera.[0m

[1m> Finished chain.[0m

```

```output
{&#x27;input&#x27;: &#x27;what is the value of magic_function(3)?&#x27;,
 &#x27;output&#x27;: &#x27;Lo siento, no tengo la capacidad de evaluar directamente una función llamada "magic_function" con el valor 3. Sin embargo, si me proporcionas más detalles sobre qué hace la función o cómo está definida, podría intentar ayudarte a comprender su comportamiento o resolverlo de otra manera.&#x27;}

``` In LangGraph[​](#in-langgraph-4) With LangGraph&#x27;s react agent, you can control timeouts on two levels. You can set a step_timeout to bound each step**:

```python
from langgraph.prebuilt import create_react_agent

langgraph_agent_executor = create_react_agent(model, tools=tools)
# Set the max timeout for each step here
langgraph_agent_executor.step_timeout = 2

try:
    for chunk in langgraph_agent_executor.stream({"messages": [("human", query)]}):
        print(chunk)
        print("------")
except TimeoutError:
    print({"input": query, "output": "Agent stopped due to a step timeout."})

```**API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
{&#x27;agent&#x27;: {&#x27;messages&#x27;: [AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_UuxSgpGaqzX84sNlKzCVOiRO&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":"3"}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 55, &#x27;total_tokens&#x27;: 69, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-24c94cbd-2962-48cf-a447-af888eb6ef86-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: &#x27;3&#x27;}, &#x27;id&#x27;: &#x27;call_UuxSgpGaqzX84sNlKzCVOiRO&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 55, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 69, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}})]}}
------
{&#x27;input&#x27;: &#x27;what is the value of magic_function(3)?&#x27;, &#x27;output&#x27;: &#x27;Agent stopped due to a step timeout.&#x27;}

```**The other way to set a single max timeout for an entire run is to directly use the python stdlib [asyncio](https://docs.python.org/3/library/asyncio.html) library.

```python
import asyncio

from langgraph.prebuilt import create_react_agent

langgraph_agent_executor = create_react_agent(model, tools=tools)

async def stream(langgraph_agent_executor, inputs):
    async for chunk in langgraph_agent_executor.astream(
        {"messages": [("human", query)]}
    ):
        print(chunk)
        print("------")

try:
    task = asyncio.create_task(
        stream(langgraph_agent_executor, {"messages": [("human", query)]})
    )
    await asyncio.wait_for(task, timeout=3)
except asyncio.TimeoutError:
    print("Task Cancelled.")

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
{&#x27;agent&#x27;: {&#x27;messages&#x27;: [AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_km17xvoY7wJ5yNnXhb5V9D3I&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":"3"}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 55, &#x27;total_tokens&#x27;: 69, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_45c6de4934&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-b44a04e5-9b68-4020-be36-98de1593eefc-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: &#x27;3&#x27;}, &#x27;id&#x27;: &#x27;call_km17xvoY7wJ5yNnXhb5V9D3I&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 55, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 69, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}})]}}
------
Task Cancelled.

```**early_stopping_method[​](#early_stopping_method) In LangChain[​](#in-langchain-5) With LangChain&#x27;s [AgentExecutor](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor.iter), you could configure an [early_stopping_method](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor.early_stopping_method) to either return a string saying "Agent stopped due to iteration limit or time limit." ("force") or prompt the LLM a final time to respond ("generate").

```python
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        ("human", "{input}"),
        # Placeholders fill up a **list** of messages
        ("placeholder", "{agent_scratchpad}"),
    ]
)

@tool
def magic_function(input: int) -> int:
    """Applies a magic function to an input."""
    return "Sorry there was an error, please try again."

tools = [magic_function]

agent = create_tool_calling_agent(model, tools, prompt=prompt)
agent_executor = AgentExecutor(
    agent=agent, tools=tools, early_stopping_method="force", max_iterations=1
)

result = agent_executor.invoke({"input": query})
print("Output with early_stopping_method=&#x27;force&#x27;:")
print(result["output"])

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
Output with early_stopping_method=&#x27;force&#x27;:
Agent stopped due to max iterations.

```**In LangGraph[​](#in-langgraph-5) In LangGraph, you can explicitly handle the response behavior outside the agent, since the full state can be accessed.

```python
from langgraph.errors import GraphRecursionError
from langgraph.prebuilt import create_react_agent

RECURSION_LIMIT = 2 * 1 + 1

langgraph_agent_executor = create_react_agent(model, tools=tools)

try:
    for chunk in langgraph_agent_executor.stream(
        {"messages": [("human", query)]},
        {"recursion_limit": RECURSION_LIMIT},
        stream_mode="values",
    ):
        print(chunk["messages"][-1])
except GraphRecursionError:
    print({"input": query, "output": "Agent stopped due to max iterations."})

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
content=&#x27;what is the value of magic_function(3)?&#x27; additional_kwargs={} response_metadata={} id=&#x27;81fd2e50-1e6a-4871-87aa-b7c1225913a4&#x27;
content=&#x27;&#x27; additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_aaEzj3aO1RTnB0uoc9rYUIhi&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":3}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None} response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 55, &#x27;total_tokens&#x27;: 69, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None} id=&#x27;run-476bc4b1-b7bf-4607-a31c-ddf09dc814c5-0&#x27; tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: 3}, &#x27;id&#x27;: &#x27;call_aaEzj3aO1RTnB0uoc9rYUIhi&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}] usage_metadata={&#x27;input_tokens&#x27;: 55, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 69, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}}
content=&#x27;Sorry there was an error, please try again.&#x27; name=&#x27;magic_function&#x27; id=&#x27;dcbe7e3e-0ed4-467d-a729-2f45916ff44f&#x27; tool_call_id=&#x27;call_aaEzj3aO1RTnB0uoc9rYUIhi&#x27;
content="It seems there was an error when trying to compute the value of `magic_function(3)`. Let&#x27;s try that again." additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_jr4R8uJn2pdXF5GZC2Dg3YWS&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"input":3}&#x27;, &#x27;name&#x27;: &#x27;magic_function&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None} response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 40, &#x27;prompt_tokens&#x27;: 87, &#x27;total_tokens&#x27;: 127, &#x27;completion_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;reasoning_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: None, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-08-06&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_a7d06e42a7&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None} id=&#x27;run-d94b8932-6e9e-4ab1-99f7-7dca89887ffe-0&#x27; tool_calls=[{&#x27;name&#x27;: &#x27;magic_function&#x27;, &#x27;args&#x27;: {&#x27;input&#x27;: 3}, &#x27;id&#x27;: &#x27;call_jr4R8uJn2pdXF5GZC2Dg3YWS&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}] usage_metadata={&#x27;input_tokens&#x27;: 87, &#x27;output_tokens&#x27;: 40, &#x27;total_tokens&#x27;: 127, &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;reasoning&#x27;: 0}}
{&#x27;input&#x27;: &#x27;what is the value of magic_function(3)?&#x27;, &#x27;output&#x27;: &#x27;Agent stopped due to max iterations.&#x27;}

```**trim_intermediate_steps[​](#trim_intermediate_steps) In LangChain[​](#in-langchain-6) With LangChain&#x27;s [AgentExecutor](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor), you could trim the intermediate steps of long-running agents using [trim_intermediate_steps](https://python.langchain.com/api_reference/langchain/agents/langchain.agents.agent.AgentExecutor.html#langchain.agents.agent.AgentExecutor.trim_intermediate_steps), which is either an integer (indicating the agent should keep the last N steps) or a custom function. For instance, we could trim the value so the agent only sees the most recent intermediate step.

```python
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        ("human", "{input}"),
        # Placeholders fill up a **list** of messages
        ("placeholder", "{agent_scratchpad}"),
    ]
)

magic_step_num = 1

@tool
def magic_function(input: int) -> int:
    """Applies a magic function to an input."""
    global magic_step_num
    print(f"Call number: {magic_step_num}")
    magic_step_num += 1
    return input + magic_step_num

tools = [magic_function]

agent = create_tool_calling_agent(model, tools, prompt=prompt)

def trim_steps(steps: list):
    # Let&#x27;s give the agent amnesia
    return []

agent_executor = AgentExecutor(
    agent=agent, tools=tools, trim_intermediate_steps=trim_steps
)

query = "Call the magic function 4 times in sequence with the value 3. You cannot call it multiple times at once."

for step in agent_executor.stream({"input": query}):
    pass

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
Call number: 1
Call number: 2
Call number: 3
Call number: 4
Call number: 5
Call number: 6
Call number: 7
Call number: 8
Call number: 9
Call number: 10
Call number: 11
Call number: 12
Call number: 13
Call number: 14
``````output
Stopping agent prematurely due to triggering stop condition
``````output
Call number: 15

```**In LangGraph[​](#in-langgraph-6) We can use the [prompt](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent) just as before when passing in [prompt templates](#prompt-templates).

```python
from langgraph.errors import GraphRecursionError
from langgraph.prebuilt import create_react_agent
from langgraph.prebuilt.chat_agent_executor import AgentState

magic_step_num = 1

@tool
def magic_function(input: int) -> int:
    """Applies a magic function to an input."""
    global magic_step_num
    print(f"Call number: {magic_step_num}")
    magic_step_num += 1
    return input + magic_step_num

tools = [magic_function]

def _modify_state_messages(state: AgentState):
    # Give the agent amnesia, only keeping the original user query
    return [("system", "You are a helpful assistant"), state["messages"][0]]

langgraph_agent_executor = create_react_agent(
    model, tools, prompt=_modify_state_messages
)

try:
    for step in langgraph_agent_executor.stream(
        {"messages": [("human", query)]}, stream_mode="updates"
    ):
        pass
except GraphRecursionError as e:
    print("Stopping agent prematurely due to triggering stop condition")

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)

```output
Call number: 1
Call number: 2
Call number: 3
Call number: 4
Call number: 5
Call number: 6
Call number: 7
Call number: 8
Call number: 9
Call number: 10
Call number: 11
Call number: 12
Stopping agent prematurely due to triggering stop condition

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to migrate your LangChain agent executors to LangGraph. Next, check out other [LangGraph how-to guides](https://langchain-ai.github.io/langgraph/how-tos/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/migrate_agent.ipynb)[Basic Usage](#basic-usage)
- [Prompt Templates](#prompt-templates)
- [Memory](#memory)[In LangChain](#in-langchain)
- [In LangGraph](#in-langgraph)

- [Iterating through steps](#iterating-through-steps)[In LangChain](#in-langchain-1)
- [In LangGraph](#in-langgraph-1)

- [return_intermediate_steps](#return_intermediate_steps)[In LangChain](#in-langchain-2)
- [In LangGraph](#in-langgraph-2)

- [max_iterations](#max_iterations)[In LangChain](#in-langchain-3)
- [In LangGraph](#in-langgraph-3)

- [max_execution_time](#max_execution_time)[In LangChain](#in-langchain-4)
- [In LangGraph](#in-langgraph-4)

- [early_stopping_method](#early_stopping_method)[In LangChain](#in-langchain-5)
- [In LangGraph](#in-langgraph-5)

- [trim_intermediate_steps](#trim_intermediate_steps)[In LangChain](#in-langchain-6)
- [In LangGraph](#in-langgraph-6)

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