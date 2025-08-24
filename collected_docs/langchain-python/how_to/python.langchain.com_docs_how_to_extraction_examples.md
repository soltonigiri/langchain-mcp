How to use reference examples when doing extraction | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/extraction_examples.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/extraction_examples.ipynb)How to use reference examples when doing extraction The quality of extractions can often be improved by providing reference examples to the LLM. Data extraction attempts to generate [structured representations](/docs/concepts/structured_outputs/) of information found in text and other unstructured or semi-structured formats. [Tool-calling](/docs/concepts/tool_calling/) LLM features are often used in this context. This guide demonstrates how to build few-shot examples of tool calls to help steer the behavior of extraction and similar applications. tipWhile this guide focuses how to use examples with a tool calling model, this technique is generally applicable, and will work also with JSON more or prompt based techniques. LangChain implements a [tool-call attribute](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html#langchain_core.messages.ai.AIMessage.tool_calls) on messages from LLMs that include tool calls. See our [how-to guide on tool calling](/docs/how_to/tool_calling/) for more detail. To build reference examples for data extraction, we build a chat history containing a sequence of: [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) containing example inputs; [AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) containing example tool calls; [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html) containing example tool outputs. LangChain adopts this convention for structuring tool calls into conversation across LLM model providers. First we build a prompt template that includes a placeholder for these messages:

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Define a custom prompt to provide instructions and any additional context.
# 1) You can add examples into the prompt template to improve extraction quality
# 2) Introduce additional parameters to take context into account (e.g., include metadata
#    about the document from which the text was extracted.)
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an expert extraction algorithm. "
            "Only extract relevant information from the text. "
            "If you do not know the value of an attribute asked "
            "to extract, return null for the attribute&#x27;s value.",
        ),
        # ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        MessagesPlaceholder("examples"),  # <-- EXAMPLES!
        # ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
        ("human", "{text}"),
    ]
)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html) Test out the template:

```python
from langchain_core.messages import (
    HumanMessage,
)

prompt.invoke(
    {"text": "this is some text", "examples": [HumanMessage(content="testing 1 2 3")]}
)

```**API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```output
ChatPromptValue(messages=[SystemMessage(content="You are an expert extraction algorithm. Only extract relevant information from the text. If you do not know the value of an attribute asked to extract, return null for the attribute&#x27;s value.", additional_kwargs={}, response_metadata={}), HumanMessage(content=&#x27;testing 1 2 3&#x27;, additional_kwargs={}, response_metadata={}), HumanMessage(content=&#x27;this is some text&#x27;, additional_kwargs={}, response_metadata={})])

```**Define the schema[​](#define-the-schema) Let&#x27;s re-use the person schema from the [extraction tutorial](/docs/tutorials/extraction/).

```python
from typing import List, Optional

from langchain_openai import ChatOpenAI
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
    name: Optional[str] = Field(..., description="The name of the person")
    hair_color: Optional[str] = Field(
        ..., description="The color of the person&#x27;s hair if known"
    )
    height_in_meters: Optional[str] = Field(..., description="Height in METERs")

class Data(BaseModel):
    """Extracted data about people."""

    # Creates a model so that we can extract multiple entities.
    people: List[Person]

``` Define reference examples[​](#define-reference-examples) Examples can be defined as a list of input-output pairs. Each example contains an example input text and an example output showing what should be extracted from the text. importantThis is a bit in the weeds, so feel free to skip.The format of the example needs to match the API used (e.g., tool calling or JSON mode etc.).Here, the formatted examples will match the format expected for the tool calling API since that&#x27;s what we&#x27;re using.

```python
import uuid
from typing import Dict, List, TypedDict

from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)
from pydantic import BaseModel, Field

class Example(TypedDict):
    """A representation of an example consisting of text input and expected tool calls.

    For extraction, the tool calls are represented as instances of pydantic model.
    """

    input: str  # This is the example text
    tool_calls: List[BaseModel]  # Instances of pydantic model that should be extracted

def tool_example_to_messages(example: Example) -> List[BaseMessage]:
    """Convert an example into a list of messages that can be fed into an LLM.

    This code is an adapter that converts our example to a list of messages
    that can be fed into a chat model.

    The list of messages per example corresponds to:

    1) HumanMessage: contains the content from which content should be extracted.
    2) AIMessage: contains the extracted information from the model
    3) ToolMessage: contains confirmation to the model that the model requested a tool correctly.

    The ToolMessage is required because some of the chat models are hyper-optimized for agents
    rather than for an extraction use case.
    """
    messages: List[BaseMessage] = [HumanMessage(content=example["input"])]
    tool_calls = []
    for tool_call in example["tool_calls"]:
        tool_calls.append(
            {
                "id": str(uuid.uuid4()),
                "args": tool_call.dict(),
                # The name of the function right now corresponds
                # to the name of the pydantic model
                # This is implicit in the API right now,
                # and will be improved over time.
                "name": tool_call.__class__.__name__,
            },
        )
    messages.append(AIMessage(content="", tool_calls=tool_calls))
    tool_outputs = example.get("tool_outputs") or [
        "You have correctly called this tool."
    ] * len(tool_calls)
    for output, tool_call in zip(tool_outputs, tool_calls):
        messages.append(ToolMessage(content=output, tool_call_id=tool_call["id"]))
    return messages

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html) Next let&#x27;s define our examples and then convert them into message format.

```python
examples = [
    (
        "The ocean is vast and blue. It&#x27;s more than 20,000 feet deep. There are many fish in it.",
        Data(people=[]),
    ),
    (
        "Fiona traveled far from France to Spain.",
        Data(people=[Person(name="Fiona", height_in_meters=None, hair_color=None)]),
    ),
]

messages = []

for text, tool_call in examples:
    messages.extend(
        tool_example_to_messages({"input": text, "tool_calls": [tool_call]})
    )

```**Let&#x27;s test out the prompt

```python
example_prompt = prompt.invoke({"text": "this is some text", "examples": messages})

for message in example_prompt.messages:
    print(f"{message.type}: {message}")

```

```output
system: content="You are an expert extraction algorithm. Only extract relevant information from the text. If you do not know the value of an attribute asked to extract, return null for the attribute&#x27;s value." additional_kwargs={} response_metadata={}
human: content="The ocean is vast and blue. It&#x27;s more than 20,000 feet deep. There are many fish in it." additional_kwargs={} response_metadata={}
ai: content=&#x27;&#x27; additional_kwargs={} response_metadata={} tool_calls=[{&#x27;name&#x27;: &#x27;Data&#x27;, &#x27;args&#x27;: {&#x27;people&#x27;: []}, &#x27;id&#x27;: &#x27;240159b1-1405-4107-a07c-3c6b91b3d5b7&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}]
tool: content=&#x27;You have correctly called this tool.&#x27; tool_call_id=&#x27;240159b1-1405-4107-a07c-3c6b91b3d5b7&#x27;
human: content=&#x27;Fiona traveled far from France to Spain.&#x27; additional_kwargs={} response_metadata={}
ai: content=&#x27;&#x27; additional_kwargs={} response_metadata={} tool_calls=[{&#x27;name&#x27;: &#x27;Data&#x27;, &#x27;args&#x27;: {&#x27;people&#x27;: [{&#x27;name&#x27;: &#x27;Fiona&#x27;, &#x27;hair_color&#x27;: None, &#x27;height_in_meters&#x27;: None}]}, &#x27;id&#x27;: &#x27;3fc521e4-d1d2-4c20-bf40-e3d72f1068da&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}]
tool: content=&#x27;You have correctly called this tool.&#x27; tool_call_id=&#x27;3fc521e4-d1d2-4c20-bf40-e3d72f1068da&#x27;
human: content=&#x27;this is some text&#x27; additional_kwargs={} response_metadata={}

``` Create an extractor[​](#create-an-extractor) Let&#x27;s select an LLM. Because we are using tool-calling, we will need a model that supports a tool-calling feature. See [this table](/docs/integrations/chat/) for available LLMs. Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` Following the [extraction tutorial](/docs/tutorials/extraction/), we use the .with_structured_output method to structure model outputs according to the desired schema:

```python
runnable = prompt | llm.with_structured_output(
    schema=Data,
    method="function_calling",
    include_raw=False,
)

``` Without examples 😿[​](#without-examples-) Notice that even capable models can fail with a very simple** test case!

```python
for _ in range(5):
    text = "The solar system is large, but earth has only 1 moon."
    print(runnable.invoke({"text": text, "examples": []}))

```

```output
people=[Person(name=&#x27;earth&#x27;, hair_color=&#x27;null&#x27;, height_in_meters=&#x27;null&#x27;)]
``````output
people=[Person(name=&#x27;earth&#x27;, hair_color=&#x27;null&#x27;, height_in_meters=&#x27;null&#x27;)]
``````output
people=[]
``````output
people=[Person(name=&#x27;earth&#x27;, hair_color=&#x27;null&#x27;, height_in_meters=&#x27;null&#x27;)]
``````output
people=[]

``` ## With examples 😻[​](#with-examples-) Reference examples helps to fix the failure!

```python
for _ in range(5):
    text = "The solar system is large, but earth has only 1 moon."
    print(runnable.invoke({"text": text, "examples": messages}))

```

```output
people=[]
``````output
people=[]
``````output
people=[]
``````output
people=[]
``````output
people=[]

``` Note that we can see the few-shot examples as tool-calls in the [Langsmith trace](https://smith.langchain.com/public/4c436bc2-a1ce-440b-82f5-093947542e40/r). And we retain performance on a positive sample:

```python
runnable.invoke(
    {
        "text": "My name is Harrison. My hair is black.",
        "examples": messages,
    }
)

```

```output
Data(people=[Person(name=&#x27;Harrison&#x27;, hair_color=&#x27;black&#x27;, height_in_meters=None)])

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/extraction_examples.ipynb)[Define the schema](#define-the-schema)
- [Define reference examples](#define-reference-examples)
- [Create an extractor](#create-an-extractor)
- [Without examples 😿](#without-examples-)
- [With examples 😻](#with-examples-)

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