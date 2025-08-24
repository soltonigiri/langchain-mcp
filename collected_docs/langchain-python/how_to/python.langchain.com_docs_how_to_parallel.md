How to invoke runnables in parallel | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/parallel.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/parallel.ipynb)How to invoke runnables in parallel PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Expression Language (LCEL)](/docs/concepts/lcel/) [Chaining runnables](/docs/how_to/sequence/) The [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html) primitive is essentially a dict whose values are runnables (or things that can be coerced to runnables, like functions). It runs all of its values in parallel, and each value is called with the overall input of the RunnableParallel. The final return value is a dict with the results of each value under its appropriate key. Formatting with RunnableParallels[​](#formatting-with-runnableparallels) RunnableParallels are useful for parallelizing operations, but can also be useful for manipulating the output of one Runnable to match the input format of the next Runnable in a sequence. You can use them to split or fork the chain so that multiple components can process the input in parallel. Later, other components can join or merge the results to synthesize a final response. This type of chain creates a computation graph that looks like the following:

```text
Input
      / \
     /   \
 Branch1 Branch2
     \   /
      \ /
      Combine

``` Below, the input to prompt is expected to be a map with keys "context" and "question". The user input is just the question. So we need to get the context using our retriever and passthrough the user input under the "question" key.

```python
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

vectorstore = FAISS.from_texts(
    ["harrison worked at kensho"], embedding=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()
template = """Answer the question based only on the following context:
{context}

Question: {question}
"""

# The prompt expects input with keys for "context" and "question"
prompt = ChatPromptTemplate.from_template(template)

model = ChatOpenAI()

retrieval_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

retrieval_chain.invoke("where did harrison work?")

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
&#x27;Harrison worked at Kensho.&#x27;

```**tipNote that when composing a RunnableParallel with another Runnable we don&#x27;t even need to wrap our dictionary in the RunnableParallel class — the type conversion is handled for us. In the context of a chain, these are equivalent:

```text
{"context": retriever, "question": RunnablePassthrough()}

```

```text
RunnableParallel({"context": retriever, "question": RunnablePassthrough()})

```

```text
RunnableParallel(context=retriever, question=RunnablePassthrough())

``` See the section on [coercion for more](/docs/how_to/sequence/#coercion). Using itemgetter as shorthand[​](#using-itemgetter-as-shorthand) Note that you can use Python&#x27;s itemgetter as shorthand to extract data from the map when combining with RunnableParallel. You can find more information about itemgetter in the [Python Documentation](https://docs.python.org/3/library/operator.html#operator.itemgetter). In the example below, we use itemgetter to extract specific keys from the map:

```python
from operator import itemgetter

from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

vectorstore = FAISS.from_texts(
    ["harrison worked at kensho"], embedding=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()

template = """Answer the question based only on the following context:
{context}

Question: {question}

Answer in the following language: {language}
"""
prompt = ChatPromptTemplate.from_template(template)

chain = (
    {
        "context": itemgetter("question") | retriever,
        "question": itemgetter("question"),
        "language": itemgetter("language"),
    }
    | prompt
    | model
    | StrOutputParser()
)

chain.invoke({"question": "where did harrison work", "language": "italian"})

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
&#x27;Harrison ha lavorato a Kensho.&#x27;

```**Parallelize steps[​](#parallelize-steps) RunnableParallels make it easy to execute multiple Runnables in parallel, and to return the output of these Runnables as a map.

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel
from langchain_openai import ChatOpenAI

model = ChatOpenAI()
joke_chain = ChatPromptTemplate.from_template("tell me a joke about {topic}") | model
poem_chain = (
    ChatPromptTemplate.from_template("write a 2-line poem about {topic}") | model
)

map_chain = RunnableParallel(joke=joke_chain, poem=poem_chain)

map_chain.invoke({"topic": "bear"})

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
{&#x27;joke&#x27;: AIMessage(content="Why don&#x27;t bears like fast food? Because they can&#x27;t catch it!", response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 15, &#x27;prompt_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 28}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_d9767fc5b9&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-fe024170-c251-4b7a-bfd4-64a3737c67f2-0&#x27;),
 &#x27;poem&#x27;: AIMessage(content=&#x27;In the quiet of the forest, the bear roams free\nMajestic and wild, a sight to see.&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 24, &#x27;prompt_tokens&#x27;: 15, &#x27;total_tokens&#x27;: 39}, &#x27;model_name&#x27;: &#x27;gpt-3.5-turbo&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_c2295e73ad&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-2707913e-a743-4101-b6ec-840df4568a76-0&#x27;)}

``` ## Parallelism[​](#parallelism) RunnableParallel are also useful for running independent processes in parallel, since each Runnable in the map is executed in parallel. For example, we can see our earlier joke_chain, poem_chain and map_chain all have about the same runtime, even though map_chain executes both of the other two.

```python
%%timeit

joke_chain.invoke({"topic": "bear"})

```

```output
610 ms ± 64 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)

```

```python
%%timeit

poem_chain.invoke({"topic": "bear"})

```

```output
599 ms ± 73.3 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)

```

```python
%%timeit

map_chain.invoke({"topic": "bear"})

```

```output
643 ms ± 77.8 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)

``` ## Next steps[​](#next-steps) You now know some ways to format and parallelize chain steps with RunnableParallel. To learn more, see the other how-to guides on runnables in this section.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/parallel.ipynb)[Formatting with RunnableParallels](#formatting-with-runnableparallels)
- [Using itemgetter as shorthand](#using-itemgetter-as-shorthand)
- [Parallelize steps](#parallelize-steps)
- [Parallelism](#parallelism)
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