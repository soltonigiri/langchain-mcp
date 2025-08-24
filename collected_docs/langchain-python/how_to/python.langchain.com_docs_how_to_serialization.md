How to save and load LangChain objects | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/serialization.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/serialization.ipynb)How to save and load LangChain objects LangChain classes implement standard methods for serialization. Serializing LangChain objects using these methods confer some advantages: Secrets, such as API keys, are separated from other parameters and can be loaded back to the object on de-serialization; De-serialization is kept compatible across package versions, so objects that were serialized with one version of LangChain can be properly de-serialized with another. To save and load LangChain objects using this system, use the dumpd, dumps, load, and loads functions in the [load module](https://python.langchain.com/api_reference/core/load.html) of langchain-core. These functions support JSON and JSON-serializable objects. All LangChain objects that inherit from [Serializable](https://python.langchain.com/api_reference/core/load/langchain_core.load.serializable.Serializable.html) are JSON-serializable. Examples include [messages](https://python.langchain.com/api_reference//python/core_api_reference.html#module-langchain_core.messages), [document objects](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) (e.g., as returned from [retrievers](/docs/concepts/retrievers/)), and most [Runnables](/docs/concepts/lcel/), such as chat models, retrievers, and [chains](/docs/how_to/sequence/) implemented with the LangChain Expression Language. Below we walk through an example with a simple [LLM chain](/docs/tutorials/llm_chain/). cautionDe-serialization using load and loads can instantiate any serializable LangChain object. Only use this feature with trusted inputs!De-serialization is a beta feature and is subject to change.

```python
from langchain_core.load import dumpd, dumps, load, loads
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "Translate the following into {language}:"),
        ("user", "{text}"),
    ],
)

llm = ChatOpenAI(model="gpt-4o-mini", api_key="llm-api-key")

chain = prompt | llm

```API Reference:**[dumpd](https://python.langchain.com/api_reference/core/load/langchain_core.load.dump.dumpd.html) | [dumps](https://python.langchain.com/api_reference/core/load/langchain_core.load.dump.dumps.html) | [load](https://python.langchain.com/api_reference/core/load/langchain_core.load.load.load.html) | [loads](https://python.langchain.com/api_reference/core/load/langchain_core.load.load.loads.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) ## Saving objects[​](#saving-objects) ### To json[​](#to-json)

```python
string_representation = dumps(chain, pretty=True)
print(string_representation[:500])

```

```output
{
  "lc": 1,
  "type": "constructor",
  "id": [
    "langchain",
    "schema",
    "runnable",
    "RunnableSequence"
  ],
  "kwargs": {
    "first": {
      "lc": 1,
      "type": "constructor",
      "id": [
        "langchain",
        "prompts",
        "chat",
        "ChatPromptTemplate"
      ],
      "kwargs": {
        "input_variables": [
          "language",
          "text"
        ],
        "messages": [
          {
            "lc": 1,
            "type": "constructor",

``` ### To a json-serializable Python dict[​](#to-a-json-serializable-python-dict)

```python
dict_representation = dumpd(chain)

print(type(dict_representation))

```

```output
<class &#x27;dict&#x27;>

``` ### To disk[​](#to-disk)

```python
import json

with open("/tmp/chain.json", "w") as fp:
    json.dump(string_representation, fp)

``` Note that the API key is withheld from the serialized representations. Parameters that are considered secret are specified by the .lc_secrets attribute of the LangChain object:

```python
chain.last.lc_secrets

```

```output
{&#x27;openai_api_key&#x27;: &#x27;OPENAI_API_KEY&#x27;}

``` ## Loading objects[​](#loading-objects) Specifying secrets_map in load and loads will load the corresponding secrets onto the de-serialized LangChain object. ### From string[​](#from-string)

```python
chain = loads(string_representation, secrets_map={"OPENAI_API_KEY": "llm-api-key"})

``` ### From dict[​](#from-dict)

```python
chain = load(dict_representation, secrets_map={"OPENAI_API_KEY": "llm-api-key"})

``` ### From disk[​](#from-disk)

```python
with open("/tmp/chain.json", "r") as fp:
    chain = loads(json.load(fp), secrets_map={"OPENAI_API_KEY": "llm-api-key"})

``` Note that we recover the API key specified at the start of the guide:

```python
chain.last.openai_api_key.get_secret_value()

```

```output
&#x27;llm-api-key&#x27;

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/serialization.ipynb)[Saving objects](#saving-objects)[To json](#to-json)
- [To a json-serializable Python dict](#to-a-json-serializable-python-dict)
- [To disk](#to-disk)

- [Loading objects](#loading-objects)[From string](#from-string)
- [From dict](#from-dict)
- [From disk](#from-disk)

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