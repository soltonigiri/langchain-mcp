How to construct filters | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to construct filtersPrerequisitesThis guide assumes familiarity with the following:Query analysis](/docs/tutorials/rag#query-analysis)

We may want to do query analysis to extract filters to pass into retrievers. One way we ask the LLM to represent these filters is as a Zod schema. There is then the issue of converting that Zod schema into a filter that can be passed into a retriever.

This can be done manually, but LangChain also provides some “Translators” that are able to translate from a common syntax into filters specific to each retriever. Here, we will cover how to use those translators.

## Setup[​](#setup)

### Install dependencies[​](#install-dependencies)

- npm
- yarn
- pnpm

```bash
npm i @langchain/core zod

```

```bash
yarn add @langchain/core zod

```

```bash
pnpm add @langchain/core zod

```In this example, `year` and `author` are both attributes to filter on.

```typescript
import { z } from "zod";

const searchSchema = z.object({
  query: z.string(),
  startYear: z.number().optional(),
  author: z.string().optional(),
});

const searchQuery: z.infer<typeof searchSchema> = {
  query: "RAG",
  startYear: 2022,
  author: "LangChain",
};

```

```typescript
import { Comparison, Comparator } from "langchain/chains/query_constructor/ir";

function constructComparisons(
  query: z.infer<typeof searchSchema>
): Comparison[] {
  const comparisons: Comparison[] = [];
  if (query.startYear !== undefined) {
    comparisons.push(
      new Comparison("gt" as Comparator, "start_year", query.startYear)
    );
  }
  if (query.author !== undefined) {
    comparisons.push(
      new Comparison("eq" as Comparator, "author", query.author)
    );
  }
  return comparisons;
}

const comparisons = constructComparisons(searchQuery);

```

```typescript
import { Operation, Operator } from "langchain/chains/query_constructor/ir";

const _filter = new Operation("and" as Operator, comparisons);

```

```typescript
import { ChromaTranslator } from "@langchain/community/structured_query/chroma";

new ChromaTranslator().visitOperation(_filter);

```

```text
{
  "$and": [
    { start_year: { "$gt": 2022 } },
    { author: { "$eq": "LangChain" } }
  ]
}

``` ## Next steps[​](#next-steps) You’ve now learned how to create a specific filter from an arbitrary query.

Next, check out some of the other query analysis guides in this section, like [how to use few-shotting to improve performance](/docs/how_to/query_no_queries).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)[Install dependencies](#install-dependencies)

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