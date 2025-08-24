- How to create a ReAct agent from scratch (Functional API) **[Skip to content](#how-to-create-a-react-agent-from-scratch-functional-api) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [Usage](#usage) [Add thread-level persistence](#add-thread-level-persistence) [LangGraph Platform](../../how-tos#langgraph-platform) [Concepts](../../concepts/) [Tutorials](../../tutorials/) Resources [Agents](../../agents/overview/) [API reference](../../reference/) [Versions](../../versions/) [Usage](#usage) [Add thread-level persistence](#add-thread-level-persistence) [How to create a ReAct agent from scratch (Functional API)¶](#how-to-create-a-react-agent-from-scratch-functional-api) Prerequisites This guide assumes familiarity with the following: [Chat Models](https://js.langchain.com/docs/concepts/chat_models) [Messages](https://js.langchain.com/docs/concepts/messages) [Tool Calling](https://js.langchain.com/docs/concepts/tool_calling/) [Entrypoints](../../concepts/functional_api/#entrypoint) and [Tasks](../../concepts/functional_api/#task) This guide demonstrates how to implement a ReAct agent using the LangGraph [Functional API](../../concepts/functional_api). The ReAct agent is a [tool-calling agent](../../concepts/agentic_concepts/#tool-calling-agent) that operates as follows: Queries are issued to a chat model; If the model generates no [tool calls](../../concepts/agentic_concepts/#tool-calling), we return the model response. If the model generates tool calls, we execute the tool calls with available tools, append them as [tool messages](https://js.langchain.com/docs/concepts/messages/) to our message list, and repeat the process. This is a simple and versatile set-up that can be extended with memory, human-in-the-loop capabilities, and other features. See the dedicated [how-to guides](../../how-tos/#prebuilt-react-agent) for examples. Setup[¶](#setup) Note This guide requires @langchain/langgraph>=0.2.42. First, install the required dependencies for this example:

```
npm install @langchain/langgraph @langchain/openai @langchain/core zod

``` Next, we need to set API keys for OpenAI (the LLM we will use):

```
process.env.OPENAI_API_KEY = "YOUR_API_KEY";

``` Set up [LangSmith](https://smith.langchain.com) for LangGraph development Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com) Create ReAct agent[¶](#create-react-agent) Now that you have installed the required packages and set your environment variables, we can create our agent. Define model and tools[¶](#define-model-and-tools) Let's first define the tools and model we will use for our example. Here we will use a single place-holder tool that gets a description of the weather for a location. We will use an [OpenAI](https://js.langchain.com/docs/integrations/providers/openai/) chat model for this example, but any model [supporting tool-calling](https://js.langchain.com/docs/integrations/chat/) will suffice.

```
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});

const getWeather = tool(async ({ location }) => {
  const lowercaseLocation = location.toLowerCase();
  if (lowercaseLocation.includes("sf") || lowercaseLocation.includes("san francisco")) {
    return "It's sunny!";
  } else if (lowercaseLocation.includes("boston")) {
    return "It's rainy!";
  } else {
    return `I am not sure what the weather is in ${location}`;
  }
}, {
  name: "getWeather",
  schema: z.object({
    location: z.string().describe("location to get the weather for"),
  }),
  description: "Call to get the weather from a specific location."
});

const tools = [getWeather];

``` Define tasks[¶](#define-tasks) We next define the [tasks](../../concepts/functional_api/#task) we will execute. Here there are two different tasks: Call model**: We want to query our chat model with a list of messages.

- **Call tool**: If our model generates tool calls, we want to execute them.

```
import {
  type BaseMessageLike,
  AIMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { type ToolCall } from "@langchain/core/messages/tool";
import { task } from "@langchain/langgraph";

const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));

const callModel = task("callModel", async (messages: BaseMessageLike[]) => {
  const response = await model.bindTools(tools).invoke(messages);
  return response;
});

const callTool = task(
  "callTool",
  async (toolCall: ToolCall): Promise<AIMessage> => {
    const tool = toolsByName[toolCall.name];
    const observation = await tool.invoke(toolCall.args);
    return new ToolMessage({ content: observation, tool_call_id: toolCall.id });
    // Can also pass toolCall directly into the tool to return a ToolMessage
    // return tool.invoke(toolCall);
  });

```

### Define entrypoint[¶](#define-entrypoint)

Our [entrypoint](../../concepts/functional_api/#entrypoint) will handle the orchestration of these two tasks. As described above, when our `callModel` task generates tool calls, the `callTool` task will generate responses for each. We append all messages to a single messages list.

```
import { entrypoint, addMessages } from "@langchain/langgraph";

const agent = entrypoint(
  "agent",
  async (messages: BaseMessageLike[]) => {
    let currentMessages = messages;
    let llmResponse = await callModel(currentMessages);
    while (true) {
      if (!llmResponse.tool_calls?.length) {
        break;
      }

      // Execute tools
      const toolResults = await Promise.all(
        llmResponse.tool_calls.map((toolCall) => {
          return callTool(toolCall);
        })
      );

      // Append to message list
      currentMessages = addMessages(currentMessages, [llmResponse, ...toolResults]);

      // Call model again
      llmResponse = await callModel(currentMessages);
    }

    return llmResponse;
  }
);

```

## Usage[¶](#usage)

To use our agent, we invoke it with a messages list. Based on our implementation, these can be LangChain [message](https://js.langchain.com/docs/concepts/messages/) objects or OpenAI-style objects:

```
import { BaseMessage, isAIMessage } from "@langchain/core/messages";

const prettyPrintMessage = (message: BaseMessage) => {
  console.log("=".repeat(30), `${message.getType()} message`, "=".repeat(30));
  console.log(message.content);
  if (isAIMessage(message) && message.tool_calls?.length) {
    console.log(JSON.stringify(message.tool_calls, null, 2));
  }
}

// Usage example
const userMessage = { role: "user", content: "What's the weather in san francisco?" };
console.log(userMessage);

const stream = await agent.stream([userMessage]);

for await (const step of stream) {
  for (const [taskName, update] of Object.entries(step)) {
    const message = update as BaseMessage;
    // Only print task updates
    if (taskName === "agent") continue;
    console.log(`\n${taskName}:`);
    prettyPrintMessage(message);
  }
}

```

```
{ role: 'user', content: "What's the weather in san francisco?" }

callModel:
============================== ai message ==============================

[
  {
    "name": "getWeather",
    "args": {
      "location": "San Francisco"
    },
    "type": "tool_call",
    "id": "call_m5jZoH1HUtH6wA2QvexOHutj"
  }
]

callTool:
============================== tool message ==============================
It's sunny!

callModel:
============================== ai message ==============================
The weather in San Francisco is sunny!

``` Perfect! The graph correctly calls the `getWeather` tool and responds to the user after receiving the information from the tool. Check out the LangSmith trace [here](https://smith.langchain.com/public/8132d3b8-2c91-40fc-b660-b766ca33e9cb/r).

## Add thread-level persistence[¶](#add-thread-level-persistence)

Adding [thread-level persistence](../../concepts/persistence#threads) lets us support conversational experiences with our agent: subsequent invocations will append to the prior messages list, retaining the full conversational context.

To add thread-level persistence to our agent:

- Select a [checkpointer](../../concepts/persistence#checkpointer-libraries): here we will use [MemorySaver](/langgraphjs/reference/classes/checkpoint.MemorySaver.html), a simple in-memory checkpointer.

- Update our entrypoint to accept the previous messages state as a second argument. Here, we simply append the message updates to the previous sequence of messages.

- Choose which values will be returned from the workflow and which will be saved by the checkpointer. We will be able to access it as getPreviousState() if we return it from entrypoint.final (optional)

```
import {
  MemorySaver,
  getPreviousState,
} from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const agentWithMemory = entrypoint({
  name: "agentWithMemory",
  checkpointer,
}, async (messages: BaseMessageLike[]) => {
  const previous = getPreviousState<BaseMessage>() ?? [];
  let currentMessages = addMessages(previous, messages);
  let llmResponse = await callModel(currentMessages);
  while (true) {
    if (!llmResponse.tool_calls?.length) {
      break;
    }

    // Execute tools
    const toolResults = await Promise.all(
      llmResponse.tool_calls.map((toolCall) => {
        return callTool(toolCall);
      })
    );

    // Append to message list
    currentMessages = addMessages(currentMessages, [llmResponse, ...toolResults]);

    // Call model again
    llmResponse = await callModel(currentMessages);
  }

  // Append final response for storage
  currentMessages = addMessages(currentMessages, llmResponse);

  return entrypoint.final({
    value: llmResponse,
    save: currentMessages,
  });
});

```

We will now need to pass in a config when running our application. The config will specify an identifier for the conversational thread.

Tip

Read more about thread-level persistence in our [concepts page](../../concepts/persistence/) and [how-to guides](../../how-tos/#persistence).

```
const config = { configurable: { thread_id: "1" } };

```

We start a thread the same way as before, this time passing in the config:

```
const streamWithMemory = await agentWithMemory.stream([{
  role: "user",
  content: "What's the weather in san francisco?",
}], config);

for await (const step of streamWithMemory) {
  for (const [taskName, update] of Object.entries(step)) {
    const message = update as BaseMessage;
    // Only print task updates
    if (taskName === "agentWithMemory") continue;
    console.log(`\n${taskName}:`);
    prettyPrintMessage(message);
  }
}

```

```
callModel:
============================== ai message ==============================

[
  {
    "name": "getWeather",
    "args": {
      "location": "san francisco"
    },
    "type": "tool_call",
    "id": "call_4vaZqAxUabthejqKPRMq0ngY"
  }
]

callTool:
============================== tool message ==============================
It's sunny!

callModel:
============================== ai message ==============================
The weather in San Francisco is sunny!

``` When we ask a follow-up conversation, the model uses the prior context to infer that we are asking about the weather:

```
const followupStreamWithMemory = await agentWithMemory.stream([{
  role: "user",
  content: "How does it compare to Boston, MA?",
}], config);

for await (const step of followupStreamWithMemory) {
  for (const [taskName, update] of Object.entries(step)) {
    const message = update as BaseMessage;
    // Only print task updates
    if (taskName === "agentWithMemory") continue;
    console.log(`\n${taskName}:`);
    prettyPrintMessage(message);
  }
}

```

```
callModel:
============================== ai message ==============================

[
  {
    "name": "getWeather",
    "args": {
      "location": "boston, ma"
    },
    "type": "tool_call",
    "id": "call_YDrNfZr5XnuBBq5jlIXaxC5v"
  }
]

callTool:
============================== tool message ==============================
It's rainy!

callModel:
============================== ai message ==============================
In comparison, while San Francisco is sunny, Boston, MA is experiencing rain.

``` In the [LangSmith trace](https://smith.langchain.com/public/ec803712-ecfc-49b6-8f54-92252d1e5e33/r), we can see that the full conversational context is retained in each model call.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)