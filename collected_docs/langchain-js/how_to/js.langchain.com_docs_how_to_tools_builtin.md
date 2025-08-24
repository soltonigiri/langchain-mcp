How to use LangChain tools | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to use LangChain toolsTools are interfaces that an agent, chain, or LLM can use to interact with the world. They combine a few things:The name of the toolA description of what the tool isJSON schema of what the inputs to the tool areThe function to callWhether the result of a tool should be returned directly to the userIt is useful to have all this information because this information can be used to build action-taking systems! The name, description, and schema can be used to prompt the LLM so it knows how to specify what action to take, and then the function to call is equivalent to taking that action.The simpler the input to a tool is, the easier it is for an LLM to be able to use it. Many agents will only work with tools that have a single string input.Importantly, the name, description, and schema (if used) are all used in the prompt. Therefore, it is vitally important that they are clear and describe exactly how the tool should be used.Default Tools​](#default-tools)Let’s take a look at how to work with tools. To do this, we’ll work with a built in tool.

```typescript
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

const tool = new WikipediaQueryRun({
  topKResults: 1,
  maxDocContentLength: 100,
});

```This is the default name:

```typescript
tool.name;

```

```text
"wikipedia-api"

```This is the default description:

```typescript
tool.description;

```

```text
"A tool for interacting with and fetching data from the Wikipedia API."

```This is the default schema of the inputs. This is a [Zod](https://zod.dev) schema on the tool class. We convert it to JSON schema for display purposes:

```typescript
import { zodToJsonSchema } from "zod-to-json-schema";

zodToJsonSchema(tool.schema);

```

```text
{
  type: "object",
  properties: { input: { type: "string" } },
  additionalProperties: false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}

```We can see if the tool should return directly to the user

```typescript
tool.returnDirect;

```

```text
false

```We can invoke this tool with an object input:

```typescript
await tool.invoke({ input: "langchain" });

```

```text
"Page: LangChain\n" +
  "Summary: LangChain is a framework designed to simplify the creation of applications "

```We can also invoke this tool with a single string input. We can do this because this tool expects only a single input. If it required multiple inputs, we would not be able to do that.

```typescript
await tool.invoke("langchain");

```

```text
"Page: LangChain\n" +
  "Summary: LangChain is a framework designed to simplify the creation of applications "

```How to use built-in toolkits[​](#how-to-use-built-in-toolkits)Toolkits are collections of tools that are designed to be used together for specific tasks. They have convenient loading methods.For a complete list of available ready-made toolkits, visit [Integrations](/docs/integrations/toolkits/).All Toolkits expose a getTools() method which returns a list of tools.You’re usually meant to use them this way:

```ts
// Initialize a toolkit
const toolkit = new ExampleTookit(...);

// Get list of tools
const tools = toolkit.getTools();

```More Topics[​](#more-topics)This was a quick introduction to tools in LangChain, but there is a lot more to learn[Built-In Tools](/docs/integrations/tools/)**: For a list of all built-in tools, see [this page](/docs/integrations/tools/)**[Custom Tools](/docs/how_to/custom_tools)**: Although built-in tools are useful, it’s highly likely that you’ll have to define your own tools. See [this guide](/docs/how_to/custom_tools) for instructions on how to do so. #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Default Tools](#default-tools)
- [How to use built-in toolkits](#how-to-use-built-in-toolkits)
- [More Topics](#more-topics)

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