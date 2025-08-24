ChatXAI | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatXAIxAI](https://x.ai/) is an artificial intelligence company that develops large language models (LLMs). Their flagship model, Grok, is trained on real-time X (formerly Twitter) data and aims to provide witty, personality-rich responses while maintaining high capability on technical tasks.This guide will help you getting started with ChatXAI [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatXAI features and configurations head to the [API reference](https://api.js.langchain.com/classes/_langchain_xai.ChatXAI.html). ## Overview[​](#overview) ### Integration details[​](#integration-details) ClassPackageLocalSerializablePY supportPackage downloadsPackage latest[ChatXAI](https://api.js.langchain.com/classes/_langchain_xai.ChatXAI.html)[@langchain/xai](https://www.npmjs.com/package/@langchain/xai)❌✅❌![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/xai?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/xai?style=flat-square&label=%20&.png) ### Model features[​](#model-features) See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅❌❌❌✅✅✅ ## Setup[​](#setup) To access ChatXAI models you’ll need to create an xAI account, [get an API key](https://console.x.ai/), and install the @langchain/xai integration package. ### Credentials[​](#credentials) Head to [the xAI website](https://x.ai) to sign up to xAI and generate an API key. Once you’ve done this set the XAI_API_KEY environment variable:

```bash
export XAI_API_KEY="your-api-key"

```If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

``` ### Installation[​](#installation) The LangChain ChatXAI integration lives in the @langchain/xai package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/xai @langchain/core

```

```bash
yarn add @langchain/xai @langchain/core

```

```bash
pnpm add @langchain/xai @langchain/core

``` ## Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatXAI } from "@langchain/xai";

const llm = new ChatXAI({
  model: "grok-beta", // default
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  // other params...
});

```

## Invocation[​](#invocation)

```typescript
const aiMsg = await llm.invoke([
  [
    "system",
    "You are a helpful assistant that translates English to French. Translate the user sentence.",
  ],
  ["human", "I love programming."],
]);
console.log(aiMsg);

```

```text
AIMessage {
  "id": "71d7e3d8-30dd-472c-8038-b6b283dcee63",
  "content": "J&#x27;adore programmer.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 30,
      "completionTokens": 6,
      "totalTokens": 36
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 30,
      "completion_tokens": 6,
      "total_tokens": 36
    },
    "system_fingerprint": "fp_3e3898d4ce"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 6,
    "input_tokens": 30,
    "total_tokens": 36,
    "input_token_details": {},
    "output_token_details": {}
  }
}

```

```typescript
console.log(aiMsg.content);

```

```text
J&#x27;adore programmer.

``` ## Chaining[​](#chaining) We can [chain](/docs/how_to/sequence/) our model with a prompt template like so:

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant that translates {input_language} to {output_language}.",
  ],
  ["human", "{input}"],
]);

const chain = prompt.pipe(llm);
await chain.invoke({
  input_language: "English",
  output_language: "German",
  input: "I love programming.",
});

```

```text
AIMessage {
  "id": "b2738008-8247-40e1-81dc-d9bf437a1a0c",
  "content": "Ich liebe das Programmieren.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 25,
      "completionTokens": 7,
      "totalTokens": 32
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 25,
      "completion_tokens": 7,
      "total_tokens": 32
    },
    "system_fingerprint": "fp_3e3898d4ce"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 7,
    "input_tokens": 25,
    "total_tokens": 32,
    "input_token_details": {},
    "output_token_details": {}
  }
}

```Behind the scenes, xAI uses the OpenAI SDK and OpenAI compatible API.

## API reference[​](#api-reference)

For detailed documentation of all ChatXAI features and configurations head to the API reference: [https://api.js.langchain.com/classes/\_langchain_xai.ChatXAI.html](https://api.js.langchain.com/classes/%5C_langchain_xai.ChatXAI.html)

## Related[​](#related)

- Chat model [conceptual guide](/docs/concepts/#chat-models)
- Chat model [how-to guides](/docs/how_to/#chat-models)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Chaining](#chaining)
- [API reference](#api-reference)
- [Related](#related)

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