Build an Extraction Chain | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/tutorials/extraction.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/tutorials/extraction.ipynb)Build an Extraction Chain In this tutorial, we will use [tool-calling](/docs/concepts/tool_calling/) features of [chat models](/docs/concepts/chat_models/) to extract structured information from unstructured text. We will also demonstrate how to use [few-shot prompting](/docs/concepts/few_shot_prompting/) in this context to improve performance. importantThis tutorial requires langchain-core>=0.3.20 and will only work with models that support tool calling**. ## Setup[​](#setup) ### Jupyter Notebook[​](#jupyter-notebook) This and other tutorials are perhaps most conveniently run in a [Jupyter notebooks](https://jupyter.org/). Going through guides in an interactive environment is a great way to better understand them. See [here](https://jupyter.org/install) for instructions on how to install. ### Installation[​](#installation) To install LangChain run: Pip
- Conda

```bash
pip install --upgrade langchain-core

```**

```bash
conda install langchain-core -c conda-forge

``` For more details, see our [Installation guide](/docs/how_to/installation/). LangSmith[​](#langsmith) Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com). After you sign up at the link above, make sure to set your environment variables to start logging traces:

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."

``` Or, if in a notebook, you can set them with:

```python
import getpass
import os

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` The Schema[​](#the-schema) First, we need to describe what information we want to extract from the text. We&#x27;ll use Pydantic to define an example schema to extract personal information.

```python
from typing import Optional

from pydantic import BaseModel, Field

class Person(BaseModel):
    """Information about a person."""

    # ^ Doc-string for the entity Person.
    # This doc-string is sent to the LLM as the description of the schema Person,
    # and it can help to improve extraction results.

    # Note that:
    # 1. Each field is an `optional` -- this allows the model to decline to extract it!
    # 2. Each field has a `description` -- this description is used by the LLM.
    # Having a good description can help improve extraction results.
    name: Optional[str] = Field(default=None, description="The name of the person")
    hair_color: Optional[str] = Field(
        default=None, description="The color of the person&#x27;s hair if known"
    )
    height_in_meters: Optional[str] = Field(
        default=None, description="Height measured in meters"
    )

``` There are two best practices when defining schema: Document the attributes** and the **schema** itself: This information is sent to the LLM and is used to improve the quality of information extraction.

- Do not force the LLM to make up information! Above we used Optional for the attributes allowing the LLM to output None if it doesn&#x27;t know the answer.

importantFor best performance, document the schema well and make sure the model isn&#x27;t forced to return results if there&#x27;s no information to be extracted in the text.

## The Extractor[​](#the-extractor)

Let&#x27;s create an information extractor using the schema we defined above.

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Define a custom prompt to provide instructions and any additional context.
# 1) You can add examples into the prompt template to improve extraction quality
# 2) Introduce additional parameters to take context into account (e.g., include metadata
#    about the document from which the text was extracted.)
prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an expert extraction algorithm. "
            "Only extract relevant information from the text. "
            "If you do not know the value of an attribute asked to extract, "
            "return null for the attribute&#x27;s value.",
        ),
        # Please see the how-to about improving performance with
        # reference examples.
        # MessagesPlaceholder(&#x27;examples&#x27;),
        ("human", "{text}"),
    ]
)

```**API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html)

We need to use a model that supports function/tool calling.

Please review [the documentation](/docs/concepts/tool_calling/) for all models that can be used with this API.

Select [chat model](/docs/integrations/chat/):**Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

```

```python
structured_llm = llm.with_structured_output(schema=Person)

``` Let&#x27;s test it out:

```python
text = "Alan Smith is 6 feet tall and has blond hair."
prompt = prompt_template.invoke({"text": text})
structured_llm.invoke(prompt)

```

```output
Person(name=&#x27;Alan Smith&#x27;, hair_color=&#x27;blond&#x27;, height_in_meters=&#x27;1.83&#x27;)

``` importantExtraction is Generative 🤯LLMs are generative models, so they can do some pretty cool things like correctly extract the height of the person in meters even though it was provided in feet! We can see the LangSmith trace [here](https://smith.langchain.com/public/44b69a63-3b3b-47b8-8a6d-61b46533f015/r). Note that the [chat model portion of the trace](https://smith.langchain.com/public/44b69a63-3b3b-47b8-8a6d-61b46533f015/r/dd1f6305-f1e9-4919-bd8f-339d03a12d01) reveals the exact sequence of messages sent to the model, tools invoked, and other metadata. Multiple Entities[​](#multiple-entities) In most cases**, you should be extracting a list of entities rather than a single entity.

This can be easily achieved using pydantic by nesting models inside one another.

```python
from typing import List, Optional

from pydantic import BaseModel, Field

class Person(BaseModel):
    """Information about a person."""

    # ^ Doc-string for the entity Person.
    # This doc-string is sent to the LLM as the description of the schema Person,
    # and it can help to improve extraction results.

    # Note that:
    # 1. Each field is an `optional` -- this allows the model to decline to extract it!
    # 2. Each field has a `description` -- this description is used by the LLM.
    # Having a good description can help improve extraction results.
    name: Optional[str] = Field(default=None, description="The name of the person")
    hair_color: Optional[str] = Field(
        default=None, description="The color of the person&#x27;s hair if known"
    )
    height_in_meters: Optional[str] = Field(
        default=None, description="Height measured in meters"
    )

class Data(BaseModel):
    """Extracted data about people."""

    # Creates a model so that we can extract multiple entities.
    people: List[Person]

```**importantExtraction results might not be perfect here. Read on to see how to use Reference Examples** to improve the quality of extraction, and check out our extraction [how-to](/docs/how_to/#extraction) guides for more detail.

```python
structured_llm = llm.with_structured_output(schema=Data)
text = "My name is Jeff, my hair is black and i am 6 feet tall. Anna has the same color hair as me."
prompt = prompt_template.invoke({"text": text})
structured_llm.invoke(prompt)

```**

```output
Data(people=[Person(name=&#x27;Jeff&#x27;, hair_color=&#x27;black&#x27;, height_in_meters=&#x27;1.83&#x27;), Person(name=&#x27;Anna&#x27;, hair_color=&#x27;black&#x27;, height_in_meters=None)])

``` tipWhen the schema accommodates the extraction of multiple entities**, it also allows the model to extract **no entities** if no relevant information
is in the text by providing an empty list.

This is usually a **good** thing! It allows specifying **required** attributes on an entity without necessarily forcing the model to detect this entity.

We can see the LangSmith trace [here](https://smith.langchain.com/public/7173764d-5e76-45fe-8496-84460bd9cdef/r).

## Reference examples[​](#reference-examples)

The behavior of LLM applications can be steered using [few-shot prompting](/docs/concepts/few_shot_prompting/). For [chat models](/docs/concepts/chat_models/), this can take the form of a sequence of pairs of input and response messages demonstrating desired behaviors.

For example, we can convey the meaning of a symbol with alternating `user` and `assistant` [messages](/docs/concepts/messages/#role):

```python
messages = [
    {"role": "user", "content": "2 🦜 2"},
    {"role": "assistant", "content": "4"},
    {"role": "user", "content": "2 🦜 3"},
    {"role": "assistant", "content": "5"},
    {"role": "user", "content": "3 🦜 4"},
]

response = llm.invoke(messages)
print(response.content)

```**

```output
7

``` [Structured output](/docs/concepts/structured_outputs/) often uses [tool calling](/docs/concepts/tool_calling/) under-the-hood. This typically involves the generation of [AI messages](/docs/concepts/messages/#aimessage) containing tool calls, as well as [tool messages](/docs/concepts/messages/#toolmessage) containing the results of tool calls. What should a sequence of messages look like in this case? Different [chat model providers](/docs/integrations/chat/) impose different requirements for valid message sequences. Some will accept a (repeating) message sequence of the form: User message AI message with tool call Tool message with result Others require a final AI message containing some sort of response. LangChain includes a utility function [tool_example_to_messages](https://python.langchain.com/api_reference/core/utils/langchain_core.utils.function_calling.tool_example_to_messages.html) that will generate a valid sequence for most model providers. It simplifies the generation of structured few-shot examples by just requiring Pydantic representations of the corresponding tool calls. Let&#x27;s try this out. We can convert pairs of input strings and desired Pydantic objects to a sequence of messages that can be provided to a chat model. Under the hood, LangChain will format the tool calls to each provider&#x27;s required format. Note: this version of tool_example_to_messages requires langchain-core>=0.3.20.

```python
from langchain_core.utils.function_calling import tool_example_to_messages

examples = [
    (
        "The ocean is vast and blue. It&#x27;s more than 20,000 feet deep.",
        Data(people=[]),
    ),
    (
        "Fiona traveled far from France to Spain.",
        Data(people=[Person(name="Fiona", height_in_meters=None, hair_color=None)]),
    ),
]

messages = []

for txt, tool_call in examples:
    if tool_call.people:
        # This final message is optional for some providers
        ai_response = "Detected people."
    else:
        ai_response = "Detected no people."
    messages.extend(tool_example_to_messages(txt, [tool_call], ai_response=ai_response))

```API Reference:**[tool_example_to_messages](https://python.langchain.com/api_reference/core/utils/langchain_core.utils.function_calling.tool_example_to_messages.html)

Inspecting the result, we see these two example pairs generated eight messages:

```python
for message in messages:
    message.pretty_print()

```**

```output
================================[1m Human Message [0m=================================

The ocean is vast and blue. It&#x27;s more than 20,000 feet deep.
==================================[1m Ai Message [0m==================================
Tool Calls:
  Data (d8f2e054-7fb9-417f-b28f-0447a775b2c3)
 Call ID: d8f2e054-7fb9-417f-b28f-0447a775b2c3
  Args:
    people: []
=================================[1m Tool Message [0m=================================

You have correctly called this tool.
==================================[1m Ai Message [0m==================================

Detected no people.
================================[1m Human Message [0m=================================

Fiona traveled far from France to Spain.
==================================[1m Ai Message [0m==================================
Tool Calls:
  Data (0178939e-a4b1-4d2a-a93e-b87f665cdfd6)
 Call ID: 0178939e-a4b1-4d2a-a93e-b87f665cdfd6
  Args:
    people: [{&#x27;name&#x27;: &#x27;Fiona&#x27;, &#x27;hair_color&#x27;: None, &#x27;height_in_meters&#x27;: None}]
=================================[1m Tool Message [0m=================================

You have correctly called this tool.
==================================[1m Ai Message [0m==================================

Detected people.

``` Let&#x27;s compare performance with and without these messages. For example, let&#x27;s pass a message for which we intend no people to be extracted:

```python
message_no_extraction = {
    "role": "user",
    "content": "The solar system is large, but earth has only 1 moon.",
}

structured_llm = llm.with_structured_output(schema=Data)
structured_llm.invoke([message_no_extraction])

```

```output
Data(people=[Person(name=&#x27;Earth&#x27;, hair_color=&#x27;None&#x27;, height_in_meters=&#x27;0.00&#x27;)])

``` In this example, the model is liable to erroneously generate records of people. Because our few-shot examples contain examples of "negatives", we encourage the model to behave correctly in this case:

```python
structured_llm.invoke(messages + [message_no_extraction])

```

```output
Data(people=[])

``` tipThe [LangSmith](https://smith.langchain.com/public/b3433f57-7905-4430-923c-fed214525bf1/r) trace for the run reveals the exact sequence of messages sent to the chat model, tool calls generated, latency, token counts, and other metadata. See [this guide](/docs/how_to/extraction_examples/) for more detail on extraction workflows with reference examples, including how to incorporate prompt templates and customize the generation of example messages. Next steps[​](#next-steps) Now that you understand the basics of extraction with LangChain, you&#x27;re ready to proceed to the rest of the how-to guides: [Add Examples](/docs/how_to/extraction_examples/): More detail on using reference examples** to improve performance.

- [Handle Long Text](/docs/how_to/extraction_long_text/): What should you do if the text does not fit into the context window of the LLM?

- [Use a Parsing Approach](/docs/how_to/extraction_parse/): Use a prompt based approach to extract with models that do not support **tool/function calling**.

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/tutorials/extraction.ipynb)

- [Setup](#setup)[Jupyter Notebook](#jupyter-notebook)
- [Installation](#installation)
- [LangSmith](#langsmith)

- [The Schema](#the-schema)
- [The Extractor](#the-extractor)
- [Multiple Entities](#multiple-entities)
- [Reference examples](#reference-examples)
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