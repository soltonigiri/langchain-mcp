How to access the RunnableConfig from a tool | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to access the RunnableConfig from a toolPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Tools](/docs/concepts/tools)
- [Custom tools](/docs/how_to/custom_tools)
- [LangChain Expression Language (LCEL)](/docs/concepts/lcel)

Tools are runnables, and you can treat them the same way as any other runnable at the interface level - you can call `invoke()`, `batch()`, and `stream()` on them as normal. However, when writing custom tools, you may want to invoke other runnables like chat models or retrievers. In order to properly trace and configure those sub-invocations, you’ll need to manually access and pass in the tool’s current [RunnableConfig](https://api.js.langchain.com/interfaces/langchain_core.runnables.RunnableConfig.html) object.

This guide covers how to do this for custom tools created in different ways.

## From the tool method[​](#from-the-tool-method)

Accessing the `RunnableConfig` object for a custom tool created with the [tool](https://api.js.langchain.com/functions/langchain_core.tools.tool-1.html) helper method is simple - it’s always the second parameter passed into your custom function. Here’s an example:

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import type { RunnableConfig } from "@langchain/core/runnables";

const reverseTool = tool(
  async (input: { text: string }, config?: RunnableConfig) => {
    const originalString =
      input.text + (config?.configurable?.additional_field ?? "");
    return originalString.split("").reverse().join("");
  },
  {
    name: "reverse",
    description:
      "A test tool that combines input text with a configurable parameter.",
    schema: z.object({
      text: z.string(),
    }),
  }
);

```

Then, if we invoke the tool with a `config` containing a `configurable` field, we can see that `additional_field` is passed through correctly:

```typescript
await reverseTool.invoke(
  { text: "abc" },
  { configurable: { additional_field: "123" } }
);

```

```text
321cba

``` ## Next steps[​](#next-steps) You’ve now seen how to configure and stream events from within a tool. Next, check out the following guides for more on using tools:

- Pass [tool results back to a model](/docs/how_to/tool_results_pass_to_model)
- Building [tool-using chains and agents](/docs/how_to#tools)
- Getting [structured outputs](/docs/how_to/structured_output/) from models

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [From the tool method](#from-the-tool-method)
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