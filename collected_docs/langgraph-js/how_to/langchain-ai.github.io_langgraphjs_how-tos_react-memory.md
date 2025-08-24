- How to add memory to the prebuilt ReAct agent [Skip to content](#how-to-add-memory-to-the-prebuilt-react-agent) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [How to add a custom system prompt to the prebuilt ReAct agent](../react-system-prompt/)

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

[How to add memory to the prebuilt ReAct agent¶](#how-to-add-memory-to-the-prebuilt-react-agent)

This tutorial will show how to add memory to the prebuilt ReAct agent. Please see [this tutorial](./create-react-agent.ipynb) for how to get started with the prebuilt ReAct agent

All we need to do to enable memory is pass in a checkpointer to `createReactAgent`

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
process.env.LANGCHAIN_PROJECT = "ReAct Agent with memory: LangGraphJS";

```

```
ReAct Agent with memory: LangGraphJS

```

## Code[¶](#code)

Now we can use the prebuilt `createReactAgent` function to setup our agent with memory:

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

// Here we only save in-memory
const memory = new MemorySaver();

const agent = createReactAgent({ llm: model, tools: [getWeather], checkpointSaver: memory });

```

## Usage[¶](#usage)

Let's interact with it multiple times to show that it can remember prior information

```
let inputs = { messages: [{ role: "user", content: "what is the weather in NYC?" }] };
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
    id: 'call_m0zEI6sidPPH81G6ygMsKYs1'
  }
]
-----

It might be cloudy in nyc
-----

The weather in NYC appears to be cloudy.
-----

``` Notice that when we pass the same thread ID, the chat history is preserved

```
inputs = { messages: [{ role: "user", content: "What's it known for?" }] };
stream = await agent.stream(inputs, {
  ...config,
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
What's it known for?
-----

New York City (NYC) is known for many things, including:

1. **Landmarks and Attractions:**
   - **Statue of Liberty**: An iconic symbol of freedom.
   - **Empire State Building**: A famous skyscraper offering panoramic views.
   - **Times Square**: Known for its neon lights and bustling atmosphere.
   - **Central Park**: A large, urban park offering a natural oasis.

2. **Cultural Institutions:**
   - **Broadway**: Famous for its theatre productions.
   - **Metropolitan Museum of Art (The Met)**: One of the largest and most prestigious art museums.
   - **Museum of Modern Art (MoMA) and American Museum of Natural History**: Other significant museums.

3. **Economy and Business:**
   - **Wall Street**: The financial hub of the world, home to the New York Stock Exchange.
   - **Headquarters of major corporations**: NYC hosts the headquarters of many large multinational companies.

4. **Diversity and Neighborhoods:**
   - **Cultural Melting Pot**: NYC is known for its diverse population with a wide range of ethnicities and cultures.
   - **Distinct Neighborhoods**: Each borough and neighborhood (like Brooklyn, The Bronx, Queens, Staten Island, and Manhattan) has its unique character.

5. **Food and Cuisine:**
   - **Culinary Capital**: Known for diverse food options from street food like hot dogs and pretzels to high-end dining.
   - **Cultural Cuisine**: Offers a variety of world cuisines due to its diverse population.

6. **Media and Entertainment:**
   - **Media Headquarters**: Home to major media companies and news networks.
   - **Film and Television**: A popular setting and production location for films and TV shows.

7. **Events and Festivities:**
   - **Macy's Thanksgiving Day Parade**: A famous annual parade.
   - **New Year's Eve in Times Square**: Known for the ball drop and celebrations.

NYC is a dynamic and vibrant city with a rich history and an influence that extends globally in various sectors.
-----

``` When we pass it a new thread ID, all the history is lost and their is no memory to speak of:

```
inputs = { messages: [{ role: "user", content: "how close is it to boston?" }] };
config = { configurable: { thread_id: "2" } };
stream = await agent.stream(inputs, {
  ...config,
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
how close is it to boston?
-----

[
  {
    name: 'get_weather',
    args: { location: 'nyc' },
    type: 'tool_call',
    id: 'call_CKgDJqHiadzNLGhB8T8pHQWM'
  }
]
-----

It might be cloudy in nyc
-----

To determine how close "it" is to Boston, could you please specify which location you're referring to? For instance, are you asking about the distance from New York City, San Francisco, or another location? This detail will help me provide an accurate answer.
-----

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)