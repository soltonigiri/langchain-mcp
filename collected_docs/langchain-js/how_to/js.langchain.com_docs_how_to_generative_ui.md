How to build an LLM generated UI | 🦜️🔗 Langchain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[How to build an LLM generated UIThis guide will walk through some high level concepts and code snippets for building generative UI&#x27;s using LangChain.js. To see the full code for generative UI, click here to visit our official LangChain Next.js template](https://github.com/langchain-ai/langchain-nextjs-template/blob/7f764d558682214d50b064f4293667123a31e6fe/app/generative_ui/README.md).The sample implements a tool calling agent, which outputs an interactive UI element when streaming intermediate outputs of tool calls to the client.We introduce two utilities which wraps the AI SDK to make it easier to yield React elements inside runnables and tool calls: [createRunnableUI](https://github.com/langchain-ai/langchain-nextjs-template/blob/7f764d558682214d50b064f4293667123a31e6fe/app/generative_ui/utils/server.tsx#L89) and [streamRunnableUI](https://github.com/langchain-ai/langchain-nextjs-template/blob/7f764d558682214d50b064f4293667123a31e6fe/app/generative_ui/utils/server.tsx#L126).The streamRunnableUI executes the provided Runnable with streamEvents method and sends every stream event to the client via the React Server Components stream.
- The createRunnableUI wraps the createStreamableUI function from AI SDK to properly hook into the Runnable event stream.

The usage is then as follows:

```tsx
"use server";

const tool = tool(
  async (input, config) => {
    const stream = await createRunnableUI(config);
    stream.update(<div>Searching...</div>);

    const result = await images(input);
    stream.done(
      <Images
        images={result.images_results
          .map((image) => image.thumbnail)
          .slice(0, input.limit)}
      />
    );

    return `[Returned ${result.images_results.length} images]`;
  },
  {
    name: "Images",
    description: "A tool to search for images. input should be a search query.",
    schema: z.object({
      query: z.string().describe("The search query used to search for cats"),
      limit: z.number().describe("The number of pictures shown to the user"),
    }),
  }
);

// add LLM, prompt, etc...

const tools = [tool];

export const agentExecutor = new AgentExecutor({
  agent: createToolCallingAgent({ llm, tools, prompt }),
  tools,
});

```

tipAs of `langchain` version `0.2.8`, the `createToolCallingAgent` function now supports [OpenAI-formatted tools](https://api.js.langchain.com/interfaces/langchain_core.language_models_base.ToolDefinition.html).

```tsx
async function agent(inputs: {
  input: string;
  chat_history: [role: string, content: string][];
}) {
  "use server";

  return streamRunnableUI(agentExecutor, {
    input: inputs.input,
    chat_history: inputs.chat_history.map(
      ([role, content]) => new ChatMessage(content, role)
    ),
  });
}

export const EndpointsContext = exposeEndpoints({ agent });

```

In order to ensure all of the client components are included in the bundle, we need to wrap all of the Server Actions into `exposeEndpoints` method. These endpoints will be accessible from the client via the Context API, seen in the `useActions` hook.

```tsx
"use client";
import type { EndpointsContext } from "./agent";

export default function Page() {
  const actions = useActions<typeof EndpointsContext>();
  const [node, setNode] = useState();

  return (
    <div>
      {node}

      <button
        onClick={async () => {
          setNode(await actions.agent({ input: "cats" }));
        }}
      >
        Get images of cats
      </button>
    </div>
  );
}

```

#### Was this page helpful?



#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

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