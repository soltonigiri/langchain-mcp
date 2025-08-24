ChatUpstage | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/upstage.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/upstage.ipynb)ChatUpstage This notebook covers how to get started with Upstage chat models. Installation[​](#installation) Install langchain-upstage package.

```bash
pip install -U langchain-upstage

``` Environment Setup[​](#environment-setup) Make sure to set the following environment variables: UPSTAGE_API_KEY: Your Upstage API key from [Upstage console](https://console.upstage.ai/). Usage[​](#usage)

```python
import os

os.environ["UPSTAGE_API_KEY"] = "YOUR_API_KEY"

```

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_upstage import ChatUpstage

chat = ChatUpstage()

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```python
# using chat invoke
chat.invoke("Hello, how are you?")

```

```python
# using chat stream
for m in chat.stream("Hello, how are you?"):
    print(m)

``` ## Chaining[​](#chaining)

```python
# using chain
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant that translates English to French."),
        ("human", "Translate this sentence from English to French. {english_text}."),
    ]
)
chain = prompt | chat

chain.invoke({"english_text": "Hello, how are you?"})

``` ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/upstage.ipynb)

- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Chaining](#chaining)
- [Related](#related)

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