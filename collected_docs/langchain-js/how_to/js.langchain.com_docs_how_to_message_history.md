How to add message history | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to add message historyPrerequisitesThis guide assumes familiarity with the following concepts:Chaining runnables](/docs/how_to/sequence/)
- [Prompt templates](/docs/concepts/prompt_templates)
- [Chat Messages](/docs/concepts/messages)

noteThis guide previously covered the [RunnableWithMessageHistory](https://api.js.langchain.com/classes/_langchain_core.runnables.RunnableWithMessageHistory.html) abstraction. You can access this version of the guide in the [v0.2 docs](https://js.langchain.com/v0.2/docs/how_to/message_history/).

The LangGraph implementation offers a number of advantages over `RunnableWithMessageHistory`, including the ability to persist arbitrary components of an application&#x27;s state (instead of only messages).

Passing conversation state into and out a chain is vital when building a chatbot. LangGraph implements a built-in persistence layer, allowing chain states to be automatically persisted in memory, or external backends such as SQLite, Postgres or Redis. Details can be found in the LangGraph persistence documentation.

In this guide we demonstrate how to add persistence to arbitrary LangChain runnables by wrapping them in a minimal LangGraph application. This lets us persist the message history and other elements of the chain’s state, simplifying the development of multi-turn applications. It also supports multiple threads, enabling a single application to interact separately with multiple users.

## Setup[​](#setup)

- npm
- yarn
- pnpm

```bash
npm i @langchain/core @langchain/langgraph

```

```bash
yarn add @langchain/core @langchain/langgraph

```

```bash
pnpm add @langchain/core @langchain/langgraph

```Let’s also set up a chat model that we’ll use for the below examples.

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

``` ## Example: message inputs[​](#example-message-inputs) Adding memory to a [chat model](/docs/concepts/chat_models) provides a simple example. Chat models accept a list of messages as input and output a message. LangGraph includes a built-in `MessagesState` that we can use for this purpose.

Below, we: 1. Define the graph state to be a list of messages; 2. Add a single node to the graph that calls a chat model; 3. Compile the graph with an in-memory checkpointer to store messages between runs.

The output of a LangGraph application is its [state](https://langchain-ai.github.io/langgraphjs/concepts/low_level/).

```typescript
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";

// Define the function that calls the model
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages);
  // Update message history with response:
  return { messages: response };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the (single) node in the graph
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

```

When we run the application, we pass in a configuration object that specifies a `thread_id`. This ID is used to distinguish conversational threads (e.g., between different users).

```typescript
import { v4 as uuidv4 } from "uuid";

const config = { configurable: { thread_id: uuidv4() } };

```

We can then invoke the application:

```typescript
const input = [
  {
    role: "user",
    content: "Hi! I&#x27;m Bob.",
  },
];
const output = await app.invoke({ messages: input }, config);
// The output contains all messages in the state.
// This will log the last message in the conversation.
console.log(output.messages[output.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-ABTqCeKnMQmG9IH8dNF5vPjsgXtcM",
  "content": "Hi Bob! How can I assist you today?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 10,
      "promptTokens": 12,
      "totalTokens": 22
    },
    "finish_reason": "stop",
    "system_fingerprint": "fp_e375328146"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 12,
    "output_tokens": 10,
    "total_tokens": 22
  }
}

```

```typescript
const input2 = [
  {
    role: "user",
    content: "What&#x27;s my name?",
  },
];
const output2 = await app.invoke({ messages: input2 }, config);
console.log(output2.messages[output2.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-ABTqD5jrJXeKCpvoIDp47fvgw2OPn",
  "content": "Your name is Bob. How can I help you today, Bob?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 14,
      "promptTokens": 34,
      "totalTokens": 48
    },
    "finish_reason": "stop",
    "system_fingerprint": "fp_e375328146"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 34,
    "output_tokens": 14,
    "total_tokens": 48
  }
}

```Note that states are separated for different threads. If we issue the same query to a thread with a new `thread_id`, the model indicates that it does not know the answer:

```typescript
const config2 = { configurable: { thread_id: uuidv4() } };
const input3 = [
  {
    role: "user",
    content: "What&#x27;s my name?",
  },
];
const output3 = await app.invoke({ messages: input3 }, config2);
console.log(output3.messages[output3.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-ABTqDkctxwmXjeGOZpK6Km8jdCqdl",
  "content": "I&#x27;m sorry, but I don&#x27;t have access to personal information about users. How can I assist you today?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 21,
      "promptTokens": 11,
      "totalTokens": 32
    },
    "finish_reason": "stop",
    "system_fingerprint": "fp_52a7f40b0b"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 11,
    "output_tokens": 21,
    "total_tokens": 32
  }
}

``` ## Example: object inputs[​](#example-object-inputs) LangChain runnables often accept multiple inputs via separate keys in a single object argument. A common example is a prompt template with multiple parameters.

Whereas before our runnable was a chat model, here we chain together a prompt template and chat model.

```typescript
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer in {language}."],
  new MessagesPlaceholder("messages"),
]);

const runnable = prompt.pipe(llm);

```

For this scenario, we define the graph state to include these parameters (in addition to the message history). We then define a single-node graph in the same way as before.

Note that in the below state: - Updates to the `messages` list will append messages; - Updates to the `language` string will overwrite the string.

```typescript
import {
  START,
  END,
  StateGraph,
  MemorySaver,
  MessagesAnnotation,
  Annotation,
} from "@langchain/langgraph";

// Define the State
const GraphAnnotation = Annotation.Root({
  language: Annotation<string>(),
  // Spread `MessagesAnnotation` into the state to add the `messages` field.
  ...MessagesAnnotation.spec,
});

// Define the function that calls the model
const callModel2 = async (state: typeof GraphAnnotation.State) => {
  const response = await runnable.invoke(state);
  // Update message history with response:
  return { messages: [response] };
};

const workflow2 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel2)
  .addEdge(START, "model")
  .addEdge("model", END);

const app2 = workflow2.compile({ checkpointer: new MemorySaver() });

```

```typescript
const config3 = { configurable: { thread_id: uuidv4() } };
const input4 = {
  messages: [
    {
      role: "user",
      content: "What&#x27;s my name?",
    },
  ],
  language: "Spanish",
};
const output4 = await app2.invoke(input4, config3);
console.log(output4.messages[output4.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-ABTqFnCASRB5UhZ7XAbbf5T0Bva4U",
  "content": "Lo siento, pero no tengo suficiente información para saber tu nombre. ¿Cómo te llamas?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 19,
      "promptTokens": 19,
      "totalTokens": 38
    },
    "finish_reason": "stop",
    "system_fingerprint": "fp_e375328146"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 19,
    "output_tokens": 19,
    "total_tokens": 38
  }
}

``` ## Managing message history[​](#managing-message-history) The message history (and other elements of the application state) can be accessed via `.getState`:

```typescript
const state = (await app2.getState(config3)).values;

console.log(`Language: ${state.language}`);
console.log(state.messages);

```

```text
Language: Spanish
[
  HumanMessage {
    "content": "What&#x27;s my name?",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "id": "chatcmpl-ABTqFnCASRB5UhZ7XAbbf5T0Bva4U",
    "content": "Lo siento, pero no tengo suficiente información para saber tu nombre. ¿Cómo te llamas?",
    "additional_kwargs": {},
    "response_metadata": {
      "tokenUsage": {
        "completionTokens": 19,
        "promptTokens": 19,
        "totalTokens": 38
      },
      "finish_reason": "stop",
      "system_fingerprint": "fp_e375328146"
    },
    "tool_calls": [],
    "invalid_tool_calls": []
  }
]

```We can also update the state via `.updateState`. For example, we can manually append a new message:

```typescript
const _ = await app2.updateState(config3, {
  messages: [{ role: "user", content: "test" }],
});

```

```typescript
const state2 = (await app2.getState(config3)).values;

console.log(`Language: ${state2.language}`);
console.log(state2.messages);

```

```text
Language: Spanish
[
  HumanMessage {
    "content": "What&#x27;s my name?",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "id": "chatcmpl-ABTqFnCASRB5UhZ7XAbbf5T0Bva4U",
    "content": "Lo siento, pero no tengo suficiente información para saber tu nombre. ¿Cómo te llamas?",
    "additional_kwargs": {},
    "response_metadata": {
      "tokenUsage": {
        "completionTokens": 19,
        "promptTokens": 19,
        "totalTokens": 38
      },
      "finish_reason": "stop",
      "system_fingerprint": "fp_e375328146"
    },
    "tool_calls": [],
    "invalid_tool_calls": []
  },
  HumanMessage {
    "content": "test",
    "additional_kwargs": {},
    "response_metadata": {}
  }
]

```For details on managing state, including deleting messages, see the LangGraph documentation:

- [How to delete messages](https://langchain-ai.github.io/langgraphjs/how-tos/delete-messages/)
- [How to view and update past graph state](https://langchain-ai.github.io/langgraphjs/how-tos/time-travel/)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Example: message inputs](#example-message-inputs)
- [Example: object inputs](#example-object-inputs)
- [Managing message history](#managing-message-history)

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