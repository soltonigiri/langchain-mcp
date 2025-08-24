How to use chat models to call tools | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to use chat models to call toolsPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)[LangChain Tools](/docs/concepts/tools)[Tool calling](/docs/concepts/tool_calling)[Tool calling](/docs/concepts/tool_calling) allows a chat model to respond to a given prompt by “calling a tool”.Remember, while the name “tool calling” implies that the model is directly performing some action, this is actually not the case! The model only generates the arguments to a tool, and actually running the tool (or not) is up to the user.Tool calling is a general technique that generates structured output from a model, and you can use it even when you don’t intend to invoke any tools. An example use-case of that is [extraction from unstructured text](/docs/tutorials/extraction/).![ ](/assets/images/tool_call-8d4a8b18e90cacd03f62e94071eceace.png)If you want to see how to use the model-generated tool call to actually run a tool function [check out this guide](/docs/how_to/tool_results_pass_to_model/).Supported modelsTool calling is not universal, but is supported by many popular LLM providers, including [Anthropic](/docs/integrations/chat/anthropic/), [Cohere](/docs/integrations/chat/cohere/), [Google](/docs/integrations/chat/google_vertex_ai/), [Mistral](/docs/integrations/chat/mistral/), [OpenAI](/docs/integrations/chat/openai/), and even for locally-running models via [Ollama](/docs/integrations/chat/ollama/).You can find a [list of all models that support tool calling here](/docs/integrations/chat/).LangChain implements standard interfaces for defining tools, passing them to LLMs, and representing tool calls. This guide will cover how to bind tools to an LLM, then invoke the LLM to generate these arguments.LangChain implements standard interfaces for defining tools, passing them to LLMs, and representing tool calls. This guide will show you how to use them.Passing tools to chat models[​](#passing-tools-to-chat-models)Chat models that support tool calling features implement a [.bindTools()](https://api.js.langchain.com/classes/langchain_core.language_models_chat_models.BaseChatModel.html#bindTools) method, which receives a list of LangChain [tool objects](https://api.js.langchain.com/classes/langchain_core.tools.StructuredTool.html) and binds them to the chat model in its expected format. Subsequent invocations of the chat model will include tool schemas in its calls to the LLM.noteAs of @langchain/core version 0.2.9, all chat models with tool calling capabilities now support [OpenAI-formatted tools](https://api.js.langchain.com/interfaces/langchain_core.language_models_base.ToolDefinition.html).Let’s walk through an example:Pick your chat model:AnthropicOpenAIMistralAIFireworksAIInstall dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/anthropic @langchain/core

```

```bash
yarn add @langchain/anthropic @langchain/core

```

```bash
pnpm add @langchain/anthropic @langchain/core

```Add environment variables

```bash
ANTHROPIC_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const llm = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/openai @langchain/core

```

```bash
yarn add @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/core

```Add environment variables

```bash
OPENAI_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/mistralai @langchain/core

```

```bash
yarn add @langchain/mistralai @langchain/core

```

```bash
pnpm add @langchain/mistralai @langchain/core

```Add environment variables

```bash
MISTRAL_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/community @langchain/core

```

```bash
yarn add @langchain/community @langchain/core

```

```bash
pnpm add @langchain/community @langchain/core

```Add environment variables

```bash
FIREWORKS_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const llm = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0
});

```We can use the .bindTools() method to handle the conversion from LangChain tool to our model provider’s specific format and bind it to the model (i.e., passing it in each time the model is invoked). A number of models implement helper methods that will take care of formatting and binding different function-like objects to the model. Let’s create a new tool implementing a Zod schema, then bind it to the model:noteThe tool function is available in @langchain/core version 0.2.7 and above.If you are on an older version of core, you should use instantiate and use [DynamicStructuredTool](https://api.js.langchain.com/classes/langchain_core.tools.DynamicStructuredTool.html) instead.

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

/**
 * Note that the descriptions here are crucial, as they will be passed along
 * to the model along with the class name.
 */
const calculatorSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
});

const calculatorTool = tool(
  async ({ operation, number1, number2 }) => {
    // Functions must return strings
    if (operation === "add") {
      return `${number1 + number2}`;
    } else if (operation === "subtract") {
      return `${number1 - number2}`;
    } else if (operation === "multiply") {
      return `${number1 * number2}`;
    } else if (operation === "divide") {
      return `${number1 / number2}`;
    } else {
      throw new Error("Invalid operation.");
    }
  },
  {
    name: "calculator",
    description: "Can perform mathematical operations.",
    schema: calculatorSchema,
  }
);

const llmWithTools = llm.bindTools([calculatorTool]);

```Now, let’s invoke it! We expect the model to use the calculator to answer the question:

```typescript
const res = await llmWithTools.invoke("What is 3 * 12");

console.log(res);

```

```text
AIMessage {
  "id": "chatcmpl-9p1Ib4xfxV4yahv2ZWm1IRb1fRVD7",
  "content": "",
  "additional_kwargs": {
    "tool_calls": [
      {
        "id": "call_CrZkMP0AvUrz7w9kim0splbl",
        "type": "function",
        "function": "[Object]"
      }
    ]
  },
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 24,
      "promptTokens": 93,
      "totalTokens": 117
    },
    "finish_reason": "tool_calls",
    "system_fingerprint": "fp_400f27fa1f"
  },
  "tool_calls": [
    {
      "name": "calculator",
      "args": {
        "operation": "multiply",
        "number1": 3,
        "number2": 12
      },
      "type": "tool_call",
      "id": "call_CrZkMP0AvUrz7w9kim0splbl"
    }
  ],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 93,
    "output_tokens": 24,
    "total_tokens": 117
  }
}

```As we can see our LLM generated arguments to a tool!Note:** If you are finding that the model does not call a desired tool for a given prompt, you can see [this guide on how to force the LLM to call a tool](/docs/how_to/tool_choice/) rather than letting it decide.tipSee a LangSmith trace for the above [here](https://smith.langchain.com/public/b2222205-7da9-4a5a-8efe-6bc62347705d/r). ## Tool calls[​](#tool-calls) If tool calls are included in a LLM response, they are attached to the corresponding [message](https://api.js.langchain.com/classes/langchain_core.messages.AIMessage.html) or [message chunk](https://api.js.langchain.com/classes/langchain_core.messages.AIMessageChunk.html) as a list of [tool call](https://api.js.langchain.com/types/langchain_core.messages_tool.ToolCall.html) objects in the .tool_calls attribute.A ToolCall is a typed dict that includes a tool name, dict of argument values, and (optionally) an identifier. Messages with no tool calls default to an empty list for this attribute.Chat models can call multiple tools at once. Here’s an example:

```typescript
const res = await llmWithTools.invoke("What is 3 * 12? Also, what is 11 + 49?");

res.tool_calls;

```

```text
[
  {
    name: &#x27;calculator&#x27;,
    args: { operation: &#x27;multiply&#x27;, number1: 3, number2: 12 },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_01lvdk2COLV2hTjRUNAX8XWH&#x27;
  },
  {
    name: &#x27;calculator&#x27;,
    args: { operation: &#x27;add&#x27;, number1: 11, number2: 49 },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_fB0vo8VC2HRojZcj120xIBxM&#x27;
  }
]

```The .tool_calls attribute should contain valid tool calls. Note that on occasion, model providers may output malformed tool calls (e.g., arguments that are not valid JSON). When parsing fails in these cases, instances of [InvalidToolCall](https://api.js.langchain.com/types/langchain_core.messages_tool.InvalidToolCall.html) are populated in the .invalid_tool_calls attribute. An InvalidToolCall can have a name, string arguments, identifier, and error message. ## Binding model-specific formats (advanced)[​](#binding-model-specific-formats-advanced) Providers adopt different conventions for formatting tool schemas. For instance, OpenAI uses a format like this:type: The type of the tool. At the time of writing, this is always “function”.
- function: An object containing tool parameters.
- function.name: The name of the schema to output.
- function.description: A high level description of the schema to output.
- function.parameters: The nested details of the schema you want to extract, formatted as a [JSON schema](https://json-schema.org/) object.

We can bind this model-specific format directly to the model if needed. Here’s an example:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o" });

const modelWithTools = model.bind({
  tools: [
    {
      type: "function",
      function: {
        name: "calculator",
        description: "Can perform mathematical operations.",
        parameters: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              description: "The type of operation to execute.",
              enum: ["add", "subtract", "multiply", "divide"],
            },
            number1: { type: "number", description: "First integer" },
            number2: { type: "number", description: "Second integer" },
          },
          required: ["number1", "number2"],
        },
      },
    },
  ],
});

await modelWithTools.invoke(`Whats 119 times 8?`);

```

```text
AIMessage {
  "id": "chatcmpl-9p1IeP7mIp3jPn1wgsP92zxEfNo7k",
  "content": "",
  "additional_kwargs": {
    "tool_calls": [
      {
        "id": "call_P5Xgyi0Y7IfisaUmyapZYT7d",
        "type": "function",
        "function": "[Object]"
      }
    ]
  },
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 24,
      "promptTokens": 85,
      "totalTokens": 109
    },
    "finish_reason": "tool_calls",
    "system_fingerprint": "fp_400f27fa1f"
  },
  "tool_calls": [
    {
      "name": "calculator",
      "args": {
        "operation": "multiply",
        "number1": 119,
        "number2": 8
      },
      "type": "tool_call",
      "id": "call_P5Xgyi0Y7IfisaUmyapZYT7d"
    }
  ],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 85,
    "output_tokens": 24,
    "total_tokens": 109
  }
}

```This is functionally equivalent to the `bind_tools()` calls above.

## Next steps[​](#next-steps)

Now you’ve learned how to bind tool schemas to a chat model and have the model call the tool.

Next, check out this guide on actually using the tool by invoking the function and passing the results back to the model:

- Pass [tool results back to model](/docs/how_to/tool_results_pass_to_model)

You can also check out some more specific uses of tool calling:

- Few shot prompting [with tools](/docs/how_to/tools_few_shot/)
- Stream [tool calls](/docs/how_to/tool_streaming/)
- Pass [runtime values to tools](/docs/how_to/tool_runtime)
- Getting [structured outputs](/docs/how_to/structured_output/) from models

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Passing tools to chat models](#passing-tools-to-chat-models)
- [Tool calls](#tool-calls)
- [Binding model-specific formats (advanced)](#binding-model-specific-formats-advanced)
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