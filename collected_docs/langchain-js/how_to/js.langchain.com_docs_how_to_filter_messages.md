How to filter messages | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to filter messagesThe filterMessages function is available in @langchain/core version 0.2.8 and above.In more complex chains and agents we might track state with a list of messages. This list can start to accumulate messages from multiple different models, speakers, sub-chains, etc., and we may only want to pass subsets of this full list of messages to each model call in the chain/agent.The filterMessages utility makes it easy to filter messages by type, id, or name.Basic usage​](#basic-usage)

```typescript
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  filterMessages,
} from "@langchain/core/messages";

const messages = [
  new SystemMessage({ content: "you are a good assistant", id: "1" }),
  new HumanMessage({ content: "example input", id: "2", name: "example_user" }),
  new AIMessage({
    content: "example output",
    id: "3",
    name: "example_assistant",
  }),
  new HumanMessage({ content: "real input", id: "4", name: "bob" }),
  new AIMessage({ content: "real output", id: "5", name: "alice" }),
];

filterMessages(messages, { includeTypes: ["human"] });

```

```text
[
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;example input&#x27;,
      id: &#x27;2&#x27;,
      name: &#x27;example_user&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;example input&#x27;,
    name: &#x27;example_user&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;2&#x27;
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;real input&#x27;,
      id: &#x27;4&#x27;,
      name: &#x27;bob&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;real input&#x27;,
    name: &#x27;bob&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;4&#x27;
  }
]

```

```typescript
filterMessages(messages, {
  excludeNames: ["example_user", "example_assistant"],
});

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;you are a good assistant&#x27;,
      id: &#x27;1&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;you are a good assistant&#x27;,
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;1&#x27;
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;real input&#x27;,
      id: &#x27;4&#x27;,
      name: &#x27;bob&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;real input&#x27;,
    name: &#x27;bob&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;4&#x27;
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;real output&#x27;,
      id: &#x27;5&#x27;,
      name: &#x27;alice&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;real output&#x27;,
    name: &#x27;alice&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;5&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    usage_metadata: undefined
  }
]

```

```typescript
filterMessages(messages, {
  includeTypes: [HumanMessage, AIMessage],
  excludeIds: ["3"],
});

```

```text
[
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;example input&#x27;,
      id: &#x27;2&#x27;,
      name: &#x27;example_user&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;example input&#x27;,
    name: &#x27;example_user&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;2&#x27;
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;real input&#x27;,
      id: &#x27;4&#x27;,
      name: &#x27;bob&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;real input&#x27;,
    name: &#x27;bob&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;4&#x27;
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;real output&#x27;,
      id: &#x27;5&#x27;,
      name: &#x27;alice&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;real output&#x27;,
    name: &#x27;alice&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;5&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    usage_metadata: undefined
  }
]

``` ## Chaining[​](#chaining) filterMessages can be used in an imperatively (like above) or declaratively, making it easy to compose with other components in a chain:

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const llm = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
  temperature: 0,
});
// Notice we don&#x27;t pass in messages. This creates
// a RunnableLambda that takes messages as input
const filter_ = filterMessages({
  excludeNames: ["example_user", "example_assistant"],
  end,
});
const chain = filter_.pipe(llm);
await chain.invoke(messages);

```

```text
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: [],
    additional_kwargs: {
      id: &#x27;msg_01S2LQc1NLhtPHurW3jNRsCK&#x27;,
      type: &#x27;message&#x27;,
      role: &#x27;assistant&#x27;,
      model: &#x27;claude-3-sonnet-20240229&#x27;,
      stop_reason: &#x27;end_turn&#x27;,
      stop_sequence: null,
      usage: [Object]
    },
    tool_calls: [],
    usage_metadata: { input_tokens: 16, output_tokens: 3, total_tokens: 19 },
    invalid_tool_calls: [],
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: [],
  name: undefined,
  additional_kwargs: {
    id: &#x27;msg_01S2LQc1NLhtPHurW3jNRsCK&#x27;,
    type: &#x27;message&#x27;,
    role: &#x27;assistant&#x27;,
    model: &#x27;claude-3-sonnet-20240229&#x27;,
    stop_reason: &#x27;end_turn&#x27;,
    stop_sequence: null,
    usage: { input_tokens: 16, output_tokens: 3 }
  },
  response_metadata: {
    id: &#x27;msg_01S2LQc1NLhtPHurW3jNRsCK&#x27;,
    model: &#x27;claude-3-sonnet-20240229&#x27;,
    stop_reason: &#x27;end_turn&#x27;,
    stop_sequence: null,
    usage: { input_tokens: 16, output_tokens: 3 }
  },
  id: undefined,
  tool_calls: [],
  invalid_tool_calls: [],
  usage_metadata: { input_tokens: 16, output_tokens: 3, total_tokens: 19 }
}

```Looking at [the LangSmith trace](https://smith.langchain.com/public/a48c7935-04a8-4e87-9893-b14064ddbfc4/r) we can see that before the messages are passed to the model they are filtered.Looking at just the filter_, we can see that it’s a Runnable object that can be invoked like all Runnables:

```typescript
await filter_.invoke(messages);

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;you are a good assistant&#x27;,
      id: &#x27;1&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;you are a good assistant&#x27;,
    name: undefined,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;1&#x27;
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;real input&#x27;,
      id: &#x27;4&#x27;,
      name: &#x27;bob&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;real input&#x27;,
    name: &#x27;bob&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;4&#x27;
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;real output&#x27;,
      id: &#x27;5&#x27;,
      name: &#x27;alice&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;real output&#x27;,
    name: &#x27;alice&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: &#x27;5&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    usage_metadata: undefined
  }
]

``` ## API reference[​](#api-reference) For a complete description of all arguments head to the [API reference](https://api.js.langchain.com/functions/langchain_core.messages.filterMessages.html). #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Basic usage](#basic-usage)
- [Chaining](#chaining)
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