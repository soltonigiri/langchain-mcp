Summarize Text | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/tutorials/summarization.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/tutorials/summarization.ipynb)Summarize Text infoThis tutorial demonstrates text summarization using built-in chains and [LangGraph](https://langchain-ai.github.io/langgraph/).A [previous version](https://python.langchain.com/v0.1/docs/use_cases/summarization/) of this page showcased the legacy chains [StuffDocumentsChain](/docs/versions/migrating_chains/stuff_docs_chain/), [MapReduceDocumentsChain](/docs/versions/migrating_chains/map_reduce_chain/), and [RefineDocumentsChain](https://python.langchain.com/docs/versions/migrating_chains/refine_docs_chain/). See [here](/docs/versions/migrating_chains/) for information on using those abstractions and a comparison with the methods demonstrated in this tutorial. Suppose you have a set of documents (PDFs, Notion pages, customer questions, etc.) and you want to summarize the content. LLMs are a great tool for this given their proficiency in understanding and synthesizing text. In the context of [retrieval-augmented generation](/docs/tutorials/rag/), summarizing text can help distill the information in a large number of retrieved documents to provide context for a LLM. In this walkthrough we&#x27;ll go over how to summarize content from multiple documents using LLMs. ![Image description ](/assets/images/summarization_use_case_1-874f7b2c94f64216f1f967fb5aca7bc1.png) Concepts[​](#concepts) Concepts we will cover are: Using [language models](/docs/concepts/chat_models/). Using [document loaders](/docs/concepts/document_loaders/), specifically the [WebBaseLoader](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.web_base.WebBaseLoader.html) to load content from an HTML webpage. Two ways to summarize or otherwise combine documents. [Stuff](/docs/tutorials/summarization/#stuff), which simply concatenates documents into a prompt; [Map-reduce](/docs/tutorials/summarization/#map-reduce), for larger sets of documents. This splits documents into batches, summarizes those, and then summarizes the summaries. Shorter, targeted guides on these strategies and others, including [iterative refinement](/docs/how_to/summarize_refine/), can be found in the [how-to guides](/docs/how_to/#summarization). Setup[​](#setup) Jupyter Notebook[​](#jupyter-notebook) This guide (and most of the other guides in the documentation) uses [Jupyter notebooks](https://jupyter.org/) and assumes the reader is as well. Jupyter notebooks are perfect for learning how to work with LLM systems because oftentimes things can go wrong (unexpected output, API down, etc) and going through guides in an interactive environment is a great way to better understand them. This and other tutorials are perhaps most conveniently run in a Jupyter notebook. See [here](https://jupyter.org/install) for instructions on how to install. Installation[​](#installation) To install LangChain run: PipConda

```bash
pip install langchain

```

```bash
conda install langchain -c conda-forge

``` For more details, see our [Installation guide](/docs/how_to/installation/). LangSmith[​](#langsmith) Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com). After you sign up at the link above, make sure to set your environment variables to start logging traces:

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."

``` Or, if in a notebook, you can set them with:

```python
import getpass
import os

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` Overview[​](#overview) A central question for building a summarizer is how to pass your documents into the LLM&#x27;s context window. Two common approaches for this are: Stuff: Simply "stuff" all your documents into a single prompt. This is the simplest approach (see [here](/docs/how_to/summarize_stuff/) for more on the create_stuff_documents_chain constructor, which is used for this method). Map-reduce: Summarize each document on its own in a "map" step and then "reduce" the summaries into a final summary (see [here](https://python.langchain.com/api_reference/langchain/chains/langchain.chains.combine_documents.map_reduce.MapReduceDocumentsChain.html) for more on the MapReduceDocumentsChain, which is used for this method). Note that map-reduce is especially effective when understanding of a sub-document does not rely on preceding context. For example, when summarizing a corpus of many, shorter documents. In other cases, such as summarizing a novel or body of text with an inherent sequence, [iterative refinement](/docs/how_to/summarize_refine/) may be more effective. ![Image description ](/assets/images/summarization_use_case_2-f2a4d5d60980a79140085fb7f8043217.png) Setup[​](#setup-1) First set environment variables and install packages:

```python
%pip install --upgrade --quiet tiktoken langchain langgraph beautifulsoup4 langchain-community

# Set env var OPENAI_API_KEY or load from a .env file
# import dotenv

# dotenv.load_dotenv()

```

```python
import os

os.environ["LANGSMITH_TRACING"] = "true"

``` First we load in our documents. We will use [WebBaseLoader](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.web_base.WebBaseLoader.html) to load a blog post:

```python
from langchain_community.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://lilianweng.github.io/posts/2023-06-23-agent/")
docs = loader.load()

``` Let&#x27;s next select a LLM: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` Stuff: summarize in a single LLM call[​](#stuff) We can use [create_stuff_documents_chain](https://python.langchain.com/api_reference/langchain/chains/langchain.chains.combine_documents.stuff.create_stuff_documents_chain.html), especially if using larger context window models such as: 128k token OpenAI gpt-4o 200k token Anthropic claude-3-5-sonnet-latest The chain will take a list of documents, insert them all into a prompt, and pass that prompt to an LLM:

```python
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.llm import LLMChain
from langchain_core.prompts import ChatPromptTemplate

# Define prompt
prompt = ChatPromptTemplate.from_messages(
    [("system", "Write a concise summary of the following:\\n\\n{context}")]
)

# Instantiate chain
chain = create_stuff_documents_chain(llm, prompt)

# Invoke chain
result = chain.invoke({"context": docs})
print(result)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
The article "LLM Powered Autonomous Agents" by Lilian Weng discusses the development and capabilities of autonomous agents powered by large language models (LLMs). It outlines a system architecture that includes three main components: Planning, Memory, and Tool Use.

1. **Planning** involves task decomposition, where complex tasks are broken down into manageable subgoals, and self-reflection, allowing agents to learn from past actions to improve future performance. Techniques like Chain of Thought (CoT) and Tree of Thoughts (ToT) are highlighted for enhancing reasoning and planning.

2. **Memory** is categorized into short-term and long-term memory, with mechanisms for fast retrieval using Maximum Inner Product Search (MIPS) algorithms. This allows agents to retain and recall information effectively.

3. **Tool Use** enables agents to interact with external APIs and tools, enhancing their capabilities beyond the limitations of their training data. Examples include MRKL systems and frameworks like HuggingGPT, which facilitate task planning and execution.

The article also addresses challenges such as finite context length, difficulties in long-term planning, and the reliability of natural language interfaces. It concludes with case studies demonstrating the practical applications of these concepts in scientific discovery and interactive simulations. Overall, the article emphasizes the potential of LLMs as powerful problem solvers in autonomous agent systems.

```**Streaming[​](#streaming) Note that we can also stream the result token-by-token:

```python
for token in chain.stream({"context": docs}):
    print(token, end="|")

```

```output
|The| article| "|LL|M| Powered| Autonomous| Agents|"| by| Lil|ian| W|eng| discusses| the| development| and| capabilities| of| autonomous| agents| powered| by| large| language| models| (|LL|Ms|).| It| outlines| a| system| architecture| that| includes| three| main| components|:| Planning|,| Memory|,| and| Tool| Use|.|

|1|.| **|Planning|**| involves| task| decomposition|,| where| complex| tasks| are| broken| down| into| manageable| sub|go|als|,| and| self|-ref|lection|,| allowing| agents| to| learn| from| past| actions| to| improve| future| performance|.| Techniques| like| Chain| of| Thought| (|Co|T|)| and| Tree| of| Thoughts| (|To|T|)| are| highlighted| for| enhancing| reasoning| and| planning|.

|2|.| **|Memory|**| is| categorized| into| short|-term| and| long|-term| memory|,| with| mechanisms| for| fast| retrieval| using| Maximum| Inner| Product| Search| (|M|IPS|)| algorithms|.| This| allows| agents| to| retain| and| recall| information| effectively|.

|3|.| **|Tool| Use|**| emphasizes| the| integration| of| external| APIs| and| tools| to| extend| the| capabilities| of| L|LM|s|,| enabling| them| to| perform| tasks| beyond| their| inherent| limitations|.| Examples| include| MR|KL| systems| and| frameworks| like| Hug|ging|GPT|,| which| facilitate| task| planning| and| execution|.

|The| article| also| addresses| challenges| such| as| finite| context| length|,| difficulties| in| long|-term| planning|,| and| the| reliability| of| natural| language| interfaces|.| It| concludes| with| case| studies| demonstrating| the| practical| applications| of| L|LM|-powered| agents| in| scientific| discovery| and| interactive| simulations|.| Overall|,| the| piece| illustrates| the| potential| of| L|LM|s| as| general| problem| sol|vers| and| their| evolving| role| in| autonomous| systems|.||

``` Go deeper[​](#go-deeper) You can easily customize the prompt. You can easily try different LLMs, (e.g., [Claude](/docs/integrations/chat/anthropic/)) via the llm parameter. Map-Reduce: summarize long texts via parallelization[​](#map-reduce) Let&#x27;s unpack the map reduce approach. For this, we&#x27;ll first map each document to an individual summary using an LLM. Then we&#x27;ll reduce or consolidate those summaries into a single global summary. Note that the map step is typically parallelized over the input documents. [LangGraph](https://langchain-ai.github.io/langgraph/), built on top of langchain-core, supports [map-reduce](https://langchain-ai.github.io/langgraph/how-tos/map-reduce/) workflows and is well-suited to this problem: LangGraph allows for individual steps (such as successive summarizations) to be streamed, allowing for greater control of execution; LangGraph&#x27;s [checkpointing](https://langchain-ai.github.io/langgraph/how-tos/persistence/) supports error recovery, extending with human-in-the-loop workflows, and easier incorporation into conversational applications. The LangGraph implementation is straightforward to modify and extend, as we will see below. Map[​](#map) Let&#x27;s first define the prompt associated with the map step. We can use the same summarization prompt as in the stuff approach, above:

```python
from langchain_core.prompts import ChatPromptTemplate

map_prompt = ChatPromptTemplate.from_messages(
    [("system", "Write a concise summary of the following:\\n\\n{context}")]
)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) We can also use the Prompt Hub to store and fetch prompts. This will work with your [LangSmith API key](https://docs.smith.langchain.com/). For example, see the map prompt [here](https://smith.langchain.com/hub/rlm/map-prompt).

```python
from langchain import hub

map_prompt = hub.pull("rlm/map-prompt")

```**Reduce[​](#reduce) We also define a prompt that takes the document mapping results and reduces them into a single output.

```python
# Also available via the hub: `hub.pull("rlm/reduce-prompt")`
reduce_template = """
The following is a set of summaries:
{docs}
Take these and distill it into a final, consolidated summary
of the main themes.
"""

reduce_prompt = ChatPromptTemplate([("human", reduce_template)])

``` Orchestration via LangGraph[​](#orchestration-via-langgraph) Below we implement a simple application that maps the summarization step on a list of documents, then reduces them using the above prompts. Map-reduce flows are particularly useful when texts are long compared to the context window of a LLM. For long texts, we need a mechanism that ensures that the context to be summarized in the reduce step does not exceed a model&#x27;s context window size. Here we implement a recursive "collapsing" of the summaries: the inputs are partitioned based on a token limit, and summaries are generated of the partitions. This step is repeated until the total length of the summaries is within a desired limit, allowing for the summarization of arbitrary-length text. First we chunk the blog post into smaller "sub documents" to be mapped:

```python
from langchain_text_splitters import CharacterTextSplitter

text_splitter = CharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=1000, chunk_overlap=0
)
split_docs = text_splitter.split_documents(docs)
print(f"Generated {len(split_docs)} documents.")

```

```output
Created a chunk of size 1003, which is longer than the specified 1000
``````output
Generated 14 documents.

``` Next, we define our graph. Note that we define an artificially low maximum token length of 1,000 tokens to illustrate the "collapsing" step.

```python
import operator
from typing import Annotated, List, Literal, TypedDict

from langchain.chains.combine_documents.reduce import (
    acollapse_docs,
    split_list_of_docs,
)
from langchain_core.documents import Document
from langgraph.constants import Send
from langgraph.graph import END, START, StateGraph

token_max = 1000

def length_function(documents: List[Document]) -> int:
    """Get number of tokens for input contents."""
    return sum(llm.get_num_tokens(doc.page_content) for doc in documents)

# This will be the overall state of the main graph.
# It will contain the input document contents, corresponding
# summaries, and a final summary.
class OverallState(TypedDict):
    # Notice here we use the operator.add
    # This is because we want combine all the summaries we generate
    # from individual nodes back into one list - this is essentially
    # the "reduce" part
    contents: List[str]
    summaries: Annotated[list, operator.add]
    collapsed_summaries: List[Document]
    final_summary: str

# This will be the state of the node that we will "map" all
# documents to in order to generate summaries
class SummaryState(TypedDict):
    content: str

# Here we generate a summary, given a document
async def generate_summary(state: SummaryState):
    prompt = map_prompt.invoke(state["content"])
    response = await llm.ainvoke(prompt)
    return {"summaries": [response.content]}

# Here we define the logic to map out over the documents
# We will use this an edge in the graph
def map_summaries(state: OverallState):
    # We will return a list of `Send` objects
    # Each `Send` object consists of the name of a node in the graph
    # as well as the state to send to that node
    return [
        Send("generate_summary", {"content": content}) for content in state["contents"]
    ]

def collect_summaries(state: OverallState):
    return {
        "collapsed_summaries": [Document(summary) for summary in state["summaries"]]
    }

async def _reduce(input: dict) -> str:
    prompt = reduce_prompt.invoke(input)
    response = await llm.ainvoke(prompt)
    return response.content

# Add node to collapse summaries
async def collapse_summaries(state: OverallState):
    doc_lists = split_list_of_docs(
        state["collapsed_summaries"], length_function, token_max
    )
    results = []
    for doc_list in doc_lists:
        results.append(await acollapse_docs(doc_list, _reduce))

    return {"collapsed_summaries": results}

# This represents a conditional edge in the graph that determines
# if we should collapse the summaries or not
def should_collapse(
    state: OverallState,
) -> Literal["collapse_summaries", "generate_final_summary"]:
    num_tokens = length_function(state["collapsed_summaries"])
    if num_tokens > token_max:
        return "collapse_summaries"
    else:
        return "generate_final_summary"

# Here we will generate the final summary
async def generate_final_summary(state: OverallState):
    response = await _reduce(state["collapsed_summaries"])
    return {"final_summary": response}

# Construct the graph
# Nodes:
graph = StateGraph(OverallState)
graph.add_node("generate_summary", generate_summary)  # same as before
graph.add_node("collect_summaries", collect_summaries)
graph.add_node("collapse_summaries", collapse_summaries)
graph.add_node("generate_final_summary", generate_final_summary)

# Edges:
graph.add_conditional_edges(START, map_summaries, ["generate_summary"])
graph.add_edge("generate_summary", "collect_summaries")
graph.add_conditional_edges("collect_summaries", should_collapse)
graph.add_conditional_edges("collapse_summaries", should_collapse)
graph.add_edge("generate_final_summary", END)

app = graph.compile()

```API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) | [Send](https://langchain-ai.github.io/langgraph/reference/types/#langgraph.types.Send) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) LangGraph allows the graph structure to be plotted to help visualize its function:

```python
from IPython.display import Image

Image(app.get_graph().draw_mermaid_png())

```**![ ](data:image/jpg;base64,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) When running the application, we can stream the graph to observe its sequence of steps. Below, we will simply print out the name of the step. Note that because we have a loop in the graph, it can be helpful to specify a [recursion_limit](https://langchain-ai.github.io/langgraph/reference/errors/#langgraph.errors.GraphRecursionError) on its execution. This will raise a specific error when the specified limit is exceeded.

```python
async for step in app.astream(
    {"contents": [doc.page_content for doc in split_docs]},
    {"recursion_limit": 10},
):
    print(list(step.keys()))

```

```output
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;generate_summary&#x27;]
[&#x27;collect_summaries&#x27;]
[&#x27;collapse_summaries&#x27;]
[&#x27;collapse_summaries&#x27;]
[&#x27;generate_final_summary&#x27;]

```

```python
print(step)

```

```output
{&#x27;generate_final_summary&#x27;: {&#x27;final_summary&#x27;: &#x27;The consolidated summary of the main themes from the provided documents is as follows:\n\n1. **Integration of Large Language Models (LLMs) in Autonomous Agents**: The documents explore the evolving role of LLMs in autonomous systems, emphasizing their enhanced reasoning and acting capabilities through methodologies that incorporate structured planning, memory systems, and tool use.\n\n2. **Core Components of Autonomous Agents**:\n   - **Planning**: Techniques like task decomposition (e.g., Chain of Thought) and external classical planners are utilized to facilitate long-term planning by breaking down complex tasks.\n   - **Memory**: The memory system is divided into short-term (in-context learning) and long-term memory, with parallels drawn between human memory and machine learning to improve agent performance.\n   - **Tool Use**: Agents utilize external APIs and algorithms to enhance problem-solving abilities, exemplified by frameworks like HuggingGPT that manage task workflows.\n\n3. **Neuro-Symbolic Architectures**: The integration of MRKL (Modular Reasoning, Knowledge, and Language) systems combines neural and symbolic expert modules with LLMs, addressing challenges in tasks such as verbal math problem-solving.\n\n4. **Specialized Applications**: Case studies, such as ChemCrow and projects in anticancer drug discovery, demonstrate the advantages of LLMs augmented with expert tools in specialized domains.\n\n5. **Challenges and Limitations**: The documents highlight challenges such as hallucination in model outputs and the finite context length of LLMs, which affects their ability to incorporate historical information and perform self-reflection. Techniques like Chain of Hindsight and Algorithm Distillation are discussed to enhance model performance through iterative learning.\n\n6. **Structured Software Development**: A systematic approach to creating Python software projects is emphasized, focusing on defining core components, managing dependencies, and adhering to best practices for documentation.\n\nOverall, the integration of structured planning, memory systems, and advanced tool use aims to enhance the capabilities of LLM-powered autonomous agents while addressing the challenges and limitations these technologies face in real-world applications.&#x27;}}

``` In the corresponding [LangSmith trace](https://smith.langchain.com/public/9d7b1d50-e1d6-44c9-9ab2-eabef621c883/r) we can see the individual LLM calls, grouped under their respective nodes. Go deeper[​](#go-deeper-1) Customization** As shown above, you can customize the LLMs and prompts for map and reduce stages.

**Real-world use-case**

- See [this blog post](https://blog.langchain.dev/llms-to-improve-documentation/) case-study on analyzing user interactions (questions about LangChain documentation)!

- The blog post and associated [repo](https://github.com/mendableai/QA_clustering) also introduce clustering as a means of summarization.

- This opens up another path beyond the stuff or map-reduce approaches that is worth considering.

![Image description ](/assets/images/summarization_use_case_3-896f435bc48194ddaead73043027e16f.png)

## Next steps[​](#next-steps)

We encourage you to check out the [how-to guides](/docs/how_to/) for more detail on:

- Other summarization strategies, such as [iterative refinement](/docs/how_to/summarize_refine/)

- Built-in [document loaders](/docs/how_to/#document-loaders) and [text-splitters](/docs/how_to/#text-splitters)

- Integrating various combine-document chains into a [RAG application](/docs/tutorials/rag/)

- Incorporating retrieval into a [chatbot](/docs/how_to/chatbots_retrieval/)

and other concepts.

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/tutorials/summarization.ipynb)

- [Concepts](#concepts)
- [Setup](#setup)[Jupyter Notebook](#jupyter-notebook)
- [Installation](#installation)
- [LangSmith](#langsmith)

- [Overview](#overview)
- [Setup](#setup-1)
- [Stuff: summarize in a single LLM call](#stuff)[Streaming](#streaming)
- [Go deeper](#go-deeper)

- [Map-Reduce: summarize long texts via parallelization](#map-reduce)[Map](#map)
- [Reduce](#reduce)
- [Orchestration via LangGraph](#orchestration-via-langgraph)
- [Go deeper](#go-deeper-1)

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