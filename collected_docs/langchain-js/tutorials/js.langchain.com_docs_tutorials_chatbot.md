Build a Chatbot | 🦜️🔗 Langchain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this pageBuild a ChatbotPrerequisitesThis guide assumes familiarity with the following concepts:Chat Models](/docs/concepts/chat_models)[Prompt Templates](/docs/concepts/prompt_templates)[Chat History](/docs/concepts/chat_history)This guide requires langgraph >= 0.2.28.noteThis tutorial previously built a chatbot using [RunnableWithMessageHistory](https://api.js.langchain.com/classes/_langchain_core.runnables.RunnableWithMessageHistory.html). You can access this version of the tutorial in the [v0.2 docs](https://js.langchain.com/v0.2/docs/tutorials/chatbot/).The LangGraph implementation offers a number of advantages over RunnableWithMessageHistory, including the ability to persist arbitrary components of an application&#x27;s state (instead of only messages).Overview[​](#overview)We’ll go over an example of how to design and implement an LLM-powered chatbot. This chatbot will be able to have a conversation and remember previous interactions.Note that this chatbot that we build will only use the language model to have a conversation. There are several other related concepts that you may be looking for:[Conversational RAG](/docs/tutorials/qa_chat_history): Enable a chatbot experience over an external source of data[Agents](https://langchain-ai.github.io/langgraphjs/tutorials/multi_agent/agent_supervisor/): Build a chatbot that can take actionsThis tutorial will cover the basics which will be helpful for those two more advanced topics, but feel free to skip directly to there should you choose.Setup[​](#setup)Jupyter Notebook[​](#jupyter-notebook)This guide (and most of the other guides in the documentation) uses [Jupyter notebooks](https://jupyter.org/) and assumes the reader is as well. Jupyter notebooks are perfect for learning how to work with LLM systems because oftentimes things can go wrong (unexpected output, API down, etc) and going through guides in an interactive environment is a great way to better understand them.This and other tutorials are perhaps most conveniently run in a Jupyter notebook. See [here](https://jupyter.org/install) for instructions on how to install.Installation[​](#installation)For this tutorial we will need @langchain/core and langgraph:npmyarnpnpm

```bash
npm i @langchain/core @langchain/langgraph uuid

```

```bash
yarn add @langchain/core @langchain/langgraph uuid

```

```bash
pnpm add @langchain/core @langchain/langgraph uuid

```For more details, see our [Installation guide](/docs/how_to/installation).LangSmith[​](#langsmith)Many of the applications you build with LangChain will contain multiple steps with multiple invocations of LLM calls. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly is going on inside your chain or agent. The best way to do this is with [LangSmith](https://smith.langchain.com).After you sign up at the link above, make sure to set your environment variables to start logging traces:

```typescript
process.env.LANGSMITH_TRACING = "true";
process.env.LANGSMITH_API_KEY = "...";

```Quickstart[​](#quickstart)First up, let’s learn how to use a language model by itself. LangChain supports many different language models that you can use interchangeably - select the one you want to use below!Pick your chat model:GroqOpenAIAnthropicGoogle GeminiFireworksAIMistralAIVertexAIInstall dependenciestipSee [this section for general instructions on installing integration packages](/docs/how_to/installation/#installing-integration-packages).npmyarnpnpm

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

const llm = new ChatGroq({
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

const llm = new ChatOpenAI({
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

const llm = new ChatAnthropic({
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

const llm = new ChatGoogleGenerativeAI({
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

const llm = new ChatFireworks({
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

const llm = new ChatMistralAI({
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

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

```Let’s first use the model directly. ChatModels are instances of LangChain “Runnables”, which means they expose a standard interface for interacting with them. To just simply call the model, we can pass in a list of messages to the .invoke method.

```typescript
await llm.invoke([{ role: "user", content: "Hi im bob" }]);

```

```text
AIMessage {
  "id": "chatcmpl-AekDrrCyaBauLYHuVv3dkacxW2G1J",
  "content": "Hi Bob! How can I help you today?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 10,
      "completionTokens": 10,
      "totalTokens": 20
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 10,
      "completion_tokens": 10,
      "total_tokens": 20,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_6fc10e10eb"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 10,
    "input_tokens": 10,
    "total_tokens": 20,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```The model on its own does not have any concept of state. For example, if you ask a followup question:

```typescript
await llm.invoke([{ role: "user", content: "Whats my name" }]);

```

```text
AIMessage {
  "id": "chatcmpl-AekDuOk1LjOdBVLtuCvuHjAs5aoad",
  "content": "I&#x27;m sorry, but I don&#x27;t have access to personal information about users unless you&#x27;ve shared it with me in this conversation. How can I assist you today?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 10,
      "completionTokens": 30,
      "totalTokens": 40
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 10,
      "completion_tokens": 30,
      "total_tokens": 40,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_6fc10e10eb"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 30,
    "input_tokens": 10,
    "total_tokens": 40,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```Let’s take a look at the example [LangSmith trace](https://smith.langchain.com/public/3b768e44-a319-453a-bd6e-30f9df75f16a/r)We can see that it doesn’t take the previous conversation turn into context, and cannot answer the question. This makes for a terrible chatbot experience!To get around this, we need to pass the entire conversation history into the model. Let’s see what happens when we do that:

```typescript
await llm.invoke([
  { role: "user", content: "Hi! I&#x27;m Bob" },
  { role: "assistant", content: "Hello Bob! How can I assist you today?" },
  { role: "user", content: "What&#x27;s my name?" },
]);

```

```text
AIMessage {
  "id": "chatcmpl-AekDyJdj6y9IREyNIf3tkKGRKhN1Z",
  "content": "Your name is Bob! How can I help you today, Bob?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 33,
      "completionTokens": 14,
      "totalTokens": 47
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 33,
      "completion_tokens": 14,
      "total_tokens": 47,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_6fc10e10eb"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 14,
    "input_tokens": 33,
    "total_tokens": 47,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```And now we can see that we get a good response!This is the basic idea underpinning a chatbot’s ability to interact conversationally. So how do we best implement this?Message persistence[​](#message-persistence)[LangGraph](https://langchain-ai.github.io/langgraphjs/) implements a built-in persistence layer, making it ideal for chat applications that support multiple conversational turns.Wrapping our chat model in a minimal LangGraph application allows us to automatically persist the message history, simplifying the development of multi-turn applications.LangGraph comes with a simple in-memory checkpointer, which we use below.

```typescript
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";

// Define the function that calls the model
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages);
  return { messages: response };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

```We now need to create a config that we pass into the runnable every time. This config contains information that is not part of the input directly, but is still useful. In this case, we want to include a thread_id. This should look like:

```typescript
import { v4 as uuidv4 } from "uuid";

const config = { configurable: { thread_id: uuidv4() } };

```This enables us to support multiple conversation threads with a single application, a common requirement when your application has multiple users.We can then invoke the application:

```typescript
const input = [
  {
    role: "user",
    content: "Hi! I&#x27;m Bob.",
  },
];
const output = await app.invoke({ messages: input }, config);
// The output contains all messages in the state.
// This will log the last message in the conversation.
console.log(output.messages[output.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekEFPclmrO7YfAe7J0zUAanS4ifx",
  "content": "Hi Bob! How can I assist you today?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 12,
      "completionTokens": 10,
      "totalTokens": 22
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 12,
      "completion_tokens": 10,
      "total_tokens": 22,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_6fc10e10eb"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 10,
    "input_tokens": 12,
    "total_tokens": 22,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```

```typescript
const input2 = [
  {
    role: "user",
    content: "What&#x27;s my name?",
  },
];
const output2 = await app.invoke({ messages: input2 }, config);
console.log(output2.messages[output2.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekEJgCfLodGCcuLgLQdJevH7CpCJ",
  "content": "Your name is Bob! How can I help you today, Bob?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 34,
      "completionTokens": 14,
      "totalTokens": 48
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 34,
      "completion_tokens": 14,
      "total_tokens": 48,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_6fc10e10eb"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 14,
    "input_tokens": 34,
    "total_tokens": 48,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```Great! Our chatbot now remembers things about us. If we change the config to reference a different thread_id, we can see that it starts the conversation fresh.

```typescript
const config2 = { configurable: { thread_id: uuidv4() } };
const input3 = [
  {
    role: "user",
    content: "What&#x27;s my name?",
  },
];
const output3 = await app.invoke({ messages: input3 }, config2);
console.log(output3.messages[output3.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekELvPXLtjOKgLN63mQzZwvyo12J",
  "content": "I&#x27;m sorry, but I don&#x27;t have access to personal information about individuals unless you share it with me. How can I assist you today?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 11,
      "completionTokens": 27,
      "totalTokens": 38
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 11,
      "completion_tokens": 27,
      "total_tokens": 38,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_39a40c96a0"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 27,
    "input_tokens": 11,
    "total_tokens": 38,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```However, we can always go back to the original conversation (since we are persisting it in a database)

```typescript
const output4 = await app.invoke({ messages: input2 }, config);
console.log(output4.messages[output4.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekEQ8Z5JmYquSfzPsCWv1BDTKZSh",
  "content": "Your name is Bob. Is there something specific you would like to talk about?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 60,
      "completionTokens": 16,
      "totalTokens": 76
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 60,
      "completion_tokens": 16,
      "total_tokens": 76,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_39a40c96a0"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 16,
    "input_tokens": 60,
    "total_tokens": 76,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```This is how we can support a chatbot having conversations with many users!Right now, all we’ve done is add a simple persistence layer around the model. We can start to make the more complicated and personalized by adding in a prompt template.Prompt templates[​](#prompt-templates)Prompt Templates help to turn raw user information into a format that the LLM can work with. In this case, the raw user input is just a message, which we are passing to the LLM. Let’s now make that a bit more complicated. First, let’s add in a system message with some custom instructions (but still taking messages as input). Next, we’ll add in more input besides just the messages.To add in a system message, we will create a ChatPromptTemplate. We will utilize MessagesPlaceholder to pass all the messages in.

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You talk like a pirate. Answer all questions to the best of your ability.",
  ],
  ["placeholder", "{messages}"],
]);

```We can now update our application to incorporate this template:

```typescript
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";

// Define the function that calls the model
const callModel2 = async (state: typeof MessagesAnnotation.State) => {
  const prompt = await promptTemplate.invoke(state);
  const response = await llm.invoke(prompt);
  // Update message history with response:
  return { messages: [response] };
};

// Define a new graph
const workflow2 = new StateGraph(MessagesAnnotation)
  // Define the (single) node in the graph
  .addNode("model", callModel2)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const app2 = workflow2.compile({ checkpointer: new MemorySaver() });

```We invoke the application in the same way:

```typescript
const config3 = { configurable: { thread_id: uuidv4() } };
const input4 = [
  {
    role: "user",
    content: "Hi! I&#x27;m Jim.",
  },
];
const output5 = await app2.invoke({ messages: input4 }, config3);
console.log(output5.messages[output5.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekEYAQVqh9OFZRGdzGiPz33WPf1v",
  "content": "Ahoy, Jim! A pleasure to meet ye, matey! What be on yer mind this fine day?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 32,
      "completionTokens": 23,
      "totalTokens": 55
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 32,
      "completion_tokens": 23,
      "total_tokens": 55,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_39a40c96a0"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 23,
    "input_tokens": 32,
    "total_tokens": 55,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```

```typescript
const input5 = [
  {
    role: "user",
    content: "What is my name?",
  },
];
const output6 = await app2.invoke({ messages: input5 }, config3);
console.log(output6.messages[output6.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekEbrpFI3K8BxemHZ5fG4xF2tT8x",
  "content": "Ye be callin&#x27; yerself Jim, if I heard ye right, savvy? What else can I do fer ye, me hearty?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 68,
      "completionTokens": 29,
      "totalTokens": 97
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 68,
      "completion_tokens": 29,
      "total_tokens": 97,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_6fc10e10eb"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 29,
    "input_tokens": 68,
    "total_tokens": 97,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```Awesome! Let’s now make our prompt a little bit more complicated. Let’s assume that the prompt template now looks something like this:

```typescript
const promptTemplate2 = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
  ],
  ["placeholder", "{messages}"],
]);

```Note that we have added a new language input to the prompt. Our application now has two parameters– the input messages and language. We should update our application’s state to reflect this:

```typescript
import {
  START,
  END,
  StateGraph,
  MemorySaver,
  MessagesAnnotation,
  Annotation,
} from "@langchain/langgraph";

// Define the State
const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>(),
});

// Define the function that calls the model
const callModel3 = async (state: typeof GraphAnnotation.State) => {
  const prompt = await promptTemplate2.invoke(state);
  const response = await llm.invoke(prompt);
  return { messages: [response] };
};

const workflow3 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel3)
  .addEdge(START, "model")
  .addEdge("model", END);

const app3 = workflow3.compile({ checkpointer: new MemorySaver() });

```

```typescript
const config4 = { configurable: { thread_id: uuidv4() } };
const input6 = {
  messages: [
    {
      role: "user",
      content: "Hi im bob",
    },
  ],
  language: "Spanish",
};
const output7 = await app3.invoke(input6, config4);
console.log(output7.messages[output7.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekF4R7ioefFo6PmOYo3YuCbGpROq",
  "content": "¡Hola, Bob! ¿Cómo puedo ayudarte hoy?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 32,
      "completionTokens": 11,
      "totalTokens": 43
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 32,
      "completion_tokens": 11,
      "total_tokens": 43,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_39a40c96a0"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 11,
    "input_tokens": 32,
    "total_tokens": 43,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```Note that the entire state is persisted, so we can omit parameters like language if no changes are desired:

```typescript
const input7 = {
  messages: [
    {
      role: "user",
      content: "What is my name?",
    },
  ],
};
const output8 = await app3.invoke(input7, config4);
console.log(output8.messages[output8.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekF8yN7H81ITccWlBzSahmduP69T",
  "content": "Tu nombre es Bob. ¿En qué puedo ayudarte, Bob?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 56,
      "completionTokens": 13,
      "totalTokens": 69
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 56,
      "completion_tokens": 13,
      "total_tokens": 69,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_6fc10e10eb"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 13,
    "input_tokens": 56,
    "total_tokens": 69,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```To help you understand what’s happening internally, check out [this LangSmith trace](https://smith.langchain.com/public/d61630b7-6a52-4dc9-974c-8452008c498a/r).Managing Conversation History[​](#managing-conversation-history)One important concept to understand when building chatbots is how to manage conversation history. If left unmanaged, the list of messages will grow unbounded and potentially overflow the context window of the LLM. Therefore, it is important to add a step that limits the size of the messages you are passing in.Importantly, you will want to do this BEFORE the prompt template but AFTER you load previous messages from Message History.**We can do this by adding a simple step in front of the prompt that modifies the messages key appropriately, and then wrap that new chain in the Message History class.LangChain comes with a few built-in helpers for [managing a list of messages](/docs/how_to/#messages). In this case we’ll use the [trimMessages](/docs/how_to/trim_messages/) helper to reduce how many messages we’re sending to the model. The trimmer allows us to specify how many tokens we want to keep, along with other parameters like if we want to always keep the system message and whether to allow partial messages:

```typescript
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
  trimMessages,
} from "@langchain/core/messages";

const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

const messages = [
  new SystemMessage("you&#x27;re a good assistant"),
  new HumanMessage("hi! I&#x27;m bob"),
  new AIMessage("hi!"),
  new HumanMessage("I like vanilla ice cream"),
  new AIMessage("nice"),
  new HumanMessage("whats 2 + 2"),
  new AIMessage("4"),
  new HumanMessage("thanks"),
  new AIMessage("no problem!"),
  new HumanMessage("having fun?"),
  new AIMessage("yes!"),
];

await trimmer.invoke(messages);

```

```text
[
  SystemMessage {
    "content": "you&#x27;re a good assistant",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  HumanMessage {
    "content": "I like vanilla ice cream",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "nice",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  },
  HumanMessage {
    "content": "whats 2 + 2",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "4",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  },
  HumanMessage {
    "content": "thanks",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "no problem!",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  },
  HumanMessage {
    "content": "having fun?",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "yes!",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  }
]

```To use it in our chain, we just need to run the trimmer before we pass the messages input to our prompt.

```typescript
const callModel4 = async (state: typeof GraphAnnotation.State) => {
  const trimmedMessage = await trimmer.invoke(state.messages);
  const prompt = await promptTemplate2.invoke({
    messages: trimmedMessage,
    language: state.language,
  });
  const response = await llm.invoke(prompt);
  return { messages: [response] };
};

const workflow4 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel4)
  .addEdge(START, "model")
  .addEdge("model", END);

const app4 = workflow4.compile({ checkpointer: new MemorySaver() });

```Now if we try asking the model our name, it won’t know it since we trimmed that part of the chat history:

```typescript
const config5 = { configurable: { thread_id: uuidv4() } };
const input8 = {
  messages: [...messages, new HumanMessage("What is my name?")],
  language: "English",
};

const output9 = await app4.invoke(input8, config5);
console.log(output9.messages[output9.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekHyVN7f0Pnuyc2RHVL8CxKmFfMQ",
  "content": "I don&#x27;t know your name. You haven&#x27;t shared it yet!",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 97,
      "completionTokens": 12,
      "totalTokens": 109
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 97,
      "completion_tokens": 12,
      "total_tokens": 109,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_6fc10e10eb"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 12,
    "input_tokens": 97,
    "total_tokens": 109,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```But if we ask about information that is within the last few messages, it remembers:

```typescript
const config6 = { configurable: { thread_id: uuidv4() } };
const input9 = {
  messages: [...messages, new HumanMessage("What math problem did I ask?")],
  language: "English",
};

const output10 = await app4.invoke(input9, config6);
console.log(output10.messages[output10.messages.length - 1]);

```

```text
AIMessage {
  "id": "chatcmpl-AekI1jwlErzHuZ3BhAxr97Ct818Pp",
  "content": "You asked what 2 + 2 equals.",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 99,
      "completionTokens": 10,
      "totalTokens": 109
    },
    "finish_reason": "stop",
    "usage": {
      "prompt_tokens": 99,
      "completion_tokens": 10,
      "total_tokens": 109,
      "prompt_tokens_details": {
        "cached_tokens": 0,
        "audio_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "audio_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      }
    },
    "system_fingerprint": "fp_6fc10e10eb"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 10,
    "input_tokens": 99,
    "total_tokens": 109,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}

```If you take a look at LangSmith, you can see exactly what is happening under the hood in the [LangSmith trace](https://smith.langchain.com/public/ac63745d-8429-4ae5-8c11-9ec79d9632f2/r). ## Next Steps[​](#next-steps) Now that you understand the basics of how to create a chatbot in LangChain, some more advanced tutorials you may be interested in are:[Conversational RAG](/docs/tutorials/qa_chat_history): Enable a chatbot experience over an external source of data
- [Agents](https://langchain-ai.github.io/langgraphjs/tutorials/multi_agent/agent_supervisor/): Build a chatbot that can take actions

If you want to dive deeper on specifics, some things worth checking out are:

- [Streaming](/docs/how_to/streaming): streaming is *crucial* for chat applications
- [How to add message history](/docs/how_to/message_history): for a deeper dive into all things related to message history
- [How to manage large message history](/docs/how_to/trim_messages/): more techniques for managing a large chat history
- [LangGraph main docs](https://langchain-ai.github.io/langgraphjs/): for more detail on building with LangGraph

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

- [Overview](#overview)
- [Setup](#setup)[Jupyter Notebook](#jupyter-notebook)
- [Installation](#installation)
- [LangSmith](#langsmith)

- [Quickstart](#quickstart)
- [Message persistence](#message-persistence)
- [Prompt templates](#prompt-templates)
- [Managing Conversation History](#managing-conversation-history)
- [Next Steps](#next-steps)

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