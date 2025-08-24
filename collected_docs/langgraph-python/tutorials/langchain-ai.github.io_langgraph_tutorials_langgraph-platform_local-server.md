- Run a local server [Skip to content](#run-a-local-server) Initializing search [GitHub](https://github.com/langchain-ai/langgraph)

- General concepts

- [Guides](../../../guides/)

- [Reference](../../../reference/)

- [Examples](../../../examples/)

- [Additional resources](../../../additional-resources/)

[](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/tutorials/langgraph-platform/local-server.md)

# Run a local server[¶](#run-a-local-server)

This guide shows you how to run a LangGraph application locally.

## Prerequisites[¶](#prerequisites)

Before you begin, ensure you have the following:

- An API key for [LangSmith](https://smith.langchain.com/settings) - free to sign up

## 1. Install the LangGraph CLI[¶](#1-install-the-langgraph-cli)

```
# Python >= 3.11 is required.

pip install --upgrade "langgraph-cli[inmem]"

```

## 2. Create a LangGraph app 🌱[¶](#2-create-a-langgraph-app)

Create a new app from the [new-langgraph-project-python template](https://github.com/langchain-ai/new-langgraph-project). This template demonstrates a single-node application you can extend with your own logic.

```
langgraph new path/to/your/app --template new-langgraph-project-python

```

Additional templates

If you use `langgraph new` without specifying a template, you will be presented with an interactive menu that will allow you to choose from a list of available templates.

## 3. Install dependencies[¶](#3-install-dependencies)

In the root of your new LangGraph app, install the dependencies in `edit` mode so your local changes are used by the server:

```
cd path/to/your/app
pip install -e .

```

## 4. Create a .env file[¶](#4-create-a-env-file)

You will find a `.env.example` in the root of your new LangGraph app. Create a `.env` file in the root of your new LangGraph app and copy the contents of the `.env.example` file into it, filling in the necessary API keys:

```
LANGSMITH_API_KEY=lsv2...

```

## 5. Launch LangGraph Server 🚀[¶](#5-launch-langgraph-server)

Start the LangGraph API server locally:

```
langgraph dev

```

Sample output:

```
>    Ready!
>
>    - API: [http://localhost:2024](http://localhost:2024/)
>
>    - Docs: http://localhost:2024/docs
>
>    - LangGraph Studio Web UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024

```

The `langgraph dev` command starts LangGraph Server in an in-memory mode. This mode is suitable for development and testing purposes. For production use, deploy LangGraph Server with access to a persistent storage backend. For more information, see [Deployment options](../../../concepts/deployment_options/).

## 6. Test your application in LangGraph Studio[¶](#6-test-your-application-in-langgraph-studio)

[LangGraph Studio](../../../concepts/langgraph_studio/) is a specialized UI that you can connect to LangGraph API server to visualize, interact with, and debug your application locally. Test your graph in LangGraph Studio by visiting the URL provided in the output of the `langgraph dev` command:

```
>    - LangGraph Studio Web UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024

```

For a LangGraph Server running on a custom host/port, update the baseURL parameter.

Safari compatibility

Use the `--tunnel` flag with your command to create a secure tunnel, as Safari has limitations when connecting to localhost servers:

```
langgraph dev --tunnel

```

## 7. Test the API[¶](#7-test-the-api)

Python SDK (async)Python SDK (sync)Rest API

- Install the LangGraph Python SDK:

```
pip install langgraph-sdk

```

- Send a message to the assistant (threadless run):

```
from langgraph_sdk import get_client
import asyncio

client = get_client(url="http://localhost:2024")

async def main():
    async for chunk in client.runs.stream(
        None,  # Threadless run
        "agent", # Name of assistant. Defined in langgraph.json.
        input={
        "messages": [{
            "role": "human",
            "content": "What is LangGraph?",
            }],
        },
    ):
        print(f"Receiving new event of type: {chunk.event}...")
        print(chunk.data)
        print("\n\n")

asyncio.run(main())

```

- Install the LangGraph Python SDK:

```
pip install langgraph-sdk

```

- Send a message to the assistant (threadless run):

```
from langgraph_sdk import get_sync_client

client = get_sync_client(url="http://localhost:2024")

for chunk in client.runs.stream(
    None,  # Threadless run
    "agent", # Name of assistant. Defined in langgraph.json.
    input={
        "messages": [{
            "role": "human",
            "content": "What is LangGraph?",
        }],
    },
    stream_mode="messages-tuple",
):
    print(f"Receiving new event of type: {chunk.event}...")
    print(chunk.data)
    print("\n\n")

```

```
curl -s --request POST \
    --url "http://localhost:2024/runs/stream" \
    --header 'Content-Type: application/json' \
    --data "{
        \"assistant_id\": \"agent\",
        \"input\": {
            \"messages\": [
                {
                    \"role\": \"human\",
                    \"content\": \"What is LangGraph?\"
                }
            ]
        },
        \"stream_mode\": \"messages-tuple\"
    }"

```

## Next steps[¶](#next-steps)

Now that you have a LangGraph app running locally, take your journey further by exploring deployment and advanced features:

- [Deployment quickstart](../../../cloud/quick_start/): Deploy your LangGraph app using LangGraph Platform.

- [LangGraph Platform overview](../../../concepts/langgraph_platform/): Learn about foundational LangGraph Platform concepts.

- [LangGraph Server API Reference](../../../cloud/reference/api/api_ref.html): Explore the LangGraph Server API documentation.

- [Python SDK Reference](../../../cloud/reference/sdk/python_sdk_ref/): Explore the Python SDK API Reference.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)