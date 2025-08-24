1. Build a basic chatbot

**[Skip to content](#build-a-basic-chatbot) Initializing search [GitHub](https://github.com/langchain-ai/langgraph) [2. Add tools](../2-add-tools/) [3. Add memory](../3-add-memory/) [4. Add human-in-the-loop](../4-human-in-the-loop/) [5. Customize state](../5-customize-state/) [6. Time travel](../6-time-travel/) [Run a local server](../../langgraph-platform/local-server/) General concepts [Guides](../../../guides/) [Reference](../../../reference/) [Examples](../../../examples/) [Additional resources](../../../additional-resources/) [](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/tutorials/get-started/1-build-basic-chatbot.md) Build a basic chatbot[¶](#build-a-basic-chatbot) In this tutorial, you will build a basic chatbot. This chatbot is the basis for the following series of tutorials where you will progressively add more sophisticated capabilities, and be introduced to key LangGraph concepts along the way. Let's dive in! 🌟 Prerequisites[¶](#prerequisites) Before you start this tutorial, ensure you have access to a LLM that supports tool-calling features, such as [OpenAI](https://platform.openai.com/api-keys), [Anthropic](https://console.anthropic.com/settings/keys), or [Google Gemini](https://ai.google.dev/gemini-api/docs/api-key). 1. Install packages[¶](#1-install-packages) Install the required packages:

```
pip install -U langgraph langsmith

``` Tip Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph. For more information on how to get started, see [LangSmith docs](https://docs.smith.langchain.com). 2. Create a StateGraph[¶](#2-create-a-stategraph) Now you can create a basic chatbot using LangGraph. This chatbot will respond directly to user messages. Start by creating a StateGraph. A StateGraph object defines the structure of our chatbot as a "state machine". We'll add nodes to represent the llm and functions our chatbot can call and edges to specify how the bot should transition between these functions. API Reference: [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) | [START](https://langchain-ai.github.io/langgraph/reference/constants/#langgraph.constants.START) | [END](https://langchain-ai.github.io/langgraph/reference/constants/#langgraph.constants.END) | [add_messages](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.message.add_messages)

```
from typing import Annotated

from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

class State(TypedDict):
    # Messages have the type "list". The `add_messages` function
    # in the annotation defines how this state key should be updated
    # (in this case, it appends messages to the list, rather than overwriting them)
    messages: Annotated[list, add_messages]

graph_builder = StateGraph(State)

``` Our graph can now handle two key tasks: Each node can receive the current State as input and output an update to the state. Updates to messages will be appended to the existing list rather than overwriting it, thanks to the prebuilt reducer function. Concept When defining a graph, the first step is to define its State. The State includes the graph's schema and [reducer functions](https://langchain-ai.github.io/langgraph/concepts/low_level/#reducers) that handle state updates. In our example, State is a schema with one key: messages. The reducer function is used to append new messages to the list instead of overwriting it. Keys without a reducer annotation will overwrite previous values. To learn more about state, reducers, and related concepts, see [LangGraph reference docs](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.message.add_messages). 3. Add a node[¶](#3-add-a-node) Next, add a "chatbot" node. Nodes** represent units of work and are typically regular functions.

Let's first select a chat model:

*OpenAIAnthropicAzureGoogle GeminiAWS Bedrock

```
pip install -U "langchain[openai]"

```

```
import os
from langchain.chat_models import init_chat_model

os.environ["OPENAI_API_KEY"] = "sk-..."

llm = init_chat_model("openai:gpt-4.1")

``` 👉 Read the [OpenAI integration docs](https://python.langchain.com/docs/integrations/chat/openai/)

```
pip install -U "langchain[anthropic]"

```

```
import os
from langchain.chat_models import init_chat_model

os.environ["ANTHROPIC_API_KEY"] = "sk-..."

llm = init_chat_model("anthropic:claude-3-5-sonnet-latest")

``` 👉 Read the [Anthropic integration docs](https://python.langchain.com/docs/integrations/chat/anthropic/)

```
pip install -U "langchain[openai]"

```

```
import os
from langchain.chat_models import init_chat_model

os.environ["AZURE_OPENAI_API_KEY"] = "..."
os.environ["AZURE_OPENAI_ENDPOINT"] = "..."
os.environ["OPENAI_API_VERSION"] = "2025-03-01-preview"

llm = init_chat_model(
    "azure_openai:gpt-4.1",
    azure_deployment=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
)

``` 👉 Read the [Azure integration docs](https://python.langchain.com/docs/integrations/chat/azure_chat_openai/)

```
pip install -U "langchain[google-genai]"

```

```
import os
from langchain.chat_models import init_chat_model

os.environ["GOOGLE_API_KEY"] = "..."

llm = init_chat_model("google_genai:gemini-2.0-flash")

``` 👉 Read the [Google GenAI integration docs](https://python.langchain.com/docs/integrations/chat/google_generative_ai/)

```
pip install -U "langchain[aws]"

```

```
from langchain.chat_models import init_chat_model

# Follow the steps here to configure your credentials:
# https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html

llm = init_chat_model(
    "anthropic.claude-3-5-sonnet-20240620-v1:0",
    model_provider="bedrock_converse",
)

``` 👉 Read the [AWS Bedrock integration docs](https://python.langchain.com/docs/integrations/chat/bedrock/) API Reference: [init_chat_model](https://python.langchain.com/api_reference/langchain/chat_models/langchain.chat_models.base.init_chat_model.html)*

```
from langchain.chat_models import init_chat_model

llm = init_chat_model("anthropic:claude-3-5-sonnet-latest")

```
-->

We can now incorporate the chat model into a simple node:

```
def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

# The first argument is the unique node name
# The second argument is the function or object that will be called whenever
# the node is used.
graph_builder.add_node("chatbot", chatbot)

```

**Notice** how the `chatbot` node function takes the current `State` as input and returns a dictionary containing an updated `messages` list under the key "messages". This is the basic pattern for all LangGraph node functions.

The `add_messages` function in our `State` will append the LLM's response messages to whatever messages are already in the state.

## 4. Add an entry point[¶](#4-add-an-entry-point)

Add an `entry` point to tell the graph **where to start its work** each time it is run:

```
graph_builder.add_edge(START, "chatbot")

```

## 5. Add an exit point[¶](#5-add-an-exit-point)

Add an `exit` point to indicate **where the graph should finish execution**. This is helpful for more complex flows, but even in a simple graph like this, adding an end node improves clarity.

```
graph_builder.add_edge("chatbot", END)

```

This tells the graph to terminate after running the chatbot node.

## 6. Compile the graph[¶](#6-compile-the-graph)

Before running the graph, we'll need to compile it. We can do so by calling `compile()` on the graph builder. This creates a `CompiledGraph` we can invoke on our state.

```
graph = graph_builder.compile()

```

## 7. Visualize the graph (optional)[¶](#7-visualize-the-graph-optional)

You can visualize the graph using the `get_graph` method and one of the "draw" methods, like `draw_ascii` or `draw_png`. The `draw` methods each require additional dependencies.

```
from IPython.display import Image, display

try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception:
    # This requires some extra dependencies and is optional
    pass

```

![basic chatbot diagram ](../basic-chatbot.png)

## 8. Run the chatbot[¶](#8-run-the-chatbot)

Now run the chatbot!

Tip

You can exit the chat loop at any time by typing `quit`, `exit`, or `q`.

```
def stream_graph_updates(user_input: str):
    for event in graph.stream({"messages": [{"role": "user", "content": user_input}]}):
        for value in event.values():
            print("Assistant:", value["messages"][-1].content)

while True:
    try:
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        stream_graph_updates(user_input)
    except:
        # fallback if input() is not available
        user_input = "What do you know about LangGraph?"
        print("User: " + user_input)
        stream_graph_updates(user_input)
        break

```

```
Assistant: LangGraph is a library designed to help build stateful multi-agent applications using language models. It provides tools for creating workflows and state machines to coordinate multiple AI agents or language model interactions. LangGraph is built on top of LangChain, leveraging its components while adding graph-based coordination capabilities. It's particularly useful for developing more complex, stateful AI applications that go beyond simple query-response interactions.

```

```
Goodbye!

```

**Congratulations!** You've built your first chatbot using LangGraph. This bot can engage in basic conversation by taking user input and generating responses using an LLM. You can inspect a [LangSmith Trace](https://smith.langchain.com/public/7527e308-9502-4894-b347-f34385740d5a/r) for the call above.

Below is the full code for this tutorial:

*API Reference: [init_chat_model](https://python.langchain.com/api_reference/langchain/chat_models/langchain.chat_models.base.init_chat_model.html) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) | [START](https://langchain-ai.github.io/langgraph/reference/constants/#langgraph.constants.START) | [END](https://langchain-ai.github.io/langgraph/reference/constants/#langgraph.constants.END) | [add_messages](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.message.add_messages)*

```
from typing import Annotated

from langchain.chat_models import init_chat_model
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]

graph_builder = StateGraph(State)

llm = init_chat_model("anthropic:claude-3-5-sonnet-latest")

def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

# The first argument is the unique node name
# The second argument is the function or object that will be called whenever
# the node is used.
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
graph = graph_builder.compile()

```

## Next steps[¶](#next-steps)

You may have noticed that the bot's knowledge is limited to what's in its training data. In the next part, we'll [add a web search tool](../2-add-tools/) to expand the bot's knowledge and make it more capable.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)