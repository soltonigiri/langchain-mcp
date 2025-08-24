How to parse YAML output | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_yaml.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_yaml.ipynb)How to parse YAML output PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) [Output parsers](/docs/concepts/output_parsers/) [Prompt templates](/docs/concepts/prompt_templates/) [Structured output](/docs/how_to/structured_output/) [Chaining runnables together](/docs/how_to/sequence/) LLMs from different providers often have different strengths depending on the specific data they are trained on. This also means that some may be "better" and more reliable at generating output in formats other than JSON. This output parser allows users to specify an arbitrary schema and query LLMs for outputs that conform to that schema, using YAML to format their response. noteKeep in mind that large language models are leaky abstractions! You&#x27;ll have to use an LLM with sufficient capacity to generate well-formed YAML.

```python
%pip install -qU langchain langchain-openai

import os
from getpass import getpass

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()

``` We use [Pydantic](https://docs.pydantic.dev) with the [YamlOutputParser](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.yaml.YamlOutputParser.html#langchain.output_parsers.yaml.YamlOutputParser) to declare our data model and give the model more context as to what type of YAML it should generate:

```python
from langchain.output_parsers import YamlOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

# Define your desired data structure.
class Joke(BaseModel):
    setup: str = Field(description="question to set up a joke")
    punchline: str = Field(description="answer to resolve the joke")

model = ChatOpenAI(temperature=0)

# And a query intented to prompt a language model to populate the data structure.
joke_query = "Tell me a joke."

# Set up a parser + inject instructions into the prompt template.
parser = YamlOutputParser(pydantic_object=Joke)

prompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

chain = prompt | model | parser

chain.invoke({"query": joke_query})

```API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```output
Joke(setup="Why couldn&#x27;t the bicycle find its way home?", punchline=&#x27;Because it lost its bearings!&#x27;)

``` The parser will automatically parse the output YAML and create a Pydantic model with the data. We can see the parser&#x27;s format_instructions, which get added to the prompt:

```python
parser.get_format_instructions()

```

```output
&#x27;The output should be formatted as a YAML instance that conforms to the given JSON schema below.\n\n# Examples\n## Schema\n\`\`\`\n{"title": "Players", "description": "A list of players", "type": "array", "items": {"$ref": "#/definitions/Player"}, "definitions": {"Player": {"title": "Player", "type": "object", "properties": {"name": {"title": "Name", "description": "Player name", "type": "string"}, "avg": {"title": "Avg", "description": "Batting average", "type": "number"}}, "required": ["name", "avg"]}}}\n\`\`\`\n## Well formatted instance\n\`\`\`\n- name: John Doe\n  avg: 0.3\n- name: Jane Maxfield\n  avg: 1.4\n\`\`\`\n\n## Schema\n\`\`\`\n{"properties": {"habit": { "description": "A common daily habit", "type": "string" }, "sustainable_alternative": { "description": "An environmentally friendly alternative to the habit", "type": "string"}}, "required": ["habit", "sustainable_alternative"]}\n\`\`\`\n## Well formatted instance\n\`\`\`\nhabit: Using disposable water bottles for daily hydration.\nsustainable_alternative: Switch to a reusable water bottle to reduce plastic waste and decrease your environmental footprint.\n\`\`\` \n\nPlease follow the standard YAML formatting conventions with an indent of 2 spaces and make sure that the data types adhere strictly to the following JSON schema: \n\`\`\`\n{"properties": {"setup": {"title": "Setup", "description": "question to set up a joke", "type": "string"}, "punchline": {"title": "Punchline", "description": "answer to resolve the joke", "type": "string"}}, "required": ["setup", "punchline"]}\n\`\`\`\n\nMake sure to always enclose the YAML output in triple backticks (\`\`\`). Please do not add anything other than valid YAML output!&#x27;

``` You can and should experiment with adding your own formatting hints in the other parts of your prompt to either augment or replace the default instructions. ## Next steps[​](#next-steps) You&#x27;ve now learned how to prompt a model to return YAML. Next, check out the [broader guide on obtaining structured output](/docs/how_to/structured_output/) for other related techniques.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/output_parser_yaml.ipynb)[Next steps](#next-steps)

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