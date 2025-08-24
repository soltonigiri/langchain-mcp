How to track token usage for LLMs | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/llm_token_usage_tracking.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/llm_token_usage_tracking.ipynb)How to track token usage for LLMs Tracking [token](/docs/concepts/tokens/) usage to calculate cost is an important part of putting your app in production. This guide goes over how to obtain this information from your LangChain model calls. PrerequisitesThis guide assumes familiarity with the following concepts: [LLMs](/docs/concepts/text_llms/) Using LangSmith[​](#using-langsmith) You can use [LangSmith](https://www.langchain.com/langsmith) to help track token usage in your LLM application. See the [LangSmith quick start guide](https://docs.smith.langchain.com/). Using callbacks[​](#using-callbacks) There are some API-specific callback context managers that allow you to track token usage across multiple calls. You&#x27;ll need to check whether such an integration is available for your particular model. If such an integration is not available for your model, you can create a custom callback manager by adapting the implementation of the [OpenAI callback manager](https://python.langchain.com/api_reference/community/callbacks/langchain_community.callbacks.openai_info.OpenAICallbackHandler.html). OpenAI[​](#openai) Let&#x27;s first look at an extremely simple example of tracking token usage for a single Chat model call. dangerThe callback handler does not currently support streaming token counts for legacy language models (e.g., langchain_openai.OpenAI). For support in a streaming context, refer to the corresponding guide for chat models [here](/docs/how_to/chat_token_usage_tracking/). Single call[​](#single-call)

```python
from langchain_community.callbacks import get_openai_callback
from langchain_openai import OpenAI

llm = OpenAI(model_name="gpt-3.5-turbo-instruct")

with get_openai_callback() as cb:
    result = llm.invoke("Tell me a joke")
    print(result)
    print("---")
print()

print(f"Total Tokens: {cb.total_tokens}")
print(f"Prompt Tokens: {cb.prompt_tokens}")
print(f"Completion Tokens: {cb.completion_tokens}")
print(f"Total Cost (USD): ${cb.total_cost}")

```

```output
Why don&#x27;t scientists trust atoms?

Because they make up everything.
---

Total Tokens: 18
Prompt Tokens: 4
Completion Tokens: 14
Total Cost (USD): $3.4e-05

``` Multiple calls[​](#multiple-calls) Anything inside the context manager will get tracked. Here&#x27;s an example of using it to track multiple calls in sequence to a chain. This will also work for an agent which may use multiple steps.

```python
from langchain_community.callbacks import get_openai_callback
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI

llm = OpenAI(model_name="gpt-3.5-turbo-instruct")

template = PromptTemplate.from_template("Tell me a joke about {topic}")
chain = template | llm

with get_openai_callback() as cb:
    response = chain.invoke({"topic": "birds"})
    print(response)
    response = chain.invoke({"topic": "fish"})
    print("--")
    print(response)

print()
print("---")
print(f"Total Tokens: {cb.total_tokens}")
print(f"Prompt Tokens: {cb.prompt_tokens}")
print(f"Completion Tokens: {cb.completion_tokens}")
print(f"Total Cost (USD): ${cb.total_cost}")

```API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```output
Why did the chicken go to the seance?

To talk to the other side of the road!
--

Why did the fish need a lawyer?

Because it got caught in a net!

---
Total Tokens: 50
Prompt Tokens: 12
Completion Tokens: 38
Total Cost (USD): $9.400000000000001e-05

``` ## Streaming[​](#streaming) dangerget_openai_callback does not currently support streaming token counts for legacy language models (e.g., langchain_openai.OpenAI). If you want to count tokens correctly in a streaming context, there are a number of options: Use chat models as described in [this guide](/docs/how_to/chat_token_usage_tracking/);

- Implement a [custom callback handler](/docs/how_to/custom_callbacks/) that uses appropriate tokenizers to count the tokens;

- Use a monitoring platform such as [LangSmith](https://www.langchain.com/langsmith).

Note that when using legacy language models in a streaming context, token counts are not updated:

```python
from langchain_community.callbacks import get_openai_callback
from langchain_openai import OpenAI

llm = OpenAI(model_name="gpt-3.5-turbo-instruct")

with get_openai_callback() as cb:
    for chunk in llm.stream("Tell me a joke"):
        print(chunk, end="", flush=True)
    print(result)
    print("---")
print()

print(f"Total Tokens: {cb.total_tokens}")
print(f"Prompt Tokens: {cb.prompt_tokens}")
print(f"Completion Tokens: {cb.completion_tokens}")
print(f"Total Cost (USD): ${cb.total_cost}")

```

```output
Why don&#x27;t scientists trust atoms?

Because they make up everything!

Why don&#x27;t scientists trust atoms?

Because they make up everything.
---

Total Tokens: 0
Prompt Tokens: 0
Completion Tokens: 0
Total Cost (USD): $0.0

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/llm_token_usage_tracking.ipynb)

- [Using LangSmith](#using-langsmith)
- [Using callbacks](#using-callbacks)[OpenAI](#openai)
- [Single call](#single-call)
- [Multiple calls](#multiple-calls)

- [Streaming](#streaming)

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