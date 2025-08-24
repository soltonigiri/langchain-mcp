How to add retrieval to chatbots | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/chatbots_retrieval.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/chatbots_retrieval.ipynb)How to add retrieval to chatbots [Retrieval](/docs/concepts/retrieval/) is a common technique chatbots use to augment their responses with data outside a chat model&#x27;s training data. This section will cover how to implement retrieval in the context of chatbots, but it&#x27;s worth noting that retrieval is a very subtle and deep topic - we encourage you to explore [other parts of the documentation](/docs/how_to/#qa-with-rag) that go into greater depth! Setup[​](#setup) You&#x27;ll need to install a few packages, and have your OpenAI API key set as an environment variable named OPENAI_API_KEY:

```python
%pip install -qU langchain langchain-openai langchain-chroma beautifulsoup4

# Set env var OPENAI_API_KEY or load from a .env file:
import dotenv

dotenv.load_dotenv()

```

```output
[33mWARNING: You are using pip version 22.0.4; however, version 23.3.2 is available.
You should consider upgrading via the &#x27;/Users/jacoblee/.pyenv/versions/3.10.5/bin/python -m pip install --upgrade pip&#x27; command.[0m[33m
[0mNote: you may need to restart the kernel to use updated packages.

```

```output
True

``` Let&#x27;s also set up a chat model that we&#x27;ll use for the below examples.

```python
from langchain_openai import ChatOpenAI

chat = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

``` Creating a retriever[​](#creating-a-retriever) We&#x27;ll use [the LangSmith documentation](https://docs.smith.langchain.com/overview) as source material and store the content in a [vector store](/docs/concepts/vectorstores/) for later retrieval. Note that this example will gloss over some of the specifics around parsing and storing a data source - you can see more [in-depth documentation on creating retrieval systems here](/docs/how_to/#qa-with-rag). Let&#x27;s use a document loader to pull text from the docs:

```python
from langchain_community.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://docs.smith.langchain.com/overview")
data = loader.load()

``` Next, we split it into smaller chunks that the LLM&#x27;s context window can handle and store it in a vector database:

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
all_splits = text_splitter.split_documents(data)

``` Then we embed and store those chunks in a vector database:

```python
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

vectorstore = Chroma.from_documents(documents=all_splits, embedding=OpenAIEmbeddings())

``` And finally, let&#x27;s create a retriever from our initialized vectorstore:

```python
# k is the number of chunks to retrieve
retriever = vectorstore.as_retriever(k=4)

docs = retriever.invoke("Can LangSmith help test my LLM applications?")

docs

```

```output
[Document(page_content=&#x27;Skip to main content🦜️🛠️ LangSmith DocsPython DocsJS/TS DocsSearchGo to AppLangSmithOverviewTracingTesting & EvaluationOrganizationsHubLangSmith CookbookOverviewOn this pageLangSmith Overview and User GuideBuilding reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.Over the past two months, we at LangChain&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
 Document(page_content=&#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
 Document(page_content=&#x27;You can also quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs.Monitoring\u200bAfter all this, your app might finally ready to go in production. LangSmith can also be used to monitor your application in much the same way that you used for debugging. You can log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise. Each run can also be&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
 Document(page_content="does that affect the output?\u200bSo you notice a bad output, and you go into LangSmith to see what&#x27;s going on. You find the faulty LLM call and are now looking at the exact input. You want to try changing a word or a phrase to see what happens -- what do you do?We constantly ran into this issue. Initially, we copied the prompt to a playground of sorts. But this got annoying, so we built a playground of our own! When examining an LLM call, you can click the Open in Playground button to access this", metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;})]

``` We can see that invoking the retriever above results in some parts of the LangSmith docs that contain information about testing that our chatbot can use as context when answering questions. And now we&#x27;ve got a retriever that can return related data from the LangSmith docs! Document chains[​](#document-chains) Now that we have a retriever that can return LangChain docs, let&#x27;s create a chain that can use them as context to answer questions. We&#x27;ll use a create_stuff_documents_chain helper function to "stuff" all of the input documents into the prompt. It will also handle formatting the docs as strings. In addition to a chat model, the function also expects a prompt that has a context variables, as well as a placeholder for chat history messages named messages. We&#x27;ll create an appropriate prompt and pass it as shown below:

```python
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

SYSTEM_TEMPLATE = """
Answer the user&#x27;s questions based on the below context.
If the context doesn&#x27;t contain any relevant information to the question, don&#x27;t make something up and just say "I don&#x27;t know":

<context>
{context}
</context>
"""

question_answering_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            SYSTEM_TEMPLATE,
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

document_chain = create_stuff_documents_chain(chat, question_answering_prompt)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html) We can invoke this document_chain by itself to answer questions. Let&#x27;s use the docs we retrieved above and the same question, how can langsmith help with testing?:

```python
from langchain_core.messages import HumanMessage

document_chain.invoke(
    {
        "context": docs,
        "messages": [
            HumanMessage(content="Can LangSmith help test my LLM applications?")
        ],
    }
)

```**API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```output
&#x27;Yes, LangSmith can help test and evaluate your LLM applications. It simplifies the initial setup, and you can use it to monitor your application, log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise.&#x27;

```**Looks good! For comparison, we can try it with no context docs and compare the result:

```python
document_chain.invoke(
    {
        "context": [],
        "messages": [
            HumanMessage(content="Can LangSmith help test my LLM applications?")
        ],
    }
)

```

```output
"I don&#x27;t know about LangSmith&#x27;s specific capabilities for testing LLM applications. It&#x27;s best to reach out to LangSmith directly to inquire about their services and how they can assist with testing your LLM applications."

``` We can see that the LLM does not return any results. Retrieval chains[​](#retrieval-chains) Let&#x27;s combine this document chain with the retriever. Here&#x27;s one way this can look:

```python
from typing import Dict

from langchain_core.runnables import RunnablePassthrough

def parse_retriever_input(params: Dict):
    return params["messages"][-1].content

retrieval_chain = RunnablePassthrough.assign(
    context=parse_retriever_input | retriever,
).assign(
    answer=document_chain,
)

```API Reference:**[RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) Given a list of input messages, we extract the content of the last message in the list and pass that to the retriever to fetch some documents. Then, we pass those documents as context to our document chain to generate a final response. Invoking this chain combines both steps outlined above:

```python
retrieval_chain.invoke(
    {
        "messages": [
            HumanMessage(content="Can LangSmith help test my LLM applications?")
        ],
    }
)

```**

```output
{&#x27;messages&#x27;: [HumanMessage(content=&#x27;Can LangSmith help test my LLM applications?&#x27;)],
 &#x27;context&#x27;: [Document(page_content=&#x27;Skip to main content🦜️🛠️ LangSmith DocsPython DocsJS/TS DocsSearchGo to AppLangSmithOverviewTracingTesting & EvaluationOrganizationsHubLangSmith CookbookOverviewOn this pageLangSmith Overview and User GuideBuilding reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.Over the past two months, we at LangChain&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
  Document(page_content=&#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
  Document(page_content=&#x27;You can also quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs.Monitoring\u200bAfter all this, your app might finally ready to go in production. LangSmith can also be used to monitor your application in much the same way that you used for debugging. You can log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise. Each run can also be&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
  Document(page_content="does that affect the output?\u200bSo you notice a bad output, and you go into LangSmith to see what&#x27;s going on. You find the faulty LLM call and are now looking at the exact input. You want to try changing a word or a phrase to see what happens -- what do you do?We constantly ran into this issue. Initially, we copied the prompt to a playground of sorts. But this got annoying, so we built a playground of our own! When examining an LLM call, you can click the Open in Playground button to access this", metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;})],
 &#x27;answer&#x27;: &#x27;Yes, LangSmith can help test and evaluate your LLM applications. It simplifies the initial setup, and you can use it to monitor your application, log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise.&#x27;}

``` Looks good! Query transformation[​](#query-transformation) Our retrieval chain is capable of answering questions about LangSmith, but there&#x27;s a problem - chatbots interact with users conversationally, and therefore have to deal with followup questions. The chain in its current form will struggle with this. Consider a followup question to our original question like Tell me more!. If we invoke our retriever with that query directly, we get documents irrelevant to LLM application testing:

```python
retriever.invoke("Tell me more!")

```

```output
[Document(page_content=&#x27;You can also quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs.Monitoring\u200bAfter all this, your app might finally ready to go in production. LangSmith can also be used to monitor your application in much the same way that you used for debugging. You can log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise. Each run can also be&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
 Document(page_content=&#x27;playground. Here, you can modify the prompt and re-run it to observe the resulting changes to the output - as many times as needed!Currently, this feature supports only OpenAI and Anthropic models and works for LLM and Chat Model calls. We plan to extend its functionality to more LLM types, chains, agents, and retrievers in the future.What is the exact sequence of events?\u200bIn complicated chains and agents, it can often be hard to understand what is going on under the hood. What calls are being&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
 Document(page_content=&#x27;however, there is still no complete substitute for human review to get the utmost quality and reliability from your application.&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
 Document(page_content=&#x27;Skip to main content🦜️🛠️ LangSmith DocsPython DocsJS/TS DocsSearchGo to AppLangSmithOverviewTracingTesting & EvaluationOrganizationsHubLangSmith CookbookOverviewOn this pageLangSmith Overview and User GuideBuilding reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.Over the past two months, we at LangChain&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;})]

``` This is because the retriever has no innate concept of state, and will only pull documents most similar to the query given. To solve this, we can transform the query into a standalone query without any external references an LLM. Here&#x27;s an example:

```python
from langchain_core.messages import AIMessage, HumanMessage

query_transform_prompt = ChatPromptTemplate.from_messages(
    [
        MessagesPlaceholder(variable_name="messages"),
        (
            "user",
            "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Only respond with the query, nothing else.",
        ),
    ]
)

query_transformation_chain = query_transform_prompt | chat

query_transformation_chain.invoke(
    {
        "messages": [
            HumanMessage(content="Can LangSmith help test my LLM applications?"),
            AIMessage(
                content="Yes, LangSmith can help test and evaluate your LLM applications. It allows you to quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs. Additionally, LangSmith can be used to monitor your application, log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise."
            ),
            HumanMessage(content="Tell me more!"),
        ],
    }
)

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```output
AIMessage(content=&#x27;"LangSmith LLM application testing and evaluation"&#x27;)

```**Awesome! That transformed query would pull up context documents related to LLM application testing. Let&#x27;s add this to our retrieval chain. We can wrap our retriever as follows:

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableBranch

query_transforming_retriever_chain = RunnableBranch(
    (
        lambda x: len(x.get("messages", [])) == 1,
        # If only one message, then we just pass that message&#x27;s content to retriever
        (lambda x: x["messages"][-1].content) | retriever,
    ),
    # If messages, then we pass inputs to LLM chain to transform the query, then pass to retriever
    query_transform_prompt | chat | StrOutputParser() | retriever,
).with_config(run_name="chat_retriever_chain")

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [RunnableBranch](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.branch.RunnableBranch.html) Then, we can use this query transformation chain to make our retrieval chain better able to handle such followup questions:

```python
SYSTEM_TEMPLATE = """
Answer the user&#x27;s questions based on the below context.
If the context doesn&#x27;t contain any relevant information to the question, don&#x27;t make something up and just say "I don&#x27;t know":

<context>
{context}
</context>
"""

question_answering_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            SYSTEM_TEMPLATE,
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

document_chain = create_stuff_documents_chain(chat, question_answering_prompt)

conversational_retrieval_chain = RunnablePassthrough.assign(
    context=query_transforming_retriever_chain,
).assign(
    answer=document_chain,
)

``` Awesome! Let&#x27;s invoke this new chain with the same inputs as earlier:

```python
conversational_retrieval_chain.invoke(
    {
        "messages": [
            HumanMessage(content="Can LangSmith help test my LLM applications?"),
        ]
    }
)

```

```output
{&#x27;messages&#x27;: [HumanMessage(content=&#x27;Can LangSmith help test my LLM applications?&#x27;)],
 &#x27;context&#x27;: [Document(page_content=&#x27;Skip to main content🦜️🛠️ LangSmith DocsPython DocsJS/TS DocsSearchGo to AppLangSmithOverviewTracingTesting & EvaluationOrganizationsHubLangSmith CookbookOverviewOn this pageLangSmith Overview and User GuideBuilding reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.Over the past two months, we at LangChain&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
  Document(page_content=&#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
  Document(page_content=&#x27;You can also quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs.Monitoring\u200bAfter all this, your app might finally ready to go in production. LangSmith can also be used to monitor your application in much the same way that you used for debugging. You can log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise. Each run can also be&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
  Document(page_content="does that affect the output?\u200bSo you notice a bad output, and you go into LangSmith to see what&#x27;s going on. You find the faulty LLM call and are now looking at the exact input. You want to try changing a word or a phrase to see what happens -- what do you do?We constantly ran into this issue. Initially, we copied the prompt to a playground of sorts. But this got annoying, so we built a playground of our own! When examining an LLM call, you can click the Open in Playground button to access this", metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;})],
 &#x27;answer&#x27;: &#x27;Yes, LangSmith can help test and evaluate LLM (Language Model) applications. It simplifies the initial setup, and you can use it to monitor your application, log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise.&#x27;}

```

```python
conversational_retrieval_chain.invoke(
    {
        "messages": [
            HumanMessage(content="Can LangSmith help test my LLM applications?"),
            AIMessage(
                content="Yes, LangSmith can help test and evaluate your LLM applications. It allows you to quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs. Additionally, LangSmith can be used to monitor your application, log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise."
            ),
            HumanMessage(content="Tell me more!"),
        ],
    }
)

```

```output
{&#x27;messages&#x27;: [HumanMessage(content=&#x27;Can LangSmith help test my LLM applications?&#x27;),
  AIMessage(content=&#x27;Yes, LangSmith can help test and evaluate your LLM applications. It allows you to quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs. Additionally, LangSmith can be used to monitor your application, log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise.&#x27;),
  HumanMessage(content=&#x27;Tell me more!&#x27;)],
 &#x27;context&#x27;: [Document(page_content=&#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
  Document(page_content=&#x27;You can also quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs.Monitoring\u200bAfter all this, your app might finally ready to go in production. LangSmith can also be used to monitor your application in much the same way that you used for debugging. You can log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise. Each run can also be&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
  Document(page_content=&#x27;Skip to main content🦜️🛠️ LangSmith DocsPython DocsJS/TS DocsSearchGo to AppLangSmithOverviewTracingTesting & EvaluationOrganizationsHubLangSmith CookbookOverviewOn this pageLangSmith Overview and User GuideBuilding reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.Over the past two months, we at LangChain&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}),
  Document(page_content=&#x27;LangSmith makes it easy to manually review and annotate runs through annotation queues.These queues allow you to select any runs based on criteria like model type or automatic evaluation scores, and queue them up for human review. As a reviewer, you can then quickly step through the runs, viewing the input, output, and any existing tags before adding your own feedback.We often use this for a couple of reasons:To assess subjective qualities that automatic evaluators struggle with, like&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;})],
 &#x27;answer&#x27;: &#x27;LangSmith simplifies the initial setup for building reliable LLM applications, but it acknowledges that there is still work needed to bring the performance of prompts, chains, and agents up to the level where they are reliable enough to be used in production. It also provides the capability to manually review and annotate runs through annotation queues, allowing you to select runs based on criteria like model type or automatic evaluation scores for human review. This feature is particularly useful for assessing subjective qualities that automatic evaluators struggle with.&#x27;}

``` You can check out [this LangSmith trace](https://smith.langchain.com/public/bb329a3b-e92a-4063-ad78-43f720fbb5a2/r) to see the internal query transformation step for yourself. ## Streaming[​](#streaming) Because this chain is constructed with LCEL, you can use familiar methods like .stream() with it:

```python
stream = conversational_retrieval_chain.stream(
    {
        "messages": [
            HumanMessage(content="Can LangSmith help test my LLM applications?"),
            AIMessage(
                content="Yes, LangSmith can help test and evaluate your LLM applications. It allows you to quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs. Additionally, LangSmith can be used to monitor your application, log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise."
            ),
            HumanMessage(content="Tell me more!"),
        ],
    }
)

for chunk in stream:
    print(chunk)

```

```output
{&#x27;messages&#x27;: [HumanMessage(content=&#x27;Can LangSmith help test my LLM applications?&#x27;), AIMessage(content=&#x27;Yes, LangSmith can help test and evaluate your LLM applications. It allows you to quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs. Additionally, LangSmith can be used to monitor your application, log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise.&#x27;), HumanMessage(content=&#x27;Tell me more!&#x27;)]}
{&#x27;context&#x27;: [Document(page_content=&#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}), Document(page_content=&#x27;You can also quickly edit examples and add them to datasets to expand the surface area of your evaluation sets or to fine-tune a model for improved quality or reduced costs.Monitoring\u200bAfter all this, your app might finally ready to go in production. LangSmith can also be used to monitor your application in much the same way that you used for debugging. You can log all traces, visualize latency and token usage statistics, and troubleshoot specific issues as they arise. Each run can also be&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}), Document(page_content=&#x27;Skip to main content🦜️🛠️ LangSmith DocsPython DocsJS/TS DocsSearchGo to AppLangSmithOverviewTracingTesting & EvaluationOrganizationsHubLangSmith CookbookOverviewOn this pageLangSmith Overview and User GuideBuilding reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.Over the past two months, we at LangChain&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;}), Document(page_content=&#x27;LangSmith makes it easy to manually review and annotate runs through annotation queues.These queues allow you to select any runs based on criteria like model type or automatic evaluation scores, and queue them up for human review. As a reviewer, you can then quickly step through the runs, viewing the input, output, and any existing tags before adding your own feedback.We often use this for a couple of reasons:To assess subjective qualities that automatic evaluators struggle with, like&#x27;, metadata={&#x27;description&#x27;: &#x27;Building reliable LLM applications can be challenging. LangChain simplifies the initial setup, but there is still work needed to bring the performance of prompts, chains and agents up the level where they are reliable enough to be used in production.&#x27;, &#x27;language&#x27;: &#x27;en&#x27;, &#x27;source&#x27;: &#x27;https://docs.smith.langchain.com/overview&#x27;, &#x27;title&#x27;: &#x27;LangSmith Overview and User Guide | 🦜️🛠️ LangSmith&#x27;})]}
{&#x27;answer&#x27;: &#x27;&#x27;}
{&#x27;answer&#x27;: &#x27;Lang&#x27;}
{&#x27;answer&#x27;: &#x27;Smith&#x27;}
{&#x27;answer&#x27;: &#x27; simpl&#x27;}
{&#x27;answer&#x27;: &#x27;ifies&#x27;}
{&#x27;answer&#x27;: &#x27; the&#x27;}
{&#x27;answer&#x27;: &#x27; initial&#x27;}
{&#x27;answer&#x27;: &#x27; setup&#x27;}
{&#x27;answer&#x27;: &#x27; for&#x27;}
{&#x27;answer&#x27;: &#x27; building&#x27;}
{&#x27;answer&#x27;: &#x27; reliable&#x27;}
{&#x27;answer&#x27;: &#x27; L&#x27;}
{&#x27;answer&#x27;: &#x27;LM&#x27;}
{&#x27;answer&#x27;: &#x27; applications&#x27;}
{&#x27;answer&#x27;: &#x27;.&#x27;}
{&#x27;answer&#x27;: &#x27; It&#x27;}
{&#x27;answer&#x27;: &#x27; provides&#x27;}
{&#x27;answer&#x27;: &#x27; features&#x27;}
{&#x27;answer&#x27;: &#x27; for&#x27;}
{&#x27;answer&#x27;: &#x27; manually&#x27;}
{&#x27;answer&#x27;: &#x27; reviewing&#x27;}
{&#x27;answer&#x27;: &#x27; and&#x27;}
{&#x27;answer&#x27;: &#x27; annot&#x27;}
{&#x27;answer&#x27;: &#x27;ating&#x27;}
{&#x27;answer&#x27;: &#x27; runs&#x27;}
{&#x27;answer&#x27;: &#x27; through&#x27;}
{&#x27;answer&#x27;: &#x27; annotation&#x27;}
{&#x27;answer&#x27;: &#x27; queues&#x27;}
{&#x27;answer&#x27;: &#x27;,&#x27;}
{&#x27;answer&#x27;: &#x27; allowing&#x27;}
{&#x27;answer&#x27;: &#x27; you&#x27;}
{&#x27;answer&#x27;: &#x27; to&#x27;}
{&#x27;answer&#x27;: &#x27; select&#x27;}
{&#x27;answer&#x27;: &#x27; runs&#x27;}
{&#x27;answer&#x27;: &#x27; based&#x27;}
{&#x27;answer&#x27;: &#x27; on&#x27;}
{&#x27;answer&#x27;: &#x27; criteria&#x27;}
{&#x27;answer&#x27;: &#x27; like&#x27;}
{&#x27;answer&#x27;: &#x27; model&#x27;}
{&#x27;answer&#x27;: &#x27; type&#x27;}
{&#x27;answer&#x27;: &#x27; or&#x27;}
{&#x27;answer&#x27;: &#x27; automatic&#x27;}
{&#x27;answer&#x27;: &#x27; evaluation&#x27;}
{&#x27;answer&#x27;: &#x27; scores&#x27;}
{&#x27;answer&#x27;: &#x27;,&#x27;}
{&#x27;answer&#x27;: &#x27; and&#x27;}
{&#x27;answer&#x27;: &#x27; queue&#x27;}
{&#x27;answer&#x27;: &#x27; them&#x27;}
{&#x27;answer&#x27;: &#x27; up&#x27;}
{&#x27;answer&#x27;: &#x27; for&#x27;}
{&#x27;answer&#x27;: &#x27; human&#x27;}
{&#x27;answer&#x27;: &#x27; review&#x27;}
{&#x27;answer&#x27;: &#x27;.&#x27;}
{&#x27;answer&#x27;: &#x27; As&#x27;}
{&#x27;answer&#x27;: &#x27; a&#x27;}
{&#x27;answer&#x27;: &#x27; reviewer&#x27;}
{&#x27;answer&#x27;: &#x27;,&#x27;}
{&#x27;answer&#x27;: &#x27; you&#x27;}
{&#x27;answer&#x27;: &#x27; can&#x27;}
{&#x27;answer&#x27;: &#x27; quickly&#x27;}
{&#x27;answer&#x27;: &#x27; step&#x27;}
{&#x27;answer&#x27;: &#x27; through&#x27;}
{&#x27;answer&#x27;: &#x27; the&#x27;}
{&#x27;answer&#x27;: &#x27; runs&#x27;}
{&#x27;answer&#x27;: &#x27;,&#x27;}
{&#x27;answer&#x27;: &#x27; view&#x27;}
{&#x27;answer&#x27;: &#x27; the&#x27;}
{&#x27;answer&#x27;: &#x27; input&#x27;}
{&#x27;answer&#x27;: &#x27;,&#x27;}
{&#x27;answer&#x27;: &#x27; output&#x27;}
{&#x27;answer&#x27;: &#x27;,&#x27;}
{&#x27;answer&#x27;: &#x27; and&#x27;}
{&#x27;answer&#x27;: &#x27; any&#x27;}
{&#x27;answer&#x27;: &#x27; existing&#x27;}
{&#x27;answer&#x27;: &#x27; tags&#x27;}
{&#x27;answer&#x27;: &#x27; before&#x27;}
{&#x27;answer&#x27;: &#x27; adding&#x27;}
{&#x27;answer&#x27;: &#x27; your&#x27;}
{&#x27;answer&#x27;: &#x27; own&#x27;}
{&#x27;answer&#x27;: &#x27; feedback&#x27;}
{&#x27;answer&#x27;: &#x27;.&#x27;}
{&#x27;answer&#x27;: &#x27; This&#x27;}
{&#x27;answer&#x27;: &#x27; can&#x27;}
{&#x27;answer&#x27;: &#x27; be&#x27;}
{&#x27;answer&#x27;: &#x27; particularly&#x27;}
{&#x27;answer&#x27;: &#x27; useful&#x27;}
{&#x27;answer&#x27;: &#x27; for&#x27;}
{&#x27;answer&#x27;: &#x27; assessing&#x27;}
{&#x27;answer&#x27;: &#x27; subjective&#x27;}
{&#x27;answer&#x27;: &#x27; qualities&#x27;}
{&#x27;answer&#x27;: &#x27; that&#x27;}
{&#x27;answer&#x27;: &#x27; automatic&#x27;}
{&#x27;answer&#x27;: &#x27; evalu&#x27;}
{&#x27;answer&#x27;: &#x27;ators&#x27;}
{&#x27;answer&#x27;: &#x27; struggle&#x27;}
{&#x27;answer&#x27;: &#x27; with&#x27;}
{&#x27;answer&#x27;: &#x27;.&#x27;}
{&#x27;answer&#x27;: &#x27;&#x27;}

``` ## Further reading[​](#further-reading) This guide only scratches the surface of retrieval techniques. For more on different ways of ingesting, preparing, and retrieving the most relevant data, check out the relevant how-to guides [here](/docs/how_to/#document-loaders).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/chatbots_retrieval.ipynb)[Setup](#setup)
- [Creating a retriever](#creating-a-retriever)
- [Document chains](#document-chains)
- [Retrieval chains](#retrieval-chains)
- [Query transformation](#query-transformation)
- [Streaming](#streaming)
- [Further reading](#further-reading)

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