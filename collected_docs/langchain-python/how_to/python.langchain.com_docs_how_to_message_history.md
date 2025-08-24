How to add message history | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/message_history.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/message_history.ipynb)How to add message history PrerequisitesThis guide assumes familiarity with the following concepts: [Chaining runnables](/docs/how_to/sequence/) [Prompt templates](/docs/concepts/prompt_templates/) [Chat Messages](/docs/concepts/messages/) [LangGraph persistence](https://langchain-ai.github.io/langgraph/how-tos/persistence/) noteThis guide previously covered the [RunnableWithMessageHistory](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.history.RunnableWithMessageHistory.html) abstraction. You can access this version of the guide in the [v0.2 docs](https://python.langchain.com/v0.2/docs/how_to/message_history/).As of the v0.3 release of LangChain, we recommend that LangChain users take advantage of [LangGraph persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/) to incorporate memory into new LangChain applications.If your code is already relying on RunnableWithMessageHistory or BaseChatMessageHistory, you do not** need to make any changes. We do not plan on deprecating this functionality in the near future as it works for simple chat applications and any code that uses RunnableWithMessageHistory will continue to work as expected.Please see [How to migrate to LangGraph Memory](/docs/versions/migrating_memory/) for more details. Passing conversation state into and out a chain is vital when building a chatbot. LangGraph implements a built-in persistence layer, allowing chain states to be automatically persisted in memory, or external backends such as SQLite, Postgres or Redis. Details can be found in the LangGraph [persistence documentation](https://langchain-ai.github.io/langgraph/how-tos/persistence/). In this guide we demonstrate how to add persistence to arbitrary LangChain runnables by wrapping them in a minimal LangGraph application. This lets us persist the message history and other elements of the chain&#x27;s state, simplifying the development of multi-turn applications. It also supports multiple threads, enabling a single application to interact separately with multiple users. ## Setup[​](#setup) Let&#x27;s initialize a chat model: Select [chat model](/docs/integrations/chat/):**Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` Example: message inputs[​](#example-message-inputs) Adding memory to a [chat model](/docs/concepts/chat_models/) provides a simple example. Chat models accept a list of messages as input and output a message. LangGraph includes a built-in MessagesState that we can use for this purpose. Below, we: Define the graph state to be a list of messages; Add a single node to the graph that calls a chat model; Compile the graph with an in-memory checkpointer to store messages between runs. infoThe output of a LangGraph application is its [state](https://langchain-ai.github.io/langgraph/concepts/low_level/). This can be any Python type, but in this context it will typically be a TypedDict that matches the schema of your runnable.

```python
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph

# Define a new graph
workflow = StateGraph(state_schema=MessagesState)

# Define the function that calls the model
def call_model(state: MessagesState):
    response = llm.invoke(state["messages"])
    # Update message history with response:
    return {"messages": response}

# Define the (single) node in the graph
workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

# Add memory
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [MemorySaver](https://langchain-ai.github.io/langgraph/reference/checkpoints/#langgraph.checkpoint.memory.MemorySaver) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) When we run the application, we pass in a configuration dict that specifies a thread_id. This ID is used to distinguish conversational threads (e.g., between different users).

```python
config = {"configurable": {"thread_id": "abc123"}}

```**We can then invoke the application:

```python
query = "Hi! I&#x27;m Bob."

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()  # output contains all messages in state

```

```output
==================================[1m Ai Message [0m==================================

It&#x27;s nice to meet you, Bob! I&#x27;m Claude, an AI assistant created by Anthropic. How can I help you today?

```

```python
query = "What&#x27;s my name?"

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()

```

```output
==================================[1m Ai Message [0m==================================

Your name is Bob, as you introduced yourself at the beginning of our conversation.

``` Note that states are separated for different threads. If we issue the same query to a thread with a new thread_id, the model indicates that it does not know the answer:

```python
query = "What&#x27;s my name?"
config = {"configurable": {"thread_id": "abc234"}}

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()

```

```output
==================================[1m Ai Message [0m==================================

I&#x27;m afraid I don&#x27;t actually know your name. As an AI assistant, I don&#x27;t have personal information about you unless you provide it to me directly.

``` Example: dictionary inputs[​](#example-dictionary-inputs) LangChain runnables often accept multiple inputs via separate keys in a single dict argument. A common example is a prompt template with multiple parameters. Whereas before our runnable was a chat model, here we chain together a prompt template and chat model.

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "Answer in {language}."),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

runnable = prompt | llm

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html) For this scenario, we define the graph state to include these parameters (in addition to the message history). We then define a single-node graph in the same way as before. Note that in the below state: Updates to the messages list will append messages;

- Updates to the language string will overwrite the string.

```python
from typing import Sequence

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict

class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    language: str

workflow = StateGraph(state_schema=State)

def call_model(state: State):
    response = runnable.invoke(state)
    # Update message history with response:
    return {"messages": [response]}

workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```**API Reference:**[BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [add_messages](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.message.add_messages)

```python
config = {"configurable": {"thread_id": "abc345"}}

input_dict = {
    "messages": [HumanMessage("Hi, I&#x27;m Bob.")],
    "language": "Spanish",
}
output = app.invoke(input_dict, config)
output["messages"][-1].pretty_print()

```**

```output
==================================[1m Ai Message [0m==================================

¡Hola, Bob! Es un placer conocerte.

``` Managing message history[​](#managing-message-history) The message history (and other elements of the application state) can be accessed via .get_state:

```python
state = app.get_state(config).values

print(f"Language: {state[&#x27;language&#x27;]}")
for message in state["messages"]:
    message.pretty_print()

```

```output
Language: Spanish
================================[1m Human Message [0m=================================

Hi, I&#x27;m Bob.
==================================[1m Ai Message [0m==================================

¡Hola, Bob! Es un placer conocerte.

``` We can also update the state via .update_state. For example, we can manually append a new message:

```python
from langchain_core.messages import HumanMessage

_ = app.update_state(config, {"messages": [HumanMessage("Test")]})

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```python
state = app.get_state(config).values

print(f"Language: {state[&#x27;language&#x27;]}")
for message in state["messages"]:
    message.pretty_print()

```

```output
Language: Spanish
================================[1m Human Message [0m=================================

Hi, I&#x27;m Bob.
==================================[1m Ai Message [0m==================================

¡Hola, Bob! Es un placer conocerte.
================================[1m Human Message [0m=================================

Test

``` For details on managing state, including deleting messages, see the LangGraph documentation:

- [How to delete messages](https://langchain-ai.github.io/langgraph/how-tos/memory/delete-messages/)

- [How to view and update past graph state](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/time-travel/)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/message_history.ipynb)

- [Setup](#setup)
- [Example: message inputs](#example-message-inputs)
- [Example: dictionary inputs](#example-dictionary-inputs)
- [Managing message history](#managing-message-history)

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