- How to pass runtime values to tools [Skip to content](#how-to-pass-runtime-values-to-tools) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [Define the nodes](#define-the-nodes)

- [Use it!](#use-it)

- [Closures](#closures)

- [How to update graph state from tools](../update-state-from-tools/)

- [Subgraphs](../../how-tos#subgraphs)

- [Multi-agent](../multi-agent-network/)

- [State Management](../../how-tos#state-management)

- [Other](../../how-tos#other)

- [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent)

- [LangGraph Platform](../../how-tos#langgraph-platform)

- [Concepts](../../concepts/)

- [Tutorials](../../tutorials/)

- Resources

- [Agents](../../agents/overview/)

- [API reference](../../reference/)

- [Versions](../../versions/)

- [Define the nodes](#define-the-nodes)

- [Use it!](#use-it)

- [Closures](#closures)

[How to pass runtime values to tools¶](#how-to-pass-runtime-values-to-tools)

This guide shows how to define tools that depend on dynamically defined variables. These values are provided by your program, not by the LLM.

Tools can access the [config.configurable](https://langchain-ai.github.io/langgraphjs/reference/interfaces/langgraph.LangGraphRunnableConfig.html) field for values like user IDs that are known when a graph is initially executed, as well as managed values from the [store](https://langchain-ai.github.io/langgraphjs/reference/classes/checkpoint.BaseStore.html) for persistence across threads.

However, it can be convenient to access intermediate runtime values which are not known ahead of time, but are progressively generated as a graph executes, such as the current graph state. This guide will cover two techniques for this: The `getCurrentTaskInput` utility function, and closures.

## Setup[¶](#setup)

Install the following to run this guide:

```
npm install @langchain/langgraph @langchain/openai @langchain/core

```

Next, configure your environment to connect to your model provider.

```
export OPENAI_API_KEY=your-api-key

```

Optionally, set your API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

```
export LANGCHAIN_TRACING_V2="true"
export LANGCHAIN_CALLBACKS_BACKGROUND="true"
export LANGCHAIN_API_KEY=your-api-key

```

## The getCurrentTaskInput Utility Function[¶](#the-getcurrenttaskinput-utility-function)

The `getCurrentTaskInput` utility function makes it easier to get the current state in areas of your application that might be called indirectly, like tool handlers.

Compatibility

This functionality was added in `@langchain/langgraph>=0.2.53`.

It also requires [async_hooks](https://nodejs.org/api/async_hooks.html) support, which is supported in many popular JavaScript environments (such as Node.js, Deno, and Cloudflare Workers), but not all of them (mainly web browsers). If you are deploying to an environment where this is not supported, see the [closures](#closures) section below.

Let's start off by defining a tool that an LLM can use to update pet preferences for a user. The tool will retrieve the current state of the graph from the current context.

### Define the agent state[¶](#define-the-agent-state)

Since we're just tracking messages, we'll use the `MessagesAnnotation`:

```
import { MessagesAnnotation } from "@langchain/langgraph";

```

Now, declare a tool as shown below. The tool receives values in three different ways:

- It will receive a generated list of pets from the LLM in its input.

- It will pull a userId populated from the initial graph invocation.

- It will fetch the input that was passed to the currenty executing task (either a StateGraph node handler, or a Functional API entrypoint or task) via the getCurrentTaskInput function.

It will then use LangGraph's [cross-thread persistence](https://langchain-ai.github.io/langgraphjs/how-tos/cross-thread-persistence/) to save preferences:

```
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import {
  getCurrentTaskInput,
  LangGraphRunnableConfig,
} from "@langchain/langgraph";

const updateFavoritePets = tool(async (input, config: LangGraphRunnableConfig) => {
  // Some arguments are populated by the LLM; these are included in the schema below
  const { pets } = input;
  // Fetch the current input to the task that called this tool.
  // This will be identical to the input that was passed to the `ToolNode` that called this tool.
  const currentState = getCurrentTaskInput() as typeof MessagesAnnotation.State;
  // Other information (such as a UserID) are most easily provided via the config
  // This is set when when invoking or streaming the graph
  const userId = config.configurable?.userId;
  // LangGraph's managed key-value store is also accessible from the config
  const store = config.store;
  await store.put([userId, "pets"], "names", pets);
  // Store the initial input message from the user as a note.
  // Using the same key will override previous values - you could
  // use something different if you wanted to store many interactions.
  await store.put([userId, "pets"], "context", { content: currentState.messages[0].content });

  return "update_favorite_pets called.";
},
{
  // The LLM "sees" the following schema:
  name: "update_favorite_pets",
  description: "add to the list of favorite pets.",
  schema: z.object({
    pets: z.array(z.string()),
  }),
});

```

If we look at the tool call schema, which is what is passed to the model for tool-calling, we can see that only `pets` is being passed:

```
import { zodToJsonSchema } from "zod-to-json-schema";

console.log(zodToJsonSchema(updateFavoritePets.schema));

```

```
{
  type: 'object',
  properties: { pets: { type: 'array', items: [Object] } },
  required: [ 'pets' ],
  additionalProperties: false,
  '$schema': 'http://json-schema.org/draft-07/schema#'
}

``` Let's also declare another tool so that our agent can retrieve previously set preferences:

```
const getFavoritePets = tool(
  async (_, config: LangGraphRunnableConfig) => {
    const userId = config.configurable?.userId;
    // LangGraph's managed key-value store is also accessible via the config
    const store = config.store;
    const petNames = await store.get([userId, "pets"], "names");
    const context = await store.get([userId, "pets"], "context");
    return JSON.stringify({
      pets: petNames.value,
      context: context.value.content,
    });
  },
  {
    // The LLM "sees" the following schema:
    name: "get_favorite_pets",
    description: "retrieve the list of favorite pets for the given user.",
    schema: z.object({}),
  }
);

```

## Define the nodes[¶](#define-the-nodes)

From here there's really nothing special that needs to be done. This approach works with both `StateGraph` and functional agents, and it works just as well with prebuilt agents like `createReactAgent`! We'll demonstrate it by defining a custom ReAct agent using `StateGraph`. This is very similar to the agent that you'd get if you were to instead call [createReactAgent](../reference/functions/langgraph_prebuilt.createReactAgent.html)

Let's start off by defining the nodes for our graph.

- The agent: responsible for deciding what (if any) actions to take.

- A function to invoke tools: if the agent decides to take an action, this node will then execute that action.

We will also need to define some edges.

- After the agent is called, we should either invoke the tool node or finish.

- After the tool node have been invoked, it should always go back to the agent to decide what to do next

```
import {
  END,
  START,
  StateGraph,
  MemorySaver,
  InMemoryStore,
} from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o" });

const tools = [getFavoritePets, updateFavoritePets];

const routeMessage = (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // If no tools are called, we can finish (respond to the user)
  if (!lastMessage?.tool_calls?.length) {
    return END;
  }
  // Otherwise if there is, we continue and call the tools
  return "tools";
};

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const modelWithTools = model.bindTools(tools);
  const responseMessage = await modelWithTools.invoke([
    {
      role: "system",
      content: "You are a personal assistant. Store any preferences the user tells you about."
    },
    ...messages
  ]);
  return { messages: [responseMessage] };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", new ToolNode(tools))
  .addEdge(START, "agent")
  .addConditionalEdges("agent", routeMessage)
  .addEdge("tools", "agent");

const memory = new MemorySaver();
const store = new InMemoryStore();

const graph = workflow.compile({ checkpointer: memory, store: store });

```

```
import * as tslab from "tslab";

const graphViz = graph.getGraph();
const image = await graphViz.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

await tslab.display.png(new Uint8Array(arrayBuffer));

```

![ ](data:image/png;base64,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)

## Use it![¶](#use-it)

Let's use our graph now!

```
import {
  BaseMessage,
  isAIMessage,
  isHumanMessage,
  isToolMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";

let inputs = {
  messages: [ new HumanMessage({ content: "My favorite pet is a terrier. I saw a cute one on Twitter." }) ],
};

let config = {
  configurable: {
    thread_id: "1",
    userId: "a-user",
  },
};

function printMessages(messages: BaseMessage[]) {
  for (const message of messages) {
    if (isHumanMessage(message)) {
      console.log(`User: ${message.content}`);
    } else if (isAIMessage(message)) {
      const aiMessage = message as AIMessage;
      if (aiMessage.content) {
        console.log(`Assistant: ${aiMessage.content}`);
      }
      if (aiMessage.tool_calls) {
        for (const toolCall of aiMessage.tool_calls) {
          console.log(`Tool call: ${toolCall.name}(${JSON.stringify(toolCall.args)})`);
        }
      }
    } else if (isToolMessage(message)) {
      const toolMessage = message as ToolMessage;
      console.log(`${toolMessage.name} tool output: ${toolMessage.content}`);
    }
  }
}

let { messages } = await graph.invoke(inputs, config);

printMessages(messages);

```

```
User: My favorite pet is a terrier. I saw a cute one on Twitter.
Tool call: update_favorite_pets({"pets":["terrier"]})
update_favorite_pets tool output: update_favorite_pets called.
Assistant: I've added "terrier" to your list of favorite pets. If you have any more favorites, feel free to let me know!

``` Now verify it can properly fetch the stored preferences and cite where it got the information from:

```
inputs = { messages: [new HumanMessage({ content: "What're my favorite pets and what did I say when I told you about them?" })] };
config = {
  configurable: {
    thread_id: "2", // New thread ID, so the conversation history isn't present.
    userId: "a-user"
  }
};

messages = (await graph.invoke(inputs, config)).messages;

printMessages(messages);

```

```
User: What're my favorite pets and what did I say when I told you about them?
Tool call: get_favorite_pets({})
get_favorite_pets tool output: {"pets":["terrier"],"context":"My favorite pet is a terrier. I saw a cute one on Twitter."}
Assistant: Your favorite pet is a terrier. You mentioned, "My favorite pet is a terrier. I saw a cute one on Twitter."

``` As you can see the agent is able to properly cite that the information came from Twitter!

## Closures[¶](#closures)

If you cannot use context variables in your environment, you can use [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) to create tools with access to dynamic content. Here is a high-level example:

```
function generateTools(state: typeof MessagesAnnotation.State) {
  const updateFavoritePets = tool(
    async (input, config: LangGraphRunnableConfig) => {
      // Some arguments are populated by the LLM; these are included in the schema below
      const { pets } = input;
      // Others (such as a UserID) are best provided via the config
      // This is set when when invoking or streaming the graph
      const userId = config.configurable?.userId;
      // LangGraph's managed key-value store is also accessible via the config
      const store = config.store;
      await store.put([userId, "pets"], "names", pets )
      await store.put([userId, "pets"], "context", {content: state.messages[0].content})

      return "update_favorite_pets called.";
    },
    {
      // The LLM "sees" the following schema:
      name: "update_favorite_pets",
      description: "add to the list of favorite pets.",
      schema: z.object({
        pets: z.array(z.string()),
      }),
    }
  );
  return [updateFavoritePets];
};

```

Then, when laying out your graph, you will need to call the above method whenever you bind or invoke tools. For example:

```
const toolNodeWithClosure = async (state: typeof MessagesAnnotation.State) => {
  // We fetch the tools any time this node is reached to
  // form a closure and let it access the latest messages
  const tools = generateTools(state);
  const toolNodeWithConfig = new ToolNode(tools);
  return toolNodeWithConfig.invoke(state);
};

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)