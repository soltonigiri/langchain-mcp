- Cloud Deploy **[Skip to content](#deployment-quickstart) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [Chatbots](../../tutorials/chatbots/customer_support_small_model/) [RAG](../../tutorials#rag) [Agent Architectures](../../tutorials#agent-architectures) [Evaluation & Analysis](../../tutorials#evaluation) Resources [Agents](../../agents/overview/) [API reference](../../reference/) [Versions](../../versions/) [Deployment quickstart¶](#deployment-quickstart) This guide shows you how to set up and use LangGraph Platform for a cloud deployment. Prerequisites[¶](#prerequisites) Before you begin, ensure you have the following: A [GitHub account](https://github.com/) A [LangSmith account](https://smith.langchain.com/) – free to sign up 1. Create a repository on GitHub[¶](#1-create-a-repository-on-github) To deploy an application to LangGraph Platform**, your application code must reside in a GitHub repository. Both public and private repositories are supported. For this quickstart, use the [new-langgraph-project template](https://github.com/langchain-ai/react-agent) for your application: Go to the [new-langgraph-project repository](https://github.com/langchain-ai/new-langgraph-project) or [new-langgraphjs-project template](https://github.com/langchain-ai/new-langgraphjs-project).

- Click the Fork button in the top right corner to fork the repository to your GitHub account.

- Click **Create fork**.

## 2. Deploy to LangGraph Platform[¶](#2-deploy-to-langgraph-platform)

- Log in to [LangSmith](https://smith.langchain.com/).

- In the left sidebar, select **Deployments**.

- Click the **+ New Deployment** button. A pane will open where you can fill in the required fields.

- If you are a first time user or adding a private repository that has not been previously connected, click the **Import from GitHub** button and follow the instructions to connect your GitHub account.

- Select your New LangGraph Project repository.

- Click **Submit** to deploy. This may take about 15 minutes to complete. You can check the status in the **Deployment details** view.

## 3. Test your application in LangGraph Studio[¶](#3-test-your-application-in-langgraph-studio)

Once your application is deployed:

- Select the deployment you just created to view more details.

- Click the **LangGraph Studio** button in the top right corner. LangGraph Studio will open to display your graph. [![image ](../deployment/img/langgraph_studio.png)](../deployment/img/langgraph_studio.png) Sample graph run in LangGraph Studio.

## 4. Get the API URL for your deployment[¶](#4-get-the-api-url-for-your-deployment)

- In the **Deployment details** view in LangGraph, click the **API URL** to copy it to your clipboard.

- Click the URL to copy it to the clipboard.

## 5. Test the API[¶](#5-test-the-api)

You can now test the API:

Python SDK (Async)Python SDK (Sync)JavaScript SDKRest API

- Install the LangGraph Python SDK:

```
pip install langgraph-sdk

```

- Send a message to the assistant (threadless run):

```
from langgraph_sdk import get_client

client = get_client(url="your-deployment-url", api_key="your-langsmith-api-key")

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

- Install the LangGraph Python SDK:

```
pip install langgraph-sdk

```

- Send a message to the assistant (threadless run):

```
from langgraph_sdk import get_sync_client

client = get_sync_client(url="your-deployment-url", api_key="your-langsmith-api-key")

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

- Install the LangGraph JS SDK

```
npm install @langchain/langgraph-sdk

```

- Send a message to the assistant (threadless run):

```
const { Client } = await import("@langchain/langgraph-sdk");

const client = new Client({ apiUrl: "your-deployment-url", apiKey: "your-langsmith-api-key" });

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
    --url <DEPLOYMENT_URL>/runs/stream \
    --header 'Content-Type: application/json' \
    --header "X-Api-Key: <LANGSMITH API KEY> \
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

## Next steps[¶](#next-steps)

Congratulations! You have deployed an application using LangGraph Platform.

Here are some other resources to check out:

- [LangGraph Platform overview](../../concepts/langgraph_platform/)

- [Deployment options](../../concepts/deployment_options/)

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)