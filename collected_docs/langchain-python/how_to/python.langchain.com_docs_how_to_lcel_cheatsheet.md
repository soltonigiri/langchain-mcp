LangChain Expression Language Cheatsheet | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/lcel_cheatsheet.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/lcel_cheatsheet.ipynb)LangChain Expression Language Cheatsheet This is a quick reference for all the most important [LCEL](/docs/concepts/lcel/) primitives. For more advanced usage see the [LCEL how-to guides](/docs/how_to/#langchain-expression-language-lcel) and the [full API reference](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html). Invoke a runnable[​](#invoke-a-runnable) [Runnable.invoke()](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.invoke) / [Runnable.ainvoke()](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.ainvoke)[​](#runnableinvoke--runnableainvoke)

```python
from langchain_core.runnables import RunnableLambda

runnable = RunnableLambda(lambda x: str(x))
runnable.invoke(5)

# Async variant:
# await runnable.ainvoke(5)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
&#x27;5&#x27;

```**Batch a runnable[​](#batch-a-runnable) [Runnable.batch()](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.batch) / [Runnable.abatch()](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.abatch)[​](#runnablebatch--runnableabatch)

```python
from langchain_core.runnables import RunnableLambda

runnable = RunnableLambda(lambda x: str(x))
runnable.batch([7, 8, 9])

# Async variant:
# await runnable.abatch([7, 8, 9])

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
[&#x27;7&#x27;, &#x27;8&#x27;, &#x27;9&#x27;]

```**Stream a runnable[​](#stream-a-runnable) [Runnable.stream()](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.stream) / [Runnable.astream()](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.astream)[​](#runnablestream--runnableastream)

```python
from langchain_core.runnables import RunnableLambda

def func(x):
    for y in x:
        yield str(y)

runnable = RunnableLambda(func)

for chunk in runnable.stream(range(5)):
    print(chunk)

# Async variant:
# async for chunk in await runnable.astream(range(5)):
#     print(chunk)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
0
1
2
3
4

```**Compose runnables[​](#compose-runnables) Pipe operator |[​](#pipe-operator-)

```python
from langchain_core.runnables import RunnableLambda

runnable1 = RunnableLambda(lambda x: {"foo": x})
runnable2 = RunnableLambda(lambda x: [x] * 2)

chain = runnable1 | runnable2

chain.invoke(2)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
[{&#x27;foo&#x27;: 2}, {&#x27;foo&#x27;: 2}]

```**Invoke runnables in parallel[​](#invoke-runnables-in-parallel) [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)[​](#runnableparallel)

```python
from langchain_core.runnables import RunnableLambda, RunnableParallel

runnable1 = RunnableLambda(lambda x: {"foo": x})
runnable2 = RunnableLambda(lambda x: [x] * 2)

chain = RunnableParallel(first=runnable1, second=runnable2)

chain.invoke(2)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
{&#x27;first&#x27;: {&#x27;foo&#x27;: 2}, &#x27;second&#x27;: [2, 2]}

```**Turn any function into a runnable[​](#turn-any-function-into-a-runnable) [RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)[​](#runnablelambda)

```python
from langchain_core.runnables import RunnableLambda

def func(x):
    return x + 5

runnable = RunnableLambda(func)
runnable.invoke(2)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
7

```**Merge input and output dicts[​](#merge-input-and-output-dicts) [RunnablePassthrough.assign](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)[​](#runnablepassthroughassign)

```python
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

runnable1 = RunnableLambda(lambda x: x["foo"] + 7)

chain = RunnablePassthrough.assign(bar=runnable1)

chain.invoke({"foo": 10})

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
{&#x27;foo&#x27;: 10, &#x27;bar&#x27;: 17}

```**Include input dict in output dict[​](#include-input-dict-in-output-dict) [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)[​](#runnablepassthrough)

```python
from langchain_core.runnables import (
    RunnableLambda,
    RunnableParallel,
    RunnablePassthrough,
)

runnable1 = RunnableLambda(lambda x: x["foo"] + 7)

chain = RunnableParallel(bar=runnable1, baz=RunnablePassthrough())

chain.invoke({"foo": 10})

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
{&#x27;bar&#x27;: 17, &#x27;baz&#x27;: {&#x27;foo&#x27;: 10}}

```**Add default invocation args[​](#add-default-invocation-args) [Runnable.bind](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.bind)[​](#runnablebind)

```python
from typing import Optional

from langchain_core.runnables import RunnableLambda

def func(main_arg: dict, other_arg: Optional[str] = None) -> dict:
    if other_arg:
        return {**main_arg, **{"foo": other_arg}}
    return main_arg

runnable1 = RunnableLambda(func)
bound_runnable1 = runnable1.bind(other_arg="bye")

bound_runnable1.invoke({"bar": "hello"})

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
{&#x27;bar&#x27;: &#x27;hello&#x27;, &#x27;foo&#x27;: &#x27;bye&#x27;}

```**Add fallbacks[​](#add-fallbacks) [Runnable.with_fallbacks](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.with_fallbacks)[​](#runnablewith_fallbacks)

```python
from langchain_core.runnables import RunnableLambda

runnable1 = RunnableLambda(lambda x: x + "foo")
runnable2 = RunnableLambda(lambda x: str(x) + "foo")

chain = runnable1.with_fallbacks([runnable2])

chain.invoke(5)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
&#x27;5foo&#x27;

```**Add retries[​](#add-retries) [Runnable.with_retry](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.with_retry)[​](#runnablewith_retry)

```python
from langchain_core.runnables import RunnableLambda

counter = -1

def func(x):
    global counter
    counter += 1
    print(f"attempt with {counter=}")
    return x / counter

chain = RunnableLambda(func).with_retry(stop_after_attempt=2)

chain.invoke(2)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
attempt with counter=0
attempt with counter=1

```**

```output
2.0

``` Configure runnable execution[​](#configure-runnable-execution) [RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html)[​](#runnableconfig)

```python
from langchain_core.runnables import RunnableLambda, RunnableParallel

runnable1 = RunnableLambda(lambda x: {"foo": x})
runnable2 = RunnableLambda(lambda x: [x] * 2)
runnable3 = RunnableLambda(lambda x: str(x))

chain = RunnableParallel(first=runnable1, second=runnable2, third=runnable3)

chain.invoke(7, config={"max_concurrency": 2})

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
{&#x27;first&#x27;: {&#x27;foo&#x27;: 7}, &#x27;second&#x27;: [7, 7], &#x27;third&#x27;: &#x27;7&#x27;}

```**Add default config to runnable[​](#add-default-config-to-runnable) [Runnable.with_config](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.with_config)[​](#runnablewith_config)

```python
from langchain_core.runnables import RunnableLambda, RunnableParallel

runnable1 = RunnableLambda(lambda x: {"foo": x})
runnable2 = RunnableLambda(lambda x: [x] * 2)
runnable3 = RunnableLambda(lambda x: str(x))

chain = RunnableParallel(first=runnable1, second=runnable2, third=runnable3)
configured_chain = chain.with_config(max_concurrency=2)

chain.invoke(7)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
{&#x27;first&#x27;: {&#x27;foo&#x27;: 7}, &#x27;second&#x27;: [7, 7], &#x27;third&#x27;: &#x27;7&#x27;}

```**Make runnable attributes configurable[​](#make-runnable-attributes-configurable) [Runnable.with_configurable_fields](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableSerializable.html#langchain_core.runnables.base.RunnableSerializable.configurable_fields)[​](#runnablewith_configurable_fields)

```python
from typing import Any, Optional

from langchain_core.runnables import (
    ConfigurableField,
    RunnableConfig,
    RunnableSerializable,
)

class FooRunnable(RunnableSerializable[dict, dict]):
    output_key: str

    def invoke(
        self, input: Any, config: Optional[RunnableConfig] = None, **kwargs: Any
    ) -> list:
        return self._call_with_config(self.subtract_seven, input, config, **kwargs)

    def subtract_seven(self, input: dict) -> dict:
        return {self.output_key: input["foo"] - 7}

runnable1 = FooRunnable(output_key="bar")
configurable_runnable1 = runnable1.configurable_fields(
    output_key=ConfigurableField(id="output_key")
)

configurable_runnable1.invoke(
    {"foo": 10}, config={"configurable": {"output_key": "not bar"}}
)

```API Reference:**[ConfigurableField](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.utils.ConfigurableField.html) | [RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html) | [RunnableSerializable](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableSerializable.html)

```output
{&#x27;not bar&#x27;: 3}

```**

```python
configurable_runnable1.invoke({"foo": 10})

```

```output
{&#x27;bar&#x27;: 3}

``` Make chain components configurable[​](#make-chain-components-configurable) [Runnable.with_configurable_alternatives](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableSerializable.html#langchain_core.runnables.base.RunnableSerializable.configurable_alternatives)[​](#runnablewith_configurable_alternatives)

```python
from typing import Any, Optional

from langchain_core.runnables import RunnableConfig, RunnableLambda, RunnableParallel

class ListRunnable(RunnableSerializable[Any, list]):
    def invoke(
        self, input: Any, config: Optional[RunnableConfig] = None, **kwargs: Any
    ) -> list:
        return self._call_with_config(self.listify, input, config, **kwargs)

    def listify(self, input: Any) -> list:
        return [input]

class StrRunnable(RunnableSerializable[Any, str]):
    def invoke(
        self, input: Any, config: Optional[RunnableConfig] = None, **kwargs: Any
    ) -> list:
        return self._call_with_config(self.strify, input, config, **kwargs)

    def strify(self, input: Any) -> str:
        return str(input)

runnable1 = RunnableLambda(lambda x: {"foo": x})

configurable_runnable = ListRunnable().configurable_alternatives(
    ConfigurableField(id="second_step"), default_key="list", string=StrRunnable()
)
chain = runnable1 | configurable_runnable

chain.invoke(7, config={"configurable": {"second_step": "string"}})

```API Reference:**[RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html) | [RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
"{&#x27;foo&#x27;: 7}"

```**

```python
chain.invoke(7)

```

```output
[{&#x27;foo&#x27;: 7}]

``` Build a chain dynamically based on input[​](#build-a-chain-dynamically-based-on-input)

```python
from langchain_core.runnables import RunnableLambda, RunnableParallel

runnable1 = RunnableLambda(lambda x: {"foo": x})
runnable2 = RunnableLambda(lambda x: [x] * 2)

chain = RunnableLambda(lambda x: runnable1 if x > 6 else runnable2)

chain.invoke(7)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
{&#x27;foo&#x27;: 7}

```**

```python
chain.invoke(5)

```

```output
[5, 5]

``` Generate a stream of events[​](#generate-a-stream-of-events) [Runnable.astream_events](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.astream_events)[​](#runnableastream_events)

```python
# | echo: false

import nest_asyncio

nest_asyncio.apply()

```

```python
from langchain_core.runnables import RunnableLambda, RunnableParallel

runnable1 = RunnableLambda(lambda x: {"foo": x}, name="first")

async def func(x):
    for _ in range(5):
        yield x

runnable2 = RunnableLambda(func, name="second")

chain = runnable1 | runnable2

async for event in chain.astream_events("bar", version="v2"):
    print(f"event={event[&#x27;event&#x27;]} | name={event[&#x27;name&#x27;]} | data={event[&#x27;data&#x27;]}")

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
event=on_chain_start | name=RunnableSequence | data={&#x27;input&#x27;: &#x27;bar&#x27;}
event=on_chain_start | name=first | data={}
event=on_chain_stream | name=first | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_start | name=second | data={}
event=on_chain_end | name=first | data={&#x27;output&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}, &#x27;input&#x27;: &#x27;bar&#x27;}
event=on_chain_stream | name=second | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_stream | name=RunnableSequence | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_stream | name=second | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_stream | name=RunnableSequence | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_stream | name=second | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_stream | name=RunnableSequence | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_stream | name=second | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_stream | name=RunnableSequence | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_stream | name=second | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_stream | name=RunnableSequence | data={&#x27;chunk&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_end | name=second | data={&#x27;output&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}, &#x27;input&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}
event=on_chain_end | name=RunnableSequence | data={&#x27;output&#x27;: {&#x27;foo&#x27;: &#x27;bar&#x27;}}

```**Yield batched outputs as they complete[​](#yield-batched-outputs-as-they-complete) [Runnable.batch_as_completed](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.batch_as_completed) / [Runnable.abatch_as_completed](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.abatch_as_completed)[​](#runnablebatch_as_completed--runnableabatch_as_completed)

```python
import time

from langchain_core.runnables import RunnableLambda, RunnableParallel

runnable1 = RunnableLambda(lambda x: time.sleep(x) or print(f"slept {x}"))

for idx, result in runnable1.batch_as_completed([5, 1]):
    print(idx, result)

# Async variant:
# async for idx, result in runnable1.abatch_as_completed([5, 1]):
#     print(idx, result)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
slept 1
1 None
slept 5
0 None

```**Return subset of output dict[​](#return-subset-of-output-dict) [Runnable.pick](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.pick)[​](#runnablepick)

```python
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

runnable1 = RunnableLambda(lambda x: x["baz"] + 5)
chain = RunnablePassthrough.assign(foo=runnable1).pick(["foo", "bar"])

chain.invoke({"bar": "hi", "baz": 2})

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```output
{&#x27;foo&#x27;: 7, &#x27;bar&#x27;: &#x27;hi&#x27;}

```**Declaratively make a batched version of a runnable[​](#declaratively-make-a-batched-version-of-a-runnable) [Runnable.map](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.map)[​](#runnablemap)

```python
from langchain_core.runnables import RunnableLambda

runnable1 = RunnableLambda(lambda x: list(range(x)))
runnable2 = RunnableLambda(lambda x: x + 5)

chain = runnable1 | runnable2.map()

chain.invoke(3)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
[5, 6, 7]

```**Get a graph representation of a runnable[​](#get-a-graph-representation-of-a-runnable) [Runnable.get_graph](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.get_graph)[​](#runnableget_graph)

```python
from langchain_core.runnables import RunnableLambda, RunnableParallel

runnable1 = RunnableLambda(lambda x: {"foo": x})
runnable2 = RunnableLambda(lambda x: [x] * 2)
runnable3 = RunnableLambda(lambda x: str(x))

chain = runnable1 | RunnableParallel(second=runnable2, third=runnable3)

chain.get_graph().print_ascii()

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
+-------------+
                             | LambdaInput |
                             +-------------+
                                    *
                                    *
                                    *
                    +------------------------------+
                    | Lambda(lambda x: {&#x27;foo&#x27;: x}) |
                    +------------------------------+
                                    *
                                    *
                                    *
                     +-----------------------------+
                     | Parallel<second,third>Input |
                     +-----------------------------+
                        ****                  ***
                    ****                         ****
                  **                                 **
+---------------------------+               +--------------------------+
| Lambda(lambda x: [x] * 2) |               | Lambda(lambda x: str(x)) |
+---------------------------+               +--------------------------+
                        ****                  ***
                            ****          ****
                                **      **
                    +------------------------------+
                    | Parallel<second,third>Output |
                    +------------------------------+

```**Get all prompts in a chain[​](#get-all-prompts-in-a-chain) [Runnable.get_prompts](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.get_prompts)[​](#runnableget_prompts)

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda

prompt1 = ChatPromptTemplate.from_messages(
    [("system", "good ai"), ("human", "{input}")]
)
prompt2 = ChatPromptTemplate.from_messages(
    [
        ("system", "really good ai"),
        ("human", "{input}"),
        ("ai", "{ai_output}"),
        ("human", "{input2}"),
    ]
)
fake_llm = RunnableLambda(lambda prompt: "i am good ai")
chain = prompt1.assign(ai_output=fake_llm) | prompt2 | fake_llm

for i, prompt in enumerate(chain.get_prompts()):
    print(f"**prompt {i=}**\n")
    print(prompt.pretty_repr())
    print("\n" * 3)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) | [RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```output
**prompt i=0**

================================ System Message ================================

good ai

================================ Human Message =================================

{input}

**prompt i=1**

================================ System Message ================================

really good ai

================================ Human Message =================================

{input}

================================== AI Message ==================================

{ai_output}

================================ Human Message =================================

{input2}

```**Add lifecycle listeners[​](#add-lifecycle-listeners) [Runnable.with_listeners](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html#langchain_core.runnables.base.Runnable.with_listeners)[​](#runnablewith_listeners)

```python
import time

from langchain_core.runnables import RunnableLambda
from langchain_core.tracers.schemas import Run

def on_start(run_obj: Run):
    print("start_time:", run_obj.start_time)

def on_end(run_obj: Run):
    print("end_time:", run_obj.end_time)

runnable1 = RunnableLambda(lambda x: time.sleep(x))
chain = runnable1.with_listeners(on_start=on_start, on_end=on_end)
chain.invoke(2)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [Run](https://python.langchain.com/api_reference/langsmith/run_trees/langsmith.run_trees.Run.html)

```output
start_time: 2024-05-17 23:04:00.951065+00:00
end_time: 2024-05-17 23:04:02.958765+00:00

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/lcel_cheatsheet.ipynb)[Invoke a runnable](#invoke-a-runnable)
- [Batch a runnable](#batch-a-runnable)
- [Stream a runnable](#stream-a-runnable)
- [Compose runnables](#compose-runnables)
- [Invoke runnables in parallel](#invoke-runnables-in-parallel)
- [Turn any function into a runnable](#turn-any-function-into-a-runnable)
- [Merge input and output dicts](#merge-input-and-output-dicts)
- [Include input dict in output dict](#include-input-dict-in-output-dict)
- [Add default invocation args](#add-default-invocation-args)
- [Add fallbacks](#add-fallbacks)
- [Add retries](#add-retries)
- [Configure runnable execution](#configure-runnable-execution)
- [Add default config to runnable](#add-default-config-to-runnable)
- [Make runnable attributes configurable](#make-runnable-attributes-configurable)
- [Make chain components configurable](#make-chain-components-configurable)
- [Build a chain dynamically based on input](#build-a-chain-dynamically-based-on-input)
- [Generate a stream of events](#generate-a-stream-of-events)
- [Yield batched outputs as they complete](#yield-batched-outputs-as-they-complete)
- [Return subset of output dict](#return-subset-of-output-dict)
- [Declaratively make a batched version of a runnable](#declaratively-make-a-batched-version-of-a-runnable)
- [Get a graph representation of a runnable](#get-a-graph-representation-of-a-runnable)
- [Get all prompts in a chain](#get-all-prompts-in-a-chain)
- [Add lifecycle listeners](#add-lifecycle-listeners)

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