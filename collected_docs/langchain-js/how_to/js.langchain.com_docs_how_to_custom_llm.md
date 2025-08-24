Richer outputs | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[How to create a custom LLM classPrerequisitesThis guide assumes familiarity with the following concepts:LLMs](/docs/concepts/text_llms)

This notebook goes over how to create a custom LLM wrapper, in case you want to use your own LLM or a different wrapper than one that is directly supported in LangChain.

There are a few required things that a custom LLM needs to implement after extending the [LLM class](https://api.js.langchain.com/classes/langchain_core.language_models_llms.LLM.html):

- A _call method that takes in a string and call options (which includes things like stop sequences), and returns a string.
- A _llmType method that returns a string. Used for logging purposes only.

You can also implement the following optional method:

- A _streamResponseChunks method that returns an AsyncIterator and yields [GenerationChunks](https://api.js.langchain.com/classes/langchain_core.outputs.GenerationChunk.html). This allows the LLM to support streaming outputs.

Let’s implement a very simple custom LLM that just echoes back the first `n` characters of the input.

```typescript
import { LLM, type BaseLLMParams } from "@langchain/core/language_models/llms";
import type { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { GenerationChunk } from "@langchain/core/outputs";

interface CustomLLMInput extends BaseLLMParams {
  n: number;
}

class CustomLLM extends LLM {
  n: number;

  constructor(fields: CustomLLMInput) {
    super(fields);
    this.n = fields.n;
  }

  _llmType() {
    return "custom";
  }

  async _call(
    prompt: string,
    options: this["ParsedCallOptions"],
    runManager: CallbackManagerForLLMRun
  ): Promise<string> {
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());
    return prompt.slice(0, this.n);
  }

  async *_streamResponseChunks(
    prompt: string,
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): AsyncGenerator<GenerationChunk> {
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());
    for (const letter of prompt.slice(0, this.n)) {
      yield new GenerationChunk({
        text: letter,
      });
      // Trigger the appropriate callback
      await runManager?.handleLLMNewToken(letter);
    }
  }
}

```

We can now use this as any other LLM:

```typescript
const llm = new CustomLLM({ n: 4 });

await llm.invoke("I am an LLM");

```

```text
I am

```And support streaming:

```typescript
const stream = await llm.stream("I am an LLM");

for await (const chunk of stream) {
  console.log(chunk);
}

```

```text
I

a
m

```If you want to take advantage of LangChain’s callback system for functionality like token tracking, you can extend the [BaseLLM](https://api.js.langchain.com/classes/langchain_core.language_models_llms.BaseLLM.html) class and implement the lower level `_generate` method. Rather than taking a single string as input and a single string output, it can take multiple input strings and map each to multiple string outputs. Additionally, it returns a `Generation` output with fields for additional metadata rather than just a string.

```typescript
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { LLMResult } from "@langchain/core/outputs";
import {
  BaseLLM,
  BaseLLMCallOptions,
  BaseLLMParams,
} from "@langchain/core/language_models/llms";

interface AdvancedCustomLLMCallOptions extends BaseLLMCallOptions {}

interface AdvancedCustomLLMParams extends BaseLLMParams {
  n: number;
}

class AdvancedCustomLLM extends BaseLLM<AdvancedCustomLLMCallOptions> {
  n: number;

  constructor(fields: AdvancedCustomLLMParams) {
    super(fields);
    this.n = fields.n;
  }

  _llmType() {
    return "advanced_custom_llm";
  }

  async _generate(
    inputs: string[],
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): Promise<LLMResult> {
    const outputs = inputs.map((input) => input.slice(0, this.n));
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());

    // One input could generate multiple outputs.
    const generations = outputs.map((output) => [
      {
        text: output,
        // Optional additional metadata for the generation
        generationInfo: { outputCount: 1 },
      },
    ]);
    const tokenUsage = {
      usedTokens: this.n,
    };
    return {
      generations,
      llmOutput: { tokenUsage },
    };
  }
}

```

This will pass the additional returned information in callback events and in the `streamEvents method:

```typescript
const llm = new AdvancedCustomLLM({ n: 4 });

const eventStream = await llm.streamEvents("I am an LLM", {
  version: "v2",
});

for await (const event of eventStream) {
  if (event.event === "on_llm_end") {
    console.log(JSON.stringify(event, null, 2));
  }
}

```

```text
{
  "event": "on_llm_end",
  "data": {
    "output": {
      "generations": [
        [
          {
            "text": "I am",
            "generationInfo": {
              "outputCount": 1
            }
          }
        ]
      ],
      "llmOutput": {
        "tokenUsage": {
          "usedTokens": 4
        }
      }
    }
  },
  "run_id": "a9ce50e4-f85b-41eb-bcbe-793efc52f9d8",
  "name": "AdvancedCustomLLM",
  "tags": [],
  "metadata": {}
}

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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