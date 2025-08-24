How to use multimodal prompts | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/multimodal_prompts.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/multimodal_prompts.ipynb)How to use multimodal prompts Here we demonstrate how to use prompt templates to format [multimodal](/docs/concepts/multimodality/) inputs to models. To use prompt templates in the context of multimodal data, we can templatize elements of the corresponding content block. For example, below we define a prompt that takes a URL for an image as a parameter:

```python
from langchain_core.prompts import ChatPromptTemplate

# Define prompt
prompt = ChatPromptTemplate(
    [
        {
            "role": "system",
            "content": "Describe the image provided.",
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source_type": "url",
                    "url": "{image_url}",
                },
            ],
        },
    ]
)

```API Reference:**[ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) Let&#x27;s use this prompt to pass an image to a [chat model](/docs/concepts/chat_models/#multimodality):

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model("anthropic:claude-3-5-sonnet-latest")

url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"

chain = prompt | llm
response = chain.invoke({"image_url": url})
print(response.text())

```

```output
This image shows a beautiful wooden boardwalk cutting through a lush green wetland or marsh area. The boardwalk extends straight ahead toward the horizon, creating a strong leading line through the composition. On either side, tall green grasses sway in what appears to be a summer or late spring setting. The sky is particularly striking, with wispy cirrus clouds streaking across a vibrant blue background. In the distance, you can see a tree line bordering the wetland area. The lighting suggests this may be during "golden hour" - either early morning or late afternoon - as there&#x27;s a warm, gentle quality to the light that&#x27;s illuminating the scene. The wooden planks of the boardwalk appear well-maintained and provide safe passage through what would otherwise be difficult terrain to traverse. It&#x27;s the kind of scene you might find in a nature preserve or wildlife refuge designed to give visitors access to observe wetland ecosystems while protecting the natural environment.

``` Note that we can templatize arbitrary elements of the content block:

```python
prompt = ChatPromptTemplate(
    [
        {
            "role": "system",
            "content": "Describe the image provided.",
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source_type": "base64",
                    "mime_type": "{image_mime_type}",
                    "data": "{image_data}",
                    "cache_control": {"type": "{cache_type}"},
                },
            ],
        },
    ]
)

```

```python
import base64

import httpx

image_data = base64.b64encode(httpx.get(url).content).decode("utf-8")

chain = prompt | llm
response = chain.invoke(
    {
        "image_data": image_data,
        "image_mime_type": "image/jpeg",
        "cache_type": "ephemeral",
    }
)
print(response.text())

```

```output
This image shows a beautiful wooden boardwalk cutting through a lush green marsh or wetland area. The boardwalk extends straight ahead toward the horizon, creating a strong leading line in the composition. The surrounding vegetation consists of tall grass and reeds in vibrant green hues, with some bushes and trees visible in the background. The sky is particularly striking, featuring a bright blue color with wispy white clouds streaked across it. The lighting suggests this photo was taken during the "golden hour" - either early morning or late afternoon - giving the scene a warm, peaceful quality. The raised wooden path provides accessible access through what would otherwise be difficult terrain to traverse, allowing visitors to experience and appreciate this natural environment.

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/multimodal_prompts.ipynb)Community[LangChain Forum](https://forum.langchain.com/)
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