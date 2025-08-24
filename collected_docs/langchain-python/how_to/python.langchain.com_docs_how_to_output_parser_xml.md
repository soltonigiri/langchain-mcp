How to parse XML output | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_xml.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_xml.ipynb)How to parse XML output PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) [Output parsers](/docs/concepts/output_parsers/) [Prompt templates](/docs/concepts/prompt_templates/) [Structured output](/docs/how_to/structured_output/) [Chaining runnables together](/docs/how_to/sequence/) LLMs from different providers often have different strengths depending on the specific data they are trained on. This also means that some may be "better" and more reliable at generating output in formats other than JSON. This guide shows you how to use the [XMLOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.xml.XMLOutputParser.html) to prompt models for XML output, then and [parse](/docs/concepts/output_parsers/) that output into a usable format. noteKeep in mind that large language models are leaky abstractions! You&#x27;ll have to use an LLM with sufficient capacity to generate well-formed XML. In the following examples, we use Anthropic&#x27;s Claude-2 model ([https://docs.anthropic.com/claude/docs](https://docs.anthropic.com/claude/docs)), which is one such model that is optimized for XML tags.

```python
%pip install -qU langchain langchain-anthropic

import os
from getpass import getpass

if "ANTHROPIC_API_KEY" not in os.environ:
    os.environ["ANTHROPIC_API_KEY"] = getpass()

``` Let&#x27;s start with a simple request to the model.

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.output_parsers import XMLOutputParser
from langchain_core.prompts import PromptTemplate

model = ChatAnthropic(model="claude-2.1", max_tokens_to_sample=512, temperature=0.1)

actor_query = "Generate the shortened filmography for Tom Hanks."

output = model.invoke(
    f"""{actor_query}
Please enclose the movies in <movie></movie> tags"""
)

print(output.content)

```API Reference:**[XMLOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.xml.XMLOutputParser.html) | [PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```output
Here is the shortened filmography for Tom Hanks, with movies enclosed in XML tags:

<movie>Splash</movie>
<movie>Big</movie>
<movie>A League of Their Own</movie>
<movie>Sleepless in Seattle</movie>
<movie>Forrest Gump</movie>
<movie>Toy Story</movie>
<movie>Apollo 13</movie>
<movie>Saving Private Ryan</movie>
<movie>Cast Away</movie>
<movie>The Da Vinci Code</movie>

``` This actually worked pretty well! But it would be nice to parse that XML into a more easily usable format. We can use the XMLOutputParser to both add default format instructions to the prompt and parse outputted XML into a dict:

```python
parser = XMLOutputParser()

# We will add these instructions to the prompt below
parser.get_format_instructions()

```

```output
&#x27;The output should be formatted as a XML file.\n1. Output should conform to the tags below. \n2. If tags are not given, make them on your own.\n3. Remember to always open and close all the tags.\n\nAs an example, for the tags ["foo", "bar", "baz"]:\n1. String "<foo>\n   <bar>\n      <baz></baz>\n   </bar>\n</foo>" is a well-formatted instance of the schema. \n2. String "<foo>\n   <bar>\n   </foo>" is a badly-formatted instance.\n3. String "<foo>\n   <tag>\n   </tag>\n</foo>" is a badly-formatted instance.\n\nHere are the output tags:\n\`\`\`\nNone\n\`\`\`&#x27;

```

```python
prompt = PromptTemplate(
    template="""{query}\n{format_instructions}""",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

chain = prompt | model | parser

output = chain.invoke({"query": actor_query})
print(output)

```

```output
{&#x27;filmography&#x27;: [{&#x27;movie&#x27;: [{&#x27;title&#x27;: &#x27;Big&#x27;}, {&#x27;year&#x27;: &#x27;1988&#x27;}]}, {&#x27;movie&#x27;: [{&#x27;title&#x27;: &#x27;Forrest Gump&#x27;}, {&#x27;year&#x27;: &#x27;1994&#x27;}]}, {&#x27;movie&#x27;: [{&#x27;title&#x27;: &#x27;Toy Story&#x27;}, {&#x27;year&#x27;: &#x27;1995&#x27;}]}, {&#x27;movie&#x27;: [{&#x27;title&#x27;: &#x27;Saving Private Ryan&#x27;}, {&#x27;year&#x27;: &#x27;1998&#x27;}]}, {&#x27;movie&#x27;: [{&#x27;title&#x27;: &#x27;Cast Away&#x27;}, {&#x27;year&#x27;: &#x27;2000&#x27;}]}]}

``` We can also add some tags to tailor the output to our needs. You can and should experiment with adding your own formatting hints in the other parts of your prompt to either augment or replace the default instructions:

```python
parser = XMLOutputParser(tags=["movies", "actor", "film", "name", "genre"])

# We will add these instructions to the prompt below
parser.get_format_instructions()

```

```output
&#x27;The output should be formatted as a XML file.\n1. Output should conform to the tags below. \n2. If tags are not given, make them on your own.\n3. Remember to always open and close all the tags.\n\nAs an example, for the tags ["foo", "bar", "baz"]:\n1. String "<foo>\n   <bar>\n      <baz></baz>\n   </bar>\n</foo>" is a well-formatted instance of the schema. \n2. String "<foo>\n   <bar>\n   </foo>" is a badly-formatted instance.\n3. String "<foo>\n   <tag>\n   </tag>\n</foo>" is a badly-formatted instance.\n\nHere are the output tags:\n\`\`\`\n[\&#x27;movies\&#x27;, \&#x27;actor\&#x27;, \&#x27;film\&#x27;, \&#x27;name\&#x27;, \&#x27;genre\&#x27;]\n\`\`\`&#x27;

```

```python
prompt = PromptTemplate(
    template="""{query}\n{format_instructions}""",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

chain = prompt | model | parser

output = chain.invoke({"query": actor_query})

print(output)

```

```output
{&#x27;movies&#x27;: [{&#x27;actor&#x27;: [{&#x27;name&#x27;: &#x27;Tom Hanks&#x27;}, {&#x27;film&#x27;: [{&#x27;name&#x27;: &#x27;Forrest Gump&#x27;}, {&#x27;genre&#x27;: &#x27;Drama&#x27;}]}, {&#x27;film&#x27;: [{&#x27;name&#x27;: &#x27;Cast Away&#x27;}, {&#x27;genre&#x27;: &#x27;Adventure&#x27;}]}, {&#x27;film&#x27;: [{&#x27;name&#x27;: &#x27;Saving Private Ryan&#x27;}, {&#x27;genre&#x27;: &#x27;War&#x27;}]}]}]}

``` This output parser also supports streaming of partial chunks. Here&#x27;s an example:

```python
for s in chain.stream({"query": actor_query}):
    print(s)

```

```output
{&#x27;movies&#x27;: [{&#x27;actor&#x27;: [{&#x27;name&#x27;: &#x27;Tom Hanks&#x27;}]}]}
{&#x27;movies&#x27;: [{&#x27;actor&#x27;: [{&#x27;film&#x27;: [{&#x27;name&#x27;: &#x27;Forrest Gump&#x27;}]}]}]}
{&#x27;movies&#x27;: [{&#x27;actor&#x27;: [{&#x27;film&#x27;: [{&#x27;genre&#x27;: &#x27;Drama&#x27;}]}]}]}
{&#x27;movies&#x27;: [{&#x27;actor&#x27;: [{&#x27;film&#x27;: [{&#x27;name&#x27;: &#x27;Cast Away&#x27;}]}]}]}
{&#x27;movies&#x27;: [{&#x27;actor&#x27;: [{&#x27;film&#x27;: [{&#x27;genre&#x27;: &#x27;Adventure&#x27;}]}]}]}
{&#x27;movies&#x27;: [{&#x27;actor&#x27;: [{&#x27;film&#x27;: [{&#x27;name&#x27;: &#x27;Saving Private Ryan&#x27;}]}]}]}
{&#x27;movies&#x27;: [{&#x27;actor&#x27;: [{&#x27;film&#x27;: [{&#x27;genre&#x27;: &#x27;War&#x27;}]}]}]}

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to prompt a model to return XML. Next, check out the [broader guide on obtaining structured output](/docs/how_to/structured_output/) for other related techniques.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/output_parser_xml.ipynb)[Next steps](#next-steps)

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