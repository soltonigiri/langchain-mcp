How to return sources | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to return sourcesPrerequisitesThis guide assumes familiarity with the following:Retrieval-augmented generation](/docs/tutorials/rag/)

Often in Q&A applications it’s important to show users the sources that were used to generate the answer. The simplest way to do this is for the chain to return the Documents that were retrieved in each generation.

We’ll be using the [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) blog post by Lilian Weng for retrieval content this notebook.

## Setup[​](#setup)

### Dependencies[​](#dependencies)

We’ll use an OpenAI chat model and embeddings and a Memory vector store in this walkthrough, but everything shown here works with any [ChatModel](/docs/concepts/chat_models) or [LLM](/docs/concepts/text_llms), [Embeddings](/docs/concepts/embedding_models), and [VectorStore](/docs/concepts/vectorstores) or [Retriever](/docs/concepts/retrievers).

We’ll use the following packages:

```bash
npm install --save langchain @langchain/openai cheerio

```

We need to set environment variable `OPENAI_API_KEY`:

```bash
export OPENAI_API_KEY=YOUR_KEY

```

### LangSmith[​](#langsmith) Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com/).

Note that LangSmith is not needed, but it is helpful. If you do want to use LangSmith, after you sign up at the link above, make sure to set your environment variables to start logging traces:

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=YOUR_KEY

# Reduce tracing latency if you are not in a serverless environment
# export LANGCHAIN_CALLBACKS_BACKGROUND=true

```

## Chain without sources[​](#chain-without-sources) Here is the Q&A app we built over the [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) blog post by Lilian Weng in the [Quickstart](/docs/tutorials/qa_chat_history/).

```typescript
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const loader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/"
);

const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splits = await textSplitter.splitDocuments(docs);
const vectorStore = await MemoryVectorStore.fromDocuments(
  splits,
  new OpenAIEmbeddings()
);

// Retrieve and generate using the relevant snippets of the blog.
const retriever = vectorStore.asRetriever();
const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

const ragChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

```

Let’s see what this prompt actually looks like:

```typescript
console.log(prompt.promptMessages.map((msg) => msg.prompt.template).join("\n"));

```

```text
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don&#x27;t know the answer, just say that you don&#x27;t know. Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
Answer:

```

```typescript
await ragChain.invoke("What is task decomposition?");

```

```text
"Task decomposition is a technique used to break down complex tasks into smaller and simpler steps. T"... 254 more characters

``` ## Adding sources[​](#adding-sources) With LCEL, we can easily pass the retrieved documents through the chain and return them in the final response:

```typescript
import {
  RunnableMap,
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";

const ragChainWithSources = RunnableMap.from({
  // Return raw documents here for now since we want to return them at
  // the end - we&#x27;ll format in the next step of the chain
  context: retriever,
  question: new RunnablePassthrough(),
}).assign({
  answer: RunnableSequence.from([
    (input) => {
      return {
        // Now we format the documents as strings for the prompt
        context: formatDocumentsAsString(input.context),
        question: input.question,
      };
    },
    prompt,
    llm,
    new StringOutputParser(),
  ]),
});

await ragChainWithSources.invoke("What is Task Decomposition");

```

```text
{
  question: "What is Task Decomposition",
  context: [
    Document {
      pageContent: "Fig. 1. Overview of a LLM-powered autonomous agent system.\n" +
        "Component One: Planning#\n" +
        "A complicated ta"... 898 more characters,
      metadata: {
        source: "https://lilianweng.github.io/posts/2023-06-23-agent/",
        loc: { lines: [Object] }
      }
    },
    Document {
      pageContent: &#x27;Task decomposition can be done (1) by LLM with simple prompting like "Steps for XYZ.\\n1.", "What are&#x27;... 887 more characters,
      metadata: {
        source: "https://lilianweng.github.io/posts/2023-06-23-agent/",
        loc: { lines: [Object] }
      }
    },
    Document {
      pageContent: "Agent System Overview\n" +
        "                \n" +
        "                    Component One: Planning\n" +
        "                 "... 850 more characters,
      metadata: {
        source: "https://lilianweng.github.io/posts/2023-06-23-agent/",
        loc: { lines: [Object] }
      }
    },
    Document {
      pageContent: "Resources:\n" +
        "1. Internet access for searches and information gathering.\n" +
        "2. Long Term memory management"... 456 more characters,
      metadata: {
        source: "https://lilianweng.github.io/posts/2023-06-23-agent/",
        loc: { lines: [Object] }
      }
    }
  ],
  answer: "Task decomposition is a technique used to break down complex tasks into smaller and simpler steps fo"... 230 more characters
}

```Check out the [LangSmith trace](https://smith.langchain.com/public/c3753531-563c-40d4-a6bf-21bfe8741d10/r) here to see the internals of the chain.

## Next steps[​](#next-steps)

You’ve now learned how to return sources from your QA chains.

Next, check out some of the other guides around RAG, such as [how to stream responses](/docs/how_to/qa_streaming).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Setup](#setup)[Dependencies](#dependencies)
- [LangSmith](#langsmith)

- [Chain without sources](#chain-without-sources)
- [Adding sources](#adding-sources)
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