How to add memory to chatbots | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/chatbots_memory.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/chatbots_memory.ipynb)How to add memory to chatbots A key feature of chatbots is their ability to use the content of previous conversational turns as context. This state management can take several forms, including: Simply stuffing previous messages into a chat model prompt. The above, but trimming old messages to reduce the amount of distracting information the model has to deal with. More complex modifications like synthesizing summaries for long running conversations. We&#x27;ll go into more detail on a few techniques below! noteThis how-to guide previously built a chatbot using [RunnableWithMessageHistory](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.history.RunnableWithMessageHistory.html). You can access this version of the guide in the [v0.2 docs](https://python.langchain.com/v0.2/docs/how_to/chatbots_memory/).As of the v0.3 release of LangChain, we recommend that LangChain users take advantage of [LangGraph persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/) to incorporate memory into new LangChain applications.If your code is already relying on RunnableWithMessageHistory or BaseChatMessageHistory, you do not** need to make any changes. We do not plan on deprecating this functionality in the near future as it works for simple chat applications and any code that uses RunnableWithMessageHistory will continue to work as expected.Please see [How to migrate to LangGraph Memory](/docs/versions/migrating_memory/) for more details. ## Setup[​](#setup) You&#x27;ll need to install a few packages, and have your OpenAI API key set as an environment variable named OPENAI_API_KEY:

```python
%pip install --upgrade --quiet langchain langchain-openai langgraph

import getpass
import os

if not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")

```**

```output
OpenAI API Key: ········

``` Let&#x27;s also set up a chat model that we&#x27;ll use for the below examples.

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini")

``` Message passing[​](#message-passing) The simplest form of memory is simply passing chat history messages into a chain. Here&#x27;s an example:

```python
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(
            content="You are a helpful assistant. Answer all questions to the best of your ability."
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

chain = prompt | model

ai_msg = chain.invoke(
    {
        "messages": [
            HumanMessage(
                content="Translate from English to French: I love programming."
            ),
            AIMessage(content="J&#x27;adore la programmation."),
            HumanMessage(content="What did you just say?"),
        ],
    }
)
print(ai_msg.content)

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html)

```output
I said, "I love programming" in French: "J&#x27;adore la programmation."

```**We can see that by passing the previous conversation into a chain, it can use it as context to answer questions. This is the basic concept underpinning chatbot memory - the rest of the guide will demonstrate convenient techniques for passing or reformatting messages. Automatic history management[​](#automatic-history-management) The previous examples pass messages to the chain (and model) explicitly. This is a completely acceptable approach, but it does require external management of new messages. LangChain also provides a way to build applications that have memory using LangGraph&#x27;s [persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/). You can [enable persistence](https://langchain-ai.github.io/langgraph/how-tos/persistence/) in LangGraph applications by providing a checkpointer when compiling the graph.

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph

workflow = StateGraph(state_schema=MessagesState)

# Define the function that calls the model
def call_model(state: MessagesState):
    system_prompt = (
        "You are a helpful assistant. Answer all questions to the best of your ability."
    )
    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    response = model.invoke(messages)
    return {"messages": response}

# Define the node and edge
workflow.add_node("model", call_model)
workflow.add_edge(START, "model")

# Add simple in-memory checkpointer
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```API Reference:**[MemorySaver](https://langchain-ai.github.io/langgraph/reference/checkpoints/#langgraph.checkpoint.memory.MemorySaver) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) We&#x27;ll pass the latest input to the conversation here and let LangGraph keep track of the conversation history using the checkpointer:

```python
app.invoke(
    {"messages": [HumanMessage(content="Translate to French: I love programming.")]},
    config={"configurable": {"thread_id": "1"}},
)

```**

```output
{&#x27;messages&#x27;: [HumanMessage(content=&#x27;Translate to French: I love programming.&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;be5e7099-3149-4293-af49-6b36c8ccd71b&#x27;),
  AIMessage(content="J&#x27;aime programmer.", additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 4, &#x27;prompt_tokens&#x27;: 35, &#x27;total_tokens&#x27;: 39, &#x27;completion_tokens_details&#x27;: {&#x27;reasoning_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_e9627b5346&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-8a753d7a-b97b-4d01-a661-626be6f41b38-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 35, &#x27;output_tokens&#x27;: 4, &#x27;total_tokens&#x27;: 39})]}

```

```python
app.invoke(
    {"messages": [HumanMessage(content="What did I just ask you?")]},
    config={"configurable": {"thread_id": "1"}},
)

```

```output
{&#x27;messages&#x27;: [HumanMessage(content=&#x27;Translate to French: I love programming.&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;be5e7099-3149-4293-af49-6b36c8ccd71b&#x27;),
  AIMessage(content="J&#x27;aime programmer.", additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 4, &#x27;prompt_tokens&#x27;: 35, &#x27;total_tokens&#x27;: 39, &#x27;completion_tokens_details&#x27;: {&#x27;reasoning_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_e9627b5346&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-8a753d7a-b97b-4d01-a661-626be6f41b38-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 35, &#x27;output_tokens&#x27;: 4, &#x27;total_tokens&#x27;: 39}),
  HumanMessage(content=&#x27;What did I just ask you?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;c667529b-7c41-4cc0-9326-0af47328b816&#x27;),
  AIMessage(content=&#x27;You asked me to translate "I love programming" into French.&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 13, &#x27;prompt_tokens&#x27;: 54, &#x27;total_tokens&#x27;: 67, &#x27;completion_tokens_details&#x27;: {&#x27;reasoning_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_1bb46167f9&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-134a7ea0-d3a4-4923-bd58-25e5a43f6a1f-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 54, &#x27;output_tokens&#x27;: 13, &#x27;total_tokens&#x27;: 67})]}

``` Modifying chat history[​](#modifying-chat-history) Modifying stored chat messages can help your chatbot handle a variety of situations. Here are some examples: Trimming messages[​](#trimming-messages) LLMs and chat models have limited context windows, and even if you&#x27;re not directly hitting limits, you may want to limit the amount of distraction the model has to deal with. One solution is trim the history messages before passing them to the model. Let&#x27;s use an example history with the app we declared above:

```python
demo_ephemeral_chat_history = [
    HumanMessage(content="Hey there! I&#x27;m Nemo."),
    AIMessage(content="Hello!"),
    HumanMessage(content="How are you today?"),
    AIMessage(content="Fine thanks!"),
]

app.invoke(
    {
        "messages": demo_ephemeral_chat_history
        + [HumanMessage(content="What&#x27;s my name?")]
    },
    config={"configurable": {"thread_id": "2"}},
)

```

```output
{&#x27;messages&#x27;: [HumanMessage(content="Hey there! I&#x27;m Nemo.", additional_kwargs={}, response_metadata={}, id=&#x27;6b4cab70-ce18-49b0-bb06-267bde44e037&#x27;),
  AIMessage(content=&#x27;Hello!&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;ba3714f4-8876-440b-a651-efdcab2fcb4c&#x27;),
  HumanMessage(content=&#x27;How are you today?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;08d032c0-1577-4862-a3f2-5c1b90687e21&#x27;),
  AIMessage(content=&#x27;Fine thanks!&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;21790e16-db05-4537-9a6b-ecad0fcec436&#x27;),
  HumanMessage(content="What&#x27;s my name?", additional_kwargs={}, response_metadata={}, id=&#x27;c933eca3-5fd8-4651-af16-20fe2d49c216&#x27;),
  AIMessage(content=&#x27;Your name is Nemo.&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 5, &#x27;prompt_tokens&#x27;: 63, &#x27;total_tokens&#x27;: 68, &#x27;completion_tokens_details&#x27;: {&#x27;reasoning_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_1bb46167f9&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-a0b21acc-9dbb-4fb6-a953-392020f37d88-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 63, &#x27;output_tokens&#x27;: 5, &#x27;total_tokens&#x27;: 68})]}

``` We can see the app remembers the preloaded name. But let&#x27;s say we have a very small context window, and we want to trim the number of messages passed to the model to only the 2 most recent ones. We can use the built in [trim_messages](/docs/how_to/trim_messages/) util to trim messages based on their token count before they reach our prompt. In this case we&#x27;ll count each message as 1 "token" and keep only the last two messages:

```python
from langchain_core.messages import trim_messages
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph

# Define trimmer
# count each message as 1 "token" (token_counter=len) and keep only the last two messages
trimmer = trim_messages(strategy="last", max_tokens=2, token_counter=len)

workflow = StateGraph(state_schema=MessagesState)

# Define the function that calls the model
def call_model(state: MessagesState):
    trimmed_messages = trimmer.invoke(state["messages"])
    system_prompt = (
        "You are a helpful assistant. Answer all questions to the best of your ability."
    )
    messages = [SystemMessage(content=system_prompt)] + trimmed_messages
    response = model.invoke(messages)
    return {"messages": response}

# Define the node and edge
workflow.add_node("model", call_model)
workflow.add_edge(START, "model")

# Add simple in-memory checkpointer
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```API Reference:**[trim_messages](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.trim_messages.html) | [MemorySaver](https://langchain-ai.github.io/langgraph/reference/checkpoints/#langgraph.checkpoint.memory.MemorySaver) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) Let&#x27;s call this new app and check the response

```python
app.invoke(
    {
        "messages": demo_ephemeral_chat_history
        + [HumanMessage(content="What is my name?")]
    },
    config={"configurable": {"thread_id": "3"}},
)

```**

```output
{&#x27;messages&#x27;: [HumanMessage(content="Hey there! I&#x27;m Nemo.", additional_kwargs={}, response_metadata={}, id=&#x27;6b4cab70-ce18-49b0-bb06-267bde44e037&#x27;),
  AIMessage(content=&#x27;Hello!&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;ba3714f4-8876-440b-a651-efdcab2fcb4c&#x27;),
  HumanMessage(content=&#x27;How are you today?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;08d032c0-1577-4862-a3f2-5c1b90687e21&#x27;),
  AIMessage(content=&#x27;Fine thanks!&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;21790e16-db05-4537-9a6b-ecad0fcec436&#x27;),
  HumanMessage(content=&#x27;What is my name?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;a22ab7c5-8617-4821-b3e9-a9e7dca1ff78&#x27;),
  AIMessage(content="I&#x27;m sorry, but I don&#x27;t have access to personal information about you unless you share it with me. How can I assist you today?", additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 27, &#x27;prompt_tokens&#x27;: 39, &#x27;total_tokens&#x27;: 66, &#x27;completion_tokens_details&#x27;: {&#x27;reasoning_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_1bb46167f9&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-f7b32d72-9f57-4705-be7e-43bf1c3d293b-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 39, &#x27;output_tokens&#x27;: 27, &#x27;total_tokens&#x27;: 66})]}

``` We can see that trim_messages was called and only the two most recent messages will be passed to the model. In this case, this means that the model forgot the name we gave it. Check out our [how to guide on trimming messages](/docs/how_to/trim_messages/) for more. Summary memory[​](#summary-memory) We can use this same pattern in other ways too. For example, we could use an additional LLM call to generate a summary of the conversation before calling our app. Let&#x27;s recreate our chat history:

```python
demo_ephemeral_chat_history = [
    HumanMessage(content="Hey there! I&#x27;m Nemo."),
    AIMessage(content="Hello!"),
    HumanMessage(content="How are you today?"),
    AIMessage(content="Fine thanks!"),
]

``` And now, let&#x27;s update the model-calling function to distill previous interactions into a summary:

```python
from langchain_core.messages import HumanMessage, RemoveMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph

workflow = StateGraph(state_schema=MessagesState)

# Define the function that calls the model
def call_model(state: MessagesState):
    system_prompt = (
        "You are a helpful assistant. "
        "Answer all questions to the best of your ability. "
        "The provided chat history includes a summary of the earlier conversation."
    )
    system_message = SystemMessage(content=system_prompt)
    message_history = state["messages"][:-1]  # exclude the most recent user input
    # Summarize the messages if the chat history reaches a certain size
    if len(message_history) >= 4:
        last_human_message = state["messages"][-1]
        # Invoke the model to generate conversation summary
        summary_prompt = (
            "Distill the above chat messages into a single summary message. "
            "Include as many specific details as you can."
        )
        summary_message = model.invoke(
            message_history + [HumanMessage(content=summary_prompt)]
        )

        # Delete messages that we no longer want to show up
        delete_messages = [RemoveMessage(id=m.id) for m in state["messages"]]
        # Re-add user message
        human_message = HumanMessage(content=last_human_message.content)
        # Call the model with summary & response
        response = model.invoke([system_message, summary_message, human_message])
        message_updates = [summary_message, human_message, response] + delete_messages
    else:
        message_updates = model.invoke([system_message] + state["messages"])

    return {"messages": message_updates}

# Define the node and edge
workflow.add_node("model", call_model)
workflow.add_edge(START, "model")

# Add simple in-memory checkpointer
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [RemoveMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.modifier.RemoveMessage.html) | [MemorySaver](https://langchain-ai.github.io/langgraph/reference/checkpoints/#langgraph.checkpoint.memory.MemorySaver) | [StateGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.state.StateGraph) Let&#x27;s see if it remembers the name we gave it:

```python
app.invoke(
    {
        "messages": demo_ephemeral_chat_history
        + [HumanMessage("What did I say my name was?")]
    },
    config={"configurable": {"thread_id": "4"}},
)

```

```output
{&#x27;messages&#x27;: [AIMessage(content="Nemo greeted me, and I responded positively, indicating that I&#x27;m doing well.", additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 16, &#x27;prompt_tokens&#x27;: 60, &#x27;total_tokens&#x27;: 76, &#x27;completion_tokens_details&#x27;: {&#x27;reasoning_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_1bb46167f9&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-ee42f98d-907d-4bad-8f16-af2db789701d-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 60, &#x27;output_tokens&#x27;: 16, &#x27;total_tokens&#x27;: 76}),
  HumanMessage(content=&#x27;What did I say my name was?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;788555ea-5b1f-4c29-a2f2-a92f15d147be&#x27;),
  AIMessage(content=&#x27;You mentioned that your name is Nemo.&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 8, &#x27;prompt_tokens&#x27;: 67, &#x27;total_tokens&#x27;: 75, &#x27;completion_tokens_details&#x27;: {&#x27;reasoning_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_1bb46167f9&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-099a43bd-a284-4969-bb6f-0be486614cd8-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 67, &#x27;output_tokens&#x27;: 8, &#x27;total_tokens&#x27;: 75})]}

``` Note that invoking the app again will keep accumulating the history until it reaches the specified number of messages (four in our case). At that point we will generate another summary generated from the initial summary plus new messages and so on.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/chatbots_memory.ipynb)[Setup](#setup)
- [Message passing](#message-passing)
- [Automatic history management](#automatic-history-management)
- [Modifying chat history](#modifying-chat-history)[Trimming messages](#trimming-messages)
- [Summary memory](#summary-memory)

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