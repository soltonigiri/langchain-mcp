How to parse JSON output | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_json.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_json.ipynb)How to parse JSON output PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) [Output parsers](/docs/concepts/output_parsers/) [Prompt templates](/docs/concepts/prompt_templates/) [Structured output](/docs/how_to/structured_output/) [Chaining runnables together](/docs/how_to/sequence/) While some model providers support [built-in ways to return structured output](/docs/how_to/structured_output/), not all do. We can use an output parser to help users to specify an arbitrary JSON schema via the prompt, query a model for outputs that conform to that schema, and finally parse that schema as JSON. noteKeep in mind that large language models are leaky abstractions! You&#x27;ll have to use an LLM with sufficient capacity to generate well-formed JSON. The [JsonOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.json.JsonOutputParser.html) is one built-in option for prompting for and then parsing JSON output. While it is similar in functionality to the [PydanticOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.pydantic.PydanticOutputParser.html), it also supports streaming back partial JSON objects. Here&#x27;s an example of how it can be used alongside [Pydantic](https://docs.pydantic.dev/) to conveniently declare the expected schema:

```python
%pip install -qU langchain langchain-openai

import os
from getpass import getpass

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()

```

```python
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

model = ChatOpenAI(temperature=0)

# Define your desired data structure.
class Joke(BaseModel):
    setup: str = Field(description="question to set up a joke")
    punchline: str = Field(description="answer to resolve the joke")

# And a query intented to prompt a language model to populate the data structure.
joke_query = "Tell me a joke."

# Set up a parser + inject instructions into the prompt template.
parser = JsonOutputParser(pydantic_object=Joke)

prompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

chain = prompt | model | parser

chain.invoke({"query": joke_query})

```API Reference:**[JsonOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.json.JsonOutputParser.html) | [PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```output
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself?",
 &#x27;punchline&#x27;: &#x27;Because it was two tired!&#x27;}

``` Note that we are passing format_instructions from the parser directly into the prompt. You can and should experiment with adding your own formatting hints in the other parts of your prompt to either augment or replace the default instructions:

```python
parser.get_format_instructions()

```

```output
&#x27;The output should be formatted as a JSON instance that conforms to the JSON schema below.\n\nAs an example, for the schema {"properties": {"foo": {"title": "Foo", "description": "a list of strings", "type": "array", "items": {"type": "string"}}}, "required": ["foo"]}\nthe object {"foo": ["bar", "baz"]} is a well-formatted instance of the schema. The object {"properties": {"foo": ["bar", "baz"]}} is not well-formatted.\n\nHere is the output schema:\n\`\`\`\n{"properties": {"setup": {"title": "Setup", "description": "question to set up a joke", "type": "string"}, "punchline": {"title": "Punchline", "description": "answer to resolve the joke", "type": "string"}}, "required": ["setup", "punchline"]}\n\`\`\`&#x27;

``` ## Streaming[​](#streaming) As mentioned above, a key difference between the JsonOutputParser and the PydanticOutputParser is that the JsonOutputParser output parser supports streaming partial chunks. Here&#x27;s what that looks like:

```python
for s in chain.stream({"query": joke_query}):
    print(s)

```

```output
{}
{&#x27;setup&#x27;: &#x27;&#x27;}
{&#x27;setup&#x27;: &#x27;Why&#x27;}
{&#x27;setup&#x27;: &#x27;Why couldn&#x27;}
{&#x27;setup&#x27;: "Why couldn&#x27;t"}
{&#x27;setup&#x27;: "Why couldn&#x27;t the"}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle"}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand"}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up"}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by"}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself"}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself?"}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself?", &#x27;punchline&#x27;: &#x27;&#x27;}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself?", &#x27;punchline&#x27;: &#x27;Because&#x27;}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself?", &#x27;punchline&#x27;: &#x27;Because it&#x27;}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself?", &#x27;punchline&#x27;: &#x27;Because it was&#x27;}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself?", &#x27;punchline&#x27;: &#x27;Because it was two&#x27;}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself?", &#x27;punchline&#x27;: &#x27;Because it was two tired&#x27;}
{&#x27;setup&#x27;: "Why couldn&#x27;t the bicycle stand up by itself?", &#x27;punchline&#x27;: &#x27;Because it was two tired!&#x27;}

``` ## Without Pydantic[​](#without-pydantic) You can also use the JsonOutputParser without Pydantic. This will prompt the model to return JSON, but doesn&#x27;t provide specifics about what the schema should be.

```python
joke_query = "Tell me a joke."

parser = JsonOutputParser()

prompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

chain = prompt | model | parser

chain.invoke({"query": joke_query})

```

```output
{&#x27;response&#x27;: "Sure! Here&#x27;s a joke for you: Why couldn&#x27;t the bicycle stand up by itself? Because it was two tired!"}

``` ## Next steps[​](#next-steps) You&#x27;ve now learned one way to prompt a model to return structured JSON. Next, check out the [broader guide on obtaining structured output](/docs/how_to/structured_output/) for other techniques.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/output_parser_json.ipynb)[Streaming](#streaming)
- [Without Pydantic](#without-pydantic)
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