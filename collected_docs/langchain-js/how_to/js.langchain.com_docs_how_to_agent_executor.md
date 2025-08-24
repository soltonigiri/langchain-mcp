How to use legacy LangChain Agents (AgentExecutor) | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to use legacy LangChain Agents (AgentExecutor)PrerequisitesThis guide assumes familiarity with the following concepts:Tools](/docs/concepts/tools)By themselves, language models can’t take actions - they just output text. Agents are systems that use an LLM as a reasoning engine to determine which actions to take and what the inputs to those actions should be. The results of those actions can then be fed back into the agent and it determine whether more actions are needed, or whether it is okay to finish.In this tutorial we will build an agent that can interact with multiple different tools: one being a local database, the other being a search engine. You will be able to ask this agent questions, watch it call tools, and have conversations with it.infoThis section will cover building with LangChain Agents. LangChain Agents are fine for getting started, but past a certain point you will likely want flexibility and control that they do not offer. For working with more advanced agents, we’d recommend checking out [LangGraph](https://langchain-ai.github.io/langgraphjs).Concepts[​](#concepts)Concepts we will cover are: - Using [language models](/docs/concepts/chat_models), in particular their tool calling ability - Creating a [Retriever](/docs/concepts/retrievers) to expose specific information to our agent - Using a Search [Tool](/docs/concepts/tools) to look up things online - [Chat History](/docs/concepts/chat_history), which allows a chatbot to “remember” past interactions and take them into account when responding to followup questions. - Debugging and tracing your application using [LangSmith](/docs/concepts/#langsmith)Setup[​](#setup)Jupyter Notebook[​](#jupyter-notebook)This guide (and most of the other guides in the documentation) uses [Jupyter notebooks](https://jupyter.org/) and assumes the reader is as well. Jupyter notebooks are perfect for learning how to work with LLM systems because oftentimes things can go wrong (unexpected output, API down, etc) and going through guides in an interactive environment is a great way to better understand them.This and other tutorials are perhaps most conveniently run in a Jupyter notebook. See [here](https://jupyter.org/install) for instructions on how to install.Installation[​](#installation)To install LangChain (and cheerio for the web loader) run:npmyarnpnpm

```bash
npm i langchain @langchain/core cheerio

```

```bash
yarn add langchain @langchain/core cheerio

```

```bash
pnpm add langchain @langchain/core cheerio

```For more details, see our [Installation guide](/docs/how_to/installation/).LangSmith[​](#langsmith)Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com).After you sign up at the link above, make sure to set your environment variables to start logging traces:

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."

# Reduce tracing latency if you are not in a serverless environment
# export LANGCHAIN_CALLBACKS_BACKGROUND=true

```Define tools[​](#define-tools)We first need to create the tools we want to use. We will use two tools: [Tavily](/docs/integrations/tools/tavily_search) (to search online) and then a retriever over a local index we will create[Tavily](/docs/integrations/tools/tavily_search)[​](#tavily)We have a built-in tool in LangChain to easily use Tavily search engine as tool. Note that this requires an API key - they have a free tier, but if you don’t have one or don’t want to create one, you can always ignore this step.Once you create your API key, you will need to export that as:

```bash
export TAVILY_API_KEY="..."

```

```typescript
import "cheerio"; // This is required in notebooks to use the `CheerioWebBaseLoader`
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const search = new TavilySearchResults({
  maxResults: 2,
});

await search.invoke("what is the weather in SF");

```

```text
`[{"title":"Weather in San Francisco","url":"https://www.weatherapi.com/","content":"{&#x27;location&#x27;: {&#x27;n`... 1358 more characters

```Retriever[​](#retriever)We will also create a retriever over some data of our own. For a deeper explanation of each step here, see [this tutorial](/docs/tutorials/rag).

```typescript
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const loader = new CheerioWebBaseLoader(
  "https://docs.smith.langchain.com/overview"
);
const docs = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const documents = await splitter.splitDocuments(docs);
const vectorStore = await MemoryVectorStore.fromDocuments(
  documents,
  new OpenAIEmbeddings()
);
const retriever = vectorStore.asRetriever();

(await retriever.invoke("how to upload a dataset"))[0];

```

```text
Document {
  pageContent: &#x27;description="A sample dataset in LangSmith.")client.create_examples(    inputs=[        {"postfix": &#x27;... 891 more characters,
  metadata: {
    source: "https://docs.smith.langchain.com/overview",
    loc: { lines: { from: 4, to: 4 } }
  },
  id: undefined
}

```Now that we have populated our index that we will do doing retrieval over, we can easily turn it into a tool (the format needed for an agent to properly use it)

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const retrieverTool = tool(
  async ({ input }, config) => {
    const docs = await retriever.invoke(input, config);
    return docs.map((doc) => doc.pageContent).join("\n\n");
  },
  {
    name: "langsmith_search",
    description:
      "Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",
    schema: z.object({
      input: z.string(),
    }),
  }
);

```Tools[​](#tools)Now that we have created both, we can create a list of tools that we will use downstream.

```typescript
const tools = [search, retrieverTool];

```Using Language Models[​](#using-language-models)Next, let’s learn how to use a language model by to call tools. LangChain supports many different language models that you can use interchangably - select the one you want to use below!Pick your chat model:GroqOpenAIAnthropicGoogle GeminiFireworksAIMistralAIVertexAIInstall dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

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

const model = new ChatGroq({
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

const model = new ChatOpenAI({ model: "gpt-4" });

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

const model = new ChatAnthropic({
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

const model = new ChatGoogleGenerativeAI({
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

const model = new ChatFireworks({
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

const model = new ChatMistralAI({
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

const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```You can call the language model by passing in a list of messages. By default, the response is a content string.

```typescript
const response = await model.invoke([
  {
    role: "user",
    content: "hi!",
  },
]);

response.content;

```

```text
"Hello! How can I assist you today?"

```We can now see what it is like to enable this model to do tool calling. In order to enable that we use .bind to give the language model knowledge of these tools

```typescript
const modelWithTools = model.bindTools(tools);

```We can now call the model. Let’s first call it with a normal message, and see how it responds. We can look at both the content field as well as the tool_calls field.

```typescript
const responseWithTools = await modelWithTools.invoke([
  {
    role: "user",
    content: "Hi!",
  },
]);

console.log(`Content: ${responseWithTools.content}`);
console.log(`Tool calls: ${responseWithTools.tool_calls}`);

```

```text
Content: Hello! How can I assist you today?
Tool calls:

```Now, let’s try calling it with some input that would expect a tool to be called.

```typescript
const responseWithToolCalls = await modelWithTools.invoke([
  {
    role: "user",
    content: "What&#x27;s the weather in SF?",
  },
]);

console.log(`Content: ${responseWithToolCalls.content}`);
console.log(
  `Tool calls: ${JSON.stringify(responseWithToolCalls.tool_calls, null, 2)}`
);

```

```text
Content:
Tool calls: [
  {
    "name": "tavily_search_results_json",
    "args": {
      "input": "current weather in San Francisco"
    },
    "type": "tool_call",
    "id": "call_gtJ5rrjXswO8EIvePrxyGQbR"
  }
]

```We can see that there’s now no content, but there is a tool call! It wants us to call the Tavily Search tool.This isn’t calling that tool yet - it’s just telling us to. In order to actually calll it, we’ll want to create our agent.Create the agent[​](#create-the-agent)Now that we have defined the tools and the LLM, we can create the agent. We will be using a tool calling agent - for more information on this type of agent, as well as other options, see [this guide](/docs/concepts/agents/).We can first choose the prompt we want to use to guide the agent:

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

console.log(prompt.promptMessages);

```

```text
[
  SystemMessagePromptTemplate {
    lc_serializable: true,
    lc_kwargs: {
      prompt: PromptTemplate {
        lc_serializable: true,
        lc_kwargs: {
          inputVariables: [],
          templateFormat: "f-string",
          template: "You are a helpful assistant"
        },
        lc_runnable: true,
        name: undefined,
        lc_namespace: [ "langchain_core", "prompts", "prompt" ],
        inputVariables: [],
        outputParser: undefined,
        partialVariables: undefined,
        templateFormat: "f-string",
        template: "You are a helpful assistant",
        validateTemplate: true,
        additionalContentFields: undefined
      }
    },
    lc_runnable: true,
    name: undefined,
    lc_namespace: [ "langchain_core", "prompts", "chat" ],
    inputVariables: [],
    additionalOptions: {},
    prompt: PromptTemplate {
      lc_serializable: true,
      lc_kwargs: {
        inputVariables: [],
        templateFormat: "f-string",
        template: "You are a helpful assistant"
      },
      lc_runnable: true,
      name: undefined,
      lc_namespace: [ "langchain_core", "prompts", "prompt" ],
      inputVariables: [],
      outputParser: undefined,
      partialVariables: undefined,
      templateFormat: "f-string",
      template: "You are a helpful assistant",
      validateTemplate: true,
      additionalContentFields: undefined
    },
    messageClass: undefined,
    chatMessageClass: undefined
  },
  MessagesPlaceholder {
    lc_serializable: true,
    lc_kwargs: { variableName: "chat_history", optional: true },
    lc_runnable: true,
    name: undefined,
    lc_namespace: [ "langchain_core", "prompts", "chat" ],
    variableName: "chat_history",
    optional: true
  },
  HumanMessagePromptTemplate {
    lc_serializable: true,
    lc_kwargs: {
      prompt: PromptTemplate {
        lc_serializable: true,
        lc_kwargs: {
          inputVariables: [Array],
          templateFormat: "f-string",
          template: "{input}"
        },
        lc_runnable: true,
        name: undefined,
        lc_namespace: [ "langchain_core", "prompts", "prompt" ],
        inputVariables: [ "input" ],
        outputParser: undefined,
        partialVariables: undefined,
        templateFormat: "f-string",
        template: "{input}",
        validateTemplate: true,
        additionalContentFields: undefined
      }
    },
    lc_runnable: true,
    name: undefined,
    lc_namespace: [ "langchain_core", "prompts", "chat" ],
    inputVariables: [ "input" ],
    additionalOptions: {},
    prompt: PromptTemplate {
      lc_serializable: true,
      lc_kwargs: {
        inputVariables: [ "input" ],
        templateFormat: "f-string",
        template: "{input}"
      },
      lc_runnable: true,
      name: undefined,
      lc_namespace: [ "langchain_core", "prompts", "prompt" ],
      inputVariables: [ "input" ],
      outputParser: undefined,
      partialVariables: undefined,
      templateFormat: "f-string",
      template: "{input}",
      validateTemplate: true,
      additionalContentFields: undefined
    },
    messageClass: undefined,
    chatMessageClass: undefined
  },
  MessagesPlaceholder {
    lc_serializable: true,
    lc_kwargs: { variableName: "agent_scratchpad", optional: true },
    lc_runnable: true,
    name: undefined,
    lc_namespace: [ "langchain_core", "prompts", "chat" ],
    variableName: "agent_scratchpad",
    optional: true
  }
]

```Now, we can initalize the agent with the LLM, the prompt, and the tools. The agent is responsible for taking in input and deciding what actions to take. Crucially, the Agent does not execute those actions - that is done by the AgentExecutor (next step). For more information about how to think about these components, see our [conceptual guide](/docs/concepts/agents).Note that we are passing in the model, not modelWithTools. That is because createToolCallingAgent will call .bind for us under the hood.

```typescript
import { createToolCallingAgent } from "langchain/agents";

const agent = await createToolCallingAgent({ llm: model, tools, prompt });

```Finally, we combine the agent (the brains) with the tools inside the AgentExecutor (which will repeatedly call the agent and execute tools).

```typescript
import { AgentExecutor } from "langchain/agents";

const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

```Run the agent[​](#run-the-agent)We can now run the agent on a few queries! Note that for now, these are all stateless** queries (it won’t remember previous interactions).First up, let’s how it responds when there’s no need to call a tool:

```typescript
await agentExecutor.invoke({ input: "hi!" });

```**

```text
{ input: "hi!", output: "Hello! How can I assist you today?" }

```In order to see exactly what is happening under the hood (and to make sure it’s not calling a tool) we can take a look at the [LangSmith trace](https://smith.langchain.com/public/b8051e80-14fd-4931-be0f-6416280bc500/r)Let’s now try it out on an example where it should be invoking the retriever

```typescript
await agentExecutor.invoke({ input: "how can langsmith help with testing?" });

```

```text
{
  input: "how can langsmith help with testing?",
  output: "LangSmith can assist with testing in several ways, particularly for applications built using large l"... 1474 more characters
}

```Let’s take a look at the [LangSmith trace](https://smith.langchain.com/public/35bd4f0f-aa2f-4ac2-b9a9-89ce0ca306ca/r) to make sure it’s actually calling that.Now let’s try one where it needs to call the search tool:

```typescript
await agentExecutor.invoke({ input: "whats the weather in sf?" });

```

```text
{
  input: "whats the weather in sf?",
  output: "The current weather in San Francisco is as follows:\n" +
    "\n" +
    "- **Temperature**: 15.6°C (60.1°F)\n" +
    "- **Conditio"... 303 more characters
}

```We can check out the [LangSmith trace](https://smith.langchain.com/public/dfde6f46-0e7b-4dfe-813c-87d7bfb2ade5/r) to make sure it’s calling the search tool effectively.Adding in memory[​](#adding-in-memory)As mentioned earlier, this agent is stateless. This means it does not remember previous interactions. To give it memory we need to pass in previous chat_history.Note**: The input variable needs to be called chat_history because of the prompt we are using. If we use a different prompt, we could change the variable name.

```typescript
// Here we pass in an empty list of messages for chat_history because it is the first message in the chat
await agentExecutor.invoke({ input: "hi! my name is bob", chat_history: [] });

```

```text
{
  input: "hi! my name is bob",
  chat_history: [],
  output: "Hello Bob! How can I assist you today?"
}

```

```typescript
await agentExecutor.invoke({
  chat_history: [
    { role: "user", content: "hi! my name is bob" },
    { role: "assistant", content: "Hello Bob! How can I assist you today?" },
  ],
  input: "what&#x27;s my name?",
});

```

```text
{
  chat_history: [
    { role: "user", content: "hi! my name is bob" },
    {
      role: "assistant",
      content: "Hello Bob! How can I assist you today?"
    }
  ],
  input: "what&#x27;s my name?",
  output: "Your name is Bob. How can I help you today, Bob?"
}

```If we want to keep track of these messages automatically, we can wrap this in a RunnableWithMessageHistory.Because we have multiple inputs, we need to specify two things:inputMessagesKey: The input key to use to add to the conversation history.
- historyMessagesKey: The key to add the loaded messages into.

For more information on how to use this, see [this guide](/docs/how_to/message_history).

```typescript
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

const store = {};

function getMessageHistory(sessionId: string): BaseChatMessageHistory {
  if (!(sessionId in store)) {
    store[sessionId] = new ChatMessageHistory();
  }
  return store[sessionId];
}

const agentWithChatHistory = new RunnableWithMessageHistory({
  runnable: agentExecutor,
  getMessageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

await agentWithChatHistory.invoke(
  { input: "hi! I&#x27;m bob" },
  { configurable: { sessionId: "<foo>" } }
);

```

```text
{
  input: "hi! I&#x27;m bob",
  chat_history: [
    HumanMessage {
      "content": "hi! I&#x27;m bob",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "content": "Hello Bob! How can I assist you today?",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [],
      "invalid_tool_calls": []
    }
  ],
  output: "Hello Bob! How can I assist you today?"
}

```

```typescript
await agentWithChatHistory.invoke(
  { input: "what&#x27;s my name?" },
  { configurable: { sessionId: "<foo>" } }
);

```

```text
{
  input: "what&#x27;s my name?",
  chat_history: [
    HumanMessage {
      "content": "hi! I&#x27;m bob",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "content": "Hello Bob! How can I assist you today?",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [],
      "invalid_tool_calls": []
    },
    HumanMessage {
      "content": "what&#x27;s my name?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "content": "Your name is Bob! How can I help you today, Bob?",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [],
      "invalid_tool_calls": []
    }
  ],
  output: "Your name is Bob! How can I help you today, Bob?"
}

```Example LangSmith trace: [https://smith.langchain.com/public/98c8d162-60ae-4493-aa9f-992d87bd0429/r](https://smith.langchain.com/public/98c8d162-60ae-4493-aa9f-992d87bd0429/r)

## Next steps[​](#next-steps)

That’s a wrap! In this quick start we covered how to create a simple agent. Agents are a complex topic, and there’s lot to learn!

infoThis section covered building with LangChain Agents. LangChain Agents are fine for getting started, but past a certain point you will likely want flexibility and control that they do not offer. For working with more advanced agents, we’d recommend checking out [LangGraph](https://langchain-ai.github.io/langgraphjs).

You can also see [this guide to help migrate to LangGraph](/docs/how_to/migrate_agent).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Concepts](#concepts)
- [Setup](#setup)[Jupyter Notebook](#jupyter-notebook)
- [Installation](#installation)
- [LangSmith](#langsmith)

- [Define tools](#define-tools)[Tavily](#tavily)
- [Retriever](#retriever)
- [Tools](#tools)

- [Using Language Models](#using-language-models)
- [Create the agent](#create-the-agent)
- [Run the agent](#run-the-agent)
- [Adding in memory](#adding-in-memory)
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