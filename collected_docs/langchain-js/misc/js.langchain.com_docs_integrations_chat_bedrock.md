BedrockChat | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageBedrockChatAmazon Bedrock](https://aws.amazon.com/bedrock/) is a fully managed service that offers a choice of high-performing foundation models (FMs) from leading AI companies like AI21 Labs, Anthropic, Cohere, Meta, Stability AI, and Amazon via a single API, along with a broad set of capabilities you need to build generative AI applications with security, privacy, and responsible AI.This will help you getting started with Amazon Bedrock [chat models](/docs/concepts/chat_models). For detailed documentation of all BedrockChat features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_community_chat_models_bedrock.BedrockChat.html).tipThe newer [ChatBedrockConverse chat model is now available via the dedicated @langchain/aws](/docs/integrations/chat/bedrock_converse) integration package. Use [tool calling](/docs/concepts/tool_calling) with more models with this package. ## Overview[​](#overview) ### Integration details[​](#integration-details) ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/bedrock/)Package downloadsPackage latest[BedrockChat](https://api.js.langchain.com/classes/langchain_community_chat_models_bedrock.BedrockChat.html)[@langchain/community](https://npmjs.com/@langchain/community)❌✅✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/community?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/community?style=flat-square&label=%20&.png) ### Model features[​](#model-features) See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌✅❌❌✅✅❌ ## Setup[​](#setup) To access Bedrock models you’ll need to create an AWS account, set up the Bedrock API service, get an access key ID and secret key, and install the @langchain/community integration package. ### Credentials[​](#credentials) Head to the [AWS docs](https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html) to sign up for AWS and setup your credentials. You’ll also need to turn on model access for your account, which you can do by [following these instructions](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html).If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

``` ### Installation[​](#installation) The LangChain BedrockChat integration lives in the @langchain/community package. You’ll also need to install several official AWS packages as peer dependencies:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/community @langchain/core @aws-crypto/sha256-js @aws-sdk/credential-provider-node @smithy/protocol-http @smithy/signature-v4 @smithy/eventstream-codec @smithy/util-utf8 @aws-sdk/types

```

```bash
yarn add @langchain/community @langchain/core @aws-crypto/sha256-js @aws-sdk/credential-provider-node @smithy/protocol-http @smithy/signature-v4 @smithy/eventstream-codec @smithy/util-utf8 @aws-sdk/types

```

```bash
pnpm add @langchain/community @langchain/core @aws-crypto/sha256-js @aws-sdk/credential-provider-node @smithy/protocol-http @smithy/signature-v4 @smithy/eventstream-codec @smithy/util-utf8 @aws-sdk/types

```You can also use BedrockChat in web environments such as Edge functions or Cloudflare Workers by omitting the @aws-sdk/credential-provider-node dependency and using the web entrypoint:

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/community @langchain/core @aws-crypto/sha256-js @smithy/protocol-http @smithy/signature-v4 @smithy/eventstream-codec @smithy/util-utf8 @aws-sdk/types

```

```bash
yarn add @langchain/community @langchain/core @aws-crypto/sha256-js @smithy/protocol-http @smithy/signature-v4 @smithy/eventstream-codec @smithy/util-utf8 @aws-sdk/types

```

```bash
pnpm add @langchain/community @langchain/core @aws-crypto/sha256-js @smithy/protocol-http @smithy/signature-v4 @smithy/eventstream-codec @smithy/util-utf8 @aws-sdk/types

``` ## Instantiation[​](#instantiation) Currently, only Anthropic, Cohere, and Mistral models are supported with the chat model integration. For foundation models from AI21 or Amazon, see the [text generation Bedrock variant](/docs/integrations/llms/bedrock/).

There are a few different ways to authenticate with AWS - the below examples rely on an access key, secret access key and region set in your environment variables:

```typescript
import { BedrockChat } from "@langchain/community/chat_models/bedrock";

const llm = new BedrockChat({
  model: "anthropic.claude-3-5-sonnet-20240620-v1:0",
  region: process.env.BEDROCK_AWS_REGION,
  credentials: {
    accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
  },
  // endpointUrl: "custom.amazonaws.com",
  // modelKwargs: {
  //   anthropic_version: "bedrock-2023-05-31",
  // },
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
  "content": "J&#x27;adore la programmation.",
  "additional_kwargs": {
    "id": "msg_bdrk_01RwhfuWkLLcp7ks1X3u8bwd"
  },
  "response_metadata": {
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-sonnet-20240620",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 29,
      "output_tokens": 11
    }
  },
  "tool_calls": [],
  "invalid_tool_calls": []
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
  "content": "Here&#x27;s the German translation:\n\nIch liebe Programmieren.",
  "additional_kwargs": {
    "id": "msg_bdrk_01RtUH3qrYJPUdutYoxphFkv"
  },
  "response_metadata": {
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-sonnet-20240620",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 23,
      "output_tokens": 18
    }
  },
  "tool_calls": [],
  "invalid_tool_calls": []
}

``` ## Tool calling[​](#tool-calling) Tool calling with Bedrock models works in a similar way to [other models](/docs/how_to/tool_calling), but note that not all Bedrock models support tool calling. Please refer to the [AWS model documentation](https://docs.aws.amazon.com/bedrock/latest/APIReference/welcome.html) for more information.

## API reference[​](#api-reference)

For detailed documentation of all `BedrockChat` features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_community_chat_models_bedrock.BedrockChat.html](https://api.js.langchain.com/classes/langchain_community_chat_models_bedrock.BedrockChat.html)

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