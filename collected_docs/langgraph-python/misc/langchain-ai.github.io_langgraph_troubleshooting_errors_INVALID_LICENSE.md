- INVALID_LICENSE [Skip to content](#invalid_license) Initializing search [GitHub](https://github.com/langchain-ai/langgraph)

- [Confirm credentials](#confirm-credentials)

- [Confirm credentials](#confirm-credentials)

[](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/troubleshooting/errors/INVALID_LICENSE.md)

# INVALID_LICENSE[¶](#invalid_license)

This error is raised when license verification fails while attempting to start a self-hosted LangGraph Platform server. This error is specific to the LangGraph Platform and is not related to the open source libraries.

## When This Occurs[¶](#when-this-occurs)

This error occurs when running a self-hosted deployment of LangGraph Platform without a valid enterprise license or API key.

## Troubleshooting[¶](#troubleshooting)

### Confirm deployment type[¶](#confirm-deployment-type)

First, confirm the desired mode of deployment.

#### For Local Development[¶](#for-local-development)

If you're just developing locally, you can use the lightweight in-memory server by running `langgraph dev`. See the [local server](../../../tutorials/langgraph-platform/local-server/) docs for more information.

#### For Managed LangGraph Platform[¶](#for-managed-langgraph-platform)

If you would like a fast managed environment, consider the [Cloud SaaS](../../../concepts/langgraph_cloud/) deployment option. This requires no additional license key.

#### For Standalone Container[¶](#for-standalone-container)

For self-hosting, set the `LANGGRAPH_CLOUD_LICENSE_KEY` environment variable. If you are interested in an enterprise license key, please contact the LangChain support team.

For more information on deployment options and their features, see the [Deployment Options](../../../concepts/deployment_options/) documentation.

### Confirm credentials[¶](#confirm-credentials)

If you have confirmed that you would like to self-host LangGraph Platform, please verify your credentials.

#### For Standalone Container[¶](#for-standalone-container_1)

- Confirm that you have provided a working LANGGRAPH_CLOUD_LICENSE_KEY environment variable in your deployment environment or .env file

- Confirm the key is still valid and has not surpassed its expiration date

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)