How to add ad-hoc tool calling capability to LLMs and Chat Models | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to add ad-hoc tool calling capability to LLMs and Chat ModelsPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Expression Language (LCEL)](/docs/concepts/lcel)
- [Chaining runnables](/docs/how_to/sequence/)
- [Tool calling](/docs/how_to/tool_calling/)

In this guide we’ll build a Chain that does not rely on any special model APIs (like tool calling, which we showed in the [Quickstart](/docs/how_to/tool_calling)) and instead just prompts the model directly to invoke tools.

## Setup[​](#setup)

We’ll need to install the following packages:

- npm
- yarn
- pnpm

```bash
npm i @langchain/core zod

```

```bash
yarn add @langchain/core zod

```

```bash
pnpm add @langchain/core zod

``` #### Set environment variables[​](#set-environment-variables)

```text
# Optional, use LangSmith for best-in-class observability
LANGSMITH_API_KEY=your-api-key
LANGSMITH_TRACING=true

# Reduce tracing latency if you are not in a serverless environment
# LANGCHAIN_CALLBACKS_BACKGROUND=true

``` ## Create a tool[​](#create-a-tool) First, we need to create a tool to call. For this example, we will create a custom tool from a function. For more information on all details related to creating custom tools, please see [this guide](/docs/how_to/custom_tools).

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const multiplyTool = tool(
  (input) => {
    return (input.first_int * input.second_int).toString();
  },
  {
    name: "multiply",
    description: "Multiply two integers together.",
    schema: z.object({
      first_int: z.number(),
      second_int: z.number(),
    }),
  }
);

```

```typescript
console.log(multiplyTool.name);
console.log(multiplyTool.description);

```

```text
multiply
Multiply two integers together.

```

```typescript
await multiplyTool.invoke({ first_int: 4, second_int: 5 });

```

```text
20

``` ## Creating our prompt[​](#creating-our-prompt) We’ll want to write a prompt that specifies the tools the model has access to, the arguments to those tools, and the desired output format of the model. In this case we’ll instruct it to output a JSON blob of the form `{"name": "...", "arguments": {...}}`.

tipAs of `langchain` version `0.2.8`, the `renderTextDescription` function now supports [OpenAI-formatted tools](https://api.js.langchain.com/interfaces/langchain_core.language_models_base.ToolDefinition.html).

```typescript
import { renderTextDescription } from "langchain/tools/render";

const renderedTools = renderTextDescription([multiplyTool]);

```

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";

const systemPrompt = `You are an assistant that has access to the following set of tools. Here are the names and descriptions for each tool:

{rendered_tools}

Given the user input, return the name and input of the tool to use. Return your response as a JSON blob with &#x27;name&#x27; and &#x27;arguments&#x27; keys.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["user", "{input}"],
]);

``` ## Adding an output parser[​](#adding-an-output-parser) We’ll use the `JsonOutputParser` for parsing our models output to JSON.

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

const model = new ChatGroq({
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

const model = new ChatOpenAI({
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

const model = new ChatAnthropic({
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

const model = new ChatGoogleGenerativeAI({
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

const model = new ChatFireworks({
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

const model = new ChatMistralAI({
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

const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```

```typescript
import { JsonOutputParser } from "@langchain/core/output_parsers";
const chain = prompt.pipe(model).pipe(new JsonOutputParser());
await chain.invoke({
  input: "what&#x27;s thirteen times 4",
  rendered_tools: renderedTools,
});

```

```text
{ name: &#x27;multiply&#x27;, arguments: [ 13, 4 ] }

``` ## Invoking the tool[​](#invoking-the-tool) We can invoke the tool as part of the chain by passing along the model-generated “arguments” to it:

```typescript
import { RunnableLambda, RunnablePick } from "@langchain/core/runnables";

const chain = prompt
  .pipe(model)
  .pipe(new JsonOutputParser())
  .pipe(new RunnablePick("arguments"))
  .pipe(
    new RunnableLambda({
      func: (input) =>
        multiplyTool.invoke({
          first_int: input[0],
          second_int: input[1],
        }),
    })
  );
await chain.invoke({
  input: "what&#x27;s thirteen times 4",
  rendered_tools: renderedTools,
});

```

```text
52

``` ## Choosing from multiple tools[​](#choosing-from-multiple-tools) Suppose we have multiple tools we want the chain to be able to choose from:

```typescript
const addTool = tool(
  (input) => {
    return (input.first_int + input.second_int).toString();
  },
  {
    name: "add",
    description: "Add two integers together.",
    schema: z.object({
      first_int: z.number(),
      second_int: z.number(),
    }),
  }
);

const exponentiateTool = tool(
  (input) => {
    return Math.pow(input.first_int, input.second_int).toString();
  },
  {
    name: "exponentiate",
    description: "Exponentiate the base to the exponent power.",
    schema: z.object({
      first_int: z.number(),
      second_int: z.number(),
    }),
  }
);

```

With function calling, we can do this like so:

If we want to run the model selected tool, we can do so using a function that returns the tool based on the model output. Specifically, our function will action return it’s own subchain that gets the “arguments” part of the model output and passes it to the chosen tool:

```typescript
import { StructuredToolInterface } from "@langchain/core/tools";

const tools = [addTool, exponentiateTool, multiplyTool];

const toolChain = (modelOutput) => {
  const toolMap: Record<string, StructuredToolInterface> = Object.fromEntries(
    tools.map((tool) => [tool.name, tool])
  );
  const chosenTool = toolMap[modelOutput.name];
  return new RunnablePick("arguments").pipe(
    new RunnableLambda({
      func: (input) =>
        chosenTool.invoke({
          first_int: input[0],
          second_int: input[1],
        }),
    })
  );
};
const toolChainRunnable = new RunnableLambda({
  func: toolChain,
});

const renderedTools = renderTextDescription(tools);
const systemPrompt = `You are an assistant that has access to the following set of tools. Here are the names and descriptions for each tool:

{rendered_tools}

Given the user input, return the name and input of the tool to use. Return your response as a JSON blob with &#x27;name&#x27; and &#x27;arguments&#x27; keys.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["user", "{input}"],
]);
const chain = prompt
  .pipe(model)
  .pipe(new JsonOutputParser())
  .pipe(toolChainRunnable);
await chain.invoke({
  input: "what&#x27;s 3 plus 1132",
  rendered_tools: renderedTools,
});

```

```text
1135

``` ## Returning tool inputs[​](#returning-tool-inputs) It can be helpful to return not only tool outputs but also tool inputs. We can easily do this with LCEL by `RunnablePassthrough.assign`-ing the tool output. This will take whatever the input is to the RunnablePassrthrough components (assumed to be a dictionary) and add a key to it while still passing through everything that’s currently in the input:

```typescript
import { RunnablePassthrough } from "@langchain/core/runnables";

const chain = prompt
  .pipe(model)
  .pipe(new JsonOutputParser())
  .pipe(RunnablePassthrough.assign({ output: toolChainRunnable }));
await chain.invoke({
  input: "what&#x27;s 3 plus 1132",
  rendered_tools: renderedTools,
});

```

```text
{ name: &#x27;add&#x27;, arguments: [ 3, 1132 ], output: &#x27;1135&#x27; }

``` ## What’s next?[​](#whats-next) This how-to guide shows the “happy path” when the model correctly outputs all the required tool information.

In reality, if you’re using more complex tools, you will start encountering errors from the model, especially for models that have not been fine tuned for tool calling and for less capable models.

You will need to be prepared to add strategies to improve the output from the model; e.g.,

- Provide few shot examples.
- Add error handling (e.g., catch the exception and feed it back to the LLM to ask it to correct its previous output).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Create a tool](#create-a-tool)
- [Creating our prompt](#creating-our-prompt)
- [Adding an output parser](#adding-an-output-parser)
- [Invoking the tool](#invoking-the-tool)
- [Choosing from multiple tools](#choosing-from-multiple-tools)
- [Returning tool inputs](#returning-tool-inputs)
- [What’s next?](#whats-next)

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