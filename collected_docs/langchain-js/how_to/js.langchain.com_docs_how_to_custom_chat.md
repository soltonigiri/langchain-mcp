Richer outputs | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to create a custom chat model classPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)

This notebook goes over how to create a custom chat model wrapper, in case you want to use your own chat model or a different wrapper than one that is directly supported in LangChain.

There are a few required things that a chat model needs to implement after extending the [SimpleChatModel class](https://api.js.langchain.com/classes/langchain_core.language_models_chat_models.SimpleChatModel.html):

- A _call method that takes in a list of messages and call options (which includes things like stop sequences), and returns a string.
- A _llmType method that returns a string. Used for logging purposes only.

You can also implement the following optional method:

- A _streamResponseChunks method that returns an AsyncGenerator and yields [ChatGenerationChunks](https://api.js.langchain.com/classes/langchain_core.outputs.ChatGenerationChunk.html). This allows the LLM to support streaming outputs.

Let’s implement a very simple custom chat model that just echoes back the first `n` characters of the input.

```typescript
import {
  SimpleChatModel,
  type BaseChatModelParams,
} from "@langchain/core/language_models/chat_models";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { AIMessageChunk, type BaseMessage } from "@langchain/core/messages";
import { ChatGenerationChunk } from "@langchain/core/outputs";

interface CustomChatModelInput extends BaseChatModelParams {
  n: number;
}

class CustomChatModel extends SimpleChatModel {
  n: number;

  constructor(fields: CustomChatModelInput) {
    super(fields);
    this.n = fields.n;
  }

  _llmType() {
    return "custom";
  }

  async _call(
    messages: BaseMessage[],
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): Promise<string> {
    if (!messages.length) {
      throw new Error("No messages provided.");
    }
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());
    if (typeof messages[0].content !== "string") {
      throw new Error("Multimodal messages are not supported.");
    }
    return messages[0].content.slice(0, this.n);
  }

  async *_streamResponseChunks(
    messages: BaseMessage[],
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): AsyncGenerator<ChatGenerationChunk> {
    if (!messages.length) {
      throw new Error("No messages provided.");
    }
    if (typeof messages[0].content !== "string") {
      throw new Error("Multimodal messages are not supported.");
    }
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());
    for (const letter of messages[0].content.slice(0, this.n)) {
      yield new ChatGenerationChunk({
        message: new AIMessageChunk({
          content: letter,
        }),
        text: letter,
      });
      // Trigger the appropriate callback for new chunks
      await runManager?.handleLLMNewToken(letter);
    }
  }
}

```

We can now use this as any other chat model:

```typescript
const chatModel = new CustomChatModel({ n: 4 });

await chatModel.invoke([["human", "I am an LLM"]]);

```

```text
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;I am&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;I am&#x27;,
  name: undefined,
  additional_kwargs: {},
  response_metadata: {},
  id: undefined,
  tool_calls: [],
  invalid_tool_calls: [],
  usage_metadata: undefined
}

```And support streaming:

```typescript
const stream = await chatModel.stream([["human", "I am an LLM"]]);

for await (const chunk of stream) {
  console.log(chunk);
}

```

```text
AIMessageChunk {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;I&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    tool_call_chunks: [],
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;I&#x27;,
  name: undefined,
  additional_kwargs: {},
  response_metadata: {},
  id: undefined,
  tool_calls: [],
  invalid_tool_calls: [],
  tool_call_chunks: [],
  usage_metadata: undefined
}
AIMessageChunk {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27; &#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    tool_call_chunks: [],
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27; &#x27;,
  name: undefined,
  additional_kwargs: {},
  response_metadata: {},
  id: undefined,
  tool_calls: [],
  invalid_tool_calls: [],
  tool_call_chunks: [],
  usage_metadata: undefined
}
AIMessageChunk {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;a&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    tool_call_chunks: [],
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;a&#x27;,
  name: undefined,
  additional_kwargs: {},
  response_metadata: {},
  id: undefined,
  tool_calls: [],
  invalid_tool_calls: [],
  tool_call_chunks: [],
  usage_metadata: undefined
}
AIMessageChunk {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;m&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    tool_call_chunks: [],
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;m&#x27;,
  name: undefined,
  additional_kwargs: {},
  response_metadata: {},
  id: undefined,
  tool_calls: [],
  invalid_tool_calls: [],
  tool_call_chunks: [],
  usage_metadata: undefined
}

```If you want to take advantage of LangChain’s callback system for functionality like token tracking, you can extend the [BaseChatModel](https://api.js.langchain.com/classes/langchain_core.language_models_chat_models.BaseChatModel.html) class and implement the lower level `_generate` method. It also takes a list of `BaseMessage`s as input, but requires you to construct and return a `ChatGeneration` object that permits additional metadata. Here’s an example:

```typescript
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { ChatResult } from "@langchain/core/outputs";
import {
  BaseChatModel,
  BaseChatModelCallOptions,
  BaseChatModelParams,
} from "@langchain/core/language_models/chat_models";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";

interface AdvancedCustomChatModelOptions extends BaseChatModelCallOptions {}

interface AdvancedCustomChatModelParams extends BaseChatModelParams {
  n: number;
}

class AdvancedCustomChatModel extends BaseChatModel<AdvancedCustomChatModelOptions> {
  n: number;

  static lc_name(): string {
    return "AdvancedCustomChatModel";
  }

  constructor(fields: AdvancedCustomChatModelParams) {
    super(fields);
    this.n = fields.n;
  }

  async _generate(
    messages: BaseMessage[],
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): Promise<ChatResult> {
    if (!messages.length) {
      throw new Error("No messages provided.");
    }
    if (typeof messages[0].content !== "string") {
      throw new Error("Multimodal messages are not supported.");
    }
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());
    const content = messages[0].content.slice(0, this.n);
    const tokenUsage = {
      usedTokens: this.n,
    };
    return {
      generations: [{ message: new AIMessage({ content }), text: content }],
      llmOutput: { tokenUsage },
    };
  }

  _llmType(): string {
    return "advanced_custom_chat_model";
  }
}

```

This will pass the additional returned information in callback events and in the `streamEvents method:

```typescript
const chatModel = new AdvancedCustomChatModel({ n: 4 });

const eventStream = await chatModel.streamEvents([["human", "I am an LLM"]], {
  version: "v2",
});

for await (const event of eventStream) {
  if (event.event === "on_chat_model_end") {
    console.log(JSON.stringify(event, null, 2));
  }
}

```

```text
{
  "event": "on_chat_model_end",
  "data": {
    "output": {
      "lc": 1,
      "type": "constructor",
      "id": [
        "langchain_core",
        "messages",
        "AIMessage"
      ],
      "kwargs": {
        "content": "I am",
        "tool_calls": [],
        "invalid_tool_calls": [],
        "additional_kwargs": {},
        "response_metadata": {
          "tokenUsage": {
            "usedTokens": 4
          }
        }
      }
    }
  },
  "run_id": "11dbdef6-1b91-407e-a497-1a1ce2974788",
  "name": "AdvancedCustomChatModel",
  "tags": [],
  "metadata": {
    "ls_model_type": "chat"
  }
}

``` ## Tracing (advanced)[​](#tracing-advanced) If you are implementing a custom chat model and want to use it with a tracing service like [LangSmith](https://smith.langchain.com/), you can automatically log params used for a given invocation by implementing the `invocationParams()` method on the model.

This method is purely optional, but anything it returns will be logged as metadata for the trace.

Here’s one pattern you might use:

```typescript
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import {
  BaseChatModel,
  type BaseChatModelCallOptions,
  type BaseChatModelParams,
} from "@langchain/core/language_models/chat_models";
import { BaseMessage } from "@langchain/core/messages";
import { ChatResult } from "@langchain/core/outputs";

interface CustomChatModelOptions extends BaseChatModelCallOptions {
  // Some required or optional inner args
  tools: Record<string, any>[];
}

interface CustomChatModelParams extends BaseChatModelParams {
  temperature: number;
  n: number;
}

class CustomChatModel extends BaseChatModel<CustomChatModelOptions> {
  temperature: number;

  n: number;

  static lc_name(): string {
    return "CustomChatModel";
  }

  constructor(fields: CustomChatModelParams) {
    super(fields);
    this.temperature = fields.temperature;
    this.n = fields.n;
  }

  // Anything returned in this method will be logged as metadata in the trace.
  // It is common to pass it any options used to invoke the function.
  invocationParams(options?: this["ParsedCallOptions"]) {
    return {
      tools: options?.tools,
      n: this.n,
    };
  }

  async _generate(
    messages: BaseMessage[],
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): Promise<ChatResult> {
    if (!messages.length) {
      throw new Error("No messages provided.");
    }
    if (typeof messages[0].content !== "string") {
      throw new Error("Multimodal messages are not supported.");
    }
    const additionalParams = this.invocationParams(options);
    const content = await someAPIRequest(messages, additionalParams);
    return {
      generations: [{ message: new AIMessage({ content }), text: content }],
      llmOutput: {},
    };
  }

  _llmType(): string {
    return "advanced_custom_chat_model";
  }
}

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Tracing (advanced)](#tracing-advanced)

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