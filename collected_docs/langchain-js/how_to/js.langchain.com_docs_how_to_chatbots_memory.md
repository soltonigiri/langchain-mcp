How to add memory to chatbots | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to add memory to chatbotsA key feature of chatbots is their ability to use content of previous conversation turns as context. This state management can take several forms, including:Simply stuffing previous messages into a chat model prompt.The above, but trimming old messages to reduce the amount of distracting information the model has to deal with.More complex modifications like synthesizing summaries for long running conversations.We’ll go into more detail on a few techniques below!This how-to guide previously built a chatbot using RunnableWithMessageHistory](https://v03.api.js.langchain.com/classes/_langchain_core.runnables.RunnableWithMessageHistory.html). You can access this version of the tutorial in the [v0.2 docs](https://js.langchain.com/v0.2/docs/how_to/chatbots_memory/).The LangGraph implementation offers a number of advantages over RunnableWithMessageHistory, including the ability to persist arbitrary components of an application’s state (instead of only messages). ## Setup[​](#setup) You’ll need to install a few packages, select your chat model, and set its enviroment variable.npm
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

```Let’s set up a chat model that we’ll use for the below examples.

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

``` ## Message passing[​](#message-passing) The simplest form of memory is simply passing chat history messages into a chain. Here’s an example:

```typescript
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability.",
  ],
  new MessagesPlaceholder("messages"),
]);

const chain = prompt.pipe(llm);

await chain.invoke({
  messages: [
    new HumanMessage(
      "Translate this sentence from English to French: I love programming."
    ),
    new AIMessage("J&#x27;adore la programmation."),
    new HumanMessage("What did you just say?"),
  ],
});

```

```text
AIMessage {
  "id": "chatcmpl-ABSxUXVIBitFRBh9MpasB5jeEHfCA",
  "content": "I said \"J&#x27;adore la programmation,\" which means \"I love programming\" in French.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 18,
      "promptTokens": 58,
      "totalTokens": 76
    },
    "finish_reason": "stop",
    "system_fingerprint": "fp_e375328146"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 58,
    "output_tokens": 18,
    "total_tokens": 76
  }
}

```We can see that by passing the previous conversation into a chain, it can use it as context to answer questions. This is the basic concept underpinning chatbot memory - the rest of the guide will demonstrate convenient techniques for passing or reformatting messages.

## Automatic history management[​](#automatic-history-management)

The previous examples pass messages to the chain (and model) explicitly. This is a completely acceptable approach, but it does require external management of new messages. LangChain also provides a way to build applications that have memory using LangGraph’s persistence. You can enable persistence in LangGraph applications by providing a `checkpointer` when compiling the graph.

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
  const systemPrompt =
    "You are a helpful assistant. " +
    "Answer all questions to the best of your ability.";
  const messages = [
    { role: "system", content: systemPrompt },
    ...state.messages,
  ];
  const response = await llm.invoke(messages);
  return { messages: response };
};

const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add simple in-memory checkpointer
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

```

We’ll pass the latest input to the conversation here and let the LangGraph keep track of the conversation history using the checkpointer:

```typescript
await app.invoke(
  {
    messages: [
      {
        role: "user",
        content: "Translate to French: I love programming.",
      },
    ],
  },
  {
    configurable: { thread_id: "1" },
  }
);

```

```text
{
  messages: [
    HumanMessage {
      "id": "227b82a9-4084-46a5-ac79-ab9a3faa140e",
      "content": "Translate to French: I love programming.",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "chatcmpl-ABSxVrvztgnasTeMSFbpZQmyYqjJZ",
      "content": "J&#x27;adore la programmation.",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 5,
          "promptTokens": 35,
          "totalTokens": 40
        },
        "finish_reason": "stop",
        "system_fingerprint": "fp_52a7f40b0b"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 35,
        "output_tokens": 5,
        "total_tokens": 40
      }
    }
  ]
}

```

```typescript
await app.invoke(
  {
    messages: [
      {
        role: "user",
        content: "What did I just ask you?",
      },
    ],
  },
  {
    configurable: { thread_id: "1" },
  }
);

```

```text
{
  messages: [
    HumanMessage {
      "id": "1a0560a4-9dcb-47a1-b441-80717e229706",
      "content": "Translate to French: I love programming.",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "chatcmpl-ABSxVrvztgnasTeMSFbpZQmyYqjJZ",
      "content": "J&#x27;adore la programmation.",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 5,
          "promptTokens": 35,
          "totalTokens": 40
        },
        "finish_reason": "stop",
        "system_fingerprint": "fp_52a7f40b0b"
      },
      "tool_calls": [],
      "invalid_tool_calls": []
    },
    HumanMessage {
      "id": "4f233a7d-4b08-4f53-bb60-cf0141a59721",
      "content": "What did I just ask you?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "chatcmpl-ABSxVs5QnlPfbihTOmJrCVg1Dh7Ol",
      "content": "You asked me to translate \"I love programming\" into French.",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 13,
          "promptTokens": 55,
          "totalTokens": 68
        },
        "finish_reason": "stop",
        "system_fingerprint": "fp_9f2bfdaa89"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 55,
        "output_tokens": 13,
        "total_tokens": 68
      }
    }
  ]
}

``` ## Modifying chat history[​](#modifying-chat-history) Modifying stored chat messages can help your chatbot handle a variety of situations. Here are some examples:

### Trimming messages[​](#trimming-messages)

LLMs and chat models have limited context windows, and even if you’re not directly hitting limits, you may want to limit the amount of distraction the model has to deal with. One solution is trim the history messages before passing them to the model. Let’s use an example history with the `app` we declared above:

```typescript
const demoEphemeralChatHistory = [
  { role: "user", content: "Hey there! I&#x27;m Nemo." },
  { role: "assistant", content: "Hello!" },
  { role: "user", content: "How are you today?" },
  { role: "assistant", content: "Fine thanks!" },
];

await app.invoke(
  {
    messages: [
      ...demoEphemeralChatHistory,
      { role: "user", content: "What&#x27;s my name?" },
    ],
  },
  {
    configurable: { thread_id: "2" },
  }
);

```

```text
{
  messages: [
    HumanMessage {
      "id": "63057c3d-f980-4640-97d6-497a9f83ddee",
      "content": "Hey there! I&#x27;m Nemo.",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "c9f0c20a-8f55-4909-b281-88f2a45c4f05",
      "content": "Hello!",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [],
      "invalid_tool_calls": []
    },
    HumanMessage {
      "id": "fd7fb3a0-7bc7-4e84-99a9-731b30637b55",
      "content": "How are you today?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "09b0debb-1d4a-4856-8821-b037f5d96ecf",
      "content": "Fine thanks!",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [],
      "invalid_tool_calls": []
    },
    HumanMessage {
      "id": "edc13b69-25a0-40ac-81b3-175e65dc1a9a",
      "content": "What&#x27;s my name?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "chatcmpl-ABSxWKCTdRuh2ZifXsvFHSo5z5I0J",
      "content": "Your name is Nemo! How can I assist you today, Nemo?",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 14,
          "promptTokens": 63,
          "totalTokens": 77
        },
        "finish_reason": "stop",
        "system_fingerprint": "fp_a5d11b2ef2"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 63,
        "output_tokens": 14,
        "total_tokens": 77
      }
    }
  ]
}

```We can see the app remembers the preloaded name.

But let’s say we have a very small context window, and we want to trim the number of messages passed to the model to only the 2 most recent ones. We can use the built in [trimMessages](/docs/how_to/trim_messages/) util to trim messages based on their token count before they reach our prompt. In this case we’ll count each message as 1 “token” and keep only the last two messages:

```typescript
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { trimMessages } from "@langchain/core/messages";

// Define trimmer
// count each message as 1 "token" (tokenCounter: (msgs) => msgs.length) and keep only the last two messages
const trimmer = trimMessages({
  strategy: "last",
  maxTokens: 2,
  tokenCounter: (msgs) => msgs.length,
});

// Define the function that calls the model
const callModel2 = async (state: typeof MessagesAnnotation.State) => {
  const trimmedMessages = await trimmer.invoke(state.messages);
  const systemPrompt =
    "You are a helpful assistant. " +
    "Answer all questions to the best of your ability.";
  const messages = [
    { role: "system", content: systemPrompt },
    ...trimmedMessages,
  ];
  const response = await llm.invoke(messages);
  return { messages: response };
};

const workflow2 = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel2)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add simple in-memory checkpointer
const app2 = workflow2.compile({ checkpointer: new MemorySaver() });

```

Let’s call this new app and check the response

```typescript
await app2.invoke(
  {
    messages: [
      ...demoEphemeralChatHistory,
      { role: "user", content: "What is my name?" },
    ],
  },
  {
    configurable: { thread_id: "3" },
  }
);

```

```text
{
  messages: [
    HumanMessage {
      "id": "0d9330a0-d9d1-4aaf-8171-ca1ac6344f7c",
      "content": "What is my name?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "3a24e88b-7525-4797-9fcd-d751a378d22c",
      "content": "Fine thanks!",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [],
      "invalid_tool_calls": []
    },
    HumanMessage {
      "id": "276039c8-eba8-4c68-b015-81ec7704140d",
      "content": "How are you today?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "2ad4f461-20e1-4982-ba3b-235cb6b02abd",
      "content": "Hello!",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [],
      "invalid_tool_calls": []
    },
    HumanMessage {
      "id": "52213cae-953a-463d-a4a0-a7368c9ee4db",
      "content": "Hey there! I&#x27;m Nemo.",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "chatcmpl-ABSxWe9BRDl1pmzkNIDawWwU3hvKm",
      "content": "I&#x27;m sorry, but I don&#x27;t have access to personal information about you unless you&#x27;ve shared it with me during our conversation. How can I assist you today?",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 30,
          "promptTokens": 39,
          "totalTokens": 69
        },
        "finish_reason": "stop",
        "system_fingerprint": "fp_3537616b13"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 39,
        "output_tokens": 30,
        "total_tokens": 69
      }
    }
  ]
}

```We can see that `trimMessages` was called and only the two most recent messages will be passed to the model. In this case, this means that the model forgot the name we gave it.

Check out our [how to guide on trimming messages](/docs/how_to/trim_messages/) for more.

### Summary memory[​](#summary-memory)

We can use this same pattern in other ways too. For example, we could use an additional LLM call to generate a summary of the conversation before calling our app. Let’s recreate our chat history:

```typescript
const demoEphemeralChatHistory2 = [
  { role: "user", content: "Hey there! I&#x27;m Nemo." },
  { role: "assistant", content: "Hello!" },
  { role: "user", content: "How are you today?" },
  { role: "assistant", content: "Fine thanks!" },
];

```

And now, let’s update the model-calling function to distill previous interactions into a summary:

```typescript
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { RemoveMessage } from "@langchain/core/messages";

// Define the function that calls the model
const callModel3 = async (state: typeof MessagesAnnotation.State) => {
  const systemPrompt =
    "You are a helpful assistant. " +
    "Answer all questions to the best of your ability. " +
    "The provided chat history includes a summary of the earlier conversation.";
  const systemMessage = { role: "system", content: systemPrompt };
  const messageHistory = state.messages.slice(0, -1); // exclude the most recent user input

  // Summarize the messages if the chat history reaches a certain size
  if (messageHistory.length >= 4) {
    const lastHumanMessage = state.messages[state.messages.length - 1];
    // Invoke the model to generate conversation summary
    const summaryPrompt =
      "Distill the above chat messages into a single summary message. " +
      "Include as many specific details as you can.";
    const summaryMessage = await llm.invoke([
      ...messageHistory,
      { role: "user", content: summaryPrompt },
    ]);

    // Delete messages that we no longer want to show up
    const deleteMessages = state.messages.map(
      (m) => new RemoveMessage({ id: m.id })
    );
    // Re-add user message
    const humanMessage = { role: "user", content: lastHumanMessage.content };
    // Call the model with summary & response
    const response = await llm.invoke([
      systemMessage,
      summaryMessage,
      humanMessage,
    ]);
    return {
      messages: [summaryMessage, humanMessage, response, ...deleteMessages],
    };
  } else {
    const response = await llm.invoke([systemMessage, ...state.messages]);
    return { messages: response };
  }
};

const workflow3 = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel3)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add simple in-memory checkpointer
const app3 = workflow3.compile({ checkpointer: new MemorySaver() });

```

Let’s see if it remembers the name we gave it:

```typescript
await app3.invoke(
  {
    messages: [
      ...demoEphemeralChatHistory2,
      { role: "user", content: "What did I say my name was?" },
    ],
  },
  {
    configurable: { thread_id: "4" },
  }
);

```

```text
{
  messages: [
    AIMessage {
      "id": "chatcmpl-ABSxXjFDj6WRo7VLSneBtlAxUumPE",
      "content": "Nemo greeted the assistant and asked how it was doing, to which the assistant responded that it was fine.",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 22,
          "promptTokens": 60,
          "totalTokens": 82
        },
        "finish_reason": "stop",
        "system_fingerprint": "fp_e375328146"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 60,
        "output_tokens": 22,
        "total_tokens": 82
      }
    },
    HumanMessage {
      "id": "8b1309b7-c09e-47fb-9ab3-34047f6973e3",
      "content": "What did I say my name was?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "chatcmpl-ABSxYAQKiBsQ6oVypO4CLFDsi1HRH",
      "content": "You mentioned that your name is Nemo.",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 8,
          "promptTokens": 73,
          "totalTokens": 81
        },
        "finish_reason": "stop",
        "system_fingerprint": "fp_52a7f40b0b"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 73,
        "output_tokens": 8,
        "total_tokens": 81
      }
    }
  ]
}

```Note that invoking the app again will keep accumulating the history until it reaches the specified number of messages (four in our case). At that point we will generate another summary generated from the initial summary plus new messages and so on.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Message passing](#message-passing)
- [Automatic history management](#automatic-history-management)
- [Modifying chat history](#modifying-chat-history)[Trimming messages](#trimming-messages)
- [Summary memory](#summary-memory)

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