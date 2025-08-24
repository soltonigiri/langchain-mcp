ChatCloudflareWorkersAI | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatCloudflareWorkersAIWorkers AI](https://developers.cloudflare.com/workers-ai/) allows you to run machine learning models, on the Cloudflare network, from your own code.This will help you getting started with Cloudflare Workers AI [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatCloudflareWorkersAI features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_cloudflare.ChatCloudflareWorkersAI.html). ## Overview[​](#overview) ### Integration details[​](#integration-details) ClassPackageLocalSerializablePY supportPackage downloadsPackage latest[ChatCloudflareWorkersAI](https://api.js.langchain.com/classes/langchain_cloudflare.ChatCloudflareWorkersAI.html)[@langchain/cloudflare](https://npmjs.com/@langchain/cloudflare)❌✅❌![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/cloudflare?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/cloudflare?style=flat-square&label=%20&.png) ### Model features[​](#model-features) See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)❌❌❌✅❌❌✅❌❌ ## Setup[​](#setup) To access Cloudflare Workers AI models you’ll need to create a Cloudflare account, get an API key, and install the @langchain/cloudflare integration package. ### Credentials[​](#credentials) Head [to this page](https://developers.cloudflare.com/workers-ai/) to sign up to Cloudflare and generate an API key. Once you’ve done this, note your CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN.Passing a binding within a Cloudflare Worker is not yet supported. ### Installation[​](#installation) The LangChain ChatCloudflareWorkersAI integration lives in the @langchain/cloudflare package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/cloudflare @langchain/core

```

```bash
yarn add @langchain/cloudflare @langchain/core

```

```bash
pnpm add @langchain/cloudflare @langchain/core

``` ## Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatCloudflareWorkersAI } from "@langchain/cloudflare";

const llm = new ChatCloudflareWorkersAI({
  model: "@cf/meta/llama-2-7b-chat-int8", // Default value
  cloudflareAccountId: CLOUDFLARE_ACCOUNT_ID,
  cloudflareApiToken: CLOUDFLARE_API_TOKEN,
  // Pass a custom base URL to use Cloudflare AI Gateway
  // baseUrl: `https://gateway.ai.cloudflare.com/v1/{YOUR_ACCOUNT_ID}/{GATEWAY_NAME}/workers-ai/`,
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
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;I can help with that! The translation of "I love programming" in French is:\n&#x27; +
      "\n" +
      `"J&#x27;adore le programmati`... 4 more characters,
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ "langchain_core", "messages" ],
  content: &#x27;I can help with that! The translation of "I love programming" in French is:\n&#x27; +
    "\n" +
    `"J&#x27;adore le programmati`... 4 more characters,
  name: undefined,
  additional_kwargs: {},
  response_metadata: {},
  tool_calls: [],
  invalid_tool_calls: []
}

```

```typescript
console.log(aiMsg.content);

```

```text
I can help with that! The translation of "I love programming" in French is:

"J&#x27;adore le programmation."

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
  lc_serializable: true,
  lc_kwargs: {
    content: "Das Programmieren ist für mich sehr Valent sein!",
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ "langchain_core", "messages" ],
  content: "Das Programmieren ist für mich sehr Valent sein!",
  name: undefined,
  additional_kwargs: {},
  response_metadata: {},
  tool_calls: [],
  invalid_tool_calls: []
}

``` ## API reference[​](#api-reference) For detailed documentation of all `ChatCloudflareWorkersAI` features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_cloudflare.ChatCloudflareWorkersAI.html](https://api.js.langchain.com/classes/langchain_cloudflare.ChatCloudflareWorkersAI.html)

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