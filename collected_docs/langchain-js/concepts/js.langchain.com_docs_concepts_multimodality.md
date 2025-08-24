Multimodality | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageMultimodalityOverview​](#overview)Multimodality** refers to the ability to work with data that comes in different forms, such as text, audio, images, and video. Multimodality can appear in various components, allowing models and systems to handle and process a mix of these data types seamlessly.**Chat Models**: These could, in theory, accept and generate multimodal inputs and outputs, handling a variety of data types like text, images, audio, and video.
- **Embedding Models**: Embedding Models can represent multimodal content, embedding various forms of data—such as text, images, and audio—into vector spaces.
- **Vector Stores**: Vector stores could search over embeddings that represent multimodal data, enabling retrieval across different types of information.

## Multimodality in chat models[​](#multimodality-in-chat-models)

Pre-requisites - [Chat models](/docs/concepts/chat_models) - [Messages](/docs/concepts/messages) Multimodal support is still relatively new and less common, model providers have not yet standardized on the "best" way to define the API. As such, LangChain&#x27;s multimodal abstractions are lightweight and flexible, designed to accommodate different model providers&#x27; APIs and interaction patterns, but are **not** standardized across models.

### How to use multimodal models[​](#how-to-use-multimodal-models)

- Use the [chat model integration table](/docs/integrations/chat/) to identify which models support multimodality.
- Reference the [relevant how-to guides](/docs/how_to/#multimodal) for specific examples of how to use multimodal models.

### What kind of multimodality is supported?[​](#what-kind-of-multimodality-is-supported)

#### Inputs[​](#inputs)

Some models can accept multimodal inputs, such as images, audio, video, or files. The types of multimodal inputs supported depend on the model provider. For instance, [Google&#x27;s Gemini](/docs/integrations/chat/google_generativeai/) supports documents like PDFs as inputs.

Most chat models that support **multimodal inputs** also accept those values in OpenAI&#x27;s content blocks format. So far this is restricted to image inputs. For models like Gemini which support video and other bytes input, the APIs also support the native, model-specific representations.

The gist of passing multimodal inputs to a chat model is to use content blocks that specify a type and corresponding data. For example, to pass an image to a chat model:

```typescript
import { HumanMessage } from "@langchain/core/messages";

const message = new HumanMessage({
  content: [
    { type: "text", text: "describe the weather in this image" },
    { type: "image_url", image_url: { url: image_url } },
  ],
});
const response = await model.invoke([message]);

```**cautionThe exact format of the content blocks may vary depending on the model provider. Please refer to the chat model&#x27;s integration documentation for the correct format. Find the integration in the [chat model integration table](/docs/integrations/chat/).Outputs[​](#outputs)Virtually no popular chat models support multimodal outputs at the time of writing (October 2024).The only exception is OpenAI&#x27;s chat model ([gpt-4o-audio-preview](/docs/integrations/chat/openai/)), which can generate audio outputs.Multimodal outputs will appear as part of the [AIMessage](/docs/concepts/messages/#aimessage) response object.Please see the [ChatOpenAI](/docs/integrations/chat/openai/) for more information on how to use multimodal outputs.Tools[​](#tools)Currently, no chat model is designed to work directly** with multimodal data in a [tool call request](/docs/concepts/tool_calling) or [ToolMessage](/docs/concepts/tool_calling) result.

However, a chat model can easily interact with multimodal data by invoking tools with references (e.g., a URL) to the multimodal data, rather than the data itself. For example, any model capable of [tool calling](/docs/concepts/tool_calling) can be equipped with tools to download and process images, audio, or video.

## Multimodality in embedding models[​](#multimodality-in-embedding-models)

Prerequisites - [Embedding Models](/docs/concepts/embedding_models) **Embeddings** are vector representations of data used for tasks like similarity search and retrieval.

The current [embedding interface](https://api.js.langchain.com/classes/_langchain_core.embeddings.Embeddings.html) used in LangChain is optimized entirely for text-based data, and will **not** work with multimodal data.

As use cases involving multimodal search and retrieval tasks become more common, we expect to expand the embedding interface to accommodate other data types like images, audio, and video.

## Multimodality in vector stores[​](#multimodality-in-vector-stores)

Prerequisites - [Vector stores](/docs/concepts/vectorstores) Vector stores are databases for storing and retrieving embeddings, which are typically used in search and retrieval tasks. Similar to embeddings, vector stores are currently optimized for text-based data.

As use cases involving multimodal search and retrieval tasks become more common, we expect to expand the vector store interface to accommodate other data types like images, audio, and video.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Overview](#overview)
- [Multimodality in chat models](#multimodality-in-chat-models)[How to use multimodal models](#how-to-use-multimodal-models)
- [What kind of multimodality is supported?](#what-kind-of-multimodality-is-supported)

- [Multimodality in embedding models](#multimodality-in-embedding-models)
- [Multimodality in vector stores](#multimodality-in-vector-stores)

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