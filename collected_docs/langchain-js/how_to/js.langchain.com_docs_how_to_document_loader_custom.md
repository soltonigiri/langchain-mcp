How to write a custom document loader | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to write a custom document loaderIf you want to implement your own Document Loader, you have a few options.Subclassing BaseDocumentLoader​](#subclassing-basedocumentloader)You can extend the BaseDocumentLoader class directly. The BaseDocumentLoader class provides a few convenience methods for loading documents from a variety of sources.

```typescript
abstract class BaseDocumentLoader implements DocumentLoader {
  abstract load(): Promise<Document[]>;
}

``` ### Subclassing TextLoader[​](#subclassing-textloader) If you want to load documents from a text file, you can extend the TextLoader class. The TextLoader class takes care of reading the file, so all you have to do is implement a parse method.

```typescript
abstract class TextLoader extends BaseDocumentLoader {
  abstract parse(raw: string): Promise<string[]>;
}

``` ### Subclassing BufferLoader[​](#subclassing-bufferloader) If you want to load documents from a binary file, you can extend the BufferLoader class. The BufferLoader class takes care of reading the file, so all you have to do is implement a parse method.

```typescript
abstract class BufferLoader extends BaseDocumentLoader {
  abstract parse(
    raw: Buffer,
    metadata: Document["metadata"]
  ): Promise<Document[]>;
}

``` #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Subclassing BaseDocumentLoader](#subclassing-basedocumentloader)
- [Subclassing TextLoader](#subclassing-textloader)
- [Subclassing BufferLoader](#subclassing-bufferloader)

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