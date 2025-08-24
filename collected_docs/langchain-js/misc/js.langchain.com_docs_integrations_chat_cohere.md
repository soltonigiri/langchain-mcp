ChatCohere | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatCohereCohere](https://cohere.com/) is a Canadian startup that provides natural language processing models that help companies improve human-machine interactions.This will help you getting started with Cohere [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatCohere features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_cohere.ChatCohere.html).Overview[​](#overview)Integration details[​](#integration-details)ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/cohere)Package downloadsPackage latest[ChatCohere](https://api.js.langchain.com/classes/langchain_cohere.ChatCohere.html)[@langchain/cohere](https://www.npmjs.com/package/@langchain/cohere)❌beta✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/cohere?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/cohere?style=flat-square&label=%20&.png)Model features[​](#model-features)See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌❌❌❌✅❌❌Setup[​](#setup)In order to use the LangChain.js Cohere integration you’ll need an API key. You can sign up for a Cohere account and create an API key [here](https://dashboard.cohere.com/welcome/register).You’ll first need to install the [@langchain/cohere](https://www.npmjs.com/package/@langchain/cohere) package.Credentials[​](#credentials)Head to [Cohere’s website](https://dashboard.cohere.com/welcome/register) to sign up to Cohere and generate an API key. Once you’ve done this set the COHERE_API_KEY environment variable:

```bash
export COHERE_API_KEY="your-api-key"

```If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

```Installation[​](#installation)The LangChain ChatCohere integration lives in the @langchain/cohere package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/cohere @langchain/core

```

```bash
yarn add @langchain/cohere @langchain/core

```

```bash
pnpm add @langchain/cohere @langchain/core

```Instantiation[​](#instantiation)Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatCohere } from "@langchain/cohere";

const llm = new ChatCohere({
  model: "command-r-plus",
  temperature: 0,
  maxRetries: 2,
  // other params...
});

```Custom client for Cohere on Azure, Cohere on AWS Bedrock, and Standalone Cohere Instance.[​](#custom-client-for-cohere-on-azure-cohere-on-aws-bedrock-and-standalone-cohere-instance.)We can instantiate a custom CohereClient and pass it to the ChatCohere constructor.Note:** If a custom client is provided both COHERE_API_KEY environment variable and apiKey parameter in the constructor will be ignored.

```typescript
import { ChatCohere } from "@langchain/cohere";
import { CohereClient } from "cohere-ai";

const client = new CohereClient({
  token: "<your-api-key>",
  environment: "<your-cohere-deployment-url>", //optional
  // other params
});

const llmWithCustomClient = new ChatCohere({
  client,
  // other params...
});

``` ## Invocation[​](#invocation)

```typescript
const aiMsg = await llm.invoke([
  [
    "system",
    "You are a helpful assistant that translates English to French. Translate the user sentence.",
  ],
  ["human", "I love programming."],
]);
aiMsg;

```

```text
AIMessage {
  "content": "J&#x27;adore programmer.",
  "additional_kwargs": {
    "response_id": "0056057a-6075-4436-b75a-b9455ac39f74",
    "generationId": "3a0985db-92ff-41d8-b6b9-b7b77e300f3b",
    "chatHistory": [
      {
        "role": "SYSTEM",
        "message": "You are a helpful assistant that translates English to French. Translate the user sentence."
      },
      {
        "role": "USER",
        "message": "I love programming."
      },
      {
        "role": "CHATBOT",
        "message": "J&#x27;adore programmer."
      }
    ],
    "finishReason": "COMPLETE",
    "meta": {
      "apiVersion": {
        "version": "1"
      },
      "billedUnits": {
        "inputTokens": 20,
        "outputTokens": 5
      },
      "tokens": {
        "inputTokens": 89,
        "outputTokens": 5
      }
    }
  },
  "response_metadata": {
    "estimatedTokenUsage": {
      "completionTokens": 5,
      "promptTokens": 89,
      "totalTokens": 94
    },
    "response_id": "0056057a-6075-4436-b75a-b9455ac39f74",
    "generationId": "3a0985db-92ff-41d8-b6b9-b7b77e300f3b",
    "chatHistory": [
      {
        "role": "SYSTEM",
        "message": "You are a helpful assistant that translates English to French. Translate the user sentence."
      },
      {
        "role": "USER",
        "message": "I love programming."
      },
      {
        "role": "CHATBOT",
        "message": "J&#x27;adore programmer."
      }
    ],
    "finishReason": "COMPLETE",
    "meta": {
      "apiVersion": {
        "version": "1"
      },
      "billedUnits": {
        "inputTokens": 20,
        "outputTokens": 5
      },
      "tokens": {
        "inputTokens": 89,
        "outputTokens": 5
      }
    }
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 89,
    "output_tokens": 5,
    "total_tokens": 94
  }
}

```

```typescript
console.log(aiMsg.content);

```

```text
J&#x27;adore programmer.

``` ## Chaining[​](#chaining) We can [chain](/docs/how_to/sequence/) our model with a prompt template like so:

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant that translates {input_language} to {output_language}.",
  ],
  ["human", "{input}"],
]);

const chain = prompt.pipe(llm);
await chain.invoke({
  input_language: "English",
  output_language: "German",
  input: "I love programming.",
});

```

```text
AIMessage {
  "content": "Ich liebe Programmieren.",
  "additional_kwargs": {
    "response_id": "271e1439-7220-40fa-953d-c9f2947e451a",
    "generationId": "f99970a4-7b1c-4d76-a73a-4467a1db759c",
    "chatHistory": [
      {
        "role": "SYSTEM",
        "message": "You are a helpful assistant that translates English to German."
      },
      {
        "role": "USER",
        "message": "I love programming."
      },
      {
        "role": "CHATBOT",
        "message": "Ich liebe Programmieren."
      }
    ],
    "finishReason": "COMPLETE",
    "meta": {
      "apiVersion": {
        "version": "1"
      },
      "billedUnits": {
        "inputTokens": 15,
        "outputTokens": 6
      },
      "tokens": {
        "inputTokens": 84,
        "outputTokens": 6
      }
    }
  },
  "response_metadata": {
    "estimatedTokenUsage": {
      "completionTokens": 6,
      "promptTokens": 84,
      "totalTokens": 90
    },
    "response_id": "271e1439-7220-40fa-953d-c9f2947e451a",
    "generationId": "f99970a4-7b1c-4d76-a73a-4467a1db759c",
    "chatHistory": [
      {
        "role": "SYSTEM",
        "message": "You are a helpful assistant that translates English to German."
      },
      {
        "role": "USER",
        "message": "I love programming."
      },
      {
        "role": "CHATBOT",
        "message": "Ich liebe Programmieren."
      }
    ],
    "finishReason": "COMPLETE",
    "meta": {
      "apiVersion": {
        "version": "1"
      },
      "billedUnits": {
        "inputTokens": 15,
        "outputTokens": 6
      },
      "tokens": {
        "inputTokens": 84,
        "outputTokens": 6
      }
    }
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 84,
    "output_tokens": 6,
    "total_tokens": 90
  }
}

``` ## RAG[​](#rag) Cohere also comes out of the box with RAG support. You can pass in documents as context to the API request and Cohere’s models will use them when generating responses.

```typescript
import { ChatCohere } from "@langchain/cohere";
import { HumanMessage } from "@langchain/core/messages";

const llmForRag = new ChatCohere({
  apiKey: process.env.COHERE_API_KEY, // Default
});

const documents = [
  {
    title: "Harrison&#x27;s work",
    snippet: "Harrison worked at Kensho as an engineer.",
  },
  {
    title: "Harrison&#x27;s work duration",
    snippet: "Harrison worked at Kensho for 3 years.",
  },
  {
    title: "Polar berars in the Appalachian Mountains",
    snippet:
      "Polar bears have surprisingly adapted to the Appalachian Mountains, thriving in the diverse, forested terrain despite their traditional arctic habitat. This unique situation has sparked significant interest and study in climate adaptability and wildlife behavior.",
  },
];

const ragResponse = await llmForRag.invoke(
  [new HumanMessage("Where did Harrison work and for how long?")],
  {
    documents,
  }
);
console.log(ragResponse.content);

```

```text
Harrison worked at Kensho as an engineer for 3 years.

``` ## Connectors[​](#connectors) The API also allows for other connections which are not static documents. An example of this is their web-search connector which allows you to pass in a query and the API will search the web for relevant documents. The example below demonstrates how to use this feature.

```typescript
import { ChatCohere } from "@langchain/cohere";
import { HumanMessage } from "@langchain/core/messages";

const llmWithConnectors = new ChatCohere({
  apiKey: process.env.COHERE_API_KEY, // Default
});

const connectorsRes = await llmWithConnectors.invoke(
  [new HumanMessage("How tall are the largest pengiuns?")],
  {
    connectors: [{ id: "web-search" }],
  }
);
console.dir(connectorsRes, { depth: null });

```

```text
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: &#x27;The largest penguin ever discovered is the prehistoric Palaeeudyptes klekowskii, or "colossus penguin", which stood at 6 feet 6 inches tall. The tallest penguin alive today is the emperor penguin, which stands at just over 4 feet tall.&#x27;,
    additional_kwargs: {
      response_id: &#x27;8d5ae032-4c8e-492e-8686-289f198b5eb5&#x27;,
      generationId: &#x27;2224736b-430c-46cf-9ca0-a7f5737466aa&#x27;,
      chatHistory: [
        { role: &#x27;USER&#x27;, message: &#x27;How tall are the largest pengiuns?&#x27; },
        {
          role: &#x27;CHATBOT&#x27;,
          message: &#x27;The largest penguin ever discovered is the prehistoric Palaeeudyptes klekowskii, or "colossus penguin", which stood at 6 feet 6 inches tall. The tallest penguin alive today is the emperor penguin, which stands at just over 4 feet tall.&#x27;
        }
      ],
      finishReason: &#x27;COMPLETE&#x27;,
      meta: {
        apiVersion: { version: &#x27;1&#x27; },
        billedUnits: { inputTokens: 10474, outputTokens: 62 },
        tokens: { inputTokens: 11198, outputTokens: 286 }
      },
      citations: [
        {
          start: 43,
          end: 54,
          text: &#x27;prehistoric&#x27;,
          documentIds: [ &#x27;web-search_1&#x27;, &#x27;web-search_2&#x27; ]
        },
        {
          start: 55,
          end: 79,
          text: &#x27;Palaeeudyptes klekowskii&#x27;,
          documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_1&#x27;, &#x27;web-search_2&#x27; ]
        },
        {
          start: 84,
          end: 102,
          text: &#x27;"colossus penguin"&#x27;,
          documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_1&#x27;, &#x27;web-search_2&#x27; ]
        },
        {
          start: 119,
          end: 125,
          text: &#x27;6 feet&#x27;,
          documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_1&#x27; ]
        },
        {
          start: 126,
          end: 134,
          text: &#x27;6 inches&#x27;,
          documentIds: [ &#x27;web-search_1&#x27; ]
        },
        {
          start: 161,
          end: 172,
          text: &#x27;alive today&#x27;,
          documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_5&#x27; ]
        },
        {
          start: 180,
          end: 195,
          text: &#x27;emperor penguin&#x27;,
          documentIds: [
            &#x27;web-search_0&#x27;,
            &#x27;web-search_1&#x27;,
            &#x27;web-search_2&#x27;,
            &#x27;web-search_4&#x27;,
            &#x27;web-search_5&#x27;
          ]
        },
        {
          start: 213,
          end: 235,
          text: &#x27;just over 4 feet tall.&#x27;,
          documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_5&#x27; ]
        }
      ],
      documents: [
        {
          id: &#x27;web-search_1&#x27;,
          snippet: &#x27;Largest species of penguin ever\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;TencentContact an Account Manager\n&#x27; +
            &#x27;\n&#x27; +
            "The largest species of penguin ever recorded is a newly described prehistoric species, Kumimanu fordycei, known from fossil remains discovered inside boulders in North Otago, on New Zealand&#x27;s South Island. By comparing the size and density of its bones with those of modern-day penguins, researchers estimate that it weighed 154 kilograms (340 pounds), which is three times that of today&#x27;s largest species, the emperor penguin (Aptenodytes forsteri). The rocks containing the remains of this new giant fossil species date between 55.5 million years and 59.5 million years old, meaning that it existed during the Late Palaeocene. Details of the record-breaking prehistoric penguin were published in the Journal of Paleontology on 8 February 2023.\n" +
            &#x27;\n&#x27; +
            &#x27;The height of K. fordycei is debated, though a related extinct species, K. biceae, has been estimated to have stood up to 1.77 m (5 ft). A lack of complete skeletons of extinct giant penguins found to date makes it difficult for height to be determined with any degree of certainty.\n&#x27; +
            &#x27;\n&#x27; +
            "Prior to the recent discovery and description of K. fordycei, the largest species of penguin known to science was the colossus penguin (Palaeeudyptes klekowskii), which is estimated to have weighed as much as 115 kg (253 lb 8 oz), and stood up to 2 m (6 ft 6 in) tall. It lived in Antarctica&#x27;s Seymour Island approximately 37 million years ago, during the Late Eocene, and is represented by the most complete fossil remains ever found for a penguin species in Antarctica.\n" +
            &#x27;\n&#x27; +
            "This species exceeds in height the previous record holder, Nordenskjoeld&#x27;s giant penguin (Anthropornis nordenskjoeldi), which stood 1.7 m (5 ft 6 in) tall and also existed during the Eocene epoch, occurring in New Zealand and in Antarctica&#x27;s Seymour Island.\n" +
            &#x27;\n&#x27; +
            &#x27;Records change on a daily basis and are not immediately published online. For a full list of record titles, please use our Record Application Search. (You will need to register / login for access)\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Comments below may relate to previous holders of this record.&#x27;,
          timestamp: &#x27;2024-07-28T02:56:04&#x27;,
          title: &#x27;Largest species of penguin ever&#x27;,
          url: &#x27;https://www.guinnessworldrecords.com/world-records/84903-largest-species-of-penguin&#x27;
        },
        {
          id: &#x27;web-search_2&#x27;,
          snippet: &#x27;Mega penguins: These are the largest penguins to have ever lived\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;No penguin alive today can compare with some of the extinct giants that once roamed the planet, including Kumimanu fordycei, Petradyptes stonehousei and Palaeeudyptes klekowskii\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;An illustration of Kumimanu fordycei (the larger, single bird) and Petradyptes stonehousei penguins on an ancient New Zealand beach\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Artwork by Dr. Simone Giovanardi\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Penguins come in all shapes and sizes, from the fairy penguin (Eudyptula minor) which stands at just over 30 centimetres tall to the 1-metre-high emperor penguin (Aptenodytes forsteri). But even the biggest emperors alive today would be dwarfed by the mega-penguins that roamed Earth millions of years ago. Here are the most impressive of these ancient giants.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The title of the largest penguin ever documented goes to the species Kumimanu fordycei, which was first described in February 2023.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Daniel Ksepka at the Bruce Museum in Connecticut and his colleagues unearthed an unusually huge flipper bone of a penguin in southern New Zealand in 2018. “The big humerus was shocking to me,” he says. “I almost thought it was maybe some other animal.”\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The team quickly determined that this belonged to a new species of penguin that lived in what is now New Zealand over 55 million years ago. The sheer size of the bone suggested that the bird probably weighed between 148 and 160 kilograms and stood around 1.6 metres tall. “The emperor penguin just looks like a child next to it,” says Ksepka.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The species was named after palaeontologist Ewan Fordyce, who made his own mega penguin discoveries in the 1970s (see below).\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Sign up to our Wild Wild Life newsletter\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;A monthly celebration of the biodiversity of our planet’s animals, plants and other organisms.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Sign up to newsletter\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Skeletons of Kumimanu, Petradyptes and a modern emperor penguin\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Artwork by Dr. Simone Giovanardi\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Petradyptes stonehousei\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Ksepka and his colleagues discovered another giant penguin alongside K. fordycei, called Petradyptes stonehousei. With an estimated mass of 50 kilograms, it was quite a bit smaller than its contemporary. Its name comes from the Greek “petra” for rock and “dyptes” for diver, while “stonehousei” was chosen to honour British polar scientist Bernard Stonehouse.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Both K. fordycei and P. stonehousei retained features seen in much earlier penguin species, such as slimmer flipper bones and muscle attachment points that look like those seen in flying birds.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;“Both penguins really add to the case that penguins got their start in New Zealand,” says Ksepka.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Illustration of the extinct Palaeeudyptes klekowskii with a human and emperor penguin for scale\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Nature Picture Library / Alamy\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Palaeeudyptes klekowskii\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;While K. fordycei was the heaviest penguin, it wasn’t the tallest. That award goes to Palaeeudyptes klekowskii, dubbed the colossus penguin, which towered at 2 metres and weighed a hefty 115 kilograms.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The species lived 37 to 40 million years ago along the Antarctic coast. Its fossil, which included the longest fused ankle-foot bone, is one of the most complete ever uncovered from the Antarctic.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Owing to their larger body size, giant penguins could remain underwater longer than smaller ones. Experts reckon that a species such as P. klekowskii could have remained submerged for up to 40 minutes hunting for fish.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Pachydyptes ponderosus\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Pachydyptes ponderosus is prehistoric giant that lived more recently than those already mentioned – around 37 to 34 million years ago. Based on the few bones from the species that have been recovered, in 2006 Ksepka and his colleagues put it around 1.5 metres tall with a weight of over 100 kilograms.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;“We really only have parts of the flipper and shoulder, but we think it would have been quite a thick, stocky animal,” says Ksepka. “Its humerus is just so wide.”\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Daniel Ksepka with a model of a Kairuku penguin\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The three species that belonged to the genus Kairuku (K. grebneffi, K. waitaki and K. waewaeroa), however, were the complete opposite.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;“If Pachydyptes is like a big, heavy football lineman, then you can think of Kairuku as a really tall, skinny basketball player,” says Ksepka. “They’re both really big, but in different ways.”\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The first Kairuku bones were discovered by Ewan Fordyce in the 1970s, in New Zealand. All three species lived roughly 34 to 27 million years ago. The tallest, K. waewaeroa, stood at a height of around 1.4 metres and weighed around 80 kilograms.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;“They were graceful penguins, with slender trunks,” says Ksepka.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Sign up to our weekly newsletter\n&#x27; +
            &#x27;\n&#x27; +
            "Receive a weekly dose of discovery in your inbox! We&#x27;ll also keep you up to date with New Scientist events and special offers. Sign up\n" +
            &#x27;\n&#x27; +
            &#x27;More from New Scientist\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Explore the latest news, articles and features\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Extremely rare black penguin spotted in Antarctica\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;How you can help with penguin research by browsing images at home\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Adélie penguins show signs of self-awareness on the mirror test\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Penguins adapt their accents to sound more like their friends\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Trending New Scientist articles\n&#x27; +
            &#x27;\n&#x27; +
            "SpaceX prepares for Starship flight with first &#x27;chopstick&#x27; landing\n" +
            &#x27;\n&#x27; +
            &#x27;Evidence mounts that shingles vaccines protect against dementia\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;When is the best time to exercise to get the most from your workout?\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Why slow running could be even more beneficial than running fast\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Wafer-thin light sail could help us reach another star sooner\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The remarkable science-backed ways to get fit as fast as possible\n&#x27; +
            &#x27;\n&#x27; +
            "One of Earth&#x27;s major carbon sinks collapsed in 2023\n" +
            &#x27;\n&#x27; +
            &#x27;How to use psychology to hack your mind and fall in love with exercise\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Gene therapy enables five children who were born deaf to hear\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Why midlife is the perfect time to take control of your future health&#x27;,
          timestamp: &#x27;2024-07-28T02:56:04&#x27;,
          title: &#x27;Mega penguins: The tallest, largest, most amazing penguin species to have ever lived | New Scientist&#x27;,
          url: &#x27;https://www.newscientist.com/article/2397894-mega-penguins-these-are-the-largest-penguins-to-have-ever-lived/&#x27;
        },
        {
          id: &#x27;web-search_0&#x27;,
          snippet: &#x27;Sustainability for All.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Giant 6-Foot-8 Penguin Discovered in Antarctica\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;University of Houston\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Bryan Nelson is a science writer and award-winning documentary filmmaker with over a decade of experience covering technology, astronomy, medicine, animals, and more.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Learn about our editorial process\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Updated May 9, 2020 10:30AM EDT\n&#x27; +
            &#x27;\n&#x27; +
            "Modern emperor penguins are certainly statuesque, but not quite as impressive as the &#x27;colossus penguin&#x27; would have been. . Christopher Michel/flickr\n" +
            &#x27;\n&#x27; +
            &#x27;The largest penguin species ever discovered has been unearthed in Antarctica, and its size is almost incomprehensible. Standing at 6 foot 8 inches from toe to beak tip, the mountainous bird would have dwarfed most adult humans, reports the Guardian.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;In fact, if it were alive today the penguin could have looked basketball superstar LeBron James square in the eyes.\n&#x27; +
            &#x27;\n&#x27; +
            "Fossils Provide Clues to the Bird&#x27;s Size\n" +
            &#x27;\n&#x27; +
            `The bird&#x27;s 37-million-year-old fossilized remains, which include the longest recorded fused ankle-foot bone as well as parts of the animal&#x27;s wing bone, represent the most complete fossil ever uncovered in the Antarctic. Appropriately dubbed the "colossus penguin," Palaeeudyptes klekowskii was truly the Godzilla of aquatic birds.\n` +
            &#x27;\n&#x27; +
            `Scientists calculated the penguin&#x27;s dimensions by scaling the sizes of its bones against those of modern penguin species. They estimate that the bird probably would have weighed about 250 pounds — again, roughly comparable to LeBron James. By comparison, the largest species of penguin alive today, the emperor penguin, is "only" about 4 feet tall and can weigh as much as 100 pounds.\n` +
            &#x27;\n&#x27; +
            &#x27;Interestingly, because larger bodied penguins can hold their breath for longer, the colossus penguin probably could have stayed underwater for 40 minutes or more. It boggles the mind to imagine the kinds of huge, deep sea fish this mammoth bird might have been capable of hunting.\n&#x27; +
            &#x27;\n&#x27; +
            "The fossil was found at the La Meseta formation on Seymour Island, an island in a chain of 16 major islands around the tip of the Graham Land on the Antarctic Peninsula. (It&#x27;s the region that is the closest part of Antarctica to South America.) The area is known for its abundance of penguin bones, though in prehistoric times it would have been much warmer than it is today.\n" +
            &#x27;\n&#x27; +
            "P. klekowskii towers over the next largest penguin ever discovered, a 5-foot-tall bird that lived about 36 million years ago in Peru. Since these two species were near contemporaries, it&#x27;s fun to imagine a time between 35 and 40 million years ago when giant penguins walked the Earth, and perhaps swam alongside the ancestors of whales.\n" +
            &#x27;\n&#x27; +
            &#x27;10 of the Largest Living Sea Creatures\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;11 Facts About Blue Whales, the Largest Animals Ever on Earth\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;16 Ocean Creatures That Live in Total Darkness\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;National Monuments Designated By President Obama\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;20 Pygmy Animal Species From Around the World\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;School Kids Discover New Penguin Species in New Zealand\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;16 of the Most Surreal Landscapes on Earth\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;12 Peculiar Penguin Facts\n&#x27; +
            &#x27;\n&#x27; +
            "10 Amazing Hoodoos Around the World and How They&#x27;re Formed\n" +
            &#x27;\n&#x27; +
            &#x27;8 Titanic Facts About Patagotitans\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;9 Extinct Megafauna That Are Out of This World\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;10 Places Where Penguins Live in the Wild\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;16 Animals That Are Living Fossils\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;A Timeline of the Distant Future for Life on Earth\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;12 Animals That May Have Inspired Mythical Creatures\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;12 Dinosaur Theme Parks\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;By clicking “Accept All Cookies”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Cookies Settings Accept All Cookies&#x27;,
          timestamp: &#x27;2024-07-27T06:29:15&#x27;,
          title: &#x27;Giant 6-Foot-8 Penguin Discovered in Antarctica&#x27;,
          url: &#x27;https://www.treehugger.com/giant-foot-penguin-discovered-in-antarctica-4864169&#x27;
        },
        {
          id: &#x27;web-search_5&#x27;,
          snippet: &#x27;Skip to main content\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Smithsonian Institution\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Search Smithsonian Ocean\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Follow us on Facebook Follow us on Twitter Follow us on Flickr Follow us on Tumbr\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;How Big Do Penguins Get?\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;(Smithsonian Institution)\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The largest of the penguins, the emperor, stands at just over four feet while the smallest, the little penguin, has a maximum height of a foot. \n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Coasts & Shallow Water\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Census of Marine Life\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Waves, Storms & Tsunamis\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Temperature & Chemistry\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Solutions & Success Stories\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Books, Film & The Arts\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Search Smithsonian Ocean&#x27;,
          timestamp: &#x27;2024-07-30T03:47:03&#x27;,
          title: &#x27;How Big Do Penguins Get? | Smithsonian Ocean&#x27;,
          url: &#x27;https://ocean.si.edu/ocean-life/seabirds/how-big-do-penguins-get&#x27;
        },
        {
          id: &#x27;web-search_4&#x27;,
          snippet: &#x27;The emperor penguin (Aptenodytes forsteri) is the tallest and heaviest of all living penguin species and is endemic to Antarctica. The male and female are similar in plumage and size, reaching 100 cm (39 in) in length and weighing from 22 to 45 kg (49 to 99 lb). Feathers of the head and back are black and sharply delineated from the white belly, pale-yellow breast and bright-yellow ear patches.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Like all penguins, it is flightless, with a streamlined body, and wings stiffened and flattened into flippers for a marine habitat. Its diet consists primarily of fish, but also includes crustaceans, such as krill, and cephalopods, such as squid. While hunting, the species can remain submerged around 20 minutes, diving to a depth of 535 m (1,755 ft). It has several adaptations to facilitate this, including an unusually structured haemoglobin to allow it to function at low oxygen levels, solid bones to reduce barotrauma, and the ability to reduce its metabolism and shut down non-essential organ functions.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The only penguin species that breeds during the Antarctic winter, emperor penguins trek 50–120 km (31–75 mi) over the ice to breeding colonies which can contain up to several thousand individuals. The female lays a single egg, which is incubated for just over two months by the male while the female returns to the sea to feed; parents subsequently take turns foraging at sea and caring for their chick in the colony. The lifespan is typically 20 years in the wild, although observations suggest that some individuals may live to 50 years of age.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Emperor penguins were described in 1844 by English zoologist George Robert Gray, who created the generic name from Ancient Greek word elements, ἀ-πτηνο-δύτης [a-ptēno-dytēs], "without-wings-diver". Its specific name is in honour of the German naturalist Johann Reinhold Forster, who accompanied Captain James Cook on his second voyage and officially named five other penguin species. Forster may have been the first person to see the penguins in 1773–74, when he recorded a sighting of what he believed was the similar king penguin (A. patagonicus) but given the location, may very well have been A. forsteri.\n&#x27; +
            &#x27;\n&#x27; +
            "Together with the king penguin, the emperor penguin is one of two extant species in the genus Aptenodytes. Fossil evidence of a third species—Ridgen&#x27;s penguin (A. ridgeni)—has been found in fossil records from the late Pliocene, about three million years ago, in New Zealand. Studies of penguin behaviour and genetics have proposed that the genus Aptenodytes is basal; in other words, that it split off from a branch which led to all other living penguin species. Mitochondrial and nuclear DNA evidence suggests this split occurred around 40 million years ago.\n" +
            &#x27;\n&#x27; +
            &#x27;Adult emperor penguins are 110–120 cm (43–47 in) in length, averaging 115 centimetres (45 in) according to Stonehouse (1975). Due to method of bird measurement that measures length between bill to tail, sometimes body length and standing height are confused, and some reported height even reaching 1.5 metres (4.9 ft) tall. There are still more than a few papers mentioning that they reach a standing height of 1.2 metres (3.9 ft) instead of body length. Although standing height of emperor penguin is rarely provided at scientific reports, Prévost (1961) recorded 86 wild individuals and measured maximum height of 1.08 metres (3.5 ft). Friedman (1945) recorded measurements from 22 wild individuals and resulted height ranging 83–97 cm (33–38 in). Ksepka et al. (2012) measured standing height of 81–94 cm (32–37 in) according to 11 complete skins collected in American Museum of Natural History. The weight ranges from 22.7 to 45.4 kg (50 to 100 lb) and varies by sex, with males weighing more than females. It is the fifth heaviest living bird species, after only the larger varieties of ratite. The weight also varies by season, as both male and female penguins lose substantial mass while raising hatchlings and incubating their egg. A male emperor penguin must withstand the extreme Antarctic winter cold for more than two months while protecting his egg. He eats nothing during this time. Most male emperors will lose around 12 kg (26 lb) while they wait for their eggs to hatch. The mean weight of males at the start of the breeding season is 38 kg (84 lb) and that of females is 29.5 kg (65 lb). After the breeding season this drops to 23 kg (51 lb) for both sexes.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Like all penguin species, emperor penguins have streamlined bodies to minimize drag while swimming, and wings that are more like stiff, flat flippers. The tongue is equipped with rear-facing barbs to prevent prey from escaping when caught. Males and females are similar in size and colouration. The adult has deep black dorsal feathers, covering the head, chin, throat, back, dorsal part of the flippers, and tail. The black plumage is sharply delineated from the light-coloured plumage elsewhere. The underparts of the wings and belly are white, becoming pale yellow in the upper breast, while the ear patches are bright yellow. The upper mandible of the 8 cm (3 in) long bill is black, and the lower mandible can be pink, orange or lilac. In juveniles, the auricular patches, chin and throat are white, while its bill is black. Emperor penguin chicks are typically covered with silver-grey down and have black heads and white masks. A chick with all-white plumage was seen in 2001, but was not considered to be an albino as it did not have pink eyes. Chicks weigh around 315 g (11 oz) after hatching, and fledge when they reach about 50% of adult weight.\n&#x27; +
            &#x27;\n&#x27; +
            "The emperor penguin&#x27;s dark plumage fades to brown from November until February (the Antarctic summer), before the yearly moult in January and February. Moulting is rapid in this species compared with other birds, taking only around 34 days. Emperor penguin feathers emerge from the skin after they have grown to a third of their total length, and before old feathers are lost, to help reduce heat loss. New feathers then push out the old ones before finishing their growth.\n" +
            &#x27;\n&#x27; +
            &#x27;The average yearly survival rate of an adult emperor penguin has been measured at 95.1%, with an average life expectancy of 19.9 years. The same researchers estimated that 1% of emperor penguins hatched could feasibly reach an age of 50 years. In contrast, only 19% of chicks survive their first year of life. Therefore, 80% of the emperor penguin population comprises adults five years and older.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;As the species has no fixed nest sites that individuals can use to locate their own partner or chick, emperor penguins must rely on vocal calls alone for identification. They use a complex set of calls that are critical to individual recognition between parents, offspring and mates, displaying the widest variation in individual calls of all penguins. Vocalizing emperor penguins use two frequency bands simultaneously. Chicks use a frequency-modulated whistle to beg for food and to contact parents.\n&#x27; +
            &#x27;\n&#x27; +
            "The emperor penguin breeds in the coldest environment of any bird species; air temperatures may reach −40 °C (−40 °F), and wind speeds may reach 144 km/h (89 mph). Water temperature is a frigid −1.8 °C (28.8 °F), which is much lower than the emperor penguin&#x27;s average body temperature of 39 °C (102 °F). The species has adapted in several ways to counteract heat loss. Dense feathers provide 80–90% of its insulation and it has a layer of sub-dermal fat which may be up to 3 cm (1.2 in) thick before breeding. While the density of contour feathers is approximately 9 per square centimetre (58 per square inch), a combination of dense afterfeathers and down feathers (plumules) likely play a critical role for insulation. Muscles allow the feathers to be held erect on land, reducing heat loss by trapping a layer of air next to the skin. Conversely, the plumage is flattened in water, thus waterproofing the skin and the downy underlayer. Preening is vital in facilitating insulation and in keeping the plumage oily and water-repellent.\n" +
            &#x27;\n&#x27; +
            &#x27;The emperor penguin is able to thermoregulate (maintain its core body temperature) without altering its metabolism, over a wide range of temperatures. Known as the thermoneutral range, this extends from −10 to 20 °C (14 to 68 °F). Below this temperature range, its metabolic rate increases significantly, although an individual can maintain its core temperature from 38.0 °C (100.4 °F) down to −47 °C (−53 °F). Movement by swimming, walking, and shivering are three mechanisms for increasing metabolism; a fourth process involves an increase in the breakdown of fats by enzymes, which is induced by the hormone glucagon. At temperatures above 20 °C (68 °F), an emperor penguin may become agitated as its body temperature and metabolic rate rise to increase heat loss. Raising its wings and exposing the undersides increases the exposure of its body surface to the air by 16%, facilitating further heat loss.\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;Adaptations to pressure and low oxygen\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;In addition to the cold, the emperor penguin encounters another stressful condition on deep dives—markedly increased pressure of up to 40 times that of the surface, which in most other terrestrial organisms would cause barotrauma. The bones of the penguin are solid rather than air-filled, which eliminates the risk of mechanical barotrauma.\n&#x27; +
            &#x27;\n&#x27; +
            "While diving, the emperor penguin&#x27;s oxygen use is markedly reduced, as its heart rate is reduced to as low as 15–20 beats per minute and non-essential organs are shut down, thus facilitating longer dives. Its haemoglobin and myoglobin are able to bind and transport oxygen at low blood concentrations; this allows the bird to function with very low oxygen levels that would otherwise result in loss of consciousness.\n" +
            &#x27;\n&#x27; +
            &#x27;Distribution and habitat\n&#x27; +
            &#x27;\n&#x27; +
            &#x27;The emperor penguin has a circumpolar distribution in the Antarctic almost exclusively between the 66° and 77° south latitudes. It almost always breeds on stable pack ice near the coast and up to 18 km (11 mi) offshore. Breeding colonies are usually in areas where ice cliffs and i&#x27;... 22063 more characters,
          timestamp: &#x27;2024-07-31T07:59:36&#x27;,
          title: &#x27;Emperor penguin - Wikipedia&#x27;,
          url: &#x27;https://en.wikipedia.org/wiki/Emperor_penguin&#x27;
        }
      ],
      searchResults: [
        {
          searchQuery: {
            text: &#x27;How tall are the largest penguins?&#x27;,
            generationId: &#x27;8d5ae032-4c8e-492e-8686-289f198b5eb5&#x27;
          },
          documentIds: [
            &#x27;web-search_0&#x27;,
            &#x27;web-search_1&#x27;,
            &#x27;web-search_2&#x27;,
            &#x27;web-search_3&#x27;,
            &#x27;web-search_4&#x27;,
            &#x27;web-search_5&#x27;
          ],
          connector: { id: &#x27;web-search&#x27; }
        }
      ],
      searchQueries: [
        {
          text: &#x27;How tall are the largest penguins?&#x27;,
          generationId: &#x27;8d5ae032-4c8e-492e-8686-289f198b5eb5&#x27;
        }
      ]
    },
    tool_calls: [],
    usage_metadata: { input_tokens: 11198, output_tokens: 286, total_tokens: 11484 },
    invalid_tool_calls: [],
    response_metadata: {}
  },
  lc_namespace: [ &#x27;langchain_core&#x27;, &#x27;messages&#x27; ],
  content: &#x27;The largest penguin ever discovered is the prehistoric Palaeeudyptes klekowskii, or "colossus penguin", which stood at 6 feet 6 inches tall. The tallest penguin alive today is the emperor penguin, which stands at just over 4 feet tall.&#x27;,
  name: undefined,
  additional_kwargs: {
    response_id: &#x27;8d5ae032-4c8e-492e-8686-289f198b5eb5&#x27;,
    generationId: &#x27;2224736b-430c-46cf-9ca0-a7f5737466aa&#x27;,
    chatHistory: [
      { role: &#x27;USER&#x27;, message: &#x27;How tall are the largest pengiuns?&#x27; },
      {
        role: &#x27;CHATBOT&#x27;,
        message: &#x27;The largest penguin ever discovered is the prehistoric Palaeeudyptes klekowskii, or "colossus penguin", which stood at 6 feet 6 inches tall. The tallest penguin alive today is the emperor penguin, which stands at just over 4 feet tall.&#x27;
      }
    ],
    finishReason: &#x27;COMPLETE&#x27;,
    meta: {
      apiVersion: { version: &#x27;1&#x27; },
      billedUnits: { inputTokens: 10474, outputTokens: 62 },
      tokens: { inputTokens: 11198, outputTokens: 286 }
    },
    citations: [
      {
        start: 43,
        end: 54,
        text: &#x27;prehistoric&#x27;,
        documentIds: [ &#x27;web-search_1&#x27;, &#x27;web-search_2&#x27; ]
      },
      {
        start: 55,
        end: 79,
        text: &#x27;Palaeeudyptes klekowskii&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_1&#x27;, &#x27;web-search_2&#x27; ]
      },
      {
        start: 84,
        end: 102,
        text: &#x27;"colossus penguin"&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_1&#x27;, &#x27;web-search_2&#x27; ]
      },
      {
        start: 119,
        end: 125,
        text: &#x27;6 feet&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_1&#x27; ]
      },
      {
        start: 126,
        end: 134,
        text: &#x27;6 inches&#x27;,
        documentIds: [ &#x27;web-search_1&#x27; ]
      },
      {
        start: 161,
        end: 172,
        text: &#x27;alive today&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_5&#x27; ]
      },
      {
        start: 180,
        end: 195,
        text: &#x27;emperor penguin&#x27;,
        documentIds: [
          &#x27;web-search_0&#x27;,
          &#x27;web-search_1&#x27;,
          &#x27;web-search_2&#x27;,
          &#x27;web-search_4&#x27;,
          &#x27;web-search_5&#x27;
        ]
      },
      {
        start: 213,
        end: 235,
        text: &#x27;just over 4 feet tall.&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_5&#x27; ]
      }
    ],
    documents: [
      {
        id: &#x27;web-search_1&#x27;,
        snippet: &#x27;Largest species of penguin ever\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;TencentContact an Account Manager\n&#x27; +
          &#x27;\n&#x27; +
          "The largest species of penguin ever recorded is a newly described prehistoric species, Kumimanu fordycei, known from fossil remains discovered inside boulders in North Otago, on New Zealand&#x27;s South Island. By comparing the size and density of its bones with those of modern-day penguins, researchers estimate that it weighed 154 kilograms (340 pounds), which is three times that of today&#x27;s largest species, the emperor penguin (Aptenodytes forsteri). The rocks containing the remains of this new giant fossil species date between 55.5 million years and 59.5 million years old, meaning that it existed during the Late Palaeocene. Details of the record-breaking prehistoric penguin were published in the Journal of Paleontology on 8 February 2023.\n" +
          &#x27;\n&#x27; +
          &#x27;The height of K. fordycei is debated, though a related extinct species, K. biceae, has been estimated to have stood up to 1.77 m (5 ft). A lack of complete skeletons of extinct giant penguins found to date makes it difficult for height to be determined with any degree of certainty.\n&#x27; +
          &#x27;\n&#x27; +
          "Prior to the recent discovery and description of K. fordycei, the largest species of penguin known to science was the colossus penguin (Palaeeudyptes klekowskii), which is estimated to have weighed as much as 115 kg (253 lb 8 oz), and stood up to 2 m (6 ft 6 in) tall. It lived in Antarctica&#x27;s Seymour Island approximately 37 million years ago, during the Late Eocene, and is represented by the most complete fossil remains ever found for a penguin species in Antarctica.\n" +
          &#x27;\n&#x27; +
          "This species exceeds in height the previous record holder, Nordenskjoeld&#x27;s giant penguin (Anthropornis nordenskjoeldi), which stood 1.7 m (5 ft 6 in) tall and also existed during the Eocene epoch, occurring in New Zealand and in Antarctica&#x27;s Seymour Island.\n" +
          &#x27;\n&#x27; +
          &#x27;Records change on a daily basis and are not immediately published online. For a full list of record titles, please use our Record Application Search. (You will need to register / login for access)\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Comments below may relate to previous holders of this record.&#x27;,
        timestamp: &#x27;2024-07-28T02:56:04&#x27;,
        title: &#x27;Largest species of penguin ever&#x27;,
        url: &#x27;https://www.guinnessworldrecords.com/world-records/84903-largest-species-of-penguin&#x27;
      },
      {
        id: &#x27;web-search_2&#x27;,
        snippet: &#x27;Mega penguins: These are the largest penguins to have ever lived\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;No penguin alive today can compare with some of the extinct giants that once roamed the planet, including Kumimanu fordycei, Petradyptes stonehousei and Palaeeudyptes klekowskii\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;An illustration of Kumimanu fordycei (the larger, single bird) and Petradyptes stonehousei penguins on an ancient New Zealand beach\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Artwork by Dr. Simone Giovanardi\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Penguins come in all shapes and sizes, from the fairy penguin (Eudyptula minor) which stands at just over 30 centimetres tall to the 1-metre-high emperor penguin (Aptenodytes forsteri). But even the biggest emperors alive today would be dwarfed by the mega-penguins that roamed Earth millions of years ago. Here are the most impressive of these ancient giants.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The title of the largest penguin ever documented goes to the species Kumimanu fordycei, which was first described in February 2023.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Daniel Ksepka at the Bruce Museum in Connecticut and his colleagues unearthed an unusually huge flipper bone of a penguin in southern New Zealand in 2018. “The big humerus was shocking to me,” he says. “I almost thought it was maybe some other animal.”\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The team quickly determined that this belonged to a new species of penguin that lived in what is now New Zealand over 55 million years ago. The sheer size of the bone suggested that the bird probably weighed between 148 and 160 kilograms and stood around 1.6 metres tall. “The emperor penguin just looks like a child next to it,” says Ksepka.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The species was named after palaeontologist Ewan Fordyce, who made his own mega penguin discoveries in the 1970s (see below).\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Sign up to our Wild Wild Life newsletter\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;A monthly celebration of the biodiversity of our planet’s animals, plants and other organisms.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Sign up to newsletter\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Skeletons of Kumimanu, Petradyptes and a modern emperor penguin\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Artwork by Dr. Simone Giovanardi\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Petradyptes stonehousei\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Ksepka and his colleagues discovered another giant penguin alongside K. fordycei, called Petradyptes stonehousei. With an estimated mass of 50 kilograms, it was quite a bit smaller than its contemporary. Its name comes from the Greek “petra” for rock and “dyptes” for diver, while “stonehousei” was chosen to honour British polar scientist Bernard Stonehouse.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Both K. fordycei and P. stonehousei retained features seen in much earlier penguin species, such as slimmer flipper bones and muscle attachment points that look like those seen in flying birds.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;“Both penguins really add to the case that penguins got their start in New Zealand,” says Ksepka.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Illustration of the extinct Palaeeudyptes klekowskii with a human and emperor penguin for scale\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Nature Picture Library / Alamy\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Palaeeudyptes klekowskii\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;While K. fordycei was the heaviest penguin, it wasn’t the tallest. That award goes to Palaeeudyptes klekowskii, dubbed the colossus penguin, which towered at 2 metres and weighed a hefty 115 kilograms.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The species lived 37 to 40 million years ago along the Antarctic coast. Its fossil, which included the longest fused ankle-foot bone, is one of the most complete ever uncovered from the Antarctic.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Owing to their larger body size, giant penguins could remain underwater longer than smaller ones. Experts reckon that a species such as P. klekowskii could have remained submerged for up to 40 minutes hunting for fish.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Pachydyptes ponderosus\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Pachydyptes ponderosus is prehistoric giant that lived more recently than those already mentioned – around 37 to 34 million years ago. Based on the few bones from the species that have been recovered, in 2006 Ksepka and his colleagues put it around 1.5 metres tall with a weight of over 100 kilograms.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;“We really only have parts of the flipper and shoulder, but we think it would have been quite a thick, stocky animal,” says Ksepka. “Its humerus is just so wide.”\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Daniel Ksepka with a model of a Kairuku penguin\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The three species that belonged to the genus Kairuku (K. grebneffi, K. waitaki and K. waewaeroa), however, were the complete opposite.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;“If Pachydyptes is like a big, heavy football lineman, then you can think of Kairuku as a really tall, skinny basketball player,” says Ksepka. “They’re both really big, but in different ways.”\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The first Kairuku bones were discovered by Ewan Fordyce in the 1970s, in New Zealand. All three species lived roughly 34 to 27 million years ago. The tallest, K. waewaeroa, stood at a height of around 1.4 metres and weighed around 80 kilograms.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;“They were graceful penguins, with slender trunks,” says Ksepka.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Sign up to our weekly newsletter\n&#x27; +
          &#x27;\n&#x27; +
          "Receive a weekly dose of discovery in your inbox! We&#x27;ll also keep you up to date with New Scientist events and special offers. Sign up\n" +
          &#x27;\n&#x27; +
          &#x27;More from New Scientist\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Explore the latest news, articles and features\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Extremely rare black penguin spotted in Antarctica\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;How you can help with penguin research by browsing images at home\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Adélie penguins show signs of self-awareness on the mirror test\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Penguins adapt their accents to sound more like their friends\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Trending New Scientist articles\n&#x27; +
          &#x27;\n&#x27; +
          "SpaceX prepares for Starship flight with first &#x27;chopstick&#x27; landing\n" +
          &#x27;\n&#x27; +
          &#x27;Evidence mounts that shingles vaccines protect against dementia\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;When is the best time to exercise to get the most from your workout?\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Why slow running could be even more beneficial than running fast\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Wafer-thin light sail could help us reach another star sooner\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The remarkable science-backed ways to get fit as fast as possible\n&#x27; +
          &#x27;\n&#x27; +
          "One of Earth&#x27;s major carbon sinks collapsed in 2023\n" +
          &#x27;\n&#x27; +
          &#x27;How to use psychology to hack your mind and fall in love with exercise\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Gene therapy enables five children who were born deaf to hear\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Why midlife is the perfect time to take control of your future health&#x27;,
        timestamp: &#x27;2024-07-28T02:56:04&#x27;,
        title: &#x27;Mega penguins: The tallest, largest, most amazing penguin species to have ever lived | New Scientist&#x27;,
        url: &#x27;https://www.newscientist.com/article/2397894-mega-penguins-these-are-the-largest-penguins-to-have-ever-lived/&#x27;
      },
      {
        id: &#x27;web-search_0&#x27;,
        snippet: &#x27;Sustainability for All.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Giant 6-Foot-8 Penguin Discovered in Antarctica\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;University of Houston\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Bryan Nelson is a science writer and award-winning documentary filmmaker with over a decade of experience covering technology, astronomy, medicine, animals, and more.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Learn about our editorial process\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Updated May 9, 2020 10:30AM EDT\n&#x27; +
          &#x27;\n&#x27; +
          "Modern emperor penguins are certainly statuesque, but not quite as impressive as the &#x27;colossus penguin&#x27; would have been. . Christopher Michel/flickr\n" +
          &#x27;\n&#x27; +
          &#x27;The largest penguin species ever discovered has been unearthed in Antarctica, and its size is almost incomprehensible. Standing at 6 foot 8 inches from toe to beak tip, the mountainous bird would have dwarfed most adult humans, reports the Guardian.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;In fact, if it were alive today the penguin could have looked basketball superstar LeBron James square in the eyes.\n&#x27; +
          &#x27;\n&#x27; +
          "Fossils Provide Clues to the Bird&#x27;s Size\n" +
          &#x27;\n&#x27; +
          `The bird&#x27;s 37-million-year-old fossilized remains, which include the longest recorded fused ankle-foot bone as well as parts of the animal&#x27;s wing bone, represent the most complete fossil ever uncovered in the Antarctic. Appropriately dubbed the "colossus penguin," Palaeeudyptes klekowskii was truly the Godzilla of aquatic birds.\n` +
          &#x27;\n&#x27; +
          `Scientists calculated the penguin&#x27;s dimensions by scaling the sizes of its bones against those of modern penguin species. They estimate that the bird probably would have weighed about 250 pounds — again, roughly comparable to LeBron James. By comparison, the largest species of penguin alive today, the emperor penguin, is "only" about 4 feet tall and can weigh as much as 100 pounds.\n` +
          &#x27;\n&#x27; +
          &#x27;Interestingly, because larger bodied penguins can hold their breath for longer, the colossus penguin probably could have stayed underwater for 40 minutes or more. It boggles the mind to imagine the kinds of huge, deep sea fish this mammoth bird might have been capable of hunting.\n&#x27; +
          &#x27;\n&#x27; +
          "The fossil was found at the La Meseta formation on Seymour Island, an island in a chain of 16 major islands around the tip of the Graham Land on the Antarctic Peninsula. (It&#x27;s the region that is the closest part of Antarctica to South America.) The area is known for its abundance of penguin bones, though in prehistoric times it would have been much warmer than it is today.\n" +
          &#x27;\n&#x27; +
          "P. klekowskii towers over the next largest penguin ever discovered, a 5-foot-tall bird that lived about 36 million years ago in Peru. Since these two species were near contemporaries, it&#x27;s fun to imagine a time between 35 and 40 million years ago when giant penguins walked the Earth, and perhaps swam alongside the ancestors of whales.\n" +
          &#x27;\n&#x27; +
          &#x27;10 of the Largest Living Sea Creatures\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;11 Facts About Blue Whales, the Largest Animals Ever on Earth\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;16 Ocean Creatures That Live in Total Darkness\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;National Monuments Designated By President Obama\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;20 Pygmy Animal Species From Around the World\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;School Kids Discover New Penguin Species in New Zealand\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;16 of the Most Surreal Landscapes on Earth\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;12 Peculiar Penguin Facts\n&#x27; +
          &#x27;\n&#x27; +
          "10 Amazing Hoodoos Around the World and How They&#x27;re Formed\n" +
          &#x27;\n&#x27; +
          &#x27;8 Titanic Facts About Patagotitans\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;9 Extinct Megafauna That Are Out of This World\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;10 Places Where Penguins Live in the Wild\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;16 Animals That Are Living Fossils\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;A Timeline of the Distant Future for Life on Earth\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;12 Animals That May Have Inspired Mythical Creatures\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;12 Dinosaur Theme Parks\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;By clicking “Accept All Cookies”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Cookies Settings Accept All Cookies&#x27;,
        timestamp: &#x27;2024-07-27T06:29:15&#x27;,
        title: &#x27;Giant 6-Foot-8 Penguin Discovered in Antarctica&#x27;,
        url: &#x27;https://www.treehugger.com/giant-foot-penguin-discovered-in-antarctica-4864169&#x27;
      },
      {
        id: &#x27;web-search_5&#x27;,
        snippet: &#x27;Skip to main content\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Smithsonian Institution\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Search Smithsonian Ocean\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Follow us on Facebook Follow us on Twitter Follow us on Flickr Follow us on Tumbr\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;How Big Do Penguins Get?\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;(Smithsonian Institution)\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The largest of the penguins, the emperor, stands at just over four feet while the smallest, the little penguin, has a maximum height of a foot. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Coasts & Shallow Water\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Census of Marine Life\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Waves, Storms & Tsunamis\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Temperature & Chemistry\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Solutions & Success Stories\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Books, Film & The Arts\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Search Smithsonian Ocean&#x27;,
        timestamp: &#x27;2024-07-30T03:47:03&#x27;,
        title: &#x27;How Big Do Penguins Get? | Smithsonian Ocean&#x27;,
        url: &#x27;https://ocean.si.edu/ocean-life/seabirds/how-big-do-penguins-get&#x27;
      },
      {
        id: &#x27;web-search_4&#x27;,
        snippet: &#x27;The emperor penguin (Aptenodytes forsteri) is the tallest and heaviest of all living penguin species and is endemic to Antarctica. The male and female are similar in plumage and size, reaching 100 cm (39 in) in length and weighing from 22 to 45 kg (49 to 99 lb). Feathers of the head and back are black and sharply delineated from the white belly, pale-yellow breast and bright-yellow ear patches.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Like all penguins, it is flightless, with a streamlined body, and wings stiffened and flattened into flippers for a marine habitat. Its diet consists primarily of fish, but also includes crustaceans, such as krill, and cephalopods, such as squid. While hunting, the species can remain submerged around 20 minutes, diving to a depth of 535 m (1,755 ft). It has several adaptations to facilitate this, including an unusually structured haemoglobin to allow it to function at low oxygen levels, solid bones to reduce barotrauma, and the ability to reduce its metabolism and shut down non-essential organ functions.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The only penguin species that breeds during the Antarctic winter, emperor penguins trek 50–120 km (31–75 mi) over the ice to breeding colonies which can contain up to several thousand individuals. The female lays a single egg, which is incubated for just over two months by the male while the female returns to the sea to feed; parents subsequently take turns foraging at sea and caring for their chick in the colony. The lifespan is typically 20 years in the wild, although observations suggest that some individuals may live to 50 years of age.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Emperor penguins were described in 1844 by English zoologist George Robert Gray, who created the generic name from Ancient Greek word elements, ἀ-πτηνο-δύτης [a-ptēno-dytēs], "without-wings-diver". Its specific name is in honour of the German naturalist Johann Reinhold Forster, who accompanied Captain James Cook on his second voyage and officially named five other penguin species. Forster may have been the first person to see the penguins in 1773–74, when he recorded a sighting of what he believed was the similar king penguin (A. patagonicus) but given the location, may very well have been A. forsteri.\n&#x27; +
          &#x27;\n&#x27; +
          "Together with the king penguin, the emperor penguin is one of two extant species in the genus Aptenodytes. Fossil evidence of a third species—Ridgen&#x27;s penguin (A. ridgeni)—has been found in fossil records from the late Pliocene, about three million years ago, in New Zealand. Studies of penguin behaviour and genetics have proposed that the genus Aptenodytes is basal; in other words, that it split off from a branch which led to all other living penguin species. Mitochondrial and nuclear DNA evidence suggests this split occurred around 40 million years ago.\n" +
          &#x27;\n&#x27; +
          &#x27;Adult emperor penguins are 110–120 cm (43–47 in) in length, averaging 115 centimetres (45 in) according to Stonehouse (1975). Due to method of bird measurement that measures length between bill to tail, sometimes body length and standing height are confused, and some reported height even reaching 1.5 metres (4.9 ft) tall. There are still more than a few papers mentioning that they reach a standing height of 1.2 metres (3.9 ft) instead of body length. Although standing height of emperor penguin is rarely provided at scientific reports, Prévost (1961) recorded 86 wild individuals and measured maximum height of 1.08 metres (3.5 ft). Friedman (1945) recorded measurements from 22 wild individuals and resulted height ranging 83–97 cm (33–38 in). Ksepka et al. (2012) measured standing height of 81–94 cm (32–37 in) according to 11 complete skins collected in American Museum of Natural History. The weight ranges from 22.7 to 45.4 kg (50 to 100 lb) and varies by sex, with males weighing more than females. It is the fifth heaviest living bird species, after only the larger varieties of ratite. The weight also varies by season, as both male and female penguins lose substantial mass while raising hatchlings and incubating their egg. A male emperor penguin must withstand the extreme Antarctic winter cold for more than two months while protecting his egg. He eats nothing during this time. Most male emperors will lose around 12 kg (26 lb) while they wait for their eggs to hatch. The mean weight of males at the start of the breeding season is 38 kg (84 lb) and that of females is 29.5 kg (65 lb). After the breeding season this drops to 23 kg (51 lb) for both sexes.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Like all penguin species, emperor penguins have streamlined bodies to minimize drag while swimming, and wings that are more like stiff, flat flippers. The tongue is equipped with rear-facing barbs to prevent prey from escaping when caught. Males and females are similar in size and colouration. The adult has deep black dorsal feathers, covering the head, chin, throat, back, dorsal part of the flippers, and tail. The black plumage is sharply delineated from the light-coloured plumage elsewhere. The underparts of the wings and belly are white, becoming pale yellow in the upper breast, while the ear patches are bright yellow. The upper mandible of the 8 cm (3 in) long bill is black, and the lower mandible can be pink, orange or lilac. In juveniles, the auricular patches, chin and throat are white, while its bill is black. Emperor penguin chicks are typically covered with silver-grey down and have black heads and white masks. A chick with all-white plumage was seen in 2001, but was not considered to be an albino as it did not have pink eyes. Chicks weigh around 315 g (11 oz) after hatching, and fledge when they reach about 50% of adult weight.\n&#x27; +
          &#x27;\n&#x27; +
          "The emperor penguin&#x27;s dark plumage fades to brown from November until February (the Antarctic summer), before the yearly moult in January and February. Moulting is rapid in this species compared with other birds, taking only around 34 days. Emperor penguin feathers emerge from the skin after they have grown to a third of their total length, and before old feathers are lost, to help reduce heat loss. New feathers then push out the old ones before finishing their growth.\n" +
          &#x27;\n&#x27; +
          &#x27;The average yearly survival rate of an adult emperor penguin has been measured at 95.1%, with an average life expectancy of 19.9 years. The same researchers estimated that 1% of emperor penguins hatched could feasibly reach an age of 50 years. In contrast, only 19% of chicks survive their first year of life. Therefore, 80% of the emperor penguin population comprises adults five years and older.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;As the species has no fixed nest sites that individuals can use to locate their own partner or chick, emperor penguins must rely on vocal calls alone for identification. They use a complex set of calls that are critical to individual recognition between parents, offspring and mates, displaying the widest variation in individual calls of all penguins. Vocalizing emperor penguins use two frequency bands simultaneously. Chicks use a frequency-modulated whistle to beg for food and to contact parents.\n&#x27; +
          &#x27;\n&#x27; +
          "The emperor penguin breeds in the coldest environment of any bird species; air temperatures may reach −40 °C (−40 °F), and wind speeds may reach 144 km/h (89 mph). Water temperature is a frigid −1.8 °C (28.8 °F), which is much lower than the emperor penguin&#x27;s average body temperature of 39 °C (102 °F). The species has adapted in several ways to counteract heat loss. Dense feathers provide 80–90% of its insulation and it has a layer of sub-dermal fat which may be up to 3 cm (1.2 in) thick before breeding. While the density of contour feathers is approximately 9 per square centimetre (58 per square inch), a combination of dense afterfeathers and down feathers (plumules) likely play a critical role for insulation. Muscles allow the feathers to be held erect on land, reducing heat loss by trapping a layer of air next to the skin. Conversely, the plumage is flattened in water, thus waterproofing the skin and the downy underlayer. Preening is vital in facilitating insulation and in keeping the plumage oily and water-repellent.\n" +
          &#x27;\n&#x27; +
          &#x27;The emperor penguin is able to thermoregulate (maintain its core body temperature) without altering its metabolism, over a wide range of temperatures. Known as the thermoneutral range, this extends from −10 to 20 °C (14 to 68 °F). Below this temperature range, its metabolic rate increases significantly, although an individual can maintain its core temperature from 38.0 °C (100.4 °F) down to −47 °C (−53 °F). Movement by swimming, walking, and shivering are three mechanisms for increasing metabolism; a fourth process involves an increase in the breakdown of fats by enzymes, which is induced by the hormone glucagon. At temperatures above 20 °C (68 °F), an emperor penguin may become agitated as its body temperature and metabolic rate rise to increase heat loss. Raising its wings and exposing the undersides increases the exposure of its body surface to the air by 16%, facilitating further heat loss.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Adaptations to pressure and low oxygen\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;In addition to the cold, the emperor penguin encounters another stressful condition on deep dives—markedly increased pressure of up to 40 times that of the surface, which in most other terrestrial organisms would cause barotrauma. The bones of the penguin are solid rather than air-filled, which eliminates the risk of mechanical barotrauma.\n&#x27; +
          &#x27;\n&#x27; +
          "While diving, the emperor penguin&#x27;s oxygen use is markedly reduced, as its heart rate is reduced to as low as 15–20 beats per minute and non-essential organs are shut down, thus facilitating longer dives. Its haemoglobin and myoglobin are able to bind and transport oxygen at low blood concentrations; this allows the bird to function with very low oxygen levels that would otherwise result in loss of consciousness.\n" +
          &#x27;\n&#x27; +
          &#x27;Distribution and habitat\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The emperor penguin has a circumpolar distribution in the Antarctic almost exclusively between the 66° and 77° south latitudes. It almost always breeds on stable pack ice near the coast and up to 18 km (11 mi) offshore. Breeding colonies are usually in areas where ice cliffs and i&#x27;... 22063 more characters,
        timestamp: &#x27;2024-07-31T07:59:36&#x27;,
        title: &#x27;Emperor penguin - Wikipedia&#x27;,
        url: &#x27;https://en.wikipedia.org/wiki/Emperor_penguin&#x27;
      }
    ],
    searchResults: [
      {
        searchQuery: {
          text: &#x27;How tall are the largest penguins?&#x27;,
          generationId: &#x27;8d5ae032-4c8e-492e-8686-289f198b5eb5&#x27;
        },
        documentIds: [
          &#x27;web-search_0&#x27;,
          &#x27;web-search_1&#x27;,
          &#x27;web-search_2&#x27;,
          &#x27;web-search_3&#x27;,
          &#x27;web-search_4&#x27;,
          &#x27;web-search_5&#x27;
        ],
        connector: { id: &#x27;web-search&#x27; }
      }
    ],
    searchQueries: [
      {
        text: &#x27;How tall are the largest penguins?&#x27;,
        generationId: &#x27;8d5ae032-4c8e-492e-8686-289f198b5eb5&#x27;
      }
    ]
  },
  response_metadata: {
    estimatedTokenUsage: { completionTokens: 286, promptTokens: 11198, totalTokens: 11484 },
    response_id: &#x27;8d5ae032-4c8e-492e-8686-289f198b5eb5&#x27;,
    generationId: &#x27;2224736b-430c-46cf-9ca0-a7f5737466aa&#x27;,
    chatHistory: [
      { role: &#x27;USER&#x27;, message: &#x27;How tall are the largest pengiuns?&#x27; },
      {
        role: &#x27;CHATBOT&#x27;,
        message: &#x27;The largest penguin ever discovered is the prehistoric Palaeeudyptes klekowskii, or "colossus penguin", which stood at 6 feet 6 inches tall. The tallest penguin alive today is the emperor penguin, which stands at just over 4 feet tall.&#x27;
      }
    ],
    finishReason: &#x27;COMPLETE&#x27;,
    meta: {
      apiVersion: { version: &#x27;1&#x27; },
      billedUnits: { inputTokens: 10474, outputTokens: 62 },
      tokens: { inputTokens: 11198, outputTokens: 286 }
    },
    citations: [
      {
        start: 43,
        end: 54,
        text: &#x27;prehistoric&#x27;,
        documentIds: [ &#x27;web-search_1&#x27;, &#x27;web-search_2&#x27; ]
      },
      {
        start: 55,
        end: 79,
        text: &#x27;Palaeeudyptes klekowskii&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_1&#x27;, &#x27;web-search_2&#x27; ]
      },
      {
        start: 84,
        end: 102,
        text: &#x27;"colossus penguin"&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_1&#x27;, &#x27;web-search_2&#x27; ]
      },
      {
        start: 119,
        end: 125,
        text: &#x27;6 feet&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_1&#x27; ]
      },
      {
        start: 126,
        end: 134,
        text: &#x27;6 inches&#x27;,
        documentIds: [ &#x27;web-search_1&#x27; ]
      },
      {
        start: 161,
        end: 172,
        text: &#x27;alive today&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_5&#x27; ]
      },
      {
        start: 180,
        end: 195,
        text: &#x27;emperor penguin&#x27;,
        documentIds: [
          &#x27;web-search_0&#x27;,
          &#x27;web-search_1&#x27;,
          &#x27;web-search_2&#x27;,
          &#x27;web-search_4&#x27;,
          &#x27;web-search_5&#x27;
        ]
      },
      {
        start: 213,
        end: 235,
        text: &#x27;just over 4 feet tall.&#x27;,
        documentIds: [ &#x27;web-search_0&#x27;, &#x27;web-search_5&#x27; ]
      }
    ],
    documents: [
      {
        id: &#x27;web-search_1&#x27;,
        snippet: &#x27;Largest species of penguin ever\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;TencentContact an Account Manager\n&#x27; +
          &#x27;\n&#x27; +
          "The largest species of penguin ever recorded is a newly described prehistoric species, Kumimanu fordycei, known from fossil remains discovered inside boulders in North Otago, on New Zealand&#x27;s South Island. By comparing the size and density of its bones with those of modern-day penguins, researchers estimate that it weighed 154 kilograms (340 pounds), which is three times that of today&#x27;s largest species, the emperor penguin (Aptenodytes forsteri). The rocks containing the remains of this new giant fossil species date between 55.5 million years and 59.5 million years old, meaning that it existed during the Late Palaeocene. Details of the record-breaking prehistoric penguin were published in the Journal of Paleontology on 8 February 2023.\n" +
          &#x27;\n&#x27; +
          &#x27;The height of K. fordycei is debated, though a related extinct species, K. biceae, has been estimated to have stood up to 1.77 m (5 ft). A lack of complete skeletons of extinct giant penguins found to date makes it difficult for height to be determined with any degree of certainty.\n&#x27; +
          &#x27;\n&#x27; +
          "Prior to the recent discovery and description of K. fordycei, the largest species of penguin known to science was the colossus penguin (Palaeeudyptes klekowskii), which is estimated to have weighed as much as 115 kg (253 lb 8 oz), and stood up to 2 m (6 ft 6 in) tall. It lived in Antarctica&#x27;s Seymour Island approximately 37 million years ago, during the Late Eocene, and is represented by the most complete fossil remains ever found for a penguin species in Antarctica.\n" +
          &#x27;\n&#x27; +
          "This species exceeds in height the previous record holder, Nordenskjoeld&#x27;s giant penguin (Anthropornis nordenskjoeldi), which stood 1.7 m (5 ft 6 in) tall and also existed during the Eocene epoch, occurring in New Zealand and in Antarctica&#x27;s Seymour Island.\n" +
          &#x27;\n&#x27; +
          &#x27;Records change on a daily basis and are not immediately published online. For a full list of record titles, please use our Record Application Search. (You will need to register / login for access)\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Comments below may relate to previous holders of this record.&#x27;,
        timestamp: &#x27;2024-07-28T02:56:04&#x27;,
        title: &#x27;Largest species of penguin ever&#x27;,
        url: &#x27;https://www.guinnessworldrecords.com/world-records/84903-largest-species-of-penguin&#x27;
      },
      {
        id: &#x27;web-search_2&#x27;,
        snippet: &#x27;Mega penguins: These are the largest penguins to have ever lived\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;No penguin alive today can compare with some of the extinct giants that once roamed the planet, including Kumimanu fordycei, Petradyptes stonehousei and Palaeeudyptes klekowskii\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;An illustration of Kumimanu fordycei (the larger, single bird) and Petradyptes stonehousei penguins on an ancient New Zealand beach\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Artwork by Dr. Simone Giovanardi\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Penguins come in all shapes and sizes, from the fairy penguin (Eudyptula minor) which stands at just over 30 centimetres tall to the 1-metre-high emperor penguin (Aptenodytes forsteri). But even the biggest emperors alive today would be dwarfed by the mega-penguins that roamed Earth millions of years ago. Here are the most impressive of these ancient giants.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The title of the largest penguin ever documented goes to the species Kumimanu fordycei, which was first described in February 2023.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Daniel Ksepka at the Bruce Museum in Connecticut and his colleagues unearthed an unusually huge flipper bone of a penguin in southern New Zealand in 2018. “The big humerus was shocking to me,” he says. “I almost thought it was maybe some other animal.”\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The team quickly determined that this belonged to a new species of penguin that lived in what is now New Zealand over 55 million years ago. The sheer size of the bone suggested that the bird probably weighed between 148 and 160 kilograms and stood around 1.6 metres tall. “The emperor penguin just looks like a child next to it,” says Ksepka.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The species was named after palaeontologist Ewan Fordyce, who made his own mega penguin discoveries in the 1970s (see below).\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Sign up to our Wild Wild Life newsletter\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;A monthly celebration of the biodiversity of our planet’s animals, plants and other organisms.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Sign up to newsletter\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Skeletons of Kumimanu, Petradyptes and a modern emperor penguin\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Artwork by Dr. Simone Giovanardi\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Petradyptes stonehousei\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Ksepka and his colleagues discovered another giant penguin alongside K. fordycei, called Petradyptes stonehousei. With an estimated mass of 50 kilograms, it was quite a bit smaller than its contemporary. Its name comes from the Greek “petra” for rock and “dyptes” for diver, while “stonehousei” was chosen to honour British polar scientist Bernard Stonehouse.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Both K. fordycei and P. stonehousei retained features seen in much earlier penguin species, such as slimmer flipper bones and muscle attachment points that look like those seen in flying birds.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;“Both penguins really add to the case that penguins got their start in New Zealand,” says Ksepka.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Illustration of the extinct Palaeeudyptes klekowskii with a human and emperor penguin for scale\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Nature Picture Library / Alamy\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Palaeeudyptes klekowskii\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;While K. fordycei was the heaviest penguin, it wasn’t the tallest. That award goes to Palaeeudyptes klekowskii, dubbed the colossus penguin, which towered at 2 metres and weighed a hefty 115 kilograms.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The species lived 37 to 40 million years ago along the Antarctic coast. Its fossil, which included the longest fused ankle-foot bone, is one of the most complete ever uncovered from the Antarctic.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Owing to their larger body size, giant penguins could remain underwater longer than smaller ones. Experts reckon that a species such as P. klekowskii could have remained submerged for up to 40 minutes hunting for fish.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Pachydyptes ponderosus\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Pachydyptes ponderosus is prehistoric giant that lived more recently than those already mentioned – around 37 to 34 million years ago. Based on the few bones from the species that have been recovered, in 2006 Ksepka and his colleagues put it around 1.5 metres tall with a weight of over 100 kilograms.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;“We really only have parts of the flipper and shoulder, but we think it would have been quite a thick, stocky animal,” says Ksepka. “Its humerus is just so wide.”\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Daniel Ksepka with a model of a Kairuku penguin\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The three species that belonged to the genus Kairuku (K. grebneffi, K. waitaki and K. waewaeroa), however, were the complete opposite.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;“If Pachydyptes is like a big, heavy football lineman, then you can think of Kairuku as a really tall, skinny basketball player,” says Ksepka. “They’re both really big, but in different ways.”\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The first Kairuku bones were discovered by Ewan Fordyce in the 1970s, in New Zealand. All three species lived roughly 34 to 27 million years ago. The tallest, K. waewaeroa, stood at a height of around 1.4 metres and weighed around 80 kilograms.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;“They were graceful penguins, with slender trunks,” says Ksepka.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Sign up to our weekly newsletter\n&#x27; +
          &#x27;\n&#x27; +
          "Receive a weekly dose of discovery in your inbox! We&#x27;ll also keep you up to date with New Scientist events and special offers. Sign up\n" +
          &#x27;\n&#x27; +
          &#x27;More from New Scientist\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Explore the latest news, articles and features\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Extremely rare black penguin spotted in Antarctica\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;How you can help with penguin research by browsing images at home\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Adélie penguins show signs of self-awareness on the mirror test\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Penguins adapt their accents to sound more like their friends\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Trending New Scientist articles\n&#x27; +
          &#x27;\n&#x27; +
          "SpaceX prepares for Starship flight with first &#x27;chopstick&#x27; landing\n" +
          &#x27;\n&#x27; +
          &#x27;Evidence mounts that shingles vaccines protect against dementia\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;When is the best time to exercise to get the most from your workout?\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Why slow running could be even more beneficial than running fast\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Wafer-thin light sail could help us reach another star sooner\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The remarkable science-backed ways to get fit as fast as possible\n&#x27; +
          &#x27;\n&#x27; +
          "One of Earth&#x27;s major carbon sinks collapsed in 2023\n" +
          &#x27;\n&#x27; +
          &#x27;How to use psychology to hack your mind and fall in love with exercise\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Gene therapy enables five children who were born deaf to hear\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Why midlife is the perfect time to take control of your future health&#x27;,
        timestamp: &#x27;2024-07-28T02:56:04&#x27;,
        title: &#x27;Mega penguins: The tallest, largest, most amazing penguin species to have ever lived | New Scientist&#x27;,
        url: &#x27;https://www.newscientist.com/article/2397894-mega-penguins-these-are-the-largest-penguins-to-have-ever-lived/&#x27;
      },
      {
        id: &#x27;web-search_0&#x27;,
        snippet: &#x27;Sustainability for All.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Giant 6-Foot-8 Penguin Discovered in Antarctica\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;University of Houston\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Bryan Nelson is a science writer and award-winning documentary filmmaker with over a decade of experience covering technology, astronomy, medicine, animals, and more.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Learn about our editorial process\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Updated May 9, 2020 10:30AM EDT\n&#x27; +
          &#x27;\n&#x27; +
          "Modern emperor penguins are certainly statuesque, but not quite as impressive as the &#x27;colossus penguin&#x27; would have been. . Christopher Michel/flickr\n" +
          &#x27;\n&#x27; +
          &#x27;The largest penguin species ever discovered has been unearthed in Antarctica, and its size is almost incomprehensible. Standing at 6 foot 8 inches from toe to beak tip, the mountainous bird would have dwarfed most adult humans, reports the Guardian.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;In fact, if it were alive today the penguin could have looked basketball superstar LeBron James square in the eyes.\n&#x27; +
          &#x27;\n&#x27; +
          "Fossils Provide Clues to the Bird&#x27;s Size\n" +
          &#x27;\n&#x27; +
          `The bird&#x27;s 37-million-year-old fossilized remains, which include the longest recorded fused ankle-foot bone as well as parts of the animal&#x27;s wing bone, represent the most complete fossil ever uncovered in the Antarctic. Appropriately dubbed the "colossus penguin," Palaeeudyptes klekowskii was truly the Godzilla of aquatic birds.\n` +
          &#x27;\n&#x27; +
          `Scientists calculated the penguin&#x27;s dimensions by scaling the sizes of its bones against those of modern penguin species. They estimate that the bird probably would have weighed about 250 pounds — again, roughly comparable to LeBron James. By comparison, the largest species of penguin alive today, the emperor penguin, is "only" about 4 feet tall and can weigh as much as 100 pounds.\n` +
          &#x27;\n&#x27; +
          &#x27;Interestingly, because larger bodied penguins can hold their breath for longer, the colossus penguin probably could have stayed underwater for 40 minutes or more. It boggles the mind to imagine the kinds of huge, deep sea fish this mammoth bird might have been capable of hunting.\n&#x27; +
          &#x27;\n&#x27; +
          "The fossil was found at the La Meseta formation on Seymour Island, an island in a chain of 16 major islands around the tip of the Graham Land on the Antarctic Peninsula. (It&#x27;s the region that is the closest part of Antarctica to South America.) The area is known for its abundance of penguin bones, though in prehistoric times it would have been much warmer than it is today.\n" +
          &#x27;\n&#x27; +
          "P. klekowskii towers over the next largest penguin ever discovered, a 5-foot-tall bird that lived about 36 million years ago in Peru. Since these two species were near contemporaries, it&#x27;s fun to imagine a time between 35 and 40 million years ago when giant penguins walked the Earth, and perhaps swam alongside the ancestors of whales.\n" +
          &#x27;\n&#x27; +
          &#x27;10 of the Largest Living Sea Creatures\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;11 Facts About Blue Whales, the Largest Animals Ever on Earth\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;16 Ocean Creatures That Live in Total Darkness\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;National Monuments Designated By President Obama\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;20 Pygmy Animal Species From Around the World\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;School Kids Discover New Penguin Species in New Zealand\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;16 of the Most Surreal Landscapes on Earth\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;12 Peculiar Penguin Facts\n&#x27; +
          &#x27;\n&#x27; +
          "10 Amazing Hoodoos Around the World and How They&#x27;re Formed\n" +
          &#x27;\n&#x27; +
          &#x27;8 Titanic Facts About Patagotitans\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;9 Extinct Megafauna That Are Out of This World\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;10 Places Where Penguins Live in the Wild\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;16 Animals That Are Living Fossils\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;A Timeline of the Distant Future for Life on Earth\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;12 Animals That May Have Inspired Mythical Creatures\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;12 Dinosaur Theme Parks\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;By clicking “Accept All Cookies”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Cookies Settings Accept All Cookies&#x27;,
        timestamp: &#x27;2024-07-27T06:29:15&#x27;,
        title: &#x27;Giant 6-Foot-8 Penguin Discovered in Antarctica&#x27;,
        url: &#x27;https://www.treehugger.com/giant-foot-penguin-discovered-in-antarctica-4864169&#x27;
      },
      {
        id: &#x27;web-search_5&#x27;,
        snippet: &#x27;Skip to main content\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Smithsonian Institution\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Search Smithsonian Ocean\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Follow us on Facebook Follow us on Twitter Follow us on Flickr Follow us on Tumbr\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;How Big Do Penguins Get?\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;(Smithsonian Institution)\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The largest of the penguins, the emperor, stands at just over four feet while the smallest, the little penguin, has a maximum height of a foot. \n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Coasts & Shallow Water\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Census of Marine Life\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Waves, Storms & Tsunamis\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Temperature & Chemistry\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Solutions & Success Stories\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Books, Film & The Arts\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Search Smithsonian Ocean&#x27;,
        timestamp: &#x27;2024-07-30T03:47:03&#x27;,
        title: &#x27;How Big Do Penguins Get? | Smithsonian Ocean&#x27;,
        url: &#x27;https://ocean.si.edu/ocean-life/seabirds/how-big-do-penguins-get&#x27;
      },
      {
        id: &#x27;web-search_4&#x27;,
        snippet: &#x27;The emperor penguin (Aptenodytes forsteri) is the tallest and heaviest of all living penguin species and is endemic to Antarctica. The male and female are similar in plumage and size, reaching 100 cm (39 in) in length and weighing from 22 to 45 kg (49 to 99 lb). Feathers of the head and back are black and sharply delineated from the white belly, pale-yellow breast and bright-yellow ear patches.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Like all penguins, it is flightless, with a streamlined body, and wings stiffened and flattened into flippers for a marine habitat. Its diet consists primarily of fish, but also includes crustaceans, such as krill, and cephalopods, such as squid. While hunting, the species can remain submerged around 20 minutes, diving to a depth of 535 m (1,755 ft). It has several adaptations to facilitate this, including an unusually structured haemoglobin to allow it to function at low oxygen levels, solid bones to reduce barotrauma, and the ability to reduce its metabolism and shut down non-essential organ functions.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The only penguin species that breeds during the Antarctic winter, emperor penguins trek 50–120 km (31–75 mi) over the ice to breeding colonies which can contain up to several thousand individuals. The female lays a single egg, which is incubated for just over two months by the male while the female returns to the sea to feed; parents subsequently take turns foraging at sea and caring for their chick in the colony. The lifespan is typically 20 years in the wild, although observations suggest that some individuals may live to 50 years of age.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Emperor penguins were described in 1844 by English zoologist George Robert Gray, who created the generic name from Ancient Greek word elements, ἀ-πτηνο-δύτης [a-ptēno-dytēs], "without-wings-diver". Its specific name is in honour of the German naturalist Johann Reinhold Forster, who accompanied Captain James Cook on his second voyage and officially named five other penguin species. Forster may have been the first person to see the penguins in 1773–74, when he recorded a sighting of what he believed was the similar king penguin (A. patagonicus) but given the location, may very well have been A. forsteri.\n&#x27; +
          &#x27;\n&#x27; +
          "Together with the king penguin, the emperor penguin is one of two extant species in the genus Aptenodytes. Fossil evidence of a third species—Ridgen&#x27;s penguin (A. ridgeni)—has been found in fossil records from the late Pliocene, about three million years ago, in New Zealand. Studies of penguin behaviour and genetics have proposed that the genus Aptenodytes is basal; in other words, that it split off from a branch which led to all other living penguin species. Mitochondrial and nuclear DNA evidence suggests this split occurred around 40 million years ago.\n" +
          &#x27;\n&#x27; +
          &#x27;Adult emperor penguins are 110–120 cm (43–47 in) in length, averaging 115 centimetres (45 in) according to Stonehouse (1975). Due to method of bird measurement that measures length between bill to tail, sometimes body length and standing height are confused, and some reported height even reaching 1.5 metres (4.9 ft) tall. There are still more than a few papers mentioning that they reach a standing height of 1.2 metres (3.9 ft) instead of body length. Although standing height of emperor penguin is rarely provided at scientific reports, Prévost (1961) recorded 86 wild individuals and measured maximum height of 1.08 metres (3.5 ft). Friedman (1945) recorded measurements from 22 wild individuals and resulted height ranging 83–97 cm (33–38 in). Ksepka et al. (2012) measured standing height of 81–94 cm (32–37 in) according to 11 complete skins collected in American Museum of Natural History. The weight ranges from 22.7 to 45.4 kg (50 to 100 lb) and varies by sex, with males weighing more than females. It is the fifth heaviest living bird species, after only the larger varieties of ratite. The weight also varies by season, as both male and female penguins lose substantial mass while raising hatchlings and incubating their egg. A male emperor penguin must withstand the extreme Antarctic winter cold for more than two months while protecting his egg. He eats nothing during this time. Most male emperors will lose around 12 kg (26 lb) while they wait for their eggs to hatch. The mean weight of males at the start of the breeding season is 38 kg (84 lb) and that of females is 29.5 kg (65 lb). After the breeding season this drops to 23 kg (51 lb) for both sexes.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Like all penguin species, emperor penguins have streamlined bodies to minimize drag while swimming, and wings that are more like stiff, flat flippers. The tongue is equipped with rear-facing barbs to prevent prey from escaping when caught. Males and females are similar in size and colouration. The adult has deep black dorsal feathers, covering the head, chin, throat, back, dorsal part of the flippers, and tail. The black plumage is sharply delineated from the light-coloured plumage elsewhere. The underparts of the wings and belly are white, becoming pale yellow in the upper breast, while the ear patches are bright yellow. The upper mandible of the 8 cm (3 in) long bill is black, and the lower mandible can be pink, orange or lilac. In juveniles, the auricular patches, chin and throat are white, while its bill is black. Emperor penguin chicks are typically covered with silver-grey down and have black heads and white masks. A chick with all-white plumage was seen in 2001, but was not considered to be an albino as it did not have pink eyes. Chicks weigh around 315 g (11 oz) after hatching, and fledge when they reach about 50% of adult weight.\n&#x27; +
          &#x27;\n&#x27; +
          "The emperor penguin&#x27;s dark plumage fades to brown from November until February (the Antarctic summer), before the yearly moult in January and February. Moulting is rapid in this species compared with other birds, taking only around 34 days. Emperor penguin feathers emerge from the skin after they have grown to a third of their total length, and before old feathers are lost, to help reduce heat loss. New feathers then push out the old ones before finishing their growth.\n" +
          &#x27;\n&#x27; +
          &#x27;The average yearly survival rate of an adult emperor penguin has been measured at 95.1%, with an average life expectancy of 19.9 years. The same researchers estimated that 1% of emperor penguins hatched could feasibly reach an age of 50 years. In contrast, only 19% of chicks survive their first year of life. Therefore, 80% of the emperor penguin population comprises adults five years and older.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;As the species has no fixed nest sites that individuals can use to locate their own partner or chick, emperor penguins must rely on vocal calls alone for identification. They use a complex set of calls that are critical to individual recognition between parents, offspring and mates, displaying the widest variation in individual calls of all penguins. Vocalizing emperor penguins use two frequency bands simultaneously. Chicks use a frequency-modulated whistle to beg for food and to contact parents.\n&#x27; +
          &#x27;\n&#x27; +
          "The emperor penguin breeds in the coldest environment of any bird species; air temperatures may reach −40 °C (−40 °F), and wind speeds may reach 144 km/h (89 mph). Water temperature is a frigid −1.8 °C (28.8 °F), which is much lower than the emperor penguin&#x27;s average body temperature of 39 °C (102 °F). The species has adapted in several ways to counteract heat loss. Dense feathers provide 80–90% of its insulation and it has a layer of sub-dermal fat which may be up to 3 cm (1.2 in) thick before breeding. While the density of contour feathers is approximately 9 per square centimetre (58 per square inch), a combination of dense afterfeathers and down feathers (plumules) likely play a critical role for insulation. Muscles allow the feathers to be held erect on land, reducing heat loss by trapping a layer of air next to the skin. Conversely, the plumage is flattened in water, thus waterproofing the skin and the downy underlayer. Preening is vital in facilitating insulation and in keeping the plumage oily and water-repellent.\n" +
          &#x27;\n&#x27; +
          &#x27;The emperor penguin is able to thermoregulate (maintain its core body temperature) without altering its metabolism, over a wide range of temperatures. Known as the thermoneutral range, this extends from −10 to 20 °C (14 to 68 °F). Below this temperature range, its metabolic rate increases significantly, although an individual can maintain its core temperature from 38.0 °C (100.4 °F) down to −47 °C (−53 °F). Movement by swimming, walking, and shivering are three mechanisms for increasing metabolism; a fourth process involves an increase in the breakdown of fats by enzymes, which is induced by the hormone glucagon. At temperatures above 20 °C (68 °F), an emperor penguin may become agitated as its body temperature and metabolic rate rise to increase heat loss. Raising its wings and exposing the undersides increases the exposure of its body surface to the air by 16%, facilitating further heat loss.\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;Adaptations to pressure and low oxygen\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;In addition to the cold, the emperor penguin encounters another stressful condition on deep dives—markedly increased pressure of up to 40 times that of the surface, which in most other terrestrial organisms would cause barotrauma. The bones of the penguin are solid rather than air-filled, which eliminates the risk of mechanical barotrauma.\n&#x27; +
          &#x27;\n&#x27; +
          "While diving, the emperor penguin&#x27;s oxygen use is markedly reduced, as its heart rate is reduced to as low as 15–20 beats per minute and non-essential organs are shut down, thus facilitating longer dives. Its haemoglobin and myoglobin are able to bind and transport oxygen at low blood concentrations; this allows the bird to function with very low oxygen levels that would otherwise result in loss of consciousness.\n" +
          &#x27;\n&#x27; +
          &#x27;Distribution and habitat\n&#x27; +
          &#x27;\n&#x27; +
          &#x27;The emperor penguin has a circumpolar distribution in the Antarctic almost exclusively between the 66° and 77° south latitudes. It almost always breeds on stable pack ice near the coast and up to 18 km (11 mi) offshore. Breeding colonies are usually in areas where ice cliffs and i&#x27;... 22063 more characters,
        timestamp: &#x27;2024-07-31T07:59:36&#x27;,
        title: &#x27;Emperor penguin - Wikipedia&#x27;,
        url: &#x27;https://en.wikipedia.org/wiki/Emperor_penguin&#x27;
      }
    ],
    searchResults: [
      {
        searchQuery: {
          text: &#x27;How tall are the largest penguins?&#x27;,
          generationId: &#x27;8d5ae032-4c8e-492e-8686-289f198b5eb5&#x27;
        },
        documentIds: [
          &#x27;web-search_0&#x27;,
          &#x27;web-search_1&#x27;,
          &#x27;web-search_2&#x27;,
          &#x27;web-search_3&#x27;,
          &#x27;web-search_4&#x27;,
          &#x27;web-search_5&#x27;
        ],
        connector: { id: &#x27;web-search&#x27; }
      }
    ],
    searchQueries: [
      {
        text: &#x27;How tall are the largest penguins?&#x27;,
        generationId: &#x27;8d5ae032-4c8e-492e-8686-289f198b5eb5&#x27;
      }
    ]
  },
  id: undefined,
  tool_calls: [],
  invalid_tool_calls: [],
  usage_metadata: { input_tokens: 11198, output_tokens: 286, total_tokens: 11484 }
}

```We can see in the additional_kwargs object that the API request did a few things:Performed a search query, storing the result data in the searchQueries and searchResults fields. In the searchQueries field we see they rephrased our query for better results.
- Generated three documents from the search query.
- Generated a list of citations
- Generated a final response based on the above actions & content.

## API reference[​](#api-reference)

For detailed documentation of all ChatCohere features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_cohere.ChatCohere.html](https://api.js.langchain.com/classes/langchain_cohere.ChatCohere.html)

## Related[​](#related)

- Chat model [conceptual guide](/docs/concepts/#chat-models)
- Chat model [how-to guides](/docs/how_to/#chat-models)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)[Custom client for Cohere on Azure, Cohere on AWS Bedrock, and Standalone Cohere Instance.](#custom-client-for-cohere-on-azure-cohere-on-aws-bedrock-and-standalone-cohere-instance.)

- [Invocation](#invocation)
- [Chaining](#chaining)
- [RAG](#rag)
- [Connectors](#connectors)
- [API reference](#api-reference)
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