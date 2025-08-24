Build a Retrieval Augmented Generation (RAG) App: Part 1 | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/tutorials/rag.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/tutorials/rag.ipynb)Build a Retrieval Augmented Generation (RAG) App: Part 1 One of the most powerful applications enabled by LLMs is sophisticated question-answering (Q&A) chatbots. These are applications that can answer questions about specific source information. These applications use a technique known as Retrieval Augmented Generation, or [RAG](/docs/concepts/rag/). This is a multi-part tutorial: [Part 1](/docs/tutorials/rag/) (this guide) introduces RAG and walks through a minimal implementation. [Part 2](/docs/tutorials/qa_chat_history/) extends the implementation to accommodate conversation-style interactions and multi-step retrieval processes. This tutorial will show how to build a simple Q&A application over a text data source. Along the way we’ll go over a typical Q&A architecture and highlight additional resources for more advanced Q&A techniques. We’ll also see how LangSmith can help us trace and understand our application. LangSmith will become increasingly helpful as our application grows in complexity. If you&#x27;re already familiar with basic retrieval, you might also be interested in this [high-level overview of different retrieval techniques](/docs/concepts/retrieval/). Note**: Here we focus on Q&A for unstructured data. If you are interested for RAG over structured data, check out our tutorial on doing [question/answering over SQL data](/docs/tutorials/sql_qa/). ## Overview[​](#overview) A typical RAG application has two main components: **Indexing**: a pipeline for ingesting data from a source and indexing it. *This usually happens offline.* **Retrieval and generation**: the actual RAG chain, which takes the user query at run time and retrieves the relevant data from the index, then passes that to the model. Note: the indexing portion of this tutorial will largely follow the [semantic search tutorial](/docs/tutorials/retrievers/). The most common full sequence from raw data to answer looks like: ### Indexing[​](#indexing) **Load**: First we need to load our data. This is done with [Document Loaders](/docs/concepts/document_loaders/).

- **Split**: [Text splitters](/docs/concepts/text_splitters/) break large Documents into smaller chunks. This is useful both for indexing data and passing it into a model, as large chunks are harder to search over and won&#x27;t fit in a model&#x27;s finite context window.

- **Store**: We need somewhere to store and index our splits, so that they can be searched over later. This is often done using a [VectorStore](/docs/concepts/vectorstores/) and [Embeddings](/docs/concepts/embedding_models/) model.

![index_diagram ](/assets/images/rag_indexing-8160f90a90a33253d0154659cf7d453f.png)

### Retrieval and generation[​](#retrieval-and-generation)

- **Retrieve**: Given a user input, relevant splits are retrieved from storage using a [Retriever](/docs/concepts/retrievers/).

- **Generate**: A [ChatModel](/docs/concepts/chat_models/) / [LLM](/docs/concepts/text_llms/) produces an answer using a prompt that includes both the question with the retrieved data

![retrieval_diagram ](/assets/images/rag_retrieval_generation-1046a4668d6bb08786ef73c56d4f228a.png)

Once we&#x27;ve indexed our data, we will use [LangGraph](https://langchain-ai.github.io/langgraph/) as our orchestration framework to implement the retrieval and generation steps.

## Setup[​](#setup)

### Jupyter Notebook[​](#jupyter-notebook)

This and other tutorials are perhaps most conveniently run in a [Jupyter notebooks](https://jupyter.org/). Going through guides in an interactive environment is a great way to better understand them. See [here](https://jupyter.org/install) for instructions on how to install.

### Installation[​](#installation)

This tutorial requires these langchain dependencies:

- Pip
- Conda

```python
%pip install --quiet --upgrade langchain-text-splitters langchain-community langgraph

```**

```bash
conda install langchain-text-splitters langchain-community langgraph -c conda-forge

``` For more details, see our [Installation guide](/docs/how_to/installation/). LangSmith[​](#langsmith) Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com). After you sign up at the link above, make sure to set your environment variables to start logging traces:

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."

``` Or, if in a notebook, you can set them with:

```python
import getpass
import os

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` Components[​](#components) We will need to select three components from LangChain&#x27;s suite of integrations. Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` Select [embeddings model](/docs/integrations/text_embedding/):OpenAI▾[OpenAI](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[HuggingFace](#)[Ollama](#)[Cohere](#)[MistralAI](#)[Nomic](#)[NVIDIA](#)[Voyage AI](#)[IBM watsonx](#)[Fake](#)

```bash
pip install -qU langchain-openai

```

```python
import getpass
import os

if not os.environ.get("OPENAI_API_KEY"):
  os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")

from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

``` Select [vector store](/docs/integrations/vectorstores/):In-memory▾[In-memory](#)[AstraDB](#)[Chroma](#)[FAISS](#)[Milvus](#)[MongoDB](#)[PGVector](#)[PGVectorStore](#)[Pinecone](#)[Qdrant](#)

```bash
pip install -qU langchain-core

```

```python
from langchain_core.vectorstores import InMemoryVectorStore

vector_store = InMemoryVectorStore(embeddings)

``` Preview[​](#preview) In this guide we’ll build an app that answers questions about the website&#x27;s content. The specific website we will use is the [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) blog post by Lilian Weng, which allows us to ask questions about the contents of the post. We can create a simple indexing pipeline and RAG chain to do this in ~50 lines of code.

```python
import bs4
from langchain import hub
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict

# Load and chunk contents of the blog
loader = WebBaseLoader(
    web_paths=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("post-content", "post-title", "post-header")
        )
    ),
)
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
all_splits = text_splitter.split_documents(docs)

# Index chunks
_ = vector_store.add_documents(documents=all_splits)

# Define prompt for question-answering
# N.B. for non-US LangSmith endpoints, you may need to specify
# api_url="https://api.smith.langchain.com" in hub.pull.
prompt = hub.pull("rlm/rag-prompt")

# Define state for application
class State(TypedDict):
    question: str
    context: List[Document]
    answer: str

# Define application steps
def retrieve(state: State):
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}

def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}

# Compile application and test
graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

```API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph)

```python
response = graph.invoke({"question": "What is Task Decomposition?"})
print(response["answer"])

```**

```text
Task Decomposition is the process of breaking down a complicated task into smaller, manageable steps to facilitate easier execution and understanding. Techniques like Chain of Thought (CoT) and Tree of Thoughts (ToT) guide models to think step-by-step, allowing them to explore multiple reasoning possibilities. This method enhances performance on complex tasks and provides insight into the model&#x27;s thinking process.

``` Check out the [LangSmith trace](https://smith.langchain.com/public/65030797-7efa-4356-a7bd-b54b3dc70e17/r). Detailed walkthrough[​](#detailed-walkthrough) Let’s go through the above code step-by-step to really understand what’s going on. 1. Indexing[​](#indexing) noteThis section is an abbreviated version of the content in the [semantic search tutorial](/docs/tutorials/retrievers/). If you&#x27;re comfortable with [document loaders](/docs/concepts/document_loaders/), [embeddings](/docs/concepts/embedding_models/), and [vector stores](/docs/concepts/vectorstores/), feel free to skip to the next section on [retrieval and generation](/docs/tutorials/rag/#orchestration). Loading documents[​](#loading-documents) We need to first load the blog post contents. We can use [DocumentLoaders](/docs/concepts/document_loaders/) for this, which are objects that load in data from a source and return a list of [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) objects. In this case we’ll use the [WebBaseLoader](/docs/integrations/document_loaders/web_base/), which uses urllib to load HTML from web URLs and BeautifulSoup to parse it to text. We can customize the HTML -> text parsing by passing in parameters into the BeautifulSoup parser via bs_kwargs (see [BeautifulSoup docs](https://beautiful-soup-4.readthedocs.io/en/latest/#beautifulsoup)). In this case only HTML tags with class “post-content”, “post-title”, or “post-header” are relevant, so we’ll remove all others.

```python
import bs4
from langchain_community.document_loaders import WebBaseLoader

# Only keep post title, headers, and content from the full HTML.
bs4_strainer = bs4.SoupStrainer(class_=("post-title", "post-header", "post-content"))
loader = WebBaseLoader(
    web_paths=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
    bs_kwargs={"parse_only": bs4_strainer},
)
docs = loader.load()

assert len(docs) == 1
print(f"Total characters: {len(docs[0].page_content)}")

```

```output
Total characters: 43131

```

```python
print(docs[0].page_content[:500])

```

```output
LLM Powered Autonomous Agents

Date: June 23, 2023  |  Estimated Reading Time: 31 min  |  Author: Lilian Weng

Building agents with LLM (large language model) as its core controller is a cool concept. Several proof-of-concepts demos, such as AutoGPT, GPT-Engineer and BabyAGI, serve as inspiring examples. The potentiality of LLM extends beyond generating well-written copies, stories, essays and programs; it can be framed as a powerful general problem solver.
Agent System Overview#
In

``` Go deeper[​](#go-deeper) DocumentLoader: Object that loads data from a source as list of Documents. [Docs](/docs/how_to/#document-loaders): Detailed documentation on how to use DocumentLoaders. [Integrations](/docs/integrations/document_loaders/): 160+ integrations to choose from. [Interface](https://python.langchain.com/api_reference/core/document_loaders/langchain_core.document_loaders.base.BaseLoader.html): API reference for the base interface. Splitting documents[​](#splitting-documents) Our loaded document is over 42k characters which is too long to fit into the context window of many models. Even for those models that could fit the full post in their context window, models can struggle to find information in very long inputs. To handle this we’ll split the Document into chunks for embedding and vector storage. This should help us retrieve only the most relevant parts of the blog post at run time. As in the [semantic search tutorial](/docs/tutorials/retrievers/), we use a [RecursiveCharacterTextSplitter](/docs/how_to/recursive_text_splitter/), which will recursively split the document using common separators like new lines until each chunk is the appropriate size. This is the recommended text splitter for generic text use cases.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,  # chunk size (characters)
    chunk_overlap=200,  # chunk overlap (characters)
    add_start_index=True,  # track index in original document
)
all_splits = text_splitter.split_documents(docs)

print(f"Split blog post into {len(all_splits)} sub-documents.")

```

```output
Split blog post into 66 sub-documents.

``` Go deeper[​](#go-deeper-1) TextSplitter: Object that splits a list of Documents into smaller chunks. Subclass of DocumentTransformers. Learn more about splitting text using different methods by reading the [how-to docs](/docs/how_to/#text-splitters) [Code (py or js)](/docs/integrations/document_loaders/source_code/) [Scientific papers](/docs/integrations/document_loaders/grobid/) [Interface](https://python.langchain.com/api_reference/text_splitters/base/langchain_text_splitters.base.TextSplitter.html): API reference for the base interface. DocumentTransformer: Object that performs a transformation on a list of Document objects. [Docs](/docs/how_to/#text-splitters): Detailed documentation on how to use DocumentTransformers [Integrations](/docs/integrations/document_transformers/) [Interface](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.transformers.BaseDocumentTransformer.html): API reference for the base interface. Storing documents[​](#storing-documents) Now we need to index our 66 text chunks so that we can search over them at runtime. Following the [semantic search tutorial](/docs/tutorials/retrievers/), our approach is to [embed](/docs/concepts/embedding_models/) the contents of each document split and insert these embeddings into a [vector store](/docs/concepts/vectorstores/). Given an input query, we can then use vector search to retrieve relevant documents. We can embed and store all of our document splits in a single command using the vector store and embeddings model selected at the [start of the tutorial](/docs/tutorials/rag/#components).

```python
document_ids = vector_store.add_documents(documents=all_splits)

print(document_ids[:3])

```

```output
[&#x27;07c18af6-ad58-479a-bfb1-d508033f9c64&#x27;, &#x27;9000bf8e-1993-446f-8d4d-f4e507ba4b8f&#x27;, &#x27;ba3b5d14-bed9-4f5f-88be-44c88aedc2e6&#x27;]

``` Go deeper[​](#go-deeper-2) Embeddings: Wrapper around a text embedding model, used for converting text to embeddings. [Docs](/docs/how_to/embed_text/): Detailed documentation on how to use embeddings. [Integrations](/docs/integrations/text_embedding/): 30+ integrations to choose from. [Interface](https://python.langchain.com/api_reference/core/embeddings/langchain_core.embeddings.Embeddings.html): API reference for the base interface. VectorStore: Wrapper around a vector database, used for storing and querying embeddings. [Docs](/docs/how_to/vectorstores/): Detailed documentation on how to use vector stores. [Integrations](/docs/integrations/vectorstores/): 40+ integrations to choose from. [Interface](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.base.VectorStore.html): API reference for the base interface. This completes the Indexing** portion of the pipeline. At this point
we have a query-able vector store containing the chunked contents of our
blog post. Given a user question, we should ideally be able to return
the snippets of the blog post that answer the question.

## 2. Retrieval and Generation[​](#orchestration)

Now let’s write the actual application logic. We want to create a simple application that takes a user question, searches for documents relevant to that question, passes the retrieved documents and initial question to a model, and returns an answer.

For generation, we will use the chat model selected at the [start of the tutorial](/docs/tutorials/rag/#components).

We’ll use a prompt for RAG that is checked into the LangChain prompt hub ([here](https://smith.langchain.com/hub/rlm/rag-prompt)).

```python
from langchain import hub

# N.B. for non-US LangSmith endpoints, you may need to specify
# api_url="https://api.smith.langchain.com" in hub.pull.
prompt = hub.pull("rlm/rag-prompt")

example_messages = prompt.invoke(
    {"context": "(context goes here)", "question": "(question goes here)"}
).to_messages()

assert len(example_messages) == 1
print(example_messages[0].content)

```**

```output
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don&#x27;t know the answer, just say that you don&#x27;t know. Use three sentences maximum and keep the answer concise.
Question: (question goes here)
Context: (context goes here)
Answer:

``` We&#x27;ll use [LangGraph](https://langchain-ai.github.io/langgraph/) to tie together the retrieval and generation steps into a single application. This will bring a number of benefits: We can define our application logic once and automatically support multiple invocation modes, including streaming, async, and batched calls. We get streamlined deployments via [LangGraph Platform](https://langchain-ai.github.io/langgraph/concepts/langgraph_platform/). LangSmith will automatically trace the steps of our application together. We can easily add key features to our application, including [persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/) and [human-in-the-loop approval](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/), with minimal code changes. To use LangGraph, we need to define three things: The state of our application; The nodes of our application (i.e., application steps); The "control flow" of our application (e.g., the ordering of the steps). State:[​](#state) The [state](https://langchain-ai.github.io/langgraph/concepts/low_level/#state) of our application controls what data is input to the application, transferred between steps, and output by the application. It is typically a TypedDict, but can also be a [Pydantic BaseModel](https://langchain-ai.github.io/langgraph/how-tos/state-model/). For a simple RAG application, we can just keep track of the input question, retrieved context, and generated answer:

```python
from langchain_core.documents import Document
from typing_extensions import List, TypedDict

class State(TypedDict):
    question: str
    context: List[Document]
    answer: str

```API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html)

#### Nodes (application steps)[​](#nodes-application-steps)

Let&#x27;s start with a simple sequence of two steps: retrieval and generation.

```python
def retrieve(state: State):
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}

def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}

```**Our retrieval step simply runs a similarity search using the input question, and the generation step formats the retrieved context and original question into a prompt for the chat model. Control flow[​](#control-flow) Finally, we compile our application into a single graph object. In this case, we are just connecting the retrieval and generation steps into a single sequence.

```python
from langgraph.graph import START, StateGraph

graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

```API Reference:**[StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph)

LangGraph also comes with built-in utilities for visualizing the control flow of your application:

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))

```**![ ](data:image/png;base64,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) Do I need to use LangGraph?LangGraph is not required to build a RAG application. Indeed, we can implement the same application logic through invocations of the individual components:

```python
question = "..."

retrieved_docs = vector_store.similarity_search(question)
docs_content = "\n\n".join(doc.page_content for doc in retrieved_docs)
prompt = prompt.invoke({"question": question, "context": docs_content})
answer = llm.invoke(prompt)

```The benefits of LangGraph include: Support for multiple invocation modes: this logic would need to be rewritten if we wanted to stream output tokens, or stream the results of individual steps; Automatic support for tracing via [LangSmith](https://docs.smith.langchain.com/) and deployments via [LangGraph Platform](https://langchain-ai.github.io/langgraph/concepts/langgraph_platform/); Support for persistence, human-in-the-loop, and other features. Many use-cases demand RAG in a conversational experience, such that a user can receive context-informed answers via a stateful conversation. As we will see in [Part 2](/docs/tutorials/qa_chat_history/) of the tutorial, LangGraph&#x27;s management and persistence of state simplifies these applications enormously. Usage[​](#usage) Let&#x27;s test our application! LangGraph supports multiple invocation modes, including sync, async, and streaming. Invoke:

```python
result = graph.invoke({"question": "What is Task Decomposition?"})

print(f"Context: {result[&#x27;context&#x27;]}\n\n")
print(f"Answer: {result[&#x27;answer&#x27;]}")

```

```output
Context: [Document(id=&#x27;a42dc78b-8f76-472a-9e25-180508af74f3&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 1585}, page_content=&#x27;Fig. 1. Overview of a LLM-powered autonomous agent system.\nComponent One: Planning#\nA complicated task usually involves many steps. An agent needs to know what they are and plan ahead.\nTask Decomposition#\nChain of thought (CoT; Wei et al. 2022) has become a standard prompting technique for enhancing model performance on complex tasks. The model is instructed to “think step by step” to utilize more test-time computation to decompose hard tasks into smaller and simpler steps. CoT transforms big tasks into multiple manageable tasks and shed lights into an interpretation of the model’s thinking process.&#x27;), Document(id=&#x27;c0e45887-d0b0-483d-821a-bb5d8316d51d&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 2192}, page_content=&#x27;Tree of Thoughts (Yao et al. 2023) extends CoT by exploring multiple reasoning possibilities at each step. It first decomposes the problem into multiple thought steps and generates multiple thoughts per step, creating a tree structure. The search process can be BFS (breadth-first search) or DFS (depth-first search) with each state evaluated by a classifier (via a prompt) or majority vote.\nTask decomposition can be done (1) by LLM with simple prompting like "Steps for XYZ.\\n1.", "What are the subgoals for achieving XYZ?", (2) by using task-specific instructions; e.g. "Write a story outline." for writing a novel, or (3) with human inputs.&#x27;), Document(id=&#x27;4cc7f318-35f5-440f-a4a4-145b5f0b918d&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 29630}, page_content=&#x27;Resources:\n1. Internet access for searches and information gathering.\n2. Long Term memory management.\n3. GPT-3.5 powered Agents for delegation of simple tasks.\n4. File output.\n\nPerformance Evaluation:\n1. Continuously review and analyze your actions to ensure you are performing to the best of your abilities.\n2. Constructively self-criticize your big-picture behavior constantly.\n3. Reflect on past decisions and strategies to refine your approach.\n4. Every command has a cost, so be smart and efficient. Aim to complete tasks in the least number of steps.&#x27;), Document(id=&#x27;f621ade4-9b0d-471f-a522-44eb5feeba0c&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 19373}, page_content="(3) Task execution: Expert models execute on the specific tasks and log results.\nInstruction:\n\nWith the input and the inference results, the AI assistant needs to describe the process and results. The previous stages can be formed as - User Input: {{ User Input }}, Task Planning: {{ Tasks }}, Model Selection: {{ Model Assignment }}, Task Execution: {{ Predictions }}. You must first answer the user&#x27;s request in a straightforward manner. Then describe the task process and show your analysis and model inference results to the user in the first person. If inference results contain a file path, must tell the user the complete file path.")]

Answer: Task decomposition is a technique used to break down complex tasks into smaller, manageable steps, allowing for more efficient problem-solving. This can be achieved through methods like chain of thought prompting or the tree of thoughts approach, which explores multiple reasoning possibilities at each step. It can be initiated through simple prompts, task-specific instructions, or human inputs.

``` Stream steps:

```python
for step in graph.stream(
    {"question": "What is Task Decomposition?"}, stream_mode="updates"
):
    print(f"{step}\n\n----------------\n")

```

```output
{&#x27;retrieve&#x27;: {&#x27;context&#x27;: [Document(id=&#x27;a42dc78b-8f76-472a-9e25-180508af74f3&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 1585}, page_content=&#x27;Fig. 1. Overview of a LLM-powered autonomous agent system.\nComponent One: Planning#\nA complicated task usually involves many steps. An agent needs to know what they are and plan ahead.\nTask Decomposition#\nChain of thought (CoT; Wei et al. 2022) has become a standard prompting technique for enhancing model performance on complex tasks. The model is instructed to “think step by step” to utilize more test-time computation to decompose hard tasks into smaller and simpler steps. CoT transforms big tasks into multiple manageable tasks and shed lights into an interpretation of the model’s thinking process.&#x27;), Document(id=&#x27;c0e45887-d0b0-483d-821a-bb5d8316d51d&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 2192}, page_content=&#x27;Tree of Thoughts (Yao et al. 2023) extends CoT by exploring multiple reasoning possibilities at each step. It first decomposes the problem into multiple thought steps and generates multiple thoughts per step, creating a tree structure. The search process can be BFS (breadth-first search) or DFS (depth-first search) with each state evaluated by a classifier (via a prompt) or majority vote.\nTask decomposition can be done (1) by LLM with simple prompting like "Steps for XYZ.\\n1.", "What are the subgoals for achieving XYZ?", (2) by using task-specific instructions; e.g. "Write a story outline." for writing a novel, or (3) with human inputs.&#x27;), Document(id=&#x27;4cc7f318-35f5-440f-a4a4-145b5f0b918d&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 29630}, page_content=&#x27;Resources:\n1. Internet access for searches and information gathering.\n2. Long Term memory management.\n3. GPT-3.5 powered Agents for delegation of simple tasks.\n4. File output.\n\nPerformance Evaluation:\n1. Continuously review and analyze your actions to ensure you are performing to the best of your abilities.\n2. Constructively self-criticize your big-picture behavior constantly.\n3. Reflect on past decisions and strategies to refine your approach.\n4. Every command has a cost, so be smart and efficient. Aim to complete tasks in the least number of steps.&#x27;), Document(id=&#x27;f621ade4-9b0d-471f-a522-44eb5feeba0c&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 19373}, page_content="(3) Task execution: Expert models execute on the specific tasks and log results.\nInstruction:\n\nWith the input and the inference results, the AI assistant needs to describe the process and results. The previous stages can be formed as - User Input: {{ User Input }}, Task Planning: {{ Tasks }}, Model Selection: {{ Model Assignment }}, Task Execution: {{ Predictions }}. You must first answer the user&#x27;s request in a straightforward manner. Then describe the task process and show your analysis and model inference results to the user in the first person. If inference results contain a file path, must tell the user the complete file path.")]}}

----------------

{&#x27;generate&#x27;: {&#x27;answer&#x27;: &#x27;Task decomposition is the process of breaking down a complex task into smaller, more manageable steps. This technique, often enhanced by methods like Chain of Thought (CoT) or Tree of Thoughts, allows models to reason through tasks systematically and improves performance by clarifying the thought process. It can be achieved through simple prompts, task-specific instructions, or human inputs.&#x27;}}

----------------

``` Stream [tokens](/docs/concepts/tokens/):

```python
for message, metadata in graph.stream(
    {"question": "What is Task Decomposition?"}, stream_mode="messages"
):
    print(message.content, end="|")

```

```output
|Task| decomposition| is| the| process| of| breaking| down| complex| tasks| into| smaller|,| more| manageable| steps|.| It| can| be| achieved| through| techniques| like| Chain| of| Thought| (|Co|T|)| prompting|,| which| encourages| the| model| to| think| step| by| step|,| or| through| more| structured| methods| like| the| Tree| of| Thoughts|.| This| approach| not| only| simplifies| task| execution| but| also| provides| insights| into| the| model|&#x27;s| reasoning| process|.||

``` tipFor async invocations, use:

```python
result = await graph.ainvoke(...)

```and

```python
async for step in graph.astream(...):

``` Returning sources[​](#returning-sources) Note that by storing the retrieved context in the state of the graph, we recover sources for the model&#x27;s generated answer in the "context" field of the state. See [this guide](/docs/how_to/qa_sources/) on returning sources for more detail. Go deeper[​](#go-deeper-3) [Chat models](/docs/concepts/chat_models/) take in a sequence of messages and return a message. [Docs](/docs/how_to/#chat-models) [Integrations](/docs/integrations/chat/): 25+ integrations to choose from. [Interface](https://python.langchain.com/api_reference/core/language_models/langchain_core.language_models.chat_models.BaseChatModel.html): API reference for the base interface. Customizing the prompt**

As shown above, we can load prompts (e.g., [this RAG prompt](https://smith.langchain.com/hub/rlm/rag-prompt)) from the prompt hub. The prompt can also be easily customized. For example:

```python
from langchain_core.prompts import PromptTemplate

template = """Use the following pieces of context to answer the question at the end.
If you don&#x27;t know the answer, just say that you don&#x27;t know, don&#x27;t try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.
Always say "thanks for asking!" at the end of the answer.

{context}

Question: {question}

Helpful Answer:"""
custom_rag_prompt = PromptTemplate.from_template(template)

```**API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

## Query analysis[​](#query-analysis)

So far, we are executing the retrieval using the raw input query. However, there are some advantages to allowing a model to generate the query for retrieval purposes. For example:

- In addition to semantic search, we can build in structured filters (e.g., "Find documents since the year 2020.");

- The model can rewrite user queries, which may be multifaceted or include irrelevant language, into more effective search queries.

[Query analysis](/docs/concepts/retrieval/#query-analysis) employs models to transform or construct optimized search queries from raw user input. We can easily incorporate a query analysis step into our application. For illustrative purposes, let&#x27;s add some metadata to the documents in our vector store. We will add some (contrived) sections to the document which we can filter on later.

```python
total_documents = len(all_splits)
third = total_documents // 3

for i, document in enumerate(all_splits):
    if i < third:
        document.metadata["section"] = "beginning"
    elif i < 2 * third:
        document.metadata["section"] = "middle"
    else:
        document.metadata["section"] = "end"

all_splits[0].metadata

```**

```output
{&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;,
 &#x27;start_index&#x27;: 8,
 &#x27;section&#x27;: &#x27;beginning&#x27;}

``` We will need to update the documents in our vector store. We will use a simple [InMemoryVectorStore](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.in_memory.InMemoryVectorStore.html) for this, as we will use some of its specific features (i.e., metadata filtering). Refer to the vector store [integration documentation](/docs/integrations/vectorstores/) for relevant features of your chosen vector store.

```python
from langchain_core.vectorstores import InMemoryVectorStore

vector_store = InMemoryVectorStore(embeddings)
_ = vector_store.add_documents(all_splits)

```API Reference:**[InMemoryVectorStore](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.in_memory.InMemoryVectorStore.html)

Let&#x27;s next define a schema for our search query. We will use [structured output](/docs/concepts/structured_outputs/) for this purpose. Here we define a query as containing a string query and a document section (either "beginning", "middle", or "end"), but this can be defined however you like.

```python
from typing import Literal

from typing_extensions import Annotated

class Search(TypedDict):
    """Search query."""

    query: Annotated[str, ..., "Search query to run."]
    section: Annotated[
        Literal["beginning", "middle", "end"],
        ...,
        "Section to query.",
    ]

```**Finally, we add a step to our LangGraph application to generate a query from the user&#x27;s raw input:

```python
class State(TypedDict):
    question: str
    query: Search
    context: List[Document]
    answer: str

def analyze_query(state: State):
    structured_llm = llm.with_structured_output(Search)
    query = structured_llm.invoke(state["question"])
    return {"query": query}

def retrieve(state: State):
    query = state["query"]
    retrieved_docs = vector_store.similarity_search(
        query["query"],
        filter=lambda doc: doc.metadata.get("section") == query["section"],
    )
    return {"context": retrieved_docs}

def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}

graph_builder = StateGraph(State).add_sequence([analyze_query, retrieve, generate])
graph_builder.add_edge(START, "analyze_query")
graph = graph_builder.compile()

``` Full Code:

```python
from typing import Literal

import bs4
from langchain import hub
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langgraph.graph import START, StateGraph
from typing_extensions import Annotated, List, TypedDict

# Load and chunk contents of the blog
loader = WebBaseLoader(
    web_paths=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("post-content", "post-title", "post-header")
        )
    ),
)
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
all_splits = text_splitter.split_documents(docs)

# Update metadata (illustration purposes)
total_documents = len(all_splits)
third = total_documents // 3

for i, document in enumerate(all_splits):
    if i < third:
        document.metadata["section"] = "beginning"
    elif i < 2 * third:
        document.metadata["section"] = "middle"
    else:
        document.metadata["section"] = "end"

# Index chunks
vector_store = InMemoryVectorStore(embeddings)
_ = vector_store.add_documents(all_splits)

# Define schema for search
class Search(TypedDict):
    """Search query."""

    query: Annotated[str, ..., "Search query to run."]
    section: Annotated[
        Literal["beginning", "middle", "end"],
        ...,
        "Section to query.",
    ]

# Define prompt for question-answering
prompt = hub.pull("rlm/rag-prompt")

# Define state for application
class State(TypedDict):
    question: str
    query: Search
    context: List[Document]
    answer: str

def analyze_query(state: State):
    structured_llm = llm.with_structured_output(Search)
    query = structured_llm.invoke(state["question"])
    return {"query": query}

def retrieve(state: State):
    query = state["query"]
    retrieved_docs = vector_store.similarity_search(
        query["query"],
        filter=lambda doc: doc.metadata.get("section") == query["section"],
    )
    return {"context": retrieved_docs}

def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}

graph_builder = StateGraph(State).add_sequence([analyze_query, retrieve, generate])
graph_builder.add_edge(START, "analyze_query")
graph = graph_builder.compile()

```API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) | [InMemoryVectorStore](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.in_memory.InMemoryVectorStore.html) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph)

```python
display(Image(graph.get_graph().draw_mermaid_png()))

```

![ ](data:image/png;base64,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)

We can test our implementation by specifically asking for context from the end of the post. Note that the model includes different information in its answer.

```python
for step in graph.stream(
    {"question": "What does the end of the post say about Task Decomposition?"},
    stream_mode="updates",
):
    print(f"{step}\n\n----------------\n")

```

```output
{&#x27;analyze_query&#x27;: {&#x27;query&#x27;: {&#x27;query&#x27;: &#x27;Task Decomposition&#x27;, &#x27;section&#x27;: &#x27;end&#x27;}}}

----------------

{&#x27;retrieve&#x27;: {&#x27;context&#x27;: [Document(id=&#x27;d6cef137-e1e8-4ddc-91dc-b62bd33c6020&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 39221, &#x27;section&#x27;: &#x27;end&#x27;}, page_content=&#x27;Finite context length: The restricted context capacity limits the inclusion of historical information, detailed instructions, API call context, and responses. The design of the system has to work with this limited communication bandwidth, while mechanisms like self-reflection to learn from past mistakes would benefit a lot from long or infinite context windows. Although vector stores and retrieval can provide access to a larger knowledge pool, their representation power is not as powerful as full attention.\n\n\nChallenges in long-term planning and task decomposition: Planning over a lengthy history and effectively exploring the solution space remain challenging. LLMs struggle to adjust plans when faced with unexpected errors, making them less robust compared to humans who learn from trial and error.&#x27;), Document(id=&#x27;d1834ae1-eb6a-43d7-a023-08dfa5028799&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 39086, &#x27;section&#x27;: &#x27;end&#x27;}, page_content=&#x27;}\n]\nChallenges#\nAfter going through key ideas and demos of building LLM-centered agents, I start to see a couple common limitations:&#x27;), Document(id=&#x27;ca7f06e4-2c2e-4788-9a81-2418d82213d9&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 32942, &#x27;section&#x27;: &#x27;end&#x27;}, page_content=&#x27;}\n]\nThen after these clarification, the agent moved into the code writing mode with a different system message.\nSystem message:&#x27;), Document(id=&#x27;1fcc2736-30f4-4ef6-90f2-c64af92118cb&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;, &#x27;start_index&#x27;: 35127, &#x27;section&#x27;: &#x27;end&#x27;}, page_content=&#x27;"content": "You will get instructions for code to write.\\nYou will write a very long answer. Make sure that every detail of the architecture is, in the end, implemented as code.\\nMake sure that every detail of the architecture is, in the end, implemented as code.\\n\\nThink step by step and reason yourself to the right decisions to make sure we get it right.\\nYou will first lay out the names of the core classes, functions, methods that will be necessary, as well as a quick comment on their purpose.\\n\\nThen you will output the content of each file including ALL code.\\nEach file must strictly follow a markdown code block format, where the following tokens must be replaced such that\\nFILENAME is the lowercase file name including the file extension,\\nLANG is the markup code block language for the code\&#x27;s language, and CODE is the code:\\n\\nFILENAME\\n\`\`\`LANG\\nCODE\\n\`\`\`\\n\\nYou will start with the \\"entrypoint\\" file, then go to the ones that are imported by that file, and so on.\\nPlease&#x27;)]}}

----------------

{&#x27;generate&#x27;: {&#x27;answer&#x27;: &#x27;The end of the post highlights that task decomposition faces challenges in long-term planning and adapting to unexpected errors. LLMs struggle with adjusting their plans, making them less robust compared to humans who learn from trial and error. This indicates a limitation in effectively exploring the solution space and handling complex tasks.&#x27;}}

----------------

``` In both the streamed steps and the [LangSmith trace](https://smith.langchain.com/public/bdbaae61-130c-4338-8b59-9315dfee22a0/r), we can now observe the structured query that was fed into the retrieval step.

Query Analysis is a rich problem with a wide range of approaches. Refer to the [how-to guides](/docs/how_to/#query-analysis) for more examples.

## Next steps[​](#next-steps)

We&#x27;ve covered the steps to build a basic Q&A app over data:

- Loading data with a [Document Loader](/docs/concepts/document_loaders/)

- Chunking the indexed data with a [Text Splitter](/docs/concepts/text_splitters/) to make it more easily usable by a model

- [Embedding the data](/docs/concepts/embedding_models/) and storing the data in a [vectorstore](/docs/how_to/vectorstores/)

- [Retrieving](/docs/concepts/retrievers/) the previously stored chunks in response to incoming questions

- Generating an answer using the retrieved chunks as context.

In [Part 2](/docs/tutorials/qa_chat_history/) of the tutorial, we will extend the implementation here to accommodate conversation-style interactions and multi-step retrieval processes.

Further reading:

- [Return sources](/docs/how_to/qa_sources/): Learn how to return source documents

- [Streaming](/docs/how_to/streaming/): Learn how to stream outputs and intermediate steps

- [Add chat history](/docs/how_to/message_history/): Learn how to add chat history to your app

- [Retrieval conceptual guide](/docs/concepts/retrieval/): A high-level overview of specific retrieval techniques

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/tutorials/rag.ipynb)

- [Overview](#overview)[Indexing](#indexing)
- [Retrieval and generation](#retrieval-and-generation)

- [Setup](#setup)[Jupyter Notebook](#jupyter-notebook)
- [Installation](#installation)
- [LangSmith](#langsmith)

- [Components](#components)
- [Preview](#preview)
- [Detailed walkthrough](#detailed-walkthrough)
- [1. Indexing](#indexing)[Loading documents](#loading-documents)
- [Splitting documents](#splitting-documents)
- [Storing documents](#storing-documents)

- [2. Retrieval and Generation](#orchestration)
- [Query analysis](#query-analysis)
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