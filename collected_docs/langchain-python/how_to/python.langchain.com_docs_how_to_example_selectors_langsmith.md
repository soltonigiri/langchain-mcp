How to select examples from a LangSmith dataset | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/example_selectors_langsmith.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/example_selectors_langsmith.ipynb)How to select examples from a LangSmith dataset 📚Prerequisites[Chat models](/docs/concepts/chat_models)[Few-shot-prompting](/docs/concepts/few-shot-prompting)[LangSmith](https://docs.smith.langchain.com/) 📦CompatibilityThe code in this guide requires langsmith>=0.1.101, langchain-core>=0.2.34. Please ensure you have the correct packages installed. [LangSmith](https://docs.smith.langchain.com/) datasets have built-in support for similarity search, making them a great tool for building and querying few-shot examples. In this guide we&#x27;ll see how to use an indexed LangSmith dataset as a few-shot example selector. Setup[​](#setup) Before getting started make sure you&#x27;ve [created a LangSmith account](https://smith.langchain.com/) and set your credentials:

```python
import getpass
import os

if not os.environ.get("LANGSMITH_API_KEY"):
    os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Set LangSmith API key:\n\n")

os.environ["LANGSMITH_TRACING"] = "true"

```

```output
Set LangSmith API key:

········

``` We&#x27;ll need to install the langsmith SDK. In this example we&#x27;ll also make use of langchain, langchain-openai, and langchain-benchmarks:

```python
%pip install -qU "langsmith>=0.1.101" "langchain-core>=0.2.34" langchain langchain-openai langchain-benchmarks

``` Now we&#x27;ll clone a public dataset and turn on indexing for the dataset. We can also turn on indexing via the [LangSmith UI](https://docs.smith.langchain.com/how_to_guides/datasets/index_datasets_for_dynamic_few_shot_example_selection). We&#x27;ll clone the [Multiverse math few shot example dataset](https://blog.langchain.dev/few-shot-prompting-to-improve-tool-calling-performance/). This enables searching over the dataset and will make sure that anytime we update/add examples they are also indexed.

```python
from langsmith import Client as LangSmith

ls_client = LangSmith()

dataset_name = "multiverse-math-few-shot-examples-v2"
dataset_public_url = (
    "https://smith.langchain.com/public/620596ee-570b-4d2b-8c8f-f828adbe5242/d"
)

ls_client.clone_public_dataset(dataset_public_url)

dataset_id = ls_client.read_dataset(dataset_name=dataset_name).id

ls_client.index_dataset(dataset_id=dataset_id)

``` Querying dataset[​](#querying-dataset) Indexing can take a few seconds. Once the dataset is indexed, we can search for similar examples. Note that the input to the similar_examples method must have the same schema as the examples inputs. In this case our example inputs are a dictionary with a "question" key:

```python
examples = ls_client.similar_examples(
    {"question": "whats the negation of the negation of the negation of 3"},
    limit=3,
    dataset_id=dataset_id,
)
len(examples)

```

```output
3

```

```python
examples[0].inputs["question"]

```

```output
&#x27;evaluate the negation of -100&#x27;

``` For this dataset, the outputs are the conversation that followed the question in OpenAI message format:

```python
examples[0].outputs["conversation"]

```

```output
[{&#x27;role&#x27;: &#x27;assistant&#x27;,
  &#x27;content&#x27;: None,
  &#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;toolu_01HTpq4cYNUac6F7omUc2Wz3&#x27;,
    &#x27;type&#x27;: &#x27;function&#x27;,
    &#x27;function&#x27;: {&#x27;name&#x27;: &#x27;negate&#x27;, &#x27;arguments&#x27;: &#x27;{"a": -100}&#x27;}}]},
 {&#x27;role&#x27;: &#x27;tool&#x27;,
  &#x27;content&#x27;: &#x27;-100.0&#x27;,
  &#x27;tool_call_id&#x27;: &#x27;toolu_01HTpq4cYNUac6F7omUc2Wz3&#x27;},
 {&#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;content&#x27;: &#x27;So the answer is 100.&#x27;},
 {&#x27;role&#x27;: &#x27;user&#x27;,
  &#x27;content&#x27;: &#x27;100 is incorrect. Please refer to the output of your tool call.&#x27;},
 {&#x27;role&#x27;: &#x27;assistant&#x27;,
  &#x27;content&#x27;: [{&#x27;text&#x27;: "You&#x27;re right, my previous answer was incorrect. Let me re-evaluate using the tool output:",
    &#x27;type&#x27;: &#x27;text&#x27;}],
  &#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;toolu_01XsJQboYghGDygQpPjJkeRq&#x27;,
    &#x27;type&#x27;: &#x27;function&#x27;,
    &#x27;function&#x27;: {&#x27;name&#x27;: &#x27;negate&#x27;, &#x27;arguments&#x27;: &#x27;{"a": -100}&#x27;}}]},
 {&#x27;role&#x27;: &#x27;tool&#x27;,
  &#x27;content&#x27;: &#x27;-100.0&#x27;,
  &#x27;tool_call_id&#x27;: &#x27;toolu_01XsJQboYghGDygQpPjJkeRq&#x27;},
 {&#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;content&#x27;: &#x27;The answer is -100.0&#x27;},
 {&#x27;role&#x27;: &#x27;user&#x27;,
  &#x27;content&#x27;: &#x27;You have the correct numerical answer but are returning additional text. Please only respond with the numerical answer.&#x27;},
 {&#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;content&#x27;: &#x27;-100.0&#x27;}]

``` Creating dynamic few-shot prompts[​](#creating-dynamic-few-shot-prompts) The search returns the examples whose inputs are most similar to the query input. We can use this for few-shot prompting a model like so:

```python
from langchain.chat_models import init_chat_model
from langchain_benchmarks.tool_usage.tasks.multiverse_math import (
    add,
    cos,
    divide,
    log,
    multiply,
    negate,
    pi,
    power,
    sin,
    subtract,
)
from langchain_core.runnables import RunnableLambda
from langsmith import AsyncClient as AsyncLangSmith

async_ls_client = AsyncLangSmith()

def similar_examples(input_: dict) -> dict:
    examples = ls_client.similar_examples(input_, limit=5, dataset_id=dataset_id)
    return {**input_, "examples": examples}

async def asimilar_examples(input_: dict) -> dict:
    examples = await async_ls_client.similar_examples(
        input_, limit=5, dataset_id=dataset_id
    )
    return {**input_, "examples": examples}

def construct_prompt(input_: dict) -> list:
    instructions = """You are great at using mathematical tools."""
    examples = []
    for ex in input_["examples"]:
        examples.append({"role": "user", "content": ex.inputs["question"]})
        for msg in ex.outputs["conversation"]:
            if msg["role"] == "assistant":
                msg["name"] = "example_assistant"
            if msg["role"] == "user":
                msg["name"] = "example_user"
            examples.append(msg)
    return [
        {"role": "system", "content": instructions},
        *examples,
        {"role": "user", "content": input_["question"]},
    ]

tools = [add, cos, divide, log, multiply, negate, pi, power, sin, subtract]
llm = init_chat_model("gpt-4o-2024-08-06")
llm_with_tools = llm.bind_tools(tools)

example_selector = RunnableLambda(func=similar_examples, afunc=asimilar_examples)

chain = example_selector | construct_prompt | llm_with_tools

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```python
ai_msg = await chain.ainvoke({"question": "whats the negation of the negation of 3"})
ai_msg.tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;negate&#x27;,
  &#x27;args&#x27;: {&#x27;a&#x27;: 3},
  &#x27;id&#x27;: &#x27;call_uMSdoTl6ehfHh5a6JQUb2NoZ&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;}]

``` Looking at the LangSmith trace, we can see that relevant examples were pulled in in the similar_examples step and passed as messages to ChatOpenAI: [https://smith.langchain.com/public/9585e30f-765a-4ed9-b964-2211420cd2f8/r/fdea98d6-e90f-49d4-ac22-dfd012e9e0d9](https://smith.langchain.com/public/9585e30f-765a-4ed9-b964-2211420cd2f8/r/fdea98d6-e90f-49d4-ac22-dfd012e9e0d9).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/example_selectors_langsmith.ipynb)[Setup](#setup)
- [Querying dataset](#querying-dataset)
- [Creating dynamic few-shot prompts](#creating-dynamic-few-shot-prompts)

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