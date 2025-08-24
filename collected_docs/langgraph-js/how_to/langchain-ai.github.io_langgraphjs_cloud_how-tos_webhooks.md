- Use webhooks **[Skip to content](#use-webhooks) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [Cron Jobs](../cron_jobs/) [Modifying the API](../../../how-tos#modifying-the-api) [LangGraph Studio](../../../how-tos#langgraph-studio) [Concepts](../../../concepts/) [Tutorials](../../../tutorials/) Resources [Agents](../../../agents/overview/) [API reference](../../../reference/) [Versions](../../../versions/) [Use webhooks¶](#use-webhooks) When working with LangGraph Platform, you may want to use webhooks to receive updates after an API call completes. Webhooks are useful for triggering actions in your service once a run has finished processing. To implement this, you need to expose an endpoint that can accept POST requests and pass this endpoint as a webhook parameter in your API request. Currently, the SDK does not provide built-in support for defining webhook endpoints, but you can specify them manually using API requests. Supported endpoints[¶](#supported-endpoints) The following API endpoints accept a webhook parameter: Operation HTTP Method Endpoint Create Run POST /thread/{thread_id}/runs Create Thread Cron POST /thread/{thread_id}/runs/crons Stream Run POST /thread/{thread_id}/runs/stream Wait Run POST /thread/{thread_id}/runs/wait Create Cron POST /runs/crons Stream Run Stateless POST /runs/stream Wait Run Stateless POST /runs/wait In this guide, we’ll show how to trigger a webhook after streaming a run. Set up your assistant and thread[¶](#set-up-your-assistant-and-thread) Before making API calls, set up your assistant and thread. PythonJavaScriptCURL

```
from langgraph_sdk import get_client

client = get_client(url=<DEPLOYMENT_URL>)
assistant_id = "agent"
thread = await client.threads.create()
print(thread)

```

```
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({ apiUrl: <DEPLOYMENT_URL> });
const assistantID = "agent";
const thread = await client.threads.create();
console.log(thread);

```

```
curl --request POST \
    --url <DEPLOYMENT_URL>/assistants/search \
    --header 'Content-Type: application/json' \
    --data '{ "limit": 10, "offset": 0 }' | jq -c 'map(select(.config == null or .config == {})) | .[0]' && \
curl --request POST \
    --url <DEPLOYMENT_URL>/threads \
    --header 'Content-Type: application/json' \
    --data '{}'

``` Example response:

```
{
    "thread_id": "9dde5490-2b67-47c8-aa14-4bfec88af217",
    "created_at": "2024-08-30T23:07:38.242730+00:00",
    "updated_at": "2024-08-30T23:07:38.242730+00:00",
    "metadata": {},
    "status": "idle",
    "config": {},
    "values": null
}

``` Use a webhook with a graph run[¶](#use-a-webhook-with-a-graph-run) To use a webhook, specify the webhook parameter in your API request. When the run completes, LangGraph Platform sends a POST request to the specified webhook URL. For example, if your server listens for webhook events at https://my-server.app/my-webhook-endpoint, include this in your request: PythonJavaScriptCURL

```
input = { "messages": [{ "role": "user", "content": "Hello!" }] }

async for chunk in client.runs.stream(
    thread_id=thread["thread_id"],
    assistant_id=assistant_id,
    input=input,
    stream_mode="events",
    webhook="https://my-server.app/my-webhook-endpoint"
):
    pass

```

```
const input = { messages: [{ role: "human", content: "Hello!" }] };

const streamResponse = client.runs.stream(
  thread["thread_id"],
  assistantID,
  {
    input: input,
    webhook: "https://my-server.app/my-webhook-endpoint"
  }
);

for await (const chunk of streamResponse) {
  // Handle stream output
}

```

```
curl --request POST \
    --url <DEPLOYMENT_URL>/threads/<THREAD_ID>/runs/stream \
    --header 'Content-Type: application/json' \
    --data '{
        "assistant_id": <ASSISTANT_ID>,
        "input": {"messages": [{"role": "user", "content": "Hello!"}]},
        "webhook": "https://my-server.app/my-webhook-endpoint"
    }'

``` Webhook payload[¶](#webhook-payload) LangGraph Platform sends webhook notifications in the format of a [Run](../../../concepts/assistants/#execution). See the [API Reference](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref.html#model/run) for details. The request payload includes run input, configuration, and other metadata in the kwargs field. Secure webhooks[¶](#secure-webhooks) To ensure only authorized requests hit your webhook endpoint, consider adding a security token as a query parameter:

```
https://my-server.app/my-webhook-endpoint?token=YOUR_SECRET_TOKEN

``` Your server should extract and validate this token before processing requests. Disable webhooks[¶](#disable-webhooks) As of langgraph-api>=0.2.78, developers can disable webhooks in the langgraph.json file:

```
{
  "http": {
    "disable_webhooks": true
  }
}

``` This feature is primarily intended for self-hosted deployments, where platform administrators or developers may prefer to disable webhooks to simplify their security posture—especially if they are not configuring firewall rules or other network controls. Disabling webhooks helps prevent untrusted payloads from being sent to internal endpoints. For full configuration details, refer to the [configuration file reference](https://langchain-ai.github.io/langgraph/cloud/reference/cli/?h=disable_webhooks#configuration-file). Test webhooks[¶](#test-webhooks) You can test your webhook using online services like: [Beeceptor](https://beeceptor.com/)** – Quickly create a test endpoint and inspect incoming webhook payloads.

- **[Webhook.site](https://webhook.site/)** – View, debug, and log incoming webhook requests in real time.

These tools help you verify that LangGraph Platform is correctly triggering and sending webhooks to your service.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)