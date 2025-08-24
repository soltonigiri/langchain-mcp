How to add a semantic layer over the database | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to add a semantic layer over the databaseYou can use database queries to retrieve information from a graph database like Neo4j. One option is to use LLMs to generate Cypher statements. While that option provides excellent flexibility, the solution could be brittle and not consistently generating precise Cypher statements. Instead of generating Cypher statements, we can implement Cypher templates as tools in a semantic layer that an LLM agent can interact with.![graph_semantic.png ](/assets/images/graph_semantic-365248d76b7862193c33f44eaa6ecaeb.png)dangerThe code in this guide will execute Cypher statements against the provided database. For production, make sure that the database connection uses credentials that are narrowly-scoped to only include necessary permissions.Failure to do so may result in data corruption or loss, since the calling code may attempt commands that would result in deletion, mutation of data if appropriately prompted or reading sensitive data if such data is present in the database.Setup​](#setup) #### Install dependencies[​](#install-dependencies) tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npm
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

``` ## Custom tools with Cypher templates[​](#custom-tools-with-cypher-templates) A semantic layer consists of various tools exposed to an LLM that it can use to interact with a knowledge graph. They can be of various complexity. You can think of each tool in a semantic layer as a function.

The function we will implement is to retrieve information about movies or their cast.

```typescript
const descriptionQuery = `MATCH (m:Movie|Person)
WHERE m.title CONTAINS $candidate OR m.name CONTAINS $candidate
MATCH (m)-[r:ACTED_IN|HAS_GENRE]-(t)
WITH m, type(r) as type, collect(coalesce(t.name, t.title)) as names
WITH m, type+": "+reduce(s="", n IN names | s + n + ", ") as types
WITH m, collect(types) as contexts
WITH m, "type:" + labels(m)[0] + "\ntitle: "+ coalesce(m.title, m.name)
       + "\nyear: "+coalesce(m.released,"") +"\n" +
       reduce(s="", c in contexts | s + substring(c, 0, size(c)-2) +"\n") as context
RETURN context LIMIT 1`;

const getInformation = async (entity: string) => {
  try {
    const data = await graph.query(descriptionQuery, { candidate: entity });
    return data[0]["context"];
  } catch (error) {
    return "No information was found";
  }
};

```

You can observe that we have defined the Cypher statement used to retrieve information. Therefore, we can avoid generating Cypher statements and use the LLM agent to only populate the input parameters. To provide additional information to an LLM agent about when to use the tool and their input parameters, we wrap the function as a tool.

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const informationTool = tool(
  (input) => {
    return getInformation(input.entity);
  },
  {
    name: "Information",
    description:
      "useful for when you need to answer questions about various actors or movies",
    schema: z.object({
      entity: z
        .string()
        .describe("movie or a person mentioned in the question"),
    }),
  }
);

```

## OpenAI Agent[​](#openai-agent) LangChain expression language makes it very convenient to define an agent to interact with a graph database over the semantic layer.

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor } from "langchain/agents";
import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";

const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
const tools = [informationTool];

const llmWithTools = llm.bind({
  functions: tools.map(convertToOpenAIFunction),
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant that finds information about movies and recommends them. If tools require follow up questions, make sure to ask the user for clarification. Make sure to include any available options that need to be clarified in the follow up questions Do only the things the user specifically requested.",
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

const _formatChatHistory = (chatHistory) => {
  const buffer: Array<BaseMessage> = [];
  for (const [human, ai] of chatHistory) {
    buffer.push(new HumanMessage({ content: human }));
    buffer.push(new AIMessage({ content: ai }));
  }
  return buffer;
};

const agent = RunnableSequence.from([
  {
    input: (x) => x.input,
    chat_history: (x) => {
      if ("chat_history" in x) {
        return _formatChatHistory(x.chat_history);
      }
      return [];
    },
    agent_scratchpad: (x) => {
      if ("steps" in x) {
        return formatToOpenAIFunctionMessages(x.steps);
      }
      return [];
    },
  },
  prompt,
  llmWithTools,
  new OpenAIFunctionsAgentOutputParser(),
]);

const agentExecutor = new AgentExecutor({ agent, tools });

```

```typescript
await agentExecutor.invoke({ input: "Who played in Casino?" });

```

```text
{
  input: "Who played in Casino?",
  output: &#x27;The movie "Casino" starred James Woods, Joe Pesci, Robert De Niro, and Sharon Stone.&#x27;
}

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Custom tools with Cypher templates](#custom-tools-with-cypher-templates)
- [OpenAI Agent](#openai-agent)

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