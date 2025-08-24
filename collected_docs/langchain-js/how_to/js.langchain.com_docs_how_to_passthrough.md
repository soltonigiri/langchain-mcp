How to pass through arguments from one step to the next | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to pass through arguments from one step to the nextPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Expression Language (LCEL)](/docs/concepts/lcel)
- [Chaining runnables](/docs/how_to/sequence/)
- [Calling runnables in parallel](/docs/how_to/parallel/)
- [Custom functions](/docs/how_to/functions/)

When composing chains with several steps, sometimes you will want to pass data from previous steps unchanged for use as input to a later step. The [RunnablePassthrough](https://api.js.langchain.com/classes/langchain_core.runnables.RunnablePassthrough.html) class allows you to do just this, and is typically is used in conjuction with a [RunnableParallel](/docs/how_to/parallel/) to pass data through to a later step in your constructed chains.

Let’s look at an example:

```typescript
import {
  RunnableParallel,
  RunnablePassthrough,
} from "@langchain/core/runnables";

const runnable = RunnableParallel.from({
  passed: new RunnablePassthrough<{ num: number }>(),
  modified: (input: { num: number }) => input.num + 1,
});

await runnable.invoke({ num: 1 });

```

```text
{ passed: { num: 1 }, modified: 2 }

```As seen above, `passed` key was called with `RunnablePassthrough()` and so it simply passed on `{&#x27;num&#x27;: 1}`.

We also set a second key in the map with `modified`. This uses a lambda to set a single value adding 1 to the num, which resulted in `modified` key with the value of `2`.

## Retrieval Example[​](#retrieval-example)

In the example below, we see a more real-world use case where we use `RunnablePassthrough` along with `RunnableParallel` in a chain to properly format inputs to a prompt:

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- yarn
- pnpm

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
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const vectorstore = await MemoryVectorStore.fromDocuments(
  [{ pageContent: "harrison worked at kensho", metadata: {} }],
  new OpenAIEmbeddings()
);

const retriever = vectorstore.asRetriever();

const template = `Answer the question based only on the following context:
{context}

Question: {question}
`;

const prompt = ChatPromptTemplate.fromTemplate(template);

const model = new ChatOpenAI({ model: "gpt-4o" });

const retrievalChain = RunnableSequence.from([
  {
    context: retriever.pipe((docs) => docs[0].pageContent),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

await retrievalChain.invoke("where did harrison work?");

```

```text
"Harrison worked at Kensho."

```Here the input to prompt is expected to be a map with keys `"context"` and `"question"`. The user input is just the question. So we need to get the context using our retriever and passthrough the user input under the `"question"` key. The `RunnablePassthrough` allows us to pass on the user’s question to the prompt and model.

## Next steps[​](#next-steps)

Now you’ve learned how to pass data through your chains to help to help format the data flowing through your chains.

To learn more, see the other how-to guides on runnables in this section.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Retrieval Example](#retrieval-example)
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