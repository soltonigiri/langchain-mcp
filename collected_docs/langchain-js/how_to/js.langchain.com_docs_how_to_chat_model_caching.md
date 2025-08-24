How to cache chat model responses | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to cache chat model responsesPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)[LLMs](/docs/concepts/text_llms)LangChain provides an optional caching layer for chat models. This is useful for two reasons:It can save you money by reducing the number of API calls you make to the LLM provider, if you&#x27;re often requesting the same completion multiple times. It can speed up your application by reducing the number of API calls you make to the LLM provider.

```typescript
import { ChatOpenAI } from "@langchain/openai";

// To make the caching really obvious, lets use a slower model.
const model = new ChatOpenAI({
  model: "gpt-4",
  cache: true,
});

```In Memory Cache[​](#in-memory-cache)The default cache is stored in-memory. This means that if you restart your application, the cache will be cleared.

```typescript
console.time();

// The first time, it is not yet in cache, so it should take longer
const res = await model.invoke("Tell me a joke!");
console.log(res);

console.timeEnd();

/*
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "Why don&#x27;t scientists trust atoms?\n\nBecause they make up everything!",
      additional_kwargs: { function_call: undefined, tool_calls: undefined }
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: "Why don&#x27;t scientists trust atoms?\n\nBecause they make up everything!",
    name: undefined,
    additional_kwargs: { function_call: undefined, tool_calls: undefined }
  }
  default: 2.224s
*/

```

```typescript
console.time();

// The second time it is, so it goes faster
const res2 = await model.invoke("Tell me a joke!");
console.log(res2);

console.timeEnd();
/*
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "Why don&#x27;t scientists trust atoms?\n\nBecause they make up everything!",
      additional_kwargs: { function_call: undefined, tool_calls: undefined }
    },
    lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
    content: "Why don&#x27;t scientists trust atoms?\n\nBecause they make up everything!",
    name: undefined,
    additional_kwargs: { function_call: undefined, tool_calls: undefined }
  }
  default: 181.98ms
*/

```Caching with Redis[​](#caching-with-redis)LangChain also provides a Redis-based cache. This is useful if you want to share the cache across multiple processes or servers. To use it, you&#x27;ll need to install the redis package:npmYarnpnpm

```bash
npm install ioredis @langchain/community @langchain/core

```

```bash
yarn add ioredis @langchain/community @langchain/core

```

```bash
pnpm add ioredis @langchain/community @langchain/core

```Then, you can pass a cache option when you instantiate the LLM. For example:

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { Redis } from "ioredis";
import { RedisCache } from "@langchain/community/caches/ioredis";

const client = new Redis("redis://localhost:6379");

const cache = new RedisCache(client, {
  ttl: 60, // Optional key expiration value
});

const model = new ChatOpenAI({ model: "gpt-4o-mini", cache });

const response1 = await model.invoke("Do something random!");
console.log(response1);
/*
  AIMessage {
    content: "Sure! I&#x27;ll generate a random number for you: 37",
    additional_kwargs: {}
  }
*/

const response2 = await model.invoke("Do something random!");
console.log(response2);
/*
  AIMessage {
    content: "Sure! I&#x27;ll generate a random number for you: 37",
    additional_kwargs: {}
  }
*/

await client.disconnect();

```API Reference:ChatOpenAI from @langchain/openaiRedisCache from @langchain/community/caches/ioredisCaching with Upstash Redis[​](#caching-with-upstash-redis)LangChain provides an Upstash Redis-based cache. Like the Redis-based cache, this cache is useful if you want to share the cache across multiple processes or servers. The Upstash Redis client uses HTTP and supports edge environments. To use it, you&#x27;ll need to install the @upstash/redis package:npmYarnpnpm

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
import { ChatOpenAI } from "@langchain/openai";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";

// See https://docs.upstash.com/redis/howto/connectwithupstashredis#quick-start for connection options
const cache = new UpstashRedisCache({
  config: {
    url: "UPSTASH_REDIS_REST_URL",
    token: "UPSTASH_REDIS_REST_TOKEN",
  },
  ttl: 3600,
});

const model = new ChatOpenAI({ model: "gpt-4o-mini", cache });

```API Reference:ChatOpenAI from @langchain/openaiUpstashRedisCache from @langchain/community/caches/upstash_redisYou can also directly pass in a previously created [@upstash/redis](https://docs.upstash.com/redis/sdks/javascriptsdk/overview) client instance:

```typescript
import { Redis } from "@upstash/redis";
import https from "https";

import { ChatOpenAI } from "@langchain/openai";
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
const model = new ChatOpenAI({ model: "gpt-4o-mini", cache });

```API Reference:ChatOpenAI from @langchain/openaiUpstashRedisCache from @langchain/community/caches/upstash_redisCaching with Vercel KV[​](#caching-with-vercel-kv)LangChain provides an Vercel KV-based cache. Like the Redis-based cache, this cache is useful if you want to share the cache across multiple processes or servers. The Vercel KV client uses HTTP and supports edge environments. To use it, you&#x27;ll need to install the @vercel/kv package:npmYarnpnpm

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
import { ChatOpenAI } from "@langchain/openai";
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

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  cache,
});

```API Reference:ChatOpenAI from @langchain/openaiVercelKVCache from @langchain/community/caches/vercel_kvCaching with Cloudflare KV[​](#caching-with-cloudflare-kv)infoThis integration is only supported in Cloudflare Workers.If you&#x27;re deploying your project as a Cloudflare Worker, you can use LangChain&#x27;s Cloudflare KV-powered LLM cache.For information on how to set up KV in Cloudflare, see [the official documentation](https://developers.cloudflare.com/kv/).Note:** If you are using TypeScript, you may need to install types if they aren&#x27;t already present:npm
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

import { ChatOpenAI } from "@langchain/openai";
import { CloudflareKVCache } from "@langchain/cloudflare";

export interface Env {
  KV_NAMESPACE: KVNamespace;
  OPENAI_API_KEY: string;
}

export default {
  async fetch(_request: Request, env: Env) {
    try {
      const cache = new CloudflareKVCache(env.KV_NAMESPACE);
      const model = new ChatOpenAI({
        cache,
        model: "gpt-3.5-turbo",
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

``` #### API Reference: - ChatOpenAI from @langchain/openai - CloudflareKVCache from @langchain/cloudflare ## Caching on the File System[​](#caching-on-the-file-system) dangerThis cache is not recommended for production use. It is only intended for local development.

LangChain provides a simple file system cache. By default the cache is stored a temporary directory, but you can specify a custom directory if you want.

```typescript
const cache = await LocalFileCache.create();

```

## Next steps[​](#next-steps) You&#x27;ve now learned how to cache model responses to save time and money.

Next, check out the other how-to guides on chat models, like [how to get a model to return structured output](/docs/how_to/structured_output) or [how to create your own custom chat model](/docs/how_to/custom_chat).

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [In Memory Cache](#in-memory-cache)
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