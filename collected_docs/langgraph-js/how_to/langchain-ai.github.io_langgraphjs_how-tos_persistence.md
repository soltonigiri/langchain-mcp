- Persistence **[Skip to content](#persistence) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [How to add thread-level persistence (functional API)](../persistence-functional/) [How to add thread-level persistence to subgraphs](../subgraph-persistence/) [How to add cross-thread persistence to your graph](../cross-thread-persistence/) [How to add cross-thread persistence (functional API)](../cross-thread-persistence-functional/) [How to use Postgres checkpointer for persistence](../persistence-postgres/) [Memory](../../how-tos#memory) [Human-in-the-loop](../../how-tos#human-in-the-loop) [Streaming](../../how-tos#streaming) [Tool calling](../../how-tos#tool-calling) [Subgraphs](../../how-tos#subgraphs) [Multi-agent](../multi-agent-network/) [State Management](../../how-tos#state-management) [Other](../../how-tos#other) [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent) [LangGraph Platform](../../how-tos#langgraph-platform) [Concepts](../../concepts/) [Tutorials](../../tutorials/) Resources [Agents](../../agents/overview/) [API reference](../../reference/) [Versions](../../versions/) [Persistence¶](#persistence) Many AI applications need memory to share context across multiple interactions in a single conversational "thread." In LangGraph, this type of conversation-level memory can be added to any graph using [Checkpointers](https://langchain-ai.github.io/langgraphjs/reference/interfaces/index.Checkpoint.html). Just compile the graph with a compatible checkpointer. Below is an example using a simple in-memory "MemorySaver":

```
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();
const graph = workflow.compile({ checkpointer });

``` This guide shows how you can add thread-level persistence to your graph. Note: multi-conversation memory If you need memory that is shared** across multiple conversations or users (cross-thread persistence), check out this [how-to guide](https://langchain-ai.github.io/langgraphjs/how-tos/cross-thread-persistence/)). Note In this how-to, we will create our agent from scratch to be transparent (but verbose). You can accomplish similar functionality using the createReactAgent(model, tools=tool, checkpointer=checkpointer) ([API doc](https://langchain-ai.github.io/langgraphjs/reference/functions/prebuilt.createReactAgent.html)) constructor. This may be more appropriate if you are used to LangChain's [AgentExecutor](https://js.langchain.com/docs/how_to/agent_executor) class. ## Setup[¶](#setup) This guide will use OpenAI's GPT-4o model. We will optionally set our API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

```
// process.env.OPENAI_API_KEY = "sk_...";

// Optional, add tracing in LangSmith
// process.env.LANGCHAIN_API_KEY = "ls__...";
process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
process.env.LANGCHAIN_TRACING_V2 = "true";
process.env.LANGCHAIN_PROJECT = "Persistence: LangGraphJS";

```

```
Persistence: LangGraphJS

``` ## Define the state[¶](#define-the-state) The state is the interface for all of the nodes in our graph.

```
import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

``` ## Set up the tools[¶](#set-up-the-tools) We will first define the tools we want to use. For this simple example, we will use create a placeholder search engine. However, it is really easy to create your own tools - see documentation [here](https://js.langchain.com/docs/how_to/custom_tools) on how to do that.

```
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const searchTool = tool(async ({}: { query: string }) => {
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

``` We can now wrap these tools in a simple [ToolNode](/langgraphjs/reference/classes/langgraph_prebuilt.ToolNode.html). This object will actually run the tools (functions) whenever they are invoked by our LLM.

```
import { ToolNode } from "@langchain/langgraph/prebuilt";

const toolNode = new ToolNode(tools);

``` ## Set up the model[¶](#set-up-the-model) Now we will load the [chat model](https://js.langchain.com/docs/concepts/#chat-models). It should work with messages. We will represent all agent state in the form of messages, so it needs to be able to work well with them.

- It should work with [tool calling](https://js.langchain.com/docs/how_to/tool_calling/#passing-tools-to-llms), meaning it can return function arguments in its response.

Note

These model requirements are not general requirements for using LangGraph - they are just requirements for this one example.

```
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o" });

```

After we've done this, we should make sure the model knows that it has these tools available to call. We can do this by calling [bindTools](https://v01.api.js.langchain.com/classes/langchain_core_language_models_chat_models.BaseChatModel.html#bindTools).

```
const boundModel = model.bindTools(tools);

```

## Define the graph[¶](#define-the-graph)

We can now put it all together. We will run it first without a checkpointer:

```
import { END, START, StateGraph } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";

const routeMessage = (state: typeof GraphState.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // If no tools are called, we can finish (respond to the user)
  if (!lastMessage.tool_calls?.length) {
    return END;
  }
  // Otherwise if there is, we continue and call the tools
  return "tools";
};

const callModel = async (
  state: typeof GraphState.State,
  config?: RunnableConfig,
) => {
  const { messages } = state;
  const response = await boundModel.invoke(messages, config);
  return { messages: [response] };
};

const workflow = new StateGraph(GraphState)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", routeMessage)
  .addEdge("tools", "agent");

const graph = workflow.compile();

```

```
let inputs = { messages: [{ role: "user", content: "Hi I'm Yu, nice to meet you." }] };
for await (
  const { messages } of await graph.stream(inputs, {
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
Hi I'm Yu, nice to meet you.
-----

Hi Yu! Nice to meet you too. How can I assist you today?
-----

```

```
inputs = { messages: [{ role: "user", content: "Remember my name?" }] };
for await (
  const { messages } of await graph.stream(inputs, {
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
Remember my name?
-----

You haven't shared your name with me yet. What's your name?
-----

```

## Add Memory[¶](#add-memory)

Let's try it again with a checkpointer. We will use the [MemorySaver](/langgraphjs/reference/classes/index.MemorySaver.html), which will "save" checkpoints in-memory.

```
import { MemorySaver } from "@langchain/langgraph";

// Here we only save in-memory
const memory = new MemorySaver();
const persistentGraph = workflow.compile({ checkpointer: memory });

```

```
let config = { configurable: { thread_id: "conversation-num-1" } };
inputs = { messages: [{ role: "user", content: "Hi I'm Jo, nice to meet you." }] };
for await (
  const { messages } of await persistentGraph.stream(inputs, {
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
Hi I'm Jo, nice to meet you.
-----

Hello Jo, nice to meet you too! How can I assist you today?
-----

```

```
inputs = { messages: [{ role: "user", content: "Remember my name?"}] };
for await (
  const { messages } of await persistentGraph.stream(inputs, {
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
Remember my name?
-----

Yes, I'll remember that your name is Jo. How can I assist you today?
-----

```

## New Conversational Thread[¶](#new-conversational-thread)

If we want to start a new conversation, we can pass in a different **thread_id**. Poof! All the memories are gone (just kidding, they'll always live in that other thread)!

```
config = { configurable: { thread_id: "conversation-2" } };

```

```
{ configurable: { thread_id: 'conversation-2' } }

```

```
inputs = { messages: [{ role: "user", content: "you forgot?" }] };
for await (
  const { messages } of await persistentGraph.stream(inputs, {
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
you forgot?
-----
``````output
Could you please provide more context or details about what you are referring to? This will help me assist you better.
-----

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)