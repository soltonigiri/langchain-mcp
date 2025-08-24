ChatGroq | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/groq.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/groq.ipynb)ChatGroq This will help you get started with Groq [chat models](/docs/concepts/chat_models/). For detailed documentation of all ChatGroq features and configurations head to the [API reference](https://python.langchain.com/api_reference/groq/chat_models/langchain_groq.chat_models.ChatGroq.html). For a list of all Groq models, visit this [link](https://console.groq.com/docs/models?utm_source=langchain). Overview[​](#overview) Integration details[​](#integration-details) ClassPackageLocalSerializable[JS support](https://js.langchain.com/docs/integrations/chat/groq)Package downloadsPackage latest[ChatGroq](https://python.langchain.com/api_reference/groq/chat_models/langchain_groq.chat_models.ChatGroq.html)[langchain-groq](https://python.langchain.com/api_reference/groq/index.html)❌beta✅![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain-groq?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain-groq?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅✅❌❌❌✅✅✅✅ Setup[​](#setup) To access Groq models you&#x27;ll need to create a Groq account, get an API key, and install the langchain-groq integration package. Credentials[​](#credentials) Head to the [Groq console](https://console.groq.com/login?utm_source=langchain&utm_content=chat_page) to sign up to Groq and generate an API key. Once you&#x27;ve done this set the GROQ_API_KEY environment variable:

```python
import getpass
import os

if "GROQ_API_KEY" not in os.environ:
    os.environ["GROQ_API_KEY"] = getpass.getpass("Enter your Groq API key: ")

``` To enable automated tracing of your model calls, set your [LangSmith](https://docs.smith.langchain.com/) API key:

```python
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
# os.environ["LANGSMITH_TRACING"] = "true"

``` Installation[​](#installation) The LangChain Groq integration lives in the langchain-groq package:

```python
%pip install -qU langchain-groq

``` Instantiation[​](#instantiation) Now we can instantiate our model object and generate chat completions. Reasoning FormatIf you choose to set a reasoning_format, you must ensure that the model you are using supports it. You can find a list of supported models in the [Groq documentation](https://console.groq.com/docs/reasoning).

```python
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="deepseek-r1-distill-llama-70b",
    temperature=0,
    max_tokens=None,
    reasoning_format="parsed",
    timeout=None,
    max_retries=2,
    # other params...
)

``` Invocation[​](#invocation)

```python
messages = [
    (
        "system",
        "You are a helpful assistant that translates English to French. Translate the user sentence.",
    ),
    ("human", "I love programming."),
]
ai_msg = llm.invoke(messages)
ai_msg

```

```output
AIMessage(content="J&#x27;aime la programmation.", additional_kwargs={&#x27;reasoning_content&#x27;: &#x27;Okay, so I need to translate the sentence "I love programming." into French. Let me think about how to approach this. \n\nFirst, I know that "I" in French is "Je." That\&#x27;s straightforward. Now, the verb "love" in French is "aime" when referring to oneself. So, "I love" would be "J\&#x27;aime." \n\nNext, the word "programming." In French, programming is "la programmation." But wait, in French, when you talk about loving an activity, you often use the definite article. So, it would be "la programmation." \n\nPutting it all together, "I love programming" becomes "J\&#x27;aime la programmation." That sounds right. I think that\&#x27;s the correct translation. \n\nI should double-check to make sure I\&#x27;m not missing anything. Maybe I can think of similar phrases. For example, "I love reading" is "J\&#x27;aime lire," but when it\&#x27;s a noun, like "I love music," it\&#x27;s "J\&#x27;aime la musique." So, yes, using "la programmation" makes sense here. \n\nI don\&#x27;t think I need to change anything else. The sentence structure in French is Subject-Verb-Object, just like in English, so "J\&#x27;aime la programmation" should be correct. \n\nI guess another way to say it could be "J\&#x27;adore la programmation," using "adore" instead of "aime," but "aime" is more commonly used in this context. So, sticking with "J\&#x27;aime la programmation" is probably the best choice.\n&#x27;}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 346, &#x27;prompt_tokens&#x27;: 23, &#x27;total_tokens&#x27;: 369, &#x27;completion_time&#x27;: 1.447541218, &#x27;prompt_time&#x27;: 0.000983386, &#x27;queue_time&#x27;: 0.009673684, &#x27;total_time&#x27;: 1.448524604}, &#x27;model_name&#x27;: &#x27;deepseek-r1-distill-llama-70b&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_e98d30d035&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--5679ae4f-f4e8-4931-bcd5-7304223832c0-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 23, &#x27;output_tokens&#x27;: 346, &#x27;total_tokens&#x27;: 369})

```

```python
print(ai_msg.content)

```

```output
J&#x27;aime la programmation.

``` Chaining[​](#chaining) We can [chain](/docs/how_to/sequence/) our model with a prompt template like so:

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant that translates {input_language} to {output_language}.",
        ),
        ("human", "{input}"),
    ]
)

chain = prompt | llm
chain.invoke(
    {
        "input_language": "English",
        "output_language": "German",
        "input": "I love programming.",
    }
)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
AIMessage(content=&#x27;The translation of "I love programming" into German is "Ich liebe das Programmieren." \n\n**Step-by-Step Explanation:**\n\n1. **Subject Pronoun:** "I" translates to "Ich."\n2. **Verb Conjugation:** "Love" becomes "liebe" (first person singular of "lieben").\n3. **Gerund Translation:** "Programming" is translated using the infinitive noun "Programmieren."\n4. **Article Usage:** The definite article "das" is included before the infinitive noun for natural phrasing.\n\nThus, the complete and natural translation is:\n\n**Ich liebe das Programmieren.**&#x27;, additional_kwargs={&#x27;reasoning_content&#x27;: &#x27;Okay, so I need to translate the sentence "I love programming." into German. Hmm, let\&#x27;s break this down. \n\nFirst, "I" in German is "Ich." That\&#x27;s straightforward. Now, "love" translates to "liebe." Wait, but in German, the verb conjugation depends on the subject. Since it\&#x27;s "I," the verb would be "liebe" because "lieben" is the infinitive, and for first person singular, it\&#x27;s "liebe." \n\nNext, "programming" is a gerund in English, which is the -ing form. In German, the equivalent would be the present participle, which is "programmierend." But wait, sometimes in German, they use the noun form instead of the gerund. So maybe it\&#x27;s better to say "Ich liebe das Programmieren." Because "Programmieren" is the infinitive noun form, and it\&#x27;s commonly used in such contexts. \n\nLet me think again. "I love programming" could be directly translated as "Ich liebe Programmieren," but I\&#x27;ve heard both "Programmieren" and "programmierend" used. However, "Ich liebe das Programmieren" sounds more natural because it uses the definite article "das" before the infinitive noun. \n\nAlternatively, if I use "programmieren" without the article, it\&#x27;s still correct but maybe a bit less common. So, to make it sound more natural and fluent, including the article "das" would be better. \n\nTherefore, the correct translation should be "Ich liebe das Programmieren." That makes sense because it\&#x27;s similar to saying "I love (the act of) programming." \n\nI think that\&#x27;s the most accurate and natural way to express it in German. Let me double-check some examples. If someone says "I love reading," in German it\&#x27;s "Ich liebe das Lesen." So yes, using "das" before the infinitive noun is the correct structure. \n\nSo, putting it all together, "I love programming" becomes "Ich liebe das Programmieren." That should be the right translation.\n&#x27;}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 569, &#x27;prompt_tokens&#x27;: 18, &#x27;total_tokens&#x27;: 587, &#x27;completion_time&#x27;: 2.511255685, &#x27;prompt_time&#x27;: 0.001466702, &#x27;queue_time&#x27;: 0.009628211, &#x27;total_time&#x27;: 2.512722387}, &#x27;model_name&#x27;: &#x27;deepseek-r1-distill-llama-70b&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_87eae35036&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--4d5ee86d-5eec-495c-9c4e-261526cf6e3d-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 18, &#x27;output_tokens&#x27;: 569, &#x27;total_tokens&#x27;: 587})

``` ## API reference[​](#api-reference) For detailed documentation of all ChatGroq features and configurations head to the [API reference](https://python.langchain.com/api_reference/groq/chat_models/langchain_groq.chat_models.ChatGroq.html). ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/groq.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Chaining](#chaining)
- [API reference](#api-reference)
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