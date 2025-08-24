ChatGoogleGenerativeAI | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageChatGoogleGenerativeAIGoogle AI](https://ai.google.dev/) offers a number of different chat models, including the powerful Gemini series. For information on the latest models, their features, context windows, etc. head to the [Google AI docs](https://ai.google.dev/gemini-api/docs/models/gemini).This will help you getting started with ChatGoogleGenerativeAI [chat models](/docs/concepts/chat_models). For detailed documentation of all ChatGoogleGenerativeAI features and configurations head to the [API reference](https://api.js.langchain.com/classes/langchain_google_genai.ChatGoogleGenerativeAI.html).Overview[​](#overview)Integration details[​](#integration-details)ClassPackageLocalSerializable[PY support](https://python.langchain.com/docs/integrations/chat/google_generative_ai)Package downloadsPackage latest[ChatGoogleGenerativeAI](https://api.js.langchain.com/classes/langchain_google_genai.ChatGoogleGenerativeAI.html)[@langchain/google-genai](https://api.js.langchain.com/modules/langchain_google_genai.html)❌✅✅![NPM - Downloads ](https://img.shields.io/npm/dm/@langchain/google-genai?style=flat-square&label=%20&.png)![NPM - Version ](https://img.shields.io/npm/v/@langchain/google-genai?style=flat-square&label=%20&.png)Model features[​](#model-features)See the links in the table headers below for guides on how to use specific features.[Tool calling](/docs/how_to/tool_calling)[Structured output](/docs/how_to/structured_output/)JSON mode[Image input](/docs/how_to/multimodal_inputs/)Audio inputVideo input[Token-level streaming](/docs/how_to/chat_streaming/)[Token usage](/docs/how_to/chat_token_usage_tracking/)[Logprobs](/docs/how_to/logprobs/)✅✅❌✅✅✅✅✅❌Setup[​](#setup)You can access Google’s gemini and gemini-vision models, as well as other generative models in LangChain through ChatGoogleGenerativeAI class in the @langchain/google-genai integration package.tipYou can also access Google&#x27;s gemini family of models via the LangChain VertexAI and VertexAI-web integrations.Click [here](/docs/integrations/chat/google_vertex_ai) to read the docs.Credentials[​](#credentials)Get an API key here: [https://ai.google.dev/tutorials/setup](https://ai.google.dev/tutorials/setup)Then set the GOOGLE_API_KEY environment variable:

```bash
export GOOGLE_API_KEY="your-api-key"

```If you want to get automated tracing of your model calls you can also set your [LangSmith](https://docs.smith.langchain.com/) API key by uncommenting below:

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"

```Installation[​](#installation)The LangChain ChatGoogleGenerativeAI integration lives in the @langchain/google-genai package:tipSee [this section for general instructions on installing integration packages](/docs/how_to/installation#installing-integration-packages).npmyarnpnpm

```bash
npm i @langchain/google-genai @langchain/core

```

```bash
yarn add @langchain/google-genai @langchain/core

```

```bash
pnpm add @langchain/google-genai @langchain/core

```Instantiation[​](#instantiation)Now we can instantiate our model object and generate chat completions:

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  maxRetries: 2,
  // other params...
});

```Invocation[​](#invocation)

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
  "content": "J&#x27;adore programmer. \n",
  "additional_kwargs": {
    "finishReason": "STOP",
    "index": 0,
    "safetyRatings": [
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "probability": "NEGLIGIBLE"
      }
    ]
  },
  "response_metadata": {
    "finishReason": "STOP",
    "index": 0,
    "safetyRatings": [
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "probability": "NEGLIGIBLE"
      }
    ]
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 21,
    "output_tokens": 5,
    "total_tokens": 26
  }
}

```

```typescript
console.log(aiMsg.content);

```

```text
J&#x27;adore programmer.

```Chaining[​](#chaining)We can [chain](/docs/how_to/sequence/) our model with a prompt template like so:

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
  "content": "Ich liebe das Programmieren. \n",
  "additional_kwargs": {
    "finishReason": "STOP",
    "index": 0,
    "safetyRatings": [
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "probability": "NEGLIGIBLE"
      }
    ]
  },
  "response_metadata": {
    "finishReason": "STOP",
    "index": 0,
    "safetyRatings": [
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "probability": "NEGLIGIBLE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "probability": "NEGLIGIBLE"
      }
    ]
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 16,
    "output_tokens": 7,
    "total_tokens": 23
  }
}

```Safety Settings[​](#safety-settings)Gemini models have default safety settings that can be overridden. If you are receiving lots of “Safety Warnings” from your models, you can try tweaking the safety_settings attribute of the model. For example, to turn off safety blocking for dangerous content, you can import enums from the @google/generative-ai package, then construct your LLM as follows:

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const llmWithSafetySettings = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
  // other params...
});

```Tool calling[​](#tool-calling)Tool calling with Google AI is mostly the same [as tool calling with other models](/docs/how_to/tool_calling), but has a few restrictions on schema.The Google AI API does not allow tool schemas to contain an object with unknown properties. For example, the following Zod schemas will throw an error:const invalidSchema = z.object({ properties: z.record(z.unknown()) });andconst invalidSchema2 = z.record(z.unknown());Instead, you should explicitly define the properties of the object field. Here’s an example:

```typescript
import { tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Define your tool
const fakeBrowserTool = tool(
  (_) => {
    return "The search result is xyz...";
  },
  {
    name: "browser_tool",
    description:
      "Useful for when you need to find something on the web or summarize a webpage.",
    schema: z.object({
      url: z.string().describe("The URL of the webpage to search."),
      query: z.string().optional().describe("An optional search query to use."),
    }),
  }
);

const llmWithTool = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
}).bindTools([fakeBrowserTool]); // Bind your tools to the model

const toolRes = await llmWithTool.invoke([
  [
    "human",
    "Search the web and tell me what the weather will be like tonight in new york. use a popular weather website",
  ],
]);

console.log(toolRes.tool_calls);

```

```text
[
  {
    name: &#x27;browser_tool&#x27;,
    args: {
      url: &#x27;https://www.weather.com&#x27;,
      query: &#x27;weather tonight in new york&#x27;
    },
    type: &#x27;tool_call&#x27;
  }
]

```Built in Google Search Retrieval[​](#built-in-google-search-retrieval)Google also offers a built in search tool which you can use to ground content generation in real-world information. Here’s an example of how to use it:

```typescript
import {
  DynamicRetrievalMode,
  GoogleSearchRetrievalTool,
} from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const searchRetrievalTool: GoogleSearchRetrievalTool = {
  googleSearchRetrieval: {
    dynamicRetrievalConfig: {
      mode: DynamicRetrievalMode.MODE_DYNAMIC,
      dynamicThreshold: 0.7, // default is 0.7
    },
  },
};
const searchRetrievalModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  maxRetries: 0,
}).bindTools([searchRetrievalTool]);

const searchRetrievalResult = await searchRetrievalModel.invoke(
  "Who won the 2024 MLB World Series?"
);

console.log(searchRetrievalResult.content);

```

```text
The Los Angeles Dodgers won the 2024 World Series, defeating the New York Yankees in Game 5 on October 30, 2024, by a score of 7-6. This victory marks the Dodgers&#x27; eighth World Series title and their first in a full season since 1988.  They achieved this win by overcoming a 5-0 deficit, making them the first team in World Series history to win a clinching game after being behind by such a margin.  The Dodgers also became the first team in MLB postseason history to overcome a five-run deficit, fall behind again, and still win.  Walker Buehler earned the save in the final game, securing the championship for the Dodgers.

```The response also includes metadata about the search result:

```typescript
console.dir(searchRetrievalResult.response_metadata?.groundingMetadata, {
  depth: null,
});

```

```text
{
  searchEntryPoint: {
    renderedContent: &#x27;<style>\n&#x27; +
      &#x27;.container {\n&#x27; +
      &#x27;  align-items: center;\n&#x27; +
      &#x27;  border-radius: 8px;\n&#x27; +
      &#x27;  display: flex;\n&#x27; +
      &#x27;  font-family: Google Sans, Roboto, sans-serif;\n&#x27; +
      &#x27;  font-size: 14px;\n&#x27; +
      &#x27;  line-height: 20px;\n&#x27; +
      &#x27;  padding: 8px 12px;\n&#x27; +
      &#x27;}\n&#x27; +
      &#x27;.chip {\n&#x27; +
      &#x27;  display: inline-block;\n&#x27; +
      &#x27;  border: solid 1px;\n&#x27; +
      &#x27;  border-radius: 16px;\n&#x27; +
      &#x27;  min-width: 14px;\n&#x27; +
      &#x27;  padding: 5px 16px;\n&#x27; +
      &#x27;  text-align: center;\n&#x27; +
      &#x27;  user-select: none;\n&#x27; +
      &#x27;  margin: 0 8px;\n&#x27; +
      &#x27;  -webkit-tap-highlight-color: transparent;\n&#x27; +
      &#x27;}\n&#x27; +
      &#x27;.carousel {\n&#x27; +
      &#x27;  overflow: auto;\n&#x27; +
      &#x27;  scrollbar-width: none;\n&#x27; +
      &#x27;  white-space: nowrap;\n&#x27; +
      &#x27;  margin-right: -12px;\n&#x27; +
      &#x27;}\n&#x27; +
      &#x27;.headline {\n&#x27; +
      &#x27;  display: flex;\n&#x27; +
      &#x27;  margin-right: 4px;\n&#x27; +
      &#x27;}\n&#x27; +
      &#x27;.gradient-container {\n&#x27; +
      &#x27;  position: relative;\n&#x27; +
      &#x27;}\n&#x27; +
      &#x27;.gradient {\n&#x27; +
      &#x27;  position: absolute;\n&#x27; +
      &#x27;  transform: translate(3px, -9px);\n&#x27; +
      &#x27;  height: 36px;\n&#x27; +
      &#x27;  width: 9px;\n&#x27; +
      &#x27;}\n&#x27; +
      &#x27;@media (prefers-color-scheme: light) {\n&#x27; +
      &#x27;  .container {\n&#x27; +
      &#x27;    background-color: #fafafa;\n&#x27; +
      &#x27;    box-shadow: 0 0 0 1px #0000000f;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .headline-label {\n&#x27; +
      &#x27;    color: #1f1f1f;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .chip {\n&#x27; +
      &#x27;    background-color: #ffffff;\n&#x27; +
      &#x27;    border-color: #d2d2d2;\n&#x27; +
      &#x27;    color: #5e5e5e;\n&#x27; +
      &#x27;    text-decoration: none;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .chip:hover {\n&#x27; +
      &#x27;    background-color: #f2f2f2;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .chip:focus {\n&#x27; +
      &#x27;    background-color: #f2f2f2;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .chip:active {\n&#x27; +
      &#x27;    background-color: #d8d8d8;\n&#x27; +
      &#x27;    border-color: #b6b6b6;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .logo-dark {\n&#x27; +
      &#x27;    display: none;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .gradient {\n&#x27; +
      &#x27;    background: linear-gradient(90deg, #fafafa 15%, #fafafa00 100%);\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;}\n&#x27; +
      &#x27;@media (prefers-color-scheme: dark) {\n&#x27; +
      &#x27;  .container {\n&#x27; +
      &#x27;    background-color: #1f1f1f;\n&#x27; +
      &#x27;    box-shadow: 0 0 0 1px #ffffff26;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .headline-label {\n&#x27; +
      &#x27;    color: #fff;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .chip {\n&#x27; +
      &#x27;    background-color: #2c2c2c;\n&#x27; +
      &#x27;    border-color: #3c4043;\n&#x27; +
      &#x27;    color: #fff;\n&#x27; +
      &#x27;    text-decoration: none;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .chip:hover {\n&#x27; +
      &#x27;    background-color: #353536;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .chip:focus {\n&#x27; +
      &#x27;    background-color: #353536;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .chip:active {\n&#x27; +
      &#x27;    background-color: #464849;\n&#x27; +
      &#x27;    border-color: #53575b;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .logo-light {\n&#x27; +
      &#x27;    display: none;\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;  .gradient {\n&#x27; +
      &#x27;    background: linear-gradient(90deg, #1f1f1f 15%, #1f1f1f00 100%);\n&#x27; +
      &#x27;  }\n&#x27; +
      &#x27;}\n&#x27; +
      &#x27;</style>\n&#x27; +
      &#x27;<div class="container">\n&#x27; +
      &#x27;  <div class="headline">\n&#x27; +
      &#x27;    <svg class="logo-light" width="18" height="18" viewBox="9 9 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">\n&#x27; +
      &#x27;      <path fill-rule="evenodd" clip-rule="evenodd" d="M42.8622 27.0064C42.8622 25.7839 42.7525 24.6084 42.5487 23.4799H26.3109V30.1568H35.5897C35.1821 32.3041 33.9596 34.1222 32.1258 35.3448V39.6864H37.7213C40.9814 36.677 42.8622 32.2571 42.8622 27.0064V27.0064Z" fill="#4285F4"/>\n&#x27; +
      &#x27;      <path fill-rule="evenodd" clip-rule="evenodd" d="M26.3109 43.8555C30.9659 43.8555 34.8687 42.3195 37.7213 39.6863L32.1258 35.3447C30.5898 36.3792 28.6306 37.0061 26.3109 37.0061C21.8282 37.0061 18.0195 33.9811 16.6559 29.906H10.9194V34.3573C13.7563 39.9841 19.5712 43.8555 26.3109 43.8555V43.8555Z" fill="#34A853"/>\n&#x27; +
      &#x27;      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.6559 29.8904C16.3111 28.8559 16.1074 27.7588 16.1074 26.6146C16.1074 25.4704 16.3111 24.3733 16.6559 23.3388V18.8875H10.9194C9.74388 21.2072 9.06992 23.8247 9.06992 26.6146C9.06992 29.4045 9.74388 32.022 10.9194 34.3417L15.3864 30.8621L16.6559 29.8904V29.8904Z" fill="#FBBC05"/>\n&#x27; +
      &#x27;      <path fill-rule="evenodd" clip-rule="evenodd" d="M26.3109 16.2386C28.85 16.2386 31.107 17.1164 32.9095 18.8091L37.8466 13.8719C34.853 11.082 30.9659 9.3736 26.3109 9.3736C19.5712 9.3736 13.7563 13.245 10.9194 18.8875L16.6559 23.3388C18.0195 19.2636 21.8282 16.2386 26.3109 16.2386V16.2386Z" fill="#EA4335"/>\n&#x27; +
      &#x27;    </svg>\n&#x27; +
      &#x27;    <svg class="logo-dark" width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">\n&#x27; +
      &#x27;      <circle cx="24" cy="23" fill="#FFF" r="22"/>\n&#x27; +
      &#x27;      <path d="M33.76 34.26c2.75-2.56 4.49-6.37 4.49-11.26 0-.89-.08-1.84-.29-3H24.01v5.99h8.03c-.4 2.02-1.5 3.56-3.07 4.56v.75l3.91 2.97h.88z" fill="#4285F4"/>\n&#x27; +
      &#x27;      <path d="M15.58 25.77A8.845 8.845 0 0 0 24 31.86c1.92 0 3.62-.46 4.97-1.31l4.79 3.71C31.14 36.7 27.65 38 24 38c-5.93 0-11.01-3.4-13.45-8.36l.17-1.01 4.06-2.85h.8z" fill="#34A853"/>\n&#x27; +
      &#x27;      <path d="M15.59 20.21a8.864 8.864 0 0 0 0 5.58l-5.03 3.86c-.98-2-1.53-4.25-1.53-6.64 0-2.39.55-4.64 1.53-6.64l1-.22 3.81 2.98.22 1.08z" fill="#FBBC05"/>\n&#x27; +
      &#x27;      <path d="M24 14.14c2.11 0 4.02.75 5.52 1.98l4.36-4.36C31.22 9.43 27.81 8 24 8c-5.93 0-11.01 3.4-13.45 8.36l5.03 3.85A8.86 8.86 0 0 1 24 14.14z" fill="#EA4335"/>\n&#x27; +
      &#x27;    </svg>\n&#x27; +
      &#x27;    <div class="gradient-container"><div class="gradient"></div></div>\n&#x27; +
      &#x27;  </div>\n&#x27; +
      &#x27;  <div class="carousel">\n&#x27; +
      &#x27;    <a class="chip" href="https://vertexaisearch.cloud.google.com/grounding-api-redirect/AZnLMfyXqJN3K4FKueRIZDY2Owjs5Rw4dqgDOc6ZjYKsFo4GgENxLktR2sPHtNUuEBIUeqmUYc3jz9pLRq2cgSpc-4EoGBwQSTTpKk71CX7revnXUa54r9LxcxKgYxrUNBm5HpEm6JDNeJykc6NacPYv43M2wgkrhHCHCzHRyjEP2YR0Pxq4JQMUuOrLeTAYWB9oUb87FE5ksfuB6gimqO5-6uS3psR6">who won the 2024 mlb world series</a>\n&#x27; +
      &#x27;  </div>\n&#x27; +
      &#x27;</div>\n&#x27;
  },
  groundingChunks: [
    {
      web: {
        uri: &#x27;https://vertexaisearch.cloud.google.com/grounding-api-redirect/AZnLMfwvs0gpiM4BbIcNXZnnp4d4ED_rLnIYz2ZwM-lwFnoUxXNlKzy7ZSbbs_E27yhARG6Gx2AuW7DsoqkWPfDFMqPdXfvG3n0qFOQxQ4MBQ9Ox9mTk3KH5KPRJ79m8V118RQRyhi6oK5qg5-fLQunXUVn_a42K7eMk7Kjb8VpZ4onl8Glv1lQQsAK7YWyYkQ7WkTHDHVGB-vrL2U2yRQ==&#x27;,
        title: &#x27;foxsports.com&#x27;
      }
    },
    {
      web: {
        uri: &#x27;https://vertexaisearch.cloud.google.com/grounding-api-redirect/AZnLMfwxwBq8VYgKAhf3UC8U6U5D-i0lK4TwP-2Jf8ClqB-sI0iptm9GxgeaH1iHFbSi-j_C3UqYj8Ok0YDTyvg87S7JamU48pndrd467ZQbI2sI0yWxsCCZ_dosXHwemBHFL5TW2hbAqasq93CfJ09cp1jU&#x27;,
        title: &#x27;mlb.com&#x27;
      }
    }
  ],
  groundingSupports: [
    {
      segment: {
        endIndex: 131,
        text: &#x27;The Los Angeles Dodgers won the 2024 World Series, defeating the New York Yankees in Game 5 on October 30, 2024, by a score of 7-6.&#x27;
      },
      groundingChunkIndices: [ 0, 1 ],
      confidenceScores: [ 0.7652759, 0.7652759 ]
    },
    {
      segment: {
        startIndex: 401,
        endIndex: 531,
        text: &#x27;The Dodgers also became the first team in MLB postseason history to overcome a five-run deficit, fall behind again, and still win.&#x27;
      },
      groundingChunkIndices: [ 1 ],
      confidenceScores: [ 0.8487609 ]
    }
  ],
  retrievalMetadata: { googleSearchDynamicRetrievalScore: 0.93359375 },
  webSearchQueries: [ &#x27;who won the 2024 mlb world series&#x27; ]
}

```Code Execution[​](#code-execution)Google Generative AI also supports code execution. Using the built in CodeExecutionTool, you can make the model generate code, execute it, and use the results in a final completion:

```typescript
import { CodeExecutionTool } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const codeExecutionTool: CodeExecutionTool = {
  codeExecution: {}, // Simply pass an empty object to enable it.
};
const codeExecutionModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  maxRetries: 0,
}).bindTools([codeExecutionTool]);

const codeExecutionResult = await codeExecutionModel.invoke(
  "Use code execution to find the sum of the first and last 3 numbers in the following list: [1, 2, 3, 72638, 8, 727, 4, 5, 6]"
);

console.dir(codeExecutionResult.content, { depth: null });

```

```text
[
  {
    type: &#x27;text&#x27;,
    text: "Here&#x27;s how to find the sum of the first and last three numbers in the given list using Python:\n" +
      &#x27;\n&#x27;
  },
  {
    type: &#x27;executableCode&#x27;,
    executableCode: {
      language: &#x27;PYTHON&#x27;,
      code: &#x27;\n&#x27; +
        &#x27;my_list = [1, 2, 3, 72638, 8, 727, 4, 5, 6]\n&#x27; +
        &#x27;\n&#x27; +
        &#x27;first_three_sum = sum(my_list[:3])\n&#x27; +
        &#x27;last_three_sum = sum(my_list[-3:])\n&#x27; +
        &#x27;total_sum = first_three_sum + last_three_sum\n&#x27; +
        &#x27;\n&#x27; +
        &#x27;print(f"{first_three_sum=}")\n&#x27; +
        &#x27;print(f"{last_three_sum=}")\n&#x27; +
        &#x27;print(f"{total_sum=}")\n&#x27; +
        &#x27;\n&#x27;
    }
  },
  {
    type: &#x27;codeExecutionResult&#x27;,
    codeExecutionResult: {
      outcome: &#x27;OUTCOME_OK&#x27;,
      output: &#x27;first_three_sum=6\nlast_three_sum=15\ntotal_sum=21\n&#x27;
    }
  },
  {
    type: &#x27;text&#x27;,
    text: &#x27;Therefore, the sum of the first three numbers (1, 2, 3) is 6, the sum of the last three numbers (4, 5, 6) is 15, and their total sum is 21.\n&#x27;
  }
]

```You can also pass this generation back to the model as chat history:

```typescript
const codeExecutionExplanation = await codeExecutionModel.invoke([
  codeExecutionResult,
  {
    role: "user",
    content:
      "Please explain the question I asked, the code you wrote, and the answer you got.",
  },
]);

console.log(codeExecutionExplanation.content);

```

```text
You asked for the sum of the first three and the last three numbers in the list `[1, 2, 3, 72638, 8, 727, 4, 5, 6]`.

Here&#x27;s a breakdown of the code:

1. **`my_list = [1, 2, 3, 72638, 8, 727, 4, 5, 6]`**: This line defines the list of numbers you provided.

2. **`first_three_sum = sum(my_list[:3])`**: This calculates the sum of the first three numbers.  `my_list[:3]` is a slice of the list that takes elements from the beginning up to (but not including) the index 3.  So, it takes elements at indices 0, 1, and 2, which are 1, 2, and 3. The `sum()` function then adds these numbers together.

3. **`last_three_sum = sum(my_list[-3:])`**: This calculates the sum of the last three numbers. `my_list[-3:]` is a slice that takes elements starting from the third element from the end and goes to the end of the list. So it takes elements at indices -3, -2, and -1 which correspond to 4, 5, and 6. The `sum()` function adds these numbers.

4. **`total_sum = first_three_sum + last_three_sum`**: This adds the sum of the first three numbers and the sum of the last three numbers to get the final result.

5. **`print(f"{first_three_sum=}")`**, **`print(f"{last_three_sum=}")`**, and **`print(f"{total_sum=}")`**: These lines print the calculated sums in a clear and readable format.

The output of the code was:

* `first_three_sum=6`
* `last_three_sum=15`
* `total_sum=21`

Therefore, the answer to your question is 21.

```Context Caching[​](#context-caching)Context caching allows you to pass some content to the model once, cache the input tokens, and then refer to the cached tokens for subsequent requests to reduce cost. You can create a CachedContent object using GoogleAICacheManager class and then pass the CachedContent object to your ChatGoogleGenerativeAIModel with enableCachedContent() method.

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  GoogleAICacheManager,
  GoogleAIFileManager,
} from "@google/generative-ai/server";

const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
const cacheManager = new GoogleAICacheManager(process.env.GOOGLE_API_KEY);

// uploads file for caching
const pathToVideoFile = "/path/to/video/file";
const displayName = "example-video";
const fileResult = await fileManager.uploadFile(pathToVideoFile, {
  displayName,
  mimeType: "video/mp4",
});

// creates cached content AFTER uploading is finished
const cachedContent = await cacheManager.create({
  model: "models/gemini-1.5-flash-001",
  displayName: displayName,
  systemInstruction:
    "You are an expert video analyzer, and your job is to answer " +
    "the user&#x27;s query based on the video file you have access to.",
  contents: [
    {
      role: "user",
      parts: [
        {
          fileData: {
            mimeType: fileResult.file.mimeType,
            fileUri: fileResult.file.uri,
          },
        },
      ],
    },
  ],
  ttlSeconds: 300,
});

// passes cached video to model
const model = new ChatGoogleGenerativeAI({});
model.useCachedContent(cachedContent);

// invokes model with cached video
await model.invoke("Summarize the video");

```Note** - Context caching supports both Gemini 1.5 Pro and Gemini 1.5 Flash. Context caching is only available for stable models with fixed versions (for example, gemini-1.5-pro-001). You must include the version postfix (for example, the -001 in gemini-1.5-pro-001). - The minimum input token count for context caching is 32,768, and the maximum is the same as the maximum for the given model. ## Gemini Prompting FAQs[​](#gemini-prompting-faqs) As of the time this doc was written (2023/12/12), Gemini has some restrictions on the types and structure of prompts it accepts. Specifically:When providing multimodal (image) inputs, you are restricted to at most 1 message of “human” (user) type. You cannot pass multiple messages (though the single human message may have multiple content entries)
- System messages are not natively supported, and will be merged with the first human message if present.
- For regular chat conversations, messages must follow the human/ai/human/ai alternating pattern. You may not provide 2 AI or human messages in sequence.
- Message may be blocked if they violate the safety checks of the LLM. In this case, the model will return an empty response.

## API reference[​](#api-reference)

For detailed documentation of all ChatGoogleGenerativeAI features and configurations head to the API reference: [https://api.js.langchain.com/classes/langchain_google_genai.ChatGoogleGenerativeAI.html](https://api.js.langchain.com/classes/langchain_google_genai.ChatGoogleGenerativeAI.html)

## Related[​](#related)

- Chat model [conceptual guide](/docs/concepts/#chat-models)
- Chat model [how-to guides](/docs/how_to/#chat-models)

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Overview](#overview)[Integration details](#integration-details)
- [Model features](#model-features)

- [Setup](#setup)[Credentials](#credentials)
- [Installation](#installation)

- [Instantiation](#instantiation)
- [Invocation](#invocation)
- [Chaining](#chaining)
- [Safety Settings](#safety-settings)
- [Tool calling](#tool-calling)[Built in Google Search Retrieval](#built-in-google-search-retrieval)
- [Code Execution](#code-execution)

- [Context Caching](#context-caching)
- [Gemini Prompting FAQs](#gemini-prompting-faqs)
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