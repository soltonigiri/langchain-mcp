How to try to fix errors in output parsing | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[How to try to fix errors in output parsingPrerequisitesThis guide assumes familiarity with the following concepts: - Chat models](/docs/concepts/chat_models) - [Output parsers](/docs/concepts/output_parsers) - [Prompt templates](/docs/concepts/prompt_templates) - [Chaining runnables together](/docs/how_to/sequence/)LLMs aren’t perfect, and sometimes fail to produce output that perfectly matches a the desired format. To help handle errors, we can use the [OutputFixingParser](https://api.js.langchain.com/classes/langchain.output_parsers.OutputFixingParser.html) This output parser wraps another output parser, and in the event that the first one fails, it calls out to another LLM in an attempt to fix any errors.Specifically, we can pass the misformatted output, along with the formatted instructions, to the model and ask it to fix it.For this example, we’ll use the [StructuredOutputParser](https://api.js.langchain.com/classes/langchain_core.output_parsers.StructuredOutputParser.html), which can validate output according to a Zod schema. Here’s what happens if we pass it a result that does not comply with the schema:

```typescript
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const zodSchema = z.object({
  name: z.string().describe("name of an actor"),
  film_names: z
    .array(z.string())
    .describe("list of names of films they starred in"),
});

const parser = StructuredOutputParser.fromZodSchema(zodSchema);

const misformatted = "{&#x27;name&#x27;: &#x27;Tom Hanks&#x27;, &#x27;film_names&#x27;: [&#x27;Forrest Gump&#x27;]}";

await parser.parse(misformatted);

```

```text
Error: Failed to parse. Text: "{&#x27;name&#x27;: &#x27;Tom Hanks&#x27;, &#x27;film_names&#x27;: [&#x27;Forrest Gump&#x27;]}". Error: SyntaxError: Expected property name or &#x27;}&#x27; in JSON at position 1 (line 1 column 2)

```Now we can construct and use a OutputFixingParser. This output parser takes as an argument another output parser but also an LLM with which to try to correct any formatting mistakes.

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

import { OutputFixingParser } from "langchain/output_parsers";

const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
  maxTokens: 512,
  temperature: 0.1,
});

const parserWithFix = OutputFixingParser.fromLLM(model, parser);

await parserWithFix.parse(misformatted);

```

```text
{
  name: "Tom Hanks",
  film_names: [
    "Forrest Gump",
    "Saving Private Ryan",
    "Cast Away",
    "Catch Me If You Can"
  ]
}

```For more about different parameters and options, check out our [API reference docs](https://api.js.langchain.com/classes/langchain.output_parsers.OutputFixingParser.html). #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). Community[LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.