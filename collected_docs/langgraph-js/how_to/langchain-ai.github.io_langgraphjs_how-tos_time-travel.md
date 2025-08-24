- How to view and update past graph state **[Skip to content](#how-to-view-and-update-past-graph-state) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [Get State](#get-state) [Set up the model](#set-up-the-model) [Define the graph](#define-the-graph) [Get State](#get-state_1) [Interacting with the Agent](#interacting-with-the-agent) [Let's get it to execute a tool](#lets-get-it-to-execute-a-tool_1) [Get State](#get-state_2) [Resume](#resume) [Check full history](#check-full-history) [Replay a past state](#replay-a-past-state) [Branch off a past state](#branch-off-a-past-state) [Review Tool Calls](../review-tool-calls/) [How to review tool calls (Functional API)](../review-tool-calls-functional/) [Streaming](../../how-tos#streaming) [Tool calling](../../how-tos#tool-calling) [Subgraphs](../../how-tos#subgraphs) [Multi-agent](../multi-agent-network/) [State Management](../../how-tos#state-management) [Other](../../how-tos#other) [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent) [LangGraph Platform](../../how-tos#langgraph-platform) [Concepts](../../concepts/) [Tutorials](../../tutorials/) Resources [Agents](../../agents/overview/) [API reference](../../reference/) [Versions](../../versions/) [Get State](#get-state) [Set up the model](#set-up-the-model) [Define the graph](#define-the-graph) [Get State](#get-state_1) [Interacting with the Agent](#interacting-with-the-agent) [Let's get it to execute a tool](#lets-get-it-to-execute-a-tool_1) [Get State](#get-state_2) [Resume](#resume) [Check full history](#check-full-history) [Replay a past state](#replay-a-past-state) [Branch off a past state](#branch-off-a-past-state) [How to view and update past graph state¶](#how-to-view-and-update-past-graph-state) Prerequisites This guide assumes familiarity with the following concepts: [Time Travel](/langgraphjs/concepts/time-travel) [Breakpoints](/langgraphjs/concepts/breakpoints) [LangGraph Glossary](/langgraphjs/concepts/low_level) Once you start [checkpointing](./persistence.ipynb) your graphs, you can easily get** or **update** the state of the agent at any point in time. This permits a few things: You can surface a state during an interrupt to a user to let them accept an action.

- You can **rewind** the graph to reproduce or avoid issues.

- You can **modify** the state to embed your agent into a larger system, or to let the user better control its actions.

The key methods used for this functionality are:

- [getState](/langgraphjs/reference/classes/langgraph_pregel.Pregel.html#getState): fetch the values from the target config

- [updateState](/langgraphjs/reference/classes/langgraph_pregel.Pregel.html#updateState): apply the given values to the target state

**Note:** this requires passing in a checkpointer.

```
import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

```

## Set up the tools[¶](#set-up-the-tools)

We will first define the tools we want to use. For this simple example, we will use create a placeholder search engine. However, it is really easy to create your own tools - see documentation [here](https://js.langchain.com/docs/how_to/custom_tools) on how to do that.

```
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const searchTool = tool(async (_) => {
  // This is a placeholder for the actual implementation
  return "Cold, with a low of 13 ℃";
}, {
  name: "search",
  description:
    "Use to surf the web, fetch current information, check the weather, and retrieve other information.",
  schema: z.object({
    query: z.string().describe("The query to use in your search."),
  }),
});

await searchTool.invoke({ query: "What's the weather like?" });

const tools = [searchTool];

```

We can now wrap these tools in a simple [ToolNodee agent. Between interactions you can get and update state.](/langgraphjs/reference/classes/prebuilt.ToolNode.html)

```
let config = { configurable: { thread_id: "conversation-num-1" } };
let inputs = { messages: [{ role: "user", content: "Hi I'm Jo." }] } as any;
for await (
  const { messages } of await graph.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
Hi I'm Jo.
-----

Hello, Jo! How can I assist you today?
-----

``` See LangSmith example run here [https://smith.langchain.com/public/b3feb09b-bcd2-4ad5-ad1d-414106148448/r](https://smith.langchain.com/public/b3feb09b-bcd2-4ad5-ad1d-414106148448/r)

Here you can see the "agent" node ran, and then our edge returned `__end__` so the graph stopped execution there.

Let's check the current graph state.

```
let checkpoint = await graph.getState(config);
checkpoint.values;

```

```
{
  messages: [
    { role: 'user', content: "Hi I'm Jo." },
    AIMessage {
      "id": "chatcmpl-A3FGf3k3QQo9q0QjT6Oc5h1XplkHr",
      "content": "Hello, Jo! How can I assist you today?",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 12,
          "promptTokens": 68,
          "totalTokens": 80
        },
        "finish_reason": "stop",
        "system_fingerprint": "fp_fde2829a40"
      },
      "tool_calls": [],
      "invalid_tool_calls": []
    }
  ]
}

``` The current state is the two messages we've seen above, 1. the HumanMessage we sent in, 2. the AIMessage we got back from the model.

The `next` values are empty since the graph has terminated (transitioned to the `__end__`).

```
checkpoint.next;

```

```
[]

```

## Let's get it to execute a tool[¶](#lets-get-it-to-execute-a-tool)

When we call the graph again, it will create a checkpoint after each internal execution step. Let's get it to run a tool, then look at the checkpoint.

```
inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graph.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----
``````output
[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_ZtmtDOyEXDCnXDgowlit5dSd'
  }
]
-----

Cold, with a low of 13 ℃
-----

The current weather in San Francisco is cold, with a low of 13°C.
-----

``` See the trace of the above execution here: [https://smith.langchain.com/public/0ef426fd-0da1-4c02-a50b-64ae1e68338e/r](https://smith.langchain.com/public/0ef426fd-0da1-4c02-a50b-64ae1e68338e/r) We can see it planned the tool execution (ie the "agent" node), then "should_continue" edge returned "continue" so we proceeded to "action" node, which executed the tool, and then "agent" node emitted the final response, which made "should_continue" edge return "end". Let's see how we can have more control over this.

### Pause before tools[¶](#pause-before-tools)

If you notice below, we now will add `interruptBefore=["action"]` - this means that before any actions are taken we pause. This is a great moment to allow the user to correct and update the state! This is very useful when you want to have a human-in-the-loop to validate (and potentially change) the action to take.

```
memory = new MemorySaver();
const graphWithInterrupt = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["tools"],
});

inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graphWithInterrupt.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----

[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_OsKnTv2psf879eeJ9vx5GeoY'
  }
]
-----

```

## Get State[¶](#get-state)

You can fetch the latest graph checkpoint using [. This object will actually run the tools (functions) whenever they are invoked by our LLM.](/langgraphjs/reference/classes/langgraph.Pregel.html#getState)

```
import { ToolNode } from "@langchain/langgraph/prebuilt";

const toolNode = new ToolNode(tools);

```

## Set up the model[¶](#set-up-the-model)

Now we will load the [chat model](https://js.langchain.com/docs/concepts/chat_models/).

- It should work with messages. We will represent all agent state in the form of messages, so it needs to be able to work well with them.

- It should work with [tool calling](https://js.langchain.com/docs/how_to/tool_calling/#passing-tools-to-llms), meaning it can return function arguments in its response.

Notet state is the two messages we've seen above, 1. the HumanMessage we sent in, 2. the AIMessage we got back from the model. The `next` values are empty since the graph has terminated (transitioned to the `__end__`).

```
checkpoint.next;

```

```
[]

``` ## Let's get it to execute a tool When we call the graph again, it will create a checkpoint after each internal execution step. Let's get it to run a tool, then look at the checkpoint.

```
inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graph.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----
``````output
[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_ZtmtDOyEXDCnXDgowlit5dSd'
  }
]
-----

Cold, with a low of 13 ℃
-----

The current weather in San Francisco is cold, with a low of 13°C.
-----

``` See the trace of the above execution here: https://smith.langchain.com/public/0ef426fd-0da1-4c02-a50b-64ae1e68338e/r We can see it planned the tool execution (ie the "agent" node), then "should_continue" edge returned "continue" so we proceeded to "action" node, which executed the tool, and then "agent" node emitted the final response, which made "should_continue" edge return "end". Let's see how we can have more control over this. ### Pause before tools If you notice below, we now will add `interruptBefore=["action"]` - this means that before any actions are taken we pause. This is a great moment to allow the user to correct and update the state! This is very useful when you want to have a human-in-the-loop to validate (and potentially change) the action to take.

```
memory = new MemorySaver();
const graphWithInterrupt = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["tools"],
});

inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graphWithInterrupt.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----

[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_OsKnTv2psf879eeJ9vx5GeoY'
  }
]
-----

``` ## Get State You can fetch the latest graph checkpoint using [These model requirements are not general requirements for using LangGraph - they are just requirements for this one example. in, 2. the AIMessage we got back from the model. The `next` values are empty since the graph has terminated (transitioned to the `__end__`).

```
checkpoint.next;

```

```
[]

``` ## Let's get it to execute a tool When we call the graph again, it will create a checkpoint after each internal execution step. Let's get it to run a tool, then look at the checkpoint.

```
inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graph.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----
``````output
[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_ZtmtDOyEXDCnXDgowlit5dSd'
  }
]
-----

Cold, with a low of 13 ℃
-----

The current weather in San Francisco is cold, with a low of 13°C.
-----

``` See the trace of the above execution here: https://smith.langchain.com/public/0ef426fd-0da1-4c02-a50b-64ae1e68338e/r We can see it planned the tool execution (ie the "agent" node), then "should_continue" edge returned "continue" so we proceeded to "action" node, which executed the tool, and then "agent" node emitted the final response, which made "should_continue" edge return "end". Let's see how we can have more control over this. ### Pause before tools If you notice below, we now will add `interruptBefore=["action"]` - this means that before any actions are taken we pause. This is a great moment to allow the user to correct and update the state! This is very useful when you want to have a human-in-the-loop to validate (and potentially change) the action to take.

```
memory = new MemorySaver();
const graphWithInterrupt = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["tools"],
});

inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graphWithInterrupt.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----

[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_OsKnTv2psf879eeJ9vx5GeoY'
  }
]
-----

``` ## Get State You can fetch the latest graph checkpoint using The `next` values are empty since the graph has terminated (transitioned to the `__end__`).

```
checkpoint.next;

```

```
[]

``` ## Let's get it to execute a tool When we call the graph again, it will create a checkpoint after each internal execution step. Let's get it to run a tool, then look at the checkpoint.

```
inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graph.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----
``````output
[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_ZtmtDOyEXDCnXDgowlit5dSd'
  }
]
-----

Cold, with a low of 13 ℃
-----

The current weather in San Francisco is cold, with a low of 13°C.
-----

``` See the trace of the above execution here: https://smith.langchain.com/public/0ef426fd-0da1-4c02-a50b-64ae1e68338e/r We can see it planned the tool execution (ie the "agent" node), then "should_continue" edge returned "continue" so we proceeded to "action" node, which executed the tool, and then "agent" node emitted the final response, which made "should_continue" edge return "end". Let's see how we can have more control over this. ### Pause before tools If you notice below, we now will add `interruptBefore=["action"]` - this means that before any actions are taken we pause. This is a great moment to allow the user to correct and update the state! This is very useful when you want to have a human-in-the-loop to validate (and potentially change) the action to take.

```
memory = new MemorySaver();
const graphWithInterrupt = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["tools"],
});

inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graphWithInterrupt.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----

[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_OsKnTv2psf879eeJ9vx5GeoY'
  }
]
-----

``` ## Get State You can fetch the latest graph checkpoint using

```
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o" });

``` After we've done this, we should make sure the model knows that it has these tools available to call. We can do this by calling bindTools](/langgraphjs/reference/classes/langgraph.Pregel.html#getState).

```
const boundModel = model.bindTools(tools);

```

## Define the graph[¶](#define-the-graph)

We can now put it all together. Time travel requires a checkpointer to save the state - otherwise you wouldn't have anything go `get` or `update`. We will use the [MemorySaverhe tool, and then "agent" node emitted the final response, which made "should_continue" edge return "end". Let's see how we can have more control over this.](/langgraphjs/reference/classes/index.MemorySaver.html)

### Pause before tools[¶](#pause-before-tools_1)

If you notice below, we now will add `interruptBefore=["action"]` - this means that before any actions are taken we pause. This is a great moment to allow the user to correct and update the state! This is very useful when you want to have a human-in-the-loop to validate (and potentially change) the action to take.

```
memory = new MemorySaver();
const graphWithInterrupt = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["tools"],
});

inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graphWithInterrupt.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----

[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_OsKnTv2psf879eeJ9vx5GeoY'
  }
]
-----

```

## Get State[¶](#get-state_1)

You can fetch the latest graph checkpoint using [, which "saves" checkpoints in-memory.](/langgraphjs/reference/classes/langgraph.Pregel.html#getState)

```
import { END, START, StateGraph } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { MemorySaver } from "@langchain/langgraph";

const routeMessage = (state: typeof StateAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // If no tools are called, we can finish (respond to the user)
  if (!lastMessage?.tool_calls?.length) {
    return END;
  }
  // Otherwise if there is, we continue and call the tools
  return "tools";
};

const callModel = async (
  state: typeof StateAnnotation.State,
  config?: RunnableConfig,
): Promise<Partial<typeof StateAnnotation.State>> => {
  const { messages } = state;
  const response = await boundModel.invoke(messages, config);
  return { messages: [response] };
};

const workflow = new StateGraph(StateAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", routeMessage)
  .addEdge("tools", "agent");

// Here we only save in-memory
let memory = new MemorySaver();
const graph = workflow.compile({ checkpointer: memory });

```

## Interacting with the Agent[¶](#interacting-with-the-agent)

We can now interact with the agent. Between interactions you can get and update state.

```
let config = { configurable: { thread_id: "conversation-num-1" } };
let inputs = { messages: [{ role: "user", content: "Hi I'm Jo." }] } as any;
for await (
  const { messages } of await graph.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
Hi I'm Jo.
-----

Hello, Jo! How can I assist you today?
-----

``` See LangSmith example run here [https://smith.langchain.com/public/b3feb09b-bcd2-4ad5-ad1d-414106148448/r](https://smith.langchain.com/public/b3feb09b-bcd2-4ad5-ad1d-414106148448/r)

Here you can see the "agent" node ran, and then our edge returned `__end__` so the graph stopped execution there.

Let's check the current graph state.

```
let checkpoint = await graph.getState(config);
checkpoint.values;

```

```
{
  messages: [
    { role: 'user', content: "Hi I'm Jo." },
    AIMessage {
      "id": "chatcmpl-A3FGf3k3QQo9q0QjT6Oc5h1XplkHr",
      "content": "Hello, Jo! How can I assist you today?",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 12,
          "promptTokens": 68,
          "totalTokens": 80
        },
        "finish_reason": "stop",
        "system_fingerprint": "fp_fde2829a40"
      },
      "tool_calls": [],
      "invalid_tool_calls": []
    }
  ]
}

``` The current state is the two messages we've seen above, 1. the HumanMessage we sent in, 2. the AIMessage we got back from the model.

The `next` values are empty since the graph has terminated (transitioned to the `__end__`).

```
checkpoint.next;

```

```
[]

```

## Let's get it to execute a tool[¶](#lets-get-it-to-execute-a-tool_1)

When we call the graph again, it will create a checkpoint after each internal execution step. Let's get it to run a tool, then look at the checkpoint.

```
inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graph.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----
``````output
[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_ZtmtDOyEXDCnXDgowlit5dSd'
  }
]
-----

Cold, with a low of 13 ℃
-----

The current weather in San Francisco is cold, with a low of 13°C.
-----

``` See the trace of the above execution here: [https://smith.langchain.com/public/0ef426fd-0da1-4c02-a50b-64ae1e68338e/r](https://smith.langchain.com/public/0ef426fd-0da1-4c02-a50b-64ae1e68338e/r) We can see it planned the tool execution (ie the "agent" node), then "should_continue" edge returned "continue" so we proceeded to "action" node, which executed the tool, and then "agent" node emitted the final response, which made "should_continue" edge return "end". Let's see how we can have more control over this.

### Pause before tools[¶](#pause-before-tools_2)

If you notice below, we now will add `interruptBefore=["action"]` - this means that before any actions are taken we pause. This is a great moment to allow the user to correct and update the state! This is very useful when you want to have a human-in-the-loop to validate (and potentially change) the action to take.

```
memory = new MemorySaver();
const graphWithInterrupt = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["tools"],
});

inputs = { messages: [{ role: "user", content: "What's the weather like in SF currently?" }] } as any;
for await (
  const { messages } of await graphWithInterrupt.stream(inputs, {
    ...config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
What's the weather like in SF currently?
-----

[
  {
    name: 'search',
    args: { query: 'current weather in San Francisco' },
    type: 'tool_call',
    id: 'call_OsKnTv2psf879eeJ9vx5GeoY'
  }
]
-----

```

## Get State[¶](#get-state_2)

You can fetch the latest graph checkpoint using [getState(config)](/langgraphjs/reference/classes/langgraph.Pregel.html#getState).

```
let snapshot = await graphWithInterrupt.getState(config);
snapshot.next;

```

```
[ 'tools' ]

```

## Resume[¶](#resume)

You can resume by running the graph with a `null` input. The checkpoint is loaded, and with no new inputs, it will execute as if no interrupt had occurred.

```
for await (
  const { messages } of await graphWithInterrupt.stream(null, {
    ...snapshot.config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
Cold, with a low of 13 ℃
-----

Currently, it is cold in San Francisco, with a temperature around 13°C (55°F).
-----

```

## Check full history[¶](#check-full-history)

Let's browse the history of this thread, from newest to oldest.

```
let toReplay;
const states = await graphWithInterrupt.getStateHistory(config);
for await (const state of states) {
  console.log(state);
  console.log("--");
  if (state.values?.messages?.length === 2) {
    toReplay = state;
  }
}
if (!toReplay) {
  throw new Error("No state to replay");
}

```

```
{
  values: {
    messages: [
      [Object],
      AIMessage {
        "id": "chatcmpl-A3FGhKzOZs0GYZ2yalNOCQZyPgbcp",
        "content": "",
        "additional_kwargs": {
          "tool_calls": [
            {
              "id": "call_OsKnTv2psf879eeJ9vx5GeoY",
              "type": "function",
              "function": "[Object]"
            }
          ]
        },
        "response_metadata": {
          "tokenUsage": {
            "completionTokens": 17,
            "promptTokens": 72,
            "totalTokens": 89
          },
          "finish_reason": "tool_calls",
          "system_fingerprint": "fp_fde2829a40"
        },
        "tool_calls": [
          {
            "name": "search",
            "args": {
              "query": "current weather in San Francisco"
            },
            "type": "tool_call",
            "id": "call_OsKnTv2psf879eeJ9vx5GeoY"
          }
        ],
        "invalid_tool_calls": []
      },
      ToolMessage {
        "content": "Cold, with a low of 13 ℃",
        "name": "search",
        "additional_kwargs": {},
        "response_metadata": {},
        "tool_call_id": "call_OsKnTv2psf879eeJ9vx5GeoY"
      },
      AIMessage {
        "id": "chatcmpl-A3FGiYripPKtQLnAK1H3hWLSXQfOD",
        "content": "Currently, it is cold in San Francisco, with a temperature around 13°C (55°F).",
        "additional_kwargs": {},
        "response_metadata": {
          "tokenUsage": {
            "completionTokens": 21,
            "promptTokens": 105,
            "totalTokens": 126
          },
          "finish_reason": "stop",
          "system_fingerprint": "fp_fde2829a40"
        },
        "tool_calls": [],
        "invalid_tool_calls": []
      }
    ]
  },
  next: [],
  tasks: [],
  metadata: { source: 'loop', writes: { agent: [Object] }, step: 3 },
  config: {
    configurable: {
      thread_id: 'conversation-num-1',
      checkpoint_ns: '',
      checkpoint_id: '1ef69ab6-9c3a-6bd1-8003-d7f030ff72b2'
    }
  },
  createdAt: '2024-09-03T04:17:20.653Z',
  parentConfig: {
    configurable: {
      thread_id: 'conversation-num-1',
      checkpoint_ns: '',
      checkpoint_id: '1ef69ab6-9516-6200-8002-43d2c6dc603f'
    }
  }
}
--
{
  values: {
    messages: [
      [Object],
      AIMessage {
        "id": "chatcmpl-A3FGhKzOZs0GYZ2yalNOCQZyPgbcp",
        "content": "",
        "additional_kwargs": {
          "tool_calls": [
            {
              "id": "call_OsKnTv2psf879eeJ9vx5GeoY",
              "type": "function",
              "function": "[Object]"
            }
          ]
        },
        "response_metadata": {
          "tokenUsage": {
            "completionTokens": 17,
            "promptTokens": 72,
            "totalTokens": 89
          },
          "finish_reason": "tool_calls",
          "system_fingerprint": "fp_fde2829a40"
        },
        "tool_calls": [
          {
            "name": "search",
            "args": {
              "query": "current weather in San Francisco"
            },
            "type": "tool_call",
            "id": "call_OsKnTv2psf879eeJ9vx5GeoY"
          }
        ],
        "invalid_tool_calls": []
      },
      ToolMessage {
        "content": "Cold, with a low of 13 ℃",
        "name": "search",
        "additional_kwargs": {},
        "response_metadata": {},
        "tool_call_id": "call_OsKnTv2psf879eeJ9vx5GeoY"
      }
    ]
  },
  next: [ 'agent' ],
  tasks: [
    {
      id: '612efffa-3b16-530f-8a39-fd01c31e7b8b',
      name: 'agent',
      interrupts: []
    }
  ],
  metadata: { source: 'loop', writes: { tools: [Object] }, step: 2 },
  config: {
    configurable: {
      thread_id: 'conversation-num-1',
      checkpoint_ns: '',
      checkpoint_id: '1ef69ab6-9516-6200-8002-43d2c6dc603f'
    }
  },
  createdAt: '2024-09-03T04:17:19.904Z',
  parentConfig: {
    configurable: {
      thread_id: 'conversation-num-1',
      checkpoint_ns: '',
      checkpoint_id: '1ef69ab6-9455-6410-8001-1c78a97f63e6'
    }
  }
}
--
{
  values: {
    messages: [
      [Object],
      AIMessage {
        "id": "chatcmpl-A3FGhKzOZs0GYZ2yalNOCQZyPgbcp",
        "content": "",
        "additional_kwargs": {
          "tool_calls": [
            {
              "id": "call_OsKnTv2psf879eeJ9vx5GeoY",
              "type": "function",
              "function": "[Object]"
            }
          ]
        },
        "response_metadata": {
          "tokenUsage": {
            "completionTokens": 17,
            "promptTokens": 72,
            "totalTokens": 89
          },
          "finish_reason": "tool_calls",
          "system_fingerprint": "fp_fde2829a40"
        },
        "tool_calls": [
          {
            "name": "search",
            "args": {
              "query": "current weather in San Francisco"
            },
            "type": "tool_call",
            "id": "call_OsKnTv2psf879eeJ9vx5GeoY"
          }
        ],
        "invalid_tool_calls": []
      }
    ]
  },
  next: [ 'tools' ],
  tasks: [
    {
      id: '767116b0-55b6-5af4-8f74-ce45fb6e31ed',
      name: 'tools',
      interrupts: []
    }
  ],
  metadata: { source: 'loop', writes: { agent: [Object] }, step: 1 },
  config: {
    configurable: {
      thread_id: 'conversation-num-1',
      checkpoint_ns: '',
      checkpoint_id: '1ef69ab6-9455-6410-8001-1c78a97f63e6'
    }
  },
  createdAt: '2024-09-03T04:17:19.825Z',
  parentConfig: {
    configurable: {
      thread_id: 'conversation-num-1',
      checkpoint_ns: '',
      checkpoint_id: '1ef69ab6-8c4b-6261-8000-c51e5807fbcd'
    }
  }
}
--
{
  values: { messages: [ [Object] ] },
  next: [ 'agent' ],
  tasks: [
    {
      id: '5b0ed7d1-1bb7-5d78-b4fc-7a8ed40e7291',
      name: 'agent',
      interrupts: []
    }
  ],
  metadata: { source: 'loop', writes: null, step: 0 },
  config: {
    configurable: {
      thread_id: 'conversation-num-1',
      checkpoint_ns: '',
      checkpoint_id: '1ef69ab6-8c4b-6261-8000-c51e5807fbcd'
    }
  },
  createdAt: '2024-09-03T04:17:18.982Z',
  parentConfig: {
    configurable: {
      thread_id: 'conversation-num-1',
      checkpoint_ns: '',
      checkpoint_id: '1ef69ab6-8c4b-6260-ffff-6ec582916c42'
    }
  }
}
--
{
  values: {},
  next: [ '__start__' ],
  tasks: [
    {
      id: 'a4250d5c-d025-5da1-b588-cae2b3f4a8c7',
      name: '__start__',
      interrupts: []
    }
  ],
  metadata: { source: 'input', writes: { messages: [Array] }, step: -1 },
  config: {
    configurable: {
      thread_id: 'conversation-num-1',
      checkpoint_ns: '',
      checkpoint_id: '1ef69ab6-8c4b-6260-ffff-6ec582916c42'
    }
  },
  createdAt: '2024-09-03T04:17:18.982Z',
  parentConfig: undefined
}
--

```

## Replay a past state[¶](#replay-a-past-state)

To replay from this place we just need to pass its config back to the agent.

```
for await (
  const { messages } of await graphWithInterrupt.stream(null, {
    ...toReplay.config,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
Cold, with a low of 13 ℃
-----

The current weather in San Francisco is cold, with a low of 13°C.
-----

```

## Branch off a past state[¶](#branch-off-a-past-state)

Using LangGraph's checkpointing, you can do more than just replay past states. You can branch off previous locations to let the agent explore alternate trajectories or to let a user "version control" changes in a workflow.

#### First, update a previous checkpoint[¶](#first-update-a-previous-checkpoint)

Updating the state will create a **new** snapshot by applying the update to the previous checkpoint. Let's **add a tool message** to simulate calling the tool.

```
const tool_calls =
  toReplay.values.messages[toReplay.values.messages.length - 1].tool_calls;
const branchConfig = await graphWithInterrupt.updateState(
  toReplay.config,
  {
    messages: [
      { role: "tool", content: "It's sunny out, with a high of 38 ℃.", tool_call_id: tool_calls[0].id },
    ],
  },
  // Updates are applied "as if" they were coming from a node. By default,
  // the updates will come from the last node to run. In our case, we want to treat
  // this update as if it came from the tools node, so that the next node to run will be
  // the agent.
  "tools",
);

const branchState = await graphWithInterrupt.getState(branchConfig);
console.log(branchState.values);
console.log(branchState.next);

```

```
{
  messages: [
    {
      role: 'user',
      content: "What's the weather like in SF currently?"
    },
    AIMessage {
      "id": "chatcmpl-A3FGhKzOZs0GYZ2yalNOCQZyPgbcp",
      "content": "",
      "additional_kwargs": {
        "tool_calls": [
          {
            "id": "call_OsKnTv2psf879eeJ9vx5GeoY",
            "type": "function",
            "function": "[Object]"
          }
        ]
      },
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 17,
          "promptTokens": 72,
          "totalTokens": 89
        },
        "finish_reason": "tool_calls",
        "system_fingerprint": "fp_fde2829a40"
      },
      "tool_calls": [
        {
          "name": "search",
          "args": {
            "query": "current weather in San Francisco"
          },
          "type": "tool_call",
          "id": "call_OsKnTv2psf879eeJ9vx5GeoY"
        }
      ],
      "invalid_tool_calls": []
    },
    {
      role: 'tool',
      content: "It's sunny out, with a high of 38 ℃.",
      tool_call_id: 'call_OsKnTv2psf879eeJ9vx5GeoY'
    }
  ]
}
[ 'agent' ]

```

#### Now you can run from this branch[¶](#now-you-can-run-from-this-branch)

Just use the updated config (containing the new checkpoint ID). The trajectory will follow the new branch.

```
for await (
  const { messages } of await graphWithInterrupt.stream(null, {
    ...branchConfig,
    streamMode: "values",
  })
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  } else if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  } else {
    console.log(msg);
  }
  console.log("-----\n");
}

```

```
The current weather in San Francisco is sunny, with a high of 38°C.
-----

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)