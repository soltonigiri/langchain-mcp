ChatVertexAI | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatVertexAIGoogle Vertex](https://cloud.google.com/vertex-ai) is a service that exposes all foundation models available in Google Cloud, like gemini-1.5-pro, gemini-2.0-flash-exp, etc. It also provides some non-Google models such as [Anthropic’s Claude](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude).This will help you getting started with ChatVertexAI [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatVertexAI features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_google_vertexai.ChatVertexAI.html). ## Overview[​](#overview) ### Integration details[​](#integration-details) ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/google_vertex_ai_palm)Package downloadsPackage latest[ChatVertexAI](https://api.js.langchain.com/classes/langchain_google_vertexai.ChatVertexAI.html)[@langchain/google-vertexai](https://www.npmjs.com/package/@langchain/google-vertexai)❌✅✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/google-vertexai?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/google-vertexai?style=flat-square&label=%20&.png) ### Model features[​](#model-features) See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌✅✅✅✅✅✅Note that while logprobs are supported, Gemini has fairly restricted usage of them. ## Setup[​](#setup) LangChain.js supports two different authentication methods based on whether you’re running in a Node.js environment or a web environment. It also supports the authentication method used by Vertex AI Express Mode using either package.To access ChatVertexAI models you’ll need to setup Google VertexAI in your Google Cloud Platform (GCP) account, save the credentials file, and install the @langchain/google-vertexai integration package. ### Credentials[​](#credentials) Head to your [GCP account](https://console.cloud.google.com/) and generate a credentials file. Once you’ve done this set the GOOGLE_APPLICATION_CREDENTIALS environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"

```If running in a web environment, you should set the GOOGLE_VERTEX_AI_WEB_CREDENTIALS environment variable as a JSON stringified object, and install the @langchain/google-vertexai-web package:

```bash
GOOGLE_VERTEX_AI_WEB_CREDENTIALS={"type":"service_account","project_id":"YOUR_PROJECT-12345",...}

```If you are using Vertex AI Express Mode, you can install either the @langchain/google-vertexai or @langchain/google-vertexai-web package. You can then go to the [Express Mode](https://console.cloud.google.com/vertex-ai/studio) API Key page and set your API Key in the GOOGLE_API_KEY environment variable:

```bash
export GOOGLE_API_KEY="api_key_value"

```If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

``` ### Installation[​](#installation) The LangChain ChatVertexAI integration lives in the @langchain/google-vertexai package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/google-vertexai @langchain/core

```

```bash
yarn add @langchain/google-vertexai @langchain/core

```

```bash
pnpm add @langchain/google-vertexai @langchain/core

```Or if using in a web environment like a [Vercel Edge function](https://vercel.com/blog/edge-functions-generally-available):

- npm
- yarn
- pnpm

```bash
npm i @langchain/google-vertexai-web @langchain/core

```

```bash
yarn add @langchain/google-vertexai-web @langchain/core

```

```bash
pnpm add @langchain/google-vertexai-web @langchain/core

``` ## Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";
// Uncomment the following line if you&#x27;re running in a web environment:
// import { ChatVertexAI } from "@langchain/google-vertexai-web"

const llm = new ChatVertexAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0,
  maxRetries: 2,
  // For web, authOptions.credentials
  // authOptions: { ... }
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
AIMessageChunk {
  "content": "J&#x27;adore programmer. \n",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_calls": [],
  "tool_call_chunks": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 20,
    "output_tokens": 7,
    "total_tokens": 27
  }
}

```

```typescript
console.log(aiMsg.content);

```

```text
J&#x27;adore programmer.

``` ## Tool Calling with Google Search Retrieval[​](#tool-calling-with-google-search-retrieval) It is possible to call the model with a Google search tool which you can use to [ground](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/grounding) content generation with real-world information and reduce hallucinations.

Grounding is currently not supported by `gemini-2.0-flash-exp`.

You can choose to either ground using Google Search or by using a custom data store. Here are examples of both:

### Google Search Retrieval[​](#google-search-retrieval)

Grounding example that uses Google Search:

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const searchRetrievalTool = {
  googleSearchRetrieval: {
    dynamicRetrievalConfig: {
      mode: "MODE_DYNAMIC", // Use Dynamic Retrieval
      dynamicThreshold: 0.7, // Default for Dynamic Retrieval threshold
    },
  },
};

const searchRetrievalModel = new ChatVertexAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  maxRetries: 0,
}).bindTools([searchRetrievalTool]);

const searchRetrievalResult = await searchRetrievalModel.invoke(
  "Who won the 2024 NBA Finals?"
);

console.log(searchRetrievalResult.content);

```

```text
The Boston Celtics won the 2024 NBA Finals, defeating the Dallas Mavericks 4-1 in the series to claim their 18th NBA championship. This victory marked their first title since 2008 and established them as the team with the most NBA championships, surpassing the Los Angeles Lakers&#x27; 17 titles.

``` ### Google Search Retrieval with Data Store[​](#google-search-retrieval-with-data-store) First, set up your data store (this is a schema of an example data store):

| ID | Date | Team 1 | Score | Team 2 |

| 3001 | 2023-09-07 | Argentina | 1 - 0 | Ecuador |

| 3002 | 2023-09-12 | Venezuela | 1 - 0 | Paraguay |

| 3003 | 2023-09-12 | Chile | 0 - 0 | Colombia |

| 3004 | 2023-09-12 | Peru | 0 - 1 | Brazil |

| 3005 | 2024-10-15 | Argentina | 6 - 0 | Bolivia |

Then, use this data store in the example provided below:

(Note that you have to use your own variables for `projectId` and `datastoreId`)

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const projectId = "YOUR_PROJECT_ID";
const datastoreId = "YOUR_DATASTORE_ID";

const searchRetrievalToolWithDataset = {
  retrieval: {
    vertexAiSearch: {
      datastore: `projects/${projectId}/locations/global/collections/default_collection/dataStores/${datastoreId}`,
    },
    disableAttribution: false,
  },
};

const searchRetrievalModelWithDataset = new ChatVertexAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  maxRetries: 0,
}).bindTools([searchRetrievalToolWithDataset]);

const searchRetrievalModelResult = await searchRetrievalModelWithDataset.invoke(
  "What is the score of Argentina vs Bolivia football game?"
);

console.log(searchRetrievalModelResult.content);

```

```text
Argentina won against Bolivia with a score of 6-0 on October 15, 2024.

```You should now get results that are grounded in the data from your provided data store.

## Context Caching[​](#context-caching)

Vertex AI offers context caching functionality, which helps optimize costs by storing and reusing long blocks of message content across multiple API requests. This is particularly useful when you have lengthy conversation histories or message segments that appear frequently in your interactions.

To use this feature, first create a context cache by following [this official guide](https://cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-create).

Once you’ve created a cache, you can pass its id in as a runtime param as follows:

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const modelWithCachedContent = new ChatVertexAI({
  model: "gemini-1.5-pro-002",
  location: "us-east5",
});

await modelWithCachedContent.invoke("What is in the content?", {
  cachedContent:
    "projects/PROJECT_NUMBER/locations/LOCATION/cachedContents/CACHE_ID",
});

```

You can also bind this field directly onto the model instance:

```typescript
const modelWithBoundCachedContent = new ChatVertexAI({
  model: "gemini-1.5-pro-002",
  location: "us-east5",
}).bind({
  cachedContent:
    "projects/PROJECT_NUMBER/locations/LOCATION/cachedContents/CACHE_ID",
});

```

Note that not all models currently support context caching.

## Chaining[​](#chaining)

We can [chain](/docs/how_to/sequence/) our model with a prompt template like so:

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
AIMessageChunk {
  "content": "Ich liebe das Programmieren. \n",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_calls": [],
  "tool_call_chunks": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 15,
    "output_tokens": 9,
    "total_tokens": 24
  }
}

``` ## API reference[​](#api-reference) For detailed documentation of all ChatVertexAI features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_google_vertexai.ChatVertexAI.html](https://api.js.langchain.com/classes/langchain_google_vertexai.ChatVertexAI.html)

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
- [Tool Calling with Google Search Retrieval](#tool-calling-with-google-search-retrieval)[Google Search Retrieval](#google-search-retrieval)
- [Google Search Retrieval with Data Store](#google-search-retrieval-with-data-store)

- [Context Caching](#context-caching)
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