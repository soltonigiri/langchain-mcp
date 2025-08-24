How to dispatch custom callback events | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to dispatch custom callback eventsPrerequisitesThis guide assumes familiarity with the following concepts:Callbacks](/docs/concepts/callbacks)[Custom callback handlers](/docs/how_to/custom_callbacks)[Stream Events API](/docs/concepts/streaming#streamevents)In some situations, you may want to dipsatch a custom callback event from within a [Runnable](/docs/concepts/#runnable-interface) so it can be surfaced in a custom callback handler or via the [Stream Events API](/docs/concepts/streaming#streamevents).For example, if you have a long running tool with multiple steps, you can dispatch custom events between the steps and use these custom events to monitor progress. You could also surface these custom events to an end user of your application to show them how the current task is progressing.To dispatch a custom event you need to decide on two attributes for the event: the name and the data.AttributeTypeDescriptionnamestringA user defined name for the event.dataanyThe data associated with the event. This can be anything, though we suggest making it JSON serializable.Custom callback events can only be dispatched from within an existing Runnable.If using streamEvents, you must use version: "v2" to consume custom events.Sending or rendering custom callback events in LangSmith is not yet supported.Stream Events API[​](#stream-events-api)The most useful way to consume custom events is via the [.streamEvents()](/docs/concepts/streaming#streamevents) method.We can use the dispatchCustomEvent API to emit custom events from this method.CompatibilityDispatching custom callback events requires @langchain/core>=0.2.16. See [this guide](/docs/how_to/installation/#installing-integration-packages) for some considerations to take when upgrading @langchain/core.The default entrypoint below triggers an import and initialization of [async_hooks](https://nodejs.org/api/async_hooks.html) to enable automatic RunnableConfig passing, which is not supported in all environments. If you see import issues, you must import from @langchain/core/callbacks/dispatch/web and propagate the RunnableConfig object manually (see example below).

```typescript
import { RunnableLambda } from "@langchain/core/runnables";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch";

const reflect = RunnableLambda.from(async (value: string) => {
  await dispatchCustomEvent("event1", {
    reversed: value.split("").reverse().join(""),
  });
  await dispatchCustomEvent("event2", 5);
  return value;
});

const eventStream = await reflect.streamEvents("hello world", {
  version: "v2",
});

for await (const event of eventStream) {
  if (event.event === "on_custom_event") {
    console.log(event);
  }
}

```

```text
{
  event: &#x27;on_custom_event&#x27;,
  run_id: &#x27;9eac217d-3a2d-4563-a91f-3bd49bee4b3d&#x27;,
  name: &#x27;event1&#x27;,
  tags: [],
  metadata: {},
  data: { reversed: &#x27;dlrow olleh&#x27; }
}
{
  event: &#x27;on_custom_event&#x27;,
  run_id: &#x27;9eac217d-3a2d-4563-a91f-3bd49bee4b3d&#x27;,
  name: &#x27;event2&#x27;,
  tags: [],
  metadata: {},
  data: 5
}

```If you are in a web environment that does not support async_hooks, you must import from the web entrypoint and propagate the config manually instead:

```typescript
import { RunnableConfig, RunnableLambda } from "@langchain/core/runnables";
import { dispatchCustomEvent as dispatchCustomEventWeb } from "@langchain/core/callbacks/dispatch/web";

const reflect = RunnableLambda.from(
  async (value: string, config?: RunnableConfig) => {
    await dispatchCustomEventWeb(
      "event1",
      { reversed: value.split("").reverse().join("") },
      config
    );
    await dispatchCustomEventWeb("event2", 5, config);
    return value;
  }
);

const eventStream = await reflect.streamEvents("hello world", {
  version: "v2",
});

for await (const event of eventStream) {
  if (event.event === "on_custom_event") {
    console.log(event);
  }
}

```

```text
{
  event: &#x27;on_custom_event&#x27;,
  run_id: &#x27;dee1e4f0-c5ff-4118-9391-461a0dcc4cb2&#x27;,
  name: &#x27;event1&#x27;,
  tags: [],
  metadata: {},
  data: { reversed: &#x27;dlrow olleh&#x27; }
}
{
  event: &#x27;on_custom_event&#x27;,
  run_id: &#x27;dee1e4f0-c5ff-4118-9391-461a0dcc4cb2&#x27;,
  name: &#x27;event2&#x27;,
  tags: [],
  metadata: {},
  data: 5
}

```Callback Handler[​](#callback-handler)Let’s see how to emit custom events with dispatchCustomEvent.Remember, you must** call dispatchCustomEvent from within an existing Runnable.

```typescript
import { RunnableConfig, RunnableLambda } from "@langchain/core/runnables";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch";

const reflect = RunnableLambda.from(async (value: string) => {
  await dispatchCustomEvent("event1", {
    reversed: value.split("").reverse().join(""),
  });
  await dispatchCustomEvent("event2", 5);
  return value;
});

await reflect.invoke("hello world", {
  callbacks: [
    {
      handleCustomEvent(eventName, data, runId) {
        console.log(eventName, data, runId);
      },
    },
  ],
});

```

```text
event1 { reversed: &#x27;dlrow olleh&#x27; } 9c3770ac-c83d-4626-9643-b5fd80eb5431
event2 5 9c3770ac-c83d-4626-9643-b5fd80eb5431
hello world

``` ## Related[​](#related) You’ve now seen how to emit custom events from within your chains.You can check out the more in depth guide for [stream events](/docs/how_to/streaming/#using-stream-events) for more ways to parse and receive intermediate steps from your chains. #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). [Stream Events API](#stream-events-api)
- [Callback Handler](#callback-handler)
- [Related](#related)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.