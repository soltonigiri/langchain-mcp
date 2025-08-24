How to return structured data from a model | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/structured_output.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/structured_output.ipynb)How to return structured data from a model PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) [Function/tool calling](/docs/concepts/tool_calling/) It is often useful to have a model return output that matches a specific [schema](/docs/concepts/structured_outputs/). One common use-case is extracting data from text to insert into a database or use with some other downstream system. This guide covers a few strategies for getting structured outputs from a model. The .with_structured_output() method[​](#the-with_structured_output-method) Supported modelsYou can find a [list of models that support this method here](/docs/integrations/chat/). This is the easiest and most reliable way to get structured outputs. with_structured_output() is implemented for [models that provide native APIs for structuring outputs](/docs/integrations/chat/), like tool/function calling or JSON mode, and makes use of these capabilities under the hood. This method takes a schema as input which specifies the names, types, and descriptions of the desired output attributes. The method returns a model-like Runnable, except that instead of outputting strings or [messages](/docs/concepts/messages/) it outputs objects corresponding to the given schema. The schema can be specified as a TypedDict class, [JSON Schema](https://json-schema.org/) or a Pydantic class. If TypedDict or JSON Schema are used then a dictionary will be returned by the Runnable, and if a Pydantic class is used then a Pydantic object will be returned. As an example, let&#x27;s get a model to generate a joke and separate the setup from the punchline: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

``` Pydantic class[​](#pydantic-class) If we want the model to return a Pydantic object, we just need to pass in the desired Pydantic class. The key advantage of using Pydantic is that the model-generated output will be validated. Pydantic will raise an error if any required fields are missing or if any fields are of the wrong type.

```python
from typing import Optional

from pydantic import BaseModel, Field

# Pydantic
class Joke(BaseModel):
    """Joke to tell user."""

    setup: str = Field(description="The setup of the joke")
    punchline: str = Field(description="The punchline to the joke")
    rating: Optional[int] = Field(
        default=None, description="How funny the joke is, from 1 to 10"
    )

structured_llm = llm.with_structured_output(Joke)

structured_llm.invoke("Tell me a joke about cats")

```

```output
Joke(setup=&#x27;Why was the cat sitting on the computer?&#x27;, punchline=&#x27;Because it wanted to keep an eye on the mouse!&#x27;, rating=7)

``` tipBeyond just the structure of the Pydantic class, the name of the Pydantic class, the docstring, and the names and provided descriptions of parameters are very important. Most of the time with_structured_output is using a model&#x27;s function/tool calling API, and you can effectively think of all of this information as being added to the model prompt. TypedDict or JSON Schema[​](#typeddict-or-json-schema) If you don&#x27;t want to use Pydantic, explicitly don&#x27;t want validation of the arguments, or want to be able to stream the model outputs, you can define your schema using a TypedDict class. We can optionally use a special Annotated syntax supported by LangChain that allows you to specify the default value and description of a field. Note, the default value is not filled in automatically if the model doesn&#x27;t generate it, it is only used in defining the schema that is passed to the model. Requirements Core: langchain-core>=0.2.26 Typing extensions: It is highly recommended to import Annotated and TypedDict from typing_extensions instead of typing to ensure consistent behavior across Python versions.

```python
from typing import Optional

from typing_extensions import Annotated, TypedDict

# TypedDict
class Joke(TypedDict):
    """Joke to tell user."""

    setup: Annotated[str, ..., "The setup of the joke"]

    # Alternatively, we could have specified setup as:

    # setup: str                    # no default, no description
    # setup: Annotated[str, ...]    # no default, no description
    # setup: Annotated[str, "foo"]  # default, no description

    punchline: Annotated[str, ..., "The punchline of the joke"]
    rating: Annotated[Optional[int], None, "How funny the joke is, from 1 to 10"]

structured_llm = llm.with_structured_output(Joke)

structured_llm.invoke("Tell me a joke about cats")

```

```output
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;,
 &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the mouse!&#x27;,
 &#x27;rating&#x27;: 7}

``` Equivalently, we can pass in a [JSON Schema](https://json-schema.org/) dict. This requires no imports or classes and makes it very clear exactly how each parameter is documented, at the cost of being a bit more verbose.

```python
json_schema = {
    "title": "joke",
    "description": "Joke to tell user.",
    "type": "object",
    "properties": {
        "setup": {
            "type": "string",
            "description": "The setup of the joke",
        },
        "punchline": {
            "type": "string",
            "description": "The punchline to the joke",
        },
        "rating": {
            "type": "integer",
            "description": "How funny the joke is, from 1 to 10",
            "default": None,
        },
    },
    "required": ["setup", "punchline"],
}
structured_llm = llm.with_structured_output(json_schema)

structured_llm.invoke("Tell me a joke about cats")

```

```output
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;,
 &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the mouse!&#x27;,
 &#x27;rating&#x27;: 7}

``` Choosing between multiple schemas[​](#choosing-between-multiple-schemas) The simplest way to let the model choose from multiple schemas is to create a parent schema that has a Union-typed attribute. Using Pydantic[​](#using-pydantic)

```python
from typing import Union

class Joke(BaseModel):
    """Joke to tell user."""

    setup: str = Field(description="The setup of the joke")
    punchline: str = Field(description="The punchline to the joke")
    rating: Optional[int] = Field(
        default=None, description="How funny the joke is, from 1 to 10"
    )

class ConversationalResponse(BaseModel):
    """Respond in a conversational manner. Be kind and helpful."""

    response: str = Field(description="A conversational response to the user&#x27;s query")

class FinalResponse(BaseModel):
    final_output: Union[Joke, ConversationalResponse]

structured_llm = llm.with_structured_output(FinalResponse)

structured_llm.invoke("Tell me a joke about cats")

```

```output
FinalResponse(final_output=Joke(setup=&#x27;Why was the cat sitting on the computer?&#x27;, punchline=&#x27;Because it wanted to keep an eye on the mouse!&#x27;, rating=7))

```

```python
structured_llm.invoke("How are you today?")

```

```output
FinalResponse(final_output=ConversationalResponse(response="I&#x27;m just a computer program, so I don&#x27;t have feelings, but I&#x27;m here and ready to help you with whatever you need!"))

``` Using TypedDict[​](#using-typeddict)

```python
from typing import Optional, Union

from typing_extensions import Annotated, TypedDict

class Joke(TypedDict):
    """Joke to tell user."""

    setup: Annotated[str, ..., "The setup of the joke"]
    punchline: Annotated[str, ..., "The punchline of the joke"]
    rating: Annotated[Optional[int], None, "How funny the joke is, from 1 to 10"]

class ConversationalResponse(TypedDict):
    """Respond in a conversational manner. Be kind and helpful."""

    response: Annotated[str, ..., "A conversational response to the user&#x27;s query"]

class FinalResponse(TypedDict):
    final_output: Union[Joke, ConversationalResponse]

structured_llm = llm.with_structured_output(FinalResponse)

structured_llm.invoke("Tell me a joke about cats")

```

```output
{&#x27;final_output&#x27;: {&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;,
  &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the mouse!&#x27;,
  &#x27;rating&#x27;: 7}}

```

```python
structured_llm.invoke("How are you today?")

```

```output
{&#x27;final_output&#x27;: {&#x27;response&#x27;: "I&#x27;m just a computer program, so I don&#x27;t have feelings, but I&#x27;m here and ready to help you with whatever you need!"}}

``` Responses shall be identical to the ones shown in the Pydantic example. Alternatively, you can use tool calling directly to allow the model to choose between options, if your [chosen model supports it](/docs/integrations/chat/). This involves a bit more parsing and setup but in some instances leads to better performance because you don&#x27;t have to use nested schemas. See [this how-to guide](/docs/how_to/tool_calling/) for more details. Streaming[​](#streaming) We can stream outputs from our structured model when the output type is a dict (i.e., when the schema is specified as a TypedDict class or JSON Schema dict). infoNote that what&#x27;s yielded is already aggregated chunks, not deltas.

```python
from typing_extensions import Annotated, TypedDict

# TypedDict
class Joke(TypedDict):
    """Joke to tell user."""

    setup: Annotated[str, ..., "The setup of the joke"]
    punchline: Annotated[str, ..., "The punchline of the joke"]
    rating: Annotated[Optional[int], None, "How funny the joke is, from 1 to 10"]

structured_llm = llm.with_structured_output(Joke)

for chunk in structured_llm.stream("Tell me a joke about cats"):
    print(chunk)

```

```output
{}
{&#x27;setup&#x27;: &#x27;&#x27;}
{&#x27;setup&#x27;: &#x27;Why&#x27;}
{&#x27;setup&#x27;: &#x27;Why was&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to keep&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to keep an&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the mouse&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the mouse!&#x27;}
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the mouse!&#x27;, &#x27;rating&#x27;: 7}

``` Few-shot prompting[​](#few-shot-prompting) For more complex schemas it&#x27;s very useful to add few-shot examples to the prompt. This can be done in a few ways. The simplest and most universal way is to add examples to a system message in the prompt:

```python
from langchain_core.prompts import ChatPromptTemplate

system = """You are a hilarious comedian. Your specialty is knock-knock jokes. \
Return a joke which has the setup (the response to "Who&#x27;s there?") and the final punchline (the response to "<setup> who?").

Here are some examples of jokes:

example_user: Tell me a joke about planes
example_assistant: {{"setup": "Why don&#x27;t planes ever get tired?", "punchline": "Because they have rest wings!", "rating": 2}}

example_user: Tell me another joke about planes
example_assistant: {{"setup": "Cargo", "punchline": "Cargo &#x27;vroom vroom&#x27;, but planes go &#x27;zoom zoom&#x27;!", "rating": 10}}

example_user: Now about caterpillars
example_assistant: {{"setup": "Caterpillar", "punchline": "Caterpillar really slow, but watch me turn into a butterfly and steal the show!", "rating": 5}}"""

prompt = ChatPromptTemplate.from_messages([("system", system), ("human", "{input}")])

few_shot_structured_llm = prompt | structured_llm
few_shot_structured_llm.invoke("what&#x27;s something funny about woodpeckers")

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
{&#x27;setup&#x27;: &#x27;Woodpecker&#x27;,
 &#x27;punchline&#x27;: "Woodpecker you a joke, but I&#x27;m afraid it might be too &#x27;hole-some&#x27;!",
 &#x27;rating&#x27;: 7}

```**When the underlying method for structuring outputs is tool calling, we can pass in our examples as explicit tool calls. You can check if the model you&#x27;re using makes use of tool calling in its API reference.

```python
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

examples = [
    HumanMessage("Tell me a joke about planes", name="example_user"),
    AIMessage(
        "",
        name="example_assistant",
        tool_calls=[
            {
                "name": "joke",
                "args": {
                    "setup": "Why don&#x27;t planes ever get tired?",
                    "punchline": "Because they have rest wings!",
                    "rating": 2,
                },
                "id": "1",
            }
        ],
    ),
    # Most tool-calling models expect a ToolMessage(s) to follow an AIMessage with tool calls.
    ToolMessage("", tool_call_id="1"),
    # Some models also expect an AIMessage to follow any ToolMessages,
    # so you may need to add an AIMessage here.
    HumanMessage("Tell me another joke about planes", name="example_user"),
    AIMessage(
        "",
        name="example_assistant",
        tool_calls=[
            {
                "name": "joke",
                "args": {
                    "setup": "Cargo",
                    "punchline": "Cargo &#x27;vroom vroom&#x27;, but planes go &#x27;zoom zoom&#x27;!",
                    "rating": 10,
                },
                "id": "2",
            }
        ],
    ),
    ToolMessage("", tool_call_id="2"),
    HumanMessage("Now about caterpillars", name="example_user"),
    AIMessage(
        "",
        name="example_assistant",
        tool_calls=[
            {
                "name": "joke",
                "args": {
                    "setup": "Caterpillar",
                    "punchline": "Caterpillar really slow, but watch me turn into a butterfly and steal the show!",
                    "rating": 5,
                },
                "id": "3",
            }
        ],
    ),
    ToolMessage("", tool_call_id="3"),
]
system = """You are a hilarious comedian. Your specialty is knock-knock jokes. \
Return a joke which has the setup (the response to "Who&#x27;s there?") \
and the final punchline (the response to "<setup> who?")."""

prompt = ChatPromptTemplate.from_messages(
    [("system", system), ("placeholder", "{examples}"), ("human", "{input}")]
)
few_shot_structured_llm = prompt | structured_llm
few_shot_structured_llm.invoke({"input": "crocodiles", "examples": examples})

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html)

```output
{&#x27;setup&#x27;: &#x27;Crocodile&#x27;,
 &#x27;punchline&#x27;: &#x27;Crocodile be seeing you later, alligator!&#x27;,
 &#x27;rating&#x27;: 6}

```**For more on few shot prompting when using tool calling, see [here](/docs/how_to/tools_few_shot/). (Advanced) Specifying the method for structuring outputs[​](#advanced-specifying-the-method-for-structuring-outputs) For models that support more than one means of structuring outputs (i.e., they support both tool calling and JSON mode), you can specify which method to use with the method= argument. JSON modeIf using JSON mode you&#x27;ll have to still specify the desired schema in the model prompt. The schema you pass to with_structured_output will only be used for parsing the model outputs, it will not be passed to the model the way it is with tool calling.To see if the model you&#x27;re using supports JSON mode, check its entry in the [API reference](https://python.langchain.com/api_reference/langchain/index.html).

```python
structured_llm = llm.with_structured_output(None, method="json_mode")

structured_llm.invoke(
    "Tell me a joke about cats, respond in JSON with `setup` and `punchline` keys"
)

```

```output
{&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;,
 &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the mouse!&#x27;}

``` (Advanced) Raw outputs[​](#advanced-raw-outputs) LLMs aren&#x27;t perfect at generating structured output, especially as schemas become complex. You can avoid raising exceptions and handle the raw output yourself by passing include_raw=True. This changes the output format to contain the raw message output, the parsed value (if successful), and any resulting errors:

```python
structured_llm = llm.with_structured_output(Joke, include_raw=True)

structured_llm.invoke("Tell me a joke about cats")

```

```output
{&#x27;raw&#x27;: AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_f25ZRmh8u5vHlOWfTUw8sJFZ&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"setup":"Why was the cat sitting on the computer?","punchline":"Because it wanted to keep an eye on the mouse!","rating":7}&#x27;, &#x27;name&#x27;: &#x27;Joke&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 33, &#x27;prompt_tokens&#x27;: 93, &#x27;total_tokens&#x27;: 126}, &#x27;model_name&#x27;: &#x27;gpt-4o-2024-05-13&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_4e2b2da518&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-d880d7e2-df08-4e9e-ad92-dfc29f2fd52f-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;Joke&#x27;, &#x27;args&#x27;: {&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;, &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the mouse!&#x27;, &#x27;rating&#x27;: 7}, &#x27;id&#x27;: &#x27;call_f25ZRmh8u5vHlOWfTUw8sJFZ&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 93, &#x27;output_tokens&#x27;: 33, &#x27;total_tokens&#x27;: 126}),
 &#x27;parsed&#x27;: {&#x27;setup&#x27;: &#x27;Why was the cat sitting on the computer?&#x27;,
  &#x27;punchline&#x27;: &#x27;Because it wanted to keep an eye on the mouse!&#x27;,
  &#x27;rating&#x27;: 7},
 &#x27;parsing_error&#x27;: None}

``` Prompting and parsing model outputs directly[​](#prompting-and-parsing-model-outputs-directly) Not all models support .with_structured_output(), since not all models have tool calling or JSON mode support. For such models you&#x27;ll need to directly prompt the model to use a specific format, and use an output parser to extract the structured response from the raw model output. Using PydanticOutputParser[​](#using-pydanticoutputparser) The following example uses the built-in [PydanticOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.pydantic.PydanticOutputParser.html) to parse the output of a chat model prompted to match the given Pydantic schema. Note that we are adding format_instructions directly to the prompt from a method on the parser:

```python
from typing import List

from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

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

```API Reference:**[PydanticOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.pydantic.PydanticOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) Let’s take a look at what information is sent to the model:

```python
query = "Anna is 23 years old and she is 6 feet tall"

print(prompt.invoke({"query": query}).to_string())

```**

```output
System: Answer the user query. Wrap the output in `json` tags
The output should be formatted as a JSON instance that conforms to the JSON schema below.

As an example, for the schema {"properties": {"foo": {"title": "Foo", "description": "a list of strings", "type": "array", "items": {"type": "string"}}}, "required": ["foo"]}
the object {"foo": ["bar", "baz"]} is a well-formatted instance of the schema. The object {"properties": {"foo": ["bar", "baz"]}} is not well-formatted.

Here is the output schema:
\`\`\`
{"description": "Identifying information about all people in a text.", "properties": {"people": {"title": "People", "type": "array", "items": {"$ref": "#/definitions/Person"}}}, "required": ["people"], "definitions": {"Person": {"title": "Person", "description": "Information about a person.", "type": "object", "properties": {"name": {"title": "Name", "description": "The name of the person", "type": "string"}, "height_in_meters": {"title": "Height In Meters", "description": "The height of the person expressed in meters.", "type": "number"}}, "required": ["name", "height_in_meters"]}}}
\`\`\`
Human: Anna is 23 years old and she is 6 feet tall

``` And now let&#x27;s invoke it:

```python
chain = prompt | llm | parser

chain.invoke({"query": query})

```

```output
People(people=[Person(name=&#x27;Anna&#x27;, height_in_meters=1.8288)])

``` For a deeper dive into using output parsers with prompting techniques for structured output, see [this guide](/docs/how_to/output_parser_structured/). Custom Parsing[​](#custom-parsing) You can also create a custom prompt and parser with [LangChain Expression Language (LCEL)](/docs/concepts/lcel/), using a plain function to parse the output from the model:

```python
import json
import re
from typing import List

from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

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
).partial(schema=People.model_json_schema())

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

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) Here is the prompt sent to the model:

```python
query = "Anna is 23 years old and she is 6 feet tall"

print(prompt.format_prompt(query=query).to_string())

```**

```output
System: Answer the user query. Output your answer as JSON that  matches the given schema: \`\`\`json
{&#x27;title&#x27;: &#x27;People&#x27;, &#x27;description&#x27;: &#x27;Identifying information about all people in a text.&#x27;, &#x27;type&#x27;: &#x27;object&#x27;, &#x27;properties&#x27;: {&#x27;people&#x27;: {&#x27;title&#x27;: &#x27;People&#x27;, &#x27;type&#x27;: &#x27;array&#x27;, &#x27;items&#x27;: {&#x27;$ref&#x27;: &#x27;#/definitions/Person&#x27;}}}, &#x27;required&#x27;: [&#x27;people&#x27;], &#x27;definitions&#x27;: {&#x27;Person&#x27;: {&#x27;title&#x27;: &#x27;Person&#x27;, &#x27;description&#x27;: &#x27;Information about a person.&#x27;, &#x27;type&#x27;: &#x27;object&#x27;, &#x27;properties&#x27;: {&#x27;name&#x27;: {&#x27;title&#x27;: &#x27;Name&#x27;, &#x27;description&#x27;: &#x27;The name of the person&#x27;, &#x27;type&#x27;: &#x27;string&#x27;}, &#x27;height_in_meters&#x27;: {&#x27;title&#x27;: &#x27;Height In Meters&#x27;, &#x27;description&#x27;: &#x27;The height of the person expressed in meters.&#x27;, &#x27;type&#x27;: &#x27;number&#x27;}}, &#x27;required&#x27;: [&#x27;name&#x27;, &#x27;height_in_meters&#x27;]}}}
\`\`\`. Make sure to wrap the answer in \`\`\`json and \`\`\` tags
Human: Anna is 23 years old and she is 6 feet tall

``` And here&#x27;s what it looks like when we invoke it:

```python
chain = prompt | llm | extract_json

chain.invoke({"query": query})

```

```output
[{&#x27;people&#x27;: [{&#x27;name&#x27;: &#x27;Anna&#x27;, &#x27;height_in_meters&#x27;: 1.8288}]}]

``` Combining with Additional Tools[​](#combining-with-additional-tools) When you need to use both structured output and additional tools (like web search), note the order of operations: Correct Order**:

```python
# 1. Bind tools first
llm_with_tools = llm.bind_tools([web_search_tool, calculator_tool])

# 2. Apply structured output
structured_llm = llm_with_tools.with_structured_output(MySchema)

```**Incorrect Order**:

```python
# This will fail with "Tool &#x27;MySchema&#x27; not found" error
structured_llm = llm.with_structured_output(MySchema)
broken_llm = structured_llm.bind_tools([web_search_tool])

```**Why Order Matters:** with_structured_output() internally uses tool calling to enforce the schema. When you bind additional tools afterward, it creates a conflict in the tool resolution system. **Complete Example:**

```python
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI

class SearchResult(BaseModel):
    """Structured search result."""

    query: str = Field(description="The search query")
    findings: str = Field(description="Summary of findings")

# Define tools
search_tool = {
    "type": "function",
    "function": {
        "name": "web_search",
        "description": "Search the web for information",
        "parameters": {
            "type": "object",
            "properties": {"query": {"type": "string", "description": "Search query"}},
            "required": ["query"],
        },
    },
}

# Correct approach
llm = ChatOpenAI()
llm_with_search = llm.bind_tools([search_tool])
structured_search_llm = llm_with_search.with_structured_output(SearchResult)

# Now you can use both search and get structured output
result = structured_search_llm.invoke("Search for latest AI research and summarize")

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/structured_output.ipynb)[The .with_structured_output() method](#the-with_structured_output-method)[Pydantic class](#pydantic-class)
- [TypedDict or JSON Schema](#typeddict-or-json-schema)
- [Choosing between multiple schemas](#choosing-between-multiple-schemas)
- [Streaming](#streaming)
- [Few-shot prompting](#few-shot-prompting)
- [(Advanced) Specifying the method for structuring outputs](#advanced-specifying-the-method-for-structuring-outputs)
- [(Advanced) Raw outputs](#advanced-raw-outputs)

- [Prompting and parsing model outputs directly](#prompting-and-parsing-model-outputs-directly)[Using PydanticOutputParser](#using-pydanticoutputparser)
- [Custom Parsing](#custom-parsing)

- [Combining with Additional Tools](#combining-with-additional-tools)

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