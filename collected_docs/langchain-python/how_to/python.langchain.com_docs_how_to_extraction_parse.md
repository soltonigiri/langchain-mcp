How to use prompting alone (no tool calling) to do extraction | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/extraction_parse.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/extraction_parse.ipynb)How to use prompting alone (no tool calling) to do extraction [Tool calling](/docs/concepts/tool_calling/) features are not required for generating structured output from LLMs. LLMs that are able to follow prompt instructions well can be tasked with outputting information in a given format. This approach relies on designing good prompts and then parsing the output of the LLMs to make them extract information well. To extract data without tool-calling features: Instruct the LLM to generate text following an expected format (e.g., JSON with a certain schema); Use [output parsers](/docs/concepts/output_parsers/) to structure the model response into a desired Python object. First we select a LLM: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

``` tipThis tutorial is meant to be simple, but generally should really include reference examples to squeeze out performance! Using PydanticOutputParser[​](#using-pydanticoutputparser) The following example uses the built-in PydanticOutputParser to parse the output of a chat model.

```python
from typing import List, Optional

from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field, validator

class Person(BaseModel):
    """Information about a person."""

    name: str = Field(..., description="The name of the person")
    height_in_meters: float = Field(
        ..., description="The height of the person expressed in meters."
    )

class People(BaseModel):
    """Identifying information about all people in a text."""

    people: List[Person]

# Set up a parser
parser = PydanticOutputParser(pydantic_object=People)

# Prompt
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Answer the user query. Wrap the output in `json` tags\n{format_instructions}",
        ),
        ("human", "{query}"),
    ]
).partial(format_instructions=parser.get_format_instructions())

```API Reference:**[PydanticOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.pydantic.PydanticOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) Let&#x27;s take a look at what information is sent to the model

```python
query = "Anna is 23 years old and she is 6 feet tall"

```**

```python
print(prompt.format_prompt(query=query).to_string())

```

```output
System: Answer the user query. Wrap the output in `json` tags
The output should be formatted as a JSON instance that conforms to the JSON schema below.

As an example, for the schema {"properties": {"foo": {"title": "Foo", "description": "a list of strings", "type": "array", "items": {"type": "string"}}}, "required": ["foo"]}
the object {"foo": ["bar", "baz"]} is a well-formatted instance of the schema. The object {"properties": {"foo": ["bar", "baz"]}} is not well-formatted.

Here is the output schema:
\`\`\`
{"$defs": {"Person": {"description": "Information about a person.", "properties": {"name": {"description": "The name of the person", "title": "Name", "type": "string"}, "height_in_meters": {"description": "The height of the person expressed in meters.", "title": "Height In Meters", "type": "number"}}, "required": ["name", "height_in_meters"], "title": "Person", "type": "object"}}, "description": "Identifying information about all people in a text.", "properties": {"people": {"items": {"$ref": "#/$defs/Person"}, "title": "People", "type": "array"}}, "required": ["people"]}
\`\`\`
Human: Anna is 23 years old and she is 6 feet tall

``` Having defined our prompt, we simply chain together the prompt, model and output parser:

```python
chain = prompt | model | parser
chain.invoke({"query": query})

```

```output
People(people=[Person(name=&#x27;Anna&#x27;, height_in_meters=1.8288)])

``` Check out the associated [Langsmith trace](https://smith.langchain.com/public/92ed52a3-92b9-45af-a663-0a9c00e5e396/r). Note that the schema shows up in two places: In the prompt, via parser.get_format_instructions(); In the chain, to receive the formatted output and structure it into a Python object (in this case, the Pydantic object People). Custom Parsing[​](#custom-parsing) If desired, it&#x27;s easy to create a custom prompt and parser with LangChain and LCEL. To create a custom parser, define a function to parse the output from the model (typically an [AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html)) into an object of your choice. See below for a simple implementation of a JSON parser.

```python
import json
import re
from typing import List, Optional

from langchain_anthropic.chat_models import ChatAnthropic
from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field, validator

class Person(BaseModel):
    """Information about a person."""

    name: str = Field(..., description="The name of the person")
    height_in_meters: float = Field(
        ..., description="The height of the person expressed in meters."
    )

class People(BaseModel):
    """Identifying information about all people in a text."""

    people: List[Person]

# Prompt
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Answer the user query. Output your answer as JSON that  "
            "matches the given schema: \`\`\`json\n{schema}\n\`\`\`. "
            "Make sure to wrap the answer in \`\`\`json and \`\`\` tags",
        ),
        ("human", "{query}"),
    ]
).partial(schema=People.schema())

# Custom parser
def extract_json(message: AIMessage) -> List[dict]:
    """Extracts JSON content from a string where JSON is embedded between \`\`\`json and \`\`\` tags.

    Parameters:
        text (str): The text containing the JSON content.

    Returns:
        list: A list of extracted JSON strings.
    """
    text = message.content
    # Define the regular expression pattern to match JSON blocks
    pattern = r"\`\`\`json(.*?)\`\`\`"

    # Find all non-overlapping matches of the pattern in the string
    matches = re.findall(pattern, text, re.DOTALL)

    # Return the list of matched JSON strings, stripping any leading or trailing whitespace
    try:
        return [json.loads(match.strip()) for match in matches]
    except Exception:
        raise ValueError(f"Failed to parse: {message}")

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```python
query = "Anna is 23 years old and she is 6 feet tall"
print(prompt.format_prompt(query=query).to_string())

```

```output
System: Answer the user query. Output your answer as JSON that  matches the given schema: \`\`\`json
{&#x27;$defs&#x27;: {&#x27;Person&#x27;: {&#x27;description&#x27;: &#x27;Information about a person.&#x27;, &#x27;properties&#x27;: {&#x27;name&#x27;: {&#x27;description&#x27;: &#x27;The name of the person&#x27;, &#x27;title&#x27;: &#x27;Name&#x27;, &#x27;type&#x27;: &#x27;string&#x27;}, &#x27;height_in_meters&#x27;: {&#x27;description&#x27;: &#x27;The height of the person expressed in meters.&#x27;, &#x27;title&#x27;: &#x27;Height In Meters&#x27;, &#x27;type&#x27;: &#x27;number&#x27;}}, &#x27;required&#x27;: [&#x27;name&#x27;, &#x27;height_in_meters&#x27;], &#x27;title&#x27;: &#x27;Person&#x27;, &#x27;type&#x27;: &#x27;object&#x27;}}, &#x27;description&#x27;: &#x27;Identifying information about all people in a text.&#x27;, &#x27;properties&#x27;: {&#x27;people&#x27;: {&#x27;items&#x27;: {&#x27;$ref&#x27;: &#x27;#/$defs/Person&#x27;}, &#x27;title&#x27;: &#x27;People&#x27;, &#x27;type&#x27;: &#x27;array&#x27;}}, &#x27;required&#x27;: [&#x27;people&#x27;], &#x27;title&#x27;: &#x27;People&#x27;, &#x27;type&#x27;: &#x27;object&#x27;}
\`\`\`. Make sure to wrap the answer in \`\`\`json and \`\`\` tags
Human: Anna is 23 years old and she is 6 feet tall

```

```python
chain = prompt | model | extract_json
chain.invoke({"query": query})

```

```output
[{&#x27;people&#x27;: [{&#x27;name&#x27;: &#x27;Anna&#x27;, &#x27;height_in_meters&#x27;: 1.83}]}]

``` ## Other Libraries[​](#other-libraries) If you&#x27;re looking at extracting using a parsing approach, check out the [Kor](https://eyurtsev.github.io/kor/) library. It&#x27;s written by one of the LangChain maintainers and it helps to craft a prompt that takes examples into account, allows controlling formats (e.g., JSON or CSV) and expresses the schema in TypeScript. It seems to work pretty![Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/extraction_parse.ipynb)[Using PydanticOutputParser](#using-pydanticoutputparser)
- [Custom Parsing](#custom-parsing)
- [Other Libraries](#other-libraries)

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