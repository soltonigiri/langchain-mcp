How to load Markdown | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to load MarkdownMarkdown](https://en.wikipedia.org/wiki/Markdown) is a lightweight markup language for creating formatted text using a plain-text editor.Here we cover how to load Markdown documents into LangChain [Document](https://api.js.langchain.com/classes/langchain_core.documents.Document.html) objects that we can use downstream.We will cover:Basic usage;
- Parsing of Markdown into elements such as titles, list items, and text.

LangChain implements an [UnstructuredLoader](https://api.js.langchain.com/classes/langchain.document_loaders_fs_unstructured.UnstructuredLoader.html) class.

PrerequisitesThis guide assumes familiarity with the following concepts:

- [Documents](https://api.js.langchain.com/classes/_langchain_core.documents.Document.html)
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

```Basic usage will ingest a Markdown file to a single document. Here we demonstrate on LangChain’s readme:

```typescript
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";

const markdownPath = "../../../../README.md";

const loader = new UnstructuredLoader(markdownPath, {
  apiKey: process.env.UNSTRUCTURED_API_KEY,
  apiUrl: process.env.UNSTRUCTURED_API_URL,
});

const data = await loader.load();
console.log(data.slice(0, 5));

```

```text
[
  Document {
    pageContent: &#x27;🦜️🔗 LangChain.js&#x27;,
    metadata: {
      languages: [Array],
      filename: &#x27;README.md&#x27;,
      filetype: &#x27;text/markdown&#x27;,
      category: &#x27;Title&#x27;
    }
  },
  Document {
    pageContent: &#x27;⚡ Building applications with LLMs through composability ⚡&#x27;,
    metadata: {
      languages: [Array],
      filename: &#x27;README.md&#x27;,
      filetype: &#x27;text/markdown&#x27;,
      category: &#x27;Title&#x27;
    }
  },
  Document {
    pageContent: &#x27;Looking for the Python version? Check out LangChain.&#x27;,
    metadata: {
      languages: [Array],
      parent_id: &#x27;7ea17bcb17b10f303cbb93b4cb95de93&#x27;,
      filename: &#x27;README.md&#x27;,
      filetype: &#x27;text/markdown&#x27;,
      category: &#x27;NarrativeText&#x27;
    }
  },
  Document {
    pageContent: &#x27;To help you ship LangChain apps to production faster, check out LangSmith.\n&#x27; +
      &#x27;LangSmith is a unified developer platform for building, testing, and monitoring LLM applications.\n&#x27; +
      &#x27;Fill out this form to get on the waitlist or speak with our sales team.&#x27;,
    metadata: {
      languages: [Array],
      parent_id: &#x27;7ea17bcb17b10f303cbb93b4cb95de93&#x27;,
      filename: &#x27;README.md&#x27;,
      filetype: &#x27;text/markdown&#x27;,
      category: &#x27;NarrativeText&#x27;
    }
  },
  Document {
    pageContent: &#x27;⚡️ Quick Install&#x27;,
    metadata: {
      languages: [Array],
      filename: &#x27;README.md&#x27;,
      filetype: &#x27;text/markdown&#x27;,
      category: &#x27;Title&#x27;
    }
  }
]

``` ## Retain Elements[​](#retain-elements) Under the hood, Unstructured creates different “elements” for different chunks of text. By default we combine those together, but you can easily keep that separation by specifying `chunkingStrategy: "by_title"`.

```typescript
const loaderByTitle = new UnstructuredLoader(markdownPath, {
  chunkingStrategy: "by_title",
});

const loadedDocs = await loaderByTitle.load();

console.log(`Number of documents: ${loadedDocs.length}\n`);

for (const doc of loadedDocs.slice(0, 2)) {
  console.log(doc);
  console.log("\n");
}

```

```text
Number of documents: 13

Document {
  pageContent: &#x27;🦜️🔗 LangChain.js\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;⚡ Building applications with LLMs through composability ⚡\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;Looking for the Python version? Check out LangChain.\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;To help you ship LangChain apps to production faster, check out LangSmith.\n&#x27; +
    &#x27;LangSmith is a unified developer platform for building, testing, and monitoring LLM applications.\n&#x27; +
    &#x27;Fill out this form to get on the waitlist or speak with our sales team.&#x27;,
  metadata: {
    filename: &#x27;README.md&#x27;,
    filetype: &#x27;text/markdown&#x27;,
    languages: [ &#x27;eng&#x27; ],
    orig_elements: &#x27;eJzNUtuO0zAQ/ZVRnquSS3PjBcGyPHURgr5tV2hijxNTJ45ip0u14t8Zp1y6CCF4ACFLlufuc+bcPkRkqKfBv9cyegpREWNZosxS0RRVzmeTCiFlnmRUFZmQ0QqinjxK9Mj5D5HShgbsKRS/vX7+8uZ63S9ZIeBP4xLw9NE/6XxvQsDg0M7YkuPIbURDG919Wp1zQu5+llVGfMta7GdFsVo8MniSErZcfdWhHtYfXOj2dcROe0MRN/oRUUmYlI1o+EpilcWZaJo6azaiqXNJdfYvEKUFJvBi1kbqoQUcR6MFem0HB/fad7Dd3jjw3WTntgNh+9E6bLTR/gTn4t9CmhHFTc1w80oKSUlTpFWaFKWsVR5nFf0dpOwdcfoDvi+p2Vp7CJQoOzF+gjcn39kBjjQ5ZucZXHUkDmBnf7H3Sy5e4zQxkUfahYY/4UQqVcZJpSpspKqSMslVllWJzDdMC6XVf8jJzkJHZoSTncF1evwOPSiHdWJhnKycRRAQKHSephWIR0y961lW6/3w7Q3aAcI8aKVJgqQjGTvSBKNBz+T3ywaaLwpdgSfnlwcOEno7aG+nsCcW6iP58ohX2phlru94xtKLf9iSB/5d2Ok9smC1Y3sCNxIezpq3M5toiAER9r/a6t1n6BJ/zg==&#x27;,
    category: &#x27;CompositeElement&#x27;
  }
}

Document {
  pageContent: &#x27;⚡️ Quick Install\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;You can use npm, yarn, or pnpm to install LangChain.js\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;npm install -S langchain or yarn add langchain or pnpm add langchain\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;typescript\n&#x27; +
    &#x27;import { ChatOpenAI } from "langchain/chat_models/openai";\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;🌐 Supported Environments\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;LangChain is written in TypeScript and can be used in:\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;Node.js (ESM and CommonJS) - 18.x, 19.x, 20.x\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;Cloudflare Workers\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;Vercel / Next.js (Browser, Serverless and Edge functions)\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;Supabase Edge Functions\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;Browser\n&#x27; +
    &#x27;\n&#x27; +
    &#x27;Deno&#x27;,
  metadata: {
    filename: &#x27;README.md&#x27;,
    filetype: &#x27;text/markdown&#x27;,
    languages: [ &#x27;eng&#x27; ],
    orig_elements: &#x27;eJzNlm1v2zYQx7/KQa9WwE1Iik/qXnWpB2RoM2wOOgx1URzJY6pVogyJTlME/e6j3KZIhgBzULjIG0Li3VH+/e/BfHNdUUc9pfyuDdUzqGzUjUUda1ZbL7R1UQetnNdMK9swVy2g6iljwIzF/7qKbUcJe5qD/1w+f/FqedSH2Ws25E+bnSHTVT5+n/tuNnSYLrZ4QVOxvKkoXVRvPy+++My+663QyNfbSCzCH9vWf4DTNGXsdsE3J563uaOqxP0XIDSxCdobSZIYd9w7JpQlLU3TaKf4YQDK7gbHB8h4m/jvYQseE2wngrTpF/AJx7SAYYRNeYU8QPtFAHhZvnzyHtt09M90W40zHEfM7SWdz0fep0otuUISLBqMjfNFjMYzI6SWFFWQj1CVGf2G++kK5uP9jD7rMgsEGMLd3Z1ad3YfpJHWsubSchGQeNRItUGPElF7wck2hy/9OWbyY7vJ69T2m2HMcA0l3/n3DaXnp/AZ4jj0sK6+AR6XNb/rh0DddDwUL2zX1c97NUpjVAEOxkh0tbOaN1qU1vG8VtYGe6CSuNvpwda+rJEzWG03MzAFWKbLdhzS/FOnvUhcdChlNC6iKBWuJVrCGMhxIaKMP6i4/1fP2+jfGhnaCT6Obc5UHhOcl4+vdhUAmMJuKjiaB0Mo1mcPKmdBvlFWK6ZMaXfNI2ojIvNORMsUHWiSf5cqZ6WOy2SDn5arVzv+k6Hvh/Tb6gk8BW6PrhbAm3kV7Ojqthgv2ymfZurvrQ4hvRLCSaUEj8YG77TzQTNriYv6B/0hPEiHk24oTdGVePhrGD/QOO0LyxRHKZivAxldS41akzXcxELPm/oxJv01jZ46OIazsrHL/i/j8HGicQErGi9p7GiadtWwDBcEcZt8boc0PdlXE9KlAoSkZh4PtUBZ5oRjTAbiSgd3oLn+XZqUYYgOy3Vgh/zrDfK+xA0rqY6GaQrGo5JM1azcgawzjeOa2CMk/przvXMayvXQEA8meEmCsxiDrkO54/iAVvtHSPiC0nA/3tt/AY+igwk=&#x27;,
    category: &#x27;CompositeElement&#x27;
  }
}

```Note that in this case we recover just one distinct element type:

```typescript
const categories = new Set(data.map((document) => document.metadata.category));
console.log(categories);

```

```text
Set(1) { &#x27;CompositeElement&#x27; }

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Installation](#installation)
- [Setup](#setup)
- [Retain Elements](#retain-elements)

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