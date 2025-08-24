How to summarize text in a single LLM call | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/summarize_stuff.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/summarize_stuff.ipynb)How to summarize text in a single LLM call LLMs can summarize and otherwise distill desired information from text, including large volumes of text. In many cases, especially for models with larger context windows, this can be adequately achieved via a single LLM call. LangChain implements a simple [pre-built chain](https://python.langchain.com/api_reference/langchain/chains/langchain.chains.combine_documents.stuff.create_stuff_documents_chain.html) that "stuffs" a prompt with the desired context for summarization and other purposes. In this guide we demonstrate how to use the chain. Load chat model[​](#load-chat-model) Let&#x27;s first load a [chat model](/docs/concepts/chat_models/): Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` Load documents[​](#load-documents) Next, we need some documents to summarize. Below, we generate some toy documents for illustrative purposes. See the document loader [how-to guides](/docs/how_to/#document-loaders) and [integration pages](/docs/integrations/document_loaders/) for additional sources of data. The [summarization tutorial](/docs/tutorials/summarization/) also includes an example summarizing a blog post.

```python
from langchain_core.documents import Document

documents = [
    Document(page_content="Apples are red", metadata={"title": "apple_book"}),
    Document(page_content="Blueberries are blue", metadata={"title": "blueberry_book"}),
    Document(page_content="Bananas are yelow", metadata={"title": "banana_book"}),
]

```API Reference:**[Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) ## Load chain[​](#load-chain) Below, we define a simple prompt and instantiate the chain with our chat model and documents:

```python
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("Summarize this content: {context}")
chain = create_stuff_documents_chain(llm, prompt)

```**API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) ## Invoke chain[​](#invoke-chain) Because the chain is a [Runnable](/docs/concepts/runnables/), it implements the usual methods for invocation:

```python
result = chain.invoke({"context": documents})
result

```

```output
&#x27;The content describes the colors of three fruits: apples are red, blueberries are blue, and bananas are yellow.&#x27;

``` ### Streaming[​](#streaming) Note that the chain also supports streaming of individual output tokens:

```python
for chunk in chain.stream({"context": documents}):
    print(chunk, end="|")

```

```output
|The| content| describes| the| colors| of| three| fruits|:| apples| are| red|,| blueberries| are| blue|,| and| bananas| are| yellow|.||

``` ## Next steps[​](#next-steps) See the summarization [how-to guides](/docs/how_to/#summarization) for additional summarization strategies, including those designed for larger volumes of text. See also [this tutorial](/docs/tutorials/summarization/) for more detail on summarization.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/summarize_stuff.ipynb)[Load chat model](#load-chat-model)
- [Load documents](#load-documents)
- [Load chain](#load-chain)
- [Invoke chain](#invoke-chain)[Streaming](#streaming)

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