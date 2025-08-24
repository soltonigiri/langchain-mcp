- How to stream LLM tokens (without LangChain models) [Skip to content](#how-to-stream-llm-tokens-without-langchain-models) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [How to stream custom data](../streaming-content/)

- [How to configure multiple streaming modes at the same time](../stream-multiple/)

- [How to stream events from within a tool](../streaming-events-from-within-tools/)

- [How to stream from the final node](../streaming-from-final-node/)

- [Tool calling](../../how-tos#tool-calling)

- [Subgraphs](../../how-tos#subgraphs)

- [Multi-agent](../multi-agent-network/)

- [State Management](../../how-tos#state-management)

- [Other](../../how-tos#other)

- [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent)

- [LangGraph Platform](../../how-tos#langgraph-platform)

- [Concepts](../../concepts/)

- [Tutorials](../../tutorials/)

- Resources

- [Agents](../../agents/overview/)

- [API reference](../../reference/)

- [Versions](../../versions/)

[How to stream LLM tokens (without LangChain models)¶](#how-to-stream-llm-tokens-without-langchain-models)

In this guide, we will stream tokens from the language model powering an agent without using LangChain chat models. We'll be using the OpenAI client library directly in a ReAct agent as an example.

## Setup[¶](#setup)

To get started, install the `openai` and `langgraph` packages separately:

```
$ npm install openai @langchain/langgraph @langchain/core

```

Compatibility

This guide requires `@langchain/core>=0.2.19`, and if you are using LangSmith, `langsmith>=0.1.39`. For help upgrading, see [this guide](/langgraphjs/how-tos/manage-ecosystem-dependencies/).

You'll also need to make sure you have your OpenAI key set as `process.env.OPENAI_API_KEY`.

## Defining a model and a tool schema[¶](#defining-a-model-and-a-tool-schema)

First, initialize the OpenAI SDK and define a tool schema for the model to populate using [OpenAI's format](https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools):

```
import OpenAI from "openai";

const openaiClient = new OpenAI({});

const toolSchema: OpenAI.ChatCompletionTool = {
  type: "function",
  function: {
    name: "get_items",
    description: "Use this tool to look up which items are in the given place.",
    parameters: {
      type: "object",
      properties: {
        place: {
          type: "string",
        },
      },
      required: ["place"],
    }
  }
};

```

## Calling the model[¶](#calling-the-model)

Now, define a method for a LangGraph node that will call the model. It will handle formatting tool calls to and from the model, as well as streaming via [custom callback events](https://js.langchain.com/docs/how_to/callbacks_custom_events).

If you are using [LangSmith](https://docs.smith.langchain.com/), you can also wrap the OpenAI client for the same nice tracing you'd get with a LangChain chat model.

Here's what that looks like:

```
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch";
import { wrapOpenAI } from "langsmith/wrappers/openai";
import { Annotation } from "@langchain/langgraph";

const StateAnnotation = Annotation.Root({
  messages: Annotation<OpenAI.ChatCompletionMessageParam[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

// If using LangSmith, use "wrapOpenAI" on the whole client or
// "traceable" to wrap a single method for nicer tracing:
// https://docs.smith.langchain.com/how_to_guides/tracing/annotate_code
const wrappedClient = wrapOpenAI(openaiClient);

const callModel = async (state: typeof StateAnnotation.State) => {
  const { messages } = state;
  const stream = await wrappedClient.chat.completions.create({
    messages,
    model: "gpt-4o-mini",
    tools: [toolSchema],
    stream: true,
  });
  let responseContent = "";
  let role: string = "assistant";
  let toolCallId: string | undefined;
  let toolCallName: string | undefined;
  let toolCallArgs = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0].delta;
    if (delta.role !== undefined) {
      role = delta.role;
    }
    if (delta.content) {
      responseContent += delta.content;
      await dispatchCustomEvent("streamed_token", {
        content: delta.content,
      });
    }
    if (delta.tool_calls !== undefined && delta.tool_calls.length > 0) {
      // note: for simplicity we're only handling a single tool call here
      const toolCall = delta.tool_calls[0];
      if (toolCall.function?.name !== undefined) {
        toolCallName = toolCall.function.name;
      }
      if (toolCall.id !== undefined) {
        toolCallId = toolCall.id;
      }
      await dispatchCustomEvent("streamed_tool_call_chunk", toolCall);
      toolCallArgs += toolCall.function?.arguments ?? "";
    }
  }
  let finalToolCalls;
  if (toolCallName !== undefined && toolCallId !== undefined) {
    finalToolCalls = [{
      id: toolCallId,
      function: {
        name: toolCallName,
        arguments: toolCallArgs
      },
      type: "function" as const,
    }];
  }

  const responseMessage = {
    role: role as any,
    content: responseContent,
    tool_calls: finalToolCalls,
  };
  return { messages: [responseMessage] };
}

```

Note that you can't call this method outside of a LangGraph node since `dispatchCustomEvent` will fail if it is called outside the proper context.

## Define tools and a tool-calling node[¶](#define-tools-and-a-tool-calling-node)

Next, set up the actual tool function and the node that will call it when the model populates a tool call:

```
const getItems = async ({ place }: { place: string }) => {
  if (place.toLowerCase().includes("bed")) {  // For under the bed
    return "socks, shoes and dust bunnies";
  } else if (place.toLowerCase().includes("shelf")) {  // For 'shelf'
    return "books, pencils and pictures";
  } else {  // if the agent decides to ask about a different place
    return "cat snacks";
  }
};

const callTools = async (state: typeof StateAnnotation.State) => {
  const { messages } = state;
  const mostRecentMessage = messages[messages.length - 1];
  const toolCalls = (mostRecentMessage as OpenAI.ChatCompletionAssistantMessageParam).tool_calls;
  if (toolCalls === undefined || toolCalls.length === 0) {
    throw new Error("No tool calls passed to node.");
  }
  const toolNameMap = {
    get_items: getItems,
  };
  const functionName = toolCalls[0].function.name;
  const functionArguments = JSON.parse(toolCalls[0].function.arguments);
  const response = await toolNameMap[functionName](functionArguments);
  const toolMessage = {
    tool_call_id: toolCalls[0].id,
    role: "tool" as const,
    name: functionName,
    content: response,
  }
  return { messages: [toolMessage] };
}

```

## Build the graph[¶](#build-the-graph)

Finally, it's time to build your graph:

```
import { StateGraph } from "@langchain/langgraph";
import OpenAI from "openai";

// We can reuse the same `GraphState` from above as it has not changed.
const shouldContinue = (state: typeof StateAnnotation.State) => {
  const { messages } = state;
  const lastMessage =
    messages[messages.length - 1] as OpenAI.ChatCompletionAssistantMessageParam;
  if (lastMessage?.tool_calls !== undefined && lastMessage?.tool_calls.length > 0) {
    return "tools";
  }
  return "__end__";
}

const graph = new StateGraph(StateAnnotation)
  .addNode("model", callModel)
  .addNode("tools", callTools)
  .addEdge("__start__", "model")
  .addConditionalEdges("model", shouldContinue, {
    tools: "tools",
    __end__: "__end__",
  })
  .addEdge("tools", "model")
  .compile();

```

```
import * as tslab from "tslab";

const representation = graph.getGraph();
const image = await representation.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

await tslab.display.png(new Uint8Array(arrayBuffer));

```

![ ](data:image/png;base64,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)

## Streaming tokens[¶](#streaming-tokens)

And now we can use the [.streamEvents](https://js.langchain.com/docs/how_to/streaming#using-stream-events) method to get the streamed tokens and tool calls from the OpenAI model:

```
const eventStream = await graph.streamEvents(
  { messages: [{ role: "user", content: "what's in the bedroom?" }] },
  { version: "v2" },
);

for await (const { event, name, data } of eventStream) {
  if (event === "on_custom_event") {
    console.log(name, data);
  }
}

```

```
streamed_tool_call_chunk {
  index: 0,
  id: 'call_v99reml4gZvvUypPgOpLgxM2',
  type: 'function',
  function: { name: 'get_items', arguments: '' }
}
streamed_tool_call_chunk { index: 0, function: { arguments: '{"' } }
streamed_tool_call_chunk { index: 0, function: { arguments: 'place' } }
streamed_tool_call_chunk { index: 0, function: { arguments: '":"' } }
streamed_tool_call_chunk { index: 0, function: { arguments: 'bed' } }
streamed_tool_call_chunk { index: 0, function: { arguments: 'room' } }
streamed_tool_call_chunk { index: 0, function: { arguments: '"}' } }
streamed_token { content: 'In' }
streamed_token { content: ' the' }
streamed_token { content: ' bedroom' }
streamed_token { content: ',' }
streamed_token { content: ' you' }
streamed_token { content: ' can' }
streamed_token { content: ' find' }
streamed_token { content: ' socks' }
streamed_token { content: ',' }
streamed_token { content: ' shoes' }
streamed_token { content: ',' }
streamed_token { content: ' and' }
streamed_token { content: ' dust' }
streamed_token { content: ' b' }
streamed_token { content: 'unnies' }
streamed_token { content: '.' }

``` And if you've set up LangSmith tracing, you'll also see [a trace like this one](https://smith.langchain.com/public/ddb1af36-ebe5-4ba6-9a57-87a296dc801f/r).

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)