How to pass tool outputs to chat models | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to pass tool outputs to chat modelsPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Tools](/docs/concepts/tools)
- [Tool calling](/docs/concepts/tool_calling)
- [Using chat models to call tools](/docs/how_to/tool_calling)
- [Defining custom tools](/docs/how_to/custom_tools/)

Some models are capable of [tool calling](/docs/concepts/tool_calling) - generating arguments that conform to a specific user-provided schema. This guide will demonstrate how to use those tool calls to actually call a function and properly pass the results back to the model.

![ ](/assets/images/tool_invocation-7f277888701ee431a17607f1a035c080.png)

![ ](/assets/images/tool_results-71b4b90f33a56563c102d91e7821a993.png)

First, let’s define our tools and our model:

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const addTool = tool(
  async ({ a, b }) => {
    return a + b;
  },
  {
    name: "add",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    description: "Adds a and b.",
  }
);

const multiplyTool = tool(
  async ({ a, b }) => {
    return a * b;
  },
  {
    name: "multiply",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    description: "Multiplies a and b.",
  }
);

const tools = [addTool, multiplyTool];

```

### Pick your chat model: - Groq - OpenAI - Anthropic - Google Gemini - FireworksAI - MistralAI - VertexAI #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

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

const llm = new ChatGroq({
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

const llm = new ChatOpenAI({
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

const llm = new ChatAnthropic({
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

const llm = new ChatGoogleGenerativeAI({
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

const llm = new ChatFireworks({
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

const llm = new ChatMistralAI({
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

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```Now, let’s get the model to call a tool. We’ll add it to a list of messages that we’ll treat as conversation history:

```typescript
import { HumanMessage } from "@langchain/core/messages";

const llmWithTools = llm.bindTools(tools);

const messages = [new HumanMessage("What is 3 * 12? Also, what is 11 + 49?")];

const aiMessage = await llmWithTools.invoke(messages);

console.log(aiMessage);

messages.push(aiMessage);

```

```text
AIMessage {
  "id": "chatcmpl-9p1NbC7sfZP0FE0bNfFiVYbPuWivg",
  "content": "",
  "additional_kwargs": {
    "tool_calls": [
      {
        "id": "call_RbUuLMYf3vgcdSQ8bhy1D5Ty",
        "type": "function",
        "function": "[Object]"
      },
      {
        "id": "call_Bzz1qgQjTlQIHMcEaDAdoH8X",
        "type": "function",
        "function": "[Object]"
      }
    ]
  },
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 50,
      "promptTokens": 87,
      "totalTokens": 137
    },
    "finish_reason": "tool_calls",
    "system_fingerprint": "fp_400f27fa1f"
  },
  "tool_calls": [
    {
      "name": "multiply",
      "args": {
        "a": 3,
        "b": 12
      },
      "type": "tool_call",
      "id": "call_RbUuLMYf3vgcdSQ8bhy1D5Ty"
    },
    {
      "name": "add",
      "args": {
        "a": 11,
        "b": 49
      },
      "type": "tool_call",
      "id": "call_Bzz1qgQjTlQIHMcEaDAdoH8X"
    }
  ],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 87,
    "output_tokens": 50,
    "total_tokens": 137
  }
}
2

```Next let’s invoke the tool functions using the args the model populated!

Conveniently, if we invoke a LangChain `Tool` with a `ToolCall`, we’ll automatically get back a `ToolMessage` that can be fed back to the model:

CompatibilityThis functionality requires `@langchain/core>=0.2.16`. Please see here for a [guide on upgrading](/docs/how_to/installation/#installing-integration-packages).

If you are on earlier versions of `@langchain/core`, you will need to access construct a `ToolMessage` manually using fields from the tool call.

```typescript
const toolsByName = {
  add: addTool,
  multiply: multiplyTool,
};

for (const toolCall of aiMessage.tool_calls) {
  const selectedTool = toolsByName[toolCall.name];
  const toolMessage = await selectedTool.invoke(toolCall);
  messages.push(toolMessage);
}

console.log(messages);

```

```text
[
  HumanMessage {
    "content": "What is 3 * 12? Also, what is 11 + 49?",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "id": "chatcmpl-9p1NbC7sfZP0FE0bNfFiVYbPuWivg",
    "content": "",
    "additional_kwargs": {
      "tool_calls": [
        {
          "id": "call_RbUuLMYf3vgcdSQ8bhy1D5Ty",
          "type": "function",
          "function": "[Object]"
        },
        {
          "id": "call_Bzz1qgQjTlQIHMcEaDAdoH8X",
          "type": "function",
          "function": "[Object]"
        }
      ]
    },
    "response_metadata": {
      "tokenUsage": {
        "completionTokens": 50,
        "promptTokens": 87,
        "totalTokens": 137
      },
      "finish_reason": "tool_calls",
      "system_fingerprint": "fp_400f27fa1f"
    },
    "tool_calls": [
      {
        "name": "multiply",
        "args": {
          "a": 3,
          "b": 12
        },
        "type": "tool_call",
        "id": "call_RbUuLMYf3vgcdSQ8bhy1D5Ty"
      },
      {
        "name": "add",
        "args": {
          "a": 11,
          "b": 49
        },
        "type": "tool_call",
        "id": "call_Bzz1qgQjTlQIHMcEaDAdoH8X"
      }
    ],
    "invalid_tool_calls": [],
    "usage_metadata": {
      "input_tokens": 87,
      "output_tokens": 50,
      "total_tokens": 137
    }
  },
  ToolMessage {
    "content": "36",
    "name": "multiply",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_call_id": "call_RbUuLMYf3vgcdSQ8bhy1D5Ty"
  },
  ToolMessage {
    "content": "60",
    "name": "add",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_call_id": "call_Bzz1qgQjTlQIHMcEaDAdoH8X"
  }
]

```And finally, we’ll invoke the model with the tool results. The model will use this information to generate a final answer to our original query:

```typescript
await llmWithTools.invoke(messages);

```

```text
AIMessage {
  "id": "chatcmpl-9p1NttGpWjx1cQoVIDlMhumYq12Pe",
  "content": "3 * 12 is 36, and 11 + 49 is 60.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 19,
      "promptTokens": 153,
      "totalTokens": 172
    },
    "finish_reason": "stop",
    "system_fingerprint": "fp_18cc0f1fa0"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 153,
    "output_tokens": 19,
    "total_tokens": 172
  }
}

```Note that each `ToolMessage` must include a `tool_call_id` that matches an `id` in the original tool calls that the model generates. This helps the model match tool responses with tool calls.

Tool calling agents, like those in [LangGraph](https://langchain-ai.github.io/langgraphjs/tutorials/introduction/), use this basic flow to answer queries and solve tasks.

## Related[​](#related)

You’ve now seen how to pass tool calls back to a model.

These guides may interest you next:

- [LangGraph quickstart](https://langchain-ai.github.io/langgraphjs/tutorials/introduction/)
- Few shot prompting [with tools](/docs/how_to/tools_few_shot/)
- Stream [tool calls](/docs/how_to/tool_streaming/)
- Pass [runtime values to tools](/docs/how_to/tool_runtime)
- Getting [structured outputs](/docs/how_to/structured_output/) from models

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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