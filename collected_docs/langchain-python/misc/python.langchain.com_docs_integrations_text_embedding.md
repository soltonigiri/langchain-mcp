Embedding models | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/text_embedding/index.mdx) # Embedding models [Embedding models](/docs/concepts/embedding_models/) create a vector representation of a piece of text. This page documents integrations with various model providers that allow you to use embeddings in LangChain. Select [embeddings model](/docs/integrations/text_embedding/):OpenAI▾[OpenAI](#)
- [Azure](#)
- [Google Gemini](#)
- [Google Vertex](#)
- [AWS](#)
- [HuggingFace](#)
- [Ollama](#)
- [Cohere](#)
- [MistralAI](#)
- [Nomic](#)
- [NVIDIA](#)
- [Voyage AI](#)
- [IBM watsonx](#)
- [Fake](#)

```bash
pip install -qU langchain-openai

```

```python
import getpass
import os

if not os.environ.get("OPENAI_API_KEY"):
  os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")

from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

```

```python
embeddings.embed_query("Hello, world!")

```

| Provider | Package |

| [AzureOpenAI](/docs/integrations/text_embedding/azureopenai) | [langchain-openai](https://python.langchain.com/api_reference/openai/embeddings/langchain_openai.embeddings.azure.AzureOpenAIEmbeddings.html) |

| [Ollama](/docs/integrations/text_embedding/ollama) | [langchain-ollama](https://python.langchain.com/api_reference/ollama/embeddings/langchain_ollama.embeddings.OllamaEmbeddings.html) |

| [Fake](/docs/integrations/text_embedding/fake) | [langchain-core](https://python.langchain.com/api_reference/core/embeddings/langchain_core.embeddings.fake.FakeEmbeddings.html) |

| [OpenAI](/docs/integrations/text_embedding/openai) | [langchain-openai](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html) |

| [Google Gemini](/docs/integrations/text_embedding/google_generative_ai) | [langchain-google-genai](https://python.langchain.com/api_reference/google_genai/embeddings/langchain_google_genai.embeddings.GoogleGenerativeAIEmbeddings.html) |

| [Together](/docs/integrations/text_embedding/together) | [langchain-together](https://python.langchain.com/api_reference/together/embeddings/langchain_together.embeddings.TogetherEmbeddings.html) |

| [Fireworks](/docs/integrations/text_embedding/fireworks) | [langchain-fireworks](https://python.langchain.com/api_reference/fireworks/embeddings/langchain_fireworks.embeddings.FireworksEmbeddings.html) |

| [MistralAI](/docs/integrations/text_embedding/mistralai) | [langchain-mistralai](https://python.langchain.com/api_reference/mistralai/embeddings/langchain_mistralai.embeddings.MistralAIEmbeddings.html) |

| [Cohere](/docs/integrations/text_embedding/cohere) | [langchain-cohere](https://python.langchain.com/api_reference/community/llms/langchain_community.llms.cohere.Cohere.html) |

| [Nomic](/docs/integrations/text_embedding/nomic) | [langchain-nomic](https://python.langchain.com/api_reference/nomic/embeddings/langchain_nomic.embeddings.NomicEmbeddings.html) |

| [Databricks](/docs/integrations/text_embedding/databricks) | [databricks-langchain](https://api-docs.databricks.com/python/databricks-ai-bridge/latest/databricks_langchain.html#databricks_langchain.DatabricksEmbeddings) |

| [IBM](/docs/integrations/text_embedding/ibm_watsonx) | [langchain-ibm](https://python.langchain.com/api_reference/ibm/embeddings/langchain_ibm.embeddings.WatsonxEmbeddings.html) |

| [NVIDIA](/docs/integrations/text_embedding/nvidia_ai_endpoints) | [langchain-nvidia](https://python.langchain.com/api_reference/nvidia_ai_endpoints/embeddings/langchain_nvidia_ai_endpoints.embeddings.NVIDIAEmbeddings.html) |

## All embedding models[​](#all-embedding-models)

| Name | Description |

| [Aleph Alpha](/docs/integrations/text_embedding/aleph_alpha) | There are two possible ways to use Aleph Alpha&#x27;s semantic embeddings.... |

| [Anyscale](/docs/integrations/text_embedding/anyscale) | Let&#x27;s load the Anyscale Embedding class. |

| [ascend](/docs/integrations/text_embedding/ascend) | [[-0.00348254 0.03098977 -0.00203087 ... 0.08492374 0.03970494 |

| [AwaDB](/docs/integrations/text_embedding/awadb) | AwaDB is an AI Native database for the search and storage of embeddin... |

| [AzureOpenAI](/docs/integrations/text_embedding/azureopenai) | This will help you get started with AzureOpenAI embedding models usin... |

| [Baichuan Text Embeddings](/docs/integrations/text_embedding/baichuan) | As of today (Jan 25th, 2024) BaichuanTextEmbeddings ranks #1 in C-MTE... |

| [Baidu Qianfan](/docs/integrations/text_embedding/baidu_qianfan_endpoint) | Baidu AI Cloud Qianfan Platform is a one-stop large model development... |

| [Bedrock](/docs/integrations/text_embedding/bedrock) | Amazon Bedrock is a fully managed service that offers a choice of |

| [BGE on Hugging Face](/docs/integrations/text_embedding/bge_huggingface) | BGE models on the HuggingFace are one of the best open-source embeddi... |

| [Bookend AI](/docs/integrations/text_embedding/bookend) | Let&#x27;s load the Bookend AI Embeddings class. |

| [Clarifai](/docs/integrations/text_embedding/clarifai) | Clarifai is an AI Platform that provides the full AI lifecycle rangin... |

| [Cloudflare Workers AI](/docs/integrations/text_embedding/cloudflare_workersai) | Cloudflare, Inc. (Wikipedia) is an American company that provides con... |

| [Clova Embeddings](/docs/integrations/text_embedding/clova) | Clova offers an embeddings service |

| [Cohere](/docs/integrations/text_embedding/cohere) | This will help you get started with Cohere embedding models using Lan... |

| [DashScope](/docs/integrations/text_embedding/dashscope) | Let&#x27;s load the DashScope Embedding class. |

| [Databricks](/docs/integrations/text_embedding/databricks) | Databricks Lakehouse Platform unifies data, analytics, and AI on one ... |

| [DeepInfra](/docs/integrations/text_embedding/deepinfra) | DeepInfra is a serverless inference as a service that provides access... |

| [EDEN AI](/docs/integrations/text_embedding/edenai) | Eden AI is revolutionizing the AI landscape by uniting the best AI pr... |

| [Elasticsearch](/docs/integrations/text_embedding/elasticsearch) | Walkthrough of how to generate embeddings using a hosted embedding mo... |

| [Embaas](/docs/integrations/text_embedding/embaas) | embaas is a fully managed NLP API service that offers features like e... |

| [Fake Embeddings](/docs/integrations/text_embedding/fake) | LangChain also provides a fake embedding class. You can use this to t... |

| [FastEmbed by Qdrant](/docs/integrations/text_embedding/fastembed) | FastEmbed from Qdrant is a lightweight, fast, Python library built fo... |

| [Fireworks](/docs/integrations/text_embedding/fireworks) | This will help you get started with Fireworks embedding models using ... |

| [Google Gemini](/docs/integrations/text_embedding/google_generative_ai) | Connect to Google&#x27;s generative AI embeddings service using the Google... |

| [Google Vertex AI](/docs/integrations/text_embedding/google_vertex_ai_palm) | This will help you get started with Google Vertex AI Embeddings model... |

| [GPT4All](/docs/integrations/text_embedding/gpt4all) | GPT4All is a free-to-use, locally running, privacy-aware chatbot. The... |

| [Gradient](/docs/integrations/text_embedding/gradient) | Gradient allows to create Embeddings as well fine tune and get comple... |

| [GreenNode](/docs/integrations/text_embedding/greennode) | GreenNode is a global AI solutions provider and a NVIDIA Preferred Pa... |

| [Hugging Face](/docs/integrations/text_embedding/huggingfacehub) | Let&#x27;s load the Hugging Face Embedding class. |

| [IBM watsonx.ai](/docs/integrations/text_embedding/ibm_watsonx) | WatsonxEmbeddings is a wrapper for IBM watsonx.ai foundation models. |

| [Infinity](/docs/integrations/text_embedding/infinity) | Infinity allows to create Embeddings using a MIT-licensed Embedding S... |

| [Instruct Embeddings on Hugging Face](/docs/integrations/text_embedding/instruct_embeddings) | Hugging Face sentence-transformers is a Python framework for state-of... |

| [IPEX-LLM: Local BGE Embeddings on Intel CPU](/docs/integrations/text_embedding/ipex_llm) | IPEX-LLM is a PyTorch library for running LLM on Intel CPU and GPU (e... |

| [IPEX-LLM: Local BGE Embeddings on Intel GPU](/docs/integrations/text_embedding/ipex_llm_gpu) | IPEX-LLM is a PyTorch library for running LLM on Intel CPU and GPU (e... |

| [Intel® Extension for Transformers Quantized Text Embeddings](/docs/integrations/text_embedding/itrex) | Load quantized BGE embedding models generated by Intel® Extension for... |

| [Jina](/docs/integrations/text_embedding/jina) | You can check the list of available models from here. |

| [John Snow Labs](/docs/integrations/text_embedding/johnsnowlabs_embedding) | John Snow Labs NLP & LLM ecosystem includes software libraries for st... |

| [LASER Language-Agnostic SEntence Representations Embeddings by Meta AI](/docs/integrations/text_embedding/laser) | LASER is a Python library developed by the Meta AI Research team and ... |

| [Lindorm](/docs/integrations/text_embedding/lindorm) | This will help you get started with Lindorm embedding models using La... |

| [Llama.cpp](/docs/integrations/text_embedding/llamacpp) | llama.cpp python library is a simple Python bindings for @ggerganov |

| [llamafile](/docs/integrations/text_embedding/llamafile) | Let&#x27;s load the llamafile Embeddings class. |

| [LLMRails](/docs/integrations/text_embedding/llm_rails) | Let&#x27;s load the LLMRails Embeddings class. |

| [LocalAI](/docs/integrations/text_embedding/localai) | langchain-localai is a 3rd party integration package for LocalAI. It ... |

| [MiniMax](/docs/integrations/text_embedding/minimax) | MiniMax offers an embeddings service. |

| [MistralAI](/docs/integrations/text_embedding/mistralai) | This will help you get started with MistralAI embedding models using ... |

| [model2vec](/docs/integrations/text_embedding/model2vec) | Model2Vec is a technique to turn any sentence transformer into a real... |

| [ModelScope](/docs/integrations/text_embedding/modelscope_embedding) | ModelScope (Home | GitHub) is built upon the notion of “Model-as-a-Se... |

| [MosaicML](/docs/integrations/text_embedding/mosaicml) | MosaicML offers a managed inference service. You can either use a var... |

| [Naver](/docs/integrations/text_embedding/naver) | This notebook covers how to get started with embedding models provide... |

| [Nebius](/docs/integrations/text_embedding/nebius) | Nebius AI Studio provides API access to high-quality embedding models... |

| [Netmind](/docs/integrations/text_embedding/netmind) | This will help you get started with Netmind embedding models using La... |

| [NLP Cloud](/docs/integrations/text_embedding/nlp_cloud) | NLP Cloud is an artificial intelligence platform that allows you to u... |

| [Nomic](/docs/integrations/text_embedding/nomic) | This will help you get started with Nomic embedding models using Lang... |

| [NVIDIA NIMs](/docs/integrations/text_embedding/nvidia_ai_endpoints) | The langchain-nvidia-ai-endpoints package contains LangChain integrat... |

| [Oracle Cloud Infrastructure Generative AI](/docs/integrations/text_embedding/oci_generative_ai) | Oracle Cloud Infrastructure (OCI) Generative AI is a fully managed se... |

| [Ollama](/docs/integrations/text_embedding/ollama) | This will help you get started with Ollama embedding models using Lan... |

| [OpenClip](/docs/integrations/text_embedding/open_clip) | OpenClip is an source implementation of OpenAI&#x27;s CLIP. |

| [OpenAI](/docs/integrations/text_embedding/openai) | This will help you get started with OpenAI embedding models using Lan... |

| [OpenVINO](/docs/integrations/text_embedding/openvino) | OpenVINO™ is an open-source toolkit for optimizing and deploying AI i... |

| [Embedding Documents using Optimized and Quantized Embedders](/docs/integrations/text_embedding/optimum_intel) | Embedding all documents using Quantized Embedders. |

| [Oracle AI Vector Search: Generate Embeddings](/docs/integrations/text_embedding/oracleai) | Oracle AI Vector Search is designed for Artificial Intelligence (AI) ... |

| [OVHcloud](/docs/integrations/text_embedding/ovhcloud) | In order to use this model you need to create a new token on the AI E... |

| [Pinecone Embeddings](/docs/integrations/text_embedding/pinecone) | Pinecone&#x27;s inference API can be accessed via PineconeEmbeddings. Prov... |

| [PredictionGuardEmbeddings](/docs/integrations/text_embedding/predictionguard) | Prediction Guard is a secure, scalable GenAI platform that safeguards... |

| [PremAI](/docs/integrations/text_embedding/premai) | PremAI is an all-in-one platform that simplifies the creation of robu... |

| [SageMaker](/docs/integrations/text_embedding/sagemaker-endpoint) | Let&#x27;s load the SageMaker Endpoints Embeddings class. The class can be... |

| [SambaNovaCloud](/docs/integrations/text_embedding/sambanova) | This will help you get started with SambaNovaCloud embedding models u... |

| [SambaStudio](/docs/integrations/text_embedding/sambastudio) | This will help you get started with SambaNova&#x27;s SambaStudio embedding... |

| [Self Hosted](/docs/integrations/text_embedding/self-hosted) | Let&#x27;s load the SelfHostedEmbeddings, SelfHostedHuggingFaceEmbeddings,... |

| [Sentence Transformers on Hugging Face](/docs/integrations/text_embedding/sentence_transformers) | Hugging Face sentence-transformers is a Python framework for state-of... |

| [Solar](/docs/integrations/text_embedding/solar) | Solar offers an embeddings service. |

| [SpaCy](/docs/integrations/text_embedding/spacy_embedding) | spaCy is an open-source software library for advanced natural languag... |

| [SparkLLM Text Embeddings](/docs/integrations/text_embedding/sparkllm) | Official Website//www.xfyun.cn/doc/spark/Embeddingnewapi.html |

| [TensorFlow Hub](/docs/integrations/text_embedding/tensorflowhub) | TensorFlow Hub is a repository of trained machine learning models rea... |

| [Text Embeddings Inference](/docs/integrations/text_embedding/text_embeddings_inference) | Hugging Face Text Embeddings Inference (TEI) is a toolkit for deployi... |

| [TextEmbed - Embedding Inference Server](/docs/integrations/text_embedding/textembed) | TextEmbed is a high-throughput, low-latency REST API designed for ser... |

| [Titan Takeoff](/docs/integrations/text_embedding/titan_takeoff) | TitanML helps businesses build and deploy better, smaller, cheaper, a... |

| [Together AI](/docs/integrations/text_embedding/together) | This will help you get started with Together embedding models using L... |

| [Upstage](/docs/integrations/text_embedding/upstage) | This notebook covers how to get started with Upstage embedding models. |

| [Volc Engine](/docs/integrations/text_embedding/volcengine) | This notebook provides you with a guide on how to load the Volcano Em... |

| [Voyage AI](/docs/integrations/text_embedding/voyageai) | Voyage AI provides cutting-edge embedding/vectorizations models. |

| [Xorbits inference (Xinference)](/docs/integrations/text_embedding/xinference) | This notebook goes over how to use Xinference embeddings within LangC... |

| [YandexGPT](/docs/integrations/text_embedding/yandex) | This notebook goes over how to use Langchain with YandexGPT embedding... |

| [ZhipuAI](/docs/integrations/text_embedding/zhipuai) | This will help you get started with ZhipuAI embedding models using La... |

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/text_embedding/index.mdx)

- [All embedding models](#all-embedding-models)

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