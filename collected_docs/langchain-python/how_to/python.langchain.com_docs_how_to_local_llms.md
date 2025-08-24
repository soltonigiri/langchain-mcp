Run models locally | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/local_llms.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/local_llms.ipynb)Run models locally Use case[​](#use-case) The popularity of projects like [llama.cpp](https://github.com/ggerganov/llama.cpp), [Ollama](https://github.com/ollama/ollama), [GPT4All](https://github.com/nomic-ai/gpt4all), [llamafile](https://github.com/Mozilla-Ocho/llamafile), and others underscore the demand to run LLMs locally (on your own device). This has at least two important benefits: Privacy**: Your data is not sent to a third party, and it is not subject to the terms of service of a commercial service

- **Cost**: There is no inference fee, which is important for token-intensive applications (e.g., [long-running simulations](https://twitter.com/RLanceMartin/status/1691097659262820352?s=20), summarization)

## Overview[​](#overview)

Running an LLM locally requires a few things:

- **Open-source LLM**: An open-source LLM that can be freely modified and shared

- **Inference**: Ability to run this LLM on your device w/ acceptable latency

### Open-source LLMs[​](#open-source-llms)

Users can now gain access to a rapidly growing set of [open-source LLMs](https://cameronrwolfe.substack.com/p/the-history-of-open-source-llms-better).

These LLMs can be assessed across at least two dimensions (see figure):

- **Base model**: What is the base-model and how was it trained?

- **Fine-tuning approach**: Was the base-model fine-tuned and, if so, what [set of instructions](https://cameronrwolfe.substack.com/p/beyond-llama-the-power-of-open-llms#%C2%A7alpaca-an-instruction-following-llama-model) was used?

![Image description ](/assets/images/OSS_LLM_overview-9444c9793c76bd4785a5b0cd020c14ef.png)

The relative performance of these models can be assessed using several leaderboards, including:

- [LmSys](https://chat.lmsys.org/?arena)

- [GPT4All](https://gpt4all.io/index.html)

- [HuggingFace](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard)

### Inference[​](#inference)

A few frameworks for this have emerged to support inference of open-source LLMs on various devices:

- [llama.cpp](https://github.com/ggerganov/llama.cpp): C++ implementation of llama inference code with [weight optimization / quantization](https://finbarr.ca/how-is-llama-cpp-possible/)

- [gpt4all](https://docs.gpt4all.io/index.html): Optimized C backend for inference

- [ollama](https://github.com/ollama/ollama): Bundles model weights and environment into an app that runs on device and serves the LLM

- [llamafile](https://github.com/Mozilla-Ocho/llamafile): Bundles model weights and everything needed to run the model in a single file, allowing you to run the LLM locally from this file without any additional installation steps

In general, these frameworks will do a few things:

- **Quantization**: Reduce the memory footprint of the raw model weights

- **Efficient implementation for inference**: Support inference on consumer hardware (e.g., CPU or laptop GPU)

In particular, see [this excellent post](https://finbarr.ca/how-is-llama-cpp-possible/) on the importance of quantization.

![Image description ](/assets/images/llama-memory-weights-aaccef5df087e993b0f46277500039b6.png)

With less precision, we radically decrease the memory needed to store the LLM in memory.

In addition, we can see the importance of GPU memory bandwidth [sheet](https://docs.google.com/spreadsheets/d/1OehfHHNSn66BP2h3Bxp2NJTVX97icU0GmCXF6pK23H8/edit#gid=0)!

A Mac M2 Max is 5-6x faster than a M1 for inference due to the larger GPU memory bandwidth.

![Image description ](/assets/images/llama_t_put-c6f0ea201a6dd508999170325cd6804a.png)

### Formatting prompts[​](#formatting-prompts)

Some providers have [chat model](/docs/concepts/chat_models/) wrappers that takes care of formatting your input prompt for the specific local model you&#x27;re using. However, if you are prompting local models with a [text-in/text-out LLM](/docs/concepts/text_llms/) wrapper, you may need to use a prompt tailored for your specific model.

This can [require the inclusion of special tokens](https://huggingface.co/blog/llama2#how-to-prompt-llama-2). [Here&#x27;s an example for LLaMA 2](https://smith.langchain.com/hub/rlm/rag-prompt-llama).

## Quickstart[​](#quickstart)

[Ollama](https://ollama.com/) is one way to easily run inference on macOS.

The instructions [here](https://github.com/ollama/ollama?tab=readme-ov-file#ollama) provide details, which we summarize:

- [Download and run](https://ollama.ai/download) the app

- From command line, fetch a model from this [list of options](https://ollama.com/search): e.g., ollama pull gpt-oss:20b

- When the app is running, all models are automatically served on localhost:11434

```python
%pip install -qU langchain_ollama

```**

```python
from langchain_ollama import ChatOllama

llm = ChatOllama(model="gpt-oss:20b", validate_model_on_init=True)

llm.invoke("The first man on the moon was ...").content

```

```output
&#x27;...Neil Armstrong!\n\nOn July 20, 1969, Neil Armstrong became the first person to set foot on the lunar surface, famously declaring "That\&#x27;s one small step for man, one giant leap for mankind" as he stepped off the lunar module Eagle onto the Moon\&#x27;s surface.\n\nWould you like to know more about the Apollo 11 mission or Neil Armstrong\&#x27;s achievements?&#x27;

``` Stream tokens as they are being generated:

```python
for chunk in llm.stream("The first man on the moon was ..."):
    print(chunk, end="|", flush=True)

```

```output
...|
``````output
Neil| Armstrong|,| an| American| astronaut|.| He| stepped| out| of| the| lunar| module| Eagle| and| onto| the| surface| of| the| Moon| on| July| |20|,| |196|9|,| famously| declaring|:| "|That|&#x27;s| one| small| step| for| man|,| one| giant| leap| for| mankind|."||

``` Ollama also includes a chat model wrapper that handles formatting conversation turns:

```python
from langchain_ollama import ChatOllama

chat_model = ChatOllama(model="llama3.1:8b")

chat_model.invoke("Who was the first man on the moon?")

```

```output
AIMessage(content=&#x27;The answer is a historic one!\n\nThe first man to walk on the Moon was Neil Armstrong, an American astronaut and commander of the Apollo 11 mission. On July 20, 1969, Armstrong stepped out of the lunar module Eagle onto the surface of the Moon, famously declaring:\n\n"That\&#x27;s one small step for man, one giant leap for mankind."\n\nArmstrong was followed by fellow astronaut Edwin "Buzz" Aldrin, who also walked on the Moon during the mission. Michael Collins remained in orbit around the Moon in the command module Columbia.\n\nNeil Armstrong passed away on August 25, 2012, but his legacy as a pioneering astronaut and engineer continues to inspire people around the world!&#x27;, response_metadata={&#x27;model&#x27;: &#x27;llama3.1:8b&#x27;, &#x27;created_at&#x27;: &#x27;2024-08-01T00:38:29.176717Z&#x27;, &#x27;message&#x27;: {&#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;content&#x27;: &#x27;&#x27;}, &#x27;done_reason&#x27;: &#x27;stop&#x27;, &#x27;done&#x27;: True, &#x27;total_duration&#x27;: 10681861417, &#x27;load_duration&#x27;: 34270292, &#x27;prompt_eval_count&#x27;: 19, &#x27;prompt_eval_duration&#x27;: 6209448000, &#x27;eval_count&#x27;: 141, &#x27;eval_duration&#x27;: 4432022000}, id=&#x27;run-7bed57c5-7f54-4092-912c-ae49073dcd48-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 19, &#x27;output_tokens&#x27;: 141, &#x27;total_tokens&#x27;: 160})

``` Environment[​](#environment) Inference speed is a challenge when running models locally (see above). To minimize latency, it is desirable to run models locally on GPU, which ships with many consumer laptops [e.g., Apple devices](https://www.apple.com/newsroom/2022/06/apple-unveils-m2-with-breakthrough-performance-and-capabilities/). And even with GPU, the available GPU memory bandwidth (as noted above) is important. Running Apple silicon GPU[​](#running-apple-silicon-gpu) ollama and [llamafile](https://github.com/Mozilla-Ocho/llamafile?tab=readme-ov-file#gpu-support) will automatically utilize the GPU on Apple devices. Other frameworks require the user to set up the environment to utilize the Apple GPU. For example, llama.cpp python bindings can be configured to use the GPU via [Metal](https://developer.apple.com/metal/). Metal is a graphics and compute API created by Apple providing near-direct access to the GPU. See the [llama.cpp](/docs/integrations/llms/llamacpp/) setup [here](https://github.com/abetlen/llama-cpp-python/blob/main/docs/install/macos.md) to enable this. In particular, ensure that conda is using the correct virtual environment that you created (miniforge3). e.g., for me:

```shell
conda activate /Users/rlm/miniforge3/envs/llama

``` With the above confirmed, then:

```shell
CMAKE_ARGS="-DLLAMA_METAL=on" FORCE_CMAKE=1 pip install -U llama-cpp-python --no-cache-dir

``` LLMs[​](#llms) There are various ways to gain access to quantized model weights. [HuggingFace](https://huggingface.co/TheBloke) - Many quantized model are available for download and can be run with framework such as [llama.cpp](https://github.com/ggerganov/llama.cpp). You can also download models in [llamafile format](https://huggingface.co/models?other=llamafile) from HuggingFace. [gpt4all](https://gpt4all.io/index.html) - The model explorer offers a leaderboard of metrics and associated quantized models available for download [ollama](https://github.com/jmorganca/ollama) - Several models can be accessed directly via pull Ollama[ ​](#ollama) With [Ollama](https://github.com/ollama/ollama), fetch a model via ollama pull :.

```python
llm = ChatOllama(model="gpt-oss:20b")
llm.invoke("The first man on the moon was ... think step by step")

```

```output
&#x27; Sure! Here\&#x27;s the answer, broken down step by step:\n\nThe first man on the moon was... Neil Armstrong.\n\nHere\&#x27;s how I arrived at that answer:\n\n1. The first manned mission to land on the moon was Apollo 11.\n2. The mission included three astronauts: Neil Armstrong, Edwin "Buzz" Aldrin, and Michael Collins.\n3. Neil Armstrong was the mission commander and the first person to set foot on the moon.\n4. On July 20, 1969, Armstrong stepped out of the lunar module Eagle and onto the moon\&#x27;s surface, famously declaring "That\&#x27;s one small step for man, one giant leap for mankind."\n\nSo, the first man on the moon was Neil Armstrong!&#x27;

``` Llama.cpp[​](#llamacpp) Llama.cpp is compatible with a [broad set of models](https://github.com/ggerganov/llama.cpp). For example, below we run inference on llama2-13b with 4 bit quantization downloaded from [HuggingFace](https://huggingface.co/TheBloke/Llama-2-13B-GGML/tree/main). As noted above, see the [API reference](https://python.langchain.com/api_reference/langchain/llms/langchain.llms.llamacpp.LlamaCpp.html?highlight=llamacpp#langchain.llms.llamacpp.LlamaCpp) for the full set of parameters. From the [llama.cpp API reference docs](https://python.langchain.com/api_reference/community/llms/langchain_community.llms.llamacpp.LlamaCpp.html), a few are worth commenting on: n_gpu_layers: number of layers to be loaded into GPU memory Value: 1 Meaning: Only one layer of the model will be loaded into GPU memory (1 is often sufficient). n_batch: number of tokens the model should process in parallel Value: n_batch Meaning: It&#x27;s recommended to choose a value between 1 and n_ctx (which in this case is set to 2048) n_ctx: Token context window Value: 2048 Meaning: The model will consider a window of 2048 tokens at a time f16_kv: whether the model should use half-precision for the key/value cache Value: True Meaning: The model will use half-precision, which can be more memory efficient; Metal only supports True.

```python
%env CMAKE_ARGS="-DLLAMA_METAL=on"
%env FORCE_CMAKE=1
%pip install --upgrade --quiet  llama-cpp-python --no-cache-dir

```

```python
from langchain_community.llms import LlamaCpp
from langchain_core.callbacks import CallbackManager, StreamingStdOutCallbackHandler

llm = LlamaCpp(
    model_path="/Users/rlm/Desktop/Code/llama.cpp/models/openorca-platypus2-13b.gguf.q4_0.bin",
    n_gpu_layers=1,
    n_batch=512,
    n_ctx=2048,
    f16_kv=True,
    callback_manager=CallbackManager([StreamingStdOutCallbackHandler()]),
    verbose=True,
)

```API Reference:**[CallbackManager](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.CallbackManager.html) | [StreamingStdOutCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.streaming_stdout.StreamingStdOutCallbackHandler.html)

The console log will show the below to indicate Metal was enabled properly from steps above:

```text
ggml_metal_init: allocating
ggml_metal_init: using MPS

```**

```python
llm.invoke("The first man on the moon was ... Let&#x27;s think step by step")

```

```output
Llama.generate: prefix-match hit
``````output
 and use logical reasoning to figure out who the first man on the moon was.

Here are some clues:

1. The first man on the moon was an American.
2. He was part of the Apollo 11 mission.
3. He stepped out of the lunar module and became the first person to set foot on the moon&#x27;s surface.
4. His last name is Armstrong.

Now, let&#x27;s use our reasoning skills to figure out who the first man on the moon was. Based on clue #1, we know that the first man on the moon was an American. Clue #2 tells us that he was part of the Apollo 11 mission. Clue #3 reveals that he was the first person to set foot on the moon&#x27;s surface. And finally, clue #4 gives us his last name: Armstrong.
Therefore, the first man on the moon was Neil Armstrong!
``````output

llama_print_timings:        load time =  9623.21 ms
llama_print_timings:      sample time =   143.77 ms /   203 runs   (    0.71 ms per token,  1412.01 tokens per second)
llama_print_timings: prompt eval time =   485.94 ms /     7 tokens (   69.42 ms per token,    14.40 tokens per second)
llama_print_timings:        eval time =  6385.16 ms /   202 runs   (   31.61 ms per token,    31.64 tokens per second)
llama_print_timings:       total time =  7279.28 ms

```

```output
" and use logical reasoning to figure out who the first man on the moon was.\n\nHere are some clues:\n\n1. The first man on the moon was an American.\n2. He was part of the Apollo 11 mission.\n3. He stepped out of the lunar module and became the first person to set foot on the moon&#x27;s surface.\n4. His last name is Armstrong.\n\nNow, let&#x27;s use our reasoning skills to figure out who the first man on the moon was. Based on clue #1, we know that the first man on the moon was an American. Clue #2 tells us that he was part of the Apollo 11 mission. Clue #3 reveals that he was the first person to set foot on the moon&#x27;s surface. And finally, clue #4 gives us his last name: Armstrong.\nTherefore, the first man on the moon was Neil Armstrong!"

``` GPT4All[​](#gpt4all) We can use model weights downloaded from [GPT4All](/docs/integrations/llms/gpt4all/) model explorer. Similar to what is shown above, we can run inference and use [the API reference](https://python.langchain.com/api_reference/community/llms/langchain_community.llms.gpt4all.GPT4All.html) to set parameters of interest.

```python
%pip install gpt4all

```

```python
from langchain_community.llms import GPT4All

llm = GPT4All(
    model="/Users/rlm/Desktop/Code/gpt4all/models/nous-hermes-13b.ggmlv3.q4_0.bin"
)

```

```python
llm.invoke("The first man on the moon was ... Let&#x27;s think step by step")

```

```output
".\n1) The United States decides to send a manned mission to the moon.2) They choose their best astronauts and train them for this specific mission.3) They build a spacecraft that can take humans to the moon, called the Lunar Module (LM).4) They also create a larger spacecraft, called the Saturn V rocket, which will launch both the LM and the Command Service Module (CSM), which will carry the astronauts into orbit.5) The mission is planned down to the smallest detail: from the trajectory of the rockets to the exact movements of the astronauts during their moon landing.6) On July 16, 1969, the Saturn V rocket launches from Kennedy Space Center in Florida, carrying the Apollo 11 mission crew into space.7) After one and a half orbits around the Earth, the LM separates from the CSM and begins its descent to the moon&#x27;s surface.8) On July 20, 1969, at 2:56 pm EDT (GMT-4), Neil Armstrong becomes the first man on the moon. He speaks these"

``` llamafile[​](#llamafile) One of the simplest ways to run an LLM locally is using a [llamafile](https://github.com/Mozilla-Ocho/llamafile). All you need to do is: Download a llamafile from [HuggingFace](https://huggingface.co/models?other=llamafile) Make the file executable Run the file llamafiles bundle model weights and a [specially-compiled](https://github.com/Mozilla-Ocho/llamafile?tab=readme-ov-file#technical-details) version of [llama.cpp](https://github.com/ggerganov/llama.cpp) into a single file that can run on most computers without any additional dependencies. They also come with an embedded inference server that provides an [API](https://github.com/Mozilla-Ocho/llamafile/blob/main/llama.cpp/server/README.md#api-endpoints) for interacting with your model. Here&#x27;s a simple bash script that shows all 3 setup steps:

```bash
# Download a llamafile from HuggingFace
wget https://huggingface.co/jartine/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/TinyLlama-1.1B-Chat-v1.0.Q5_K_M.llamafile

# Make the file executable. On Windows, instead just rename the file to end in ".exe".
chmod +x TinyLlama-1.1B-Chat-v1.0.Q5_K_M.llamafile

# Start the model server. Listens at http://localhost:8080 by default.
./TinyLlama-1.1B-Chat-v1.0.Q5_K_M.llamafile --server --nobrowser

``` After you run the above setup steps, you can use LangChain to interact with your model:

```python
from langchain_community.llms.llamafile import Llamafile

llm = Llamafile()

llm.invoke("The first man on the moon was ... Let&#x27;s think step by step.")

```

```output
"\nFirstly, let&#x27;s imagine the scene where Neil Armstrong stepped onto the moon. This happened in 1969. The first man on the moon was Neil Armstrong. We already know that.\n2nd, let&#x27;s take a step back. Neil Armstrong didn&#x27;t have any special powers. He had to land his spacecraft safely on the moon without injuring anyone or causing any damage. If he failed to do this, he would have been killed along with all those people who were on board the spacecraft.\n3rd, let&#x27;s imagine that Neil Armstrong successfully landed his spacecraft on the moon and made it back to Earth safely. The next step was for him to be hailed as a hero by his people back home. It took years before Neil Armstrong became an American hero.\n4th, let&#x27;s take another step back. Let&#x27;s imagine that Neil Armstrong wasn&#x27;t hailed as a hero, and instead, he was just forgotten. This happened in the 1970s. Neil Armstrong wasn&#x27;t recognized for his remarkable achievement on the moon until after he died.\n5th, let&#x27;s take another step back. Let&#x27;s imagine that Neil Armstrong didn&#x27;t die in the 1970s and instead, lived to be a hundred years old. This happened in 2036. In the year 2036, Neil Armstrong would have been a centenarian.\nNow, let&#x27;s think about the present. Neil Armstrong is still alive. He turned 95 years old on July 20th, 2018. If he were to die now, his achievement of becoming the first human being to set foot on the moon would remain an unforgettable moment in history.\nI hope this helps you understand the significance and importance of Neil Armstrong&#x27;s achievement on the moon!"

``` Prompts[​](#prompts) Some LLMs will benefit from specific prompts. For example, LLaMA will use [special tokens](https://twitter.com/RLanceMartin/status/1681879318493003776?s=20). We can use ConditionalPromptSelector to set prompt based on the model type.

```python
# Set our LLM
llm = LlamaCpp(
    model_path="/Users/rlm/Desktop/Code/llama.cpp/models/openorca-platypus2-13b.gguf.q4_0.bin",
    n_gpu_layers=1,
    n_batch=512,
    n_ctx=2048,
    f16_kv=True,
    callback_manager=CallbackManager([StreamingStdOutCallbackHandler()]),
    verbose=True,
)

``` Set the associated prompt based upon the model version.

```python
from langchain.chains.prompt_selector import ConditionalPromptSelector
from langchain_core.prompts import PromptTemplate

DEFAULT_LLAMA_SEARCH_PROMPT = PromptTemplate(
    input_variables=["question"],
    template="""<<SYS>> \n You are an assistant tasked with improving Google search \
results. \n <</SYS>> \n\n [INST] Generate THREE Google search queries that \
are similar to this question. The output should be a numbered list of questions \
and each should have a question mark at the end: \n\n {question} [/INST]""",
)

DEFAULT_SEARCH_PROMPT = PromptTemplate(
    input_variables=["question"],
    template="""You are an assistant tasked with improving Google search \
results. Generate THREE Google search queries that are similar to \
this question. The output should be a numbered list of questions and each \
should have a question mark at the end: {question}""",
)

QUESTION_PROMPT_SELECTOR = ConditionalPromptSelector(
    default_prompt=DEFAULT_SEARCH_PROMPT,
    conditionals=[(lambda llm: isinstance(llm, LlamaCpp), DEFAULT_LLAMA_SEARCH_PROMPT)],
)

prompt = QUESTION_PROMPT_SELECTOR.get_prompt(llm)
prompt

```API Reference:**[PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```output
PromptTemplate(input_variables=[&#x27;question&#x27;], output_parser=None, partial_variables={}, template=&#x27;<<SYS>> \n You are an assistant tasked with improving Google search results. \n <</SYS>> \n\n [INST] Generate THREE Google search queries that are similar to this question. The output should be a numbered list of questions and each should have a question mark at the end: \n\n {question} [/INST]&#x27;, template_format=&#x27;f-string&#x27;, validate_template=True)

```**

```python
# Chain
chain = prompt | llm
question = "What NFL team won the Super Bowl in the year that Justin Bieber was born?"
chain.invoke({"question": question})

```

```output
Sure! Here are three similar search queries with a question mark at the end:

1. Which NBA team did LeBron James lead to a championship in the year he was drafted?
2. Who won the Grammy Awards for Best New Artist and Best Female Pop Vocal Performance in the same year that Lady Gaga was born?
3. What MLB team did Babe Ruth play for when he hit 60 home runs in a single season?
``````output

llama_print_timings:        load time = 14943.19 ms
llama_print_timings:      sample time =    72.93 ms /   101 runs   (    0.72 ms per token,  1384.87 tokens per second)
llama_print_timings: prompt eval time = 14942.95 ms /    93 tokens (  160.68 ms per token,     6.22 tokens per second)
llama_print_timings:        eval time =  3430.85 ms /   100 runs   (   34.31 ms per token,    29.15 tokens per second)
llama_print_timings:       total time = 18578.26 ms

```

```output
&#x27;  Sure! Here are three similar search queries with a question mark at the end:\n\n1. Which NBA team did LeBron James lead to a championship in the year he was drafted?\n2. Who won the Grammy Awards for Best New Artist and Best Female Pop Vocal Performance in the same year that Lady Gaga was born?\n3. What MLB team did Babe Ruth play for when he hit 60 home runs in a single season?&#x27;

``` We also can use the LangChain Prompt Hub to fetch and / or store prompts that are model specific. This will work with your [LangSmith API key](https://docs.smith.langchain.com/). For example, [here](https://smith.langchain.com/hub/rlm/rag-prompt-llama) is a prompt for RAG with LLaMA-specific tokens. Use cases[​](#use-cases) Given an llm created from one of the models above, you can use it for [many use cases](/docs/how_to/#use-cases). For example, you can implement a [RAG application](/docs/tutorials/rag/) using the chat models demonstrated here. In general, use cases for local LLMs can be driven by at least two factors: Privacy**: private data (e.g., journals, etc) that a user does not want to share

- **Cost**: text preprocessing (extraction/tagging), summarization, and agent simulations are token-use-intensive tasks

In addition, [here](https://blog.langchain.dev/using-langsmith-to-support-fine-tuning-of-open-source-llms/) is an overview on fine-tuning, which can utilize open-source LLMs.

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/local_llms.ipynb)

- [Use case](#use-case)
- [Overview](#overview)[Open-source LLMs](#open-source-llms)
- [Inference](#inference)
- [Formatting prompts](#formatting-prompts)

- [Quickstart](#quickstart)
- [Environment](#environment)[Running Apple silicon GPU](#running-apple-silicon-gpu)

- [LLMs](#llms)[Ollama](#ollama)
- [Llama.cpp](#llamacpp)
- [GPT4All](#gpt4all)
- [llamafile](#llamafile)

- [Prompts](#prompts)
- [Use cases](#use-cases)

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