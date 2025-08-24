How to create and query vector stores | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/vectorstores.mdx) # How to create and query vector stores infoHead to [Integrations](/docs/integrations/vectorstores/) for documentation on built-in integrations with 3rd-party vector stores. One of the most common ways to store and search over unstructured data is to embed it and store the resulting embedding vectors, and then at query time to embed the unstructured query and retrieve the embedding vectors that are &#x27;most similar&#x27; to the embedded query. A vector store takes care of storing embedded data and performing vector search for you. ## Get started[​](#get-started) This guide showcases basic functionality related to vector stores. A key part of working with vector stores is creating the vector to put in them, which is usually created via embeddings. Therefore, it is recommended that you familiarize yourself with the [text embedding model interfaces](/docs/how_to/embed_text/) before diving into this. Before using the vectorstore at all, we need to load some data and initialize an embedding model. We want to use OpenAIEmbeddings so we have to get the OpenAI API Key.

```python
import os
import getpass

os.environ[&#x27;OPENAI_API_KEY&#x27;] = getpass.getpass(&#x27;OpenAI API Key:&#x27;)

```

```python
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter

# Load the document, split it into chunks, embed each chunk and load it into the vector store.
raw_documents = TextLoader(&#x27;state_of_the_union.txt&#x27;).load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
documents = text_splitter.split_documents(raw_documents)

``` There are many great vector store options, here are a few that are free, open-source, and run entirely on your local machine. Review all integrations for many great hosted offerings. Chroma
- FAISS
- Lance

This walkthrough uses the `chroma` vector database, which runs on your local machine as a library.

```bash
pip install langchain-chroma

```

```python
from langchain_chroma import Chroma

db = Chroma.from_documents(documents, OpenAIEmbeddings())

```This walkthrough uses the `FAISS` vector database, which makes use of the Facebook AI Similarity Search (FAISS) library.

```bash
pip install faiss-cpu

```

```python
from langchain_community.vectorstores import FAISS

db = FAISS.from_documents(documents, OpenAIEmbeddings())

```This notebook shows how to use functionality related to the LanceDB vector database based on the Lance data format.

```bash
pip install lancedb

```

```python
from langchain_community.vectorstores import LanceDB

import lancedb

db = lancedb.connect("/tmp/lancedb")
table = db.create_table(
    "my_table",
    data=[
        {
            "vector": embeddings.embed_query("Hello World"),
            "text": "Hello World",
            "id": "1",
        }
    ],
    mode="overwrite",
)
db = LanceDB.from_documents(documents, OpenAIEmbeddings())

``` ## Similarity search[​](#similarity-search) All vectorstores expose a `similarity_search` method. This will take incoming documents, create an embedding of them, and then find all documents with the most similar embedding.

```python
query = "What did the president say about Ketanji Brown Jackson"
docs = db.similarity_search(query)
print(docs[0].page_content)

```

```output
Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections.

    Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service.

    One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.

    And I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.

``` ### Similarity search by vector[​](#similarity-search-by-vector) It is also possible to do a search for documents similar to a given embedding vector using `similarity_search_by_vector` which accepts an embedding vector as a parameter instead of a string.

```python
embedding_vector = OpenAIEmbeddings().embed_query(query)
docs = db.similarity_search_by_vector(embedding_vector)
print(docs[0].page_content)

```

```output
Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections.

    Tonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service.

    One of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.

    And I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.

``` ## Async Operations[​](#async-operations) Vector stores are usually run as a separate service that requires some IO operations, and therefore they might be called asynchronously. That gives performance benefits as you don&#x27;t waste time waiting for responses from external services. That might also be important if you work with an asynchronous framework, such as [FastAPI](https://fastapi.tiangolo.com/).

LangChain supports async operation on vector stores. All the methods might be called using their async counterparts, with the prefix `a`, meaning `async`.

```python
docs = await db.asimilarity_search(query)
docs

```

```output
[Document(page_content=&#x27;Tonight. I call on the Senate to: Pass the Freedom to Vote Act. Pass the John Lewis Voting Rights Act. And while you’re at it, pass the Disclose Act so Americans can know who is funding our elections. \n\nTonight, I’d like to honor someone who has dedicated his life to serve this country: Justice Stephen Breyer—an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court. Justice Breyer, thank you for your service. \n\nOne of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court. \n\nAnd I did that 4 days ago, when I nominated Circuit Court of Appeals Judge Ketanji Brown Jackson. One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence.&#x27;, metadata={&#x27;source&#x27;: &#x27;state_of_the_union.txt&#x27;}),
 Document(page_content=&#x27;A former top litigator in private practice. A former federal public defender. And from a family of public school educators and police officers. A consensus builder. Since she’s been nominated, she’s received a broad range of support—from the Fraternal Order of Police to former judges appointed by Democrats and Republicans. \n\nAnd if we are to advance liberty and justice, we need to secure the Border and fix the immigration system. \n\nWe can do both. At our border, we’ve installed new technology like cutting-edge scanners to better detect drug smuggling.  \n\nWe’ve set up joint patrols with Mexico and Guatemala to catch more human traffickers.  \n\nWe’re putting in place dedicated immigration judges so families fleeing persecution and violence can have their cases heard faster. \n\nWe’re securing commitments and supporting partners in South and Central America to host more refugees and secure their own borders.&#x27;, metadata={&#x27;source&#x27;: &#x27;state_of_the_union.txt&#x27;}),
 Document(page_content=&#x27;And for our LGBTQ+ Americans, let’s finally get the bipartisan Equality Act to my desk. The onslaught of state laws targeting transgender Americans and their families is wrong. \n\nAs I said last year, especially to our younger transgender Americans, I will always have your back as your President, so you can be yourself and reach your God-given potential. \n\nWhile it often appears that we never agree, that isn’t true. I signed 80 bipartisan bills into law last year. From preventing government shutdowns to protecting Asian-Americans from still-too-common hate crimes to reforming military justice. \n\nAnd soon, we’ll strengthen the Violence Against Women Act that I first wrote three decades ago. It is important for us to show the nation that we can come together and do big things. \n\nSo tonight I’m offering a Unity Agenda for the Nation. Four big things we can do together.  \n\nFirst, beat the opioid epidemic.&#x27;, metadata={&#x27;source&#x27;: &#x27;state_of_the_union.txt&#x27;}),
 Document(page_content=&#x27;Tonight, I’m announcing a crackdown on these companies overcharging American businesses and consumers. \n\nAnd as Wall Street firms take over more nursing homes, quality in those homes has gone down and costs have gone up.  \n\nThat ends on my watch. \n\nMedicare is going to set higher standards for nursing homes and make sure your loved ones get the care they deserve and expect. \n\nWe’ll also cut costs and keep the economy going strong by giving workers a fair shot, provide more training and apprenticeships, hire them based on their skills not degrees. \n\nLet’s pass the Paycheck Fairness Act and paid leave.  \n\nRaise the minimum wage to $15 an hour and extend the Child Tax Credit, so no one has to raise a family in poverty. \n\nLet’s increase Pell Grants and increase our historic support of HBCUs, and invest in what Jill—our First Lady who teaches full-time—calls America’s best-kept secret: community colleges.&#x27;, metadata={&#x27;source&#x27;: &#x27;state_of_the_union.txt&#x27;})]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/vectorstores.mdx)

- [Get started](#get-started)
- [Similarity search](#similarity-search)[Similarity search by vector](#similarity-search-by-vector)

- [Async Operations](#async-operations)

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