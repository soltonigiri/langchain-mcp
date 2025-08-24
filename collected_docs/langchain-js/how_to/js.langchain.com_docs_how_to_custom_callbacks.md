How to create custom callback handlers | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to create custom callback handlersPrerequisitesThis guide assumes familiarity with the following concepts:Callbacks](/docs/concepts/callbacks)

LangChain has some built-in callback handlers, but you will often want to create your own handlers with custom logic.

To create a custom callback handler, we need to determine the [event(s)](https://api.js.langchain.com/interfaces/langchain_core.callbacks_base.CallbackHandlerMethods.html) we want our callback handler to handle as well as what we want our callback handler to do when the event is triggered. Then all we need to do is attach the callback handler to the object, for example via [the constructor](/docs/how_to/callbacks_constructor) or [at runtime](/docs/how_to/callbacks_runtime).

An easy way to construct a custom callback handler is to initialize it as an object whose keys are functions with names matching the events we want to handle. Here’s an example that only handles the start of a chat model and streamed tokens from the model run:

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatAnthropic } from "@langchain/anthropic";

const prompt = ChatPromptTemplate.fromTemplate(`What is 1 + {number}?`);
const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
});

const chain = prompt.pipe(model);

const customHandler = {
  handleChatModelStart: async (llm, inputMessages, runId) => {
    console.log("Chat model start:", llm, inputMessages, runId);
  },
  handleLLMNewToken: async (token) => {
    console.log("Chat model new token", token);
  },
};

const stream = await chain.stream(
  { number: "2" },
  { callbacks: [customHandler] }
);

for await (const _ of stream) {
  // Just consume the stream so the callbacks run
}

```

```text
Chat model start: {
  lc: 1,
  type: "constructor",
  id: [ "langchain", "chat_models", "anthropic", "ChatAnthropic" ],
  kwargs: {
    callbacks: undefined,
    model: "claude-3-sonnet-20240229",
    verbose: undefined,
    anthropic_api_key: { lc: 1, type: "secret", id: [ "ANTHROPIC_API_KEY" ] },
    api_key: { lc: 1, type: "secret", id: [ "ANTHROPIC_API_KEY" ] }
  }
} [
  [
    HumanMessage {
      lc_serializable: true,
      lc_kwargs: {
        content: "What is 1 + 2?",
        additional_kwargs: {},
        response_metadata: {}
      },
      lc_namespace: [ "langchain_core", "messages" ],
      content: "What is 1 + 2?",
      name: undefined,
      additional_kwargs: {},
      response_metadata: {}
    }
  ]
] b6e3b7ad-c602-4cef-9652-d51781a657b7
Chat model new token The
Chat model new token  sum
Chat model new token  of
Chat model new token
Chat model new token 1
Chat model new token
Chat model new token an
Chat model new token d
Chat model new token 2
Chat model new token
Chat model new token is
Chat model new token
Chat model new token 3
Chat model new token .

```You can see [this reference page](https://api.js.langchain.com/interfaces/langchain_core.callbacks_base.CallbackHandlerMethods.html) for a list of events you can handle. Note that the `handleChain*` events run for most LCEL runnables.

## Next steps[​](#next-steps)

You’ve now learned how to create your own custom callback handlers.

Next, check out the other how-to guides in this section, such as [how to await callbacks in serverless environments](/docs/how_to/callbacks_serverless).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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