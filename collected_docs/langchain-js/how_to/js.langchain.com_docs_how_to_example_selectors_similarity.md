How to select examples by similarity | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to select examples by similarityPrerequisitesThis guide assumes familiarity with the following concepts:Prompt templates](/docs/concepts/prompt_templates)
- [Example selectors](/docs/how_to/example_selectors)
- [Vector stores](/docs/concepts/vectorstores)

This object selects examples based on similarity to the inputs. It does this by finding the examples with the embeddings that have the greatest cosine similarity with the inputs.

The fields of the examples object will be used as parameters to format the `examplePrompt` passed to the `FewShotPromptTemplate`. Each example should therefore contain all required fields for the example prompt you are using.

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- Yarn
- pnpm

```bash
npm install @langchain/openai @langchain/community @langchain/core

```

```bash
yarn add @langchain/openai @langchain/community @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/community @langchain/core

```

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { PromptTemplate, FewShotPromptTemplate } from "@langchain/core/prompts";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";

// Create a prompt template that will be used to format the examples.
const examplePrompt = PromptTemplate.fromTemplate(
  "Input: {input}\nOutput: {output}"
);

// Create a SemanticSimilarityExampleSelector that will be used to select the examples.
const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
  [
    { input: "happy", output: "sad" },
    { input: "tall", output: "short" },
    { input: "energetic", output: "lethargic" },
    { input: "sunny", output: "gloomy" },
    { input: "windy", output: "calm" },
  ],
  new OpenAIEmbeddings(),
  HNSWLib,
  { k: 1 }
);

// Create a FewShotPromptTemplate that will use the example selector.
const dynamicPrompt = new FewShotPromptTemplate({
  // We provide an ExampleSelector instead of examples.
  exampleSelector,
  examplePrompt,
  prefix: "Give the antonym of every input",
  suffix: "Input: {adjective}\nOutput:",
  inputVariables: ["adjective"],
});

// Input is about the weather, so should select eg. the sunny/gloomy example
console.log(await dynamicPrompt.format({ adjective: "rainy" }));
/*
  Give the antonym of every input

  Input: sunny
  Output: gloomy

  Input: rainy
  Output:
*/

// Input is a measurement, so should select the tall/short example
console.log(await dynamicPrompt.format({ adjective: "large" }));
/*
  Give the antonym of every input

  Input: tall
  Output: short

  Input: large
  Output:
*/

``` #### API Reference: - OpenAIEmbeddings from @langchain/openai - HNSWLib from @langchain/community/vectorstores/hnswlib - PromptTemplate from @langchain/core/prompts - FewShotPromptTemplate from @langchain/core/prompts - SemanticSimilarityExampleSelector from @langchain/core/example_selectors By default, each field in the examples object is concatenated together, embedded, and stored in the vectorstore for later similarity search against user queries.

If you only want to embed specific keys (e.g., you only want to search for examples that have a similar query to the one the user provides), you can pass an `inputKeys` array in the final `options` parameter.

## Loading from an existing vectorstore[​](#loading-from-an-existing-vectorstore)

You can also use a pre-initialized vector store by passing an instance to the `SemanticSimilarityExampleSelector` constructor directly, as shown below. You can also add more examples via the `addExample` method:

```typescript
// Ephemeral, in-memory vector store for demo purposes
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PromptTemplate, FewShotPromptTemplate } from "@langchain/core/prompts";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";

const embeddings = new OpenAIEmbeddings();

const memoryVectorStore = new MemoryVectorStore(embeddings);

const examples = [
  {
    query: "healthy food",
    output: `galbi`,
  },
  {
    query: "healthy food",
    output: `schnitzel`,
  },
  {
    query: "foo",
    output: `bar`,
  },
];

const exampleSelector = new SemanticSimilarityExampleSelector({
  vectorStore: memoryVectorStore,
  k: 2,
  // Only embed the "query" key of each example
  inputKeys: ["query"],
});

for (const example of examples) {
  // Format and add an example to the underlying vector store
  await exampleSelector.addExample(example);
}

// Create a prompt template that will be used to format the examples.
const examplePrompt = PromptTemplate.fromTemplate(`<example>
  <user_input>
    {query}
  </user_input>
  <output>
    {output}
  </output>
</example>`);

// Create a FewShotPromptTemplate that will use the example selector.
const dynamicPrompt = new FewShotPromptTemplate({
  // We provide an ExampleSelector instead of examples.
  exampleSelector,
  examplePrompt,
  prefix: `Answer the user&#x27;s question, using the below examples as reference:`,
  suffix: "User question: {query}",
  inputVariables: ["query"],
});

const formattedValue = await dynamicPrompt.format({
  query: "What is a healthy food?",
});
console.log(formattedValue);

/*
Answer the user&#x27;s question, using the below examples as reference:

<example>
  <user_input>
    healthy
  </user_input>
  <output>
    galbi
  </output>
</example>

<example>
  <user_input>
    healthy
  </user_input>
  <output>
    schnitzel
  </output>
</example>

User question: What is a healthy food?
*/

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});

const chain = dynamicPrompt.pipe(model);

const result = await chain.invoke({ query: "What is a healthy food?" });
console.log(result);
/*
  AIMessage {
    content: &#x27;A healthy food can be galbi or schnitzel.&#x27;,
    additional_kwargs: { function_call: undefined }
  }
*/

```

#### API Reference: - MemoryVectorStore from langchain/vectorstores/memory - OpenAIEmbeddings from @langchain/openai - ChatOpenAI from @langchain/openai - PromptTemplate from @langchain/core/prompts - FewShotPromptTemplate from @langchain/core/prompts - SemanticSimilarityExampleSelector from @langchain/core/example_selectors ## Metadata filtering[​](#metadata-filtering) When adding examples, each field is available as metadata in the produced document. If you would like further control over your search space, you can add extra fields to your examples and pass a `filter` parameter when initializing your selector:

```typescript
// Ephemeral, in-memory vector store for demo purposes
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PromptTemplate, FewShotPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";

const embeddings = new OpenAIEmbeddings();

const memoryVectorStore = new MemoryVectorStore(embeddings);

const examples = [
  {
    query: "healthy food",
    output: `lettuce`,
    food_type: "vegetable",
  },
  {
    query: "healthy food",
    output: `schnitzel`,
    food_type: "veal",
  },
  {
    query: "foo",
    output: `bar`,
    food_type: "baz",
  },
];

const exampleSelector = new SemanticSimilarityExampleSelector({
  vectorStore: memoryVectorStore,
  k: 2,
  // Only embed the "query" key of each example
  inputKeys: ["query"],
  // Filter type will depend on your specific vector store.
  // See the section of the docs for the specific vector store you are using.
  filter: (doc: Document) => doc.metadata.food_type === "vegetable",
});

for (const example of examples) {
  // Format and add an example to the underlying vector store
  await exampleSelector.addExample(example);
}

// Create a prompt template that will be used to format the examples.
const examplePrompt = PromptTemplate.fromTemplate(`<example>
  <user_input>
    {query}
  </user_input>
  <output>
    {output}
  </output>
</example>`);

// Create a FewShotPromptTemplate that will use the example selector.
const dynamicPrompt = new FewShotPromptTemplate({
  // We provide an ExampleSelector instead of examples.
  exampleSelector,
  examplePrompt,
  prefix: `Answer the user&#x27;s question, using the below examples as reference:`,
  suffix: "User question:\n{query}",
  inputVariables: ["query"],
});

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});

const chain = dynamicPrompt.pipe(model);

const result = await chain.invoke({
  query: "What is exactly one type of healthy food?",
});
console.log(result);
/*
  AIMessage {
    content: &#x27;One type of healthy food is lettuce.&#x27;,
    additional_kwargs: { function_call: undefined }
  }
*/

```

#### API Reference: - MemoryVectorStore from langchain/vectorstores/memory - OpenAIEmbeddings from @langchain/openai - ChatOpenAI from @langchain/openai - PromptTemplate from @langchain/core/prompts - FewShotPromptTemplate from @langchain/core/prompts - Document from @langchain/core/documents - SemanticSimilarityExampleSelector from @langchain/core/example_selectors ## Custom vectorstore retrievers[​](#custom-vectorstore-retrievers) You can also pass a vectorstore retriever instead of a vectorstore. One way this could be useful is if you want to use retrieval besides similarity search such as maximal marginal relevance:

```typescript
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Requires a vectorstore that supports maximal marginal relevance search
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { PromptTemplate, FewShotPromptTemplate } from "@langchain/core/prompts";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";

const pinecone = new Pinecone();

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

/**
 * Pinecone allows you to partition the records in an index into namespaces.
 * Queries and other operations are then limited to one namespace,
 * so different requests can search different subsets of your index.
 * Read more about namespaces here: https://docs.pinecone.io/guides/indexes/use-namespaces
 *
 * NOTE: If you have namespace enabled in your Pinecone index, you must provide the namespace when creating the PineconeStore.
 */
const namespace = "pinecone";

const pineconeVectorstore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  { pineconeIndex, namespace }
);

const pineconeMmrRetriever = pineconeVectorstore.asRetriever({
  searchType: "mmr",
  k: 2,
});

const examples = [
  {
    query: "healthy food",
    output: `lettuce`,
    food_type: "vegetable",
  },
  {
    query: "healthy food",
    output: `schnitzel`,
    food_type: "veal",
  },
  {
    query: "foo",
    output: `bar`,
    food_type: "baz",
  },
];

const exampleSelector = new SemanticSimilarityExampleSelector({
  vectorStoreRetriever: pineconeMmrRetriever,
  // Only embed the "query" key of each example
  inputKeys: ["query"],
});

for (const example of examples) {
  // Format and add an example to the underlying vector store
  await exampleSelector.addExample(example);
}

// Create a prompt template that will be used to format the examples.
const examplePrompt = PromptTemplate.fromTemplate(`<example>
  <user_input>
    {query}
  </user_input>
  <output>
    {output}
  </output>
</example>`);

// Create a FewShotPromptTemplate that will use the example selector.
const dynamicPrompt = new FewShotPromptTemplate({
  // We provide an ExampleSelector instead of examples.
  exampleSelector,
  examplePrompt,
  prefix: `Answer the user&#x27;s question, using the below examples as reference:`,
  suffix: "User question:\n{query}",
  inputVariables: ["query"],
});

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});

const chain = dynamicPrompt.pipe(model);

const result = await chain.invoke({
  query: "What is exactly one type of healthy food?",
});

console.log(result);

/*
  AIMessage {
    content: &#x27;lettuce.&#x27;,
    additional_kwargs: { function_call: undefined }
  }
*/

```

#### API Reference: - OpenAIEmbeddings from @langchain/openai - ChatOpenAI from @langchain/openai - PineconeStore from @langchain/pinecone - PromptTemplate from @langchain/core/prompts - FewShotPromptTemplate from @langchain/core/prompts - SemanticSimilarityExampleSelector from @langchain/core/example_selectors ## Next steps[​](#next-steps) You&#x27;ve now learned a bit about using similarity in an example selector.

Next, check out this guide on how to use a [length-based example selector](/docs/how_to/example_selectors_length_based).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Loading from an existing vectorstore](#loading-from-an-existing-vectorstore)
- [Metadata filtering](#metadata-filtering)
- [Custom vectorstore retrievers](#custom-vectorstore-retrievers)
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