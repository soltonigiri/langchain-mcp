How to stream | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageHow to streamPrerequisitesThis guide assumes familiarity with the following concepts:Chat models](/docs/concepts/chat_models)[LangChain Expression Language](/docs/concepts/lcel)[Output parsers](/docs/concepts/output_parsers)Streaming is critical in making applications based on LLMs feel responsive to end-users.Important LangChain primitives like LLMs, parsers, prompts, retrievers, and agents implement the LangChain Runnable Interface.This interface provides two general approaches to stream content:.stream(): a default implementation of streaming that streams the final output from the chain.streamEvents() and streamLog(): these provide a way to stream both intermediate steps and final output from the chain.Let’s take a look at both approaches!For a higher-level overview of streaming techniques in LangChain, see [this section of the conceptual guide](/docs/concepts/streaming).Using StreamAll Runnable objects implement a method called stream.These methods are designed to stream the final output in chunks, yielding each chunk as soon as it is available.Streaming is only possible if all steps in the program know how to process an input stream**; i.e., process an input chunk one at a time, and yield a corresponding output chunk.The complexity of this processing can vary, from straightforward tasks like emitting tokens produced by an LLM, to more challenging ones like streaming parts of JSON results before the entire JSON is complete.The best place to start exploring streaming is with the single most important components in LLM apps – the models themselves! ## LLMs and Chat Models[​](#llms-and-chat-models) Large language models can take several seconds to generate a complete response to a query. This is far slower than the **~200-300 ms** threshold at which an application feels responsive to an end user.The key strategy to make the application feel more responsive is to show intermediate progress; e.g., to stream the output from the model token by token.

```typescript
import "dotenv/config";

```**Pick your chat model:GroqOpenAIAnthropicGoogle GeminiFireworksAIMistralAIVertexAIInstall dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/groq

```

```bash
yarn add @langchain/groq

```

```bash
pnpm add @langchain/groq

```Add environment variables

```bash
GROQ_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/openai

```

```bash
yarn add @langchain/openai

```

```bash
pnpm add @langchain/openai

```Add environment variables

```bash
OPENAI_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/anthropic

```

```bash
yarn add @langchain/anthropic

```

```bash
pnpm add @langchain/anthropic

```Add environment variables

```bash
ANTHROPIC_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/google-genai

```

```bash
yarn add @langchain/google-genai

```

```bash
pnpm add @langchain/google-genai

```Add environment variables

```bash
GOOGLE_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/community

```

```bash
yarn add @langchain/community

```

```bash
pnpm add @langchain/community

```Add environment variables

```bash
FIREWORKS_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const model = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/mistralai

```

```bash
yarn add @langchain/mistralai

```

```bash
pnpm add @langchain/mistralai

```Add environment variables

```bash
MISTRAL_API_KEY=your-api-key

```Instantiate the model

```typescript
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0
});

```Install dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/google-vertexai

```

```bash
yarn add @langchain/google-vertexai

```

```bash
pnpm add @langchain/google-vertexai

```Add environment variables

```bash
GOOGLE_APPLICATION_CREDENTIALS=credentials.json

```Instantiate the model

```typescript
import { ChatVertexAI } from "@langchain/google-vertexai";

const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```

```typescript
const stream = await model.stream("Hello! Tell me about yourself.");
const chunks = [];
for await (const chunk of stream) {
  chunks.push(chunk);
  console.log(`${chunk.content}|`);
}

```

```text
|
Hello|
!|
 I&#x27;m|
 a|
 large|
 language|
 model|
 developed|
 by|
 Open|
AI|
 called|
 GPT|
-|
4|
,|
 based|
 on|
 the|
 Gener|
ative|
 Pre|
-trained|
 Transformer|
 architecture|
.|
 I&#x27;m|
 designed|
 to|
 understand|
 and|
 generate|
 human|
-like|
 text|
 based|
 on|
 the|
 input|
 I|
 receive|
.|
 My|
 primary|
 function|
 is|
 to|
 assist|
 with|
 answering|
 questions|
,|
 providing|
 information|
,|
 and|
 engaging|
 in|
 various|
 types|
 of|
 conversations|
.|
 While|
 I|
 don&#x27;t|
 have|
 personal|
 experiences|
 or|
 emotions|
,|
 I&#x27;m|
 trained|
 on|
 diverse|
 datasets|
 that|
 enable|
 me|
 to|
 provide|
 useful|
 and|
 relevant|
 information|
 across|
 a|
 wide|
 array|
 of|
 topics|
.|
 How|
 can|
 I|
 assist|
 you|
 today|
?|
|
|

```Let’s have a look at one of the raw chunks:

```typescript
chunks[0];

```

```text
AIMessageChunk {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;&#x27;,
    tool_call_chunks: [],
    additional_kwargs: {},
    id: &#x27;chatcmpl-9lO8YUEcX7rqaxxevelHBtl1GaWoo&#x27;,
    tool_calls: [],
    invalid_tool_calls: [],
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;&#x27;,
  name: undefined,
  additional_kwargs: {},
  response_metadata: { prompt: 0, completion: 0, finish_reason: null },
  id: &#x27;chatcmpl-9lO8YUEcX7rqaxxevelHBtl1GaWoo&#x27;,
  tool_calls: [],
  invalid_tool_calls: [],
  tool_call_chunks: [],
  usage_metadata: undefined
}

```We got back something called an AIMessageChunk. This chunk represents a part of an AIMessage.Message chunks are additive by design – one can simply add them up using the .concat() method to get the state of the response so far!

```typescript
let finalChunk = chunks[0];

for (const chunk of chunks.slice(1, 5)) {
  finalChunk = finalChunk.concat(chunk);
}

finalChunk;

```

```text
AIMessageChunk {
  lc_serializable: true,
  lc_kwargs: {
    content: "Hello! I&#x27;m a",
    additional_kwargs: {},
    response_metadata: { prompt: 0, completion: 0, finish_reason: null },
    tool_call_chunks: [],
    id: &#x27;chatcmpl-9lO8YUEcX7rqaxxevelHBtl1GaWoo&#x27;,
    tool_calls: [],
    invalid_tool_calls: []
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: "Hello! I&#x27;m a",
  name: undefined,
  additional_kwargs: {},
  response_metadata: { prompt: 0, completion: 0, finish_reason: null },
  id: &#x27;chatcmpl-9lO8YUEcX7rqaxxevelHBtl1GaWoo&#x27;,
  tool_calls: [],
  invalid_tool_calls: [],
  tool_call_chunks: [],
  usage_metadata: undefined
}

```Chains[​](#chains)Virtually all LLM applications involve more steps than just a call to a language model.Let’s build a simple chain using LangChain Expression Language (LCEL) that combines a prompt, model and a parser and verify that streaming works.We will use StringOutputParser to parse the output from the model. This is a simple parser that extracts the content field from an AIMessageChunk, giving us the token returned by the model.tipLCEL is a declarative way to specify a “program” by chainining together different LangChain primitives. Chains created using LCEL benefit from an automatic implementation of stream, allowing streaming of the final output. In fact, chains created with LCEL implement the entire standard Runnable interface.

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromTemplate("Tell me a joke about {topic}");

const parser = new StringOutputParser();

const chain = prompt.pipe(model).pipe(parser);

const stream = await chain.stream({
  topic: "parrot",
});

for await (const chunk of stream) {
  console.log(`${chunk}|`);
}

```

```text
|
Sure|
,|
 here&#x27;s|
 a|
 joke|
 for|
 you|
:

|
Why|
 did|
 the|
 par|
rot|
 sit|
 on|
 the|
 stick|
?

|
Because|
 it|
 wanted|
 to|
 be|
 a|
 "|
pol|
ly|
-stick|
-al|
"|
 observer|
!|
|
|

```noteYou do not have to use the LangChain Expression Language to use LangChain and can instead rely on a standard imperative** programming approach by caling invoke, batch or stream on each component individually, assigning the results to variables and then using them downstream as you see fit.If that works for your needs, then that’s fine by us 👌! ### Working with Input Streams[​](#working-with-input-streams) What if you wanted to stream JSON from the output as it was being generated?If you were to rely on JSON.parse to parse the partial json, the parsing would fail as the partial json wouldn’t be valid json.You’d likely be at a complete loss of what to do and claim that it wasn’t possible to stream JSON.Well, turns out there is a way to do it - the parser needs to operate on the **input stream**, and attempt to “auto-complete” the partial json into a valid state.Let’s see such a parser in action to understand what this means.

```typescript
import { JsonOutputParser } from "@langchain/core/output_parsers";

const chain = model.pipe(new JsonOutputParser());
const stream = await chain.stream(
  `Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`
);

for await (const chunk of stream) {
  console.log(chunk);
}

```**

```text
{
  countries: [
    { name: &#x27;France&#x27;, population: 67390000 },
    { name: &#x27;Spain&#x27;, population: 47350000 },
    { name: &#x27;Japan&#x27;, population: 125800000 }
  ]
}

```Now, let’s break** streaming. We’ll use the previous example and append an extraction function at the end that extracts the country names from the finalized JSON. Since this new last step is just a function call with no defined streaming behavior, the streaming output from previous steps is aggregated, then passed as a single input to the function.dangerAny steps in the chain that operate on **finalized inputs** rather than on **input streams** can break streaming functionality via stream.tipLater, we will discuss the streamEvents API which streams results from intermediate steps. This API will stream results from intermediate steps even if the chain contains steps that only operate on **finalized inputs**.

```typescript
// A function that operates on finalized inputs
// rather than on an input_stream

// A function that does not operates on input streams and breaks streaming.
const extractCountryNames = (inputs: Record<string, any>) => {
  if (!Array.isArray(inputs.countries)) {
    return "";
  }
  return JSON.stringify(inputs.countries.map((country) => country.name));
};

const chain = model.pipe(new JsonOutputParser()).pipe(extractCountryNames);

const stream = await chain.stream(
  `output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`
);

for await (const chunk of stream) {
  console.log(chunk);
}

```**

```text
["France","Spain","Japan"]

```Non-streaming components[​](#non-streaming-components)Like the above example, some built-in components like Retrievers do not offer any streaming. What happens if we try to stream them?

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const template = `Answer the question based only on the following context:
{context}

Question: {question}
`;
const prompt = ChatPromptTemplate.fromTemplate(template);

const vectorstore = await MemoryVectorStore.fromTexts(
  ["mitochondria is the powerhouse of the cell", "buildings are made of brick"],
  [{}, {}],
  new OpenAIEmbeddings()
);

const retriever = vectorstore.asRetriever();

const chunks = [];

for await (const chunk of await retriever.stream(
  "What is the powerhouse of the cell?"
)) {
  chunks.push(chunk);
}

console.log(chunks);

```

```text
[
  [
    Document {
      pageContent: &#x27;mitochondria is the powerhouse of the cell&#x27;,
      metadata: {},
      id: undefined
    },
    Document {
      pageContent: &#x27;buildings are made of brick&#x27;,
      metadata: {},
      id: undefined
    }
  ]
]

```Stream just yielded the final result from that component.This is OK! Not all components have to implement streaming – in some cases streaming is either unnecessary, difficult or just doesn’t make sense.tipAn LCEL chain constructed using some non-streaming components will still be able to stream in a lot of cases, with streaming of partial output starting after the last non-streaming step in the chain.Here’s an example of this:

```typescript
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import type { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";

const formatDocs = (docs: Document[]) => {
  return docs.map((doc) => doc.pageContent).join("\n-----\n");
};

const retrievalChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const stream = await retrievalChain.stream(
  "What is the powerhouse of the cell?"
);

for await (const chunk of stream) {
  console.log(`${chunk}|`);
}

```

```text
|
M|
ito|
ch|
ond|
ria|
 is|
 the|
 powerhouse|
 of|
 the|
 cell|
.|
|
|

```Now that we’ve seen how the stream method works, let’s venture into the world of streaming events!Using Stream Events[​](#using-stream-events)Event Streaming is a beta** API. This API may change a bit based on feedback.noteIntroduced in @langchain/core **0.1.27**.For the streamEvents method to work properly:Any custom functions / runnables must propragate callbacks
- Set proper parameters on models to force the LLM to stream tokens.
- Let us know if anything doesn’t work as expected!

### Event Reference[​](#event-reference)

Below is a reference table that shows some events that might be emitted by the various Runnable objects.

noteWhen streaming is implemented properly, the inputs to a runnable will not be known until after the input stream has been entirely consumed. This means that `inputs` will often be included only for `end` events and rather than for `start` events.

| event | name | chunk | input | output |

| on_llm_start | [model name] |  | {‘input’: ‘hello’} |  |

| on_llm_stream | [model name] | ‘Hello’ `or` AIMessageChunk(content=“hello”) |  |  |

| on_llm_end | [model name] |  | ‘Hello human!’ | {“generations”: […], “llmOutput”: None, …} |

| on_chain_start | format_docs |  |  |  |

| on_chain_stream | format_docs | “hello world!, goodbye world!” |  |  |

| on_chain_end | format_docs |  | [Document(…)] | “hello world!, goodbye world!” |

| on_tool_start | some_tool |  | {“x”: 1, “y”: “2”} |  |

| on_tool_stream | some_tool | {“x”: 1, “y”: “2”} |  |  |

| on_tool_end | some_tool |  |  | {“x”: 1, “y”: “2”} |

| on_retriever_start | [retriever name] |  | {“query”: “hello”} |  |

| on_retriever_chunk | [retriever name] | {documents: […]} |  |  |

| on_retriever_end | [retriever name] |  | {“query”: “hello”} | {documents: […]} |

| on_prompt_start | [template_name] |  | {“question”: “hello”} |  |

| on_prompt_end | [template_name] |  | {“question”: “hello”} | ChatPromptValue(messages: [SystemMessage, …]) |

`streamEvents` will also emit dispatched custom events in `v2`. Please see [this guide](/docs/how_to/callbacks_custom_events/) for more.

### Chat Model[​](#chat-model)

Let’s start off by looking at the events produced by a chat model.

```typescript
const events = [];

const eventStream = await model.streamEvents("hello", { version: "v2" });

for await (const event of eventStream) {
  events.push(event);
}

console.log(events.length);

```**

```text
25

```noteHey what’s that funny version=“v2” parameter in the API?! 😾This is a beta API**, and we’re almost certainly going to make some
changes to it.

This version parameter will allow us to minimize such breaking changes to your code.

In short, we are annoying you now, so we don’t have to annoy you later.

Let’s take a look at the few of the start event and a few of the end events.

```typescript
events.slice(0, 3);

```**

```text
[
  {
    event: &#x27;on_chat_model_start&#x27;,
    data: { input: &#x27;hello&#x27; },
    name: &#x27;ChatOpenAI&#x27;,
    tags: [],
    run_id: &#x27;c983e634-9f1d-4916-97d8-63c3a86102c2&#x27;,
    metadata: {
      ls_provider: &#x27;openai&#x27;,
      ls_model_name: &#x27;gpt-4o&#x27;,
      ls_model_type: &#x27;chat&#x27;,
      ls_temperature: 1,
      ls_max_tokens: undefined,
      ls_stop: undefined
    }
  },
  {
    event: &#x27;on_chat_model_stream&#x27;,
    data: { chunk: [AIMessageChunk] },
    run_id: &#x27;c983e634-9f1d-4916-97d8-63c3a86102c2&#x27;,
    name: &#x27;ChatOpenAI&#x27;,
    tags: [],
    metadata: {
      ls_provider: &#x27;openai&#x27;,
      ls_model_name: &#x27;gpt-4o&#x27;,
      ls_model_type: &#x27;chat&#x27;,
      ls_temperature: 1,
      ls_max_tokens: undefined,
      ls_stop: undefined
    }
  },
  {
    event: &#x27;on_chat_model_stream&#x27;,
    run_id: &#x27;c983e634-9f1d-4916-97d8-63c3a86102c2&#x27;,
    name: &#x27;ChatOpenAI&#x27;,
    tags: [],
    metadata: {
      ls_provider: &#x27;openai&#x27;,
      ls_model_name: &#x27;gpt-4o&#x27;,
      ls_model_type: &#x27;chat&#x27;,
      ls_temperature: 1,
      ls_max_tokens: undefined,
      ls_stop: undefined
    },
    data: { chunk: [AIMessageChunk] }
  }
]

```

```typescript
events.slice(-2);

```

```text
[
  {
    event: &#x27;on_chat_model_stream&#x27;,
    run_id: &#x27;c983e634-9f1d-4916-97d8-63c3a86102c2&#x27;,
    name: &#x27;ChatOpenAI&#x27;,
    tags: [],
    metadata: {
      ls_provider: &#x27;openai&#x27;,
      ls_model_name: &#x27;gpt-4o&#x27;,
      ls_model_type: &#x27;chat&#x27;,
      ls_temperature: 1,
      ls_max_tokens: undefined,
      ls_stop: undefined
    },
    data: { chunk: [AIMessageChunk] }
  },
  {
    event: &#x27;on_chat_model_end&#x27;,
    data: { output: [AIMessageChunk] },
    run_id: &#x27;c983e634-9f1d-4916-97d8-63c3a86102c2&#x27;,
    name: &#x27;ChatOpenAI&#x27;,
    tags: [],
    metadata: {
      ls_provider: &#x27;openai&#x27;,
      ls_model_name: &#x27;gpt-4o&#x27;,
      ls_model_type: &#x27;chat&#x27;,
      ls_temperature: 1,
      ls_max_tokens: undefined,
      ls_stop: undefined
    }
  }
]

```Chain[​](#chain)Let’s revisit the example chain that parsed streaming JSON to explore the streaming events API.

```typescript
const chain = model.pipe(new JsonOutputParser());
const eventStream = await chain.streamEvents(
  `Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`,
  { version: "v2" }
);

const events = [];
for await (const event of eventStream) {
  events.push(event);
}

console.log(events.length);

```

```text
83

```If you examine at the first few events, you’ll notice that there are 3** different start events rather than **2** start events.

The three start events correspond to:

- The chain (model + parser)
- The model
- The parser

```typescript
events.slice(0, 3);

```**

```text
[
  {
    event: &#x27;on_chain_start&#x27;,
    data: {
      input: &#x27;Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"&#x27;
    },
    name: &#x27;RunnableSequence&#x27;,
    tags: [],
    run_id: &#x27;5dd960b8-4341-4401-8993-7d04d49fcc08&#x27;,
    metadata: {}
  },
  {
    event: &#x27;on_chat_model_start&#x27;,
    data: { input: [Object] },
    name: &#x27;ChatOpenAI&#x27;,
    tags: [ &#x27;seq:step:1&#x27; ],
    run_id: &#x27;5d2917b1-886a-47a1-807d-8a0ba4cb4f65&#x27;,
    metadata: {
      ls_provider: &#x27;openai&#x27;,
      ls_model_name: &#x27;gpt-4o&#x27;,
      ls_model_type: &#x27;chat&#x27;,
      ls_temperature: 1,
      ls_max_tokens: undefined,
      ls_stop: undefined
    }
  },
  {
    event: &#x27;on_parser_start&#x27;,
    data: {},
    name: &#x27;JsonOutputParser&#x27;,
    tags: [ &#x27;seq:step:2&#x27; ],
    run_id: &#x27;756c57d6-d455-484f-a556-79a82c4e1d40&#x27;,
    metadata: {}
  }
]

```What do you think you’d see if you looked at the last 3 events? what about the middle?Let’s use this API to take output the stream events from the model and the parser. We’re ignoring start events, end events and events from the chain.

```typescript
let eventCount = 0;

const eventStream = await chain.streamEvents(
  `Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`,
  { version: "v1" }
);

for await (const event of eventStream) {
  // Truncate the output
  if (eventCount > 30) {
    continue;
  }
  const eventType = event.event;
  if (eventType === "on_llm_stream") {
    console.log(`Chat model chunk: ${event.data.chunk.message.content}`);
  } else if (eventType === "on_parser_stream") {
    console.log(`Parser chunk: ${JSON.stringify(event.data.chunk)}`);
  }
  eventCount += 1;
}

```

```text
Chat model chunk:
Chat model chunk: ```
Chat model chunk: json
Chat model chunk:

Chat model chunk: {

Chat model chunk:
Chat model chunk:  "
Chat model chunk: countries
Chat model chunk: ":
Chat model chunk:  [

Chat model chunk:
Chat model chunk:  {

Chat model chunk:
Chat model chunk:  "
Chat model chunk: name
Chat model chunk: ":
Chat model chunk:  "
Chat model chunk: France
Chat model chunk: ",

Chat model chunk:
Chat model chunk:  "
Chat model chunk: population
Chat model chunk: ":
Chat model chunk:
Chat model chunk: 652
Chat model chunk: 735
Chat model chunk: 11
Chat model chunk:

```Because both the model and the parser support streaming, we see streaming events from both components in real time! Neat! 🦜Filtering Events[​](#filtering-events)Because this API produces so many events, it is useful to be able to filter on events.You can filter by either component name, component tags or component type.By Name[​](#by-name)

```typescript
const chain = model
  .withConfig({ runName: "model" })
  .pipe(new JsonOutputParser().withConfig({ runName: "my_parser" }));

const eventStream = await chain.streamEvents(
  `Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`,
  { version: "v2" },
  { includeNames: ["my_parser"] }
);

let eventCount = 0;

for await (const event of eventStream) {
  // Truncate the output
  if (eventCount > 10) {
    continue;
  }
  console.log(event);
  eventCount += 1;
}

```

```text
{
  event: &#x27;on_parser_start&#x27;,
  data: {
    input: &#x27;Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"&#x27;
  },
  name: &#x27;my_parser&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  run_id: &#x27;0a605976-a8f8-4259-8ef6-b3d7e52b3d4e&#x27;,
  metadata: {}
}
{
  event: &#x27;on_parser_stream&#x27;,
  run_id: &#x27;0a605976-a8f8-4259-8ef6-b3d7e52b3d4e&#x27;,
  name: &#x27;my_parser&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {},
  data: { chunk: { countries: [Array] } }
}
{
  event: &#x27;on_parser_end&#x27;,
  data: { output: { countries: [Array] } },
  run_id: &#x27;0a605976-a8f8-4259-8ef6-b3d7e52b3d4e&#x27;,
  name: &#x27;my_parser&#x27;,
  tags: [ &#x27;seq:step:2&#x27; ],
  metadata: {}
}

```By type[​](#by-type)

```typescript
const chain = model
  .withConfig({ runName: "model" })
  .pipe(new JsonOutputParser().withConfig({ runName: "my_parser" }));

const eventStream = await chain.streamEvents(
  `Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`,
  { version: "v2" },
  { includeTypes: ["chat_model"] }
);

let eventCount = 0;

for await (const event of eventStream) {
  // Truncate the output
  if (eventCount > 10) {
    continue;
  }
  console.log(event);
  eventCount += 1;
}

```

```text
{
  event: &#x27;on_chat_model_start&#x27;,
  data: {
    input: &#x27;Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"&#x27;
  },
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;```&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;json&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;\n&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;{\n&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; &#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; "&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;countries&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;":&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; [\n&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO98p55iuqUNwx4GZ6j2BkDak6Rr&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;fb6351eb-9537-445d-a1bd-24c2e11efd8e&#x27;,
  name: &#x27;model&#x27;,
  tags: [ &#x27;seq:step:1&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}

```By Tags[​](#by-tags)cautionTags are inherited by child components of a given runnable.If you’re using tags to filter, make sure that this is what you want.

```typescript
const chain = model
  .pipe(new JsonOutputParser().withConfig({ runName: "my_parser" }))
  .withConfig({ tags: ["my_chain"] });

const eventStream = await chain.streamEvents(
  `Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`,
  { version: "v2" },
  { includeTags: ["my_chain"] }
);

let eventCount = 0;

for await (const event of eventStream) {
  // Truncate the output
  if (eventCount > 10) {
    continue;
  }
  console.log(event);
  eventCount += 1;
}

```

```text
{
  event: &#x27;on_chain_start&#x27;,
  data: {
    input: &#x27;Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"&#x27;
  },
  name: &#x27;RunnableSequence&#x27;,
  tags: [ &#x27;my_chain&#x27; ],
  run_id: &#x27;1fed60d6-e0b7-4d5e-8ec7-cd7d3ee5c69f&#x27;,
  metadata: {}
}
{
  event: &#x27;on_chat_model_start&#x27;,
  data: { input: { messages: [Array] } },
  name: &#x27;ChatOpenAI&#x27;,
  tags: [ &#x27;seq:step:1&#x27;, &#x27;my_chain&#x27; ],
  run_id: &#x27;ecb99d6e-ce03-445f-aadf-73e6cbbc52fe&#x27;,
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_parser_start&#x27;,
  data: {},
  name: &#x27;my_parser&#x27;,
  tags: [ &#x27;seq:step:2&#x27;, &#x27;my_chain&#x27; ],
  run_id: &#x27;caf24a1e-255c-4937-9f38-6e46275d854a&#x27;,
  metadata: {}
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO99nzUvCsZWCiq6vNtS1Soa1qNp&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;ecb99d6e-ce03-445f-aadf-73e6cbbc52fe&#x27;,
  name: &#x27;ChatOpenAI&#x27;,
  tags: [ &#x27;seq:step:1&#x27;, &#x27;my_chain&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;Certainly&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO99nzUvCsZWCiq6vNtS1Soa1qNp&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;ecb99d6e-ce03-445f-aadf-73e6cbbc52fe&#x27;,
  name: &#x27;ChatOpenAI&#x27;,
  tags: [ &#x27;seq:step:1&#x27;, &#x27;my_chain&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27;!&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO99nzUvCsZWCiq6vNtS1Soa1qNp&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;ecb99d6e-ce03-445f-aadf-73e6cbbc52fe&#x27;,
  name: &#x27;ChatOpenAI&#x27;,
  tags: [ &#x27;seq:step:1&#x27;, &#x27;my_chain&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: " Here&#x27;s",
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO99nzUvCsZWCiq6vNtS1Soa1qNp&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;ecb99d6e-ce03-445f-aadf-73e6cbbc52fe&#x27;,
  name: &#x27;ChatOpenAI&#x27;,
  tags: [ &#x27;seq:step:1&#x27;, &#x27;my_chain&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; the&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO99nzUvCsZWCiq6vNtS1Soa1qNp&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;ecb99d6e-ce03-445f-aadf-73e6cbbc52fe&#x27;,
  name: &#x27;ChatOpenAI&#x27;,
  tags: [ &#x27;seq:step:1&#x27;, &#x27;my_chain&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; JSON&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO99nzUvCsZWCiq6vNtS1Soa1qNp&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;ecb99d6e-ce03-445f-aadf-73e6cbbc52fe&#x27;,
  name: &#x27;ChatOpenAI&#x27;,
  tags: [ &#x27;seq:step:1&#x27;, &#x27;my_chain&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; format&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO99nzUvCsZWCiq6vNtS1Soa1qNp&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;ecb99d6e-ce03-445f-aadf-73e6cbbc52fe&#x27;,
  name: &#x27;ChatOpenAI&#x27;,
  tags: [ &#x27;seq:step:1&#x27;, &#x27;my_chain&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}
{
  event: &#x27;on_chat_model_stream&#x27;,
  data: {
    chunk: AIMessageChunk {
      lc_serializable: true,
      lc_kwargs: [Object],
      lc_namespace: [Array],
      content: &#x27; output&#x27;,
      name: undefined,
      additional_kwargs: {},
      response_metadata: [Object],
      id: &#x27;chatcmpl-9lO99nzUvCsZWCiq6vNtS1Soa1qNp&#x27;,
      tool_calls: [],
      invalid_tool_calls: [],
      tool_call_chunks: [],
      usage_metadata: undefined
    }
  },
  run_id: &#x27;ecb99d6e-ce03-445f-aadf-73e6cbbc52fe&#x27;,
  name: &#x27;ChatOpenAI&#x27;,
  tags: [ &#x27;seq:step:1&#x27;, &#x27;my_chain&#x27; ],
  metadata: {
    ls_provider: &#x27;openai&#x27;,
    ls_model_name: &#x27;gpt-4o&#x27;,
    ls_model_type: &#x27;chat&#x27;,
    ls_temperature: 1,
    ls_max_tokens: undefined,
    ls_stop: undefined
  }
}

```Streaming events over HTTP[​](#streaming-events-over-http)For convenience, streamEvents supports encoding streamed intermediate events as HTTP [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), encoded as bytes. Here’s what that looks like (using a [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder) to reconvert the binary data back into a human readable string):

```typescript
const chain = model
  .pipe(new JsonOutputParser().withConfig({ runName: "my_parser" }))
  .withConfig({ tags: ["my_chain"] });

const eventStream = await chain.streamEvents(
  `Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`,
  {
    version: "v2",
    encoding: "text/event-stream",
  }
);

let eventCount = 0;

const textDecoder = new TextDecoder();

for await (const event of eventStream) {
  // Truncate the output
  if (eventCount > 3) {
    continue;
  }
  console.log(textDecoder.decode(event));
  eventCount += 1;
}

```

```text
event: data
data: {"event":"on_chain_start","data":{"input":"Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of \"countries\" which contains a list of countries. Each country should have the key \"name\" and \"population\""},"name":"RunnableSequence","tags":["my_chain"],"run_id":"41cd92f8-9b8c-4365-8aa0-fda3abdae03d","metadata":{}}

event: data
data: {"event":"on_chat_model_start","data":{"input":{"messages":[[{"lc":1,"type":"constructor","id":["langchain_core","messages","HumanMessage"],"kwargs":{"content":"Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of \"countries\" which contains a list of countries. Each country should have the key \"name\" and \"population\"","additional_kwargs":{},"response_metadata":{}}}]]}},"name":"ChatOpenAI","tags":["seq:step:1","my_chain"],"run_id":"a6c2bc61-c868-4570-a143-164e64529ee0","metadata":{"ls_provider":"openai","ls_model_name":"gpt-4o","ls_model_type":"chat","ls_temperature":1}}

event: data
data: {"event":"on_parser_start","data":{},"name":"my_parser","tags":["seq:step:2","my_chain"],"run_id":"402533c5-0e4e-425d-a556-c30a350972d0","metadata":{}}

event: data
data: {"event":"on_chat_model_stream","data":{"chunk":{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":"","tool_call_chunks":[],"additional_kwargs":{},"id":"chatcmpl-9lO9BAQwbKDy2Ou2RNFUVi0VunAsL","tool_calls":[],"invalid_tool_calls":[],"response_metadata":{"prompt":0,"completion":0,"finish_reason":null}}}},"run_id":"a6c2bc61-c868-4570-a143-164e64529ee0","name":"ChatOpenAI","tags":["seq:step:1","my_chain"],"metadata":{"ls_provider":"openai","ls_model_name":"gpt-4o","ls_model_type":"chat","ls_temperature":1}}

```A nice feature of this format is that you can pass the resulting stream directly into a native [HTTP response object](https://developer.mozilla.org/en-US/docs/Web/API/Response) with the correct headers (commonly used by frameworks like [Hono](https://hono.dev/) and [Next.js](https://nextjs.org/)), then parse that stream on the frontend. Your server-side handler would look something like this:

```typescript
const handler = async () => {
  const eventStream = await chain.streamEvents(
    `Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`,
    {
      version: "v2",
      encoding: "text/event-stream",
    }
  );
  return new Response(eventStream, {
    headers: {
      "content-type": "text/event-stream",
    },
  });
};

```And your frontend could look like this (using the [@microsoft/fetch-event-source](https://www.npmjs.com/package/@microsoft/fetch-event-source) pacakge to fetch and parse the event source):

```typescript
import { fetchEventSource } from "@microsoft/fetch-event-source";

const makeChainRequest = async () => {
  await fetchEventSource("https://your_url_here", {
    method: "POST",
    body: JSON.stringify({
      foo: "bar",
    }),
    onmessage: (message) => {
      if (message.event === "data") {
        console.log(message.data);
      }
    },
    onerror: (err) => {
      console.log(err);
    },
  });
};

```Non-streaming components[​](#non-streaming-components-1)Remember how some components don’t stream well because they don’t operate on input streams**?

While such components can break streaming of the final output when using `stream`, `streamEvents` will still yield streaming events from intermediate steps that support streaming!

```typescript
// A function that operates on finalized inputs
// rather than on an input_stream
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough } from "@langchain/core/runnables";

// A function that does not operates on input streams and breaks streaming.
const extractCountryNames = (inputs: Record<string, any>) => {
  if (!Array.isArray(inputs.countries)) {
    return "";
  }
  return JSON.stringify(inputs.countries.map((country) => country.name));
};

const chain = model.pipe(new JsonOutputParser()).pipe(extractCountryNames);

const stream = await chain.stream(
  `output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`
);

for await (const chunk of stream) {
  console.log(chunk);
}

```

```text
["France","Spain","Japan"]

```As expected, the `stream` API doesn’t work correctly because `extractCountryNames` doesn’t operate on streams.

Now, let’s confirm that with `streamEvents` we’re still seeing streaming output from the model and the parser.

```typescript
const eventStream = await chain.streamEvents(
  `output a list of the countries france, spain and japan and their populations in JSON format.
Use a dict with an outer key of "countries" which contains a list of countries.
Each country should have the key "name" and "population"
Your output should ONLY contain valid JSON data. Do not include any other text or content in your output.`,
  { version: "v2" }
);

let eventCount = 0;

for await (const event of eventStream) {
  // Truncate the output
  if (eventCount > 30) {
    continue;
  }
  const eventType = event.event;
  if (eventType === "on_chat_model_stream") {
    console.log(`Chat model chunk: ${event.data.chunk.message.content}`);
  } else if (eventType === "on_parser_stream") {
    console.log(`Parser chunk: ${JSON.stringify(event.data.chunk)}`);
  } else {
    console.log(eventType);
  }
  eventCount += 1;
}

```

Chat model chunk: Chat model chunk: Here’s Chat model chunk: how Chat model chunk: you Chat model chunk: can Chat model chunk: represent Chat model chunk: the Chat model chunk: countries Chat model chunk: France Chat model chunk: , Chat model chunk: Spain Chat model chunk: , Chat model chunk: and Chat model chunk: Japan Chat model chunk: , Chat model chunk: along Chat model chunk: with Chat model chunk: their Chat model chunk: populations Chat model chunk: , Chat model chunk: in Chat model chunk: JSON Chat model chunk: format Chat model chunk: :

Chat model chunk: ``` Chat model chunk: json Chat model chunk:

Chat model chunk: {

## Related[​](#related)

- [Dispatching custom events](/docs/how_to/callbacks_custom_events)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [LLMs and Chat Models](#llms-and-chat-models)
- [Chains](#chains)[Working with Input Streams](#working-with-input-streams)
- [Non-streaming components](#non-streaming-components)

- [Using Stream Events](#using-stream-events)[Event Reference](#event-reference)
- [Chat Model](#chat-model)
- [Chain](#chain)
- [Filtering Events](#filtering-events)
- [Streaming events over HTTP](#streaming-events-over-http)
- [Non-streaming components](#non-streaming-components-1)

- [Related](#related)

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