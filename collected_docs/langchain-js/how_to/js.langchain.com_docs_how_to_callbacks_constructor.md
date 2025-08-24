How to pass callbacks into a module constructor | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to pass callbacks into a module constructorPrerequisitesThis guide assumes familiarity with the following concepts:Callbacks](/docs/concepts/callbacks)

Most LangChain modules allow you to pass `callbacks` directly into the constructor. In this case, the callbacks will only be called for that instance (and any nested runs).

Here’s an example using LangChain’s built-in [ConsoleCallbackHandler](https://api.js.langchain.com/classes/langchain_core.tracers_console.ConsoleCallbackHandler.html):

```typescript
import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatAnthropic } from "@langchain/anthropic";

const handler = new ConsoleCallbackHandler();

const prompt = ChatPromptTemplate.fromTemplate(`What is 1 + {number}?`);
const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
  callbacks: [handler],
});

const chain = prompt.pipe(model);

await chain.invoke({ number: "2" });

```

```text
[llm/start] [1:llm:ChatAnthropic] Entering LLM run with input: {
  "messages": [
    [
      {
        "lc": 1,
        "type": "constructor",
        "id": [
          "langchain_core",
          "messages",
          "HumanMessage"
        ],
        "kwargs": {
          "content": "What is 1 + 2?",
          "additional_kwargs": {},
          "response_metadata": {}
        }
      }
    ]
  ]
}
[llm/end] [1:llm:ChatAnthropic] [1.00s] Exiting LLM run with output: {
  "generations": [
    [
      {
        "text": "1 + 2 = 3",
        "message": {
          "lc": 1,
          "type": "constructor",
          "id": [
            "langchain_core",
            "messages",
            "AIMessage"
          ],
          "kwargs": {
            "content": "1 + 2 = 3",
            "tool_calls": [],
            "invalid_tool_calls": [],
            "additional_kwargs": {
              "id": "msg_011Z1cgi3gyNGxT55wnRNkXq",
              "type": "message",
              "role": "assistant",
              "model": "claude-3-sonnet-20240229",
              "stop_sequence": null,
              "usage": {
                "input_tokens": 16,
                "output_tokens": 13
              },
              "stop_reason": "end_turn"
            },
            "response_metadata": {
              "id": "msg_011Z1cgi3gyNGxT55wnRNkXq",
              "model": "claude-3-sonnet-20240229",
              "stop_sequence": null,
              "usage": {
                "input_tokens": 16,
                "output_tokens": 13
              },
              "stop_reason": "end_turn"
            }
          }
        }
      }
    ]
  ],
  "llmOutput": {
    "id": "msg_011Z1cgi3gyNGxT55wnRNkXq",
    "model": "claude-3-sonnet-20240229",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 16,
      "output_tokens": 13
    },
    "stop_reason": "end_turn"
  }
}

```

```text
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: "1 + 2 = 3",
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: {
      id: "msg_011Z1cgi3gyNGxT55wnRNkXq",
      type: "message",
      role: "assistant",
      model: "claude-3-sonnet-20240229",
      stop_sequence: null,
      usage: { input_tokens: 16, output_tokens: 13 },
      stop_reason: "end_turn"
    },
    response_metadata: {}
  },
  lc_namespace: [ "langchain_core", "messages" ],
  content: "1 + 2 = 3",
  name: undefined,
  additional_kwargs: {
    id: "msg_011Z1cgi3gyNGxT55wnRNkXq",
    type: "message",
    role: "assistant",
    model: "claude-3-sonnet-20240229",
    stop_sequence: null,
    usage: { input_tokens: 16, output_tokens: 13 },
    stop_reason: "end_turn"
  },
  response_metadata: {
    id: "msg_011Z1cgi3gyNGxT55wnRNkXq",
    model: "claude-3-sonnet-20240229",
    stop_sequence: null,
    usage: { input_tokens: 16, output_tokens: 13 },
    stop_reason: "end_turn"
  },
  tool_calls: [],
  invalid_tool_calls: []
}

```You can see that we only see events from the chat model run - none from the prompt or broader chain.

## Next steps[​](#next-steps)

You’ve now learned how to pass callbacks into a constructor.

Next, check out the other how-to guides in this section, such as how to create your own [custom callback handlers](/docs/how_to/custom_callbacks).

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