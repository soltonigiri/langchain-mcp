Structured outputs | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageStructured outputsOverview​](#overview)For many applications, such as chatbots, models need to respond to users directly in natural language. However, there are scenarios where we need models to output in a structured format. For example, we might want to store the model output in a database and ensure that the output conforms to the database schema. This need motivates the concept of structured output, where models can be instructed to respond with a particular output structure.![Structured output ](/assets/images/structured_output-2c42953cee807dedd6e96f3e1db17f69.png)Key concepts[​](#key-concepts)(1) Schema definition:** The output structure is represented as a schema, which can be defined in several ways. **(2) Returning structured output:** The model is given this schema, and is instructed to return output that conforms to it. ## Recommended usage[​](#recommended-usage) This pseudo-code illustrates the recommended workflow when using structured output. LangChain provides a method, [withStructuredOutput()](/docs/how_to/structured_output/#the-.withstructuredoutput-method), that automates the process of binding the schema to the [model](/docs/concepts/chat_models/) and parsing the output. This helper function is available for all model providers that support structured output.

```typescript
// Define schema
const schema = { foo: "bar" };
// Bind schema to model
const modelWithStructure = model.withStructuredOutput(schema);
// Invoke the model to produce structured output that matches the schema
const structuredOutput = await modelWithStructure.invoke(userInput);

``` ## Schema definition[​](#schema-definition) The central concept is that the output structure of model responses needs to be represented in some way. While types of objects you can use depend on the model you&#x27;re working with, there are common types of objects that are typically allowed or recommended for structured output in TypeScript.The simplest and most common format for structured output is a Zod schema definition:

```typescript
import { z } from "zod";

const ResponseFormatter = z.object({
  answer: z.string().describe("The answer to the user&#x27;s question"),
  followup_question: z
    .string()
    .describe("A followup question the user could ask"),
});

```You can also define a JSONSchema object, which is what Zod schemas are converted to internally before being sent to the model provider:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "ResponseFormatter",
  "type": "object",
  "properties": {
    "answer": {
      "description": "The answer to the user&#x27;s question",
      "type": "string"
    },
    "followup_question": {
      "description": "A followup question the user could ask",
      "type": "string"
    }
  },
  "required": ["answer", "followup_question"]
}

``` ## Returning structured output[​](#returning-structured-output) With a schema defined, we need a way to instruct the model to use it. While one approach is to include this schema in the prompt and *ask nicely* for the model to use it, this is not recommended. Several more powerful methods that utilizes native features in the model provider&#x27;s API are available. ### Using tool calling[​](#using-tool-calling) Many [model providers support](/docs/integrations/chat/) tool calling, a concept discussed in more detail in our [tool calling guide](/docs/concepts/tool_calling/). In short, tool calling involves binding a tool to a model and, when appropriate, the model can *decide* to call this tool and ensure its response conforms to the tool&#x27;s schema. With this in mind, the central concept is straightforward: *create a tool with our schema and bind it to the model!* Here is an example using the ResponseFormatter schema defined above:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

// Create a tool with ResponseFormatter as its schema.
const responseFormatterTool = tool(async () => {}, {
  name: "responseFormatter",
  schema: ResponseFormatter,
});

// Bind the created tool to the model
const modelWithTools = model.bindTools([responseFormatterTool]);

// Invoke the model
const aiMsg = await modelWithTools.invoke(
  "What is the powerhouse of the cell?"
);

``` ### JSON mode[​](#json-mode) In addition to tool calling, some model providers support a feature called JSON mode. This supports JSON schema definition as input and enforces the model to produce a conforming JSON output. You can find a table of model providers that support JSON mode [here](/docs/integrations/chat/). Here is an example of how to use JSON mode with OpenAI:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
}).bind({
  response_format: { type: "json_object" },
});

const aiMsg = await model.invoke(
  "Return a JSON object with key &#x27;random_nums&#x27; and a value of 10 random numbers in [0-99]"
);
console.log(aiMsg.content);
// Output: {
//   "random_nums": [23, 47, 89, 15, 34, 76, 58, 3, 62, 91]
// }

```One important point to flag: the model *still* returns a string, which needs to be parsed into a JSON object. This can, of course, simply use the json library or a JSON output parser if you need more advanced functionality. See this [how-to guide on the JSON output parser](/docs/how_to/output_parser_json) for more details.

```typescript
import json
const jsonObject = JSON.parse(aiMsg.content)
// {&#x27;random_ints&#x27;: [23, 47, 89, 15, 34, 76, 58, 3, 62, 91]}

``` ## Structured output method[​](#structured-output-method) There are a few challenges when producing structured output with the above methods:(1) If using tool calling, tool call arguments needs to be parsed from an object back to the original schema.(2) In addition, the model needs to be instructed to *always* use the tool when we want to enforce structured output, which is a provider specific setting.(3) If using JSON mode, the output needs to be parsed into a JSON object.With these challenges in mind, LangChain provides a helper function (withStructuredOutput()) to streamline the process.![Diagram of with structured output ](/assets/images/with_structured_output-4fd0fdc94f644554d52c6a8dee96ea21.png)This both binds the schema to the model as a tool and parses the output to the specified output schema.

```typescript
// Bind the schema to the model
const modelWithStructure = model.withStructuredOutput(ResponseFormatter);
// Invoke the model
const structuredOutput = await modelWithStructure.invoke(
  "What is the powerhouse of the cell?"
);
// Get back the object
console.log(structuredOutput);
// { answer: "The powerhouse of the cell is the mitochondrion. Mitochondria are organelles that generate most of the cell&#x27;s supply of adenosine triphosphate (ATP), which is used as a source of chemical energy.", followup_question: "What is the function of ATP in the cell?" }

```[Further reading]For more details on usage, see our [how-to guide](/docs/how_to/structured_output/#the-.withstructuredoutput-method). #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Overview](#overview)
- [Key concepts](#key-concepts)
- [Recommended usage](#recommended-usage)
- [Schema definition](#schema-definition)
- [Returning structured output](#returning-structured-output)[Using tool calling](#using-tool-calling)
- [JSON mode](#json-mode)

- [Structured output method](#structured-output-method)

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