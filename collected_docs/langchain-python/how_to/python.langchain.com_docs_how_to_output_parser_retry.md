How to retry when a parsing error occurs | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_retry.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_retry.ipynb)How to retry when a parsing error occurs While in some cases it is possible to fix any parsing mistakes by only looking at the output, in other cases it isn&#x27;t. An example of this is when the output is not just in the incorrect format, but is partially complete. Consider the below example.

```python
from langchain.output_parsers import OutputFixingParser
from langchain_core.exceptions import OutputParserException
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI, OpenAI
from pydantic import BaseModel, Field

```API Reference:**[OutputParserException](https://python.langchain.com/api_reference/core/exceptions/langchain_core.exceptions.OutputParserException.html) | [PydanticOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.pydantic.PydanticOutputParser.html) | [PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```python
template = """Based on the user question, provide an Action and Action Input for what step should be taken.
{format_instructions}
Question: {query}
Response:"""

class Action(BaseModel):
    action: str = Field(description="action to take")
    action_input: str = Field(description="input to the action")

parser = PydanticOutputParser(pydantic_object=Action)

```**

```python
prompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

```

```python
prompt_value = prompt.format_prompt(query="who is leo di caprios gf?")

```

```python
bad_response = &#x27;{"action": "search"}&#x27;

``` If we try to parse this response as is, we will get an error:

```python
try:
    parser.parse(bad_response)
except OutputParserException as e:
    print(e)

```

```output
Failed to parse Action from completion {"action": "search"}. Got: 1 validation error for Action
action_input
  Field required [type=missing, input_value={&#x27;action&#x27;: &#x27;search&#x27;}, input_type=dict]
    For further information visit https://errors.pydantic.dev/2.9/v/missing
For troubleshooting, visit: https://python.langchain.com/docs/troubleshooting/errors/OUTPUT_PARSING_FAILURE

``` If we try to use the OutputFixingParser to fix this error, it will be confused - namely, it doesn&#x27;t know what to actually put for action input.

```python
fix_parser = OutputFixingParser.from_llm(parser=parser, llm=ChatOpenAI())

```

```python
fix_parser.parse(bad_response)

```

```output
Action(action=&#x27;search&#x27;, action_input=&#x27;input&#x27;)

``` Instead, we can use the RetryOutputParser, which passes in the prompt (as well as the original output) to try again to get a better response.

```python
from langchain.output_parsers import RetryOutputParser

```

```python
retry_parser = RetryOutputParser.from_llm(parser=parser, llm=OpenAI(temperature=0))

```

```python
retry_parser.parse_with_prompt(bad_response, prompt_value)

```

```output
Action(action=&#x27;search&#x27;, action_input=&#x27;leo di caprio girlfriend&#x27;)

``` We can also add the RetryOutputParser easily with a custom chain which transform the raw LLM/ChatModel output into a more workable format.

```python
from langchain_core.runnables import RunnableLambda, RunnableParallel

completion_chain = prompt | OpenAI(temperature=0)

main_chain = RunnableParallel(
    completion=completion_chain, prompt_value=prompt
) | RunnableLambda(lambda x: retry_parser.parse_with_prompt(**x))

main_chain.invoke({"query": "who is leo di caprios gf?"})

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
Action(action=&#x27;search&#x27;, action_input=&#x27;leo di caprio girlfriend&#x27;)

``` Find out api documentation for [RetryOutputParser](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.retry.RetryOutputParser.html#langchain.output_parsers.retry.RetryOutputParser).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/output_parser_retry.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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