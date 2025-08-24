Build a Question Answering application over a Graph Database | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageBuild a Question Answering application over a Graph DatabaseIn this guide we’ll go over the basic ways to create a Q&A chain over a graph database. These systems will allow us to ask a question about the data in a graph database and get back a natural language answer.⚠️ Security note ⚠️​](#security-note)Building Q&A systems of graph databases requires executing model-generated graph queries. There are inherent risks in doing this. Make sure that your database connection permissions are always scoped as narrowly as possible for your chain/agent’s needs. This will mitigate though not eliminate the risks of building a model-driven system. For more on general security best practices, [see here](/docs/security).Architecture[​](#architecture)At a high-level, the steps of most graph chains are:Convert question to a graph database query**: Model converts user input to a graph database query (e.g. Cypher).
- **Execute graph database query**: Execute the graph database query.
- **Answer the question**: Model responds to user input using the query results.

![sql_usecase.png ](/assets/images/graph_usecase-34d891523e6284bb6230b38c5f8392e5.png)

## Setup[​](#setup)

#### Install dependencies[​](#install-dependencies)

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i langchain @langchain/community @langchain/openai @langchain/core neo4j-driver

```

```bash
yarn add langchain @langchain/community @langchain/openai @langchain/core neo4j-driver

```

```bash
pnpm add langchain @langchain/community @langchain/openai @langchain/core neo4j-driver

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

The below example will create a connection with a Neo4j database and will populate it with example data about movies and their actors.

```typescript
import "neo4j-driver";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";

const url = process.env.NEO4J_URI;
const username = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;
const graph = await Neo4jGraph.initialize({ url, username, password });

// Import movie information
const moviesQuery = `LOAD CSV WITH HEADERS FROM
&#x27;https://raw.githubusercontent.com/tomasonjo/blog-datasets/main/movies/movies_small.csv&#x27;
AS row
MERGE (m:Movie {id:row.movieId})
SET m.released = date(row.released),
    m.title = row.title,
    m.imdbRating = toFloat(row.imdbRating)
FOREACH (director in split(row.director, &#x27;|&#x27;) |
    MERGE (p:Person {name:trim(director)})
    MERGE (p)-[:DIRECTED]->(m))
FOREACH (actor in split(row.actors, &#x27;|&#x27;) |
    MERGE (p:Person {name:trim(actor)})
    MERGE (p)-[:ACTED_IN]->(m))
FOREACH (genre in split(row.genres, &#x27;|&#x27;) |
    MERGE (g:Genre {name:trim(genre)})
    MERGE (m)-[:IN_GENRE]->(g))`;

await graph.query(moviesQuery);

```

```text
Schema refreshed successfully.

```

```text
[]

``` ## Graph schema[​](#graph-schema) In order for an LLM to be able to generate a Cypher statement, it needs information about the graph schema. When you instantiate a graph object, it retrieves the information about the graph schema. If you later make any changes to the graph, you can run the `refreshSchema` method to refresh the schema information.

```typescript
await graph.refreshSchema();
console.log(graph.getSchema());

```

```text
Node properties are the following:
Movie {imdbRating: FLOAT, id: STRING, released: DATE, title: STRING}, Person {name: STRING}, Genre {name: STRING}
Relationship properties are the following:

The relationships are the following:
(:Movie)-[:IN_GENRE]->(:Genre), (:Person)-[:DIRECTED]->(:Movie), (:Person)-[:ACTED_IN]->(:Movie)

```Great! We’ve got a graph database that we can query. Now let’s try hooking it up to an LLM.

## Chain[​](#chain)

Let’s use a simple chain that takes a question, turns it into a Cypher query, executes the query, and uses the result to answer the original question.

![graph_chain.webp ](/assets/images/graph_chain-6379941793e0fa985e51e4bda0329403.webp)

LangChain comes with a built-in chain for this workflow that is designed to work with Neo4j: `GraphCypherQAChain`.

dangerThe `GraphCypherQAChain` used in this guide will execute Cypher statements against the provided database. For production, make sure that the database connection uses credentials that are narrowly-scoped to only include necessary permissions.

Failure to do so may result in data corruption or loss, since the calling code may attempt commands that would result in deletion, mutation of data if appropriately prompted or reading sensitive data if such data is present in the database.

```typescript
import { GraphCypherQAChain } from "langchain/chains/graph_qa/cypher";
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
const chain = GraphCypherQAChain.fromLLM({
  llm,
  graph,
});
const response = await chain.invoke({
  query: "What was the cast of the Casino?",
});
console.log(response);

```

```text
{ result: "James Woods, Joe Pesci, Robert De Niro, Sharon Stone" }

``` ### Next steps[​](#next-steps) For more complex query-generation, we may want to create few-shot prompts or add query-checking steps. For advanced techniques like this and more check out:

- [Prompting strategies](/docs/how_to/graph_prompting): Advanced prompt engineering techniques.
- [Mapping values](/docs/how_to/graph_mapping/): Techniques for mapping values from questions to database.
- [Semantic layer](/docs/how_to/graph_semantic): Techniques for working implementing semantic layers.
- [Constructing graphs](/docs/how_to/graph_constructing): Techniques for constructing knowledge graphs.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [⚠️ Security note ⚠️](#security-note)
- [Architecture](#architecture)
- [Setup](#setup)
- [Graph schema](#graph-schema)
- [Chain](#chain)[Next steps](#next-steps)

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