How to handle long text | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to handle long textPrerequisitesThis guide assumes familiarity with the following:Extraction](/docs/tutorials/extraction)When working with files, like PDFs, you’re likely to encounter text that exceeds your language model’s context window. To process this text, consider these strategies:Change LLM** Choose a different LLM that supports a larger context window.
- **Brute Force** Chunk the document, and extract content from each chunk.
- **RAG** Chunk the document, index the chunks, and only extract content from a subset of chunks that look “relevant”.

Keep in mind that these strategies have different trade offs and the best strategy likely depends on the application that you’re designing!

## Set up[​](#set-up)

First, let’s install some required dependencies:

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/openai @langchain/core zod cheerio

```**

```bash
yarn add @langchain/openai @langchain/core zod cheerio

```

```bash
pnpm add @langchain/openai @langchain/core zod cheerio

```Next, we need some example data! Let’s download an article about [cars from Wikipedia](https://en.wikipedia.org/wiki/Car) and load it as a LangChain Document.

```typescript
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// Only required in a Deno notebook environment to load the peer dep.
import "cheerio";

const loader = new CheerioWebBaseLoader("https://en.wikipedia.org/wiki/Car");

const docs = await loader.load();

docs[0].pageContent.length;

```

```text
97336

```Define the schema[​](#define-the-schema)Here, we’ll define schema to extract key developments from the text.

```typescript
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const keyDevelopmentSchema = z
  .object({
    year: z
      .number()
      .describe("The year when there was an important historic development."),
    description: z
      .string()
      .describe("What happened in this year? What was the development?"),
    evidence: z
      .string()
      .describe(
        "Repeat verbatim the sentence(s) from which the year and description information were extracted"
      ),
  })
  .describe("Information about a development in the history of cars.");

const extractionDataSchema = z
  .object({
    key_developments: z.array(keyDevelopmentSchema),
  })
  .describe(
    "Extracted information about key developments in the history of cars"
  );

const SYSTEM_PROMPT_TEMPLATE = [
  "You are an expert at identifying key historic development in text.",
  "Only extract important historic developments. Extract nothing if no important information can be found in the text.",
].join("\n");

// Define a custom prompt to provide instructions and any additional context.
// 1) You can add examples into the prompt template to improve extraction quality
// 2) Introduce additional parameters to take context into account (e.g., include metadata
//    about the document from which the text was extracted.)
const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT_TEMPLATE],
  // Keep on reading through this use case to see how to use examples to improve performance
  // MessagesPlaceholder(&#x27;examples&#x27;),
  ["human", "{text}"],
]);

// We will be using tool calling mode, which
// requires a tool calling capable model.
const llm = new ChatOpenAI({
  model: "gpt-4-0125-preview",
  temperature: 0,
});

const extractionChain = prompt.pipe(
  llm.withStructuredOutput(extractionDataSchema)
);

```Brute force approach[​](#brute-force-approach)Split the documents into chunks such that each chunk fits into the context window of the LLMs.

```typescript
import { TokenTextSplitter } from "langchain/text_splitter";

const textSplitter = new TokenTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 20,
});

// Note that this method takes an array of docs
const splitDocs = await textSplitter.splitDocuments(docs);

```Use the .batch method present on all runnables to run the extraction in parallel** across each chunk!

tipYou can often use `.batch()` to parallelize the extractions!

If your model is exposed via an API, this will likely speed up your extraction flow.

```typescript
// Limit just to the first 3 chunks
// so the code can be re-run quickly
const firstFewTexts = splitDocs.slice(0, 3).map((doc) => doc.pageContent);

const extractionChainParams = firstFewTexts.map((text) => {
  return { text };
});

const results = await extractionChain.batch(extractionChainParams, {
  maxConcurrency: 5,
});

```**Merge results[​](#merge-results)After extracting data from across the chunks, we’ll want to merge the extractions together.

```typescript
const keyDevelopments = results.flatMap((result) => result.key_developments);

keyDevelopments.slice(0, 20);

```

```text
[
  { year: 0, description: "", evidence: "" },
  {
    year: 1769,
    description: "French inventor Nicolas-Joseph Cugnot built the first steam-powered road vehicle.",
    evidence: "French inventor Nicolas-Joseph Cugnot built the first steam-powered road vehicle in 1769."
  },
  {
    year: 1808,
    description: "French-born Swiss inventor François Isaac de Rivaz designed and constructed the first internal combu"... 25 more characters,
    evidence: "French-born Swiss inventor François Isaac de Rivaz designed and constructed the first internal combu"... 33 more characters
  },
  {
    year: 1886,
    description: "German inventor Carl Benz patented his Benz Patent-Motorwagen, inventing the modern car—a practical,"... 40 more characters,
    evidence: "The modern car—a practical, marketable automobile for everyday use—was invented in 1886, when German"... 56 more characters
  },
  {
    year: 1908,
    description: "The 1908 Model T, an American car manufactured by the Ford Motor Company, became one of the first ca"... 28 more characters,
    evidence: "One of the first cars affordable by the masses was the 1908 Model T, an American car manufactured by"... 24 more characters
  }
]

```RAG based approach[​](#rag-based-approach)Another simple idea is to chunk up the text, but instead of extracting information from every chunk, just focus on the the most relevant chunks.cautionIt can be difficult to identify which chunks are relevant.For example, in the car article we’re using here, most of the article contains key development information. So by using RAG**, we’ll likely
be throwing out a lot of relevant information.

We suggest experimenting with your use case and determining whether this approach works or not.

Here’s a simple example that relies on an in-memory demo `MemoryVectorStore` vectorstore.

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

// Only load the first 10 docs for speed in this demo use-case
const vectorstore = await MemoryVectorStore.fromDocuments(
  splitDocs.slice(0, 10),
  new OpenAIEmbeddings()
);

// Only extract from top document
const retriever = vectorstore.asRetriever({ k: 1 });

```

In this case the RAG extractor is only looking at the top document.

```typescript
import { RunnableSequence } from "@langchain/core/runnables";

const ragExtractor = RunnableSequence.from([
  {
    text: retriever.pipe((docs) => docs[0].pageContent),
  },
  extractionChain,
]);

```

```typescript
const ragExtractorResults = await ragExtractor.invoke(
  "Key developments associated with cars"
);

```

```typescript
ragExtractorResults.key_developments;

```

```text
[
  {
    year: 2020,
    description: "The lifetime of a car built in the 2020s is expected to be about 16 years, or about 2 million km (1."... 33 more characters,
    evidence: "The lifetime of a car built in the 2020s is expected to be about 16 years, or about 2 millionkm (1.2"... 31 more characters
  },
  {
    year: 2030,
    description: "All fossil fuel vehicles will be banned in Amsterdam from 2030.",
    evidence: "all fossil fuel vehicles will be banned in Amsterdam from 2030."
  },
  {
    year: 2020,
    description: "In 2020, there were 56 million cars manufactured worldwide, down from 67 million the previous year.",
    evidence: "In 2020, there were 56 million cars manufactured worldwide, down from 67 million the previous year."
  }
]

``` ## Common issues[​](#common-issues) Different methods have their own pros and cons related to cost, speed, and accuracy.

Watch out for these issues:

- Chunking content means that the LLM can fail to extract information if the information is spread across multiple chunks.
- Large chunk overlap may cause the same information to be extracted twice, so be prepared to de-duplicate!
- LLMs can make up data. If looking for a single fact across a large text and using a brute force approach, you may end up getting more made up data.

## Next steps[​](#next-steps)

You’ve now learned how to improve extraction quality using few-shot examples.

Next, check out some of the other guides in this section, such as [some tips on how to improve extraction quality with examples](/docs/how_to/extraction_examples).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Set up](#set-up)
- [Define the schema](#define-the-schema)
- [Brute force approach](#brute-force-approach)[Merge results](#merge-results)

- [RAG based approach](#rag-based-approach)
- [Common issues](#common-issues)
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