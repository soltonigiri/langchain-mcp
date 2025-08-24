How to track token usage | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to track token usagePrerequisitesThis guide assumes familiarity with the following concepts:LLMs](/docs/concepts/text_llms)

This notebook goes over how to track your token usage for specific LLM calls. This is only implemented by some providers, including OpenAI.

Here&#x27;s an example of tracking token usage for a single LLM call via a callback:

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
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

const llm = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  callbacks: [
    {
      handleLLMEnd(output) {
        console.log(JSON.stringify(output, null, 2));
      },
    },
  ],
});

await llm.invoke("Tell me a joke.");

/*
  {
    "generations": [
      [
        {
          "text": "\n\nWhy don&#x27;t scientists trust atoms?\n\nBecause they make up everything.",
          "generationInfo": {
            "finishReason": "stop",
            "logprobs": null
          }
        }
      ]
    ],
    "llmOutput": {
      "tokenUsage": {
        "completionTokens": 14,
        "promptTokens": 5,
        "totalTokens": 19
      }
    }
  }
*/

``` #### API Reference: - OpenAI from @langchain/openai If this model is passed to a chain or agent that calls it multiple times, it will log an output each time.

## Next steps[​](#next-steps)

You&#x27;ve now seen how to get token usage for supported LLM providers.

Next, check out the other how-to guides in this section, like [how to implement your own custom LLM](/docs/how_to/custom_llm).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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