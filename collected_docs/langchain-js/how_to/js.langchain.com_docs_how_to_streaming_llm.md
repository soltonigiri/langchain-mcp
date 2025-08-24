How to stream responses from an LLM | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to stream responses from an LLMAll LLMs](https://api.js.langchain.com/classes/langchain_core.language_models_llms.BaseLLM.html) implement the [Runnable interface](https://api.js.langchain.com/classes/langchain_core.runnables.Runnable.html), which comes with default** implementations of standard runnable methods (i.e. ainvoke, batch, abatch, stream, astream, astream_events).The **default** streaming implementations provide an AsyncGenerator that yields a single value: the final output from the underlying chat model provider.The ability to stream the output token-by-token depends on whether the provider has implemented proper streaming support.See which [integrations support token-by-token streaming here](/docs/integrations/llms/).:::{.callout-note}The **default** implementation does **not** provide support for token-by-token streaming, but it ensures that the model can be swapped in for any other model as it supports the same standard interface.::: ## Using .stream()[​](#using-stream) The easiest way to stream is to use the .stream() method. This returns an readable stream that you can also iterate over:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- Yarn
- pnpm

```bash
npm install @langchain/openai @langchain/core

```

```bash
yarn add @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/core

```

```typescript
import { OpenAI } from "@langchain/openai";

const model = new OpenAI({
  maxTokens: 25,
});

const stream = await model.stream("Tell me a joke.");

for await (const chunk of stream) {
  console.log(chunk);
}

/*

Q
:
 What
 did
 the
 fish
 say
 when
 it
 hit
 the
 wall
?

A
:
 Dam
!
*/

``` #### API Reference: - OpenAI from @langchain/openai For models that do not support streaming, the entire response will be returned as a single chunk.

## Using a callback handler[​](#using-a-callback-handler)

You can also use a [CallbackHandler](https://api.js.langchain.com/classes/langchain_core.callbacks_base.BaseCallbackHandler.html) like so:

```typescript
import { OpenAI } from "@langchain/openai";

// To enable streaming, we pass in `streaming: true` to the LLM constructor.
// Additionally, we pass in a handler for the `handleLLMNewToken` event.
const model = new OpenAI({
  maxTokens: 25,
  streaming: true,
});

const response = await model.invoke("Tell me a joke.", {
  callbacks: [
    {
      handleLLMNewToken(token: string) {
        console.log({ token });
      },
    },
  ],
});
console.log(response);
/*
{ token: &#x27;\n&#x27; }
{ token: &#x27;\n&#x27; }
{ token: &#x27;Q&#x27; }
{ token: &#x27;:&#x27; }
{ token: &#x27; Why&#x27; }
{ token: &#x27; did&#x27; }
{ token: &#x27; the&#x27; }
{ token: &#x27; chicken&#x27; }
{ token: &#x27; cross&#x27; }
{ token: &#x27; the&#x27; }
{ token: &#x27; playground&#x27; }
{ token: &#x27;?&#x27; }
{ token: &#x27;\n&#x27; }
{ token: &#x27;A&#x27; }
{ token: &#x27;:&#x27; }
{ token: &#x27; To&#x27; }
{ token: &#x27; get&#x27; }
{ token: &#x27; to&#x27; }
{ token: &#x27; the&#x27; }
{ token: &#x27; other&#x27; }
{ token: &#x27; slide&#x27; }
{ token: &#x27;.&#x27; }

Q: Why did the chicken cross the playground?
A: To get to the other slide.
*/

```

#### API Reference: - OpenAI from @langchain/openai We still have access to the end `LLMResult` if using `generate`. However, `tokenUsage` may not be currently supported for all model providers when streaming.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Using .stream()](#using-stream)
- [Using a callback handler](#using-a-callback-handler)

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