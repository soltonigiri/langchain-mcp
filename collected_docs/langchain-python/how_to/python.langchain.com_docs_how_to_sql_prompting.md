How to better prompt when doing SQL question-answering | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/sql_prompting.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/sql_prompting.ipynb)How to better prompt when doing SQL question-answering In this guide we&#x27;ll go over prompting strategies to improve SQL query generation using [create_sql_query_chain](https://python.langchain.com/api_reference/langchain/chains/langchain.chains.sql_database.query.create_sql_query_chain.html). We&#x27;ll largely focus on methods for getting relevant database-specific information in your prompt. We will cover: How the dialect of the LangChain [SQLDatabase](https://python.langchain.com/api_reference/community/utilities/langchain_community.utilities.sql_database.SQLDatabase.html) impacts the prompt of the chain; How to format schema information into the prompt using SQLDatabase.get_context; How to build and select [few-shot examples](/docs/concepts/few_shot_prompting/) to assist the model. Setup[​](#setup) First, get required packages and set environment variables:

```python
%pip install --upgrade --quiet  langchain langchain-community langchain-experimental langchain-openai

```

```python
# Uncomment the below to use LangSmith. Not required.
# import os
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()
# os.environ["LANGSMITH_TRACING"] = "true"

``` The below example will use a SQLite connection with Chinook database. Follow [these installation steps](https://database.guide/2-sample-databases-sqlite/) to create Chinook.db in the same directory as this notebook: Save [this file](https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_Sqlite.sql) as Chinook_Sqlite.sql Run sqlite3 Chinook.db Run .read Chinook_Sqlite.sql Test SELECT * FROM Artist LIMIT 10; Now, Chinook.db is in our directory and we can interface with it using the SQLAlchemy-driven SQLDatabase class:

```python
from langchain_community.utilities import SQLDatabase

db = SQLDatabase.from_uri("sqlite:///Chinook.db", sample_rows_in_table_info=3)
print(db.dialect)
print(db.get_usable_table_names())
print(db.run("SELECT * FROM Artist LIMIT 10;"))

```

```output
sqlite
[&#x27;Album&#x27;, &#x27;Artist&#x27;, &#x27;Customer&#x27;, &#x27;Employee&#x27;, &#x27;Genre&#x27;, &#x27;Invoice&#x27;, &#x27;InvoiceLine&#x27;, &#x27;MediaType&#x27;, &#x27;Playlist&#x27;, &#x27;PlaylistTrack&#x27;, &#x27;Track&#x27;]
[(1, &#x27;AC/DC&#x27;), (2, &#x27;Accept&#x27;), (3, &#x27;Aerosmith&#x27;), (4, &#x27;Alanis Morissette&#x27;), (5, &#x27;Alice In Chains&#x27;), (6, &#x27;Antônio Carlos Jobim&#x27;), (7, &#x27;Apocalyptica&#x27;), (8, &#x27;Audioslave&#x27;), (9, &#x27;BackBeat&#x27;), (10, &#x27;Billy Cobham&#x27;)]

``` Dialect-specific prompting[​](#dialect-specific-prompting) One of the simplest things we can do is make our prompt specific to the SQL dialect we&#x27;re using. When using the built-in [create_sql_query_chain](https://python.langchain.com/api_reference/langchain/chains/langchain.chains.sql_database.query.create_sql_query_chain.html) and [SQLDatabase](https://python.langchain.com/api_reference/community/utilities/langchain_community.utilities.sql_database.SQLDatabase.html), this is handled for you for any of the following dialects:

```python
from langchain.chains.sql_database.prompt import SQL_PROMPTS

list(SQL_PROMPTS)

```

```output
[&#x27;crate&#x27;,
 &#x27;duckdb&#x27;,
 &#x27;googlesql&#x27;,
 &#x27;mssql&#x27;,
 &#x27;mysql&#x27;,
 &#x27;mariadb&#x27;,
 &#x27;oracle&#x27;,
 &#x27;postgresql&#x27;,
 &#x27;sqlite&#x27;,
 &#x27;clickhouse&#x27;,
 &#x27;prestodb&#x27;]

``` For example, using our current DB we can see that we&#x27;ll get a SQLite-specific prompt. Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

```

```python
from langchain.chains import create_sql_query_chain

chain = create_sql_query_chain(llm, db)
chain.get_prompts()[0].pretty_print()

```

```output
You are a SQLite expert. Given an input question, first create a syntactically correct SQLite query to run, then look at the results of the query and return the answer to the input question.
Unless the user specifies in the question a specific number of examples to obtain, query for at most 5 results using the LIMIT clause as per SQLite. You can order the results to return the most informative data in the database.
Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
Pay attention to use date(&#x27;now&#x27;) function to get the current date, if the question involves "today".

Use the following format:

Question: Question here
SQLQuery: SQL Query to run
SQLResult: Result of the SQLQuery
Answer: Final answer here

Only use the following tables:
[33;1m[1;3m{table_info}[0m

Question: [33;1m[1;3m{input}[0m

``` Table definitions and example rows[​](#table-definitions-and-example-rows) In most SQL chains, we&#x27;ll need to feed the model at least part of the database schema. Without this it won&#x27;t be able to write valid queries. Our database comes with some convenience methods to give us the relevant context. Specifically, we can get the table names, their schemas, and a sample of rows from each table. Here we will use SQLDatabase.get_context, which provides available tables and their schemas:

```python
context = db.get_context()
print(list(context))
print(context["table_info"])

```

```output
[&#x27;table_info&#x27;, &#x27;table_names&#x27;]

CREATE TABLE "Album" (
	"AlbumId" INTEGER NOT NULL,
	"Title" NVARCHAR(160) NOT NULL,
	"ArtistId" INTEGER NOT NULL,
	PRIMARY KEY ("AlbumId"),
	FOREIGN KEY("ArtistId") REFERENCES "Artist" ("ArtistId")
)

/*
3 rows from Album table:
AlbumId	Title	ArtistId
1	For Those About To Rock We Salute You	1
2	Balls to the Wall	2
3	Restless and Wild	2
*/

CREATE TABLE "Artist" (
	"ArtistId" INTEGER NOT NULL,
	"Name" NVARCHAR(120),
	PRIMARY KEY ("ArtistId")
)

/*
3 rows from Artist table:
ArtistId	Name
1	AC/DC
2	Accept
3	Aerosmith
*/

CREATE TABLE "Customer" (
	"CustomerId" INTEGER NOT NULL,
	"FirstName" NVARCHAR(40) NOT NULL,
	"LastName" NVARCHAR(20) NOT NULL,
	"Company" NVARCHAR(80),
	"Address" NVARCHAR(70),
	"City" NVARCHAR(40),
	"State" NVARCHAR(40),
	"Country" NVARCHAR(40),
	"PostalCode" NVARCHAR(10),
	"Phone" NVARCHAR(24),
	"Fax" NVARCHAR(24),
	"Email" NVARCHAR(60) NOT NULL,
	"SupportRepId" INTEGER,
	PRIMARY KEY ("CustomerId"),
	FOREIGN KEY("SupportRepId") REFERENCES "Employee" ("EmployeeId")
)

/*
3 rows from Customer table:
CustomerId	FirstName	LastName	Company	Address	City	State	Country	PostalCode	Phone	Fax	Email	SupportRepId
1	Luís	Gonçalves	Embraer - Empresa Brasileira de Aeronáutica S.A.	Av. Brigadeiro Faria Lima, 2170	São José dos Campos	SP	Brazil	12227-000	+55 (12) 3923-5555	+55 (12) 3923-5566	luisg@embraer.com.br	3
2	Leonie	Köhler	None	Theodor-Heuss-Straße 34	Stuttgart	None	Germany	70174	+49 0711 2842222	None	leonekohler@surfeu.de	5
3	François	Tremblay	None	1498 rue Bélanger	Montréal	QC	Canada	H2G 1A7	+1 (514) 721-4711	None	ftremblay@gmail.com	3
*/

CREATE TABLE "Employee" (
	"EmployeeId" INTEGER NOT NULL,
	"LastName" NVARCHAR(20) NOT NULL,
	"FirstName" NVARCHAR(20) NOT NULL,
	"Title" NVARCHAR(30),
	"ReportsTo" INTEGER,
	"BirthDate" DATETIME,
	"HireDate" DATETIME,
	"Address" NVARCHAR(70),
	"City" NVARCHAR(40),
	"State" NVARCHAR(40),
	"Country" NVARCHAR(40),
	"PostalCode" NVARCHAR(10),
	"Phone" NVARCHAR(24),
	"Fax" NVARCHAR(24),
	"Email" NVARCHAR(60),
	PRIMARY KEY ("EmployeeId"),
	FOREIGN KEY("ReportsTo") REFERENCES "Employee" ("EmployeeId")
)

/*
3 rows from Employee table:
EmployeeId	LastName	FirstName	Title	ReportsTo	BirthDate	HireDate	Address	City	State	Country	PostalCode	Phone	Fax	Email
1	Adams	Andrew	General Manager	None	1962-02-18 00:00:00	2002-08-14 00:00:00	11120 Jasper Ave NW	Edmonton	AB	Canada	T5K 2N1	+1 (780) 428-9482	+1 (780) 428-3457	andrew@chinookcorp.com
2	Edwards	Nancy	Sales Manager	1	1958-12-08 00:00:00	2002-05-01 00:00:00	825 8 Ave SW	Calgary	AB	Canada	T2P 2T3	+1 (403) 262-3443	+1 (403) 262-3322	nancy@chinookcorp.com
3	Peacock	Jane	Sales Support Agent	2	1973-08-29 00:00:00	2002-04-01 00:00:00	1111 6 Ave SW	Calgary	AB	Canada	T2P 5M5	+1 (403) 262-3443	+1 (403) 262-6712	jane@chinookcorp.com
*/

CREATE TABLE "Genre" (
	"GenreId" INTEGER NOT NULL,
	"Name" NVARCHAR(120),
	PRIMARY KEY ("GenreId")
)

/*
3 rows from Genre table:
GenreId	Name
1	Rock
2	Jazz
3	Metal
*/

CREATE TABLE "Invoice" (
	"InvoiceId" INTEGER NOT NULL,
	"CustomerId" INTEGER NOT NULL,
	"InvoiceDate" DATETIME NOT NULL,
	"BillingAddress" NVARCHAR(70),
	"BillingCity" NVARCHAR(40),
	"BillingState" NVARCHAR(40),
	"BillingCountry" NVARCHAR(40),
	"BillingPostalCode" NVARCHAR(10),
	"Total" NUMERIC(10, 2) NOT NULL,
	PRIMARY KEY ("InvoiceId"),
	FOREIGN KEY("CustomerId") REFERENCES "Customer" ("CustomerId")
)

/*
3 rows from Invoice table:
InvoiceId	CustomerId	InvoiceDate	BillingAddress	BillingCity	BillingState	BillingCountry	BillingPostalCode	Total
1	2	2021-01-01 00:00:00	Theodor-Heuss-Straße 34	Stuttgart	None	Germany	70174	1.98
2	4	2021-01-02 00:00:00	Ullevålsveien 14	Oslo	None	Norway	0171	3.96
3	8	2021-01-03 00:00:00	Grétrystraat 63	Brussels	None	Belgium	1000	5.94
*/

CREATE TABLE "InvoiceLine" (
	"InvoiceLineId" INTEGER NOT NULL,
	"InvoiceId" INTEGER NOT NULL,
	"TrackId" INTEGER NOT NULL,
	"UnitPrice" NUMERIC(10, 2) NOT NULL,
	"Quantity" INTEGER NOT NULL,
	PRIMARY KEY ("InvoiceLineId"),
	FOREIGN KEY("TrackId") REFERENCES "Track" ("TrackId"),
	FOREIGN KEY("InvoiceId") REFERENCES "Invoice" ("InvoiceId")
)

/*
3 rows from InvoiceLine table:
InvoiceLineId	InvoiceId	TrackId	UnitPrice	Quantity
1	1	2	0.99	1
2	1	4	0.99	1
3	2	6	0.99	1
*/

CREATE TABLE "MediaType" (
	"MediaTypeId" INTEGER NOT NULL,
	"Name" NVARCHAR(120),
	PRIMARY KEY ("MediaTypeId")
)

/*
3 rows from MediaType table:
MediaTypeId	Name
1	MPEG audio file
2	Protected AAC audio file
3	Protected MPEG-4 video file
*/

CREATE TABLE "Playlist" (
	"PlaylistId" INTEGER NOT NULL,
	"Name" NVARCHAR(120),
	PRIMARY KEY ("PlaylistId")
)

/*
3 rows from Playlist table:
PlaylistId	Name
1	Music
2	Movies
3	TV Shows
*/

CREATE TABLE "PlaylistTrack" (
	"PlaylistId" INTEGER NOT NULL,
	"TrackId" INTEGER NOT NULL,
	PRIMARY KEY ("PlaylistId", "TrackId"),
	FOREIGN KEY("TrackId") REFERENCES "Track" ("TrackId"),
	FOREIGN KEY("PlaylistId") REFERENCES "Playlist" ("PlaylistId")
)

/*
3 rows from PlaylistTrack table:
PlaylistId	TrackId
1	3402
1	3389
1	3390
*/

CREATE TABLE "Track" (
	"TrackId" INTEGER NOT NULL,
	"Name" NVARCHAR(200) NOT NULL,
	"AlbumId" INTEGER,
	"MediaTypeId" INTEGER NOT NULL,
	"GenreId" INTEGER,
	"Composer" NVARCHAR(220),
	"Milliseconds" INTEGER NOT NULL,
	"Bytes" INTEGER,
	"UnitPrice" NUMERIC(10, 2) NOT NULL,
	PRIMARY KEY ("TrackId"),
	FOREIGN KEY("MediaTypeId") REFERENCES "MediaType" ("MediaTypeId"),
	FOREIGN KEY("GenreId") REFERENCES "Genre" ("GenreId"),
	FOREIGN KEY("AlbumId") REFERENCES "Album" ("AlbumId")
)

/*
3 rows from Track table:
TrackId	Name	AlbumId	MediaTypeId	GenreId	Composer	Milliseconds	Bytes	UnitPrice
1	For Those About To Rock (We Salute You)	1	1	1	Angus Young, Malcolm Young, Brian Johnson	343719	11170334	0.99
2	Balls to the Wall	2	2	1	U. Dirkschneider, W. Hoffmann, H. Frank, P. Baltes, S. Kaufmann, G. Hoffmann	342562	5510424	0.99
3	Fast As a Shark	3	2	1	F. Baltes, S. Kaufman, U. Dirkscneider & W. Hoffman	230619	3990994	0.99
*/

``` When we don&#x27;t have too many, or too wide of, tables, we can just insert the entirety of this information in our prompt:

```python
prompt_with_context = chain.get_prompts()[0].partial(table_info=context["table_info"])
print(prompt_with_context.pretty_repr()[:1500])

```

```output
You are a SQLite expert. Given an input question, first create a syntactically correct SQLite query to run, then look at the results of the query and return the answer to the input question.
Unless the user specifies in the question a specific number of examples to obtain, query for at most 5 results using the LIMIT clause as per SQLite. You can order the results to return the most informative data in the database.
Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
Pay attention to use date(&#x27;now&#x27;) function to get the current date, if the question involves "today".

Use the following format:

Question: Question here
SQLQuery: SQL Query to run
SQLResult: Result of the SQLQuery
Answer: Final answer here

Only use the following tables:

CREATE TABLE "Album" (
	"AlbumId" INTEGER NOT NULL,
	"Title" NVARCHAR(160) NOT NULL,
	"ArtistId" INTEGER NOT NULL,
	PRIMARY KEY ("AlbumId"),
	FOREIGN KEY("ArtistId") REFERENCES "Artist" ("ArtistId")
)

/*
3 rows from Album table:
AlbumId	Title	ArtistId
1	For Those About To Rock We Salute You	1
2	Balls to the Wall	2
3	Restless and Wild	2
*/

CREATE TABLE "Artist" (
	"ArtistId" INTEGER NOT NULL,
	"Name" NVARCHAR(120)

``` When we do have database schemas that are too large to fit into our model&#x27;s context window, we&#x27;ll need to come up with ways of inserting only the relevant table definitions into the prompt based on the user input. For more on this head to the [Many tables, wide tables, high-cardinality feature](/docs/how_to/sql_large_db/) guide. Few-shot examples[​](#few-shot-examples) Including examples of natural language questions being converted to valid SQL queries against our database in the prompt will often improve model performance, especially for complex queries. Let&#x27;s say we have the following examples:

```python
examples = [
    {"input": "List all artists.", "query": "SELECT * FROM Artist;"},
    {
        "input": "Find all albums for the artist &#x27;AC/DC&#x27;.",
        "query": "SELECT * FROM Album WHERE ArtistId = (SELECT ArtistId FROM Artist WHERE Name = &#x27;AC/DC&#x27;);",
    },
    {
        "input": "List all tracks in the &#x27;Rock&#x27; genre.",
        "query": "SELECT * FROM Track WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name = &#x27;Rock&#x27;);",
    },
    {
        "input": "Find the total duration of all tracks.",
        "query": "SELECT SUM(Milliseconds) FROM Track;",
    },
    {
        "input": "List all customers from Canada.",
        "query": "SELECT * FROM Customer WHERE Country = &#x27;Canada&#x27;;",
    },
    {
        "input": "How many tracks are there in the album with ID 5?",
        "query": "SELECT COUNT(*) FROM Track WHERE AlbumId = 5;",
    },
    {
        "input": "Find the total number of invoices.",
        "query": "SELECT COUNT(*) FROM Invoice;",
    },
    {
        "input": "List all tracks that are longer than 5 minutes.",
        "query": "SELECT * FROM Track WHERE Milliseconds > 300000;",
    },
    {
        "input": "Who are the top 5 customers by total purchase?",
        "query": "SELECT CustomerId, SUM(Total) AS TotalPurchase FROM Invoice GROUP BY CustomerId ORDER BY TotalPurchase DESC LIMIT 5;",
    },
    {
        "input": "Which albums are from the year 2000?",
        "query": "SELECT * FROM Album WHERE strftime(&#x27;%Y&#x27;, ReleaseDate) = &#x27;2000&#x27;;",
    },
    {
        "input": "How many employees are there",
        "query": &#x27;SELECT COUNT(*) FROM "Employee"&#x27;,
    },
]

``` We can create a few-shot prompt with them like so:

```python
from langchain_core.prompts import FewShotPromptTemplate, PromptTemplate

example_prompt = PromptTemplate.from_template("User input: {input}\nSQL query: {query}")
prompt = FewShotPromptTemplate(
    examples=examples[:5],
    example_prompt=example_prompt,
    prefix="You are a SQLite expert. Given an input question, create a syntactically correct SQLite query to run. Unless otherwise specificed, do not return more than {top_k} rows.\n\nHere is the relevant table info: {table_info}\n\nBelow are a number of examples of questions and their corresponding SQL queries.",
    suffix="User input: {input}\nSQL query: ",
    input_variables=["input", "top_k", "table_info"],
)

```API Reference:**[FewShotPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.few_shot.FewShotPromptTemplate.html) | [PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```python
print(prompt.format(input="How many artists are there?", top_k=3, table_info="foo"))

```**

```output
You are a SQLite expert. Given an input question, create a syntactically correct SQLite query to run. Unless otherwise specificed, do not return more than 3 rows.

Here is the relevant table info: foo

Below are a number of examples of questions and their corresponding SQL queries.

User input: List all artists.
SQL query: SELECT * FROM Artist;

User input: Find all albums for the artist &#x27;AC/DC&#x27;.
SQL query: SELECT * FROM Album WHERE ArtistId = (SELECT ArtistId FROM Artist WHERE Name = &#x27;AC/DC&#x27;);

User input: List all tracks in the &#x27;Rock&#x27; genre.
SQL query: SELECT * FROM Track WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name = &#x27;Rock&#x27;);

User input: Find the total duration of all tracks.
SQL query: SELECT SUM(Milliseconds) FROM Track;

User input: List all customers from Canada.
SQL query: SELECT * FROM Customer WHERE Country = &#x27;Canada&#x27;;

User input: How many artists are there?
SQL query:

``` Dynamic few-shot examples[​](#dynamic-few-shot-examples) If we have enough examples, we may want to only include the most relevant ones in the prompt, either because they don&#x27;t fit in the model&#x27;s context window or because the long tail of examples distracts the model. And specifically, given any input we want to include the examples most relevant to that input. We can do just this using an ExampleSelector. In this case we&#x27;ll use a [SemanticSimilarityExampleSelector](https://python.langchain.com/api_reference/core/example_selectors/langchain_core.example_selectors.semantic_similarity.SemanticSimilarityExampleSelector.html), which will store the examples in the vector database of our choosing. At runtime it will perform a similarity search between the input and our examples, and return the most semantically similar ones. We default to OpenAI embeddings here, but you can swap them out for the model provider of your choice.

```python
from langchain_community.vectorstores import FAISS
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_openai import OpenAIEmbeddings

example_selector = SemanticSimilarityExampleSelector.from_examples(
    examples,
    OpenAIEmbeddings(),
    FAISS,
    k=5,
    input_keys=["input"],
)

```API Reference:**[SemanticSimilarityExampleSelector](https://python.langchain.com/api_reference/core/example_selectors/langchain_core.example_selectors.semantic_similarity.SemanticSimilarityExampleSelector.html)

```python
example_selector.select_examples({"input": "how many artists are there?"})

```

```output
[{&#x27;input&#x27;: &#x27;List all artists.&#x27;, &#x27;query&#x27;: &#x27;SELECT * FROM Artist;&#x27;},
 {&#x27;input&#x27;: &#x27;How many employees are there&#x27;,
  &#x27;query&#x27;: &#x27;SELECT COUNT(*) FROM "Employee"&#x27;},
 {&#x27;input&#x27;: &#x27;How many tracks are there in the album with ID 5?&#x27;,
  &#x27;query&#x27;: &#x27;SELECT COUNT(*) FROM Track WHERE AlbumId = 5;&#x27;},
 {&#x27;input&#x27;: &#x27;Which albums are from the year 2000?&#x27;,
  &#x27;query&#x27;: "SELECT * FROM Album WHERE strftime(&#x27;%Y&#x27;, ReleaseDate) = &#x27;2000&#x27;;"},
 {&#x27;input&#x27;: "List all tracks in the &#x27;Rock&#x27; genre.",
  &#x27;query&#x27;: "SELECT * FROM Track WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name = &#x27;Rock&#x27;);"}]

``` To use it, we can pass the ExampleSelector directly in to our FewShotPromptTemplate:

```python
prompt = FewShotPromptTemplate(
    example_selector=example_selector,
    example_prompt=example_prompt,
    prefix="You are a SQLite expert. Given an input question, create a syntactically correct SQLite query to run. Unless otherwise specificed, do not return more than {top_k} rows.\n\nHere is the relevant table info: {table_info}\n\nBelow are a number of examples of questions and their corresponding SQL queries.",
    suffix="User input: {input}\nSQL query: ",
    input_variables=["input", "top_k", "table_info"],
)

```

```python
print(prompt.format(input="how many artists are there?", top_k=3, table_info="foo"))

```

```output
You are a SQLite expert. Given an input question, create a syntactically correct SQLite query to run. Unless otherwise specificed, do not return more than 3 rows.

Here is the relevant table info: foo

Below are a number of examples of questions and their corresponding SQL queries.

User input: List all artists.
SQL query: SELECT * FROM Artist;

User input: How many employees are there
SQL query: SELECT COUNT(*) FROM "Employee"

User input: How many tracks are there in the album with ID 5?
SQL query: SELECT COUNT(*) FROM Track WHERE AlbumId = 5;

User input: Which albums are from the year 2000?
SQL query: SELECT * FROM Album WHERE strftime(&#x27;%Y&#x27;, ReleaseDate) = &#x27;2000&#x27;;

User input: List all tracks in the &#x27;Rock&#x27; genre.
SQL query: SELECT * FROM Track WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name = &#x27;Rock&#x27;);

User input: how many artists are there?
SQL query:

``` Trying it out, we see that the model identifies the relevant table:

```python
chain = create_sql_query_chain(llm, db, prompt)
chain.invoke({"question": "how many artists are there?"})

```

```output
&#x27;SELECT COUNT(*) FROM Artist;&#x27;

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/sql_prompting.ipynb)[Setup](#setup)
- [Dialect-specific prompting](#dialect-specific-prompting)
- [Table definitions and example rows](#table-definitions-and-example-rows)
- [Few-shot examples](#few-shot-examples)
- [Dynamic few-shot examples](#dynamic-few-shot-examples)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)
- [Slack](https://www.langchain.com/join-community)

GitHub

- [Organization](https://github.com/langchain-ai)
- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)
- [YouTube](https://www.youtube.com/@LangChain)

Copyright © 2025 LangChain, Inc.