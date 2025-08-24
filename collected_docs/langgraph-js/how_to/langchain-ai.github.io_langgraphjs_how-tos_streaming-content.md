- How to stream custom data [Skip to content](#how-to-stream-custom-data) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [Stream custom data using .streamEvents](#stream-custom-data-using-streamevents)

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

- [Stream custom data using .streamEvents](#stream-custom-data-using-streamevents)

[How to stream custom data¶](#how-to-stream-custom-data)

Prerequisites

This guide assumes familiarity with the following: - [Streaming](https://langchain-ai.github.io/langgraphjs/concepts/streaming/) - [streamEvents API](https://js.langchain.com/docs/how_to/streaming#using-stream-events) - [Chat Models](https://js.langchain.com/docs/concepts/chat_models) - [Tools](https://js.langchain.com/docs/concepts/tools)

The most common use case for streaming from inside a node is to stream LLM tokens, but you may also want to stream custom data.

For example, if you have a long-running tool call, you can dispatch custom events between the steps and use these custom events to monitor progress. You could also surface these custom events to an end user of your application to show them how the current task is progressing.

You can do so in two ways:

- using your graph's .stream method with streamMode: "custom"

- emitting custom events using [dispatchCustomEvents](https://js.langchain.com/docs/how_to/callbacks_custom_events/) with streamEvents.

Below we'll see how to use both APIs.

## Setup[¶](#setup)

First, let's install our required packages:

```
npm install @langchain/langgraph @langchain/core

```

Set up [LangSmith](https://smith.langchain.com) for LangGraph development

Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com).

## Stream custom data using .stream[¶](#stream-custom-data-using-stream)

Compatibility

This section requires `@langchain/langgraph>=0.2.20`. For help upgrading, see [this guide](/langgraphjs/how-tos/manage-ecosystem-dependencies/).

### Define the graph[¶](#define-the-graph)

```
import {
  StateGraph,
  MessagesAnnotation,
  LangGraphRunnableConfig,
} from "@langchain/langgraph";

const myNode = async (
  _state: typeof MessagesAnnotation.State,
  config: LangGraphRunnableConfig
) => {
  const chunks = [
    "Four",
    "score",
    "and",
    "seven",
    "years",
    "ago",
    "our",
    "fathers",
    "...",
  ];
  for (const chunk of chunks) {
    // write the chunk to be streamed using streamMode=custom
    // Only populated if one of the passed stream modes is "custom".
    config.writer?.(chunk);
  }
  return {
    messages: [{
      role: "assistant",
      content: chunks.join(" "),
    }],
  };
};

const graph = new StateGraph(MessagesAnnotation)
  .addNode("model", myNode)
  .addEdge("__start__", "model")
  .compile();

```

### Stream content[¶](#stream-content)

```
const inputs = [{
  role: "user",
  content: "What are you thinking about?",
}];

const stream = await graph.stream(
  { messages: inputs },
  { streamMode: "custom" }
);

for await (const chunk of stream) {
  console.log(chunk);
}

```

```
Four
score
and
seven
years
ago
our
fathers
...

``` You will likely need to use [multiple streaming modes](https://langchain-ai.github.io/langgraphjs/how-tos/stream-multiple/) as you will want access to both the custom data and the state updates.

```
const streamMultiple = await graph.stream(
  { messages: inputs },
  { streamMode: ["custom", "updates"] }
);

for await (const chunk of streamMultiple) {
  console.log(chunk);
}

```

```
[ 'custom', 'Four' ]
[ 'custom', 'score' ]
[ 'custom', 'and' ]
[ 'custom', 'seven' ]
[ 'custom', 'years' ]
[ 'custom', 'ago' ]
[ 'custom', 'our' ]
[ 'custom', 'fathers' ]
[ 'custom', '...' ]
[ 'updates', { model: { messages: [Array] } } ]

```

## Stream custom data using .streamEvents[¶](#stream-custom-data-using-streamevents)

If you are already using graph's `.streamEvents` method in your workflow, you can also stream custom data by emitting custom events using `dispatchCustomEvents`

### Define the graph[¶](#define-the-graph_1)

```
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch";

const graphNode = async (_state: typeof MessagesAnnotation.State) => {
  const chunks = [
    "Four",
    "score",
    "and",
    "seven",
    "years",
    "ago",
    "our",
    "fathers",
    "...",
  ];
  for (const chunk of chunks) {
    await dispatchCustomEvent("my_custom_event", { chunk });
  }
  return {
    messages: [{
      role: "assistant",
      content: chunks.join(" "),
    }],
  };
};

const graphWithDispatch = new StateGraph(MessagesAnnotation)
  .addNode("model", graphNode)
  .addEdge("__start__", "model")
  .compile();

```

### Stream content[¶](#stream-content_1)

```
const eventStream = await graphWithDispatch.streamEvents(
  {
    messages: [{
      role: "user",
      content: "What are you thinking about?",
    }]
  },
  {
    version: "v2",
  },
);

for await (const { event, name, data } of eventStream) {
  if (event === "on_custom_event" && name === "my_custom_event") {
    console.log(`${data.chunk}|`);
  }
}

```

```
Four|
score|
and|
seven|
years|
ago|
our|
fathers|
...|

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)