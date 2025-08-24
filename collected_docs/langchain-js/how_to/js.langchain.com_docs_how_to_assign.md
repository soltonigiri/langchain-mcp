How to add values to a chain&#x27;s state | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to add values to a chain&#x27;s statePrerequisitesThis guide assumes familiarity with the following concepts:LangChain Expression Language (LCEL)](/docs/concepts/lcel)
- [Chaining runnables](/docs/how_to/sequence/)
- [Calling runnables in parallel](/docs/how_to/parallel/)
- [Custom functions](/docs/how_to/functions/)
- [Passing data through](/docs/how_to/passthrough)

An alternate way of [passing data through](/docs/how_to/passthrough) steps of a chain is to leave the current values of the chain state unchanged while assigning a new value under a given key. The [RunnablePassthrough.assign()](https://api.js.langchain.com/classes/langchain_core.runnables.RunnablePassthrough.html#assign-2) static method takes an input value and adds the extra arguments passed to the assign function.

This is useful in the common [LangChain Expression Language](/docs/concepts/lcel) pattern of additively creating a dictionary to use as input to a later step.

Here’s an example:

```typescript
import {
  RunnableParallel,
  RunnablePassthrough,
} from "@langchain/core/runnables";

const runnable = RunnableParallel.from({
  extra: RunnablePassthrough.assign({
    mult: (input: { num: number }) => input.num * 3,
    modified: (input: { num: number }) => input.num + 1,
  }),
});

await runnable.invoke({ num: 1 });

```

```text
{ extra: { num: 1, mult: 3, modified: 2 } }

```Let’s break down what’s happening here.

- The input to the chain is {"num": 1}. This is passed into a RunnableParallel, which invokes the runnables it is passed in parallel with that input.
- The value under the extra key is invoked. RunnablePassthrough.assign() keeps the original keys in the input dict ({"num": 1}), and assigns a new key called mult. The value is lambda x: x["num"] * 3), which is 3. Thus, the result is {"num": 1, "mult": 3}.
- {"num": 1, "mult": 3} is returned to the RunnableParallel call, and is set as the value to the key extra.
- At the same time, the modified key is called. The result is 2, since the lambda extracts a key called "num" from its input and adds one.

Thus, the result is `{&#x27;extra&#x27;: {&#x27;num&#x27;: 1, &#x27;mult&#x27;: 3}, &#x27;modified&#x27;: 2}`.

## Streaming[​](#streaming)

One convenient feature of this method is that it allows values to pass through as soon as they are available. To show this off, we’ll use `RunnablePassthrough.assign()` to immediately return source docs in a retrieval chain:

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

const generationChain = prompt.pipe(model).pipe(new StringOutputParser());

const retrievalChain = RunnableSequence.from([
  {
    context: retriever.pipe((docs) => docs[0].pageContent),
    question: new RunnablePassthrough(),
  },
  RunnablePassthrough.assign({ output: generationChain }),
]);

const stream = await retrievalChain.stream("where did harrison work?");

for await (const chunk of stream) {
  console.log(chunk);
}

```

```text
{ question: "where did harrison work?" }
{ context: "harrison worked at kensho" }
{ output: "" }
{ output: "H" }
{ output: "arrison" }
{ output: " worked" }
{ output: " at" }
{ output: " Kens" }
{ output: "ho" }
{ output: "." }
{ output: "" }

```We can see that the first chunk contains the original `"question"` since that is immediately available. The second chunk contains `"context"` since the retriever finishes second. Finally, the output from the `generation_chain` streams in chunks as soon as it is available.

## Next steps[​](#next-steps)

Now you’ve learned how to pass data through your chains to help to help format the data flowing through your chains.

To learn more, see the other how-to guides on runnables in this section.

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