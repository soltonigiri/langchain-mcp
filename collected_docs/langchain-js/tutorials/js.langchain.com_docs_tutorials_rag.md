Build a Retrieval Augmented Generation (RAG) App: Part 1 | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageBuild a Retrieval Augmented Generation (RAG) App: Part 1One of the most powerful applications enabled by LLMs is sophisticated question-answering (Q&A) chatbots. These are applications that can answer questions about specific source information. These applications use a technique known as Retrieval Augmented Generation, or RAG](/docs/concepts/rag/).This is a multi-part tutorial:[Part 1](/docs/tutorials/rag) (this guide) introduces RAG and walks through a minimal implementation.[Part 2](/docs/tutorials/qa_chat_history) extends the implementation to accommodate conversation-style interactions and multi-step retrieval processes.This tutorial will show how to build a simple Q&A application over a text data source. Along the way we’ll go over a typical Q&A architecture and highlight additional resources for more advanced Q&A techniques. We’ll also see how LangSmith can help us trace and understand our application. LangSmith will become increasingly helpful as our application grows in complexity.If you’re already familiar with basic retrieval, you might also be interested in this [high-level overview of different retrieval techniques](/docs/concepts/retrieval).Note**: Here we focus on Q&A for unstructured data. If you are interested for RAG over structured data, check out our tutorial on doing [question/answering over SQL data](/docs/tutorials/sql_qa). ## Overview[​](#overview) A typical RAG application has two main components:**Indexing**: a pipeline for ingesting data from a source and indexing it. *This usually happens offline.***Retrieval and generation**: the actual RAG chain, which takes the user query at run time and retrieves the relevant data from the index, then passes that to the model.Note: the indexing portion of this tutorial will largely follow the [semantic search tutorial](/docs/tutorials/retrievers).The most common full sequence from raw data to answer looks like: ### Indexing[​](#indexing) **Load**: First we need to load our data. This is done with [Document Loaders](/docs/concepts/document_loaders).
- **Split**: [Text splitters](/docs/concepts/text_splitters) break large Documents into smaller chunks. This is useful both for indexing data and passing it into a model, as large chunks are harder to search over and won’t fit in a model’s finite context window.
- **Store**: We need somewhere to store and index our splits, so that they can be searched over later. This is often done using a [VectorStore](/docs/concepts/vectorstores) and [Embeddings](/docs/concepts/embedding_models) model.

![index_diagram ](/assets/images/rag_indexing-8160f90a90a33253d0154659cf7d453f.png)

### Retrieval and generation[​](#retrieval-and-generation)

- **Retrieve**: Given a user input, relevant splits are retrieved from storage using a [Retriever](/docs/concepts/retrievers).
- **Generate**: A [ChatModel](/docs/concepts/chat_models) / [LLM](/docs/concepts/text_llms) produces an answer using a prompt that includes both the question with the retrieved data

![retrieval_diagram ](/assets/images/rag_retrieval_generation-1046a4668d6bb08786ef73c56d4f228a.png)

Once we’ve indexed our data, we will use [LangGraph](https://langchain-ai.github.io/langgraphjs/) as our orchestration framework to implement the retrieval and generation steps.

## Setup[​](#setup)

### Jupyter Notebook[​](#jupyter-notebook)

This and other tutorials are perhaps most conveniently run in a [Jupyter notebooks](https://jupyter.org/). Going through guides in an interactive environment is a great way to better understand them. See [here](https://jupyter.org/install) for instructions on how to install.

### Installation[​](#installation)

This guide requires the following dependencies:

- npm
- yarn
- pnpm

```bash
npm i langchain @langchain/core @langchain/langgraph

```**

```bash
yarn add langchain @langchain/core @langchain/langgraph

```

```bash
pnpm add langchain @langchain/core @langchain/langgraph

```For more details, see our [Installation guide](/docs/how_to/installation).LangSmith[​](#langsmith)Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com).After you sign up at the link above, make sure to set your environment variables to start logging traces:

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."

# Reduce tracing latency if you are not in a serverless environment
# export LANGCHAIN_CALLBACKS_BACKGROUND=true

```Components[​](#components)We will need to select three components from LangChain’s suite of integrations.A [chat model](/docs/integrations/chat/):Pick your chat model:GroqOpenAIAnthropicGoogle GeminiFireworksAIMistralAIVertexAIInstall dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/groq

```

```bash
yarn add @langchain/groq

```

```bash
pnpm add @langchain/groq

```Add environment variables

```bash
GROQ_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/openai

```

```bash
yarn add @langchain/openai

```

```bash
pnpm add @langchain/openai

```Add environment variables

```bash
OPENAI_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/anthropic

```

```bash
yarn add @langchain/anthropic

```

```bash
pnpm add @langchain/anthropic

```Add environment variables

```bash
ANTHROPIC_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const llm = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/google-genai

```

```bash
yarn add @langchain/google-genai

```

```bash
pnpm add @langchain/google-genai

```Add environment variables

```bash
GOOGLE_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

```Add environment variables

```bash
FIREWORKS_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const llm = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/mistralai

```

```bash
yarn add @langchain/mistralai

```

```bash
pnpm add @langchain/mistralai

```Add environment variables

```bash
MISTRAL_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/google-vertexai

```

```bash
yarn add @langchain/google-vertexai

```

```bash
pnpm add @langchain/google-vertexai

```Add environment variables

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json

```Instantiate the model

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```An [embedding model](/docs/integrations/text_embedding/):Pick your embedding model:OpenAIAzureAWSVertexAIMistralAICohereInstall dependenciesnpmyarnpnpm

```bash
npm i @langchain/openai

```

```bash
yarn add @langchain/openai

```

```bash
pnpm add @langchain/openai

```

```bash
OPENAI_API_KEY=your-api-key

```

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large"
});

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/openai

```

```bash
yarn add @langchain/openai

```

```bash
pnpm add @langchain/openai

```

```bash
AZURE_OPENAI_API_INSTANCE_NAME=<YOUR_INSTANCE_NAME>
AZURE_OPENAI_API_KEY=<YOUR_KEY>
AZURE_OPENAI_API_VERSION="2024-02-01"

```

```typescript
import { AzureOpenAIEmbeddings } from "@langchain/openai";

const embeddings = new AzureOpenAIEmbeddings({
  azureOpenAIApiEmbeddingsDeploymentName: "text-embedding-ada-002"
});

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/aws

```

```bash
yarn add @langchain/aws

```

```bash
pnpm add @langchain/aws

```

```bash
BEDROCK_AWS_REGION=your-region

```

```typescript
import { BedrockEmbeddings } from "@langchain/aws";

const embeddings = new BedrockEmbeddings({
  model: "amazon.titan-embed-text-v1"
});

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/google-vertexai

```

```bash
yarn add @langchain/google-vertexai

```

```bash
pnpm add @langchain/google-vertexai

```

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json

```

```typescript
import { VertexAIEmbeddings } from "@langchain/google-vertexai";

const embeddings = new VertexAIEmbeddings({
  model: "text-embedding-004"
});

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/mistralai

```

```bash
yarn add @langchain/mistralai

```

```bash
pnpm add @langchain/mistralai

```

```bash
MISTRAL_API_KEY=your-api-key

```

```typescript
import { MistralAIEmbeddings } from "@langchain/mistralai";

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed"
});

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/cohere

```

```bash
yarn add @langchain/cohere

```

```bash
pnpm add @langchain/cohere

```

```bash
COHERE_API_KEY=your-api-key

```

```typescript
import { CohereEmbeddings } from "@langchain/cohere";

const embeddings = new CohereEmbeddings({
  model: "embed-english-v3.0"
});

```And a [vector store](/docs/integrations/vectorstores/):Pick your vector store:MemoryChromaFAISSMongoDBPGVectorPineconeQdrantInstall dependenciesnpmyarnpnpm

```bash
npm i langchain

```

```bash
yarn add langchain

```

```bash
pnpm add langchain

```

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const vectorStore = new MemoryVectorStore(embeddings);

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

```

```typescript
import { Chroma } from "@langchain/community/vectorstores/chroma";

const vectorStore = new Chroma(embeddings, {
  collectionName: "a-test-collection",
});

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

```

```typescript
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const vectorStore = new FaissStore(embeddings, {});

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/mongodb

```

```bash
yarn add @langchain/mongodb

```

```bash
pnpm add @langchain/mongodb

```

```typescript
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
const collection = client
  .db(process.env.MONGODB_ATLAS_DB_NAME)
  .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME);

const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: collection,
  indexName: "vector_index",
  textKey: "text",
  embeddingKey: "embedding",
});

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

```

```typescript
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";

const vectorStore = await PGVectorStore.initialize(embeddings, {})

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/pinecone

```

```bash
yarn add @langchain/pinecone

```

```bash
pnpm add @langchain/pinecone

```

```typescript
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const pinecone = new PineconeClient();
const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

```Install dependenciesnpmyarnpnpm

```bash
npm i @langchain/qdrant

```

```bash
yarn add @langchain/qdrant

```

```bash
pnpm add @langchain/qdrant

```

```typescript
import { QdrantVectorStore } from "@langchain/qdrant";

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL,
  collectionName: "langchainjs-testing",
});

```Preview[​](#preview)In this guide we’ll build an app that answers questions about the website’s content. The specific website we will use is the [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) blog post by Lilian Weng, which allows us to ask questions about the contents of the post.We can create a simple indexing pipeline and RAG chain to do this in ~50 lines of code.

```javascript
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Load and chunk contents of blog
const pTagSelector = "p";
const cheerioLoader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  {
    selector: pTagSelector
  }
);

const docs = await cheerioLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000, chunkOverlap: 200
});
const allSplits = await splitter.splitDocuments(docs);

// Index chunks
await vectorStore.addDocuments(allSplits)

// Define prompt for question-answering
const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");

// Define state for application
const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

// Define application steps
const retrieve = async (state: typeof InputStateAnnotation.State) => {
  const retrievedDocs = await vectorStore.similaritySearch(state.question)
  return { context: retrievedDocs };
};

const generate = async (state: typeof StateAnnotation.State) => {
  const docsContent = state.context.map(doc => doc.pageContent).join("\n");
  const messages = await promptTemplate.invoke({ question: state.question, context: docsContent });
  const response = await llm.invoke(messages);
  return { answer: response.content };
};

// Compile application and test
const graph = new StateGraph(StateAnnotation)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addEdge("__start__", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "__end__")
  .compile();

```

```javascript
let inputs = { question: "What is Task Decomposition?" };

const result = await graph.invoke(inputs);
console.log(result.answer);

```

```text
Task decomposition is the process of breaking down complex tasks into smaller, more manageable steps. This can be achieved through various methods, including prompting large language models (LLMs) or using task-specific instructions. Techniques like Chain of Thought (CoT) and Tree of Thoughts further enhance this process by structuring reasoning and exploring multiple possibilities at each step.

```Check out the [LangSmith trace](https://smith.langchain.com/public/84a36239-b466-41bd-ac84-befc33ab50df/r).Detailed walkthrough[​](#detailed-walkthrough)Let’s go through the above code step-by-step to really understand what’s going on.1. Indexing[​](#indexing)noteThis section is an abbreviated version of the content in the [semantic search tutorial](/docs/tutorials/retrievers). If you&#x27;re comfortable with [document loaders](/docs/concepts/document_loaders), [embeddings](/docs/concepts/embedding_models), and [vector stores](/docs/concepts/vectorstores), feel free to skip to the next section on [retrieval and generation](/docs/tutorials/rag/#orchestration).Loading documents[​](#loading-documents)We need to first load the blog post contents. We can use [DocumentLoaders](/docs/concepts/document_loaders) for this, which are objects that load in data from a source and return a list of [Documents](https://api.js.langchain.com/classes/langchain_core.documents.Document.html). A Document is an object with some pageContent (string) and metadata (Record).In this case we’ll use the [CheerioWebBaseLoader](https://api.js.langchain.com/classes/langchain.document_loaders_web_cheerio.CheerioWebBaseLoader.html), which uses cheerio to load HTML form web URLs and parse it to text. We can pass custom selectors to the constructor to only parse specific elements:

```typescript
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const pTagSelector = "p";
const cheerioLoader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  {
    selector: pTagSelector,
  }
);

const docs = await cheerioLoader.load();

console.assert(docs.length === 1);
console.log(`Total characters: ${docs[0].pageContent.length}`);

```

```text
Total characters: 22360

```

```typescript
console.log(docs[0].pageContent.slice(0, 500));

```

```text
Building agents with LLM (large language model) as its core controller is a cool concept. Several proof-of-concepts demos, such as AutoGPT, GPT-Engineer and BabyAGI, serve as inspiring examples. The potentiality of LLM extends beyond generating well-written copies, stories, essays and programs; it can be framed as a powerful general problem solver.In a LLM-powered autonomous agent system, LLM functions as the agent’s brain, complemented by several key components:A complicated task usually involv

```Go deeper[​](#go-deeper)DocumentLoader: Class that loads data from a source as list of Documents.[Docs](/docs/concepts/document_loaders): Detailed documentation on how to use[Integrations](/docs/integrations/document_loaders/)[Interface](https://api.js.langchain.com/classes/langchain.document_loaders_base.BaseDocumentLoader.html): API reference for the base interface.Splitting documents[​](#splitting-documents)Our loaded document is over 42k characters which is too long to fit into the context window of many models. Even for those models that could fit the full post in their context window, models can struggle to find information in very long inputs.To handle this we’ll split the Document into chunks for embedding and vector storage. This should help us retrieve only the most relevant parts of the blog post at run time.As in the [semantic search tutorial](/docs/tutorials/retrievers), we use a [RecursiveCharacterTextSplitter](/docs/how_to/recursive_text_splitter), which will recursively split the document using common separators like new lines until each chunk is the appropriate size. This is the recommended text splitter for generic text use cases.

```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const allSplits = await splitter.splitDocuments(docs);
console.log(`Split blog post into ${allSplits.length} sub-documents.`);

```

```text
Split blog post into 29 sub-documents.

```Go deeper[​](#go-deeper-1)TextSplitter: Object that splits a list of Documents into smaller chunks. Subclass of DocumentTransformers.Explore Context-aware splitters, which keep the location (“context”) of each split in the original Document:[Markdown files](/docs/how_to/code_splitter/#markdown)[Code](/docs/how_to/code_splitter/) (15+ langs)[Interface](https://api.js.langchain.com/classes/langchain_textsplitters.TextSplitter.html): API reference for the base interface.DocumentTransformer: Object that performs a transformation on a list of Documents.Docs: Detailed documentation on how to use DocumentTransformers[Integrations](/docs/integrations/document_transformers)[Interface](https://api.js.langchain.com/classes/langchain_core.documents.BaseDocumentTransformer.html): API reference for the base interface.Storing documents[​](#storing-documents)Now we need to index our 66 text chunks so that we can search over them at runtime. Following the [semantic search tutorial](/docs/tutorials/retrievers), our approach is to [embed](/docs/concepts/embedding_models/) the contents of each document split and insert these embeddings into a [vector store](/docs/concepts/vectorstores/). Given an input query, we can then use vector search to retrieve relevant documents.We can embed and store all of our document splits in a single command using the vector store and embeddings model selected at the [start of the tutorial](/docs/tutorials/rag/#components).

```typescript
await vectorStore.addDocuments(allSplits);

```Go deeper[​](#go-deeper-2)Embeddings: Wrapper around a text embedding model, used for converting text to embeddings. - [Docs](/docs/concepts/embedding_models): Detailed documentation on how to use embeddings. - [Integrations](/docs/integrations/text_embedding): 30+ integrations to choose from. - [Interface](https://api.js.langchain.com/classes/langchain_core.embeddings.Embeddings.html): API reference for the base interface.VectorStore: Wrapper around a vector database, used for storing and querying embeddings. - [Docs](/docs/concepts/vectorstores): Detailed documentation on how to use vector stores. - [Integrations](/docs/integrations/vectorstores): 40+ integrations to choose from. - [Interface](https://api.js.langchain.com/classes/langchain_core.vectorstores.VectorStore.html): API reference for the base interface.This completes the Indexing** portion of the pipeline. At this point
we have a query-able vector store containing the chunked contents of our
blog post. Given a user question, we should ideally be able to return
the snippets of the blog post that answer the question.

## 2. Retrieval and Generation[​](#orchestration)

Now let’s write the actual application logic. We want to create a simple application that takes a user question, searches for documents relevant to that question, passes the retrieved documents and initial question to a model, and returns an answer.

For generation, we will use the chat model selected at the [start of the tutorial](/docs/tutorials/rag/#components).

We’ll use a prompt for RAG that is checked into the LangChain prompt hub ([here](https://smith.langchain.com/hub/rlm/rag-prompt)).

```typescript
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");

// Example:
const example_prompt = await promptTemplate.invoke({
  context: "(context goes here)",
  question: "(question goes here)",
});
const example_messages = example_prompt.messages;

console.assert(example_messages.length === 1);
example_messages[0].content;

```**

```text
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don&#x27;t know the answer, just say that you don&#x27;t know. Use three sentences maximum and keep the answer concise.
Question: (question goes here)
Context: (context goes here)
Answer:

```We’ll use [LangGraph](https://langchain-ai.github.io/langgraphjs/) to tie together the retrieval and generation steps into a single application. This will bring a number of benefits:We can define our application logic once and automatically support multiple invocation modes, including streaming, async, and batched calls.We get streamlined deployments via [LangGraph Platform](https://langchain-ai.github.io/langgraphjs/concepts/langgraph_platform/).LangSmith will automatically trace the steps of our application together.We can easily add key features to our application, including [persistence](https://langchain-ai.github.io/langgraphjs/concepts/persistence/) and [human-in-the-loop approval](https://langchain-ai.github.io/langgraphjs/concepts/human_in_the_loop/), with minimal code changes.To use LangGraph, we need to define three things:The state of our application;The nodes of our application (i.e., application steps);The “control flow” of our application (e.g., the ordering of the steps).State:[​](#state)The [state](https://langchain-ai.github.io/langgraphjs/concepts/low_level/#state) of our application controls what data is input to the application, transferred between steps, and output by the application.For a simple RAG application, we can just keep track of the input question, retrieved context, and generated answer.Read more about defining graph states [here](https://langchain-ai.github.io/langgraphjs/how-tos/define-state/).

```typescript
import { Document } from "@langchain/core/documents";
import { Annotation } from "@langchain/langgraph";

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

```Nodes (application steps)[​](#nodes-application-steps)Let’s start with a simple sequence of two steps: retrieval and generation.

```typescript
import { concat } from "@langchain/core/utils/stream";

const retrieve = async (state: typeof InputStateAnnotation.State) => {
  const retrievedDocs = await vectorStore.similaritySearch(state.question);
  return { context: retrievedDocs };
};

const generate = async (state: typeof StateAnnotation.State) => {
  const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
  const messages = await promptTemplate.invoke({
    question: state.question,
    context: docsContent,
  });
  const response = await llm.invoke(messages);
  return { answer: response.content };
};

```Our retrieval step simply runs a similarity search using the input question, and the generation step formats the retrieved context and original question into a prompt for the chat model.Control flow[​](#control-flow)Finally, we compile our application into a single graph object. In this case, we are just connecting the retrieval and generation steps into a single sequence.

```typescript
import { StateGraph } from "@langchain/langgraph";

const graph = new StateGraph(StateAnnotation)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addEdge("__start__", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "__end__")
  .compile();

```LangGraph also comes with built-in utilities for visualizing the control flow of your application:

```javascript
// Note: tslab only works inside a jupyter notebook. Don&#x27;t worry about running this code yourself!
import * as tslab from "tslab";

const image = await graph.getGraph().drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

await tslab.display.png(new Uint8Array(arrayBuffer));

```![graph_img_rag ](data:image/png;base64,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)Do I need to use LangGraph?LangGraph is not required to build a RAG application. Indeed, we can implement the same application logic through invocations of the individual components:

```javascript
let question = "...";

const retrievedDocs = await vectorStore.similaritySearch(question);
const docsContent = retrievedDocs.map((doc) => doc.pageContent).join("\n");
const messages = await promptTemplate.invoke({
  question: question,
  context: docsContent,
});
const answer = await llm.invoke(messages);

```The benefits of LangGraph include:Support for multiple invocation modes: this logic would need to be rewritten if we wanted to stream output tokens, or stream the results of individual steps;Automatic support for tracing via [LangSmith](https://docs.smith.langchain.com/) and deployments via [LangGraph Platform](https://langchain-ai.github.io/langgraphjs/concepts/langgraph_platform/);Support for persistence, human-in-the-loop, and other features.Many use-cases demand RAG in a conversational experience, such that a user can receive context-informed answers via a stateful conversation. As we will see in [Part 2](/docs/tutorials/qa_chat_history) of the tutorial, LangGraph’s management and persistence of state simplifies these applications enormously.Usage[​](#usage)Let’s test our application! LangGraph supports multiple invocation modes, including sync, async, and streaming.Invoke:

```typescript
let inputs = { question: "What is Task Decomposition?" };

const result = await graph.invoke(inputs);
console.log(result.context.slice(0, 2));
console.log(`\nAnswer: ${result["answer"]}`);

```

```text
[
  Document {
    pageContent: &#x27;hard tasks into smaller and simpler steps. CoT transforms big tasks into multiple manageable tasks and shed lights into an interpretation of the model’s thinking process.Tree of Thoughts (Yao et al. 2023) extends CoT by exploring multiple reasoning possibilities at each step. It first decomposes the problem into multiple thought steps and generates multiple thoughts per step, creating a tree structure. The search process can be BFS (breadth-first search) or DFS (depth-first search) with each state evaluated by a classifier (via a prompt) or majority vote.Task decomposition can be done (1) by LLM with simple prompting like "Steps for XYZ.\\n1.", "What are the subgoals for achieving XYZ?", (2) by using task-specific instructions; e.g. "Write a story outline." for writing a novel, or (3) with human inputs.Another quite distinct approach, LLM+P (Liu et al. 2023), involves relying on an external classical planner to do long-horizon planning. This approach utilizes the Planning Domain&#x27;,
    metadata: {
      source: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;,
      loc: [Object]
    },
    id: undefined
  },
  Document {
    pageContent: &#x27;Building agents with LLM (large language model) as its core controller is a cool concept. Several proof-of-concepts demos, such as AutoGPT, GPT-Engineer and BabyAGI, serve as inspiring examples. The potentiality of LLM extends beyond generating well-written copies, stories, essays and programs; it can be framed as a powerful general problem solver.In a LLM-powered autonomous agent system, LLM functions as the agent’s brain, complemented by several key components:A complicated task usually involves many steps. An agent needs to know what they are and plan ahead.Chain of thought (CoT; Wei et al. 2022) has become a standard prompting technique for enhancing model performance on complex tasks. The model is instructed to “think step by step” to utilize more test-time computation to decompose hard tasks into smaller and simpler steps. CoT transforms big tasks into multiple manageable tasks and shed lights into an interpretation of the model’s thinking process.Tree of Thoughts (Yao et al.&#x27;,
    metadata: {
      source: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;,
      loc: [Object]
    },
    id: undefined
  }
]

Answer: Task decomposition is the process of breaking down complex tasks into smaller, more manageable steps. This can be achieved through various methods, including prompting large language models (LLMs) to outline steps or using task-specific instructions. Techniques like Chain of Thought (CoT) and Tree of Thoughts further enhance this process by structuring reasoning and exploring multiple possibilities at each step.

```Stream steps:

```typescript
console.log(inputs);
console.log("\n====\n");
for await (const chunk of await graph.stream(inputs, {
  streamMode: "updates",
})) {
  console.log(chunk);
  console.log("\n====\n");
}

```

```text
{ question: &#x27;What is Task Decomposition?&#x27; }

====

{
  retrieve: { context: [ [Document], [Document], [Document], [Document] ] }
}

====

{
  generate: {
    answer: &#x27;Task decomposition is the process of breaking down complex tasks into smaller, more manageable steps. This can be achieved through various methods, including prompting large language models (LLMs) or using task-specific instructions. Techniques like Chain of Thought (CoT) and Tree of Thoughts further enhance this process by structuring reasoning and exploring multiple possibilities at each step.&#x27;
  }
}

====

```Stream [tokens](/docs/concepts/tokens/) (requires @langchain/core >= 0.3.24 and @langchain/langgraph >= 0.2.34 with above implementation):

```typescript
const stream = await graph.stream(inputs, { streamMode: "messages" });

for await (const [message, _metadata] of stream) {
  process.stdout.write(message.content + "|");
}

```

```text
|Task| decomposition| is| the| process| of| breaking| down| complex| tasks| into| smaller|,| more| manageable| steps|.| This| can| be| achieved| through| various| methods|,| including| prompting| large| language| models| (|LL|Ms|)| to| outline| steps| or| using| task|-specific| instructions|.| Techniques| like| Chain| of| Thought| (|Co|T|)| and| Tree| of| Thoughts| further| enhance| this| process| by| struct|uring| reasoning| and| exploring| multiple| possibilities| at| each| step|.||

```noteStreaming tokens with the current implementation, using .invoke in the generate step, requires @langchain/core >= 0.3.24 and @langchain/langgraph >= 0.2.34. See details [here](https://langchain-ai.github.io/langgraphjs/how-tos/stream-tokens/).Returning sources[​](#returning-sources)Note that by storing the retrieved context in the state of the graph, we recover sources for the model’s generated answer in the "context" field of the state. See [this guide](/docs/how_to/qa_sources/) on returning sources for more detail.Go deeper[​](#go-deeper-3)[Chat models](/docs/concepts/chat_models) take in a sequence of messages and return a message.[Docs](/docs/how_to#chat-models)[Integrations](/docs/integrations/chat/): 25+ integrations to choose from.Customizing the prompt**

As shown above, we can load prompts (e.g., [this RAG prompt](https://smith.langchain.com/hub/rlm/rag-prompt)) from the prompt hub. The prompt can also be easily customized. For example:

```typescript
const template = `Use the following pieces of context to answer the question at the end.
If you don&#x27;t know the answer, just say that you don&#x27;t know, don&#x27;t try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.
Always say "thanks for asking!" at the end of the answer.

{context}

Question: {question}

Helpful Answer:`;

const promptTemplateCustom = ChatPromptTemplate.fromMessages([
  ["user", template],
]);

```

## Query analysis[​](#query-analysis) So far, we are executing the retrieval using the raw input query. However, there are some advantages to allowing a model to generate the query for retrieval purposes. For example:

- In addition to semantic search, we can build in structured filters (e.g., “Find documents since the year 2020.”);
- The model can rewrite user queries, which may be multifaceted or include irrelevant language, into more effective search queries.

[Query analysis](/docs/concepts/retrieval/#query-analysis) employs models to transform or construct optimized search queries from raw user input. We can easily incorporate a query analysis step into our application. For illustrative purposes, let’s add some metadata to the documents in our vector store. We will add some (contrived) sections to the document which we can filter on later.

```typescript
const totalDocuments = allSplits.length;
const third = Math.floor(totalDocuments / 3);

allSplits.forEach((document, i) => {
  if (i < third) {
    document.metadata["section"] = "beginning";
  } else if (i < 2 * third) {
    document.metadata["section"] = "middle";
  } else {
    document.metadata["section"] = "end";
  }
});

allSplits[0].metadata;

```

```text
{
  source: &#x27;https://lilianweng.github.io/posts/2023-06-23-agent/&#x27;,
  loc: { lines: { from: 1, to: 1 } },
  section: &#x27;beginning&#x27;
}

```We will need to update the documents in our vector store. We will use a simple [MemoryVectorStore](https://api.js.langchain.com/classes/langchain.vectorstores_memory.MemoryVectorStore.html) for this, as we will use some of its specific features (i.e., metadata filtering). Refer to the vector store [integration documentation](/docs/integrations/vectorstores/) for relevant features of your chosen vector store.

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const vectorStoreQA = new MemoryVectorStore(embeddings);
await vectorStoreQA.addDocuments(allSplits);

```

Let’s next define a schema for our search query. We will use [structured output](/docs/concepts/structured_outputs/) for this purpose. Here we define a query as containing a string query and a document section (either “beginning”, “middle”, or “end”), but this can be defined however you like.

```typescript
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().describe("Search query to run."),
  section: z.enum(["beginning", "middle", "end"]).describe("Section to query."),
});

const structuredLlm = llm.withStructuredOutput(searchSchema);

```

Finally, we add a step to our LangGraph application to generate a query from the user’s raw input:

```typescript
const StateAnnotationQA = Annotation.Root({
  question: Annotation<string>,
  search: Annotation<z.infer<typeof searchSchema>>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

const analyzeQuery = async (state: typeof InputStateAnnotation.State) => {
  const result = await structuredLlm.invoke(state.question);
  return { search: result };
};

const retrieveQA = async (state: typeof StateAnnotationQA.State) => {
  const filter = (doc) => doc.metadata.section === state.search.section;
  const retrievedDocs = await vectorStore.similaritySearch(
    state.search.query,
    2,
    filter
  );
  return { context: retrievedDocs };
};

const generateQA = async (state: typeof StateAnnotationQA.State) => {
  const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
  const messages = await promptTemplate.invoke({
    question: state.question,
    context: docsContent,
  });
  const response = await llm.invoke(messages);
  return { answer: response.content };
};

const graphQA = new StateGraph(StateAnnotationQA)
  .addNode("analyzeQuery", analyzeQuery)
  .addNode("retrieveQA", retrieveQA)
  .addNode("generateQA", generateQA)
  .addEdge("__start__", "analyzeQuery")
  .addEdge("analyzeQuery", "retrieveQA")
  .addEdge("retrieveQA", "generateQA")
  .addEdge("generateQA", "__end__")
  .compile();

```

```javascript
// Note: tslab only works inside a jupyter notebook. Don&#x27;t worry about running this code yourself!
import * as tslab from "tslab";

const image = await graphQA.getGraph().drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

await tslab.display.png(new Uint8Array(arrayBuffer));

```![graph_img_rag_qa ](/assets/images/graph_img_rag_qa-974636bca4635fc8cd3d168abf5c6966.png)

We can test our implementation by specifically asking for context from the end of the post. Note that the model includes different information in its answer.

```typescript
let inputsQA = {
  question: "What does the end of the post say about Task Decomposition?",
};

console.log(inputsQA);
console.log("\n====\n");
for await (const chunk of await graphQA.stream(inputsQA, {
  streamMode: "updates",
})) {
  console.log(chunk);
  console.log("\n====\n");
}

```

```text
{
  question: &#x27;What does the end of the post say about Task Decomposition?&#x27;
}

====

{
  analyzeQuery: { search: { query: &#x27;Task Decomposition&#x27;, section: &#x27;end&#x27; } }
}

====

{ retrieveQA: { context: [ [Document], [Document] ] } }

====

{
  generateQA: {
    answer: &#x27;The end of the post emphasizes the importance of task decomposition by outlining a structured approach to organizing code into separate files and functions. It highlights the need for clarity and compatibility among different components, ensuring that each part of the architecture is well-defined and functional. This methodical breakdown aids in maintaining best practices and enhances code readability and manageability.&#x27;
  }
}

====

```In both the streamed steps and the [LangSmith trace](https://smith.langchain.com/public/8ff4742c-a5d4-41b2-adf9-22915a876a30/r), we can now observe the structured query that was fed into the retrieval step.

Query Analysis is a rich problem with a wide range of approaches. Refer to the [how-to guides](/docs/how_to/#query-analysis) for more examples.

## Next steps[​](#next-steps)

We’ve covered the steps to build a basic Q&A app over data:

- Loading data with a [Document Loader](/docs/concepts/document_loaders)
- Chunking the indexed data with a [Text Splitter](/docs/concepts/text_splitters) to make it more easily usable by a model
- [Embedding the data](/docs/concepts/embedding_models) and storing the data in a [vectorstore](/docs/how_to/vectorstores)
- [Retrieving](/docs/concepts/retrievers) the previously stored chunks in response to incoming questions
- Generating an answer using the retrieved chunks as context.

In [Part 2](/docs/tutorials/qa_chat_history) of the tutorial, we will extend the implementation here to accommodate conversation-style interactions and multi-step retrieval processes.

Further reading:

- [Return sources](/docs/how_to/qa_sources): Learn how to return source documents
- [Streaming](/docs/how_to/streaming): Learn how to stream outputs and intermediate steps
- [Add chat history](/docs/how_to/message_history): Learn how to add chat history to your app
- [Retrieval conceptual guide](/docs/concepts/retrieval): A high-level overview of specific retrieval techniques

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.