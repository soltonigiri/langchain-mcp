How to use output parsers to parse an LLM response into structured format | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_structured.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_structured.ipynb)How to use output parsers to parse an LLM response into structured format Language models output text. But there are times where you want to get more structured information than just text back. While some model providers support [built-in ways to return structured output](/docs/how_to/structured_output/), not all do. [Output parsers](/docs/concepts/output_parsers/) are classes that help structure language model responses. There are two main methods an output parser must implement: "Get format instructions": A method which returns a string containing instructions for how the output of a language model should be formatted. "Parse": A method which takes in a string (assumed to be the response from a language model) and parses it into some structure. And then one optional one: "Parse with prompt": A method which takes in a string (assumed to be the response from a language model) and a prompt (assumed to be the prompt that generated such a response) and parses it into some structure. The prompt is largely provided in the event the OutputParser wants to retry or fix the output in some way, and needs information from the prompt to do so. Get started[​](#get-started) Below we go over the main type of output parser, the PydanticOutputParser.

```python
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
from pydantic import BaseModel, Field, model_validator

model = OpenAI(model_name="gpt-3.5-turbo-instruct", temperature=0.0)

# Define your desired data structure.
class Joke(BaseModel):
    setup: str = Field(description="question to set up a joke")
    punchline: str = Field(description="answer to resolve the joke")

    # You can add custom validation logic easily with Pydantic.
    @model_validator(mode="before")
    @classmethod
    def question_ends_with_question_mark(cls, values: dict) -> dict:
        setup = values.get("setup")
        if setup and setup[-1] != "?":
            raise ValueError("Badly formed question!")
        return values

# Set up a parser + inject instructions into the prompt template.
parser = PydanticOutputParser(pydantic_object=Joke)

prompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

# And a query intended to prompt a language model to populate the data structure.
prompt_and_model = prompt | model
output = prompt_and_model.invoke({"query": "Tell me a joke."})
parser.invoke(output)

```API Reference:**[PydanticOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.pydantic.PydanticOutputParser.html) | [PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```output
Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because it saw the salad dressing!&#x27;)

``` ## LCEL[​](#lcel) Output parsers implement the [Runnable interface](/docs/concepts/runnables/), the basic building block of the [LangChain Expression Language (LCEL)](/docs/concepts/lcel/). This means they support invoke, ainvoke, stream, astream, batch, abatch, astream_log calls. Output parsers accept a string or BaseMessage as input and can return an arbitrary type.

```python
parser.invoke(output)

```

```output
Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because it saw the salad dressing!&#x27;)

``` Instead of manually invoking the parser, we also could&#x27;ve just added it to our Runnable sequence:

```python
chain = prompt | model | parser
chain.invoke({"query": "Tell me a joke."})

```

```output
Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because it saw the salad dressing!&#x27;)

``` While all parsers support the streaming interface, only certain parsers can stream through partially parsed objects, since this is highly dependent on the output type. Parsers which cannot construct partial objects will simply yield the fully parsed output. The SimpleJsonOutputParser for example can stream through partial outputs:

```python
from langchain.output_parsers.json import SimpleJsonOutputParser

json_prompt = PromptTemplate.from_template(
    "Return a JSON object with an `answer` key that answers the following question: {question}"
)
json_parser = SimpleJsonOutputParser()
json_chain = json_prompt | model | json_parser

```

```python
list(json_chain.stream({"question": "Who invented the microscope?"}))

```

```output
[{},
 {&#x27;answer&#x27;: &#x27;&#x27;},
 {&#x27;answer&#x27;: &#x27;Ant&#x27;},
 {&#x27;answer&#x27;: &#x27;Anton&#x27;},
 {&#x27;answer&#x27;: &#x27;Antonie&#x27;},
 {&#x27;answer&#x27;: &#x27;Antonie van&#x27;},
 {&#x27;answer&#x27;: &#x27;Antonie van Lee&#x27;},
 {&#x27;answer&#x27;: &#x27;Antonie van Leeu&#x27;},
 {&#x27;answer&#x27;: &#x27;Antonie van Leeuwen&#x27;},
 {&#x27;answer&#x27;: &#x27;Antonie van Leeuwenho&#x27;},
 {&#x27;answer&#x27;: &#x27;Antonie van Leeuwenhoek&#x27;}]

``` Similarly,for PydanticOutputParser:

```python
list(chain.stream({"query": "Tell me a joke."}))

```

```output
[Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;&#x27;),
 Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because&#x27;),
 Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because it&#x27;),
 Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because it saw&#x27;),
 Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because it saw the&#x27;),
 Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because it saw the salad&#x27;),
 Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because it saw the salad dressing&#x27;),
 Joke(setup=&#x27;Why did the tomato turn red?&#x27;, punchline=&#x27;Because it saw the salad dressing!&#x27;)]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/output_parser_structured.ipynb)[Get started](#get-started)
- [LCEL](#lcel)

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