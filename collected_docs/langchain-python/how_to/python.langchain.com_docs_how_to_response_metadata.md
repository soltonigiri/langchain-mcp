Response metadata | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/response_metadata.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/response_metadata.ipynb) # Response metadata Many model providers include some metadata in their chat generation [responses](/docs/concepts/messages/#aimessage). This metadata can be accessed via the AIMessage.response_metadata: Dict attribute. Depending on the model provider and model configuration, this can contain information like [token counts](/docs/how_to/chat_token_usage_tracking/), [logprobs](/docs/how_to/logprobs/), and more. Here&#x27;s what the response metadata looks like for a few different providers: ## OpenAI[​](#openai)

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
msg = llm.invoke("What&#x27;s the oldest known example of cuneiform")
msg.response_metadata

```

```output
{&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 88,
  &#x27;prompt_tokens&#x27;: 16,
  &#x27;total_tokens&#x27;: 104,
  &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0,
   &#x27;audio_tokens&#x27;: 0,
   &#x27;reasoning_tokens&#x27;: 0,
   &#x27;rejected_prediction_tokens&#x27;: 0},
  &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}},
 &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;,
 &#x27;system_fingerprint&#x27;: &#x27;fp_34a54ae93c&#x27;,
 &#x27;id&#x27;: &#x27;chatcmpl-ByN1Qkvqb5fAGKKzXXxZ3rBlnqkWs&#x27;,
 &#x27;service_tier&#x27;: &#x27;default&#x27;,
 &#x27;finish_reason&#x27;: &#x27;stop&#x27;,
 &#x27;logprobs&#x27;: None}

``` ## Anthropic[​](#anthropic)

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-7-sonnet-20250219")
msg = llm.invoke("What&#x27;s the oldest known example of cuneiform")
msg.response_metadata

```

```output
{&#x27;id&#x27;: &#x27;msg_01NTWnqvbNKSjGfqQL7xikau&#x27;,
 &#x27;model&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;,
 &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;,
 &#x27;stop_sequence&#x27;: None,
 &#x27;usage&#x27;: {&#x27;cache_creation_input_tokens&#x27;: 0,
  &#x27;cache_read_input_tokens&#x27;: 0,
  &#x27;input_tokens&#x27;: 17,
  &#x27;output_tokens&#x27;: 197,
  &#x27;server_tool_use&#x27;: None,
  &#x27;service_tier&#x27;: &#x27;standard&#x27;},
 &#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}

``` ## Google Generative AI[​](#google-generative-ai)

```python
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
msg = llm.invoke("What&#x27;s the oldest known example of cuneiform")
msg.response_metadata

```

```output
{&#x27;prompt_feedback&#x27;: {&#x27;block_reason&#x27;: 0, &#x27;safety_ratings&#x27;: []},
 &#x27;finish_reason&#x27;: &#x27;STOP&#x27;,
 &#x27;model_name&#x27;: &#x27;gemini-2.5-flash&#x27;,
 &#x27;safety_ratings&#x27;: []}

``` ## Bedrock (Anthropic)[​](#bedrock-anthropic)

```python
from langchain_aws import ChatBedrockConverse

llm = ChatBedrockConverse(model="anthropic.claude-3-7-sonnet-20250219-v1:0")
msg = llm.invoke("What&#x27;s the oldest known example of cuneiform")
msg.response_metadata

```

```output
{&#x27;ResponseMetadata&#x27;: {&#x27;RequestId&#x27;: &#x27;ea0ac2ad-3ad5-4a49-9647-274a0c73ac31&#x27;,
  &#x27;HTTPStatusCode&#x27;: 200,
  &#x27;HTTPHeaders&#x27;: {&#x27;date&#x27;: &#x27;Sat, 22 Mar 2025 11:27:46 GMT&#x27;,
   &#x27;content-type&#x27;: &#x27;application/json&#x27;,
   &#x27;content-length&#x27;: &#x27;1660&#x27;,
   &#x27;connection&#x27;: &#x27;keep-alive&#x27;,
   &#x27;x-amzn-requestid&#x27;: &#x27;ea0ac2ad-3ad5-4a49-9647-274a0c73ac31&#x27;},
  &#x27;RetryAttempts&#x27;: 0},
 &#x27;stopReason&#x27;: &#x27;end_turn&#x27;,
 &#x27;metrics&#x27;: {&#x27;latencyMs&#x27;: [11044]}}

``` ## MistralAI[​](#mistralai)

```python
from langchain_mistralai import ChatMistralAI

llm = ChatMistralAI(model="mistral-small-latest")
msg = llm.invoke([("human", "What&#x27;s the oldest known example of cuneiform")])
msg.response_metadata

```

```output
{&#x27;token_usage&#x27;: {&#x27;prompt_tokens&#x27;: 13,
  &#x27;total_tokens&#x27;: 306,
  &#x27;completion_tokens&#x27;: 293},
 &#x27;model_name&#x27;: &#x27;mistral-small-latest&#x27;,
 &#x27;model&#x27;: &#x27;mistral-small-latest&#x27;,
 &#x27;finish_reason&#x27;: &#x27;stop&#x27;}

``` ## Groq[​](#groq)

```python
from langchain_groq import ChatGroq

llm = ChatGroq(model="llama-3.1-8b-instant")
msg = llm.invoke("What&#x27;s the oldest known example of cuneiform")
msg.response_metadata

```

```output
{&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 184,
  &#x27;prompt_tokens&#x27;: 45,
  &#x27;total_tokens&#x27;: 229,
  &#x27;completion_time&#x27;: 0.245333333,
  &#x27;prompt_time&#x27;: 0.002262803,
  &#x27;queue_time&#x27;: 0.19315161,
  &#x27;total_time&#x27;: 0.247596136},
 &#x27;model_name&#x27;: &#x27;llama-3.1-8b-instant&#x27;,
 &#x27;system_fingerprint&#x27;: &#x27;fp_a56f6eea01&#x27;,
 &#x27;finish_reason&#x27;: &#x27;stop&#x27;,
 &#x27;logprobs&#x27;: None}

``` ## FireworksAI[​](#fireworksai)

```python
from langchain_fireworks import ChatFireworks

llm = ChatFireworks(model="accounts/fireworks/models/llama-v3p1-70b-instruct")
msg = llm.invoke("What&#x27;s the oldest known example of cuneiform")
msg.response_metadata

```

```output
{&#x27;token_usage&#x27;: {&#x27;prompt_tokens&#x27;: 25,
  &#x27;total_tokens&#x27;: 352,
  &#x27;completion_tokens&#x27;: 327},
 &#x27;model_name&#x27;: &#x27;accounts/fireworks/models/llama-v3p1-70b-instruct&#x27;,
 &#x27;system_fingerprint&#x27;: &#x27;&#x27;,
 &#x27;finish_reason&#x27;: &#x27;stop&#x27;,
 &#x27;logprobs&#x27;: None}

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/response_metadata.ipynb)[OpenAI](#openai)
- [Anthropic](#anthropic)
- [Google Generative AI](#google-generative-ai)
- [Bedrock (Anthropic)](#bedrock-anthropic)
- [MistralAI](#mistralai)
- [Groq](#groq)
- [FireworksAI](#fireworksai)

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