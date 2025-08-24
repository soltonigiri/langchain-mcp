How to embed text data | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to embed text datainfoHead to Integrations](/docs/integrations/text_embedding) for documentation on built-in integrations with text embedding providers.PrerequisitesThis guide assumes familiarity with the following concepts:[Embeddings](/docs/concepts/embedding_models)

Embeddings create a vector representation of a piece of text. This is useful because it means we can think about text in the vector space, and do things like semantic search where we look for pieces of text that are most similar in the vector space.

The base Embeddings class in LangChain exposes two methods: one for embedding documents and one for embedding a query. The former takes as input multiple texts, while the latter takes a single text. The reason for having these as two separate methods is that some embedding providers have different embedding methods for documents (to be searched over) vs queries (the search query itself).

## Get started[​](#get-started)

Below is an example of how to use the OpenAI embeddings. Embeddings occasionally have different embedding methods for queries versus documents, so the embedding class exposes a `embedQuery` and `embedDocuments` method.

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- Yarn
- pnpm

```bash
npm install @langchain/openai @langchain/core

```

```bash
yarn add @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/core

``` ## Get started[​](#get-started-1)

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings();

``` ## Embed queries[​](#embed-queries)

```typescript
const res = await embeddings.embedQuery("Hello world");
/*
[
   -0.004845875,   0.004899438,  -0.016358767,  -0.024475135, -0.017341806,
    0.012571548,  -0.019156644,   0.009036391,  -0.010227379, -0.026945334,
    0.022861943,   0.010321903,  -0.023479493, -0.0066544134,  0.007977734,
   0.0026371893,   0.025206111,  -0.012048521,   0.012943339,  0.013094575,
   -0.010580265,  -0.003509951,   0.004070787,   0.008639394, -0.020631202,
  ... 1511 more items
]
*/

``` ## Embed documents[​](#embed-documents)

```typescript
const documentRes = await embeddings.embedDocuments(["Hello world", "Bye bye"]);
/*
[
  [
    -0.004845875,   0.004899438,  -0.016358767,  -0.024475135, -0.017341806,
      0.012571548,  -0.019156644,   0.009036391,  -0.010227379, -0.026945334,
      0.022861943,   0.010321903,  -0.023479493, -0.0066544134,  0.007977734,
    0.0026371893,   0.025206111,  -0.012048521,   0.012943339,  0.013094575,
    -0.010580265,  -0.003509951,   0.004070787,   0.008639394, -0.020631202,
    ... 1511 more items
  ]
  [
      -0.009446913,  -0.013253193,   0.013174579,  0.0057552797,  -0.038993083,
      0.0077763423,    -0.0260478, -0.0114384955, -0.0022683728,  -0.016509168,
      0.041797023,    0.01787183,    0.00552271, -0.0049789557,   0.018146982,
      -0.01542166,   0.033752076,   0.006112323,   0.023872782,  -0.016535373,
      -0.006623321,   0.016116094, -0.0061090477, -0.0044155475,  -0.016627092,
    ... 1511 more items
  ]
]
*/

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to use embeddings models with queries and text.

Next, check out how to [avoid excessively recomputing embeddings with caching](/docs/how_to/caching_embeddings), or the [full tutorial on retrieval-augmented generation](/docs/tutorials/rag).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Get started](#get-started)
- [Get started](#get-started-1)
- [Embed queries](#embed-queries)
- [Embed documents](#embed-documents)
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