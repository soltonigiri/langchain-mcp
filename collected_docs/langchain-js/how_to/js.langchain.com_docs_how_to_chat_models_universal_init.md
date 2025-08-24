How to init any model in one line | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to init any model in one lineMany LLM applications let end users specify what model provider and model they want the application to be powered by. This requires writing some logic to initialize different ChatModels based on some user configuration. The initChatModel() helper method makes it easy to initialize a number of different model integrations without having to worry about import paths and class names. Keep in mind this feature is only for chat models.PrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)[LangChain Expression Language (LCEL)](/docs/concepts/lcel)[Tool calling](/docs/concepts/tools)CompatibilityThis feature is only intended to be used in Node environments. Use in non Node environments or with bundlers is not guaranteed to work and not officially supported.**initChatModel requires langchain>=0.2.11. See [this guide](/docs/how_to/installation/#installing-integration-packages) for some considerations to take when upgrading.See the [initChatModel()](https://api.js.langchain.com/functions/langchain.chat_models_universal.initChatModel.html) API reference for a full list of supported integrations.Make sure you have the integration packages installed for any model providers you want to support. E.g. you should have @langchain/openai installed to init an OpenAI model. ## Basic usage[​](#basic-usage)

```typescript
import { initChatModel } from "langchain/chat_models/universal";

// Returns a @langchain/openai ChatOpenAI instance.
const gpt4o = await initChatModel("gpt-4o", {
  modelProvider: "openai",
  temperature: 0,
});

// You can also specify the model provider in the model name like this in
// langchain>=0.3.18:

// Returns a @langchain/anthropic ChatAnthropic instance.
const claudeOpus = await initChatModel("anthropic:claude-3-opus-20240229", {
  temperature: 0,
});
// Returns a @langchain/google-vertexai ChatVertexAI instance.
const gemini15 = await initChatModel("google-vertexai:gemini-1.5-pro", {
  temperature: 0,
});

// Since all model integrations implement the ChatModel interface, you can use them in the same way.
console.log(`GPT-4o: ${(await gpt4o.invoke("what&#x27;s your name")).content}\n`);
console.log(
  `Claude Opus: ${(await claudeOpus.invoke("what&#x27;s your name")).content}\n`
);
console.log(
  `Gemini 1.5: ${(await gemini15.invoke("what&#x27;s your name")).content}\n`
);

/*
GPT-4o: I&#x27;m an AI language model created by OpenAI, and I don&#x27;t have a personal name. You can call me Assistant or any other name you prefer! How can I help you today?

Claude Opus: My name is Claude. It&#x27;s nice to meet you!

Gemini 1.5: I don&#x27;t have a name. I am a large language model, and I am not a person. I am a computer program that can generate text, translate languages, write different kinds of creative content, and answer your questions in an informative way.
*/

``` #### API Reference: initChatModel from langchain/chat_models/universal

## Inferring model provider[​](#inferring-model-provider)

For common and distinct model names `initChatModel()` will attempt to infer the model provider. See the [API reference](https://api.js.langchain.com/functions/langchain.chat_models_universal.initChatModel.html) for a full list of inference behavior. E.g. any model that starts with `gpt-3...` or `gpt-4...` will be inferred as using model provider `openai`.

```typescript
import { initChatModel } from "langchain/chat_models/universal";

const gpt4o = await initChatModel("gpt-4o", {
  temperature: 0,
});
const claudeOpus = await initChatModel("claude-3-opus-20240229", {
  temperature: 0,
});
const gemini15 = await initChatModel("gemini-1.5-pro", {
  temperature: 0,
});

```

#### API Reference: - initChatModel from langchain/chat_models/universal ## Creating a configurable model[​](#creating-a-configurable-model) You can also create a runtime-configurable model by specifying `configurableFields`. If you don&#x27;t specify a `model` value, then "model" and "modelProvider" be configurable by default.

```typescript
import { initChatModel } from "langchain/chat_models/universal";

const configurableModel = await initChatModel(undefined, { temperature: 0 });

const gpt4Res = await configurableModel.invoke("what&#x27;s your name", {
  configurable: { model: "gpt-4o-mini" },
});
console.log("gpt4Res: ", gpt4Res.content);
/*
gpt4Res:  I&#x27;m an AI language model created by OpenAI, and I don&#x27;t have a personal name. You can call me Assistant or any other name you prefer! How can I assist you today?
*/

const claudeRes = await configurableModel.invoke("what&#x27;s your name", {
  configurable: { model: "claude-3-5-sonnet-20240620" },
});
console.log("claudeRes: ", claudeRes.content);
/*
claudeRes:  My name is Claude. It&#x27;s nice to meet you!
*/

```

#### API Reference: - initChatModel from langchain/chat_models/universal ### Configurable model with default values[​](#configurable-model-with-default-values) We can create a configurable model with default model values, specify which parameters are configurable, and add prefixes to configurable params:

```typescript
import { initChatModel } from "langchain/chat_models/universal";

const firstLlm = await initChatModel("gpt-4o", {
  temperature: 0,
  configurableFields: ["model", "modelProvider", "temperature", "maxTokens"],
  configPrefix: "first", // useful when you have a chain with multiple models
});

const openaiRes = await firstLlm.invoke("what&#x27;s your name");
console.log("openaiRes: ", openaiRes.content);
/*
openaiRes:  I&#x27;m an AI language model created by OpenAI, and I don&#x27;t have a personal name. You can call me Assistant or any other name you prefer! How can I assist you today?
*/

const claudeRes = await firstLlm.invoke("what&#x27;s your name", {
  configurable: {
    first_model: "claude-3-5-sonnet-20240620",
    first_temperature: 0.5,
    first_maxTokens: 100,
  },
});
console.log("claudeRes: ", claudeRes.content);
/*
claudeRes:  My name is Claude. It&#x27;s nice to meet you!
*/

```

#### API Reference: - initChatModel from langchain/chat_models/universal ### Using a configurable model declaratively[​](#using-a-configurable-model-declaratively) We can call declarative operations like `bindTools`, `withStructuredOutput`, `withConfig`, etc. on a configurable model and chain a configurable model in the same way that we would a regularly instantiated chat model object.

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { initChatModel } from "langchain/chat_models/universal";

const GetWeather = z
  .object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
  })
  .describe("Get the current weather in a given location");
const weatherTool = tool(
  (_) => {
    // do something
    return "138 degrees";
  },
  {
    name: "GetWeather",
    schema: GetWeather,
  }
);

const GetPopulation = z
  .object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
  })
  .describe("Get the current population in a given location");
const populationTool = tool(
  (_) => {
    // do something
    return "one hundred billion";
  },
  {
    name: "GetPopulation",
    schema: GetPopulation,
  }
);

const llm = await initChatModel(undefined, { temperature: 0 });
const llmWithTools = llm.bindTools([weatherTool, populationTool]);

const toolCalls1 = (
  await llmWithTools.invoke("what&#x27;s bigger in 2024 LA or NYC", {
    configurable: { model: "gpt-4o-mini" },
  })
).tool_calls;
console.log("toolCalls1: ", JSON.stringify(toolCalls1, null, 2));
/*
toolCalls1:  [
  {
    "name": "GetPopulation",
    "args": {
      "location": "Los Angeles, CA"
    },
    "type": "tool_call",
    "id": "call_DXRBVE4xfLYZfhZOsW1qRbr5"
  },
  {
    "name": "GetPopulation",
    "args": {
      "location": "New York, NY"
    },
    "type": "tool_call",
    "id": "call_6ec3m4eWhwGz97sCbNt7kOvC"
  }
]
*/

const toolCalls2 = (
  await llmWithTools.invoke("what&#x27;s bigger in 2024 LA or NYC", {
    configurable: { model: "claude-3-5-sonnet-20240620" },
  })
).tool_calls;
console.log("toolCalls2: ", JSON.stringify(toolCalls2, null, 2));
/*
toolCalls2:  [
  {
    "name": "GetPopulation",
    "args": {
      "location": "Los Angeles, CA"
    },
    "id": "toolu_01K3jNU8jx18sJ9Y6Q9SooJ7",
    "type": "tool_call"
  },
  {
    "name": "GetPopulation",
    "args": {
      "location": "New York City, NY"
    },
    "id": "toolu_01UiANKaSwYykuF4hi3t5oNB",
    "type": "tool_call"
  }
]
*/

```

#### API Reference:

- tool from @langchain/core/tools
- initChatModel from langchain/chat_models/universal

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Basic usage](#basic-usage)
- [Inferring model provider](#inferring-model-provider)
- [Creating a configurable model](#creating-a-configurable-model)[Configurable model with default values](#configurable-model-with-default-values)
- [Using a configurable model declaratively](#using-a-configurable-model-declaratively)

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