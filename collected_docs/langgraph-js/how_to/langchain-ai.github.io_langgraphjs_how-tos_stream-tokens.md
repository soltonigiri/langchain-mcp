- How to stream LLM tokens from your graph *[Skip to content](#how-to-stream-llm-tokens-from-your-graph) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [How to stream LLM tokens (without LangChain models)](../streaming-tokens-without-langchain/) [How to stream custom data](../streaming-content/) [How to configure multiple streaming modes at the same time](../stream-multiple/) [How to stream events from within a tool](../streaming-events-from-within-tools/) [How to stream from the final node](../streaming-from-final-node/) [Tool calling](../../how-tos#tool-calling) [Subgraphs](../../how-tos#subgraphs) [Multi-agent](../multi-agent-network/) [State Management](../../how-tos#state-management) [Other](../../how-tos#other) [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent) [LangGraph Platform](../../how-tos#langgraph-platform) [Concepts](../../concepts/) [Tutorials](../../tutorials/) Resources [Agents](../../agents/overview/) [API reference](../../reference/) [Versions](../../versions/) [How to stream LLM tokens from your graph¶](#how-to-stream-llm-tokens-from-your-graph) In this example, we will stream tokens from the language model powering an agent. We will use a ReAct agent as an example. Note If you are using a version of @langchain/core Note In this how-to, we will create our agent from scratch to be transparent (but verbose). You can accomplish similar functionality using the createReactAgent({ llm, tools }) ([API doc](/langgraphjs/reference/functions/langgraph_prebuilt.createReactAgent.html)) constructor. This may be more appropriate if you are used to LangChain's [AgentExecutor](https://js.langchain.com/docs/how_to/agent_executor) class. ## Setup[¶](#setup) This guide will use OpenAI's GPT-4o model. We will optionally set our API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

```
// process.env.OPENAI_API_KEY = "sk_...";

// Optional, add tracing in LangSmith
// process.env.LANGCHAIN_API_KEY = "ls__...";
// process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
// process.env.LANGCHAIN_TRACING = "true";
// process.env.LANGCHAIN_PROJECT = "Stream Tokens: LangGraphJS";

``` ## Define the state[¶](#define-the-state) The state is the interface for all of the nodes in our graph.

```
import { Annotation } from "@langchain/langgraph";
import type { BaseMessageLike } from "@langchain/core/messages";

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessageLike[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

``` ## Set up the tools[¶](#set-up-the-tools) First define the tools you want to use. For this simple example, we'll create a placeholder search engine, but see the documentation [here](https://js.langchain.com/docs/how_to/custom_tools) on how to create your own custom tools.

```
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const searchTool = tool((_) => {
  // This is a placeholder for the actual implementation
  return "Cold, with a low of 3℃";
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

``` We can now wrap these tools in a prebuilt [ToolNode](/langgraphjs/reference/classes/langgraph_prebuilt.ToolNode.html). This object will actually run the tools (functions) whenever they are invoked by our LLM.

```
import { ToolNode } from "@langchain/langgraph/prebuilt";

const toolNode = new ToolNode(tools);

``` ## Set up the model[¶](#set-up-the-model) Now load the [chat model](https://js.langchain.com/docs/concepts/#chat-models). It should work with messages. We will represent all agent state in the form of messages, so it needs to be able to work well with them.

- It should work with [tool calling](https://js.langchain.com/docs/how_to/tool_calling/#passing-tools-to-llms), meaning it can return function arguments in its response.

Note

These model requirements are not general requirements for using LangGraph - they are just requirements for this one example.

```
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

```

After you've done this, we should make sure the model knows that it has these tools available to call. We can do this by calling [bindTools](https://v01.api.js.langchain.com/classes/langchain_core_language_models_chat_models.BaseChatModel.html#bindTools).

```
const boundModel = model.bindTools(tools);

```

## Define the graph[¶](#define-the-graph)

We can now put it all together.

```
import { StateGraph, END } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";

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
) => {
  // For versions of @langchain/core < 0.2.3, you must call `.stream()`
  // and aggregate the message from chunks instead of calling `.invoke()`.
  const { messages } = state;
  const responseMessage = await boundModel.invoke(messages);
  return { messages: [responseMessage] };
};

const workflow = new StateGraph(StateAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", routeMessage)
  .addEdge("tools", "agent");

const agent = workflow.compile();

```

```
import * as tslab from "tslab";

const runnableGraph = agent.getGraph();
const image = await runnableGraph.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

await tslab.display.png(new Uint8Array(arrayBuffer));

```

![ ](data:image/png;base64,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)

## Streaming LLM Tokens[¶](#streaming-llm-tokens)

You can access the LLM tokens as they are produced by each node with two methods:

- The stream method along with streamMode: "messages"

- The streamEvents method

### The stream method[¶](#the-stream-method)

Compatibility

This section requires `@langchain/langgraph>=0.2.20`. For help upgrading, see [this guide](/langgraphjs/how-tos/manage-ecosystem-dependencies/).

For this method, you must be using an LLM that supports streaming as well (e.g. `new ChatOpenAI({ model: "gpt-4o-mini" })`) or call `.stream` on the internal LLM call.

```
import { isAIMessageChunk } from "@langchain/core/messages";

const stream = await agent.stream(
  { messages: [{ role: "user", content: "What's the current weather in Nepal?" }] },
  { streamMode: "messages" },
);

for await (const [message, _metadata] of stream) {
  if (isAIMessageChunk(message) && message.tool_call_chunks?.length) {
    console.log(`${message.getType()} MESSAGE TOOL CALL CHUNK: ${message.tool_call_chunks[0].args}`);
  } else {
    console.log(`${message.getType()} MESSAGE CONTENT: ${message.content}`);
  }
}

```

```
ai MESSAGE TOOL CALL CHUNK:
ai MESSAGE TOOL CALL CHUNK: {"
ai MESSAGE TOOL CALL CHUNK: query
ai MESSAGE TOOL CALL CHUNK: ":"
ai MESSAGE TOOL CALL CHUNK: current
ai MESSAGE TOOL CALL CHUNK:  weather
ai MESSAGE TOOL CALL CHUNK:  in
ai MESSAGE TOOL CALL CHUNK:  Nepal
ai MESSAGE TOOL CALL CHUNK: "}
ai MESSAGE CONTENT:
tool MESSAGE CONTENT: Cold, with a low of 3℃
ai MESSAGE CONTENT:
ai MESSAGE CONTENT: The
ai MESSAGE CONTENT:  current
ai MESSAGE CONTENT:  weather
ai MESSAGE CONTENT:  in
ai MESSAGE CONTENT:  Nepal
ai MESSAGE CONTENT:  is
ai MESSAGE CONTENT:  cold
ai MESSAGE CONTENT: ,
ai MESSAGE CONTENT:  with
ai MESSAGE CONTENT:  a
ai MESSAGE CONTENT:  low
ai MESSAGE CONTENT:  temperature
ai MESSAGE CONTENT:  of
ai MESSAGE CONTENT:
ai MESSAGE CONTENT: 3
ai MESSAGE CONTENT: ℃
ai MESSAGE CONTENT: .
ai MESSAGE CONTENT:

```

### Disabling streaming[¶](#disabling-streaming)

If you wish to disable streaming for a given node or model call, you can add a `"nostream"` tag. Here's an example where we add an initial node with an LLM call that will not be streamed in the final output:

```
import { RunnableLambda } from "@langchain/core/runnables";

const unstreamed = async (_: typeof StateAnnotation.State) => {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });
  const res = await model.invoke("How are you?");
  console.log("LOGGED UNSTREAMED MESSAGE", res.content);
  // Don't update the state, this is just to show a call that won't be streamed
  return {};
}

const agentWithNoStream = new StateGraph(StateAnnotation)
  .addNode("unstreamed",
    // Add a "nostream" tag to the entire node
    RunnableLambda.from(unstreamed).withConfig({
      tags: ["nostream"]
    })
  )
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  // Run the unstreamed node before the agent
  .addEdge("__start__", "unstreamed")
  .addEdge("unstreamed", "agent")
  .addConditionalEdges("agent", routeMessage)
  .addEdge("tools", "agent")
  .compile();

const stream = await agentWithNoStream.stream(
  { messages: [{ role: "user", content: "What's the current weather in Nepal?" }] },
  { streamMode: "messages" },
);

for await (const [message, _metadata] of stream) {
  if (isAIMessageChunk(message) && message.tool_call_chunks?.length) {
    console.log(`${message.getType()} MESSAGE TOOL CALL CHUNK: ${message.tool_call_chunks[0].args}`);
  } else {
    console.log(`${message.getType()} MESSAGE CONTENT: ${message.content}`);
  }
}

```

```
LOGGED UNSTREAMED MESSAGE I'm just a computer program, so I don't have feelings, but I'm here and ready to help you! How can I assist you today?
ai MESSAGE TOOL CALL CHUNK:
ai MESSAGE TOOL CALL CHUNK: {"
ai MESSAGE TOOL CALL CHUNK: query
ai MESSAGE TOOL CALL CHUNK: ":"
ai MESSAGE TOOL CALL CHUNK: current
ai MESSAGE TOOL CALL CHUNK:  weather
ai MESSAGE TOOL CALL CHUNK:  in
ai MESSAGE TOOL CALL CHUNK:  Nepal
ai MESSAGE TOOL CALL CHUNK: "}
ai MESSAGE CONTENT:
tool MESSAGE CONTENT: Cold, with a low of 3℃
ai MESSAGE CONTENT:
ai MESSAGE CONTENT: The
ai MESSAGE CONTENT:  current
ai MESSAGE CONTENT:  weather
ai MESSAGE CONTENT:  in
ai MESSAGE CONTENT:  Nepal
ai MESSAGE CONTENT:  is
ai MESSAGE CONTENT:  cold
ai MESSAGE CONTENT: ,
ai MESSAGE CONTENT:  with
ai MESSAGE CONTENT:  a
ai MESSAGE CONTENT:  low
ai MESSAGE CONTENT:  temperature
ai MESSAGE CONTENT:  of
ai MESSAGE CONTENT:
ai MESSAGE CONTENT: 3
ai MESSAGE CONTENT: ℃
ai MESSAGE CONTENT: .
ai MESSAGE CONTENT:

``` If you removed the tag from the `"unstreamed"` node, the result of the model call within would also be in the final stream.

### The streamEvents method[¶](#the-streamevents-method)

You can also use the `streamEvents` method like this:

```
const eventStream = agent.streamEvents(
  { messages: [{ role: "user", content: "What's the weather like today?" }] },
  { version: "v2" },
);

for await (const { event, data } of eventStream) {
  if (event === "on_chat_model_stream" && isAIMessageChunk(data.chunk)) {
    if (
      data.chunk.tool_call_chunks !== undefined &&
      data.chunk.tool_call_chunks.length > 0
    ) {
      console.log(data.chunk.tool_call_chunks);
    }
  }
}

```

```
[
  {
    name: 'search',
    args: '',
    id: 'call_Qpd6frHt0yUYWynRbZEXF3le',
    index: 0,
    type: 'tool_call_chunk'
  }
]
[
  {
    name: undefined,
    args: '{"',
    id: undefined,
    index: 0,
    type: 'tool_call_chunk'
  }
]
[
  {
    name: undefined,
    args: 'query',
    id: undefined,
    index: 0,
    type: 'tool_call_chunk'
  }
]
[
  {
    name: undefined,
    args: '":"',
    id: undefined,
    index: 0,
    type: 'tool_call_chunk'
  }
]
[
  {
    name: undefined,
    args: 'current',
    id: undefined,
    index: 0,
    type: 'tool_call_chunk'
  }
]
[
  {
    name: undefined,
    args: ' weather',
    id: undefined,
    index: 0,
    type: 'tool_call_chunk'
  }
]
[
  {
    name: undefined,
    args: ' today',
    id: undefined,
    index: 0,
    type: 'tool_call_chunk'
  }
]
[
  {
    name: undefined,
    args: '"}',
    id: undefined,
    index: 0,
    type: 'tool_call_chunk'
  }
]

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)