ChatAnthropic | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatAnthropicAnthropic](https://www.anthropic.com/) is an AI safety and research company. They are the creator of Claude.This will help you getting started with Anthropic [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatAnthropic features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_anthropic.ChatAnthropic.html).Overview[​](#overview)Integration details[​](#integration-details)ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/anthropic/)Package downloadsPackage latest[ChatAnthropic](https://api.js.langchain.com/classes/langchain_anthropic.ChatAnthropic.html)[@langchain/anthropic](https://www.npmjs.com/package/@langchain/anthropic)❌✅✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/anthropic?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/anthropic?style=flat-square&label=%20&.png)Model features[​](#model-features)See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌✅❌❌✅✅❌Setup[​](#setup)You’ll need to sign up and obtain an [Anthropic API key](https://www.anthropic.com/), and install the @langchain/anthropic integration package.Credentials[​](#credentials)Head to [Anthropic’s website](https://www.anthropic.com/) to sign up to Anthropic and generate an API key. Once you’ve done this set the ANTHROPIC_API_KEY environment variable:

```bash
export ANTHROPIC_API_KEY="your-api-key"

```If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

```Installation[​](#installation)The LangChain ChatAnthropic integration lives in the @langchain/anthropic package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/anthropic @langchain/core

```

```bash
yarn add @langchain/anthropic @langchain/core

```

```bash
pnpm add @langchain/anthropic @langchain/core

```Instantiation[​](#instantiation)Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const llm = new ChatAnthropic({
  model: "claude-3-haiku-20240307",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  // other params...
});

```Invocation[​](#invocation)

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
  "id": "msg_013WBXXiggy6gMbAUY6NpsuU",
  "content": "Voici la traduction en français :\n\nJ&#x27;adore la programmation.",
  "additional_kwargs": {
    "id": "msg_013WBXXiggy6gMbAUY6NpsuU",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-haiku-20240307",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 29,
      "output_tokens": 20
    }
  },
  "response_metadata": {
    "id": "msg_013WBXXiggy6gMbAUY6NpsuU",
    "model": "claude-3-haiku-20240307",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 29,
      "output_tokens": 20
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 29,
    "output_tokens": 20,
    "total_tokens": 49
  }
}

```

```typescript
console.log(aiMsg.content);

```

```text
Voici la traduction en français :

J&#x27;adore la programmation.

```Chaining[​](#chaining)We can [chain](/docs/how_to/sequence/) our model with a prompt template like so:

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
  "id": "msg_01Ca52fpd1mcGRhH4spzAWr4",
  "content": "Ich liebe das Programmieren.",
  "additional_kwargs": {
    "id": "msg_01Ca52fpd1mcGRhH4spzAWr4",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-haiku-20240307",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 23,
      "output_tokens": 11
    }
  },
  "response_metadata": {
    "id": "msg_01Ca52fpd1mcGRhH4spzAWr4",
    "model": "claude-3-haiku-20240307",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 23,
      "output_tokens": 11
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 23,
    "output_tokens": 11,
    "total_tokens": 34
  }
}

```Content blocks[​](#content-blocks)One key difference to note between Anthropic models and most others is that the contents of a single Anthropic AI message can either be a single string or a list of content blocks**. For example when an Anthropic model [calls a tool](/docs/how_to/tool_calling), the tool invocation is part of the message content (as well as being exposed in the standardized AIMessage.tool_calls field):

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const calculatorSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
});

const calculatorTool = {
  name: "calculator",
  description: "A simple calculator tool",
  input_schema: zodToJsonSchema(calculatorSchema),
};

const toolCallingLlm = new ChatAnthropic({
  model: "claude-3-haiku-20240307",
}).bindTools([calculatorTool]);

const toolPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant who always needs to use a calculator.",
  ],
  ["human", "{input}"],
]);

// Chain your prompt and model together
const toolCallChain = toolPrompt.pipe(toolCallingLlm);

await toolCallChain.invoke({
  input: "What is 2 + 2?",
});

```

```text
AIMessage {
  "id": "msg_01DZGs9DyuashaYxJ4WWpWUP",
  "content": [
    {
      "type": "text",
      "text": "Here is the calculation for 2 + 2:"
    },
    {
      "type": "tool_use",
      "id": "toolu_01SQXBamkBr6K6NdHE7GWwF8",
      "name": "calculator",
      "input": {
        "number1": 2,
        "number2": 2,
        "operation": "add"
      }
    }
  ],
  "additional_kwargs": {
    "id": "msg_01DZGs9DyuashaYxJ4WWpWUP",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-haiku-20240307",
    "stop_reason": "tool_use",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 449,
      "output_tokens": 100
    }
  },
  "response_metadata": {
    "id": "msg_01DZGs9DyuashaYxJ4WWpWUP",
    "model": "claude-3-haiku-20240307",
    "stop_reason": "tool_use",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 449,
      "output_tokens": 100
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [
    {
      "name": "calculator",
      "args": {
        "number1": 2,
        "number2": 2,
        "operation": "add"
      },
      "id": "toolu_01SQXBamkBr6K6NdHE7GWwF8",
      "type": "tool_call"
    }
  ],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 449,
    "output_tokens": 100,
    "total_tokens": 549
  }
}

``` ## Custom headers[​](#custom-headers) You can pass custom headers in your requests like this:

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const llmWithCustomHeaders = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
  maxTokens: 1024,
  clientOptions: {
    defaultHeaders: {
      "X-Api-Key": process.env.ANTHROPIC_API_KEY,
    },
  },
});

await llmWithCustomHeaders.invoke("Why is the sky blue?");

```

```text
AIMessage {
  "id": "msg_019z4nWpShzsrbSHTWXWQh6z",
  "content": "The sky appears blue due to a phenomenon called Rayleigh scattering. Here&#x27;s a brief explanation:\n\n1) Sunlight is made up of different wavelengths of visible light, including all the colors of the rainbow.\n\n2) As sunlight passes through the atmosphere, the gases (mostly nitrogen and oxygen) cause the shorter wavelengths of light, such as violet and blue, to be scattered more easily than the longer wavelengths like red and orange.\n\n3) This scattering of the shorter blue wavelengths occurs in all directions by the gas molecules in the atmosphere.\n\n4) Our eyes are more sensitive to the scattered blue light than the scattered violet light, so we perceive the sky as having a blue color.\n\n5) The scattering is more pronounced for light traveling over longer distances through the atmosphere. This is why the sky appears even darker blue when looking towards the horizon.\n\nSo in essence, the selective scattering of the shorter blue wavelengths of sunlight by the gases in the atmosphere is what causes the sky to appear blue to our eyes during the daytime.",
  "additional_kwargs": {
    "id": "msg_019z4nWpShzsrbSHTWXWQh6z",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-sonnet-20240229",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 13,
      "output_tokens": 236
    }
  },
  "response_metadata": {
    "id": "msg_019z4nWpShzsrbSHTWXWQh6z",
    "model": "claude-3-sonnet-20240229",
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 13,
      "output_tokens": 236
    },
    "type": "message",
    "role": "assistant"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 13,
    "output_tokens": 236,
    "total_tokens": 249
  }
}

``` ## Prompt caching[​](#prompt-caching) CompatibilityThis feature is currently in beta.Anthropic supports [caching parts of your prompt](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) in order to reduce costs for use-cases that require long context. You can cache tools and both entire messages and individual blocks.The initial request containing one or more blocks or tool definitions with a "cache_control": { "type": "ephemeral" } field will automatically cache that part of the prompt. This initial caching step will cost extra, but subsequent requests will be billed at a reduced rate. The cache has a lifetime of 5 minutes, but this is refereshed each time the cache is hit.There is also currently a minimum cacheable prompt length, which varies according to model. You can see this information [here](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#structuring-your-prompt).This currently requires you to initialize your model with a beta header. Here’s an example of caching part of a system message that contains the LangChain [conceptual docs](/docs/concepts/):

```typescript
let CACHED_TEXT = "...";

```

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const modelWithCaching = new ChatAnthropic({
  model: "claude-3-haiku-20240307",
  clientOptions: {
    defaultHeaders: {
      "anthropic-beta": "prompt-caching-2024-07-31",
    },
  },
});

const LONG_TEXT = `You are a pirate. Always respond in pirate dialect.

Use the following as context when answering questions:

${CACHED_TEXT}`;

const messages = [
  {
    role: "system",
    content: [
      {
        type: "text",
        text: LONG_TEXT,
        // Tell Anthropic to cache this block
        cache_control: { type: "ephemeral" },
      },
    ],
  },
  {
    role: "user",
    content: "What types of messages are supported in LangChain?",
  },
];

const res = await modelWithCaching.invoke(messages);

console.log("USAGE:", res.response_metadata.usage);

```

```text
USAGE: {
  input_tokens: 19,
  cache_creation_input_tokens: 2921,
  cache_read_input_tokens: 0,
  output_tokens: 355
}

```We can see that there’s a new field called cache_creation_input_tokens in the raw usage field returned from Anthropic.If we use the same messages again, we can see that the long text’s input tokens are read from the cache:

```typescript
const res2 = await modelWithCaching.invoke(messages);

console.log("USAGE:", res2.response_metadata.usage);

```

```text
USAGE: {
  input_tokens: 19,
  cache_creation_input_tokens: 0,
  cache_read_input_tokens: 2921,
  output_tokens: 357
}

``` ### Tool caching[​](#tool-caching) You can also cache tools by setting the same "cache_control": { "type": "ephemeral" } within a tool definition. This currently requires you to bind a tool in [Anthropic’s raw tool format](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) Here’s an example:

```typescript
const SOME_LONG_DESCRIPTION = "...";

// Tool in Anthropic format
const anthropicTools = [
  {
    name: "get_weather",
    description: SOME_LONG_DESCRIPTION,
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Location to get the weather for",
        },
        unit: {
          type: "string",
          description: "Temperature unit to return",
        },
      },
      required: ["location"],
    },
    // Tell Anthropic to cache this tool
    cache_control: { type: "ephemeral" },
  },
];

const modelWithCachedTools = modelWithCaching.bindTools(anthropicTools);

await modelWithCachedTools.invoke("what is the weather in SF?");

```For more on how prompt caching works, see [Anthropic’s docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#how-prompt-caching-works). ## Custom clients[​](#custom-clients) Anthropic models [may be hosted on cloud services such as Google Vertex](https://docs.anthropic.com/en/api/claude-on-vertex-ai) that rely on a different underlying client with the same interface as the primary Anthropic client. You can access these services by providing a createClient method that returns an initialized instance of an Anthropic client. Here’s an example:

```typescript
import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";

const customClient = new AnthropicVertex();

const modelWithCustomClient = new ChatAnthropic({
  modelName: "claude-3-sonnet@20240229",
  maxRetries: 0,
  createClient: () => customClient,
});

await modelWithCustomClient.invoke([{ role: "user", content: "Hello!" }]);

``` ## Citations[​](#citations) Anthropic supports a [citations](https://docs.anthropic.com/en/docs/build-with-claude/citations) feature that lets Claude attach context to its answers based on source material supplied by the user. This source material can be provided either as [document content blocks](https://docs.anthropic.com/en/docs/build-with-claude/citations#document-types), which describe full documents, or as [search results](https://docs.anthropic.com/en/docs/build-with-claude/search-results), which describe relevant passages or snippets returned from a retrieval system. When "citations": { "enabled": true } is included in a query, Claude may generate direct citations to the provided material in its response. ### Document example[​](#document-example) In this example we pass a [plain text document](https://docs.anthropic.com/en/docs/build-with-claude/citations#plain-text-documents). In the background, Claude [automatically chunks](https://docs.anthropic.com/en/docs/build-with-claude/citations#plain-text-documents) the input text into sentences, which are used when generating citations.

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const citationsModel = new ChatAnthropic({
  model: "claude-3-5-haiku-latest",
});

const messagesWithCitations = [
  {
    role: "user",
    content: [
      {
        type: "document",
        source: {
          type: "text",
          media_type: "text/plain",
          data: "The grass is green. The sky is blue.",
        },
        title: "My Document",
        context: "This is a trustworthy document.",
        citations: {
          enabled: true,
        },
      },
      {
        type: "text",
        text: "What color is the grass and sky?",
      },
    ],
  },
];

const responseWithCitations = await citationsModel.invoke(
  messagesWithCitations
);

console.log(JSON.stringify(responseWithCitations.content, null, 2));

```

```text
[
  {
    "type": "text",
    "text": "Based on the document, I can tell you that:\n\n- "
  },
  {
    "type": "text",
    "text": "The grass is green",
    "citations": [
      {
        "type": "char_location",
        "cited_text": "The grass is green. ",
        "document_index": 0,
        "document_title": "My Document",
        "start_char_index": 0,
        "end_char_index": 20
      }
    ]
  },
  {
    "type": "text",
    "text": "\n- "
  },
  {
    "type": "text",
    "text": "The sky is blue",
    "citations": [
      {
        "type": "char_location",
        "cited_text": "The sky is blue.",
        "document_index": 0,
        "document_title": "My Document",
        "start_char_index": 20,
        "end_char_index": 36
      }
    ]
  }
]

``` ### Search results example[​](#search-results-example) In this example, we pass in [search results](https://docs.anthropic.com/en/docs/build-with-claude/search-results) as part of our message content. This allows Claude to cite specific passages or snippets from your own retrieval system in its response.This approach is helpful when you want Claude to cite information from a specific set of knowledge, but you want to bring your own pre-fetched/cached content directly rather than having the model search or retrieve them automatically.

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const citationsModel = new ChatAnthropic({
  model: "claude-3-5-haiku-latest",
  clientOptions: {
    defaultHeaders: {
      "anthropic-beta": "search-results-2025-06-09",
    },
  },
});

const messagesWithCitations = [
  {
    type: "user",
    content: [
      {
        type: "search_result",
        title: "History of France",
        source: "https://some-uri.com",
        citations: { enabled: true },
        content: [
          {
            type: "text",
            text: "The capital of France is Paris.",
          },
          {
            type: "text",
            text: "The old capital of France was Lyon.",
          },
        ],
      },
      {
        type: "text",
        text: "What is the capital of France?",
      },
    ],
  },
];

const responseWithCitations = await citationsModel.invoke(
  messagesWithCitations
);

console.log(JSON.stringify(responseWithCitations.content, null, 2));

``` #### Search results from a tool[​](#search-results-from-a-tool) You can also use a tool to provide search results that the model can cite in its responses. This is well suited for RAG (or [Retrieval-Augmented Generation](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)) workflows where Claude can decide when and where to retrieve information from. When returning this information as [search results](https://docs.anthropic.com/en/docs/build-with-claude/search-results), it gives Claude the ability to create citations from the material returned from the tool.Here’s how you can create a tool that returns search results in the format expected by Anthropic’s citations API:

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";

// Create a tool that returns search results
const ragTool = tool(
  () => [
    {
      type: "search_result",
      title: "History of France",
      source: "https://some-uri.com",
      citations: { enabled: true },
      content: [
        {
          type: "text",
          text: "The capital of France is Paris.",
        },
        {
          type: "text",
          text: "The old capital of France was Lyon.",
        },
      ],
    },
    {
      type: "search_result",
      title: "Geography of France",
      source: "https://some-uri.com",
      citations: { enabled: true },
      content: [
        {
          type: "text",
          text: "France is a country in Europe.",
        },
        {
          type: "text",
          text: "The capital of France is Paris.",
        },
      ],
    },
  ],
  {
    name: "my_rag_tool",
    description: "Retrieval system that accesses my knowledge base.",
    schema: z.object({
      query: z.string().describe("query to search in the knowledge base"),
    }),
  }
);

// Create model with search results beta header
const model = new ChatAnthropic({
  model: "claude-3-5-haiku-latest",
  clientOptions: {
    defaultHeaders: {
      "anthropic-beta": "search-results-2025-06-09",
    },
  },
}).bindTools([ragTool]);

const result = await model.invoke([
  {
    role: "user",
    content: "What is the capital of France?",
  },
]);

console.log(JSON.stringify(result.content, null, 2));

```Learn more about how RAG works in LangChain [here](https://js.langchain.com/docs/concepts/rag/)Learn more about tool calling [here](https://js.langchain.com/docs/how_to/tool_calling/) ### Using with text splitters[​](#using-with-text-splitters) Anthropic also lets you specify your own splits using [custom document](https://docs.anthropic.com/en/docs/build-with-claude/citations#custom-content-documents) types. LangChain [text splitters](/docs/concepts/text_splitters/) can be used to generate meaningful splits for this purpose. See the below example, where we split the LangChain.js README (a markdown document) and pass it to Claude as context:

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { MarkdownTextSplitter } from "langchain/text_splitter";

function formatToAnthropicDocuments(documents: string[]) {
  return {
    type: "document",
    source: {
      type: "content",
      content: documents.map((document) => ({ type: "text", text: document })),
    },
    citations: { enabled: true },
  };
}

// Pull readme
const readmeResponse = await fetch(
  "https://raw.githubusercontent.com/langchain-ai/langchainjs/master/README.md"
);

const readme = await readmeResponse.text();

// Split into chunks
const splitter = new MarkdownTextSplitter({
  chunkOverlap: 0,
  chunkSize: 50,
});
const documents = await splitter.splitText(readme);

// Construct message
const messageWithSplitDocuments = {
  role: "user",
  content: [
    formatToAnthropicDocuments(documents),
    {
      type: "text",
      text: "Give me a link to LangChain&#x27;s tutorials. Cite your sources",
    },
  ],
};

// Query LLM
const citationsModelWithSplits = new ChatAnthropic({
  model: "claude-3-5-sonnet-latest",
});
const resWithSplits = await citationsModelWithSplits.invoke([
  messageWithSplitDocuments,
]);

console.log(JSON.stringify(resWithSplits.content, null, 2));

```

```text
[
  {
    "type": "text",
    "text": "Based on the documentation, I can provide you with a link to LangChain&#x27;s tutorials:\n\n"
  },
  {
    "type": "text",
    "text": "The tutorials can be found at: https://js.langchain.com/docs/tutorials/",
    "citations": [
      {
        "type": "content_block_location",
        "cited_text": "[Tutorial](https://js.langchain.com/docs/tutorials/)walkthroughs",
        "document_index": 0,
        "document_title": null,
        "start_block_index": 191,
        "end_block_index": 194
      }
    ]
  }
]

``` ## API reference[​](#api-reference) For detailed documentation of all ChatAnthropic features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_anthropic.ChatAnthropic.html](https://api.js.langchain.com/classes/langchain_anthropic.ChatAnthropic.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/#chat-models)
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
- [Content blocks](#content-blocks)
- [Custom headers](#custom-headers)
- [Prompt caching](#prompt-caching)[Tool caching](#tool-caching)

- [Custom clients](#custom-clients)
- [Citations](#citations)[Document example](#document-example)
- [Search results example](#search-results-example)
- [Using with text splitters](#using-with-text-splitters)

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