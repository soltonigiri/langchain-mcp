How to use the Parent Document Retriever | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/parent_document_retriever.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/parent_document_retriever.ipynb) # How to use the Parent Document Retriever When splitting documents for [retrieval](/docs/concepts/retrieval/), there are often conflicting desires: You may want to have small documents, so that their embeddings can most accurately reflect their meaning. If too long, then the embeddings can lose meaning.

- You want to have long enough documents that the context of each chunk is retained.

The `ParentDocumentRetriever` strikes that balance by splitting and storing small chunks of data. During retrieval, it first fetches the small chunks but then looks up the parent ids for those chunks and returns those larger documents.

Note that "parent document" refers to the document that a small chunk originated from. This can either be the whole raw document OR a larger chunk.

```python
from langchain.retrievers import ParentDocumentRetriever

```

```python
from langchain.storage import InMemoryStore
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

```

```python
loaders = [
    TextLoader("paul_graham_essay.txt"),
    TextLoader("state_of_the_union.txt"),
]
docs = []
for loader in loaders:
    docs.extend(loader.load())

``` ## Retrieving full documents[​](#retrieving-full-documents) In this mode, we want to retrieve the full documents. Therefore, we only specify a child [splitter](/docs/concepts/text_splitters/).

```python
# This text splitter is used to create the child documents
child_splitter = RecursiveCharacterTextSplitter(chunk_size=400)
# The vectorstore to use to index the child chunks
vectorstore = Chroma(
    collection_name="full_documents", embedding_function=OpenAIEmbeddings()
)
# The storage layer for the parent documents
store = InMemoryStore()
retriever = ParentDocumentRetriever(
    vectorstore=vectorstore,
    docstore=store,
    child_splitter=child_splitter,
)

```

```python
retriever.add_documents(docs, ids=None)

``` This should yield two keys, because we added two documents.

```python
list(store.yield_keys())

```

```output
[&#x27;9a63376c-58cc-42c9-b0f7-61f0e1a3a688&#x27;,
 &#x27;40091598-e918-4a18-9be0-f46413a95ae4&#x27;]

``` Let&#x27;s now call the vector store search functionality - we should see that it returns small chunks (since we&#x27;re storing the small chunks).

```python
sub_docs = vectorstore.similarity_search("justice breyer")

```

```python
print(sub_docs[0].page_content)

```

```output
Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service.

One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.

``` Let&#x27;s now retrieve from the overall retriever. This should return large documents - since it returns the documents where the smaller chunks are located.

```python
retrieved_docs = retriever.invoke("justice breyer")

```

```python
len(retrieved_docs[0].page_content)

```

```output
38540

``` ## Retrieving larger chunks[​](#retrieving-larger-chunks) Sometimes, the full documents can be too big to want to retrieve them as is. In that case, what we really want to do is to first split the raw documents into larger chunks, and then split it into smaller chunks. We then index the smaller chunks, but on retrieval we retrieve the larger chunks (but still not the full documents).

```python
# This text splitter is used to create the parent documents
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000)
# This text splitter is used to create the child documents
# It should create documents smaller than the parent
child_splitter = RecursiveCharacterTextSplitter(chunk_size=400)
# The vectorstore to use to index the child chunks
vectorstore = Chroma(
    collection_name="split_parents", embedding_function=OpenAIEmbeddings()
)
# The storage layer for the parent documents
store = InMemoryStore()

```

```python
retriever = ParentDocumentRetriever(
    vectorstore=vectorstore,
    docstore=store,
    child_splitter=child_splitter,
    parent_splitter=parent_splitter,
)

```

```python
retriever.add_documents(docs)

``` We can see that there are much more than two documents now - these are the larger chunks.

```python
len(list(store.yield_keys()))

```

```output
66

``` Let&#x27;s make sure the underlying vector store still retrieves the small chunks.

```python
sub_docs = vectorstore.similarity_search("justice breyer")

```

```python
print(sub_docs[0].page_content)

```

```output
Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service.

One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.

```

```python
retrieved_docs = retriever.invoke("justice breyer")

```

```python
len(retrieved_docs[0].page_content)

```

```output
1849

```

```python
print(retrieved_docs[0].page_content)

```

```output
In state after state, new laws have been passed, not only to suppress the vote, but to subvert entire elections.

We cannot let this happen.

Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections.

Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service.

One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.

And I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.

A former top litigator in private practice. A former federal public defender. And from a family of public school educators and police officers. A consensus builder. Since she’s been nominated, she’s received a broad range of support—from the Fraternal Order of Police to former judges appointed by Democrats and Republicans.

And if we are to advance liberty and justice, we need to secure the Border and fix the immigration system.

We can do both. At our border, we’ve installed new technology like cutting-edge scanners to better detect drug smuggling.

We’ve set up joint patrols with Mexico and Guatemala to catch more human traffickers.

We’re putting in place dedicated immigration judges so families fleeing persecution and violence can have their cases heard faster.

We’re securing commitments and supporting partners in South and Central America to host more refugees and secure their own borders.

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/parent_document_retriever.ipynb)

- [Retrieving full documents](#retrieving-full-documents)
- [Retrieving larger chunks](#retrieving-larger-chunks)

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