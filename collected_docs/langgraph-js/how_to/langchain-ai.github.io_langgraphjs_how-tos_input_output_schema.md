- How to define input/output schema for your graph [Skip to content](#how-to-define-inputoutput-schema-for-your-graph) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [Other](../../how-tos#other)

- [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent)

- [LangGraph Platform](../../how-tos#langgraph-platform)

- [Concepts](../../concepts/)

- [Tutorials](../../tutorials/)

- Resources

- [Agents](../../agents/overview/)

- [API reference](../../reference/)

- [Versions](../../versions/)

[How to define input/output schema for your graph¶](#how-to-define-inputoutput-schema-for-your-graph)

By default, `StateGraph` takes in a single schema and all nodes are expected to communicate with that schema. However, it is also possible to define explicit input and output schemas for a graph. This is helpful if you want to draw a distinction between input and output keys.

In this notebook we'll walk through an example of this. At a high level, in order to do this you simply have to pass in separate [Annotation.Root({})](https://langchain-ai.github.io/langgraphjs/reference/functions/langgraph.Annotation.Root.html) objects as `{ input: Annotation.Root({}), output: Annotation.Root({}) }` when defining the graph. Let's see an example below!

```
import { Annotation, StateGraph } from "@langchain/langgraph";

const InputAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const OutputAnnotation = Annotation.Root({
  answer: Annotation<string>,
});

const answerNode = (_state: typeof InputAnnotation.State) => {
  return { answer: "bye" };
};

const graph = new StateGraph({
  input: InputAnnotation,
  output: OutputAnnotation,
})
  .addNode("answerNode", answerNode)
  .addEdge("__start__", "answerNode")
  .compile();

await graph.invoke({
  question: "hi",
});

```

```
{ answer: 'bye' }

``` Notice that the output of invoke only includes the output schema.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)