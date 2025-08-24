ChatOllama | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatOllamaOllama](https://ollama.ai/) allows you to run open-source large language models, such as Llama 3.1, locally.Ollama bundles model weights, configuration, and data into a single package, defined by a Modelfile. It optimizes setup and configuration details, including GPU usage.This guide will help you getting started with ChatOllama [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatOllama features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_ollama.ChatOllama.html). ## Overview[​](#overview) ### Integration details[​](#integration-details) Ollama allows you to use a wide range of models with different capabilities. Some of the fields in the details table below only apply to a subset of models that Ollama offers.For a complete list of supported models and model variants, see the [Ollama model library](https://ollama.com/search) and search by tag.ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/ollama)Package downloadsPackage latest[ChatOllama](https://api.js.langchain.com/classes/langchain_ollama.ChatOllama.html)[@langchain/ollama](https://www.npmjs.com/package/@langchain/ollama)✅beta✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/ollama?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/ollama?style=flat-square&label=%20&.png) ### Model features[​](#model-features) See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅✅❌❌✅✅❌ ## Setup[​](#setup) Follow [these instructions](https://github.com/ollama/ollama) to set up and run a local Ollama instance. Then, download the @langchain/ollama package. ### Credentials[​](#credentials) If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

``` ### Installation[​](#installation) The LangChain ChatOllama integration lives in the @langchain/ollama package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/ollama @langchain/core

```

```bash
yarn add @langchain/ollama @langchain/core

```

```bash
pnpm add @langchain/ollama @langchain/core

``` ## Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({
  model: "llama3",
  temperature: 0,
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
aiMsg;

```

```text
AIMessage {
  "content": "Je adore le programmation.\n\n(Note: \"programmation\" is the feminine form of the noun in French, but if you want to use the masculine form, it would be \"le programme\" instead.)",
  "additional_kwargs": {},
  "response_metadata": {
    "model": "llama3",
    "created_at": "2024-08-01T16:59:17.359302Z",
    "done_reason": "stop",
    "done": true,
    "total_duration": 6399311167,
    "load_duration": 5575776417,
    "prompt_eval_count": 35,
    "prompt_eval_duration": 110053000,
    "eval_count": 43,
    "eval_duration": 711744000
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 35,
    "output_tokens": 43,
    "total_tokens": 78
  }
}

```

```typescript
console.log(aiMsg.content);

```

```text
Je adore le programmation.

(Note: "programmation" is the feminine form of the noun in French, but if you want to use the masculine form, it would be "le programme" instead.)

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
  "content": "Ich liebe Programmieren!\n\n(Note: \"Ich liebe\" means \"I love\", \"Programmieren\" is the verb for \"programming\")",
  "additional_kwargs": {},
  "response_metadata": {
    "model": "llama3",
    "created_at": "2024-08-01T16:59:18.088423Z",
    "done_reason": "stop",
    "done": true,
    "total_duration": 585146125,
    "load_duration": 27557166,
    "prompt_eval_count": 30,
    "prompt_eval_duration": 74241000,
    "eval_count": 29,
    "eval_duration": 481195000
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 30,
    "output_tokens": 29,
    "total_tokens": 59
  }
}

``` ## Tools[​](#tools) Ollama now offers support for native tool calling [for a subset of their available models](https://ollama.com/search?c=tools). The example below demonstrates how you can invoke a tool from an Ollama model.

```typescript
import { tool } from "@langchain/core/tools";
import { ChatOllama } from "@langchain/ollama";
import { z } from "zod";

const weatherTool = tool((_) => "Da weather is weatherin", {
  name: "get_current_weather",
  description: "Get the current weather in a given location",
  schema: z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
  }),
});

// Define the model
const llmForTool = new ChatOllama({
  model: "llama3-groq-tool-use",
});

// Bind the tool to the model
const llmWithTools = llmForTool.bindTools([weatherTool]);

const resultFromTool = await llmWithTools.invoke(
  "What&#x27;s the weather like today in San Francisco? Ensure you use the &#x27;get_current_weather&#x27; tool."
);

console.log(resultFromTool);

```

```text
AIMessage {
  "content": "",
  "additional_kwargs": {},
  "response_metadata": {
    "model": "llama3-groq-tool-use",
    "created_at": "2024-08-01T18:43:13.2181Z",
    "done_reason": "stop",
    "done": true,
    "total_duration": 2311023875,
    "load_duration": 1560670292,
    "prompt_eval_count": 177,
    "prompt_eval_duration": 263603000,
    "eval_count": 30,
    "eval_duration": 485582000
  },
  "tool_calls": [
    {
      "name": "get_current_weather",
      "args": {
        "location": "San Francisco, CA"
      },
      "id": "c7a9d590-99ad-42af-9996-41b90efcf827",
      "type": "tool_call"
    }
  ],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 177,
    "output_tokens": 30,
    "total_tokens": 207
  }
}

``` ### .withStructuredOutput[​](#withstructuredoutput) For [models that support tool calling](https://ollama.com/search?c=tools), you can also call `.withStructuredOutput()` to get a structured output from the tool.

```typescript
import { ChatOllama } from "@langchain/ollama";
import { z } from "zod";

// Define the model
const llmForWSO = new ChatOllama({
  model: "llama3-groq-tool-use",
});

// Define the tool schema you&#x27;d like the model to use.
const schemaForWSO = z.object({
  location: z.string().describe("The city and state, e.g. San Francisco, CA"),
});

// Pass the schema to the withStructuredOutput method to bind it to the model.
const llmWithStructuredOutput = llmForWSO.withStructuredOutput(schemaForWSO, {
  name: "get_current_weather",
});

const resultFromWSO = await llmWithStructuredOutput.invoke(
  "What&#x27;s the weather like today in San Francisco? Ensure you use the &#x27;get_current_weather&#x27; tool."
);
console.log(resultFromWSO);

```

```text
{ location: &#x27;San Francisco, CA&#x27; }

``` ### JSON mode[​](#json-mode) Ollama also supports a JSON mode for all chat models that coerces model outputs to only return JSON. Here’s an example of how this can be useful for extraction:

```typescript
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptForJsonMode = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert translator. Format all responses as JSON objects with two keys: "original" and "translated".`,
  ],
  ["human", `Translate "{input}" into {language}.`],
]);

const llmJsonMode = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama3",
  format: "json",
});

const chainForJsonMode = promptForJsonMode.pipe(llmJsonMode);

const resultFromJsonMode = await chainForJsonMode.invoke({
  input: "I love programming",
  language: "German",
});

console.log(resultFromJsonMode);

```

```text
AIMessage {
  "content": "{\n\"original\": \"I love programming\",\n\"translated\": \"Ich liebe Programmierung\"\n}",
  "additional_kwargs": {},
  "response_metadata": {
    "model": "llama3",
    "created_at": "2024-08-01T17:24:54.35568Z",
    "done_reason": "stop",
    "done": true,
    "total_duration": 1754811583,
    "load_duration": 1297200208,
    "prompt_eval_count": 47,
    "prompt_eval_duration": 128532000,
    "eval_count": 20,
    "eval_duration": 318519000
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 47,
    "output_tokens": 20,
    "total_tokens": 67
  }
}

``` ## Multimodal models[​](#multimodal-models) Ollama supports open source multimodal models like [LLaVA](https://ollama.ai/library/llava) in versions 0.1.15 and up. You can pass images as part of a message’s `content` field to [multimodal-capable](/docs/how_to/multimodal_inputs/) models like this:

```typescript
import { ChatOllama } from "@langchain/ollama";
import { HumanMessage } from "@langchain/core/messages";
import * as fs from "node:fs/promises";

const imageData = await fs.readFile("../../../../../examples/hotdog.jpg");
const llmForMultiModal = new ChatOllama({
  model: "llava",
  baseUrl: "http://127.0.0.1:11434",
});
const multiModalRes = await llmForMultiModal.invoke([
  new HumanMessage({
    content: [
      {
        type: "text",
        text: "What is in this image?",
      },
      {
        type: "image_url",
        image_url: `data:image/jpeg;base64,${imageData.toString("base64")}`,
      },
    ],
  }),
]);
console.log(multiModalRes);

```

```text
AIMessage {
  "content": " The image shows a hot dog in a bun, which appears to be a footlong. It has been cooked or grilled to the point where it&#x27;s browned and possibly has some blackened edges, indicating it might be slightly overcooked. Accompanying the hot dog is a bun that looks toasted as well. There are visible char marks on both the hot dog and the bun, suggesting they have been cooked directly over a source of heat, such as a grill or broiler. The background is white, which puts the focus entirely on the hot dog and its bun. ",
  "additional_kwargs": {},
  "response_metadata": {
    "model": "llava",
    "created_at": "2024-08-01T17:25:02.169957Z",
    "done_reason": "stop",
    "done": true,
    "total_duration": 5700249458,
    "load_duration": 2543040666,
    "prompt_eval_count": 1,
    "prompt_eval_duration": 1032591000,
    "eval_count": 127,
    "eval_duration": 2114201000
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 1,
    "output_tokens": 127,
    "total_tokens": 128
  }
}

``` ## API reference[​](#api-reference) For detailed documentation of all ChatOllama features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_ollama.ChatOllama.html](https://api.js.langchain.com/classes/langchain_ollama.ChatOllama.html)

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
- [Tools](#tools)[.withStructuredOutput](#withstructuredoutput)
- [JSON mode](#json-mode)

- [Multimodal models](#multimodal-models)
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