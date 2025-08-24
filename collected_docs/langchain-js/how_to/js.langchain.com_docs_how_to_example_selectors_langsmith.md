How to select examples from a LangSmith dataset | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to select examples from a LangSmith datasetPrerequisitesChat models](/docs/concepts/chat_models)
- [Few-shot-prompting](/docs/concepts/few_shot_prompting)
- [LangSmith](/docs/concepts/#langsmith)

Compatibility - langsmith >= 0.1.43 LangSmith datasets have built-in support for similarity search, making them a great tool for building and querying few-shot examples.

In this guide we’ll see how to use an indexed LangSmith dataset as a few-shot example selector.

## Setup[​](#setup)

Before getting started make sure you’ve [created a LangSmith account](https://smith.langchain.com/) and set your credentials:

```typescript
process.env.LANGSMITH_API_KEY = "your-api-key";
process.env.LANGSMITH_TRACING = "true";

```

We’ll need to install the `langsmith` SDK. In this example we’ll also make use of `langchain` and `@langchain/anthropic`:

- npm
- yarn
- pnpm

```bash
npm i langsmith langchain @langchain/anthropic @langchain/core zod zod-to-json-schema

```

```bash
yarn add langsmith langchain @langchain/anthropic @langchain/core zod zod-to-json-schema

```

```bash
pnpm add langsmith langchain @langchain/anthropic @langchain/core zod zod-to-json-schema

```Now we’ll clone a public dataset and turn on indexing for the dataset. We can also turn on indexing via the [LangSmith UI](https://docs.smith.langchain.com/how_to_guides/datasets/index_datasets_for_dynamic_few_shot_example_selection).

We’ll create a clone the [Multiverse math few shot example dataset](https://blog.langchain.dev/few-shot-prompting-to-improve-tool-calling-performance/).

This enables searching over the dataset, and will make sure that anytime we update/add examples they are also indexed.

The first step to creating a clone is to read the JSON file containing the examples and convert them to the format expected by LangSmith for creating examples:

```typescript
import { Client as LangSmithClient } from "langsmith";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import fs from "fs/promises";

// Read the example dataset and convert to the format expected by the LangSmith API
// for creating new examples
const examplesJson = JSON.parse(
  await fs.readFile("../../data/ls_few_shot_example_dataset.json", "utf-8")
);

let inputs: Record<string, any>[] = [];
let outputs: Record<string, any>[] = [];
let metadata: Record<string, any>[] = [];

examplesJson.forEach((ex) => {
  inputs.push(ex.inputs);
  outputs.push(ex.outputs);
  metadata.push(ex.metadata);
});

// Define our input schema as this is required for indexing
const inputsSchema = zodToJsonSchema(
  z.object({
    input: z.string(),
    system: z.boolean().optional(),
  })
);

const lsClient = new LangSmithClient();

await lsClient.deleteDataset({
  datasetName: "multiverse-math-examples-for-few-shot-example",
});

const dataset = await lsClient.createDataset(
  "multiverse-math-examples-for-few-shot-example",
  {
    inputsSchema,
  }
);

const createdExamples = await lsClient.createExamples({
  inputs,
  outputs,
  metadata,
  datasetId: dataset.id,
});

```

```typescript
await lsClient.indexDataset({ datasetId: dataset.id });

```Once the dataset is indexed, we can search for similar examples like so:

```typescript
const examples = await lsClient.similarExamples(
  { input: "whats the negation of the negation of the negation of 3" },
  dataset.id,
  3
);
console.log(examples.length);

```

```text
3

```

```typescript
console.log(examples[0].inputs.input);

```

```text
evaluate the negation of -100

```For this dataset the outputs are an entire chat history:

```typescript
console.log(examples[1].outputs.output);

```

```text
[
  {
    id: &#x27;cbe7ed83-86e1-4e46-89de-6646f8b55cef&#x27;,
    type: &#x27;system&#x27;,
    content: &#x27;You are requested to solve math questions in an alternate mathematical universe. The operations have been altered to yield different results than expected. Do not guess the answer or rely on your  innate knowledge of math. Use the provided tools to answer the question. While associativity and commutativity apply, distributivity does not. Answer the question using the fewest possible tools. Only include the numeric response without any clarifications.&#x27;,
    additional_kwargs: {},
    response_metadata: {}
  },
  {
    id: &#x27;04946246-09a8-4465-be95-037efd7dae55&#x27;,
    type: &#x27;human&#x27;,
    content: &#x27;if one gazoink is 4 badoinks, each of which is 6 foos, each of wich is 3 bars - how many bars in 3 gazoinks?&#x27;,
    example: false,
    additional_kwargs: {},
    response_metadata: {}
  },
  {
    id: &#x27;run-d6f0954e-b21b-4ea8-ad98-0ee64cfc824e-0&#x27;,
    type: &#x27;ai&#x27;,
    content: [ [Object] ],
    example: false,
    tool_calls: [ [Object] ],
    usage_metadata: { input_tokens: 916, total_tokens: 984, output_tokens: 68 },
    additional_kwargs: {},
    response_metadata: {
      id: &#x27;msg_01MBWxgouUBzomwTvXhomGVq&#x27;,
      model: &#x27;claude-3-sonnet-20240229&#x27;,
      usage: [Object],
      stop_reason: &#x27;tool_use&#x27;,
      stop_sequence: null
    },
    invalid_tool_calls: []
  },
  {
    id: &#x27;3d4c72c4-f009-48ce-b739-1d3f28ee4803&#x27;,
    name: &#x27;multiply&#x27;,
    type: &#x27;tool&#x27;,
    content: &#x27;13.2&#x27;,
    tool_call_id: &#x27;toolu_016RjRHSEyDZRqKhGrb8uvjJ&#x27;,
    additional_kwargs: {},
    response_metadata: {}
  },
  {
    id: &#x27;run-26dd7e83-f5fb-4c70-8ba1-271300ffeb25-0&#x27;,
    type: &#x27;ai&#x27;,
    content: [ [Object] ],
    example: false,
    tool_calls: [ [Object] ],
    usage_metadata: { input_tokens: 999, total_tokens: 1070, output_tokens: 71 },
    additional_kwargs: {},
    response_metadata: {
      id: &#x27;msg_01VTFvtCxtR3rN58hCmjt2oH&#x27;,
      model: &#x27;claude-3-sonnet-20240229&#x27;,
      usage: [Object],
      stop_reason: &#x27;tool_use&#x27;,
      stop_sequence: null
    },
    invalid_tool_calls: []
  },
  {
    id: &#x27;ca4e0317-7b3a-4638-933c-1efd98bc4fda&#x27;,
    name: &#x27;multiply&#x27;,
    type: &#x27;tool&#x27;,
    content: &#x27;87.12&#x27;,
    tool_call_id: &#x27;toolu_01PqvszxiuXrVJ9bwgTWaH3q&#x27;,
    additional_kwargs: {},
    response_metadata: {}
  },
  {
    id: &#x27;run-007794ac-3590-4b9e-b678-008f02e40042-0&#x27;,
    type: &#x27;ai&#x27;,
    content: [ [Object] ],
    example: false,
    tool_calls: [ [Object] ],
    usage_metadata: { input_tokens: 1084, total_tokens: 1155, output_tokens: 71 },
    additional_kwargs: {},
    response_metadata: {
      id: &#x27;msg_017BEkSqmTsmtJaTxAzfRMEh&#x27;,
      model: &#x27;claude-3-sonnet-20240229&#x27;,
      usage: [Object],
      stop_reason: &#x27;tool_use&#x27;,
      stop_sequence: null
    },
    invalid_tool_calls: []
  },
  {
    id: &#x27;7f58c121-6f21-4c7b-ba38-aa820e274ff8&#x27;,
    name: &#x27;multiply&#x27;,
    type: &#x27;tool&#x27;,
    content: &#x27;287.496&#x27;,
    tool_call_id: &#x27;toolu_01LU3RqRUXZRLRoJ2AZNmPed&#x27;,
    additional_kwargs: {},
    response_metadata: {}
  },
  {
    id: &#x27;run-51e35afb-7ec6-4738-93e2-92f80b5c9377-0&#x27;,
    type: &#x27;ai&#x27;,
    content: &#x27;287.496&#x27;,
    example: false,
    tool_calls: [],
    usage_metadata: { input_tokens: 1169, total_tokens: 1176, output_tokens: 7 },
    additional_kwargs: {},
    response_metadata: {
      id: &#x27;msg_01Tx9kSNapSg8aUbWZXiS1NL&#x27;,
      model: &#x27;claude-3-sonnet-20240229&#x27;,
      usage: [Object],
      stop_reason: &#x27;end_turn&#x27;,
      stop_sequence: null
    },
    invalid_tool_calls: []
  }
]

```The search returns the examples whose inputs are most similar to the query input. We can use this for few-shot prompting a model. The first step is to create a series of math tools we want to allow the model to call:

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const add = tool(
  (input) => {
    return (input.a + input.b).toString();
  },
  {
    name: "add",
    description: "Add two numbers",
    schema: z.object({
      a: z.number().describe("The first number to add"),
      b: z.number().describe("The second number to add"),
    }),
  }
);

const cos = tool(
  (input) => {
    return Math.cos(input.angle).toString();
  },
  {
    name: "cos",
    description: "Calculate the cosine of an angle (in radians)",
    schema: z.object({
      angle: z.number().describe("The angle in radians"),
    }),
  }
);

const divide = tool(
  (input) => {
    return (input.a / input.b).toString();
  },
  {
    name: "divide",
    description: "Divide two numbers",
    schema: z.object({
      a: z.number().describe("The dividend"),
      b: z.number().describe("The divisor"),
    }),
  }
);

const log = tool(
  (input) => {
    return Math.log(input.value).toString();
  },
  {
    name: "log",
    description: "Calculate the natural logarithm of a number",
    schema: z.object({
      value: z.number().describe("The number to calculate the logarithm of"),
    }),
  }
);

const multiply = tool(
  (input) => {
    return (input.a * input.b).toString();
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number().describe("The first number to multiply"),
      b: z.number().describe("The second number to multiply"),
    }),
  }
);

const negate = tool(
  (input) => {
    return (-input.a).toString();
  },
  {
    name: "negate",
    description: "Negate a number",
    schema: z.object({
      a: z.number().describe("The number to negate"),
    }),
  }
);

const pi = tool(
  () => {
    return Math.PI.toString();
  },
  {
    name: "pi",
    description: "Return the value of pi",
    schema: z.object({}),
  }
);

const power = tool(
  (input) => {
    return Math.pow(input.base, input.exponent).toString();
  },
  {
    name: "power",
    description: "Raise a number to a power",
    schema: z.object({
      base: z.number().describe("The base number"),
      exponent: z.number().describe("The exponent"),
    }),
  }
);

const sin = tool(
  (input) => {
    return Math.sin(input.angle).toString();
  },
  {
    name: "sin",
    description: "Calculate the sine of an angle (in radians)",
    schema: z.object({
      angle: z.number().describe("The angle in radians"),
    }),
  }
);

const subtract = tool(
  (input) => {
    return (input.a - input.b).toString();
  },
  {
    name: "subtract",
    description: "Subtract two numbers",
    schema: z.object({
      a: z.number().describe("The number to subtract from"),
      b: z.number().describe("The number to subtract"),
    }),
  }
);

```

```typescript
import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  SystemMessage,
  BaseMessage,
  BaseMessageLike,
} from "@langchain/core/messages";
import { RunnableLambda } from "@langchain/core/runnables";
import { Client as LangSmithClient, Example } from "langsmith";
import { coerceMessageLikeToMessage } from "@langchain/core/messages";

const client = new LangSmithClient();

async function similarExamples(
  input: Record<string, any>
): Promise<Record<string, any>> {
  const examples = await client.similarExamples(input, dataset.id, 5);
  return { ...input, examples };
}

function constructPrompt(input: {
  examples: Example[];
  input: string;
}): BaseMessage[] {
  const instructions = "You are great at using mathematical tools.";
  let messages: BaseMessage[] = [];

  for (const ex of input.examples) {
    // Assuming ex.outputs.output is an array of message-like objects
    messages = messages.concat(
      ex.outputs.output.flatMap((msg: BaseMessageLike) =>
        coerceMessageLikeToMessage(msg)
      )
    );
  }

  const examples = messages.filter((msg) => msg._getType() !== "system");
  examples.forEach((ex) => {
    if (ex._getType() === "human") {
      ex.name = "example_user";
    } else {
      ex.name = "example_assistant";
    }
  });

  return [
    new SystemMessage(instructions),
    ...examples,
    new HumanMessage(input.input),
  ];
}

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});
const tools = [
  add,
  cos,
  divide,
  log,
  multiply,
  negate,
  pi,
  power,
  sin,
  subtract,
];
const llmWithTools = llm.bindTools(tools);

const exampleSelector = new RunnableLambda({
  func: similarExamples,
}).withConfig({ runName: "similarExamples" });

const chain = exampleSelector
  .pipe(
    new RunnableLambda({
      func: constructPrompt,
    }).withConfig({
      runName: "constructPrompt",
    })
  )
  .pipe(llmWithTools);

```

```typescript
const aiMsg = await chain.invoke({
  input: "whats the negation of the negation of 3",
  system: false,
});
console.log(aiMsg.tool_calls);

```

```text
[
  {
    name: &#x27;negate&#x27;,
    args: { a: 3 },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_SX0dmb4AbFu39KkGQDqPXQwa&#x27;
  }
]

```Looking at the LangSmith trace, we can see that relevant examples were pulled in in the `similarExamples` step and passed as messages to ChatOpenAI: [https://smith.langchain.com/public/20e09618-0746-4973-9382-5b36c3f27083/r](https://smith.langchain.com/public/20e09618-0746-4973-9382-5b36c3f27083/r).

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