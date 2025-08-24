How to disable parallel tool calling | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to disable parallel tool callingPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Tools](/docs/concepts/tools)
- [Tool calling](/docs/concepts/tool_calling)
- [Custom tools](/docs/how_to/custom_tools)

OpenAI-specificThis API is currently only supported by OpenAI.

OpenAI models perform tool calling in parallel by default. That means that if we ask a question like `"What is the weather in Tokyo, New York, and Chicago?"` and we have a tool for getting the weather, it will call the tool 3 times in parallel. We can force it to call only a single tool once by using the `parallel_tool_call` call option.

First let’s set up our tools and model:

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const adderTool = tool(
  async ({ a, b }) => {
    return a + b;
  },
  {
    name: "add",
    description: "Adds a and b",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const multiplyTool = tool(
  async ({ a, b }) => {
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiplies a and b",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const tools = [adderTool, multiplyTool];

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

```

Now let’s show a quick example of how disabling parallel tool calls work:

```typescript
const llmWithTools = llm.bindTools(tools, { parallel_tool_calls: false });

const result = await llmWithTools.invoke(
  "Please call the first tool two times"
);

result.tool_calls;

```

```text
[
  {
    name: &#x27;add&#x27;,
    args: { a: 5, b: 3 },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_5bKOYerdQU6J5ERJJYnzYsGn&#x27;
  }
]

```As we can see, even though we explicitly told the model to call a tool twice, by disabling parallel tool calls the model was constrained to only calling one.

Compare this to calling the model without passing `parallel_tool_calls` as false:

```typescript
const llmWithNoBoundParam = llm.bindTools(tools);

const result2 = await llmWithNoBoundParam.invoke(
  "Please call the first tool two times"
);

result2.tool_calls;

```

```text
[
  {
    name: &#x27;add&#x27;,
    args: { a: 1, b: 2 },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_Ni0tF0nNtY66BBwB5vEP6oI4&#x27;
  },
  {
    name: &#x27;add&#x27;,
    args: { a: 3, b: 4 },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_XucnTCfFqP1JBs3LtbOq5w3d&#x27;
  }
]

```You can see that you get two tool calls.

You can also pass the parameter in at runtime like this:

```typescript
const result3 = await llmWithNoBoundParam.invoke(
  "Please call the first tool two times",
  {
    parallel_tool_calls: false,
  }
);

result3.tool_calls;

```

```text
[
  {
    name: &#x27;add&#x27;,
    args: { a: 1, b: 2 },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_TWo6auul71NUg1p0suzBKARt&#x27;
  }
]

```

## Related[​](#related)

- [How to: create custom tools](/docs/how_to/custom_tools)
- [How to: pass run time values to tools](/docs/how_to/tool_runtime)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Related](#related)

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