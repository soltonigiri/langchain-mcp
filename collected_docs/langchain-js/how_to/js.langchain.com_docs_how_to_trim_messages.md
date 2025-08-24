How to trim messages | 🦜️🔗 Langchain
- *[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to trim messagesPrerequisitesThis guide assumes familiarity with the following concepts:Messages](/docs/concepts/messages)[Chat models](/docs/concepts/chat_models)[Chaining](/docs/how_to/sequence/)[Chat history](/docs/concepts/chat_history)The methods in this guide also require @langchain/core>=0.2.8. Please see here for a [guide on upgrading](/docs/how_to/installation/#installing-integration-packages).All models have finite context windows, meaning there’s a limit to how many tokens they can take as input. If you have very long messages or a chain/agent that accumulates a long message is history, you’ll need to manage the length of the messages you’re passing in to the model.The trimMessages util provides some basic strategies for trimming a list of messages to be of a certain token length.Getting the last maxTokens tokens[​](#getting-the-last-maxtokens-tokens)To get the last maxTokens in the list of Messages we can set strategy: "last". Notice that for our tokenCounter we can pass in a function (more on that below) or a language model (since language models have a message token counting method). It makes sense to pass in a model when you’re trimming your messages to fit into the context window of that specific model:

```typescript
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

const messages = [
  new SystemMessage("you&#x27;re a good assistant, you always respond with a joke."),
  new HumanMessage("i wonder why it&#x27;s called langchain"),
  new AIMessage(
    &#x27;Well, I guess they thought "WordRope" and "SentenceString" just didn\&#x27;t have the same ring to it!&#x27;
  ),
  new HumanMessage("and who is harrison chasing anyways"),
  new AIMessage(
    "Hmmm let me think.\n\nWhy, he&#x27;s probably chasing after the last cup of coffee in the office!"
  ),
  new HumanMessage("what do you call a speechless parrot"),
];

const trimmed = await trimMessages(messages, {
  maxTokens: 45,
  strategy: "last",
  tokenCounter: new ChatOpenAI({ model: "gpt-4" }),
});

console.log(
  trimmed
    .map((x) =>
      JSON.stringify(
        {
          role: x._getType(),
          content: x.content,
        },
        null,
        2
      )
    )
    .join("\n\n")
);

```

```text
{
  "role": "human",
  "content": "and who is harrison chasing anyways"
}

{
  "role": "ai",
  "content": "Hmmm let me think.\n\nWhy, he&#x27;s probably chasing after the last cup of coffee in the office!"
}

{
  "role": "human",
  "content": "what do you call a speechless parrot"
}

```If we want to always keep the initial system message we can specify includeSystem: true:

```typescript
await trimMessages(messages, {
  maxTokens: 45,
  strategy: "last",
  tokenCounter: new ChatOpenAI({ model: "gpt-4" }),
  includeSystem: true,
});

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "you&#x27;re a good assistant, you always respond with a joke.",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: "you&#x27;re a good assistant, you always respond with a joke.",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;Hmmm let me think.\n&#x27; +
        &#x27;\n&#x27; +
        "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;Hmmm let me think.\n&#x27; +
      &#x27;\n&#x27; +
      "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined,
    tool_calls: [],
    invalid_tool_calls: [],
    usage_metadata: undefined
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;what do you call a speechless parrot&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;what do you call a speechless parrot&#x27;,
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  }
]

```If we want to allow splitting up the contents of a message we can specify allowPartial: true:

```typescript
await trimMessages(messages, {
  maxTokens: 50,
  strategy: "last",
  tokenCounter: new ChatOpenAI({ model: "gpt-4" }),
  includeSystem: true,
  allowPartial: true,
});

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "you&#x27;re a good assistant, you always respond with a joke.",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: "you&#x27;re a good assistant, you always respond with a joke.",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;Hmmm let me think.\n&#x27; +
        &#x27;\n&#x27; +
        "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;Hmmm let me think.\n&#x27; +
      &#x27;\n&#x27; +
      "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined,
    tool_calls: [],
    invalid_tool_calls: [],
    usage_metadata: undefined
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;what do you call a speechless parrot&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;what do you call a speechless parrot&#x27;,
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  }
]

```If we need to make sure that our first message (excluding the system message) is always of a specific type, we can specify startOn:

```typescript
await trimMessages(messages, {
  maxTokens: 60,
  strategy: "last",
  tokenCounter: new ChatOpenAI({ model: "gpt-4" }),
  includeSystem: true,
  startOn: "human",
});

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "you&#x27;re a good assistant, you always respond with a joke.",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: "you&#x27;re a good assistant, you always respond with a joke.",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;and who is harrison chasing anyways&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;and who is harrison chasing anyways&#x27;,
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;Hmmm let me think.\n&#x27; +
        &#x27;\n&#x27; +
        "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;Hmmm let me think.\n&#x27; +
      &#x27;\n&#x27; +
      "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined,
    tool_calls: [],
    invalid_tool_calls: [],
    usage_metadata: undefined
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;what do you call a speechless parrot&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;what do you call a speechless parrot&#x27;,
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  }
]

```Getting the first maxTokens tokens[​](#getting-the-first-maxtokens-tokens)We can perform the flipped operation of getting the first* maxTokens by specifying strategy: "first":

```typescript
await trimMessages(messages, {
  maxTokens: 45,
  strategy: "first",
  tokenCounter: new ChatOpenAI({ model: "gpt-4" }),
});

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "you&#x27;re a good assistant, you always respond with a joke.",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: "you&#x27;re a good assistant, you always respond with a joke.",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "i wonder why it&#x27;s called langchain",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: "i wonder why it&#x27;s called langchain",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  }
]

``` ## Writing a custom token counter[​](#writing-a-custom-token-counter) We can write a custom token counter function that takes in a list of messages and returns an int.

```typescript
import { encodingForModel } from "@langchain/core/utils/tiktoken";
import {
  BaseMessage,
  HumanMessage,
  AIMessage,
  ToolMessage,
  SystemMessage,
  MessageContent,
  MessageContentText,
} from "@langchain/core/messages";

async function strTokenCounter(
  messageContent: MessageContent
): Promise<number> {
  if (typeof messageContent === "string") {
    return (await encodingForModel("gpt-4")).encode(messageContent).length;
  } else {
    if (messageContent.every((x) => x.type === "text" && x.text)) {
      return (await encodingForModel("gpt-4")).encode(
        (messageContent as MessageContentText[])
          .map(({ text }) => text)
          .join("")
      ).length;
    }
    throw new Error(
      `Unsupported message content ${JSON.stringify(messageContent)}`
    );
  }
}

async function tiktokenCounter(messages: BaseMessage[]): Promise<number> {
  let numTokens = 3; // every reply is primed with <|start|>assistant<|message|>
  const tokensPerMessage = 3;
  const tokensPerName = 1;

  for (const msg of messages) {
    let role: string;
    if (msg instanceof HumanMessage) {
      role = "user";
    } else if (msg instanceof AIMessage) {
      role = "assistant";
    } else if (msg instanceof ToolMessage) {
      role = "tool";
    } else if (msg instanceof SystemMessage) {
      role = "system";
    } else {
      throw new Error(`Unsupported message type ${msg.constructor.name}`);
    }

    numTokens +=
      tokensPerMessage +
      (await strTokenCounter(role)) +
      (await strTokenCounter(msg.content));

    if (msg.name) {
      numTokens += tokensPerName + (await strTokenCounter(msg.name));
    }
  }

  return numTokens;
}

await trimMessages(messages, {
  maxTokens: 45,
  strategy: "last",
  tokenCounter: tiktokenCounter,
});

```

```text
[
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;Hmmm let me think.\n&#x27; +
        &#x27;\n&#x27; +
        "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;Hmmm let me think.\n&#x27; +
      &#x27;\n&#x27; +
      "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined,
    tool_calls: [],
    invalid_tool_calls: [],
    usage_metadata: undefined
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;what do you call a speechless parrot&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;what do you call a speechless parrot&#x27;,
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  }
]

``` ## Chaining[​](#chaining) trimMessages can be used in an imperatively (like above) or declaratively, making it easy to compose with other components in a chain

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { trimMessages } from "@langchain/core/messages";

const llm = new ChatOpenAI({ model: "gpt-4o" });

// Notice we don&#x27;t pass in messages. This creates
// a RunnableLambda that takes messages as input
const trimmer = trimMessages({
  maxTokens: 45,
  strategy: "last",
  tokenCounter: llm,
  includeSystem: true,
});

const chain = trimmer.pipe(llm);
await chain.invoke(messages);

```

```text
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;Thanks! I do try to keep things light. But for a more serious answer, "LangChain" is likely named to reflect its focus on language processing and the way it connects different components or models together—essentially forming a "chain" of linguistic operations. The "Lang" part emphasizes its focus on language, while "Chain" highlights the interconnected workflows it aims to facilitate.&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: { function_call: undefined, tool_calls: undefined },
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;Thanks! I do try to keep things light. But for a more serious answer, "LangChain" is likely named to reflect its focus on language processing and the way it connects different components or models together—essentially forming a "chain" of linguistic operations. The "Lang" part emphasizes its focus on language, while "Chain" highlights the interconnected workflows it aims to facilitate.&#x27;,
  name: undefined,
  additional_kwargs: { function_call: undefined, tool_calls: undefined },
  response_metadata: {
    tokenUsage: { completionTokens: 77, promptTokens: 59, totalTokens: 136 },
    finish_reason: &#x27;stop&#x27;
  },
  id: undefined,
  tool_calls: [],
  invalid_tool_calls: [],
  usage_metadata: { input_tokens: 59, output_tokens: 77, total_tokens: 136 }
}

```Looking at [the LangSmith trace](https://smith.langchain.com/public/3793312c-a74b-4e77-92b4-f91b3d74ac5f/r) we can see that before the messages are passed to the model they are first trimmed.Looking at just the trimmer, we can see that it’s a Runnable object that can be invoked like all Runnables:

```typescript
await trimmer.invoke(messages);

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "you&#x27;re a good assistant, you always respond with a joke.",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: "you&#x27;re a good assistant, you always respond with a joke.",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;Hmmm let me think.\n&#x27; +
        &#x27;\n&#x27; +
        "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;Hmmm let me think.\n&#x27; +
      &#x27;\n&#x27; +
      "Why, he&#x27;s probably chasing after the last cup of coffee in the office!",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined,
    tool_calls: [],
    invalid_tool_calls: [],
    usage_metadata: undefined
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;what do you call a speechless parrot&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;what do you call a speechless parrot&#x27;,
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined
  }
]

``` ## Using with ChatMessageHistory[​](#using-with-chatmessagehistory) Trimming messages is especially useful when [working with chat histories](/docs/how_to/message_history/), which can get arbitrarily long:

```typescript
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { HumanMessage, trimMessages } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

const chatHistory = new InMemoryChatMessageHistory(messages.slice(0, -1));

const dummyGetSessionHistory = async (sessionId: string) => {
  if (sessionId !== "1") {
    throw new Error("Session not found");
  }
  return chatHistory;
};

const llm = new ChatOpenAI({ model: "gpt-4o" });

const trimmer = trimMessages({
  maxTokens: 45,
  strategy: "last",
  tokenCounter: llm,
  includeSystem: true,
});

const chain = trimmer.pipe(llm);
const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: dummyGetSessionHistory,
});
await chainWithHistory.invoke(
  [new HumanMessage("what do you call a speechless parrot")],
  { configurable: { sessionId: "1" } }
);

```

```text
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;A "polly-no-want-a-cracker"!&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: { function_call: undefined, tool_calls: undefined },
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;A "polly-no-want-a-cracker"!&#x27;,
  name: undefined,
  additional_kwargs: { function_call: undefined, tool_calls: undefined },
  response_metadata: {
    tokenUsage: { completionTokens: 11, promptTokens: 57, totalTokens: 68 },
    finish_reason: &#x27;stop&#x27;
  },
  id: undefined,
  tool_calls: [],
  invalid_tool_calls: [],
  usage_metadata: { input_tokens: 57, output_tokens: 11, total_tokens: 68 }
}

```Looking at [the LangSmith trace](https://smith.langchain.com/public/cfc76880-5895-4852-b7d0-12916448bdb2/r) we can see that we retrieve all of our messages but before the messages are passed to the model they are trimmed to be just the system message and last human message. ## API reference[​](#api-reference) For a complete description of all arguments head to the [API reference](https://api.js.langchain.com/functions/langchain_core.messages.trimMessages.html). #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Getting the last maxTokens tokens](#getting-the-last-maxtokens-tokens)
- [Getting the first maxTokens tokens](#getting-the-first-maxtokens-tokens)
- [Writing a custom token counter](#writing-a-custom-token-counter)
- [Chaining](#chaining)
- [Using with ChatMessageHistory](#using-with-chatmessagehistory)
- [API reference](#api-reference)

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