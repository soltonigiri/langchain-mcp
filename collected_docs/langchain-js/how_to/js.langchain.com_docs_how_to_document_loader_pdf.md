How to load PDF files | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to load PDF filesPortable Document Format (PDF)](https://en.wikipedia.org/wiki/PDF), standardized as ISO 32000, is a file format developed by Adobe in 1992 to present documents, including text formatting and images, in a manner independent of application software, hardware, and operating systems.This covers how to load PDF documents into the Document format that we use downstream.By default, one document will be created for each page in the PDF file. You can change this behavior by setting the splitPages option to false. ## Setup[​](#setup) npm
- Yarn
- pnpm

```bash
npm install pdf-parse

```

```bash
yarn add pdf-parse

```

```bash
pnpm add pdf-parse

``` ## Usage, one document per page[​](#usage-one-document-per-page)

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// Or, in web environments:
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
// const blob = new Blob(); // e.g. from a file input
// const loader = new WebPDFLoader(blob);

const loader = new PDFLoader("src/document_loaders/example_data/example.pdf");

const docs = await loader.load();

``` ## Usage, one document per file[​](#usage-one-document-per-file)

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("src/document_loaders/example_data/example.pdf", {
  splitPages: false,
});

const docs = await loader.load();

``` ## Usage, custom pdfjs build[​](#usage-custom-pdfjs-build) By default we use the `pdfjs` build bundled with `pdf-parse`, which is compatible with most environments, including Node.js and modern browsers. If you want to use a more recent version of `pdfjs-dist` or if you want to use a custom build of `pdfjs-dist`, you can do so by providing a custom `pdfjs` function that returns a promise that resolves to the `PDFJS` object.

In the following example we use the "legacy" (see [pdfjs docs](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#which-browsersenvironments-are-supported)) build of `pdfjs-dist`, which includes several polyfills not included in the default build.

- npm
- Yarn
- pnpm

```bash
npm install pdfjs-dist

```

```bash
yarn add pdfjs-dist

```

```bash
pnpm add pdfjs-dist

```

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("src/document_loaders/example_data/example.pdf", {
  // you may need to add `.then(m => m.default)` to the end of the import
  pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js"),
});

``` ## Eliminating extra spaces[​](#eliminating-extra-spaces) PDFs come in many varieties, which makes reading them a challenge. The loader parses individual text elements and joins them together with a space by default, but if you are seeing excessive spaces, this may not be the desired behavior. In that case, you can override the separator with an empty string like this:

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("src/document_loaders/example_data/example.pdf", {
  parsedItemSeparator: "",
});

const docs = await loader.load();

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Usage, one document per page](#usage-one-document-per-page)
- [Usage, one document per file](#usage-one-document-per-file)
- [Usage, custom pdfjs build](#usage-custom-pdfjs-build)
- [Eliminating extra spaces](#eliminating-extra-spaces)

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