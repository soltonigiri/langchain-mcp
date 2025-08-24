Installation | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageInstallationSupported Environments​](#supported-environments)LangChain is written in TypeScript and can be used in:Node.js (ESM and CommonJS) - 18.x, 19.x, 20.xCloudflare WorkersVercel / Next.js (Browser, Serverless and Edge functions)Supabase Edge FunctionsBrowserDenoBunHowever, note that individual integrations may not be supported in all environments.Installation[​](#installation-1)To install the main langchain package, run:npmYarnpnpm

```bash
npm install langchain @langchain/core

```

```bash
yarn add langchain @langchain/core

```

```bash
pnpm add langchain @langchain/core

```While this package acts as a sane starting point to using LangChain, much of the value of LangChain comes when integrating it with various model providers, datastores, etc. By default, the dependencies needed to do that are NOT installed. You will need to install the dependencies for specific integrations separately. We&#x27;ll show how to do that in the next sections of this guide.Please also see the section on [installing integration packages](/docs/how_to/installation/#installing-integration-packages) for some special considerations when installing LangChain packages.Ecosystem packages[​](#ecosystem-packages)With the exception of the langsmith SDK, all packages in the LangChain ecosystem depend on @langchain/core, which contains base classes and abstractions that other packages use. The dependency graph below shows how the different packages are related. A directed arrow indicates that the source package depends on the target package:![ ](/assets/images/ecosystem_packages-32943b32657e7a187770c9b585f22a64.png)Note:** It is important that your app only uses one version of @langchain/core. Common package managers may introduce additional versions when resolving direct dependencies, even if you don&#x27;t intend this. See [this section on installing integration packages](/docs/how_to/installation/#installing-integration-packages) for more information and ways to remedy this. ### @langchain/community[​](#langchaincommunity) The [@langchain/community](https://www.npmjs.com/package/@langchain/community) package contains a range of third-party integrations. Install with:npm
- Yarn
- pnpm

```bash
npm install @langchain/community @langchain/core

```

```bash
yarn add @langchain/community @langchain/core

```

```bash
pnpm add @langchain/community @langchain/core

```There are also more granular packages containing LangChain integrations for individual providers.

### @langchain/core[​](#langchaincore)

The [@langchain/core](https://www.npmjs.com/package/@langchain/core) package contains base abstractions that the rest of the LangChain ecosystem uses, along with the LangChain Expression Language. It should be installed separately:

- npm
- Yarn
- pnpm

```bash
npm install @langchain/core

```

```bash
yarn add @langchain/core

```

```bash
pnpm add @langchain/core

``` ### LangGraph[​](#langgraph) [LangGraph.js](https://langchain-ai.github.io/langgraphjs/) is a library for building stateful, multi-actor applications with LLMs. It integrates smoothly with LangChain, but can be used without it.

Install with:

- npm
- Yarn
- pnpm

```bash
npm install @langchain/langgraph @langchain/core

```

```bash
yarn add @langchain/langgraph @langchain/core

```

```bash
pnpm add @langchain/langgraph @langchain/core

``` ### LangSmith SDK[​](#langsmith-sdk) The LangSmith SDK is automatically installed by LangChain. If you&#x27;re not using it with LangChain, install with:

- npm
- Yarn
- pnpm

```bash
npm install langsmith

```

```bash
yarn add langsmith

```

```bash
pnpm add langsmith

```tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).

## Installing integration packages[​](#installing-integration-packages)

LangChain supports packages that contain module integrations with individual third-party providers. They can be as specific as [@langchain/anthropic](/docs/integrations/platforms/anthropic/), which contains integrations just for Anthropic models, or as broad as [@langchain/community](https://www.npmjs.com/package/@langchain/community), which contains broader variety of community contributed integrations.

These packages, as well as the main LangChain package, all have [@langchain/core](https://www.npmjs.com/package/@langchain/core) as a peer dependency to avoid package managers installing multiple versions of the same package. It contains the base abstractions that these integration packages extend.

To ensure that all integrations and their types interact with each other properly, it is important that they all use the same version of `@langchain/core`. If you encounter type errors around base classes, you may need to guarantee that your package manager is resolving a single version of `@langchain/core`. To do so, you can add a `"resolutions"` or `"overrides"` field like the following in your project&#x27;s `package.json`. The name will depend on your package manager:

tipThe `resolutions` or `pnpm.overrides` fields for `yarn` or `pnpm` must be set in the root `package.json` file.

If you are using `yarn`:

yarn package.json

```json
{
  "name": "your-project",
  "version": "0.0.0",
  "private": true,
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "@langchain/anthropic": "^0.0.2",
    "@langchain/core": "^0.3.0",
    "langchain": "0.0.207"
  },
  "resolutions": {
    "@langchain/core": "0.3.0"
  }
}

```

You can also try running the [yarn dedupe](https://yarnpkg.com/cli/dedupe) command if you are on `yarn` version 2 or higher.

Or for `npm`:

npm package.json

```json
{
  "name": "your-project",
  "version": "0.0.0",
  "private": true,
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "@langchain/anthropic": "^0.0.2",
    "@langchain/core": "^0.3.0",
    "langchain": "0.0.207"
  },
  "overrides": {
    "@langchain/core": "0.3.0"
  }
}

```

You can also try the [npm dedupe](https://docs.npmjs.com/cli/commands/npm-dedupe) command.

Or for `pnpm`:

pnpm package.json

```json
{
  "name": "your-project",
  "version": "0.0.0",
  "private": true,
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "@langchain/anthropic": "^0.0.2",
    "@langchain/core": "^0.3.0",
    "langchain": "0.0.207"
  },
  "pnpm": {
    "overrides": {
      "@langchain/core": "0.3.0"
    }
  }
}

```

You can also try the [pnpm dedupe](https://pnpm.io/cli/dedupe) command.

## Loading the library[​](#loading-the-library)

### TypeScript[​](#typescript)

LangChain is written in TypeScript and provides type definitions for all of its public APIs.

### ESM[​](#esm)

LangChain provides an ESM build targeting Node.js environments. You can import it using the following syntax:

- npm
- Yarn
- pnpm

```bash
npm install @langchain/openai @langchain/core

```

```bash
yarn add @langchain/openai @langchain/core

```

```bash
pnpm add @langchain/openai @langchain/core

```

```typescript
import { ChatOpenAI } from "@langchain/openai";

```If you are using TypeScript in an ESM project we suggest updating your `tsconfig.json` to include the following:

tsconfig.json

```json
{
  "compilerOptions": {
    ...
    "target": "ES2020", // or higher
    "module": "nodenext",
  }
}

```

### CommonJS[​](#commonjs) LangChain provides a CommonJS build targeting Node.js environments. You can import it using the following syntax:

```typescript
const { ChatOpenAI } = require("@langchain/openai");

```

### Cloudflare Workers[​](#cloudflare-workers) LangChain can be used in Cloudflare Workers. You can import it using the following syntax:

```typescript
import { ChatOpenAI } from "@langchain/openai";

```

### Vercel / Next.js[​](#vercel--nextjs) LangChain can be used in Vercel / Next.js. We support using LangChain in frontend components, in Serverless functions and in Edge functions. You can import it using the following syntax:

```typescript
import { ChatOpenAI } from "@langchain/openai";

```

### Deno / Supabase Edge Functions[​](#deno--supabase-edge-functions) LangChain can be used in Deno / Supabase Edge Functions. You can import it using the following syntax:

```typescript
import { ChatOpenAI } from "https://esm.sh/@langchain/openai";

```

or

```typescript
import { ChatOpenAI } from "npm:@langchain/openai";

```

### Browser[​](#browser) LangChain can be used in the browser. In our CI we test bundling LangChain with Webpack and Vite, but other bundlers should work too. You can import it using the following syntax:

```typescript
import { ChatOpenAI } from "@langchain/openai";

```

## Unsupported: Node.js 16[​](#unsupported-nodejs-16) We do not support Node.js 16, but if you still want to run LangChain on Node.js 16, you will need to follow the instructions in this section. We do not guarantee that these instructions will continue to work in the future.

You will have to make `fetch` available globally, either:

- run your application with NODE_OPTIONS=&#x27;--experimental-fetch&#x27; node ..., or
- install node-fetch and follow the instructions [here](https://github.com/node-fetch/node-fetch#providing-global-access)

You&#x27;ll also need to [polyfill ReadableStream](https://www.npmjs.com/package/web-streams-polyfill) by installing:

- npm
- Yarn
- pnpm

```bash
npm i web-streams-polyfill@4

```

```bash
yarn add web-streams-polyfill@4

```

```bash
pnpm add web-streams-polyfill@4

```And then adding it to the global namespace in your main entrypoint:

```typescript
import "web-streams-polyfill/polyfill";

```

Additionally you&#x27;ll have to polyfill `structuredClone`, eg. by installing `core-js` and following the instructions [here](https://github.com/zloirock/core-js).

If you are running Node.js 18+, you do not need to do anything.

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Supported Environments](#supported-environments)
- [Installation](#installation-1)
- [Ecosystem packages](#ecosystem-packages)[@langchain/community](#langchaincommunity)
- [@langchain/core](#langchaincore)
- [LangGraph](#langgraph)
- [LangSmith SDK](#langsmith-sdk)

- [Installing integration packages](#installing-integration-packages)
- [Loading the library](#loading-the-library)[TypeScript](#typescript)
- [ESM](#esm)
- [CommonJS](#commonjs)
- [Cloudflare Workers](#cloudflare-workers)
- [Vercel / Next.js](#vercel--nextjs)
- [Deno / Supabase Edge Functions](#deno--supabase-edge-functions)
- [Browser](#browser)

- [Unsupported: Node.js 16](#unsupported-nodejs-16)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.