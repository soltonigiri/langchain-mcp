How to create Tools | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to create ToolsPrerequisitesThis guide assumes familiarity with the following concepts:LangChain tools](/docs/concepts/tools)
- [Agents](/docs/concepts/agents)

When constructing your own agent, you will need to provide it with a list of Tools that it can use. While LangChain includes some prebuilt tools, it can often be more useful to use tools that use custom logic. This guide will walk you through some ways you can create custom tools.

The biggest difference here is that the first function requires an object with multiple input fields, while the second one only accepts an object with a single field. Some older agents only work with functions that require single inputs, so it’s important to understand the distinction.

LangChain has a handful of ways to construct tools for different applications. Below I’ll show the two most common ways to create tools, and where you might use each.

## Tool schema[​](#tool-schema)

CompatibilityOnly available in `@langchain/core` version 0.2.19 and above.

The simplest way to create a tool is through the [StructuredToolParams](https://api.js.langchain.com/interfaces/_langchain_core.tools.StructuredToolParams.html) schema. Every chat model which supports tool calling in LangChain accepts binding tools to the model through this schema. This schema has only three fields

- name - The name of the tool.
- schema - The schema of the tool, defined with a Zod object.
- description (optional) - A description of the tool.

This schema does not include a function to pair with the tool, and for this reason it should only be used in situations where the generated output does not need to be passed as the input argument to a function.

```typescript
import { z } from "zod";
import { StructuredToolParams } from "@langchain/core/tools";

const simpleToolSchema: StructuredToolParams = {
  name: "get_current_weather",
  description: "Get the current weather for a location",
  schema: z.object({
    city: z.string().describe("The city to get the weather for"),
    state: z.string().optional().describe("The state to get the weather for"),
  }),
};

```

## tool function[​](#tool-function) CompatibilityOnly available in `@langchain/core` version 0.2.7 and above.

The [tool](https://api.js.langchain.com/classes/langchain_core.tools.Tool.html) wrapper function is a convenience method for turning a JavaScript function into a tool. It requires the function itself along with some additional arguments that define your tool. You should use this over `StructuredToolParams` tools when the resulting tool call executes a function. The most important are:

- The tool’s name, which the LLM will use as context as well as to reference the tool
- An optional, but recommended description, which the LLM will use as context to know when to use the tool
- A schema, which defines the shape of the tool’s input

The `tool` function will return an instance of the [StructuredTool](https://api.js.langchain.com/classes/langchain_core.tools.StructuredTool.html) class, so it is compatible with all the existing tool calling infrastructure in the LangChain library.

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const adderSchema = z.object({
  a: z.number(),
  b: z.number(),
});
const adderTool = tool(
  async (input): Promise<string> => {
    const sum = input.a + input.b;
    return `The sum of ${input.a} and ${input.b} is ${sum}`;
  },
  {
    name: "adder",
    description: "Adds two numbers together",
    schema: adderSchema,
  }
);

await adderTool.invoke({ a: 1, b: 2 });

```

```text
"The sum of 1 and 2 is 3"

``` ## DynamicStructuredTool[​](#dynamicstructuredtool) You can also use the [DynamicStructuredTool](https://api.js.langchain.com/classes/langchain_core.tools.DynamicStructuredTool.html) class to declare tools. Here’s an example - note that tools must always return strings!

```typescript
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const multiplyTool = new DynamicStructuredTool({
  name: "multiply",
  description: "multiply two numbers together",
  schema: z.object({
    a: z.number().describe("the first number to multiply"),
    b: z.number().describe("the second number to multiply"),
  }),
  func: async ({ a, b }: { a: number; b: number }) => {
    return (a * b).toString();
  },
});

await multiplyTool.invoke({ a: 8, b: 9 });

```

```text
"72"

``` ## DynamicTool[​](#dynamictool) For older agents that require tools which accept only a single input, you can pass the relevant parameters to the [DynamicTool](https://api.js.langchain.com/classes/langchain_core.tools.DynamicTool.html) class. This is useful when working with older agents that only support tools that accept a single input. In this case, no schema is required:

```typescript
import { DynamicTool } from "@langchain/core/tools";

const searchTool = new DynamicTool({
  name: "search",
  description: "look things up online",
  func: async (_input: string) => {
    return "LangChain";
  },
});

await searchTool.invoke("foo");

```

```text
"LangChain"

``` # Returning artifacts of Tool execution Sometimes there are artifacts of a tool’s execution that we want to make accessible to downstream components in our chain or agent, but that we don’t want to expose to the model itself. For example if a tool returns custom objects like Documents, we may want to pass some view or metadata about this output to the model without passing the raw output to the model. At the same time, we may want to be able to access this full output elsewhere, for example in downstream tools.

The Tool and `ToolMessage` interfaces make it possible to distinguish between the parts of the tool output meant for the model (`ToolMessage.content`) and those parts which are meant for use outside the model (`ToolMessage.artifact`).

CompatibilityThis functionality was added in `@langchain/core>=0.2.16`. Please make sure your package is up to date.

If you want your tool to distinguish between message content and other artifacts, we need to do three things:

- Set the response_format parameter to "content_and_artifact" when defining the tool.
- Make sure that we return a tuple of [content, artifact].
- Call the tool with a a [ToolCall](https://api.js.langchain.com/types/langchain_core.messages_tool.ToolCall.html) (like the ones generated by tool-calling models) rather than with the required schema directly.

Here’s an example of what this looks like. First, create a new tool:

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const randomIntToolSchema = z.object({
  min: z.number(),
  max: z.number(),
  size: z.number(),
});

const generateRandomInts = tool(
  async ({ min, max, size }) => {
    const array: number[] = [];
    for (let i = 0; i < size; i++) {
      array.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return [
      `Successfully generated array of ${size} random ints in [${min}, ${max}].`,
      array,
    ];
  },
  {
    name: "generateRandomInts",
    description: "Generate size random ints in the range [min, max].",
    schema: randomIntToolSchema,
    responseFormat: "content_and_artifact",
  }
);

```

If you invoke our tool directly with the tool arguments, you’ll get back just the `content` part of the output:

```typescript
await generateRandomInts.invoke({ min: 0, max: 9, size: 10 });

```

```text
"Successfully generated array of 10 random ints in [0, 9]."

```But if you invoke our tool with a `ToolCall`, you’ll get back a ToolMessage that contains both the content and artifact generated by the `Tool`:

```typescript
await generateRandomInts.invoke({
  name: "generateRandomInts",
  args: { min: 0, max: 9, size: 10 },
  id: "123", // required
  type: "tool_call",
});

```

```text
ToolMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: "Successfully generated array of 10 random ints in [0, 9].",
    artifact: [
      7, 7, 1, 4, 8,
      4, 8, 3, 0, 9
    ],
    tool_call_id: "123",
    name: "generateRandomInts",
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ "langchain_core", "messages" ],
  content: "Successfully generated array of 10 random ints in [0, 9].",
  name: "generateRandomInts",
  additional_kwargs: {},
  response_metadata: {},
  id: undefined,
  tool_call_id: "123",
  artifact: [
    7, 7, 1, 4, 8,
    4, 8, 3, 0, 9
  ]
}

``` ## Related[​](#related) You’ve now seen a few ways to create custom tools in LangChain.

Next, you might be interested in learning [how to use a chat model to call tools](/docs/how_to/tool_calling/).

You can also check out how to create your own [custom versions of other modules](/docs/how_to/#custom).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Tool schema](#tool-schema)
- [tool function](#tool-function)
- [DynamicStructuredTool](#dynamicstructuredtool)
- [DynamicTool](#dynamictool)
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