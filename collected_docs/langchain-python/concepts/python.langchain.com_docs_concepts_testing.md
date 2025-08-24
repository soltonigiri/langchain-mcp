Testing | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/concepts/testing.mdx)Testing Testing is a critical part of the development process that ensures your code works as expected and meets the desired quality standards. In the LangChain ecosystem, we have 2 main types of tests: unit tests** and **integration tests**. For integrations that implement standard LangChain abstractions, we have a set of **standard tests** (both unit and integration) that help maintain compatibility between different components and ensure reliability of high-usage ones. ## Unit Tests[​](#unit-tests) **Definition**: Unit tests are designed to validate the smallest parts of your code—individual functions or methods—ensuring they work as expected in isolation. They do not rely on external systems or integrations. **Example**: Testing the convert_langchain_aimessage_to_dict function to confirm it correctly converts an AI message to a dictionary format:

```python
from langchain_core.messages import AIMessage, ToolCall, convert_to_openai_messages

def test_convert_to_openai_messages():
    ai_message = AIMessage(
        content="Let me call that tool for you!",
        tool_calls=[
            ToolCall(name=&#x27;parrot_multiply_tool&#x27;, id=&#x27;1&#x27;, args={&#x27;a&#x27;: 2, &#x27;b&#x27;: 3}),
        ]
    )

    result = convert_to_openai_messages(ai_message)

    expected = {
        "role": "assistant",
        "tool_calls": [
            {
                "type": "function",
                "id": "1",
                "function": {
                    "name": "parrot_multiply_tool",
                    "arguments": &#x27;{"a": 2, "b": 3}&#x27;,
                },
            }
        ],
        "content": "Let me call that tool for you!",
    }
    assert result == expected  # Ensure conversion matches expected output

```**API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [ToolCall](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.content_blocks.ToolCall.html) | [convert_to_openai_messages](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.utils.convert_to_openai_messages.html) ## Integration Tests[​](#integration-tests) **Definition**: Integration tests validate that multiple components or systems work together as expected. For tools or integrations relying on external services, these tests often ensure end-to-end functionality. **Example**: Testing ParrotMultiplyTool with access to an API service that multiplies two numbers and adds 80:

```python
def test_integration_with_service():
    tool = ParrotMultiplyTool()
    result = tool.invoke({"a": 2, "b": 3})
    assert result == 86

```**Standard Tests[​](#standard-tests) Definition**: Standard tests are pre-defined tests provided by LangChain to ensure consistency and reliability across all tools and integrations. They include both unit and integration test templates tailored for LangChain components. **Example**: Subclassing LangChain&#x27;s ToolsUnitTests or ToolsIntegrationTests to automatically run standard tests:

```python
from langchain_tests.unit_tests import ToolsUnitTests

class TestParrotMultiplyToolUnit(ToolsUnitTests):
    @property
    def tool_constructor(self):
        return ParrotMultiplyTool

    def tool_invoke_params_example(self):
        return {"a": 2, "b": 3}

``` To learn more, check out our guide on [how to add standard tests to an integration](/docs/contributing/how_to/integrations/standard_tests/).[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/concepts/testing.mdx)[Unit Tests](#unit-tests)
- [Integration Tests](#integration-tests)
- [Standard Tests](#standard-tests)

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