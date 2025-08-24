How to load Microsoft Office files | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/document_loader_office_file.mdx)How to load Microsoft Office files The [Microsoft Office](https://www.office.com/) suite of productivity software includes Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Microsoft Outlook, and Microsoft OneNote. It is available for Microsoft Windows and macOS operating systems. It is also available on Android and iOS. This covers how to load commonly used file formats including DOCX, XLSX and PPTX documents into a LangChain [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html#langchain_core.documents.base.Document) object that we can use downstream. Loading DOCX, XLSX, PPTX with AzureAIDocumentIntelligenceLoader[​](#loading-docx-xlsx-pptx-with-azureaidocumentintelligenceloader) [Azure AI Document Intelligence](https://aka.ms/doc-intelligence) (formerly known as Azure Form Recognizer) is machine-learning based service that extracts texts (including handwriting), tables, document structures (e.g., titles, section headings, etc.) and key-value-pairs from digital or scanned PDFs, images, Office and HTML files. Document Intelligence supports PDF, JPEG/JPG, PNG, BMP, TIFF, HEIF, DOCX, XLSX, PPTX and HTML. This [current implementation](https://aka.ms/di-langchain) of a loader using Document Intelligence can incorporate content page-wise and turn it into LangChain documents. The default output format is markdown, which can be easily chained with MarkdownHeaderTextSplitter for semantic document chunking. You can also use mode="single" or mode="page" to return pure texts in a single page or document split by page. Prerequisite[​](#prerequisite) An Azure AI Document Intelligence resource in one of the 3 preview regions: East US**, **West US2**, **West Europe** - follow [this document](https://learn.microsoft.com/azure/ai-services/document-intelligence/create-document-intelligence-resource?view=doc-intel-4.0.0) to create one if you don&#x27;t have. You will be passing  and  as parameters to the loader.

```python
%pip install --upgrade --quiet  langchain langchain-community azure-ai-documentintelligence

from langchain_community.document_loaders import AzureAIDocumentIntelligenceLoader

file_path = "<filepath>"
endpoint = "<endpoint>"
key = "<key>"
loader = AzureAIDocumentIntelligenceLoader(
    api_endpoint=endpoint, api_key=key, file_path=file_path, api_model="prebuilt-layout"
)

documents = loader.load()

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/document_loader_office_file.mdx)[Loading DOCX, XLSX, PPTX with AzureAIDocumentIntelligenceLoader](#loading-docx-xlsx-pptx-with-azureaidocumentintelligenceloader)[Prerequisite](#prerequisite)

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