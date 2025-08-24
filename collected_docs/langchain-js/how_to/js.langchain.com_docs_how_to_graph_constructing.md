How to construct knowledge graphs | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to construct knowledge graphsIn this guide we’ll go over the basic ways of constructing a knowledge graph based on unstructured text. The constructed graph can then be used as knowledge base in a RAG application. At a high-level, the steps of constructing a knowledge are from text are:Extracting structured information from text: Model is used to extract structured graph information from text.Storing into graph database: Storing the extracted structured graph information into a graph database enables downstream RAG applicationsSetup​](#setup) #### Install dependencies[​](#install-dependencies) tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
- yarn
- pnpm

```bash
npm i langchain @langchain/community @langchain/openai @langchain/core neo4j-driver zod

```

```bash
yarn add langchain @langchain/community @langchain/openai @langchain/core neo4j-driver zod

```

```bash
pnpm add langchain @langchain/community @langchain/openai @langchain/core neo4j-driver zod

``` #### Set environment variables[​](#set-environment-variables) We’ll use OpenAI in this example:

```env
OPENAI_API_KEY=your-api-key

# Optional, use LangSmith for best-in-class observability
LANGSMITH_API_KEY=your-api-key
LANGSMITH_TRACING=true

# Reduce tracing latency if you are not in a serverless environment
# LANGCHAIN_CALLBACKS_BACKGROUND=true

```

Next, we need to define Neo4j credentials. Follow [these installation steps](https://neo4j.com/docs/operations-manual/current/installation/) to set up a Neo4j database.

```env
NEO4J_URI="bolt://localhost:7687"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="password"

```

The below example will create a connection with a Neo4j database.

```typescript
import "neo4j-driver";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";

const url = process.env.NEO4J_URI;
const username = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;
const graph = await Neo4jGraph.initialize({ url, username, password });

```

## LLM Graph Transformer[​](#llm-graph-transformer) Extracting graph data from text enables the transformation of unstructured information into structured formats, facilitating deeper insights and more efficient navigation through complex relationships and patterns. The LLMGraphTransformer converts text documents into structured graph documents by leveraging a LLM to parse and categorize entities and their relationships. The selection of the LLM model significantly influences the output by determining the accuracy and nuance of the extracted graph data.

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { LLMGraphTransformer } from "@langchain/community/experimental/graph_transformers/llm";

const model = new ChatOpenAI({
  temperature: 0,
  model: "gpt-4o-mini",
});

const llmGraphTransformer = new LLMGraphTransformer({
  llm: model,
});

```

Now we can pass in example text and examine the results.

```typescript
import { Document } from "@langchain/core/documents";

let text = `
Marie Curie, was a Polish and naturalised-French physicist and chemist who conducted pioneering research on radioactivity.
She was the first woman to win a Nobel Prize, the first person to win a Nobel Prize twice, and the only person to win a Nobel Prize in two scientific fields.
Her husband, Pierre Curie, was a co-winner of her first Nobel Prize, making them the first-ever married couple to win the Nobel Prize and launching the Curie family legacy of five Nobel Prizes.
She was, in 1906, the first woman to become a professor at the University of Paris.
`;

const result = await llmGraphTransformer.convertToGraphDocuments([
  new Document({ pageContent: text }),
]);

console.log(`Nodes: ${result[0].nodes.length}`);
console.log(`Relationships:${result[0].relationships.length}`);

```

```text
Nodes: 8
Relationships:7

```Note that the graph construction process is non-deterministic since we are using LLM. Therefore, you might get slightly different results on each execution. Examine the following image to better grasp the structure of the generated knowledge graph.

![graph_construction1.png ](/assets/images/graph_construction1-2b4d31978d58696d5a6a52ad92ae088f.png)

Additionally, you have the flexibility to define specific types of nodes and relationships for extraction according to your requirements.

```typescript
const llmGraphTransformerFiltered = new LLMGraphTransformer({
  llm: model,
  allowedNodes: ["PERSON", "COUNTRY", "ORGANIZATION"],
  allowedRelationships: ["NATIONALITY", "LOCATED_IN", "WORKED_AT", "SPOUSE"],
  strictMode: false,
});

const result_filtered =
  await llmGraphTransformerFiltered.convertToGraphDocuments([
    new Document({ pageContent: text }),
  ]);

console.log(`Nodes: ${result_filtered[0].nodes.length}`);
console.log(`Relationships:${result_filtered[0].relationships.length}`);

```

```text
Nodes: 6
Relationships:4

```For a better understanding of the generated graph, we can again visualize it.

![graph_construction1.png ](/assets/images/graph_construction2-8b43506ae0fb3a006eaa4ba83fea8af5.png)

## Storing to graph database[​](#storing-to-graph-database)

The generated graph documents can be stored to a graph database using the `addGraphDocuments` method.

```typescript
await graph.addGraphDocuments(result_filtered);

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [LLM Graph Transformer](#llm-graph-transformer)
- [Storing to graph database](#storing-to-graph-database)

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