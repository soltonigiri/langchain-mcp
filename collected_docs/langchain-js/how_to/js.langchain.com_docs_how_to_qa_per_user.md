How to do per-user retrieval | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to do per-user retrievalPrerequisitesThis guide assumes familiarity with the following:Retrieval-augmented generation](/docs/tutorials/rag/)When building a retrieval app, you often have to build it with multiple users in mind. This means that you may be storing data not just for one user, but for many different users, and they should not be able to see each other’s data. This means that you need to be able to configure your retrieval chain to only retrieve certain information. This generally involves two steps.Step 1: Make sure the retriever you are using supports multiple users**At the moment, there is no unified flag or filter for this in LangChain. Rather, each vectorstore and retriever may have their own, and may be called different things (namespaces, multi-tenancy, etc). For vectorstores, this is generally exposed as a keyword argument that is passed in during similaritySearch. By reading the documentation or source code, figure out whether the retriever you are using supports multiple users, and, if so, how to use it.**Step 2: Add that parameter as a configurable field for the chain**The LangChain config object is passed through to every Runnable. Here you can add any fields you’d like to the configurable object. Later, inside the chain we can extract these fields.**Step 3: Call the chain with that configurable field**Now, at runtime you can call this chain with configurable field. ## Code Example[​](#code-example) Let’s see a concrete example of what this looks like in code. We will use Pinecone for this example. ## Setup[​](#setup) ### Install dependencies[​](#install-dependencies) tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/pinecone @langchain/openai @langchain/core @pinecone-database/pinecone

```

```bash
yarn add @langchain/pinecone @langchain/openai @langchain/core @pinecone-database/pinecone

```

```bash
pnpm add @langchain/pinecone @langchain/openai @langchain/core @pinecone-database/pinecone

``` ### Set environment variables[​](#set-environment-variables) We’ll use OpenAI and Pinecone in this example:

```env
OPENAI_API_KEY=your-api-key

PINECONE_API_KEY=your-api-key
PINECONE_INDEX=your-index-name

# Optional, use LangSmith for best-in-class observability
LANGSMITH_API_KEY=your-api-key
LANGSMITH_TRACING=true

# Reduce tracing latency if you are not in a serverless environment
# LANGCHAIN_CALLBACKS_BACKGROUND=true

```

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings();

const pinecone = new Pinecone();

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

/**
 * Pinecone allows you to partition the records in an index into namespaces.
 * Queries and other operations are then limited to one namespace,
 * so different requests can search different subsets of your index.
 * Read more about namespaces here: https://docs.pinecone.io/guides/indexes/use-namespaces
 *
 * NOTE: If you have namespace enabled in your Pinecone index, you must provide the namespace when creating the PineconeStore.
 */
const namespace = "pinecone";

const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  { pineconeIndex, namespace }
);

await vectorStore.addDocuments(
  [new Document({ pageContent: "i worked at kensho" })],
  { namespace: "harrison" }
);

await vectorStore.addDocuments(
  [new Document({ pageContent: "i worked at facebook" })],
  { namespace: "ankush" }
);

```

```text
[ "77b8f174-9d89-4c6c-b2ab-607fe3913b2d" ]

```The pinecone kwarg for `namespace` can be used to separate documents

```typescript
// This will only get documents for Ankush
const ankushRetriever = vectorStore.asRetriever({
  filter: {
    namespace: "ankush",
  },
});

await ankushRetriever.invoke("where did i work?");

```

```text
[ Document { pageContent: "i worked at facebook", metadata: {} } ]

```

```typescript
// This will only get documents for Harrison
const harrisonRetriever = vectorStore.asRetriever({
  filter: {
    namespace: "harrison",
  },
});

await harrisonRetriever.invoke("where did i work?");

```

```text
[ Document { pageContent: "i worked at kensho", metadata: {} } ]

```We can now create the chain that we will use to perform question-answering.

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnableBinding,
  RunnableLambda,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const template = `Answer the question based only on the following context:
{context}
Question: {question}`;

const prompt = ChatPromptTemplate.fromTemplate(template);

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo-0125",
  temperature: 0,
});

```

We can now create the chain using our configurable retriever. It is configurable because we can define any object which will be passed to the chain. From there, we extract the configurable object and pass it to the vectorstore.

```typescript
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";

const chain = RunnableSequence.from([
  RunnablePassthrough.assign({
    context: async (input: { question: string }, config) => {
      if (!config || !("configurable" in config)) {
        throw new Error("No config");
      }
      const { configurable } = config;
      const documents = await vectorStore
        .asRetriever(configurable)
        .invoke(input.question, config);
      return documents.map((doc) => doc.pageContent).join("\n\n");
    },
  }),
  prompt,
  model,
  new StringOutputParser(),
]);

```

We can now invoke the chain with configurable options. `search_kwargs` is the id of the configurable field. The value is the search kwargs to use for Pinecone

```typescript
await chain.invoke(
  { question: "where did the user work?" },
  { configurable: { filter: { namespace: "harrison" } } }
);

```

```text
"The user worked at Kensho."

```

```typescript
await chain.invoke(
  { question: "where did the user work?" },
  { configurable: { filter: { namespace: "ankush" } } }
);

```

```text
"The user worked at Facebook."

```For more vector store implementations that can support multiple users, please refer to specific pages, such as [Milvus](/docs/integrations/vectorstores/milvus).

## Next steps[​](#next-steps)

You’ve now seen one approach for supporting retrieval with data from multiple users.

Next, check out some of the other how-to guides on RAG, such as [returning sources](/docs/how_to/qa_sources).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Code Example](#code-example)
- [Setup](#setup)[Install dependencies](#install-dependencies)
- [Set environment variables](#set-environment-variables)

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