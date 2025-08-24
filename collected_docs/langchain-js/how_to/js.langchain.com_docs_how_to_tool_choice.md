How to force tool calling behavior | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[How to force tool calling behaviorPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)
- [LangChain Tools](/docs/concepts/tools)
- [How to use a model to call tools](/docs/how_to/tool_calling)

In order to force our LLM to select a specific tool, we can use the `tool_choice` parameter to ensure certain behavior. First, let’s define our model and tools:

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const add = tool(
  (input) => {
    return `${input.a + input.b}`;
  },
  {
    name: "add",
    description: "Adds a and b.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const multiply = tool(
  (input) => {
    return `${input.a * input.b}`;
  },
  {
    name: "Multiply",
    description: "Multiplies a and b.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const tools = [add, multiply];

```

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
});

```For example, we can force our tool to call the multiply tool by using the following code:

```typescript
const llmForcedToMultiply = llm.bindTools(tools, {
  tool_choice: "Multiply",
});
const multiplyResult = await llmForcedToMultiply.invoke("what is 2 + 4");
console.log(JSON.stringify(multiplyResult.tool_calls, null, 2));

```

```text
[
  {
    "name": "Multiply",
    "args": {
      "a": 2,
      "b": 4
    },
    "type": "tool_call",
    "id": "call_d5isFbUkn17Wjr6yEtNz7dDF"
  }
]

```Even if we pass it something that doesn’t require multiplcation - it will still call the tool!

We can also just force our tool to select at least one of our tools by passing `"any"` (or for OpenAI models, the equivalent, `"required"`) to the `tool_choice` parameter.

```typescript
const llmForcedToUseTool = llm.bindTools(tools, {
  tool_choice: "any",
});
const anyToolResult = await llmForcedToUseTool.invoke("What day is today?");
console.log(JSON.stringify(anyToolResult.tool_calls, null, 2));

```

```text
[
  {
    "name": "add",
    "args": {
      "a": 2,
      "b": 3
    },
    "type": "tool_call",
    "id": "call_La72g7Aj0XHG0pfPX6Dwg2vT"
  }
]

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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