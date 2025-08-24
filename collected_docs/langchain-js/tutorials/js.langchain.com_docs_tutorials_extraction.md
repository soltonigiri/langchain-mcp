Build an Extraction Chain | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageBuild an Extraction ChainPrerequisitesThis guide assumes familiarity with the following concepts:Chat Models](/docs/concepts/chat_models)[Tools](/docs/concepts/tools)[Tool calling](/docs/concepts/tool_calling)In this tutorial, we will build a chain to extract structured information from unstructured text.infoThis tutorial will only work with models that support function/tool calling** ## Setup[​](#setup) ### Installation[​](#installation) To install LangChain run:npm
- yarn
- pnpm

```bash
npm i langchain @langchain/core

```**

```bash
yarn add langchain @langchain/core

```

```bash
pnpm add langchain @langchain/core

```For more details, see our [Installation guide](/docs/how_to/installation/).LangSmith[​](#langsmith)Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com).After you sign up at the link above, make sure to set your environment variables to start logging traces:

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."

# Reduce tracing latency if you are not in a serverless environment
# export LANGCHAIN_CALLBACKS_BACKGROUND=true

```The Schema[​](#the-schema)First, we need to describe what information we want to extract from the text.We’ll use [Zod](https://zod.dev) to define an example schema that extracts personal information.npmyarnpnpm

```bash
npm i zod @langchain/core

```

```bash
yarn add zod @langchain/core

```

```bash
pnpm add zod @langchain/core

```

```typescript
import { z } from "zod";

const personSchema = z.object({
  name: z.nullish(z.string()).describe("The name of the person"),
  hair_color: z
    .nullish(z.string())
    .describe("The color of the person&#x27;s hair if known"),
  height_in_meters: z.nullish(z.string()).describe("Height measured in meters"),
});

```There are two best practices when defining schema:Document the attributes** and the **schema** itself: This
information is sent to the LLM and is used to improve the quality of
information extraction.
- Do not force the LLM to make up information! Above we used .nullish() for the attributes allowing the LLM to output null or undefined if it doesn’t know the answer.

infoFor best performance, document the schema well and make sure the model isn’t force to return results if there’s no information to be extracted in the text.

## The Extractor[​](#the-extractor)

Let’s create an information extractor using the schema we defined above.

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define a custom prompt to provide instructions and any additional context.
// 1) You can add examples into the prompt template to improve extraction quality
// 2) Introduce additional parameters to take context into account (e.g., include metadata
//    about the document from which the text was extracted.)
const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert extraction algorithm.
Only extract relevant information from the text.
If you do not know the value of an attribute asked to extract,
return null for the attribute&#x27;s value.`,
  ],
  // Please see the how-to about improving performance with
  // reference examples.
  // ["placeholder", "{examples}"],
  ["human", "{text}"],
]);

```**We need to use a model that supports function/tool calling.Please review [the documentation](/docs/integrations/chat) for list of some models that can be used with this API.Pick your chat model:GroqOpenAIAnthropicGoogle GeminiFireworksAIMistralAIVertexAIInstall dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/groq

```

```bash
yarn add @langchain/groq

```

```bash
pnpm add @langchain/groq

```Add environment variables

```bash
GROQ_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/openai

```

```bash
yarn add @langchain/openai

```

```bash
pnpm add @langchain/openai

```Add environment variables

```bash
OPENAI_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/anthropic

```

```bash
yarn add @langchain/anthropic

```

```bash
pnpm add @langchain/anthropic

```Add environment variables

```bash
ANTHROPIC_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const llm = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/google-genai

```

```bash
yarn add @langchain/google-genai

```

```bash
pnpm add @langchain/google-genai

```Add environment variables

```bash
GOOGLE_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

```Add environment variables

```bash
FIREWORKS_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const llm = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/mistralai

```

```bash
yarn add @langchain/mistralai

```

```bash
pnpm add @langchain/mistralai

```Add environment variables

```bash
MISTRAL_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/google-vertexai

```

```bash
yarn add @langchain/google-vertexai

```

```bash
pnpm add @langchain/google-vertexai

```Add environment variables

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json

```Instantiate the model

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```We enable structured output by creating a new object with the .withStructuredOutput method:

```typescript
const structured_llm = llm.withStructuredOutput(personSchema);

```We can then invoke it normally:

```typescript
const prompt = await promptTemplate.invoke({
  text: "Alan Smith is 6 feet tall and has blond hair.",
});
await structured_llm.invoke(prompt);

```

```text
{ name: &#x27;Alan Smith&#x27;, hair_color: &#x27;blond&#x27;, height_in_meters: &#x27;1.83&#x27; }

```infoExtraction is Generative 🤯LLMs are generative models, so they can do some pretty cool things like correctly extract the height of the person in meters even though it was provided in feet!We can see the LangSmith trace [here](https://smith.langchain.com/public/3d44b7e8-e7ca-4e02-951d-3290ccc89d64/r).Even though we defined our schema with the variable name personSchema, Zod is unable to infer this name and therefore does not pass it along to the model. To help give the LLM more clues as to what your provided schema represents, you can also give the schema you pass to withStructuredOutput() a name:

```typescript
const structured_llm2 = llm.withStructuredOutput(personSchema, {
  name: "person",
});

const prompt2 = await promptTemplate.invoke({
  text: "Alan Smith is 6 feet tall and has blond hair.",
});
await structured_llm2.invoke(prompt2);

```

```text
{ name: &#x27;Alan Smith&#x27;, hair_color: &#x27;blond&#x27;, height_in_meters: &#x27;1.83&#x27; }

```This can improve performance in many cases.Multiple Entities[​](#multiple-entities)In most cases**, you should be extracting a list of entities rather
than a single entity.

This can be easily achieved using Zod by nesting models inside one another.

```typescript
import { z } from "zod";

const person = z.object({
  name: z.nullish(z.string()).describe("The name of the person"),
  hair_color: z
    .nullish(z.string())
    .describe("The color of the person&#x27;s hair if known"),
  height_in_meters: z.nullish(z.number()).describe("Height measured in meters"),
});

const dataSchema = z.object({
  people: z.array(person).describe("Extracted data about people"),
});

```**infoExtraction might not be perfect here. Please continue to see how to use Reference Examples** to improve the quality of extraction, and see the
**guidelines** section!

```typescript
const structured_llm3 = llm.withStructuredOutput(dataSchema);
const prompt3 = await promptTemplate.invoke({
  text: "My name is Jeff, my hair is black and i am 6 feet tall. Anna has the same color hair as me.",
});
await structured_llm3.invoke(prompt3);

```**

```text
{
  people: [
    { name: &#x27;Jeff&#x27;, hair_color: &#x27;black&#x27;, height_in_meters: 1.83 },
    { name: &#x27;Anna&#x27;, hair_color: &#x27;black&#x27;, height_in_meters: null }
  ]
}

```tipWhen the schema accommodates the extraction of multiple entities**, it
also allows the model to extract **no entities** if no relevant
information is in the text by providing an empty list.

This is usually a **good** thing! It allows specifying **required** attributes on an entity without necessarily forcing the model to detect this entity.

We can see the LangSmith trace [here](https://smith.langchain.com/public/272096ab-9ac5-43f9-aa00-3b8443477d17/r)

## Next steps[​](#next-steps)

Now that you understand the basics of extraction with LangChain, you’re ready to proceed to the rest of the how-to guides:

- [Add Examples](/docs/how_to/extraction_examples): Learn how to use **reference examples** to improve performance.
- [Handle Long Text](/docs/how_to/extraction_long_text): What should you do if the text does not fit into the context window of the LLM?
- [Use a Parsing Approach](/docs/how_to/extraction_parse): Use a prompt based approach to extract with models that do not support **tool/function calling**.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)[Installation](#installation)
- [LangSmith](#langsmith)

- [The Schema](#the-schema)
- [The Extractor](#the-extractor)
- [Multiple Entities](#multiple-entities)
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