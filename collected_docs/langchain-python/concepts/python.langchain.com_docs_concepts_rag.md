Retrieval augmented generation (RAG) | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/rag.mdx)Retrieval augmented generation (RAG) Prerequisites [Retrieval](/docs/concepts/retrieval/) Overview[​](#overview) Retrieval Augmented Generation (RAG) is a powerful technique that enhances [language models](/docs/concepts/chat_models/) by combining them with external knowledge bases. RAG addresses [a key limitation of models](https://www.glean.com/blog/how-to-build-an-ai-assistant-for-the-enterprise): models rely on fixed training datasets, which can lead to outdated or incomplete information. When given a query, RAG systems first search a knowledge base for relevant information. The system then incorporates this retrieved information into the model&#x27;s prompt. The model uses the provided context to generate a response to the query. By bridging the gap between vast language models and dynamic, targeted information retrieval, RAG is a powerful technique for building more capable and reliable AI systems. Key concepts[​](#key-concepts) ![Conceptual Overview ](/assets/images/rag_concepts-4499b260d1053838a3e361fb54f376ec.png) (1) Retrieval system**: Retrieve relevant information from a knowledge base. (2) **Adding external knowledge**: Pass retrieved information to a model. ## Retrieval system[​](#retrieval-system) Model&#x27;s have internal knowledge that is often fixed, or at least not updated frequently due to the high cost of training. This limits their ability to answer questions about current events, or to provide specific domain knowledge. To address this, there are various knowledge injection techniques like [fine-tuning](https://hamel.dev/blog/posts/fine_tuning_valuable.html) or continued pre-training. Both are [costly](https://www.glean.com/blog/how-to-build-an-ai-assistant-for-the-enterprise) and often [poorly suited](https://www.anyscale.com/blog/fine-tuning-is-for-form-not-facts) for factual retrieval. Using a retrieval system offers several advantages: **Up-to-date information**: RAG can access and utilize the latest data, keeping responses current.

- **Domain-specific expertise**: With domain-specific knowledge bases, RAG can provide answers in specific domains.

- **Reduced hallucination**: Grounding responses in retrieved facts helps minimize false or invented information.

- **Cost-effective knowledge integration**: RAG offers a more efficient alternative to expensive model fine-tuning.

Further readingSee our conceptual guide on [retrieval](/docs/concepts/retrieval/).

## Adding external knowledge[​](#adding-external-knowledge)

With a retrieval system in place, we need to pass knowledge from this system to the model. A RAG pipeline typically achieves this following these steps:

- Receive an input query.

- Use the retrieval system to search for relevant information based on the query.

- Incorporate the retrieved information into the prompt sent to the LLM.

- Generate a response that leverages the retrieved context.

As an example, here&#x27;s a simple RAG workflow that passes information from a [retriever](/docs/concepts/retrievers/) to a [chat model](/docs/concepts/chat_models/):

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

# Define a system prompt that tells the model how to use the retrieved context
system_prompt = """You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don&#x27;t know the answer, just say that you don&#x27;t know.
Use three sentences maximum and keep the answer concise.
Context: {context}:"""

# Define a question
question = """What are the main components of an LLM-powered autonomous agent system?"""

# Retrieve relevant documents
docs = retriever.invoke(question)

# Combine the documents into a single string
docs_text = "".join(d.page_content for d in docs)

# Populate the system prompt with the retrieved context
system_prompt_fmt = system_prompt.format(context=docs_text)

# Create a model
model = ChatOpenAI(model="gpt-4o", temperature=0)

# Generate a response
questions = model.invoke([SystemMessage(content=system_prompt_fmt),
                          HumanMessage(content=question)])

```**API Reference:**[SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

Further readingRAG a deep area with many possible optimization and design choices:

- See [this excellent blog](https://cameronrwolfe.substack.com/p/a-practitioners-guide-to-retrieval?utm_source=profile&utm_medium=reader2) from Cameron Wolfe for a comprehensive overview and history of RAG.

- See our [RAG how-to guides](/docs/how_to/#qa-with-rag).

- See our RAG [tutorials](/docs/tutorials/).

- See our RAG from Scratch course, with [code](https://github.com/langchain-ai/rag-from-scratch) and [video playlist](https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x).

- Also, see our RAG from Scratch course [on Freecodecamp](https://youtu.be/sVcwVQRHIc8?feature=shared).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/rag.mdx)

- [Overview](#overview)
- [Key concepts](#key-concepts)
- [Retrieval system](#retrieval-system)
- [Adding external knowledge](#adding-external-knowledge)

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