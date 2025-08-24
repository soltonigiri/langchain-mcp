How to use few shot examples in chat models | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/few_shot_examples_chat.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/few_shot_examples_chat.ipynb)How to use few shot examples in chat models PrerequisitesThis guide assumes familiarity with the following concepts: [Prompt templates](/docs/concepts/prompt_templates/) [Example selectors](/docs/concepts/example_selectors/) [Chat models](/docs/concepts/chat_models/) [Vectorstores](/docs/concepts/vectorstores/) This guide covers how to prompt a chat model with example inputs and outputs. Providing the model with a few such examples is called [few-shotting](/docs/concepts/few_shot_prompting/), and is a simple yet powerful way to guide generation and in some cases drastically improve model performance. There does not appear to be solid consensus on how best to do few-shot prompting, and the optimal prompt compilation will likely vary by model. Because of this, we provide few-shot prompt templates like the [FewShotChatMessagePromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.few_shot.FewShotChatMessagePromptTemplate.html?highlight=fewshot#langchain_core.prompts.few_shot.FewShotChatMessagePromptTemplate) as a flexible starting point, and you can modify or replace them as you see fit. The goal of few-shot prompt templates are to dynamically select examples based on an input, and then format the examples in a final prompt to provide for the model. Note:** The following code examples are for chat models only, since FewShotChatMessagePromptTemplates are designed to output formatted [chat messages](/docs/concepts/messages/) rather than pure strings. For similar few-shot prompt examples for pure string templates compatible with completion models (LLMs), see the [few-shot prompt templates](/docs/how_to/few_shot_examples/) guide. ## Fixed Examples[​](#fixed-examples) The most basic (and common) few-shot prompting technique is to use fixed prompt examples. This way you can select a chain, evaluate it, and avoid worrying about additional moving parts in production. The basic components of the template are: examples: A list of dictionary examples to include in the final prompt.

- example_prompt: converts each example into 1 or more messages through its [format_messages](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html?highlight=format_messages#langchain_core.prompts.chat.ChatPromptTemplate.format_messages) method. A common example would be to convert each example into one human message and one AI message response, or a human message followed by a function call message.

Below is a simple demonstration. First, define the examples you&#x27;d like to include. Let&#x27;s give the LLM an unfamiliar mathematical operator, denoted by the "🦜" emoji:

```python
%pip install -qU langchain langchain-openai langchain-chroma

import os
from getpass import getpass

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass()

```**If we try to ask the model what the result of this expression is, it will fail:

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini", temperature=0.0)

model.invoke("What is 2 🦜 9?")

```

```output
AIMessage(content=&#x27;The expression "2 🦜 9" is not a standard mathematical operation or equation. It appears to be a combination of the number 2 and the parrot emoji 🦜 followed by the number 9. It does not have a specific mathematical meaning.&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 54, &#x27;prompt_tokens&#x27;: 17, &#x27;total_tokens&#x27;: 71}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-aad12dda-5c47-4a1e-9949-6fe94e03242a-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 17, &#x27;output_tokens&#x27;: 54, &#x27;total_tokens&#x27;: 71})

``` Now let&#x27;s see what happens if we give the LLM some examples to work with. We&#x27;ll define some below:

```python
from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

examples = [
    {"input": "2 🦜 2", "output": "4"},
    {"input": "2 🦜 3", "output": "5"},
]

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [FewShotChatMessagePromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.few_shot.FewShotChatMessagePromptTemplate.html)

Next, assemble them into the few-shot prompt template.

```python
# This is a prompt template used to format each individual example.
example_prompt = ChatPromptTemplate.from_messages(
    [
        ("human", "{input}"),
        ("ai", "{output}"),
    ]
)
few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_prompt=example_prompt,
    examples=examples,
)

print(few_shot_prompt.invoke({}).to_messages())

```**

```output
[HumanMessage(content=&#x27;2 🦜 2&#x27;), AIMessage(content=&#x27;4&#x27;), HumanMessage(content=&#x27;2 🦜 3&#x27;), AIMessage(content=&#x27;5&#x27;)]

``` Finally, we assemble the final prompt as shown below, passing few_shot_prompt directly into the from_messages factory method, and use it with a model:

```python
final_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a wondrous wizard of math."),
        few_shot_prompt,
        ("human", "{input}"),
    ]
)

``` And now let&#x27;s ask the model the initial question and see how it does:

```python
from langchain_openai import ChatOpenAI

chain = final_prompt | model

chain.invoke({"input": "What is 2 🦜 9?"})

```

```output
AIMessage(content=&#x27;11&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 1, &#x27;prompt_tokens&#x27;: 60, &#x27;total_tokens&#x27;: 61}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-5ec4e051-262f-408e-ad00-3f2ebeb561c3-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 60, &#x27;output_tokens&#x27;: 1, &#x27;total_tokens&#x27;: 61})

``` And we can see that the model has now inferred that the parrot emoji means addition from the given few-shot examples! Dynamic few-shot prompting[​](#dynamic-few-shot-prompting) Sometimes you may want to select only a few examples from your overall set to show based on the input. For this, you can replace the examples passed into FewShotChatMessagePromptTemplate with an example_selector. The other components remain the same as above! Our dynamic few-shot prompt template would look like: example_selector: responsible for selecting few-shot examples (and the order in which they are returned) for a given input. These implement the [BaseExampleSelector](https://python.langchain.com/api_reference/core/example_selectors/langchain_core.example_selectors.base.BaseExampleSelector.html?highlight=baseexampleselector#langchain_core.example_selectors.base.BaseExampleSelector) interface. A common example is the vectorstore-backed [SemanticSimilarityExampleSelector](https://python.langchain.com/api_reference/core/example_selectors/langchain_core.example_selectors.semantic_similarity.SemanticSimilarityExampleSelector.html?highlight=semanticsimilarityexampleselector#langchain_core.example_selectors.semantic_similarity.SemanticSimilarityExampleSelector) example_prompt: convert each example into 1 or more messages through its [format_messages](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html?highlight=chatprompttemplate#langchain_core.prompts.chat.ChatPromptTemplate.format_messages) method. A common example would be to convert each example into one human message and one AI message response, or a human message followed by a function call message. These once again can be composed with other messages and chat templates to assemble your final prompt. Let&#x27;s walk through an example with the SemanticSimilarityExampleSelector. Since this implementation uses a vectorstore to select examples based on semantic similarity, we will want to first populate the store. Since the basic idea here is that we want to search for and return examples most similar to the text input, we embed the values of our prompt examples rather than considering the keys:

```python
from langchain_chroma import Chroma
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_openai import OpenAIEmbeddings

examples = [
    {"input": "2 🦜 2", "output": "4"},
    {"input": "2 🦜 3", "output": "5"},
    {"input": "2 🦜 4", "output": "6"},
    {"input": "What did the cow say to the moon?", "output": "nothing at all"},
    {
        "input": "Write me a poem about the moon",
        "output": "One for the moon, and one for me, who are we to talk about the moon?",
    },
]

to_vectorize = [" ".join(example.values()) for example in examples]
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_texts(to_vectorize, embeddings, metadatas=examples)

```API Reference:**[SemanticSimilarityExampleSelector](https://python.langchain.com/api_reference/core/example_selectors/langchain_core.example_selectors.semantic_similarity.SemanticSimilarityExampleSelector.html)

### Create the example_selector[​](#create-the-example_selector)

With a vectorstore created, we can create the `example_selector`. Here we will call it in isolation, and set `k` on it to only fetch the two example closest to the input.

```python
example_selector = SemanticSimilarityExampleSelector(
    vectorstore=vectorstore,
    k=2,
)

# The prompt template will load examples by passing the input do the `select_examples` method
example_selector.select_examples({"input": "horse"})

```**

```output
[{&#x27;input&#x27;: &#x27;What did the cow say to the moon?&#x27;, &#x27;output&#x27;: &#x27;nothing at all&#x27;},
 {&#x27;input&#x27;: &#x27;2 🦜 4&#x27;, &#x27;output&#x27;: &#x27;6&#x27;}]

``` Create prompt template[​](#create-prompt-template) We now assemble the prompt template, using the example_selector created above.

```python
from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

# Define the few-shot prompt.
few_shot_prompt = FewShotChatMessagePromptTemplate(
    # The input variables select the values to pass to the example_selector
    input_variables=["input"],
    example_selector=example_selector,
    # Define how each example will be formatted.
    # In this case, each example will become 2 messages:
    # 1 human, and 1 AI
    example_prompt=ChatPromptTemplate.from_messages(
        [("human", "{input}"), ("ai", "{output}")]
    ),
)

print(few_shot_prompt.invoke(input="What&#x27;s 3 🦜 3?").to_messages())

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [FewShotChatMessagePromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.few_shot.FewShotChatMessagePromptTemplate.html)

```output
[HumanMessage(content=&#x27;2 🦜 3&#x27;), AIMessage(content=&#x27;5&#x27;), HumanMessage(content=&#x27;2 🦜 4&#x27;), AIMessage(content=&#x27;6&#x27;)]

```

And we can pass this few-shot chat message prompt template into another chat prompt template:

```python
final_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a wondrous wizard of math."),
        few_shot_prompt,
        ("human", "{input}"),
    ]
)

print(few_shot_prompt.invoke(input="What&#x27;s 3 🦜 3?"))

```

```output
messages=[HumanMessage(content=&#x27;2 🦜 3&#x27;), AIMessage(content=&#x27;5&#x27;), HumanMessage(content=&#x27;2 🦜 4&#x27;), AIMessage(content=&#x27;6&#x27;)]

``` ### Use with an chat model[​](#use-with-an-chat-model) Finally, you can connect your model to the few-shot prompt.

```python
chain = final_prompt | ChatOpenAI(model="gpt-4o-mini", temperature=0.0)

chain.invoke({"input": "What&#x27;s 3 🦜 3?"})

```

```output
AIMessage(content=&#x27;6&#x27;, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 1, &#x27;prompt_tokens&#x27;: 60, &#x27;total_tokens&#x27;: 61}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini&#x27;, &#x27;system_fingerprint&#x27;: None, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run-d1863e5e-17cd-4e9d-bf7a-b9f118747a65-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 60, &#x27;output_tokens&#x27;: 1, &#x27;total_tokens&#x27;: 61})

``` ## Next steps[  ​](#next-steps) You&#x27;ve now learned how to add few-shot examples to your chat prompts.

Next, check out the other how-to guides on prompt templates in this section, the related how-to guide on [few shotting with text completion models](/docs/how_to/few_shot_examples/), or the other [example selector how-to guides](/docs/how_to/example_selectors/).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/few_shot_examples_chat.ipynb)

- [Fixed Examples](#fixed-examples)
- [Dynamic few-shot prompting](#dynamic-few-shot-prompting)[Create the example_selector](#create-the-example_selector)
- [Create prompt template](#create-prompt-template)
- [Use with an chat model](#use-with-an-chat-model)

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