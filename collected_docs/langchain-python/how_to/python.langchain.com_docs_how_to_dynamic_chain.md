How to create a dynamic (self-constructing) chain | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/dynamic_chain.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/dynamic_chain.ipynb)How to create a dynamic (self-constructing) chain PrerequisitesThis guide assumes familiarity with the following: [LangChain Expression Language (LCEL)](/docs/concepts/lcel/) [How to turn any function into a runnable](/docs/how_to/functions/) Sometimes we want to construct parts of a chain at runtime, depending on the chain inputs ([routing](/docs/how_to/routing/) is the most common example of this). We can create dynamic chains like this using a very useful property of RunnableLambda&#x27;s, which is that if a RunnableLambda returns a Runnable, that Runnable is itself invoked. Let&#x27;s see an example. Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

```

```python
# | echo: false

from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-7-sonnet-20250219")

```

```python
from operator import itemgetter

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable, RunnablePassthrough, chain

contextualize_instructions = """Convert the latest user question into a standalone question given the chat history. Don&#x27;t answer the question, return the question and nothing else (no descriptive text)."""
contextualize_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_instructions),
        ("placeholder", "{chat_history}"),
        ("human", "{question}"),
    ]
)
contextualize_question = contextualize_prompt | llm | StrOutputParser()

qa_instructions = (
    """Answer the user question given the following context:\n\n{context}."""
)
qa_prompt = ChatPromptTemplate.from_messages(
    [("system", qa_instructions), ("human", "{question}")]
)

@chain
def contextualize_if_needed(input_: dict) -> Runnable:
    if input_.get("chat_history"):
        # NOTE: This is returning another Runnable, not an actual output.
        return contextualize_question
    else:
        return RunnablePassthrough() | itemgetter("question")

@chain
def fake_retriever(input_: dict) -> str:
    return "egypt&#x27;s population in 2024 is about 111 million"

full_chain = (
    RunnablePassthrough.assign(question=contextualize_if_needed).assign(
        context=fake_retriever
    )
    | qa_prompt
    | llm
    | StrOutputParser()
)

full_chain.invoke(
    {
        "question": "what about egypt",
        "chat_history": [
            ("human", "what&#x27;s the population of indonesia"),
            ("ai", "about 276 million"),
        ],
    }
)

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [Runnable](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) | [chain](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.chain.html)

```output
"Egypt&#x27;s population in 2024 is about 111 million."

``` The key here is that contextualize_if_needed returns another Runnable and not an actual output. This returned Runnable is itself run when the full chain is executed. Looking at the trace we can see that, since we passed in chat_history, we executed the contextualize_question chain as part of the full chain: [https://smith.langchain.com/public/9e0ae34c-4082-4f3f-beed-34a2a2f4c991/r](https://smith.langchain.com/public/9e0ae34c-4082-4f3f-beed-34a2a2f4c991/r) Note that the streaming, batching, etc. capabilities of the returned Runnable are all preserved

```python
for chunk in contextualize_if_needed.stream(
    {
        "question": "what about egypt",
        "chat_history": [
            ("human", "what&#x27;s the population of indonesia"),
            ("ai", "about 276 million"),
        ],
    }
):
    print(chunk)

```

```output
What
 is the population of Egypt?

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/dynamic_chain.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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