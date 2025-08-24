How to get a RAG application to add citations | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/qa_citations.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/qa_citations.ipynb)How to get a RAG application to add citations This guide reviews methods to get a model to cite which parts of the source documents it referenced in generating its response. We will cover five methods: Using tool-calling to cite document IDs; Using tool-calling to cite documents IDs and provide text snippets; Direct prompting; Retrieval post-processing (i.e., compressing the retrieved context to make it more relevant); Generation post-processing (i.e., issuing a second LLM call to annotate a generated answer with citations). We generally suggest using the first item of the list that works for your use-case. That is, if your model supports tool-calling, try methods 1 or 2; otherwise, or if those fail, advance down the list. Let&#x27;s first create a simple [RAG](/docs/concepts/rag/) chain. To start we&#x27;ll just retrieve from Wikipedia using the [WikipediaRetriever](https://python.langchain.com/api_reference/community/retrievers/langchain_community.retrievers.wikipedia.WikipediaRetriever.html). We will use the same [LangGraph](/docs/concepts/architecture/#langgraph) implementation from the [RAG Tutorial](/docs/tutorials/rag/). Setup[​](#setup) First we&#x27;ll need to install some dependencies:

```python
%pip install -qU langchain-community wikipedia

``` Let&#x27;s first select a LLM: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` We can now load a [retriever](/docs/concepts/retrievers/) and construct our [prompt](/docs/concepts/prompt_templates/):

```python
from langchain_community.retrievers import WikipediaRetriever
from langchain_core.prompts import ChatPromptTemplate

system_prompt = (
    "You&#x27;re a helpful AI assistant. Given a user question "
    "and some Wikipedia article snippets, answer the user "
    "question. If none of the articles answer the question, "
    "just say you don&#x27;t know."
    "\n\nHere are the Wikipedia articles: "
    "{context}"
)

retriever = WikipediaRetriever(top_k_results=6, doc_content_chars_max=2000)
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{question}"),
    ]
)
prompt.pretty_print()

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
================================[1m System Message [0m================================

You&#x27;re a helpful AI assistant. Given a user question and some Wikipedia article snippets, answer the user question. If none of the articles answer the question, just say you don&#x27;t know.

Here are the Wikipedia articles: [33;1m[1;3m{context}[0m

================================[1m Human Message [0m=================================

[33;1m[1;3m{question}[0m

```**Now that we&#x27;ve got a [model](/docs/concepts/chat_models/), [retriever](/docs/concepts/retrievers/) and [prompt](/docs/concepts/prompt_templates/), let&#x27;s chain them all together. Following the how-to guide on [adding citations](/docs/how_to/qa_citations/) to a RAG application, we&#x27;ll make it so our chain returns both the answer and the retrieved Documents. This uses the same [LangGraph](/docs/concepts/architecture/#langgraph) implementation as in the [RAG Tutorial](/docs/tutorials/rag/).

```python
from langchain_core.documents import Document
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict

# Define state for application
class State(TypedDict):
    question: str
    context: List[Document]
    answer: str

# Define application steps
def retrieve(state: State):
    retrieved_docs = retriever.invoke(state["question"])
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

```**![ ](data:image/png;base64,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)

```python
result = graph.invoke({"question": "How fast are cheetahs?"})

sources = [doc.metadata["source"] for doc in result["context"]]
print(f"Sources: {sources}\n\n")
print(f"Answer: {result[&#x27;answer&#x27;]}")

```

```output
Sources: [&#x27;https://en.wikipedia.org/wiki/Cheetah&#x27;, &#x27;https://en.wikipedia.org/wiki/Southeast_African_cheetah&#x27;, &#x27;https://en.wikipedia.org/wiki/Footspeed&#x27;, &#x27;https://en.wikipedia.org/wiki/Fastest_animals&#x27;, &#x27;https://en.wikipedia.org/wiki/Pursuit_predation&#x27;, &#x27;https://en.wikipedia.org/wiki/Gepard-class_fast_attack_craft&#x27;]

Answer: Cheetahs are capable of running at speeds between 93 to 104 km/h (58 to 65 mph).

``` Check out the [LangSmith trace](https://smith.langchain.com/public/ed043789-8599-44de-b88e-ba463ea454a3/r). Tool-calling[​](#tool-calling) If your LLM of choice implements a [tool-calling](/docs/concepts/tool_calling/) feature, you can use it to make the model specify which of the provided documents it&#x27;s referencing when generating its answer. LangChain tool-calling models implement a .with_structured_output method which will force generation adhering to a desired schema (see details [here](/docs/how_to/structured_output/)). Cite documents[​](#cite-documents) To cite documents using an identifier, we format the identifiers into the prompt, then use .with_structured_output to coerce the LLM to reference these identifiers in its output. First we define a schema for the output. The .with_structured_output supports multiple formats, including JSON schema and Pydantic. Here we will use Pydantic:

```python
from pydantic import BaseModel, Field

class CitedAnswer(BaseModel):
    """Answer the user question based only on the given sources, and cite the sources used."""

    answer: str = Field(
        ...,
        description="The answer to the user question, which is based only on the given sources.",
    )
    citations: List[int] = Field(
        ...,
        description="The integer IDs of the SPECIFIC sources which justify the answer.",
    )

``` Let&#x27;s see what the model output is like when we pass in our functions and a user input:

```python
structured_llm = llm.with_structured_output(CitedAnswer)

example_q = """What Brian&#x27;s height?

Source: 1
Information: Suzy is 6&#x27;2"

Source: 2
Information: Jeremiah is blonde

Source: 3
Information: Brian is 3 inches shorter than Suzy"""
result = structured_llm.invoke(example_q)

result

```

```output
CitedAnswer(answer=&#x27;Brian is 5\&#x27;11".&#x27;, citations=[1, 3])

``` Or as a dict:

```python
result.dict()

```

```output
{&#x27;answer&#x27;: &#x27;Brian is 5\&#x27;11".&#x27;, &#x27;citations&#x27;: [1, 3]}

``` Now we structure the source identifiers into the prompt to replicate with our chain. We will make three changes: Update the prompt to include source identifiers; Use the structured_llm (i.e., llm.with_structured_output(CitedAnswer)); Return the Pydantic object in the output.

```python
def format_docs_with_id(docs: List[Document]) -> str:
    formatted = [
        f"Source ID: {i}\nArticle Title: {doc.metadata[&#x27;title&#x27;]}\nArticle Snippet: {doc.page_content}"
        for i, doc in enumerate(docs)
    ]
    return "\n\n" + "\n\n".join(formatted)

class State(TypedDict):
    question: str
    context: List[Document]
    answer: CitedAnswer

def generate(state: State):
    formatted_docs = format_docs_with_id(state["context"])
    messages = prompt.invoke({"question": state["question"], "context": formatted_docs})
    structured_llm = llm.with_structured_output(CitedAnswer)
    response = structured_llm.invoke(messages)
    return {"answer": response}

graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

```

```python
result = graph.invoke({"question": "How fast are cheetahs?"})

result["answer"]

```

```output
CitedAnswer(answer=&#x27;Cheetahs are capable of running at speeds between 93 to 104 km/h (58 to 65 mph).&#x27;, citations=[0, 3])

``` We can inspect the document at index 0, which the model cited:

```python
print(result["context"][0])

```

```output
page_content=&#x27;The cheetah (Acinonyx jubatus) is a large cat and the fastest land animal. It has a tawny to creamy white or pale buff fur that is marked with evenly spaced, solid black spots. The head is small and rounded, with a short snout and black tear-like facial streaks. It reaches 67–94 cm (26–37 in) at the shoulder, and the head-and-body length is between 1.1 and 1.5 m (3 ft 7 in and 4 ft 11 in). Adults weigh between 21 and 72 kg (46 and 159 lb). The cheetah is capable of running at 93 to 104 km/h (58 to 65 mph); it has evolved specialized adaptations for speed, including a light build, long thin legs and a long tail.
The cheetah was first described in the late 18th century. Four subspecies are recognised today that are native to Africa and central Iran. An African subspecies was introduced to India in 2022. It is now distributed mainly in small, fragmented populations in northwestern, eastern and southern Africa and central Iran. It lives in a variety of habitats such as savannahs in the Serengeti, arid mountain ranges in the Sahara, and hilly desert terrain.
The cheetah lives in three main social groups: females and their cubs, male "coalitions", and solitary males. While females lead a nomadic life searching for prey in large home ranges, males are more sedentary and instead establish much smaller territories in areas with plentiful prey and access to females. The cheetah is active during the day, with peaks during dawn and dusk. It feeds on small- to medium-sized prey, mostly weighing under 40 kg (88 lb), and prefers medium-sized ungulates such as impala, springbok and Thomson&#x27;s gazelles. The cheetah typically stalks its prey within 60–100 m (200–330 ft) before charging towards it, trips it during the chase and bites its throat to suffocate it to death. It breeds throughout the year. After a gestation of nearly three months, females give birth to a litter of three or four cubs. Cheetah cubs are highly vulnerable to predation by other large carnivores. They are weaned a&#x27; metadata={&#x27;title&#x27;: &#x27;Cheetah&#x27;, &#x27;summary&#x27;: &#x27;The cheetah (Acinonyx jubatus) is a large cat and the fastest land animal. It has a tawny to creamy white or pale buff fur that is marked with evenly spaced, solid black spots. The head is small and rounded, with a short snout and black tear-like facial streaks. It reaches 67–94 cm (26–37 in) at the shoulder, and the head-and-body length is between 1.1 and 1.5 m (3 ft 7 in and 4 ft 11 in). Adults weigh between 21 and 72 kg (46 and 159 lb). The cheetah is capable of running at 93 to 104 km/h (58 to 65 mph); it has evolved specialized adaptations for speed, including a light build, long thin legs and a long tail.\nThe cheetah was first described in the late 18th century. Four subspecies are recognised today that are native to Africa and central Iran. An African subspecies was introduced to India in 2022. It is now distributed mainly in small, fragmented populations in northwestern, eastern and southern Africa and central Iran. It lives in a variety of habitats such as savannahs in the Serengeti, arid mountain ranges in the Sahara, and hilly desert terrain.\nThe cheetah lives in three main social groups: females and their cubs, male "coalitions", and solitary males. While females lead a nomadic life searching for prey in large home ranges, males are more sedentary and instead establish much smaller territories in areas with plentiful prey and access to females. The cheetah is active during the day, with peaks during dawn and dusk. It feeds on small- to medium-sized prey, mostly weighing under 40 kg (88 lb), and prefers medium-sized ungulates such as impala, springbok and Thomson\&#x27;s gazelles. The cheetah typically stalks its prey within 60–100 m (200–330 ft) before charging towards it, trips it during the chase and bites its throat to suffocate it to death. It breeds throughout the year. After a gestation of nearly three months, females give birth to a litter of three or four cubs. Cheetah cubs are highly vulnerable to predation by other large carnivores. They are weaned at around four months and are independent by around 20 months of age.\nThe cheetah is threatened by habitat loss, conflict with humans, poaching and high susceptibility to diseases. The global cheetah population was estimated in 2021 at 6,517; it is listed as Vulnerable on the IUCN Red List. It has been widely depicted in art, literature, advertising, and animation. It was tamed in ancient Egypt and trained for hunting ungulates in the Arabian Peninsula and India. It has been kept in zoos since the early 19th century.&#x27;, &#x27;source&#x27;: &#x27;https://en.wikipedia.org/wiki/Cheetah&#x27;}

``` LangSmith trace: [https://smith.langchain.com/public/6f34d136-451d-4625-90c8-2d8decebc21a/r](https://smith.langchain.com/public/6f34d136-451d-4625-90c8-2d8decebc21a/r) Cite snippets[​](#cite-snippets) To return text spans (perhaps in addition to source identifiers), we can use the same approach. The only change will be to build a more complex output schema, here using Pydantic, that includes a "quote" alongside a source identifier. Aside: Note that if we break up our documents so that we have many documents with only a sentence or two instead of a few long documents, citing documents becomes roughly equivalent to citing snippets, and may be easier for the model because the model just needs to return an identifier for each snippet instead of the actual text. Probably worth trying both approaches and evaluating.

```python
class Citation(BaseModel):
    source_id: int = Field(
        ...,
        description="The integer ID of a SPECIFIC source which justifies the answer.",
    )
    quote: str = Field(
        ...,
        description="The VERBATIM quote from the specified source that justifies the answer.",
    )

class QuotedAnswer(BaseModel):
    """Answer the user question based only on the given sources, and cite the sources used."""

    answer: str = Field(
        ...,
        description="The answer to the user question, which is based only on the given sources.",
    )
    citations: List[Citation] = Field(
        ..., description="Citations from the given sources that justify the answer."
    )

```

```python
class State(TypedDict):
    question: str
    context: List[Document]
    answer: QuotedAnswer

def generate(state: State):
    formatted_docs = format_docs_with_id(state["context"])
    messages = prompt.invoke({"question": state["question"], "context": formatted_docs})
    structured_llm = llm.with_structured_output(QuotedAnswer)
    response = structured_llm.invoke(messages)
    return {"answer": response}

graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

``` Here we see that the model has extracted a relevant snippet of text from source 0:

```python
result = graph.invoke({"question": "How fast are cheetahs?"})

result["answer"]

```

```output
QuotedAnswer(answer=&#x27;Cheetahs are capable of running at speeds of 93 to 104 km/h (58 to 65 mph).&#x27;, citations=[Citation(source_id=0, quote=&#x27;The cheetah is capable of running at 93 to 104 km/h (58 to 65 mph); it has evolved specialized adaptations for speed.&#x27;)])

``` LangSmith trace: [https://smith.langchain.com/public/e16dc72f-4261-4f25-a9a7-906238737283/r](https://smith.langchain.com/public/e16dc72f-4261-4f25-a9a7-906238737283/r) Direct prompting[​](#direct-prompting) Some models don&#x27;t support function-calling. We can achieve similar results with direct prompting. Let&#x27;s try instructing a model to generate structured XML for its output:

```python
xml_system = """You&#x27;re a helpful AI assistant. Given a user question and some Wikipedia article snippets, \
answer the user question and provide citations. If none of the articles answer the question, just say you don&#x27;t know.

Remember, you must return both an answer and citations. A citation consists of a VERBATIM quote that \
justifies the answer and the ID of the quote article. Return a citation for every quote across all articles \
that justify the answer. Use the following format for your final output:

<cited_answer>
    <answer></answer>
    <citations>
        <citation><source_id></source_id><quote></quote></citation>
        <citation><source_id></source_id><quote></quote></citation>
        ...
    </citations>
</cited_answer>

Here are the Wikipedia articles:{context}"""
xml_prompt = ChatPromptTemplate.from_messages(
    [("system", xml_system), ("human", "{question}")]
)

``` We now make similar small updates to our chain: We update the formatting function to wrap the retrieved context in XML tags; We do not use .with_structured_output (e.g., because it does not exist for a model); We use [XMLOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.xml.XMLOutputParser.html) to parse the answer into a dict.

```python
from langchain_core.output_parsers import XMLOutputParser

def format_docs_xml(docs: List[Document]) -> str:
    formatted = []
    for i, doc in enumerate(docs):
        doc_str = f"""\
    <source id=\"{i}\">
        <title>{doc.metadata["title"]}</title>
        <article_snippet>{doc.page_content}</article_snippet>
    </source>"""
        formatted.append(doc_str)
    return "\n\n<sources>" + "\n".join(formatted) + "</sources>"

class State(TypedDict):
    question: str
    context: List[Document]
    answer: dict

def generate(state: State):
    formatted_docs = format_docs_xml(state["context"])
    messages = xml_prompt.invoke(
        {"question": state["question"], "context": formatted_docs}
    )
    response = llm.invoke(messages)
    parsed_response = XMLOutputParser().invoke(response)
    return {"answer": parsed_response}

graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

```API Reference:**[XMLOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.xml.XMLOutputParser.html) Note that citations are again structured into the answer:

```python
result = graph.invoke({"question": "How fast are cheetahs?"})

result["answer"]

```**

```output
{&#x27;cited_answer&#x27;: [{&#x27;answer&#x27;: &#x27;Cheetahs can run at speeds of 93 to 104 km/h (58 to 65 mph).&#x27;},
  {&#x27;citations&#x27;: [{&#x27;citation&#x27;: [{&#x27;source_id&#x27;: &#x27;0&#x27;},
      {&#x27;quote&#x27;: &#x27;The cheetah is capable of running at 93 to 104 km/h (58 to 65 mph);&#x27;}]},
    {&#x27;citation&#x27;: [{&#x27;source_id&#x27;: &#x27;3&#x27;},
      {&#x27;quote&#x27;: &#x27;The fastest land animal is the cheetah.&#x27;}]}]}]}

``` LangSmith trace: [https://smith.langchain.com/public/0c45f847-c640-4b9a-a5fa-63559e413527/r](https://smith.langchain.com/public/0c45f847-c640-4b9a-a5fa-63559e413527/r) Retrieval post-processing[​](#retrieval-post-processing) Another approach is to post-process our retrieved documents to compress the content, so that the source content is already minimal enough that we don&#x27;t need the model to cite specific sources or spans. For example, we could break up each document into a sentence or two, embed those and keep only the most relevant ones. LangChain has some built-in components for this. Here we&#x27;ll use a [RecursiveCharacterTextSplitter](https://python.langchain.com/api_reference/text_splitters/text_splitter/langchain_text_splitters.RecursiveCharacterTextSplitter.html#langchain_text_splitters.RecursiveCharacterTextSplitter), which creates chunks of a specified size by splitting on separator substrings, and an [EmbeddingsFilter](https://python.langchain.com/api_reference/langchain/retrievers/langchain.retrievers.document_compressors.embeddings_filter.EmbeddingsFilter.html#langchain.retrievers.document_compressors.embeddings_filter.EmbeddingsFilter), which keeps only the texts with the most relevant embeddings. This approach effectively updates our retrieve step to compress the documents. Let&#x27;s first select an [embedding model](/docs/integrations/text_embedding/): Select [embeddings model](/docs/integrations/text_embedding/):OpenAI▾[OpenAI](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[HuggingFace](#)[Ollama](#)[Cohere](#)[MistralAI](#)[Nomic](#)[NVIDIA](#)[Voyage AI](#)[IBM watsonx](#)[Fake](#)

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

``` We can now rewrite the retrieve step:

```python
from langchain.retrievers.document_compressors import EmbeddingsFilter
from langchain_core.runnables import RunnableParallel
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=400,
    chunk_overlap=0,
    separators=["\n\n", "\n", ".", " "],
    keep_separator=False,
)
compressor = EmbeddingsFilter(embeddings=embeddings, k=10)

class State(TypedDict):
    question: str
    context: List[Document]
    answer: str

def retrieve(state: State):
    retrieved_docs = retriever.invoke(state["question"])
    split_docs = splitter.split_documents(retrieved_docs)
    stateful_docs = compressor.compress_documents(split_docs, state["question"])
    return {"context": stateful_docs}

```API Reference:**[RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html) Let&#x27;s test this out:

```python
retrieval_result = retrieve({"question": "How fast are cheetahs?"})

for doc in retrieval_result["context"]:
    print(f"{doc.page_content}\n\n")

```

```output
Adults weigh between 21 and 72 kg (46 and 159 lb). The cheetah is capable of running at 93 to 104 km/h (58 to 65 mph); it has evolved specialized adaptations for speed, including a light build, long thin legs and a long tail

The cheetah (Acinonyx jubatus) is a large cat and the fastest land animal. It has a tawny to creamy white or pale buff fur that is marked with evenly spaced, solid black spots. The head is small and rounded, with a short snout and black tear-like facial streaks. It reaches 67–94 cm (26–37 in) at the shoulder, and the head-and-body length is between 1.1 and 1.5 m (3 ft 7 in and 4 ft 11 in)

2 mph), or 171 body lengths per second. The cheetah, the fastest land mammal, scores at only 16 body lengths per second

It feeds on small- to medium-sized prey, mostly weighing under 40 kg (88 lb), and prefers medium-sized ungulates such as impala, springbok and Thomson&#x27;s gazelles. The cheetah typically stalks its prey within 60–100 m (200–330 ft) before charging towards it, trips it during the chase and bites its throat to suffocate it to death. It breeds throughout the year

The cheetah was first described in the late 18th century. Four subspecies are recognised today that are native to Africa and central Iran. An African subspecies was introduced to India in 2022. It is now distributed mainly in small, fragmented populations in northwestern, eastern and southern Africa and central Iran

The cheetah lives in three main social groups: females and their cubs, male "coalitions", and solitary males. While females lead a nomadic life searching for prey in large home ranges, males are more sedentary and instead establish much smaller territories in areas with plentiful prey and access to females. The cheetah is active during the day, with peaks during dawn and dusk

The Southeast African cheetah (Acinonyx jubatus jubatus) is the nominate cheetah subspecies native to East and Southern Africa. The Southern African cheetah lives mainly in the lowland areas and deserts of the Kalahari, the savannahs of Okavango Delta, and the grasslands of the Transvaal region in South Africa. In Namibia, cheetahs are mostly found in farmlands

Subpopulations have been called "South African cheetah" and "Namibian cheetah."

In India, four cheetahs of the subspecies are living in Kuno National Park in Madhya Pradesh after having been introduced there

Acinonyx jubatus velox proposed in 1913 by Edmund Heller on basis of a cheetah that was shot by Kermit Roosevelt in June 1909 in the Kenyan highlands.
Acinonyx rex proposed in 1927 by Reginald Innes Pocock on basis of a specimen from the Umvukwe Range in Rhodesia.

``` Next, we assemble it into our chain as before:

```python
# This step is unchanged from our original RAG implementation
def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}

graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

```

```python
result = graph.invoke({"question": "How fast are cheetahs?"})

print(result["answer"])

```

```output
Cheetahs are capable of running at speeds between 93 to 104 km/h (58 to 65 mph). They are known as the fastest land animals.

``` Note that the document content is now compressed, although the document objects retain the original content in a "summary" key in their metadata. These summaries are not passed to the model; only the condensed content is.

```python
result["context"][0].page_content  # passed to model

```

```output
&#x27;Adults weigh between 21 and 72 kg (46 and 159 lb). The cheetah is capable of running at 93 to 104 km/h (58 to 65 mph); it has evolved specialized adaptations for speed, including a light build, long thin legs and a long tail&#x27;

```

```python
result["context"][0].metadata["summary"]  # original document  # original document

```

```output
&#x27;The cheetah (Acinonyx jubatus) is a large cat and the fastest land animal. It has a tawny to creamy white or pale buff fur that is marked with evenly spaced, solid black spots. The head is small and rounded, with a short snout and black tear-like facial streaks. It reaches 67–94 cm (26–37 in) at the shoulder, and the head-and-body length is between 1.1 and 1.5 m (3 ft 7 in and 4 ft 11 in). Adults weigh between 21 and 72 kg (46 and 159 lb). The cheetah is capable of running at 93 to 104 km/h (58 to 65 mph); it has evolved specialized adaptations for speed, including a light build, long thin legs and a long tail.\nThe cheetah was first described in the late 18th century. Four subspecies are recognised today that are native to Africa and central Iran. An African subspecies was introduced to India in 2022. It is now distributed mainly in small, fragmented populations in northwestern, eastern and southern Africa and central Iran. It lives in a variety of habitats such as savannahs in the Serengeti, arid mountain ranges in the Sahara, and hilly desert terrain.\nThe cheetah lives in three main social groups: females and their cubs, male "coalitions", and solitary males. While females lead a nomadic life searching for prey in large home ranges, males are more sedentary and instead establish much smaller territories in areas with plentiful prey and access to females. The cheetah is active during the day, with peaks during dawn and dusk. It feeds on small- to medium-sized prey, mostly weighing under 40 kg (88 lb), and prefers medium-sized ungulates such as impala, springbok and Thomson\&#x27;s gazelles. The cheetah typically stalks its prey within 60–100 m (200–330 ft) before charging towards it, trips it during the chase and bites its throat to suffocate it to death. It breeds throughout the year. After a gestation of nearly three months, females give birth to a litter of three or four cubs. Cheetah cubs are highly vulnerable to predation by other large carnivores. They are weaned at around four months and are independent by around 20 months of age.\nThe cheetah is threatened by habitat loss, conflict with humans, poaching and high susceptibility to diseases. The global cheetah population was estimated in 2021 at 6,517; it is listed as Vulnerable on the IUCN Red List. It has been widely depicted in art, literature, advertising, and animation. It was tamed in ancient Egypt and trained for hunting ungulates in the Arabian Peninsula and India. It has been kept in zoos since the early 19th century.&#x27;

``` LangSmith trace: [https://smith.langchain.com/public/21b0dc15-d70a-4293-9402-9c70f9178e66/r](https://smith.langchain.com/public/21b0dc15-d70a-4293-9402-9c70f9178e66/r) ## Generation post-processing[​](#generation-post-processing) Another approach is to post-process our model generation. In this example we&#x27;ll first generate just an answer, and then we&#x27;ll ask the model to annotate it&#x27;s own answer with citations. The downside of this approach is of course that it is slower and more expensive, because two model calls need to be made. Let&#x27;s apply this to our initial chain. If desired, we can implement this via a third step in our application.

```python
class Citation(BaseModel):
    source_id: int = Field(
        ...,
        description="The integer ID of a SPECIFIC source which justifies the answer.",
    )
    quote: str = Field(
        ...,
        description="The VERBATIM quote from the specified source that justifies the answer.",
    )

class AnnotatedAnswer(BaseModel):
    """Annotate the answer to the user question with quote citations that justify the answer."""

    citations: List[Citation] = Field(
        ..., description="Citations from the given sources that justify the answer."
    )

structured_llm = llm.with_structured_output(AnnotatedAnswer)

```

```python
class State(TypedDict):
    question: str
    context: List[Document]
    answer: str
    annotations: AnnotatedAnswer

def retrieve(state: State):
    retrieved_docs = retriever.invoke(state["question"])
    return {"context": retrieved_docs}

def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}

def annotate(state: State):
    formatted_docs = format_docs_with_id(state["context"])
    messages = [
        ("system", system_prompt.format(context=formatted_docs)),
        ("human", state["question"]),
        ("ai", state["answer"]),
        ("human", "Annotate your answer with citations."),
    ]
    response = structured_llm.invoke(messages)
    return {"annotations": response}

graph_builder = StateGraph(State).add_sequence([retrieve, generate, annotate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

```

```python
display(Image(graph.get_graph().draw_mermaid_png()))

``` ![ ](data:image/png;base64,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)

```python
result = graph.invoke({"question": "How fast are cheetahs?"})

print(result["answer"])

```

```output
Cheetahs are capable of running at speeds between 93 to 104 km/h (58 to 65 mph).

```

```python
result["annotations"]

```

```output
AnnotatedAnswer(citations=[Citation(source_id=0, quote=&#x27;The cheetah is capable of running at 93 to 104 km/h (58 to 65 mph)&#x27;)])

``` LangSmith trace: [https://smith.langchain.com/public/b8257417-573b-47c4-a750-74e542035f19/r](https://smith.langchain.com/public/b8257417-573b-47c4-a750-74e542035f19/r)[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/qa_citations.ipynb)[Setup](#setup)
- [Tool-calling](#tool-calling)[Cite documents](#cite-documents)
- [Cite snippets](#cite-snippets)

- [Direct prompting](#direct-prompting)
- [Retrieval post-processing](#retrieval-post-processing)
- [Generation post-processing](#generation-post-processing)

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