How to write a custom retriever class | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to write a custom retriever classPrerequisitesThis guide assumes familiarity with the following concepts:Retrievers](/docs/concepts/retrievers)

To create your own retriever, you need to extend the [BaseRetriever](https://api.js.langchain.com/classes/langchain_core.retrievers.BaseRetriever.html) class and implement a `_getRelevantDocuments` method that takes a `string` as its first parameter (and an optional `runManager` for tracing). This method should return an array of `Document`s fetched from some source. This process can involve calls to a database, to the web using `fetch`, or any other source. Note the underscore before `_getRelevantDocuments()`. The base class wraps the non-prefixed version in order to automatically handle tracing of the original call.

Here&#x27;s an example of a custom retriever that returns static documents:

```ts
import {
  BaseRetriever,
  type BaseRetrieverInput,
} from "@langchain/core/retrievers";
import type { CallbackManagerForRetrieverRun } from "@langchain/core/callbacks/manager";
import { Document } from "@langchain/core/documents";

export interface CustomRetrieverInput extends BaseRetrieverInput {}

export class CustomRetriever extends BaseRetriever {
  lc_namespace = ["langchain", "retrievers"];

  constructor(fields?: CustomRetrieverInput) {
    super(fields);
  }

  async _getRelevantDocuments(
    query: string,
    runManager?: CallbackManagerForRetrieverRun
  ): Promise<Document[]> {
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // const additionalDocs = await someOtherRunnable.invoke(params, runManager?.getChild());
    return [
      // ...additionalDocs,
      new Document({
        pageContent: `Some document pertaining to ${query}`,
        metadata: {},
      }),
      new Document({
        pageContent: `Some other document pertaining to ${query}`,
        metadata: {},
      }),
    ];
  }
}

```

Then, you can call `.invoke()` as follows:

```ts
const retriever = new CustomRetriever({});

await retriever.invoke("LangChain docs");

```

```text
[
  Document {
    pageContent: &#x27;Some document pertaining to LangChain docs&#x27;,
    metadata: {}
  },
  Document {
    pageContent: &#x27;Some other document pertaining to LangChain docs&#x27;,
    metadata: {}
  }
]

``` ## Next steps[​](#next-steps) You&#x27;ve now seen an example of implementing your own custom retriever.

Next, check out the individual sections for deeper dives on specific retrievers, or the [broader tutorial on RAG](/docs/tutorials/rag).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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