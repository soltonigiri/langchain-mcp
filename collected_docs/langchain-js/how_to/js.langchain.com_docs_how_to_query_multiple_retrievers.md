How to handle multiple retrievers | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to handle multiple retrieversPrerequisitesThis guide assumes familiarity with the following:Query analysis](/docs/tutorials/rag#query-analysis)

Sometimes, a query analysis technique may allow for selection of which retriever to use. To use this, you will need to add some logic to select the retriever to do. We will show a simple example (using mock data) of how to do that.

## Setup[​](#setup)

### Install dependencies[​](#install-dependencies)

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/community @langchain/openai @langchain/core zod chromadb

```

```bash
yarn add @langchain/community @langchain/openai @langchain/core zod chromadb

```

```bash
pnpm add @langchain/community @langchain/openai @langchain/core zod chromadb

``` ### Set environment variables[​](#set-environment-variables)

```text
OPENAI_API_KEY=your-api-key

# Optional, use LangSmith for best-in-class observability
LANGSMITH_API_KEY=your-api-key
LANGSMITH_TRACING=true

# Reduce tracing latency if you are not in a serverless environment
# LANGCHAIN_CALLBACKS_BACKGROUND=true

``` ### Create Index[​](#create-index) We will create a vectorstore over fake information.

```typescript
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import "chromadb";

const texts = ["Harrison worked at Kensho"];
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const vectorstore = await Chroma.fromTexts(texts, {}, embeddings, {
  collectionName: "harrison",
});
const retrieverHarrison = vectorstore.asRetriever(1);

const textsAnkush = ["Ankush worked at Facebook"];
const embeddingsAnkush = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});
const vectorstoreAnkush = await Chroma.fromTexts(
  textsAnkush,
  {},
  embeddingsAnkush,
  {
    collectionName: "ankush",
  }
);
const retrieverAnkush = vectorstoreAnkush.asRetriever(1);

```

## Query analysis[​](#query-analysis) We will use function calling to structure the output. We will let it return multiple queries.

```typescript
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().describe("Query to look up"),
  person: z
    .string()
    .describe(
      "Person to look things up for. Should be `HARRISON` or `ANKUSH`."
    ),
});

```

### Pick your chat model: - Groq - OpenAI - Anthropic - Google Gemini - FireworksAI - MistralAI - VertexAI #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

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

const llm = new ChatGroq({
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

const llm = new ChatOpenAI({
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

const llm = new ChatAnthropic({
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

const llm = new ChatGoogleGenerativeAI({
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

const llm = new ChatFireworks({
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

const llm = new ChatMistralAI({
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

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

const system = `You have the ability to issue search queries to get information to help answer user information.`;
const prompt = ChatPromptTemplate.fromMessages([
  ["system", system],
  ["human", "{question}"],
]);
const llmWithTools = llm.withStructuredOutput(searchSchema, {
  name: "Search",
});
const queryAnalyzer = RunnableSequence.from([
  {
    question: new RunnablePassthrough(),
  },
  prompt,
  llmWithTools,
]);

```We can see that this allows for routing between retrievers

```typescript
await queryAnalyzer.invoke("where did Harrison Work");

```

```text
{ query: "workplace of Harrison", person: "HARRISON" }

```

```typescript
await queryAnalyzer.invoke("where did ankush Work");

```

```text
{ query: "Workplace of Ankush", person: "ANKUSH" }

``` ## Retrieval with query analysis[​](#retrieval-with-query-analysis) So how would we include this in a chain? We just need some simple logic to select the retriever and pass in the search query

```typescript
const retrievers = {
  HARRISON: retrieverHarrison,
  ANKUSH: retrieverAnkush,
};

```

```typescript
import { RunnableConfig, RunnableLambda } from "@langchain/core/runnables";

const chain = async (question: string, config?: RunnableConfig) => {
  const response = await queryAnalyzer.invoke(question, config);
  const retriever = retrievers[response.person];
  return retriever.invoke(response.query, config);
};

const customChain = new RunnableLambda({ func: chain });

```

```typescript
await customChain.invoke("where did Harrison Work");

```

```text
[ Document { pageContent: "Harrison worked at Kensho", metadata: {} } ]

```

```typescript
await customChain.invoke("where did ankush Work");

```

```text
[ Document { pageContent: "Ankush worked at Facebook", metadata: {} } ]

``` ## Next steps[​](#next-steps) You’ve now learned some techniques for handling multiple retrievers in a query analysis system.

Next, check out some of the other query analysis guides in this section, like [how to deal with cases where no query is generated](/docs/how_to/query_no_queries).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)[Install dependencies](#install-dependencies)
- [Set environment variables](#set-environment-variables)
- [Create Index](#create-index)

- [Query analysis](#query-analysis)
- [Retrieval with query analysis](#retrieval-with-query-analysis)
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