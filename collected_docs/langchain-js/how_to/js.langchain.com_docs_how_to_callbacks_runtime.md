How to pass callbacks in at runtime | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to pass callbacks in at runtimePrerequisitesThis guide assumes familiarity with the following concepts:Callbacks](/docs/concepts/callbacks)

In many cases, it is advantageous to pass in handlers instead when running the object. When we pass through [CallbackHandlers](https://api.js.langchain.com/interfaces/langchain_core.callbacks_base.CallbackHandlerMethods.html) using the `callbacks` keyword arg when executing an run, those callbacks will be issued by all nested objects involved in the execution. For example, when a handler is passed through to an Agent, it will be used for all callbacks related to the agent and all the objects involved in the agent’s execution, in this case, the Tools and LLM.

This prevents us from having to manually attach the handlers to each individual nested object. Here’s an example using LangChain’s built-in [ConsoleCallbackHandler](https://api.js.langchain.com/classes/langchain_core.tracers_console.ConsoleCallbackHandler.html):

```typescript
import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatAnthropic } from "@langchain/anthropic";

const handler = new ConsoleCallbackHandler();

const prompt = ChatPromptTemplate.fromTemplate(`What is 1 + {number}?`);
const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
});

const chain = prompt.pipe(model);

await chain.invoke({ number: "2" }, { callbacks: [handler] });

```

```text
[chain/start] [1:chain:RunnableSequence] Entering Chain run with input: {
  "number": "2"
}
[chain/start] [1:chain:RunnableSequence > 2:prompt:ChatPromptTemplate] Entering Chain run with input: {
  "number": "2"
}
[chain/end] [1:chain:RunnableSequence > 2:prompt:ChatPromptTemplate] [1ms] Exiting Chain run with output: {
  "lc": 1,
  "type": "constructor",
  "id": [
    "langchain_core",
    "prompt_values",
    "ChatPromptValue"
  ],
  "kwargs": {
    "messages": [
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
  }
}
[llm/start] [1:chain:RunnableSequence > 3:llm:ChatAnthropic] Entering LLM run with input: {
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
[llm/end] [1:chain:RunnableSequence > 3:llm:ChatAnthropic] [766ms] Exiting LLM run with output: {
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
              "id": "msg_01SGGkFVbUbH4fK7JS7agerD",
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
              "id": "msg_01SGGkFVbUbH4fK7JS7agerD",
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
    "id": "msg_01SGGkFVbUbH4fK7JS7agerD",
    "model": "claude-3-sonnet-20240229",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 16,
      "output_tokens": 13
    },
    "stop_reason": "end_turn"
  }
}
[chain/end] [1:chain:RunnableSequence] [778ms] Exiting Chain run with output: {
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
      "id": "msg_01SGGkFVbUbH4fK7JS7agerD",
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
      "id": "msg_01SGGkFVbUbH4fK7JS7agerD",
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

```

```text
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: "1 + 2 = 3",
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: {
      id: "msg_01SGGkFVbUbH4fK7JS7agerD",
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
    id: "msg_01SGGkFVbUbH4fK7JS7agerD",
    type: "message",
    role: "assistant",
    model: "claude-3-sonnet-20240229",
    stop_sequence: null,
    usage: { input_tokens: 16, output_tokens: 13 },
    stop_reason: "end_turn"
  },
  response_metadata: {
    id: "msg_01SGGkFVbUbH4fK7JS7agerD",
    model: "claude-3-sonnet-20240229",
    stop_sequence: null,
    usage: { input_tokens: 16, output_tokens: 13 },
    stop_reason: "end_turn"
  },
  tool_calls: [],
  invalid_tool_calls: []
}

```If there are already existing callbacks associated with a module, these will run in addition to any passed in at runtime.

## Next steps[​](#next-steps)

You’ve now learned how to pass callbacks at runtime.

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