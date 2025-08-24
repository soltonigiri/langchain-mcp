How to split by character | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to split by characterPrerequisitesThis guide assumes familiarity with the following concepts:Text splitters](/docs/concepts/text_splitters)

This is the simplest method for splitting text. This splits based on a given character sequence, which defaults to `"\n\n"`. Chunk length is measured by number of characters.

- How the text is split: by single character separator.
- How the chunk size is measured: by number of characters.

To obtain the string content directly, use `.splitText()`.

To create LangChain [Document](https://api.js.langchain.com/classes/langchain_core.documents.Document.html) objects (e.g., for use in downstream tasks), use `.createDocuments()`.

```typescript
import { CharacterTextSplitter } from "@langchain/textsplitters";
import * as fs from "node:fs";

// Load an example document
const rawData = await fs.readFileSync(
  "../../../../examples/state_of_the_union.txt"
);
const stateOfTheUnion = rawData.toString();

const textSplitter = new CharacterTextSplitter({
  separator: "\n\n",
  chunkSize: 1000,
  chunkOverlap: 200,
});
const texts = await textSplitter.createDocuments([stateOfTheUnion]);
console.log(texts[0]);

```

```text
Document {
  pageContent: "Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and th"... 839 more characters,
  metadata: { loc: { lines: { from: 1, to: 17 } } }
}

```You can also propagate metadata associated with each document to the output chunks:

```typescript
const metadatas = [{ document: 1 }, { document: 2 }];

const documents = await textSplitter.createDocuments(
  [stateOfTheUnion, stateOfTheUnion],
  metadatas
);

console.log(documents[0]);

```

```text
Document {
  pageContent: "Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and th"... 839 more characters,
  metadata: { document: 1, loc: { lines: { from: 1, to: 17 } } }
}

```To obtain the string content directly, use `.splitText()`:

```typescript
const chunks = await textSplitter.splitText(stateOfTheUnion);

chunks[0];

```

```text
"Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and th"... 839 more characters

``` ## Next steps[​](#next-steps) You’ve now learned a method for splitting text by character.

Next, check out a [more advanced way of splitting by character](/docs/how_to/recursive_text_splitter), or the [full tutorial on retrieval-augmented generation](/docs/tutorials/rag).

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