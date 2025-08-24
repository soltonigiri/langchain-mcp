How to pass through arguments from one step to the next | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/passthrough.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/passthrough.ipynb)How to pass through arguments from one step to the next PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Expression Language (LCEL)](/docs/concepts/lcel/) [Chaining runnables](/docs/how_to/sequence/) [Calling runnables in parallel](/docs/how_to/parallel/) [Custom functions](/docs/how_to/functions/) When composing chains with several steps, sometimes you will want to pass data from previous steps unchanged for use as input to a later step. The [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) class allows you to do just this, and is typically is used in conjunction with a [RunnableParallel](/docs/how_to/parallel/) to pass data through to a later step in your constructed chains. See the example below:

```python
%pip install -qU langchain langchain-openai

import os
from getpass import getpass

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()

```

```python
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

runnable = RunnableParallel(
    passed=RunnablePassthrough(),
    modified=lambda x: x["num"] + 1,
)

runnable.invoke({"num": 1})

```API Reference:**[RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
{&#x27;passed&#x27;: {&#x27;num&#x27;: 1}, &#x27;modified&#x27;: 2}

```**As seen above, passed key was called with RunnablePassthrough() and so it simply passed on {&#x27;num&#x27;: 1}. We also set a second key in the map with modified. This uses a lambda to set a single value adding 1 to the num, which resulted in modified key with the value of 2. Retrieval Example[​](#retrieval-example) In the example below, we see a more real-world use case where we use RunnablePassthrough along with RunnableParallel in a chain to properly format inputs to a prompt:

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

``` Here the input to prompt is expected to be a map with keys "context" and "question". The user input is just the question. So we need to get the context using our retriever and passthrough the user input under the "question" key. The RunnablePassthrough allows us to pass on the user&#x27;s question to the prompt and model. ## Next steps[​](#next-steps) Now you&#x27;ve learned how to pass data through your chains to help format the data flowing through your chains. To learn more, see the other how-to guides on runnables in this section.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/passthrough.ipynb)[Retrieval Example](#retrieval-example)
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