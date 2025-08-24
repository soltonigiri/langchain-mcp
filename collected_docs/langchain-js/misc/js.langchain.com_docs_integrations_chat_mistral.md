ChatMistralAI | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatMistralAIMistral AI](https://mistral.ai/) is a platform that offers hosting for their powerful [open source models](https://docs.mistral.ai/getting-started/models/).This will help you getting started with ChatMistralAI [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatMistralAI features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_mistralai.ChatMistralAI.html).Overview[​](#overview)Integration details[​](#integration-details)ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/mistralai)Package downloadsPackage latest[ChatMistralAI](https://api.js.langchain.com/classes/langchain_mistralai.ChatMistralAI.html)[@langchain/mistralai](https://www.npmjs.com/package/@langchain/mistralai)❌❌✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/mistralai?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/mistralai?style=flat-square&label=%20&.png)Model features[​](#model-features)See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅✅❌❌✅✅❌Setup[​](#setup)To access Mistral AI models you’ll need to create a Mistral AI account, get an API key, and install the @langchain/mistralai integration package.Credentials[​](#credentials)Head [here](https://console.mistral.ai/) to sign up to Mistral AI and generate an API key. Once you’ve done this set the MISTRAL_API_KEY environment variable:

```bash
export MISTRAL_API_KEY="your-api-key"

```If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

```Installation[​](#installation)The LangChain ChatMistralAI integration lives in the @langchain/mistralai package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/mistralai @langchain/core

```

```bash
yarn add @langchain/mistralai @langchain/core

```

```bash
pnpm add @langchain/mistralai @langchain/core

```Instantiation[​](#instantiation)Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  maxRetries: 2,
  // other params...
});

```Invocation[​](#invocation)When sending chat messages to mistral, there are a few requirements to follow:The first message can not** be an assistant (ai) message.
- Messages **must** alternate between user and assistant (ai) messages.
- Messages can **not** end with an assistant (ai) or system message.

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
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 9,
      "promptTokens": 27,
      "totalTokens": 36
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 27,
    "output_tokens": 9,
    "total_tokens": 36
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
  "content": "Ich liebe Programmieren.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 7,
      "promptTokens": 21,
      "totalTokens": 28
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 21,
    "output_tokens": 7,
    "total_tokens": 28
  }
}

``` ## Tool calling[​](#tool-calling) Mistral’s API supports [tool calling](/docs/concepts/tool_calling) for a subset of their models. You can see which models support tool calling [on this page](https://docs.mistral.ai/capabilities/function_calling/).

The examples below demonstrates how to use it:

```typescript
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const calculatorSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
});

const calculatorTool = tool(
  (input) => {
    return JSON.stringify(input);
  },
  {
    name: "calculator",
    description: "A simple calculator tool",
    schema: calculatorSchema,
  }
);

// Bind the tool to the model
const modelWithTool = new ChatMistralAI({
  model: "mistral-large-latest",
}).bindTools([calculatorTool]);

const calcToolPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant who always needs to use a calculator.",
  ],
  ["human", "{input}"],
]);

// Chain your prompt, model, and output parser together
const chainWithCalcTool = calcToolPrompt.pipe(modelWithTool);

const calcToolRes = await chainWithCalcTool.invoke({
  input: "What is 2 + 2?",
});
console.log(calcToolRes.tool_calls);

```

```text
[
  {
    name: &#x27;calculator&#x27;,
    args: { operation: &#x27;add&#x27;, number1: 2, number2: 2 },
    type: &#x27;tool_call&#x27;,
    id: &#x27;DD9diCL1W&#x27;
  }
]

``` ## Hooks[​](#hooks) Mistral AI supports custom hooks for three events: beforeRequest, requestError, and reponse. Examples of the function signature for each hook type can be seen below:

```typescript
const beforeRequestHook = (
  req: Request
): Request | void | Promise<Request | void> => {
  // Code to run before a request is processed by Mistral
};

const requestErrorHook = (err: unknown, req: Request): void | Promise<void> => {
  // Code to run when an error occurs as Mistral is processing a request
};

const responseHook = (res: Response, req: Request): void | Promise<void> => {
  // Code to run before Mistral sends a successful response
};

```

To add these hooks to the chat model, either pass them as arguments and they are automatically added:

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const modelWithHooks = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  maxRetries: 2,
  beforeRequestHooks: [beforeRequestHook],
  requestErrorHooks: [requestErrorHook],
  responseHooks: [responseHook],
  // other params...
});

```

Or assign and add them manually after instantiation:

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  maxRetries: 2,
  // other params...
});

model.beforeRequestHooks = [...model.beforeRequestHooks, beforeRequestHook];
model.requestErrorHooks = [...model.requestErrorHooks, requestErrorHook];
model.responseHooks = [...model.responseHooks, responseHook];

model.addAllHooksToHttpClient();

```

The method addAllHooksToHttpClient clears all currently added hooks before assigning the entire updated hook lists to avoid hook duplication.

Hooks can be removed one at a time, or all hooks can be cleared from the model at once.

```typescript
model.removeHookFromHttpClient(beforeRequestHook);

model.removeAllHooksFromHttpClient();

```

## API reference[​](#api-reference) For detailed documentation of all ChatMistralAI features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_mistralai.ChatMistralAI.html](https://api.js.langchain.com/classes/langchain_mistralai.ChatMistralAI.html)

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
- [Hooks](#hooks)
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