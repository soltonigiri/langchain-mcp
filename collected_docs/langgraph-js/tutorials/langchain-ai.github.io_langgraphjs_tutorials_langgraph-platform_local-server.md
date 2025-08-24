- Local Deploy **[Skip to content](#quickstart-launch-local-langgraph-server) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) [Template Applications](../../../concepts/template_applications/) [Cloud Deploy](../../../cloud/quick_start/) Guides Resources [Agents](../../../agents/overview/) [API reference](../../../reference/) [Versions](../../../versions/) [Quickstart: Launch Local LangGraph Server¶](#quickstart-launch-local-langgraph-server) This is a quick start guide to help you get a LangGraph app up and running locally. Install the LangGraph CLI[¶](#install-the-langgraph-cli)

```
$ npx @langchain/langgraph-cli@latest

# Or install globally, will be available as `langgraphjs`
$ npm install -g @langchain/langgraph-cli

``` 🌱 Create a LangGraph App[¶](#create-a-langgraph-app) Create a new app and follow the instructions, selecting ReAct Agent as the template. This template is a simple agent that can be flexibly extended to many tools.

```
$ npm create langgraph

``` Install Dependencies[¶](#install-dependencies) In the root of your new LangGraph app, install the dependencies in edit mode so your local changes are used by the server:

```
$ yarn

``` Create a .env file[¶](#create-a-env-file) You will find a .env.example in the root of your new LangGraph app. Create a .env file in the root of your new LangGraph app and copy the contents of the .env.example file into it, filling in the necessary API keys:

```
LANGSMITH_API_KEY=lsv2...
TAVILY_API_KEY=tvly-...
ANTHROPIC_API_KEY=sk-
OPENAI_API_KEY=sk-...

``` Get API Keys LANGSMITH_API_KEY**: Go to the [LangSmith Settings page](https://smith.langchain.com/settings). Then clck **Create API Key**.

- **ANTHROPIC_API_KEY**: Get an API key from [Anthropic](https://console.anthropic.com/).

- **OPENAI_API_KEY**: Get an API key from [OpenAI](https://openai.com/).

- **TAVILY_API_KEY**: Get an API key on the [Tavily website](https://app.tavily.com/).

## 🚀 Launch LangGraph Server[¶](#launch-langgraph-server)

```
$ npx @langchain/langgraph-cli@latest dev

```

This will start up the LangGraph API server locally. If this runs successfully, you should see something like:

**🚀 API: [http://localhost:2024](http://localhost:2024) 🎨 Studio UI: [https://smith.langchain.com/studio?baseUrl=http://localhost:2024](https://smith.langchain.com/studio?baseUrl=http://localhost:2024) In-Memory Mode The langgraphjs dev command starts LangGraph Server in an in-memory mode. This mode is suitable for development and testing purposes. For production use, you should deploy LangGraph Cloud with access to a persistent storage backend. If you want to test your application with a persistent storage backend, you can use the langgraphjs up command instead of langgraphjs dev. You will need to have docker installed on your machine to use this command. LangGraph Studio Web UI[¶](#langgraph-studio-web-ui) LangGraph Studio Web is a specialized UI that you can connect to LangGraph API server to enable visualization, interaction, and debugging of your application locally. Test your graph in the LangGraph Studio Web UI by visiting the URL provided in the output of the langgraph dev command. LangGraph Studio Web UI: [https://smith.langchain.com/studio/?baseUrl=http://localhost:2024](https://smith.langchain.com/studio/?baseUrl=http://localhost:2024) Connecting to a server with a custom host/port If you are running the LangGraph API server with a custom host / port, you can point the Studio Web UI at it by changing the baseUrl URL param. For example, if you are running your server on port 8000, you can change the above URL to the following:

```
https://smith.langchain.com/studio/baseUrl=http://localhost:8000

``` Safari Compatibility Currently, LangGraph Studio Web does not support Safari when running a server locally. Test the API[¶](#test-the-api) Python SDK (Async)Python SDK (Sync)Javascript SDKRest API Install the LangGraph Python SDK**

```
$ pip install langgraph-sdk

```

**Send a message to the assistant (threadless run)**

```
from langgraph_sdk import get_client

client = get_client(url="http://localhost:2024")

async for chunk in client.runs.stream(
    None,  # Threadless run
    "agent", # Name of assistant. Defined in langgraph.json.
    input={
        "messages": [{
            "role": "human",
            "content": "What is LangGraph?",
        }],
    },
    stream_mode="updates",
):
    print(f"Receiving new event of type: {chunk.event}...")
    print(chunk.data)
    print("\n\n")

```

**Install the LangGraph Python SDK**

```
$ pip install langgraph-sdk

```

**Send a message to the assistant (threadless run)**

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
    stream_mode="updates",
):
    print(f"Receiving new event of type: {chunk.event}...")
    print(chunk.data)
    print("\n\n")

```

**Install the LangGraph JS SDK**

```
$ yarn add @langchain/langgraph-sdk

```

**Send a message to the assistant (threadless run)**

```
const { Client } = await import("@langchain/langgraph-sdk");

// only set the apiUrl if you changed the default port when calling langgraph dev
const client = new Client({ apiUrl: "http://localhost:2024"});

const streamResponse = client.runs.stream(
    null, // Threadless run
    "agent", // Assistant ID
    {
        input: {
            "messages": [
                { "role": "user", "content": "What is LangGraph?"}
            ]
        },
        streamMode: "messages",
    }
);

for await (const chunk of streamResponse) {
    console.log(`Receiving new event of type: ${chunk.event}...`);
    console.log(JSON.stringify(chunk.data));
    console.log("\n\n");
}

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
        \"stream_mode\": \"updates\"
    }"

```

Auth

If you're connecting to a remote server, you will need to provide a LangSmith API Key for authorization. Please see the API Reference for the clients for more information.

## Next Steps[¶](#next-steps)

Now that you have a LangGraph app running locally, take your journey further by exploring deployment and advanced features:

### 🌐 Deploy to LangGraph Cloud[¶](#deploy-to-langgraph-cloud)

- **[LangGraph Cloud Quickstart](../../../cloud/quick_start/)**: Deploy your LangGraph app using LangGraph Cloud.

### 📚 Learn More about LangGraph Platform[¶](#learn-more-about-langgraph-platform)

Expand your knowledge with these resources:

- **[LangGraph Platform Concepts](../../../concepts/#langgraph-platform)**: Understand the foundational concepts of the LangGraph Platform.

- **[LangGraph Platform How-to Guides](../../../how-tos/#langgraph-platform)**: Discover step-by-step guides to build and deploy applications.

### 🛠️ Developer References[¶](#developer-references)

Access detailed documentation for development and API usage:

- **[LangGraph Server API Reference](../../cloud/reference/api/api_ref.html)**: Explore the LangGraph Server API documentation.

- **[Python SDK Reference](../../../cloud/reference/sdk/python_sdk_ref/)**: Explore the Python SDK API Reference.

- **[JS/TS SDK Reference](../../../cloud/reference/sdk/js_ts_sdk_ref/)**: Explore the JS/TS SDK API Reference.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)