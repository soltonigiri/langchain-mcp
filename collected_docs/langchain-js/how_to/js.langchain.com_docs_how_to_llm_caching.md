How to cache model responses | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to cache model responsesLangChain provides an optional caching layer for LLMs. This is useful for two reasons:It can save you money by reducing the number of API calls you make to the LLM provider, if you&#x27;re often requesting the same completion multiple times. It can speed up your application by reducing the number of API calls you make to the LLM provider.tipSee this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npmYarnpnpm

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
import { OpenAI } from "@langchain/openai";

const model = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  cache: true,
});

```In Memory Cache[​](#in-memory-cache)The default cache is stored in-memory. This means that if you restart your application, the cache will be cleared.

```typescript
console.time();

// The first time, it is not yet in cache, so it should take longer
const res = await model.invoke("Tell me a long joke");

console.log(res);

console.timeEnd();

/*
  A man walks into a bar and sees a jar filled with money on the counter. Curious, he asks the bartender about it.

  The bartender explains, "We have a challenge for our customers. If you can complete three tasks, you win all the money in the jar."

  Intrigued, the man asks what the tasks are.

  The bartender replies, "First, you have to drink a whole bottle of tequila without making a face. Second, there&#x27;s a pitbull out back with a sore tooth. You have to pull it out. And third, there&#x27;s an old lady upstairs who has never had an orgasm. You have to give her one."

  The man thinks for a moment and then confidently says, "I&#x27;ll do it."

  He grabs the bottle of tequila and downs it in one gulp, without flinching. He then heads to the back and after a few minutes of struggling, emerges with the pitbull&#x27;s tooth in hand.

  The bar erupts in cheers and the bartender leads the man upstairs to the old lady&#x27;s room. After a few minutes, the man walks out with a big smile on his face and the old lady is giggling with delight.

  The bartender hands the man the jar of money and asks, "How

  default: 4.187s
*/

```

```typescript
console.time();

// The second time it is, so it goes faster
const res2 = await model.invoke("Tell me a joke");

console.log(res2);

console.timeEnd();

/*
  A man walks into a bar and sees a jar filled with money on the counter. Curious, he asks the bartender about it.

  The bartender explains, "We have a challenge for our customers. If you can complete three tasks, you win all the money in the jar."

  Intrigued, the man asks what the tasks are.

  The bartender replies, "First, you have to drink a whole bottle of tequila without making a face. Second, there&#x27;s a pitbull out back with a sore tooth. You have to pull it out. And third, there&#x27;s an old lady upstairs who has never had an orgasm. You have to give her one."

  The man thinks for a moment and then confidently says, "I&#x27;ll do it."

  He grabs the bottle of tequila and downs it in one gulp, without flinching. He then heads to the back and after a few minutes of struggling, emerges with the pitbull&#x27;s tooth in hand.

  The bar erupts in cheers and the bartender leads the man upstairs to the old lady&#x27;s room. After a few minutes, the man walks out with a big smile on his face and the old lady is giggling with delight.

  The bartender hands the man the jar of money and asks, "How

  default: 175.74ms
*/

```Caching with Momento[​](#caching-with-momento)LangChain also provides a Momento-based cache. [Momento](https://gomomento.com) is a distributed, serverless cache that requires zero setup or infrastructure maintenance. Given Momento&#x27;s compatibility with Node.js, browser, and edge environments, ensure you install the relevant package.To install for Node.js**:npm
- Yarn
- pnpm

```bash
npm install @gomomento/sdk

```**

```bash
yarn add @gomomento/sdk

```

```bash
pnpm add @gomomento/sdk

```To install for browser/edge workers**:

- npm
- Yarn
- pnpm

```bash
npm install @gomomento/sdk-web

```**

```bash
yarn add @gomomento/sdk-web

```

```bash
pnpm add @gomomento/sdk-web

```Next you&#x27;ll need to sign up and create an API key. Once you&#x27;ve done that, pass a cache option when you instantiate the LLM like this:

```typescript
import { OpenAI } from "@langchain/openai";
import {
  CacheClient,
  Configurations,
  CredentialProvider,
} from "@gomomento/sdk";
import { MomentoCache } from "@langchain/community/caches/momento";

// See https://github.com/momentohq/client-sdk-javascript for connection options
const client = new CacheClient({
  configuration: Configurations.Laptop.v1(),
  credentialProvider: CredentialProvider.fromEnvironmentVariable({
    environmentVariableName: "MOMENTO_API_KEY",
  }),
  defaultTtlSeconds: 60 * 60 * 24,
});
const cache = await MomentoCache.fromProps({
  client,
  cacheName: "langchain",
});

const model = new OpenAI({ cache });

```API Reference:OpenAI from @langchain/openaiMomentoCache from @langchain/community/caches/momentoCaching with Redis[​](#caching-with-redis)LangChain also provides a Redis-based cache. This is useful if you want to share the cache across multiple processes or servers. To use it, you&#x27;ll need to install the redis package:npmYarnpnpm

```bash
npm install ioredis

```

```bash
yarn add ioredis

```

```bash
pnpm add ioredis

```Then, you can pass a cache option when you instantiate the LLM. For example:

```typescript
import { OpenAI } from "@langchain/openai";
import { RedisCache } from "@langchain/community/caches/ioredis";
import { Redis } from "ioredis";

// See https://github.com/redis/ioredis for connection options
const client = new Redis({});

const cache = new RedisCache(client);

const model = new OpenAI({ cache });

```Caching with Upstash Redis[​](#caching-with-upstash-redis)LangChain provides an Upstash Redis-based cache. Like the Redis-based cache, this cache is useful if you want to share the cache across multiple processes or servers. The Upstash Redis client uses HTTP and supports edge environments. To use it, you&#x27;ll need to install the @upstash/redis package:npmYarnpnpm

```bash
npm install @upstash/redis

```

```bash
yarn add @upstash/redis

```

```bash
pnpm add @upstash/redis

```You&#x27;ll also need an [Upstash account](https://docs.upstash.com/redis#create-account) and a [Redis database](https://docs.upstash.com/redis#create-a-database) to connect to. Once you&#x27;ve done that, retrieve your REST URL and REST token.Then, you can pass a cache option when you instantiate the LLM. For example:

```typescript
import { OpenAI } from "@langchain/openai";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";

// See https://docs.upstash.com/redis/howto/connectwithupstashredis#quick-start for connection options
const cache = new UpstashRedisCache({
  config: {
    url: "UPSTASH_REDIS_REST_URL",
    token: "UPSTASH_REDIS_REST_TOKEN",
  },
  ttl: 3600,
});

const model = new OpenAI({ cache });

```API Reference:OpenAI from @langchain/openaiUpstashRedisCache from @langchain/community/caches/upstash_redisYou can also directly pass in a previously created [@upstash/redis](https://docs.upstash.com/redis/sdks/javascriptsdk/overview) client instance:

```typescript
import { Redis } from "@upstash/redis";
import https from "https";

import { OpenAI } from "@langchain/openai";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";

// const client = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
//   agent: new https.Agent({ keepAlive: true }),
// });

// Or simply call Redis.fromEnv() to automatically load the UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.
const client = Redis.fromEnv({
  agent: new https.Agent({ keepAlive: true }),
});

const cache = new UpstashRedisCache({ client });
const model = new OpenAI({ cache });

```API Reference:OpenAI from @langchain/openaiUpstashRedisCache from @langchain/community/caches/upstash_redisCaching with Vercel KV[​](#caching-with-vercel-kv)LangChain provides an Vercel KV-based cache. Like the Redis-based cache, this cache is useful if you want to share the cache across multiple processes or servers. The Vercel KV client uses HTTP and supports edge environments. To use it, you&#x27;ll need to install the @vercel/kv package:npmYarnpnpm

```bash
npm install @vercel/kv

```

```bash
yarn add @vercel/kv

```

```bash
pnpm add @vercel/kv

```You&#x27;ll also need an Vercel account and a [KV database](https://vercel.com/docs/storage/vercel-kv/kv-reference) to connect to. Once you&#x27;ve done that, retrieve your REST URL and REST token.Then, you can pass a cache option when you instantiate the LLM. For example:

```typescript
import { OpenAI } from "@langchain/openai";
import { VercelKVCache } from "@langchain/community/caches/vercel_kv";
import { createClient } from "@vercel/kv";

// See https://vercel.com/docs/storage/vercel-kv/kv-reference#createclient-example for connection options
const cache = new VercelKVCache({
  client: createClient({
    url: "VERCEL_KV_API_URL",
    token: "VERCEL_KV_API_TOKEN",
  }),
  ttl: 3600,
});

const model = new OpenAI({ cache });

```API Reference:OpenAI from @langchain/openaiVercelKVCache from @langchain/community/caches/vercel_kvCaching with Cloudflare KV[​](#caching-with-cloudflare-kv)infoThis integration is only supported in Cloudflare Workers.If you&#x27;re deploying your project as a Cloudflare Worker, you can use LangChain&#x27;s Cloudflare KV-powered LLM cache.For information on how to set up KV in Cloudflare, see [the official documentation](https://developers.cloudflare.com/kv/).Note:** If you are using TypeScript, you may need to install types if they aren&#x27;t already present:

- npm
- Yarn
- pnpm

```bash
npm install -S @cloudflare/workers-types

```

```bash
yarn add @cloudflare/workers-types

```

```bash
pnpm add @cloudflare/workers-types

```

```typescript
import type { KVNamespace } from "@cloudflare/workers-types";

import { OpenAI } from "@langchain/openai";
import { CloudflareKVCache } from "@langchain/cloudflare";

export interface Env {
  KV_NAMESPACE: KVNamespace;
  OPENAI_API_KEY: string;
}

export default {
  async fetch(_request: Request, env: Env) {
    try {
      const cache = new CloudflareKVCache(env.KV_NAMESPACE);
      const model = new OpenAI({
        cache,
        model: "gpt-3.5-turbo-instruct",
        apiKey: env.OPENAI_API_KEY,
      });
      const response = await model.invoke("How are you today?");
      return new Response(JSON.stringify(response), {
        headers: { "content-type": "application/json" },
      });
    } catch (err: any) {
      console.log(err.message);
      return new Response(err.message, { status: 500 });
    }
  },
};

``` #### API Reference: - OpenAI from @langchain/openai - CloudflareKVCache from @langchain/cloudflare ## Caching on the File System[​](#caching-on-the-file-system) dangerThis cache is not recommended for production use. It is only intended for local development.

LangChain provides a simple file system cache. By default the cache is stored a temporary directory, but you can specify a custom directory if you want.

```typescript
const cache = await LocalFileCache.create();

```

## Next steps[​](#next-steps) You&#x27;ve now learned how to cache model responses to save time and money.

Next, check out the other how-to guides on LLMs, like [how to create your own custom LLM class](/docs/how_to/custom_llm).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [In Memory Cache](#in-memory-cache)
- [Caching with Momento](#caching-with-momento)
- [Caching with Redis](#caching-with-redis)
- [Caching with Upstash Redis](#caching-with-upstash-redis)
- [Caching with Vercel KV](#caching-with-vercel-kv)
- [Caching with Cloudflare KV](#caching-with-cloudflare-kv)
- [Caching on the File System](#caching-on-the-file-system)
- [Next steps](#next-steps)

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