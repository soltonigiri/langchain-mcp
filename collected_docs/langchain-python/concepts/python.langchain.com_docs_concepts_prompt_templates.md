Prompt Templates | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/prompt_templates.mdx)Prompt Templates Prompt templates help to translate user input and parameters into instructions for a language model. This can be used to guide a model&#x27;s response, helping it understand the context and generate relevant and coherent language-based output. Prompt Templates take as input a dictionary, where each key represents a variable in the prompt template to fill in. Prompt Templates output a PromptValue. This PromptValue can be passed to an LLM or a ChatModel, and can also be cast to a string or a list of messages. The reason this PromptValue exists is to make it easy to switch between strings and messages. There are a few different types of prompt templates: String PromptTemplates[​](#string-prompttemplates) These prompt templates are used to format a single string, and generally are used for simpler inputs. For example, a common way to construct and use a PromptTemplate is as follows:

```python
from langchain_core.prompts import PromptTemplate

prompt_template = PromptTemplate.from_template("Tell me a joke about {topic}")

prompt_template.invoke({"topic": "cats"})

```API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html) ## ChatPromptTemplates[​](#chatprompttemplates) These prompt templates are used to format a list of messages. These "templates" consist of a list of templates themselves. For example, a common way to construct and use a ChatPromptTemplate is as follows:

```python
from langchain_core.prompts import ChatPromptTemplate

prompt_template = ChatPromptTemplate([
    ("system", "You are a helpful assistant"),
    ("user", "Tell me a joke about {topic}")
])

prompt_template.invoke({"topic": "cats"})

```**API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) In the above example, this ChatPromptTemplate will construct two messages when called. The first is a system message, that has no variables to format. The second is a HumanMessage, and will be formatted by the topic variable the user passes in. ## MessagesPlaceholder[​](#messagesplaceholder) This prompt template is responsible for adding a list of messages in a particular place. In the above ChatPromptTemplate, we saw how we could format two messages, each one a string. But what if we wanted the user to pass in a list of messages that we would slot into a particular spot? This is how you use MessagesPlaceholder.

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

prompt_template = ChatPromptTemplate([
    ("system", "You are a helpful assistant"),
    MessagesPlaceholder("msgs")
])

# Simple example with one message
prompt_template.invoke({"msgs": [HumanMessage(content="hi!")]})

# More complex example with conversation history
messages_to_pass = [
    HumanMessage(content="What&#x27;s the capital of France?"),
    AIMessage(content="The capital of France is Paris."),
    HumanMessage(content="And what about Germany?")
]

formatted_prompt = prompt_template.invoke({"msgs": messages_to_pass})
print(formatted_prompt)

```**API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [MessagesPlaceholder](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.MessagesPlaceholder.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) This will produce a list of four messages total: the system message plus the three messages we passed in (two HumanMessages and one AIMessage). If we had passed in 5 messages, then it would have produced 6 messages in total (the system message plus the 5 passed in). This is useful for letting a list of messages be slotted into a particular spot. An alternative way to accomplish the same thing without using the MessagesPlaceholder class explicitly is:

```python
prompt_template = ChatPromptTemplate([
    ("system", "You are a helpful assistant"),
    ("placeholder", "{msgs}") # <-- This is the changed part
])

``` For specifics on how to use prompt templates, see the [relevant how-to guides here](/docs/how_to/#prompt-templates).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/prompt_templates.mdx)[String PromptTemplates](#string-prompttemplates)
- [ChatPromptTemplates](#chatprompttemplates)
- [MessagesPlaceholder](#messagesplaceholder)

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