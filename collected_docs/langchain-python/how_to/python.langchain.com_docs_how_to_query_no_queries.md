How to handle cases where no queries are generated | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/query_no_queries.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/query_no_queries.ipynb)How to handle cases where no queries are generated Sometimes, a query analysis technique may allow for any number of queries to be generated - including no queries! In this case, our overall chain will need to inspect the result of the query analysis before deciding whether to call the retriever or not. We will use mock data for this example. Setup[​](#setup) Install dependencies[​](#install-dependencies)

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
vectorstore = Chroma.from_texts(
    texts,
    embeddings,
)
retriever = vectorstore.as_retriever()

``` Query analysis[​](#query-analysis) We will use function calling to structure the output. However, we will configure the LLM such that is doesn&#x27;t NEED to call the function representing a search query (should it decide not to). We will also then use a prompt to do query analysis that explicitly lays when it should and shouldn&#x27;t make a search.

```python
from typing import Optional

from pydantic import BaseModel, Field

class Search(BaseModel):
    """Search over a database of job records."""

    query: str = Field(
        ...,
        description="Similarity search query applied to job record.",
    )

```

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

system = """You have the ability to issue search queries to get information to help answer user information.

You do not NEED to look things up. If you don&#x27;t need to, then just respond normally."""
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "{question}"),
    ]
)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
structured_llm = llm.bind_tools([Search])
query_analyzer = {"question": RunnablePassthrough()} | prompt | structured_llm

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) We can see that by invoking this we get an message that sometimes - but not always - returns a tool call.

```python
query_analyzer.invoke("where did Harrison Work")

```**

```output
AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_korLZrh08PTRL94f4L7rFqdj&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"query":"Harrison"}&#x27;, &#x27;name&#x27;: &#x27;Search&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 95, &#x27;total_tokens&#x27;: 109}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_483d39d857&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-ea94d376-37bf-4f80-abe6-e3b42b767ea0-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;Search&#x27;, &#x27;args&#x27;: {&#x27;query&#x27;: &#x27;Harrison&#x27;}, &#x27;id&#x27;: &#x27;call_korLZrh08PTRL94f4L7rFqdj&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 95, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 109})

```

```python
query_analyzer.invoke("hi!")

```

```output
AIMessage(content=&#x27;Hello! How can I assist you today?&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 10, &#x27;prompt_tokens&#x27;: 93, &#x27;total_tokens&#x27;: 103}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_483d39d857&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-ebdfc44a-455a-4ca6-be85-84559886b1e1-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 93, &#x27;output_tokens&#x27;: 10, &#x27;total_tokens&#x27;: 103})

``` Retrieval with query analysis[​](#retrieval-with-query-analysis) So how would we include this in a chain? Let&#x27;s look at an example below.

```python
from langchain_core.output_parsers.openai_tools import PydanticToolsParser
from langchain_core.runnables import chain

output_parser = PydanticToolsParser(tools=[Search])

```API Reference:**[PydanticToolsParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.openai_tools.PydanticToolsParser.html) | [chain](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.chain.html)

```python
@chain
def custom_chain(question):
    response = query_analyzer.invoke(question)
    if "tool_calls" in response.additional_kwargs:
        query = output_parser.invoke(response)
        docs = retriever.invoke(query[0].query)
        # Could add more logic - like another LLM call - here
        return docs
    else:
        return response

```

```python
custom_chain.invoke("where did Harrison Work")

```

```output
Number of requested results 4 is greater than number of elements in index 1, updating n_results = 1

```

```output
[Document(page_content=&#x27;Harrison worked at Kensho&#x27;)]

```

```python
custom_chain.invoke("hi!")

```

```output
AIMessage(content=&#x27;Hello! How can I assist you today?&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 10, &#x27;prompt_tokens&#x27;: 93, &#x27;total_tokens&#x27;: 103}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_483d39d857&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-e87f058d-30c0-4075-8a89-a01b982d557e-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 93, &#x27;output_tokens&#x27;: 10, &#x27;total_tokens&#x27;: 103})

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/query_no_queries.ipynb)[Setup](#setup)[Create Index](#create-index)

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