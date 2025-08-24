How to pass run time values to tools | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to pass run time values to toolsPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)[LangChain Tools](/docs/concepts/tools)[How to create tools](/docs/how_to/custom_tools)[How to use a model to call tools](/docs/how_to/tool_calling/)Supported modelsThis how-to guide uses models with native tool calling capability. You can find a [list of all models that support tool calling](/docs/integrations/chat/).You may need to bind values to a tool that are only known at runtime. For example, the tool logic may require using the ID of the user who made the request.Most of the time, such values should not be controlled by the LLM. In fact, allowing the LLM to control the user ID may lead to a security risk.Instead, the LLM should only control the parameters of the tool that are meant to be controlled by the LLM, while other parameters (such as user ID) should be fixed by the application logic.Pick your chat model:GroqOpenAIAnthropicGoogle GeminiFireworksAIMistralAIVertexAIInstall dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/groq

```

```bash
yarn add @langchain/groq

```

```bash
pnpm add @langchain/groq

```Add environment variables

```bash
GROQ_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/openai

```

```bash
yarn add @langchain/openai

```

```bash
pnpm add @langchain/openai

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
npm i @langchain/anthropic

```

```bash
yarn add @langchain/anthropic

```

```bash
pnpm add @langchain/anthropic

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
npm i @langchain/google-genai

```

```bash
yarn add @langchain/google-genai

```

```bash
pnpm add @langchain/google-genai

```Add environment variables

```bash
GOOGLE_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

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

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/mistralai

```

```bash
yarn add @langchain/mistralai

```

```bash
pnpm add @langchain/mistralai

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
npm i @langchain/google-vertexai

```

```bash
yarn add @langchain/google-vertexai

```

```bash
pnpm add @langchain/google-vertexai

```Add environment variables

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json

```Instantiate the model

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```Using context variables[​](#using-context-variables)CompatibilityThis functionality was added in @langchain/core>=0.3.10. If you are using the LangSmith SDK separately in your project, we also recommend upgrading to langsmith>=0.1.65. Please make sure your packages are up to date.It also requires [async_hooks](https://nodejs.org/api/async_hooks.html) support, which is not supported in all environments.One way to solve this problem is by using context variables**. Context variables are a powerful feature that allows you to set values at a higher level of your application, then access them within child runnable (such as tools) called from that level.They work outside of traditional scoping rules, so you don’t need to have a direct reference to the declared variable to access its value.Below, we declare a tool that updates a central userToPets state based on a context variable called userId. Note that this userId is not part of the tool schema or input:

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { getContextVariable } from "@langchain/core/context";

let userToPets: Record<string, string[]> = {};

const updateFavoritePets = tool(
  async (input) => {
    const userId = getContextVariable("userId");
    if (userId === undefined) {
      throw new Error(
        `No "userId" found in current context. Remember to call "setContextVariable(&#x27;userId&#x27;, value)";`
      );
    }
    userToPets[userId] = input.pets;
    return "update_favorite_pets called.";
  },
  {
    name: "update_favorite_pets",
    description: "add to the list of favorite pets.",
    schema: z.object({
      pets: z.array(z.string()),
    }),
  }
);

```**If you were to invoke the above tool before setting a context variable at a higher level, userId would be undefined:

```typescript
await updateFavoritePets.invoke({ pets: ["cat", "dog"] });

```

```text
Error: No "userId" found in current context. Remember to call "setContextVariable(&#x27;userId&#x27;, value)";
    at updateFavoritePets.name (evalmachine.<anonymous>:14:15)
    at /Users/jacoblee/langchain/langchainjs/langchain-core/dist/tools/index.cjs:329:33
    at AsyncLocalStorage.run (node:async_hooks:346:14)
    at AsyncLocalStorageProvider.runWithConfig (/Users/jacoblee/langchain/langchainjs/langchain-core/dist/singletons/index.cjs:58:24)
    at /Users/jacoblee/langchain/langchainjs/langchain-core/dist/tools/index.cjs:325:68
    at new Promise (<anonymous>)
    at DynamicStructuredTool.func (/Users/jacoblee/langchain/langchainjs/langchain-core/dist/tools/index.cjs:321:20)
    at DynamicStructuredTool._call (/Users/jacoblee/langchain/langchainjs/langchain-core/dist/tools/index.cjs:283:21)
    at DynamicStructuredTool.call (/Users/jacoblee/langchain/langchainjs/langchain-core/dist/tools/index.cjs:111:33)
    at async evalmachine.<anonymous>:3:22

```Instead, set a context variable with a parent of where the tools are invoked:

```typescript
import { setContextVariable } from "@langchain/core/context";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { RunnableLambda } from "@langchain/core/runnables";

const handleRunTimeRequestRunnable = RunnableLambda.from(
  async (params: { userId: string; query: string; llm: BaseChatModel }) => {
    const { userId, query, llm } = params;
    if (!llm.bindTools) {
      throw new Error("Language model does not support tools.");
    }
    // Set a context variable accessible to any child runnables called within this one.
    // You can also set context variables at top level that act as globals.
    setContextVariable("userId", userId);
    const tools = [updateFavoritePets];
    const llmWithTools = llm.bindTools(tools);
    const modelResponse = await llmWithTools.invoke(query);
    // For simplicity, skip checking the tool call&#x27;s name field and assume
    // that the model is calling the "updateFavoritePets" tool
    if (modelResponse.tool_calls.length > 0) {
      return updateFavoritePets.invoke(modelResponse.tool_calls[0]);
    } else {
      return "No tool invoked.";
    }
  }
);

```And when our method invokes the tools, you will see that the tool properly access the previously set userId context variable and runs successfully:

```typescript
await handleRunTimeRequestRunnable.invoke({
  userId: "brace",
  query: "my favorite animals are cats and parrots.",
  llm: llm,
});

```

```text
ToolMessage {
  "content": "update_favorite_pets called.",
  "name": "update_favorite_pets",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_call_id": "call_vsD2DbSpDquOtmFlOtbUME6h"
}

```And have additionally updated the userToPets object with a key matching the userId we passed, "brace":

```typescript
console.log(userToPets);

```

```text
{ brace: [ &#x27;cats&#x27;, &#x27;parrots&#x27; ] }

```Without context variables[​](#without-context-variables)If you are on an earlier version of core or an environment that does not support async_hooks, you can use the following design pattern that creates the tool dynamically at run time and binds to them appropriate values.The idea is to create the tool dynamically at request time, and bind to it the appropriate information. For example, this information may be the user ID as resolved from the request itself.

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";

userToPets = {};

function generateToolsForUser(userId: string) {
  const updateFavoritePets = tool(
    async (input) => {
      userToPets[userId] = input.pets;
      return "update_favorite_pets called.";
    },
    {
      name: "update_favorite_pets",
      description: "add to the list of favorite pets.",
      schema: z.object({
        pets: z.array(z.string()),
      }),
    }
  );
  // You can declare and return additional tools as well:
  return [updateFavoritePets];
}

```Verify that the tool works correctly

```typescript
const [updatePets] = generateToolsForUser("cobb");

await updatePets.invoke({ pets: ["tiger", "wolf"] });

console.log(userToPets);

```

```text
{ cobb: [ &#x27;tiger&#x27;, &#x27;wolf&#x27; ] }

```

```typescript
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

async function handleRunTimeRequest(
  userId: string,
  query: string,
  llm: BaseChatModel
): Promise<any> {
  if (!llm.bindTools) {
    throw new Error("Language model does not support tools.");
  }
  const tools = generateToolsForUser(userId);
  const llmWithTools = llm.bindTools(tools);
  return llmWithTools.invoke(query);
}

```This code will allow the LLM to invoke the tools, but the LLM is unaware** of the fact that a **user ID** even exists. You can see that user_id is not among the params the LLM generates:

```typescript
const aiMessage = await handleRunTimeRequest(
  "cobb",
  "my favorite pets are tigers and wolves.",
  llm
);
console.log(aiMessage.tool_calls[0]);

```

```text
{
  name: &#x27;update_favorite_pets&#x27;,
  args: { pets: [ &#x27;tigers&#x27;, &#x27;wolves&#x27; ] },
  type: &#x27;tool_call&#x27;,
  id: &#x27;call_FBF4D51SkVK2clsLOQHX6wTv&#x27;
}

```tipClick [here](https://smith.langchain.com/public/3d766ecc-8f28-400b-8636-632e6f1598c7/r) to see the LangSmith trace for the above run.tipChat models only output requests to invoke tools. They don&#x27;t actually invoke the underlying tools.To see how to invoke the tools, please refer to [how to use a model to call tools](/docs/how_to/tool_calling/). #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Using context variables](#using-context-variables)
- [Without context variables](#without-context-variables)

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