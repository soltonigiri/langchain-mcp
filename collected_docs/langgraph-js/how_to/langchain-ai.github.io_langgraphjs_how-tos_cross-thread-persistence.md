- How to add cross-thread persistence to your graph **[Skip to content](#how-to-add-cross-thread-persistence-to-your-graph) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [How to add cross-thread persistence (functional API)](../cross-thread-persistence-functional/) [How to use Postgres checkpointer for persistence](../persistence-postgres/) [Memory](../../how-tos#memory) [Human-in-the-loop](../../how-tos#human-in-the-loop) [Streaming](../../how-tos#streaming) [Tool calling](../../how-tos#tool-calling) [Subgraphs](../../how-tos#subgraphs) [Multi-agent](../multi-agent-network/) [State Management](../../how-tos#state-management) [Other](../../how-tos#other) [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent) [LangGraph Platform](../../how-tos#langgraph-platform) [Concepts](../../concepts/) [Tutorials](../../tutorials/) Resources [Agents](../../agents/overview/) [API reference](../../reference/) [Versions](../../versions/) [How to add cross-thread persistence to your graph¶](#how-to-add-cross-thread-persistence-to-your-graph) Prerequisites This guide assumes familiarity with the following: [Persistence](https://langchain-ai.github.io/langgraphjs/concepts/persistence/) [Memory](https://langchain-ai.github.io/langgraphjs/concepts/memory/) [Chat Models](https://js.langchain.com/docs/concepts/#chat-models) In the [previous guide](https://langchain-ai.github.io/langgraphjs/how-tos/persistence.ipynb) you learned how to persist graph state across multiple interactions on a single thread. LangGraph.js also allows you to persist data across multiple threads**. For instance, you can store information about users (their names or preferences) in a shared memory and reuse them in the new conversational threads. In this guide, we will show how to construct and use a graph that has a shared memory implemented using the [Store](https://langchain-ai.github.io/langgraphjs/reference/classes/checkpoint.BaseStore.html) interface. Note Support for the [Store](https://langchain-ai.github.io/langgraphjs/reference/classes/checkpoint.BaseStore.html) API that is used in this guide was added in LangGraph.js v0.2.10. ## Setup[¶](#setup) First, let's install the required packages and set our API keys. Set up [LangSmith](https://smith.langchain.com) for LangGraph development Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com).

```

```

```
// process.env.OPENAI_API_KEY = "sk_...";

// Optional, add tracing in LangSmith
// process.env.LANGCHAIN_API_KEY = "lsv2__...";
// process.env.ANTHROPIC_API_KEY = "your api key";
// process.env.LANGCHAIN_TRACING_V2 = "true";
// process.env.LANGCHAIN_PROJECT = "Cross-thread persistence: LangGraphJS";

``` ## Define store[¶](#define-store) In this example we will create a graph that will be able to retrieve information about a user's preferences. We will do so by defining an InMemoryStore - an object that can store data in memory and query that data. We will then pass the store object when compiling the graph. This allows each node in the graph to access the store: when you define node functions, you can define store keyword argument, and LangGraph will automatically pass the store object you compiled the graph with. When storing objects using the Store interface you define two things: the namespace for the object, a tuple (similar to directories)

- the object key (similar to filenames)

In our example, we'll be using `("memories", )` as namespace and random UUID as key for each new memory.

Importantly, to determine the user, we will be passing `userId` via the config keyword argument of the node function.

Let's first define an `InMemoryStore` which is already populated with some memories about the users.

```
import { InMemoryStore } from "@langchain/langgraph";

const inMemoryStore = new InMemoryStore();

```

## Create graph[¶](#create-graph)

```
import { v4 as uuidv4 } from "uuid";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseMessage } from "@langchain/core/messages";
import {
  Annotation,
  StateGraph,
  START,
  MemorySaver,
  LangGraphRunnableConfig,
  messagesStateReducer,
} from "@langchain/langgraph";

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
});

const model = new ChatAnthropic({ modelName: "claude-3-5-sonnet-20240620" });

// NOTE: we're passing the Store param to the node --
// this is the Store we compile the graph with
const callModel = async (
  state: typeof StateAnnotation.State,
  config: LangGraphRunnableConfig
): Promise<{ messages: any }> => {
  const store = config.store;
  if (!store) {
    if (!store) {
      throw new Error("store is required when compiling the graph");
    }
  }
  if (!config.configurable?.userId) {
    throw new Error("userId is required in the config");
  }
  const namespace = ["memories", config.configurable?.userId];
  const memories = await store.search(namespace);
  const info = memories.map((d) => d.value.data).join("\n");
  const systemMsg = `You are a helpful assistant talking to the user. User info: ${info}`;

  // Store new memories if the user asks the model to remember
  const lastMessage = state.messages[state.messages.length - 1];
  if (
    typeof lastMessage.content === "string" &&
    lastMessage.content.toLowerCase().includes("remember")
  ) {
    await store.put(namespace, uuidv4(), { data: lastMessage.content });
  }

  const response = await model.invoke([
    { type: "system", content: systemMsg },
    ...state.messages,
  ]);
  return { messages: response };
};

const builder = new StateGraph(StateAnnotation)
  .addNode("call_model", callModel)
  .addEdge(START, "call_model");

// NOTE: we're passing the store object here when compiling the graph
const graph = builder.compile({
  checkpointer: new MemorySaver(),
  store: inMemoryStore,
});
// If you're using LangGraph Cloud or LangGraph Studio, you don't need to pass the store or checkpointer when compiling the graph, since it's done automatically.

```

Note

If you're using LangGraph Cloud or LangGraph Studio, you **don't need** to pass store when compiling the graph, since it's done automatically.

## Run the graph![¶](#run-the-graph)

Now let's specify a user ID in the config and tell the model our name:

```
let config = { configurable: { thread_id: "1", userId: "1" } };
let inputMessage = { type: "user", content: "Hi! Remember: my name is Bob" };

for await (const chunk of await graph.stream(
  { messages: [inputMessage] },
  { ...config, streamMode: "values" }
)) {
  console.log(chunk.messages[chunk.messages.length - 1]);
}

```

```
HumanMessage {
  "id": "ef28a40a-fd75-4478-929a-5413f2a6b044",
  "content": "Hi! Remember: my name is Bob",
  "additional_kwargs": {},
  "response_metadata": {}
}
AIMessage {
  "id": "msg_01UcHJnSAuVDFuDmqaYkxWAf",
  "content": "Hello Bob! It's nice to meet you. I'll remember that your name is Bob. How can I assist you today?",
  "additional_kwargs": {
    "id": "msg_01UcHJnSAuVDFuDmqaYkxWAf",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-sonnet-20240620",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 28,
      "output_tokens": 29
    }
  },
  "response_metadata": {
    "id": "msg_01UcHJnSAuVDFuDmqaYkxWAf",
    "model": "claude-3-5-sonnet-20240620",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 28,
      "output_tokens": 29
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 28,
    "output_tokens": 29,
    "total_tokens": 57
  }
}

```

```
config = { configurable: { thread_id: "2", userId: "1" } };
inputMessage = { type: "user", content: "what is my name?" };

for await (const chunk of await graph.stream(
  { messages: [inputMessage] },
  { ...config, streamMode: "values" }
)) {
  console.log(chunk.messages[chunk.messages.length - 1]);
}

```

```
HumanMessage {
  "id": "eaaa4e1c-1560-4b0a-9c2d-396313cb000c",
  "content": "what is my name?",
  "additional_kwargs": {},
  "response_metadata": {}
}
AIMessage {
  "id": "msg_01VfqUerYCND1JuWGvbnAacP",
  "content": "Your name is Bob. It's nice to meet you, Bob!",
  "additional_kwargs": {
    "id": "msg_01VfqUerYCND1JuWGvbnAacP",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-sonnet-20240620",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 33,
      "output_tokens": 17
    }
  },
  "response_metadata": {
    "id": "msg_01VfqUerYCND1JuWGvbnAacP",
    "model": "claude-3-5-sonnet-20240620",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 33,
      "output_tokens": 17
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 33,
    "output_tokens": 17,
    "total_tokens": 50
  }
}

``` We can now inspect our in-memory store and verify that we have in fact saved the memories for the user:

```
const memories = await inMemoryStore.search(["memories", "1"]);
for (const memory of memories) {
    console.log(await memory.value);
}

```

```
{ data: 'Hi! Remember: my name is Bob' }

``` Let's now run the graph for another user to verify that the memories about the first user are self contained:

```
config = { configurable: { thread_id: "3", userId: "2" } };
inputMessage = { type: "user", content: "what is my name?" };

for await (const chunk of await graph.stream(
  { messages: [inputMessage] },
  { ...config, streamMode: "values" }
)) {
  console.log(chunk.messages[chunk.messages.length - 1]);
}

```

```
HumanMessage {
  "id": "1006b149-de8d-4d8e-81f4-c78c51a7144b",
  "content": "what is my name?",
  "additional_kwargs": {},
  "response_metadata": {}
}
AIMessage {
  "id": "msg_01MjpYZ65NjwZMYq42BWa2Ze",
  "content": "I apologize, but I don't have any information about your name or personal details. As an AI assistant, I don't have access to personal information about individual users unless it's specifically provided in our conversation. Is there something else I can help you with?",
  "additional_kwargs": {
    "id": "msg_01MjpYZ65NjwZMYq42BWa2Ze",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-sonnet-20240620",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 25,
      "output_tokens": 56
    }
  },
  "response_metadata": {
    "id": "msg_01MjpYZ65NjwZMYq42BWa2Ze",
    "model": "claude-3-5-sonnet-20240620",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 25,
      "output_tokens": 56
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 25,
    "output_tokens": 56,
    "total_tokens": 81
  }
}

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)