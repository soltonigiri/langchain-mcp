How to add fallbacks to a runnable | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/fallbacks.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/fallbacks.ipynb)How to add fallbacks to a runnable When working with language models, you may often encounter issues from the underlying APIs, whether these be rate limiting or downtime. Therefore, as you go to move your LLM applications into production it becomes more and more important to safeguard against these. That&#x27;s why we&#x27;ve introduced the concept of fallbacks. A fallback** is an alternative plan that may be used in an emergency. Crucially, fallbacks can be applied not only on the LLM level but on the whole runnable level. This is important because often times different models require different prompts. So if your call to OpenAI fails, you don&#x27;t just want to send the same prompt to Anthropic - you probably want to use a different prompt template and send a different version there. ## Fallback for LLM API Errors[​](#fallback-for-llm-api-errors) This is maybe the most common use case for fallbacks. A request to an LLM API can fail for a variety of reasons - the API could be down, you could have hit rate limits, any number of things. Therefore, using fallbacks can help protect against these types of things. IMPORTANT: By default, a lot of the LLM wrappers catch errors and retry. You will most likely want to turn those off when working with fallbacks. Otherwise the first wrapper will keep on retrying and not failing.

```python
%pip install --upgrade --quiet  langchain langchain-openai

```**

```python
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI

``` First, let&#x27;s mock out what happens if we hit a RateLimitError from OpenAI

```python
from unittest.mock import patch

import httpx
from openai import RateLimitError

request = httpx.Request("GET", "/")
response = httpx.Response(200, request=request)
error = RateLimitError("rate limit", response=response, body="")

```

```python
# Note that we set max_retries = 0 to avoid retrying on RateLimits, etc
openai_llm = ChatOpenAI(model="gpt-4o-mini", max_retries=0)
anthropic_llm = ChatAnthropic(model="claude-3-haiku-20240307")
llm = openai_llm.with_fallbacks([anthropic_llm])

```

```python
# Let&#x27;s use just the OpenAI LLm first, to show that we run into an error
with patch("openai.resources.chat.completions.Completions.create", side_effect=error):
    try:
        print(openai_llm.invoke("Why did the chicken cross the road?"))
    except RateLimitError:
        print("Hit error")

```

```output
Hit error

```

```python
# Now let&#x27;s try with fallbacks to Anthropic
with patch("openai.resources.chat.completions.Completions.create", side_effect=error):
    try:
        print(llm.invoke("Why did the chicken cross the road?"))
    except RateLimitError:
        print("Hit error")

```

```output
content=&#x27; I don\&#x27;t actually know why the chicken crossed the road, but here are some possible humorous answers:\n\n- To get to the other side!\n\n- It was too chicken to just stand there. \n\n- It wanted a change of scenery.\n\n- It wanted to show the possum it could be done.\n\n- It was on its way to a poultry farmers\&#x27; convention.\n\nThe joke plays on the double meaning of "the other side" - literally crossing the road to the other side, or the "other side" meaning the afterlife. So it\&#x27;s an anti-joke, with a silly or unexpected pun as the answer.&#x27; additional_kwargs={} example=False

``` We can use our "LLM with Fallbacks" as we would a normal LLM.

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You&#x27;re a nice assistant who always includes a compliment in your response",
        ),
        ("human", "Why did the {animal} cross the road"),
    ]
)
chain = prompt | llm
with patch("openai.resources.chat.completions.Completions.create", side_effect=error):
    try:
        print(chain.invoke({"animal": "kangaroo"}))
    except RateLimitError:
        print("Hit error")

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
content=" I don&#x27;t actually know why the kangaroo crossed the road, but I can take a guess! Here are some possible reasons:\n\n- To get to the other side (the classic joke answer!)\n\n- It was trying to find some food or water \n\n- It was trying to find a mate during mating season\n\n- It was fleeing from a predator or perceived threat\n\n- It was disoriented and crossed accidentally \n\n- It was following a herd of other kangaroos who were crossing\n\n- It wanted a change of scenery or environment \n\n- It was trying to reach a new habitat or territory\n\nThe real reason is unknown without more context, but hopefully one of those potential explanations does the joke justice! Let me know if you have any other animal jokes I can try to decipher." additional_kwargs={} example=False

```**Fallback for Sequences[​](#fallback-for-sequences) We can also create fallbacks for sequences, that are sequences themselves. Here we do that with two different models: ChatOpenAI and then normal OpenAI (which does not use a chat model). Because OpenAI is NOT a chat model, you likely want a different prompt.

```python
# First let&#x27;s create a chain with a ChatModel
# We add in a string output parser here so the outputs between the two are the same type
from langchain_core.output_parsers import StrOutputParser

chat_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You&#x27;re a nice assistant who always includes a compliment in your response",
        ),
        ("human", "Why did the {animal} cross the road"),
    ]
)
# Here we&#x27;re going to use a bad model name to easily create a chain that will error
chat_model = ChatOpenAI(model="gpt-fake")
bad_chain = chat_prompt | chat_model | StrOutputParser()

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html)

```python
# Now lets create a chain with the normal OpenAI model
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI

prompt_template = """Instructions: You should always include a compliment in your response.

Question: Why did the {animal} cross the road?"""
prompt = PromptTemplate.from_template(prompt_template)
llm = OpenAI()
good_chain = prompt | llm

```**API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```python
# We can now create a final chain which combines the two
chain = bad_chain.with_fallbacks([good_chain])
chain.invoke({"animal": "turtle"})

```

```output
&#x27;\n\nAnswer: The turtle crossed the road to get to the other side, and I have to say he had some impressive determination.&#x27;

``` ## Fallback for Long Inputs[​](#fallback-for-long-inputs) One of the big limiting factors of LLMs is their context window. Usually, you can count and track the length of prompts before sending them to an LLM, but in situations where that is hard/complicated, you can fallback to a model with a longer context length.

```python
short_llm = ChatOpenAI()
long_llm = ChatOpenAI(model="gpt-3.5-turbo-16k")
llm = short_llm.with_fallbacks([long_llm])

```

```python
inputs = "What is the next number: " + ", ".join(["one", "two"] * 3000)

```

```python
try:
    print(short_llm.invoke(inputs))
except Exception as e:
    print(e)

```

```output
This model&#x27;s maximum context length is 4097 tokens. However, your messages resulted in 12012 tokens. Please reduce the length of the messages.

```

```python
try:
    print(llm.invoke(inputs))
except Exception as e:
    print(e)

```

```output
content=&#x27;The next number in the sequence is two.&#x27; additional_kwargs={} example=False

``` ## Fallback to Better Model[​](#fallback-to-better-model) Often times we ask models to output format in a specific format (like JSON). Models like GPT-3.5 can do this okay, but sometimes struggle. This naturally points to fallbacks - we can try with GPT-3.5 (faster, cheaper), but then if parsing fails we can use GPT-4.

```python
from langchain.output_parsers import DatetimeOutputParser

```

```python
prompt = ChatPromptTemplate.from_template(
    "what time was {event} (in %Y-%m-%dT%H:%M:%S.%fZ format - only return this value)"
)

```

```python
# In this case we are going to do the fallbacks on the LLM + output parser level
# Because the error will get raised in the OutputParser
openai_35 = ChatOpenAI() | DatetimeOutputParser()
openai_4 = ChatOpenAI(model="gpt-4") | DatetimeOutputParser()

```

```python
only_35 = prompt | openai_35
fallback_4 = prompt | openai_35.with_fallbacks([openai_4])

```

```python
try:
    print(only_35.invoke({"event": "the superbowl in 1994"}))
except Exception as e:
    print(f"Error: {e}")

```

```output
Error: Could not parse datetime string: The Super Bowl in 1994 took place on January 30th at 3:30 PM local time. Converting this to the specified format (%Y-%m-%dT%H:%M:%S.%fZ) results in: 1994-01-30T15:30:00.000Z

```

```python
try:
    print(fallback_4.invoke({"event": "the superbowl in 1994"}))
except Exception as e:
    print(f"Error: {e}")

```

```output
1994-01-30 15:30:00

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/fallbacks.ipynb)[Fallback for LLM API Errors](#fallback-for-llm-api-errors)
- [Fallback for Sequences](#fallback-for-sequences)
- [Fallback for Long Inputs](#fallback-for-long-inputs)
- [Fallback to Better Model](#fallback-to-better-model)

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