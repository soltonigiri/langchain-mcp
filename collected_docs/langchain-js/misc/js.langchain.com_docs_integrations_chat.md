Chat models | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[Chat modelsChat models](/docs/concepts/chat_models) are language models that use a sequence of [messages](/docs/concepts/messages) as inputs and return messages as outputs (as opposed to using plain text). These are generally newer models.infoIf you&#x27;d like to write your own chat model, see [this how-to](/docs/how_to/custom_chat). If you&#x27;d like to contribute an integration, see [Contributing integrations](/docs/contributing). ### Pick your chat model: Groq
- OpenAI
- Anthropic
- Google Gemini
- FireworksAI
- MistralAI
- VertexAI

#### Install dependencies

tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/groq

```

```bash
yarn add @langchain/groq

```

```bash
pnpm add @langchain/groq

``` #### Add environment variables

```bash
GROQ_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/openai

```

```bash
yarn add @langchain/openai

```

```bash
pnpm add @langchain/openai

``` #### Add environment variables

```bash
OPENAI_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/anthropic

```

```bash
yarn add @langchain/anthropic

```

```bash
pnpm add @langchain/anthropic

``` #### Add environment variables

```bash
ANTHROPIC_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/google-genai

```

```bash
yarn add @langchain/google-genai

```

```bash
pnpm add @langchain/google-genai

``` #### Add environment variables

```bash
GOOGLE_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

``` #### Add environment variables

```bash
FIREWORKS_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const model = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/mistralai

```

```bash
yarn add @langchain/mistralai

```

```bash
pnpm add @langchain/mistralai

``` #### Add environment variables

```bash
MISTRAL_API_KEY=your-api-key

``` #### Instantiate the model

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0
});

``` #### Install dependencies tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).

- npm
- yarn
- pnpm

```bash
npm i @langchain/google-vertexai

```

```bash
yarn add @langchain/google-vertexai

```

```bash
pnpm add @langchain/google-vertexai

```

#### Add environment variables

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json

```

#### Instantiate the model

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```

```python
await model.invoke("Hello, world!")

```

## Featured providers[​](#featured-providers)

| Model | Stream | JSON mode | [Tool Calling](/docs/how_to/tool_calling/) | [withStructuredOutput()](/docs/how_to/structured_output/#the-.withstructuredoutput-method) | [Multimodal](/docs/how_to/multimodal_inputs/) |

| [BedrockChat](/docs/integrations/chat/bedrock/) | ✅ | ❌ | 🟡 (Bedrock Anthropic only) | 🟡 (Bedrock Anthropic only) | 🟡 (Bedrock Anthropic only) |

| [ChatBedrockConverse](/docs/integrations/chat/bedrock_converse/) | ✅ | ❌ | ✅ | ✅ | ✅ |

| [ChatAnthropic](/docs/integrations/chat/anthropic/) | ✅ | ❌ | ✅ | ✅ | ✅ |

| [ChatCloudflareWorkersAI](/docs/integrations/chat/cloudflare_workersai/) | ✅ | ❌ | ❌ | ❌ | ❌ |

| [ChatCohere](/docs/integrations/chat/cohere/) | ✅ | ❌ | ✅ | ✅ | ✅ |

| [ChatFireworks](/docs/integrations/chat/fireworks/) | ✅ | ✅ | ✅ | ✅ | ✅ |

| [ChatGoogleGenerativeAI](/docs/integrations/chat/google_generativeai/) | ✅ | ❌ | ✅ | ✅ | ✅ |

| [ChatVertexAI](/docs/integrations/chat/google_vertex_ai/) | ✅ | ❌ | ✅ | ✅ | ✅ |

| [ChatGroq](/docs/integrations/chat/groq/) | ✅ | ✅ | ✅ | ✅ | ✅ |

| [ChatMistralAI](/docs/integrations/chat/mistral/) | ✅ | ✅ | ✅ | ✅ | ✅ |

| [ChatOllama](/docs/integrations/chat/ollama/) | ✅ | ✅ | ✅ | ✅ | ✅ |

| [ChatOpenAI](/docs/integrations/chat/openai/) | ✅ | ✅ | ✅ | ✅ | ✅ |

| [ChatTogetherAI](/docs/integrations/chat/togetherai/) | ✅ | ✅ | ✅ | ✅ | ✅ |

| [ChatXAI](/docs/integrations/chat/xai/) | ✅ | ✅ | ✅ | ✅ | ❌ |

## All chat models[​](#all-chat-models)

| Name | Description |

| [Alibaba Tongyi](/docs/integrations/chat/alibaba_tongyi) | LangChain.js supports the Alibaba qwen family of models. |

| [Anthropic](/docs/integrations/chat/anthropic) | Anthropic is an AI safety and research |

| [Arcjet Redact](/docs/integrations/chat/arcjet) | The Arcjet redact integration allows you to redact |

| [Azure OpenAI](/docs/integrations/chat/azure) | Azure OpenAI is a Microsoft Azure service that provides powerful |

| [Baidu Qianfan](/docs/integrations/chat/baidu_qianfan) | Setup |

| [Amazon Bedrock](/docs/integrations/chat/bedrock) | Amazon Bedrock is a fully managed |

| [Amazon Bedrock Converse](/docs/integrations/chat/bedrock_converse) | [Amazon Bedrock |

| [Cerebras](/docs/integrations/chat/cerebras) | Cerebras is a model provider that serves open |

| [Cloudflare Workers AI](/docs/integrations/chat/cloudflare_workersai) | Workers AI allows you |

| [Cohere](/docs/integrations/chat/cohere) | Cohere is a Canadian startup that provides |

| [Deep Infra](/docs/integrations/chat/deep_infra) | LangChain supports chat models hosted by Deep Infra through the ChatD... |

| [DeepSeek](/docs/integrations/chat/deepseek) | This will help you getting started with DeepSeek [chat |

| [DeepSeek](/docs/integrations/chat/deepseek) | This will help you getting started with DeepSeek [chat |

| [Fake LLM](/docs/integrations/chat/fake) | LangChain provides a fake LLM chat model for testing purposes. This a... |

| [Fireworks](/docs/integrations/chat/fireworks) | Fireworks AI is an AI inference platform to run |

| [Friendli](/docs/integrations/chat/friendli) | Friendli enhances AI application performance and optimizes cost savin... |

| [Google GenAI](/docs/integrations/chat/google_generativeai) | Google AI offers a number of different chat |

| [Google Vertex AI](/docs/integrations/chat/google_vertex_ai) | Google Vertex is a service that |

| [Groq](/docs/integrations/chat/groq) | Groq is a company that offers fast AI inference, |

| [IBM watsonx.ai](/docs/integrations/chat/ibm) | This will help you getting started with IBM watsonx.ai [chat |

| [Llama CPP](/docs/integrations/chat/llama_cpp) | Only available on Node.js. |

| [Minimax](/docs/integrations/chat/minimax) | Minimax is a Chinese startup that provides natural language processin... |

| [MistralAI](/docs/integrations/chat/mistral) | Mistral AI is a platform that offers hosting for |

| [Moonshot](/docs/integrations/chat/moonshot) | LangChain.js supports the Moonshot AI family of models. |

| [Novita AI](/docs/integrations/chat/novita) | Delivers an affordable, reliable, and simple inference platform for |

| [Ollama](/docs/integrations/chat/ollama) | Ollama allows you to run open-source large |

| [OpenAI](/docs/integrations/chat/openai) | OpenAI is an artificial |

| [Perplexity](/docs/integrations/chat/perplexity) | This guide will help you getting started with Perplexity [chat |

| [Perplexity](/docs/integrations/chat/perplexity) | This guide will help you getting started with Perplexity [chat |

| [PremAI](/docs/integrations/chat/premai) | Setup |

| [Tencent Hunyuan](/docs/integrations/chat/tencent_hunyuan) | LangChain.js supports the Tencent Hunyuan family of models. |

| [Together](/docs/integrations/chat/togetherai) | Together AI offers an API to query [50+ |

| [WebLLM](/docs/integrations/chat/web_llm) | Only available in web environments. |

| [xAI](/docs/integrations/chat/xai) | xAI is an artificial intelligence company that develops |

| [YandexGPT](/docs/integrations/chat/yandex) | LangChain.js supports calling YandexGPT chat models. |

| [ZhipuAI](/docs/integrations/chat/zhipuai) | LangChain.js supports the Zhipu AI family of models. |

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