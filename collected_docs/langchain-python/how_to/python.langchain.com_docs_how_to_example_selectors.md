How to use example selectors | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/example_selectors.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/example_selectors.ipynb)How to use example selectors If you have a large number of examples, you may need to select which ones to include in the prompt. The [Example Selector](/docs/concepts/example_selectors/) is the class responsible for doing so. The base interface is defined as below:

```python
class BaseExampleSelector(ABC):
    """Interface for selecting examples to include in prompts."""

    @abstractmethod
    def select_examples(self, input_variables: Dict[str, str]) -> List[dict]:
        """Select which examples to use based on the inputs."""

    @abstractmethod
    def add_example(self, example: Dict[str, str]) -> Any:
        """Add new example to store."""

``` The only method it needs to define is a select_examples method. This takes in the input variables and then returns a list of examples. It is up to each specific implementation as to how those examples are selected. LangChain has a few different types of example selectors. For an overview of all these types, see the [below table](#example-selector-types). In this guide, we will walk through creating a custom example selector. Examples[​](#examples) In order to use an example selector, we need to create a list of examples. These should generally be example inputs and outputs. For this demo purpose, let&#x27;s imagine we are selecting examples of how to translate English to Italian.

```python
examples = [
    {"input": "hi", "output": "ciao"},
    {"input": "bye", "output": "arrivederci"},
    {"input": "soccer", "output": "calcio"},
]

``` Custom Example Selector[​](#custom-example-selector) Let&#x27;s write an example selector that chooses what example to pick based on the length of the word.

```python
from langchain_core.example_selectors.base import BaseExampleSelector

class CustomExampleSelector(BaseExampleSelector):
    def __init__(self, examples):
        self.examples = examples

    def add_example(self, example):
        self.examples.append(example)

    def select_examples(self, input_variables):
        # This assumes knowledge that part of the input will be a &#x27;text&#x27; key
        new_word = input_variables["input"]
        new_word_length = len(new_word)

        # Initialize variables to store the best match and its length difference
        best_match = None
        smallest_diff = float("inf")

        # Iterate through each example
        for example in self.examples:
            # Calculate the length difference with the first word of the example
            current_diff = abs(len(example["input"]) - new_word_length)

            # Update the best match if the current one is closer in length
            if current_diff < smallest_diff:
                smallest_diff = current_diff
                best_match = example

        return [best_match]

```API Reference:**[BaseExampleSelector](https://python.langchain.com/api_reference/core/example_selectors/langchain_core.example_selectors.base.BaseExampleSelector.html)

```python
example_selector = CustomExampleSelector(examples)

```**

```python
example_selector.select_examples({"input": "okay"})

```

```output
[{&#x27;input&#x27;: &#x27;bye&#x27;, &#x27;output&#x27;: &#x27;arrivederci&#x27;}]

```

```python
example_selector.add_example({"input": "hand", "output": "mano"})

```

```python
example_selector.select_examples({"input": "okay"})

```

```output
[{&#x27;input&#x27;: &#x27;hand&#x27;, &#x27;output&#x27;: &#x27;mano&#x27;}]

``` Use in a Prompt[​](#use-in-a-prompt) We can now use this example selector in a prompt

```python
from langchain_core.prompts.few_shot import FewShotPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate

example_prompt = PromptTemplate.from_template("Input: {input} -> Output: {output}")

```API Reference:**[FewShotPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.few_shot.FewShotPromptTemplate.html) | [PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```python
prompt = FewShotPromptTemplate(
    example_selector=example_selector,
    example_prompt=example_prompt,
    suffix="Input: {input} -> Output:",
    prefix="Translate the following words from English to Italian:",
    input_variables=["input"],
)

print(prompt.format(input="word"))

```

```output
Translate the following words from English to Italian:

Input: hand -> Output: mano

Input: word -> Output:

``` ## Example Selector Types[​](#example-selector-types) NameDescriptionSimilarityUses semantic similarity between inputs and examples to decide which examples to choose.MMRUses Max Marginal Relevance between inputs and examples to decide which examples to choose.LengthSelects examples based on how many can fit within a certain lengthNgramUses ngram overlap between inputs and examples to decide which examples to choose.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/example_selectors.ipynb)[Examples](#examples)
- [Custom Example Selector](#custom-example-selector)
- [Use in a Prompt](#use-in-a-prompt)
- [Example Selector Types](#example-selector-types)

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