How to parse JSON output | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to parse JSON outputWhile some model providers support built-in ways to return structured output](/docs/how_to/structured_output), not all do. We can use an output parser to help users to specify an arbitrary JSON schema via the prompt, query a model for outputs that conform to that schema, and finally parse that schema as JSON.noteKeep in mind that large language models are leaky abstractions! You’ll have to use an LLM with sufficient capacity to generate well-formed JSON.PrerequisitesThis guide assumes familiarity with the following concepts:[Chat models](/docs/concepts/chat_models)
- [Output parsers](/docs/concepts/output_parsers)
- [Prompt templates](/docs/concepts/prompt_templates)
- [Structured output](/docs/how_to/structured_output)
- [Chaining runnables together](/docs/how_to/sequence/)

The [JsonOutputParser](https://api.js.langchain.com/classes/langchain_core.output_parsers.JsonOutputParser.html) is one built-in option for prompting for and then parsing JSON output.

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
import { ChatOpenAI } from "@langchain/openai";
const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define your desired data structure. Only used for typing the parser output.
interface Joke {
  setup: string;
  punchline: string;
}

// A query and format instructions used to prompt a language model.
const jokeQuery = "Tell me a joke.";
const formatInstructions =
  "Respond with a valid JSON object, containing two fields: &#x27;setup&#x27; and &#x27;punchline&#x27;.";

// Set up a parser + inject instructions into the prompt template.
const parser = new JsonOutputParser<Joke>();

const prompt = ChatPromptTemplate.fromTemplate(
  "Answer the user query.\n{format_instructions}\n{query}\n"
);

const partialedPrompt = await prompt.partial({
  format_instructions: formatInstructions,
});

const chain = partialedPrompt.pipe(model).pipe(parser);

await chain.invoke({ query: jokeQuery });

```

```text
{
  setup: "Why don&#x27;t scientists trust atoms?",
  punchline: "Because they make up everything!"
}

``` ## Streaming[​](#streaming) The `JsonOutputParser` also supports streaming partial chunks. This is useful when the model returns partial JSON output in multiple chunks. The parser will keep track of the partial chunks and return the final JSON output when the model finishes generating the output.

```typescript
for await (const s of await chain.stream({ query: jokeQuery })) {
  console.log(s);
}

```

```text
{}
{ setup: "" }
{ setup: "Why" }
{ setup: "Why don&#x27;t" }
{ setup: "Why don&#x27;t scientists" }
{ setup: "Why don&#x27;t scientists trust" }
{ setup: "Why don&#x27;t scientists trust atoms" }
{ setup: "Why don&#x27;t scientists trust atoms?", punchline: "" }
{ setup: "Why don&#x27;t scientists trust atoms?", punchline: "Because" }
{
  setup: "Why don&#x27;t scientists trust atoms?",
  punchline: "Because they"
}
{
  setup: "Why don&#x27;t scientists trust atoms?",
  punchline: "Because they make"
}
{
  setup: "Why don&#x27;t scientists trust atoms?",
  punchline: "Because they make up"
}
{
  setup: "Why don&#x27;t scientists trust atoms?",
  punchline: "Because they make up everything"
}
{
  setup: "Why don&#x27;t scientists trust atoms?",
  punchline: "Because they make up everything!"
}

``` ## Next steps[​](#next-steps) You’ve now learned one way to prompt a model to return structured JSON. Next, check out the [broader guide on obtaining structured output](/docs/how_to/structured_output) for other techniques.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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