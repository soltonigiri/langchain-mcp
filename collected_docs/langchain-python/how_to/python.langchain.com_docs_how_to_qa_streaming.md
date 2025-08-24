How to stream results from your RAG application | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/qa_streaming.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/qa_streaming.ipynb)How to stream results from your RAG application This guide explains how to stream results from a [RAG](/docs/concepts/rag/) application. It covers streaming tokens from the final output as well as intermediate steps of a chain (e.g., from query re-writing). We&#x27;ll work off of the Q&A app with sources we built over the [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) blog post by Lilian Weng in the [RAG tutorial](/docs/tutorials/rag/). Setup[​](#setup) Dependencies[​](#dependencies) We&#x27;ll use the following packages:

```python
%pip install --upgrade --quiet  langchain langchain-community langchainhub beautifulsoup4

``` LangSmith[​](#langsmith) Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com). Note that LangSmith is not needed, but it is helpful. If you do want to use LangSmith, after you sign up at the link above, make sure to set your environment variables to start logging traces:

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` Components[​](#components) We will need to select three components from LangChain&#x27;s suite of integrations. A [chat model](/docs/integrations/chat/): Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` An [embedding model](/docs/integrations/text_embedding/): Select [embeddings model](/docs/integrations/text_embedding/):OpenAI▾[OpenAI](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[HuggingFace](#)[Ollama](#)[Cohere](#)[MistralAI](#)[Nomic](#)[NVIDIA](#)[Voyage AI](#)[IBM watsonx](#)[Fake](#)

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

``` And a [vector store](/docs/integrations/vectorstores/): Select [vector store](/docs/integrations/vectorstores/):In-memory▾[In-memory](#)[AstraDB](#)[Chroma](#)[FAISS](#)[Milvus](#)[MongoDB](#)[PGVector](#)[PGVectorStore](#)[Pinecone](#)[Qdrant](#)

```bash
pip install -qU langchain-core

```

```python
from langchain_core.vectorstores import InMemoryVectorStore

vector_store = InMemoryVectorStore(embeddings)

``` RAG application[​](#rag-application) Let&#x27;s reconstruct the Q&A app with sources we built over the [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) blog post by Lilian Weng in the [RAG tutorial](/docs/tutorials/rag/). First we index our documents:

```python
import bs4
from langchain import hub
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
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

```API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html)

```python
# Index chunks
_ = vector_store.add_documents(documents=all_splits)

```**Next we build the application:

```python
from langchain import hub
from langchain_core.documents import Document
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict

# Define prompt for question-answering
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
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))

``` ![ ](data:image/png;base64,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) ## Streaming final outputs[​](#streaming-final-outputs) LangGraph supports several [streaming modes](https://langchain-ai.github.io/langgraph/how-tos/#streaming), which can be controlled by specifying the stream_mode parameter. Setting stream_mode="messages" allows us to stream tokens from chat model invocations. In general there can be multiple chat model invocations in an application (although here there is just one). Below, we filter to only the last step using the name of the corresponding node:

```python
input_message = "What is Task Decomposition?"

for message, metadata in graph.stream(
    {"question": "What is Task Decomposition?"},
    stream_mode="messages",
):
    if metadata["langgraph_node"] == "generate":
        print(message.content, end="|")

```

```output
|Task| De|composition| is| a| technique| used| to| break| down| complex| tasks| into| smaller|,| more| manageable| steps|.| It| often| involves| prompting| models| to| "|think| step| by| step|,"| allowing| for| clearer| reasoning| and| better| performance| on| intricate| problems|.| This| can| be| achieved| through| various| methods|,| including| simple| prompts|,| task|-specific| instructions|,| or| human| input|.||

``` ## Streaming intermediate steps[​](#streaming-intermediate-steps) Other streaming modes will generally stream steps from our invocation-- i.e., state updates from individual nodes. In this case, each node is just appending a new key to the state:

```python
for step in graph.stream(
    {"question": "What is Task Decomposition?"},
    stream_mode="updates",
):
    print(f"{step}\n\n----------------\n")

```

```output
{&#x27;retrieve&#x27;: {&#x27;context&#x27;: [Document(id=&#x27;5bf5e308-6ccb-4f09-94d2-d0c36b8c9980&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;}, page_content=&#x27;Fig. 1. Overview of a LLM-powered autonomous agent system.\nComponent One: Planning#\nA complicated task usually involves many steps. An agent needs to know what they are and plan ahead.\nTask Decomposition#\nChain of thought (CoT; Wei et al. 2022) has become a standard prompting technique for enhancing model performance on complex tasks. The model is instructed to “think step by step” to utilize more test-time computation to decompose hard tasks into smaller and simpler steps. CoT transforms big tasks into multiple manageable tasks and shed lights into an interpretation of the model’s thinking process.&#x27;), Document(id=&#x27;d8aed221-7943-414d-8ed7-63c2b0e7523b&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;}, page_content=&#x27;Tree of Thoughts (Yao et al. 2023) extends CoT by exploring multiple reasoning possibilities at each step. It first decomposes the problem into multiple thought steps and generates multiple thoughts per step, creating a tree structure. The search process can be BFS (breadth-first search) or DFS (depth-first search) with each state evaluated by a classifier (via a prompt) or majority vote.\nTask decomposition can be done (1) by LLM with simple prompting like "Steps for XYZ.\\n1.", "What are the subgoals for achieving XYZ?", (2) by using task-specific instructions; e.g. "Write a story outline." for writing a novel, or (3) with human inputs.&#x27;), Document(id=&#x27;bfa87007-02ef-4f81-a008-4522ecea1025&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;}, page_content=&#x27;Resources:\n1. Internet access for searches and information gathering.\n2. Long Term memory management.\n3. GPT-3.5 powered Agents for delegation of simple tasks.\n4. File output.\n\nPerformance Evaluation:\n1. Continuously review and analyze your actions to ensure you are performing to the best of your abilities.\n2. Constructively self-criticize your big-picture behavior constantly.\n3. Reflect on past decisions and strategies to refine your approach.\n4. Every command has a cost, so be smart and efficient. Aim to complete tasks in the least number of steps.&#x27;), Document(id=&#x27;6aff7fc0-5c21-4986-9f1e-91e89715d934&#x27;, metadata={&#x27;source&#x27;: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;}, page_content="(3) Task execution: Expert models execute on the specific tasks and log results.\nInstruction:\n\nWith the input and the inference results, the AI assistant needs to describe the process and results. The previous stages can be formed as - User Input: {{ User Input }}, Task Planning: {{ Tasks }}, Model Selection: {{ Model Assignment }}, Task Execution: {{ Predictions }}. You must first answer the user&#x27;s request in a straightforward manner. Then describe the task process and show your analysis and model inference results to the user in the first person. If inference results contain a file path, must tell the user the complete file path.")]}}

----------------

{&#x27;generate&#x27;: {&#x27;answer&#x27;: &#x27;Task Decomposition is the process of breaking down a complex task into smaller, manageable steps to enhance understanding and execution. Techniques like Chain of Thought (CoT) and Tree of Thoughts (ToT) guide models to think through steps systematically, allowing for better problem-solving. It can be achieved through simple prompting, task-specific instructions, or human input.&#x27;}}

----------------

``` For more on streaming with LangGraph, check out its [streaming documentation](https://langchain-ai.github.io/langgraph/how-tos/#streaming). For more information on streaming individual LangChain [Runnables](/docs/concepts/runnables/), refer to [this guide](/docs/how_to/streaming/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/qa_streaming.ipynb)[Setup](#setup)[Dependencies](#dependencies)
- [LangSmith](#langsmith)
- [Components](#components)

- [RAG application](#rag-application)
- [Streaming final outputs](#streaming-final-outputs)
- [Streaming intermediate steps](#streaming-intermediate-steps)

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