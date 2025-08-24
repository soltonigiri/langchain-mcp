ChatGroq | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatGroqGroq](https://groq.com/) is a company that offers fast AI inference, powered by LPU™ AI inference technology which delivers fast, affordable, and energy efficient AI.This will help you getting started with ChatGroq [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatGroq features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_groq.ChatGroq.html). ## Overview[​](#overview) ### Integration details[​](#integration-details) ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/groq)Package downloadsPackage latest[ChatGroq](https://api.js.langchain.com/classes/langchain_groq.ChatGroq.html)[@langchain/groq](https://www.npmjs.com/package/@langchain/groq)❌❌✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/groq?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/groq?style=flat-square&label=%20&.png) ### Model features[​](#model-features) See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅❌❌❌✅✅✅ ## Setup[​](#setup) To access ChatGroq models you’ll need to create a Groq account, get an API key, and install the @langchain/groq integration package. ### Credentials[​](#credentials) In order to use the Groq API you’ll need an API key. You can sign up for a Groq account and create an API key [here](https://wow.groq.com/). Then, you can set the API key as an environment variable in your terminal:

```bash
export GROQ_API_KEY="your-api-key"

```If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

``` ### Installation[​](#installation) The LangChain ChatGroq integration lives in the @langchain/groq package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/groq @langchain/core

```

```bash
yarn add @langchain/groq @langchain/core

```

```bash
pnpm add @langchain/groq @langchain/core

``` ## Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  // other params...
});

```

## Invocation[​](#invocation)

```typescript
const aiMsg = await llm.invoke([
  {
    role: "system",
    content:
      "You are a helpful assistant that translates English to French. Translate the user sentence.",
  },
  { role: "user", content: "I love programming." },
]);
aiMsg;

```

```text
AIMessage {
  "content": "I enjoy programming. (The French translation is: \"J&#x27;aime programmer.\")\n\nNote: I chose to translate \"I love programming\" as \"J&#x27;aime programmer\" instead of \"Je suis amoureux de programmer\" because the latter has a romantic connotation that is not present in the original English sentence.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 73,
      "promptTokens": 31,
      "totalTokens": 104
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": []
}

```

```typescript
console.log(aiMsg.content);

```

```text
I enjoy programming. (The French translation is: "J&#x27;aime programmer.")

Note: I chose to translate "I love programming" as "J&#x27;aime programmer" instead of "Je suis amoureux de programmer" because the latter has a romantic connotation that is not present in the original English sentence.

``` ## Json invocation[​](#json-invocation)

```typescript
const messages = [
  {
    role: "system",
    content:
      "You are a math tutor that handles math exercises and makes output in json in format { result: number }.",
  },
  { role: "user", content: "2 + 2 * 2" },
];

const aiInvokeMsg = await llm.invoke(messages, {
  response_format: { type: "json_object" },
});

// if you want not to pass response_format in every invoke, you can bind it to the instance
const llmWithResponseFormat = llm.bind({
  response_format: { type: "json_object" },
});
const aiBindMsg = await llmWithResponseFormat.invoke(messages);

// they are the same
console.log({
  aiInvokeMsgContent: aiInvokeMsg.content,
  aiBindMsg: aiBindMsg.content,
});

```

```text
{
  aiInvokeMsgContent: &#x27;{\n"result": 6\n}&#x27;,
  aiBindMsg: &#x27;{\n"result": 6\n}&#x27;
}

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
  "content": "That&#x27;s great! I can help you translate English phrases related to programming into German.\n\n\"I love programming\" can be translated to German as \"Ich liebe Programmieren\".\n\nHere are some more programming-related phrases translated into German:\n\n* \"Programming language\" = \"Programmiersprache\"\n* \"Code\" = \"Code\"\n* \"Variable\" = \"Variable\"\n* \"Function\" = \"Funktion\"\n* \"Array\" = \"Array\"\n* \"Object-oriented programming\" = \"Objektorientierte Programmierung\"\n* \"Algorithm\" = \"Algorithmus\"\n* \"Data structure\" = \"Datenstruktur\"\n* \"Debugging\" = \"Debuggen\"\n* \"Compile\" = \"Kompilieren\"\n* \"Link\" = \"Verknüpfen\"\n* \"Run\" = \"Ausführen\"\n* \"Test\" = \"Testen\"\n* \"Deploy\" = \"Bereitstellen\"\n* \"Version control\" = \"Versionskontrolle\"\n* \"Open source\" = \"Open Source\"\n* \"Software development\" = \"Softwareentwicklung\"\n* \"Agile methodology\" = \"Agile Methodik\"\n* \"DevOps\" = \"DevOps\"\n* \"Cloud computing\" = \"Cloud Computing\"\n\nI hope this helps! Let me know if you have any other questions or if you need further translations.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 327,
      "promptTokens": 25,
      "totalTokens": 352
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": []
}

``` ## API reference[​](#api-reference) For detailed documentation of all ChatGroq features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_groq.ChatGroq.html](https://api.js.langchain.com/classes/langchain_groq.ChatGroq.html)

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
- [Json invocation](#json-invocation)
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