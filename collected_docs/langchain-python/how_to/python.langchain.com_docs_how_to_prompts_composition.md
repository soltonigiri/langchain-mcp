How to compose prompts together | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/prompts_composition.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/prompts_composition.ipynb)How to compose prompts together PrerequisitesThis guide assumes familiarity with the following concepts: [Prompt templates](/docs/concepts/prompt_templates/) LangChain provides a user friendly interface for composing different parts of [prompts](/docs/concepts/prompt_templates/) together. You can do this with either string prompts or chat prompts. Constructing prompts this way allows for easy reuse of components. String prompt composition[​](#string-prompt-composition) When working with string prompts, each template is joined together. You can work with either prompts directly or strings (the first element in the list needs to be a prompt).

```python
from langchain_core.prompts import PromptTemplate

prompt = (
    PromptTemplate.from_template("Tell me a joke about {topic}")
    + ", make it funny"
    + "\n\nand in {language}"
)

prompt

```API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```output
PromptTemplate(input_variables=[&#x27;language&#x27;, &#x27;topic&#x27;], template=&#x27;Tell me a joke about {topic}, make it funny\n\nand in {language}&#x27;)

```**

```python
prompt.format(topic="sports", language="spanish")

```

```output
&#x27;Tell me a joke about sports, make it funny\n\nand in spanish&#x27;

``` Chat prompt composition[​](#chat-prompt-composition) A chat prompt is made up of a list of messages. Similarly to the above example, we can concatenate chat prompt templates. Each new element is a new message in the final prompt. First, let&#x27;s initialize the a [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) with a [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html).

```python
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

prompt = SystemMessage(content="You are a nice pirate")

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) You can then easily create a pipeline combining it with other messages *or* message templates. Use a Message when there is no variables to be formatted, use a MessageTemplate when there are variables to be formatted. You can also use just a string (note: this will automatically get inferred as a [HumanMessagePromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.HumanMessagePromptTemplate.html).)

```python
new_prompt = (
    prompt + HumanMessage(content="hi") + AIMessage(content="what?") + "{input}"
)

```**Under the hood, this creates an instance of the ChatPromptTemplate class, so you can use it just as you did before!

```python
new_prompt.format_messages(input="i said hi")

```

```output
[SystemMessage(content=&#x27;You are a nice pirate&#x27;),
 HumanMessage(content=&#x27;hi&#x27;),
 AIMessage(content=&#x27;what?&#x27;),
 HumanMessage(content=&#x27;i said hi&#x27;)]

``` Using PipelinePrompt[​](#using-pipelineprompt) DeprecatedPipelinePromptTemplate is deprecated; for more information, please refer to [PipelinePromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.pipeline.PipelinePromptTemplate.html). LangChain includes a class called [PipelinePromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.pipeline.PipelinePromptTemplate.html), which can be useful when you want to reuse parts of prompts. A PipelinePrompt consists of two main parts: Final prompt: The final prompt that is returned Pipeline prompts: A list of tuples, consisting of a string name and a prompt template. Each prompt template will be formatted and then passed to future prompt templates as a variable with the same name.

```python
from langchain_core.prompts import PipelinePromptTemplate, PromptTemplate

full_template = """{introduction}

{example}

{start}"""
full_prompt = PromptTemplate.from_template(full_template)

introduction_template = """You are impersonating {person}."""
introduction_prompt = PromptTemplate.from_template(introduction_template)

example_template = """Here&#x27;s an example of an interaction:

Q: {example_q}
A: {example_a}"""
example_prompt = PromptTemplate.from_template(example_template)

start_template = """Now, do this for real!

Q: {input}
A:"""
start_prompt = PromptTemplate.from_template(start_template)

input_prompts = [
    ("introduction", introduction_prompt),
    ("example", example_prompt),
    ("start", start_prompt),
]
pipeline_prompt = PipelinePromptTemplate(
    final_prompt=full_prompt, pipeline_prompts=input_prompts
)

pipeline_prompt.input_variables

```API Reference:**[PipelinePromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.pipeline.PipelinePromptTemplate.html) | [PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```output
[&#x27;person&#x27;, &#x27;example_a&#x27;, &#x27;example_q&#x27;, &#x27;input&#x27;]

```

```python
print(
    pipeline_prompt.format(
        person="Elon Musk",
        example_q="What&#x27;s your favorite car?",
        example_a="Tesla",
        input="What&#x27;s your favorite social media site?",
    )
)

```

```output
You are impersonating Elon Musk.

Here&#x27;s an example of an interaction:

Q: What&#x27;s your favorite car?
A: Tesla

Now, do this for real!

Q: What&#x27;s your favorite social media site?
A:

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to compose prompts together. Next, check out the other how-to guides on prompt templates in this section, like [adding few-shot examples to your prompt templates](/docs/how_to/few_shot_examples_chat/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/prompts_composition.ipynb)[String prompt composition](#string-prompt-composition)
- [Chat prompt composition](#chat-prompt-composition)
- [Using PipelinePrompt](#using-pipelineprompt)
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