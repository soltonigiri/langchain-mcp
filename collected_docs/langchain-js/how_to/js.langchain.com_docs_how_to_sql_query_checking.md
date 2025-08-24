How to do query validation | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to do query validationPrerequisitesThis guide assumes familiarity with the following:Question answering over SQL data](/docs/tutorials/sql_qa)

Perhaps the most error-prone part of any SQL chain or agent is writing valid and safe SQL queries. In this guide we&#x27;ll go over some strategies for validating our queries and handling invalid queries.

## Setup[​](#setup)

First, get required packages and set environment variables:

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

```bash
npm install @langchain/community @langchain/openai typeorm sqlite3

```

```bash
export OPENAI_API_KEY="your api key"
# Uncomment the below to use LangSmith. Not required.
# export LANGSMITH_API_KEY="your api key"
# export LANGSMITH_TRACING=true

# Reduce tracing latency if you are not in a serverless environment
# export LANGCHAIN_CALLBACKS_BACKGROUND=true

```The below example will use a SQLite connection with Chinook database. Follow these [installation steps](https://database.guide/2-sample-databases-sqlite/) to create `Chinook.db` in the same directory as this notebook:

- Save [this](https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_Sqlite.sql) file as Chinook_Sqlite.sql
- Run sqlite3 Chinook.db
- Run .read Chinook_Sqlite.sql
- Test SELECT * FROM Artist LIMIT 10;

Now, `Chinhook.db` is in our directory and we can interface with it using the Typeorm-driven `SqlDatabase` class:

```typescript
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";

const datasource = new DataSource({
  type: "sqlite",
  database: "../../../../Chinook.db",
});
const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});
console.log(db.allTables.map((t) => t.tableName));
/**
[
  &#x27;Album&#x27;,       &#x27;Artist&#x27;,
  &#x27;Customer&#x27;,    &#x27;Employee&#x27;,
  &#x27;Genre&#x27;,       &#x27;Invoice&#x27;,
  &#x27;InvoiceLine&#x27;, &#x27;MediaType&#x27;,
  &#x27;Playlist&#x27;,    &#x27;PlaylistTrack&#x27;,
  &#x27;Track&#x27;
]
 */

```

#### API Reference: - SqlDatabase from langchain/sql_db ## Query checker[​](#query-checker) Perhaps the simplest strategy is to ask the model itself to check the original query for common mistakes. Suppose we have the following SQL query chain:

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";

const datasource = new DataSource({
  type: "sqlite",
  database: "../../../../Chinook.db",
});
const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});

const llm = new ChatOpenAI({ model: "gpt-4", temperature: 0 });
const chain = await createSqlQueryChain({
  llm,
  db,
  dialect: "sqlite",
});

/**
 * And we want to validate its outputs. We can do so by extending the chain with a second prompt and model call:
 */

const SYSTEM_PROMPT = `Double check the user&#x27;s {dialect} query for common mistakes, including:
- Using NOT IN with NULL values
- Using UNION when UNION ALL should have been used
- Using BETWEEN for exclusive ranges
- Data type mismatch in predicates
- Properly quoting identifiers
- Using the correct number of arguments for functions
- Casting to the correct data type
- Using the proper columns for joins

If there are any of the above mistakes, rewrite the query. If there are no mistakes, just reproduce the original query.

Output the final SQL query only.`;

const prompt = await ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  ["human", "{query}"],
]).partial({ dialect: "sqlite" });

const validationChain = prompt.pipe(llm).pipe(new StringOutputParser());

const fullChain = RunnableSequence.from([
  {
    query: async (i: { question: string }) => chain.invoke(i),
  },
  validationChain,
]);
const query = await fullChain.invoke({
  question:
    "What&#x27;s the average Invoice from an American customer whose Fax is missing since 2003 but before 2010",
});
console.log("query", query);
/**
query SELECT AVG("Total") FROM "Invoice" WHERE "CustomerId" IN (SELECT "CustomerId" FROM "Customer" WHERE "Country" = &#x27;USA&#x27; AND "Fax" IS NULL) AND "InvoiceDate" BETWEEN &#x27;2003-01-01 00:00:00&#x27; AND &#x27;2009-12-31 23:59:59&#x27;
 */
console.log("db query results", await db.run(query));
/**
db query results [{"AVG(\"Total\")":6.632999999999998}]
 */

// -------------

// You can see a LangSmith trace of the above chain here:
// https://smith.langchain.com/public/d1131395-8477-47cd-8f74-e0c5491ea956/r

// -------------

// The obvious downside of this approach is that we need to make two model calls instead of one to generate our query.
// To get around this we can try to perform the query generation and query check in a single model invocation:

const SYSTEM_PROMPT_2 = `You are a {dialect} expert. Given an input question, create a syntactically correct {dialect} query to run.
Unless the user specifies in the question a specific number of examples to obtain, query for at most {top_k} results using the LIMIT clause as per {dialect}. You can order the results to return the most informative data in the database.
Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
Pay attention to use date(&#x27;now&#x27;) function to get the current date, if the question involves "today".

Only use the following tables:
{table_info}

Write an initial draft of the query. Then double check the {dialect} query for common mistakes, including:
- Using NOT IN with NULL values
- Using UNION when UNION ALL should have been used
- Using BETWEEN for exclusive ranges
- Data type mismatch in predicates
- Properly quoting identifiers
- Using the correct number of arguments for functions
- Casting to the correct data type
- Using the proper columns for joins

Use format:

First draft: <<FIRST_DRAFT_QUERY>>
Final answer: <<FINAL_ANSWER_QUERY>>`;

const prompt2 = await PromptTemplate.fromTemplate(
  `System: ${SYSTEM_PROMPT_2}

Human: {input}`
).partial({ dialect: "sqlite" });

const parseFinalAnswer = (output: string): string =>
  output.split("Final answer: ")[1];

const chain2 = (
  await createSqlQueryChain({
    llm,
    db,
    prompt: prompt2,
    dialect: "sqlite",
  })
).pipe(parseFinalAnswer);

const query2 = await chain2.invoke({
  question:
    "What&#x27;s the average Invoice from an American customer whose Fax is missing since 2003 but before 2010",
});
console.log("query2", query2);
/**
query2 SELECT AVG("Total") FROM "Invoice" WHERE "CustomerId" IN (SELECT "CustomerId" FROM "Customer" WHERE "Country" = &#x27;USA&#x27; AND "Fax" IS NULL) AND date("InvoiceDate") BETWEEN date(&#x27;2003-01-01&#x27;) AND date(&#x27;2009-12-31&#x27;) LIMIT 5
 */
console.log("db query results", await db.run(query2));

/**
db query results [{"AVG(\"Total\")":6.632999999999998}]
 */

// -------------

// You can see a LangSmith trace of the above chain here:
// https://smith.langchain.com/public/e21d6146-eca9-4de6-a078-808fd09979ea/r

// -------------

```

#### API Reference: - StringOutputParser from @langchain/core/output_parsers - ChatPromptTemplate from @langchain/core/prompts - PromptTemplate from @langchain/core/prompts - RunnableSequence from @langchain/core/runnables - ChatOpenAI from @langchain/openai - createSqlQueryChain from langchain/chains/sql_db - SqlDatabase from langchain/sql_db ## Next steps[​](#next-steps) You&#x27;ve now learned about some strategies to validate generated SQL queries.

Next, check out some of the other guides in this section, like [how to query over large databases](/docs/how_to/sql_large_db).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Query checker](#query-checker)
- [Next steps](#next-steps)

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