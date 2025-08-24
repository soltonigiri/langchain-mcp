How to pass multimodal data directly to models | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to pass multimodal data directly to modelsPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)

Here we demonstrate how to pass multimodal input directly to models. We currently expect all input to be passed in the same format as [OpenAI expects](https://platform.openai.com/docs/guides/vision). For other model providers that support multimodal input, we have added logic inside the class to convert to the expected format.

In this example we will ask a model to describe an image.

```typescript
import * as fs from "node:fs/promises";

import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
});

const imageData = await fs.readFile("../../../../examples/hotdog.jpg");

```

The most commonly supported way to pass in images is to pass it in as a byte string within a message with a complex content type for models that support multimodal input. Here’s an example:

```typescript
import { HumanMessage } from "@langchain/core/messages";

const message = new HumanMessage({
  content: [
    {
      type: "text",
      text: "what does this image contain?",
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
console.log(response.content);

```

```text
This image contains a hot dog. It shows a frankfurter or sausage encased in a soft, elongated bread bun. The sausage itself appears to be reddish in color, likely a smoked or cured variety. The bun is a golden-brown color, suggesting it has been lightly toasted or grilled. The hot dog is presented against a plain white background, allowing the details of the iconic American fast food item to be clearly visible.

```Some model providers support taking an HTTP URL to the image directly in a content block of type `"image_url"`:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const openAIModel = new ChatOpenAI({
  model: "gpt-4o",
});

const imageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg";

const message = new HumanMessage({
  content: [
    {
      type: "text",
      text: "describe the weather in this image",
    },
    {
      type: "image_url",
      image_url: { url: imageUrl },
    },
  ],
});
const response = await openAIModel.invoke([message]);
console.log(response.content);

```

```text
The weather in the image appears to be pleasant and clear. The sky is mostly blue with a few scattered clouds, indicating good visibility and no immediate signs of rain. The lighting suggests it’s either morning or late afternoon, with sunlight creating a warm and bright atmosphere. There is no indication of strong winds, as the grass and foliage appear calm and undisturbed. Overall, it looks like a beautiful day, possibly spring or summer, ideal for outdoor activities.

```We can also pass in multiple images.

```typescript
const message = new HumanMessage({
  content: [
    {
      type: "text",
      text: "are these two images the same?",
    },
    {
      type: "image_url",
      image_url: {
        url: imageUrl,
      },
    },
    {
      type: "image_url",
      image_url: {
        url: imageUrl,
      },
    },
  ],
});
const response = await openAIModel.invoke([message]);
console.log(response.content);

```

```text
Yes, the two images are the same.

``` ## Next steps[​](#next-steps) You’ve now learned how to pass multimodal data to a modal.

Next, you can check out our guide on [multimodal tool calls](/docs/how_to/tool_calls_multimodal).

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