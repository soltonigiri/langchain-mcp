How to use output parsers to parse an LLM response into structured format | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to use output parsers to parse an LLM response into structured formatPrerequisitesThis guide assumes familiarity with the following concepts:Output parsers](/docs/concepts/output_parsers)
- [Chat models](/docs/concepts/chat_models)

Language models output text. But there are times where you want to get more structured information than just text back. While some model providers support [built-in ways to return structured output](/docs/how_to/structured_output), not all do. For these providers, you must use prompting to encourage the model to return structured data in the desired format.

LangChain has [output parsers](/docs/concepts/output_parsers) which can help parse model outputs into usable objects. We’ll go over a few examples below.

## Get started[​](#get-started)

The primary type of output parser for working with structured data in model responses is the [StructuredOutputParser](https://api.js.langchain.com/classes/langchain_core.output_parsers.StructuredOutputParser.html). In the below example, we define a schema for the type of output we expect from the model using [zod](https://zod.dev).

First, let’s see the default formatting instructions we’ll plug into the prompt:

### Pick your chat model:

- Groq
- OpenAI
- Anthropic
- Google Gemini
- FireworksAI
- MistralAI
- VertexAI

#### Install dependencies

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

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
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

``` #### Add environment variables

```bash
FIREWORKS_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const model = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
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
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const zodSchema = z.object({
  answer: z.string().describe("answer to the user&#x27;s question"),
  source: z
    .string()
    .describe(
      "source used to answer the user&#x27;s question, should be a website."
    ),
});

const parser = StructuredOutputParser.fromZodSchema(zodSchema);

const chain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(
    "Answer the users question as best as possible.\n{format_instructions}\n{question}"
  ),
  model,
  parser,
]);

console.log(parser.getFormatInstructions());

```

```text
You must format your output as a JSON value that adheres to a given "JSON Schema" instance.

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!

Here is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:
```json
{"type":"object","properties":{"answer":{"type":"string","description":"answer to the user&#x27;s question"},"source":{"type":"string","description":"source used to answer the user&#x27;s question, should be a website."}},"required":["answer","source"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}
```

```Next, let’s invoke the chain:

```typescript
const response = await chain.invoke({
  question: "What is the capital of France?",
  format_instructions: parser.getFormatInstructions(),
});

console.log(response);

```

```text
{
  answer: "The capital of France is Paris.",
  source: "https://en.wikipedia.org/wiki/Paris"
}

```Output parsers implement the [Runnable interface](/docs/how_to/#langchain-expression-language-lcel), the basic building block of [LangChain Expression Language (LCEL)](/docs/how_to/#langchain-expression-language-lcel). This means they support `invoke`, `stream`, `batch`, `streamLog` calls.

## Validation[​](#validation)

One feature of the `StructuredOutputParser` is that it supports stricter Zod validations. For example, if you pass a simulated model output that does not conform to the schema, we get a detailed type error:

```typescript
import { AIMessage } from "@langchain/core/messages";

await parser.invoke(new AIMessage(`{"badfield": "foo"}`));

```

```text
Error: Failed to parse. Text: "{"badfield": "foo"}". Error: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "answer"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "source"
    ],
    "message": "Required"
  }
]

```Compared to:

```typescript
await parser.invoke(
  new AIMessage(`{"answer": "Paris", "source": "I made it up"}`)
);

```

```text
{ answer: "Paris", source: "I made it up" }

```More advanced Zod validations are supported as well. To learn more, check out the [Zod documentation](https://zod.dev).

## Streaming[​](#streaming)

While all parsers are runnables and support the streaming interface, only certain parsers can stream through partially parsed objects, since this is highly dependent on the output type. The `StructuredOutputParser` does not support partial streaming because it validates the output at each step. If you try to stream using a chain with this output parser, the chain will simply yield the fully parsed output:

```typescript
const stream = await chain.stream({
  question: "What is the capital of France?",
  format_instructions: parser.getFormatInstructions(),
});

for await (const s of stream) {
  console.log(s);
}

```

```text
{
  answer: "The capital of France is Paris.",
  source: "https://en.wikipedia.org/wiki/Paris"
}

```The simpler [JsonOutputParser](https://api.js.langchain.com/classes/langchain_core.output_parsers.JsonOutputParser.html), however, supports streaming through partial outputs:

```typescript
import { JsonOutputParser } from "@langchain/core/output_parsers";

const template = `Return a JSON object with a single key named "answer" that answers the following question: {question}.
Do not wrap the JSON output in markdown blocks.`;

const jsonPrompt = ChatPromptTemplate.fromTemplate(template);
const jsonParser = new JsonOutputParser();
const jsonChain = jsonPrompt.pipe(model).pipe(jsonParser);

const stream = await jsonChain.stream({
  question: "Who invented the microscope?",
});

for await (const s of stream) {
  console.log(s);
}

```

```text
{}
{ answer: "" }
{ answer: "The" }
{ answer: "The invention" }
{ answer: "The invention of" }
{ answer: "The invention of the" }
{ answer: "The invention of the microscope" }
{ answer: "The invention of the microscope is" }
{ answer: "The invention of the microscope is attributed" }
{ answer: "The invention of the microscope is attributed to" }
{ answer: "The invention of the microscope is attributed to Hans" }
{ answer: "The invention of the microscope is attributed to Hans L" }
{
  answer: "The invention of the microscope is attributed to Hans Lippers"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey,"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zach"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Jans"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen,"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Anton"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 4 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 8 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 12 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 13 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 18 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 20 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 26 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 29 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 33 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 38 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 43 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 48 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 51 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 52 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 57 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 63 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 73 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 80 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 81 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 85 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 94 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 99 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 108 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 112 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 118 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 127 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 138 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 145 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 149 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 150 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 151 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 157 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 159 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 163 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 167 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 171 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 175 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 176 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 181 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 186 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 190 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 202 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 203 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 209 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 214 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 226 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 239 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 242 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 246 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 253 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 257 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 262 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 265 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 268 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 273 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 288 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 300 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 303 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 311 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 316 more characters
}
{
  answer: "The invention of the microscope is attributed to Hans Lippershey, Zacharias Janssen, and Antonie van"... 317 more characters
}

``` ## Next steps[​](#next-steps) You’ve learned about using output parsers to parse structured outputs from prompted model outputs.

Next, check out the [guide on tool calling](/docs/how_to/tool_calling), a more built-in way of obtaining structured output that some model providers support, or read more about output parsers for other types of structured data like [XML](/docs/how_to/output_parser_xml).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Get started](#get-started)
- [Validation](#validation)
- [Streaming](#streaming)
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