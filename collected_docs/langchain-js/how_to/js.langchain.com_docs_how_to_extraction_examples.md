How to use reference examples | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to use reference examplesPrerequisitesThis guide assumes familiarity with the following:Extraction](/docs/tutorials/extraction)The quality of extraction can often be improved by providing reference examples to the LLM.tipWhile this tutorial focuses how to use examples with a tool calling model, this technique is generally applicable, and will work also with JSON more or prompt based techniques.We’ll use OpenAI’s GPT-4 this time for their robust support for ToolMessages:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/openai @langchain/core zod uuid

```

```bash
yarn add @langchain/openai @langchain/core zod uuid

```

```bash
pnpm add @langchain/openai @langchain/core zod uuid

```Let’s define a prompt:

```typescript
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const SYSTEM_PROMPT_TEMPLATE = `You are an expert extraction algorithm.
Only extract relevant information from the text.
If you do not know the value of an attribute asked to extract, you may omit the attribute&#x27;s value.`;

// Define a custom prompt to provide instructions and any additional context.
// 1) You can add examples into the prompt template to improve extraction quality
// 2) Introduce additional parameters to take context into account (e.g., include metadata
//    about the document from which the text was extracted.)
const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT_TEMPLATE],
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  new MessagesPlaceholder("examples"),
  // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
  ["human", "{text}"],
]);

```Test out the template:

```typescript
import { HumanMessage } from "@langchain/core/messages";

const promptValue = await prompt.invoke({
  text: "this is some text",
  examples: [new HumanMessage("testing 1 2 3")],
});

promptValue.toChatMessages();

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "You are an expert extraction algorithm.\n" +
        "Only extract relevant information from the text.\n" +
        "If you do n"... 87 more characters,
      additional_kwargs: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "You are an expert extraction algorithm.\n" +
      "Only extract relevant information from the text.\n" +
      "If you do n"... 87 more characters,
    name: undefined,
    additional_kwargs: {}
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: "testing 1 2 3", additional_kwargs: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "testing 1 2 3",
    name: undefined,
    additional_kwargs: {}
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: "this is some text", additional_kwargs: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "this is some text",
    name: undefined,
    additional_kwargs: {}
  }
]

```Define the schema[​](#define-the-schema)Let’s re-use the people schema from the quickstart.

```typescript
import { z } from "zod";

const personSchema = z
  .object({
    name: z.optional(z.string()).describe("The name of the person"),
    hair_color: z
      .optional(z.string())
      .describe("The color of the person&#x27;s hair, if known"),
    height_in_meters: z
      .optional(z.string())
      .describe("Height measured in meters"),
  })
  .describe("Information about a person.");

const peopleSchema = z.object({
  people: z.array(personSchema),
});

```Define reference examples[​](#define-reference-examples)Examples can be defined as a list of input-output pairs.Each example contains an example input text and an example output showing what should be extracted from the text.infoThe below example is a bit more advanced - the format of the example needs to match the API used (e.g., tool calling or JSON mode etc.).Here, the formatted examples will match the format expected for the OpenAI tool calling API since that’s what we’re using.To provide reference examples to the model, we will mock out a fake chat history containing successful usages of the given tool. Because the model can choose to call multiple tools at once (or the same tool multiple times), the example’s outputs are an array:

```typescript
import {
  AIMessage,
  type BaseMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { v4 as uuid } from "uuid";

type OpenAIToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

type Example = {
  input: string;
  toolCallOutputs: Record<string, any>[];
};

/**
 * This function converts an example into a list of messages that can be fed into an LLM.
 *
 * This code serves as an adapter that transforms our example into a list of messages
 * that can be processed by a chat model.
 *
 * The list of messages for each example includes:
 *
 * 1) HumanMessage: This contains the content from which information should be extracted.
 * 2) AIMessage: This contains the information extracted by the model.
 * 3) ToolMessage: This provides confirmation to the model that the tool was requested correctly.
 *
 * The inclusion of ToolMessage is necessary because some chat models are highly optimized for agents,
 * making them less suitable for an extraction use case.
 */
function toolExampleToMessages(example: Example): BaseMessage[] {
  const openAIToolCalls: OpenAIToolCall[] = example.toolCallOutputs.map(
    (output) => {
      return {
        id: uuid(),
        type: "function",
        function: {
          // The name of the function right now corresponds
          // to the passed name.
          name: "extract",
          arguments: JSON.stringify(output),
        },
      };
    }
  );
  const messages: BaseMessage[] = [
    new HumanMessage(example.input),
    new AIMessage({
      content: "",
      additional_kwargs: { tool_calls: openAIToolCalls },
    }),
  ];
  const toolMessages = openAIToolCalls.map((toolCall, i) => {
    // Return the mocked successful result for a given tool call.
    return new ToolMessage({
      content: "You have correctly called this tool.",
      tool_call_id: toolCall.id,
    });
  });
  return messages.concat(toolMessages);
}

```Next let’s define our examples and then convert them into message format.

```typescript
const examples: Example[] = [
  {
    input:
      "The ocean is vast and blue. It&#x27;s more than 20,000 feet deep. There are many fish in it.",
    toolCallOutputs: [{}],
  },
  {
    input: "Fiona traveled far from France to Spain.",
    toolCallOutputs: [
      {
        name: "Fiona",
      },
    ],
  },
];

const exampleMessages = [];
for (const example of examples) {
  exampleMessages.push(...toolExampleToMessages(example));
}

```

```text
6

```Let’s test out the prompt

```typescript
const promptValueWithExamples = await prompt.invoke({
  text: "this is some text",
  examples: exampleMessages,
});

promptValueWithExamples.toChatMessages();

```

```text
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "You are an expert extraction algorithm.\n" +
        "Only extract relevant information from the text.\n" +
        "If you do n"... 87 more characters,
      additional_kwargs: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "You are an expert extraction algorithm.\n" +
      "Only extract relevant information from the text.\n" +
      "If you do n"... 87 more characters,
    name: undefined,
    additional_kwargs: {}
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "The ocean is vast and blue. It&#x27;s more than 20,000 feet deep. There are many fish in it.",
      additional_kwargs: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "The ocean is vast and blue. It&#x27;s more than 20,000 feet deep. There are many fish in it.",
    name: undefined,
    additional_kwargs: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: { content: "", additional_kwargs: { tool_calls: [ [Object] ] } },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "",
    name: undefined,
    additional_kwargs: {
      tool_calls: [
        {
          id: "8fa4d00d-801f-470e-8737-51ee9dc82259",
          type: "function",
          function: [Object]
        }
      ]
    }
  },
  ToolMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "You have correctly called this tool.",
      tool_call_id: "8fa4d00d-801f-470e-8737-51ee9dc82259",
      additional_kwargs: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "You have correctly called this tool.",
    name: undefined,
    additional_kwargs: {},
    tool_call_id: "8fa4d00d-801f-470e-8737-51ee9dc82259"
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "Fiona traveled far from France to Spain.",
      additional_kwargs: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "Fiona traveled far from France to Spain.",
    name: undefined,
    additional_kwargs: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: { content: "", additional_kwargs: { tool_calls: [ [Object] ] } },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "",
    name: undefined,
    additional_kwargs: {
      tool_calls: [
        {
          id: "14ad6217-fcbd-47c7-9006-82f612e36c66",
          type: "function",
          function: [Object]
        }
      ]
    }
  },
  ToolMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "You have correctly called this tool.",
      tool_call_id: "14ad6217-fcbd-47c7-9006-82f612e36c66",
      additional_kwargs: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "You have correctly called this tool.",
    name: undefined,
    additional_kwargs: {},
    tool_call_id: "14ad6217-fcbd-47c7-9006-82f612e36c66"
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: "this is some text", additional_kwargs: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "this is some text",
    name: undefined,
    additional_kwargs: {}
  }
]

```Create an extractor[​](#create-an-extractor)Here, we’ll create an extractor using gpt-4**.

```typescript
import { ChatOpenAI } from "@langchain/openai";

// We will be using tool calling mode, which
// requires a tool calling capable model.
const llm = new ChatOpenAI({
  // Consider benchmarking with the best model you can to get
  // a sense of the best possible quality.
  model: "gpt-4-0125-preview",
  temperature: 0,
});

// For function/tool calling, we can also supply an name for the schema
// to give the LLM additional context about what it&#x27;s extracting.
const extractionRunnable = prompt.pipe(
  llm.withStructuredOutput(peopleSchema, { name: "people" })
);

```**Without examples 😿[​](#without-examples)Notice that even though we’re using gpt-4, it’s unreliable with a very simple** test case!We run it 5 times below to emphasize this:

```typescript
const text = "The solar system is large, but earth has only 1 moon.";

for (let i = 0; i < 5; i++) {
  const result = await extractionRunnable.invoke({
    text,
    examples: [],
  });
  console.log(result);
}

```

```text
{
  people: [ { name: "earth", hair_color: "grey", height_in_meters: "1" } ]
}
{ people: [ { name: "earth", hair_color: "moon" } ] }
{ people: [ { name: "earth", hair_color: "moon" } ] }
{ people: [ { name: "earth", hair_color: "1 moon" } ] }
{ people: [] }

``` ## With examples 😻[​](#with-examples) Reference examples help fix the failure!

```typescript
for (let i = 0; i < 5; i++) {
  const result = await extractionRunnable.invoke({
    text,
    // Example messages from above
    examples: exampleMessages,
  });
  console.log(result);
}

```

```text
{ people: [] }
{ people: [] }
{ people: [] }
{ people: [] }
{ people: [] }

```

```typescript
await extractionRunnable.invoke({
  text: "My name is Hair-ison. My hair is black. I am 3 meters tall.",
  examples: exampleMessages,
});

```

```text
{
  people: [ { name: "Hair-ison", hair_color: "black", height_in_meters: "3" } ]
}

``` ## Next steps[​](#next-steps) You’ve now learned how to improve extraction quality using few-shot examples.Next, check out some of the other guides in this section, such as [some tips on how to perform extraction on long text](/docs/how_to/extraction_long_text). #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Define the schema](#define-the-schema)
- [Define reference examples](#define-reference-examples)
- [Create an extractor](#create-an-extractor)
- [Without examples 😿](#without-examples)
- [With examples 😻](#with-examples)
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