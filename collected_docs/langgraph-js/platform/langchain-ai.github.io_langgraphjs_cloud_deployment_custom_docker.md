- How to customize Dockerfile [Skip to content](#how-to-customize-dockerfile) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [Deployment](../../../how-tos#deployment)

- [Authentication & Access Control](../../../how-tos#authentication-access-control)

- [Assistants](../../../how-tos#assistants)

- [Threads](../../../how-tos#threads)

- [Runs](../../../how-tos#runs)

- [Streaming](../../../how-tos#streaming_1)

- [Frontend & Generative UI](../../../how-tos#frontend-generative-ui)

- [Human-in-the-loop](../../../how-tos#human-in-the-loop_1)

- [Double-texting](../../../how-tos#double-texting)

- [Webhooks](../../how-tos/webhooks/)

- [Cron Jobs](../../how-tos/cron_jobs/)

- [Modifying the API](../../../how-tos#modifying-the-api)

- [LangGraph Studio](../../../how-tos#langgraph-studio)

- [Concepts](../../../concepts/)

- [Tutorials](../../../tutorials/)

- Resources

- [Agents](../../../agents/overview/)

- [API reference](../../../reference/)

- [Versions](../../../versions/)

[How to customize Dockerfile¶](#how-to-customize-dockerfile)

Users can add an array of additional lines to add to the Dockerfile following the import from the parent LangGraph image. In order to do this, you simply need to modify your `langgraph.json` file by passing in the commands you want run to the `dockerfile_lines` key. For example, if we wanted to use `Pillow` in our graph you would need to add the following dependencies:

```
{
    "dependencies": ["."],
    "graphs": {
        "openai_agent": "./openai_agent.py:agent",
    },
    "env": "./.env",
    "dockerfile_lines": [
        "RUN apt-get update && apt-get install -y libjpeg-dev zlib1g-dev libpng-dev",
        "RUN pip install Pillow"
    ]
}

```

This would install the system packages required to use Pillow if we were working with `jpeg` or `png` image formats.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)