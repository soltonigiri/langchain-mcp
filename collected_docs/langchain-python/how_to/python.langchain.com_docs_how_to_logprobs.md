How to get log probabilities | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/logprobs.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/logprobs.ipynb) # How to get log probabilities PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/)

- [Tokens](/docs/concepts/tokens/)

Certain [chat models](/docs/concepts/chat_models/) can be configured to return token-level log probabilities representing the likelihood of a given token. This guide walks through how to get this information in LangChain.

## OpenAI[​](#openai)

Install the LangChain x OpenAI package and set your API key

```python
%pip install -qU langchain-openai

```

```python
import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()

``` For the OpenAI API to return log probabilities we need to configure the `logprobs=True` param. Then, the logprobs are included on each output [AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) as part of the `response_metadata`:

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini").bind(logprobs=True)

msg = llm.invoke(("human", "how are you today"))

msg.response_metadata["logprobs"]["content"][:5]

```

```output
[{&#x27;token&#x27;: &#x27;I&#x27;, &#x27;bytes&#x27;: [73], &#x27;logprob&#x27;: -0.26341408, &#x27;top_logprobs&#x27;: []},
 {&#x27;token&#x27;: "&#x27;m",
  &#x27;bytes&#x27;: [39, 109],
  &#x27;logprob&#x27;: -0.48584133,
  &#x27;top_logprobs&#x27;: []},
 {&#x27;token&#x27;: &#x27; just&#x27;,
  &#x27;bytes&#x27;: [32, 106, 117, 115, 116],
  &#x27;logprob&#x27;: -0.23484154,
  &#x27;top_logprobs&#x27;: []},
 {&#x27;token&#x27;: &#x27; a&#x27;,
  &#x27;bytes&#x27;: [32, 97],
  &#x27;logprob&#x27;: -0.0018291725,
  &#x27;top_logprobs&#x27;: []},
 {&#x27;token&#x27;: &#x27; computer&#x27;,
  &#x27;bytes&#x27;: [32, 99, 111, 109, 112, 117, 116, 101, 114],
  &#x27;logprob&#x27;: -0.052299336,
  &#x27;top_logprobs&#x27;: []}]

``` And are part of streamed Message chunks as well:

```python
ct = 0
full = None
for chunk in llm.stream(("human", "how are you today")):
    if ct < 5:
        full = chunk if full is None else full + chunk
        if "logprobs" in full.response_metadata:
            print(full.response_metadata["logprobs"]["content"])
    else:
        break
    ct += 1

```

```output
[]
[{&#x27;token&#x27;: &#x27;I&#x27;, &#x27;bytes&#x27;: [73], &#x27;logprob&#x27;: -0.26593843, &#x27;top_logprobs&#x27;: []}]
[{&#x27;token&#x27;: &#x27;I&#x27;, &#x27;bytes&#x27;: [73], &#x27;logprob&#x27;: -0.26593843, &#x27;top_logprobs&#x27;: []}, {&#x27;token&#x27;: "&#x27;m", &#x27;bytes&#x27;: [39, 109], &#x27;logprob&#x27;: -0.3238896, &#x27;top_logprobs&#x27;: []}]
[{&#x27;token&#x27;: &#x27;I&#x27;, &#x27;bytes&#x27;: [73], &#x27;logprob&#x27;: -0.26593843, &#x27;top_logprobs&#x27;: []}, {&#x27;token&#x27;: "&#x27;m", &#x27;bytes&#x27;: [39, 109], &#x27;logprob&#x27;: -0.3238896, &#x27;top_logprobs&#x27;: []}, {&#x27;token&#x27;: &#x27; just&#x27;, &#x27;bytes&#x27;: [32, 106, 117, 115, 116], &#x27;logprob&#x27;: -0.23778509, &#x27;top_logprobs&#x27;: []}]
[{&#x27;token&#x27;: &#x27;I&#x27;, &#x27;bytes&#x27;: [73], &#x27;logprob&#x27;: -0.26593843, &#x27;top_logprobs&#x27;: []}, {&#x27;token&#x27;: "&#x27;m", &#x27;bytes&#x27;: [39, 109], &#x27;logprob&#x27;: -0.3238896, &#x27;top_logprobs&#x27;: []}, {&#x27;token&#x27;: &#x27; just&#x27;, &#x27;bytes&#x27;: [32, 106, 117, 115, 116], &#x27;logprob&#x27;: -0.23778509, &#x27;top_logprobs&#x27;: []}, {&#x27;token&#x27;: &#x27; a&#x27;, &#x27;bytes&#x27;: [32, 97], &#x27;logprob&#x27;: -0.0022134194, &#x27;top_logprobs&#x27;: []}]

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to get logprobs from OpenAI models in LangChain.

Next, check out the other how-to guides chat models in this section, like [how to get a model to return structured output](/docs/how_to/structured_output/) or [how to track token usage](/docs/how_to/chat_token_usage_tracking/).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/logprobs.ipynb)

- [OpenAI](#openai)
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