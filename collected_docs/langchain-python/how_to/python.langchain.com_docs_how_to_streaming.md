How to stream runnables | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/streaming.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/streaming.ipynb)How to stream runnables PrerequisitesThis guide assumes familiarity with the following concepts: [Chat models](/docs/concepts/chat_models/) [LangChain Expression Language](/docs/concepts/lcel/) [Output parsers](/docs/concepts/output_parsers/) Streaming is critical in making applications based on LLMs feel responsive to end-users. Important LangChain primitives like [chat models](/docs/concepts/chat_models/), [output parsers](/docs/concepts/output_parsers/), [prompts](/docs/concepts/prompt_templates/), [retrievers](/docs/concepts/retrievers/), and [agents](/docs/concepts/agents/) implement the LangChain [Runnable Interface](/docs/concepts/runnables/). This interface provides two general approaches to stream content: sync stream and async astream: a default implementation** of streaming that streams the **final output** from the chain.

- async astream_events and async astream_log: these provide a way to stream both **intermediate steps** and **final output** from the chain.

Let&#x27;s take a look at both approaches, and try to understand how to use them.

infoFor a higher-level overview of streaming techniques in LangChain, see [this section of the conceptual guide](/docs/concepts/streaming/).

## Using Stream[​](#using-stream)

All `Runnable` objects implement a sync method called `stream` and an async variant called `astream`.

These methods are designed to stream the final output in chunks, yielding each chunk as soon as it is available.

Streaming is only possible if all steps in the program know how to process an **input stream**; i.e., process an input chunk one at a time, and yield a corresponding output chunk.

The complexity of this processing can vary, from straightforward tasks like emitting tokens produced by an LLM, to more challenging ones like streaming parts of JSON results before the entire JSON is complete.

The best place to start exploring streaming is with the single most important components in LLMs apps-- the LLMs themselves!

### LLMs and Chat Models[​](#llms-and-chat-models)

Large language models and their chat variants are the primary bottleneck in LLM based apps.

Large language models can take **several seconds** to generate a complete response to a query. This is far slower than the **~200-300 ms** threshold at which an application feels responsive to an end user.

The key strategy to make the application feel more responsive is to show intermediate progress; viz., to stream the output from the model **token by token**.

We will show examples of streaming using a chat model. Choose one from the options below:

Select [chat model](/docs/integrations/chat/):**Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

``` Let&#x27;s start with the sync stream API:

```python
chunks = []
for chunk in model.stream("what color is the sky?"):
    chunks.append(chunk)
    print(chunk.content, end="|", flush=True)

```

```output
|The sky typically| appears blue during the day due to a phenomenon| called Rayleigh scattering, where| air molecules scatter sunlight, with| blue light being scattered more than other colors. However|, the sky&#x27;s color can vary|:

- At sunrise/sunset:| Red, orange, pink, or purple
-| During storms: Gray or dark blue|
- At night: Dark| blue to black
- In certain| atmospheric conditions: White, yellow, or green| (rare)

The color we perceive depends| on weather conditions, time of day, pollution| levels, and our viewing angle.||

``` Alternatively, if you&#x27;re working in an async environment, you may consider using the async astream API:

```python
chunks = []
async for chunk in model.astream("what color is the sky?"):
    chunks.append(chunk)
    print(chunk.content, end="|", flush=True)

```

```output
|The sky typically| appears blue during the day due to a phenomenon called Rayleigh| scattering, where air molecules scatter sunlight,| with blue light being scattered more than other colors. However|, the sky&#x27;s color can vary - appearing re|d, orange, or pink during sunrise and sunset,| gray on cloudy days, and black at night.| The color you see depends on the time of| day, weather conditions, and your location.||

``` Let&#x27;s inspect one of the chunks

```python
chunks[0]

```

```output
AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={}, response_metadata={&#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--c4f01565-8bb4-4f07-9b23-acfe46cbeca3&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 13, &#x27;output_tokens&#x27;: 0, &#x27;total_tokens&#x27;: 13, &#x27;input_token_details&#x27;: {&#x27;cache_creation&#x27;: 0, &#x27;cache_read&#x27;: 0}})

``` We got back something called an AIMessageChunk. This chunk represents a part of an AIMessage. Message chunks are additive by design -- one can simply add them up to get the state of the response so far!

```python
chunks[0] + chunks[1] + chunks[2] + chunks[3] + chunks[4]

```

```output
AIMessageChunk(content=&#x27;The sky typically appears blue during the day due to a phenomenon called Rayleigh scattering, where air molecules scatter sunlight, with blue light being scattered more than other colors. However&#x27;, additional_kwargs={}, response_metadata={&#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--c4f01565-8bb4-4f07-9b23-acfe46cbeca3&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 13, &#x27;output_tokens&#x27;: 0, &#x27;total_tokens&#x27;: 13, &#x27;input_token_details&#x27;: {&#x27;cache_creation&#x27;: 0, &#x27;cache_read&#x27;: 0}})

``` Chains[​](#chains) Virtually all LLM applications involve more steps than just a call to a language model. Let&#x27;s build a simple chain using LangChain Expression Language (LCEL) that combines a prompt, model and a parser and verify that streaming works. We will use [StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) to parse the output from the model. This is a simple parser that extracts the content field from an AIMessageChunk, giving us the token returned by the model. tipLCEL is a declarative way to specify a "program" by chainining together different LangChain primitives. Chains created using LCEL benefit from an automatic implementation of stream and astream allowing streaming of the final output. In fact, chains created with LCEL implement the entire standard Runnable interface.

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("tell me a joke about {topic}")
parser = StrOutputParser()
chain = prompt | model | parser

async for chunk in chain.astream({"topic": "parrot"}):
    print(chunk, end="|", flush=True)

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html)

```output
|Why| don&#x27;t parrots use the internet?

They|&#x27;re afraid of getting a virus from all the tweets|!||

```**Note that we&#x27;re getting streaming output even though we&#x27;re using parser at the end of the chain above. The parser operates on each streaming chunk individidually. Many of the [LCEL primitives](/docs/how_to/#langchain-expression-language-lcel) also support this kind of transform-style passthrough streaming, which can be very convenient when constructing apps. Custom functions can be [designed to return generators](/docs/how_to/functions/#streaming), which are able to operate on streams. Certain runnables, like [prompt templates](/docs/how_to/#prompt-templates) and [chat models](/docs/how_to/#chat-models), cannot process individual chunks and instead aggregate all previous steps. Such runnables can interrupt the streaming process. noteThe LangChain Expression language allows you to separate the construction of a chain from the mode in which it is used (e.g., sync/async, batch/streaming etc.). If this is not relevant to what you&#x27;re building, you can also rely on a standard imperative** programming approach by
caling `invoke`, `batch` or `stream` on each component individually, assigning the results to variables and then using them downstream as you see fit.

### Working with Input Streams[​](#working-with-input-streams)

What if you wanted to stream JSON from the output as it was being generated?

If you were to rely on `json.loads` to parse the partial json, the parsing would fail as the partial json wouldn&#x27;t be valid json.

You&#x27;d likely be at a complete loss of what to do and claim that it wasn&#x27;t possible to stream JSON.

Well, turns out there is a way to do it -- the parser needs to operate on the **input stream**, and attempt to "auto-complete" the partial json into a valid state.

Let&#x27;s see such a parser in action to understand what this means.

```python
from langchain_core.output_parsers import JsonOutputParser

chain = (
    model | JsonOutputParser()
)  # Due to a bug in older versions of Langchain, JsonOutputParser did not stream results from some models
async for text in chain.astream(
    "output a list of the countries france, spain and japan and their populations in JSON format. "
    &#x27;Use a dict with an outer key of "countries" which contains a list of countries. &#x27;
    "Each country should have the key `name` and `population`"
):
    print(text, flush=True)

```**API Reference:**[JsonOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.json.JsonOutputParser.html)

```output
{&#x27;countries&#x27;: []}
{&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;}]}
{&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750}]}
{&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {}]}
{&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;}]}
{&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {}]}
{&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;}]}
{&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;, &#x27;population&#x27;: 125700000}]}

```**Now, let&#x27;s break** streaming. We&#x27;ll use the previous example and append an extraction function at the end that extracts the country names from the finalized JSON.

warningAny steps in the chain that operate on **finalized inputs** rather than on **input streams** can break streaming functionality via `stream` or `astream`.

tipLater, we will discuss the `astream_events` API which streams results from intermediate steps. This API will stream results from intermediate steps even if the chain contains steps that only operate on **finalized inputs**.

```python
from langchain_core.output_parsers import (
    JsonOutputParser,
)

# A function that operates on finalized inputs
# rather than on an input_stream
def _extract_country_names(inputs):
    """A function that does not operates on input streams and breaks streaming."""
    if not isinstance(inputs, dict):
        return ""

    if "countries" not in inputs:
        return ""

    countries = inputs["countries"]

    if not isinstance(countries, list):
        return ""

    country_names = [
        country.get("name") for country in countries if isinstance(country, dict)
    ]
    return country_names

chain = model | JsonOutputParser() | _extract_country_names

async for text in chain.astream(
    "output a list of the countries france, spain and japan and their populations in JSON format. "
    &#x27;Use a dict with an outer key of "countries" which contains a list of countries. &#x27;
    "Each country should have the key `name` and `population`"
):
    print(text, end="|", flush=True)

```**API Reference:**[JsonOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.json.JsonOutputParser.html)

```output
[&#x27;France&#x27;, &#x27;Spain&#x27;, &#x27;Japan&#x27;]|

```**Generator Functions[​](#generator-functions) Let&#x27;s fix the streaming using a generator function that can operate on the input stream**.

tipA generator function (a function that uses `yield`) allows writing code that operates on **input streams**

```python
from langchain_core.output_parsers import JsonOutputParser

async def _extract_country_names_streaming(input_stream):
    """A function that operates on input streams."""
    country_names_so_far = set()

    async for input in input_stream:
        if not isinstance(input, dict):
            continue

        if "countries" not in input:
            continue

        countries = input["countries"]

        if not isinstance(countries, list):
            continue

        for country in countries:
            name = country.get("name")
            if not name:
                continue
            if name not in country_names_so_far:
                yield name
                country_names_so_far.add(name)

chain = model | JsonOutputParser() | _extract_country_names_streaming

async for text in chain.astream(
    "output a list of the countries france, spain and japan and their populations in JSON format. "
    &#x27;Use a dict with an outer key of "countries" which contains a list of countries. &#x27;
    "Each country should have the key `name` and `population`",
):
    print(text, end="|", flush=True)

```**API Reference:**[JsonOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.json.JsonOutputParser.html)

```output
France|Spain|Japan|

```**noteBecause the code above is relying on JSON auto-completion, you may see partial names of countries (e.g., Sp and Spain), which is not what one would want for an extraction result!We&#x27;re focusing on streaming concepts, not necessarily the results of the chains. Non-streaming components[​](#non-streaming-components) Some built-in components like Retrievers do not offer any streaming. What happens if we try to stream them? 🤨

```python
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import OpenAIEmbeddings

template = """Answer the question based only on the following context:
{context}

Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

vectorstore = FAISS.from_texts(
    ["harrison worked at kensho", "harrison likes spicy food"],
    embedding=OpenAIEmbeddings(),
)
retriever = vectorstore.as_retriever()

chunks = [chunk for chunk in retriever.stream("where did harrison work?")]
chunks

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
[[Document(id=&#x27;2740a247-9738-48c4-8c8f-d879d4ed39f7&#x27;, metadata={}, page_content=&#x27;harrison worked at kensho&#x27;),
  Document(id=&#x27;1d3d012f-1cb0-4bee-928a-c8bf0f8b1b92&#x27;, metadata={}, page_content=&#x27;harrison likes spicy food&#x27;)]]

```**Stream just yielded the final result from that component. This is OK 🥹! Not all components have to implement streaming -- in some cases streaming is either unnecessary, difficult or just doesn&#x27;t make sense. tipAn LCEL chain constructed using non-streaming components, will still be able to stream in a lot of cases, with streaming of partial output starting after the last non-streaming step in the chain.

```python
retrieval_chain = (
    {
        "context": retriever.with_config(run_name="Docs"),
        "question": RunnablePassthrough(),
    }
    | prompt
    | model
    | StrOutputParser()
)

```

```python
for chunk in retrieval_chain.stream(
    "Where did harrison work? Write 3 made up sentences about this place."
):
    print(chunk, end="|", flush=True)

```

```output
|Base|d on the provided context, Harrison worked at Kens|ho.

Three made up sentences about Kens|ho:

1. Kensho is a| cutting-edge technology company that specializes in| AI and data analytics for financial institutions.

2|. The Kensho office features| an open floor plan with panoramic views of the city| skyline, creating an inspiring environment for its| employees.

3. At Kensho,| team members often collaborate in innovative brainstorming sessions while| enjoying complimentary gourmet coffee from| their in-house café.||

``` Now that we&#x27;ve seen how stream and astream work, let&#x27;s venture into the world of streaming events. 🏞️ Using Stream Events[​](#using-stream-events) Event Streaming is a beta** API. This API may change a bit based on feedback.

noteThis guide demonstrates the `V2` API and requires langchain-core >= 0.2. For the `V1` API compatible with older versions of LangChain, see [here](https://python.langchain.com/v0.1/docs/expression_language/streaming/#using-stream-events).

```python
import langchain_core

langchain_core.__version__

```**For the astream_events API to work properly: Use async throughout the code to the extent possible (e.g., async tools etc) Propagate callbacks if defining custom functions / runnables Whenever using runnables without LCEL, make sure to call .astream() on LLMs rather than .ainvoke to force the LLM to stream tokens. Let us know if anything doesn&#x27;t work as expected! :) Event Reference[​](#event-reference) Below is a reference table that shows some events that might be emitted by the various Runnable objects. noteWhen streaming is implemented properly, the inputs to a runnable will not be known until after the input stream has been entirely consumed. This means that inputs will often be included only for end events and rather than for start events. eventnamechunkinputoutputon_chat_model_start[model name]{"messages": [[SystemMessage, HumanMessage]]}on_chat_model_stream[model name]AIMessageChunk(content="hello")on_chat_model_end[model name]{"messages": [[SystemMessage, HumanMessage]]}AIMessageChunk(content="hello world")on_llm_start[model name]{&#x27;input&#x27;: &#x27;hello&#x27;}on_llm_stream[model name]&#x27;Hello&#x27;on_llm_end[model name]&#x27;Hello human!&#x27;on_chain_startformat_docson_chain_streamformat_docs"hello world!, goodbye world!"on_chain_endformat_docs[Document(...)]"hello world!, goodbye world!"on_tool_startsome_tool{"x": 1, "y": "2"}on_tool_endsome_tool{"x": 1, "y": "2"}on_retriever_start[retriever name]{"query": "hello"}on_retriever_end[retriever name]{"query": "hello"}[Document(...), ..]on_prompt_start[template_name]{"question": "hello"}on_prompt_end[template_name]{"question": "hello"}ChatPromptValue(messages: [SystemMessage, ...]) Chat Model[​](#chat-model) Let&#x27;s start off by looking at the events produced by a chat model.

```python
events = []
async for event in model.astream_events("hello"):
    events.append(event)

``` noteFor langchain-core

The three start events correspond to:

- The chain (model + parser)

- The model

- The parser

```python
events[:3]

```**

```output
[{&#x27;event&#x27;: &#x27;on_chain_start&#x27;,
  &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key `name` and `population`&#x27;},
  &#x27;name&#x27;: &#x27;RunnableSequence&#x27;,
  &#x27;tags&#x27;: [],
  &#x27;run_id&#x27;: &#x27;f859e56f-a760-4670-a24e-040e11bcd7fc&#x27;,
  &#x27;metadata&#x27;: {},
  &#x27;parent_ids&#x27;: []},
 {&#x27;event&#x27;: &#x27;on_chat_model_start&#x27;,
  &#x27;data&#x27;: {&#x27;input&#x27;: {&#x27;messages&#x27;: [[HumanMessage(content=&#x27;output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key `name` and `population`&#x27;, additional_kwargs={}, response_metadata={})]]}},
  &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;,
  &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;],
  &#x27;run_id&#x27;: &#x27;2aa8c9e6-a5cd-4e94-b994-cb0e9bd8ab21&#x27;,
  &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;,
   &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;,
   &#x27;ls_model_type&#x27;: &#x27;chat&#x27;,
   &#x27;ls_temperature&#x27;: 0.0,
   &#x27;ls_max_tokens&#x27;: 1024},
  &#x27;parent_ids&#x27;: [&#x27;f859e56f-a760-4670-a24e-040e11bcd7fc&#x27;]},
 {&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;,
  &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={}, response_metadata={&#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--2aa8c9e6-a5cd-4e94-b994-cb0e9bd8ab21&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 56, &#x27;output_tokens&#x27;: 0, &#x27;total_tokens&#x27;: 56, &#x27;input_token_details&#x27;: {&#x27;cache_creation&#x27;: 0, &#x27;cache_read&#x27;: 0}})},
  &#x27;run_id&#x27;: &#x27;2aa8c9e6-a5cd-4e94-b994-cb0e9bd8ab21&#x27;,
  &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;,
  &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;],
  &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;,
   &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;,
   &#x27;ls_model_type&#x27;: &#x27;chat&#x27;,
   &#x27;ls_temperature&#x27;: 0.0,
   &#x27;ls_max_tokens&#x27;: 1024},
  &#x27;parent_ids&#x27;: [&#x27;f859e56f-a760-4670-a24e-040e11bcd7fc&#x27;]}]

``` What do you think you&#x27;d see if you looked at the last 3 events? what about the middle? Let&#x27;s use this API to take output the stream events from the model and the parser. We&#x27;re ignoring start events, end events and events from the chain.

```python
num_events = 0

async for event in chain.astream_events(
    "output a list of the countries france, spain and japan and their populations in JSON format. "
    &#x27;Use a dict with an outer key of "countries" which contains a list of countries. &#x27;
    "Each country should have the key `name` and `population`",
):
    kind = event["event"]
    if kind == "on_chat_model_stream":
        print(
            f"Chat model chunk: {repr(event[&#x27;data&#x27;][&#x27;chunk&#x27;].content)}",
            flush=True,
        )
    if kind == "on_parser_stream":
        print(f"Parser chunk: {event[&#x27;data&#x27;][&#x27;chunk&#x27;]}", flush=True)
    num_events += 1
    if num_events > 30:
        # Truncate the output
        print("...")
        break

```

```output
Chat model chunk: &#x27;&#x27;
Chat model chunk: &#x27;\`\`\`&#x27;
Chat model chunk: &#x27;json\n{\n  "countries": [&#x27;
Parser chunk: {&#x27;countries&#x27;: []}
Chat model chunk: &#x27;\n    {\n      "name": "France",&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;}]}
Chat model chunk: &#x27;\n      "population": 67750000\n    },&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}]}
Chat model chunk: &#x27;\n    {\n      "name": "Spain",&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;}]}
Chat model chunk: &#x27;\n      "population": 47350&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350}]}
Chat model chunk: &#x27;000\n    },\n    {\n      "&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {}]}
Chat model chunk: &#x27;name": "Japan",\n      "population":&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;}]}
Chat model chunk: &#x27; 125700000\n    }&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;, &#x27;population&#x27;: 125700000}]}
Chat model chunk: &#x27;\n  ]\n}\n\`\`\`&#x27;
Chat model chunk: &#x27;&#x27;
...

``` Because both the model and the parser support streaming, we see streaming events from both components in real time! Kind of cool isn&#x27;t it? 🦜 Filtering Events[​](#filtering-events) Because this API produces so many events, it is useful to be able to filter on events. You can filter by either component name, component tags or component type. By Name[​](#by-name)

```python
chain = model.with_config({"run_name": "model"}) | JsonOutputParser().with_config(
    {"run_name": "my_parser"}
)

max_events = 0
async for event in chain.astream_events(
    "output a list of the countries france, spain and japan and their populations in JSON format. "
    &#x27;Use a dict with an outer key of "countries" which contains a list of countries. &#x27;
    "Each country should have the key `name` and `population`",
    include_names=["my_parser"],
):
    print(event)
    max_events += 1
    if max_events > 10:
        # Truncate output
        print("...")
        break

```

```output
{&#x27;event&#x27;: &#x27;on_parser_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key `name` and `population`&#x27;}, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: []}}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;}]}}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750}]}}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {}]}}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;}]}}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}]}}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;}]}}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;, &#x27;population&#x27;: 125700000}]}}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;, &#x27;population&#x27;: 125700000}]}}, &#x27;run_id&#x27;: &#x27;781af9b6-31f8-47f2-ab79-52d17b000857&#x27;, &#x27;name&#x27;: &#x27;my_parser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;], &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: [&#x27;82c918c6-d5f6-4d2d-b710-4668509fe2f0&#x27;]}

``` By Type[​](#by-type)

```python
chain = model.with_config({"run_name": "model"}) | JsonOutputParser().with_config(
    {"run_name": "my_parser"}
)

max_events = 0
async for event in chain.astream_events(
    &#x27;output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key `name` and `population`&#x27;,
    include_types=["chat_model"],
):
    print(event)
    max_events += 1
    if max_events > 10:
        # Truncate output
        print("...")
        break

```

```output
{&#x27;event&#x27;: &#x27;on_chat_model_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key `name` and `population`&#x27;}, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={}, response_metadata={&#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 56, &#x27;output_tokens&#x27;: 0, &#x27;total_tokens&#x27;: 56, &#x27;input_token_details&#x27;: {&#x27;cache_creation&#x27;: 0, &#x27;cache_read&#x27;: 0}})}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;\`\`\`&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;)}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;json\n{\n  "countries": [&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;)}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;\n    {\n      "name": "France",&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;)}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;\n      "population": 67750&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;)}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;000\n    },\n    {\n      "&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;)}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;name": "Spain",\n      "population":&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;)}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27; 47350000\n    },&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;)}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;\n    {\n      "name": "Japan",&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;)}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;\n      "population": 125700&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;)}, &#x27;run_id&#x27;: &#x27;b7a08416-a629-4b42-b5d5-dbe48566e5d5&#x27;, &#x27;name&#x27;: &#x27;model&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;116a6506-5a19-4f60-a8c2-7b728d4b8248&#x27;]}
...

``` By Tags[​](#by-tags) cautionTags are inherited by child components of a given runnable.If you&#x27;re using tags to filter, make sure that this is what you want.

```python
chain = (model | JsonOutputParser()).with_config({"tags": ["my_chain"]})

max_events = 0
async for event in chain.astream_events(
    &#x27;output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key `name` and `population`&#x27;,
    include_tags=["my_chain"],
):
    print(event)
    max_events += 1
    if max_events > 10:
        # Truncate output
        print("...")
        break

```

```output
{&#x27;event&#x27;: &#x27;on_chain_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key `name` and `population`&#x27;}, &#x27;name&#x27;: &#x27;RunnableSequence&#x27;, &#x27;tags&#x27;: [&#x27;my_chain&#x27;], &#x27;run_id&#x27;: &#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: {&#x27;messages&#x27;: [[HumanMessage(content=&#x27;output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key `name` and `population`&#x27;, additional_kwargs={}, response_metadata={})]]}}, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;, &#x27;my_chain&#x27;], &#x27;run_id&#x27;: &#x27;778846c9-acd3-43b7-b9c0-ac718761b2bc&#x27;, &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;&#x27;, additional_kwargs={}, response_metadata={&#x27;model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;}, id=&#x27;run--778846c9-acd3-43b7-b9c0-ac718761b2bc&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 56, &#x27;output_tokens&#x27;: 0, &#x27;total_tokens&#x27;: 56, &#x27;input_token_details&#x27;: {&#x27;cache_creation&#x27;: 0, &#x27;cache_read&#x27;: 0}})}, &#x27;run_id&#x27;: &#x27;778846c9-acd3-43b7-b9c0-ac718761b2bc&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;, &#x27;my_chain&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_start&#x27;, &#x27;data&#x27;: {}, &#x27;name&#x27;: &#x27;JsonOutputParser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;, &#x27;my_chain&#x27;], &#x27;run_id&#x27;: &#x27;2c46d24f-231c-4062-a7ab-b7954840986d&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: [&#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;\`\`\`&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--778846c9-acd3-43b7-b9c0-ac718761b2bc&#x27;)}, &#x27;run_id&#x27;: &#x27;778846c9-acd3-43b7-b9c0-ac718761b2bc&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;, &#x27;my_chain&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;]}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;json\n{\n  "countries": [&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--778846c9-acd3-43b7-b9c0-ac718761b2bc&#x27;)}, &#x27;run_id&#x27;: &#x27;778846c9-acd3-43b7-b9c0-ac718761b2bc&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;, &#x27;my_chain&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;2c46d24f-231c-4062-a7ab-b7954840986d&#x27;, &#x27;name&#x27;: &#x27;JsonOutputParser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;, &#x27;my_chain&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: []}}, &#x27;parent_ids&#x27;: [&#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;]}
{&#x27;event&#x27;: &#x27;on_chain_stream&#x27;, &#x27;run_id&#x27;: &#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;, &#x27;name&#x27;: &#x27;RunnableSequence&#x27;, &#x27;tags&#x27;: [&#x27;my_chain&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: []}}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chat_model_stream&#x27;, &#x27;data&#x27;: {&#x27;chunk&#x27;: AIMessageChunk(content=&#x27;\n    {\n      "name": "France",&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;run--778846c9-acd3-43b7-b9c0-ac718761b2bc&#x27;)}, &#x27;run_id&#x27;: &#x27;778846c9-acd3-43b7-b9c0-ac718761b2bc&#x27;, &#x27;name&#x27;: &#x27;ChatAnthropic&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:1&#x27;, &#x27;my_chain&#x27;], &#x27;metadata&#x27;: {&#x27;ls_provider&#x27;: &#x27;anthropic&#x27;, &#x27;ls_model_name&#x27;: &#x27;claude-3-7-sonnet-20250219&#x27;, &#x27;ls_model_type&#x27;: &#x27;chat&#x27;, &#x27;ls_temperature&#x27;: 0.0, &#x27;ls_max_tokens&#x27;: 1024}, &#x27;parent_ids&#x27;: [&#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;]}
{&#x27;event&#x27;: &#x27;on_parser_stream&#x27;, &#x27;run_id&#x27;: &#x27;2c46d24f-231c-4062-a7ab-b7954840986d&#x27;, &#x27;name&#x27;: &#x27;JsonOutputParser&#x27;, &#x27;tags&#x27;: [&#x27;seq:step:2&#x27;, &#x27;my_chain&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;}]}}, &#x27;parent_ids&#x27;: [&#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;]}
{&#x27;event&#x27;: &#x27;on_chain_stream&#x27;, &#x27;run_id&#x27;: &#x27;3e4f8c37-a44a-46b7-a7e5-75182d1cca31&#x27;, &#x27;name&#x27;: &#x27;RunnableSequence&#x27;, &#x27;tags&#x27;: [&#x27;my_chain&#x27;], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;}]}}, &#x27;parent_ids&#x27;: []}
...

``` Non-streaming components[​](#non-streaming-components-1) Remember how some components don&#x27;t stream well because they don&#x27;t operate on input streams**?

While such components can break streaming of the final output when using `astream`, `astream_events` will still yield streaming events from intermediate steps that support streaming!

```python
# Function that does not support streaming.
# It operates on the finalizes inputs rather than
# operating on the input stream.
def _extract_country_names(inputs):
    """A function that does not operates on input streams and breaks streaming."""
    if not isinstance(inputs, dict):
        return ""

    if "countries" not in inputs:
        return ""

    countries = inputs["countries"]

    if not isinstance(countries, list):
        return ""

    country_names = [
        country.get("name") for country in countries if isinstance(country, dict)
    ]
    return country_names

chain = (
    model | JsonOutputParser() | _extract_country_names
)  # This parser only works with OpenAI right now

```**As expected, the astream API doesn&#x27;t work correctly because _extract_country_names doesn&#x27;t operate on streams.

```python
async for chunk in chain.astream(
    "output a list of the countries france, spain and japan and their populations in JSON format. "
    &#x27;Use a dict with an outer key of "countries" which contains a list of countries. &#x27;
    "Each country should have the key `name` and `population`",
):
    print(chunk, flush=True)

```

```output
[&#x27;France&#x27;, &#x27;Spain&#x27;, &#x27;Japan&#x27;]

``` Now, let&#x27;s confirm that with astream_events we&#x27;re still seeing streaming output from the model and the parser.

```python
num_events = 0

async for event in chain.astream_events(
    "output a list of the countries france, spain and japan and their populations in JSON format. "
    &#x27;Use a dict with an outer key of "countries" which contains a list of countries. &#x27;
    "Each country should have the key `name` and `population`",
):
    kind = event["event"]
    if kind == "on_chat_model_stream":
        print(
            f"Chat model chunk: {repr(event[&#x27;data&#x27;][&#x27;chunk&#x27;].content)}",
            flush=True,
        )
    if kind == "on_parser_stream":
        print(f"Parser chunk: {event[&#x27;data&#x27;][&#x27;chunk&#x27;]}", flush=True)
    num_events += 1
    if num_events > 30:
        # Truncate the output
        print("...")
        break

```

```output
Chat model chunk: &#x27;&#x27;
Chat model chunk: &#x27;\`\`\`&#x27;
Chat model chunk: &#x27;json\n{\n  "countries": [&#x27;
Parser chunk: {&#x27;countries&#x27;: []}
Chat model chunk: &#x27;\n    {\n      "name": "France",&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;}]}
Chat model chunk: &#x27;\n      "population": 67750&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750}]}
Chat model chunk: &#x27;000\n    },\n    {\n      "&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {}]}
Chat model chunk: &#x27;name": "Spain",\n      "population":&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;}]}
Chat model chunk: &#x27; 47350000\n    },&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}]}
Chat model chunk: &#x27;\n    {\n      "name": "Japan",&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;}]}
Chat model chunk: &#x27;\n      "population": 125700&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;, &#x27;population&#x27;: 125700}]}
Chat model chunk: &#x27;000\n    }\n  ]\n}&#x27;
Parser chunk: {&#x27;countries&#x27;: [{&#x27;name&#x27;: &#x27;France&#x27;, &#x27;population&#x27;: 67750000}, {&#x27;name&#x27;: &#x27;Spain&#x27;, &#x27;population&#x27;: 47350000}, {&#x27;name&#x27;: &#x27;Japan&#x27;, &#x27;population&#x27;: 125700000}]}
Chat model chunk: &#x27;\n\`\`\`&#x27;
Chat model chunk: &#x27;&#x27;
...

``` Propagating Callbacks[​](#propagating-callbacks) cautionIf you&#x27;re using invoking runnables inside your tools, you need to propagate callbacks to the runnable; otherwise, no stream events will be generated. noteWhen using RunnableLambdas or @chain decorator, callbacks are propagated automatically behind the scenes.

```python
from langchain_core.runnables import RunnableLambda
from langchain_core.tools import tool

def reverse_word(word: str):
    return word[::-1]

reverse_word = RunnableLambda(reverse_word)

@tool
def bad_tool(word: str):
    """Custom tool that doesn&#x27;t propagate callbacks."""
    return reverse_word.invoke(word)

async for event in bad_tool.astream_events("hello"):
    print(event)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
{&#x27;event&#x27;: &#x27;on_tool_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;hello&#x27;}, &#x27;name&#x27;: &#x27;bad_tool&#x27;, &#x27;tags&#x27;: [], &#x27;run_id&#x27;: &#x27;b1c6b79d-f94b-432f-a289-1ea68a7c3cea&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;hello&#x27;}, &#x27;name&#x27;: &#x27;reverse_word&#x27;, &#x27;tags&#x27;: [], &#x27;run_id&#x27;: &#x27;e661c1ec-e6d2-4f9a-9620-b50645f2b194&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: [&#x27;b1c6b79d-f94b-432f-a289-1ea68a7c3cea&#x27;]}
{&#x27;event&#x27;: &#x27;on_chain_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: &#x27;olleh&#x27;, &#x27;input&#x27;: &#x27;hello&#x27;}, &#x27;run_id&#x27;: &#x27;e661c1ec-e6d2-4f9a-9620-b50645f2b194&#x27;, &#x27;name&#x27;: &#x27;reverse_word&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: [&#x27;b1c6b79d-f94b-432f-a289-1ea68a7c3cea&#x27;]}
{&#x27;event&#x27;: &#x27;on_tool_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: &#x27;olleh&#x27;}, &#x27;run_id&#x27;: &#x27;b1c6b79d-f94b-432f-a289-1ea68a7c3cea&#x27;, &#x27;name&#x27;: &#x27;bad_tool&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}

```**Here&#x27;s a re-implementation that does propagate callbacks correctly. You&#x27;ll notice that now we&#x27;re getting events from the reverse_word runnable as well.

```python
@tool
def correct_tool(word: str, callbacks):
    """A tool that correctly propagates callbacks."""
    return reverse_word.invoke(word, {"callbacks": callbacks})

async for event in correct_tool.astream_events("hello"):
    print(event)

```

```output
{&#x27;event&#x27;: &#x27;on_tool_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;hello&#x27;}, &#x27;name&#x27;: &#x27;correct_tool&#x27;, &#x27;tags&#x27;: [], &#x27;run_id&#x27;: &#x27;399c91f5-a40b-4173-943f-a9c583a04003&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;hello&#x27;}, &#x27;name&#x27;: &#x27;reverse_word&#x27;, &#x27;tags&#x27;: [], &#x27;run_id&#x27;: &#x27;e9cc7db1-4587-40af-9c35-2d787b3f0956&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: [&#x27;399c91f5-a40b-4173-943f-a9c583a04003&#x27;]}
{&#x27;event&#x27;: &#x27;on_chain_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: &#x27;olleh&#x27;, &#x27;input&#x27;: &#x27;hello&#x27;}, &#x27;run_id&#x27;: &#x27;e9cc7db1-4587-40af-9c35-2d787b3f0956&#x27;, &#x27;name&#x27;: &#x27;reverse_word&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: [&#x27;399c91f5-a40b-4173-943f-a9c583a04003&#x27;]}
{&#x27;event&#x27;: &#x27;on_tool_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: &#x27;olleh&#x27;}, &#x27;run_id&#x27;: &#x27;399c91f5-a40b-4173-943f-a9c583a04003&#x27;, &#x27;name&#x27;: &#x27;correct_tool&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}

``` If you&#x27;re invoking runnables from within Runnable Lambdas or @chains, then callbacks will be passed automatically on your behalf.

```python
from langchain_core.runnables import RunnableLambda

async def reverse_and_double(word: str):
    return await reverse_word.ainvoke(word) * 2

reverse_and_double = RunnableLambda(reverse_and_double)

await reverse_and_double.ainvoke("1234")

async for event in reverse_and_double.astream_events("1234"):
    print(event)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
{&#x27;event&#x27;: &#x27;on_chain_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;1234&#x27;}, &#x27;name&#x27;: &#x27;reverse_and_double&#x27;, &#x27;tags&#x27;: [], &#x27;run_id&#x27;: &#x27;04726e2e-f508-4f90-9d4f-f88e588f0b39&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_stream&#x27;, &#x27;run_id&#x27;: &#x27;04726e2e-f508-4f90-9d4f-f88e588f0b39&#x27;, &#x27;name&#x27;: &#x27;reverse_and_double&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: &#x27;43214321&#x27;}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: &#x27;43214321&#x27;}, &#x27;run_id&#x27;: &#x27;04726e2e-f508-4f90-9d4f-f88e588f0b39&#x27;, &#x27;name&#x27;: &#x27;reverse_and_double&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}

```**And with the @chain decorator:

```python
from langchain_core.runnables import chain

@chain
async def reverse_and_double(word: str):
    return await reverse_word.ainvoke(word) * 2

await reverse_and_double.ainvoke("1234")

async for event in reverse_and_double.astream_events("1234"):
    print(event)

```API Reference:**[chain](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.chain.html)

```output
{&#x27;event&#x27;: &#x27;on_chain_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;1234&#x27;}, &#x27;name&#x27;: &#x27;reverse_and_double&#x27;, &#x27;tags&#x27;: [], &#x27;run_id&#x27;: &#x27;25f72976-aa79-408d-bb42-6d0f038cde52&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_stream&#x27;, &#x27;run_id&#x27;: &#x27;25f72976-aa79-408d-bb42-6d0f038cde52&#x27;, &#x27;name&#x27;: &#x27;reverse_and_double&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: &#x27;43214321&#x27;}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: &#x27;43214321&#x27;}, &#x27;run_id&#x27;: &#x27;25f72976-aa79-408d-bb42-6d0f038cde52&#x27;, &#x27;name&#x27;: &#x27;reverse_and_double&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}

```

## Next steps[​](#next-steps) Now you&#x27;ve learned some ways to stream both final outputs and internal steps with LangChain.

To learn more, check out the other how-to guides in this section, or the [conceptual guide on Langchain Expression Language](/docs/concepts/lcel/).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/streaming.ipynb)

- [Using Stream](#using-stream)[LLMs and Chat Models](#llms-and-chat-models)
- [Chains](#chains)
- [Working with Input Streams](#working-with-input-streams)
- [Non-streaming components](#non-streaming-components)

- [Using Stream Events](#using-stream-events)[Event Reference](#event-reference)
- [Chat Model](#chat-model)
- [Chain](#chain)
- [Filtering Events](#filtering-events)
- [Non-streaming components](#non-streaming-components-1)
- [Propagating Callbacks](#propagating-callbacks)

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