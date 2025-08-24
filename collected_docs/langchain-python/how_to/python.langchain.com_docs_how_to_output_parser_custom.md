How to create a custom Output Parser | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_custom.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/output_parser_custom.ipynb)How to create a custom Output Parser In some situations you may want to implement a custom [parser](/docs/concepts/output_parsers/) to structure the model output into a custom format. There are two ways to implement a custom parser: Using RunnableLambda or RunnableGenerator in [LCEL](/docs/concepts/lcel/) -- we strongly recommend this for most use cases By inheriting from one of the base classes for out parsing -- this is the hard way of doing things The difference between the two approaches are mostly superficial and are mainly in terms of which callbacks are triggered (e.g., on_chain_start vs. on_parser_start), and how a runnable lambda vs. a parser might be visualized in a tracing platform like LangSmith. Runnable Lambdas and Generators[​](#runnable-lambdas-and-generators) The recommended way to parse is using runnable lambdas** and **runnable generators**! Here, we will make a simple parse that inverts the case of the output from the model. For example, if the model outputs: "Meow", the parser will produce "mEOW".

```python
from typing import Iterable

from langchain_anthropic.chat_models import ChatAnthropic
from langchain_core.messages import AIMessage, AIMessageChunk

model = ChatAnthropic(model_name="claude-2.1")

def parse(ai_message: AIMessage) -> str:
    """Parse the AI message."""
    return ai_message.content.swapcase()

chain = model | parse
chain.invoke("hello")

```**API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [AIMessageChunk](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessageChunk.html)

```output
&#x27;hELLO!&#x27;

```**tipLCEL automatically upgrades the function parse to RunnableLambda(parse) when composed using a | syntax.If you don&#x27;t like that you can manually import RunnableLambda and then runparse = RunnableLambda(parse). Does streaming work?

```python
for chunk in chain.stream("tell me about yourself in one sentence"):
    print(chunk, end="|", flush=True)

```

```output
i&#x27;M cLAUDE, AN ai ASSISTANT CREATED BY aNTHROPIC TO BE HELPFUL, HARMLESS, AND HONEST.|

``` No, it doesn&#x27;t because the parser aggregates the input before parsing the output. If we want to implement a streaming parser, we can have the parser accept an iterable over the input instead and yield the results as they&#x27;re available.

```python
from langchain_core.runnables import RunnableGenerator

def streaming_parse(chunks: Iterable[AIMessageChunk]) -> Iterable[str]:
    for chunk in chunks:
        yield chunk.content.swapcase()

streaming_parse = RunnableGenerator(streaming_parse)

```API Reference:**[RunnableGenerator](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableGenerator.html) importantPlease wrap the streaming parser in RunnableGenerator as we may stop automatically upgrading it with the | syntax.

```python
chain = model | streaming_parse
chain.invoke("hello")

```**

```output
&#x27;hELLO!&#x27;

``` Let&#x27;s confirm that streaming works!

```python
for chunk in chain.stream("tell me about yourself in one sentence"):
    print(chunk, end="|", flush=True)

```

```output
i|&#x27;M| cLAUDE|,| AN| ai| ASSISTANT| CREATED| BY| aN|THROP|IC| TO| BE| HELPFUL|,| HARMLESS|,| AND| HONEST|.|

``` Inheriting from Parsing Base Classes[​](#inheriting-from-parsing-base-classes) Another approach to implement a parser is by inheriting from BaseOutputParser, BaseGenerationOutputParser or another one of the base parsers depending on what you need to do. In general, we do not** recommend this approach for most use cases as it results in more code to write without significant benefits. The simplest kind of output parser extends the BaseOutputParser class and must implement the following methods: parse: takes the string output from the model and parses it

- (optional) _type: identifies the name of the parser.

When the output from the chat model or LLM is malformed, the can throw an `OutputParserException` to indicate that parsing fails because of bad input. Using this exception allows code that utilizes the parser to handle the exceptions in a consistent manner.

Parsers are Runnables! 🏃Because `BaseOutputParser` implements the `Runnable` interface, any custom parser you will create this way will become valid LangChain Runnables and will benefit from automatic async support, batch interface, logging support etc.

### Simple Parser[​](#simple-parser)

Here&#x27;s a simple parser that can parse a **string** representation of a boolean (e.g., `YES` or `NO`) and convert it into the corresponding `boolean` type.

```python
from langchain_core.exceptions import OutputParserException
from langchain_core.output_parsers import BaseOutputParser

# The [bool] desribes a parameterization of a generic.
# It&#x27;s basically indicating what the return type of parse is
# in this case the return type is either True or False
class BooleanOutputParser(BaseOutputParser[bool]):
    """Custom boolean parser."""

    true_val: str = "YES"
    false_val: str = "NO"

    def parse(self, text: str) -> bool:
        cleaned_text = text.strip().upper()
        if cleaned_text not in (self.true_val.upper(), self.false_val.upper()):
            raise OutputParserException(
                f"BooleanOutputParser expected output value to either be "
                f"{self.true_val} or {self.false_val} (case-insensitive). "
                f"Received {cleaned_text}."
            )
        return cleaned_text == self.true_val.upper()

    @property
    def _type(self) -> str:
        return "boolean_output_parser"

```**API Reference:**[OutputParserException](https://python.langchain.com/api_reference/core/exceptions/langchain_core.exceptions.OutputParserException.html) | [BaseOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.base.BaseOutputParser.html)

```python
parser = BooleanOutputParser()
parser.invoke("YES")

```**

```output
True

```

```python
try:
    parser.invoke("MEOW")
except Exception as e:
    print(f"Triggered an exception of type: {type(e)}")

```

```output
Triggered an exception of type: <class &#x27;langchain_core.exceptions.OutputParserException&#x27;>

``` Let&#x27;s test changing the parameterization

```python
parser = BooleanOutputParser(true_val="OKAY")
parser.invoke("OKAY")

```

```output
True

``` Let&#x27;s confirm that other LCEL methods are present

```python
parser.batch(["OKAY", "NO"])

```

```output
[True, False]

```

```python
await parser.abatch(["OKAY", "NO"])

```

```output
[True, False]

```

```python
from langchain_anthropic.chat_models import ChatAnthropic

anthropic = ChatAnthropic(model_name="claude-2.1")
anthropic.invoke("say OKAY or NO")

```

```output
AIMessage(content=&#x27;OKAY&#x27;)

``` Let&#x27;s test that our parser works!

```python
chain = anthropic | parser
chain.invoke("say OKAY or NO")

```

```output
True

``` noteThe parser will work with either the output from an LLM (a string) or the output from a chat model (an AIMessage)! Parsing Raw Model Outputs[​](#parsing-raw-model-outputs) Sometimes there is additional metadata on the model output that is important besides the raw text. One example of this is tool calling, where arguments intended to be passed to called functions are returned in a separate property. If you need this finer-grained control, you can instead subclass the BaseGenerationOutputParser class. This class requires a single method parse_result. This method takes raw model output (e.g., list of Generation or ChatGeneration) and returns the parsed output. Supporting both Generation and ChatGeneration allows the parser to work with both regular LLMs as well as with Chat Models.

```python
from typing import List

from langchain_core.exceptions import OutputParserException
from langchain_core.messages import AIMessage
from langchain_core.output_parsers import BaseGenerationOutputParser
from langchain_core.outputs import ChatGeneration, Generation

class StrInvertCase(BaseGenerationOutputParser[str]):
    """An example parser that inverts the case of the characters in the message.

    This is an example parse shown just for demonstration purposes and to keep
    the example as simple as possible.
    """

    def parse_result(self, result: List[Generation], *, partial: bool = False) -> str:
        """Parse a list of model Generations into a specific format.

        Args:
            result: A list of Generations to be parsed. The Generations are assumed
                to be different candidate outputs for a single model input.
                Many parsers assume that only a single generation is passed it in.
                We will assert for that
            partial: Whether to allow partial results. This is used for parsers
                     that support streaming
        """
        if len(result) != 1:
            raise NotImplementedError(
                "This output parser can only be used with a single generation."
            )
        generation = result[0]
        if not isinstance(generation, ChatGeneration):
            # Say that this one only works with chat generations
            raise OutputParserException(
                "This output parser can only be used with a chat generation."
            )
        return generation.message.content.swapcase()

chain = anthropic | StrInvertCase()

```API Reference:**[OutputParserException](https://python.langchain.com/api_reference/core/exceptions/langchain_core.exceptions.OutputParserException.html) | [AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [BaseGenerationOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.base.BaseGenerationOutputParser.html) | [ChatGeneration](https://python.langchain.com/api_reference/core/outputs/langchain_core.outputs.chat_generation.ChatGeneration.html) | [Generation](https://python.langchain.com/api_reference/core/outputs/langchain_core.outputs.generation.Generation.html)

Let&#x27;s the new parser! It should be inverting the output from the model.

```python
chain.invoke("Tell me a short sentence about yourself")

```

```output
&#x27;hELLO! mY NAME IS cLAUDE.&#x27;

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/output_parser_custom.ipynb)

- [Runnable Lambdas and Generators](#runnable-lambdas-and-generators)
- [Inheriting from Parsing Base Classes](#inheriting-from-parsing-base-classes)[Simple Parser](#simple-parser)
- [Parsing Raw Model Outputs](#parsing-raw-model-outputs)

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