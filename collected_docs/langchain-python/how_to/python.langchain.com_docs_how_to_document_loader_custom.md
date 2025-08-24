Custom Document Loader | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_custom.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_custom.ipynb)How to create a custom Document Loader Overview[​](#overview) Applications based on LLMs frequently entail extracting data from databases or files, like PDFs, and converting it into a format that LLMs can utilize. In LangChain, this usually involves creating Document objects, which encapsulate the extracted text (page_content) along with metadata—a dictionary containing details about the document, such as the author&#x27;s name or the date of publication. Document objects are often formatted into prompts that are fed into an LLM, allowing the LLM to use the information in the Document to generate a desired response (e.g., summarizing the document). Documents can be either used immediately or indexed into a vectorstore for future retrieval and use. The main abstractions for [Document Loading](/docs/concepts/document_loaders/) are: ComponentDescriptionDocumentContains text and metadataBaseLoaderUse to convert raw data into DocumentsBlobA representation of binary data that&#x27;s located either in a file or in memoryBaseBlobParserLogic to parse a Blob to yield Document objects This guide will demonstrate how to write custom document loading and file parsing logic; specifically, we&#x27;ll see how to: Create a standard document Loader by sub-classing from BaseLoader. Create a parser using BaseBlobParser and use it in conjunction with Blob and BlobLoaders. This is useful primarily when working with files. Standard Document Loader[​](#standard-document-loader) A document loader can be implemented by sub-classing from a BaseLoader which provides a standard interface for loading documents. Interface[​](#interface) Method NameExplanationlazy_loadUsed to load documents one by one lazily**. Use for production code.alazy_loadAsync variant of lazy_loadloadUsed to load all the documents into memory **eagerly**. Use for prototyping or interactive work.aloadUsed to load all the documents into memory **eagerly**. Use for prototyping or interactive work. **Added in 2024-04 to LangChain.** The load methods is a convenience method meant solely for prototyping work -- it just invokes list(self.lazy_load()).

- The alazy_load has a default implementation that will delegate to lazy_load. If you&#x27;re using async, we recommend overriding the default implementation and providing a native async implementation.

importantWhen implementing a document loader do **NOT** provide parameters via the `lazy_load` or `alazy_load` methods.

All configuration is expected to be passed through the initializer (**init**). This was a design choice made by LangChain to make sure that once a document loader has been instantiated it has all the information needed to load documents.

### Installation[​](#installation)

Install **langchain-core** and **langchain_community**.

```python
%pip install -qU langchain_core langchain_community

```**Implementation[​](#implementation) Let&#x27;s create an example of a standard document loader that loads a file and creates a document from each line in the file.

```python
from typing import AsyncIterator, Iterator

from langchain_core.document_loaders import BaseLoader
from langchain_core.documents import Document

class CustomDocumentLoader(BaseLoader):
    """An example document loader that reads a file line by line."""

    def __init__(self, file_path: str) -> None:
        """Initialize the loader with a file path.

        Args:
            file_path: The path to the file to load.
        """
        self.file_path = file_path

    def lazy_load(self) -> Iterator[Document]:  # <-- Does not take any arguments
        """A lazy loader that reads a file line by line.

        When you&#x27;re implementing lazy load methods, you should use a generator
        to yield documents one by one.
        """
        with open(self.file_path, encoding="utf-8") as f:
            line_number = 0
            for line in f:
                yield Document(
                    page_content=line,
                    metadata={"line_number": line_number, "source": self.file_path},
                )
                line_number += 1

    # alazy_load is OPTIONAL.
    # If you leave out the implementation, a default implementation which delegates to lazy_load will be used!
    async def alazy_load(
        self,
    ) -> AsyncIterator[Document]:  # <-- Does not take any arguments
        """An async lazy loader that reads a file line by line."""
        # Requires aiofiles
        # https://github.com/Tinche/aiofiles
        import aiofiles

        async with aiofiles.open(self.file_path, encoding="utf-8") as f:
            line_number = 0
            async for line in f:
                yield Document(
                    page_content=line,
                    metadata={"line_number": line_number, "source": self.file_path},
                )
                line_number += 1

```API Reference:**[BaseLoader](https://python.langchain.com/api_reference/core/document_loaders/langchain_core.document_loaders.base.BaseLoader.html) | [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html)

### Test 🧪[​](#test-)

To test out the document loader, we need a file with some quality content.

```python
with open("./meow.txt", "w", encoding="utf-8") as f:
    quality_content = "meow meow🐱 \n meow meow🐱 \n meow😻😻"
    f.write(quality_content)

loader = CustomDocumentLoader("./meow.txt")

```**

```python
%pip install -q aiofiles

```

```python
## Test out the lazy load interface
for doc in loader.lazy_load():
    print()
    print(type(doc))
    print(doc)

```

```output
<class &#x27;langchain_core.documents.base.Document&#x27;>
page_content=&#x27;meow meow🐱
&#x27; metadata={&#x27;line_number&#x27;: 0, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}

<class &#x27;langchain_core.documents.base.Document&#x27;>
page_content=&#x27; meow meow🐱
&#x27; metadata={&#x27;line_number&#x27;: 1, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}

<class &#x27;langchain_core.documents.base.Document&#x27;>
page_content=&#x27; meow😻😻&#x27; metadata={&#x27;line_number&#x27;: 2, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}

```

```python
## Test out the async implementation
async for doc in loader.alazy_load():
    print()
    print(type(doc))
    print(doc)

```

```output
<class &#x27;langchain_core.documents.base.Document&#x27;>
page_content=&#x27;meow meow🐱
&#x27; metadata={&#x27;line_number&#x27;: 0, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}

<class &#x27;langchain_core.documents.base.Document&#x27;>
page_content=&#x27; meow meow🐱
&#x27; metadata={&#x27;line_number&#x27;: 1, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}

<class &#x27;langchain_core.documents.base.Document&#x27;>
page_content=&#x27; meow😻😻&#x27; metadata={&#x27;line_number&#x27;: 2, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}

``` tipload() can be helpful in an interactive environment such as a jupyter notebook.Avoid using it for production code since eager loading assumes that all the content can fit into memory, which is not always the case, especially for enterprise data.

```python
loader.load()

```

```output
[Document(metadata={&#x27;line_number&#x27;: 0, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}, page_content=&#x27;meow meow🐱 \n&#x27;),
 Document(metadata={&#x27;line_number&#x27;: 1, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}, page_content=&#x27; meow meow🐱 \n&#x27;),
 Document(metadata={&#x27;line_number&#x27;: 2, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}, page_content=&#x27; meow😻😻&#x27;)]

``` Working with Files[​](#working-with-files) Many document loaders involve parsing files. The difference between such loaders usually stems from how the file is parsed, rather than how the file is loaded. For example, you can use open to read the binary content of either a PDF or a markdown file, but you need different parsing logic to convert that binary data into text. As a result, it can be helpful to decouple the parsing logic from the loading logic, which makes it easier to re-use a given parser regardless of how the data was loaded. BaseBlobParser[​](#baseblobparser) A BaseBlobParser is an interface that accepts a blob and outputs a list of Document objects. A blob is a representation of data that lives either in memory or in a file. LangChain python has a Blob primitive which is inspired by the [Blob WebAPI spec](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

```python
from langchain_core.document_loaders import BaseBlobParser, Blob

class MyParser(BaseBlobParser):
    """A simple parser that creates a document from each line."""

    def lazy_parse(self, blob: Blob) -> Iterator[Document]:
        """Parse a blob into a document line by line."""
        line_number = 0
        with blob.as_bytes_io() as f:
            for line in f:
                line_number += 1
                yield Document(
                    page_content=line,
                    metadata={"line_number": line_number, "source": blob.source},
                )

```API Reference:**[BaseBlobParser](https://python.langchain.com/api_reference/core/document_loaders/langchain_core.document_loaders.base.BaseBlobParser.html) | [Blob](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Blob.html)

```python
blob = Blob.from_path("./meow.txt")
parser = MyParser()

```**

```python
list(parser.lazy_parse(blob))

```

```output
[Document(metadata={&#x27;line_number&#x27;: 1, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}, page_content=&#x27;meow meow🐱 \n&#x27;),
 Document(metadata={&#x27;line_number&#x27;: 2, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}, page_content=&#x27; meow meow🐱 \n&#x27;),
 Document(metadata={&#x27;line_number&#x27;: 3, &#x27;source&#x27;: &#x27;./meow.txt&#x27;}, page_content=&#x27; meow😻😻&#x27;)]

``` Using the blob** API also allows one to load content directly from memory without having to read it from a file!

```python
blob = Blob(data=b"some data from memory\nmeow")
list(parser.lazy_parse(blob))

```

```output
[Document(metadata={&#x27;line_number&#x27;: 1, &#x27;source&#x27;: None}, page_content=&#x27;some data from memory\n&#x27;),
 Document(metadata={&#x27;line_number&#x27;: 2, &#x27;source&#x27;: None}, page_content=&#x27;meow&#x27;)]

``` ### Blob[​](#blob) Let&#x27;s take a quick look through some of the Blob API.

```python
blob = Blob.from_path("./meow.txt", metadata={"foo": "bar"})

```

```python
blob.encoding

```

```output
&#x27;utf-8&#x27;

```

```python
blob.as_bytes()

```

```output
b&#x27;meow meow\xf0\x9f\x90\xb1 \n meow meow\xf0\x9f\x90\xb1 \n meow\xf0\x9f\x98\xbb\xf0\x9f\x98\xbb&#x27;

```

```python
blob.as_string()

```

```output
&#x27;meow meow🐱 \n meow meow🐱 \n meow😻😻&#x27;

```

```python
blob.as_bytes_io()

```

```output
<contextlib._GeneratorContextManager at 0x74b8d42e9940>

```

```python
blob.metadata

```

```output
{&#x27;foo&#x27;: &#x27;bar&#x27;}

```

```python
blob.source

```

```output
&#x27;./meow.txt&#x27;

``` ### Blob Loaders[​](#blob-loaders) While a parser encapsulates the logic needed to parse binary data into documents, *blob loaders* encapsulate the logic that&#x27;s necessary to load blobs from a given storage location.

At the moment, `LangChain` supports `FileSystemBlobLoader` and `CloudBlobLoader`.

You can use the `FileSystemBlobLoader` to load blobs and then use the parser to parse them.

```python
from langchain_community.document_loaders.blob_loaders import FileSystemBlobLoader

filesystem_blob_loader = FileSystemBlobLoader(
    path=".", glob="*.mdx", show_progress=True
)

```

```python
%pip install -q tqdm

```

```python
parser = MyParser()
for blob in filesystem_blob_loader.yield_blobs():
    for doc in parser.lazy_parse(blob):
        print(doc)
        break

``` Or, you can use `CloudBlobLoader` to load blobs from a cloud storage location (Supports s3://, az://, gs://, file:// schemes).

```python
%pip install -q &#x27;cloudpathlib[s3]&#x27;

```

```python
from cloudpathlib import S3Client, S3Path
from langchain_community.document_loaders.blob_loaders import CloudBlobLoader

client = S3Client(no_sign_request=True)
client.set_as_default_client()

path = S3Path(
    "s3://bucket-01", client=client
)  # Supports s3://, az://, gs://, file:// schemes.

cloud_loader = CloudBlobLoader(path, glob="**/*.pdf", show_progress=True)

for blob in cloud_loader.yield_blobs():
    print(blob)

``` ### Generic Loader[ ​](#generic-loader) LangChain has a `GenericLoader` abstraction which composes a `BlobLoader` with a `BaseBlobParser`.

`GenericLoader` is meant to provide standardized classmethods that make it easy to use existing `BlobLoader` implementations. At the moment, the `FileSystemBlobLoader` and `CloudBlobLoader` are supported. See example below:

```python
from langchain_community.document_loaders.generic import GenericLoader

generic_loader_filesystem = GenericLoader(
    blob_loader=filesystem_blob_loader, blob_parser=parser
)
for idx, doc in enumerate(generic_loader_filesystem.lazy_load()):
    if idx < 5:
        print(doc)

print("... output truncated for demo purposes")

```

```output
100%|██████████| 7/7 [00:00<00:00, 1224.82it/s]
``````output
page_content=&#x27;# Text embedding models
&#x27; metadata={&#x27;line_number&#x27;: 1, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
page_content=&#x27;
&#x27; metadata={&#x27;line_number&#x27;: 2, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
page_content=&#x27;:::info
&#x27; metadata={&#x27;line_number&#x27;: 3, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
page_content=&#x27;Head to [Integrations](/docs/integrations/text_embedding/) for documentation on built-in integrations with text embedding model providers.
&#x27; metadata={&#x27;line_number&#x27;: 4, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
page_content=&#x27;:::
&#x27; metadata={&#x27;line_number&#x27;: 5, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
... output truncated for demo purposes

``` #### Custom Generic Loader[​](#custom-generic-loader) If you really like creating classes, you can sub-class and create a class to encapsulate the logic together.

You can sub-class from this class to load content using an existing loader.

```python
from typing import Any

class MyCustomLoader(GenericLoader):
    @staticmethod
    def get_parser(**kwargs: Any) -> BaseBlobParser:
        """Override this method to associate a default parser with the class."""
        return MyParser()

```

```python
loader = MyCustomLoader.from_filesystem(path=".", glob="*.mdx", show_progress=True)

for idx, doc in enumerate(loader.lazy_load()):
    if idx < 5:
        print(doc)

print("... output truncated for demo purposes")

```

```output
100%|██████████| 7/7 [00:00<00:00, 814.86it/s]
``````output
page_content=&#x27;# Text embedding models
&#x27; metadata={&#x27;line_number&#x27;: 1, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
page_content=&#x27;
&#x27; metadata={&#x27;line_number&#x27;: 2, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
page_content=&#x27;:::info
&#x27; metadata={&#x27;line_number&#x27;: 3, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
page_content=&#x27;Head to [Integrations](/docs/integrations/text_embedding/) for documentation on built-in integrations with text embedding model providers.
&#x27; metadata={&#x27;line_number&#x27;: 4, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
page_content=&#x27;:::
&#x27; metadata={&#x27;line_number&#x27;: 5, &#x27;source&#x27;: &#x27;embed_text.mdx&#x27;}
... output truncated for demo purposes

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/document_loader_custom.ipynb)

- [Overview](#overview)
- [Standard Document Loader](#standard-document-loader)[Interface](#interface)
- [Installation](#installation)
- [Implementation](#implementation)
- [Test 🧪](#test-)

- [Working with Files](#working-with-files)[BaseBlobParser](#baseblobparser)
- [Blob](#blob)
- [Blob Loaders](#blob-loaders)
- [Generic Loader](#generic-loader)

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