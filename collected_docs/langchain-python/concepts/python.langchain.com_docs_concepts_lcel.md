LangChain Expression Language (LCEL) | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/lcel.mdx)LangChain Expression Language (LCEL) Prerequisites [Runnable Interface](/docs/concepts/runnables/) The L**ang**C**hain **E**xpression **L**anguage (LCEL) takes a [declarative](https://en.wikipedia.org/wiki/Declarative_programming) approach to building new [Runnables](/docs/concepts/runnables/) from existing Runnables. This means that you describe what *should* happen, rather than *how* it should happen, allowing LangChain to optimize the run-time execution of the chains. We often refer to a Runnable created using LCEL as a "chain". It&#x27;s important to remember that a "chain" is Runnable and it implements the full [Runnable Interface](/docs/concepts/runnables/). note The [LCEL cheatsheet](/docs/how_to/lcel_cheatsheet/) shows common patterns that involve the Runnable interface and LCEL expressions.

- Please see the following list of [how-to guides](/docs/how_to/#langchain-expression-language-lcel) that cover common tasks with LCEL.

- A list of built-in Runnables can be found in the [LangChain Core API Reference](https://python.langchain.com/api_reference/core/runnables.html). Many of these Runnables are useful when composing custom "chains" in LangChain using LCEL.

## Benefits of LCEL[​](#benefits-of-lcel)

LangChain optimizes the run-time execution of chains built with LCEL in a number of ways:

- **Optimized parallel execution**: Run Runnables in parallel using [RunnableParallel](#runnableparallel) or run multiple inputs through a given chain in parallel using the [Runnable Batch API](/docs/concepts/runnables/#optimized-parallel-execution-batch). Parallel execution can significantly reduce the latency as processing can be done in parallel instead of sequentially.

- **Guaranteed Async support**: Any chain built with LCEL can be run asynchronously using the [Runnable Async API](/docs/concepts/runnables/#asynchronous-support). This can be useful when running chains in a server environment where you want to handle large number of requests concurrently.

- **Simplify streaming**: LCEL chains can be streamed, allowing for incremental output as the chain is executed. LangChain can optimize the streaming of the output to minimize the time-to-first-token(time elapsed until the first chunk of output from a [chat model](/docs/concepts/chat_models/) or [llm](/docs/concepts/text_llms/) comes out).

Other benefits include:

- [Seamless LangSmith tracing](https://docs.smith.langchain.com) As your chains get more and more complex, it becomes increasingly important to understand what exactly is happening at every step. With LCEL, **all** steps are automatically logged to [LangSmith](https://docs.smith.langchain.com/) for maximum observability and debuggability.

- **Standard API**: Because all chains are built using the Runnable interface, they can be used in the same way as any other Runnable.

- [Deployable with LangServe](/docs/concepts/architecture/#langserve): Chains built with LCEL can be deployed using for production use.

## Should I use LCEL?[​](#should-i-use-lcel)

LCEL is an [orchestration solution](https://en.wikipedia.org/wiki/Orchestration_(computing)) -- it allows LangChain to handle run-time execution of chains in an optimized way.

While we have seen users run chains with hundreds of steps in production, we generally recommend using LCEL for simpler orchestration tasks. When the application requires complex state management, branching, cycles or multiple agents, we recommend that users take advantage of [LangGraph](/docs/concepts/architecture/#langgraph).

In LangGraph, users define graphs that specify the application&#x27;s flow. This allows users to keep using LCEL within individual nodes when LCEL is needed, while making it easy to define complex orchestration logic that is more readable and maintainable.

Here are some guidelines:

- If you are making a single LLM call, you don&#x27;t need LCEL; instead call the underlying [chat model](/docs/concepts/chat_models/) directly.

- If you have a simple chain (e.g., prompt + llm + parser, simple retrieval set up etc.), LCEL is a reasonable fit, if you&#x27;re taking advantage of the LCEL benefits.

- If you&#x27;re building a complex chain (e.g., with branching, cycles, multiple agents, etc.) use [LangGraph](/docs/concepts/architecture/#langgraph) instead. Remember that you can always use LCEL within individual nodes in LangGraph.

## Composition Primitives[​](#composition-primitives)

`LCEL` chains are built by composing existing `Runnables` together. The two main composition primitives are [RunnableSequence](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableSequence.html#langchain_core.runnables.base.RunnableSequence) and [RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html#langchain_core.runnables.base.RunnableParallel).

Many other composition primitives (e.g., [RunnableAssign](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnableAssign.html#langchain_core.runnables.passthrough.RunnableAssign)) can be thought of as variations of these two primitives.

noteYou can find a list of all composition primitives in the [LangChain Core API Reference](https://python.langchain.com/api_reference/core/runnables.html).

### RunnableSequence[​](#runnablesequence)

`RunnableSequence` is a composition primitive that allows you "chain" multiple runnables sequentially, with the output of one runnable serving as the input to the next.

```python
from langchain_core.runnables import RunnableSequence
chain = RunnableSequence([runnable1, runnable2])

```**API Reference:**[RunnableSequence](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableSequence.html)

Invoking the `chain` with some input:

```python
final_output = chain.invoke(some_input)

```**corresponds to the following:

```python
output1 = runnable1.invoke(some_input)
final_output = runnable2.invoke(output1)

``` noterunnable1 and runnable2 are placeholders for any Runnable that you want to chain together. RunnableParallel[​](#runnableparallel) RunnableParallel is a composition primitive that allows you to run multiple runnables concurrently, with the same input provided to each.

```python
from langchain_core.runnables import RunnableParallel
chain = RunnableParallel({
    "key1": runnable1,
    "key2": runnable2,
})

```API Reference:**[RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

Invoking the `chain` with some input:

```python
final_output = chain.invoke(some_input)

```

Will yield a `final_output` dictionary with the same keys as the input dictionary, but with the values replaced by the output of the corresponding runnable.

```python
{
    "key1": runnable1.invoke(some_input),
    "key2": runnable2.invoke(some_input),
}

```

Recall, that the runnables are executed in parallel, so while the result is the same as dictionary comprehension shown above, the execution time is much faster.

note`RunnableParallel`supports both synchronous and asynchronous execution (as all `Runnables` do).

- For synchronous execution, RunnableParallel uses a [ThreadPoolExecutor](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor) to run the runnables concurrently.

- For asynchronous execution, RunnableParallel uses [asyncio.gather](https://docs.python.org/3/library/asyncio.html#asyncio.gather) to run the runnables concurrently.

## Composition Syntax[​](#composition-syntax)

The usage of `RunnableSequence` and `RunnableParallel` is so common that we created a shorthand syntax for using them. This helps to make the code more readable and concise.

### The | operator[​](#the--operator)

We have [overloaded](https://docs.python.org/3/reference/datamodel.html#special-method-names) the `|` operator to create a `RunnableSequence` from two `Runnables`.

```python
chain = runnable1 | runnable2

```

is Equivalent to:

```python
chain = RunnableSequence([runnable1, runnable2])

```

### The .pipe method[​](#the-pipe-method) If you have moral qualms with operator overloading, you can use the `.pipe` method instead. This is equivalent to the `|` operator.

```python
chain = runnable1.pipe(runnable2)

```

### Coercion[​](#coercion) LCEL applies automatic type coercion to make it easier to compose chains.

If you do not understand the type coercion, you can always use the `RunnableSequence` and `RunnableParallel` classes directly.

This will make the code more verbose, but it will also make it more explicit.

#### Dictionary to RunnableParallel[​](#dictionary-to-runnableparallel)

Inside an LCEL expression, a dictionary is automatically converted to a `RunnableParallel`.

For example, the following code:

```python
mapping = {
    "key1": runnable1,
    "key2": runnable2,
}

chain = mapping | runnable3

```

It gets automatically converted to the following:

```python
chain = RunnableSequence([RunnableParallel(mapping), runnable3])

```

cautionYou have to be careful because the `mapping` dictionary is not a `RunnableParallel` object, it is just a dictionary. This means that the following code will raise an `AttributeError`:

```python
mapping.invoke(some_input)

```

#### Function to RunnableLambda[​](#function-to-runnablelambda) Inside an LCEL expression, a function is automatically converted to a `RunnableLambda`.

```text
def some_func(x):
    return x

chain = some_func | runnable1

```

It gets automatically converted to the following:

```python
chain = RunnableSequence([RunnableLambda(some_func), runnable1])

```

cautionYou have to be careful because the lambda function is not a `RunnableLambda` object, it is just a function. This means that the following code will raise an `AttributeError`:

```python
lambda x: x + 1.invoke(some_input)

```

## Legacy chains[​](#legacy-chains) LCEL aims to provide consistency around behavior and customization over legacy subclassed chains such as `LLMChain` and `ConversationalRetrievalChain`. Many of these legacy chains hide important details like prompts, and as a wider variety of viable models emerge, customization has become more and more important.

If you are currently using one of these legacy chains, please see [this guide for guidance on how to migrate](/docs/versions/migrating_chains/).

For guides on how to do specific tasks with LCEL, check out [the relevant how-to guides](/docs/how_to/#langchain-expression-language-lcel).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/lcel.mdx)

- [Benefits of LCEL](#benefits-of-lcel)
- [Should I use LCEL?](#should-i-use-lcel)
- [Composition Primitives](#composition-primitives)[RunnableSequence](#runnablesequence)
- [RunnableParallel](#runnableparallel)

- [Composition Syntax](#composition-syntax)[The | operator](#the--operator)
- [The .pipe method](#the-pipe-method)
- [Coercion](#coercion)

- [Legacy chains](#legacy-chains)

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