How to pass multimodal data to models | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/multimodal_inputs.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/multimodal_inputs.ipynb)How to pass multimodal data to models Here we demonstrate how to pass [multimodal](/docs/concepts/multimodality/) input directly to models. LangChain supports multimodal data as input to chat models: Following provider-specific formats Adhering to a cross-provider standard Below, we demonstrate the cross-provider standard. See [chat model integrations](/docs/integrations/chat/) for detail on native formats for specific providers. noteMost chat models that support multimodal image** inputs also accept those values in OpenAI&#x27;s [Chat Completions format](https://platform.openai.com/docs/guides/images?api-mode=chat):

```python
{
    "type": "image_url",
    "image_url": {"url": image_url},
}

```**Images[​](#images) Many providers will accept images passed in-line as base64 data. Some will additionally accept an image from a URL directly. Images from base64 data[​](#images-from-base64-data) To pass images in-line, format them as content blocks of the following form:

```python
{
    "type": "image",
    "source_type": "base64",
    "mime_type": "image/jpeg",  # or image/png, etc.
    "data": "<base64 data string>",
}

``` Example:

```python
import base64

import httpx
from langchain.chat_models import init_chat_model

# Fetch image data
image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
image_data = base64.b64encode(httpx.get(image_url).content).decode("utf-8")

# Pass to LLM
llm = init_chat_model("anthropic:claude-3-5-sonnet-latest")

message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Describe the weather in this image:",
        },
        {
            "type": "image",
            "source_type": "base64",
            "data": image_data,
            "mime_type": "image/jpeg",
        },
    ],
}
response = llm.invoke([message])
print(response.text())

```

```output
The image shows a beautiful clear day with bright blue skies and wispy cirrus clouds stretching across the horizon. The clouds are thin and streaky, creating elegant patterns against the blue backdrop. The lighting suggests it&#x27;s during the day, possibly late afternoon given the warm, golden quality of the light on the grass. The weather appears calm with no signs of wind (the grass looks relatively still) and no indication of rain. It&#x27;s the kind of perfect, mild weather that&#x27;s ideal for walking along the wooden boardwalk through the marsh grass.

``` See [LangSmith trace](https://smith.langchain.com/public/eab05a31-54e8-4fc9-911f-56805da67bef/r) for more detail. Images from a URL[​](#images-from-a-url) Some providers (including [OpenAI](/docs/integrations/chat/openai/), [Anthropic](/docs/integrations/chat/anthropic/), and [Google Gemini](/docs/integrations/chat/google_generative_ai/)) will also accept images from URLs directly. To pass images as URLs, format them as content blocks of the following form:

```python
{
    "type": "image",
    "source_type": "url",
    "url": "https://...",
}

``` Example:

```python
message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Describe the weather in this image:",
        },
        {
            "type": "image",
            "source_type": "url",
            "url": image_url,
        },
    ],
}
response = llm.invoke([message])
print(response.text())

```

```output
The weather in this image appears to be pleasant and clear. The sky is mostly blue with a few scattered, light clouds, and there is bright sunlight illuminating the green grass and plants. There are no signs of rain or stormy conditions, suggesting it is a calm, likely warm day—typical of spring or summer.

``` We can also pass in multiple images:

```python
message = {
    "role": "user",
    "content": [
        {"type": "text", "text": "Are these two images the same?"},
        {"type": "image", "source_type": "url", "url": image_url},
        {"type": "image", "source_type": "url", "url": image_url},
    ],
}
response = llm.invoke([message])
print(response.text())

```

```output
Yes, these two images are the same. They depict a wooden boardwalk going through a grassy field under a blue sky with some clouds. The colors, composition, and elements in both images are identical.

``` Documents (PDF)[​](#documents-pdf) Some providers (including [OpenAI](/docs/integrations/chat/openai/), [Anthropic](/docs/integrations/chat/anthropic/), and [Google Gemini](/docs/integrations/chat/google_generative_ai/)) will accept PDF documents. noteOpenAI requires file-names be specified for PDF inputs. When using LangChain&#x27;s format, include the filename key. See [example below](#example-openai-file-names). Documents from base64 data[​](#documents-from-base64-data) To pass documents in-line, format them as content blocks of the following form:

```python
{
    "type": "file",
    "source_type": "base64",
    "mime_type": "application/pdf",
    "data": "<base64 data string>",
}

``` Example:

```python
import base64

import httpx
from langchain.chat_models import init_chat_model

# Fetch PDF data
pdf_url = "https://pdfobject.com/pdf/sample.pdf"
pdf_data = base64.b64encode(httpx.get(pdf_url).content).decode("utf-8")

# Pass to LLM
llm = init_chat_model("anthropic:claude-3-5-sonnet-latest")

message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Describe the document:",
        },
        {
            "type": "file",
            "source_type": "base64",
            "data": pdf_data,
            "mime_type": "application/pdf",
        },
    ],
}
response = llm.invoke([message])
print(response.text())

```

```output
This document appears to be a sample PDF file that contains Lorem ipsum placeholder text. It begins with a title "Sample PDF" followed by the subtitle "This is a simple PDF file. Fun fun fun."

The rest of the document consists of several paragraphs of Lorem ipsum text, which is a commonly used placeholder text in design and publishing. The text is formatted in a clean, readable layout with consistent paragraph spacing. The document appears to be a single page containing four main paragraphs of this placeholder text.

The Lorem ipsum text, while appearing to be Latin, is actually scrambled Latin-like text that is used primarily to demonstrate the visual form of a document or typeface without the distraction of meaningful content. It&#x27;s commonly used in publishing and graphic design when the actual content is not yet available but the layout needs to be demonstrated.

The document has a professional, simple layout with generous margins and clear paragraph separation, making it an effective example of basic PDF formatting and structure.

``` Documents from a URL[​](#documents-from-a-url) Some providers (specifically [Anthropic](/docs/integrations/chat/anthropic/)) will also accept documents from URLs directly. To pass documents as URLs, format them as content blocks of the following form:

```python
{
    "type": "file",
    "source_type": "url",
    "url": "https://...",
}

``` Example:

```python
message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Describe the document:",
        },
        {
            "type": "file",
            "source_type": "url",
            "url": pdf_url,
        },
    ],
}
response = llm.invoke([message])
print(response.text())

```

```output
This document appears to be a sample PDF file with both text and an image. It begins with a title "Sample PDF" followed by the text "This is a simple PDF file. Fun fun fun." The rest of the document contains Lorem ipsum placeholder text arranged in several paragraphs. The content is shown both as text and as an image of the formatted PDF, with the same content displayed in a clean, formatted layout with consistent spacing and typography. The document consists of a single page containing this sample text.

``` Audio[​](#audio) Some providers (including [OpenAI](/docs/integrations/chat/openai/) and [Google Gemini](/docs/integrations/chat/google_generative_ai/)) will accept audio inputs. Audio from base64 data[​](#audio-from-base64-data) To pass audio in-line, format them as content blocks of the following form:

```python
{
    "type": "audio",
    "source_type": "base64",
    "mime_type": "audio/wav",  # or appropriate mime-type
    "data": "<base64 data string>",
}

``` Example:

```python
import base64

import httpx
from langchain.chat_models import init_chat_model

# Fetch audio data
audio_url = "https://upload.wikimedia.org/wikipedia/commons/3/3d/Alcal%C3%A1_de_Henares_%28RPS_13-04-2024%29_canto_de_ruise%C3%B1or_%28Luscinia_megarhynchos%29_en_el_Soto_del_Henares.wav"
audio_data = base64.b64encode(httpx.get(audio_url).content).decode("utf-8")

# Pass to LLM
llm = init_chat_model("google_genai:gemini-2.5-flash")

message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Describe this audio:",
        },
        {
            "type": "audio",
            "source_type": "base64",
            "data": audio_data,
            "mime_type": "audio/wav",
        },
    ],
}
response = llm.invoke([message])
print(response.text())

```

```output
The audio appears to consist primarily of bird sounds, specifically bird vocalizations like chirping and possibly other bird songs.

``` Provider-specific parameters[​](#provider-specific-parameters) Some providers will support or require additional fields on content blocks containing multimodal data. For example, Anthropic lets you specify [caching](/docs/integrations/chat/anthropic/#prompt-caching) of specific content to reduce token consumption. To use these fields, you can: Store them on directly on the content block; or Use the native format supported by each provider (see [chat model integrations](/docs/integrations/chat/) for detail). We show three examples below. Example: Anthropic prompt caching[​](#example-anthropic-prompt-caching)

```python
llm = init_chat_model("anthropic:claude-3-5-sonnet-latest")

message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Describe the weather in this image:",
        },
        {
            "type": "image",
            "source_type": "url",
            "url": image_url,
            "cache_control": {"type": "ephemeral"},
        },
    ],
}
response = llm.invoke([message])
print(response.text())
response.usage_metadata

```

```output
The image shows a beautiful, clear day with partly cloudy skies. The sky is a vibrant blue with wispy, white cirrus clouds stretching across it. The lighting suggests it&#x27;s during daylight hours, possibly late afternoon or early evening given the warm, golden quality of the light on the grass. The weather appears calm with no signs of wind (the grass looks relatively still) and no threatening weather conditions. It&#x27;s the kind of perfect weather you&#x27;d want for a walk along this wooden boardwalk through the marshland or grassland area.

```

```output
{&#x27;input_tokens&#x27;: 1586,
 &#x27;output_tokens&#x27;: 117,
 &#x27;total_tokens&#x27;: 1703,
 &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 0, &#x27;cache_creation&#x27;: 1582}}

```

```python
next_message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Summarize that in 5 words.",
        }
    ],
}
response = llm.invoke([message, response, next_message])
print(response.text())
response.usage_metadata

```

```output
Clear blue skies, wispy clouds.

```

```output
{&#x27;input_tokens&#x27;: 1716,
 &#x27;output_tokens&#x27;: 12,
 &#x27;total_tokens&#x27;: 1728,
 &#x27;input_token_details&#x27;: {&#x27;cache_read&#x27;: 1582, &#x27;cache_creation&#x27;: 0}}

``` Example: Anthropic citations[​](#example-anthropic-citations)

```python
message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Generate a 5 word summary of this document.",
        },
        {
            "type": "file",
            "source_type": "base64",
            "data": pdf_data,
            "mime_type": "application/pdf",
            "citations": {"enabled": True},
        },
    ],
}
response = llm.invoke([message])
response.content

```

```output
[{&#x27;citations&#x27;: [{&#x27;cited_text&#x27;: &#x27;Sample PDF\r\nThis is a simple PDF file. Fun fun fun.\r\n&#x27;,
    &#x27;document_index&#x27;: 0,
    &#x27;document_title&#x27;: None,
    &#x27;end_page_number&#x27;: 2,
    &#x27;start_page_number&#x27;: 1,
    &#x27;type&#x27;: &#x27;page_location&#x27;}],
  &#x27;text&#x27;: &#x27;Simple PDF file: fun fun&#x27;,
  &#x27;type&#x27;: &#x27;text&#x27;}]

``` Example: OpenAI file names[​](#example-openai-file-names) OpenAI requires that PDF documents be associated with file names:

```python
llm = init_chat_model("openai:gpt-4.1")

message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Describe the document:",
        },
        {
            "type": "file",
            "source_type": "base64",
            "data": pdf_data,
            "mime_type": "application/pdf",
            "filename": "my-file",
        },
    ],
}
response = llm.invoke([message])
print(response.text())

```

```output
The document is a sample PDF file containing placeholder text. It consists of one page, titled "Sample PDF". The content is a mixture of English and the commonly used filler text "Lorem ipsum dolor sit amet..." and its extensions, which are often used in publishing and web design as generic text to demonstrate font, layout, and other visual elements.

**Key points about the document:**
- Length: 1 page
- Purpose: Demonstrative/sample content
- Content: No substantive or meaningful information, just demonstration text in paragraph form
- Language: English (with the Latin-like "Lorem Ipsum" text used for layout purposes)

There are no charts, tables, diagrams, or images on the page—only plain text. The document serves as an example of what a PDF file looks like rather than providing actual, useful content.

``` Tool calls[​](#tool-calls) Some multimodal models support [tool calling](/docs/concepts/tool_calling/) features as well. To call tools using such models, simply bind tools to them in the [usual way](/docs/how_to/tool_calling/), and invoke the model using content blocks of the desired type (e.g., containing image data).

```python
from typing import Literal

from langchain_core.tools import tool

@tool
def weather_tool(weather: Literal["sunny", "cloudy", "rainy"]) -> None:
    """Describe the weather"""
    pass

llm_with_tools = llm.bind_tools([weather_tool])

message = {
    "role": "user",
    "content": [
        {"type": "text", "text": "Describe the weather in this image:"},
        {"type": "image", "source_type": "url", "url": image_url},
    ],
}
response = llm_with_tools.invoke([message])
response.tool_calls

```API Reference:**[tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
[{&#x27;name&#x27;: &#x27;weather_tool&#x27;,
  &#x27;args&#x27;: {&#x27;weather&#x27;: &#x27;sunny&#x27;},
  &#x27;id&#x27;: &#x27;toolu_01G6JgdkhwggKcQKfhXZQPjf&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;}]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/multimodal_inputs.ipynb)[Images](#images)[Images from base64 data](#images-from-base64-data)
- [Images from a URL](#images-from-a-url)

- [Documents (PDF)](#documents-pdf)[Documents from base64 data](#documents-from-base64-data)
- [Documents from a URL](#documents-from-a-url)

- [Audio](#audio)[Audio from base64 data](#audio-from-base64-data)

- [Provider-specific parameters](#provider-specific-parameters)[Example: Anthropic prompt caching](#example-anthropic-prompt-caching)
- [Example: Anthropic citations](#example-anthropic-citations)
- [Example: OpenAI file names](#example-openai-file-names)

- [Tool calls](#tool-calls)

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