How to handle multiple queries when doing query analysis | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/query_multiple_queries.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/query_multiple_queries.ipynb)How to handle multiple queries when doing query analysis Sometimes, a query analysis technique may allow for multiple queries to be generated. In these cases, we need to remember to run all queries and then to combine the results. We will show a simple example (using mock data) of how to do that. Setup[​](#setup) Install dependencies[​](#install-dependencies)

```python
%pip install -qU langchain langchain-community langchain-openai langchain-chroma

```

```output
Note: you may need to restart the kernel to use updated packages.

``` Set environment variables[​](#set-environment-variables) We&#x27;ll use OpenAI in this example:

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass()

# Optional, uncomment to trace runs with LangSmith. Sign up here: https://smith.langchain.com.
# os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` Create Index[​](#create-index) We will create a vectorstore over fake information.

```python
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

texts = ["Harrison worked at Kensho", "Ankush worked at Facebook"]
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_texts(
    texts,
    embeddings,
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 1})

``` Query analysis[​](#query-analysis) We will use function calling to structure the output. We will let it return multiple queries.

```python
from typing import List, Optional

from pydantic import BaseModel, Field

class Search(BaseModel):
    """Search over a database of job records."""

    queries: List[str] = Field(
        ...,
        description="Distinct queries to search for",
    )

```

```python
from langchain_core.output_parsers.openai_tools import PydanticToolsParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

output_parser = PydanticToolsParser(tools=[Search])

system = """You have the ability to issue search queries to get information to help answer user information.

If you need to look up two distinct pieces of information, you are allowed to do that!"""
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "{question}"),
    ]
)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
structured_llm = llm.with_structured_output(Search)
query_analyzer = {"question": RunnablePassthrough()} | prompt | structured_llm

```API Reference:**[PydanticToolsParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.openai_tools.PydanticToolsParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) We can see that this allows for creating multiple queries

```python
query_analyzer.invoke("where did Harrison Work")

```**

```output
Search(queries=[&#x27;Harrison Work&#x27;, &#x27;Harrison employment history&#x27;])

```

```python
query_analyzer.invoke("where did Harrison and ankush Work")

```

```output
Search(queries=[&#x27;Harrison work history&#x27;, &#x27;Ankush work history&#x27;])

``` Retrieval with query analysis[​](#retrieval-with-query-analysis) So how would we include this in a chain? One thing that will make this a lot easier is if we call our retriever asynchronously - this will let us loop over the queries and not get blocked on the response time.

```python
from langchain_core.runnables import chain

```API Reference:**[chain](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.chain.html)

```python
@chain
async def custom_chain(question):
    response = await query_analyzer.ainvoke(question)
    docs = []
    for query in response.queries:
        new_docs = await retriever.ainvoke(query)
        docs.extend(new_docs)
    # You probably want to think about reranking or deduplicating documents here
    # But that is a separate topic
    return docs

```

```python
await custom_chain.ainvoke("where did Harrison Work")

```

```output
[Document(page_content=&#x27;Harrison worked at Kensho&#x27;),
 Document(page_content=&#x27;Harrison worked at Kensho&#x27;)]

```

```python
await custom_chain.ainvoke("where did Harrison and ankush Work")

```

```output
[Document(page_content=&#x27;Harrison worked at Kensho&#x27;),
 Document(page_content=&#x27;Ankush worked at Facebook&#x27;)]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/query_multiple_queries.ipynb)[Setup](#setup)[Create Index](#create-index)

- [Query analysis](#query-analysis)
- [Retrieval with query analysis](#retrieval-with-query-analysis)

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