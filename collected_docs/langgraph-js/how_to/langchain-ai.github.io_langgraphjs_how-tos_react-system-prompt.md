- How to add a custom system prompt to the prebuilt ReAct agent [Skip to content](#how-to-add-a-custom-system-prompt-to-the-prebuilt-react-agent) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [How to add human-in-the-loop processes to the prebuilt ReAct agent](../react-human-in-the-loop/)

- [How to return structured output from the prebuilt ReAct agent](../react-return-structured-output/)

- [How to create a ReAct agent from scratch (Functional API)](../react-agent-from-scratch-functional/)

- [LangGraph Platform](../../how-tos#langgraph-platform)

- [Concepts](../../concepts/)

- [Tutorials](../../tutorials/)

- Resources

- [Agents](../../agents/overview/)

- [API reference](../../reference/)

- [Versions](../../versions/)

[How to add a custom system prompt to the prebuilt ReAct agent¶](#how-to-add-a-custom-system-prompt-to-the-prebuilt-react-agent)

This tutorial will show how to add a custom system prompt to the prebuilt ReAct agent. Please see [this tutorial](./create-react-agent.ipynb) for how to get started with the prebuilt ReAct agent

You can add a custom system prompt by passing a string to the `stateModifier` param.

Compatibility

The [stateModifier](https://langchain-ai.github.io/langgraphjs/reference/types/langgraph_prebuilt.CreateReactAgentParams.html) parameter was added in `@langchain/langgraph>=0.2.27`. If you are on an older version, you will need to use the deprecated `messageModifier` parameter. For help upgrading, see [this guide](/langgraphjs/how-tos/manage-ecosystem-dependencies/).

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
process.env.LANGCHAIN_PROJECT = "ReAct Agent with system prompt: LangGraphJS";

```

```
ReAct Agent with system prompt: LangGraphJS

```

## Code[¶](#code)

Now we can use the prebuilt `createReactAgent` function to setup our agent with a system prompt:

```
import { ChatOpenAI } from "@langchain/openai";
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const model = new ChatOpenAI({
    model: "gpt-4o",
  });

const getWeather = tool((input) => {
    if (input.location === 'sf') {
        return 'It\'s always sunny in sf';
    } else {
        return 'It might be cloudy in nyc';
    }
}, {
    name: 'get_weather',
    description: 'Call to get the current weather.',
    schema: z.object({
        location: z.enum(['sf','nyc']).describe("Location to get the weather for."),
    })
})

// We can add our system prompt here
const prompt = "Respond in Italian"

const agent = createReactAgent({ llm: model, tools: [getWeather], stateModifier: prompt });

```

## Usage[¶](#usage)

Let's verify that the agent does indeed respond in Italian!

```
let inputs = { messages: [{ role: "user", content: "what is the weather in NYC?" }] };
let stream = await agent.stream(inputs, {
  streamMode: "values",
});

for await (
  const { messages } of stream
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
what is the weather in NYC?
-----

[
  {
    name: 'get_weather',
    args: { location: 'nyc' },
    type: 'tool_call',
    id: 'call_PqmKDQrefHQLmGsZSSr4C7Fc'
  }
]
-----

It might be cloudy in nyc
-----

A New York potrebbe essere nuvoloso. Hai altre domande o posso aiutarti in qualcos'altro?
-----

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)