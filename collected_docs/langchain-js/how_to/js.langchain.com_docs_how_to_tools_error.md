How to handle tool errors | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to handle tool errorsPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)
- [LangChain Tools](/docs/concepts/tools)
- [How to use a model to call tools](/docs/how_to/tool_calling)

Calling tools with an LLM isn’t perfect. The model may try to call a tool that doesn’t exist or fail to return arguments that match the requested schema. Strategies like keeping schemas simple, reducing the number of tools you pass at once, and having good names and descriptions can help mitigate this risk, but aren’t foolproof.

This guide covers some ways to build error handling into your chains to mitigate these failure modes.

## Chain[​](#chain)

Suppose we have the following (dummy) tool and tool-calling chain. We’ll make our tool intentionally convoluted to try and trip up the model.

```typescript
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo-0125",
  temperature: 0,
});

const complexTool = tool(
  async (params) => {
    return params.int_arg * params.float_arg;
  },
  {
    name: "complex_tool",
    description: "Do something complex with a complex tool.",
    schema: z.object({
      int_arg: z.number(),
      float_arg: z.number(),
      number_arg: z.object({}),
    }),
  }
);

const llmWithTools = llm.bindTools([complexTool]);

const chain = llmWithTools
  .pipe((message) => message.tool_calls?.[0].args)
  .pipe(complexTool);

```

We can see that when we try to invoke this chain the model fails to correctly call the tool:

```typescript
await chain.invoke("use complex tool. the args are 5, 2.1, potato");

```

```text
Error: Received tool input did not match expected schema

``` ## Try/except tool call[​](#tryexcept-tool-call) The simplest way to more gracefully handle errors is to try/except the tool-calling step and return a helpful message on errors:

```typescript
const tryExceptToolWrapper = async (input, config) => {
  try {
    const result = await complexTool.invoke(input);
    return result;
  } catch (e) {
    return `Calling tool with arguments:\n\n${JSON.stringify(
      input
    )}\n\nraised the following error:\n\n${e}`;
  }
};

const chainWithTools = llmWithTools
  .pipe((message) => message.tool_calls?.[0].args)
  .pipe(tryExceptToolWrapper);

const res = await chainWithTools.invoke(
  "use complex tool. the args are 5, 2.1, potato"
);

console.log(res);

```

```text
Calling tool with arguments:

{"int_arg":5,"float_arg":2.1,"number_arg":"potato"}

raised the following error:

Error: Received tool input did not match expected schema

``` ## Fallbacks[​](#fallbacks) We can also try to fallback to a better model in the event of a tool invocation error. In this case we’ll fall back to an identical chain that uses `gpt-4-1106-preview` instead of `gpt-3.5-turbo`.

```typescript
const badChain = llmWithTools
  .pipe((message) => message.tool_calls?.[0].args)
  .pipe(complexTool);

const betterModel = new ChatOpenAI({
  model: "gpt-4-1106-preview",
  temperature: 0,
}).bindTools([complexTool]);

const betterChain = betterModel
  .pipe((message) => message.tool_calls?.[0].args)
  .pipe(complexTool);

const chainWithFallback = badChain.withFallbacks([betterChain]);

await chainWithFallback.invoke("use complex tool. the args are 5, 2.1, potato");

```

```text
10.5

```Looking at the [LangSmith trace](https://smith.langchain.com/public/ea31e7ca-4abc-48e3-9943-700100c86622/r) for this chain run, we can see that the first chain call fails as expected and it’s the fallback that succeeds.

## Next steps[​](#next-steps)

Now you’ve seen some strategies how to handle tool calling errors. Next, you can learn more about how to use tools:

- Few shot prompting [with tools](/docs/how_to/tool_calling#few-shotting-with-tools)
- Stream [tool calls](/docs/how_to/tool_streaming/)
- Pass [runtime values to tools](/docs/how_to/tool_runtime)

You can also check out some more specific uses of tool calling:

- Getting [structured outputs](/docs/how_to/structured_output/) from models

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Chain](#chain)
- [Try/except tool call](#tryexcept-tool-call)
- [Fallbacks](#fallbacks)
- [Next steps](#next-steps)

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