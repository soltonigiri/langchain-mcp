- Deployment Options **[Skip to content](#deployment-options) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [LangGraph Platform Plans](../plans/) [Template Applications](../template_applications/) [Components](../../concepts#components) [LangGraph Server](../../concepts#langgraph-server) [Deployment Options](../../concepts#deployment-options) [Tutorials](../../tutorials/) Resources [Agents](../../agents/overview/) [API reference](../../reference/) [Versions](../../versions/) [Deployment Options¶](#deployment-options) Prerequisites [LangGraph Platform](../langgraph_platform/) [LangGraph Server](../langgraph_server/) [LangGraph Platform Plans](../plans/) Overview[¶](#overview) There are 4 main options for deploying with the LangGraph Platform: [Self-Hosted Lite](#self-hosted-lite)**: Available for all plans.

- **[Self-Hosted Enterprise](#self-hosted-enterprise)**: Available for the **Enterprise** plan.

- **[Cloud SaaS](#cloud-saas)**: Available for **Plus** and **Enterprise** plans.

- **[Bring Your Own Cloud](#bring-your-own-cloud)**: Available only for **Enterprise** plans and **only on AWS**.

Please see the [LangGraph Platform Plans](../plans/) for more information on the different plans.

The guide below will explain the differences between the deployment options.

## Self-Hosted Enterprise[¶](#self-hosted-enterprise)

Important

The Self-Hosted Enterprise version is only available for the **Enterprise** plan.

With a Self-Hosted Enterprise deployment, you are responsible for managing the infrastructure, including setting up and maintaining required databases and Redis instances.

You’ll build a Docker image using the [LangGraph CLI](../langgraph_cli/), which can then be deployed on your own infrastructure.

For more information, please see:

- [Self-Hosted conceptual guide](../self_hosted/)

- [Self-Hosted Deployment how-to guide](../../how-tos/deploy-self-hosted/)

## Self-Hosted Lite[¶](#self-hosted-lite)

Important

The Self-Hosted Lite version is available for all plans.

The Self-Hosted Lite deployment option is a free (up to 1 million nodes executed), limited version of LangGraph Platform that you can run locally or in a self-hosted manner.

With a Self-Hosted Lite deployment, you are responsible for managing the infrastructure, including setting up and maintaining required databases and Redis instances.

You’ll build a Docker image using the [LangGraph CLI](../langgraph_cli/), which can then be deployed on your own infrastructure.

For more information, please see:

- [Self-Hosted conceptual guide](../self_hosted/)

- [Self-Hosted Deployment how-to guide](https://langchain-ai.github.io/langgraphjs/how-tos/deploy-self-hosted/)

## Cloud SaaS[¶](#cloud-saas)

Important

The Cloud SaaS version of LangGraph Platform is only available for **Plus** and **Enterprise** plans.

The [Cloud SaaS](../langgraph_cloud/) version of LangGraph Platform is hosted as part of [LangSmith](https://smith.langchain.com/).

The Cloud SaaS version of LangGraph Platform provides a simple way to deploy and manage your LangGraph applications.

This deployment option provides an integration with GitHub, allowing you to deploy code from any of your repositories on GitHub.

For more information, please see:

- [Cloud SaaS Conceptual Guide](../langgraph_cloud/)

- [How to deploy to Cloud SaaS](/langgraphjs/cloud/deployment/cloud.md)

## Bring Your Own Cloud[¶](#bring-your-own-cloud)

Important

The Bring Your Own Cloud version of LangGraph Platform is only available for **Enterprise** plans.

This combines the best of both worlds for Cloud and Self-Hosted. We manage the infrastructure, so you don't have to, but the infrastructure all runs within your cloud. This is currently only available on AWS.

For more information please see:

- [Bring Your Own Cloud Conceptual Guide](../bring_your_own_cloud/)

## Related[¶](#related)

For more information please see:

- [LangGraph Platform Plans](../plans/)

- [LangGraph Platform Pricing](https://www.langchain.com/langgraph-platform-pricing)

- [Deployment how-to guides](../../how-tos/#deployment)

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)