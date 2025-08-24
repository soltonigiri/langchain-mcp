How to stream agent data to the client | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to stream agent data to the clientThis guide will walk you through how we stream agent data to the client using React Server Components](https://react.dev/reference/rsc/server-components) inside this directory. The code in this doc is taken from the page.tsx and action.ts files in this directory. To view the full, uninterrupted code, click [here for the actions file](https://github.com/langchain-ai/langchain-nextjs-template/blob/main/app/ai_sdk/agent/action.ts) and [here for the client file](https://github.com/langchain-ai/langchain-nextjs-template/blob/main/app/ai_sdk/agent/page.tsx).PrerequisitesThis guide assumes familiarity with the following concepts:[LangChain Expression Language](/docs/concepts/lcel)
- [Chat models](/docs/concepts/chat_models)
- [Tool calling](/docs/concepts/tool_calling)
- [Agents](/docs/concepts/agents)

## Setup[​](#setup)

First, install the necessary LangChain & AI SDK packages:

- npm
- Yarn
- pnpm

```bash
npm install langchain @langchain/core @langchain/community ai

```

```bash
yarn add langchain @langchain/core @langchain/community ai

```

```bash
pnpm add langchain @langchain/core @langchain/community ai

```In this demo we&#x27;ll be using the `TavilySearchResults` tool, which requires an API key. You can get one [here](https://app.tavily.com/), or you can swap it out for another tool of your choice, like [WikipediaQueryRun](/docs/integrations/tools/wikipedia) which doesn&#x27;t require an API key.

If you choose to use `TavilySearchResults`, set your API key like so:

```bash
export TAVILY_API_KEY=your_api_key

```

## Get started[​](#get-started) The first step is to create a new RSC file, and add the imports which we&#x27;ll use for running our agent. In this demo, we&#x27;ll name it `action.ts`:

```typescript
"use server";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { createStreamableValue } from "ai/rsc";

```

Next, we&#x27;ll define a `runAgent` function. This function takes in a single input of `string`, and contains all the logic for our agent and streaming data back to the client:

```typescript
export async function runAgent(input: string) {
  "use server";
}

```

Next, inside our function we&#x27;ll define our chat model of choice:

```typescript
const llm = new ChatOpenAI({
  model: "gpt-4o-2024-05-13",
  temperature: 0,
});

```

Next, we&#x27;ll use the `createStreamableValue` helper function provided by the `ai` package to create a streamable value:

```typescript
const stream = createStreamableValue();

```

This will be very important later on when we start streaming data back to the client.

Next, lets define our async function inside which contains the agent logic:

```typescript
(async () => {
    const tools = [new TavilySearchResults({ maxResults: 1 })];

    const prompt = await pull<ChatPromptTemplate>(
      "hwchase17/openai-tools-agent",
    );

    const agent = createToolCallingAgent({
      llm,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

```

tipAs of `langchain` version `0.2.8`, the `createToolCallingAgent` function now supports [OpenAI-formatted tools](https://api.js.langchain.com/interfaces/langchain_core.language_models_base.ToolDefinition.html).

Here you can see we&#x27;re doing a few things:

The first is we&#x27;re defining our list of tools (in this case we&#x27;re only using a single tool) and pulling in our prompt from the LangChain prompt hub.

After that, we&#x27;re passing our LLM, tools and prompt to the `createToolCallingAgent` function, which will construct and return a runnable agent. This is then passed into the `AgentExecutor` class, which will handle the execution & streaming of our agent.

Finally, we&#x27;ll call `.streamEvents` and pass our streamed data back to the `stream` variable we defined above,

```typescript
const streamingEvents = agentExecutor.streamEvents(
      { input },
      { version: "v2" },
    );

    for await (const item of streamingEvents) {
      stream.update(JSON.parse(JSON.stringify(item, null, 2)));
    }

    stream.done();
  })();

```

As you can see above, we&#x27;re doing something a little wacky by stringifying and parsing our data. This is due to a bug in the RSC streaming code, however if you stringify and parse like we are above, you shouldn&#x27;t experience this.

Finally, at the bottom of the function return the stream value:

```typescript
return { streamData: stream.value };

```

Once we&#x27;ve implemented our server action, we can add a couple lines of code in our client function to request and stream this data:

First, add the necessary imports:

```typescript
"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { runAgent } from "./action";

```

Then inside our `Page` function, calling the `runAgent` function is straightforward:

```typescript
export default function Page() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<StreamEvent[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { streamData } = await runAgent(input);
    for await (const item of readStreamableValue(streamData)) {
      setData((prev) => [...prev, item]);
    }
  }
}

```

That&#x27;s it! You&#x27;ve successfully built an agent that streams data back to the client. You can now run your application and see the data streaming in real-time.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Get started](#get-started)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.