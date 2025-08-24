How to use the output-fixing parser | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_fixing.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_fixing.ipynb)How to use the output-fixing parser This [output parser](/docs/concepts/output_parsers/) wraps another output parser, and in the event that the first one fails it calls out to another LLM to fix any errors. But we can do other things besides throw errors. Specifically, we can pass the misformatted output, along with the formatted instructions, to the model and ask it to fix it. For this example, we&#x27;ll use the above Pydantic output parser. Here&#x27;s what happens if we pass it a result that does not comply with the schema:

```python
from typing import List

from langchain_core.exceptions import OutputParserException
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

```API Reference:**[OutputParserException](https://python.langchain.com/api_reference/core/exceptions/langchain_core.exceptions.OutputParserException.html) | [PydanticOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.pydantic.PydanticOutputParser.html)

```python
class Actor(BaseModel):
    name: str = Field(description="name of an actor")
    film_names: List[str] = Field(description="list of names of films they starred in")

actor_query = "Generate the filmography for a random actor."

parser = PydanticOutputParser(pydantic_object=Actor)

```

```python
misformatted = "{&#x27;name&#x27;: &#x27;Tom Hanks&#x27;, &#x27;film_names&#x27;: [&#x27;Forrest Gump&#x27;]}"

```

```python
try:
    parser.parse(misformatted)
except OutputParserException as e:
    print(e)

```

```output
Invalid json output: {&#x27;name&#x27;: &#x27;Tom Hanks&#x27;, &#x27;film_names&#x27;: [&#x27;Forrest Gump&#x27;]}
For troubleshooting, visit: https://python.langchain.com/docs/troubleshooting/errors/OUTPUT_PARSING_FAILURE

``` Now we can construct and use a OutputFixingParser. This output parser takes as an argument another output parser but also an LLM with which to try to correct any formatting mistakes.

```python
from langchain.output_parsers import OutputFixingParser

new_parser = OutputFixingParser.from_llm(parser=parser, llm=ChatOpenAI())

```

```python
new_parser.parse(misformatted)

```

```output
Actor(name=&#x27;Tom Hanks&#x27;, film_names=[&#x27;Forrest Gump&#x27;])

``` Find out api documentation for [OutputFixingParser](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.fix.OutputFixingParser.html#langchain.output_parsers.fix.OutputFixingParser).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/output_parser_fixing.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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