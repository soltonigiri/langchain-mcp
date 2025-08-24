How to use few shot examples in chat models | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to use few shot examples in chat modelsThis guide covers how to prompt a chat model with example inputs and outputs. Providing the model with a few such examples is called few-shotting, and is a simple yet powerful way to guide generation and in some cases drastically improve model performance.There does not appear to be solid consensus on how best to do few-shot prompting, and the optimal prompt compilation will likely vary by model. Because of this, we provide few-shot prompt templates like the FewShotChatMessagePromptTemplate](https://api.js.langchain.com/classes/langchain_core.prompts.FewShotChatMessagePromptTemplate.html) as a flexible starting point, and you can modify or replace them as you see fit.The goal of few-shot prompt templates are to dynamically select examples based on an input, and then format the examples in a final prompt to provide for the model.Note:** The following code examples are for chat models only, since FewShotChatMessagePromptTemplates are designed to output formatted [chat messages](/docs/concepts/messages) rather than pure strings. For similar few-shot prompt examples for pure string templates compatible with completion models (LLMs), see the [few-shot prompt templates](/docs/how_to/few_shot_examples/) guide.PrerequisitesThis guide assumes familiarity with the following concepts:[Prompt templates](/docs/concepts/prompt_templates)
- [Example selectors](/docs/concepts/example_selectors)
- [Chat models](/docs/concepts/chat_models)
- [Vectorstores](/docs/concepts/#vectorstores)

## Fixed Examples[​](#fixed-examples)

The most basic (and common) few-shot prompting technique is to use fixed prompt examples. This way you can select a chain, evaluate it, and avoid worrying about additional moving parts in production.

The basic components of the template are: - `examples`: An array of object examples to include in the final prompt. - `examplePrompt`: converts each example into 1 or more messages through its [formatMessages](https://api.js.langchain.com/classes/langchain_core.prompts.FewShotChatMessagePromptTemplate.html#formatMessages) method. A common example would be to convert each example into one human message and one AI message response, or a human message followed by a function call message.

Below is a simple demonstration. First, define the examples you’d like to include:

```typescript
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

const examples = [
  { input: "2+2", output: "4" },
  { input: "2+3", output: "5" },
];

```

Next, assemble them into the few-shot prompt template.

```typescript
// This is a prompt template used to format each individual example.
const examplePrompt = ChatPromptTemplate.fromMessages([
  ["human", "{input}"],
  ["ai", "{output}"],
]);
const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examplePrompt,
  examples,
  inputVariables: [], // no input variables
});

const result = await fewShotPrompt.invoke({});
console.log(result.toChatMessages());

```

```text
[
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: "2+2", additional_kwargs: {}, response_metadata: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "2+2",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "4",
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "4",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    tool_calls: [],
    invalid_tool_calls: []
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: "2+3", additional_kwargs: {}, response_metadata: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "2+3",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "5",
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "5",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    tool_calls: [],
    invalid_tool_calls: []
  }
]

```Finally, we assemble the final prompt as shown below, passing `fewShotPrompt` directly into the `fromMessages` factory method, and use it with a model:

```typescript
const finalPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a wondrous wizard of math."],
  fewShotPrompt,
  ["human", "{input}"],
]);

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

const model = new ChatGroq({
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

const model = new ChatOpenAI({
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

const model = new ChatAnthropic({
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

const model = new ChatGoogleGenerativeAI({
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

const model = new ChatFireworks({
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

const model = new ChatMistralAI({
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

const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```

```typescript
const chain = finalPrompt.pipe(model);

await chain.invoke({ input: "What&#x27;s the square of a triangle?" });

```

```text
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: "A triangle does not have a square. The square of a number is the result of multiplying the number by"... 8 more characters,
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: { function_call: undefined, tool_calls: undefined },
    response_metadata: {}
  },
  lc_namespace: [ "langchain_core", "messages" ],
  content: "A triangle does not have a square. The square of a number is the result of multiplying the number by"... 8 more characters,
  name: undefined,
  additional_kwargs: { function_call: undefined, tool_calls: undefined },
  response_metadata: {
    tokenUsage: { completionTokens: 23, promptTokens: 52, totalTokens: 75 },
    finish_reason: "stop"
  },
  tool_calls: [],
  invalid_tool_calls: []
}

``` ## Dynamic few-shot prompting[​](#dynamic-few-shot-prompting) Sometimes you may want to select only a few examples from your overall set to show based on the input. For this, you can replace the `examples` passed into `FewShotChatMessagePromptTemplate` with an `exampleSelector`. The other components remain the same as above! Our dynamic few-shot prompt template would look like:

- exampleSelector: responsible for selecting few-shot examples (and the order in which they are returned) for a given input. These implement the [BaseExampleSelector](https://api.js.langchain.com/classes/langchain_core.example_selectors.BaseExampleSelector.html) interface. A common example is the vectorstore-backed [SemanticSimilarityExampleSelector](https://api.js.langchain.com/classes/langchain_core.example_selectors.SemanticSimilarityExampleSelector.html)
- examplePrompt: convert each example into 1 or more messages through its [formatMessages](https://api.js.langchain.com/classes/langchain_core.prompts.FewShotChatMessagePromptTemplate.html#formatMessages) method. A common example would be to convert each example into one human message and one AI message response, or a human message followed by a function call message.

These once again can be composed with other messages and chat templates to assemble your final prompt.

Let’s walk through an example with the `SemanticSimilarityExampleSelector`. Since this implementation uses a vectorstore to select examples based on semantic similarity, we will want to first populate the store. Since the basic idea here is that we want to search for and return examples most similar to the text input, we embed the `values` of our prompt examples rather than considering the keys:

```typescript
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const examples = [
  { input: "2+2", output: "4" },
  { input: "2+3", output: "5" },
  { input: "2+4", output: "6" },
  { input: "What did the cow say to the moon?", output: "nothing at all" },
  {
    input: "Write me a poem about the moon",
    output:
      "One for the moon, and one for me, who are we to talk about the moon?",
  },
];

const toVectorize = examples.map(
  (example) => `${example.input} ${example.output}`
);
const embeddings = new OpenAIEmbeddings();
const vectorStore = await MemoryVectorStore.fromTexts(
  toVectorize,
  examples,
  embeddings
);

```

### Create the exampleSelector[​](#create-the-exampleselector) With a vectorstore created, we can create the `exampleSelector`. Here we will call it in isolation, and set `k` on it to only fetch the two example closest to the input.

```typescript
const exampleSelector = new SemanticSimilarityExampleSelector({
  vectorStore,
  k: 2,
});

// The prompt template will load examples by passing the input do the `select_examples` method
await exampleSelector.selectExamples({ input: "horse" });

```

```text
[
  {
    input: "What did the cow say to the moon?",
    output: "nothing at all"
  },
  { input: "2+4", output: "6" }
]

``` ### Create prompt template[​](#create-prompt-template) We now assemble the prompt template, using the `exampleSelector` created above.

```typescript
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

// Define the few-shot prompt.
const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  // The input variables select the values to pass to the example_selector
  inputVariables: ["input"],
  exampleSelector,
  // Define how ech example will be formatted.
  // In this case, each example will become 2 messages:
  // 1 human, and 1 AI
  examplePrompt: ChatPromptTemplate.fromMessages([
    ["human", "{input}"],
    ["ai", "{output}"],
  ]),
});

const results = await fewShotPrompt.invoke({ input: "What&#x27;s 3+3?" });
const fewShotMessages = results.toChatMessages();
console.log(fewShotMessages);

```

```text
[
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: "2+3", additional_kwargs: {}, response_metadata: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "2+3",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "5",
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "5",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    tool_calls: [],
    invalid_tool_calls: []
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: "2+2", additional_kwargs: {}, response_metadata: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "2+2",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "4",
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "4",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    tool_calls: [],
    invalid_tool_calls: []
  }
]

```And we can pass this few-shot chat message prompt template into another chat prompt template:

```typescript
const finalPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a wondrous wizard of math."],
  ...fewShotMessages,
  ["human", "{input}"],
]);

const result = await finalPrompt.invoke({ input: "What&#x27;s 3+3?" });
console.log(result);

```

```text
ChatPromptValue {
  lc_serializable: true,
  lc_kwargs: {
    messages: [
      HumanMessage {
        lc_serializable: true,
        lc_kwargs: {
          content: "2+3",
          additional_kwargs: {},
          response_metadata: {}
        },
        lc_namespace: [ "langchain_core", "messages" ],
        content: "2+3",
        name: undefined,
        additional_kwargs: {},
        response_metadata: {}
      },
      AIMessage {
        lc_serializable: true,
        lc_kwargs: {
          content: "5",
          tool_calls: [],
          invalid_tool_calls: [],
          additional_kwargs: {},
          response_metadata: {}
        },
        lc_namespace: [ "langchain_core", "messages" ],
        content: "5",
        name: undefined,
        additional_kwargs: {},
        response_metadata: {},
        tool_calls: [],
        invalid_tool_calls: []
      },
      HumanMessage {
        lc_serializable: true,
        lc_kwargs: {
          content: "2+2",
          additional_kwargs: {},
          response_metadata: {}
        },
        lc_namespace: [ "langchain_core", "messages" ],
        content: "2+2",
        name: undefined,
        additional_kwargs: {},
        response_metadata: {}
      },
      AIMessage {
        lc_serializable: true,
        lc_kwargs: {
          content: "4",
          tool_calls: [],
          invalid_tool_calls: [],
          additional_kwargs: {},
          response_metadata: {}
        },
        lc_namespace: [ "langchain_core", "messages" ],
        content: "4",
        name: undefined,
        additional_kwargs: {},
        response_metadata: {},
        tool_calls: [],
        invalid_tool_calls: []
      }
    ]
  },
  lc_namespace: [ "langchain_core", "prompt_values" ],
  messages: [
    HumanMessage {
      lc_serializable: true,
      lc_kwargs: { content: "2+3", additional_kwargs: {}, response_metadata: {} },
      lc_namespace: [ "langchain_core", "messages" ],
      content: "2+3",
      name: undefined,
      additional_kwargs: {},
      response_metadata: {}
    },
    AIMessage {
      lc_serializable: true,
      lc_kwargs: {
        content: "5",
        tool_calls: [],
        invalid_tool_calls: [],
        additional_kwargs: {},
        response_metadata: {}
      },
      lc_namespace: [ "langchain_core", "messages" ],
      content: "5",
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      tool_calls: [],
      invalid_tool_calls: []
    },
    HumanMessage {
      lc_serializable: true,
      lc_kwargs: { content: "2+2", additional_kwargs: {}, response_metadata: {} },
      lc_namespace: [ "langchain_core", "messages" ],
      content: "2+2",
      name: undefined,
      additional_kwargs: {},
      response_metadata: {}
    },
    AIMessage {
      lc_serializable: true,
      lc_kwargs: {
        content: "4",
        tool_calls: [],
        invalid_tool_calls: [],
        additional_kwargs: {},
        response_metadata: {}
      },
      lc_namespace: [ "langchain_core", "messages" ],
      content: "4",
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      tool_calls: [],
      invalid_tool_calls: []
    }
  ]
}

``` ### Use with an chat model[​](#use-with-an-chat-model) Finally, you can connect your model to the few-shot prompt.

### Pick your chat model:

- Groq
- OpenAI
- Anthropic
- Google Gemini
- FireworksAI
- MistralAI
- VertexAI

#### Install dependencies

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

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

const model = new ChatGroq({
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

const model = new ChatOpenAI({
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

const model = new ChatAnthropic({
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

const model = new ChatGoogleGenerativeAI({
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

const model = new ChatFireworks({
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

const model = new ChatMistralAI({
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

const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```

```typescript
const chain = finalPrompt.pipe(model);

await chain.invoke({ input: "What&#x27;s 3+3?" });

```

```text
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: "6",
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: { function_call: undefined, tool_calls: undefined },
    response_metadata: {}
  },
  lc_namespace: [ "langchain_core", "messages" ],
  content: "6",
  name: undefined,
  additional_kwargs: { function_call: undefined, tool_calls: undefined },
  response_metadata: {
    tokenUsage: { completionTokens: 1, promptTokens: 51, totalTokens: 52 },
    finish_reason: "stop"
  },
  tool_calls: [],
  invalid_tool_calls: []
}

``` ## Next steps[​](#next-steps) You’ve now learned how to add few-shot examples to your chat prompts.

Next, check out the other how-to guides on prompt templates in this section, the related how-to guide on [few shotting with text completion models](/docs/how_to/few_shot_examples), or the other [example selector how-to guides](/docs/how_to/example_selectors/).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Fixed Examples](#fixed-examples)
- [Dynamic few-shot prompting](#dynamic-few-shot-prompting)[Create the exampleSelector](#create-the-exampleselector)
- [Create prompt template](#create-prompt-template)
- [Use with an chat model](#use-with-an-chat-model)

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