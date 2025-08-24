How to return artifacts from a tool | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to return artifacts from a toolPrerequisitesThis guide assumes familiarity with the following concepts:ToolMessage](/docs/concepts/messages/#toolmessage)
- [Tools](/docs/concepts/tools)
- [Tool calling](/docs/concepts/tool_calling)

Tools are utilities that can be called by a model, and whose outputs are designed to be fed back to a model. Sometimes, however, there are artifacts of a tool’s execution that we want to make accessible to downstream components in our chain or agent, but that we don’t want to expose to the model itself.

For example if a tool returns something like a custom object or an image, we may want to pass some metadata about this output to the model without passing the actual output to the model. At the same time, we may want to be able to access this full output elsewhere, for example in downstream tools.

The Tool and [ToolMessage](https://api.js.langchain.com/classes/langchain_core.messages_tool.ToolMessage.html) interfaces make it possible to distinguish between the parts of the tool output meant for the model (this is the `ToolMessage.content`) and those parts which are meant for use outside the model (`ToolMessage.artifact`).

CompatibilityThis functionality requires `@langchain/core>=0.2.16`. Please see here for a [guide on upgrading](/docs/how_to/installation/#installing-integration-packages).

## Defining the tool[​](#defining-the-tool)

If we want our tool to distinguish between message content and other artifacts, we need to specify `response_format: "content_and_artifact"` when defining our tool and make sure that we return a tuple of [`content`, `artifact`]:

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const randomIntToolSchema = z.object({
  min: z.number(),
  max: z.number(),
  size: z.number(),
});

const generateRandomInts = tool(
  async ({ min, max, size }) => {
    const array: number[] = [];
    for (let i = 0; i < size; i++) {
      array.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return [
      `Successfully generated array of ${size} random ints in [${min}, ${max}].`,
      array,
    ];
  },
  {
    name: "generateRandomInts",
    description: "Generate size random ints in the range [min, max].",
    schema: randomIntToolSchema,
    responseFormat: "content_and_artifact",
  }
);

```

## Invoking the tool with ToolCall[​](#invoking-the-tool-with-toolcall) If we directly invoke our tool with just the tool arguments, you’ll notice that we only get back the content part of the `Tool` output:

```typescript
await generateRandomInts.invoke({ min: 0, max: 9, size: 10 });

```

```text
Successfully generated array of 10 random ints in [0, 9].

```In order to get back both the content and the artifact, we need to invoke our model with a `ToolCall` (which is just a dictionary with `"name"`, `"args"`, `"id"` and `"type"` keys), which has additional info needed to generate a ToolMessage like the tool call ID:

```typescript
await generateRandomInts.invoke({
  name: "generate_random_ints",
  args: { min: 0, max: 9, size: 10 },
  id: "123", // Required
  type: "tool_call", // Required
});

```

```text
ToolMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;Successfully generated array of 10 random ints in [0, 9].&#x27;,
    artifact: [
      0, 6, 5, 5, 7,
      0, 6, 3, 7, 5
    ],
    tool_call_id: &#x27;123&#x27;,
    name: &#x27;generateRandomInts&#x27;,
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;Successfully generated array of 10 random ints in [0, 9].&#x27;,
  name: &#x27;generateRandomInts&#x27;,
  additional_kwargs: {},
  response_metadata: {},
  id: undefined,
  tool_call_id: &#x27;123&#x27;,
  artifact: [
    0, 6, 5, 5, 7,
    0, 6, 3, 7, 5
  ]
}

``` ## Using with a model[​](#using-with-a-model) With a [tool-calling model](/docs/how_to/tool_calling/), we can easily use a model to call our Tool and generate ToolMessages:

### Pick your chat model:

- Groq
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

```

```typescript
const llmWithTools = llm.bindTools([generateRandomInts]);

const aiMessage = await llmWithTools.invoke(
  "generate 6 positive ints less than 25"
);
aiMessage.tool_calls;

```

```text
[
  {
    name: &#x27;generateRandomInts&#x27;,
    args: { min: 1, max: 24, size: 6 },
    id: &#x27;toolu_019ygj3YuoU6qFzR66juXALp&#x27;,
    type: &#x27;tool_call&#x27;
  }
]

```

```typescript
await generateRandomInts.invoke(aiMessage.tool_calls[0]);

```

```text
ToolMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;Successfully generated array of 6 random ints in [1, 24].&#x27;,
    artifact: [ 18, 20, 16, 15, 17, 19 ],
    tool_call_id: &#x27;toolu_019ygj3YuoU6qFzR66juXALp&#x27;,
    name: &#x27;generateRandomInts&#x27;,
    additional_kwargs: {},
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;Successfully generated array of 6 random ints in [1, 24].&#x27;,
  name: &#x27;generateRandomInts&#x27;,
  additional_kwargs: {},
  response_metadata: {},
  id: undefined,
  tool_call_id: &#x27;toolu_019ygj3YuoU6qFzR66juXALp&#x27;,
  artifact: [ 18, 20, 16, 15, 17, 19 ]
}

```If we just pass in the tool call args, we’ll only get back the content:

```typescript
await generateRandomInts.invoke(aiMessage.tool_calls[0]["args"]);

```

```text
Successfully generated array of 6 random ints in [1, 24].

```If we wanted to declaratively create a chain, we could do this:

```typescript
const extractToolCalls = (aiMessage) => aiMessage.tool_calls;

const chain = llmWithTools
  .pipe(extractToolCalls)
  .pipe(generateRandomInts.map());

await chain.invoke("give me a random number between 1 and 5");

```

```text
[
  ToolMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: &#x27;Successfully generated array of 1 random ints in [1, 5].&#x27;,
      artifact: [Array],
      tool_call_id: &#x27;toolu_01CskofJCQW8chkUzmVR1APU&#x27;,
      name: &#x27;generateRandomInts&#x27;,
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: &#x27;Successfully generated array of 1 random ints in [1, 5].&#x27;,
    name: &#x27;generateRandomInts&#x27;,
    additional_kwargs: {},
    response_metadata: {},
    id: undefined,
    tool_call_id: &#x27;toolu_01CskofJCQW8chkUzmVR1APU&#x27;,
    artifact: [ 1 ]
  }
]

``` ## Related[​](#related) You’ve now seen how to return additional artifacts from a tool call.

These guides may interest you next:

- [Creating custom tools](/docs/how_to/custom_tools)
- [Building agents with LangGraph](https://langchain-ai.github.io/langgraphjs/)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Defining the tool](#defining-the-tool)
- [Invoking the tool with ToolCall](#invoking-the-tool-with-toolcall)
- [Using with a model](#using-with-a-model)
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