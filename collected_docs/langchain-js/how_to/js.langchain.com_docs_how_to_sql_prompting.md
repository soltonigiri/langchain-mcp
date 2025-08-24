How to use prompting to improve results | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to use prompting to improve resultsPrerequisitesThis guide assumes familiarity with the following:Question answering over SQL data](/docs/tutorials/sql_qa)

In this guide we&#x27;ll go over prompting strategies to improve SQL query generation. We&#x27;ll largely focus on methods for getting relevant database-specific information in your prompt.

## Setup[​](#setup)

First, install the required packages and set your environment variables. This example will use OpenAI as the LLM.

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

#### API Reference: - SqlDatabase from langchain/sql_db ## Dialect-specific prompting[​](#dialect-specific-prompting) One of the simplest things we can do is make our prompt specific to the SQL dialect we&#x27;re using. When using the built-in [createSqlQueryChain](https://api.js.langchain.com/functions/langchain.chains_sql_db.createSqlQueryChain.html) and [SqlDatabase](https://api.js.langchain.com/classes/langchain.sql_db.SqlDatabase.html), this is handled for you for any of the following dialects:

```typescript
import { SQL_PROMPTS_MAP } from "langchain/chains/sql_db";

console.log({ SQL_PROMPTS_MAP: Object.keys(SQL_PROMPTS_MAP) });
/**
{
  SQL_PROMPTS_MAP: [ &#x27;oracle&#x27;, &#x27;postgres&#x27;, &#x27;sqlite&#x27;, &#x27;mysql&#x27;, &#x27;mssql&#x27;, &#x27;sap hana&#x27; ]
}
 */

// For example, using our current DB we can see that we’ll get a SQLite-specific prompt:

console.log({
  sqlite: SQL_PROMPTS_MAP.sqlite,
});
/**
{
  sqlite: PromptTemplate {
    inputVariables: [ &#x27;dialect&#x27;, &#x27;table_info&#x27;, &#x27;input&#x27;, &#x27;top_k&#x27; ],
    template: &#x27;You are a SQLite expert. Given an input question, first create a syntactically correct SQLite query to run, then look at the results of the query and return the answer to the input question.\n&#x27; +
      &#x27;Unless the user specifies in the question a specific number of examples to obtain, query for at most {top_k} results using the LIMIT clause as per SQLite. You can order the results to return the most informative data in the database.\n&#x27; +
      &#x27;Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.\n&#x27; +
      &#x27;Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;Use the following format:\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;Question: "Question here"\n&#x27; +
      &#x27;SQLQuery: "SQL Query to run"\n&#x27; +
      &#x27;SQLResult: "Result of the SQLQuery"\n&#x27; +
      &#x27;Answer: "Final answer here"\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;Only use the following tables:\n&#x27; +
      &#x27;{table_info}\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;Question: {input}&#x27;,
  }
}
 */

```

#### API Reference: - SQL_PROMPTS_MAP from langchain/chains/sql_db ## Table definitions and example rows[​](#table-definitions-and-example-rows) In basically any SQL chain, we&#x27;ll need to feed the model at least part of the database schema. Without this it won&#x27;t be able to write valid queries. Our database comes with some convenience methods to give us the relevant context. Specifically, we can get the table names, their schemas, and a sample of rows from each table:

```typescript
import { db } from "../db.js";

const context = await db.getTableInfo();

console.log(context);

/**

CREATE TABLE Album (
  AlbumId INTEGER NOT NULL,
  Title NVARCHAR(160) NOT NULL,
  ArtistId INTEGER NOT NULL
)

SELECT * FROM "Album" LIMIT 3;
 AlbumId Title ArtistId
 1 For Those About To Rock We Salute You 1
 2 Balls to the Wall 2
 3 Restless and Wild 2

CREATE TABLE Artist (
  ArtistId INTEGER NOT NULL,
  Name NVARCHAR(120)
)

SELECT * FROM "Artist" LIMIT 3;
 ArtistId Name
 1 AC/DC
 2 Accept
 3 Aerosmith

CREATE TABLE Customer (
  CustomerId INTEGER NOT NULL,
  FirstName NVARCHAR(40) NOT NULL,
  LastName NVARCHAR(20) NOT NULL,
  Company NVARCHAR(80),
  Address NVARCHAR(70),
  City NVARCHAR(40),
  State NVARCHAR(40),
  Country NVARCHAR(40),
  PostalCode NVARCHAR(10),
  Phone NVARCHAR(24),
  Fax NVARCHAR(24),
  Email NVARCHAR(60) NOT NULL,
  SupportRepId INTEGER
)

SELECT * FROM "Customer" LIMIT 3;
 CustomerId FirstName LastName Company Address City State Country PostalCode Phone Fax Email SupportRepId
 1 Luís Gonçalves Embraer - Empresa Brasileira de Aeronáutica S.A. Av. Brigadeiro Faria Lima,
2170 São José dos Campos SP Brazil 12227-000 +55 (12) 3923-5555 +55 (12) 3923-5566 luisg@embraer.com.br 3
 2 Leonie Köhler null Theodor-Heuss-Straße 34 Stuttgart null Germany 70174 +49 0711 2842222 null leonekohler@surfeu.de 5
 3 François Tremblay null 1498 rue Bélanger Montréal QC Canada H2G 1A7 +1 (514) 721-4711 null ftremblay@gmail.com 3

CREATE TABLE Employee (
  EmployeeId INTEGER NOT NULL,
  LastName NVARCHAR(20) NOT NULL,
  FirstName NVARCHAR(20) NOT NULL,
  Title NVARCHAR(30),
  ReportsTo INTEGER,
  BirthDate DATETIME,
  HireDate DATETIME,
  Address NVARCHAR(70),
  City NVARCHAR(40),
  State NVARCHAR(40),
  Country NVARCHAR(40),
  PostalCode NVARCHAR(10),
  Phone NVARCHAR(24),
  Fax NVARCHAR(24),
  Email NVARCHAR(60)
)

SELECT * FROM "Employee" LIMIT 3;
 EmployeeId LastName FirstName Title ReportsTo BirthDate HireDate Address City State Country PostalCode Phone Fax Email
 1 Adams Andrew General Manager null 1962-02-18 00:00:00 2002-08-14 00:00:00 11120 Jasper Ave NW Edmonton AB Canada T5K 2N1 +1 (780) 428-9482 +1 (780) 428-3457 andrew@chinookcorp.com
 2 Edwards Nancy Sales Manager 1 1958-12-08 00:00:00 2002-05-01 00:00:00 825 8 Ave SW Calgary AB Canada T2P 2T3 +1 (403) 262-3443 +1 (403) 262-3322 nancy@chinookcorp.com
 3 Peacock Jane Sales Support Agent 2 1973-08-29 00:00:00 2002-04-01 00:00:00 1111 6 Ave SW Calgary AB Canada T2P 5M5 +1 (403) 262-3443 +1 (403) 262-6712 jane@chinookcorp.com

CREATE TABLE Genre (
  GenreId INTEGER NOT NULL,
  Name NVARCHAR(120)
)

SELECT * FROM "Genre" LIMIT 3;
 GenreId Name
 1 Rock
 2 Jazz
 3 Metal

CREATE TABLE Invoice (
  InvoiceId INTEGER NOT NULL,
  CustomerId INTEGER NOT NULL,
  InvoiceDate DATETIME NOT NULL,
  BillingAddress NVARCHAR(70),
  BillingCity NVARCHAR(40),
  BillingState NVARCHAR(40),
  BillingCountry NVARCHAR(40),
  BillingPostalCode NVARCHAR(10),
  Total NUMERIC(10,2) NOT NULL
)

SELECT * FROM "Invoice" LIMIT 3;
 InvoiceId CustomerId InvoiceDate BillingAddress BillingCity BillingState BillingCountry BillingPostalCode Total
 1 2 2009-01-01 00:00:00 Theodor-Heuss-Straße 34 Stuttgart null Germany 70174 1.98
 2 4 2009-01-02 00:00:00 Ullevålsveien 14 Oslo null Norway 0171 3.96
 3 8 2009-01-03 00:00:00 Grétrystraat 63 Brussels null Belgium 1000 5.94

CREATE TABLE InvoiceLine (
  InvoiceLineId INTEGER NOT NULL,
  InvoiceId INTEGER NOT NULL,
  TrackId INTEGER NOT NULL,
  UnitPrice NUMERIC(10,2) NOT NULL,
  Quantity INTEGER NOT NULL
)

SELECT * FROM "InvoiceLine" LIMIT 3;
 InvoiceLineId InvoiceId TrackId UnitPrice Quantity
 1 1 2 0.99 1
 2 1 4 0.99 1
 3 2 6 0.99 1

CREATE TABLE MediaType (
  MediaTypeId INTEGER NOT NULL,
  Name NVARCHAR(120)
)

SELECT * FROM "MediaType" LIMIT 3;
 MediaTypeId Name
 1 MPEG audio file
 2 Protected AAC audio file
 3 Protected MPEG-4 video file

CREATE TABLE Playlist (
  PlaylistId INTEGER NOT NULL,
  Name NVARCHAR(120)
)

SELECT * FROM "Playlist" LIMIT 3;
 PlaylistId Name
 1 Music
 2 Movies
 3 TV Shows
CREATE TABLE PlaylistTrack (
  PlaylistId INTEGER NOT NULL,
  TrackId INTEGER NOT NULL
)

SELECT * FROM "PlaylistTrack" LIMIT 3;
 PlaylistId TrackId
 1 3402
 1 3389
 1 3390

CREATE TABLE Track (
  TrackId INTEGER NOT NULL,
  Name NVARCHAR(200) NOT NULL,
  AlbumId INTEGER,
  MediaTypeId INTEGER NOT NULL,
  GenreId INTEGER,
  Composer NVARCHAR(220),
  Milliseconds INTEGER NOT NULL,
  Bytes INTEGER,
  UnitPrice NUMERIC(10,2) NOT NULL
)

SELECT * FROM "Track" LIMIT 3;
 TrackId Name AlbumId MediaTypeId GenreId Composer Milliseconds Bytes UnitPrice
 1 For Those About To Rock (We Salute You) 1 1 1 Angus Young,
Malcolm Young,
Brian Johnson 343719 11170334 0.99
 2 Balls to the Wall 2 2 1 U. Dirkschneider,
W. Hoffmann,
H. Frank,
P. Baltes,
S. Kaufmann,
G. Hoffmann 342562 5510424 0.99
 3 Fast As a Shark 3 2 1 F. Baltes,
S. Kaufman,
U. Dirkscneider & W. Hoffman 230619 3990994 0.99

*/

```

#### API Reference: ## Few-shot examples[​](#few-shot-examples) Including examples of natural language questions being converted to valid SQL queries against our database in the prompt will often improve model performance, especially for complex queries.

Let&#x27;s say we have the following examples:

```typescript
export const examples = [
  { input: "List all artists.", query: "SELECT * FROM Artist;" },
  {
    input: "Find all albums for the artist &#x27;AC/DC&#x27;.",
    query:
      "SELECT * FROM Album WHERE ArtistId = (SELECT ArtistId FROM Artist WHERE Name = &#x27;AC/DC&#x27;);",
  },
  {
    input: "List all tracks in the &#x27;Rock&#x27; genre.",
    query:
      "SELECT * FROM Track WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name = &#x27;Rock&#x27;);",
  },
  {
    input: "Find the total duration of all tracks.",
    query: "SELECT SUM(Milliseconds) FROM Track;",
  },
  {
    input: "List all customers from Canada.",
    query: "SELECT * FROM Customer WHERE Country = &#x27;Canada&#x27;;",
  },
  {
    input: "How many tracks are there in the album with ID 5?",
    query: "SELECT COUNT(*) FROM Track WHERE AlbumId = 5;",
  },
  {
    input: "Find the total number of invoices.",
    query: "SELECT COUNT(*) FROM Invoice;",
  },
  {
    input: "List all tracks that are longer than 5 minutes.",
    query: "SELECT * FROM Track WHERE Milliseconds > 300000;",
  },
  {
    input: "Who are the top 5 customers by total purchase?",
    query:
      "SELECT CustomerId, SUM(Total) AS TotalPurchase FROM Invoice GROUP BY CustomerId ORDER BY TotalPurchase DESC LIMIT 5;",
  },
  {
    input: "Which albums are from the year 2000?",
    query: "SELECT * FROM Album WHERE strftime(&#x27;%Y&#x27;, ReleaseDate) = &#x27;2000&#x27;;",
  },
  {
    input: "How many employees are there",
    query: &#x27;SELECT COUNT(*) FROM "Employee"&#x27;,
  },
];

```

#### API Reference: We can create a few-shot prompt with them like so:

```typescript
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { examples } from "./examples.js";

const examplePrompt = PromptTemplate.fromTemplate(
  `User input: {input}\nSQL Query: {query}`
);

const prompt = new FewShotPromptTemplate({
  examples: examples.slice(0, 5),
  examplePrompt,
  prefix: `You are a SQLite expert. Given an input question, create a syntactically correct SQLite query to run.
Unless otherwise specified, do not return more than {top_k} rows.

Here is the relevant table info: {table_info}

Below are a number of examples of questions and their corresponding SQL queries.`,
  suffix: "User input: {input}\nSQL query: ",
  inputVariables: ["input", "top_k", "table_info"],
});

console.log(
  await prompt.format({
    input: "How many artists are there?",
    top_k: "3",
    table_info: "foo",
  })
);

/**
You are a SQLite expert. Given an input question, create a syntactically correct SQLite query to run.
Unless otherwise specified, do not return more than 3 rows.

Here is the relevant table info: foo

Below are a number of examples of questions and their corresponding SQL queries.

User input: List all artists.
SQL Query: SELECT * FROM Artist;

User input: Find all albums for the artist &#x27;AC/DC&#x27;.
SQL Query: SELECT * FROM Album WHERE ArtistId = (SELECT ArtistId FROM Artist WHERE Name = &#x27;AC/DC&#x27;);

User input: List all tracks in the &#x27;Rock&#x27; genre.
SQL Query: SELECT * FROM Track WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name = &#x27;Rock&#x27;);

User input: Find the total duration of all tracks.
SQL Query: SELECT SUM(Milliseconds) FROM Track;

User input: List all customers from Canada.
SQL Query: SELECT * FROM Customer WHERE Country = &#x27;Canada&#x27;;

User input: How many artists are there?
SQL query:
 */

```

#### API Reference: - FewShotPromptTemplate from @langchain/core/prompts - PromptTemplate from @langchain/core/prompts ## Dynamic few-shot examples[​](#dynamic-few-shot-examples) If we have enough examples, we may want to only include the most relevant ones in the prompt, either because they don&#x27;t fit in the model&#x27;s context window or because the long tail of examples distracts the model. And specifically, given any input we want to include the examples most relevant to that input.

We can do just this using an ExampleSelector. In this case we&#x27;ll use a [SemanticSimilarityExampleSelector](https://api.js.langchain.com/classes/langchain_core.example_selectors.SemanticSimilarityExampleSelector.html), which will store the examples in the vector database of our choosing. At runtime it will perform a similarity search between the input and our examples, and return the most semantically similar ones:

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { examples } from "./examples.js";
import { db } from "../db.js";

const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples<
  typeof MemoryVectorStore
>(examples, new OpenAIEmbeddings(), MemoryVectorStore, {
  k: 5,
  inputKeys: ["input"],
});

console.log(
  await exampleSelector.selectExamples({ input: "how many artists are there?" })
);
/**
[
  { input: &#x27;List all artists.&#x27;, query: &#x27;SELECT * FROM Artist;&#x27; },
  {
    input: &#x27;How many employees are there&#x27;,
    query: &#x27;SELECT COUNT(*) FROM "Employee"&#x27;
  },
  {
    input: &#x27;How many tracks are there in the album with ID 5?&#x27;,
    query: &#x27;SELECT COUNT(*) FROM Track WHERE AlbumId = 5;&#x27;
  },
  {
    input: &#x27;Which albums are from the year 2000?&#x27;,
    query: "SELECT * FROM Album WHERE strftime(&#x27;%Y&#x27;, ReleaseDate) = &#x27;2000&#x27;;"
  },
  {
    input: "List all tracks in the &#x27;Rock&#x27; genre.",
    query: "SELECT * FROM Track WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name = &#x27;Rock&#x27;);"
  }
]
 */

// To use it, we can pass the ExampleSelector directly in to our FewShotPromptTemplate:

const examplePrompt = PromptTemplate.fromTemplate(
  `User input: {input}\nSQL Query: {query}`
);

const prompt = new FewShotPromptTemplate({
  exampleSelector,
  examplePrompt,
  prefix: `You are a SQLite expert. Given an input question, create a syntactically correct SQLite query to run.
Unless otherwise specified, do not return more than {top_k} rows.

Here is the relevant table info: {table_info}

Below are a number of examples of questions and their corresponding SQL queries.`,
  suffix: "User input: {input}\nSQL query: ",
  inputVariables: ["input", "top_k", "table_info"],
});

console.log(
  await prompt.format({
    input: "How many artists are there?",
    top_k: "3",
    table_info: "foo",
  })
);
/**
You are a SQLite expert. Given an input question, create a syntactically correct SQLite query to run.
Unless otherwise specified, do not return more than 3 rows.

Here is the relevant table info: foo

Below are a number of examples of questions and their corresponding SQL queries.

User input: List all artists.
SQL Query: SELECT * FROM Artist;

User input: How many employees are there
SQL Query: SELECT COUNT(*) FROM "Employee"

User input: How many tracks are there in the album with ID 5?
SQL Query: SELECT COUNT(*) FROM Track WHERE AlbumId = 5;

User input: Which albums are from the year 2000?
SQL Query: SELECT * FROM Album WHERE strftime(&#x27;%Y&#x27;, ReleaseDate) = &#x27;2000&#x27;;

User input: List all tracks in the &#x27;Rock&#x27; genre.
SQL Query: SELECT * FROM Track WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name = &#x27;Rock&#x27;);

User input: How many artists are there?
SQL query:
 */

// Now we can use it in a chain:

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});
const chain = await createSqlQueryChain({
  db,
  llm,
  prompt,
  dialect: "sqlite",
});

console.log(await chain.invoke({ question: "how many artists are there?" }));

/**
SELECT COUNT(*) FROM Artist;
 */

```

#### API Reference: - MemoryVectorStore from langchain/vectorstores/memory - SemanticSimilarityExampleSelector from @langchain/core/example_selectors - ChatOpenAI from @langchain/openai - OpenAIEmbeddings from @langchain/openai - FewShotPromptTemplate from @langchain/core/prompts - PromptTemplate from @langchain/core/prompts - createSqlQueryChain from langchain/chains/sql_db ## Next steps[​](#next-steps) You&#x27;ve now learned about some prompting strategies to improve SQL generation.

Next, check out some of the other guides in this section, like [how to query over large databases](/docs/how_to/sql_large_db).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Dialect-specific prompting](#dialect-specific-prompting)
- [Table definitions and example rows](#table-definitions-and-example-rows)
- [Few-shot examples](#few-shot-examples)
- [Dynamic few-shot examples](#dynamic-few-shot-examples)
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