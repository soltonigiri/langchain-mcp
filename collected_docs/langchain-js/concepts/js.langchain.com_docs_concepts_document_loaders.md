Document loaders | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageDocument loaders[Prerequisites]Document loaders API reference](/docs/how_to/#document-loaders)

Document loaders are designed to load document objects. LangChain has hundreds of integrations with various data sources to load data from: Slack, Notion, Google Drive, etc.

## Integrations[​](#integrations)

You can find available integrations on the [Document loaders integrations page](/docs/integrations/document_loaders/).

## Interface[​](#interface)

Documents loaders implement the [BaseLoader interface](https://api.js.langchain.com/classes/_langchain_core.document_loaders_base.BaseDocumentLoader.html).

Each DocumentLoader has its own specific parameters, but they can all be invoked in the same way with the `.load` method or `.lazy_load`.

Here&#x27;s a simple example:

```typescript
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const loader = new CSVLoader(
  ...  // <-- Integration specific parameters here
);
const data = await loader.load();

```

## Related resources[​](#related-resources) Please see the following resources for more information:

- [How-to guides for document loaders](/docs/how_to/#document-loaders)
- [Document API reference](https://api.js.langchain.com/classes/_langchain_core.documents.Document.html)
- [Document loaders integrations](/docs/integrations/document_loaders/)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Integrations](#integrations)
- [Interface](#interface)
- [Related resources](#related-resources)

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