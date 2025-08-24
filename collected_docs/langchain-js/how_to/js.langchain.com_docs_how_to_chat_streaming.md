How to stream chat model responses | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to stream chat model responsesAll chat models](https://api.js.langchain.com/classes/langchain_core.language_models_chat_models.BaseChatModel.html) implement the [Runnable interface](https://.api.js.langchain.com/classes/langchain_core.runnables.Runnable.html), which comes with default** implementations of standard runnable methods (i.e. invoke, batch, stream, streamEvents). This guide covers how to use these methods to stream output from chat models.tipThe **default** implementation does **not** provide support for token-by-token streaming, and will instead return an [AsyncGenerator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator) that will yield all model output in a single chunk. It exists to ensures that the the model can be swapped in for any other model as it supports the same standard interface.The ability to stream the output token-by-token depends on whether the provider has implemented token-by-token streaming support.You can see which [integrations support token-by-token streaming here](/docs/integrations/chat/). ## Streaming[​](#streaming) Below, we use a --- to help visualize the delimiter between tokens. ### Pick your chat model: Groq
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
const stream = await model.stream(
  "Write me a 1 verse song about goldfish on the moon"
);

for await (const chunk of stream) {
  console.log(`${chunk.content}\n---`);
}

```

```text
---
Here&#x27;s
---
 a one
---
-
---
verse song about goldfish on
---
 the moon:

Verse
---
:
Swimming
---
 through the stars
---
,
---
 in
---
 a cosmic
---
 lag
---
oon
---

Little
---
 golden
---
 scales
---
,
---
 reflecting the moon
---

No
---
 gravity to
---
 hold them,
---
 they
---
 float with
---
 glee
Goldfish
---
 astron
---
auts, on a lunar
---
 sp
---
ree
---

Bub
---
bles rise
---
 like
---
 com
---
ets, in the
---
 star
---
ry night
---

Their fins like
---
 tiny
---
 rockets, a
---
 w
---
ondrous sight
Who
---
 knew
---
 these
---
 small
---
 creatures
---
,
---
 could con
---
quer space?
---

Goldfish on the moon,
---
 with
---
 such
---
 fis
---
hy grace
---

---

---

``` ## Stream events[​](#stream-events) Chat models also support the standard [streamEvents()](https://api.js.langchain.com/classes/langchain_core.runnables.Runnable.html#streamEvents) method to stream more granular events from within chains.

This method is useful if you’re streaming output from a larger LLM application that contains multiple steps (e.g., a chain composed of a prompt, chat model and parser):

```typescript
const eventStream = await model.streamEvents(
  "Write me a 1 verse song about goldfish on the moon",
  {
    version: "v2",
  }
);

const events = [];
for await (const event of eventStream) {
  events.push(event);
}

events.slice(0, 3);

```

```text
[
  {
    event: "on_chat_model_start",
    data: { input: "Write me a 1 verse song about goldfish on the moon" },
    name: "ChatAnthropic",
    tags: [],
    run_id: "d60a87d6-acf0-4ae1-bf27-e570aa101960",
    metadata: {
      ls_provider: "openai",
      ls_model_name: "claude-3-5-sonnet-20240620",
      ls_model_type: "chat",
      ls_temperature: 1,
      ls_max_tokens: 2048,
      ls_stop: undefined
    }
  },
  {
    event: "on_chat_model_stream",
    run_id: "d60a87d6-acf0-4ae1-bf27-e570aa101960",
    name: "ChatAnthropic",
    tags: [],
    metadata: {
      ls_provider: "openai",
      ls_model_name: "claude-3-5-sonnet-20240620",
      ls_model_type: "chat",
      ls_temperature: 1,
      ls_max_tokens: 2048,
      ls_stop: undefined
    },
    data: {
      chunk: AIMessageChunk {
        lc_serializable: true,
        lc_kwargs: {
          content: "",
          additional_kwargs: [Object],
          tool_calls: [],
          invalid_tool_calls: [],
          tool_call_chunks: [],
          response_metadata: {}
        },
        lc_namespace: [ "langchain_core", "messages" ],
        content: "",
        name: undefined,
        additional_kwargs: {
          id: "msg_01JaaH9ZUXg7bUnxzktypRak",
          type: "message",
          role: "assistant",
          model: "claude-3-5-sonnet-20240620"
        },
        response_metadata: {},
        id: undefined,
        tool_calls: [],
        invalid_tool_calls: [],
        tool_call_chunks: [],
        usage_metadata: undefined
      }
    }
  },
  {
    event: "on_chat_model_stream",
    run_id: "d60a87d6-acf0-4ae1-bf27-e570aa101960",
    name: "ChatAnthropic",
    tags: [],
    metadata: {
      ls_provider: "openai",
      ls_model_name: "claude-3-5-sonnet-20240620",
      ls_model_type: "chat",
      ls_temperature: 1,
      ls_max_tokens: 2048,
      ls_stop: undefined
    },
    data: {
      chunk: AIMessageChunk {
        lc_serializable: true,
        lc_kwargs: {
          content: "Here&#x27;s",
          additional_kwargs: {},
          tool_calls: [],
          invalid_tool_calls: [],
          tool_call_chunks: [],
          response_metadata: {}
        },
        lc_namespace: [ "langchain_core", "messages" ],
        content: "Here&#x27;s",
        name: undefined,
        additional_kwargs: {},
        response_metadata: {},
        id: undefined,
        tool_calls: [],
        invalid_tool_calls: [],
        tool_call_chunks: [],
        usage_metadata: undefined
      }
    }
  }
]

``` ## Next steps[​](#next-steps) You’ve now seen a few ways you can stream chat model responses.

Next, check out this guide for more on [streaming with other LangChain modules](/docs/how_to/streaming).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Streaming](#streaming)
- [Stream events](#stream-events)
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