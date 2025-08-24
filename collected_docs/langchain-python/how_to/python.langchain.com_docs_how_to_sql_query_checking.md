How to do query validation as part of SQL question-answering | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/sql_query_checking.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/sql_query_checking.ipynb)How to do query validation as part of SQL question-answering Perhaps the most error-prone part of any SQL chain or agent is writing valid and safe SQL queries. In this guide we&#x27;ll go over some strategies for validating our queries and handling invalid queries. We will cover: Appending a "query validator" step to the query generation; Prompt engineering to reduce the incidence of errors. Setup[​](#setup) First, get required packages and set environment variables:

```python
%pip install --upgrade --quiet  langchain langchain-community langchain-openai

```

```python
# Uncomment the below to use LangSmith. Not required.
# import os
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()
# os.environ["LANGSMITH_TRACING"] = "true"

``` The below example will use a SQLite connection with Chinook database. Follow [these installation steps](https://database.guide/2-sample-databases-sqlite/) to create Chinook.db in the same directory as this notebook: Save [this file](https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_Sqlite.sql) as Chinook_Sqlite.sql Run sqlite3 Chinook.db Run .read Chinook_Sqlite.sql Test SELECT * FROM Artist LIMIT 10; Now, Chinook.db is in our directory and we can interface with it using the SQLAlchemy-driven SQLDatabase class:

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

``` Query checker[​](#query-checker) Perhaps the simplest strategy is to ask the model itself to check the original query for common mistakes. Suppose we have the following SQL query chain: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` And we want to validate its outputs. We can do so by extending the chain with a second prompt and model call:

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

system = """Double check the user&#x27;s {dialect} query for common mistakes, including:
- Using NOT IN with NULL values
- Using UNION when UNION ALL should have been used
- Using BETWEEN for exclusive ranges
- Data type mismatch in predicates
- Properly quoting identifiers
- Using the correct number of arguments for functions
- Casting to the correct data type
- Using the proper columns for joins

If there are any of the above mistakes, rewrite the query.
If there are no mistakes, just reproduce the original query with no further commentary.

Output the final SQL query only."""
prompt = ChatPromptTemplate.from_messages(
    [("system", system), ("human", "{query}")]
).partial(dialect=db.dialect)
validation_chain = prompt | llm | StrOutputParser()

full_chain = {"query": chain} | validation_chain

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```python
query = full_chain.invoke(
    {
        "question": "What&#x27;s the average Invoice from an American customer whose Fax is missing since 2003 but before 2010"
    }
)
print(query)

```

```output
SELECT AVG(i.Total) AS AverageInvoice
FROM Invoice i
JOIN Customer c ON i.CustomerId = c.CustomerId
WHERE c.Country = &#x27;USA&#x27;
AND c.Fax IS NULL
AND i.InvoiceDate >= &#x27;2003-01-01&#x27;
AND i.InvoiceDate < &#x27;2010-01-01&#x27;

``` Note how we can see both steps of the chain in the [Langsmith trace](https://smith.langchain.com/public/8a743295-a57c-4e4c-8625-bc7e36af9d74/r).

```python
db.run(query)

```

```output
&#x27;[(6.632999999999998,)]&#x27;

``` The obvious downside of this approach is that we need to make two model calls instead of one to generate our query. To get around this we can try to perform the query generation and query check in a single model invocation:

```python
system = """You are a {dialect} expert. Given an input question, create a syntactically correct {dialect} query to run.
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
Final answer: <<FINAL_ANSWER_QUERY>>
"""
prompt = ChatPromptTemplate.from_messages(
    [("system", system), ("human", "{input}")]
).partial(dialect=db.dialect)

def parse_final_answer(output: str) -> str:
    return output.split("Final answer: ")[1]

chain = create_sql_query_chain(llm, db, prompt=prompt) | parse_final_answer
prompt.pretty_print()

```

```output
================================[1m System Message [0m================================

You are a [33;1m[1;3m{dialect}[0m expert. Given an input question, create a syntactically correct [33;1m[1;3m{dialect}[0m query to run.
Unless the user specifies in the question a specific number of examples to obtain, query for at most [33;1m[1;3m{top_k}[0m results using the LIMIT clause as per [33;1m[1;3m{dialect}[0m. You can order the results to return the most informative data in the database.
Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
Pay attention to use date(&#x27;now&#x27;) function to get the current date, if the question involves "today".

Only use the following tables:
[33;1m[1;3m{table_info}[0m

Write an initial draft of the query. Then double check the [33;1m[1;3m{dialect}[0m query for common mistakes, including:
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
Final answer: <<FINAL_ANSWER_QUERY>>

================================[1m Human Message [0m=================================

[33;1m[1;3m{input}[0m

```

```python
query = chain.invoke(
    {
        "question": "What&#x27;s the average Invoice from an American customer whose Fax is missing since 2003 but before 2010"
    }
)
print(query)

```

```output
SELECT AVG(i."Total") AS "AverageInvoice"
FROM "Invoice" i
JOIN "Customer" c ON i."CustomerId" = c."CustomerId"
WHERE c."Country" = &#x27;USA&#x27;
AND c."Fax" IS NULL
AND i."InvoiceDate" BETWEEN &#x27;2003-01-01&#x27; AND &#x27;2010-01-01&#x27;;

```

```python
db.run(query)

```

```output
&#x27;[(6.632999999999998,)]&#x27;

``` ## Human-in-the-loop[​](#human-in-the-loop) In some cases our data is sensitive enough that we never want to execute a SQL query without a human approving it first. Head to the [Tool use: Human-in-the-loop](/docs/how_to/tools_human/) page to learn how to add a human-in-the-loop to any tool, chain or agent. ## Error handling[​](#error-handling) At some point, the model will make a mistake and craft an invalid SQL query. Or an issue will arise with our database. Or the model API will go down. We&#x27;ll want to add some error handling behavior to our chains and agents so that we fail gracefully in these situations, and perhaps even automatically recover. To learn about error handling with tools, head to the [Tool use: Error handling](/docs/how_to/tools_error/) page.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/sql_query_checking.ipynb)[Setup](#setup)
- [Query checker](#query-checker)
- [Human-in-the-loop](#human-in-the-loop)
- [Error handling](#error-handling)

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