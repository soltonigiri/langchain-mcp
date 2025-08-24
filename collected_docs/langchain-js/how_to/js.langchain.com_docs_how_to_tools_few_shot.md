How to use few-shot prompting with tool calling | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to use few-shot prompting with tool callingPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)
- [LangChain Tools](/docs/concepts/tools)
- [Tool calling](/docs/concepts/tool_calling)
- [Passing tool outputs to chat models](/docs/how_to/tool_results_pass_to_model/)

For more complex tool use it’s very useful to add few-shot examples to the prompt. We can do this by adding `AIMessages` with `ToolCalls` and corresponding `ToolMessages` to our prompt.

First define a model and a calculator tool:

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });

/**
 * Note that the descriptions here are crucial, as they will be passed along
 * to the model along with the class name.
 */
const calculatorSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
});

const calculatorTool = tool(
  async ({ operation, number1, number2 }) => {
    // Functions must return strings
    if (operation === "add") {
      return `${number1 + number2}`;
    } else if (operation === "subtract") {
      return `${number1 - number2}`;
    } else if (operation === "multiply") {
      return `${number1 * number2}`;
    } else if (operation === "divide") {
      return `${number1 / number2}`;
    } else {
      throw new Error("Invalid operation.");
    }
  },
  {
    name: "calculator",
    description: "Can perform mathematical operations.",
    schema: calculatorSchema,
  }
);

const llmWithTools = llm.bindTools([calculatorTool]);

```

Our calculator can handle common addition, subtraction, multiplication, and division. But what happens if we ask about a new mathematical operator, `🦜`?

Let’s see what happens when we use it naively:

```typescript
const res = await llmWithTools.invoke("What is 3 🦜 12");

console.log(res.content);
console.log(res.tool_calls);

```

```text
[
  {
    name: &#x27;calculator&#x27;,
    args: { operation: &#x27;multiply&#x27;, number1: 3, number2: 12 },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_I0oQGmdESpIgcf91ej30p9aR&#x27;
  }
]

```It doesn’t quite know how to interpret `🦜` as an operation, and it defaults to `multiply`. Now, let’s try giving it some examples in the form of a manufactured messages to steer it towards `divide`:

```typescript
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";

const res = await llmWithTools.invoke([
  new HumanMessage("What is 333382 🦜 1932?"),
  new AIMessage({
    content:
      "The 🦜 operator is shorthand for division, so we call the divide tool.",
    tool_calls: [
      {
        id: "12345",
        name: "calculator",
        args: {
          number1: 333382,
          number2: 1932,
          operation: "divide",
        },
      },
    ],
  }),
  new ToolMessage({
    tool_call_id: "12345",
    content: "The answer is 172.558.",
  }),
  new AIMessage("The answer is 172.558."),
  new HumanMessage("What is 6 🦜 2?"),
  new AIMessage({
    content:
      "The 🦜 operator is shorthand for division, so we call the divide tool.",
    tool_calls: [
      {
        id: "54321",
        name: "calculator",
        args: {
          number1: 6,
          number2: 2,
          operation: "divide",
        },
      },
    ],
  }),
  new ToolMessage({
    tool_call_id: "54321",
    content: "The answer is 3.",
  }),
  new AIMessage("The answer is 3."),
  new HumanMessage("What is 3 🦜 12?"),
]);

console.log(res.tool_calls);

```

```text
[
  {
    name: &#x27;calculator&#x27;,
    args: { number1: 3, number2: 12, operation: &#x27;divide&#x27; },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_O6M4yDaA6s8oDqs2Zfl7TZAp&#x27;
  }
]

```And we can see that it now equates `🦜` with the `divide` operation in the correct way!

## Related[​](#related)

- Stream [tool calls](/docs/how_to/tool_streaming/)
- Pass [runtime values to tools](/docs/how_to/tool_runtime)
- Getting [structured outputs](/docs/how_to/structured_output/) from models

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