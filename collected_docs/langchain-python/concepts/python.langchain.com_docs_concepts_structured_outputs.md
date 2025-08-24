Structured outputs | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/structured_outputs.mdx)Structured outputs Overview[​](#overview) For many applications, such as chatbots, models need to respond to users directly in natural language. However, there are scenarios where we need models to output in a structured format. For example, we might want to store the model output in a database and ensure that the output conforms to the database schema. This need motivates the concept of structured output, where models can be instructed to respond with a particular output structure. ![Structured output ](/assets/images/structured_output-2c42953cee807dedd6e96f3e1db17f69.png) Key concepts[​](#key-concepts) Schema definition:** The output structure is represented as a schema, which can be defined in several ways.**Returning structured output:** The model is given this schema, and is instructed to return output that conforms to it.

## Recommended usage[​](#recommended-usage)

This pseudocode illustrates the recommended workflow when using structured output. LangChain provides a method, [with_structured_output()](/docs/how_to/structured_output/#the-with_structured_output-method), that automates the process of binding the schema to the [model](/docs/concepts/chat_models/) and parsing the output. This helper function is available for all model providers that support structured output.

```python
# Define schema
schema = {"foo": "bar"}
# Bind schema to model
model_with_structure = model.with_structured_output(schema)
# Invoke the model to produce structured output that matches the schema
structured_output = model_with_structure.invoke(user_input)

```**Tool Order MattersWhen combining structured output with additional tools, bind tools first**, then apply structured output:

```python
# Correct
model_with_tools = model.bind_tools([tool1, tool2])
structured_model = model_with_tools.with_structured_output(schema)

# Incorrect - will cause tool resolution errors
structured_model = model.with_structured_output(schema)
broken_model = structured_model.bind_tools([tool1, tool2])

```

## Schema definition[​](#schema-definition) The central concept is that the output structure of model responses needs to be represented in some way. While types of objects you can use depend on the model you&#x27;re working with, there are common types of objects that are typically allowed or recommended for structured output in Python.

The simplest and most common format for structured output is a JSON-like structure, which in Python can be represented as a dictionary (dict) or list (list). JSON objects (or dicts in Python) are often used directly when the tool requires raw, flexible, and minimal-overhead structured data.

```json
{
  "answer": "The answer to the user&#x27;s question",
  "followup_question": "A followup question the user could ask"
}

```

As a second example, [Pydantic](https://docs.pydantic.dev/latest/) is particularly useful for defining structured output schemas because it offers type hints and validation. Here&#x27;s an example of a Pydantic schema:

```python
from pydantic import BaseModel, Field
class ResponseFormatter(BaseModel):
    """Always use this tool to structure your response to the user."""
    answer: str = Field(description="The answer to the user&#x27;s question")
    followup_question: str = Field(description="A followup question the user could ask")

```

## Returning structured output[​](#returning-structured-output) With a schema defined, we need a way to instruct the model to use it. While one approach is to include this schema in the prompt and *ask nicely* for the model to use it, this is not recommended. Several more powerful methods that utilizes native features in the model provider&#x27;s API are available.

### Using tool calling[​](#using-tool-calling)

Many [model providers support](/docs/integrations/chat/) tool calling, a concept discussed in more detail in our [tool calling guide](/docs/concepts/tool_calling/). In short, tool calling involves binding a tool to a model and, when appropriate, the model can *decide* to call this tool and ensure its response conforms to the tool&#x27;s schema. With this in mind, the central concept is straightforward: *simply bind our schema to a model as a tool!* Here is an example using the `ResponseFormatter` schema defined above:

```python
from langchain_openai import ChatOpenAI
model = ChatOpenAI(model="gpt-4o", temperature=0)
# Bind responseformatter schema as a tool to the model
model_with_tools = model.bind_tools([ResponseFormatter])
# Invoke the model
ai_msg = model_with_tools.invoke("What is the powerhouse of the cell?")

```

The arguments of the tool call are already extracted as a dictionary. This dictionary can be optionally parsed into a Pydantic object, matching our original `ResponseFormatter` schema.

```python
# Get the tool call arguments
ai_msg.tool_calls[0]["args"]
{&#x27;answer&#x27;: "The powerhouse of the cell is the mitochondrion. Mitochondria are organelles that generate most of the cell&#x27;s supply of adenosine triphosphate (ATP), which is used as a source of chemical energy.",
 &#x27;followup_question&#x27;: &#x27;What is the function of ATP in the cell?&#x27;}
# Parse the dictionary into a pydantic object
pydantic_object = ResponseFormatter.model_validate(ai_msg.tool_calls[0]["args"])

```

### JSON mode[​](#json-mode) In addition to tool calling, some model providers support a feature called `JSON mode`. This supports JSON schema definition as input and enforces the model to produce a conforming JSON output. You can find a table of model providers that support JSON mode [here](/docs/integrations/chat/). Here is an example of how to use JSON mode with OpenAI:

```python
from langchain_openai import ChatOpenAI
model = ChatOpenAI(model="gpt-4o").with_structured_output(method="json_mode")
ai_msg = model.invoke("Return a JSON object with key &#x27;random_ints&#x27; and a value of 10 random ints in [0-99]")
ai_msg
{&#x27;random_ints&#x27;: [45, 67, 12, 34, 89, 23, 78, 56, 90, 11]}

```

## Structured output method[​](#structured-output-method) There are a few challenges when producing structured output with the above methods:

- When tool calling is used, tool call arguments needs to be parsed from a dictionary back to the original schema.

- In addition, the model needs to be instructed to *always* use the tool when we want to enforce structured output, which is a provider specific setting.

- When JSON mode is used, the output needs to be parsed into a JSON object.

With these challenges in mind, LangChain provides a helper function (`with_structured_output()`) to streamline the process.

![Diagram of with structured output ](/assets/images/with_structured_output-4fd0fdc94f644554d52c6a8dee96ea21.png)

This both binds the schema to the model as a tool and parses the output to the specified output schema.

```python
# Bind the schema to the model
model_with_structure = model.with_structured_output(ResponseFormatter)
# Invoke the model
structured_output = model_with_structure.invoke("What is the powerhouse of the cell?")
# Get back the pydantic object
structured_output
ResponseFormatter(answer="The powerhouse of the cell is the mitochondrion. Mitochondria are organelles that generate most of the cell&#x27;s supply of adenosine triphosphate (ATP), which is used as a source of chemical energy.", followup_question=&#x27;What is the function of ATP in the cell?&#x27;)

```

Further readingFor more details on usage, see our [how-to guide](/docs/how_to/structured_output/#the-with_structured_output-method).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/structured_outputs.mdx)

- [Overview](#overview)
- [Key concepts](#key-concepts)
- [Recommended usage](#recommended-usage)
- [Schema definition](#schema-definition)
- [Returning structured output](#returning-structured-output)[Using tool calling](#using-tool-calling)
- [JSON mode](#json-mode)

- [Structured output method](#structured-output-method)

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