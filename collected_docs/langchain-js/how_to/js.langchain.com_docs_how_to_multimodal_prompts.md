How to use multimodal prompts | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[How to use multimodal promptsHere we demonstrate how to use prompt templates to format multimodal inputs to models.In this example we will ask a model to describe an image.PrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)
- [LangChain Tools](/docs/concepts/tools)

- npm
- yarn
- pnpm

```bash
npm i axios @langchain/openai @langchain/core

```

```bash
yarn add axios @langchain/openai @langchain/core

```

```bash
pnpm add axios @langchain/openai @langchain/core

```

```typescript
import axios from "axios";

const imageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg";
const axiosRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
const base64 = btoa(
  new Uint8Array(axiosRes.data).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ""
  )
);

```

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o" });

```

```typescript
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Describe the image provided"],
  [
    "user",
    [{ type: "image_url", image_url: "data:image/jpeg;base64,{base64}" }],
  ],
]);

```

```typescript
const chain = prompt.pipe(model);

```

```typescript
const response = await chain.invoke({ base64 });
console.log(response.content);

```

```text
The image depicts a scenic outdoor landscape featuring a wooden boardwalk path extending forward through a large field of green grass and vegetation. On either side of the path, the grass is lush and vibrant, with a variety of bushes and low shrubs visible as well. The sky overhead is expansive and mostly clear, adorned with soft, wispy clouds, illuminated by the light giving a warm and serene ambiance. In the distant background, there are clusters of trees and additional foliage, suggesting a natural and tranquil setting, ideal for a peaceful walk or nature exploration.

```We can also pass in multiple images.

```typescript
const promptWithMultipleImages = ChatPromptTemplate.fromMessages([
  ["system", "compare the two pictures provided"],
  [
    "user",
    [
      {
        type: "image_url",
        image_url: "data:image/jpeg;base64,{imageData1}",
      },
      {
        type: "image_url",
        image_url: "data:image/jpeg;base64,{imageData2}",
      },
    ],
  ],
]);

```

```typescript
const chainWithMultipleImages = promptWithMultipleImages.pipe(model);

```

```typescript
const res = await chainWithMultipleImages.invoke({
  imageData1: base64,
  imageData2: base64,
});
console.log(res.content);

```

```text
The two images provided are identical. Both show a wooden boardwalk path extending into a grassy field under a blue sky with scattered clouds. The scenery includes green shrubs and trees in the background, with a bright and clear sky above.

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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