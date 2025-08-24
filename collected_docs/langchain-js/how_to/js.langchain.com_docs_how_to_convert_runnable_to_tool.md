How to convert Runnables to Tools | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to convert Runnables to ToolsPrerequisitesThis guide assumes familiarity with the following concepts:Runnables](/docs/concepts/runnables)
- [Tools](/docs/concepts/tools)
- [Agents](https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/)

For convenience, `Runnables` that accept a string or object input can be converted to tools using the [asTool](https://api.js.langchain.com/classes/langchain_core.runnables.Runnable.html#asTool) method, which allows for the specification of names, descriptions, and additional schema information for arguments.

Here we will demonstrate how to use this method to convert a LangChain `Runnable` into a tool that can be used by agents, chains, or chat models.

CompatibilityThis functionality requires `@langchain/core>=0.2.16`. Please see here for a [guide on upgrading](/docs/how_to/installation/#installing-integration-packages).

## asTool[​](#astool)

Tools have some additional requirements over general Runnables:

- Their inputs are constrained to be serializable, specifically strings and objects;
- They contain names and descriptions indicating how and when they should be used;
- They contain a detailed schema property for their arguments. That is, while a tool (as a Runnable) might accept a single object input, the specific keys and type information needed to populate an object should be specified in the schema field.

The `asTool()` method therefore requires this additional information to create a tool from a runnable. Here’s a basic example:

```typescript
import { RunnableLambda } from "@langchain/core/runnables";
import { z } from "zod";

const schema = z.object({
  a: z.number(),
  b: z.array(z.number()),
});

const runnable = RunnableLambda.from((input: z.infer<typeof schema>) => {
  return input.a * Math.max(...input.b);
});

const asTool = runnable.asTool({
  name: "My tool",
  description: "Explanation of when to use the tool.",
  schema,
});

asTool.description;

```

```text
Explanation of when to use the tool.

```

```typescript
await asTool.invoke({ a: 3, b: [1, 2] });

```

```text
6

```Runnables that take string inputs are also supported:

```typescript
const firstRunnable = RunnableLambda.from<string, string>((input) => {
  return input + "a";
});

const secondRunnable = RunnableLambda.from<string, string>((input) => {
  return input + "z";
});

const runnable = firstRunnable.pipe(secondRunnable);
const asTool = runnable.asTool({
  name: "append_letters",
  description: "Adds letters to a string.",
  schema: z.string(),
});

asTool.description;

```

```text
Adds letters to a string.

```

```typescript
await asTool.invoke("b");

```

```text
baz

``` ## In an agents[​](#in-an-agents) Below we will incorporate LangChain Runnables as tools in an [agent](/docs/concepts/agents) application. We will demonstrate with:

- a document [retriever](/docs/concepts/retrievers);
- a simple [RAG](/docs/tutorials/rag/) chain, allowing an agent to delegate relevant queries to it.

We first instantiate a chat model that supports [tool calling](/docs/how_to/tool_calling/):

Following the [RAG tutorial](/docs/tutorials/rag/), let’s first construct a retriever:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({ model: "gpt-3.5-turbo-0125", temperature: 0 });

import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const documents = [
  new Document({
    pageContent:
      "Dogs are great companions, known for their loyalty and friendliness.",
  }),
  new Document({
    pageContent: "Cats are independent pets that often enjoy their own space.",
  }),
];

const vectorstore = await MemoryVectorStore.fromDocuments(
  documents,
  new OpenAIEmbeddings()
);

const retriever = vectorstore.asRetriever({
  k: 1,
  searchType: "similarity",
});

```

We next create a pre-built [LangGraph agent](/docs/how_to/migrate_agent/) and provide it with the tool:

```typescript
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const tools = [
  retriever.asTool({
    name: "pet_info_retriever",
    description: "Get information about pets.",
    schema: z.string(),
  }),
];

const agent = createReactAgent({ llm: llm, tools });

const stream = await agent.stream({
  messages: [["human", "What are dogs known for?"]],
});

for await (const chunk of stream) {
  // Log output from the agent or tools node
  if (chunk.agent) {
    console.log("AGENT:", chunk.agent.messages[0]);
  } else if (chunk.tools) {
    console.log("TOOLS:", chunk.tools.messages[0]);
  }
  console.log("----");
}

```

```text
AGENT: AIMessage {
  "id": "chatcmpl-9m9RIN1GQVeXcrVdp0lNBTcZFVHb9",
  "content": "",
  "additional_kwargs": {
    "tool_calls": [
      {
        "id": "call_n30LPDbegmytrj5GdUxZt9xn",
        "type": "function",
        "function": "[Object]"
      }
    ]
  },
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 17,
      "promptTokens": 52,
      "totalTokens": 69
    },
    "finish_reason": "tool_calls"
  },
  "tool_calls": [
    {
      "name": "pet_info_retriever",
      "args": {
        "input": "dogs"
      },
      "type": "tool_call",
      "id": "call_n30LPDbegmytrj5GdUxZt9xn"
    }
  ],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 52,
    "output_tokens": 17,
    "total_tokens": 69
  }
}
----
TOOLS: ToolMessage {
  "content": "[{\"pageContent\":\"Dogs are great companions, known for their loyalty and friendliness.\",\"metadata\":{}}]",
  "name": "pet_info_retriever",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_call_id": "call_n30LPDbegmytrj5GdUxZt9xn"
}
----
AGENT: AIMessage {
  "id": "chatcmpl-9m9RJ3TT3ITfv6R0Tb7pcrNOUtnm8",
  "content": "Dogs are known for being great companions, known for their loyalty and friendliness.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 18,
      "promptTokens": 104,
      "totalTokens": 122
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 104,
    "output_tokens": 18,
    "total_tokens": 122
  }
}
----

```This [LangSmith trace](https://smith.langchain.com/public/5e141617-ae82-44af-8fe0-b64dbd007826/r) shows what’s going on under the hood for the above run.

Going further, we can even create a tool from a full [RAG chain](/docs/tutorials/rag/):

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const SYSTEM_TEMPLATE = `
You are an assistant for question-answering tasks.
Use the below context to answer the question. If
you don&#x27;t know the answer, say you don&#x27;t know.
Use three sentences maximum and keep the answer
concise.

Answer in the style of {answer_style}.

Context: {context}`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_TEMPLATE],
  ["human", "{question}"],
]);

const ragChain = RunnableSequence.from([
  {
    context: (input, config) => retriever.invoke(input.question, config),
    question: (input) => input.question,
    answer_style: (input) => input.answer_style,
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

```

Below we again invoke the agent. Note that the agent populates the required parameters in its `tool_calls`:

```typescript
const ragTool = ragChain.asTool({
  name: "pet_expert",
  description: "Get information about pets.",
  schema: z.object({
    context: z.string(),
    question: z.string(),
    answer_style: z.string(),
  }),
});

const agent = createReactAgent({ llm: llm, tools: [ragTool] });

const stream = await agent.stream({
  messages: [["human", "What would a pirate say dogs are known for?"]],
});

for await (const chunk of stream) {
  // Log output from the agent or tools node
  if (chunk.agent) {
    console.log("AGENT:", chunk.agent.messages[0]);
  } else if (chunk.tools) {
    console.log("TOOLS:", chunk.tools.messages[0]);
  }
  console.log("----");
}

```

```text
AGENT: AIMessage {
  "id": "chatcmpl-9m9RKY2nAa8LeGoBiO7N1SR4nAoED",
  "content": "",
  "additional_kwargs": {
    "tool_calls": [
      {
        "id": "call_ukzivO4jRn1XdDpuVTI6CvtU",
        "type": "function",
        "function": "[Object]"
      }
    ]
  },
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 30,
      "promptTokens": 63,
      "totalTokens": 93
    },
    "finish_reason": "tool_calls"
  },
  "tool_calls": [
    {
      "name": "pet_expert",
      "args": {
        "context": "pirate",
        "question": "What are dogs known for?",
        "answer_style": "short"
      },
      "type": "tool_call",
      "id": "call_ukzivO4jRn1XdDpuVTI6CvtU"
    }
  ],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 63,
    "output_tokens": 30,
    "total_tokens": 93
  }
}
----
TOOLS: ToolMessage {
  "content": "Dogs are known for their loyalty, companionship, and ability to provide emotional support to their owners.",
  "name": "pet_expert",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_call_id": "call_ukzivO4jRn1XdDpuVTI6CvtU"
}
----
AGENT: AIMessage {
  "id": "chatcmpl-9m9RMwAEc14TTKtitq3CH2x9wpGik",
  "content": "A pirate would say that dogs are known for their loyalty, companionship, and ability to provide emotional support to their owners.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 26,
      "promptTokens": 123,
      "totalTokens": 149
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 123,
    "output_tokens": 26,
    "total_tokens": 149
  }
}
----

```See this [LangSmith trace](https://smith.langchain.com/public/147ae4e6-4dfb-4dd9-8ca0-5c5b954f08ac/r) for the above run to see what’s going on internally.

## Related[​](#related)

- [How to: create custom tools](/docs/how_to/custom_tools)
- [How to: pass tool results back to model](/docs/how_to/tool_results_pass_to_model/)
- [How to: stream events from child runs within a custom tool](/docs/how_to/tool_stream_events)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [asTool](#astool)
- [In an agents](#in-an-agents)
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