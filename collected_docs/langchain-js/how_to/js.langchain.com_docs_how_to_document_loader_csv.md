How to load CSV data | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to load CSV dataA comma-separated values (CSV)](https://en.wikipedia.org/wiki/Comma-separated_values) file is a delimited text file that uses a comma to separate values. Each line of the file is a data record. Each record consists of one or more fields, separated by commas.Load CSV data with a single row per document. ## Setup[​](#setup) npm
- Yarn
- pnpm

```bash
npm install d3-dsv@2

```

```bash
yarn add d3-dsv@2

```

```bash
pnpm add d3-dsv@2

``` ## Usage, extracting all columns[​](#usage-extracting-all-columns) Example CSV file:

```csv
id,text
1,This is a sentence.
2,This is another sentence.

```

Example code:

```typescript
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const loader = new CSVLoader("src/document_loaders/example_data/example.csv");

const docs = await loader.load();
/*
[
  Document {
    "metadata": {
      "line": 1,
      "source": "src/document_loaders/example_data/example.csv",
    },
    "pageContent": "id: 1
text: This is a sentence.",
  },
  Document {
    "metadata": {
      "line": 2,
      "source": "src/document_loaders/example_data/example.csv",
    },
    "pageContent": "id: 2
text: This is another sentence.",
  },
]
*/

```

## Usage, extracting a single column[​](#usage-extracting-a-single-column) Example CSV file:

```csv
id,text
1,This is a sentence.
2,This is another sentence.

```

Example code:

```typescript
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const loader = new CSVLoader(
  "src/document_loaders/example_data/example.csv",
  "text"
);

const docs = await loader.load();
/*
[
  Document {
    "metadata": {
      "line": 1,
      "source": "src/document_loaders/example_data/example.csv",
    },
    "pageContent": "This is a sentence.",
  },
  Document {
    "metadata": {
      "line": 2,
      "source": "src/document_loaders/example_data/example.csv",
    },
    "pageContent": "This is another sentence.",
  },
]
*/

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Usage, extracting all columns](#usage-extracting-all-columns)
- [Usage, extracting a single column](#usage-extracting-a-single-column)

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