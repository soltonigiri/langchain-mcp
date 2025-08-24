How to return structured data from a model | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to return structured data from a modelIt is often useful to have a model return output that matches some specific schema. One common use-case is extracting data from arbitrary text to insert into a traditional database or use with some other downstream system. This guide will show you a few different strategies you can use to do this.PrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)

## The .withStructuredOutput() method[​](#the-.withstructuredoutput-method)

There are several strategies that models can use under the hood. For some of the most popular model providers, including [Anthropic](/docs/integrations/platforms/anthropic/), [Google VertexAI](/docs/integrations/platforms/google/), [Mistral](/docs/integrations/chat/mistral/), and [OpenAI](/docs/integrations/platforms/openai/) LangChain implements a common interface that abstracts away these strategies called `.withStructuredOutput`.

By invoking this method (and passing in [JSON schema](https://json-schema.org/) or a [Zod schema](https://zod.dev/)) the model will add whatever model parameters + output parsers are necessary to get back structured output matching the requested schema. If the model supports more than one way to do this (e.g., function calling vs JSON mode) - you can configure which method to use by passing into that method.

Let’s look at some examples of this in action! We’ll use Zod to create a simple response schema.

### Pick your chat model:

- OpenAI
- Anthropic
- Google Gemini
- MistralAI
- Groq
- VertexAI

#### Install dependencies

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/openai

```

```bash
yarn add @langchain/openai

```

```bash
pnpm add @langchain/openai

``` #### Add environment variables

```bash
OPENAI_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/anthropic

```

```bash
yarn add @langchain/anthropic

```

```bash
pnpm add @langchain/anthropic

``` #### Add environment variables

```bash
ANTHROPIC_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/google-genai

```

```bash
yarn add @langchain/google-genai

```

```bash
pnpm add @langchain/google-genai

``` #### Add environment variables

```bash
GOOGLE_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/mistralai

```

```bash
yarn add @langchain/mistralai

```

```bash
pnpm add @langchain/mistralai

``` #### Add environment variables

```bash
MISTRAL_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/groq

```

```bash
yarn add @langchain/groq

```

```bash
pnpm add @langchain/groq

``` #### Add environment variables

```bash
GROQ_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/google-vertexai

```

```bash
yarn add @langchain/google-vertexai

```

```bash
pnpm add @langchain/google-vertexai

``` #### Add environment variables

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json

``` #### Instantiate the model

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```

```typescript
import { z } from "zod";

const joke = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline to the joke"),
  rating: z.number().optional().describe("How funny the joke is, from 1 to 10"),
});

const structuredLlm = model.withStructuredOutput(joke);

await structuredLlm.invoke("Tell me a joke about cats");

```

```text
{
  setup: "Why don&#x27;t cats play poker in the wild?",
  punchline: "Too many cheetahs.",
  rating: 7
}

```One key point is that though we set our Zod schema as a variable named `joke`, Zod is not able to access that variable name, and therefore cannot pass it to the model. Though it is not required, we can pass a name for our schema in order to give the model additional context as to what our schema represents, improving performance:

```typescript
const structuredLlm = model.withStructuredOutput(joke, { name: "joke" });

await structuredLlm.invoke("Tell me a joke about cats");

```

```text
{
  setup: "Why don&#x27;t cats play poker in the wild?",
  punchline: "Too many cheetahs!",
  rating: 7
}

```The result is a JSON object.

We can also pass in an OpenAI-style JSON schema dict if you prefer not to use Zod. This object should contain three properties:

- name: The name of the schema to output.
- description: A high level description of the schema to output.
- parameters: The nested details of the schema you want to extract, formatted as a [JSON schema](https://json-schema.org/) dict.

In this case, the response is also a dict:

```typescript
const structuredLlm = model.withStructuredOutput({
  name: "joke",
  description: "Joke to tell user.",
  parameters: {
    title: "Joke",
    type: "object",
    properties: {
      setup: { type: "string", description: "The setup for the joke" },
      punchline: { type: "string", description: "The joke&#x27;s punchline" },
    },
    required: ["setup", "punchline"],
  },
});

await structuredLlm.invoke("Tell me a joke about cats", { name: "joke" });

```

```text
{
  setup: "Why was the cat sitting on the computer?",
  punchline: "Because it wanted to keep an eye on the mouse!"
}

```If you are using JSON Schema, you can take advantage of other more complex schema descriptions to create a similar effect.

You can also use tool calling directly to allow the model to choose between options, if your chosen model supports it. This involves a bit more parsing and setup. See [this how-to guide](/docs/how_to/tool_calling/) for more details.

### Specifying the output method (Advanced)[​](#specifying-the-output-method-advanced)

For models that support more than one means of outputting data, you can specify the preferred one like this:

```typescript
const structuredLlm = model.withStructuredOutput(joke, {
  method: "json_mode",
  name: "joke",
});

await structuredLlm.invoke(
  "Tell me a joke about cats, respond in JSON with `setup` and `punchline` keys"
);

```

```text
{
  setup: "Why don&#x27;t cats play poker in the jungle?",
  punchline: "Too many cheetahs!"
}

```In the above example, we use OpenAI’s alternate JSON mode capability along with a more specific prompt.

For specifics about the model you choose, peruse its entry in the [API reference pages](https://api.js.langchain.com/).

### (Advanced) Raw outputs[​](#advanced-raw-outputs)

LLMs aren’t perfect at generating structured output, especially as schemas become complex. You can avoid raising exceptions and handle the raw output yourself by passing `includeRaw: true`. This changes the output format to contain the raw message output and the `parsed` value (if successful):

```typescript
const joke = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline to the joke"),
  rating: z.number().optional().describe("How funny the joke is, from 1 to 10"),
});

const structuredLlm = model.withStructuredOutput(joke, {
  includeRaw: true,
  name: "joke",
});

await structuredLlm.invoke("Tell me a joke about cats");

```

```text
{
  raw: AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "",
      tool_calls: [
        {
          name: "joke",
          args: [Object],
          id: "call_0pEdltlfSXjq20RaBFKSQOeF"
        }
      ],
      invalid_tool_calls: [],
      additional_kwargs: { function_call: undefined, tool_calls: [ [Object] ] },
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "",
    name: undefined,
    additional_kwargs: {
      function_call: undefined,
      tool_calls: [
        {
          id: "call_0pEdltlfSXjq20RaBFKSQOeF",
          type: "function",
          function: [Object]
        }
      ]
    },
    response_metadata: {
      tokenUsage: { completionTokens: 33, promptTokens: 88, totalTokens: 121 },
      finish_reason: "stop"
    },
    tool_calls: [
      {
        name: "joke",
        args: {
          setup: "Why was the cat sitting on the computer?",
          punchline: "Because it wanted to keep an eye on the mouse!",
          rating: 7
        },
        id: "call_0pEdltlfSXjq20RaBFKSQOeF"
      }
    ],
    invalid_tool_calls: [],
    usage_metadata: { input_tokens: 88, output_tokens: 33, total_tokens: 121 }
  },
  parsed: {
    setup: "Why was the cat sitting on the computer?",
    punchline: "Because it wanted to keep an eye on the mouse!",
    rating: 7
  }
}

``` ## Prompting techniques[​](#prompting-techniques) You can also prompt models to outputting information in a given format. This approach relies on designing good prompts and then parsing the output of the models. This is the only option for models that don’t support `.with_structured_output()` or other built-in approaches.

### Using JsonOutputParser[​](#using-jsonoutputparser)

The following example uses the built-in [JsonOutputParser](https://api.js.langchain.com/classes/langchain_core.output_parsers.JsonOutputParser.html) to parse the output of a chat model prompted to match a the given JSON schema. Note that we are adding `format_instructions` directly to the prompt from a method on the parser:

```typescript
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

type Person = {
  name: string;
  height_in_meters: number;
};

type People = {
  people: Person[];
};

const formatInstructions = `Respond only in valid JSON. The JSON object you return should match the following schema:
{{ people: [{{ name: "string", height_in_meters: "number" }}] }}

Where people is an array of objects, each with a name and height_in_meters field.
`;

// Set up a parser
const parser = new JsonOutputParser<People>();

// Prompt
const prompt = await ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user query. Wrap the output in `json` tags\n{format_instructions}",
  ],
  ["human", "{query}"],
]).partial({
  format_instructions: formatInstructions,
});

```

Let’s take a look at what information is sent to the model:

```typescript
const query = "Anna is 23 years old and she is 6 feet tall";

console.log((await prompt.format({ query })).toString());

```

```text
System: Answer the user query. Wrap the output in `json` tags
Respond only in valid JSON. The JSON object you return should match the following schema:
{{ people: [{{ name: "string", height_in_meters: "number" }}] }}

Where people is an array of objects, each with a name and height_in_meters field.

Human: Anna is 23 years old and she is 6 feet tall

```And now let’s invoke it:

```typescript
const chain = prompt.pipe(model).pipe(parser);

await chain.invoke({ query });

```

```text
{ people: [ { name: "Anna", height_in_meters: 1.83 } ] }

```For a deeper dive into using output parsers with prompting techniques for structured output, see [this guide](/docs/how_to/output_parser_structured).

### Custom Parsing[​](#custom-parsing)

You can also create a custom prompt and parser with [LangChain Expression Language (LCEL)](/docs/concepts/lcel), using a plain function to parse the output from the model:

```typescript
import { AIMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";

type Person = {
  name: string;
  height_in_meters: number;
};

type People = {
  people: Person[];
};

const schema = `{{ people: [{{ name: "string", height_in_meters: "number" }}] }}`;

// Prompt
const prompt = await ChatPromptTemplate.fromMessages([
  [
    "system",
    `Answer the user query. Output your answer as JSON that
matches the given schema: \`\`\`json\n{schema}\n\`\`\`.
Make sure to wrap the answer in \`\`\`json and \`\`\` tags`,
  ],
  ["human", "{query}"],
]).partial({
  schema,
});

/**
 * Custom extractor
 *
 * Extracts JSON content from a string where
 * JSON is embedded between ```json and ``` tags.
 */
const extractJson = (output: AIMessage): Array<People> => {
  const text = output.content as string;
  // Define the regular expression pattern to match JSON blocks
  const pattern = /```json(.*?)```/gs;

  // Find all non-overlapping matches of the pattern in the string
  const matches = text.match(pattern);

  // Process each match, attempting to parse it as JSON
  try {
    return (
      matches?.map((match) => {
        // Remove the markdown code block syntax to isolate the JSON string
        const jsonStr = match.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
      }) ?? []
    );
  } catch (error) {
    throw new Error(`Failed to parse: ${output}`);
  }
};

```

Here is the prompt sent to the model:

```typescript
const query = "Anna is 23 years old and she is 6 feet tall";

console.log((await prompt.format({ query })).toString());

```

```text
System: Answer the user query. Output your answer as JSON that
matches the given schema: ```json
{{ people: [{{ name: "string", height_in_meters: "number" }}] }}
```.
Make sure to wrap the answer in ```json and ``` tags
Human: Anna is 23 years old and she is 6 feet tall

```And here’s what it looks like when we invoke it:

```typescript
import { RunnableLambda } from "@langchain/core/runnables";

const chain = prompt
  .pipe(model)
  .pipe(new RunnableLambda({ func: extractJson }));

await chain.invoke({ query });

```

```text
[
  { people: [ { name: "Anna", height_in_meters: 1.83 } ] }
]

``` ## Next steps[​](#next-steps) Now you’ve learned a few methods to make a model output structured data.

To learn more, check out the other how-to guides in this section, or the conceptual guide on tool calling.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [The .withStructuredOutput() method](#the-.withstructuredoutput-method)[Specifying the output method (Advanced)](#specifying-the-output-method-advanced)
- [(Advanced) Raw outputs](#advanced-raw-outputs)

- [Prompting techniques](#prompting-techniques)[Using JsonOutputParser](#using-jsonoutputparser)
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