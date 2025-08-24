How to do extraction without using function calling | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to do extraction without using function callingPrerequisitesThis guide assumes familiarity with the following:Extraction](/docs/tutorials/extraction)

LLMs that are able to follow prompt instructions well can be tasked with outputting information in a given format without using function calling.

This approach relies on designing good prompts and then parsing the output of the LLMs to make them extract information well, though it lacks some of the guarantees provided by function calling or JSON mode.

Here, we’ll use Claude which is great at following instructions! See [here for more about Anthropic models](/docs/integrations/chat/anthropic).

First, we’ll install the integration package:

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/anthropic @langchain/core zod zod-to-json-schema

```

```bash
yarn add @langchain/anthropic @langchain/core zod zod-to-json-schema

```

```bash
pnpm add @langchain/anthropic @langchain/core zod zod-to-json-schema

```

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
  temperature: 0,
});

```tipAll the same considerations for extraction quality apply for parsing approach.

This tutorial is meant to be simple, but generally should really include reference examples to squeeze out performance!

## Using StructuredOutputParser[​](#using-structuredoutputparser)

The following example uses the built-in [StructuredOutputParser](/docs/how_to/output_parser_structured/) to parse the output of a chat model. We use the built-in prompt formatting instructions contained in the parser.

```typescript
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

let personSchema = z
  .object({
    name: z.optional(z.string()).describe("The name of the person"),
    hair_color: z
      .optional(z.string())
      .describe("The color of the person&#x27;s hair, if known"),
    height_in_meters: z
      .optional(z.string())
      .describe("Height measured in meters"),
  })
  .describe("Information about a person.");

const parser = StructuredOutputParser.fromZodSchema(personSchema);

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user query. Wrap the output in `json` tags\n{format_instructions}",
  ],
  ["human", "{query}"],
]);

const partialedPrompt = await prompt.partial({
  format_instructions: parser.getFormatInstructions(),
});

```

Let’s take a look at what information is sent to the model

```typescript
const query = "Anna is 23 years old and she is 6 feet tall";

```

```typescript
const promptValue = await partialedPrompt.invoke({ query });

console.log(promptValue.toChatMessages());

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "Answer the user query. Wrap the output in `json` tags\n" +
        "You must format your output as a JSON value th"... 1444 more characters,
      additional_kwargs: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "Answer the user query. Wrap the output in `json` tags\n" +
      "You must format your output as a JSON value th"... 1444 more characters,
    name: undefined,
    additional_kwargs: {}
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "Anna is 23 years old and she is 6 feet tall",
      additional_kwargs: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "Anna is 23 years old and she is 6 feet tall",
    name: undefined,
    additional_kwargs: {}
  }
]

```

```typescript
const chain = partialedPrompt.pipe(model).pipe(parser);

await chain.invoke({ query });

```

```text
{ name: "Anna", hair_color: "", height_in_meters: "1.83" }

``` ## Custom Parsing[​](#custom-parsing) You can also create a custom prompt and parser with `LangChain` and `LCEL`.

You can use a raw function to parse the output from the model.

In the below example, we’ll pass the schema into the prompt as JSON schema. For convenience, we’ll declare our schema with Zod, then use the [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema) utility to convert it to JSON schema.

```typescript
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

personSchema = z
  .object({
    name: z.optional(z.string()).describe("The name of the person"),
    hair_color: z
      .optional(z.string())
      .describe("The color of the person&#x27;s hair, if known"),
    height_in_meters: z
      .optional(z.string())
      .describe("Height measured in meters"),
  })
  .describe("Information about a person.");

const peopleSchema = z.object({
  people: z.array(personSchema),
});

const SYSTEM_PROMPT_TEMPLATE = [
  "Answer the user&#x27;s query. You must return your answer as JSON that matches the given schema:",
  "```json\n{schema}\n```.",
  "Make sure to wrap the answer in ```json and ``` tags. Conform to the given schema exactly.",
].join("\n");

const customParsingPrompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT_TEMPLATE],
  ["human", "{query}"],
]);

const extractJsonFromOutput = (message) => {
  const text = message.content;

  // Define the regular expression pattern to match JSON blocks
  const pattern = /```json\s*((.|\n)*?)\s*```/gs;

  // Find all non-overlapping matches of the pattern in the string
  const matches = pattern.exec(text);

  if (matches && matches[1]) {
    try {
      return JSON.parse(matches[1].trim());
    } catch (error) {
      throw new Error(`Failed to parse: ${matches[1]}`);
    }
  } else {
    throw new Error(`No JSON found in: ${message}`);
  }
};

```

```typescript
const customParsingQuery = "Anna is 23 years old and she is 6 feet tall";

const customParsingPromptValue = await customParsingPrompt.invoke({
  schema: zodToJsonSchema(peopleSchema),
  customParsingQuery,
});

customParsingPromptValue.toString();

```

```text
"System: Answer the user&#x27;s query. You must return your answer as JSON that matches the given schema:\n"... 170 more characters

```

```typescript
const customParsingChain = prompt.pipe(model).pipe(extractJsonFromOutput);

await customParsingChain.invoke({
  schema: zodToJsonSchema(peopleSchema),
  customParsingQuery,
});

```

```text
{ name: "Anna", age: 23, height: { feet: 6, inches: 0 } }

``` ## Next steps[​](#next-steps) You’ve now learned how to perform extraction without using tool calling.

Next, check out some of the other guides in this section, such as [some tips on how to improve extraction quality with examples](/docs/how_to/extraction_examples).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Using StructuredOutputParser](#using-structuredoutputparser)
- [Custom Parsing](#custom-parsing)
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