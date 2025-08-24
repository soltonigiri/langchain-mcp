How to parse XML output | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to parse XML outputPrerequisitesThis guide assumes familiarity with the following concepts: - Chat models](/docs/concepts/chat_models) - [Output parsers](/docs/concepts/output_parsers) - [Prompt templates](/docs/concepts/prompt_templates) - [Structured output](/docs/how_to/structured_output) - [Chaining runnables together](/docs/how_to/sequence/)LLMs from different providers often have different strengths depending on the specific data they are trianed on. This also means that some may be “better” and more reliable at generating output in formats other than JSON.This guide shows you how to use the [XMLOutputParser](https://api.js.langchain.com/classes/langchain_core.output_parsers.XMLOutputParser.html) to prompt models for XML output, then and parse that output into a usable format.noteKeep in mind that large language models are leaky abstractions! You’ll have to use an LLM with sufficient capacity to generate well-formed XML.In the following examples, we use Anthropic’s Claude ([https://docs.anthropic.com/claude/docs](https://docs.anthropic.com/claude/docs)), which is one such model that is optimized for XML tags.tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i @langchain/anthropic @langchain/core

```

```bash
yarn add @langchain/anthropic @langchain/core

```

```bash
pnpm add @langchain/anthropic @langchain/core

```Let’s start with a simple request to the model.

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
  maxTokens: 512,
  temperature: 0.1,
});

const query = `Generate the shortened filmograph for Tom Hanks.`;

const result = await model.invoke(
  query + ` Please enclose the movies in "movie" tags.`
);

console.log(result.content);

```

```text
Here is the shortened filmography for Tom Hanks, with movies enclosed in "movie" tags:

<movie>Forrest Gump</movie>
<movie>Saving Private Ryan</movie>
<movie>Cast Away</movie>
<movie>Apollo 13</movie>
<movie>Catch Me If You Can</movie>
<movie>The Green Mile</movie>
<movie>Toy Story</movie>
<movie>Toy Story 2</movie>
<movie>Toy Story 3</movie>
<movie>Toy Story 4</movie>
<movie>Philadelphia</movie>
<movie>Big</movie>
<movie>Sleepless in Seattle</movie>
<movie>You&#x27;ve Got Mail</movie>
<movie>The Terminal</movie>

```This actually worked pretty well! But it would be nice to parse that XML into a more easily usable format. We can use the `XMLOutputParser` to both add default format instructions to the prompt and parse outputted XML into a dict:

```typescript
import { XMLOutputParser } from "@langchain/core/output_parsers";

// We will add these instructions to the prompt below
const parser = new XMLOutputParser();

parser.getFormatInstructions();

```

```text
"The output should be formatted as a XML file.\n" +
  "1. Output should conform to the tags below. \n" +
  "2. If tag"... 434 more characters

```

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromTemplate(
  `{query}\n{format_instructions}`
);
const partialedPrompt = await prompt.partial({
  format_instructions: parser.getFormatInstructions(),
});

const chain = partialedPrompt.pipe(model).pipe(parser);

const output = await chain.invoke({
  query: "Generate the shortened filmograph for Tom Hanks.",
});

console.log(JSON.stringify(output, null, 2));

```

```text
{
  "filmography": [
    {
      "actor": [
        {
          "name": "Tom Hanks"
        },
        {
          "films": [
            {
              "film": [
                {
                  "title": "Forrest Gump"
                },
                {
                  "year": "1994"
                },
                {
                  "role": "Forrest Gump"
                }
              ]
            },
            {
              "film": [
                {
                  "title": "Saving Private Ryan"
                },
                {
                  "year": "1998"
                },
                {
                  "role": "Captain Miller"
                }
              ]
            },
            {
              "film": [
                {
                  "title": "Cast Away"
                },
                {
                  "year": "2000"
                },
                {
                  "role": "Chuck Noland"
                }
              ]
            },
            {
              "film": [
                {
                  "title": "Catch Me If You Can"
                },
                {
                  "year": "2002"
                },
                {
                  "role": "Carl Hanratty"
                }
              ]
            },
            {
              "film": [
                {
                  "title": "The Terminal"
                },
                {
                  "year": "2004"
                },
                {
                  "role": "Viktor Navorski"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

```You’ll notice above that our output is no longer just between `movie` tags. We can also add some tags to tailor the output to our needs:

```typescript
const parserWithTags = new XMLOutputParser({
  tags: ["movies", "actor", "film", "name", "genre"],
});

// We will add these instructions to the prompt below
parserWithTags.getFormatInstructions();

```

```text
"The output should be formatted as a XML file.\n" +
  "1. Output should conform to the tags below. \n" +
  "2. If tag"... 460 more characters

```You can and should experiment with adding your own formatting hints in the other parts of your prompt to either augment or replace the default instructions.

Here’s the result when we invoke it:

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptWithTags = ChatPromptTemplate.fromTemplate(
  `{query}\n{format_instructions}`
);
const partialedPromptWithTags = await promptWithTags.partial({
  format_instructions: parserWithTags.getFormatInstructions(),
});

const chainWithTags = partialedPromptWithTags.pipe(model).pipe(parserWithTags);

const outputWithTags = await chainWithTags.invoke({
  query: "Generate the shortened filmograph for Tom Hanks.",
});

console.log(JSON.stringify(outputWithTags, null, 2));

```

```text
{
  "movies": [
    {
      "actor": [
        {
          "film": [
            {
              "name": "Forrest Gump"
            },
            {
              "genre": "Drama"
            }
          ]
        },
        {
          "film": [
            {
              "name": "Saving Private Ryan"
            },
            {
              "genre": "War"
            }
          ]
        },
        {
          "film": [
            {
              "name": "Cast Away"
            },
            {
              "genre": "Drama"
            }
          ]
        },
        {
          "film": [
            {
              "name": "Catch Me If You Can"
            },
            {
              "genre": "Biography"
            }
          ]
        },
        {
          "film": [
            {
              "name": "The Terminal"
            },
            {
              "genre": "Comedy-drama"
            }
          ]
        }
      ]
    }
  ]
}

``` ## Next steps[​](#next-steps) You’ve now learned how to prompt a model to return XML. Next, check out the [broader guide on obtaining structured output](/docs/how_to/structured_output) for other related techniques.

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