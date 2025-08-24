Tool calling | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageTool calling[Prerequisites]Tools](/docs/concepts/tools)[Chat Models](/docs/concepts/chat_models)Overview[​](#overview)Many AI applications interact directly with humans. In these cases, it is appropriate for models to respond in natural language. But what about cases where we want a model to also interact directly with systems, such as databases or an API? These systems often have a particular input schema; for example, APIs frequently have a required payload structure. This need motivates the concept of tool calling. You can use [tool calling](https://platform.openai.com/docs/guides/function-calling/example-use-cases) to request model responses that match a particular schema.infoYou will sometimes hear the term function calling. We use this term interchangeably with tool calling.![Conceptual overview of tool calling ](/assets/images/tool_calling_concept-552a73031228ff9144c7d59f26dedbbf.png)Key concepts[​](#key-concepts)(1) Tool Creation:** Use the [tool](https://api.js.langchain.com/functions/_langchain_core.tools.tool-1.html) function to create a [tool](/docs/concepts/tools). A tool is an association between a function and its schema. **(2) Tool Binding:** The tool needs to be connected to a model that supports tool calling. This gives the model awareness of the tool and the associated input schema required by the tool. **(3) Tool Calling:** When appropriate, the model can decide to call a tool and ensure its response conforms to the tool&#x27;s input schema. **(4) Tool Execution:** The tool can be executed using the arguments provided by the model.![Conceptual parts of tool calling ](/assets/images/tool_calling_components-bef9d2bcb9d3706c2fe58b57bf8ccb60.png) ## Recommended usage[​](#recommended-usage) This pseudo-code illustrates the recommended workflow for using tool calling. Created tools are passed to .bindTools() method as a list. This model can be called, as usual. If a tool call is made, model&#x27;s response will contain the tool call arguments. The tool call arguments can be passed directly to the tool.

```typescript
// Tool creation
const tools = [myTool];
// Tool binding
const modelWithTools = model.bindTools(tools);
// Tool calling
const response = await modelWithTools.invoke(userInput);

``` ## Tool creation[​](#tool-creation) The recommended way to create a tool is using the tool function.

```typescript
import { tool } from "@langchain/core/tools";

const multiply = tool(
  ({ a, b }: { a: number; b: number }): number => {
    /**
     * Multiply a and b.
     */
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

```[Further reading]See our conceptual guide on [tools](/docs/concepts/tools/) for more details.
- See our [model integrations](/docs/integrations/chat/) that support tool calling.
- See our [how-to guide](/docs/how_to/tool_calling/) on tool calling.

For tool calling that does not require a function to execute, you can also define just the tool schema:

```typescript
const multiplyTool = {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number(),
    b: z.number(),
  }),
};

```

## Tool binding[​](#tool-binding) [Many](https://platform.openai.com/docs/guides/function-calling) [model providers](https://platform.openai.com/docs/guides/function-calling) support tool calling.

tipSee our [model integration page](/docs/integrations/chat/) for a list of providers that support tool calling.

The central concept to understand is that LangChain provides a standardized interface for connecting tools to models. The `.bindTools()` method can be used to specify which tools are available for a model to call.

```typescript
const modelWithTools = model.bindTools([toolsList]);

```

As a specific example, let&#x27;s take a function `multiply` and bind it as a tool to a model that supports tool calling.

```typescript
const multiply = tool(
  ({ a, b }: { a: number; b: number }): number => {
    /**
     * Multiply a and b.
     *
     * @param a - first number
     * @param b - second number
     * @returns The product of a and b
     */
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const llmWithTools = toolCallingModel.bindTools([multiply]);

```

## Tool calling[​](#tool-calling-1) ![Diagram of a tool call by a model ](/assets/images/tool_call_example-2348b869f9a5d0d2a45dfbe614c177a4.png)

A key principle of tool calling is that the model decides when to use a tool based on the input&#x27;s relevance. The model doesn&#x27;t always need to call a tool. For example, given an unrelated input, the model would not call the tool:

```typescript
const result = await llmWithTools.invoke("Hello world!");

```

The result would be an `AIMessage` containing the model&#x27;s response in natural language (e.g., "Hello!"). However, if we pass an input *relevant to the tool*, the model should choose to call it:

```typescript
const result = await llmWithTools.invoke("What is 2 multiplied by 3?");

```

As before, the output `result` will be an `AIMessage`. But, if the tool was called, `result` will have a `tool_calls` attribute. This attribute includes everything needed to execute the tool, including the tool name and input arguments:

```text
result.tool_calls
{&#x27;name&#x27;: &#x27;multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 2, &#x27;b&#x27;: 3}, &#x27;id&#x27;: &#x27;xxx&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}

```

For more details on usage, see our [how-to guides](/docs/how_to/#tools)!

## Tool execution[​](#tool-execution)

[Tools](/docs/concepts/tools/) implement the [Runnable](/docs/concepts/runnables/) interface, which means that they can be invoked (e.g., `tool.invoke(args)`) directly.

[LangGraph](https://langchain-ai.github.io/langgraphjs/) offers pre-built components (e.g., [ToolNode](https://langchain-ai.github.io/langgraphjs/reference/classes/langgraph_prebuilt.ToolNode.html)) that will often invoke the tool in behalf of the user.

[Further reading] - See our [how-to guide](/docs/how_to/tool_calling/) on tool calling. - See the [LangGraph documentation on using ToolNode](https://langchain-ai.github.io/langgraphjs/how-tos/tool-calling/). ## Best practices[​](#best-practices) When designing [tools](/docs/concepts/tools/) to be used by a model, it is important to keep in mind that:

- Models that have explicit [tool-calling APIs](/docs/concepts/tool_calling) will be better at tool calling than non-fine-tuned models.
- Models will perform better if the tools have well-chosen names and descriptions.
- Simple, narrowly scoped tools are easier for models to use than complex tools.
- Asking the model to select from a large list of tools poses challenges for the model.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Overview](#overview)
- [Key concepts](#key-concepts)
- [Recommended usage](#recommended-usage)
- [Tool creation](#tool-creation)
- [Tool binding](#tool-binding)
- [Tool calling](#tool-calling-1)
- [Tool execution](#tool-execution)
- [Best practices](#best-practices)

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