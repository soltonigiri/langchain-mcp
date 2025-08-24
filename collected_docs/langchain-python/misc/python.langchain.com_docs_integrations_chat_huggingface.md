ChatHuggingFace | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/huggingface.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/integrations/chat/huggingface.ipynb)ChatHuggingFace This will help you get started with langchain_huggingface [chat models](/docs/concepts/chat_models/). For detailed documentation of all ChatHuggingFace features and configurations head to the [API reference](https://python.langchain.com/api_reference/huggingface/chat_models/langchain_huggingface.chat_models.huggingface.ChatHuggingFace.html). For a list of models supported by Hugging Face check out [this page](https://huggingface.co/models). Overview[​](#overview) Integration details[​](#integration-details) Integration details[​](#integration-details-1) ClassPackageLocalSerializableJS supportPackage downloadsPackage latest[ChatHuggingFace](https://python.langchain.com/api_reference/huggingface/chat_models/langchain_huggingface.chat_models.huggingface.ChatHuggingFace.html)[langchain-huggingface](https://python.langchain.com/api_reference/huggingface/index.html)✅beta❌![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain_huggingface?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain_huggingface?style=flat-square&label=%20) Model features[​](#model-features) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌✅✅✅❌✅✅❌ Setup[​](#setup) To access Hugging Face models you&#x27;ll need to create a Hugging Face account, get an API key, and install the langchain-huggingface integration package. Credentials[​](#credentials) Generate a [Hugging Face Access Token](https://huggingface.co/docs/hub/security-tokens) and store it as an environment variable: HUGGINGFACEHUB_API_TOKEN.

```python
import getpass
import os

if not os.getenv("HUGGINGFACEHUB_API_TOKEN"):
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = getpass.getpass("Enter your token: ")

``` Installation[​](#installation) ClassPackageLocalSerializableJS supportPackage downloadsPackage latest[ChatHuggingFace](https://python.langchain.com/api_reference/huggingface/chat_models/langchain_huggingface.chat_models.huggingface.ChatHuggingFace.html)[langchain-huggingface](https://python.langchain.com/api_reference/huggingface/index.html)✅❌❌![PyPI - Downloads ](https://img.shields.io/pypi/dm/langchain_huggingface?style=flat-square&label=%20)![PyPI - Version ](https://img.shields.io/pypi/v/langchain_huggingface?style=flat-square&label=%20) Model features[​](#model-features-1) [Tool calling](/docs/how_to/tool_calling/)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)Native async[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌❌❌❌❌❌❌❌ Setup[​](#setup-1) To access langchain_huggingface models you&#x27;ll need to create a Hugging Face account, get an API key, and install the langchain-huggingface integration package. Credentials[​](#credentials-1) You&#x27;ll need to have a [Hugging Face Access Token](https://huggingface.co/docs/hub/security-tokens) saved as an environment variable: HUGGINGFACEHUB_API_TOKEN.

```python
import getpass
import os

os.environ["HUGGINGFACEHUB_API_TOKEN"] = getpass.getpass(
    "Enter your Hugging Face API key: "
)

```

```python
%pip install --upgrade --quiet  langchain-huggingface text-generation transformers google-search-results numexpr langchainhub sentencepiece jinja2 bitsandbytes accelerate

```

```output
[1m[[0m[34;49mnotice[0m[1;39;49m][0m[39;49m A new release of pip is available: [0m[31;49m24.0[0m[39;49m -> [0m[32;49m24.1.2[0m
[1m[[0m[34;49mnotice[0m[1;39;49m][0m[39;49m To update, run: [0m[32;49mpip install --upgrade pip[0m
Note: you may need to restart the kernel to use updated packages.

``` Instantiation[​](#instantiation) You can instantiate a ChatHuggingFace model in two different ways, either from a HuggingFaceEndpoint or from a HuggingFacePipeline. HuggingFaceEndpoint[​](#huggingfaceendpoint)

```python
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

llm = HuggingFaceEndpoint(
    repo_id="deepseek-ai/DeepSeek-R1-0528",
    task="text-generation",
    max_new_tokens=512,
    do_sample=False,
    repetition_penalty=1.03,
    provider="auto",  # let Hugging Face choose the best provider for you
)

chat_model = ChatHuggingFace(llm=llm)

```

```output
The token has not been saved to the git credentials helper. Pass `add_to_git_credential=True` in this function directly or `--add-to-git-credential` if using via `huggingface-cli` if you want to set the git credential as well.
Token is valid (permission: fineGrained).
Your token has been saved to /Users/isaachershenson/.cache/huggingface/token
Login successful

``` Now let&#x27;s take advantage of [Inference Providers](https://huggingface.co/docs/inference-providers) to run the model on specific third-party providers

```python
llm = HuggingFaceEndpoint(
    repo_id="deepseek-ai/DeepSeek-R1-0528",
    task="text-generation",
    provider="hyperbolic",  # set your provider here
    # provider="nebius",
    # provider="together",
)

chat_model = ChatHuggingFace(llm=llm)

``` HuggingFacePipeline[​](#huggingfacepipeline)

```python
from langchain_huggingface import ChatHuggingFace, HuggingFacePipeline

llm = HuggingFacePipeline.from_model_id(
    model_id="HuggingFaceH4/zephyr-7b-beta",
    task="text-generation",
    pipeline_kwargs=dict(
        max_new_tokens=512,
        do_sample=False,
        repetition_penalty=1.03,
    ),
)

chat_model = ChatHuggingFace(llm=llm)

```

```output
config.json:   0%|          | 0.00/638 [00:00<?, ?B/s]

```

```output
model.safetensors.index.json:   0%|          | 0.00/23.9k [00:00<?, ?B/s]

```

```output
Downloading shards:   0%|          | 0/8 [00:00<?, ?it/s]

```

```output
model-00001-of-00008.safetensors:   0%|          | 0.00/1.89G [00:00<?, ?B/s]

```

```output
model-00002-of-00008.safetensors:   0%|          | 0.00/1.95G [00:00<?, ?B/s]

```

```output
model-00003-of-00008.safetensors:   0%|          | 0.00/1.98G [00:00<?, ?B/s]

```

```output
model-00004-of-00008.safetensors:   0%|          | 0.00/1.95G [00:00<?, ?B/s]

```

```output
model-00005-of-00008.safetensors:   0%|          | 0.00/1.98G [00:00<?, ?B/s]

```

```output
model-00006-of-00008.safetensors:   0%|          | 0.00/1.95G [00:00<?, ?B/s]

```

```output
model-00007-of-00008.safetensors:   0%|          | 0.00/1.98G [00:00<?, ?B/s]

```

```output
model-00008-of-00008.safetensors:   0%|          | 0.00/816M [00:00<?, ?B/s]

```

```output
Loading checkpoint shards:   0%|          | 0/8 [00:00<?, ?it/s]

```

```output
generation_config.json:   0%|          | 0.00/111 [00:00<?, ?B/s]

``` Instatiating with Quantization[​](#instatiating-with-quantization) To run a quantized version of your model, you can specify a bitsandbytes quantization config as follows:

```python
from transformers import BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype="float16",
    bnb_4bit_use_double_quant=True,
)

``` and pass it to the HuggingFacePipeline as a part of its model_kwargs:

```python
llm = HuggingFacePipeline.from_model_id(
    model_id="HuggingFaceH4/zephyr-7b-beta",
    task="text-generation",
    pipeline_kwargs=dict(
        max_new_tokens=512,
        do_sample=False,
        repetition_penalty=1.03,
        return_full_text=False,
    ),
    model_kwargs={"quantization_config": quantization_config},
)

chat_model = ChatHuggingFace(llm=llm)

``` Invocation[​](#invocation)

```python
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
)

messages = [
    SystemMessage(content="You&#x27;re a helpful assistant"),
    HumanMessage(
        content="What happens when an unstoppable force meets an immovable object?"
    ),
]

ai_msg = chat_model.invoke(messages)

```API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html) | [SystemMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.system.SystemMessage.html)

```python
print(ai_msg.content)

```

```output
According to the popular phrase and hypothetical scenario, when an unstoppable force meets an immovable object, a paradoxical situation arises as both forces are seemingly contradictory. On one hand, an unstoppable force is an entity that cannot be stopped or prevented from moving forward, while on the other hand, an immovable object is something that cannot be moved or displaced from its position.

In this scenario, it is un

``` ## API reference[​](#api-reference) For detailed documentation of all ChatHuggingFace features and configurations head to the API reference: [https://python.langchain.com/api_reference/huggingface/chat_models/langchain_huggingface.chat_models.huggingface.ChatHuggingFace.html](https://python.langchain.com/api_reference/huggingface/chat_models/langchain_huggingface.chat_models.huggingface.ChatHuggingFace.html) ## API reference[​](#api-reference-1) For detailed documentation of all ChatHuggingFace features and configurations head to the API reference: [https://python.langchain.com/api_reference/huggingface/chat_models/langchain_huggingface.chat_models.huggingface.ChatHuggingFace.html](https://python.langchain.com/api_reference/huggingface/chat_models/langchain_huggingface.chat_models.huggingface.ChatHuggingFace.html) ## Related[​](#related) Chat model [conceptual guide](/docs/concepts/chat_models/)

- Chat model [how-to guides](/docs/how_to/#chat-models)

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/integrations/chat/huggingface.ipynb)

- [Overview](#overview)[Integration details](#integration-details)
- [Integration details](#integration-details-1)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)
- [Model features](#model-features-1)

- [Setup](#setup-1)[Credentials](#credentials-1)

- [Instantiation](#instantiation)[HuggingFaceEndpoint](#huggingfaceendpoint)
- [HuggingFacePipeline](#huggingfacepipeline)
- [Instatiating with Quantization](#instatiating-with-quantization)

- [Invocation](#invocation)
- [API reference](#api-reference)
- [API reference](#api-reference-1)
- [Related](#related)

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