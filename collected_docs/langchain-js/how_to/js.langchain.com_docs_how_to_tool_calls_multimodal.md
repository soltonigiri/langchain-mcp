How to call tools with multimodal data | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to call tools with multimodal dataPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)
- [LangChain Tools](/docs/concepts/tools)

Here we demonstrate how to call tools with multimodal data, such as images.

Some multimodal models, such as those that can reason over images or audio, support [tool calling](/docs/concepts/#tool-calling) features as well.

To call tools using such models, simply bind tools to them in the [usual way](/docs/how_to/tool_calling), and invoke the model using content blocks of the desired type (e.g., containing image data).

Below, we demonstrate examples using [OpenAI](/docs/integrations/platforms/openai) and [Anthropic](/docs/integrations/platforms/anthropic). We will use the same image and tool in all cases. Let’s first select an image, and build a placeholder tool that expects as input the string “sunny”, “cloudy”, or “rainy”. We will ask the models to describe the weather in the image.

The `tool` function is available in `@langchain/core` version 0.2.7 and above.

If you are on an older version of core, you should use instantiate and use [DynamicStructuredTool](https://api.js.langchain.com/classes/langchain_core.tools.DynamicStructuredTool.html) instead.

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const imageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg";

const weatherTool = tool(
  async ({ weather }) => {
    console.log(weather);
    return weather;
  },
  {
    name: "multiply",
    description: "Describe the weather",
    schema: z.object({
      weather: z.enum(["sunny", "cloudy", "rainy"]),
    }),
  }
);

```

## OpenAI[​](#openai) For OpenAI, we can feed the image URL directly in a content block of type “image_url”:

```typescript
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o",
}).bindTools([weatherTool]);

const message = new HumanMessage({
  content: [
    {
      type: "text",
      text: "describe the weather in this image",
    },
    {
      type: "image_url",
      image_url: {
        url: imageUrl,
      },
    },
  ],
});

const response = await model.invoke([message]);

console.log(response.tool_calls);

```

```text
[
  {
    name: "multiply",
    args: { weather: "sunny" },
    id: "call_ZaBYUggmrTSuDjcuZpMVKpMR"
  }
]

```Note that we recover tool calls with parsed arguments in LangChain’s [standard format](/docs/how_to/tool_calling) in the model response.

## Anthropic[​](#anthropic)

For Anthropic, we can format a base64-encoded image into a content block of type “image”, as below:

```typescript
import * as fs from "node:fs/promises";

import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";

const imageData = await fs.readFile("../../data/sunny_day.jpeg");

const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
}).bindTools([weatherTool]);

const message = new HumanMessage({
  content: [
    {
      type: "text",
      text: "describe the weather in this image",
    },
    {
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${imageData.toString("base64")}`,
      },
    },
  ],
});

const response = await model.invoke([message]);

console.log(response.tool_calls);

```

```text
[
  {
    name: "multiply",
    args: { weather: "sunny" },
    id: "toolu_01HLY1KmXZkKMn7Ar4ZtFuAM"
  }
]

``` ## Google Generative AI[​](#google-generative-ai) For Google GenAI, we can format a base64-encoded image into a content block of type “image”, as below:

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import axios from "axios";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";

const axiosRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
const base64 = btoa(
  new Uint8Array(axiosRes.data).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ""
  )
);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro-latest",
}).bindTools([weatherTool]);

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "describe the weather in this image"],
  new MessagesPlaceholder("message"),
]);

const response = await prompt.pipe(model).invoke({
  message: new HumanMessage({
    content: [
      {
        type: "media",
        mimeType: "image/jpeg",
        data: base64,
      },
    ],
  }),
});
console.log(response.tool_calls);

```

```text
[ { name: &#x27;multiply&#x27;, args: { weather: &#x27;sunny&#x27; } } ]

``` ### Audio input[​](#audio-input) Google’s Gemini also supports audio inputs. In this next example we’ll see how we can pass an audio file to the model, and get back a summary in structured format.

```typescript
import { SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";

const summaryTool = tool(
  (input) => {
    return input.summary;
  },
  {
    name: "summary_tool",
    description: "Log the summary of the content",
    schema: z.object({
      summary: z.string().describe("The summary of the content to log"),
    }),
  }
);

const audioUrl =
  "https://www.pacdv.com/sounds/people_sound_effects/applause-1.wav";

const axiosRes = await axios.get(audioUrl, { responseType: "arraybuffer" });
const base64 = btoa(
  new Uint8Array(axiosRes.data).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ""
  )
);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro-latest",
}).bindTools([summaryTool]);

const response = await model.invoke([
  new SystemMessage(
    "Summarize this content. always use the summary_tool in your response"
  ),
  new HumanMessage({
    content: [
      {
        type: "media",
        mimeType: "audio/wav",
        data: base64,
      },
    ],
  }),
]);

console.log(response.tool_calls);

```

```text
[
  {
    name: &#x27;summary_tool&#x27;,
    args: { summary: &#x27;The video shows a person clapping their hands.&#x27; }
  }
]

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [OpenAI](#openai)
- [Anthropic](#anthropic)
- [Google Generative AI](#google-generative-ai)[Audio input](#audio-input)

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