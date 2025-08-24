How to chain runnables | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to chain runnablesOne point about LangChain Expression Language](/docs/concepts/lcel) is that any two runnables can be “chained” together into sequences. The output of the previous runnable’s .invoke() call is passed as input to the next runnable. This can be done using the .pipe() method.The resulting [RunnableSequence](https://api.js.langchain.com/classes/langchain_core.runnables.RunnableSequence.html) is itself a runnable, which means it can be invoked, streamed, or further chained just like any other runnable. Advantages of chaining runnables in this way are efficient streaming (the sequence will stream output as soon as it is available), and debugging and tracing with tools like [LangSmith](/docs/how_to/debugging).PrerequisitesThis guide assumes familiarity with the following concepts:[LangChain Expression Language (LCEL)](/docs/concepts/lcel)
- [Prompt templates](/docs/concepts/prompt_templates)
- [Chat models](/docs/concepts/chat_models)
- [Output parser](/docs/concepts/output_parsers)

## The pipe method[​](#the-pipe-method)

To show off how this works, let’s go through an example. We’ll walk through a common pattern in LangChain: using a [prompt template](/docs/concepts/prompt_templates) to format input into a [chat model](/docs/concepts/chat_models), and finally converting the chat message output into a string with an [output parser](/docs/concepts/output_parsers).

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

```tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i langchain @langchain/core

```

```bash
yarn add langchain @langchain/core

```

```bash
pnpm add langchain @langchain/core

```

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromTemplate("tell me a joke about {topic}");

const chain = prompt.pipe(model).pipe(new StringOutputParser());

```Prompts and models are both runnable, and the output type from the prompt call is the same as the input type of the chat model, so we can chain them together. We can then invoke the resulting sequence like any other runnable:

```typescript
await chain.invoke({ topic: "bears" });

```

```text
"Here&#x27;s a bear joke for you:\n\nWhy did the bear dissolve in water?\nBecause it was a polar bear!"

``` ### Coercion[​](#coercion) We can even combine this chain with more runnables to create another chain. This may involve some input/output formatting using other types of runnables, depending on the required inputs and outputs of the chain components.

For example, let’s say we wanted to compose the joke generating chain with another chain that evaluates whether or not the generated joke was funny.

We would need to be careful with how we format the input into the next chain. In the below example, the dict in the chain is automatically parsed and converted into a [RunnableParallel](/docs/how_to/parallel), which runs all of its values in parallel and returns a dict with the results.

This happens to be the same format the next prompt template expects. Here it is in action:

```typescript
import { RunnableLambda } from "@langchain/core/runnables";

const analysisPrompt = ChatPromptTemplate.fromTemplate(
  "is this a funny joke? {joke}"
);

const composedChain = new RunnableLambda({
  func: async (input: { topic: string }) => {
    const result = await chain.invoke(input);
    return { joke: result };
  },
})
  .pipe(analysisPrompt)
  .pipe(model)
  .pipe(new StringOutputParser());

await composedChain.invoke({ topic: "bears" });

```

```text
&#x27;Haha, that\&#x27;s a clever play on words! Using "polar" to imply the bear dissolved or became polar/polarized when put in water. Not the most hilarious joke ever, but it has a cute, groan-worthy pun that makes it mildly amusing. I appreciate a good pun or wordplay joke.&#x27;

```Functions will also be coerced into runnables, so you can add custom logic to your chains too. The below chain results in the same logical flow as before:

```typescript
import { RunnableSequence } from "@langchain/core/runnables";

const composedChainWithLambda = RunnableSequence.from([
  chain,
  (input) => ({ joke: input }),
  analysisPrompt,
  model,
  new StringOutputParser(),
]);

await composedChainWithLambda.invoke({ topic: "beets" });

```

```text
"Haha, that&#x27;s a cute and punny joke! I like how it plays on the idea of beets blushing or turning red like someone blushing. Food puns can be quite amusing. While not a total knee-slapper, it&#x27;s a light-hearted, groan-worthy dad joke that would make me chuckle and shake my head. Simple vegetable humor!"

``` > See the LangSmith trace for the run above > [here](https://smith.langchain.com/public/ef1bf347-a243-4da6-9be6-54f5d73e6da2/r) However, keep in mind that using functions like this may interfere with operations like streaming. See [this section](/docs/how_to/functions) for more information.

## Next steps[​](#next-steps)

You now know some ways to chain two runnables together.

To learn more, see the other how-to guides on runnables in [this section](/docs/how_to/#langchain-expression-language-lcel).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [The pipe method](#the-pipe-method)[Coercion](#coercion)

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