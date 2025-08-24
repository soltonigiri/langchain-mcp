How to track token usage | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to track token usagePrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)

This notebook goes over how to track your token usage for specific calls.

## Using AIMessage.usage_metadata[​](#using-aimessageusage_metadata)

A number of model providers return token usage information as part of the chat generation response. When available, this information will be included on the `AIMessage` objects produced by the corresponding model.

LangChain `AIMessage` objects include a [usage_metadata](https://api.js.langchain.com/classes/langchain_core.messages.AIMessage.html#usage_metadata) attribute for supported providers. When populated, this attribute will be an object with standard keys (e.g., "input_tokens" and "output_tokens").

#### OpenAI[​](#openai)

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- Yarn
- pnpm

```bash
npm install @langchain/openai @langchain/core

```

```bash
yarn add @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/core

```

```typescript
import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI({
  model: "gpt-3.5-turbo-0125",
});

const res = await chatModel.invoke("Tell me a joke.");

console.log(res.usage_metadata);

/*
  { input_tokens: 12, output_tokens: 17, total_tokens: 29 }
*/

``` #### API Reference: - ChatOpenAI from @langchain/openai #### Anthropic[​](#anthropic) - npm - Yarn - pnpm

```bash
npm install @langchain/anthropic @langchain/core

```

```bash
yarn add @langchain/anthropic @langchain/core

```

```bash
pnpm add @langchain/anthropic @langchain/core

```

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const chatModel = new ChatAnthropic({
  model: "claude-3-haiku-20240307",
});

const res = await chatModel.invoke("Tell me a joke.");

console.log(res.usage_metadata);

/*
  { input_tokens: 12, output_tokens: 98, total_tokens: 110 }
*/

``` #### API Reference: - ChatAnthropic from @langchain/anthropic ## Using AIMessage.response_metadata[​](#using-aimessageresponse_metadata) A number of model providers return token usage information as part of the chat generation response. When available, this is included in the `AIMessage.response_metadata` field.

#### OpenAI[​](#openai-1)

```typescript
import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
});

const res = await chatModel.invoke("Tell me a joke.");

console.log(res.response_metadata);

/*
  {
    tokenUsage: { completionTokens: 15, promptTokens: 12, totalTokens: 27 },
    finish_reason: &#x27;stop&#x27;
  }
*/

```

#### API Reference: - ChatOpenAI from @langchain/openai #### Anthropic[​](#anthropic-1)

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const chatModel = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
});

const res = await chatModel.invoke("Tell me a joke.");

console.log(res.response_metadata);

/*
  {
    id: &#x27;msg_017Mgz6HdgNbi3cwL1LNB9Dw&#x27;,
    model: &#x27;claude-3-sonnet-20240229&#x27;,
    stop_sequence: null,
    usage: { input_tokens: 12, output_tokens: 30 },
    stop_reason: &#x27;end_turn&#x27;
  }
*/

``` #### API Reference: - ChatAnthropic from @langchain/anthropic ## Streaming[​](#streaming) Some providers support token count metadata in a streaming context.

#### OpenAI[​](#openai-2)

For example, OpenAI will return a message chunk at the end of a stream with token usage information. This behavior is supported by `@langchain/openai` >= 0.1.0 and can be enabled by passing a `stream_options` parameter when making your call.

infoBy default, the last message chunk in a stream will include a `finish_reason` in the message&#x27;s `response_metadata` attribute. If we include token usage in streaming mode, an additional chunk containing usage metadata will be added to the end of the stream, such that `finish_reason` appears on the second to last message chunk.

```typescript
import type { AIMessageChunk } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { concat } from "@langchain/core/utils/stream";

// Instantiate the model
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});

const response = await model.stream("Hello, how are you?", {
  // Pass the stream options
  stream_options: {
    include_usage: true,
  },
});

// Iterate over the response, only saving the last chunk
let finalResult: AIMessageChunk | undefined;
for await (const chunk of response) {
  if (finalResult) {
    finalResult = concat(finalResult, chunk);
  } else {
    finalResult = chunk;
  }
}

console.log(finalResult?.usage_metadata);

/*
  { input_tokens: 13, output_tokens: 30, total_tokens: 43 }
*/

```

#### API Reference: - AIMessageChunk from @langchain/core/messages - ChatOpenAI from @langchain/openai - concat from @langchain/core/utils/stream ## Using callbacks[​](#using-callbacks) You can also use the `handleLLMEnd` callback to get the full output from the LLM, including token usage for supported models. Here&#x27;s an example of how you could do that:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  callbacks: [
    {
      handleLLMEnd(output) {
        console.log(JSON.stringify(output, null, 2));
      },
    },
  ],
});

await chatModel.invoke("Tell me a joke.");

/*
  {
    "generations": [
      [
        {
          "text": "Why did the scarecrow win an award?\n\nBecause he was outstanding in his field!",
          "message": {
            "lc": 1,
            "type": "constructor",
            "id": [
              "langchain_core",
              "messages",
              "AIMessage"
            ],
            "kwargs": {
              "content": "Why did the scarecrow win an award?\n\nBecause he was outstanding in his field!",
              "tool_calls": [],
              "invalid_tool_calls": [],
              "additional_kwargs": {},
              "response_metadata": {
                "tokenUsage": {
                  "completionTokens": 17,
                  "promptTokens": 12,
                  "totalTokens": 29
                },
                "finish_reason": "stop"
              }
            }
          },
          "generationInfo": {
            "finish_reason": "stop"
          }
        }
      ]
    ],
    "llmOutput": {
      "tokenUsage": {
        "completionTokens": 17,
        "promptTokens": 12,
        "totalTokens": 29
      }
    }
  }
*/

```

#### API Reference: - ChatOpenAI from @langchain/openai ## Next steps[​](#next-steps) You&#x27;ve now seen a few examples of how to track chat model token usage for supported providers.

Next, check out the other how-to guides on chat models in this section, like [how to get a model to return structured output](/docs/how_to/structured_output) or [how to add caching to your chat models](/docs/how_to/chat_model_caching).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Using AIMessage.usage_metadata](#using-aimessageusage_metadata)
- [Using AIMessage.response_metadata](#using-aimessageresponse_metadata)
- [Streaming](#streaming)
- [Using callbacks](#using-callbacks)
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