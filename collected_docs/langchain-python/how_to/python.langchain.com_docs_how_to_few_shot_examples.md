How to use few shot examples | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/few_shot_examples.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/few_shot_examples.ipynb)How to use few shot examples PrerequisitesThis guide assumes familiarity with the following concepts: [Prompt templates](/docs/concepts/prompt_templates/) [Example selectors](/docs/concepts/example_selectors/) [LLMs](/docs/concepts/text_llms/) [Vectorstores](/docs/concepts/vectorstores/) In this guide, we&#x27;ll learn how to create a simple prompt template that provides the model with example inputs and outputs when generating. Providing the LLM with a few such examples is called [few-shotting](/docs/concepts/few_shot_prompting/), and is a simple yet powerful way to guide generation and in some cases drastically improve model performance. A few-shot prompt template can be constructed from either a set of examples, or from an [Example Selector](https://python.langchain.com/api_reference/core/example_selectors/langchain_core.example_selectors.base.BaseExampleSelector.html) class responsible for choosing a subset of examples from the defined set. This guide will cover few-shotting with string prompt templates. For a guide on few-shotting with chat messages for chat models, see [here](/docs/how_to/few_shot_examples_chat/). Create a formatter for the few-shot examples[​](#create-a-formatter-for-the-few-shot-examples) Configure a formatter that will format the few-shot examples into a string. This formatter should be a PromptTemplate object.

```python
from langchain_core.prompts import PromptTemplate

example_prompt = PromptTemplate.from_template("Question: {question}\n{answer}")

```API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html) ## Creating the example set[​](#creating-the-example-set) Next, we&#x27;ll create a list of few-shot examples. Each example should be a dictionary representing an example input to the formatter prompt we defined above.

```python
examples = [
    {
        "question": "Who lived longer, Muhammad Ali or Alan Turing?",
        "answer": """
Are follow up questions needed here: Yes.
Follow up: How old was Muhammad Ali when he died?
Intermediate answer: Muhammad Ali was 74 years old when he died.
Follow up: How old was Alan Turing when he died?
Intermediate answer: Alan Turing was 41 years old when he died.
So the final answer is: Muhammad Ali
""",
    },
    {
        "question": "When was the founder of craigslist born?",
        "answer": """
Are follow up questions needed here: Yes.
Follow up: Who was the founder of craigslist?
Intermediate answer: Craigslist was founded by Craig Newmark.
Follow up: When was Craig Newmark born?
Intermediate answer: Craig Newmark was born on December 6, 1952.
So the final answer is: December 6, 1952
""",
    },
    {
        "question": "Who was the maternal grandfather of George Washington?",
        "answer": """
Are follow up questions needed here: Yes.
Follow up: Who was the mother of George Washington?
Intermediate answer: The mother of George Washington was Mary Ball Washington.
Follow up: Who was the father of Mary Ball Washington?
Intermediate answer: The father of Mary Ball Washington was Joseph Ball.
So the final answer is: Joseph Ball
""",
    },
    {
        "question": "Are both the directors of Jaws and Casino Royale from the same country?",
        "answer": """
Are follow up questions needed here: Yes.
Follow up: Who is the director of Jaws?
Intermediate Answer: The director of Jaws is Steven Spielberg.
Follow up: Where is Steven Spielberg from?
Intermediate Answer: The United States.
Follow up: Who is the director of Casino Royale?
Intermediate Answer: The director of Casino Royale is Martin Campbell.
Follow up: Where is Martin Campbell from?
Intermediate Answer: New Zealand.
So the final answer is: No
""",
    },
]

```**Let&#x27;s test the formatting prompt with one of our examples:

```python
print(example_prompt.invoke(examples[0]).to_string())

```

```output
Question: Who lived longer, Muhammad Ali or Alan Turing?

Are follow up questions needed here: Yes.
Follow up: How old was Muhammad Ali when he died?
Intermediate answer: Muhammad Ali was 74 years old when he died.
Follow up: How old was Alan Turing when he died?
Intermediate answer: Alan Turing was 41 years old when he died.
So the final answer is: Muhammad Ali

``` Pass the examples and formatter to FewShotPromptTemplate[​](#pass-the-examples-and-formatter-to-fewshotprompttemplate) Finally, create a [FewShotPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.few_shot.FewShotPromptTemplate.html) object. This object takes in the few-shot examples and the formatter for the few-shot examples. When this FewShotPromptTemplate is formatted, it formats the passed examples using the example_prompt, then and adds them to the final prompt before suffix:

```python
from langchain_core.prompts import FewShotPromptTemplate

prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    suffix="Question: {input}",
    input_variables=["input"],
)

print(
    prompt.invoke({"input": "Who was the father of Mary Ball Washington?"}).to_string()
)

```API Reference:**[FewShotPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.few_shot.FewShotPromptTemplate.html)

```output
Question: Who lived longer, Muhammad Ali or Alan Turing?

Are follow up questions needed here: Yes.
Follow up: How old was Muhammad Ali when he died?
Intermediate answer: Muhammad Ali was 74 years old when he died.
Follow up: How old was Alan Turing when he died?
Intermediate answer: Alan Turing was 41 years old when he died.
So the final answer is: Muhammad Ali

Question: When was the founder of craigslist born?

Are follow up questions needed here: Yes.
Follow up: Who was the founder of craigslist?
Intermediate answer: Craigslist was founded by Craig Newmark.
Follow up: When was Craig Newmark born?
Intermediate answer: Craig Newmark was born on December 6, 1952.
So the final answer is: December 6, 1952

Question: Who was the maternal grandfather of George Washington?

Are follow up questions needed here: Yes.
Follow up: Who was the mother of George Washington?
Intermediate answer: The mother of George Washington was Mary Ball Washington.
Follow up: Who was the father of Mary Ball Washington?
Intermediate answer: The father of Mary Ball Washington was Joseph Ball.
So the final answer is: Joseph Ball

Question: Are both the directors of Jaws and Casino Royale from the same country?

Are follow up questions needed here: Yes.
Follow up: Who is the director of Jaws?
Intermediate Answer: The director of Jaws is Steven Spielberg.
Follow up: Where is Steven Spielberg from?
Intermediate Answer: The United States.
Follow up: Who is the director of Casino Royale?
Intermediate Answer: The director of Casino Royale is Martin Campbell.
Follow up: Where is Martin Campbell from?
Intermediate Answer: New Zealand.
So the final answer is: No

Question: Who was the father of Mary Ball Washington?

```**By providing the model with examples like this, we can guide the model to a better response. Using an example selector[​](#using-an-example-selector) We will reuse the example set and the formatter from the previous section. However, instead of feeding the examples directly into the FewShotPromptTemplate object, we will feed them into an implementation of ExampleSelector called [SemanticSimilarityExampleSelector](https://python.langchain.com/api_reference/core/example_selectors/langchain_core.example_selectors.semantic_similarity.SemanticSimilarityExampleSelector.html) instance. This class selects few-shot examples from the initial set based on their similarity to the input. It uses an embedding model to compute the similarity between the input and the few-shot examples, as well as a vector store to perform the nearest neighbor search. To show what it looks like, let&#x27;s initialize an instance and call it in isolation:

```python
from langchain_chroma import Chroma
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_openai import OpenAIEmbeddings

example_selector = SemanticSimilarityExampleSelector.from_examples(
    # This is the list of examples available to select from.
    examples,
    # This is the embedding class used to produce embeddings which are used to measure semantic similarity.
    OpenAIEmbeddings(),
    # This is the VectorStore class that is used to store the embeddings and do a similarity search over.
    Chroma,
    # This is the number of examples to produce.
    k=1,
)

# Select the most similar example to the input.
question = "Who was the father of Mary Ball Washington?"
selected_examples = example_selector.select_examples({"question": question})
print(f"Examples most similar to the input: {question}")
for example in selected_examples:
    print("\n")
    for k, v in example.items():
        print(f"{k}: {v}")

```API Reference:**[SemanticSimilarityExampleSelector](https://python.langchain.com/api_reference/core/example_selectors/langchain_core.example_selectors.semantic_similarity.SemanticSimilarityExampleSelector.html)

```output
Examples most similar to the input: Who was the father of Mary Ball Washington?

answer:
Are follow up questions needed here: Yes.
Follow up: Who was the mother of George Washington?
Intermediate answer: The mother of George Washington was Mary Ball Washington.
Follow up: Who was the father of Mary Ball Washington?
Intermediate answer: The father of Mary Ball Washington was Joseph Ball.
So the final answer is: Joseph Ball

question: Who was the maternal grandfather of George Washington?

``` Now, let&#x27;s create a FewShotPromptTemplate object. This object takes in the example selector and the formatter prompt for the few-shot examples.

```python
prompt = FewShotPromptTemplate(
    example_selector=example_selector,
    example_prompt=example_prompt,
    suffix="Question: {input}",
    input_variables=["input"],
)

print(
    prompt.invoke({"input": "Who was the father of Mary Ball Washington?"}).to_string()
)

```

```output
Question: Who was the maternal grandfather of George Washington?

Are follow up questions needed here: Yes.
Follow up: Who was the mother of George Washington?
Intermediate answer: The mother of George Washington was Mary Ball Washington.
Follow up: Who was the father of Mary Ball Washington?
Intermediate answer: The father of Mary Ball Washington was Joseph Ball.
So the final answer is: Joseph Ball

Question: Who was the father of Mary Ball Washington?

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to add few-shot examples to your prompts. Next, check out the other how-to guides on prompt templates in this section, the related how-to guide on [few shotting with chat models](/docs/how_to/few_shot_examples_chat/), or the other [example selector how-to guides](/docs/how_to/example_selectors/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/few_shot_examples.ipynb)[Create a formatter for the few-shot examples](#create-a-formatter-for-the-few-shot-examples)
- [Creating the example set](#creating-the-example-set)[Pass the examples and formatter to FewShotPromptTemplate](#pass-the-examples-and-formatter-to-fewshotprompttemplate)

- [Using an example selector](#using-an-example-selector)
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