Chat models | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/index.mdx) # Chat models [Chat models](/docs/concepts/chat_models/) are language models that use a sequence of [messages](/docs/concepts/messages/) as inputs and return messages as outputs (as opposed to using plain text). These are generally newer models. infoIf you&#x27;d like to write your own chat model, see [this how-to](/docs/how_to/custom_chat_model/). If you&#x27;d like to contribute an integration, see [Contributing integrations](/docs/contributing/how_to/integrations/). Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)
- [Anthropic](#)
- [Azure](#)
- [Google Gemini](#)
- [Google Vertex](#)
- [AWS](#)
- [Groq](#)
- [Cohere](#)
- [NVIDIA](#)
- [Fireworks AI](#)
- [Mistral AI](#)
- [Together AI](#)
- [IBM watsonx](#)
- [Databricks](#)
- [xAI](#)
- [Perplexity](#)
- [DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

```

```python
model.invoke("Hello, world!")

``` ## Featured Providers[​](#featured-providers) infoWhile all these LangChain classes support the indicated advanced feature, you may have to open the provider-specific documentation to learn which hosted models or backends support the feature.

| Provider | [Tool calling](/docs/how_to/tool_calling) | [Structured output](/docs/how_to/structured_output/) | JSON mode | Local | [Multimodal](/docs/how_to/multimodal_inputs/) | Package |

| [ChatAnthropic](anthropic/) | ✅ | ✅ | ❌ | ❌ | ✅ | [langchain-anthropic](https://python.langchain.com/api_reference/anthropic/chat_models/langchain_anthropic.chat_models.ChatAnthropic.html) |

| [ChatMistralAI](mistralai/) | ✅ | ✅ | ❌ | ❌ | ❌ | [langchain-mistralai](https://python.langchain.com/api_reference/mistralai/chat_models/langchain_mistralai.chat_models.ChatMistralAI.html) |

| [ChatFireworks](fireworks/) | ✅ | ✅ | ✅ | ❌ | ❌ | [langchain-fireworks](https://python.langchain.com/api_reference/fireworks/chat_models/langchain_fireworks.chat_models.ChatFireworks.html) |

| [AzureChatOpenAI](azure_chat_openai/) | ✅ | ✅ | ✅ | ❌ | ✅ | [langchain-openai](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.azure.AzureChatOpenAI.html) |

| [ChatOpenAI](openai/) | ✅ | ✅ | ✅ | ❌ | ✅ | [langchain-openai](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html) |

| [ChatTogether](together/) | ✅ | ✅ | ✅ | ❌ | ❌ | [langchain-together](https://python.langchain.com/api_reference/together/chat_models/langchain_together.chat_models.ChatTogether.html) |

| [ChatVertexAI](google_vertex_ai_palm/) | ✅ | ✅ | ❌ | ❌ | ✅ | [langchain-google-vertexai](https://python.langchain.com/api_reference/google_vertexai/chat_models/langchain_google_vertexai.chat_models.ChatVertexAI.html) |

| [ChatGoogleGenerativeAI](google_generative_ai/) | ✅ | ✅ | ❌ | ❌ | ✅ | [langchain-google-genai](https://python.langchain.com/api_reference/google_genai/chat_models/langchain_google_genai.chat_models.ChatGoogleGenerativeAI.html) |

| [ChatGroq](groq/) | ✅ | ✅ | ✅ | ❌ | ❌ | [langchain-groq](https://python.langchain.com/api_reference/groq/chat_models/langchain_groq.chat_models.ChatGroq.html) |

| [ChatCohere](cohere/) | ✅ | ✅ | ❌ | ❌ | ❌ | [langchain-cohere](https://python.langchain.com/api_reference/cohere/chat_models/langchain_cohere.chat_models.ChatCohere.html) |

| [ChatBedrock](bedrock/) | ✅ | ✅ | ❌ | ❌ | ❌ | [langchain-aws](https://python.langchain.com/api_reference/aws/chat_models/langchain_aws.chat_models.bedrock.ChatBedrock.html) |

| [ChatHuggingFace](huggingface/) | ✅ | ✅ | ❌ | ✅ | ❌ | [langchain-huggingface](https://python.langchain.com/api_reference/huggingface/chat_models/langchain_huggingface.chat_models.huggingface.ChatHuggingFace.html) |

| [ChatNVIDIA](nvidia_ai_endpoints/) | ✅ | ✅ | ✅ | ✅ | ✅ | [langchain-nvidia-ai-endpoints](https://python.langchain.com/api_reference/nvidia_ai_endpoints/chat_models/langchain_nvidia_ai_endpoints.chat_models.ChatNVIDIA.html) |

| [ChatOllama](ollama/) | ✅ | ✅ | ✅ | ✅ | ❌ | [langchain-ollama](https://python.langchain.com/api_reference/ollama/chat_models/langchain_ollama.chat_models.ChatOllama.html) |

| [ChatLlamaCpp](llamacpp) | ✅ | ✅ | ❌ | ✅ | ❌ | [langchain-community](https://python.langchain.com/api_reference/community/chat_models/langchain_community.chat_models.llamacpp.ChatLlamaCpp.html) |

| [ChatAI21](ai21) | ✅ | ✅ | ❌ | ❌ | ❌ | [langchain-ai21](https://python.langchain.com/api_reference/ai21/chat_models/langchain_ai21.chat_models.ChatAI21.html) |

| [ChatUpstage](upstage) | ✅ | ✅ | ❌ | ❌ | ❌ | [langchain-upstage](https://python.langchain.com/api_reference/upstage/chat_models/langchain_upstage.chat_models.ChatUpstage.html) |

| [ChatDatabricks](databricks) | ✅ | ✅ | ❌ | ❌ | ❌ | [databricks-langchain](https://api-docs.databricks.com/python/databricks-ai-bridge/latest/databricks_langchain.html#databricks_langchain.ChatDatabricks) |

| [ChatWatsonx](ibm_watsonx) | ✅ | ✅ | ✅ | ❌ | ❌ | [langchain-ibm](https://python.langchain.com/api_reference/ibm/chat_models/langchain_ibm.chat_models.ChatWatsonx.html) |

| [ChatXAI](xai) | ✅ | ✅ | ❌ | ❌ | ❌ | [langchain-xai](https://python.langchain.com/api_reference/xai/chat_models/langchain_xai.chat_models.ChatXAI.html) |

| [ChatPerplexity](perplexity) | ❌ | ✅ | ✅ | ❌ | ✅ | [langchain-perplexity](https://python.langchain.com/api_reference/perplexity/chat_models/langchain_perplexity.chat_models.ChatPerplexity.html) |

## All chat models[​](#all-chat-models)

| Name | Description |

| [Abso](/docs/integrations/chat/abso) | This will help you get started with ChatAbso chat models. For detaile... |

| [AI21 Labs](/docs/integrations/chat/ai21) | This notebook covers how to get started with AI21 chat models. |

| [Alibaba Cloud PAI EAS](/docs/integrations/chat/alibaba_cloud_pai_eas) | Alibaba Cloud PAI (Platform for AI) is a lightweight and cost-efficie... |

| [Anthropic](/docs/integrations/chat/anthropic) | This notebook provides a quick overview for getting started with Anth... |

| [Anyscale](/docs/integrations/chat/anyscale) | This notebook demonstrates the use of langchain.chat_models.ChatAnysc... |

| [AzureAIChatCompletionsModel](/docs/integrations/chat/azure_ai) | This will help you get started with AzureAIChatCompletionsModel chat ... |

| [Azure OpenAI](/docs/integrations/chat/azure_chat_openai) | This guide will help you get started with AzureOpenAI chat models. Fo... |

| [Azure ML Endpoint](/docs/integrations/chat/azureml_chat_endpoint) | Azure Machine Learning is a platform used to build, train, and deploy... |

| [Baichuan Chat](/docs/integrations/chat/baichuan) | Baichuan chat models API by Baichuan Intelligent Technology. For more... |

| [Baidu Qianfan](/docs/integrations/chat/baidu_qianfan_endpoint) | Baidu AI Cloud Qianfan Platform is a one-stop large model development... |

| [AWS Bedrock](/docs/integrations/chat/bedrock) | This doc will help you get started with AWS Bedrock chat models. Amaz... |

| [Cerebras](/docs/integrations/chat/cerebras) | This notebook provides a quick overview for getting started with Cere... |

| [CloudflareWorkersAI](/docs/integrations/chat/cloudflare_workersai) | This will help you get started with CloudflareWorkersAI chat models. ... |

| [Cohere](/docs/integrations/chat/cohere) | This notebook covers how to get started with Cohere chat models. |

| [ContextualAI](/docs/integrations/chat/contextual) | This will help you get started with Contextual AI&#x27;s Grounded Language... |

| [Coze Chat](/docs/integrations/chat/coze) | ChatCoze chat models API by coze.com. For more information, see https... |

| [Dappier AI](/docs/integrations/chat/dappier) | Dappier: Powering AI with Dynamic, Real-Time Data Models |

| [Databricks](/docs/integrations/chat/databricks) | Databricks Lakehouse Platform unifies data, analytics, and AI on one ... |

| [DeepInfra](/docs/integrations/chat/deepinfra) | DeepInfra is a serverless inference as a service that provides access... |

| [DeepSeek](/docs/integrations/chat/deepseek) | This will help you get started with DeepSeek&#x27;s hosted chat models. Fo... |

| [Eden AI](/docs/integrations/chat/edenai) | Eden AI is revolutionizing the AI landscape by uniting the best AI pr... |

| [EverlyAI](/docs/integrations/chat/everlyai) | EverlyAI allows you to run your ML models at scale in the cloud. It a... |

| [Featherless AI](/docs/integrations/chat/featherless_ai) | This will help you get started with FeatherlessAi chat models. For de... |

| [Fireworks](/docs/integrations/chat/fireworks) | This doc helps you get started with Fireworks AI chat models. For det... |

| [ChatFriendli](/docs/integrations/chat/friendli) | Friendli enhances AI application performance and optimizes cost savin... |

| [Goodfire](/docs/integrations/chat/goodfire) | This will help you get started with Goodfire chat models. For detaile... |

| [Google Gemini](/docs/integrations/chat/google_generative_ai) | Access Google&#x27;s Generative AI models, including the Gemini family, di... |

| [Google Cloud Vertex AI](/docs/integrations/chat/google_vertex_ai_palm) | This page provides a quick overview for getting started with VertexAI... |

| [GPTRouter](/docs/integrations/chat/gpt_router) | GPTRouter is an open source LLM API Gateway that offers a universal A... |

| [DigitalOcean Gradient](/docs/integrations/chat/gradientai) | This will help you getting started with DigitalOcean Gradient Chat Mo... |

| [GreenNode](/docs/integrations/chat/greennode) | GreenNode is a global AI solutions provider and a NVIDIA Preferred Pa... |

| [Groq](/docs/integrations/chat/groq) | This will help you get started with Groq chat models. For detailed do... |

| [ChatHuggingFace](/docs/integrations/chat/huggingface) | This will help you get started with langchainhuggingface chat models.... |

| [IBM watsonx.ai](/docs/integrations/chat/ibm_watsonx) | ChatWatsonx is a wrapper for IBM watsonx.ai foundation models. |

| [JinaChat](/docs/integrations/chat/jinachat) | This notebook covers how to get started with JinaChat chat models. |

| [Kinetica](/docs/integrations/chat/kinetica) | This notebook demonstrates how to use Kinetica to transform natural l... |

| [Konko](/docs/integrations/chat/konko) | Konko API is a fully managed Web API designed to help application dev... |

| [LiteLLM](/docs/integrations/chat/litellm) | LiteLLM is a library that simplifies calling Anthropic, Azure, Huggin... |

| [Llama 2 Chat](/docs/integrations/chat/llama2_chat) | This notebook shows how to augment Llama-2 LLMs with the Llama2Chat w... |

| [Llama API](/docs/integrations/chat/llama_api) | This notebook shows how to use LangChain with LlamaAPI - a hosted ver... |

| [LlamaEdge](/docs/integrations/chat/llama_edge) | LlamaEdge allows you to chat with LLMs of GGUF format both locally an... |

| [Llama.cpp](/docs/integrations/chat/llamacpp) | llama.cpp python library is a simple Python bindings for @ggerganov |

| [maritalk](/docs/integrations/chat/maritalk) | MariTalk is an assistant developed by the Brazilian company Maritaca ... |

| [MiniMax](/docs/integrations/chat/minimax) | Minimax is a Chinese startup that provides LLM service for companies ... |

| [MistralAI](/docs/integrations/chat/mistralai) | This will help you get started with Mistral chat models. For detailed... |

| [MLX](/docs/integrations/chat/mlx) | This notebook shows how to get started using MLX LLM&#x27;s as chat models. |

| [ModelScope](/docs/integrations/chat/modelscope_chat_endpoint) | ModelScope (Home | GitHub) is built upon the notion of “Model-as-a-Se... |

| [Moonshot](/docs/integrations/chat/moonshot) | Moonshot is a Chinese startup that provides LLM service for companies... |

| [Naver](/docs/integrations/chat/naver) | This notebook provides a quick overview for getting started with Nave... |

| [Nebius](/docs/integrations/chat/nebius) | This page will help you get started with Nebius AI Studio chat models... |

| [Netmind](/docs/integrations/chat/netmind) | This will help you get started with Netmind chat models. For detailed... |

| [NVIDIA AI Endpoints](/docs/integrations/chat/nvidia_ai_endpoints) | This will help you get started with NVIDIA chat models. For detailed ... |

| [ChatOCIModelDeployment](/docs/integrations/chat/oci_data_science) | This will help you get started with OCIModelDeployment chat models. F... |

| [OCIGenAI](/docs/integrations/chat/oci_generative_ai) | This notebook provides a quick overview for getting started with OCIG... |

| [ChatOctoAI](/docs/integrations/chat/octoai) | OctoAI offers easy access to efficient compute and enables users to i... |

| [Ollama](/docs/integrations/chat/ollama) | Ollama allows you to run open-source large language models, such as g... |

| [OpenAI](/docs/integrations/chat/openai) | This notebook provides a quick overview for getting started with Open... |

| [Outlines](/docs/integrations/chat/outlines) | This will help you get started with Outlines chat models. For detaile... |

| [Perplexity](/docs/integrations/chat/perplexity) | This page will help you get started with Perplexity chat models. For ... |

| [Pipeshift](/docs/integrations/chat/pipeshift) | This will help you get started with Pipeshift chat models. For detail... |

| [ChatPredictionGuard](/docs/integrations/chat/predictionguard) | Prediction Guard is a secure, scalable GenAI platform that safeguards... |

| [PremAI](/docs/integrations/chat/premai) | PremAI is an all-in-one platform that simplifies the creation of robu... |

| [PromptLayer ChatOpenAI](/docs/integrations/chat/promptlayer_chatopenai) | This example showcases how to connect to PromptLayer to start recordi... |

| [Qwen QwQ](/docs/integrations/chat/qwq) | This will help you get started with QwQ chat models. For detailed doc... |

| [Reka](/docs/integrations/chat/reka) | This notebook provides a quick overview for getting started with Reka... |

| [RunPod Chat Model](/docs/integrations/chat/runpod) | Get started with RunPod chat models. |

| [SambaNovaCloud](/docs/integrations/chat/sambanova) | This will help you get started with SambaNovaCloud chat models. For d... |

| [SambaStudio](/docs/integrations/chat/sambastudio) | This will help you get started with SambaStudio chat models. For deta... |

| [ChatSeekrFlow](/docs/integrations/chat/seekrflow) | Seekr provides AI-powered solutions for structured, explainable, and ... |

| [Snowflake Cortex](/docs/integrations/chat/snowflake) | Snowflake Cortex gives you instant access to industry-leading large l... |

| [solar](/docs/integrations/chat/solar) | Deprecated since version 0.0.34: Use langchain_upstage.ChatUpstage in... |

| [SparkLLM Chat](/docs/integrations/chat/sparkllm) | SparkLLM chat models API by iFlyTek. For more information, see iFlyTe... |

| [Nebula (Symbl.ai)](/docs/integrations/chat/symblai_nebula) | This notebook covers how to get started with Nebula - Symbl.ai&#x27;s chat... |

| [Tencent Hunyuan](/docs/integrations/chat/tencent_hunyuan) | Tencent&#x27;s hybrid model API (Hunyuan API) |

| [Together](/docs/integrations/chat/together) | This page will help you get started with Together AI chat models. For... |

| [Tongyi Qwen](/docs/integrations/chat/tongyi) | Tongyi Qwen is a large language model developed by Alibaba&#x27;s Damo Aca... |

| [Upstage](/docs/integrations/chat/upstage) | This notebook covers how to get started with Upstage chat models. |

| [vectara](/docs/integrations/chat/vectara) | Vectara is the trusted AI Assistant and Agent platform, which focuses... |

| [vLLM Chat](/docs/integrations/chat/vllm) | vLLM can be deployed as a server that mimics the OpenAI API protocol.... |

| [Volc Engine Maas](/docs/integrations/chat/volcengine_maas) | This notebook provides you with a guide on how to get started with vo... |

| [Chat Writer](/docs/integrations/chat/writer) | This notebook provides a quick overview for getting started with Writ... |

| [xAI](/docs/integrations/chat/xai) | This page will help you get started with xAI chat models. For detaile... |

| [Xinference](/docs/integrations/chat/xinference) | Xinference is a powerful and versatile library designed to serve LLMs, |

| [YandexGPT](/docs/integrations/chat/yandex) | This notebook goes over how to use Langchain with YandexGPT chat mode... |

| [ChatYI](/docs/integrations/chat/yi) | This will help you get started with Yi chat models. For detailed docu... |

| [Yuan2.0](/docs/integrations/chat/yuan2) | This notebook shows how to use YUAN2 API in LangChain with the langch... |

| [ZHIPU AI](/docs/integrations/chat/zhipuai) | This notebook shows how to use ZHIPU AI API in LangChain with the lan... |

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/index.mdx)

- [Featured Providers](#featured-providers)
- [All chat models](#all-chat-models)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)
- [Slack](https://www.langchain.com/join-community)

GitHub

- [Organization](https://github.com/langchain-ai)
- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)
- [YouTube](https://www.youtube.com/@LangChain)

Copyright © 2025 LangChain, Inc.