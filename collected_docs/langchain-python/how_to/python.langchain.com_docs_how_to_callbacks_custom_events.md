How to dispatch custom callback events | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/callbacks_custom_events.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/callbacks_custom_events.ipynb)How to dispatch custom callback events PrerequisitesThis guide assumes familiarity with the following concepts: [Callbacks](/docs/concepts/callbacks/) [Custom callback handlers](/docs/how_to/custom_callbacks/) [Astream Events API](/docs/concepts/streaming/#astream_events) the astream_events method will surface custom callback events. In some situations, you may want to dispatch a custom callback event from within a [Runnable](/docs/concepts/runnables/) so it can be surfaced in a custom callback handler or via the [Astream Events API](/docs/concepts/streaming/#astream_events). For example, if you have a long running tool with multiple steps, you can dispatch custom events between the steps and use these custom events to monitor progress. You could also surface these custom events to an end user of your application to show them how the current task is progressing. To dispatch a custom event you need to decide on two attributes for the event: the name and the data. AttributeTypeDescriptionnamestrA user defined name for the event.dataAnyThe data associated with the event. This can be anything, though we suggest making it JSON serializable. important Dispatching custom callback events requires langchain-core>=0.2.15. Custom callback events can only be dispatched from within an existing Runnable. If using astream_events, you must use version=&#x27;v2&#x27; to see custom events. Sending or rendering custom callbacks events in LangSmith is not yet supported. COMPATIBILITYLangChain cannot automatically propagate configuration, including callbacks necessary for astream_events(), to child runnables if you are running async code in python=3.11, the RunnableConfig will automatically propagate to child runnables in async environment. However, it is still a good idea to propagate the RunnableConfig manually if your code may run in other Python versions. Astream Events API[​](#astream-events-api) The most useful way to consume custom events is via the [Astream Events API](/docs/concepts/streaming/#astream_events). We can use the async adispatch_custom_event API to emit custom events in an async setting. importantTo see custom events via the astream events API, you need to use the newer v2 API of astream_events.

```python
from langchain_core.callbacks.manager import (
    adispatch_custom_event,
)
from langchain_core.runnables import RunnableLambda
from langchain_core.runnables.config import RunnableConfig

@RunnableLambda
async def foo(x: str) -> str:
    await adispatch_custom_event("event1", {"x": x})
    await adispatch_custom_event("event2", 5)
    return x

async for event in foo.astream_events("hello world", version="v2"):
    print(event)

```API Reference:**[adispatch_custom_event](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.adispatch_custom_event.html) | [RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html)

```output
{&#x27;event&#x27;: &#x27;on_chain_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;hello world&#x27;}, &#x27;name&#x27;: &#x27;foo&#x27;, &#x27;tags&#x27;: [], &#x27;run_id&#x27;: &#x27;f354ffe8-4c22-4881-890a-c1cad038a9a6&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_custom_event&#x27;, &#x27;run_id&#x27;: &#x27;f354ffe8-4c22-4881-890a-c1cad038a9a6&#x27;, &#x27;name&#x27;: &#x27;event1&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;x&#x27;: &#x27;hello world&#x27;}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_custom_event&#x27;, &#x27;run_id&#x27;: &#x27;f354ffe8-4c22-4881-890a-c1cad038a9a6&#x27;, &#x27;name&#x27;: &#x27;event2&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: 5, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_stream&#x27;, &#x27;run_id&#x27;: &#x27;f354ffe8-4c22-4881-890a-c1cad038a9a6&#x27;, &#x27;name&#x27;: &#x27;foo&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: &#x27;hello world&#x27;}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: &#x27;hello world&#x27;}, &#x27;run_id&#x27;: &#x27;f354ffe8-4c22-4881-890a-c1cad038a9a6&#x27;, &#x27;name&#x27;: &#x27;foo&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}

```**In python [adispatch_custom_event](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.adispatch_custom_event.html) | [RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html)

```output
{&#x27;event&#x27;: &#x27;on_chain_start&#x27;, &#x27;data&#x27;: {&#x27;input&#x27;: &#x27;hello world&#x27;}, &#x27;name&#x27;: &#x27;bar&#x27;, &#x27;tags&#x27;: [], &#x27;run_id&#x27;: &#x27;c787b09d-698a-41b9-8290-92aaa656f3e7&#x27;, &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_custom_event&#x27;, &#x27;run_id&#x27;: &#x27;c787b09d-698a-41b9-8290-92aaa656f3e7&#x27;, &#x27;name&#x27;: &#x27;event1&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;x&#x27;: &#x27;hello world&#x27;}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_custom_event&#x27;, &#x27;run_id&#x27;: &#x27;c787b09d-698a-41b9-8290-92aaa656f3e7&#x27;, &#x27;name&#x27;: &#x27;event2&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: 5, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_stream&#x27;, &#x27;run_id&#x27;: &#x27;c787b09d-698a-41b9-8290-92aaa656f3e7&#x27;, &#x27;name&#x27;: &#x27;bar&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;data&#x27;: {&#x27;chunk&#x27;: &#x27;hello world&#x27;}, &#x27;parent_ids&#x27;: []}
{&#x27;event&#x27;: &#x27;on_chain_end&#x27;, &#x27;data&#x27;: {&#x27;output&#x27;: &#x27;hello world&#x27;}, &#x27;run_id&#x27;: &#x27;c787b09d-698a-41b9-8290-92aaa656f3e7&#x27;, &#x27;name&#x27;: &#x27;bar&#x27;, &#x27;tags&#x27;: [], &#x27;metadata&#x27;: {}, &#x27;parent_ids&#x27;: []}

```**Async Callback Handler[​](#async-callback-handler) You can also consume the dispatched event via an async callback handler.

```python
from typing import Any, Dict, List, Optional
from uuid import UUID

from langchain_core.callbacks import AsyncCallbackHandler
from langchain_core.callbacks.manager import (
    adispatch_custom_event,
)
from langchain_core.runnables import RunnableLambda
from langchain_core.runnables.config import RunnableConfig

class AsyncCustomCallbackHandler(AsyncCallbackHandler):
    async def on_custom_event(
        self,
        name: str,
        data: Any,
        *,
        run_id: UUID,
        tags: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
        **kwargs: Any,
    ) -> None:
        print(
            f"Received event {name} with data: {data}, with tags: {tags}, with metadata: {metadata} and run_id: {run_id}"
        )

@RunnableLambda
async def bar(x: str, config: RunnableConfig) -> str:
    """An example that shows how to manually propagate config.

    You must do this if you&#x27;re running python<=3.10.
    """
    await adispatch_custom_event("event1", {"x": x}, config=config)
    await adispatch_custom_event("event2", 5, config=config)
    return x

async_handler = AsyncCustomCallbackHandler()
await foo.ainvoke(1, {"callbacks": [async_handler], "tags": ["foo", "bar"]})

```API Reference:**[AsyncCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.AsyncCallbackHandler.html) | [adispatch_custom_event](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.adispatch_custom_event.html) | [RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html)

```output
Received event event1 with data: {&#x27;x&#x27;: 1}, with tags: [&#x27;foo&#x27;, &#x27;bar&#x27;], with metadata: {} and run_id: a62b84be-7afd-4829-9947-7165df1f37d9
Received event event2 with data: 5, with tags: [&#x27;foo&#x27;, &#x27;bar&#x27;], with metadata: {} and run_id: a62b84be-7afd-4829-9947-7165df1f37d9

```**

```output
1

``` Sync Callback Handler[​](#sync-callback-handler) Let&#x27;s see how to emit custom events in a sync environment using dispatch_custom_event. You must** call dispatch_custom_event from within an existing Runnable.

```python
from typing import Any, Dict, List, Optional
from uuid import UUID

from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.callbacks.manager import (
    dispatch_custom_event,
)
from langchain_core.runnables import RunnableLambda
from langchain_core.runnables.config import RunnableConfig

class CustomHandler(BaseCallbackHandler):
    def on_custom_event(
        self,
        name: str,
        data: Any,
        *,
        run_id: UUID,
        tags: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
        **kwargs: Any,
    ) -> None:
        print(
            f"Received event {name} with data: {data}, with tags: {tags}, with metadata: {metadata} and run_id: {run_id}"
        )

@RunnableLambda
def foo(x: int, config: RunnableConfig) -> int:
    dispatch_custom_event("event1", {"x": x})
    dispatch_custom_event("event2", {"x": x})
    return x

handler = CustomHandler()
foo.invoke(1, {"callbacks": [handler], "tags": ["foo", "bar"]})

```**API Reference:**[BaseCallbackHandler](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.base.BaseCallbackHandler.html) | [dispatch_custom_event](https://python.langchain.com/api_reference/core/callbacks/langchain_core.callbacks.manager.dispatch_custom_event.html) | [RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnableConfig](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.config.RunnableConfig.html)

```output
Received event event1 with data: {&#x27;x&#x27;: 1}, with tags: [&#x27;foo&#x27;, &#x27;bar&#x27;], with metadata: {} and run_id: 27b5ce33-dc26-4b34-92dd-08a89cb22268
Received event event2 with data: {&#x27;x&#x27;: 1}, with tags: [&#x27;foo&#x27;, &#x27;bar&#x27;], with metadata: {} and run_id: 27b5ce33-dc26-4b34-92dd-08a89cb22268

```

```output
1

``` ## Next steps[​](#next-steps) You&#x27;ve seen how to emit custom events, you can check out the more in depth guide for [astream events](/docs/how_to/streaming/#using-stream-events) which is the easiest way to leverage custom events.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/callbacks_custom_events.ipynb)[Astream Events API](#astream-events-api)
- [Async Callback Handler](#async-callback-handler)
- [Sync Callback Handler](#sync-callback-handler)
- [Next steps](#next-steps)

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