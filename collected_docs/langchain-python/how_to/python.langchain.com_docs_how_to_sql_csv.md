How to do question answering over CSVs | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/sql_csv.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/sql_csv.ipynb)How to do question answering over CSVs LLMs are great for building question-answering systems over various types of data sources. In this section we&#x27;ll go over how to build Q&A systems over data stored in a CSV file(s). Like working with SQL databases, the key to working with CSV files is to give an LLM access to tools for querying and interacting with the data. The two main ways to do this are to either: RECOMMENDED**: Load the CSV(s) into a SQL database, and use the approaches outlined in the [SQL tutorial](/docs/tutorials/sql_qa/).

- Give the LLM access to a Python environment where it can use libraries like Pandas to interact with the data.

We will cover both approaches in this guide.

## ⚠️ Security note ⚠️[​](#️-security-note-️)

Both approaches mentioned above carry significant risks. Using SQL requires executing model-generated SQL queries. Using a library like Pandas requires letting the model execute Python code. Since it is easier to tightly scope SQL connection permissions and sanitize SQL queries than it is to sandbox Python environments, **we HIGHLY recommend interacting with CSV data via SQL.** For more on general security best practices, [see here](/docs/security/).

## Setup[​](#setup)

Dependencies for this guide:

```python
%pip install -qU langchain langchain-openai langchain-community langchain-experimental pandas

```**Set required environment variables:

```python
# Using LangSmith is recommended but not required. Uncomment below lines to use.
# import os
# os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` Download the [Titanic dataset](https://www.kaggle.com/datasets/yasserh/titanic-dataset) if you don&#x27;t already have it:

```python
!wget https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/stuff/titanic.csv -O titanic.csv

```

```python
import pandas as pd

df = pd.read_csv("titanic.csv")
print(df.shape)
print(df.columns.tolist())

```

```output
(887, 8)
[&#x27;Survived&#x27;, &#x27;Pclass&#x27;, &#x27;Name&#x27;, &#x27;Sex&#x27;, &#x27;Age&#x27;, &#x27;Siblings/Spouses Aboard&#x27;, &#x27;Parents/Children Aboard&#x27;, &#x27;Fare&#x27;]

``` SQL[​](#sql) Using SQL to interact with CSV data is the recommended approach because it is easier to limit permissions and sanitize queries than with arbitrary Python. Most SQL databases make it easy to load a CSV file in as a table ([DuckDB](https://duckdb.org/docs/data/csv/overview.html), [SQLite](https://www.sqlite.org/csv.html), etc.). Once you&#x27;ve done this you can use all of the chain and agent-creating techniques outlined in the [SQL tutorial](/docs/tutorials/sql_qa/). Here&#x27;s a quick example of how we might do this with SQLite:

```python
from langchain_community.utilities import SQLDatabase
from sqlalchemy import create_engine

engine = create_engine("sqlite:///titanic.db")
df.to_sql("titanic", engine, index=False)

```

```output
887

```

```python
db = SQLDatabase(engine=engine)
print(db.dialect)
print(db.get_usable_table_names())
print(db.run("SELECT * FROM titanic WHERE Age < 2;"))

```

```output
sqlite
[&#x27;titanic&#x27;]
[(1, 2, &#x27;Master. Alden Gates Caldwell&#x27;, &#x27;male&#x27;, 0.83, 0, 2, 29.0), (0, 3, &#x27;Master. Eino Viljami Panula&#x27;, &#x27;male&#x27;, 1.0, 4, 1, 39.6875), (1, 3, &#x27;Miss. Eleanor Ileen Johnson&#x27;, &#x27;female&#x27;, 1.0, 1, 1, 11.1333), (1, 2, &#x27;Master. Richard F Becker&#x27;, &#x27;male&#x27;, 1.0, 2, 1, 39.0), (1, 1, &#x27;Master. Hudson Trevor Allison&#x27;, &#x27;male&#x27;, 0.92, 1, 2, 151.55), (1, 3, &#x27;Miss. Maria Nakid&#x27;, &#x27;female&#x27;, 1.0, 0, 2, 15.7417), (0, 3, &#x27;Master. Sidney Leonard Goodwin&#x27;, &#x27;male&#x27;, 1.0, 5, 2, 46.9), (1, 3, &#x27;Miss. Helene Barbara Baclini&#x27;, &#x27;female&#x27;, 0.75, 2, 1, 19.2583), (1, 3, &#x27;Miss. Eugenie Baclini&#x27;, &#x27;female&#x27;, 0.75, 2, 1, 19.2583), (1, 2, &#x27;Master. Viljo Hamalainen&#x27;, &#x27;male&#x27;, 0.67, 1, 1, 14.5), (1, 3, &#x27;Master. Bertram Vere Dean&#x27;, &#x27;male&#x27;, 1.0, 1, 2, 20.575), (1, 3, &#x27;Master. Assad Alexander Thomas&#x27;, &#x27;male&#x27;, 0.42, 0, 1, 8.5167), (1, 2, &#x27;Master. Andre Mallet&#x27;, &#x27;male&#x27;, 1.0, 0, 2, 37.0042), (1, 2, &#x27;Master. George Sibley Richards&#x27;, &#x27;male&#x27;, 0.83, 1, 1, 18.75)]

``` And create a [SQL agent](/docs/tutorials/sql_qa/) to interact with it: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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
from langchain_community.agent_toolkits import create_sql_agent

agent_executor = create_sql_agent(llm, db=db, agent_type="openai-tools", verbose=True)

```

```python
agent_executor.invoke({"input": "what&#x27;s the average age of survivors"})

```

```output
[1m> Entering new SQL Agent Executor chain...[0m
[32;1m[1;3m
Invoking: `sql_db_list_tables` with `{}`

[0m[38;5;200m[1;3mtitanic[0m[32;1m[1;3m
Invoking: `sql_db_schema` with `{&#x27;table_names&#x27;: &#x27;titanic&#x27;}`

[0m[33;1m[1;3m
CREATE TABLE titanic (
	"Survived" BIGINT,
	"Pclass" BIGINT,
	"Name" TEXT,
	"Sex" TEXT,
	"Age" FLOAT,
	"Siblings/Spouses Aboard" BIGINT,
	"Parents/Children Aboard" BIGINT,
	"Fare" FLOAT
)

/*
3 rows from titanic table:
Survived	Pclass	Name	Sex	Age	Siblings/Spouses Aboard	Parents/Children Aboard	Fare
0	3	Mr. Owen Harris Braund	male	22.0	1	0	7.25
1	1	Mrs. John Bradley (Florence Briggs Thayer) Cumings	female	38.0	1	0	71.2833
1	3	Miss. Laina Heikkinen	female	26.0	0	0	7.925
*/[0m[32;1m[1;3m
Invoking: `sql_db_query` with `{&#x27;query&#x27;: &#x27;SELECT AVG(Age) AS Average_Age FROM titanic WHERE Survived = 1&#x27;}`

[0m[36;1m[1;3m[(28.408391812865496,)][0m[32;1m[1;3mThe average age of survivors in the Titanic dataset is approximately 28.41 years.[0m

[1m> Finished chain.[0m

```

```output
{&#x27;input&#x27;: "what&#x27;s the average age of survivors",
 &#x27;output&#x27;: &#x27;The average age of survivors in the Titanic dataset is approximately 28.41 years.&#x27;}

``` This approach easily generalizes to multiple CSVs, since we can just load each of them into our database as its own table. See the [Multiple CSVs](/docs/how_to/sql_csv/#multiple-csvs) section below. Pandas[​](#pandas) Instead of SQL we can also use data analysis libraries like pandas and the code generating abilities of LLMs to interact with CSV data. Again, this approach is not fit for production use cases unless you have extensive safeguards in place**. For this reason, our code-execution utilities and constructors live in the `langchain-experimental` package.

### Chain[​](#chain)

Most LLMs have been trained on enough pandas Python code that they can generate it just by being asked to:

```python
ai_msg = llm.invoke(
    "I have a pandas DataFrame &#x27;df&#x27; with columns &#x27;Age&#x27; and &#x27;Fare&#x27;. Write code to compute the correlation between the two columns. Return Markdown for a Python code snippet and nothing else."
)
print(ai_msg.content)

```**

```output
\`\`\`python
correlation = df[&#x27;Age&#x27;].corr(df[&#x27;Fare&#x27;])
correlation
\`\`\`

``` We can combine this ability with a Python-executing tool to create a simple data analysis chain. We&#x27;ll first want to load our CSV table as a dataframe, and give the tool access to this dataframe:

```python
import pandas as pd
from langchain_core.prompts import ChatPromptTemplate
from langchain_experimental.tools import PythonAstREPLTool

df = pd.read_csv("titanic.csv")
tool = PythonAstREPLTool(locals={"df": df})
tool.invoke("df[&#x27;Fare&#x27;].mean()")

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
32.30542018038331

```**To help enforce proper use of our Python tool, we&#x27;ll using [tool calling](/docs/how_to/tool_calling/):

```python
llm_with_tools = llm.bind_tools([tool], tool_choice=tool.name)
response = llm_with_tools.invoke(
    "I have a dataframe &#x27;df&#x27; and want to know the correlation between the &#x27;Age&#x27; and &#x27;Fare&#x27; columns"
)
response

```

```output
AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_SBrK246yUbdnJemXFC8Iod05&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"query":"df.corr()[\&#x27;Age\&#x27;][\&#x27;Fare\&#x27;]"}&#x27;, &#x27;name&#x27;: &#x27;python_repl_ast&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 13, &#x27;prompt_tokens&#x27;: 125, &#x27;total_tokens&#x27;: 138}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_3b956da36b&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-1fd332ba-fa72-4351-8182-d464e7368311-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;python_repl_ast&#x27;, &#x27;args&#x27;: {&#x27;query&#x27;: "df.corr()[&#x27;Age&#x27;][&#x27;Fare&#x27;]"}, &#x27;id&#x27;: &#x27;call_SBrK246yUbdnJemXFC8Iod05&#x27;}])

```

```python
response.tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;python_repl_ast&#x27;,
  &#x27;args&#x27;: {&#x27;query&#x27;: "df.corr()[&#x27;Age&#x27;][&#x27;Fare&#x27;]"},
  &#x27;id&#x27;: &#x27;call_SBrK246yUbdnJemXFC8Iod05&#x27;}]

``` We&#x27;ll add a tools output parser to extract the function call as a dict:

```python
from langchain_core.output_parsers.openai_tools import JsonOutputKeyToolsParser

parser = JsonOutputKeyToolsParser(key_name=tool.name, first_tool_only=True)
(llm_with_tools | parser).invoke(
    "I have a dataframe &#x27;df&#x27; and want to know the correlation between the &#x27;Age&#x27; and &#x27;Fare&#x27; columns"
)

```API Reference:**[JsonOutputKeyToolsParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.openai_tools.JsonOutputKeyToolsParser.html)

```output
{&#x27;query&#x27;: "df[[&#x27;Age&#x27;, &#x27;Fare&#x27;]].corr()"}

```**And combine with a prompt so that we can just specify a question without needing to specify the dataframe info every invocation:

```python
system = f"""You have access to a pandas dataframe `df`. \
Here is the output of `df.head().to_markdown()`:

\`\`\`
{df.head().to_markdown()}
\`\`\`

Given a user question, write the Python code to answer it. \
Return ONLY the valid Python code and nothing else. \
Don&#x27;t assume you have access to any libraries other than built-in Python ones and pandas."""
prompt = ChatPromptTemplate.from_messages([("system", system), ("human", "{question}")])
code_chain = prompt | llm_with_tools | parser
code_chain.invoke({"question": "What&#x27;s the correlation between age and fare"})

```

```output
{&#x27;query&#x27;: "df[[&#x27;Age&#x27;, &#x27;Fare&#x27;]].corr()"}

``` And lastly we&#x27;ll add our Python tool so that the generated code is actually executed:

```python
chain = prompt | llm_with_tools | parser | tool
chain.invoke({"question": "What&#x27;s the correlation between age and fare"})

```

```output
0.11232863699941621

``` And just like that we have a simple data analysis chain. We can take a peak at the intermediate steps by looking at the LangSmith trace: [https://smith.langchain.com/public/b1309290-7212-49b7-bde2-75b39a32b49a/r](https://smith.langchain.com/public/b1309290-7212-49b7-bde2-75b39a32b49a/r) We could add an additional LLM call at the end to generate a conversational response, so that we&#x27;re not just responding with the tool output. For this we&#x27;ll want to add a chat history MessagesPlaceholder to our prompt:

```python
from operator import itemgetter

from langchain_core.messages import ToolMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough

system = f"""You have access to a pandas dataframe `df`. \
Here is the output of `df.head().to_markdown()`:

\`\`\`
{df.head().to_markdown()}
\`\`\`

Given a user question, write the Python code to answer it. \
Don&#x27;t assume you have access to any libraries other than built-in Python ones and pandas.
Respond directly to the question once you have enough information to answer it."""
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            system,
        ),
        ("human", "{question}"),
        # This MessagesPlaceholder allows us to optionally append an arbitrary number of messages
        # at the end of the prompt using the &#x27;chat_history&#x27; arg.
        MessagesPlaceholder("chat_history", optional=True),
    ]
)

def _get_chat_history(x: dict) -> list:
    """Parse the chain output up to this point into a list of chat history messages to insert in the prompt."""
    ai_msg = x["ai_msg"]
    tool_call_id = x["ai_msg"].additional_kwargs["tool_calls"][0]["id"]
    tool_msg = ToolMessage(tool_call_id=tool_call_id, content=str(x["tool_output"]))
    return [ai_msg, tool_msg]

chain = (
    RunnablePassthrough.assign(ai_msg=prompt | llm_with_tools)
    .assign(tool_output=itemgetter("ai_msg") | parser | tool)
    .assign(chat_history=_get_chat_history)
    .assign(response=prompt | llm | StrOutputParser())
    .pick(["tool_output", "response"])
)

```API Reference:**[ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html) | [StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```python
chain.invoke({"question": "What&#x27;s the correlation between age and fare"})

```

```output
{&#x27;tool_output&#x27;: 0.11232863699941616,
 &#x27;response&#x27;: &#x27;The correlation between age and fare is approximately 0.1123.&#x27;}

``` Here&#x27;s the LangSmith trace for this run: [https://smith.langchain.com/public/14e38d70-45b1-4b81-8477-9fd2b7c07ea6/r](https://smith.langchain.com/public/14e38d70-45b1-4b81-8477-9fd2b7c07ea6/r)

### Agent[​](#agent)

For complex questions it can be helpful for an LLM to be able to iteratively execute code while maintaining the inputs and outputs of its previous executions. This is where Agents come into play. They allow an LLM to decide how many times a tool needs to be invoked and keep track of the executions it&#x27;s made so far. The [create_pandas_dataframe_agent](https://python.langchain.com/api_reference/experimental/agents/langchain_experimental.agents.agent_toolkits.pandas.base.create_pandas_dataframe_agent.html) is a built-in agent that makes it easy to work with dataframes:

```python
from langchain_experimental.agents import create_pandas_dataframe_agent

agent = create_pandas_dataframe_agent(
    llm, df, agent_type="openai-tools", verbose=True, allow_dangerous_code=True
)
agent.invoke(
    {
        "input": "What&#x27;s the correlation between age and fare? is that greater than the correlation between fare and survival?"
    }
)

```

```output
[1m> Entering new AgentExecutor chain...[0m
[32;1m[1;3m
Invoking: `python_repl_ast` with `{&#x27;query&#x27;: "df[[&#x27;Age&#x27;, &#x27;Fare&#x27;]].corr().iloc[0,1]"}`

[0m[36;1m[1;3m0.11232863699941621[0m[32;1m[1;3m
Invoking: `python_repl_ast` with `{&#x27;query&#x27;: "df[[&#x27;Fare&#x27;, &#x27;Survived&#x27;]].corr().iloc[0,1]"}`

[0m[36;1m[1;3m0.2561785496289603[0m[32;1m[1;3mThe correlation between Age and Fare is approximately 0.112, and the correlation between Fare and Survival is approximately 0.256.

Therefore, the correlation between Fare and Survival (0.256) is greater than the correlation between Age and Fare (0.112).[0m

[1m> Finished chain.[0m

```

```output
{&#x27;input&#x27;: "What&#x27;s the correlation between age and fare? is that greater than the correlation between fare and survival?",
 &#x27;output&#x27;: &#x27;The correlation between Age and Fare is approximately 0.112, and the correlation between Fare and Survival is approximately 0.256.\n\nTherefore, the correlation between Fare and Survival (0.256) is greater than the correlation between Age and Fare (0.112).&#x27;}

``` Here&#x27;s the LangSmith trace for this run: [https://smith.langchain.com/public/6a86aee2-4f22-474a-9264-bd4c7283e665/r](https://smith.langchain.com/public/6a86aee2-4f22-474a-9264-bd4c7283e665/r)

### Multiple CSVs[​](#multiple-csvs)

To handle multiple CSVs (or dataframes) we just need to pass multiple dataframes to our Python tool. Our `create_pandas_dataframe_agent` constructor can do this out of the box, we can pass in a list of dataframes instead of just one. If we&#x27;re constructing a chain ourselves, we can do something like:

```python
df_1 = df[["Age", "Fare"]]
df_2 = df[["Fare", "Survived"]]

tool = PythonAstREPLTool(locals={"df_1": df_1, "df_2": df_2})
llm_with_tool = llm.bind_tools(tools=[tool], tool_choice=tool.name)
df_template = """\`\`\`python
{df_name}.head().to_markdown()
>>> {df_head}
\`\`\`"""
df_context = "\n\n".join(
    df_template.format(df_head=_df.head().to_markdown(), df_name=df_name)
    for _df, df_name in [(df_1, "df_1"), (df_2, "df_2")]
)

system = f"""You have access to a number of pandas dataframes. \
Here is a sample of rows from each dataframe and the python code that was used to generate the sample:

{df_context}

Given a user question about the dataframes, write the Python code to answer it. \
Don&#x27;t assume you have access to any libraries other than built-in Python ones and pandas. \
Make sure to refer only to the variables mentioned above."""
prompt = ChatPromptTemplate.from_messages([("system", system), ("human", "{question}")])

chain = prompt | llm_with_tool | parser | tool
chain.invoke(
    {
        "question": "return the difference in the correlation between age and fare and the correlation between fare and survival"
    }
)

```

```output
0.14384991262954416

``` Here&#x27;s the LangSmith trace for this run: [https://smith.langchain.com/public/cc2a7d7f-7c5a-4e77-a10c-7b5420fcd07f/r](https://smith.langchain.com/public/cc2a7d7f-7c5a-4e77-a10c-7b5420fcd07f/r)

### Sandboxed code execution[​](#sandboxed-code-execution)

There are a number of tools like [E2B](/docs/integrations/tools/e2b_data_analysis/) and [Bearly](/docs/integrations/tools/bearly/) that provide sandboxed environments for Python code execution, to allow for safer code-executing chains and agents.

## Next steps[​](#next-steps)

For more advanced data analysis applications we recommend checking out:

- [SQL tutorial](/docs/tutorials/sql_qa/): Many of the challenges of working with SQL db&#x27;s and CSV&#x27;s are generic to any structured data type, so it&#x27;s useful to read the SQL techniques even if you&#x27;re using Pandas for CSV data analysis.

- [Tool use](/docs/how_to/tool_calling/): Guides on general best practices when working with chains and agents that invoke tools

- [Agents](/docs/tutorials/agents/): Understand the fundamentals of building LLM agents.

- Integrations: Sandboxed envs like [E2B](/docs/integrations/tools/e2b_data_analysis/) and [Bearly](/docs/integrations/tools/bearly/), utilities like [SQLDatabase](https://python.langchain.com/api_reference/community/utilities/langchain_community.utilities.sql_database.SQLDatabase.html#langchain_community.utilities.sql_database.SQLDatabase), related agents like [Spark DataFrame agent](/docs/integrations/tools/spark_sql/).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/sql_csv.ipynb)

- [⚠️ Security note ⚠️](#️-security-note-️)
- [Setup](#setup)
- [SQL](#sql)
- [Pandas](#pandas)[Chain](#chain)
- [Agent](#agent)
- [Multiple CSVs](#multiple-csvs)
- [Sandboxed code execution](#sandboxed-code-execution)

- [Next steps](#next-steps)

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