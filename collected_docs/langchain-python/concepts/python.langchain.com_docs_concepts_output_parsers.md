Output parsers | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/output_parsers.mdx)Output parsers noteThe information here refers to parsers that take a text output from a model try to parse it into a more structured representation. More and more models are supporting function (or tool) calling, which handles this automatically. It is recommended to use function/tool calling rather than output parsing. See documentation for that [here](/docs/concepts/tool_calling/). Output parser is responsible for taking the output of a model and transforming it to a more suitable format for downstream tasks. Useful when you are using LLMs to generate structured data, or to normalize output from chat models and LLMs. LangChain has lots of different types of output parsers. This is a list of output parsers LangChain supports. The table below has various pieces of information: Name**: The name of the output parser

- **Supports Streaming**: Whether the output parser supports streaming.

- **Has Format Instructions**: Whether the output parser has format instructions. This is generally available except when (a) the desired schema is not specified in the prompt but rather in other parameters (like OpenAI function calling), or (b) when the OutputParser wraps another OutputParser.

- **Calls LLM**: Whether this output parser itself calls an LLM. This is usually only done by output parsers that attempt to correct misformatted output.

- **Input Type**: Expected input type. Most output parsers work on both strings and messages, but some (like OpenAI Functions) need a message with specific kwargs.

- **Output Type**: The output type of the object returned by the parser.

- **Description**: Our commentary on this output parser and when to use it.

| Name | Supports Streaming | Has Format Instructions | Calls LLM | Input Type | Output Type | Description |

| [Str](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | ✅ |  |  | `str` | `Message` | String | Parses texts from message objects. Useful for handling variable formats of message content (e.g., extracting text from content blocks). |

| [JSON](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.json.JsonOutputParser.html) | ✅ | ✅ |  | `str` | `Message` | JSON object | Returns a JSON object as specified. You can specify a Pydantic model and it will return JSON for that model. Probably the most reliable output parser for getting structured data that does NOT use function calling. |

| [XML](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.xml.XMLOutputParser.html#langchain_core.output_parsers.xml.XMLOutputParser) | ✅ | ✅ |  | `str` | `Message` | `dict` | Returns a dictionary of tags. Use when XML output is needed. Use with models that are good at writing XML (like Anthropic&#x27;s). |

| [CSV](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.list.CommaSeparatedListOutputParser.html#langchain_core.output_parsers.list.CommaSeparatedListOutputParser) | ✅ | ✅ |  | `str` | `Message` | `List[str]` | Returns a list of comma separated values. |

| [OutputFixing](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.fix.OutputFixingParser.html#langchain.output_parsers.fix.OutputFixingParser) |  |  | ✅ | `str` | `Message` |  | Wraps another output parser. If that output parser errors, then this will pass the error message and the bad output to an LLM and ask it to fix the output. |

| [RetryWithError](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.retry.RetryWithErrorOutputParser.html#langchain.output_parsers.retry.RetryWithErrorOutputParser) |  |  | ✅ | `str` | `Message` |  | Wraps another output parser. If that output parser errors, then this will pass the original inputs, the bad output, and the error message to an LLM and ask it to fix it. Compared to OutputFixingParser, this one also sends the original instructions. |

| [Pydantic](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.pydantic.PydanticOutputParser.html#langchain_core.output_parsers.pydantic.PydanticOutputParser) |  | ✅ |  | `str` | `Message` | `pydantic.BaseModel` | Takes a user defined Pydantic model and returns data in that format. |

| [YAML](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.yaml.YamlOutputParser.html#langchain.output_parsers.yaml.YamlOutputParser) |  | ✅ |  | `str` | `Message` | `pydantic.BaseModel` | Takes a user defined Pydantic model and returns data in that format. Uses YAML to encode it. |

| [PandasDataFrame](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.pandas_dataframe.PandasDataFrameOutputParser.html#langchain.output_parsers.pandas_dataframe.PandasDataFrameOutputParser) |  | ✅ |  | `str` | `Message` | `dict` | Useful for doing operations with pandas DataFrames. |

| [Enum](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.enum.EnumOutputParser.html#langchain.output_parsers.enum.EnumOutputParser) |  | ✅ |  | `str` | `Message` | `Enum` | Parses response into one of the provided enum values. |

| [Datetime](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.datetime.DatetimeOutputParser.html#langchain.output_parsers.datetime.DatetimeOutputParser) |  | ✅ |  | `str` | `Message` | `datetime.datetime` | Parses response into a datetime string. |

| [Structured](https://python.langchain.com/api_reference/langchain/output_parsers/langchain.output_parsers.structured.StructuredOutputParser.html#langchain.output_parsers.structured.StructuredOutputParser) |  | ✅ |  | `str` | `Message` | `Dict[str, str]` | An output parser that returns structured information. It is less powerful than other output parsers since it only allows for fields to be strings. This can be useful when you are working with smaller LLMs. |

For specifics on how to use output parsers, see the [relevant how-to guides here](/docs/how_to/#output-parsers).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/output_parsers.mdx)Community

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