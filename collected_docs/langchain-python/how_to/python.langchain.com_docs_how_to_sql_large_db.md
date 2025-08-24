How to deal with large databases when doing SQL question-answering | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/sql_large_db.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/sql_large_db.ipynb)How to deal with large databases when doing SQL question-answering In order to write valid queries against a database, we need to feed the model the table names, table schemas, and feature values for it to query over. When there are many tables, columns, and/or high-cardinality columns, it becomes impossible for us to dump the full information about our database in every prompt. Instead, we must find ways to dynamically insert into the prompt only the most relevant information. In this guide we demonstrate methods for identifying such relevant information, and feeding this into a query-generation step. We will cover: Identifying a relevant subset of tables; Identifying a relevant subset of column values. Setup[​](#setup) First, get required packages and set environment variables:

```python
%pip install --upgrade --quiet  langchain langchain-community langchain-openai

```

```python
# Uncomment the below to use LangSmith. Not required.
# import os
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()
# os.environ["LANGSMITH_TRACING"] = "true"

``` The below example will use a SQLite connection with Chinook database. Follow [these installation steps](https://database.guide/2-sample-databases-sqlite/) to create Chinook.db in the same directory as this notebook: Save [this file](https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_Sqlite.sql) as Chinook_Sqlite.sql Run sqlite3 Chinook.db Run .read Chinook_Sqlite.sql Test SELECT * FROM Artist LIMIT 10; Now, Chinook.db is in our directory and we can interface with it using the SQLAlchemy-driven [SQLDatabase](https://python.langchain.com/api_reference/community/utilities/langchain_community.utilities.sql_database.SQLDatabase.html) class:

```python
from langchain_community.utilities import SQLDatabase

db = SQLDatabase.from_uri("sqlite:///Chinook.db")
print(db.dialect)
print(db.get_usable_table_names())
print(db.run("SELECT * FROM Artist LIMIT 10;"))

```

```output
sqlite
[&#x27;Album&#x27;, &#x27;Artist&#x27;, &#x27;Customer&#x27;, &#x27;Employee&#x27;, &#x27;Genre&#x27;, &#x27;Invoice&#x27;, &#x27;InvoiceLine&#x27;, &#x27;MediaType&#x27;, &#x27;Playlist&#x27;, &#x27;PlaylistTrack&#x27;, &#x27;Track&#x27;]
[(1, &#x27;AC/DC&#x27;), (2, &#x27;Accept&#x27;), (3, &#x27;Aerosmith&#x27;), (4, &#x27;Alanis Morissette&#x27;), (5, &#x27;Alice In Chains&#x27;), (6, &#x27;Antônio Carlos Jobim&#x27;), (7, &#x27;Apocalyptica&#x27;), (8, &#x27;Audioslave&#x27;), (9, &#x27;BackBeat&#x27;), (10, &#x27;Billy Cobham&#x27;)]

``` Many tables[​](#many-tables) One of the main pieces of information we need to include in our prompt is the schemas of the relevant tables. When we have very many tables, we can&#x27;t fit all of the schemas in a single prompt. What we can do in such cases is first extract the names of the tables related to the user input, and then include only their schemas. One easy and reliable way to do this is using [tool-calling](/docs/how_to/tool_calling/). Below, we show how we can use this feature to obtain output conforming to a desired format (in this case, a list of table names). We use the chat model&#x27;s .bind_tools method to bind a tool in Pydantic format, and feed this into an output parser to reconstruct the object from the model&#x27;s response. Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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
from langchain_core.output_parsers.openai_tools import PydanticToolsParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

class Table(BaseModel):
    """Table in SQL database."""

    name: str = Field(description="Name of table in SQL database.")

table_names = "\n".join(db.get_usable_table_names())
system = f"""Return the names of ALL the SQL tables that MIGHT be relevant to the user question. \
The tables are:

{table_names}

Remember to include ALL POTENTIALLY RELEVANT tables, even if you&#x27;re not sure that they&#x27;re needed."""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "{input}"),
    ]
)
llm_with_tools = llm.bind_tools([Table])
output_parser = PydanticToolsParser(tools=[Table])

table_chain = prompt | llm_with_tools | output_parser

table_chain.invoke({"input": "What are all the genres of Alanis Morissette songs"})

```API Reference:**[PydanticToolsParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.openai_tools.PydanticToolsParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
[Table(name=&#x27;Genre&#x27;)]

```**This works pretty well! Except, as we&#x27;ll see below, we actually need a few other tables as well. This would be pretty difficult for the model to know based just on the user question. In this case, we might think to simplify our model&#x27;s job by grouping the tables together. We&#x27;ll just ask the model to choose between categories "Music" and "Business", and then take care of selecting all the relevant tables from there:

```python
system = """Return the names of any SQL tables that are relevant to the user question.
The tables are:

Music
Business
"""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "{input}"),
    ]
)

category_chain = prompt | llm_with_tools | output_parser
category_chain.invoke({"input": "What are all the genres of Alanis Morissette songs"})

```

```output
[Table(name=&#x27;Music&#x27;), Table(name=&#x27;Business&#x27;)]

```

```python
from typing import List

def get_tables(categories: List[Table]) -> List[str]:
    tables = []
    for category in categories:
        if category.name == "Music":
            tables.extend(
                [
                    "Album",
                    "Artist",
                    "Genre",
                    "MediaType",
                    "Playlist",
                    "PlaylistTrack",
                    "Track",
                ]
            )
        elif category.name == "Business":
            tables.extend(["Customer", "Employee", "Invoice", "InvoiceLine"])
    return tables

table_chain = category_chain | get_tables
table_chain.invoke({"input": "What are all the genres of Alanis Morissette songs"})

```

```output
[&#x27;Album&#x27;,
 &#x27;Artist&#x27;,
 &#x27;Genre&#x27;,
 &#x27;MediaType&#x27;,
 &#x27;Playlist&#x27;,
 &#x27;PlaylistTrack&#x27;,
 &#x27;Track&#x27;,
 &#x27;Customer&#x27;,
 &#x27;Employee&#x27;,
 &#x27;Invoice&#x27;,
 &#x27;InvoiceLine&#x27;]

``` Now that we&#x27;ve got a chain that can output the relevant tables for any query we can combine this with our [create_sql_query_chain](https://python.langchain.com/api_reference/langchain/chains/langchain.chains.sql_database.query.create_sql_query_chain.html), which can accept a list of table_names_to_use to determine which table schemas are included in the prompt:

```python
from operator import itemgetter

from langchain.chains import create_sql_query_chain
from langchain_core.runnables import RunnablePassthrough

query_chain = create_sql_query_chain(llm, db)
# Convert "question" key to the "input" key expected by current table_chain.
table_chain = {"input": itemgetter("question")} | table_chain
# Set table_names_to_use using table_chain.
full_chain = RunnablePassthrough.assign(table_names_to_use=table_chain) | query_chain

```API Reference:**[RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```python
query = full_chain.invoke(
    {"question": "What are all the genres of Alanis Morissette songs"}
)
print(query)

```**

```output
SELECT DISTINCT "g"."Name"
FROM "Genre" g
JOIN "Track" t ON "g"."GenreId" = "t"."GenreId"
JOIN "Album" a ON "t"."AlbumId" = "a"."AlbumId"
JOIN "Artist" ar ON "a"."ArtistId" = "ar"."ArtistId"
WHERE "ar"."Name" = &#x27;Alanis Morissette&#x27;
LIMIT 5;

```

```python
db.run(query)

```

```output
"[(&#x27;Rock&#x27;,)]"

``` We can see the LangSmith trace for this run [here](https://smith.langchain.com/public/4fbad408-3554-4f33-ab47-1e510a1b52a3/r). We&#x27;ve seen how to dynamically include a subset of table schemas in a prompt within a chain. Another possible approach to this problem is to let an Agent decide for itself when to look up tables by giving it a Tool to do so. You can see an example of this in the [SQL: Agents](/docs/tutorials/sql_qa/#agents) guide. High-cardinality columns[​](#high-cardinality-columns) In order to filter columns that contain proper nouns such as addresses, song names or artists, we first need to double-check the spelling in order to filter the data correctly. One naive strategy it to create a vector store with all the distinct proper nouns that exist in the database. We can then query that vector store each user input and inject the most relevant proper nouns into the prompt. First we need the unique values for each entity we want, for which we define a function that parses the result into a list of elements:

```python
import ast
import re

def query_as_list(db, query):
    res = db.run(query)
    res = [el for sub in ast.literal_eval(res) for el in sub if el]
    res = [re.sub(r"\b\d+\b", "", string).strip() for string in res]
    return res

proper_nouns = query_as_list(db, "SELECT Name FROM Artist")
proper_nouns += query_as_list(db, "SELECT Title FROM Album")
proper_nouns += query_as_list(db, "SELECT Name FROM Genre")
len(proper_nouns)
proper_nouns[:5]

```

```output
[&#x27;AC/DC&#x27;, &#x27;Accept&#x27;, &#x27;Aerosmith&#x27;, &#x27;Alanis Morissette&#x27;, &#x27;Alice In Chains&#x27;]

``` Now we can embed and store all of our values in a vector database:

```python
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

vector_db = FAISS.from_texts(proper_nouns, OpenAIEmbeddings())
retriever = vector_db.as_retriever(search_kwargs={"k": 15})

``` And put together a query construction chain that first retrieves values from the database and inserts them into the prompt:

```python
from operator import itemgetter

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

system = """You are a SQLite expert. Given an input question, create a syntactically
correct SQLite query to run. Unless otherwise specificed, do not return more than
{top_k} rows.

Only return the SQL query with no markup or explanation.

Here is the relevant table info: {table_info}

Here is a non-exhaustive list of possible feature values. If filtering on a feature
value make sure to check its spelling against this list first:

{proper_nouns}
"""

prompt = ChatPromptTemplate.from_messages([("system", system), ("human", "{input}")])

query_chain = create_sql_query_chain(llm, db, prompt=prompt)
retriever_chain = (
    itemgetter("question")
    | retriever
    | (lambda docs: "\n".join(doc.page_content for doc in docs))
)
chain = RunnablePassthrough.assign(proper_nouns=retriever_chain) | query_chain

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) To try out our chain, let&#x27;s see what happens when we try filtering on "elenis moriset", a misspelling of Alanis Morissette, without and with retrieval:

```python
# Without retrieval
query = query_chain.invoke(
    {"question": "What are all the genres of elenis moriset songs", "proper_nouns": ""}
)
print(query)
db.run(query)

```

```output
SELECT DISTINCT g.Name
FROM Track t
JOIN Album a ON t.AlbumId = a.AlbumId
JOIN Artist ar ON a.ArtistId = ar.ArtistId
JOIN Genre g ON t.GenreId = g.GenreId
WHERE ar.Name = &#x27;Elenis Moriset&#x27;;

```

```output
&#x27;&#x27;

```

```python
# With retrieval
query = chain.invoke({"question": "What are all the genres of elenis moriset songs"})
print(query)
db.run(query)

```

```output
SELECT DISTINCT g.Name
FROM Genre g
JOIN Track t ON g.GenreId = t.GenreId
JOIN Album a ON t.AlbumId = a.AlbumId
JOIN Artist ar ON a.ArtistId = ar.ArtistId
WHERE ar.Name = &#x27;Alanis Morissette&#x27;;

```

```output
"[(&#x27;Rock&#x27;,)]"

``` We can see that with retrieval we&#x27;re able to correct the spelling from "Elenis Moriset" to "Alanis Morissette" and get back a valid result. Another possible approach to this problem is to let an Agent decide for itself when to look up proper nouns. You can see an example of this in the [SQL: Agents](/docs/tutorials/sql_qa/#agents) guide.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/sql_large_db.ipynb)[Setup](#setup)
- [Many tables](#many-tables)
- [High-cardinality columns](#high-cardinality-columns)

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