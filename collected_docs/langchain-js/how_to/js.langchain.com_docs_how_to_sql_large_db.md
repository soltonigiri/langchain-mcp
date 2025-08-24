How to deal with large databases | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to deal with large databasesPrerequisitesThis guide assumes familiarity with the following:Question answering over SQL data](/docs/tutorials/sql_qa)

In order to write valid queries against a database, we need to feed the model the table names, table schemas, and feature values for it to query over. When there are many tables, columns, and/or high-cardinality columns, it becomes impossible for us to dump the full information about our database in every prompt. Instead, we must find ways to dynamically insert into the prompt only the most relevant information. Let&#x27;s take a look at some techniques for doing this.

## Setup[​](#setup)

First, install the required packages and set your environment variables. This example will use OpenAI as the LLM.

```bash
npm install langchain @langchain/community @langchain/openai typeorm sqlite3

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

#### API Reference: - SqlDatabase from langchain/sql_db ## Many tables[​](#many-tables) One of the main pieces of information we need to include in our prompt is the schemas of the relevant tables. When we have very many tables, we can&#x27;t fit all of the schemas in a single prompt. What we can do in such cases is first extract the names of the tables related to the user input, and then include only their schemas.

One easy and reliable way to do this is using OpenAI function-calling and Zod models. LangChain comes with a built-in `createExtractionChainZod` chain that lets us do just this:

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import { z } from "zod";

const datasource = new DataSource({
  type: "sqlite",
  database: "../../../../Chinook.db",
});
const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});
const llm = new ChatOpenAI({ model: "gpt-4", temperature: 0 });

const Table = z.object({
  names: z.array(z.string()).describe("Names of tables in SQL database"),
});

const tableNames = db.allTables.map((t) => t.tableName).join("\n");
const system = `Return the names of ALL the SQL tables that MIGHT be relevant to the user question.
The tables are:

${tableNames}

Remember to include ALL POTENTIALLY RELEVANT tables, even if you&#x27;re not sure that they&#x27;re needed.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", system],
  ["human", "{input}"],
]);
const tableChain = prompt.pipe(llm.withStructuredOutput(Table));

console.log(
  await tableChain.invoke({
    input: "What are all the genres of Alanis Morisette songs?",
  })
);
/**
{ names: [ &#x27;Artist&#x27;, &#x27;Track&#x27;, &#x27;Genre&#x27; ] }
 */

// -------------

// You can see a LangSmith trace of the above chain here:
// https://smith.langchain.com/public/5ca0c91e-4a40-44ef-8c45-9a4247dc474c/r

// -------------

/**
This works pretty well! Except, as we’ll see below, we actually need a few other tables as well.
This would be pretty difficult for the model to know based just on the user question.
In this case, we might think to simplify our model’s job by grouping the tables together.
We’ll just ask the model to choose between categories “Music” and “Business”, and then take care of selecting all the relevant tables from there:
 */

const prompt2 = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Return the names of the SQL tables that are relevant to the user question.
  The tables are:

  Music
  Business`,
  ],
  ["human", "{input}"],
]);
const categoryChain = prompt2.pipe(llm.withStructuredOutput(Table));
console.log(
  await categoryChain.invoke({
    input: "What are all the genres of Alanis Morisette songs?",
  })
);
/**
{ names: [ &#x27;Music&#x27; ] }
 */

// -------------

// You can see a LangSmith trace of the above chain here:
// https://smith.langchain.com/public/12b62e78-bfbe-42ff-86f2-ad738a476554/r

// -------------

const getTables = (categories: z.infer<typeof Table>): Array<string> => {
  let tables: Array<string> = [];
  for (const category of categories.names) {
    if (category === "Music") {
      tables = tables.concat([
        "Album",
        "Artist",
        "Genre",
        "MediaType",
        "Playlist",
        "PlaylistTrack",
        "Track",
      ]);
    } else if (category === "Business") {
      tables = tables.concat([
        "Customer",
        "Employee",
        "Invoice",
        "InvoiceLine",
      ]);
    }
  }
  return tables;
};

const tableChain2 = categoryChain.pipe(getTables);
console.log(
  await tableChain2.invoke({
    input: "What are all the genres of Alanis Morisette songs?",
  })
);
/**
[
  &#x27;Album&#x27;,
  &#x27;Artist&#x27;,
  &#x27;Genre&#x27;,
  &#x27;MediaType&#x27;,
  &#x27;Playlist&#x27;,
  &#x27;PlaylistTrack&#x27;,
  &#x27;Track&#x27;
]
 */

// -------------

// You can see a LangSmith trace of the above chain here:
// https://smith.langchain.com/public/e78c10aa-e923-4a24-b0c8-f7a6f5d316ce/r

// -------------

// Now that we’ve got a chain that can output the relevant tables for any query we can combine this with our createSqlQueryChain, which can accept a list of tableNamesToUse to determine which table schemas are included in the prompt:

const queryChain = await createSqlQueryChain({
  llm,
  db,
  dialect: "sqlite",
});

const tableChain3 = RunnableSequence.from([
  {
    input: (i: { question: string }) => i.question,
  },
  tableChain2,
]);

const fullChain = RunnablePassthrough.assign({
  tableNamesToUse: tableChain3,
}).pipe(queryChain);
const query = await fullChain.invoke({
  question: "What are all the genres of Alanis Morisette songs?",
});
console.log(query);
/**
SELECT DISTINCT "Genre"."Name"
FROM "Genre"
JOIN "Track" ON "Genre"."GenreId" = "Track"."GenreId"
JOIN "Album" ON "Track"."AlbumId" = "Album"."AlbumId"
JOIN "Artist" ON "Album"."ArtistId" = "Artist"."ArtistId"
WHERE "Artist"."Name" = &#x27;Alanis Morissette&#x27;
LIMIT 5;
 */

console.log(await db.run(query));
/**
[{"Name":"Rock"}]
 */

// -------------

// You can see a LangSmith trace of the above chain here:
// https://smith.langchain.com/public/c7d576d0-3462-40db-9edc-5492f10555bf/r

// -------------

// We might rephrase our question slightly to remove redundancy in the answer
const query2 = await fullChain.invoke({
  question: "What is the set of all unique genres of Alanis Morisette songs?",
});
console.log(query2);
/**
SELECT DISTINCT Genre.Name FROM Genre
JOIN Track ON Genre.GenreId = Track.GenreId
JOIN Album ON Track.AlbumId = Album.AlbumId
JOIN Artist ON Album.ArtistId = Artist.ArtistId
WHERE Artist.Name = &#x27;Alanis Morissette&#x27;
 */
console.log(await db.run(query2));
/**
[{"Name":"Rock"}]
 */

// -------------

// You can see a LangSmith trace of the above chain here:
// https://smith.langchain.com/public/6e80087d-e930-4f22-9b40-f7edb95a2145/r

// -------------

```

#### API Reference: - ChatPromptTemplate from @langchain/core/prompts - RunnablePassthrough from @langchain/core/runnables - RunnableSequence from @langchain/core/runnables - ChatOpenAI from @langchain/openai - createSqlQueryChain from langchain/chains/sql_db - SqlDatabase from langchain/sql_db We&#x27;ve seen how to dynamically include a subset of table schemas in a prompt within a chain. Another possible approach to this problem is to let an Agent decide for itself when to look up tables by giving it a Tool to do so.

## High-cardinality columns[​](#high-cardinality-columns)

High-cardinality refers to columns in a database that have a vast range of unique values. These columns are characterized by a high level of uniqueness in their data entries, such as individual names, addresses, or product serial numbers. High-cardinality data can pose challenges for indexing and querying, as it requires more sophisticated strategies to efficiently filter and retrieve specific entries.

In order to filter columns that contain proper nouns such as addresses, song names or artists, we first need to double-check the spelling in order to filter the data correctly.

One naive strategy it to create a vector store with all the distinct proper nouns that exist in the database. We can then query that vector store each user input and inject the most relevant proper nouns into the prompt.

First we need the unique values for each entity we want, for which we define a function that parses the result into a list of elements:

```typescript
import { DocumentInterface } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { SqlDatabase } from "langchain/sql_db";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { DataSource } from "typeorm";

const datasource = new DataSource({
  type: "sqlite",
  database: "../../../../Chinook.db",
});
const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});

async function queryAsList(database: any, query: string): Promise<string[]> {
  const res: Array<{ [key: string]: string }> = JSON.parse(
    await database.run(query)
  )
    .flat()
    .filter((el: any) => el != null);
  const justValues: Array<string> = res.map((item) =>
    Object.values(item)[0]
      .replace(/\b\d+\b/g, "")
      .trim()
  );
  return justValues;
}

let properNouns: string[] = await queryAsList(db, "SELECT Name FROM Artist");
properNouns = properNouns.concat(
  await queryAsList(db, "SELECT Title FROM Album")
);
properNouns = properNouns.concat(
  await queryAsList(db, "SELECT Name FROM Genre")
);

console.log(properNouns.length);
/**
647
 */
console.log(properNouns.slice(0, 5));
/**
[
  &#x27;AC/DC&#x27;,
  &#x27;Accept&#x27;,
  &#x27;Aerosmith&#x27;,
  &#x27;Alanis Morissette&#x27;,
  &#x27;Alice In Chains&#x27;
]
 */

// Now we can embed and store all of our values in a vector database:

const vectorDb = await MemoryVectorStore.fromTexts(
  properNouns,
  {},
  new OpenAIEmbeddings()
);
const retriever = vectorDb.asRetriever(15);

// And put together a query construction chain that first retrieves values from the database and inserts them into the prompt:

const system = `You are a SQLite expert. Given an input question, create a syntactically correct SQLite query to run.
Unless otherwise specified, do not return more than {top_k} rows.

Here is the relevant table info: {table_info}

Here is a non-exhaustive list of possible feature values.
If filtering on a feature value make sure to check its spelling against this list first:

{proper_nouns}`;
const prompt = ChatPromptTemplate.fromMessages([
  ["system", system],
  ["human", "{input}"],
]);

const llm = new ChatOpenAI({ model: "gpt-4", temperature: 0 });

const queryChain = await createSqlQueryChain({
  llm,
  db,
  prompt,
  dialect: "sqlite",
});
const retrieverChain = RunnableSequence.from([
  (i: { question: string }) => i.question,
  retriever,
  (docs: Array<DocumentInterface>) =>
    docs.map((doc) => doc.pageContent).join("\n"),
]);
const chain = RunnablePassthrough.assign({
  proper_nouns: retrieverChain,
}).pipe(queryChain);

// To try out our chain, let’s see what happens when we try filtering on “elenis moriset”, a misspelling of Alanis Morissette, without and with retrieval:

// Without retrieval
const query = await queryChain.invoke({
  question: "What are all the genres of Elenis Moriset songs?",
  proper_nouns: "",
});
console.log("query", query);
/**
query SELECT DISTINCT Genre.Name
FROM Genre
JOIN Track ON Genre.GenreId = Track.GenreId
JOIN Album ON Track.AlbumId = Album.AlbumId
JOIN Artist ON Album.ArtistId = Artist.ArtistId
WHERE Artist.Name = &#x27;Elenis Moriset&#x27;
LIMIT 5;
 */
console.log("db query results", await db.run(query));
/**
db query results []
 */

// -------------

// You can see a LangSmith trace of the above chain here:
// https://smith.langchain.com/public/b153cb9b-6fbb-43a8-b2ba-4c86715183b9/r

// -------------

// With retrieval:
const query2 = await chain.invoke({
  question: "What are all the genres of Elenis Moriset songs?",
});
console.log("query2", query2);
/**
query2 SELECT DISTINCT Genre.Name
FROM Genre
JOIN Track ON Genre.GenreId = Track.GenreId
JOIN Album ON Track.AlbumId = Album.AlbumId
JOIN Artist ON Album.ArtistId = Artist.ArtistId
WHERE Artist.Name = &#x27;Alanis Morissette&#x27;;
 */
console.log("db query results", await db.run(query2));
/**
db query results [{"Name":"Rock"}]
 */

// -------------

// You can see a LangSmith trace of the above chain here:
// https://smith.langchain.com/public/2f4f0e37-3b7f-47b5-837c-e2952489cac0/r

// -------------

```

#### API Reference: - DocumentInterface from @langchain/core/documents - ChatPromptTemplate from @langchain/core/prompts - RunnablePassthrough from @langchain/core/runnables - RunnableSequence from @langchain/core/runnables - ChatOpenAI from @langchain/openai - OpenAIEmbeddings from @langchain/openai - createSqlQueryChain from langchain/chains/sql_db - SqlDatabase from langchain/sql_db - MemoryVectorStore from langchain/vectorstores/memory We can see that with retrieval we&#x27;re able to correct the spelling and get back a valid result.

Another possible approach to this problem is to let an Agent decide for itself when to look up proper nouns.

## Next steps[​](#next-steps)

You&#x27;ve now learned about some prompting strategies to improve SQL generation.

Next, check out some of the other guides in this section, like [how to validate queries](/docs/how_to/sql_query_checking). You might also be interested in the query analysis guide [on handling high cardinality](/docs/how_to/query_high_cardinality).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)
- [Many tables](#many-tables)
- [High-cardinality columns](#high-cardinality-columns)
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