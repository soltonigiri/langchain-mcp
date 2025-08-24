How to cancel execution | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to cancel executionPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Expression Language](/docs/concepts/lcel)[Chains](/docs/how_to/sequence/)[Streaming](/docs/how_to/streaming/)When building longer-running chains or [LangGraph](https://langchain-ai.github.io/langgraphjs/) agents, you may want to interrupt execution in situations such as a user leaving your app or submitting a new query.[LangChain Expression Language (LCEL)](/docs/concepts/lcel) supports aborting runnables that are in-progress via a runtime [signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal) option.CompatibilityBuilt-in signal support requires @langchain/core>=0.2.20. Please see here for a [guide on upgrading](/docs/how_to/installation/#installing-integration-packages).Note:** Individual integrations like chat models or retrievers may have missing or differing implementations for aborting execution. Signal support as described in this guide will apply in between steps of a chain.To see how this works, construct a chain such as the one below that performs [retrieval-augmented generation](/docs/tutorials/rag). It answers questions by first searching the web using [Tavily](/docs/integrations/retrievers/tavily), then passing the results to a chat model to generate a final answer: ### Pick your chat model: Groq
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
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import type { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";

const formatDocsAsString = (docs: Document[]) => {
  return docs.map((doc) => doc.pageContent).join("\n\n");
};

const retriever = new TavilySearchAPIRetriever({
  k: 3,
});

const prompt = ChatPromptTemplate.fromTemplate(`
Use the following context to answer questions to the best of your ability:

<context>
{context}
</context>

Question: {question}`);

const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

```If you invoke it normally, you can see it returns up-to-date information:

```typescript
await chain.invoke("what is the current weather in SF?");

```

```text
Based on the provided context, the current weather in San Francisco is:

Temperature: 17.6°C (63.7°F)
Condition: Sunny
Wind: 14.4 km/h (8.9 mph) from WSW direction
Humidity: 74%
Cloud cover: 15%

The information indicates it&#x27;s a sunny day with mild temperatures and light winds. The data appears to be from August 2, 2024, at 17:00 local time.

```Now, let’s interrupt it early. Initialize an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) and pass its `signal` property into the chain execution. To illustrate the fact that the cancellation occurs as soon as possible, set a timeout of 100ms:

```typescript
const controller = new AbortController();

const startTimer = console.time("timer1");

setTimeout(() => controller.abort(), 100);

try {
  await chain.invoke("what is the current weather in SF?", {
    signal: controller.signal,
  });
} catch (e) {
  console.log(e);
}

console.timeEnd("timer1");

```

```text
Error: Aborted
    at EventTarget.<anonymous> (/Users/jacoblee/langchain/langchainjs/langchain-core/dist/utils/signal.cjs:19:24)
    at [nodejs.internal.kHybridDispatch] (node:internal/event_target:825:20)
    at EventTarget.dispatchEvent (node:internal/event_target:760:26)
    at abortSignal (node:internal/abort_controller:370:10)
    at AbortController.abort (node:internal/abort_controller:392:5)
    at Timeout._onTimeout (evalmachine.<anonymous>:7:29)
    at listOnTimeout (node:internal/timers:573:17)
    at process.processTimers (node:internal/timers:514:7)
timer1: 103.204ms

```And you can see that execution ends after just over 100ms. Looking at [this LangSmith trace](https://smith.langchain.com/public/63c04c3b-2683-4b73-a4f7-fb12f5cb9180/r), you can see that the model is never called.

## Streaming[​](#streaming)

You can pass a `signal` when streaming too. This gives you more control over using a `break` statement within the `for await... of` loop to cancel the current run, which will only trigger after final output has already started streaming. The below example uses a `break` statement - note the time elapsed before cancellation occurs:

```typescript
const startTimer2 = console.time("timer2");

const stream = await chain.stream("what is the current weather in SF?");

for await (const chunk of stream) {
  console.log("chunk", chunk);
  break;
}

console.timeEnd("timer2");

```

```text
chunk
timer2: 3.990s

```Now compare this to using a signal. Note that you will need to wrap the stream in a `try/catch` block:

```typescript
const controllerForStream = new AbortController();

const startTimer3 = console.time("timer3");

setTimeout(() => controllerForStream.abort(), 100);

try {
  const streamWithSignal = await chain.stream(
    "what is the current weather in SF?",
    {
      signal: controllerForStream.signal,
    }
  );
  for await (const chunk of streamWithSignal) {
    console.log(chunk);
    break;
  }
} catch (e) {
  console.log(e);
}

console.timeEnd("timer3");

```

```text
Error: Aborted
    at EventTarget.<anonymous> (/Users/jacoblee/langchain/langchainjs/langchain-core/dist/utils/signal.cjs:19:24)
    at [nodejs.internal.kHybridDispatch] (node:internal/event_target:825:20)
    at EventTarget.dispatchEvent (node:internal/event_target:760:26)
    at abortSignal (node:internal/abort_controller:370:10)
    at AbortController.abort (node:internal/abort_controller:392:5)
    at Timeout._onTimeout (evalmachine.<anonymous>:7:38)
    at listOnTimeout (node:internal/timers:573:17)
    at process.processTimers (node:internal/timers:514:7)
timer3: 100.684ms

```

## Related[​](#related)

- [Pass through arguments from one step to the next](/docs/how_to/passthrough)
- [Dispatching custom events](/docs/how_to/callbacks_custom_events)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Streaming](#streaming)
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