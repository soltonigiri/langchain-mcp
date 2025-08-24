How to run custom functions | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to run custom functionsPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Expression Language (LCEL)](/docs/concepts/lcel)[Chaining runnables](/docs/how_to/sequence/)You can use arbitrary functions as [Runnables](https://api.js.langchain.com/classes/langchain_core.runnables.Runnable.html). This is useful for formatting or when you need functionality not provided by other LangChain components, and custom functions used as Runnables are called [RunnableLambdas](https://api.js.langchain.com/classes/langchain_core.runnables.RunnableLambda.html).Note that all inputs to these functions need to be a SINGLE argument. If you have a function that accepts multiple arguments, you should write a wrapper that accepts a single dict input and unpacks it into multiple argument.This guide will cover:How to explicitly create a runnable from a custom function using the RunnableLambda constructorCoercion of custom functions into runnables when used in chainsHow to accept and use run metadata in your custom functionHow to stream with custom functions by having them return generatorsUsing the constructor[​](#using-the-constructor)Below, we explicitly wrap our custom logic using a RunnableLambda method:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/openai @langchain/core

```

```bash
yarn add @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/core

```

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

const lengthFunction = (input: { foo: string }): { length: string } => {
  return {
    length: input.foo.length.toString(),
  };
};

const model = new ChatOpenAI({ model: "gpt-4o" });

const prompt = ChatPromptTemplate.fromTemplate("What is {length} squared?");

const chain = RunnableLambda.from(lengthFunction)
  .pipe(prompt)
  .pipe(model)
  .pipe(new StringOutputParser());

await chain.invoke({ foo: "bar" });

```

```text
"3 squared is \\(3^2\\), which means multiplying 3 by itself. \n" +
  "\n" +
  "\\[3^2 = 3 \\times 3 = 9\\]\n" +
  "\n" +
  "So, 3 squared"... 6 more characters

```Automatic coercion in chains[​](#automatic-coercion-in-chains)When using custom functions in chains with [RunnableSequence.from](https://api.js.langchain.com/classes/langchain_core.runnables.RunnableSequence.html#from) static method, you can omit the explicit RunnableLambda creation and rely on coercion.Here’s a simple example with a function that takes the output from the model and returns the first five letters of it:

```typescript
import { RunnableSequence } from "@langchain/core/runnables";

const storyPrompt = ChatPromptTemplate.fromTemplate(
  "Tell me a short story about {topic}"
);

const storyModel = new ChatOpenAI({ model: "gpt-4o" });

const chainWithCoercedFunction = RunnableSequence.from([
  storyPrompt,
  storyModel,
  (input) => input.content.slice(0, 5),
]);

await chainWithCoercedFunction.invoke({ topic: "bears" });

```

```text
"Once "

```Note that we didn’t need to wrap the custom function (input) => input.content.slice(0, 5) in a RunnableLambda method. The custom function is coerced** into a runnable. See [this section](/docs/how_to/sequence/#coercion) for more information. ## Passing run metadata[​](#passing-run-metadata) Runnable lambdas can optionally accept a [RunnableConfig](https://api.js.langchain.com/interfaces/langchain_core.runnables.RunnableConfig.html) parameter, which they can use to pass callbacks, tags, and other configuration information to nested runs.

```typescript
import { type RunnableConfig } from "@langchain/core/runnables";

const echo = (text: string, config: RunnableConfig) => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Reverse the following text: {text}"
  );
  const model = new ChatOpenAI({ model: "gpt-4o" });
  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  return chain.invoke({ text }, config);
};

const output = await RunnableLambda.from(echo).invoke("foo", {
  tags: ["my-tag"],
  callbacks: [
    {
      handleLLMEnd: (output) => console.log(output),
    },
  ],
});

```

```text
{
  generations: [
    [
      {
        text: "oof",
        message: AIMessage {
          lc_serializable: true,
          lc_kwargs: [Object],
          lc_namespace: [Array],
          content: "oof",
          name: undefined,
          additional_kwargs: [Object],
          response_metadata: [Object],
          tool_calls: [],
          invalid_tool_calls: []
        },
        generationInfo: { finish_reason: "stop" }
      }
    ]
  ],
  llmOutput: {
    tokenUsage: { completionTokens: 2, promptTokens: 13, totalTokens: 15 }
  }
}

``` # Streaming You can use generator functions (ie. functions that use the yield keyword, and behave like iterators) in a chain.The signature of these generators should be AsyncGenerator -> AsyncGenerator.These are useful for: - implementing a custom output parser - modifying the output of a previous step, while preserving streaming capabilitiesHere’s an example of a custom output parser for comma-separated lists. First, we create a chain that generates such a list as text:

```typescript
const streamingPrompt = ChatPromptTemplate.fromTemplate(
  "Write a comma-separated list of 5 animals similar to: {animal}. Do not include numbers"
);

const strChain = streamingPrompt.pipe(model).pipe(new StringOutputParser());

const stream = await strChain.stream({ animal: "bear" });

for await (const chunk of stream) {
  console.log(chunk);
}

```

```text
Lion
,
 wolf
,
 tiger
,
 cougar
,
 leopard

```Next, we define a custom function that will aggregate the currently streamed output and yield it when the model generates the next comma in the list:

```typescript
// This is a custom parser that splits an iterator of llm tokens
// into a list of strings separated by commas
async function* splitIntoList(input) {
  // hold partial input until we get a comma
  let buffer = "";
  for await (const chunk of input) {
    // add current chunk to buffer
    buffer += chunk;
    // while there are commas in the buffer
    while (buffer.includes(",")) {
      // split buffer on comma
      const commaIndex = buffer.indexOf(",");
      // yield everything before the comma
      yield [buffer.slice(0, commaIndex).trim()];
      // save the rest for the next iteration
      buffer = buffer.slice(commaIndex + 1);
    }
  }
  // yield the last chunk
  yield [buffer.trim()];
}

const listChain = strChain.pipe(splitIntoList);

const listChainStream = await listChain.stream({ animal: "bear" });

for await (const chunk of listChainStream) {
  console.log(chunk);
}

```

```text
[ "wolf" ]
[ "lion" ]
[ "tiger" ]
[ "cougar" ]
[ "cheetah" ]

```Invoking it gives a full array of values:

```typescript
await listChain.invoke({ animal: "bear" });

```

```text
[ "lion", "tiger", "wolf", "cougar", "jaguar" ]

``` ## Next steps[​](#next-steps) Now you’ve learned a few different ways to use custom logic within your chains, and how to implement streaming.To learn more, see the other how-to guides on runnables in this section. #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Using the constructor](#using-the-constructor)
- [Automatic coercion in chains](#automatic-coercion-in-chains)
- [Passing run metadata](#passing-run-metadata)
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