How to route execution within a chain | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to route execution within a chainPrerequisitesThis guide assumes familiarity with the following concepts:LangChain Expression Language (LCEL)](/docs/concepts/lcel)
- [Chaining runnables](/docs/how_to/sequence/)
- [Configuring chain parameters at runtime](/docs/how_to/binding)
- [Prompt templates](/docs/concepts/prompt_templates)
- [Chat Messages](/docs/concepts/messages)

This guide covers how to do routing in the LangChain Expression Language.

Routing allows you to create non-deterministic chains where the output of a previous step defines the next step. Routing helps provide structure and consistency around interactions with LLMs.

There are two ways to perform routing:

- Conditionally return runnables from a [RunnableLambda](/docs/how_to/functions) (recommended)
- Using a RunnableBranch (legacy)

We&#x27;ll illustrate both methods using a two step sequence where the first step classifies an input question as being about LangChain, Anthropic, or Other, then routes to a corresponding prompt chain.

## Using a custom function[​](#using-a-custom-function)

You can use a custom function to route between different outputs. Here&#x27;s an example:

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

- npm
- Yarn
- pnpm

```bash
npm install @langchain/anthropic @langchain/core

```

```bash
yarn add @langchain/anthropic @langchain/core

```

```bash
pnpm add @langchain/anthropic @langchain/core

```

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatAnthropic } from "@langchain/anthropic";

const promptTemplate =
  ChatPromptTemplate.fromTemplate(`Given the user question below, classify it as either being about \`LangChain\`, \`Anthropic\`, or \`Other\`.

Do not respond with more than one word.

<question>
{question}
</question>

Classification:`);

const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
});

const classificationChain = RunnableSequence.from([
  promptTemplate,
  model,
  new StringOutputParser(),
]);

const classificationChainResult = await classificationChain.invoke({
  question: "how do I call Anthropic?",
});
console.log(classificationChainResult);

/*
  Anthropic
*/

const langChainChain = ChatPromptTemplate.fromTemplate(
  `You are an expert in langchain.
Always answer questions starting with "As Harrison Chase told me".
Respond to the following question:

Question: {question}
Answer:`
).pipe(model);

const anthropicChain = ChatPromptTemplate.fromTemplate(
  `You are an expert in anthropic. \
Always answer questions starting with "As Dario Amodei told me". \
Respond to the following question:

Question: {question}
Answer:`
).pipe(model);

const generalChain = ChatPromptTemplate.fromTemplate(
  `Respond to the following question:

Question: {question}
Answer:`
).pipe(model);

const route = ({ topic }: { input: string; topic: string }) => {
  if (topic.toLowerCase().includes("anthropic")) {
    return anthropicChain;
  }
  if (topic.toLowerCase().includes("langchain")) {
    return langChainChain;
  }
  return generalChain;
};

const fullChain = RunnableSequence.from([
  {
    topic: classificationChain,
    question: (input: { question: string }) => input.question,
  },
  route,
]);

const result1 = await fullChain.invoke({
  question: "how do I use Anthropic?",
});

console.log(result1);

/*
  AIMessage {
    content: &#x27; As Dario Amodei told me, here are some tips for how to use Anthropic:\n&#x27; +
      &#x27;\n&#x27; +
      "First, sign up for an account on Anthropic&#x27;s website. This will give you access to their conversational AI assistant named Claude. \n" +
      &#x27;\n&#x27; +
      "Once you&#x27;ve created an account, you can have conversations with Claude through their web interface. Talk to Claude like you would talk to a person, asking questions, giving instructions, etc. Claude is trained to have natural conversations and be helpful.\n" +
      &#x27;\n&#x27; +
      "You can also integrate Claude into your own applications using Anthropic&#x27;s API. This allows you to build Claude&#x27;s conversational abilities into chatbots, virtual assistants, and other AI systems you develop.\n" +
      &#x27;\n&#x27; +
      &#x27;Anthropic is constantly working on improving Claude, so its capabilities are always expanding. Make sure to check their blog and documentation to stay up to date on the latest features.\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;The key is to interact with Claude regularly so it can learn from you. The more you chat with it, the better it will become at understanding you and having personalized conversations. Over time, Claude will feel more human-like as it accumulates more conversational experience.&#x27;,
    additional_kwargs: {}
  }
*/

const result2 = await fullChain.invoke({
  question: "how do I use LangChain?",
});

console.log(result2);

/*
  AIMessage {
    content: &#x27; As Harrison Chase told me, here is how you use LangChain:\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;First, think carefully about what you want to ask or have the AI do. Frame your request clearly and specifically. Avoid vague or overly broad prompts that could lead to unhelpful or concerning responses. \n&#x27; +
      &#x27;\n&#x27; +
      &#x27;Next, type your question or request into the chat window and send it. Be patient as the AI processes your input and generates a response. The AI will do its best to provide a helpful answer or follow your instructions, but its capabilities are limited.\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;Keep your requests simple at first. Ask basic questions or have the AI summarize content or generate basic text. As you get more comfortable, you can try having the AI perform more complex tasks like answering tricky questions, generating stories, or having a conversation.\n&#x27; +
      &#x27;\n&#x27; +
      "Pay attention to the AI&#x27;s responses. If they seem off topic, nonsensical, or concerning, rephrase your prompt to steer the AI in a better direction. You may need to provide additional clarification or context to get useful results.\n" +
      &#x27;\n&#x27; +
      &#x27;Be polite and respectful towards the AI system. Remember, it is a tool designed to be helpful, harmless, and honest. Do not try to trick, confuse, or exploit it. \n&#x27; +
      &#x27;\n&#x27; +
      &#x27;I hope these tips help you have a safe, fun and productive experience using LangChain! Let me know if you have any other questions.&#x27;,
    additional_kwargs: {}
  }
*/

const result3 = await fullChain.invoke({
  question: "what is 2 + 2?",
});

console.log(result3);

/*
  AIMessage {
    content: &#x27; 4&#x27;,
    additional_kwargs: {}
  }
*/

``` #### API Reference: - ChatPromptTemplate from @langchain/core/prompts - StringOutputParser from @langchain/core/output_parsers - RunnableSequence from @langchain/core/runnables - ChatAnthropic from @langchain/anthropic ## Routing by semantic similarity[​](#routing-by-semantic-similarity) One especially useful technique is to use embeddings to route a query to the most relevant prompt. Here&#x27;s an example:

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { OpenAIEmbeddings } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { cosineSimilarity } from "@langchain/core/utils/math";

const physicsTemplate = `You are a very smart physics professor.
You are great at answering questions about physics in a concise and easy to understand manner.
When you don&#x27;t know the answer to a question you admit that you don&#x27;t know.
Do not use more than 100 words.

Here is a question:
{query}`;

const mathTemplate = `"You are a very good mathematician. You are great at answering math questions.
You are so good because you are able to break down hard problems into their component parts,
answer the component parts, and then put them together to answer the broader question.
Do not use more than 100 words.

Here is a question:
{query}`;

const embeddings = new OpenAIEmbeddings({});

const templates = [physicsTemplate, mathTemplate];
const templateEmbeddings = await embeddings.embedDocuments(templates);

const promptRouter = async (query: string) => {
  const queryEmbedding = await embeddings.embedQuery(query);
  const similarity = cosineSimilarity([queryEmbedding], templateEmbeddings)[0];
  const isPhysicsQuestion = similarity[0] > similarity[1];
  let promptTemplate: ChatPromptTemplate;
  if (isPhysicsQuestion) {
    console.log(`Using physics prompt`);
    promptTemplate = ChatPromptTemplate.fromTemplate(templates[0]);
  } else {
    console.log(`Using math prompt`);
    promptTemplate = ChatPromptTemplate.fromTemplate(templates[1]);
  }
  return promptTemplate.invoke({ query });
};

const chain = RunnableSequence.from([
  promptRouter,
  new ChatAnthropic({ model: "claude-3-haiku-20240307" }),
  new StringOutputParser(),
]);

console.log(await chain.invoke("what&#x27;s a black hole?"));

/*
  Using physics prompt
*/

/*
  A black hole is a region in space where the gravitational pull is so strong that nothing, not even light, can escape from it. It is the result of the gravitational collapse of a massive star, creating a singularity surrounded by an event horizon, beyond which all information is lost. Black holes have fascinated scientists for decades, as they provide insights into the most extreme conditions in the universe and the nature of gravity itself. While we understand the basic properties of black holes, there are still many unanswered questions about their behavior and their role in the cosmos.
*/

console.log(await chain.invoke("what&#x27;s a path integral?"));

/*
  Using math prompt
*/

/*
  A path integral is a mathematical formulation in quantum mechanics used to describe the behavior of a particle or system. It considers all possible paths the particle can take between two points, and assigns a probability amplitude to each path. By summing up the contributions from all paths, it provides a comprehensive understanding of the particle&#x27;s quantum mechanical behavior. This approach allows for the calculation of complex quantum phenomena, such as quantum tunneling and interference effects, making it a powerful tool in theoretical physics.
*/

```

#### API Reference: - ChatAnthropic from @langchain/anthropic - OpenAIEmbeddings from @langchain/openai - StringOutputParser from @langchain/core/output_parsers - ChatPromptTemplate from @langchain/core/prompts - RunnableSequence from @langchain/core/runnables - cosineSimilarity from @langchain/core/utils/math ## Using a RunnableBranch[​](#using-a-runnablebranch) A `RunnableBranch` is initialized with a list of (condition, runnable) pairs and a default runnable. It selects which branch by passing each condition the input it&#x27;s invoked with. It selects the first condition to evaluate to True, and runs the corresponding runnable to that condition with the input.

If no provided conditions match, it runs the default runnable.

Here&#x27;s an example of what it looks like in action:

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { ChatAnthropic } from "@langchain/anthropic";

const promptTemplate =
  ChatPromptTemplate.fromTemplate(`Given the user question below, classify it as either being about \`LangChain\`, \`Anthropic\`, or \`Other\`.

Do not respond with more than one word.

<question>
{question}
</question>

Classification:`);

const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
});

const classificationChain = RunnableSequence.from([
  promptTemplate,
  model,
  new StringOutputParser(),
]);

const classificationChainResult = await classificationChain.invoke({
  question: "how do I call Anthropic?",
});
console.log(classificationChainResult);

/*
  Anthropic
*/

const langChainChain = ChatPromptTemplate.fromTemplate(
  `You are an expert in langchain.
Always answer questions starting with "As Harrison Chase told me".
Respond to the following question:

Question: {question}
Answer:`
).pipe(model);

const anthropicChain = ChatPromptTemplate.fromTemplate(
  `You are an expert in anthropic. \
Always answer questions starting with "As Dario Amodei told me". \
Respond to the following question:

Question: {question}
Answer:`
).pipe(model);

const generalChain = ChatPromptTemplate.fromTemplate(
  `Respond to the following question:

Question: {question}
Answer:`
).pipe(model);

const branch = RunnableBranch.from([
  [
    (x: { topic: string; question: string }) =>
      x.topic.toLowerCase().includes("anthropic"),
    anthropicChain,
  ],
  [
    (x: { topic: string; question: string }) =>
      x.topic.toLowerCase().includes("langchain"),
    langChainChain,
  ],
  generalChain,
]);

const fullChain = RunnableSequence.from([
  {
    topic: classificationChain,
    question: (input: { question: string }) => input.question,
  },
  branch,
]);

const result1 = await fullChain.invoke({
  question: "how do I use Anthropic?",
});

console.log(result1);

/*
  AIMessage {
    content: &#x27; As Dario Amodei told me, here are some tips for how to use Anthropic:\n&#x27; +
      &#x27;\n&#x27; +
      "First, sign up for an account on Anthropic&#x27;s website. This will give you access to their conversational AI assistant named Claude. \n" +
      &#x27;\n&#x27; +
      "Once you&#x27;ve created an account, you can have conversations with Claude through their web interface. Talk to Claude like you would talk to a person, asking questions, giving instructions, etc. Claude is trained to have natural conversations and be helpful.\n" +
      &#x27;\n&#x27; +
      "You can also integrate Claude into your own applications using Anthropic&#x27;s API. This allows you to build Claude&#x27;s conversational abilities into chatbots, virtual assistants, and other AI systems you develop.\n" +
      &#x27;\n&#x27; +
      &#x27;Anthropic is constantly working on improving Claude, so its capabilities are always expanding. Make sure to check their blog and documentation to stay up to date on the latest features.\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;The key is to interact with Claude regularly so it can learn from you. The more you chat with it, the better it will become at understanding you and having personalized conversations. Over time, Claude will feel more human-like as it accumulates more conversational experience.&#x27;,
    additional_kwargs: {}
  }
*/

const result2 = await fullChain.invoke({
  question: "how do I use LangChain?",
});

console.log(result2);

/*
  AIMessage {
    content: &#x27; As Harrison Chase told me, here is how you use LangChain:\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;First, think carefully about what you want to ask or have the AI do. Frame your request clearly and specifically. Avoid vague or overly broad prompts that could lead to unhelpful or concerning responses. \n&#x27; +
      &#x27;\n&#x27; +
      &#x27;Next, type your question or request into the chat window and send it. Be patient as the AI processes your input and generates a response. The AI will do its best to provide a helpful answer or follow your instructions, but its capabilities are limited.\n&#x27; +
      &#x27;\n&#x27; +
      &#x27;Keep your requests simple at first. Ask basic questions or have the AI summarize content or generate basic text. As you get more comfortable, you can try having the AI perform more complex tasks like answering tricky questions, generating stories, or having a conversation.\n&#x27; +
      &#x27;\n&#x27; +
      "Pay attention to the AI&#x27;s responses. If they seem off topic, nonsensical, or concerning, rephrase your prompt to steer the AI in a better direction. You may need to provide additional clarification or context to get useful results.\n" +
      &#x27;\n&#x27; +
      &#x27;Be polite and respectful towards the AI system. Remember, it is a tool designed to be helpful, harmless, and honest. Do not try to trick, confuse, or exploit it. \n&#x27; +
      &#x27;\n&#x27; +
      &#x27;I hope these tips help you have a safe, fun and productive experience using LangChain! Let me know if you have any other questions.&#x27;,
    additional_kwargs: {}
  }
*/

const result3 = await fullChain.invoke({
  question: "what is 2 + 2?",
});

console.log(result3);

/*
  AIMessage {
    content: &#x27; 4&#x27;,
    additional_kwargs: {}
  }
*/

```

#### API Reference: - ChatPromptTemplate from @langchain/core/prompts - StringOutputParser from @langchain/core/output_parsers - RunnableBranch from @langchain/core/runnables - RunnableSequence from @langchain/core/runnables - ChatAnthropic from @langchain/anthropic ## Next steps[​](#next-steps) You&#x27;ve now learned how to add routing to your composed LCEL chains.

Next, check out the other [how-to guides on runnables](/docs/how_to/#langchain-expression-language) in this section.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Using a custom function](#using-a-custom-function)
- [Routing by semantic similarity](#routing-by-semantic-similarity)
- [Using a RunnableBranch](#using-a-runnablebranch)
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