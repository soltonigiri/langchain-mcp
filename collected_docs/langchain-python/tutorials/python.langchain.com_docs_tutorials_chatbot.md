Build a Chatbot | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/tutorials/chatbot.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/tutorials/chatbot.ipynb)Build a Chatbot noteThis tutorial previously used the [RunnableWithMessageHistory](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.history.RunnableWithMessageHistory.html) abstraction. You can access that version of the documentation in the [v0.2 docs](https://python.langchain.com/v0.2/docs/tutorials/chatbot/).As of the v0.3 release of LangChain, we recommend that LangChain users take advantage of [LangGraph persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/) to incorporate memory into new LangChain applications.If your code is already relying on RunnableWithMessageHistory or BaseChatMessageHistory, you do not** need to make any changes. We do not plan on deprecating this functionality in the near future as it works for simple chat applications and any code that uses RunnableWithMessageHistory will continue to work as expected.Please see [How to migrate to LangGraph Memory](/docs/versions/migrating_memory/) for more details. ## Overview[​](#overview) We&#x27;ll go over an example of how to design and implement an LLM-powered chatbot. This chatbot will be able to have a conversation and remember previous interactions with a [chat model](/docs/concepts/chat_models/). Note that this chatbot that we build will only use the language model to have a conversation. There are several other related concepts that you may be looking for: [Conversational RAG](/docs/tutorials/qa_chat_history/): Enable a chatbot experience over an external source of data

- [Agents](/docs/tutorials/agents/): Build a chatbot that can take actions

This tutorial will cover the basics which will be helpful for those two more advanced topics, but feel free to skip directly to there should you choose.

## Setup[​](#setup)

### Jupyter Notebook[​](#jupyter-notebook)

This guide (and most of the other guides in the documentation) uses [Jupyter notebooks](https://jupyter.org/) and assumes the reader is as well. Jupyter notebooks are perfect for learning how to work with LLM systems because oftentimes things can go wrong (unexpected output, API down, etc) and going through guides in an interactive environment is a great way to better understand them.

This and other tutorials are perhaps most conveniently run in a Jupyter notebook. See [here](https://jupyter.org/install) for instructions on how to install.

### Installation[​](#installation)

For this tutorial we will need `langchain-core` and `langgraph`. This guide requires `langgraph >= 0.2.28`.

- Pip
- Conda

```bash
pip install langchain-core langgraph>0.2.27

```**

```bash
conda install langchain-core langgraph>0.2.27 -c conda-forge

``` For more details, see our [Installation guide](/docs/how_to/installation/). LangSmith[​](#langsmith) Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com). After you sign up at the link above, (you&#x27;ll need to create an API key from the Settings -> API Keys page on the LangSmith website)**, make sure to set your environment variables to start logging traces:

```shell
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."

```**Or, if in a notebook, you can set them with:

```python
import getpass
import os

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` Quickstart[​](#quickstart) First up, let&#x27;s learn how to use a language model by itself. LangChain supports many different language models that you can use interchangeably - select the one you want to use below! Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

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

``` Let&#x27;s first use the model directly. ChatModels are instances of LangChain "Runnables", which means they expose a standard interface for interacting with them. To just simply call the model, we can pass in a list of messages to the .invoke method.

```python
from langchain_core.messages import HumanMessage

model.invoke([HumanMessage(content="Hi! I&#x27;m Bob")])

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```output
AIMessage(content=&#x27;Hi Bob! How can I assist you today?&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 10, &#x27;prompt_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 21, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_0705bf87c0&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-5211544f-da9f-4325-8b8e-b3d92b2fc71a-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 11, &#x27;output_tokens&#x27;: 10, &#x27;total_tokens&#x27;: 21, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})

```**The model on its own does not have any concept of state. For example, if you ask a followup question:

```python
model.invoke([HumanMessage(content="What&#x27;s my name?")])

```

```output
AIMessage(content="I&#x27;m sorry, but I don&#x27;t have access to personal information about users unless it has been shared with me in the course of our conversation. How can I assist you today?", additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 34, &#x27;prompt_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 45, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_0705bf87c0&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-a2d13a18-7022-4784-b54f-f85c097d1075-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 11, &#x27;output_tokens&#x27;: 34, &#x27;total_tokens&#x27;: 45, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})

``` Let&#x27;s take a look at the example [LangSmith trace](https://smith.langchain.com/public/5c21cb92-2814-4119-bae9-d02b8db577ac/r) We can see that it doesn&#x27;t take the previous conversation turn into context, and cannot answer the question. This makes for a terrible chatbot experience! To get around this, we need to pass the entire [conversation history](/docs/concepts/chat_history/) into the model. Let&#x27;s see what happens when we do that:

```python
from langchain_core.messages import AIMessage

model.invoke(
    [
        HumanMessage(content="Hi! I&#x27;m Bob"),
        AIMessage(content="Hello Bob! How can I assist you today?"),
        HumanMessage(content="What&#x27;s my name?"),
    ]
)

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html)

```output
AIMessage(content=&#x27;Your name is Bob! How can I help you today, Bob?&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 14, &#x27;prompt_tokens&#x27;: 33, &#x27;total_tokens&#x27;: 47, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_0705bf87c0&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-34bcccb3-446e-42f2-b1de-52c09936c02c-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 33, &#x27;output_tokens&#x27;: 14, &#x27;total_tokens&#x27;: 47, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})

```**And now we can see that we get a good response! This is the basic idea underpinning a chatbot&#x27;s ability to interact conversationally. So how do we best implement this? Message persistence[​](#message-persistence) [LangGraph](https://langchain-ai.github.io/langgraph/) implements a built-in persistence layer, making it ideal for chat applications that support multiple conversational turns. Wrapping our chat model in a minimal LangGraph application allows us to automatically persist the message history, simplifying the development of multi-turn applications. LangGraph comes with a simple in-memory checkpointer, which we use below. See its [documentation](https://langchain-ai.github.io/langgraph/concepts/persistence/) for more detail, including how to use different persistence backends (e.g., SQLite or Postgres).

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph

# Define a new graph
workflow = StateGraph(state_schema=MessagesState)

# Define the function that calls the model
def call_model(state: MessagesState):
    response = model.invoke(state["messages"])
    return {"messages": response}

# Define the (single) node in the graph
workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

# Add memory
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```API Reference:**[MemorySaver](https://langchain-ai.github.io/langgraph/reference/checkpoints/#langgraph.checkpoint.memory.MemorySaver) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph)

We now need to create a `config` that we pass into the runnable every time. This config contains information that is not part of the input directly, but is still useful. In this case, we want to include a `thread_id`. This should look like:

```python
config = {"configurable": {"thread_id": "abc123"}}

```**This enables us to support multiple conversation threads with a single application, a common requirement when your application has multiple users. We can then invoke the application:

```python
query = "Hi! I&#x27;m Bob."

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()  # output contains all messages in state

```

```output
==================================[1m Ai Message [0m==================================

Hi Bob! How can I assist you today?

```

```python
query = "What&#x27;s my name?"

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()

```

```output
==================================[1m Ai Message [0m==================================

Your name is Bob! How can I help you today, Bob?

``` Great! Our chatbot now remembers things about us. If we change the config to reference a different thread_id, we can see that it starts the conversation fresh.

```python
config = {"configurable": {"thread_id": "abc234"}}

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()

```

```output
==================================[1m Ai Message [0m==================================

I&#x27;m sorry, but I don&#x27;t have access to personal information about you unless you&#x27;ve shared it in this conversation. How can I assist you today?

``` However, we can always go back to the original conversation (since we are persisting it in a database)

```python
config = {"configurable": {"thread_id": "abc123"}}

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()

```

```output
==================================[1m Ai Message [0m==================================

Your name is Bob. What would you like to discuss today?

``` This is how we can support a chatbot having conversations with many users! tipFor async support, update the call_model node to be an async function and use .ainvoke when invoking the application:

```python
# Async function for node:
async def call_model(state: MessagesState):
    response = await model.ainvoke(state["messages"])
    return {"messages": response}

# Define graph as before:
workflow = StateGraph(state_schema=MessagesState)
workflow.add_edge(START, "model")
workflow.add_node("model", call_model)
app = workflow.compile(checkpointer=MemorySaver())

# Async invocation:
output = await app.ainvoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()

``` Right now, all we&#x27;ve done is add a simple persistence layer around the model. We can start to make the chatbot more complicated and personalized by adding in a prompt template. Prompt templates[​](#prompt-templates) [Prompt Templates](/docs/concepts/prompt_templates/) help to turn raw user information into a format that the LLM can work with. In this case, the raw user input is just a message, which we are passing to the LLM. Let&#x27;s now make that a bit more complicated. First, let&#x27;s add in a system message with some custom instructions (but still taking messages as input). Next, we&#x27;ll add in more input besides just the messages. To add in a system message, we will create a ChatPromptTemplate. We will utilize MessagesPlaceholder to pass all the messages in.

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You talk like a pirate. Answer all questions to the best of your ability.",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html)

We can now update our application to incorporate this template:

```python
workflow = StateGraph(state_schema=MessagesState)

def call_model(state: MessagesState):
    prompt = prompt_template.invoke(state)
    response = model.invoke(prompt)
    return {"messages": response}

workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```**We invoke the application in the same way:

```python
config = {"configurable": {"thread_id": "abc345"}}
query = "Hi! I&#x27;m Jim."

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()

```

```output
==================================[1m Ai Message [0m==================================

Ahoy there, Jim! What brings ye to these waters today? Be ye seekin&#x27; treasure, knowledge, or perhaps a good tale from the high seas? Arrr!

```

```python
query = "What is my name?"

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()

```

```output
==================================[1m Ai Message [0m==================================

Ye be called Jim, matey! A fine name fer a swashbuckler such as yerself! What else can I do fer ye? Arrr!

``` Awesome! Let&#x27;s now make our prompt a little bit more complicated. Let&#x27;s assume that the prompt template now looks something like this:

```python
prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

``` Note that we have added a new language input to the prompt. Our application now has two parameters-- the input messages and language. We should update our application&#x27;s state to reflect this:

```python
from typing import Sequence

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict

class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    language: str

workflow = StateGraph(state_schema=State)

def call_model(state: State):
    prompt = prompt_template.invoke(state)
    response = model.invoke(prompt)
    return {"messages": [response]}

workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```API Reference:**[BaseMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.base.BaseMessage.html) | [add_messages](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.message.add_messages)

```python
config = {"configurable": {"thread_id": "abc456"}}
query = "Hi! I&#x27;m Bob."
language = "Spanish"

input_messages = [HumanMessage(query)]
output = app.invoke(
    {"messages": input_messages, "language": language},
    config,
)
output["messages"][-1].pretty_print()

```**

```output
==================================[1m Ai Message [0m==================================

¡Hola, Bob! ¿Cómo puedo ayudarte hoy?

``` Note that the entire state is persisted, so we can omit parameters like language if no changes are desired:

```python
query = "What is my name?"

input_messages = [HumanMessage(query)]
output = app.invoke(
    {"messages": input_messages},
    config,
)
output["messages"][-1].pretty_print()

```

```output
==================================[1m Ai Message [0m==================================

Tu nombre es Bob. ¿Hay algo más en lo que pueda ayudarte?

``` To help you understand what&#x27;s happening internally, check out [this LangSmith trace](https://smith.langchain.com/public/15bd8589-005c-4812-b9b9-23e74ba4c3c6/r). Managing Conversation History[​](#managing-conversation-history) One important concept to understand when building chatbots is how to manage conversation history. If left unmanaged, the list of messages will grow unbounded and potentially overflow the context window of the LLM. Therefore, it is important to add a step that limits the size of the messages you are passing in. Importantly, you will want to do this BEFORE the prompt template but AFTER you load previous messages from Message History.**

We can do this by adding a simple step in front of the prompt that modifies the `messages` key appropriately, and then wrap that new chain in the Message History class.

LangChain comes with a few built-in helpers for [managing a list of messages](/docs/how_to/#messages). In this case we&#x27;ll use the [trim_messages](/docs/how_to/trim_messages/) helper to reduce how many messages we&#x27;re sending to the model. The trimmer allows us to specify how many tokens we want to keep, along with other parameters like if we want to always keep the system message and whether to allow partial messages:

```python
from langchain_core.messages import SystemMessage, trim_messages

trimmer = trim_messages(
    max_tokens=65,
    strategy="last",
    token_counter=model,
    include_system=True,
    allow_partial=False,
    start_on="human",
)

messages = [
    SystemMessage(content="you&#x27;re a good assistant"),
    HumanMessage(content="hi! I&#x27;m bob"),
    AIMessage(content="hi!"),
    HumanMessage(content="I like vanilla ice cream"),
    AIMessage(content="nice"),
    HumanMessage(content="whats 2 + 2"),
    AIMessage(content="4"),
    HumanMessage(content="thanks"),
    AIMessage(content="no problem!"),
    HumanMessage(content="having fun?"),
    AIMessage(content="yes!"),
]

trimmer.invoke(messages)

```**API Reference:**[SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [trim_messages](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.trim_messages.html)

```output
[SystemMessage(content="you&#x27;re a good assistant", additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;whats 2 + 2&#x27;, additional_kwargs={}, response_metadata={}),
 AIMessage(content=&#x27;4&#x27;, additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;thanks&#x27;, additional_kwargs={}, response_metadata={}),
 AIMessage(content=&#x27;no problem!&#x27;, additional_kwargs={}, response_metadata={}),
 HumanMessage(content=&#x27;having fun?&#x27;, additional_kwargs={}, response_metadata={}),
 AIMessage(content=&#x27;yes!&#x27;, additional_kwargs={}, response_metadata={})]

```

To use it in our chain, we just need to run the trimmer before we pass the `messages` input to our prompt.

```python
workflow = StateGraph(state_schema=State)

def call_model(state: State):
    print(f"Messages before trimming: {len(state[&#x27;messages&#x27;])}")
    trimmed_messages = trimmer.invoke(state["messages"])
    print(f"Messages after trimming: {len(trimmed_messages)}")
    print("Remaining messages:")
    for msg in trimmed_messages:
        print(f"  {type(msg).__name__}: {msg.content}")
    prompt = prompt_template.invoke(
        {"messages": trimmed_messages, "language": state["language"]}
    )
    response = model.invoke(prompt)
    return {"messages": [response]}

workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```

Now if we try asking the model our name, it won&#x27;t know it since we trimmed that part of the chat history. (By defining our trim stragegy as `&#x27;last&#x27;`, we are only keeping the most recent messages that fit within the `max_tokens`.)

```python
config = {"configurable": {"thread_id": "abc567"}}
query = "What is my name?"
language = "English"

input_messages = messages + [HumanMessage(query)]
output = app.invoke(
    {"messages": input_messages, "language": language},
    config,
)
output["messages"][-1].pretty_print()

```

```output
Messages before trimming: 12
Messages after trimming: 8
Remaining messages:
  SystemMessage: you&#x27;re a good assistant
  HumanMessage: whats 2 + 2
  AIMessage: 4
  HumanMessage: thanks
  AIMessage: no problem!
  HumanMessage: having fun?
  AIMessage: yes!
  HumanMessage: What is my name?
==================================[1m Ai Message [0m==================================

I don&#x27;t know your name. If you&#x27;d like to share it, feel free!

``` But if we ask about information that is within the last few messages, it remembers:

```python
config = {"configurable": {"thread_id": "abc678"}}

query = "What math problem was asked?"
language = "English"

input_messages = messages + [HumanMessage(query)]
output = app.invoke(
    {"messages": input_messages, "language": language},
    config,
)
output["messages"][-1].pretty_print()

```

```output
Messages before trimming: 12
Messages after trimming: 8
Remaining messages:
  SystemMessage: you&#x27;re a good assistant
  HumanMessage: whats 2 + 2
  AIMessage: 4
  HumanMessage: thanks
  AIMessage: no problem!
  HumanMessage: having fun?
  AIMessage: yes!
  HumanMessage: What math problem was asked?
==================================[1m Ai Message [0m==================================

The math problem that was asked was "what&#x27;s 2 + 2."

``` If you take a look at LangSmith, you can see exactly what is happening under the hood in the [LangSmith trace](https://smith.langchain.com/public/04402eaa-29e6-4bb1-aa91-885b730b6c21/r).

## Streaming[​](#streaming)

Now we&#x27;ve got a functioning chatbot. However, one *really* important UX consideration for chatbot applications is streaming. LLMs can sometimes take a while to respond, and so in order to improve the user experience one thing that most applications do is stream back each token as it is generated. This allows the user to see progress.

It&#x27;s actually super easy to do this!

By default, `.stream` in our LangGraph application streams application steps-- in this case, the single step of the model response. Setting `stream_mode="messages"` allows us to stream output tokens instead:

```python
config = {"configurable": {"thread_id": "abc789"}}
query = "Hi I&#x27;m Todd, please tell me a joke."
language = "English"

input_messages = [HumanMessage(query)]
for chunk, metadata in app.stream(
    {"messages": input_messages, "language": language},
    config,
    stream_mode="messages",
):
    if isinstance(chunk, AIMessage):  # Filter to just model responses
        print(chunk.content, end="|")

```

```output
|Hi| Todd|!| Here|’s| a| joke| for| you|:

|Why| don&#x27;t| scientists| trust| atoms|?

|Because| they| make| up| everything|!||

``` ## Next Steps[​](#next-steps) Now that you understand the basics of how to create a chatbot in LangChain, some more advanced tutorials you may be interested in are:

- [Conversational RAG](/docs/tutorials/qa_chat_history/): Enable a chatbot experience over an external source of data

- [Agents](/docs/tutorials/agents/): Build a chatbot that can take actions

If you want to dive deeper on specifics, some things worth checking out are:

- [Streaming](/docs/how_to/streaming/): streaming is *crucial* for chat applications

- [How to add message history](/docs/how_to/message_history/): for a deeper dive into all things related to message history

- [How to manage large message history](/docs/how_to/trim_messages/): more techniques for managing a large chat history

- [LangGraph main docs](https://langchain-ai.github.io/langgraph/): for more detail on building with LangGraph

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/tutorials/chatbot.ipynb)

- [Overview](#overview)
- [Setup](#setup)[Jupyter Notebook](#jupyter-notebook)
- [Installation](#installation)
- [LangSmith](#langsmith)

- [Quickstart](#quickstart)
- [Message persistence](#message-persistence)
- [Prompt templates](#prompt-templates)
- [Managing Conversation History](#managing-conversation-history)
- [Streaming](#streaming)
- [Next Steps](#next-steps)

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