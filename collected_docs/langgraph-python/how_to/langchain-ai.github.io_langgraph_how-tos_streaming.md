- Stream outputs **[Skip to content](#stream-outputs) Initializing search [GitHub](https://github.com/langchain-ai/langgraph) LangGraph APIs Core capabilities [Stream from a workflow](#stream-from-a-workflow) [Stream custom data](#stream-custom-data) [Use with any LLM](#use-with-any-llm) [Disable streaming for specific chat models](#disable-streaming-for-specific-chat-models) [Async with Python [Persistence](../../concepts/persistence/) [Durable execution](../../concepts/durable_execution/) [Memory](../../concepts/memory/) [Context](../../agents/context/) [Models](../../agents/models/) [Tools](../../concepts/tools/) [Human-in-the-loop](../../concepts/human_in_the_loop/) [Time travel](../../concepts/time-travel/) [Subgraphs](../../concepts/subgraphs/) [Multi-agent](../../concepts/multi_agent/) [MCP](../../concepts/mcp/) [Tracing](../../concepts/tracing/) [Reference](../../reference/) [Examples](../../examples/) [Additional resources](../../additional-resources/) [Stream from a workflow](#stream-from-a-workflow) [Stream custom data](#stream-custom-data) [Use with any LLM](#use-with-any-llm) [Disable streaming for specific chat models](#disable-streaming-for-specific-chat-models) [Async with Python [](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/how-tos/streaming.md) Stream outputs[¶](#stream-outputs) You can [stream outputs](../../concepts/streaming/) from a LangGraph agent or workflow. Supported stream modes[¶](#supported-stream-modes) Pass one or more of the following stream modes as a list to the [stream()](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.CompiledStateGraph.stream) or [astream()](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.CompiledStateGraph.astream) methods: Mode Description values Streams the full value of the state after each step of the graph. updates Streams the updates to the state after each step of the graph. If multiple updates are made in the same step (e.g., multiple nodes are run), those updates are streamed separately. custom Streams custom data from inside your graph nodes. messages Streams 2-tuples (LLM token, metadata) from any graph nodes where an LLM is invoked. debug Streams as much information as possible throughout the execution of the graph. Stream from an agent[¶](#stream-from-an-agent) Agent progress[¶](#agent-progress) To stream agent progress, use the [stream()](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.CompiledStateGraph.stream) or [astream()](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.CompiledStateGraph.astream) methods with stream_mode="updates". This emits an event after every agent step. For example, if you have an agent that calls a tool once, you should see the following updates: LLM node**: AI message with tool call requests

- **Tool node**: Tool message with execution result

- **LLM node**: Final AI response

*SyncAsync

```
agent = create_react_agent(
    model="anthropic:claude-3-7-sonnet-latest",
    tools=[get_weather],
)
for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    stream_mode="updates"
):
    print(chunk)
    print("\n")

```

```
agent = create_react_agent(
    model="anthropic:claude-3-7-sonnet-latest",
    tools=[get_weather],
)
async for chunk in agent.astream(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    stream_mode="updates"
):
    print(chunk)
    print("\n")

``` LLM tokens[¶](#llm-tokens) To stream tokens as they are produced by the LLM, use stream_mode="messages": SyncAsync

```
agent = create_react_agent(
    model="anthropic:claude-3-7-sonnet-latest",
    tools=[get_weather],
)
for token, metadata in agent.stream(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    stream_mode="messages"
):
    print("Token", token)
    print("Metadata", metadata)
    print("\n")

```

```
agent = create_react_agent(
    model="anthropic:claude-3-7-sonnet-latest",
    tools=[get_weather],
)
async for token, metadata in agent.astream(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    stream_mode="messages"
):
    print("Token", token)
    print("Metadata", metadata)
    print("\n")

``` Tool updates[¶](#tool-updates) To stream updates from tools as they are executed, you can use [get_stream_writer](https://langchain-ai.github.io/langgraph/reference/config/#langgraph.config.get_stream_writer). SyncAsync

```
from langgraph.config import get_stream_writer

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    writer = get_stream_writer()
    # stream any arbitrary data
    writer(f"Looking up data for city: {city}")
    return f"It's always sunny in {city}!"

agent = create_react_agent(
    model="anthropic:claude-3-7-sonnet-latest",
    tools=[get_weather],
)

for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    stream_mode="custom"
):
    print(chunk)
    print("\n")

```

```
from langgraph.config import get_stream_writer

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    writer = get_stream_writer()
    # stream any arbitrary data
    writer(f"Looking up data for city: {city}")
    return f"It's always sunny in {city}!"

agent = create_react_agent(
    model="anthropic:claude-3-7-sonnet-latest",
    tools=[get_weather],
)

async for chunk in agent.astream(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    stream_mode="custom"
):
    print(chunk)
    print("\n")

``` Note If you add get_stream_writer inside your tool, you won't be able to invoke the tool outside of a LangGraph execution context. Stream multiple modes[¶](#stream-multiple-modes) You can specify multiple streaming modes by passing stream mode as a list: stream_mode=["updates", "messages", "custom"]: SyncAsync

```
agent = create_react_agent(
    model="anthropic:claude-3-7-sonnet-latest",
    tools=[get_weather],
)

for stream_mode, chunk in agent.stream(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    stream_mode=["updates", "messages", "custom"]
):
    print(chunk)
    print("\n")

```

```
agent = create_react_agent(
    model="anthropic:claude-3-7-sonnet-latest",
    tools=[get_weather],
)

async for stream_mode, chunk in agent.astream(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    stream_mode=["updates", "messages", "custom"]
):
    print(chunk)
    print("\n")

``` Disable streaming[¶](#disable-streaming) In some applications you might need to disable streaming of individual tokens for a given model. This is useful in [multi-agent](../../agents/multi-agent/) systems to control which agents stream their output. See the [Models](../../agents/models/#disable-streaming) guide to learn how to disable streaming. Stream from a workflow[¶](#stream-from-a-workflow) Basic usage example[¶](#basic-usage-example) LangGraph graphs expose the [.stream()](https://langchain-ai.github.io/langgraph/reference/pregel/#langgraph.pregel.Pregel.stream) (sync) and [.astream()](https://langchain-ai.github.io/langgraph/reference/pregel/#langgraph.pregel.Pregel.astream) (async) methods to yield streamed outputs as iterators. SyncAsync

```
for chunk in graph.stream(inputs, stream_mode="updates"):
    print(chunk)

```

```
async for chunk in graph.astream(inputs, stream_mode="updates"):
    print(chunk)

``` Extended example: streaming updates

```
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    topic: str
    joke: str

def refine_topic(state: State):
    return {"topic": state["topic"] + " and cats"}

def generate_joke(state: State):
    return {"joke": f"This is a joke about {state['topic']}"}

graph = (
    StateGraph(State)
    .add_node(refine_topic)
    .add_node(generate_joke)
    .add_edge(START, "refine_topic")
    .add_edge("refine_topic", "generate_joke")
    .add_edge("generate_joke", END)
    .compile()
)

for chunk in graph.stream( # (1)!
    {"topic": "ice cream"},
    stream_mode="updates", # (2)!
):
    print(chunk)

``` The stream() method returns an iterator that yields streamed outputs. Set stream_mode="updates" to stream only the updates to the graph state after each node. Other stream modes are also available. See [supported stream modes](#supported-stream-modes) for details. output {'refineTopic': {'topic': 'ice cream and cats'}} {'generateJoke': {'joke': 'This is a joke about ice cream and cats'}} | Stream multiple modes[¶](#stream-multiple-modes_1) You can pass a list as the stream_mode parameter to stream multiple modes at once. The streamed outputs will be tuples of (mode, chunk) where mode is the name of the stream mode and chunk is the data streamed by that mode. SyncAsync

```
for mode, chunk in graph.stream(inputs, stream_mode=["updates", "custom"]):
    print(chunk)

```

```
async for mode, chunk in graph.astream(inputs, stream_mode=["updates", "custom"]):
    print(chunk)

``` Stream graph state[¶](#stream-graph-state) Use the stream modes updates and values to stream the state of the graph as it executes. updates streams the **updates** to the state after each step of the graph. values streams the **full value** of the state after each step of the graph. API Reference: [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) | [START](https://langchain-ai.github.io/langgraph/reference/constants/#langgraph.constants.START) | [END](https://langchain-ai.github.io/langgraph/reference/constants/#langgraph.constants.END)*

```
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
  topic: str
  joke: str

def refine_topic(state: State):
    return {"topic": state["topic"] + " and cats"}

def generate_joke(state: State):
    return {"joke": f"This is a joke about {state['topic']}"}

graph = (
  StateGraph(State)
  .add_node(refine_topic)
  .add_node(generate_joke)
  .add_edge(START, "refine_topic")
  .add_edge("refine_topic", "generate_joke")
  .add_edge("generate_joke", END)
  .compile()
)

```
*updatesvalues Use this to stream only the **state updates** returned by the nodes after each step. The streamed outputs include the name of the node as well as the update.

```
for chunk in graph.stream(
    {"topic": "ice cream"},
    stream_mode="updates",
):
    print(chunk)

``` Use this to stream the **full state** of the graph after each step.

```
for chunk in graph.stream(
    {"topic": "ice cream"},
    stream_mode="values",
):
    print(chunk)

``` Stream subgraph outputs[¶](#stream-subgraph-outputs) To include outputs from [subgraphs](../../concepts/subgraphs/) in the streamed outputs, you can set subgraphs=True in the .stream() method of the parent graph. This will stream outputs from both the parent graph and any subgraphs. The outputs will be streamed as tuples (namespace, data), where namespace is a tuple with the path to the node where a subgraph is invoked, e.g. ("parent_node:", "child_node:").

```
for chunk in graph.stream(
    {"foo": "foo"},
    subgraphs=True, # (1)!
    stream_mode="updates",
):
    print(chunk)

``` Set subgraphs=True to stream outputs from subgraphs. Extended example: streaming from subgraphs

```
from langgraph.graph import START, StateGraph
from typing import TypedDict

# Define subgraph
class SubgraphState(TypedDict):
    foo: str  # note that this key is shared with the parent graph state
    bar: str

def subgraph_node_1(state: SubgraphState):
    return {"bar": "bar"}

def subgraph_node_2(state: SubgraphState):
    return {"foo": state["foo"] + state["bar"]}

subgraph_builder = StateGraph(SubgraphState)
subgraph_builder.add_node(subgraph_node_1)
subgraph_builder.add_node(subgraph_node_2)
subgraph_builder.add_edge(START, "subgraph_node_1")
subgraph_builder.add_edge("subgraph_node_1", "subgraph_node_2")
subgraph = subgraph_builder.compile()

# Define parent graph
class ParentState(TypedDict):
    foo: str

def node_1(state: ParentState):
    return {"foo": "hi! " + state["foo"]}

builder = StateGraph(ParentState)
builder.add_node("node_1", node_1)
builder.add_node("node_2", subgraph)
builder.add_edge(START, "node_1")
builder.add_edge("node_1", "node_2")
graph = builder.compile()

for chunk in graph.stream(
    {"foo": "foo"},
    stream_mode="updates",
    subgraphs=True, # (1)!
):
    print(chunk)

``` Set subgraphs=True to stream outputs from subgraphs.

```
((), {'node_1': {'foo': 'hi! foo'}})
(('node_2:dfddc4ba-c3c5-6887-5012-a243b5b377c2',), {'subgraph_node_1': {'bar': 'bar'}})
(('node_2:dfddc4ba-c3c5-6887-5012-a243b5b377c2',), {'subgraph_node_2': {'foo': 'hi! foobar'}})
((), {'node_2': {'foo': 'hi! foobar'}})

``` **Note** that we are receiving not just the node updates, but we also the namespaces which tell us what graph (or subgraph) we are streaming from. Debugging[¶](#debug) Use the debug streaming mode to stream as much information as possible throughout the execution of the graph. The streamed outputs include the name of the node as well as the full state.

```
for chunk in graph.stream(
    {"topic": "ice cream"},
    stream_mode="debug",
):
    print(chunk)

``` LLM tokens[¶](#messages) Use the messages streaming mode to stream Large Language Model (LLM) outputs **token by token** from any part of your graph, including nodes, tools, subgraphs, or tasks. The streamed output from [messages mode](#supported-stream-modes) is a tuple (message_chunk, metadata) where: message_chunk: the token or message segment from the LLM. metadata: a dictionary containing details about the graph node and LLM invocation. **If your LLM is not available as a LangChain integration, you can stream its outputs using custom mode instead. See [use with any LLM](#use-with-any-llm) for details. Manual config required for async in Python Use get_stream_writer() to access the stream writer and emit custom data. Set stream_mode="custom" when calling .stream() or .astream() to get the custom data in the stream. You can combine multiple modes (e.g., ["updates", "custom"]), but at least one must be "custom". No get_stream_writer() in async for Python

```
from langgraph.config import get_stream_writer

def call_arbitrary_model(state):
    """Example node that calls an arbitrary model and streams the output"""
    writer = get_stream_writer() # (1)!
    # Assume you have a streaming client that yields chunks
    for chunk in your_custom_streaming_client(state["topic"]): # (2)!
        writer({"custom_llm_chunk": chunk}) # (3)!
    return {"result": "completed"}

graph = (
    StateGraph(State)
    .add_node(call_arbitrary_model)
    # Add other nodes and edges as needed
    .compile()
)

for chunk in graph.stream(
    {"topic": "cats"},
    stream_mode="custom", # (4)!
):
    # The chunk will contain the custom data streamed from the llm
    print(chunk)

```

- Get the stream writer to send custom data.

- Generate LLM tokens using your custom streaming client.

- Use the writer to send custom data to the stream.

- Set stream_mode="custom" to receive the custom data in the stream.

Extended example: streaming arbitrary chat model

```
import operator
import json

from typing import TypedDict
from typing_extensions import Annotated
from langgraph.graph import StateGraph, START

from openai import AsyncOpenAI

openai_client = AsyncOpenAI()
model_name = "gpt-4o-mini"

async def stream_tokens(model_name: str, messages: list[dict]):
    response = await openai_client.chat.completions.create(
        messages=messages, model=model_name, stream=True
    )
    role = None
    async for chunk in response:
        delta = chunk.choices[0].delta

        if delta.role is not None:
            role = delta.role

        if delta.content:
            yield {"role": role, "content": delta.content}

# this is our tool
async def get_items(place: str) -> str:
    """Use this tool to list items one might find in a place you're asked about."""
    writer = get_stream_writer()
    response = ""
    async for msg_chunk in stream_tokens(
        model_name,
        [
            {
                "role": "user",
                "content": (
                    "Can you tell me what kind of items "
                    f"i might find in the following place: '{place}'. "
                    "List at least 3 such items separating them by a comma. "
                    "And include a brief description of each item."
                ),
            }
        ],
    ):
        response += msg_chunk["content"]
        writer(msg_chunk)

    return response

class State(TypedDict):
    messages: Annotated[list[dict], operator.add]

# this is the tool-calling graph node
async def call_tool(state: State):
    ai_message = state["messages"][-1]
    tool_call = ai_message["tool_calls"][-1]

    function_name = tool_call["function"]["name"]
    if function_name != "get_items":
        raise ValueError(f"Tool {function_name} not supported")

    function_arguments = tool_call["function"]["arguments"]
    arguments = json.loads(function_arguments)

    function_response = await get_items(**arguments)
    tool_message = {
        "tool_call_id": tool_call["id"],
        "role": "tool",
        "name": function_name,
        "content": function_response,
    }
    return {"messages": [tool_message]}

graph = (
    StateGraph(State)
    .add_node(call_tool)
    .add_edge(START, "call_tool")
    .compile()
)

```

Let's invoke the graph with an AI message that includes a tool call:

```
inputs = {
    "messages": [
        {
            "content": None,
            "role": "assistant",
            "tool_calls": [
                {
                    "id": "1",
                    "function": {
                        "arguments": '{"place":"bedroom"}',
                        "name": "get_items",
                    },
                    "type": "function",
                }
            ],
        }
    ]
}

async for chunk in graph.astream(
    inputs,
    stream_mode="custom",
):
    print(chunk["content"], end="|", flush=True)

```

### Disable streaming for specific chat models[¶](#disable-streaming-for-specific-chat-models)

If your application mixes models that support streaming with those that do not, you may need to explicitly disable streaming for models that do not support it.

Set `disable_streaming=True` when initializing the model.

init_chat_modelchat model interface

```
from langchain.chat_models import init_chat_model

model = init_chat_model(
    "anthropic:claude-3-7-sonnet-latest",
    disable_streaming=True # (1)!
)

```

- Set disable_streaming=True to disable streaming for the chat model.

```
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="o1-preview", disable_streaming=True) # (1)!

```

- Set disable_streaming=True to disable streaming for the chat model.

### Async with Python In Python versions &lt; 3.11, [asyncio tasks](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task) do not support the `context` parameter.**This limits LangGraph ability to automatically propagate context, and affects LangGraph's streaming mechanisms in two key ways: You must** explicitly pass [RunnableConfig](https://python.langchain.com/docs/concepts/runnables/#runnableconfig) into async LLM calls (e.g., `ainvoke()`), as callbacks are not automatically propagated.

- You **cannot** use get_stream_writer() in async nodes or tools — you must pass a writer argument directly.

Extended example: async LLM call with manual config

```
from typing import TypedDict
from langgraph.graph import START, StateGraph
from langchain.chat_models import init_chat_model

llm = init_chat_model(model="openai:gpt-4o-mini")

class State(TypedDict):
    topic: str
    joke: str

async def call_model(state, config): # (1)!
    topic = state["topic"]
    print("Generating joke...")
    joke_response = await llm.ainvoke(
        [{"role": "user", "content": f"Write a joke about {topic}"}],
        config, # (2)!
    )
    return {"joke": joke_response.content}

graph = (
    StateGraph(State)
    .add_node(call_model)
    .add_edge(START, "call_model")
    .compile()
)

async for chunk, metadata in graph.astream(
    {"topic": "ice cream"},
    stream_mode="messages", # (3)!
):
    if chunk.content:
        print(chunk.content, end="|", flush=True)

```

- Accept config as an argument in the async node function.

- Pass config to llm.ainvoke() to ensure proper context propagation.

- Set stream_mode="messages" to stream LLM tokens.

Extended example: async custom streaming with stream writer

```
from typing import TypedDict
from langgraph.types import StreamWriter

class State(TypedDict):
      topic: str
      joke: str

async def generate_joke(state: State, writer: StreamWriter): # (1)!
      writer({"custom_key": "Streaming custom data while generating a joke"})
      return {"joke": f"This is a joke about {state['topic']}"}

graph = (
      StateGraph(State)
      .add_node(generate_joke)
      .add_edge(START, "generate_joke")
      .compile()
)

async for chunk in graph.astream(
      {"topic": "ice cream"},
      stream_mode="custom", # (2)!
):
      print(chunk)

```

- Add writer as an argument in the function signature of the async node or tool. LangGraph will automatically pass the stream writer to the function.

- Set stream_mode="custom" to receive the custom data in the stream.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)