How to await callbacks in serverless environments | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to await callbacks in serverless environmentsPrerequisitesThis guide assumes familiarity with the following concepts:Callbacks](/docs/concepts/callbacks)As of @langchain/core@0.3.0, LangChain.js callbacks run in the background. This means that execution will not** wait for the callback to either return before continuing. Prior to 0.3.0, this behavior was the opposite.If you are running code in [serverless environments](https://en.wikipedia.org/wiki/Serverless_computing) such as [AWS Lambda](https://aws.amazon.com/pm/lambda/) or [Cloudflare Workers](https://workers.cloudflare.com/) you should set your callbacks to be blocking to allow them time to finish or timeout.To make callbacks blocking, set the LANGCHAIN_CALLBACKS_BACKGROUND environment variable to "false". Alternatively, you can import the global [awaitAllCallbacks](https://api.js.langchain.com/functions/langchain_core.callbacks_promises.awaitAllCallbacks.html) method to ensure all callbacks finish if necessary.To illustrate this, we’ll create a [custom callback handler](/docs/how_to/custom_callbacks) that takes some time to resolve, and show the timing with and without LANGCHAIN_CALLBACKS_BACKGROUND set to "false". Here it is without the variable set along with the awaitAllCallbacks global:

```typescript
import { RunnableLambda } from "@langchain/core/runnables";
import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";

const runnable = RunnableLambda.from(() => "hello!");

const customHandler = {
  handleChainEnd: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Call finished");
  },
};

const startTime = new Date().getTime();

await runnable.invoke({ number: "2" }, { callbacks: [customHandler] });

console.log(`Elapsed time: ${new Date().getTime() - startTime}ms`);

await awaitAllCallbacks();

console.log(`Final elapsed time: ${new Date().getTime() - startTime}ms`);

```

```text
Elapsed time: 1ms
Call finished
Final elapsed time: 2164ms

```We can see that the initial runnable.invoke() call finishes in a short amount of time, and then roughly two seconds later, the callbacks finish.And here it is with backgrounding off:

```typescript
process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "false";

const startTimeBlocking = new Date().getTime();

await runnable.invoke({ number: "2" }, { callbacks: [customHandler] });

console.log(
  `Initial elapsed time: ${new Date().getTime() - startTimeBlocking}ms`
);

```

```text
Call finished
Initial elapsed time: 2002ms

```This time, the initial call by itself takes two seconds because the invoke() call waits for the callback to return before returning. ## Next steps[​](#next-steps) You’ve now learned how to run callbacks in the background to reduce latency.Next, check out the other how-to guides in this section, such as [how to create custom callback handlers](/docs/how_to/custom_callbacks). #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Next steps](#next-steps)

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