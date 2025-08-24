How to attach runtime configuration to a Runnable | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to attach runtime configuration to a RunnablePrerequisitesThis guide assumes familiarity with the following concepts:LangChain Expression Language (LCEL)](/docs/concepts/lcel)
- [Chaining runnables](/docs/how_to/sequence/)
- [Tool calling](/docs/how_to/tool_calling/)

Sometimes we want to invoke a [Runnable](https://api.js.langchain.com/classes/langchain_core.runnables.Runnable.html) with predefined configuration that doesn’t need to be assigned by the caller. We can use the [Runnable.withConfig()](https://api.js.langchain.com/classes/langchain_core.runnables.Runnable.html#withConfig) method to set these arguments ahead of time.

## Binding stop sequences[​](#binding-stop-sequences)

Suppose we have a simple prompt + model chain:

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/openai @langchain/core

```

```bash
yarn add @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/core

```

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Write out the following equation using algebraic symbols then solve it. Use the format\n\nEQUATION:...\nSOLUTION:...\n\n",
  ],
  ["human", "{equation_statement}"],
]);

const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });

const runnable = prompt.pipe(model).pipe(new StringOutputParser());

const res = await runnable.invoke({
  equation_statement: "x raised to the third plus seven equals 12",
});

console.log(res);

```

```text
EQUATION: x^3 + 7 = 12

SOLUTION:
Subtract 7 from both sides:
x^3 = 5

Take the cube root of both sides:
x = ∛5

```In certain prompting techniques it can be useful to set one or more `stop` words that halt generation when they are emitted by the model. When using the model directly we set `stop` words via the extra `options` argument passed to `invoke`. For example, what if we wanted to modify the example to work as an equation formatter utility? We could instruct the generation process to stop at the word `SOLUTION`, and the resulting output would be only the formatted equation.

In this case we are using our model as part of a [RunnableSequence](https://api.js.langchain.com/classes/langchain_core.runnables.RunnableSequence.html). Rather than relying on the preceeding step to output config that contains stop words, we can simply bind the necessary config using `withConfig` while creating the `RunnableSequence`:

```typescript
// stop generating after the equation is written
const equationFormatter = prompt
  .pipe(model.withConfig({ stop: ["SOLUTION"] }))
  .pipe(new StringOutputParser());

// generate only the equation, without needing to set the stop word
const formattedEquation = await equationFormatter.invoke({
  equation_statement: "x raised to the third plus seven equals 12",
});

console.log(formattedEquation);

```

```text
EQUATION: x^3 + 7 = 12

```This makes the resulting `Runnable` pipeline easier to consume. The caller doesn’t need to know the exact prompting format used, nor do they need to specify the stop word upon invocation. They can simply run their query and get back the result they expect.

## Attaching OpenAI tools[​](#attaching-openai-tools)

Another common use-case is tool calling. While you should generally use the [.bindTools()](/docs/how_to/tool_calling/) method for tool-calling models, you can also bind provider-specific args directly if you want lower level control:

```typescript
const tools = [
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  },
];

const modelWithTools = new ChatOpenAI({ model: "gpt-4o" }).withConfig({
  tools,
});

await modelWithTools.invoke("What&#x27;s the weather in SF, NYC and LA?");

```

```text
AIMessage {
  "id": "chatcmpl-BXjkosti03tvSmaxAuYtpRvbEkhRx",
  "content": "",
  "additional_kwargs": {
    "tool_calls": [
      {
        "id": "call_a15PVBt9g3eCHULn7DBRbL9a",
        "type": "function",
        "function": "[Object]"
      },
      {
        "id": "call_bQrHLyJ6fAaNkEPNBtgYfIFb",
        "type": "function",
        "function": "[Object]"
      },
      {
        "id": "call_FxRswXKWou53G0LNQQCvPod4",
        "type": "function",
        "function": "[Object]"
      }
    ]
  },
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 82,
      "completionTokens": 71,
      "totalTokens": 153
    },
    "finish_reason": "tool_calls",
    "model_name": "gpt-4o-2024-08-06",
    "usage": {
      "prompt_tokens": 82,
      "completion_tokens": 71,
      "total_tokens": 153,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_90122d973c"
  },
  "tool_calls": [
    {
      "name": "get_current_weather",
      "args": {
        "location": "San Francisco, CA"
      },
      "type": "tool_call",
      "id": "call_a15PVBt9g3eCHULn7DBRbL9a"
    },
    {
      "name": "get_current_weather",
      "args": {
        "location": "New York, NY"
      },
      "type": "tool_call",
      "id": "call_bQrHLyJ6fAaNkEPNBtgYfIFb"
    },
    {
      "name": "get_current_weather",
      "args": {
        "location": "Los Angeles, CA"
      },
      "type": "tool_call",
      "id": "call_FxRswXKWou53G0LNQQCvPod4"
    }
  ],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 71,
    "input_tokens": 82,
    "total_tokens": 153,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

``` ## Next steps[​](#next-steps) You now know how to bind runtime arguments to a Runnable.

Next, you might be interested in our how-to guides on [passing data through a chain](/docs/how_to/passthrough/).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Binding stop sequences](#binding-stop-sequences)
- [Attaching OpenAI tools](#attaching-openai-tools)
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