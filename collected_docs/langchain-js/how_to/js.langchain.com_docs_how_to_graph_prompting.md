How to improve results with prompting | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to improve results with promptingIn this guide we’ll go over prompting strategies to improve graph database query generation. We’ll largely focus on methods for getting relevant database-specific information in your prompt.dangerThe GraphCypherQAChain used in this guide will execute Cypher statements against the provided database. For production, make sure that the database connection uses credentials that are narrowly-scoped to only include necessary permissions.Failure to do so may result in data corruption or loss, since the calling code may attempt commands that would result in deletion, mutation of data if appropriately prompted or reading sensitive data if such data is present in the database.Setup​](#setup) #### Install dependencies[​](#install-dependencies) tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
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
const url = process.env.NEO4J_URI;
const username = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

```

```typescript
import "neo4j-driver";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";

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

``` # Filtering graph schema At times, you may need to focus on a specific subset of the graph schema while generating Cypher statements. Let’s say we are dealing with the following graph schema:

```typescript
await graph.refreshSchema();
console.log(graph.getSchema());

```

```text
Node properties are the following:
Movie {imdbRating: FLOAT, id: STRING, released: DATE, title: STRING}, Person {name: STRING}, Genre {name: STRING}, Chunk {embedding: LIST, id: STRING, text: STRING}
Relationship properties are the following:

The relationships are the following:
(:Movie)-[:IN_GENRE]->(:Genre), (:Person)-[:DIRECTED]->(:Movie), (:Person)-[:ACTED_IN]->(:Movie)

``` ## Few-shot examples[​](#few-shot-examples) Including examples of natural language questions being converted to valid Cypher queries against our database in the prompt will often improve model performance, especially for complex queries.

Let’s say we have the following examples:

```typescript
const examples = [
  {
    question: "How many artists are there?",
    query: "MATCH (a:Person)-[:ACTED_IN]->(:Movie) RETURN count(DISTINCT a)",
  },
  {
    question: "Which actors played in the movie Casino?",
    query: "MATCH (m:Movie {{title: &#x27;Casino&#x27;}})<-[:ACTED_IN]-(a) RETURN a.name",
  },
  {
    question: "How many movies has Tom Hanks acted in?",
    query:
      "MATCH (a:Person {{name: &#x27;Tom Hanks&#x27;}})-[:ACTED_IN]->(m:Movie) RETURN count(m)",
  },
  {
    question: "List all the genres of the movie Schindler&#x27;s List",
    query:
      "MATCH (m:Movie {{title: &#x27;Schindler\\&#x27;s List&#x27;}})-[:IN_GENRE]->(g:Genre) RETURN g.name",
  },
  {
    question:
      "Which actors have worked in movies from both the comedy and action genres?",
    query:
      "MATCH (a:Person)-[:ACTED_IN]->(:Movie)-[:IN_GENRE]->(g1:Genre), (a)-[:ACTED_IN]->(:Movie)-[:IN_GENRE]->(g2:Genre) WHERE g1.name = &#x27;Comedy&#x27; AND g2.name = &#x27;Action&#x27; RETURN DISTINCT a.name",
  },
  {
    question:
      "Which directors have made movies with at least three different actors named &#x27;John&#x27;?",
    query:
      "MATCH (d:Person)-[:DIRECTED]->(m:Movie)<-[:ACTED_IN]-(a:Person) WHERE a.name STARTS WITH &#x27;John&#x27; WITH d, COUNT(DISTINCT a) AS JohnsCount WHERE JohnsCount >= 3 RETURN d.name",
  },
  {
    question: "Identify movies where directors also played a role in the film.",
    query:
      "MATCH (p:Person)-[:DIRECTED]->(m:Movie), (p)-[:ACTED_IN]->(m) RETURN m.title, p.name",
  },
  {
    question:
      "Find the actor with the highest number of movies in the database.",
    query:
      "MATCH (a:Actor)-[:ACTED_IN]->(m:Movie) RETURN a.name, COUNT(m) AS movieCount ORDER BY movieCount DESC LIMIT 1",
  },
];

```

We can create a few-shot prompt with them like so:

```typescript
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

const examplePrompt = PromptTemplate.fromTemplate(
  "User input: {question}\nCypher query: {query}"
);
const prompt = new FewShotPromptTemplate({
  examples: examples.slice(0, 5),
  examplePrompt,
  prefix:
    "You are a Neo4j expert. Given an input question, create a syntactically correct Cypher query to run.\n\nHere is the schema information\n{schema}.\n\nBelow are a number of examples of questions and their corresponding Cypher queries.",
  suffix: "User input: {question}\nCypher query: ",
  inputVariables: ["question", "schema"],
});

```

```typescript
console.log(
  await prompt.format({
    question: "How many artists are there?",
    schema: "foo",
  })
);

```

```text
You are a Neo4j expert. Given an input question, create a syntactically correct Cypher query to run.

Here is the schema information
foo.

Below are a number of examples of questions and their corresponding Cypher queries.

User input: How many artists are there?
Cypher query: MATCH (a:Person)-[:ACTED_IN]->(:Movie) RETURN count(DISTINCT a)

User input: Which actors played in the movie Casino?
Cypher query: MATCH (m:Movie {title: &#x27;Casino&#x27;})<-[:ACTED_IN]-(a) RETURN a.name

User input: How many movies has Tom Hanks acted in?
Cypher query: MATCH (a:Person {name: &#x27;Tom Hanks&#x27;})-[:ACTED_IN]->(m:Movie) RETURN count(m)

User input: List all the genres of the movie Schindler&#x27;s List
Cypher query: MATCH (m:Movie {title: &#x27;Schindler\&#x27;s List&#x27;})-[:IN_GENRE]->(g:Genre) RETURN g.name

User input: Which actors have worked in movies from both the comedy and action genres?
Cypher query: MATCH (a:Person)-[:ACTED_IN]->(:Movie)-[:IN_GENRE]->(g1:Genre), (a)-[:ACTED_IN]->(:Movie)-[:IN_GENRE]->(g2:Genre) WHERE g1.name = &#x27;Comedy&#x27; AND g2.name = &#x27;Action&#x27; RETURN DISTINCT a.name

User input: How many artists are there?
Cypher query:

``` ## Dynamic few-shot examples[​](#dynamic-few-shot-examples) If we have enough examples, we may want to only include the most relevant ones in the prompt, either because they don’t fit in the model’s context window or because the long tail of examples distracts the model. And specifically, given any input we want to include the examples most relevant to that input.

We can do just this using an ExampleSelector. In this case we’ll use a [SemanticSimilarityExampleSelector](https://api.js.langchain.com/classes/langchain_core.example_selectors.SemanticSimilarityExampleSelector.html), which will store the examples in the vector database of our choosing. At runtime it will perform a similarity search between the input and our examples, and return the most semantically similar ones:

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";

const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
  examples,
  new OpenAIEmbeddings(),
  Neo4jVectorStore,
  {
    k: 5,
    inputKeys: ["question"],
    preDeleteCollection: true,
    url,
    username,
    password,
  }
);

```

```typescript
await exampleSelector.selectExamples({
  question: "how many artists are there?",
});

```

```text
[
  {
    query: "MATCH (a:Person)-[:ACTED_IN]->(:Movie) RETURN count(DISTINCT a)",
    question: "How many artists are there?"
  },
  {
    query: "MATCH (a:Person {{name: &#x27;Tom Hanks&#x27;}})-[:ACTED_IN]->(m:Movie) RETURN count(m)",
    question: "How many movies has Tom Hanks acted in?"
  },
  {
    query: "MATCH (a:Person)-[:ACTED_IN]->(:Movie)-[:IN_GENRE]->(g1:Genre), (a)-[:ACTED_IN]->(:Movie)-[:IN_GENRE"... 84 more characters,
    question: "Which actors have worked in movies from both the comedy and action genres?"
  },
  {
    query: "MATCH (d:Person)-[:DIRECTED]->(m:Movie)<-[:ACTED_IN]-(a:Person) WHERE a.name STARTS WITH &#x27;John&#x27; WITH"... 71 more characters,
    question: "Which directors have made movies with at least three different actors named &#x27;John&#x27;?"
  },
  {
    query: "MATCH (a:Actor)-[:ACTED_IN]->(m:Movie) RETURN a.name, COUNT(m) AS movieCount ORDER BY movieCount DES"... 9 more characters,
    question: "Find the actor with the highest number of movies in the database."
  }
]

```To use it, we can pass the ExampleSelector directly in to our FewShotPromptTemplate:

```typescript
const promptWithExampleSelector = new FewShotPromptTemplate({
  exampleSelector,
  examplePrompt,
  prefix:
    "You are a Neo4j expert. Given an input question, create a syntactically correct Cypher query to run.\n\nHere is the schema information\n{schema}.\n\nBelow are a number of examples of questions and their corresponding Cypher queries.",
  suffix: "User input: {question}\nCypher query: ",
  inputVariables: ["question", "schema"],
});

```

```typescript
console.log(
  await promptWithExampleSelector.format({
    question: "how many artists are there?",
    schema: "foo",
  })
);

```

```text
You are a Neo4j expert. Given an input question, create a syntactically correct Cypher query to run.

Here is the schema information
foo.

Below are a number of examples of questions and their corresponding Cypher queries.

User input: How many artists are there?
Cypher query: MATCH (a:Person)-[:ACTED_IN]->(:Movie) RETURN count(DISTINCT a)

User input: How many movies has Tom Hanks acted in?
Cypher query: MATCH (a:Person {name: &#x27;Tom Hanks&#x27;})-[:ACTED_IN]->(m:Movie) RETURN count(m)

User input: Which actors have worked in movies from both the comedy and action genres?
Cypher query: MATCH (a:Person)-[:ACTED_IN]->(:Movie)-[:IN_GENRE]->(g1:Genre), (a)-[:ACTED_IN]->(:Movie)-[:IN_GENRE]->(g2:Genre) WHERE g1.name = &#x27;Comedy&#x27; AND g2.name = &#x27;Action&#x27; RETURN DISTINCT a.name

User input: Which directors have made movies with at least three different actors named &#x27;John&#x27;?
Cypher query: MATCH (d:Person)-[:DIRECTED]->(m:Movie)<-[:ACTED_IN]-(a:Person) WHERE a.name STARTS WITH &#x27;John&#x27; WITH d, COUNT(DISTINCT a) AS JohnsCount WHERE JohnsCount >= 3 RETURN d.name

User input: Find the actor with the highest number of movies in the database.
Cypher query: MATCH (a:Actor)-[:ACTED_IN]->(m:Movie) RETURN a.name, COUNT(m) AS movieCount ORDER BY movieCount DESC LIMIT 1

User input: how many artists are there?
Cypher query:

```

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { GraphCypherQAChain } from "langchain/chains/graph_qa/cypher";

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});
const chain = GraphCypherQAChain.fromLLM({
  graph,
  llm,
  cypherPrompt: promptWithExampleSelector,
});

```

```typescript
await chain.invoke({
  query: "How many actors are in the graph?",
});

```

```text
{ result: "There are 967 actors in the graph." }

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Few-shot examples](#few-shot-examples)
- [Dynamic few-shot examples](#dynamic-few-shot-examples)

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