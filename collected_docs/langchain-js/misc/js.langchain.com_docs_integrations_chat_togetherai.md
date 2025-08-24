ChatTogetherAI | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatTogetherAITogether AI](https://www.together.ai/) offers an API to query [50+ leading open-source models](https://docs.together.ai/docs/inference-models) in a couple lines of code.This guide will help you getting started with ChatTogetherAI [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatTogetherAI features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_community_chat_models_togetherai.ChatTogetherAI.html). ## Overview[​](#overview) ### Integration details[​](#integration-details) ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/togetherai)Package downloadsPackage latest[ChatTogetherAI](https://api.js.langchain.com/classes/langchain_community_chat_models_togetherai.ChatTogetherAI.html)[@langchain/community](https://www.npmjs.com/package/@langchain/community)❌✅✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/community?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/community?style=flat-square&label=%20&.png) ### Model features[​](#model-features) See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅✅✅✅✅✅✅ ## Setup[​](#setup) To access ChatTogetherAI models you’ll need to create a Together account, get an API key [here](https://api.together.xyz/), and install the @langchain/community integration package. ### Credentials[​](#credentials) Head to [api.together.ai](https://api.together.ai/) to sign up to TogetherAI and generate an API key. Once you’ve done this set the TOGETHER_AI_API_KEY environment variable:

```bash
export TOGETHER_AI_API_KEY="your-api-key"

```If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

``` ### Installation[​](#installation) The LangChain ChatTogetherAI integration lives in the @langchain/community package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/community @langchain/core

```

```bash
yarn add @langchain/community @langchain/core

```

```bash
pnpm add @langchain/community @langchain/core

``` ## Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";

const llm = new ChatTogetherAI({
  model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  temperature: 0,
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
aiMsg;

```

```text
AIMessage {
  "id": "chatcmpl-9rT9qEDPZ6iLCk6jt3XTzVDDH6pcI",
  "content": "J&#x27;adore la programmation.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 8,
      "promptTokens": 31,
      "totalTokens": 39
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 31,
    "output_tokens": 8,
    "total_tokens": 39
  }
}

```

```typescript
console.log(aiMsg.content);

```

```text
J&#x27;adore la programmation.

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
  "id": "chatcmpl-9rT9wolZWfJ3xovORxnkdf1rcPbbY",
  "content": "Ich liebe das Programmieren.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 6,
      "promptTokens": 26,
      "totalTokens": 32
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 26,
    "output_tokens": 6,
    "total_tokens": 32
  }
}

```Behind the scenes, TogetherAI uses the OpenAI SDK and OpenAI compatible API, with some caveats:

## API reference[​](#api-reference)

For detailed documentation of all ChatTogetherAI features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_community_chat_models_togetherai.ChatTogetherAI.html](https://api.js.langchain.com/classes/langchain_community_chat_models_togetherai.ChatTogetherAI.html)

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