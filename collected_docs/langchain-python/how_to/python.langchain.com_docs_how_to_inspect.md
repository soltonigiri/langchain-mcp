How to inspect runnables | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/inspect.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/inspect.ipynb)How to inspect runnables PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Expression Language (LCEL)](/docs/concepts/lcel/) [Chaining runnables](/docs/how_to/sequence/) Once you create a runnable with [LangChain Expression Language](/docs/concepts/lcel/), you may often want to inspect it to get a better sense for what is going on. This notebook covers some methods for doing so. This guide shows some ways you can programmatically introspect the internal steps of chains. If you are instead interested in debugging issues in your chain, see [this section](/docs/how_to/debugging/) instead. First, let&#x27;s create an example chain. We will create one that does retrieval:

```python
%pip install -qU langchain langchain-openai faiss-cpu tiktoken

```

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
prompt = ChatPromptTemplate.from_template(template)

model = ChatOpenAI()

chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) ## Get a graph[​](#get-a-graph) You can use the get_graph() method to get a graph representation of the runnable:

```python
chain.get_graph()

``` ## Print a graph[​](#print-a-graph) While that is not super legible, you can use the print_ascii() method to show that graph in a way that&#x27;s easier to understand:

```python
chain.get_graph().print_ascii()

```

```output
+---------------------------------+
           | Parallel<context,question>Input |
           +---------------------------------+
                    **               **
                 ***                   ***
               **                         **
+----------------------+              +-------------+
| VectorStoreRetriever |              | Passthrough |
+----------------------+              +-------------+
                    **               **
                      ***         ***
                         **     **
           +----------------------------------+
           | Parallel<context,question>Output |
           +----------------------------------+
                             *
                             *
                             *
                  +--------------------+
                  | ChatPromptTemplate |
                  +--------------------+
                             *
                             *
                             *
                      +------------+
                      | ChatOpenAI |
                      +------------+
                             *
                             *
                             *
                   +-----------------+
                   | StrOutputParser |
                   +-----------------+
                             *
                             *
                             *
                +-----------------------+
                | StrOutputParserOutput |
                +-----------------------+

``` ## Get the prompts[​](#get-the-prompts) You may want to see just the prompts that are used in a chain with the get_prompts() method:

```python
chain.get_prompts()

```

```output
[ChatPromptTemplate(input_variables=[&#x27;context&#x27;, &#x27;question&#x27;], messages=[HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=[&#x27;context&#x27;, &#x27;question&#x27;], template=&#x27;Answer the question based only on the following context:\n{context}\n\nQuestion: {question}\n&#x27;))])]

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to introspect your composed LCEL chains. Next, check out the other how-to guides on runnables in this section, or the related how-to guide on [debugging your chains](/docs/how_to/debugging/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/inspect.ipynb)[Get a graph](#get-a-graph)
- [Print a graph](#print-a-graph)
- [Get the prompts](#get-the-prompts)
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