How to compose prompts together | 🦜️🔗 Langchain
- *[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to compose prompts togetherPrerequisitesThis guide assumes familiarity with the following concepts:Prompt templates](/docs/concepts/prompt_templates)LangChain provides a user friendly interface for composing different parts of prompts together. You can do this with either string prompts or chat prompts. Constructing prompts this way allows for easy reuse of components.String prompt composition[​](#string-prompt-composition)When working with string prompts, each template is joined together. You can work with either prompts directly or strings (the first element in the list needs to be a prompt).

```typescript
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate(
  `Tell me a joke about {topic}, make it funny and in {language}`
);

prompt;

```

```text
PromptTemplate {
  lc_serializable: true,
  lc_kwargs: {
    inputVariables: [ "topic", "language" ],
    templateFormat: "f-string",
    template: "Tell me a joke about {topic}, make it funny and in {language}"
  },
  lc_runnable: true,
  name: undefined,
  lc_namespace: [ "langchain_core", "prompts", "prompt" ],
  inputVariables: [ "topic", "language" ],
  outputParser: undefined,
  partialVariables: undefined,
  templateFormat: "f-string",
  template: "Tell me a joke about {topic}, make it funny and in {language}",
  validateTemplate: true
}

```

```typescript
await prompt.format({ topic: "sports", language: "spanish" });

```

```text
"Tell me a joke about sports, make it funny and in spanish"

```Chat prompt composition[​](#chat-prompt-composition)A chat prompt is made up a of a list of messages. Similarly to the above example, we can concatenate chat prompt templates. Each new element is a new message in the final prompt.First, let’s initialize the a [ChatPromptTemplate](https://api.python.langchain.com/en/latest/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) with a [SystemMessage](https://api.python.langchain.com/en/latest/messages/langchain_core.messages.system.SystemMessage.html).

```typescript
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

const prompt = new SystemMessage("You are a nice pirate");

```You can then easily create a pipeline combining it with other messages or* message templates. Use a BaseMessage when there are no variables to be formatted, use a MessageTemplate when there are variables to be formatted. You can also use just a string (note: this will automatically get inferred as a [HumanMessagePromptTemplate](https://api.js.langchain.com/classes/langchain_core.prompts.HumanMessagePromptTemplate.html).)

```typescript
import { HumanMessagePromptTemplate } from "@langchain/core/prompts";

const newPrompt = HumanMessagePromptTemplate.fromTemplate([
  prompt,
  new HumanMessage("Hi"),
  new AIMessage("what?"),
  "{input}",
]);

```Under the hood, this creates an instance of the ChatPromptTemplate class, so you can use it just as you did before!

```typescript
await newPrompt.formatMessages({ input: "i said hi" });

```

```text
[
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: [
        { type: "text", text: "You are a nice pirate" },
        { type: "text", text: "Hi" },
        { type: "text", text: "what?" },
        { type: "text", text: "i said hi" }
      ],
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: [
      { type: "text", text: "You are a nice pirate" },
      { type: "text", text: "Hi" },
      { type: "text", text: "what?" },
      { type: "text", text: "i said hi" }
    ],
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  }
]

``` ## Using PipelinePrompt[​](#using-pipelineprompt) LangChain includes a class called [PipelinePromptTemplate](https://api.js.langchain.com/classes/_langchain_core.prompts.PipelinePromptTemplate.html), which can be useful when you want to reuse parts of prompts. A PipelinePrompt consists of two main parts:Final prompt: The final prompt that is returned
- Pipeline prompts: A list of tuples, consisting of a string name and a prompt template. Each prompt template will be formatted and then passed to future prompt templates as a variable with the same name.

```typescript
import {
  PromptTemplate,
  PipelinePromptTemplate,
} from "@langchain/core/prompts";

const fullPrompt = PromptTemplate.fromTemplate(`{introduction}

{example}

{start}`);

const introductionPrompt = PromptTemplate.fromTemplate(
  `You are impersonating {person}.`
);

const examplePrompt =
  PromptTemplate.fromTemplate(`Here&#x27;s an example of an interaction:
Q: {example_q}
A: {example_a}`);

const startPrompt = PromptTemplate.fromTemplate(`Now, do this for real!
Q: {input}
A:`);

const composedPrompt = new PipelinePromptTemplate({
  pipelinePrompts: [
    {
      name: "introduction",
      prompt: introductionPrompt,
    },
    {
      name: "example",
      prompt: examplePrompt,
    },
    {
      name: "start",
      prompt: startPrompt,
    },
  ],
  finalPrompt: fullPrompt,
});

```

```typescript
const formattedPrompt = await composedPrompt.format({
  person: "Elon Musk",
  example_q: `What&#x27;s your favorite car?`,
  example_a: "Telsa",
  input: `What&#x27;s your favorite social media site?`,
});

console.log(formattedPrompt);

```

```text
You are impersonating Elon Musk.

Here&#x27;s an example of an interaction:
Q: What&#x27;s your favorite car?
A: Telsa

Now, do this for real!
Q: What&#x27;s your favorite social media site?
A:

``` ## Next steps[​](#next-steps) You’ve now learned how to compose prompts together.

Next, check out the other how-to guides on prompt templates in this section, like [adding few-shot examples to your prompt templates](/docs/how_to/few_shot_examples_chat).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [String prompt composition](#string-prompt-composition)
- [Chat prompt composition](#chat-prompt-composition)
- [Using PipelinePrompt](#using-pipelineprompt)
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