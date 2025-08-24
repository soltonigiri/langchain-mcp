How to map values to a database | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to map values to a databaseIn this guide we’ll go over strategies to improve graph database query generation by mapping values from user inputs to database. When using the built-in graph chains, the LLM is aware of the graph schema, but has no information about the values of properties stored in the database. Therefore, we can introduce a new step in graph database QA system to accurately map values.Setup​](#setup) #### Install dependencies[​](#install-dependencies) tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
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

The below example will create a connection with a Neo4j database and will populate it with example data about movies and their actors.

```typescript
import "neo4j-driver";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";

const url = process.env.NEO4J_URI;
const username = process.env.NEO4J_USER;
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

``` ## Detecting entities in the user input[​](#detecting-entities-in-the-user-input) We have to extract the types of entities/values we want to map to a graph database. In this example, we are dealing with a movie graph, so we can map movies and people to the database.

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

const entitySchema = z
  .object({
    names: z
      .array(z.string())
      .describe("All the person or movies appearing in the text"),
  })
  .describe("Identifying information about entities.");

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are extracting person and movies from the text."],
  [
    "human",
    "Use the given format to extract information from the following\ninput: {question}",
  ],
]);

const entityChain = prompt.pipe(llm.withStructuredOutput(entitySchema));

```

We can test the entity extraction chain.

```typescript
const entities = await entityChain.invoke({
  question: "Who played in Casino movie?",
});
entities;

```

```text
{ names: [ "Casino" ] }

```We will utilize a simple `CONTAINS` clause to match entities to database. In practice, you might want to use a fuzzy search or a fulltext index to allow for minor misspellings.

```typescript
const matchQuery = `
MATCH (p:Person|Movie)
WHERE p.name CONTAINS $value OR p.title CONTAINS $value
RETURN coalesce(p.name, p.title) AS result, labels(p)[0] AS type
LIMIT 1`;

const matchToDatabase = async (values) => {
  let result = "";
  for (const entity of values.names) {
    const response = await graph.query(matchQuery, {
      value: entity,
    });
    if (response.length > 0) {
      result += `${entity} maps to ${response[0]["result"]} ${response[0]["type"]} in database\n`;
    }
  }
  return result;
};

await matchToDatabase(entities);

```

```text
"Casino maps to Casino Movie in database\n"

``` ## Custom Cypher generating chain[​](#custom-cypher-generating-chain) We need to define a custom Cypher prompt that takes the entity mapping information along with the schema and the user question to construct a Cypher statement. We will be using the LangChain expression language to accomplish that.

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";

// Generate Cypher statement based on natural language input
const cypherTemplate = `Based on the Neo4j graph schema below, write a Cypher query that would answer the user&#x27;s question:
{schema}
Entities in the question map to the following database values:
{entities_list}
Question: {question}
Cypher query:`;

const cypherPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Given an input question, convert it to a Cypher query. No pre-amble.",
  ],
  ["human", cypherTemplate],
]);

const llmWithStop = llm.bind({ stop: ["\nCypherResult:"] });

const cypherResponse = RunnableSequence.from([
  RunnablePassthrough.assign({ names: entityChain }),
  RunnablePassthrough.assign({
    entities_list: async (x) => matchToDatabase(x.names),
    schema: async (_) => graph.getSchema(),
  }),
  cypherPrompt,
  llmWithStop,
  new StringOutputParser(),
]);

```

```typescript
const cypher = await cypherResponse.invoke({
  question: "Who played in Casino movie?",
});
cypher;

```

```text
&#x27;MATCH (:Movie {title: "Casino"})<-[:ACTED_IN]-(actor)\nRETURN actor.name&#x27;

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Detecting entities in the user input](#detecting-entities-in-the-user-input)
- [Custom Cypher generating chain](#custom-cypher-generating-chain)

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