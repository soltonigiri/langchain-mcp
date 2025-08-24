How to install LangChain packages | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/installation.mdx) # How to install LangChain packages The LangChain ecosystem is split into different packages, which allow you to choose exactly which pieces of functionality to install. ## Official release[​](#official-release) To install the main langchain package, run: Pip
- Conda

```bash
pip install langchain

```

```bash
conda install langchain -c conda-forge

``` While this package acts as a sane starting point to using LangChain, much of the value of LangChain comes when integrating it with various model providers, datastores, etc. By default, the dependencies needed to do that are NOT installed. You will need to install the dependencies for specific integrations separately, which we show below.

## Ecosystem packages[​](#ecosystem-packages)

With the exception of the `langsmith` SDK, all packages in the LangChain ecosystem depend on `langchain-core`, which contains base classes and abstractions that other packages use. The dependency graph below shows how the different packages are related. A directed arrow indicates that the source package depends on the target package:

![ ](/assets/images/ecosystem_packages-32943b32657e7a187770c9b585f22a64.png)

When installing a package, you do not need to explicitly install that package&#x27;s explicit dependencies (such as `langchain-core`). However, you may choose to if you are using a feature only available in a certain version of that dependency. If you do, you should make sure that the installed or pinned version is compatible with any other integration packages you use.

### LangChain core[​](#langchain-core)

The `langchain-core` package contains base abstractions that the rest of the LangChain ecosystem uses, along with the LangChain Expression Language. It is automatically installed by `langchain`, but can also be used separately. Install with:

```bash
pip install langchain-core

```

### Integration packages[​](#integration-packages) Certain integrations like OpenAI and Anthropic have their own packages. Any integrations that require their own package will be documented as such in the [Integration docs](/docs/integrations/providers/). You can see a list of all integration packages in the [API reference](https://python.langchain.com/api_reference/) under the "Partner libs" dropdown. To install one of these run:

```bash
pip install langchain-openai

```

Any integrations that haven&#x27;t been split out into their own packages will live in the `langchain-community` package. Install with:

```bash
pip install langchain-community

```

### LangChain experimental[​](#langchain-experimental) The `langchain-experimental` package holds experimental LangChain code, intended for research and experimental uses. Install with:

```bash
pip install langchain-experimental

```

### LangGraph[​](#langgraph) `langgraph` is a library for building stateful, multi-actor applications with LLMs. It integrates smoothly with LangChain, but can be used without it. Install with:

```bash
pip install langgraph

```

### LangServe[​](#langserve) LangServe helps developers deploy LangChain runnables and chains as a REST API. LangServe is automatically installed by LangChain CLI. If not using LangChain CLI, install with:

```bash
pip install "langserve[all]"

```

for both client and server dependencies. Or `pip install "langserve[client]"` for client code, and `pip install "langserve[server]"` for server code.

### LangChain CLI[​](#langchain-cli)

The LangChain CLI is useful for working with LangChain templates and other LangServe projects. Install with:

```bash
pip install langchain-cli

```

### LangSmith SDK[​](#langsmith-sdk) The LangSmith SDK is automatically installed by LangChain. However, it does not depend on `langchain-core`, and can be installed and used independently if desired. If you are not using LangChain, you can install it with:

```bash
pip install langsmith

```

### From source[​](#from-source) If you want to install a package from source, you can do so by cloning the [main LangChain repo](https://github.com/langchain-ai/langchain), enter the directory of the package you want to install `PATH/TO/REPO/langchain/libs/{package}`, and run:

```bash
pip install -e .

```

LangGraph, LangSmith SDK, and certain integration packages live outside the main LangChain repo. You can see [all repos here](https://github.com/langchain-ai).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/installation.mdx)

- [Official release](#official-release)
- [Ecosystem packages](#ecosystem-packages)[LangChain core](#langchain-core)
- [Integration packages](#integration-packages)
- [LangChain experimental](#langchain-experimental)
- [LangGraph](#langgraph)
- [LangServe](#langserve)
- [LangChain CLI](#langchain-cli)
- [LangSmith SDK](#langsmith-sdk)
- [From source](#from-source)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)
- [Slack](https://www.langchain.com/join-community)

GitHub

- [Organization](https://github.com/langchain-ai)
- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)
- [YouTube](https://www.youtube.com/@LangChain)

Copyright © 2025 LangChain, Inc.