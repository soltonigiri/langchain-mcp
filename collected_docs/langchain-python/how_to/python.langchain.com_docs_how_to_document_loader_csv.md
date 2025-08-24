How to load CSVs | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_csv.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_csv.ipynb) # How to load CSVs A [comma-separated values (CSV)](https://en.wikipedia.org/wiki/Comma-separated_values) file is a delimited text file that uses a comma to separate values. Each line of the file is a data record. Each record consists of one or more fields, separated by commas. LangChain implements a [CSV Loader](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.csv_loader.CSVLoader.html) that will load CSV files into a sequence of [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html#langchain_core.documents.base.Document) objects. Each row of the CSV file is translated to one document.

```python
from langchain_community.document_loaders.csv_loader import CSVLoader

file_path = "../integrations/document_loaders/example_data/mlb_teams_2012.csv"

loader = CSVLoader(file_path=file_path)
data = loader.load()

for record in data[:2]:
    print(record)

```

```output
page_content=&#x27;Team: Nationals\n"Payroll (millions)": 81.34\n"Wins": 98&#x27; metadata={&#x27;source&#x27;: &#x27;../../../docs/integrations/document_loaders/example_data/mlb_teams_2012.csv&#x27;, &#x27;row&#x27;: 0}
page_content=&#x27;Team: Reds\n"Payroll (millions)": 82.20\n"Wins": 97&#x27; metadata={&#x27;source&#x27;: &#x27;../../../docs/integrations/document_loaders/example_data/mlb_teams_2012.csv&#x27;, &#x27;row&#x27;: 1}

``` ## Customizing the CSV parsing and loading[​](#customizing-the-csv-parsing-and-loading) CSVLoader will accept a csv_args kwarg that supports customization of arguments passed to Python&#x27;s csv.DictReader. See the [csv module](https://docs.python.org/3/library/csv.html) documentation for more information of what csv args are supported.

```python
loader = CSVLoader(
    file_path=file_path,
    csv_args={
        "delimiter": ",",
        "quotechar": &#x27;"&#x27;,
        "fieldnames": ["MLB Team", "Payroll in millions", "Wins"],
    },
)

data = loader.load()
for record in data[:2]:
    print(record)

```

```output
page_content=&#x27;MLB Team: Team\nPayroll in millions: "Payroll (millions)"\nWins: "Wins"&#x27; metadata={&#x27;source&#x27;: &#x27;../../../docs/integrations/document_loaders/example_data/mlb_teams_2012.csv&#x27;, &#x27;row&#x27;: 0}
page_content=&#x27;MLB Team: Nationals\nPayroll in millions: 81.34\nWins: 98&#x27; metadata={&#x27;source&#x27;: &#x27;../../../docs/integrations/document_loaders/example_data/mlb_teams_2012.csv&#x27;, &#x27;row&#x27;: 1}

``` ## Specify a column to identify the document source[​](#specify-a-column-to-identify-the-document-source) The "source" key on [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html#langchain_core.documents.base.Document) metadata can be set using a column of the CSV. Use the source_column argument to specify a source for the document created from each row. Otherwise file_path will be used as the source for all documents created from the CSV file. This is useful when using documents loaded from CSV files for chains that answer questions using sources.

```python
loader = CSVLoader(file_path=file_path, source_column="Team")

data = loader.load()
for record in data[:2]:
    print(record)

```

```output
page_content=&#x27;Team: Nationals\n"Payroll (millions)": 81.34\n"Wins": 98&#x27; metadata={&#x27;source&#x27;: &#x27;Nationals&#x27;, &#x27;row&#x27;: 0}
page_content=&#x27;Team: Reds\n"Payroll (millions)": 82.20\n"Wins": 97&#x27; metadata={&#x27;source&#x27;: &#x27;Reds&#x27;, &#x27;row&#x27;: 1}

``` ## Load from a string[​](#load-from-a-string) Python&#x27;s tempfile can be used when working with CSV strings directly.

```python
import tempfile
from io import StringIO

string_data = """
"Team", "Payroll (millions)", "Wins"
"Nationals",     81.34, 98
"Reds",          82.20, 97
"Yankees",      197.96, 95
"Giants",       117.62, 94
""".strip()

with tempfile.NamedTemporaryFile(delete=False, mode="w+") as temp_file:
    temp_file.write(string_data)
    temp_file_path = temp_file.name

loader = CSVLoader(file_path=temp_file_path)
data = loader.load()
for record in data[:2]:
    print(record)

```

```output
page_content=&#x27;Team: Nationals\n"Payroll (millions)": 81.34\n"Wins": 98&#x27; metadata={&#x27;source&#x27;: &#x27;Nationals&#x27;, &#x27;row&#x27;: 0}
page_content=&#x27;Team: Reds\n"Payroll (millions)": 82.20\n"Wins": 97&#x27; metadata={&#x27;source&#x27;: &#x27;Reds&#x27;, &#x27;row&#x27;: 1}

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/document_loader_csv.ipynb)[Customizing the CSV parsing and loading](#customizing-the-csv-parsing-and-loading)
- [Specify a column to identify the document source](#specify-a-column-to-identify-the-document-source)
- [Load from a string](#load-from-a-string)

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