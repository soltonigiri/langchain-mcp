How to load JSON | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_json.mdx) # How to load JSON [JSON (JavaScript Object Notation)](https://en.wikipedia.org/wiki/JSON) is an open standard file format and data interchange format that uses human-readable text to store and transmit data objects consisting of attribute–value pairs and arrays (or other serializable values). [JSON Lines](https://jsonlines.org/) is a file format where each line is a valid JSON value. LangChain implements a [JSONLoader](https://python.langchain.com/api_reference/community/document_loaders/langchain_community.document_loaders.json_loader.JSONLoader.html) to convert JSON and JSONL data into LangChain [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html#langchain_core.documents.base.Document) objects. It uses a specified [jq schema](https://en.wikipedia.org/wiki/Jq_(programming_language)) to parse the JSON files, allowing for the extraction of specific fields into the content and metadata of the LangChain Document. It uses the jq python package. Check out this [manual](https://stedolan.github.io/jq/manual/#Basicfilters) for a detailed documentation of the jq syntax. Here we will demonstrate: How to load JSON and JSONL data into the content of a LangChain Document;

- How to load JSON and JSONL data into metadata associated with a Document.

```python
#!pip install jq

```

```python
from langchain_community.document_loaders import JSONLoader

```

```python
import json
from pathlib import Path
from pprint import pprint

file_path=&#x27;./example_data/facebook_chat.json&#x27;
data = json.loads(Path(file_path).read_text())

```

```python
pprint(data)

```

```output
{&#x27;image&#x27;: {&#x27;creation_timestamp&#x27;: 1675549016, &#x27;uri&#x27;: &#x27;image_of_the_chat.jpg&#x27;},
     &#x27;is_still_participant&#x27;: True,
     &#x27;joinable_mode&#x27;: {&#x27;link&#x27;: &#x27;&#x27;, &#x27;mode&#x27;: 1},
     &#x27;magic_words&#x27;: [],
     &#x27;messages&#x27;: [{&#x27;content&#x27;: &#x27;Bye!&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 2&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675597571851},
                  {&#x27;content&#x27;: &#x27;Oh no worries! Bye&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 1&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675597435669},
                  {&#x27;content&#x27;: &#x27;No Im sorry it was my mistake, the blue one is not &#x27;
                              &#x27;for sale&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 2&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675596277579},
                  {&#x27;content&#x27;: &#x27;I thought you were selling the blue one!&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 1&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675595140251},
                  {&#x27;content&#x27;: &#x27;Im not interested in this bag. Im interested in the &#x27;
                              &#x27;blue one!&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 1&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675595109305},
                  {&#x27;content&#x27;: &#x27;Here is $129&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 2&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675595068468},
                  {&#x27;photos&#x27;: [{&#x27;creation_timestamp&#x27;: 1675595059,
                               &#x27;uri&#x27;: &#x27;url_of_some_picture.jpg&#x27;}],
                   &#x27;sender_name&#x27;: &#x27;User 2&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675595060730},
                  {&#x27;content&#x27;: &#x27;Online is at least $100&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 2&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675595045152},
                  {&#x27;content&#x27;: &#x27;How much do you want?&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 1&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675594799696},
                  {&#x27;content&#x27;: &#x27;Goodmorning! $50 is too low.&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 2&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675577876645},
                  {&#x27;content&#x27;: &#x27;Hi! Im interested in your bag. Im offering $50. Let &#x27;
                              &#x27;me know if you are interested. Thanks!&#x27;,
                   &#x27;sender_name&#x27;: &#x27;User 1&#x27;,
                   &#x27;timestamp_ms&#x27;: 1675549022673}],
     &#x27;participants&#x27;: [{&#x27;name&#x27;: &#x27;User 1&#x27;}, {&#x27;name&#x27;: &#x27;User 2&#x27;}],
     &#x27;thread_path&#x27;: &#x27;inbox/User 1 and User 2 chat&#x27;,
     &#x27;title&#x27;: &#x27;User 1 and User 2 chat&#x27;}

``` ## Using JSONLoader[​](#using-jsonloader) Suppose we are interested in extracting the values under the `content` field within the `messages` key of the JSON data. This can easily be done through the `JSONLoader` as shown below.

### JSON file[​](#json-file)

```python
loader = JSONLoader(
    file_path=&#x27;./example_data/facebook_chat.json&#x27;,
    jq_schema=&#x27;.messages[].content&#x27;,
    text_content=False)

data = loader.load()

```

```python
pprint(data)

```

```output
[Document(page_content=&#x27;Bye!&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 1}),
     Document(page_content=&#x27;Oh no worries! Bye&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 2}),
     Document(page_content=&#x27;No Im sorry it was my mistake, the blue one is not for sale&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 3}),
     Document(page_content=&#x27;I thought you were selling the blue one!&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 4}),
     Document(page_content=&#x27;Im not interested in this bag. Im interested in the blue one!&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 5}),
     Document(page_content=&#x27;Here is $129&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 6}),
     Document(page_content=&#x27;&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 7}),
     Document(page_content=&#x27;Online is at least $100&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 8}),
     Document(page_content=&#x27;How much do you want?&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 9}),
     Document(page_content=&#x27;Goodmorning! $50 is too low.&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 10}),
     Document(page_content=&#x27;Hi! Im interested in your bag. Im offering $50. Let me know if you are interested. Thanks!&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 11})]

``` ### JSON Lines file[​](#json-lines-file) If you want to load documents from a JSON Lines file, you pass `json_lines=True` and specify `jq_schema` to extract `page_content` from a single JSON object.

```python
file_path = &#x27;./example_data/facebook_chat_messages.jsonl&#x27;
pprint(Path(file_path).read_text())

```

```output
(&#x27;{"sender_name": "User 2", "timestamp_ms": 1675597571851, "content": "Bye!"}\n&#x27;
     &#x27;{"sender_name": "User 1", "timestamp_ms": 1675597435669, "content": "Oh no &#x27;
     &#x27;worries! Bye"}\n&#x27;
     &#x27;{"sender_name": "User 2", "timestamp_ms": 1675596277579, "content": "No Im &#x27;
     &#x27;sorry it was my mistake, the blue one is not for sale"}\n&#x27;)

```

```python
loader = JSONLoader(
    file_path=&#x27;./example_data/facebook_chat_messages.jsonl&#x27;,
    jq_schema=&#x27;.content&#x27;,
    text_content=False,
    json_lines=True)

data = loader.load()

```

```python
pprint(data)

```

```output
[Document(page_content=&#x27;Bye!&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat_messages.jsonl&#x27;, &#x27;seq_num&#x27;: 1}),
     Document(page_content=&#x27;Oh no worries! Bye&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat_messages.jsonl&#x27;, &#x27;seq_num&#x27;: 2}),
     Document(page_content=&#x27;No Im sorry it was my mistake, the blue one is not for sale&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat_messages.jsonl&#x27;, &#x27;seq_num&#x27;: 3})]

``` Another option is to set `jq_schema=&#x27;.&#x27;` and provide `content_key`:

```python
loader = JSONLoader(
    file_path=&#x27;./example_data/facebook_chat_messages.jsonl&#x27;,
    jq_schema=&#x27;.&#x27;,
    content_key=&#x27;sender_name&#x27;,
    json_lines=True)

data = loader.load()

```

```python
pprint(data)

```

```output
[Document(page_content=&#x27;User 2&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat_messages.jsonl&#x27;, &#x27;seq_num&#x27;: 1}),
     Document(page_content=&#x27;User 1&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat_messages.jsonl&#x27;, &#x27;seq_num&#x27;: 2}),
     Document(page_content=&#x27;User 2&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat_messages.jsonl&#x27;, &#x27;seq_num&#x27;: 3})]

``` ### JSON file with jq schema content_key[​](#json-file-with-jq-schema-content_key) To load documents from a JSON file using the content_key within the jq schema, set is_content_key_jq_parsable=True. Ensure that content_key is compatible and can be parsed using the jq schema.

```python
file_path = &#x27;./sample.json&#x27;
pprint(Path(file_path).read_text())

```

```outputjson
{"data": [
        {"attributes": {
            "message": "message1",
            "tags": [
            "tag1"]},
        "id": "1"},
        {"attributes": {
            "message": "message2",
            "tags": [
            "tag2"]},
        "id": "2"}]}

```

```python
loader = JSONLoader(
    file_path=file_path,
    jq_schema=".data[]",
    content_key=".attributes.message",
    is_content_key_jq_parsable=True,
)

data = loader.load()

```

```python
pprint(data)

```

```output
[Document(page_content=&#x27;message1&#x27;, metadata={&#x27;source&#x27;: &#x27;/path/to/sample.json&#x27;, &#x27;seq_num&#x27;: 1}),
     Document(page_content=&#x27;message2&#x27;, metadata={&#x27;source&#x27;: &#x27;/path/to/sample.json&#x27;, &#x27;seq_num&#x27;: 2})]

``` ## Extracting metadata[​](#extracting-metadata) Generally, we want to include metadata available in the JSON file into the documents that we create from the content.

The following demonstrates how metadata can be extracted using the `JSONLoader`.

There are some key changes to be noted. In the previous example where we didn&#x27;t collect the metadata, we managed to directly specify in the schema where the value for the `page_content` can be extracted from.

```text
.messages[].content

```

In the current example, we have to tell the loader to iterate over the records in the `messages` field. The jq_schema then has to be:

```text
.messages[]

```

This allows us to pass the records (dict) into the `metadata_func` that has to be implemented. The `metadata_func` is responsible for identifying which pieces of information in the record should be included in the metadata stored in the final `Document` object.

Additionally, we now have to explicitly specify in the loader, via the `content_key` argument, the key from the record where the value for the `page_content` needs to be extracted from.

```python
# Define the metadata extraction function.
def metadata_func(record: dict, metadata: dict) -> dict:

    metadata["sender_name"] = record.get("sender_name")
    metadata["timestamp_ms"] = record.get("timestamp_ms")

    return metadata

loader = JSONLoader(
    file_path=&#x27;./example_data/facebook_chat.json&#x27;,
    jq_schema=&#x27;.messages[]&#x27;,
    content_key="content",
    metadata_func=metadata_func
)

data = loader.load()

```

```python
pprint(data)

```

```output
[Document(page_content=&#x27;Bye!&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 1, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675597571851}),
     Document(page_content=&#x27;Oh no worries! Bye&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 2, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675597435669}),
     Document(page_content=&#x27;No Im sorry it was my mistake, the blue one is not for sale&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 3, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675596277579}),
     Document(page_content=&#x27;I thought you were selling the blue one!&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 4, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675595140251}),
     Document(page_content=&#x27;Im not interested in this bag. Im interested in the blue one!&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 5, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675595109305}),
     Document(page_content=&#x27;Here is $129&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 6, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675595068468}),
     Document(page_content=&#x27;&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 7, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675595060730}),
     Document(page_content=&#x27;Online is at least $100&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 8, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675595045152}),
     Document(page_content=&#x27;How much do you want?&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 9, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675594799696}),
     Document(page_content=&#x27;Goodmorning! $50 is too low.&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 10, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675577876645}),
     Document(page_content=&#x27;Hi! Im interested in your bag. Im offering $50. Let me know if you are interested. Thanks!&#x27;, metadata={&#x27;source&#x27;: &#x27;/Users/avsolatorio/WBG/langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 11, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675549022673})]

``` Now, you will see that the documents contain the metadata associated with the content we extracted.

## The metadata_func[​](#the-metadata_func)

As shown above, the `metadata_func` accepts the default metadata generated by the `JSONLoader`. This allows full control to the user with respect to how the metadata is formatted.

For example, the default metadata contains the `source` and the `seq_num` keys. However, it is possible that the JSON data contain these keys as well. The user can then exploit the `metadata_func` to rename the default keys and use the ones from the JSON data.

The example below shows how we can modify the `source` to only contain information of the file source relative to the `langchain` directory.

```python
# Define the metadata extraction function.
def metadata_func(record: dict, metadata: dict) -> dict:

    metadata["sender_name"] = record.get("sender_name")
    metadata["timestamp_ms"] = record.get("timestamp_ms")

    if "source" in metadata:
        source = metadata["source"].split("/")
        source = source[source.index("langchain"):]
        metadata["source"] = "/".join(source)

    return metadata

loader = JSONLoader(
    file_path=&#x27;./example_data/facebook_chat.json&#x27;,
    jq_schema=&#x27;.messages[]&#x27;,
    content_key="content",
    metadata_func=metadata_func
)

data = loader.load()

```

```python
pprint(data)

```

```output
[Document(page_content=&#x27;Bye!&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 1, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675597571851}),
     Document(page_content=&#x27;Oh no worries! Bye&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 2, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675597435669}),
     Document(page_content=&#x27;No Im sorry it was my mistake, the blue one is not for sale&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 3, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675596277579}),
     Document(page_content=&#x27;I thought you were selling the blue one!&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 4, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675595140251}),
     Document(page_content=&#x27;Im not interested in this bag. Im interested in the blue one!&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 5, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675595109305}),
     Document(page_content=&#x27;Here is $129&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 6, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675595068468}),
     Document(page_content=&#x27;&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 7, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675595060730}),
     Document(page_content=&#x27;Online is at least $100&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 8, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675595045152}),
     Document(page_content=&#x27;How much do you want?&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 9, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675594799696}),
     Document(page_content=&#x27;Goodmorning! $50 is too low.&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 10, &#x27;sender_name&#x27;: &#x27;User 2&#x27;, &#x27;timestamp_ms&#x27;: 1675577876645}),
     Document(page_content=&#x27;Hi! Im interested in your bag. Im offering $50. Let me know if you are interested. Thanks!&#x27;, metadata={&#x27;source&#x27;: &#x27;langchain/docs/modules/indexes/document_loaders/examples/example_data/facebook_chat.json&#x27;, &#x27;seq_num&#x27;: 11, &#x27;sender_name&#x27;: &#x27;User 1&#x27;, &#x27;timestamp_ms&#x27;: 1675549022673})]

``` ## Common JSON structures with jq schema[​](#common-json-structures-with-jq-schema) The list below provides a reference to the possible `jq_schema` the user can use to extract content from the JSON data depending on the structure.

```text
JSON        -> [{"text": ...}, {"text": ...}, {"text": ...}]
jq_schema   -> ".[].text"

JSON        -> {"key": [{"text": ...}, {"text": ...}, {"text": ...}]}
jq_schema   -> ".key[].text"

JSON        -> ["...", "...", "..."]
jq_schema   -> ".[]"

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/document_loader_json.mdx)

- [Using JSONLoader](#using-jsonloader)[JSON file](#json-file)
- [JSON Lines file](#json-lines-file)
- [JSON file with jq schema content_key](#json-file-with-jq-schema-content_key)

- [Extracting metadata](#extracting-metadata)
- [The metadata_func](#the-metadata_func)
- [Common JSON structures with jq schema](#common-json-structures-with-jq-schema)

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