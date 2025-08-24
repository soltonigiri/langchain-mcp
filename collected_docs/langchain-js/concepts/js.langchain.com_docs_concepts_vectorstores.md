Vector stores | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageVector stores[Prerequisites]Embeddings](/docs/concepts/embedding_models/)[Text splitters](/docs/concepts/text_splitters/)[Note]This conceptual overview focuses on text-based indexing and retrieval for simplicity. However, embedding models can be [multi-modal](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-multimodal-embeddings) and vector stores can be used to store and retrieve a variety of data types beyond text.Overview[​](#overview)Vector stores are specialized data stores that enable indexing and retrieving information based on vector representations.These vectors, called [embeddings](/docs/concepts/embedding_models/), capture the semantic meaning of data that has been embedded.Vector stores are frequently used to search over unstructured data, such as text, images, and audio, to retrieve relevant information based on semantic similarity rather than exact keyword matches.![Vector stores ](/assets/images/vectorstores-2540b4bc355b966c99b0f02cfdddb273.png)Integrations[​](#integrations)LangChain has a large number of vectorstore integrations, allowing users to easily switch between different vectorstore implementations.Please see the [full list of LangChain vectorstore integrations](/docs/integrations/vectorstores/).Interface[​](#interface)LangChain provides a standard interface for working with vector stores, allowing users to easily switch between different vectorstore implementations.The interface consists of basic methods for writing, deleting and searching for documents in the vector store.The key methods are:addDocuments: Add a list of texts to the vector store.deleteDocuments / delete: Delete a list of documents from the vector store.similaritySearch: Search for similar documents to a given query.Initialization[​](#initialization)Most vectors in LangChain accept an embedding model as an argument when initializing the vector store.We will use LangChain&#x27;s [MemoryVectorStore](https://api.js.langchain.com/classes/langchain.vectorstores_memory.MemoryVectorStore.html) implementation to illustrate the API.

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// Initialize with an embedding model
const vectorStore = new MemoryVectorStore(new SomeEmbeddingModel());

```Adding documents[​](#adding-documents)To add documents, use the addDocuments method.This API works with a list of [Document](https://api.js.langchain.com/classes/_langchain_core.documents.Document.html) objects. Document objects all have pageContent and metadata attributes, making them a universal way to store unstructured text and associated metadata.

```typescript
import { Document } from "@langchain/core/documents";

const document1 = new Document(
    pageContent: "I had chocalate chip pancakes and scrambled eggs for breakfast this morning.",
    metadata: { source: "tweet" },
)

const document2 = new Document(
    pageContent: "The weather forecast for tomorrow is cloudy and overcast, with a high of 62 degrees.",
    metadata: { source: "news" },
)

const documents = [document1, document2]

await vectorStore.addDocuments(documents)

```You should usually provide IDs for the documents you add to the vector store, so that instead of adding the same document multiple times, you can update the existing document.

```typescript
await vectorStore.addDocuments(documents, { ids: ["doc1", "doc2"] });

```Delete[​](#delete)To delete documents, use the deleteDocuments method which takes a list of document IDs to delete.

```typescript
await vectorStore.deleteDocuments(["doc1"]);

```or the delete method:

```typescript
await vectorStore.deleteDocuments({ ids: ["doc1"] });

```Search[​](#search)Vector stores embed and store the documents that added. If we pass in a query, the vectorstore will embed the query, perform a similarity search over the embedded documents, and return the most similar ones. This captures two important concepts: first, there needs to be a way to measure the similarity between the query and any [embedded](/docs/concepts/embedding_models/) document. Second, there needs to be an algorithm to efficiently perform this similarity search across all embedded documents.Similarity metrics[​](#similarity-metrics)A critical advantage of embeddings vectors is they can be compared using many simple mathematical operations:Cosine Similarity**: Measures the cosine of the angle between two vectors.
- **Euclidean Distance**: Measures the straight-line distance between two points.
- **Dot Product**: Measures the projection of one vector onto another.

The choice of similarity metric can sometimes be selected when initializing the vectorstore. Please refer to the documentation of the specific vectorstore you are using to see what similarity metrics are supported.

[Further reading] - See [this documentation](https://developers.google.com/machine-learning/clustering/dnn-clustering/supervised-similarity) from Google on similarity metrics to consider with embeddings. - See Pinecone&#x27;s [blog post](https://www.pinecone.io/learn/vector-similarity/) on similarity metrics. - See OpenAI&#x27;s [FAQ](https://platform.openai.com/docs/guides/embeddings/faq) on what similarity metric to use with OpenAI embeddings. ### Similarity search[​](#similarity-search) Given a similarity metric to measure the distance between the embedded query and any embedded document, we need an algorithm to efficiently search over *all* the embedded documents to find the most similar ones. There are various ways to do this. As an example, many vectorstores implement [HNSW (Hierarchical Navigable Small World)](https://www.pinecone.io/learn/series/faiss/hnsw/), a graph-based index structure that allows for efficient similarity search. Regardless of the search algorithm used under the hood, the LangChain vectorstore interface has a `similaritySearch` method for all integrations. This will take the search query, create an embedding, find similar documents, and return them as a list of [Documents](https://api.js.langchain.com/classes/_langchain_core.documents.Document.html).

```typescript
const query = "my query";
const docs = await vectorstore.similaritySearch(query);

```**Many vectorstores support search parameters to be passed with the similaritySearch method. See the documentation for the specific vectorstore you are using to see what parameters are supported. As an example [Pinecone](https://api.js.langchain.com/classes/_langchain_pinecone.PineconeStore.html#similaritySearch) several parameters that are important general concepts: Many vectorstores support [the k](/docs/integrations/vectorstores/pinecone/#query-directly), which controls the number of Documents to return, and filter, which allows for filtering documents by metadata.query (string) – Text to look up documents similar to.k (number) – Number of Documents to return. Defaults to 4.filter (Record | undefined) – Object of argument(s) to filter on metadata[Further reading]See the [how-to guide](/docs/how_to/vectorstores/) for more details on how to use the similaritySearch method.See the [integrations page](/docs/integrations/vectorstores/) for more details on arguments that can be passed in to the similaritySearch method for specific vectorstores.Metadata filtering[​](#metadata-filtering)While vectorstore implement a search algorithm to efficiently search over all the embedded documents to find the most similar ones, many also support filtering on metadata. This allows structured filters to reduce the size of the similarity search space. These two concepts work well together:Semantic search**: Query the unstructured data directly, often using via embedding or keyword similarity.
- **Metadata search**: Apply structured query to the metadata, filtering specific documents.

Vector store support for metadata filtering is typically dependent on the underlying vector store implementation.

Here is example usage with [Pinecone](/docs/integrations/vectorstores/pinecone/#query-directly), showing that we filter for all documents that have the metadata key `source` with value `tweet`.

```typescript
await vectorstore.similaritySearch(
  "LangChain provides abstractions to make working with LLMs easy",
  2,
  {
    // The arguments of this field are provider specific.
    filter: { source: "tweet" },
  }
);

```

[Further reading] - See Pinecone&#x27;s [documentation](https://docs.pinecone.io/guides/data/filter-with-metadata) on filtering with metadata. - See the [list of LangChain vectorstore integrations](/docs/integrations/retrievers/self_query/) that support metadata filtering. ## Advanced search and retrieval techniques[​](#advanced-search-and-retrieval-techniques) While algorithms like HNSW provide the foundation for efficient similarity search in many cases, additional techniques can be employed to improve search quality and diversity. For example, maximal marginal relevance is a re-ranking algorithm used to diversify search results, which is applied after the initial similarity search to ensure a more diverse set of results.

| Name | When to use | Description |

| [Maximal Marginal Relevance (MMR)](/docs/integrations/vectorstores/pinecone/#maximal-marginal-relevance-searches) | When needing to diversify search results. | MMR attempts to diversify the results of a search to avoid returning similar and redundant documents. |

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Overview](#overview)
- [Integrations](#integrations)
- [Interface](#interface)
- [Initialization](#initialization)
- [Adding documents](#adding-documents)
- [Delete](#delete)
- [Search](#search)[Similarity metrics](#similarity-metrics)
- [Similarity search](#similarity-search)
- [Metadata filtering](#metadata-filtering)

- [Advanced search and retrieval techniques](#advanced-search-and-retrieval-techniques)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.