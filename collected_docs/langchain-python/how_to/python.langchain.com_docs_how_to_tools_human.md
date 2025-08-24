How to add a human-in-the-loop for tools | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_human.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/tools_human.ipynb)How to add a human-in-the-loop for tools There are certain tools that we don&#x27;t trust a model to execute on its own. One thing we can do in such situations is require human approval before the tool is invoked. infoThis how-to guide shows a simple way to add human-in-the-loop for code running in a jupyter notebook or in a terminal.To build a production application, you will need to do more work to keep track of application state appropriately.We recommend using langgraph for powering such a capability. For more details, please see this [guide](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/). Setup[​](#setup) We&#x27;ll need to install the following packages:

```python
%pip install --upgrade --quiet langchain

``` And set these environment variables:

```python
import getpass
import os

# If you&#x27;d like to use LangSmith, uncomment the below:
# os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()

``` Chain[​](#chain) Let&#x27;s create a few simple (dummy) tools and a tool-calling chain: Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

```

```python
from typing import Dict, List

from langchain_core.messages import AIMessage
from langchain_core.runnables import Runnable, RunnablePassthrough
from langchain_core.tools import tool

@tool
def count_emails(last_n_days: int) -> int:
    """Dummy function to count number of e-mails. Returns 2 * last_n_days."""
    return last_n_days * 2

@tool
def send_email(message: str, recipient: str) -> str:
    """Dummy function for sending an e-mail."""
    return f"Successfully sent email to {recipient}."

tools = [count_emails, send_email]
llm_with_tools = llm.bind_tools(tools)

def call_tools(msg: AIMessage) -> List[Dict]:
    """Simple sequential tool calling helper."""
    tool_map = {tool.name: tool for tool in tools}
    tool_calls = msg.tool_calls.copy()
    for tool_call in tool_calls:
        tool_call["output"] = tool_map[tool_call["name"]].invoke(tool_call["args"])
    return tool_calls

chain = llm_with_tools | call_tools
chain.invoke("how many emails did i get in the last 5 days?")

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [Runnable](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.Runnable.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html) | [tool](https://python.langchain.com/api_reference/core/tools/langchain_core.tools.convert.tool.html)

```output
[{&#x27;name&#x27;: &#x27;count_emails&#x27;,
  &#x27;args&#x27;: {&#x27;last_n_days&#x27;: 5},
  &#x27;id&#x27;: &#x27;toolu_01XrE4AU9QLo4imbriDDkmXm&#x27;,
  &#x27;type&#x27;: &#x27;tool_call&#x27;,
  &#x27;output&#x27;: 10}]

``` ## Adding human approval[​](#adding-human-approval) Let&#x27;s add a step in the chain that will ask a person to approve or reject the tool call request. On rejection, the step will raise an exception which will stop execution of the rest of the chain.

```python
import json

class NotApproved(Exception):
    """Custom exception."""

def human_approval(msg: AIMessage) -> AIMessage:
    """Responsible for passing through its input or raising an exception.

    Args:
        msg: output from the chat model

    Returns:
        msg: original output from the msg
    """
    tool_strs = "\n\n".join(
        json.dumps(tool_call, indent=2) for tool_call in msg.tool_calls
    )
    input_msg = (
        f"Do you approve of the following tool invocations\n\n{tool_strs}\n\n"
        "Anything except &#x27;Y&#x27;/&#x27;Yes&#x27; (case-insensitive) will be treated as a no.\n >>>"
    )
    resp = input(input_msg)
    if resp.lower() not in ("yes", "y"):
        raise NotApproved(f"Tool invocations not approved:\n\n{tool_strs}")
    return msg

```

```python
chain = llm_with_tools | human_approval | call_tools
chain.invoke("how many emails did i get in the last 5 days?")

```

```output
Do you approve of the following tool invocations

{
  "name": "count_emails",
  "args": {
    "last_n_days": 5
  },
  "id": "toolu_01WbD8XeMoQaRFtsZezfsHor"
}

Anything except &#x27;Y&#x27;/&#x27;Yes&#x27; (case-insensitive) will be treated as a no.
 >>> yes

```

```output
[{&#x27;name&#x27;: &#x27;count_emails&#x27;,
  &#x27;args&#x27;: {&#x27;last_n_days&#x27;: 5},
  &#x27;id&#x27;: &#x27;toolu_01WbD8XeMoQaRFtsZezfsHor&#x27;,
  &#x27;output&#x27;: 10}]

```

```python
try:
    chain.invoke("Send sally@gmail.com an email saying &#x27;What&#x27;s up homie&#x27;")
except NotApproved as e:
    print()
    print(e)

```

```output
Do you approve of the following tool invocations

{
  "name": "send_email",
  "args": {
    "recipient": "sally@gmail.com",
    "message": "What&#x27;s up homie"
  },
  "id": "toolu_014XccHFzBiVcc9GV1harV9U"
}

Anything except &#x27;Y&#x27;/&#x27;Yes&#x27; (case-insensitive) will be treated as a no.
 >>> no
``````output

Tool invocations not approved:

{
  "name": "send_email",
  "args": {
    "recipient": "sally@gmail.com",
    "message": "What&#x27;s up homie"
  },
  "id": "toolu_014XccHFzBiVcc9GV1harV9U"
}

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/tools_human.ipynb)[Setup](#setup)
- [Chain](#chain)
- [Adding human approval](#adding-human-approval)

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