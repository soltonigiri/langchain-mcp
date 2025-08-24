ChatOpenAI | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatOpenAIOpenAI](https://en.wikipedia.org/wiki/OpenAI) is an artificial intelligence (AI) research laboratory.This guide will help you getting started with ChatOpenAI [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatOpenAI features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_openai.ChatOpenAI.html).Overview[​](#overview)Integration details[​](#integration-details)ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/openai)Package downloadsPackage latest[ChatOpenAI](https://api.js.langchain.com/classes/langchain_openai.ChatOpenAI.html)[@langchain/openai](https://www.npmjs.com/package/@langchain/openai)❌✅✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/openai?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/openai?style=flat-square&label=%20&.png)Model features[​](#model-features)See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅✅❌❌✅✅✅Setup[​](#setup)To access OpenAI chat models you’ll need to create an OpenAI account, get an API key, and install the @langchain/openai integration package.Credentials[​](#credentials)Head to [OpenAI’s website](https://platform.openai.com/) to sign up for OpenAI and generate an API key. Once you’ve done this set the OPENAI_API_KEY environment variable:

```bash
export OPENAI_API_KEY="your-api-key"

```If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

```Installation[​](#installation)The LangChain ChatOpenAI integration lives in the @langchain/openai package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/openai @langchain/core

```

```bash
yarn add @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/core

```Instantiation[​](#instantiation)Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
  // other params...
});

```Invocation[​](#invocation)

```typescript
const aiMsg = await llm.invoke([
  {
    role: "system",
    content:
      "You are a helpful assistant that translates English to French. Translate the user sentence.",
  },
  {
    role: "user",
    content: "I love programming.",
  },
]);
aiMsg;

```

```text
AIMessage {
  "id": "chatcmpl-ADItECqSPuuEuBHHPjeCkh9wIO1H5",
  "content": "J&#x27;adore la programmation.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 5,
      "promptTokens": 31,
      "totalTokens": 36
    },
    "finish_reason": "stop",
    "system_fingerprint": "fp_5796ac6771"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 31,
    "output_tokens": 5,
    "total_tokens": 36
  }
}

```

```typescript
console.log(aiMsg.content);

```

```text
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
  "id": "chatcmpl-ADItFaWFNqkSjSmlxeGk6HxcBHzVN",
  "content": "Ich liebe Programmieren.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 5,
      "promptTokens": 26,
      "totalTokens": 31
    },
    "finish_reason": "stop",
    "system_fingerprint": "fp_5796ac6771"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 26,
    "output_tokens": 5,
    "total_tokens": 31
  }
}

```Custom URLs[​](#custom-urls)You can customize the base URL the SDK sends requests to by passing a configuration parameter like this:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llmWithCustomURL = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.9,
  configuration: {
    baseURL: "https://your_custom_url.com",
  },
});

await llmWithCustomURL.invoke("Hi there!");

```The configuration field also accepts other ClientOptions parameters accepted by the official SDK.If you are hosting on Azure OpenAI, see the [dedicated page instead](/docs/integrations/chat/azure).Custom headers[​](#custom-headers)You can specify custom headers in the same configuration field:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llmWithCustomHeaders = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.9,
  configuration: {
    defaultHeaders: {
      Authorization: `Bearer SOME_CUSTOM_VALUE`,
    },
  },
});

await llmWithCustomHeaders.invoke("Hi there!");

```Disabling streaming usage metadata[​](#disabling-streaming-usage-metadata)Some proxies or third-party providers present largely the same API interface as OpenAI, but don’t support the more recently added stream_options parameter to return streaming usage. You can use ChatOpenAI to access these providers by disabling streaming usage like this:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llmWithoutStreamUsage = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.9,
  streamUsage: false,
  configuration: {
    baseURL: "https://proxy.com",
  },
});

await llmWithoutStreamUsage.invoke("Hi there!");

```Calling fine-tuned models[​](#calling-fine-tuned-models)You can call fine-tuned OpenAI models by passing in your corresponding modelName parameter.This generally takes the form of ft:{OPENAI_MODEL_NAME}:{ORG_NAME}::{MODEL_ID}. For example:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const fineTunedLlm = new ChatOpenAI({
  temperature: 0.9,
  model: "ft:gpt-3.5-turbo-0613:{ORG_NAME}::{MODEL_ID}",
});

await fineTunedLlm.invoke("Hi there!");

```Generation metadata[​](#generation-metadata)If you need additional information like logprobs or token usage, these will be returned directly in the .invoke response within the response_metadata field on the message.tipRequires @langchain/core version >=0.1.48.

```typescript
import { ChatOpenAI } from "@langchain/openai";

// See https://cookbook.openai.com/examples/using_logprobs for details
const llmWithLogprobs = new ChatOpenAI({
  model: "gpt-4o",
  logprobs: true,
  // topLogprobs: 5,
});

const responseMessageWithLogprobs = await llmWithLogprobs.invoke("Hi there!");
console.dir(responseMessageWithLogprobs.response_metadata.logprobs, {
  depth: null,
});

```

```text
{
  content: [
    {
      token: &#x27;Hello&#x27;,
      logprob: -0.0004740447,
      bytes: [ 72, 101, 108, 108, 111 ],
      top_logprobs: []
    },
    {
      token: &#x27;!&#x27;,
      logprob: -0.00004334534,
      bytes: [ 33 ],
      top_logprobs: []
    },
    {
      token: &#x27; How&#x27;,
      logprob: -0.000030113732,
      bytes: [ 32, 72, 111, 119 ],
      top_logprobs: []
    },
    {
      token: &#x27; can&#x27;,
      logprob: -0.0004797665,
      bytes: [ 32, 99, 97, 110 ],
      top_logprobs: []
    },
    {
      token: &#x27; I&#x27;,
      logprob: -7.89631e-7,
      bytes: [ 32, 73 ],
      top_logprobs: []
    },
    {
      token: &#x27; assist&#x27;,
      logprob: -0.114006,
      bytes: [
         32,  97, 115,
        115, 105, 115,
        116
      ],
      top_logprobs: []
    },
    {
      token: &#x27; you&#x27;,
      logprob: -4.3202e-7,
      bytes: [ 32, 121, 111, 117 ],
      top_logprobs: []
    },
    {
      token: &#x27; today&#x27;,
      logprob: -0.00004501419,
      bytes: [ 32, 116, 111, 100, 97, 121 ],
      top_logprobs: []
    },
    {
      token: &#x27;?&#x27;,
      logprob: -0.000010206721,
      bytes: [ 63 ],
      top_logprobs: []
    }
  ],
  refusal: null
}

```Tool calling[​](#tool-calling)Tool calling with OpenAI models works in a similar to [other models](/docs/how_to/tool_calling). Additionally, the following guides have some information especially relevant to OpenAI:[How to: disable parallel tool calling](/docs/how_to/tool_calling_parallel/)[How to: force a tool call](/docs/how_to/tool_choice/)[How to: bind model-specific tool formats to a model](/docs/how_to/tool_calling#binding-model-specific-formats-advanced).Custom Tools[​](#custom-tools)[Custom tools](https://platform.openai.com/docs/guides/function-calling#custom-tools) support tools with arbitrary string inputs. They can be particularly useful when you expect your string arguments to be long or complex.If you use a model that supports custom tools, you can use the ChatOpenAI class and the customTool function to create a custom tool.

```typescript
import { ChatOpenAI, customTool } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const codeTool = customTool(
  async (input) => {
    // ... Add code to execute the input
    return "Code executed successfully";
  },
  {
    name: "execute_code",
    description: "Execute a code snippet",
    format: { type: "text" },
  }
);

const model = new ChatOpenAI({ model: "gpt-5" });

const agent = createReactAgent({
  llm: model,
  tools: [codeTool],
});

const result = await agent.invoke("Use the tool to calculate 3^3");
console.log(result);

```Context-free grammarsOpenAI supports the specification of a [context-free grammar](https://platform.openai.com/docs/guides/function-calling#context-free-grammars) for custom tool inputs in lark or regex format. See [OpenAI docs](https://platform.openai.com/docs/guides/function-calling#context-free-grammars) for details. The format parameter can be passed into customTool as shown below:

```typescript
import { ChatOpenAI, customTool } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const MATH_GRAMMAR = `
start: expr
expr: term (SP ADD SP term)* -> add
| term
term: factor (SP MUL SP factor)* -> mul
| factor
factor: INT
SP: \" \"
ADD: \"+\"
MUL: \"*\"
%import common.INT
`;

const doMath = customTool(
  async (input) => {
    // ... Add code to parse and execute the input
    return "27";
  },
  {
    name: "do_math",
    description: "Evaluate a math expression",
    format: { type: "grammar", grammar: MATH_GRAMMAR },
  }
);

const model = new ChatOpenAI({ model: "gpt-5" });

const agent = createReactAgent({
  llm: model,
  tools: [doMath],
});

const result = await agent.invoke("Use the tool to calculate 3^3");
console.log(result);

```strict: true[​](#strict-true)As of Aug 6, 2024, OpenAI supports a strict argument when calling tools that will enforce that the tool argument schema is respected by the model. See more here: [https://platform.openai.com/docs/guides/function-calling](https://platform.openai.com/docs/guides/function-calling).Requires @langchain/openai >= 0.2.6Note**: If strict: true the tool definition will also be validated, and a subset of JSON schema are accepted. Crucially, schema cannot have optional args (those with default values). Read the full docs on what types of schema are supported here: [https://platform.openai.com/docs/guides/structured-outputs/supported-schemas](https://platform.openai.com/docs/guides/structured-outputs/supported-schemas).Here’s an example with tool calling. Passing an extra strict: true argument to .bindTools will pass the param through to all tool definitions:

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const weatherTool = tool((_) => "no-op", {
  name: "get_current_weather",
  description: "Get the current weather",
  schema: z.object({
    location: z.string(),
  }),
});

const llmWithStrictTrue = new ChatOpenAI({
  model: "gpt-4o",
}).bindTools([weatherTool], {
  strict: true,
  tool_choice: weatherTool.name,
});

// Although the question is not about the weather, it will call the tool with the correct arguments
// because we passed `tool_choice` and `strict: true`.
const strictTrueResult = await llmWithStrictTrue.invoke(
  "What is 127862 times 12898 divided by 2?"
);

console.dir(strictTrueResult.tool_calls, { depth: null });

```**

```text
[
  {
    name: &#x27;get_current_weather&#x27;,
    args: { location: &#x27;current&#x27; },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_hVFyYNRwc6CoTgr9AQFQVjm9&#x27;
  }
]

```If you only want to apply this parameter to a select number of tools, you can also pass OpenAI formatted tool schemas directly:

```typescript
import { zodToJsonSchema } from "zod-to-json-schema";

const toolSchema = {
  type: "function",
  function: {
    name: "get_current_weather",
    description: "Get the current weather",
    strict: true,
    parameters: zodToJsonSchema(
      z.object({
        location: z.string(),
      })
    ),
  },
};

const llmWithStrictTrueTools = new ChatOpenAI({
  model: "gpt-4o",
}).bindTools([toolSchema], {
  strict: true,
});

const weatherToolResult = await llmWithStrictTrueTools.invoke([
  {
    role: "user",
    content: "What is the current weather in London?",
  },
]);

weatherToolResult.tool_calls;

```

```text
[
  {
    name: &#x27;get_current_weather&#x27;,
    args: { location: &#x27;London&#x27; },
    type: &#x27;tool_call&#x27;,
    id: &#x27;call_EOSejtax8aYtqpchY8n8O82l&#x27;
  }
]

```Structured output[​](#structured-output)We can also pass strict: true to the [.withStructuredOutput()](https://js.langchain.com/docs/how_to/structured_output/#the-.withstructuredoutput-method). Here’s an example:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const traitSchema = z.object({
  traits: z
    .array(z.string())
    .describe("A list of traits contained in the input"),
});

const structuredLlm = new ChatOpenAI({
  model: "gpt-4o-mini",
}).withStructuredOutput(traitSchema, {
  name: "extract_traits",
  strict: true,
});

await structuredLlm.invoke([
  {
    role: "user",
    content: `I am 6&#x27;5" tall and love fruit.`,
  },
]);

```

```text
{ traits: [ `6&#x27;5" tall`, &#x27;love fruit&#x27; ] }

```Responses API[​](#responses-api)CompatibilityThe below points apply to @langchain/openai>=0.4.5-rc.0. Please see here for a [guide on upgrading](/docs/how_to/installation/#installing-integration-packages).OpenAI supports a [Responses](https://platform.openai.com/docs/guides/responses-vs-chat-completions) API that is oriented toward building [agentic](/docs/concepts/agents/) applications. It includes a suite of [built-in tools](https://platform.openai.com/docs/guides/tools?api-mode=responses), including web and file search. It also supports management of [conversation state](https://platform.openai.com/docs/guides/conversation-state?api-mode=responses), allowing you to continue a conversational thread without explicitly passing in previous messages.ChatOpenAI will route to the Responses API if one of these features is used. You can also specify useResponsesApi: true when instantiating ChatOpenAI.Built-in tools[​](#built-in-tools)Equipping ChatOpenAI with built-in tools will ground its responses with outside information, such as via context in files or the web. The [AIMessage](/docs/concepts/messages/#aimessage) generated from the model will include information about the built-in tool invocation.Web search[​](#web-search)To trigger a web search, pass {"type": "web_search_preview"} to the model as you would another tool.You can also pass built-in tools as invocation params:

```ts
llm.invoke("...", { tools: [{ type: "web_search_preview" }] });

```

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({ model: "gpt-4o-mini" }).bindTools([
  { type: "web_search_preview" },
]);

await llm.invoke("What was a positive news story from today?");

```Note that the response includes structured [content blocks](/docs/concepts/messages/#content-1) that include both the text of the response and OpenAI [annotations](https://platform.openai.com/docs/guides/tools-web-search?api-mode=responses#output-and-citations) citing its sources. The output message will also contain information from any tool invocations.File search[​](#file-search)To trigger a file search, pass a [file search tool](https://platform.openai.com/docs/guides/tools-file-search) to the model as you would another tool. You will need to populate an OpenAI-managed vector store and include the vector store ID in the tool definition. See [OpenAI documentation](https://platform.openai.com/docs/guides/tools-file-search) for more details.

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({ model: "gpt-4o-mini" }).bindTools([
  { type: "file_search", vector_store_ids: ["vs..."] },
]);

await llm.invoke("Is deep research by OpenAI?");

```As with [web search](#web-search), the response will include content blocks with citations. It will also include information from the built-in tool invocations.Computer Use[​](#computer-use)ChatOpenAI supports the computer-use-preview model, which is a specialized model for the built-in computer use tool. To enable, pass a [computer use tool](https://platform.openai.com/docs/guides/tools-computer-use) as you would pass another tool.Currently tool outputs for computer use are present in AIMessage.additional_kwargs.tool_outputs. To reply to the computer use tool call, you need to set additional_kwargs.type: "computer_call_output" while creating a corresponding ToolMessage.See [OpenAI documentation](https://platform.openai.com/docs/guides/tools-computer-use) for more details.

```typescript
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import * as fs from "node:fs/promises";

const findComputerCall = (message: AIMessage) => {
  const toolOutputs = message.additional_kwargs.tool_outputs as
    | { type: "computer_call"; call_id: string; action: { type: string } }[]
    | undefined;

  return toolOutputs?.find((toolOutput) => toolOutput.type === "computer_call");
};

const llm = new ChatOpenAI({ model: "computer-use-preview" })
  .bindTools([
    {
      type: "computer-preview",
      display_width: 1024,
      display_height: 768,
      environment: "browser",
    },
  ])
  .bind({ truncation: "auto" });

let message = await llm.invoke("Check the latest OpenAI news on bing.com.");
const computerCall = findComputerCall(message);

if (computerCall) {
  // Act on a computer call action
  const screenshot = await fs.readFile("./screenshot.png", {
    encoding: "base64",
  });

  message = await llm.invoke(
    [
      new ToolMessage({
        additional_kwargs: { type: "computer_call_output" },
        tool_call_id: computerCall.call_id,
        content: [
          {
            type: "computer_screenshot",
            image_url: `data:image/png;base64,${screenshot}`,
          },
        ],
      }),
    ],
    { previous_response_id: message.response_metadata["id"] }
  );
}

```Code interpreter[​](#code-interpreter)ChatOpenAI allows you to use the built-in [code interpreter tool](https://platform.openai.com/docs/guides/tools-code-interpreter) to support the sandboxed generation and execution of code.

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "o4-mini",
  useResponsesApi: true,
});

const llmWithTools = llm.bindToools([
  {
    type: "code_interpreter",
    // Creates a new container
    container: { type: "auto" },
  },
]);

const response = await llmWithTools.invoke(
  "Write and run code to answer the question: what is 3^3?"
);

```Note that the above command creates a new [container](https://platform.openai.com/docs/guides/tools-code-interpreter#containers). We can re-use containers across calls by specifying an existing container ID.

```typescript
const tool_outputs: Record<string, any>[] =
  response.additional_kwargs.tool_outputs;
const container_id = tool_outputs[0].container_id;

const llmWithTools = llm.bindTools([
  {
    type: "code_interpreter",
    // Re-uses container from the last call
    container: container_id,
  },
]);

```Remote MCP[​](#remote-mcp)ChatOpenAI supports the built-in [remote MCP tool](https://platform.openai.com/docs/guides/tools-remote-mcp) that allows for model-generated calls to MCP servers to happen on OpenAI servers.

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "o4-mini",
  useResponsesApi: true,
});

const llmWithMcp = llm.bindTools([
  {
    type: "mcp",
    server_label: "deepwiki",
    server_url: "https://mcp.deepwiki.com/mcp",
    require_approval: "never",
  },
]);

const response = await llmWithMcp.invoke(
  "What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?"
);

```MCP ApprovalsWhen instructed, OpenAI will request approval before making calls to a remote MCP server.In the above command, we instructed the model to never require approval. We can also configure the model to always request approval, or to always request approval for specific tools:

```typescript
...
const llmWithMcp = llm.bindTools([
  {
    type: "mcp",
    server_label: "deepwiki",
    server_url: "https://mcp.deepwiki.com/mcp",
    require_approval: {
      always: {
        tool_names: ["read_wiki_structure"],
      },
    },
  },
]);
const response = await llmWithMcp.invoke(
    "What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?"
);

```With this configuration, responses can contain tool outputs typed as mcp_approval_request. To submit approvals for an approval request, you can structure it into a content block in a followup message:

```typescript
const approvals = [];
if (Array.isArray(response.additional_kwargs.tool_outputs)) {
  for (const content of response.additional_kwargs.tool_outputs) {
    if (content.type === "mcp_approval_request") {
      approvals.push({
        type: "mcp_approval_response",
        approval_request_id: content.id,
        approve: true,
      });
    }
  }
}

const nextResponse = await model.invoke([
  response,
  new HumanMessage({ content: approvals }),
]);

```Image Generation[​](#image-generation)ChatOpenAI allows you to bring the built-in [image generation tool](https://platform.openai.com/docs/guides/tools-image-generation) to create images as apart of multi-turn conversations through the responses API.

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-4.1",
  useResponsesApi: true,
});

const llmWithImageGeneration = llm.bindTools([
  {
    type: "image_generation",
    quality: "low",
  },
]);

const response = await llmWithImageGeneration.invoke(
  "Draw a random short word in green font."
);

```Reasoning models[​](#reasoning-models)CompatibilityThe below points apply to @langchain/openai>=0.4.0. Please see here for a [guide on upgrading](/docs/how_to/installation/#installing-integration-packages).When using reasoning models like o1, the default method for withStructuredOutput is OpenAI’s built-in method for structured output (equivalent to passing method: "jsonSchema" as an option into withStructuredOutput). JSON schema mostly works the same as other models, but with one important caveat: when defining schema, z.optional() is not respected, and you should instead use z.nullable().Here’s an example:

```typescript
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

// Will not work
const reasoningModelSchemaOptional = z.object({
  color: z.optional(z.string()).describe("A color mentioned in the input"),
});

const reasoningModelOptionalSchema = new ChatOpenAI({
  model: "o1",
}).withStructuredOutput(reasoningModelSchemaOptional, {
  name: "extract_color",
});

await reasoningModelOptionalSchema.invoke([
  {
    role: "user",
    content: `I am 6&#x27;5" tall and love fruit.`,
  },
]);

```

```text
{ color: &#x27;No color mentioned&#x27; }

```And here’s an example with z.nullable():

```typescript
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

// Will not work
const reasoningModelSchemaNullable = z.object({
  color: z.nullable(z.string()).describe("A color mentioned in the input"),
});

const reasoningModelNullableSchema = new ChatOpenAI({
  model: "o1",
}).withStructuredOutput(reasoningModelSchemaNullable, {
  name: "extract_color",
});

await reasoningModelNullableSchema.invoke([
  {
    role: "user",
    content: `I am 6&#x27;5" tall and love fruit.`,
  },
]);

```

```text
{ color: null }

```Prompt caching[​](#prompt-caching)Newer OpenAI models will automatically [cache parts of your prompt](https://openai.com/index/api-prompt-caching/) if your inputs are above a certain size (1024 tokens at the time of writing) in order to reduce costs for use-cases that require long context.Note:** The number of tokens cached for a given query is not yet standardized in AIMessage.usage_metadata, and is instead contained in the AIMessage.response_metadata field.Here’s an example

```typescript
import { ChatOpenAI } from "@langchain/openai";

const modelWithCaching = new ChatOpenAI({
  model: "gpt-4o-mini-2024-07-18",
});

// CACHED_TEXT is some string longer than 1024 tokens
const LONG_TEXT = `You are a pirate. Always respond in pirate dialect.

Use the following as context when answering questions:

${CACHED_TEXT}`;

const longMessages = [
  {
    role: "system",
    content: LONG_TEXT,
  },
  {
    role: "user",
    content: "What types of messages are supported in LangChain?",
  },
];

const originalRes = await modelWithCaching.invoke(longMessages);

console.log("USAGE:", originalRes.response_metadata.usage);

```

```text
USAGE: {
  prompt_tokens: 2624,
  completion_tokens: 263,
  total_tokens: 2887,
  prompt_tokens_details: { cached_tokens: 0 },
  completion_tokens_details: { reasoning_tokens: 0 }
}

```

```typescript
const resWitCaching = await modelWithCaching.invoke(longMessages);

console.log("USAGE:", resWitCaching.response_metadata.usage);

```

```text
USAGE: {
  prompt_tokens: 2624,
  completion_tokens: 272,
  total_tokens: 2896,
  prompt_tokens_details: { cached_tokens: 2432 },
  completion_tokens_details: { reasoning_tokens: 0 }
}

``` ## Predicted output[​](#predicted-output) Some OpenAI models (such as their gpt-4o and gpt-4o-mini series) support [Predicted Outputs](https://platform.openai.com/docs/guides/latency-optimization#use-predicted-outputs), which allow you to pass in a known portion of the LLM’s expected output ahead of time to reduce latency. This is useful for cases such as editing text or code, where only a small part of the model’s output will change.Here’s an example:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const modelWithPredictions = new ChatOpenAI({
  model: "gpt-4o-mini",
});

const codeSample = `
/// <summary>
/// Represents a user with a first name, last name, and username.
/// </summary>
public class User
{
/// <summary>
/// Gets or sets the user&#x27;s first name.
/// </summary>
public string FirstName { get; set; }

/// <summary>
/// Gets or sets the user&#x27;s last name.
/// </summary>
public string LastName { get; set; }

/// <summary>
/// Gets or sets the user&#x27;s username.
/// </summary>
public string Username { get; set; }
}
`;

// Can also be attached ahead of time
// using `model.bind({ prediction: {...} })`;
await modelWithPredictions.invoke(
  [
    {
      role: "user",
      content:
        "Replace the Username property with an Email property. Respond only with code, and with no markdown formatting.",
    },
    {
      role: "user",
      content: codeSample,
    },
  ],
  {
    prediction: {
      type: "content",
      content: codeSample,
    },
  }
);

```

```text
AIMessage {
  "id": "chatcmpl-AQLyQKnazr7lEV7ejLTo1UqhzHDBl",
  "content": "/// <summary>\n/// Represents a user with a first name, last name, and email.\n/// </summary>\npublic class User\n{\n/// <summary>\n/// Gets or sets the user&#x27;s first name.\n/// </summary>\npublic string FirstName { get; set; }\n\n/// <summary>\n/// Gets or sets the user&#x27;s last name.\n/// </summary>\npublic string LastName { get; set; }\n\n/// <summary>\n/// Gets or sets the user&#x27;s email.\n/// </summary>\npublic string Email { get; set; }\n}",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 148,
      "completionTokens": 217,
      "totalTokens": 365
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 148,
      "completion_tokens": 217,
      "total_tokens": 365,
      "prompt_tokens_details": {
        "cached_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "accepted_prediction_tokens": 36,
        "rejected_prediction_tokens": 116
      }
    },
    "system_fingerprint": "fp_0ba0d124f1"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 217,
    "input_tokens": 148,
    "total_tokens": 365,
    "input_token_details": {
      "cache_read": 0
    },
    "output_token_details": {
      "reasoning": 0
    }
  }
}

```Note that currently predictions are billed as additional tokens and will increase your usage and costs in exchange for this reduced latency. ## Audio output[​](#audio-output) Some OpenAI models (such as gpt-4o-audio-preview) support generating audio output. This example shows how to use that feature:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const modelWithAudioOutput = new ChatOpenAI({
  model: "gpt-4o-audio-preview",
  // You may also pass these fields to `.bind` as a call argument.
  modalities: ["text", "audio"], // Specifies that the model should output audio.
  audio: {
    voice: "alloy",
    format: "wav",
  },
});

const audioOutputResult = await modelWithAudioOutput.invoke(
  "Tell me a joke about cats."
);
const castAudioContent = audioOutputResult.additional_kwargs.audio as Record<
  string,
  any
>;

console.log({
  ...castAudioContent,
  data: castAudioContent.data.slice(0, 100), // Sliced for brevity
});

```

```text
{
  id: &#x27;audio_67129e9466f48190be70372922464162&#x27;,
  data: &#x27;UklGRgZ4BABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNTguMjkuMTAwAGRhdGHA&#x27;,
  expires_at: 1729277092,
  transcript: "Why did the cat sit on the computer&#x27;s keyboard? Because it wanted to keep an eye on the mouse!"
}

```We see that the audio data is returned inside the data field. We are also provided an expires_at date field. This field represents the date the audio response will no longer be accessible on the server for use in multi-turn conversations. ### Streaming Audio Output[​](#streaming-audio-output) OpenAI also supports streaming audio output. Here’s an example:

```typescript
import { AIMessageChunk } from "@langchain/core/messages";
import { concat } from "@langchain/core/utils/stream";
import { ChatOpenAI } from "@langchain/openai";

const modelWithStreamingAudioOutput = new ChatOpenAI({
  model: "gpt-4o-audio-preview",
  modalities: ["text", "audio"],
  audio: {
    voice: "alloy",
    format: "pcm16", // Format must be `pcm16` for streaming
  },
});

const audioOutputStream = await modelWithStreamingAudioOutput.stream(
  "Tell me a joke about cats."
);
let finalAudioOutputMsg: AIMessageChunk | undefined;
for await (const chunk of audioOutputStream) {
  finalAudioOutputMsg = finalAudioOutputMsg
    ? concat(finalAudioOutputMsg, chunk)
    : chunk;
}
const castStreamedAudioContent = finalAudioOutputMsg?.additional_kwargs
  .audio as Record<string, any>;

console.log({
  ...castStreamedAudioContent,
  data: castStreamedAudioContent.data.slice(0, 100), // Sliced for brevity
});

```

```text
{
  id: &#x27;audio_67129e976ce081908103ba4947399a3eaudio_67129e976ce081908103ba4947399a3e&#x27;,
  transcript: &#x27;Why was the cat sitting on the computer? Because it wanted to keep an eye on the mouse!&#x27;,
  index: 0,
  data: &#x27;CgAGAAIADAAAAA0AAwAJAAcACQAJAAQABQABAAgABQAPAAAACAADAAUAAwD8/wUA+f8MAPv/CAD7/wUA///8/wUA/f8DAPj/AgD6&#x27;,
  expires_at: 1729277096
}

``` ### Audio input[​](#audio-input) These models also support passing audio as input. For this, you must specify input_audio fields as seen below:

```typescript
import { HumanMessage } from "@langchain/core/messages";

const userInput = new HumanMessage({
  content: [
    {
      type: "input_audio",
      input_audio: {
        data: castAudioContent.data, // Re-use the base64 data from the first example
        format: "wav",
      },
    },
  ],
});

// Re-use the same model instance
const userInputAudioRes = await modelWithAudioOutput.invoke([userInput]);

console.log(
  (userInputAudioRes.additional_kwargs.audio as Record<string, any>).transcript
);

```

```text
That&#x27;s a great joke! It&#x27;s always fun to imagine why cats do the funny things they do. Keeping an eye on the "mouse" is a creatively punny way to describe it!

``` ## API reference[​](#api-reference) For detailed documentation of all ChatOpenAI features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_openai.ChatOpenAI.html](https://api.js.langchain.com/classes/langchain_openai.ChatOpenAI.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/#chat-models)
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
- [Custom URLs](#custom-urls)
- [Custom headers](#custom-headers)
- [Disabling streaming usage metadata](#disabling-streaming-usage-metadata)
- [Calling fine-tuned models](#calling-fine-tuned-models)
- [Generation metadata](#generation-metadata)
- [Tool calling](#tool-calling)[Custom Tools](#custom-tools)

- [strict: true](#strict-true)
- [Structured output](#structured-output)
- [Responses API](#responses-api)[Built-in tools](#built-in-tools)
- [Reasoning models](#reasoning-models)

- [Prompt caching](#prompt-caching)
- [Predicted output](#predicted-output)
- [Audio output](#audio-output)[Streaming Audio Output](#streaming-audio-output)
- [Audio input](#audio-input)

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