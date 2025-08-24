How to load HTML | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to load HTMLThe HyperText Markup Language or HTML](https://en.wikipedia.org/wiki/HTML) is the standard markup language for documents designed to be displayed in a web browser.This covers how to load HTML documents into a LangChain [Document](https://api.js.langchain.com/classes/langchain_core.documents.Document.html) objects that we can use downstream.Parsing HTML files often requires specialized tools. Here we demonstrate parsing via [Unstructured](https://unstructured-io.github.io/unstructured/). Head over to the integrations page to find integrations with additional services, such as [FireCrawl](/docs/integrations/document_loaders/web_loaders/firecrawl).PrerequisitesThis guide assumes familiarity with the following concepts:[Documents](https://api.js.langchain.com/classes/_langchain_core.documents.Document.html)
- [Document Loaders](/docs/concepts/document_loaders)

## Installation[​](#installation)

- npm
- yarn
- pnpm

```bash
npm i @langchain/community @langchain/core

```

```bash
yarn add @langchain/community @langchain/core

```

```bash
pnpm add @langchain/community @langchain/core

``` ## Setup[​](#setup) Although Unstructured has an open source offering, you’re still required to provide an API key to access the service. To get everything up and running, follow these two steps:

- Download & start the Docker container:

```bash
docker run -p 8000:8000 -d --rm --name unstructured-api downloads.unstructured.io/unstructured-io/unstructured-api:latest --port 8000 --host 0.0.0.0

```

- Get a free API key & API URL [here](https://unstructured.io/api-key), and set it in your environment (as per the Unstructured website, it may take up to an hour to allocate your API key & URL.):

```bash
export UNSTRUCTURED_API_KEY="..."
# Replace with your `Full URL` from the email
export UNSTRUCTURED_API_URL="https://<ORG_NAME>-<SECRET>.api.unstructuredapp.io/general/v0/general"

```

## Loading HTML with Unstructured[​](#loading-html-with-unstructured)

```typescript
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";

const filePath =
  "../../../../libs/langchain-community/src/tools/fixtures/wordoftheday.html";

const loader = new UnstructuredLoader(filePath, {
  apiKey: process.env.UNSTRUCTURED_API_KEY,
  apiUrl: process.env.UNSTRUCTURED_API_URL,
});

const data = await loader.load();
console.log(data.slice(0, 5));

```

```text
[
  Document {
    pageContent: &#x27;Word of the Day&#x27;,
    metadata: {
      category_depth: 0,
      languages: [Array],
      filename: &#x27;wordoftheday.html&#x27;,
      filetype: &#x27;text/html&#x27;,
      category: &#x27;Title&#x27;
    }
  },
  Document {
    pageContent: &#x27;: April 10, 2023&#x27;,
    metadata: {
      emphasized_text_contents: [Array],
      emphasized_text_tags: [Array],
      languages: [Array],
      parent_id: &#x27;b845e60d85ff7d10abda4e5f9a37eec8&#x27;,
      filename: &#x27;wordoftheday.html&#x27;,
      filetype: &#x27;text/html&#x27;,
      category: &#x27;UncategorizedText&#x27;
    }
  },
  Document {
    pageContent: &#x27;foible&#x27;,
    metadata: {
      category_depth: 1,
      languages: [Array],
      parent_id: &#x27;b845e60d85ff7d10abda4e5f9a37eec8&#x27;,
      filename: &#x27;wordoftheday.html&#x27;,
      filetype: &#x27;text/html&#x27;,
      category: &#x27;Title&#x27;
    }
  },
  Document {
    pageContent: &#x27;play&#x27;,
    metadata: {
      category_depth: 0,
      link_texts: [Array],
      link_urls: [Array],
      link_start_indexes: [Array],
      languages: [Array],
      filename: &#x27;wordoftheday.html&#x27;,
      filetype: &#x27;text/html&#x27;,
      category: &#x27;Title&#x27;
    }
  },
  Document {
    pageContent: &#x27;noun&#x27;,
    metadata: {
      category_depth: 0,
      emphasized_text_contents: [Array],
      emphasized_text_tags: [Array],
      languages: [Array],
      filename: &#x27;wordoftheday.html&#x27;,
      filetype: &#x27;text/html&#x27;,
      category: &#x27;Title&#x27;
    }
  }
]

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Installation](#installation)
- [Setup](#setup)
- [Loading HTML with Unstructured](#loading-html-with-unstructured)

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