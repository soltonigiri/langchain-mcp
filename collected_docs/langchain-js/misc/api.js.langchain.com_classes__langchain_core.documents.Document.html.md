Document | LangChain.js
- v0.3 v0.2 v0.1 Preparing search index...
- The search index is not available

[LangChain.js](../index.html)[](#)

- [LangChain.js](../index.html)
- [@langchain/core](../modules/_langchain_core.html)
- [documents](../modules/_langchain_core.documents.html)
- [Document](_langchain_core.documents.Document.html)

# Class Document

Interface for interacting with a document.



#### Type Parameters

- Metadata extends Record = Record



#### Implements

- [DocumentInput](../interfaces/_langchain_core.documents.DocumentInput.html)
- [DocumentInterface](../interfaces/_langchain_core.documents.DocumentInterface.html)

##### Index

### Constructors

[constructor](_langchain_core.documents.Document.html#constructor)

### Properties

[id?](_langchain_core.documents.Document.html#id)
[metadata](_langchain_core.documents.Document.html#metadata-2)
[pageContent](_langchain_core.documents.Document.html#pageContent)

## Constructors

### constructor[](#constructor)

- new Document(fields): [Document](_langchain_core.documents.Document.html)[](#constructor.new_Document)
- #### Type Parameters Metadata extends Record = Record

#### Parameters

- fields: [DocumentInput](../interfaces/_langchain_core.documents.DocumentInput.html)

#### Returns [Document](_langchain_core.documents.Document.html)

## Properties

### Optionalid[](#id)

id?: string

An optional identifier for the document.

Ideally this should be unique across the document collection and formatted as a UUID, but this will not be enforced.

### metadata[](#metadata-2)

metadata: [Metadata](_langchain_core.documents.Document.html#constructor.new_Document.Metadata-1)

### pageContent[](#pageContent)

pageContent: string

### Settings

Member Visibility

- Protected
- Inherited
- External

ThemeOSLightDark

### On This Page

Constructors[constructor](#constructor)Properties[id](#id)[metadata](#metadata-2)[pageContent](#pageContent)

Generated using [TypeDoc](https://typedoc.org/)