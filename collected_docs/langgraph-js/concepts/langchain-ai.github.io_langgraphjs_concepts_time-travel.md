- Time Travel ⏱️ **[Skip to content](#time-travel) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) [Time Travel ⏱️¶](#time-travel) Prerequisites This guide assumes that you are familiar with LangGraph's checkpoints and states. If not, please review the [persistence](../persistence/) concept first. When working with non-deterministic systems that make model-based decisions (e.g., agents powered by LLMs), it can be useful to examine their decision-making process in detail: 🤔 Understand Reasoning**: Analyze the steps that led to a successful result.

- 🐞 **Debug Mistakes**: Identify where and why errors occurred.

- 🔍 **Explore Alternatives**: Test different paths to uncover better solutions.

We call these debugging techniques **Time Travel**, composed of two key actions: [Replaying](#replaying) 🔁 and [Forking](#forking) 🔀.

## Replaying[¶](#replaying)

![ ](../img/human_in_the_loop/replay.png)

Replaying allows us to revisit and reproduce an agent's past actions. This can be done either from the current state (or checkpoint) of the graph or from a specific checkpoint.

To replay from the current state, simply pass `null` as the input along with a `threadConfig`:

```
const threadConfig = { configurable: { thread_id: "1" }, streamMode: "values" };

for await (const event of await graph.stream(null, threadConfig)) {
    console.log(event);
}

```

To replay actions from a specific checkpoint, start by retrieving all checkpoints for the thread:

```
const allCheckpoints = [];

for await (const state of graph.getStateHistory(threadConfig)) {
    allCheckpoints.push(state);
}

```

Each checkpoint has a unique ID. After identifying the desired checkpoint, for instance, `xyz`, include its ID in the configuration:

```
const threadConfig = { configurable: { thread_id: '1', checkpoint_id: 'xyz' }, streamMode: "values" };

for await (const event of await graph.stream(null, threadConfig)) {
    console.log(event);
}

```

The graph efficiently replays previously executed nodes instead of re-executing them, leveraging its awareness of prior checkpoint executions.

## Forking[¶](#forking)

![ ](../img/human_in_the_loop/forking.png)

Forking allows you to revisit an agent's past actions and explore alternative paths within the graph.

To edit a specific checkpoint, such as `xyz`, provide its `checkpoint_id` when updating the graph's state:

```
const threadConfig = { configurable: { thread_id: "1", checkpoint_id: "xyz" } };

graph.updateState(threadConfig, { state: "updated state" });

```

This creates a new forked checkpoint, xyz-fork, from which you can continue running the graph:

```
const threadConfig = { configurable: { thread_id: '1', checkpoint_id: 'xyz-fork' }, streamMode: "values" };

for await (const event of await graph.stream(null, threadConfig)) {
    console.log(event);
}

```

## Additional Resources 📚[¶](#additional-resources)

- [Conceptual Guide: Persistence](https://langchain-ai.github.io/langgraphjs/concepts/persistence/#replay): Read the persistence guide for more context on replaying.

- [How to View and Update Past Graph State](/langgraphjs/how-tos/time-travel): Step-by-step instructions for working with graph state that demonstrate the **replay** and **fork** actions.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)