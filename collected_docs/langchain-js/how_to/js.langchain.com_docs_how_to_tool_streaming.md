How to stream tool calls | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[How to stream tool callsWhen tools are called in a streaming context, message chunks](https://api.js.langchain.com/classes/langchain_core_messages.AIMessageChunk.html) will be populated with [tool call chunk](https://api.js.langchain.com/types/langchain_core_messages_tool.ToolCallChunk.html) objects in a list via the .tool_call_chunks attribute. A ToolCallChunk includes optional string fields for the tool name, args, and id, and includes an optional integer field index that can be used to join chunks together. Fields are optional because portions of a tool call may be streamed across different chunks (e.g., a chunk that includes a substring of the arguments may have null values for the tool name and id).Because message chunks inherit from their parent message class, an [AIMessageChunk](https://api.js.langchain.com/classes/langchain_core_messages.AIMessageChunk.html) with tool call chunks will also include .tool_calls and .invalid_tool_calls fields. These fields are parsed best-effort from the message’s tool call chunks.Note that not all providers currently support streaming for tool calls. Before we start let’s define our tools and our model.

```typescript
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";

const addTool = tool(
  async (input) => {
    return input.a + input.b;
  },
  {
    name: "add",
    description: "Adds a and b.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const multiplyTool = tool(
  async (input) => {
    return input.a * input.b;
  },
  {
    name: "multiply",
    description: "Multiplies a and b.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const tools = [addTool, multiplyTool];

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

const modelWithTools = model.bindTools(tools);

```Now let’s define our query and stream our output:

```typescript
const query = "What is 3 * 12? Also, what is 11 + 49?";

const stream = await modelWithTools.stream(query);

for await (const chunk of stream) {
  console.log(chunk.tool_call_chunks);
}

```

```text
[]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;&#x27;,
    id: &#x27;call_MdIlJL5CAYD7iz9gTm5lwWtJ&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: undefined,
    args: &#x27;{"a"&#x27;,
    id: undefined,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: undefined,
    args: &#x27;: 3, &#x27;,
    id: undefined,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: undefined,
    args: &#x27;"b": 1&#x27;,
    id: undefined,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: undefined,
    args: &#x27;2}&#x27;,
    id: undefined,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;add&#x27;,
    args: &#x27;&#x27;,
    id: &#x27;call_ihL9W6ylSRlYigrohe9SClmW&#x27;,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: undefined,
    args: &#x27;{"a"&#x27;,
    id: undefined,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: undefined,
    args: &#x27;: 11,&#x27;,
    id: undefined,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: undefined,
    args: &#x27; "b": &#x27;,
    id: undefined,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: undefined,
    args: &#x27;49}&#x27;,
    id: undefined,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[]
[]

```Note that adding message chunks will merge their corresponding tool call chunks. This is the principle by which LangChain’s various [tool output parsers](/docs/how_to/output_parser_structured) support streaming.For example, below we accumulate tool call chunks:

```typescript
import { concat } from "@langchain/core/utils/stream";

const stream = await modelWithTools.stream(query);

let gathered = undefined;

for await (const chunk of stream) {
  gathered = gathered !== undefined ? concat(gathered, chunk) : chunk;
  console.log(gathered.tool_call_chunks);
}

```

```text
[]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a"&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, &#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, "b": 1&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, "b": 12}&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, "b": 12}&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  },
  {
    name: &#x27;add&#x27;,
    args: &#x27;&#x27;,
    id: &#x27;call_ufY7lDSeCQwWbdq1XQQ2PBHR&#x27;,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, "b": 12}&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  },
  {
    name: &#x27;add&#x27;,
    args: &#x27;{"a"&#x27;,
    id: &#x27;call_ufY7lDSeCQwWbdq1XQQ2PBHR&#x27;,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, "b": 12}&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  },
  {
    name: &#x27;add&#x27;,
    args: &#x27;{"a": 11,&#x27;,
    id: &#x27;call_ufY7lDSeCQwWbdq1XQQ2PBHR&#x27;,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, "b": 12}&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  },
  {
    name: &#x27;add&#x27;,
    args: &#x27;{"a": 11, "b": &#x27;,
    id: &#x27;call_ufY7lDSeCQwWbdq1XQQ2PBHR&#x27;,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, "b": 12}&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  },
  {
    name: &#x27;add&#x27;,
    args: &#x27;{"a": 11, "b": 49}&#x27;,
    id: &#x27;call_ufY7lDSeCQwWbdq1XQQ2PBHR&#x27;,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, "b": 12}&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  },
  {
    name: &#x27;add&#x27;,
    args: &#x27;{"a": 11, "b": 49}&#x27;,
    id: &#x27;call_ufY7lDSeCQwWbdq1XQQ2PBHR&#x27;,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]
[
  {
    name: &#x27;multiply&#x27;,
    args: &#x27;{"a": 3, "b": 12}&#x27;,
    id: &#x27;call_0zGpgVz81Ew0HA4oKblG0s0a&#x27;,
    index: 0,
    type: &#x27;tool_call_chunk&#x27;
  },
  {
    name: &#x27;add&#x27;,
    args: &#x27;{"a": 11, "b": 49}&#x27;,
    id: &#x27;call_ufY7lDSeCQwWbdq1XQQ2PBHR&#x27;,
    index: 1,
    type: &#x27;tool_call_chunk&#x27;
  }
]

```At the end, we can see the final aggregated tool call chunks include the fully gathered raw string value:

```typescript
console.log(typeof gathered.tool_call_chunks[0].args);

```

```text
string

```And we can also see the fully parsed tool call as an object at the end:

```typescript
console.log(typeof gathered.tool_calls[0].args);

```

```text
object

``` #### Was this page helpful? #### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E). Community[LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)

GitHub

- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.