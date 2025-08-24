- How to add human-in-the-loop processes to the prebuilt ReAct agent [Skip to content](#how-to-add-human-in-the-loop-processes-to-the-prebuilt-react-agent) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [How to return structured output from the prebuilt ReAct agent](../react-return-structured-output/)

- [How to create a ReAct agent from scratch (Functional API)](../react-agent-from-scratch-functional/)

- [LangGraph Platform](../../how-tos#langgraph-platform)

- [Concepts](../../concepts/)

- [Tutorials](../../tutorials/)

- Resources

- [Agents](../../agents/overview/)

- [API reference](../../reference/)

- [Versions](../../versions/)

[How to add human-in-the-loop processes to the prebuilt ReAct agent¶](#how-to-add-human-in-the-loop-processes-to-the-prebuilt-react-agent)

This tutorial will show how to add human-in-the-loop processes to the prebuilt ReAct agent. Please see [this tutorial](./create-react-agent.ipynb) for how to get started with the prebuilt ReAct agent

You can add a breakpoint before tools are called by passing `interruptBefore: ["tools"]` to `createReactAgent`. Note that you need to be using a checkpointer for this to work.

## Setup[¶](#setup)

First, we need to install the required packages.

```
yarn add @langchain/langgraph @langchain/openai @langchain/core

```

This guide will use OpenAI's GPT-4o model. We will optionally set our API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

```
// process.env.OPENAI_API_KEY = "sk_...";

// Optional, add tracing in LangSmith
// process.env.LANGCHAIN_API_KEY = "ls__..."
// process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
process.env.LANGCHAIN_TRACING_V2 = "true";
process.env.LANGCHAIN_PROJECT = "ReAct Agent with human-in-the-loop: LangGraphJS";

```

```
ReAct Agent with human-in-the-loop: LangGraphJS

```

## Code[¶](#code)

Now we can use the prebuilt `createReactAgent` function to setup our agent with human-in-the-loop interactions:

```
import { ChatOpenAI } from "@langchain/openai";
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";

const model = new ChatOpenAI({
    model: "gpt-4o",
  });

const getWeather = tool((input) => {
    if (['sf', 'san francisco'].includes(input.location.toLowerCase())) {
        return 'It\'s always sunny in sf';
    } else if (['nyc', 'new york city'].includes(input.location.toLowerCase())) {
        return 'It might be cloudy in nyc';
    }
    else {
        throw new Error("Unknown Location");
    }
}, {
    name: 'get_weather',
    description: 'Call to get the current weather in a given location.',
    schema: z.object({
        location: z.string().describe("Location to get the weather for."),
    })
})

// Here we only save in-memory
const memory = new MemorySaver();

const agent = createReactAgent({ llm: model, tools: [getWeather], interruptBefore: ["tools"], checkpointSaver: memory });

```

## Usage[¶](#usage)

```
let inputs = { messages: [{ role: "user", content: "what is the weather in SF california?" }] };
let config = { configurable: { thread_id: "1" } };

let stream = await agent.stream(inputs, {
  ...config,
  streamMode: "values",
});

for await (
  const { messages } of stream
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  }
  if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  }
  console.log("-----\n");
}

```

```
what is the weather in SF california?
-----

[
  {
    name: 'get_weather',
    args: { location: 'SF, California' },
    type: 'tool_call',
    id: 'call_AWgaSjqaYVQN73kL0H4BNn1Q'
  }
]
-----

``` We can verify that our graph stopped at the right place:

```
const state = await agent.getState(config)
console.log(state.next)

```

```
[ 'tools' ]

``` Now we can either approve or edit the tool call before proceeding to the next node. If we wanted to approve the tool call, we would simply continue streaming the graph with `null` input. If we wanted to edit the tool call we need to update the state to have the correct tool call, and then after the update has been applied we can continue.

We can try resuming and we will see an error arise:

```
stream = await agent.stream(null, {
  ...config,
  streamMode: "values",
});

for await (
    const { messages } of stream
  ) {
    let msg = messages[messages?.length - 1];
    if (msg?.content) {
      console.log(msg.content);
    }
    if (msg?.tool_calls?.length > 0) {
      console.log(msg.tool_calls);
    }
    console.log("-----\n");
  }

```

```
Error: Unknown Location
 Please fix your mistakes.
-----

[
  {
    name: 'get_weather',
    args: { location: 'San Francisco, California' },
    type: 'tool_call',
    id: 'call_MfIPKpRDXRL4LcHm1BxwcSTk'
  }
]
-----

``` This error arose because our tool argument of "SF, California" is not a location our tool recognizes.

Let's show how we would edit the tool call to search for "San Francisco" instead of "SF, California" - since our tool as written treats "San Francisco, CA" as an unknown location. We will update the state and then resume streaming the graph and should see no errors arise. Note that the reducer we use for our `messages` channel will replace a messaege only if a message with the exact same ID is used. For that reason we can do `new AiMessage(...)` and instead have to directly modify the last message from the `messages` channel, making sure not to edit its ID.

```
// First, lets get the current state
const currentState = await agent.getState(config);

// Let's now get the last message in the state
// This is the one with the tool calls that we want to update
let lastMessage = currentState.values.messages[currentState.values.messages.length - 1]

// Let's now update the args for that tool call
lastMessage.tool_calls[0].args = { location: "San Francisco" }

// Let's now call `updateState` to pass in this message in the `messages` key
// This will get treated as any other update to the state
// It will get passed to the reducer function for the `messages` key
// That reducer function will use the ID of the message to update it
// It's important that it has the right ID! Otherwise it would get appended
// as a new message
await agent.updateState(config, { messages: lastMessage });

```

```
{
  configurable: {
    thread_id: '1',
    checkpoint_ns: '',
    checkpoint_id: '1ef6638d-bfbd-61d0-8004-2751c8c3f226'
  }
}

```

```
stream = await agent.stream(null, {
  ...config,
  streamMode: "values",
});

for await (
  const { messages } of stream
) {
  let msg = messages[messages?.length - 1];
  if (msg?.content) {
    console.log(msg.content);
  }
  if (msg?.tool_calls?.length > 0) {
    console.log(msg.tool_calls);
  }
  console.log("-----\n");
}

```

```
It's always sunny in sf
-----

The climate in San Francisco is sunny right now. If you need more specific details, feel free to ask!
-----

``` Fantastic! Our graph updated properly to query the weather in San Francisco and got the correct "The weather in San Francisco is sunny today! " response from the tool.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)