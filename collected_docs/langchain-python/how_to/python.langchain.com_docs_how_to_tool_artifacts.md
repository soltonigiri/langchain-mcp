How to return artifacts from a tool | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_artifacts.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tool_artifacts.ipynb)How to return artifacts from a tool PrerequisitesThis guide assumes familiarity with the following concepts: [ToolMessage](/docs/concepts/messages/#toolmessage) [Tools](/docs/concepts/tools/) [Function/tool calling](/docs/concepts/tool_calling/) [Tools](/docs/concepts/tools/) are utilities that can be [called by a model](/docs/concepts/tool_calling/), and whose outputs are designed to be fed back to a model. Sometimes, however, there are artifacts of a tool&#x27;s execution that we want to make accessible to downstream components in our chain or agent, but that we don&#x27;t want to expose to the model itself. For example if a tool returns a custom object, a dataframe or an image, we may want to pass some metadata about this output to the model without passing the actual output to the model. At the same time, we may want to be able to access this full output elsewhere, for example in downstream tools. The Tool and [ToolMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html) interfaces make it possible to distinguish between the parts of the tool output meant for the model (this is the ToolMessage.content) and those parts which are meant for use outside the model (ToolMessage.artifact). Requires langchain-core >= 0.2.19This functionality was added in langchain-core == 0.2.19. Please make sure your package is up to date. Defining the tool[​](#defining-the-tool) If we want our tool to distinguish between message content and other artifacts, we need to specify response_format="content_and_artifact" when defining our tool and make sure that we return a tuple of (content, artifact):

```python
%pip install -qU "langchain-core>=0.2.19"

```

```python
import random
from typing import List, Tuple

from langchain_core.tools import tool

@tool(response_format="content_and_artifact")
def generate_random_ints(min: int, max: int, size: int) -> Tuple[str, List[int]]:
    """Generate size random ints in the range [min, max]."""
    array = [random.randint(min, max) for _ in range(size)]
    content = f"Successfully generated array of {size} random ints in [{min}, {max}]."
    return content, array

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html) ## Invoking the tool with ToolCall[​](#invoking-the-tool-with-toolcall) If we directly invoke our tool with just the tool arguments, you&#x27;ll notice that we only get back the content part of the Tool output:

```python
generate_random_ints.invoke({"min": 0, "max": 9, "size": 10})

```**

```output
&#x27;Successfully generated array of 10 random ints in [0, 9].&#x27;

``` In order to get back both the content and the artifact, we need to invoke our model with a ToolCall (which is just a dictionary with "name", "args", "id" and "type" keys), which has additional info needed to generate a ToolMessage like the tool call ID:

```python
generate_random_ints.invoke(
    {
        "name": "generate_random_ints",
        "args": {"min": 0, "max": 9, "size": 10},
        "id": "123",  # required
        "type": "tool_call",  # required
    }
)

```

```output
ToolMessage(content=&#x27;Successfully generated array of 10 random ints in [0, 9].&#x27;, name=&#x27;generate_random_ints&#x27;, tool_call_id=&#x27;123&#x27;, artifact=[2, 8, 0, 6, 0, 0, 1, 5, 0, 0])

``` Using with a model[​](#using-with-a-model) With a [tool-calling model](/docs/how_to/tool_calling/), we can easily use a model to call our Tool and generate ToolMessages: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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
llm_with_tools = llm.bind_tools([generate_random_ints])

ai_msg = llm_with_tools.invoke("generate 6 positive ints less than 25")
ai_msg.tool_calls

```

```output
[{&#x27;name&#x27;: &#x27;generate_random_ints&#x27;,
  &#x27;args&#x27;: {&#x27;min&#x27;: 1, &#x27;max&#x27;: 24, &#x27;size&#x27;: 6},
  &#x27;id&#x27;: &#x27;toolu_01EtALY3Wz1DVYhv1TLvZGvE&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;}]

```

```python
generate_random_ints.invoke(ai_msg.tool_calls[0])

```

```output
ToolMessage(content=&#x27;Successfully generated array of 6 random ints in [1, 24].&#x27;, name=&#x27;generate_random_ints&#x27;, tool_call_id=&#x27;toolu_01EtALY3Wz1DVYhv1TLvZGvE&#x27;, artifact=[2, 20, 23, 8, 1, 15])

``` If we just pass in the tool call args, we&#x27;ll only get back the content:

```python
generate_random_ints.invoke(ai_msg.tool_calls[0]["args"])

```

```output
&#x27;Successfully generated array of 6 random ints in [1, 24].&#x27;

``` If we wanted to declaratively create a chain, we could do this:

```python
from operator import attrgetter

chain = llm_with_tools | attrgetter("tool_calls") | generate_random_ints.map()

chain.invoke("give me a random number between 1 and 5")

```

```output
[ToolMessage(content=&#x27;Successfully generated array of 1 random ints in [1, 5].&#x27;, name=&#x27;generate_random_ints&#x27;, tool_call_id=&#x27;toolu_01FwYhnkwDPJPbKdGq4ng6uD&#x27;, artifact=[5])]

``` Creating from BaseTool class[​](#creating-from-basetool-class) If you want to create a BaseTool object directly, instead of decorating a function with @tool, you can do so like this:

```python
from langchain_core.tools import BaseTool

class GenerateRandomFloats(BaseTool):
    name: str = "generate_random_floats"
    description: str = "Generate size random floats in the range [min, max]."
    response_format: str = "content_and_artifact"

    ndigits: int = 2

    def _run(self, min: float, max: float, size: int) -> Tuple[str, List[float]]:
        range_ = max - min
        array = [
            round(min + (range_ * random.random()), ndigits=self.ndigits)
            for _ in range(size)
        ]
        content = f"Generated {size} floats in [{min}, {max}], rounded to {self.ndigits} decimals."
        return content, array

    # Optionally define an equivalent async method

    # async def _arun(self, min: float, max: float, size: int) -> Tuple[str, List[float]]:
    #     ...

```API Reference:**[BaseTool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.base.BaseTool.html)

```python
rand_gen = GenerateRandomFloats(ndigits=4)
rand_gen.invoke({"min": 0.1, "max": 3.3333, "size": 3})

```

```output
&#x27;Generated 3 floats in [0.1, 3.3333], rounded to 4 decimals.&#x27;

```

```python
rand_gen.invoke(
    {
        "name": "generate_random_floats",
        "args": {"min": 0.1, "max": 3.3333, "size": 3},
        "id": "123",
        "type": "tool_call",
    }
)

```

```output
ToolMessage(content=&#x27;Generated 3 floats in [0.1, 3.3333], rounded to 4 decimals.&#x27;, name=&#x27;generate_random_floats&#x27;, tool_call_id=&#x27;123&#x27;, artifact=[1.5789, 2.464, 2.2719])

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tool_artifacts.ipynb)[Defining the tool](#defining-the-tool)
- [Invoking the tool with ToolCall](#invoking-the-tool-with-toolcall)
- [Using with a model](#using-with-a-model)
- [Creating from BaseTool class](#creating-from-basetool-class)

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