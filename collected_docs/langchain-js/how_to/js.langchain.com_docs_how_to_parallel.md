How to invoke runnables in parallel | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to invoke runnables in parallelPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Expression Language (LCEL)](/docs/concepts/lcel)
- [Chaining runnables](/docs/how_to/sequence/)

The [RunnableParallel](https://api.js.langchain.com/classes/langchain_core.runnables.RunnableParallel.html) (also known as a `RunnableMap`) primitive is an object whose values are runnables (or things that can be coerced to runnables, like functions). It runs all of its values in parallel, and each value is called with the initial input to the `RunnableParallel`. The final return value is an object with the results of each value under its appropriate key.

## Formatting with RunnableParallels[​](#formatting-with-runnableparallels)

`RunnableParallels` are useful for parallelizing operations, but can also be useful for manipulating the output of one Runnable to match the input format of the next Runnable in a sequence. You can use them to split or fork the chain so that multiple components can process the input in parallel. Later, other components can join or merge the results to synthesize a final response. This type of chain creates a computation graph that looks like the following:

```text
Input
      / \
     /   \
 Branch1 Branch2
     \   /
      \ /
      Combine

```

Below, the input to each chain in the `RunnableParallel` is expected to be an object with a key for `"topic"`. We can satisfy that requirement by invoking our chain with an object matching that structure.

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- Yarn
- pnpm

```bash
npm install @langchain/anthropic @langchain/cohere @langchain/core

```

```bash
yarn add @langchain/anthropic @langchain/cohere @langchain/core

```

```bash
pnpm add @langchain/anthropic @langchain/cohere @langchain/core

```

```typescript
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableMap } from "@langchain/core/runnables";
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({});
const jokeChain = PromptTemplate.fromTemplate(
  "Tell me a joke about {topic}"
).pipe(model);
const poemChain = PromptTemplate.fromTemplate(
  "write a 2-line poem about {topic}"
).pipe(model);

const mapChain = RunnableMap.from({
  joke: jokeChain,
  poem: poemChain,
});

const result = await mapChain.invoke({ topic: "bear" });
console.log(result);
/*
  {
    joke: AIMessage {
      content: " Here&#x27;s a silly joke about a bear:\n" +
        &#x27;\n&#x27; +
        &#x27;What do you call a bear with no teeth?\n&#x27; +
        &#x27;A gummy bear!&#x27;,
      additional_kwargs: {}
    },
    poem: AIMessage {
      content: &#x27; Here is a 2-line poem about a bear:\n&#x27; +
        &#x27;\n&#x27; +
        &#x27;Furry and wild, the bear roams free  \n&#x27; +
        &#x27;Foraging the forest, strong as can be&#x27;,
      additional_kwargs: {}
    }
  }
*/

``` #### API Reference: - PromptTemplate from @langchain/core/prompts - RunnableMap from @langchain/core/runnables - ChatAnthropic from @langchain/anthropic ## Manipulating outputs/inputs[​](#manipulating-outputsinputs) Maps can be useful for manipulating the output of one Runnable to match the input format of the next Runnable in a sequence.

Note below that the object within the `RunnableSequence.from()` call is automatically coerced into a runnable map. All keys of the object must have values that are runnables or can be themselves coerced to runnables (functions to `RunnableLambda`s or objects to `RunnableMap`s). This coercion will also occur when composing chains via the `.pipe()` method.

```typescript
import { CohereEmbeddings } from "@langchain/cohere";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";
import { ChatAnthropic } from "@langchain/anthropic";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const model = new ChatAnthropic();
const vectorstore = await MemoryVectorStore.fromDocuments(
  [{ pageContent: "mitochondria is the powerhouse of the cell", metadata: {} }],
  new CohereEmbeddings({ model: "embed-english-v3.0" })
);
const retriever = vectorstore.asRetriever();
const template = `Answer the question based only on the following context:
{context}

Question: {question}`;

const prompt = PromptTemplate.fromTemplate(template);

const formatDocs = (docs: Document[]) => docs.map((doc) => doc.pageContent);

const retrievalChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await retrievalChain.invoke(
  "what is the powerhouse of the cell?"
);
console.log(result);

/*
 Based on the given context, the powerhouse of the cell is mitochondria.
*/

```

#### API Reference: - CohereEmbeddings from @langchain/cohere - PromptTemplate from @langchain/core/prompts - StringOutputParser from @langchain/core/output_parsers - RunnablePassthrough from @langchain/core/runnables - RunnableSequence from @langchain/core/runnables - Document from @langchain/core/documents - ChatAnthropic from @langchain/anthropic - MemoryVectorStore from langchain/vectorstores/memory Here the input to prompt is expected to be a map with keys "context" and "question". The user input is just the question. So we need to get the context using our retriever and passthrough the user input under the "question" key.

## Next steps[​](#next-steps)

You now know some ways to format and parallelize chain steps with `RunnableParallel`.

Next, you might be interested in [using custom logic](/docs/how_to/functions/) in your chains.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Formatting with RunnableParallels](#formatting-with-runnableparallels)
- [Manipulating outputs/inputs](#manipulating-outputsinputs)
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