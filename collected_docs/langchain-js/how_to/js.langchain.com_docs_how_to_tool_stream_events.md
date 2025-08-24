How to stream events from a tool | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to stream events from a toolPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Tools](/docs/concepts/tools)
- [Custom tools](/docs/how_to/custom_tools)
- [Using stream events](/docs/how_to/streaming/#using-stream-events)
- [Accessing RunnableConfig within a custom tool](/docs/how_to/tool_configure/)

If you have tools that call chat models, retrievers, or other runnables, you may want to access internal events from those runnables or configure them with additional properties. This guide shows you how to manually pass parameters properly so that you can do this using the [.streamEvents()](/docs/how_to/streaming/#using-stream-events) method.

CompatibilityIn order to support a wider variety of JavaScript environments, the base LangChain package does not automatically propagate configuration to child runnables by default. This includes callbacks necessary for `.streamEvents()`. This is a common reason why you may fail to see events being emitted from custom runnables or tools.

You will need to manually propagate the `RunnableConfig` object to the child runnable. For an example of how to manually propagate the config, see the implementation of the `bar` RunnableLambda below.

This guide also requires `@langchain/core>=0.2.16`.

Say you have a custom tool that calls a chain that condenses its input by prompting a chat model to return only 10 words, then reversing the output. First, define it in a naive way:

### Pick your chat model:

- Groq
- OpenAI
- Anthropic
- Google Gemini
- FireworksAI
- MistralAI
- VertexAI

#### Install dependencies

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/groq

```

```bash
yarn add @langchain/groq

```

```bash
pnpm add @langchain/groq

``` #### Add environment variables

```bash
GROQ_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/openai

```

```bash
yarn add @langchain/openai

```

```bash
pnpm add @langchain/openai

``` #### Add environment variables

```bash
OPENAI_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/anthropic

```

```bash
yarn add @langchain/anthropic

```

```bash
pnpm add @langchain/anthropic

``` #### Add environment variables

```bash
ANTHROPIC_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/google-genai

```

```bash
yarn add @langchain/google-genai

```

```bash
pnpm add @langchain/google-genai

``` #### Add environment variables

```bash
GOOGLE_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

``` #### Add environment variables

```bash
FIREWORKS_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const model = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/mistralai

```

```bash
yarn add @langchain/mistralai

```

```bash
pnpm add @langchain/mistralai

``` #### Add environment variables

```bash
MISTRAL_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/google-vertexai

```

```bash
yarn add @langchain/google-vertexai

```

```bash
pnpm add @langchain/google-vertexai

``` #### Add environment variables

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json

``` #### Instantiate the model

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0,
});

```

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const specialSummarizationTool = tool(
  async (input) => {
    const prompt = ChatPromptTemplate.fromTemplate(
      "You are an expert writer. Summarize the following text in 10 words or less:\n\n{long_text}"
    );
    const reverse = (x: string) => {
      return x.split("").reverse().join("");
    };
    const chain = prompt
      .pipe(model)
      .pipe(new StringOutputParser())
      .pipe(reverse);
    const summary = await chain.invoke({ long_text: input.long_text });
    return summary;
  },
  {
    name: "special_summarization_tool",
    description: "A tool that summarizes input text using advanced techniques.",
    schema: z.object({
      long_text: z.string(),
    }),
  }
);

```Invoking the tool directly works just fine:

```typescript
const LONG_TEXT = `
NARRATOR:
(Black screen with text; The sound of buzzing bees can be heard)
According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don&#x27;t care what humans think is impossible.
BARRY BENSON:
(Barry is picking out a shirt)
Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let&#x27;s shake it up a little.
JANET BENSON:
Barry! Breakfast is ready!
BARRY:
Coming! Hang on a second.`;

await specialSummarizationTool.invoke({ long_text: LONG_TEXT });

```

```text
.yad noitaudarg rof tiftuo sesoohc yrraB ;scisyhp seifed eeB

```But if you wanted to access the raw output from the chat model rather than the full tool, you might try to use the [.streamEvents()](/docs/how_to/streaming/#using-stream-events) method and look for an `on_chat_model_end` event. Here’s what happens:

```typescript
const stream = await specialSummarizationTool.streamEvents(
  { long_text: LONG_TEXT },
  { version: "v2" }
);

for await (const event of stream) {
  if (event.event === "on_chat_model_end") {
    // Never triggers!
    console.log(event);
  }
}

```

You’ll notice that there are no chat model events emitted from the child run!

This is because the example above does not pass the tool’s config object into the internal chain. To fix this, redefine your tool to take a special parameter typed as `RunnableConfig` (see [this guide](/docs/how_to/tool_configure) for more details). You’ll also need to pass that parameter through into the internal chain when executing it:

```typescript
const specialSummarizationToolWithConfig = tool(
  async (input, config) => {
    const prompt = ChatPromptTemplate.fromTemplate(
      "You are an expert writer. Summarize the following text in 10 words or less:\n\n{long_text}"
    );
    const reverse = (x: string) => {
      return x.split("").reverse().join("");
    };
    const chain = prompt
      .pipe(model)
      .pipe(new StringOutputParser())
      .pipe(reverse);
    // Pass the "config" object as an argument to any executed runnables
    const summary = await chain.invoke({ long_text: input.long_text }, config);
    return summary;
  },
  {
    name: "special_summarization_tool",
    description: "A tool that summarizes input text using advanced techniques.",
    schema: z.object({
      long_text: z.string(),
    }),
  }
);

```

And now try the same `.streamEvents()` call as before with your new tool:

```typescript
const stream = await specialSummarizationToolWithConfig.streamEvents(
  { long_text: LONG_TEXT },
  { version: "v2" }
);

for await (const event of stream) {
  if (event.event === "on_chat_model_end") {
    // Never triggers!
    console.log(event);
  }
}

```

```text
{
  event: &#x27;on_chat_model_end&#x27;,
  data: {
    output: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;Bee defies physics; Barry chooses outfit for graduation day.&#x27;,
      name: undefined,
      additional_kwargs: [Object],
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: [Object]
    },
    input: { messages: [Array] }
  },
  run_id: &#x27;27ac7b2e-591c-4adc-89ec-64d96e233ec8&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}

```Awesome! This time there’s an event emitted.

For streaming, `.streamEvents()` automatically calls internal runnables in a chain with streaming enabled if possible, so if you wanted to a stream of tokens as they are generated from the chat model, you could simply filter to look for `on_chat_model_stream` events with no other changes:

```typescript
const stream = await specialSummarizationToolWithConfig.streamEvents(
  { long_text: LONG_TEXT },
  { version: "v2" }
);

for await (const event of stream) {
  if (event.event === "on_chat_model_stream") {
    // Never triggers!
    console.log(event);
  }
}

```

```text
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;Bee&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; def&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;ies physics&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;;&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; Barry&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; cho&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;oses outfit&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; for&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; graduation&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; day&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;.&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: {},
      id: undefined,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;938c0469-83c6-4dbd-862e-cd73381165de&#x27;,
  name: &#x27;ChatAnthropic&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {
    ls_provider: &#x27;anthropic&#x27;,
    ls_model_name: &#x27;claude-3-5-sonnet-20240620&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 0,
    ls_max_tokens: 2048,
    ls_stop: undefined
  }
}

``` ## Automatically passing config (Advanced)[​](#automatically-passing-config-advanced) If you’ve used [LangGraph](https://langchain-ai.github.io/langgraphjs/), you may have noticed that you don’t need to pass config in nested calls. This is because LangGraph takes advantage of an API called [async_hooks](https://nodejs.org/api/async_hooks.html), which is not supported in many, but not all environments.

If you wish, you can enable automatic configuration passing by running the following code to import and enable `AsyncLocalStorage` globally:

```typescript
import { AsyncLocalStorageProviderSingleton } from "@langchain/core/singletons";
import { AsyncLocalStorage } from "async_hooks";

AsyncLocalStorageProviderSingleton.initializeGlobalInstance(
  new AsyncLocalStorage()
);

```

## Next steps[​](#next-steps) You’ve now seen how to stream events from within a tool. Next, check out the following guides for more on using tools:

- Pass [runtime values to tools](/docs/how_to/tool_runtime)
- Pass [tool results back to a model](/docs/how_to/tool_results_pass_to_model)
- [Dispatch custom callback events](/docs/how_to/callbacks_custom_events)

You can also check out some more specific uses of tool calling:

- Building [tool-using chains and agents](/docs/how_to#tools)
- Getting [structured outputs](/docs/how_to/structured_output/) from models

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Automatically passing config (Advanced)](#automatically-passing-config-advanced)
- [Next steps](#next-steps)

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