ChatBedrockConverse | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatBedrockConverseAmazon Bedrock Converse](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html) is a fully managed service that makes Foundation Models (FMs) from leading AI startups and Amazon available via an API. You can choose from a wide range of FMs to find the model that is best suited for your use case. It provides a unified conversational interface for Bedrock models, but does not yet have feature parity for all functionality within the older [Bedrock model service](/docs/integrations/chat/bedrock).This will help you getting started with Amazon Bedrock Converse [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatBedrockConverse features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_aws.ChatBedrockConverse.html). ## Overview[​](#overview) ### Integration details[​](#integration-details) ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/bedrock/#beta-bedrock-converse-api)Package downloadsPackage latest[ChatBedrockConverse](https://api.js.langchain.com/classes/langchain_aws.ChatBedrockConverse.html)[@langchain/aws](https://npmjs.com/@langchain/aws)❌✅✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/aws?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/aws?style=flat-square&label=%20&.png) ### Model features[​](#model-features) See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌✅❌❌✅✅❌ ## Setup[​](#setup) To access Bedrock models you’ll need to create an AWS account, set up the Bedrock API service, get an access key ID and secret key, and install the @langchain/community integration package. ### Credentials[​](#credentials) Head to the [AWS docs](https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html) to sign up for AWS and setup your credentials. You’ll also need to turn on model access for your account, which you can do by [following these instructions](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html).If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

``` ### Installation[​](#installation) The LangChain ChatBedrockConverse integration lives in the @langchain/aws package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/aws @langchain/core

```

```bash
yarn add @langchain/aws @langchain/core

```

```bash
pnpm add @langchain/aws @langchain/core

``` ## Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions.

There are a few different ways to authenticate with AWS - the below examples rely on an access key, secret access key and region set in your environment variables:

```typescript
import { ChatBedrockConverse } from "@langchain/aws";

const llm = new ChatBedrockConverse({
  model: "anthropic.claude-3-5-sonnet-20240620-v1:0",
  region: process.env.BEDROCK_AWS_REGION,
  credentials: {
    accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
  },
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
  "id": "f5dc5791-224e-4fe5-ba2e-4cc51d9e7795",
  "content": "J&#x27;adore la programmation.",
  "additional_kwargs": {},
  "response_metadata": {
    "$metadata": {
      "httpStatusCode": 200,
      "requestId": "f5dc5791-224e-4fe5-ba2e-4cc51d9e7795",
      "attempts": 1,
      "totalRetryDelay": 0
    },
    "metrics": {
      "latencyMs": 584
    },
    "stopReason": "end_turn",
    "usage": {
      "inputTokens": 29,
      "outputTokens": 11,
      "totalTokens": 40
    }
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 29,
    "output_tokens": 11,
    "total_tokens": 40
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
  "id": "c6401e11-8f85-4a71-8e15-4856d55aef78",
  "content": "Here&#x27;s the German translation:\n\nIch liebe Programmieren.",
  "additional_kwargs": {},
  "response_metadata": {
    "$metadata": {
      "httpStatusCode": 200,
      "requestId": "c6401e11-8f85-4a71-8e15-4856d55aef78",
      "attempts": 1,
      "totalRetryDelay": 0
    },
    "metrics": {
      "latencyMs": 760
    },
    "stopReason": "end_turn",
    "usage": {
      "inputTokens": 23,
      "outputTokens": 18,
      "totalTokens": 41
    }
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 23,
    "output_tokens": 18,
    "total_tokens": 41
  }
}

``` ## Tool calling[​](#tool-calling) Tool calling with Bedrock models works in a similar way to [other models](/docs/how_to/tool_calling), but note that not all Bedrock models support tool calling. Please refer to the [AWS model documentation](https://docs.aws.amazon.com/bedrock/latest/APIReference/welcome.html) for more information.

## API reference[​](#api-reference)

For detailed documentation of all `ChatBedrockConverse` features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_aws.ChatBedrockConverse.html](https://api.js.langchain.com/classes/langchain_aws.ChatBedrockConverse.html)

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
- [Tool calling](#tool-calling)
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