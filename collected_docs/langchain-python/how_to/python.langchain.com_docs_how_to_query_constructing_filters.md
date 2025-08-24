How to construct filters for query analysis | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/query_constructing_filters.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/query_constructing_filters.ipynb) # How to construct filters for query analysis We may want to do query analysis to extract filters to pass into retrievers. One way we ask the LLM to represent these filters is as a Pydantic model. There is then the issue of converting that Pydantic model into a filter that can be passed into a retriever. This can be done manually, but LangChain also provides some "Translators" that are able to translate from a common syntax into filters specific to each retriever. Here, we will cover how to use those translators.

```python
from typing import Optional

from langchain.chains.query_constructor.ir import (
    Comparator,
    Comparison,
    Operation,
    Operator,
    StructuredQuery,
)
from langchain_community.query_constructors.chroma import ChromaTranslator
from langchain_community.query_constructors.elasticsearch import ElasticsearchTranslator
from pydantic import BaseModel

``` In this example, year and author are both attributes to filter on.

```python
class Search(BaseModel):
    query: str
    start_year: Optional[int]
    author: Optional[str]

```

```python
search_query = Search(query="RAG", start_year=2022, author="LangChain")

```

```python
def construct_comparisons(query: Search):
    comparisons = []
    if query.start_year is not None:
        comparisons.append(
            Comparison(
                comparator=Comparator.GT,
                attribute="start_year",
                value=query.start_year,
            )
        )
    if query.author is not None:
        comparisons.append(
            Comparison(
                comparator=Comparator.EQ,
                attribute="author",
                value=query.author,
            )
        )
    return comparisons

```

```python
comparisons = construct_comparisons(search_query)

```

```python
_filter = Operation(operator=Operator.AND, arguments=comparisons)

```

```python
ElasticsearchTranslator().visit_operation(_filter)

```

```output
{&#x27;bool&#x27;: {&#x27;must&#x27;: [{&#x27;range&#x27;: {&#x27;metadata.start_year&#x27;: {&#x27;gt&#x27;: 2022}}},
   {&#x27;term&#x27;: {&#x27;metadata.author.keyword&#x27;: &#x27;LangChain&#x27;}}]}}

```

```python
ChromaTranslator().visit_operation(_filter)

```

```output
{&#x27;$and&#x27;: [{&#x27;start_year&#x27;: {&#x27;$gt&#x27;: 2022}}, {&#x27;author&#x27;: {&#x27;$eq&#x27;: &#x27;LangChain&#x27;}}]}

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/query_constructing_filters.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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