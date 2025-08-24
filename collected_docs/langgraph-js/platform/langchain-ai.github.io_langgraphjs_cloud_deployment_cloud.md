- How to Deploy to Cloud SaaS **[Skip to content](#how-to-deploy-to-cloud-saas) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [How to do a Self-hosted deployment of LangGraph](../../../how-tos/deploy-self-hosted/) [How to interact with the deployment using RemoteGraph](../../../how-tos/use-remote-graph/) [Authentication & Access Control](../../../how-tos#authentication-access-control) [Assistants](../../../how-tos#assistants) [Threads](../../../how-tos#threads) [Runs](../../../how-tos#runs) [Streaming](../../../how-tos#streaming_1) [Frontend & Generative UI](../../../how-tos#frontend-generative-ui) [Human-in-the-loop](../../../how-tos#human-in-the-loop_1) [Double-texting](../../../how-tos#double-texting) [Webhooks](../../how-tos/webhooks/) [Cron Jobs](../../how-tos/cron_jobs/) [Modifying the API](../../../how-tos#modifying-the-api) [LangGraph Studio](../../../how-tos#langgraph-studio) [Concepts](../../../concepts/) [Tutorials](../../../tutorials/) Resources [Agents](../../../agents/overview/) [API reference](../../../reference/) [Versions](../../../versions/) [How to Deploy to Cloud SaaS¶](#how-to-deploy-to-cloud-saas) Before deploying, review the [conceptual guide for the Cloud SaaS](../../../concepts/langgraph_cloud/) deployment option. Prerequisites[¶](#prerequisites) LangGraph Platform applications are deployed from GitHub repositories. Configure and upload a LangGraph Platform application to a GitHub repository in order to deploy it to LangGraph Platform. [Verify that the LangGraph API runs locally](../../../tutorials/langgraph-platform/local-server/). If the API does not run successfully (i.e. langgraph dev), deploying to LangGraph Platform will fail as well. Create New Deployment[¶](#create-new-deployment) Starting from the [LangSmith UI](https://smith.langchain.com/)... In the left-hand navigation panel, select LangGraph Platform. The LangGraph Platform view contains a list of existing LangGraph Platform deployments. In the top-right corner, select + New Deployment to create a new deployment. In the Create New Deployment panel, fill out the required fields. Deployment details Select Import from GitHub and follow the GitHub OAuth workflow to install and authorize LangChain's hosted-langserve GitHub app to access the selected repositories. After installation is complete, return to the Create New Deployment panel and select the GitHub repository to deploy from the dropdown menu. Note**: The GitHub user installing LangChain's hosted-langserve GitHub app must be an [owner](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization#organization-owners) of the organization or account.

- Specify a name for the deployment.

- Specify the desired Git Branch. A deployment is linked to a branch. When a new revision is created, code for the linked branch will be deployed. The branch can be updated later in the [Deployment Settings](#deployment-settings).

- Specify the full path to the [LangGraph API config file](../../reference/cli/#configuration-file) including the file name. For example, if the file langgraph.json is in the root of the repository, simply specify langgraph.json.

- Check/uncheck checkbox to Automatically update deployment on push to branch. If checked, the deployment will automatically be updated when changes are pushed to the specified Git Branch. This setting can be enabled/disabled later in the [Deployment Settings](#deployment-settings).

- Select the desired Deployment Type. Development deployments are meant for non-production use cases and are provisioned with minimal resources.

- Production deployments can serve up to 500 requests/second and are provisioned with highly available storage with automatic backups.

- Determine if the deployment should be Shareable through LangGraph Studio. If unchecked, the deployment will only be accessible with a valid LangSmith API key for the workspace.

- If checked, the deployment will be accessible through LangGraph Studio to any LangSmith user. A direct URL to LangGraph Studio for the deployment will be provided to share with other LangSmith users.

- Specify Environment Variables and secrets. See the [Environment Variables reference](../../reference/env_var/) to configure additional variables for the deployment. Sensitive values such as API keys (e.g. OPENAI_API_KEY) should be specified as secrets.

- Additional non-secret environment variables can be specified as well.

- A new LangSmith Tracing Project is automatically created with the same name as the deployment.

- In the top-right corner, select Submit. After a few seconds, the Deployment view appears and the new deployment will be queued for provisioning.

## Create New Revision[¶](#create-new-revision)

When [creating a new deployment](#create-new-deployment), a new revision is created by default. Subsequent revisions can be created to deploy new code changes.

Starting from the [LangSmith UI](https://smith.langchain.com/)...

- In the left-hand navigation panel, select LangGraph Platform. The LangGraph Platform view contains a list of existing LangGraph Platform deployments.

- Select an existing deployment to create a new revision for.

- In the Deployment view, in the top-right corner, select + New Revision.

- In the New Revision modal, fill out the required fields. Specify the full path to the [LangGraph API config file](../../reference/cli/#configuration-file) including the file name. For example, if the file langgraph.json is in the root of the repository, simply specify langgraph.json.

- Determine if the deployment should be Shareable through LangGraph Studio. If unchecked, the deployment will only be accessible with a valid LangSmith API key for the workspace.

- If checked, the deployment will be accessible through LangGraph Studio to any LangSmith user. A direct URL to LangGraph Studio for the deployment will be provided to share with other LangSmith users.

- Specify Environment Variables and secrets. Existing secrets and environment variables are prepopulated. See the [Environment Variables reference](../../reference/env_var/) to configure additional variables for the revision. Add new secrets or environment variables.

- Remove existing secrets or environment variables.

- Update the value of existing secrets or environment variables.

- Select Submit. After a few seconds, the New Revision modal will close and the new revision will be queued for deployment.

## View Build and Server Logs[¶](#view-build-and-server-logs)

Build and server logs are available for each revision.

Starting from the `LangGraph Platform` view...

- Select the desired revision from the Revisions table. A panel slides open from the right-hand side and the Build tab is selected by default, which displays build logs for the revision.

- In the panel, select the Server tab to view server logs for the revision. Server logs are only available after a revision has been deployed.

- Within the Server tab, adjust the date/time range picker as needed. By default, the date/time range picker is set to the Last 7 days.

## View Deployment Metrics[¶](#view-deployment-metrics)

Starting from the [LangSmith UI](https://smith.langchain.com/)...

- In the left-hand navigation panel, select LangGraph Platform. The LangGraph Platform view contains a list of existing LangGraph Platform deployments.

- Select an existing deployment to monitor.

- Select the Monitoring tab to view the deployment metrics. See a list of [all available metrics](../../concepts/langgraph_control_plane.md#monitoring).

- Within the Monitoring tab, use the date/time range picker as needed. By default, the date/time range picker is set to the Last 15 minutes.

## Interrupt Revision[¶](#interrupt-revision)

Interrupting a revision will stop deployment of the revision.

Undefined Behavior

Interrupted revisions have undefined behavior. This is only useful if you need to deploy a new revision and you already have a revision "stuck" in progress. In the future, this feature may be removed.

Starting from the `LangGraph Platform` view...

- Select the menu icon (three dots) on the right-hand side of the row for the desired revision from the Revisions table.

- Select Interrupt from the menu.

- A modal will appear. Review the confirmation message. Select Interrupt revision.

## Delete Deployment[¶](#delete-deployment)

Starting from the [LangSmith UI](https://smith.langchain.com/)...

- In the left-hand navigation panel, select LangGraph Platform. The LangGraph Platform view contains a list of existing LangGraph Platform deployments.

- Select the menu icon (three dots) on the right-hand side of the row for the desired deployment and select Delete.

- A Confirmation modal will appear. Select Delete.

## Deployment Settings[¶](#deployment-settings)

Starting from the `LangGraph Platform` view...

- In the top-right corner, select the gear icon (Deployment Settings).

- Update the Git Branch to the desired branch.

- Check/uncheck checkbox to Automatically update deployment on push to branch. Branch creation/deletion and tag creation/deletion events will not trigger an update. Only pushes to an existing branch will trigger an update.

- Pushes in quick succession to a branch will not trigger subsequent updates. In the future, this functionality may be changed/improved.

## Add or Remove GitHub Repositories[¶](#add-or-remove-github-repositories)

After installing and authorizing LangChain's `hosted-langserve` GitHub app, repository access for the app can be modified to add new repositories or remove existing repositories. If a new repository is created, it may need to be added explicitly.

- From the GitHub profile, navigate to Settings > Applications > hosted-langserve > click Configure.

- Under Repository access, select All repositories or Only select repositories. If Only select repositories is selected, new repositories must be explicitly added.

- Click Save.

- When creating a new deployment, the list of GitHub repositories in the dropdown menu will be updated to reflect the repository access changes.

## Whitelisting IP Addresses[¶](#whitelisting-ip-addresses)

All traffic from `LangGraph Platform` deployments created after January 6th 2025 will come through a NAT gateway. This NAT gateway will have several static ip addresses depending on the region you are deploying in. Refer to the table below for the list of IP addresses to whitelist:

| US | EU |

| 35.197.29.146 | 34.90.213.236 |

| 34.145.102.123 | 34.13.244.114 |

| 34.169.45.153 | 34.32.180.189 |

| 34.82.222.17 | 34.34.69.108 |

| 35.227.171.135 | 34.32.145.240 |

| 34.169.88.30 | 34.90.157.44 |

| 34.19.93.202 | 34.141.242.180 |

| 34.19.34.50 | 34.32.141.108 |

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)