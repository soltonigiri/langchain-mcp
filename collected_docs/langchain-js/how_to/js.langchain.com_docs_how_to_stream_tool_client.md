How to stream structured output to the client | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to stream structured output to the clientThis guide will walk you through how we stream agent data to the client using React Server Components](https://react.dev/reference/rsc/server-components) inside this directory. The code in this doc is taken from the page.tsx and action.ts files in this directory. To view the full, uninterrupted code, click [here for the actions file](https://github.com/langchain-ai/langchain-nextjs-template/blob/main/app/ai_sdk/tools/action.ts) and [here for the client file](https://github.com/langchain-ai/langchain-nextjs-template/blob/main/app/ai_sdk/tools/page.tsx).PrerequisitesThis guide assumes familiarity with the following concepts: > [LangChain Expression Language](/docs/concepts/lcel)[Chat models](/docs/concepts/chat_models)[Tool calling](/docs/concepts/tool_calling) ## Setup[​](#setup) First, install the necessary LangChain & AI SDK packages:npm
- Yarn
- pnpm

```bash
npm install @langchain/openai @langchain/core ai zod zod-to-json-schema

```

```bash
yarn add @langchain/openai @langchain/core ai zod zod-to-json-schema

```

```bash
pnpm add @langchain/openai @langchain/core ai zod zod-to-json-schema

```Next, we&#x27;ll create our server file. This will contain all the logic for making tool calls and sending the data back to the client.

Start by adding the necessary imports & the `"use server"` directive:

```typescript
"use server";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { JsonOutputKeyToolsParser } from "@langchain/core/output_parsers/openai_tools";

```

After that, we&#x27;ll define our tool schema. For this example we&#x27;ll use a simple demo weather schema:

```typescript
const Weather = z
  .object({
    city: z.string().describe("City to search for weather"),
    state: z.string().describe("State abbreviation to search for weather"),
  })
  .describe("Weather search parameters");

```

Once our schema is defined, we can implement our `executeTool` function. This function takes in a single input of `string`, and contains all the logic for our tool and streaming data back to the client:

```typescript
export async function executeTool(
  input: string,
) {
  "use server";

  const stream = createStreamableValue();

```

The `createStreamableValue` function is important as this is what we&#x27;ll use for actually streaming all the data back to the client.

For the main logic, we&#x27;ll wrap it in an async function. Start by defining our prompt and chat model:

```typescript
(async () => {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a helpful assistant. Use the tools provided to best assist the user.`,
      ],
      ["human", "{input}"],
    ]);

    const llm = new ChatOpenAI({
      model: "gpt-4o-2024-05-13",
      temperature: 0,
    });

```

After defining our chat model, we&#x27;ll define our runnable chain using LCEL.

We start binding our `weather` tool we defined earlier to the model:

```typescript
const modelWithTools = llm.bind({
  tools: [
    {
      type: "function" as const,
      function: {
        name: "get_weather",
        description: Weather.description,
        parameters: zodToJsonSchema(Weather),
      },
    },
  ],
});

```

Next, we&#x27;ll use LCEL to pipe each component together, starting with the prompt, then the model with tools, and finally the output parser:

```typescript
const chain = prompt.pipe(modelWithTools).pipe(
  new JsonOutputKeyToolsParser<z.infer<typeof Weather>>({
    keyName: "get_weather",
    zodSchema: Weather,
  })
);

```

Finally, we&#x27;ll call `.stream` on our chain, and similarly to the [streaming agent](/docs/how_to/stream_agent_client) example, we&#x27;ll iterate over the stream and stringify + parse the data before updating the stream value:

```typescript
const streamResult = await chain.stream({
      input,
    });

    for await (const item of streamResult) {
      stream.update(JSON.parse(JSON.stringify(item, null, 2)));
    }

    stream.done();
  })();

  return { streamData: stream.value };
}

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)

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