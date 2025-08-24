How to select examples by length | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to select examples by lengthPrerequisitesThis guide assumes familiarity with the following concepts:Prompt templates](/docs/concepts/prompt_templates)
- [Example selectors](/docs/how_to/example_selectors)

This example selector selects which examples to use based on length. This is useful when you are worried about constructing a prompt that will go over the length of the context window. For longer inputs, it will select fewer examples to include, while for shorter inputs it will select more.

```typescript
import { PromptTemplate, FewShotPromptTemplate } from "@langchain/core/prompts";
import { LengthBasedExampleSelector } from "@langchain/core/example_selectors";

export async function run() {
  // Create a prompt template that will be used to format the examples.
  const examplePrompt = new PromptTemplate({
    inputVariables: ["input", "output"],
    template: "Input: {input}\nOutput: {output}",
  });

  // Create a LengthBasedExampleSelector that will be used to select the examples.
  const exampleSelector = await LengthBasedExampleSelector.fromExamples(
    [
      { input: "happy", output: "sad" },
      { input: "tall", output: "short" },
      { input: "energetic", output: "lethargic" },
      { input: "sunny", output: "gloomy" },
      { input: "windy", output: "calm" },
    ],
    {
      examplePrompt,
      maxLength: 25,
    }
  );

  // Create a FewShotPromptTemplate that will use the example selector.
  const dynamicPrompt = new FewShotPromptTemplate({
    // We provide an ExampleSelector instead of examples.
    exampleSelector,
    examplePrompt,
    prefix: "Give the antonym of every input",
    suffix: "Input: {adjective}\nOutput:",
    inputVariables: ["adjective"],
  });

  // An example with small input, so it selects all examples.
  console.log(await dynamicPrompt.format({ adjective: "big" }));
  /*
   Give the antonym of every input

   Input: happy
   Output: sad

   Input: tall
   Output: short

   Input: energetic
   Output: lethargic

   Input: sunny
   Output: gloomy

   Input: windy
   Output: calm

   Input: big
   Output:
   */

  // An example with long input, so it selects only one example.
  const longString =
    "big and huge and massive and large and gigantic and tall and much much much much much bigger than everything else";
  console.log(await dynamicPrompt.format({ adjective: longString }));
  /*
   Give the antonym of every input

   Input: happy
   Output: sad

   Input: big and huge and massive and large and gigantic and tall and much much much much much bigger than everything else
   Output:
   */
}

```

#### API Reference: - PromptTemplate from @langchain/core/prompts - FewShotPromptTemplate from @langchain/core/prompts - LengthBasedExampleSelector from @langchain/core/example_selectors ## Next steps[​](#next-steps) You&#x27;ve now learned a bit about using a length based example selector.

Next, check out this guide on how to use a [similarity based example selector](/docs/how_to/example_selectors_similarity).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Next steps](#next-steps)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.