How to add examples to the prompt | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to add examples to the promptPrerequisitesThis guide assumes familiarity with the following:Query analysis](/docs/tutorials/rag#query-analysis)

As our query analysis becomes more complex, the LLM may struggle to understand how exactly it should respond in certain scenarios. In order to improve performance here, we can add examples to the prompt to guide the LLM.

Let’s take a look at how we can add examples for the LangChain YouTube video query analyzer we built in the [query analysis tutorial](/docs/tutorials/rag#query-analysis).

## Setup[​](#setup)

### Install dependencies[​](#install-dependencies)

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/core zod uuid

```

```bash
yarn add @langchain/core zod uuid

```

```bash
pnpm add @langchain/core zod uuid

``` ### Set environment variables[​](#set-environment-variables)

```text
# Optional, use LangSmith for best-in-class observability
LANGSMITH_API_KEY=your-api-key
LANGSMITH_TRACING=true

# Reduce tracing latency if you are not in a serverless environment
# LANGCHAIN_CALLBACKS_BACKGROUND=true

``` ## Query schema[​](#query-schema) We’ll define a query schema that we want our model to output. To make our query analysis a bit more interesting, we’ll add a `subQueries` field that contains more narrow questions derived from the top level question.

```typescript
import { z } from "zod";

const subQueriesDescription = `
If the original question contains multiple distinct sub-questions,
or if there are more generic questions that would be helpful to answer in
order to answer the original question, write a list of all relevant sub-questions.
Make sure this list is comprehensive and covers all parts of the original question.
It&#x27;s ok if there&#x27;s redundancy in the sub-questions, it&#x27;s better to cover all the bases than to miss some.
Make sure the sub-questions are as narrowly focused as possible in order to get the most relevant results.`;

const searchSchema = z.object({
  query: z
    .string()
    .describe("Primary similarity search query applied to video transcripts."),
  subQueries: z.array(z.string()).optional().describe(subQueriesDescription),
  publishYear: z.number().optional().describe("Year video was published"),
});

```

## Query generation[​](#query-generation) ### Pick your chat model: - Groq - OpenAI - Anthropic - Google Gemini - FireworksAI - MistralAI - VertexAI #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

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
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";

const system = `You are an expert at converting user questions into database queries.
You have access to a database of tutorial videos about a software library for building LLM-powered applications.
Given a question, return a list of database queries optimized to retrieve the most relevant results.

If there are acronyms or words you are not familiar with, do not try to rephrase them.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", system],
  ["placeholder", "{examples}"],
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

```Let’s try out our query analyzer without any examples in the prompt:

```typescript
await queryAnalyzer.invoke(
  "what&#x27;s the difference between web voyager and reflection agents? do both use langgraph?"
);

```

```text
{
  query: "difference between Web Voyager and Reflection Agents",
  subQueries: [ "Do Web Voyager and Reflection Agents use LangGraph?" ]
}

``` ## Adding examples and tuning the prompt[​](#adding-examples-and-tuning-the-prompt) This works pretty well, but we probably want it to decompose the question even further to separate the queries about Web Voyager and Reflection Agents.

To tune our query generation results, we can add some examples of inputs questions and gold standard output queries to our prompt.

```typescript
const examples = [];

```

```typescript
const question = "What&#x27;s chat langchain, is it a langchain template?";
const query = {
  query: "What is chat langchain and is it a langchain template?",
  subQueries: ["What is chat langchain", "What is a langchain template"],
};
examples.push({ input: question, toolCalls: [query] });

```

```text
1

```

```typescript
const question2 =
  "How to build multi-agent system and stream intermediate steps from it";
const query2 = {
  query:
    "How to build multi-agent system and stream intermediate steps from it",
  subQueries: [
    "How to build multi-agent system",
    "How to stream intermediate steps from multi-agent system",
    "How to stream intermediate steps",
  ],
};

examples.push({ input: question2, toolCalls: [query2] });

```

```text
2

```

```typescript
const question3 = "LangChain agents vs LangGraph?";
const query3 = {
  query:
    "What&#x27;s the difference between LangChain agents and LangGraph? How do you deploy them?",
  subQueries: [
    "What are LangChain agents",
    "What is LangGraph",
    "How do you deploy LangChain agents",
    "How do you deploy LangGraph",
  ],
};
examples.push({ input: question3, toolCalls: [query3] });

```

```text
3

```Now we need to update our prompt template and chain so that the examples are included in each prompt. Since we’re working with LLM model function-calling, we’ll need to do a bit of extra structuring to send example inputs and outputs to the model. We’ll create a `toolExampleToMessages` helper function to handle this for us:

```typescript
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { v4 as uuidV4 } from "uuid";

const toolExampleToMessages = (
  example: Record<string, any>
): Array<BaseMessage> => {
  const messages: Array<BaseMessage> = [
    new HumanMessage({ content: example.input }),
  ];
  const openaiToolCalls = example.toolCalls.map((toolCall) => {
    return {
      id: uuidV4(),
      type: "function" as const,
      function: {
        name: "search",
        arguments: JSON.stringify(toolCall),
      },
    };
  });

  messages.push(
    new AIMessage({
      content: "",
      additional_kwargs: { tool_calls: openaiToolCalls },
    })
  );

  const toolOutputs =
    "toolOutputs" in example
      ? example.toolOutputs
      : Array(openaiToolCalls.length).fill(
          "You have correctly called this tool."
        );
  toolOutputs.forEach((output, index) => {
    messages.push(
      new ToolMessage({
        content: output,
        tool_call_id: openaiToolCalls[index].id,
      })
    );
  });

  return messages;
};

const exampleMessages = examples.map((ex) => toolExampleToMessages(ex)).flat();

```

```typescript
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const queryAnalyzerWithExamples = RunnableSequence.from([
  {
    question: new RunnablePassthrough(),
    examples: () => exampleMessages,
  },
  prompt,
  llmWithTools,
]);

```

```typescript
await queryAnalyzerWithExamples.invoke(
  "what&#x27;s the difference between web voyager and reflection agents? do both use langgraph?"
);

```

```text
{
  query: "Difference between Web Voyager and Reflection agents, do they both use LangGraph?",
  subQueries: [
    "Difference between Web Voyager and Reflection agents",
    "Do Web Voyager and Reflection agents use LangGraph"
  ]
}

```Thanks to our examples we get a slightly more decomposed search query. With some more prompt engineering and tuning of our examples we could improve query generation even more.

You can see that the examples are passed to the model as messages in the [LangSmith trace](https://smith.langchain.com/public/102829c3-69fc-4cb7-b28b-399ae2c9c008/r).

## Next steps[​](#next-steps)

You’ve now learned some techniques for combining few-shotting with query analysis.

Next, check out some of the other query analysis guides in this section, like [how to deal with high cardinality data](/docs/how_to/query_high_cardinality).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)[Install dependencies](#install-dependencies)
- [Set environment variables](#set-environment-variables)

- [Query schema](#query-schema)
- [Query generation](#query-generation)
- [Adding examples and tuning the prompt](#adding-examples-and-tuning-the-prompt)
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