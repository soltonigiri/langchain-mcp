How to bind model-specific tools | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_model_specific.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_model_specific.ipynb) # How to bind model-specific tools Providers adopt different conventions for formatting tool schemas. For instance, OpenAI uses a format like this: type: The type of the tool. At the time of writing, this is always "function".

- function: An object containing tool parameters.

- function.name: The name of the schema to output.

- function.description: A high level description of the schema to output.

- function.parameters: The nested details of the schema you want to extract, formatted as a [JSON schema](https://json-schema.org/) dict.

We can bind this model-specific format directly to the model as well if preferred. Here&#x27;s an example:

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI()

model_with_tools = model.bind(
    tools=[
        {
            "type": "function",
            "function": {
                "name": "multiply",
                "description": "Multiply two integers together.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "a": {"type": "number", "description": "First integer"},
                        "b": {"type": "number", "description": "Second integer"},
                    },
                    "required": ["a", "b"],
                },
            },
        }
    ]
)

model_with_tools.invoke("Whats 119 times 8?")

```

```output
AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_mn4ELw1NbuE0DFYhIeK0GrPe&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"a":119,"b":8}&#x27;, &#x27;name&#x27;: &#x27;multiply&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 17, &#x27;prompt_tokens&#x27;: 62, &#x27;total_tokens&#x27;: 79}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-353e8a9a-7125-4f94-8c68-4f3da4c21120-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;multiply&#x27;, &#x27;args&#x27;: {&#x27;a&#x27;: 119, &#x27;b&#x27;: 8}, &#x27;id&#x27;: &#x27;call_mn4ELw1NbuE0DFYhIeK0GrPe&#x27;}])

``` This is functionally equivalent to the `bind_tools()` method.

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tools_model_specific.ipynb)Community

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