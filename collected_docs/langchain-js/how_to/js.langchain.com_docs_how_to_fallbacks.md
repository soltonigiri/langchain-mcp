Fallbacks | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageFallbacksPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Expression Language (LCEL)](/docs/concepts/lcel)[Chaining runnables](/docs/how_to/sequence/)When working with language models, you may encounter issues from the underlying APIs, e.g. rate limits or downtime. As you move your LLM applications into production it becomes more and more important to have contingencies for errors. That&#x27;s why we&#x27;ve introduced the concept of fallbacks.Crucially, fallbacks can be applied not only on the LLM level but on the whole runnable level. This is important because often times different models require different prompts. So if your call to OpenAI fails, you don&#x27;t just want to send the same prompt to Anthropic - you probably want want to use e.g. a different prompt template.Handling LLM API errors[​](#handling-llm-api-errors)This is maybe the most common use case for fallbacks. A request to an LLM API can fail for a variety of reasons - the API could be down, you could have hit a rate limit, or any number of things.IMPORTANT:** By default, many of LangChain&#x27;s LLM wrappers catch errors and retry. You will most likely want to turn those off when working with fallbacks. Otherwise the first wrapper will keep on retrying rather than failing.tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- Yarn
- pnpm

```bash
npm install @langchain/anthropic @langchain/openai @langchain/core

```

```bash
yarn add @langchain/anthropic @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/anthropic @langchain/openai @langchain/core

```

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";

// Use a fake model name that will always throw an error
const fakeOpenAIModel = new ChatOpenAI({
  model: "potato!",
  maxRetries: 0,
});

const anthropicModel = new ChatAnthropic({});

const modelWithFallback = fakeOpenAIModel.withFallbacks([anthropicModel]);

const result = await modelWithFallback.invoke("What is your name?");

console.log(result);

/*
  AIMessage {
    content: &#x27; My name is Claude. I was created by Anthropic.&#x27;,
    additional_kwargs: {}
  }
*/

``` #### API Reference: - ChatOpenAI from @langchain/openai - ChatAnthropic from @langchain/anthropic ## Fallbacks for RunnableSequences[​](#fallbacks-for-runnablesequences) We can also create fallbacks for sequences, that are sequences themselves. Here we do that with two different models: ChatOpenAI and then normal OpenAI (which does not use a chat model). Because OpenAI is NOT a chat model, you likely want a different prompt.

```typescript
import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

const chatPrompt = ChatPromptTemplate.fromMessages<{ animal: string }>([
  [
    "system",
    "You&#x27;re a nice assistant who always includes a compliment in your response",
  ],
  ["human", "Why did the {animal} cross the road?"],
]);

// Use a fake model name that will always throw an error
const fakeOpenAIChatModel = new ChatOpenAI({
  model: "potato!",
  maxRetries: 0,
});

const prompt =
  PromptTemplate.fromTemplate(`Instructions: You should always include a compliment in your response.

Question: Why did the {animal} cross the road?

Answer:`);

const openAILLM = new OpenAI({});

const outputParser = new StringOutputParser();

const badChain = chatPrompt.pipe(fakeOpenAIChatModel).pipe(outputParser);

const goodChain = prompt.pipe(openAILLM).pipe(outputParser);

const chain = badChain.withFallbacks([goodChain]);

const result = await chain.invoke({
  animal: "dragon",
});

console.log(result);

/*
  I don&#x27;t know, but I&#x27;m sure it was an impressive sight. You must have a great imagination to come up with such an interesting question!
*/

```

#### API Reference: - ChatOpenAI from @langchain/openai - OpenAI from @langchain/openai - StringOutputParser from @langchain/core/output_parsers - ChatPromptTemplate from @langchain/core/prompts - PromptTemplate from @langchain/core/prompts ## Handling long inputs[​](#handling-long-inputs) One of the big limiting factors of LLMs in their context window. Sometimes you can count and track the length of prompts before sending them to an LLM, but in situations where that is hard/complicated you can fallback to a model with longer context length.

```typescript
import { ChatOpenAI } from "@langchain/openai";

// Use a model with a shorter context window
const shorterLlm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  maxRetries: 0,
});

const longerLlm = new ChatOpenAI({
  model: "gpt-3.5-turbo-16k",
});

const modelWithFallback = shorterLlm.withFallbacks([longerLlm]);

const input = `What is the next number: ${"one, two, ".repeat(3000)}`;

try {
  await shorterLlm.invoke(input);
} catch (e) {
  // Length error
  console.log(e);
}

const result = await modelWithFallback.invoke(input);

console.log(result);

/*
  AIMessage {
    content: &#x27;The next number is one.&#x27;,
    name: undefined,
    additional_kwargs: { function_call: undefined }
  }
*/

```

#### API Reference: - ChatOpenAI from @langchain/openai ## Fallback to a better model[​](#fallback-to-a-better-model) Often times we ask models to output format in a specific format (like JSON). Models like GPT-3.5 can do this okay, but sometimes struggle. This naturally points to fallbacks - we can try with a faster and cheaper model, but then if parsing fails we can use GPT-4.

```typescript
import { z } from "zod";
import { OpenAI, ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

const prompt = PromptTemplate.fromTemplate(
  `Return a JSON object containing the following value wrapped in an "input" key. Do not return anything else:\n{input}`
);

const badModel = new OpenAI({
  maxRetries: 0,
  model: "gpt-3.5-turbo-instruct",
});

const normalModel = new ChatOpenAI({
  model: "gpt-4",
});

const outputParser = StructuredOutputParser.fromZodSchema(
  z.object({
    input: z.string(),
  })
);

const badChain = prompt.pipe(badModel).pipe(outputParser);

const goodChain = prompt.pipe(normalModel).pipe(outputParser);

try {
  const result = await badChain.invoke({
    input: "testing0",
  });
} catch (e) {
  console.log(e);
  /*
  OutputParserException [Error]: Failed to parse. Text: "

  { "name" : " Testing0 ", "lastname" : " testing ", "fullname" : " testing ", "role" : " test ", "telephone" : "+1-555-555-555 ", "email" : " testing@gmail.com ", "role" : " test ", "text" : " testing0 is different than testing ", "role" : " test ", "immediate_affected_version" : " 0.0.1 ", "immediate_version" : " 1.0.0 ", "leading_version" : " 1.0.0 ", "version" : " 1.0.0 ", "finger prick" : " no ", "finger prick" : " s ", "text" : " testing0 is different than testing ", "role" : " test ", "immediate_affected_version" : " 0.0.1 ", "immediate_version" : " 1.0.0 ", "leading_version" : " 1.0.0 ", "version" : " 1.0.0 ", "finger prick" :". Error: SyntaxError: Unexpected end of JSON input
*/
}

const chain = badChain.withFallbacks([goodChain]);

const result = await chain.invoke({
  input: "testing",
});

console.log(result);

/*
  { input: &#x27;testing&#x27; }
*/

```

#### API Reference:

- OpenAI from @langchain/openai
- ChatOpenAI from @langchain/openai
- PromptTemplate from @langchain/core/prompts
- StructuredOutputParser from @langchain/core/output_parsers

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Handling LLM API errors](#handling-llm-api-errors)
- [Fallbacks for RunnableSequences](#fallbacks-for-runnablesequences)
- [Handling long inputs](#handling-long-inputs)
- [Fallback to a better model](#fallback-to-a-better-model)

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