How to add default invocation args to a Runnable | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/binding.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/binding.ipynb)How to add default invocation args to a Runnable PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Expression Language (LCEL)](/docs/concepts/lcel/) [Chaining runnables](/docs/how_to/sequence/) [Tool calling](/docs/how_to/tool_calling/) Sometimes we want to invoke a [Runnable](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html) within a [RunnableSequence](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableSequence.html) with constant arguments that are not part of the output of the preceding Runnable in the sequence, and which are not part of the user input. We can use the [Runnable.bind()](https://python.langchain.com/api_reference/langchain_core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.bind) method to set these arguments ahead of time. Binding stop sequences[​](#binding-stop-sequences) Suppose we have a simple prompt + model chain:

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Write out the following equation using algebraic symbols then solve it. Use the format\n\nEQUATION:...\nSOLUTION:...\n\n",
        ),
        ("human", "{equation_statement}"),
    ]
)

model = ChatOpenAI(temperature=0)

runnable = (
    {"equation_statement": RunnablePassthrough()} | prompt | model | StrOutputParser()
)

print(runnable.invoke("x raised to the third plus seven equals 12"))

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
EQUATION: x^3 + 7 = 12

SOLUTION:
Subtract 7 from both sides:
x^3 = 5

Take the cube root of both sides:
x = ∛5

``` and want to call the model with certain stop words so that we shorten the output as is useful in certain types of prompting techniques. While we can pass some arguments into the constructor, other runtime args use the .bind() method as follows:

```python
runnable = (
    {"equation_statement": RunnablePassthrough()}
    | prompt
    | model.bind(stop="SOLUTION")
    | StrOutputParser()
)

print(runnable.invoke("x raised to the third plus seven equals 12"))

```

```output
EQUATION: x^3 + 7 = 12

``` What you can bind to a Runnable will depend on the extra parameters you can pass when invoking it. ## Attaching OpenAI tools[​](#attaching-openai-tools) Another common use-case is tool calling. While you should generally use the [.bind_tools()](/docs/how_to/tool_calling/) method for tool-calling models, you can also bind provider-specific args directly if you want lower level control:

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        },
    }
]

```

```python
model = ChatOpenAI(model="gpt-4o-mini").bind(tools=tools)
model.invoke("What&#x27;s the weather in SF, NYC and LA?")

```

```output
AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_z0OU2CytqENVrRTI6T8DkI3u&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"location": "San Francisco, CA", "unit": "celsius"}&#x27;, &#x27;name&#x27;: &#x27;get_current_weather&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}, {&#x27;id&#x27;: &#x27;call_ft96IJBh0cMKkQWrZjNg4bsw&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"location": "New York, NY", "unit": "celsius"}&#x27;, &#x27;name&#x27;: &#x27;get_current_weather&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}, {&#x27;id&#x27;: &#x27;call_tfbtGgCLmuBuWgZLvpPwvUMH&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"location": "Los Angeles, CA", "unit": "celsius"}&#x27;, &#x27;name&#x27;: &#x27;get_current_weather&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}]}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 84, &#x27;prompt_tokens&#x27;: 85, &#x27;total_tokens&#x27;: 169}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_77a673219d&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-d57ad5fa-b52a-4822-bc3e-74f838697e18-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;get_current_weather&#x27;, &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;San Francisco, CA&#x27;, &#x27;unit&#x27;: &#x27;celsius&#x27;}, &#x27;id&#x27;: &#x27;call_z0OU2CytqENVrRTI6T8DkI3u&#x27;}, {&#x27;name&#x27;: &#x27;get_current_weather&#x27;, &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;New York, NY&#x27;, &#x27;unit&#x27;: &#x27;celsius&#x27;}, &#x27;id&#x27;: &#x27;call_ft96IJBh0cMKkQWrZjNg4bsw&#x27;}, {&#x27;name&#x27;: &#x27;get_current_weather&#x27;, &#x27;args&#x27;: {&#x27;location&#x27;: &#x27;Los Angeles, CA&#x27;, &#x27;unit&#x27;: &#x27;celsius&#x27;}, &#x27;id&#x27;: &#x27;call_tfbtGgCLmuBuWgZLvpPwvUMH&#x27;}])

``` ## Next steps[​](#next-steps) You now know how to bind runtime arguments to a Runnable. To learn more, see the other how-to guides on runnables in this section, including: [Using configurable fields and alternatives](/docs/how_to/configure/) to change parameters of a step in a chain, or even swap out entire steps, at runtime

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/binding.ipynb)

- [Binding stop sequences](#binding-stop-sequences)
- [Attaching OpenAI tools](#attaching-openai-tools)
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