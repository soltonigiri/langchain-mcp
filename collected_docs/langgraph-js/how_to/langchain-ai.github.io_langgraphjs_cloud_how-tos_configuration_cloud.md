- Manage assistants [Skip to content](#manage-assistants) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [Use an assistant](#use-an-assistant)

- [Create a new version for your assistant](#create-a-new-version-for-your-assistant)

- [Use a previous assistant version](#use-a-previous-assistant-version)

- [None](../assistant_versioning.md)

- [Threads](../../../how-tos#threads)

- [Runs](../../../how-tos#runs)

- [Streaming](../../../how-tos#streaming_1)

- [Frontend & Generative UI](../../../how-tos#frontend-generative-ui)

- [Human-in-the-loop](../../../how-tos#human-in-the-loop_1)

- [Double-texting](../../../how-tos#double-texting)

- [Webhooks](../webhooks/)

- [Cron Jobs](../cron_jobs/)

- [Modifying the API](../../../how-tos#modifying-the-api)

- [LangGraph Studio](../../../how-tos#langgraph-studio)

- [Concepts](../../../concepts/)

- [Tutorials](../../../tutorials/)

- Resources

- [Agents](../../../agents/overview/)

- [API reference](../../../reference/)

- [Versions](../../../versions/)

- [Use an assistant](#use-an-assistant)

- [Create a new version for your assistant](#create-a-new-version-for-your-assistant)

- [Use a previous assistant version](#use-a-previous-assistant-version)

[Manage assistants¶](#manage-assistants)

In this guide we will show how to create, configure, and manage an [assistant](../../../concepts/assistants/).

First, as a brief refresher on the concept of runtime context, consider the following simple `call_model` node and context schema. Observe that this node tries to read and use the `model_provider` as defined by the `Runtime` object's `context` property.

PythonJavascript

```
@dataclass
class ContextSchema:
    llm_provider: str = "anthropic"

builder = StateGraph(AgentState, context_schema=ContextSchema)

def call_model(state, runtime: Runtime[ContextSchema]):
    messages = state["messages"]
    model = _get_model(runtime.context.llm_provider)
    response = model.invoke(messages)
    # We return a list, because this will get added to the existing list
    return {"messages": [response]}

```

```
import { Annotation } from "@langchain/langgraph";

const ConfigSchema = Annotation.Root({
    model_name: Annotation<string>,
    system_prompt:
});

const builder = new StateGraph(AgentState, ConfigSchema)

function callModel(state: State, config: RunnableConfig) {
  const messages = state.messages;
  const modelName = config.configurable?.model_name ?? "anthropic";
  const model = _getModel(modelName);
  const response = model.invoke(messages);
  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

```

:::python For more information on runtime context, [see here](../../../concepts/low_level/#runtime-context). :::

## Create an assistant[¶](#create-an-assistant)

### LangGraph SDK[¶](#langgraph-sdk)

To create an assistant, use the [LangGraph SDK](../../../concepts/sdk/) `create` method. See the [Python](https://langchain-ai.github.io/langgraph/cloud/reference/sdk/python_sdk_ref/#langgraph_sdk.client.AssistantsClient.create) and [JS](https://langchain-ai.github.io/langgraph/cloud/reference/sdk/js_ts_sdk_ref/#create) SDK reference docs for more information.

This example uses the same configuration schema as above, and creates an assistant with `model_name` set to `openai`.

PythonJavascriptCURL

```
from langgraph_sdk import get_client

client = get_client(url=<DEPLOYMENT_URL>)
openai_assistant = await client.assistants.create(
    # "agent" is the name of a graph we deployed
    "agent", config={"configurable": {"model_name": "openai"}}, name="Open AI Assistant"
)

print(openai_assistant)

```

```
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({ apiUrl: <DEPLOYMENT_URL> });
const openAIAssistant = await client.assistants.create({
    graphId: 'agent',
    name: "Open AI Assistant",
    config: { "configurable": { "model_name": "openai" } },
});

console.log(openAIAssistant);

```

```
curl --request POST \
    --url <DEPLOYMENT_URL>/assistants \
    --header 'Content-Type: application/json' \
    --data '{"graph_id":"agent", "config":{"configurable":{"model_name":"openai"}}, "name": "Open AI Assistant"}'

```

Output:

```
{
    "assistant_id": "62e209ca-9154-432a-b9e9-2d75c7a9219b",
    "graph_id": "agent",
    "name": "Open AI Assistant"
    "config": {
        "configurable": {
            "model_name": "openai"
        }
    },
    "metadata": {}
    "created_at": "2024-08-31T03:09:10.230718+00:00",
    "updated_at": "2024-08-31T03:09:10.230718+00:00",
}

```

### LangGraph Platform UI[¶](#langgraph-platform-ui)

You can also create assistants from the LangGraph Platform UI.

Inside your deployment, select the "Assistants" tab. This will load a table of all of the assistants in your deployment, across all graphs.

To create a new assistant, select the "+ New assistant" button. This will open a form where you can specify the graph this assistant is for, as well as provide a name, description, and the desired configuration for the assistant based on the configuration schema for that graph.

To confirm, click "Create assistant". This will take you to [LangGraph Studio](../../../concepts/langgraph_studio/) where you can test the assistant. If you go back to the "Assistants" tab in the deployment, you will see the newly created assistant in the table.

## Use an assistant[¶](#use-an-assistant)

### LangGraph SDK[¶](#langgraph-sdk_1)

We have now created an assistant called "Open AI Assistant" that has `model_name` defined as `openai`. We can now use this assistant with this configuration:

PythonJavascriptCURL

```
thread = await client.threads.create()
input = {"messages": [{"role": "user", "content": "who made you?"}]}
async for event in client.runs.stream(
    thread["thread_id"],
    # this is where we specify the assistant id to use
    openai_assistant["assistant_id"],
    input=input,
    stream_mode="updates",
):
    print(f"Receiving event of type: {event.event}")
    print(event.data)
    print("\n\n")

```

```
const thread = await client.threads.create();
const input = { "messages": [{ "role": "user", "content": "who made you?" }] };

const streamResponse = client.runs.stream(
  thread["thread_id"],
  // this is where we specify the assistant id to use
  openAIAssistant["assistant_id"],
  {
    input,
    streamMode: "updates"
  }
);

for await (const event of streamResponse) {
  console.log(`Receiving event of type: ${event.event}`);
  console.log(event.data);
  console.log("\n\n");
}

```

```
thread_id=$(curl --request POST \
    --url <DEPLOYMENT_URL>/threads \
    --header 'Content-Type: application/json' \
    --data '{}' | jq -r '.thread_id') && \
curl --request POST \
    --url "<DEPLOYMENT_URL>/threads/${thread_id}/runs/stream" \
    --header 'Content-Type: application/json' \
    --data '{
        "assistant_id": <OPENAI_ASSISTANT_ID>,
        "input": {
            "messages": [
                {
                    "role": "user",
                    "content": "who made you?"
                }
            ]
        },
        "stream_mode": [
            "updates"
        ]
    }' | \
    sed 's/\r$//' | \
    awk '
    /^event:/ {
        if (data_content != "") {
            print data_content "\n"
        }
        sub(/^event: /, "Receiving event of type: ", $0)
        printf "%s...\n", $0
        data_content = ""
    }
    /^data:/ {
        sub(/^data: /, "", $0)
        data_content = $0
    }
    END {
        if (data_content != "") {
            print data_content "\n\n"
        }
    }
'

```

Output:

```
```
Receiving event of type: metadata
{'run_id': '1ef6746e-5893-67b1-978a-0f1cd4060e16'}

Receiving event of type: updates
{'agent': {'messages': [{'content': 'I was created by OpenAI, a research organization focused on developing and advancing artificial intelligence technology.', 'additional_kwargs': {}, 'response_metadata': {'finish_reason': 'stop', 'model_name': 'gpt-4o-2024-05-13', 'system_fingerprint': 'fp_157b3831f5'}, 'type': 'ai', 'name': None, 'id': 'run-e1a6b25c-8416-41f2-9981-f9cfe043f414', 'example': False, 'tool_calls': [], 'invalid_tool_calls': [], 'usage_metadata': None}]}}
```

```

### LangGraph Platform UI[¶](#langgraph-platform-ui_1)

Inside your deployment, select the "Assistants" tab. For the assistant you would like to use, click the "Studio" button. This will open LangGraph Studio with the selected assistant. When you submit an input (either in Graph or Chat mode), the selected assistant and its configuration will be used.

## Create a new version for your assistant[¶](#create-a-new-version-for-your-assistant)

### LangGraph SDK[¶](#langgraph-sdk_2)

To edit the assistant, use the `update` method. This will create a new version of the assistant with the provided edits. See the [Python](https://langchain-ai.github.io/langgraph/cloud/reference/sdk/python_sdk_ref/#langgraph_sdk.client.AssistantsClient.update) and [JS](https://langchain-ai.github.io/langgraph/cloud/reference/sdk/js_ts_sdk_ref/#update) SDK reference docs for more information.

Note

You must pass in the ENTIRE config (and metadata if you are using it). The update endpoint creates new versions completely from scratch and does not rely on previous versions.

For example, to update your assistant's system prompt:

PythonJavascriptCURL

```
openai_assistant_v2 = await client.assistants.update(
    openai_assistant["assistant_id"],
    config={
        "configurable": {
            "model_name": "openai",
            "system_prompt": "You are an unhelpful assistant!",
        }
    },
)

```

```
const openaiAssistantV2 = await client.assistants.update(
    openai_assistant["assistant_id"],
    {
        config: {
            configurable: {
                model_name: 'openai',
                system_prompt: 'You are an unhelpful assistant!',
            },
    },
});

```

```
curl --request PATCH \
--url <DEPOLYMENT_URL>/assistants/<ASSISTANT_ID> \
--header 'Content-Type: application/json' \
--data '{
"config": {"model_name": "openai", "system_prompt": "You are an unhelpful assistant!"}
}'

```

This will create a new version of the assistant with the updated parameters and set this as the active version of your assistant. If you now run your graph and pass in this assistant id, it will use this latest version.

### LangGraph Platform UI[¶](#langgraph-platform-ui_2)

You can also edit assistants from the LangGraph Platform UI.

Inside your deployment, select the "Assistants" tab. This will load a table of all of the assistants in your deployment, across all graphs.

To edit an existing assistant, select the "Edit" button for the specified assistant. This will open a form where you can edit the assistant's name, description, and configuration.

Additionally, if using LangGraph Studio, you can edit the assistants and create new versions via the "Manage Assistants" button.

## Use a previous assistant version[¶](#use-a-previous-assistant-version)

### LangGraph SDK[¶](#langgraph-sdk_3)

You can also change the active version of your assistant. To do so, use the `setLatest` method.

In the example above, to rollback to the first version of the assistant:

PythonJavascriptCURL

```
await client.assistants.set_latest(openai_assistant['assistant_id'], 1)

```

```
await client.assistants.setLatest(openaiAssistant['assistant_id'], 1);

```

```
curl --request POST \
--url <DEPLOYMENT_URL>/assistants/<ASSISTANT_ID>/latest \
--header 'Content-Type: application/json' \
--data '{
"version": 1
}'

```

If you now run your graph and pass in this assistant id, it will use the first version of the assistant.

### LangGraph Platform UI[¶](#langgraph-platform-ui_3)

If using LangGraph Studio, to set the active version of your assistant, click the "Manage Assistants" button and locate the assistant you would like to use. Select the assistant and the version, and then click the "Active" toggle. This will update the assistant to make the selected version active.

Deleting Assistants

Deleting as assistant will delete ALL of its versions. There is currently no way to delete a single version, but by pointing your assistant to the correct version you can skip any versions that you don't wish to use.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)