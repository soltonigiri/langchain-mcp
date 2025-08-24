- How to do a Self-hosted deployment of LangGraph [Skip to content](#how-to-do-a-self-hosted-deployment-of-langgraph) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [How to interact with the deployment using RemoteGraph](../use-remote-graph/)

- [Authentication & Access Control](../../how-tos#authentication-access-control)

- [Assistants](../../how-tos#assistants)

- [Threads](../../how-tos#threads)

- [Runs](../../how-tos#runs)

- [Streaming](../../how-tos#streaming_1)

- [Frontend & Generative UI](../../how-tos#frontend-generative-ui)

- [Human-in-the-loop](../../how-tos#human-in-the-loop_1)

- [Double-texting](../../how-tos#double-texting)

- [Webhooks](../../cloud/how-tos/webhooks/)

- [Cron Jobs](../../cloud/how-tos/cron_jobs/)

- [Modifying the API](../../how-tos#modifying-the-api)

- [LangGraph Studio](../../how-tos#langgraph-studio)

- [Concepts](../../concepts/)

- [Tutorials](../../tutorials/)

- Resources

- [Agents](../../agents/overview/)

- [API reference](../../reference/)

- [Versions](../../versions/)

[How to do a Self-hosted deployment of LangGraph¶](#how-to-do-a-self-hosted-deployment-of-langgraph)

Prerequisites

- [Application Structure](../../concepts/application_structure/)

- [Deployment Options](../../concepts/deployment_options/)

This how-to guide will walk you through how to create a docker image from an existing LangGraph application, so you can deploy it on your own infrastructure.

## How it works[¶](#how-it-works)

With the self-hosted deployment option, you are responsible for managing the infrastructure, including setting up and maintaining necessary databases, Redis instances, and other services.

You will need to do the following:

- Deploy Redis and Postgres instances on your own infrastructure.

- Build a docker image with the [LangGraph Sever](../../concepts/langgraph_server/) using the [LangGraph CLI](../../concepts/langgraph_cli/).

- Deploy a web server that will run the docker image and pass in the necessary environment variables.

## Environment Variables[¶](#environment-variables)

You will eventually need to pass in the following environment variables to the LangGraph Deploy server:

- REDIS_URI: Connection details to a Redis instance. Redis will be used as a pub-sub broker to enable streaming real time output from background runs.

- DATABASE_URI: Postgres connection details. Postgres will be used to store assistants, threads, runs, persist thread state and long term memory, and to manage the state of the background task queue with 'exactly once' semantics.

- LANGSMITH_API_KEY: (If using [Self-Hosted Lite]) LangSmith API key. This will be used to authenticate ONCE at server start up.

- LANGGRAPH_CLOUD_LICENSE_KEY: (If using Self-Hosted Enterprise) LangGraph Platform license key. This will be used to authenticate ONCE at server start up.

## Build the Docker Image[¶](#build-the-docker-image)

Please read the [Application Structure](../../concepts/application_structure/) guide to understand how to structure your LangGraph application.

If the application is structured correctly, you can build a docker image with the LangGraph Deploy server.

To build the docker image, you first need to install the CLI:

```
pip install -U langgraph-cli

```

You can then use:

```
langgraph build -t my-image

```

This will build a docker image with the LangGraph Deploy server. The `-t my-image` is used to tag the image with a name.

When running this server, you need to pass three environment variables:

## Running the application locally[¶](#running-the-application-locally)

### Using Docker[¶](#using-docker)

```
docker run \
    -e REDIS_URI="foo" \
    -e DATABASE_URI="bar" \
    -e LANGSMITH_API_KEY="baz" \
    my-image

```

If you want to run this quickly without setting up a separate Redis and Postgres instance, you can use this docker compose file.

Note

- You need to replace my-image with the name of the image you built in the previous step (from langgraph build). and you should provide appropriate values for REDIS_URI, DATABASE_URI, and LANGSMITH_API_KEY.

- If your application requires additional environment variables, you can pass them in a similar way.

- If using Self-Hosted Enterprise, you must provide LANGGRAPH_CLOUD_LICENSE_KEY as an additional environment variable.

### Using Docker Compose[¶](#using-docker-compose)

```
volumes:
    langgraph-data:
        driver: local
services:
    langgraph-redis:
        image: redis:6
        healthcheck:
            test: redis-cli ping
            interval: 5s
            timeout: 1s
            retries: 5
    langgraph-postgres:
        image: postgres:16
        ports:
            - "5433:5432"
        environment:
            POSTGRES_DB: postgres
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: postgres
        volumes:
            - langgraph-data:/var/lib/postgresql/data
        healthcheck:
            test: pg_isready -U postgres
            start_period: 10s
            timeout: 1s
            retries: 5
            interval: 5s
    langgraph-api:
        image: ${IMAGE_NAME}
        ports:
            - "8123:8000"
        depends_on:
            langgraph-redis:
                condition: service_healthy
            langgraph-postgres:
                condition: service_healthy
        env_file:
            - .env
        environment:
            REDIS_URI: redis://langgraph-redis:6379
            LANGSMITH_API_KEY: ${LANGSMITH_API_KEY}
            POSTGRES_URI: postgres://postgres:postgres@langgraph-postgres:5432/postgres?sslmode=disable

```

You can then run `docker compose up` with this Docker compose file in the same folder.

This will spin up LangGraph Deploy on port `8123` (if you want to change this, you can change this by changing the ports in the `langgraph-api` volume).

You can test that the application is up by checking:

```
curl --request GET --url 0.0.0.0:8123/ok

``` Assuming everything is running correctly, you should see a response like:

```
{"ok":true}

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)