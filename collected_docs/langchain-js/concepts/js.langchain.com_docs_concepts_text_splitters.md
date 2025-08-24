Text splitters | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageText splitters[Prerequisites]Documents](/docs/concepts/retrievers/#interface)[Tokenization](/docs/concepts/tokens)Overview[​](#overview)Document splitting is often a crucial preprocessing step for many applications. It involves breaking down large texts into smaller, manageable chunks. This process offers several benefits, such as ensuring consistent processing of varying document lengths, overcoming input size limitations of models, and improving the quality of text representations used in retrieval systems. There are several strategies for splitting documents, each with its own advantages.Key concepts[​](#key-concepts)![Conceptual Overview ](/assets/images/text_splitters-7961ccc13e05e2fd7f7f58048e082f47.png)Text splitters split documents into smaller chunks for use in downstream applications.Why split documents?[​](#why-split-documents)There are several reasons to split documents:Handling non-uniform document lengths**: Real-world document collections often contain texts of varying sizes. Splitting ensures consistent processing across all documents.
- **Overcoming model limitations**: Many embedding models and language models have maximum input size constraints. Splitting allows us to process documents that would otherwise exceed these limits.
- **Improving representation quality**: For longer documents, the quality of embeddings or other representations may degrade as they try to capture too much information. Splitting can lead to more focused and accurate representations of each section.
- **Enhancing retrieval precision**: In information retrieval systems, splitting can improve the granularity of search results, allowing for more precise matching of queries to relevant document sections.
- **Optimizing computational resources**: Working with smaller chunks of text can be more memory-efficient and allow for better parallelization of processing tasks.

Now, the next question is *how* to split the documents into chunks! There are several strategies, each with its own advantages.

[Further reading] - See Greg Kamradt&#x27;s [chunkviz](https://chunkviz.up.railway.app/) to visualize different splitting strategies discussed below. ## Approaches[​](#approaches) ### Length-based[​](#length-based) The most intuitive strategy is to split documents based on their length. This simple yet effective approach ensures that each chunk doesn&#x27;t exceed a specified size limit. Key benefits of length-based splitting:

- Straightforward implementation
- Consistent chunk sizes
- Easily adaptable to different model requirements

Types of length-based splitting:

- **Token-based**: Splits text based on the number of tokens, which is useful when working with language models.
- **Character-based**: Splits text based on the number of characters, which can be more consistent across different types of text.

Example implementation using LangChain&#x27;s `CharacterTextSplitter` with character based splitting:

```typescript
import { CharacterTextSplitter } from "@langchain/textsplitters";
const textSplitter = new CharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 0,
});
const texts = await textSplitter.splitText(document);

```**[Further reading]See the how-to guide for [token-based](/docs/how_to/split_by_token/) splitting.See the how-to guide for [character-based](/docs/how_to/character_text_splitter/) splitting.Text-structured based[​](#text-structured-based)Text is naturally organized into hierarchical units such as paragraphs, sentences, and words. We can leverage this inherent structure to inform our splitting strategy, creating split that maintain natural language flow, maintain semantic coherence within split, and adapts to varying levels of text granularity. LangChain&#x27;s [RecursiveCharacterTextSplitter](/docs/how_to/recursive_text_splitter/) implements this concept:The RecursiveCharacterTextSplitter attempts to keep larger units (e.g., paragraphs) intact.If a unit exceeds the chunk size, it moves to the next level (e.g., sentences).This process continues down to the word level if necessary.Here is example usage:

```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 0,
});
const texts = await textSplitter.splitText(document);

```[Further reading]See the how-to guide for [recursive text splitting](/docs/how_to/recursive_text_splitter/).Document-structured based[​](#document-structured-based)Some documents have an inherent structure, such as HTML, Markdown, or JSON files. In these cases, it&#x27;s beneficial to split the document based on its structure, as it often naturally groups semantically related text. Key benefits of structure-based splitting:Preserves the logical organization of the documentMaintains context within each chunkCan be more effective for downstream tasks like retrieval or summarizationExamples of structure-based splitting:Markdown**: Split based on headers (e.g., #, ##, ###)
- **HTML**: Split using tags
- **JSON**: Split by object or array elements
- **Code**: Split by functions, classes, or logical blocks

[Further reading] - See the how-to guide for [Code splitting](/docs/how_to/code_splitter/). ### Semantic meaning based[​](#semantic-meaning-based) Unlike the previous methods, semantic-based splitting actually considers the *content* of the text. While other approaches use document or text structure as proxies for semantic meaning, this method directly analyzes the text&#x27;s semantics. There are several ways to implement this, but conceptually the approach is split text when there are significant changes in text *meaning*. As an example, we can use a sliding window approach to generate embeddings, and compare the embeddings to find significant differences:

- Start with the first few sentences and generate an embedding.
- Move to the next group of sentences and generate another embedding (e.g., using a sliding window approach).
- Compare the embeddings to find significant differences, which indicate potential "break points" between semantic sections.

This technique helps create chunks that are more semantically coherent, potentially improving the quality of downstream tasks like retrieval or summarization.

[Further reading]

- See Greg Kamradt&#x27;s [notebook](https://github.com/FullStackRetrieval-com/RetrievalTutorials/blob/main/tutorials/LevelsOfTextSplitting/5_Levels_Of_Text_Splitting.ipynb) showcasing semantic splitting.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Overview](#overview)
- [Key concepts](#key-concepts)
- [Why split documents?](#why-split-documents)
- [Approaches](#approaches)[Length-based](#length-based)
- [Text-structured based](#text-structured-based)
- [Document-structured based](#document-structured-based)
- [Semantic meaning based](#semantic-meaning-based)

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