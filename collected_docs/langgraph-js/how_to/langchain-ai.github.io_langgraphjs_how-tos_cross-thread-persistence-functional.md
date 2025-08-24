- How to add cross-thread persistence (functional API) **[Skip to content](#how-to-add-cross-thread-persistence-functional-api) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [How to use Postgres checkpointer for persistence](../persistence-postgres/) [Memory](../../how-tos#memory) [Human-in-the-loop](../../how-tos#human-in-the-loop) [Streaming](../../how-tos#streaming) [Tool calling](../../how-tos#tool-calling) [Subgraphs](../../how-tos#subgraphs) [Multi-agent](../multi-agent-network/) [State Management](../../how-tos#state-management) [Other](../../how-tos#other) [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent) [LangGraph Platform](../../how-tos#langgraph-platform) [Concepts](../../concepts/) [Tutorials](../../tutorials/) Resources [Agents](../../agents/overview/) [API reference](../../reference/) [Versions](../../versions/) [How to add cross-thread persistence (functional API)¶](#how-to-add-cross-thread-persistence-functional-api) Prerequisites This guide assumes familiarity with the following: [Functional API](../../concepts/functional_api/) [Persistence](../../concepts/persistence/) [Memory](../../concepts/memory/) [Chat Models](https://js.langchain.com/docs/concepts/chat_models/) LangGraph allows you to persist data across different [threads](../../concepts/persistence/#threads)**. For instance, you can store information about users (their names or preferences) in a shared (cross-thread) memory and reuse them in the new threads (e.g., new conversations). When using the [functional API](../../concepts/functional_api/), you can set it up to store and retrieve memories by using the [Store](/langgraphjs/reference/classes/checkpoint.BaseStore.html) interface: Create an instance of a Store

```
import { InMemoryStore } from "@langchain/langgraph";

const store = new InMemoryStore();

```

- Pass the store instance to the entrypoint() wrapper function. It will be passed to the workflow as config.store.

```
import { entrypoint } from "@langchain/langgraph";

const workflow = entrypoint({
  store,
  name: "myWorkflow",
}, async (input, config) => {
  const foo = await myTask({input, store: config.store});
  ...
});

```

In this guide, we will show how to construct and use a workflow that has a shared memory implemented using the [Store](/langgraphjs/reference/classes/checkpoint.BaseStore.html) interface.

Note

If you need to add cross-thread persistence to a `StateGraph`, check out this [how-to guide](../cross-thread-persistence).

## Setup[¶](#setup)

Note

This guide requires `@langchain/langgraph>=0.2.42`.

First, install the required dependencies for this example:

```
npm install @langchain/langgraph @langchain/openai @langchain/anthropic @langchain/core uuid

```

Next, we need to set API keys for Anthropic and OpenAI (the LLM and embeddings we will use):

```
process.env.OPENAI_API_KEY = "YOUR_API_KEY";
process.env.ANTHROPIC_API_KEY = "YOUR_API_KEY";

```

Set up [LangSmith](https://smith.langchain.com) for LangGraph development

Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com)

## Example: simple chatbot with long-term memory[¶](#example-simple-chatbot-with-long-term-memory)

### Define store[¶](#define-store)

In this example we will create a workflow that will be able to retrieve information about a user's preferences. We will do so by defining an `InMemoryStore` - an object that can store data in memory and query that data.

When storing objects using the `Store` interface you define two things:

- the namespace for the object, a tuple (similar to directories)

- the object key (similar to filenames)

In our example, we'll be using `["memories", ]` as namespace and random UUID as key for each new memory.

Let's first define our store:

```
import { InMemoryStore } from "@langchain/langgraph";
import { OpenAIEmbeddings } from "@langchain/openai";

const inMemoryStore = new InMemoryStore({
  index: {
    embeddings: new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    }),
    dims: 1536,
  },
});

```

### Create workflow[¶](#create-workflow)

Now let's create our workflow:

```
import { v4 } from "uuid";
import { ChatAnthropic } from "@langchain/anthropic";
import {
  entrypoint,
  task,
  MemorySaver,
  addMessages,
  type BaseStore,
  getStore,
} from "@langchain/langgraph";
import type { BaseMessage, BaseMessageLike } from "@langchain/core/messages";

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-latest",
});

const callModel = task("callModel", async (
  messages: BaseMessage[],
  memoryStore: BaseStore,
  userId: string
) => {
  const namespace = ["memories", userId];
  const lastMessage = messages.at(-1);
  if (typeof lastMessage?.content !== "string") {
    throw new Error("Received non-string message content.");
  }
  const memories = await memoryStore.search(namespace, {
    query: lastMessage.content,
  });
  const info = memories.map((memory) => memory.value.data).join("\n");
  const systemMessage = `You are a helpful assistant talking to the user. User info: ${info}`;

  // Store new memories if the user asks the model to remember
  if (lastMessage.content.toLowerCase().includes("remember")) {
    // Hard-coded for demo
    const memory = `Username is Bob`;
    await memoryStore.put(namespace, v4(), { data: memory });
  }
  const response = await model.invoke([
    {
      role: "system",
      content: systemMessage
    },
    ...messages
  ]);
  return response;
});

// NOTE: we're passing the store object here when creating a workflow via entrypoint()
const workflow = entrypoint({
  checkpointer: new MemorySaver(),
  store: inMemoryStore,
  name: "workflow",
}, async (params: {
  messages: BaseMessageLike[];
  userId: string;
}, config) => {
  const messages = addMessages([], params.messages)
  const response = await callModel(messages, config.store, params.userId);
  return entrypoint.final({
    value: response,
    save: addMessages(messages, response),
  });
});

```

The current store is passed in as part of the entrypoint's second argument, as `config.store`.

Note

If you're using LangGraph Cloud or LangGraph Studio, you **don't need** to pass store into the entrypoint, since it's done automatically.

### Run the workflow![¶](#run-the-workflow)

Now let's specify a user ID in the config and tell the model our name:

```
const config = {
  configurable: {
    thread_id: "1",
  },
  streamMode: "values" as const,
};

const inputMessage = {
  role: "user",
  content: "Hi! Remember: my name is Bob",
};

const stream = await workflow.stream({ messages: [inputMessage], userId: "1" }, config);

for await (const chunk of stream) {
  console.log(chunk);
}

```

```
AIMessage {
  "id": "msg_01U4xHvf4REPSCGWzpLeh1qJ",
  "content": "Hi Bob! Nice to meet you. I'll remember that your name is Bob. How can I help you today?",
  "additional_kwargs": {
    "id": "msg_01U4xHvf4REPSCGWzpLeh1qJ",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-sonnet-20241022",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 28,
      "cache_creation_input_tokens": 0,
      "cache_read_input_tokens": 0,
      "output_tokens": 27
    }
  },
  "response_metadata": {
    "id": "msg_01U4xHvf4REPSCGWzpLeh1qJ",
    "model": "claude-3-5-sonnet-20241022",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 28,
      "cache_creation_input_tokens": 0,
      "cache_read_input_tokens": 0,
      "output_tokens": 27
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 28,
    "output_tokens": 27,
    "total_tokens": 55,
    "input_token_details": {
      "cache_creation": 0,
      "cache_read": 0
    }
  }
}

```

```
const config2 = {
  configurable: {
    thread_id: "2",
  },
  streamMode: "values" as const,
};

const followupStream = await workflow.stream({
  messages: [{
    role: "user",
    content: "what is my name?",
  }],
  userId: "1"
}, config2);

for await (const chunk of followupStream) {
  console.log(chunk);
}

```

```
AIMessage {
  "id": "msg_01LB4YapkFawBUbpiu3oeWbF",
  "content": "Your name is Bob.",
  "additional_kwargs": {
    "id": "msg_01LB4YapkFawBUbpiu3oeWbF",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-sonnet-20241022",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 28,
      "cache_creation_input_tokens": 0,
      "cache_read_input_tokens": 0,
      "output_tokens": 8
    }
  },
  "response_metadata": {
    "id": "msg_01LB4YapkFawBUbpiu3oeWbF",
    "model": "claude-3-5-sonnet-20241022",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 28,
      "cache_creation_input_tokens": 0,
      "cache_read_input_tokens": 0,
      "output_tokens": 8
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 28,
    "output_tokens": 8,
    "total_tokens": 36,
    "input_token_details": {
      "cache_creation": 0,
      "cache_read": 0
    }
  }
}

``` We can now inspect our in-memory store and verify that we have in fact saved the memories for the user:

```
const memories = await inMemoryStore.search(["memories", "1"]);
for (const memory of memories) {
  console.log(memory.value);
}

```

```
{ data: 'Username is Bob' }

``` Let's now run the workflow for another user to verify that the memories about the first user are self contained:

```
const config3 = {
  configurable: {
    thread_id: "3",
  },
  streamMode: "values" as const,
};

const otherUserStream = await workflow.stream({
  messages: [{
    role: "user",
    content: "what is my name?",
  }],
  userId: "2"
}, config3);

for await (const chunk of otherUserStream) {
  console.log(chunk);
}

```

```
AIMessage {
  "id": "msg_01KK7CweVY4ZdHxU5bPa4skv",
  "content": "I don't have any information about your name. While I aim to be helpful, I can only know what you directly tell me during our conversation.",
  "additional_kwargs": {
    "id": "msg_01KK7CweVY4ZdHxU5bPa4skv",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-sonnet-20241022",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 25,
      "cache_creation_input_tokens": 0,
      "cache_read_input_tokens": 0,
      "output_tokens": 33
    }
  },
  "response_metadata": {
    "id": "msg_01KK7CweVY4ZdHxU5bPa4skv",
    "model": "claude-3-5-sonnet-20241022",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 25,
      "cache_creation_input_tokens": 0,
      "cache_read_input_tokens": 0,
      "output_tokens": 33
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 25,
    "output_tokens": 33,
    "total_tokens": 58,
    "input_token_details": {
      "cache_creation": 0,
      "cache_read": 0
    }
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