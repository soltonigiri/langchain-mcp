How to handle multiple retrievers when doing query analysis | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/query_multiple_retrievers.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/query_multiple_retrievers.ipynb)How to handle multiple retrievers when doing query analysis Sometimes, a query analysis technique may allow for selection of which [retriever](/docs/concepts/retrievers/) to use. To use this, you will need to add some logic to select the retriever to do. We will show a simple example (using mock data) of how to do that. Setup[​](#setup) Install dependencies[​](#install-dependencies)

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

texts = ["Harrison worked at Kensho"]
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_texts(texts, embeddings, collection_name="harrison")
retriever_harrison = vectorstore.as_retriever(search_kwargs={"k": 1})

texts = ["Ankush worked at Facebook"]
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_texts(texts, embeddings, collection_name="ankush")
retriever_ankush = vectorstore.as_retriever(search_kwargs={"k": 1})

``` Query analysis[​](#query-analysis) We will use function calling to structure the output. We will let it return multiple queries.

```python
from typing import List, Optional

from pydantic import BaseModel, Field

class Search(BaseModel):
    """Search for information about a person."""

    query: str = Field(
        ...,
        description="Query to look up",
    )
    person: str = Field(
        ...,
        description="Person to look things up for. Should be `HARRISON` or `ANKUSH`.",
    )

```

```python
from langchain_core.output_parsers.openai_tools import PydanticToolsParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

output_parser = PydanticToolsParser(tools=[Search])

system = """You have the ability to issue search queries to get information to help answer user information."""
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "{question}"),
    ]
)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
structured_llm = llm.with_structured_output(Search)
query_analyzer = {"question": RunnablePassthrough()} | prompt | structured_llm

```API Reference:**[PydanticToolsParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.openai_tools.PydanticToolsParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) We can see that this allows for routing between retrievers

```python
query_analyzer.invoke("where did Harrison Work")

```**

```output
Search(query=&#x27;work history&#x27;, person=&#x27;HARRISON&#x27;)

```

```python
query_analyzer.invoke("where did ankush Work")

```

```output
Search(query=&#x27;work history&#x27;, person=&#x27;ANKUSH&#x27;)

``` Retrieval with query analysis[​](#retrieval-with-query-analysis) So how would we include this in a chain? We just need some simple logic to select the retriever and pass in the search query

```python
from langchain_core.runnables import chain

```API Reference:**[chain](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.chain.html)

```python
retrievers = {
    "HARRISON": retriever_harrison,
    "ANKUSH": retriever_ankush,
}

```

```python
@chain
def custom_chain(question):
    response = query_analyzer.invoke(question)
    retriever = retrievers[response.person]
    return retriever.invoke(response.query)

```

```python
custom_chain.invoke("where did Harrison Work")

```

```output
[Document(page_content=&#x27;Harrison worked at Kensho&#x27;)]

```

```python
custom_chain.invoke("where did ankush Work")

```

```output
[Document(page_content=&#x27;Ankush worked at Facebook&#x27;)]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/query_multiple_retrievers.ipynb)[Setup](#setup)[Create Index](#create-index)

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