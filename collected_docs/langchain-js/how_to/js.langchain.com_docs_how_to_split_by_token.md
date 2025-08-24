How to split text by tokens | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to split text by tokensPrerequisitesThis guide assumes familiarity with the following concepts:Text splitters](/docs/concepts/text_splitters)Language models have a token limit. You should not exceed the token limit. When you split your text into chunks it is therefore a good idea to count the number of tokens. There are many tokenizers. When you count tokens in your text you should use the same tokenizer as used in the language model.js-tiktoken[​](#js-tiktoken)note[js-tiktoken](https://github.com/openai/js-tiktoken) is a JavaScript version of the BPE tokenizer created by OpenAI.We can use js-tiktoken to estimate tokens used. It is tuned to OpenAI models.How the text is split: by character passed in.How the chunk size is measured: by the js-tiktoken tokenizer.You can use the [TokenTextSplitter](https://api.js.langchain.com/classes/langchain_textsplitters.TokenTextSplitter.html) like this:

```typescript
import { TokenTextSplitter } from "@langchain/textsplitters";
import * as fs from "node:fs";

// Load an example document
const rawData = await fs.readFileSync(
  "../../../../examples/state_of_the_union.txt"
);
const stateOfTheUnion = rawData.toString();

const textSplitter = new TokenTextSplitter({
  chunkSize: 10,
  chunkOverlap: 0,
});

const texts = await textSplitter.splitText(stateOfTheUnion);

console.log(texts[0]);

```

```text
Madam Speaker, Madam Vice President, our

```Note:** Some written languages (e.g. Chinese and Japanese) have characters which encode to 2 or more tokens. Using the TokenTextSplitter directly can split the tokens for a character between two chunks causing malformed Unicode characters. ## Next steps[​](#next-steps) You’ve now learned a method for splitting text based on token count.Next, check out the [full tutorial on retrieval-augmented generation](/docs/tutorials/rag). #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [js-tiktoken](#js-tiktoken)
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