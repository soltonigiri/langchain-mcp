- How to have agent respond in structured format [Skip to content](#how-to-have-agent-respond-in-structured-format) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [How to manage agent steps](../managing-agent-steps/)

- [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent)

- [LangGraph Platform](../../how-tos#langgraph-platform)

- [Concepts](../../concepts/)

- [Tutorials](../../tutorials/)

- Resources

- [Agents](../../agents/overview/)

- [API reference](../../reference/)

- [Versions](../../versions/)

[How to have agent respond in structured format¶](#how-to-have-agent-respond-in-structured-format)

The typical ReAct agent prompts the LLM to respond in 1 of two formats: a function call (~ JSON) to use a tool, or conversational text to respond to the user.

If your agent is connected to a structured (or even generative) UI, or if it is communicating with another agent or software process, you may want it to resopnd in a specific structured format.

In this example we will build a conversational ReAct agent that responds in a specific format. We will do this by using [tool calling](https://js.langchain.com/docs/modules/model_io/models/chat/function-calling/). This is useful when you want to enforce that an agent's response is in a specific format. In this example, we will ask it respond as if it were a weatherman, returning the temperature and additional info in separate, machine-readable fields.

## Setup[¶](#setup)

First we need to install the packages required

```
yarn add langchain @langchain/anthropic @langchain/langgraph @langchain/core

```

Next, we need to set API keys for OpenAI (the LLM we will use).

```
// process.env.OPENAI_API_KEY = "sk_...";

```

Optionally, we can set API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

```
// process.env.LANGCHAIN_API_KEY = "ls...";
process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
process.env.LANGCHAIN_TRACING_V2 = "true";
process.env.LANGCHAIN_PROJECT = "Respond in Format: LangGraphJS";

```

```
Respond in Format: LangGraphJS

```

## Set up the State[¶](#set-up-the-state)

```
import { Annotation, messagesStateReducer } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
  }),
});

```

## Set up the tools[¶](#set-up-the-tools)

```
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const searchTool = tool((_) => {
  // This is a placeholder, but don't tell the LLM that...
  return "67 degrees. Cloudy with a chance of rain.";
}, {
  name: "search",
  description: "Call to surf the web.",
  schema: z.object({
    query: z.string().describe("The query to use in your search."),
  }),
});

const tools = [searchTool];

```

We can now wrap these tools in a [ToolNode](/langgraphjs/reference/classes/langgraph_prebuilt.ToolNode.html).

```
import { ToolNode } from "@langchain/langgraph/prebuilt";

const toolNode = new ToolNode<typeof GraphState.State>(tools);

```

## Set up the model[¶](#set-up-the-model)

```
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  temperature: 0,
  model: "gpt-4o",
});

```

After we've done this, we should make sure the model knows that it has these tools available to call. We can do this by binding the LangChain tools to the model class.

We also want to define a response schema for the language model and bind it to the model as a tool. The idea is that when the model is ready to respond, it'll call this final tool and populate arguments for it according to the schema we want. Rather than calling a tool, we'll instead return from the graph.

Because we only intend to use this final tool to guide the schema of the model's final response, we'll declare it with a mocked out function:

```
import { tool } from "@langchain/core/tools";

const Response = z.object({
  temperature: z.number().describe("the temperature"),
  other_notes: z.string().describe("any other notes about the weather"),
});

const finalResponseTool = tool(async () => "mocked value", {
  name: "Response",
  description: "Always respond to the user using this tool.",
  schema: Response
})

const boundModel = model.bindTools([
  ...tools,
  finalResponseTool
]);

```

## Define the nodes[¶](#define-the-nodes)

```
import { AIMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";

// Define the function that determines whether to continue or not
const route = (state: typeof GraphState.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // If there is no function call, then we finish
  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    return "__end__";
  }
  // Otherwise if there is, we need to check what type of function call it is
  if (lastMessage.tool_calls[0].name === "Response") {
    return "__end__";
  }
  // Otherwise we continue
  return "tools";
};

// Define the function that calls the model
const callModel = async (
  state: typeof GraphState.State,
  config?: RunnableConfig,
) => {
  const { messages } = state;
  const response = await boundModel.invoke(messages, config);
  // We return an object, because this will get added to the existing list
  return { messages: [response] };
};

```

## Define the graph[¶](#define-the-graph)

```
import { StateGraph } from "@langchain/langgraph";

// Define a new graph
const workflow = new StateGraph(GraphState)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges(
    // First, we define the start node. We use `agent`.
    // This means these are the edges taken after the `agent` node is called.
    "agent",
    // Next, we pass in the function that will determine which node is called next.
    route,
    // We supply a map of possible response values to the conditional edge
    // to make it possible to draw a visualization of the graph.
    {
      __end__: "__end__",
      tools: "tools",
    }
  )
  // We now add a normal edge from `tools` to `agent`.
  // This means that after `tools` is called, `agent` node is called next.
  .addEdge("tools", "agent");

// Finally, we compile it!
// This compiles it into a LangChain Runnable,
// meaning you can use it as you would any other runnable
const app = workflow.compile();

```

```
import * as tslab from "tslab";

const graph = app.getGraph();
const image = await graph.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

await tslab.display.png(new Uint8Array(arrayBuffer));

```

![ ](data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCADaAMcDASIAAhEBAxEB/8QAHQABAAIDAAMBAAAAAAAAAAAAAAYHBAUIAQMJAv/EAFAQAAEEAQICBAkGCAsGBwAAAAEAAgMEBQYRBxITITFVCBQWIkFRYZTRFRcyNpPhI1Jxc3SBsrMJGCQzQlZidpWh0iU1U3KRsSZDRVSCkqL/xAAbAQEAAgMBAQAAAAAAAAAAAAAAAgMBBAUGB//EADoRAAIBAgIGBQkHBQAAAAAAAAABAgMRBBMSITFRUpEVQWGhsQUUMmJxgcHR8DM0Y3Ky4fEiQlOCwv/aAAwDAQACEQMRAD8A+qaIiAIiIAiIgCIiALV+VOFH/q9D3lnxW0VFaEweNm0VgZJMfVfI6jCXOdC0knkHWTsqq1enhqeZNN60tXbf5G5h8Pntq9rFw+VWF74oe8s+KeVWF74oe8s+KrvyexfdtP7BnwTyexfdtP7BnwXO6Vw/BLmjd6O9buLE8qsL3xQ95Z8U8qsL3xQ95Z8VXfk9i+7af2DPgnk9i+7af2DPgnSuH4Jc0OjvW7ixPKrC98UPeWfFPKrC98UPeWfFV35PYvu2n9gz4J5PYvu2n9gz4J0rh+CXNDo71u4sTyqwvfFD3lnxTyqwvfFD3lnxVd+T2L7tp/YM+CeT2L7tp/YM+CdK4fglzQ6O9buLE8qsL3xQ95Z8Vl0slUyTHPqWobTWnZzoJA8A+3YqsPJ7F920/sGfBbXhdVhp5vVUcEMcEYlrnkjaGj+a9QW5hsXSxblGEWmlfXbel8TXr4PJhp6Vyw0RFtHOCIiAIiIAiIgCIiAIiIAiIgCpjh/9RtP/AKBB+wFc6pjh/wDUbT/6BB+wFy/Kf3X/AGXhI6/k70pG/REXkzuENj4v6Sm1nJpSLKmfORSGF8ENWZ8bZBH0hjMoYYw8MBdyc3Nt6FHOGHhB4PiJhs/kJYLeJjw89wzOsUrLIxWgkc0SmR8TW8xa3mMY3c3cgjcFRR3yrp/jkxui8PqelBlMuXakrX6B+Rp4uhIddhnPU2XdsY2a7z9utvVucLT1/WOkNB8S9MYTT+Wr6whv5fJ4y7JQLqdhk1gyROimP4N8hbJuGE78zSCFvZULatrt18zUzJX19vVyLSwHHHROp8fmrmPzRfFhqpu3o56c8E0MAa5xk6KRjXubs12xaCDtsFF9ZeE/pbB6NOoML43nq/jlKq18WPtthcLEnLztk6EtfytDzs3fzmhnU5zQao8nMjc1Hqm9jcPry9TyHD/JYtt7U0Fh8893drxGI37uj3BPKA1rHO5gwFWTr/SuVm8GXT1DHYizZyGLgwtp+Lgi2nLa0teSWNrDsecNjd5vbuNu1ZyqUZK/W11mMypKL7C4sFm6uo8RWyVLp/FbDeePxmtJXk23286ORrXt7OxwCz1qtMahj1Tha+TipZDHxzc21fKVH1bDdnEedG8Bzd9txv6CFtVotWdjbWtBZPDb6waq/O1v3Sxlk8NvrBqr87W/dLu+R/tKn5f+omhjvsfeT9EReiPOBERAEREAREQBERAEREAREQBUxw/+o2n/ANAg/YCudQSpwfxdCrDWr5TMw14WBkcbbnU1oGwA6lr4nDrFUcvSs7p9z+Zv4SvGg25dZWbuAHDNxJOgNNknrJOLh/0rzJwC4aSvc9+gtOPe4kuc7GQkk+s+arQ+aqj3xm/ffuT5qqPfGb99+5c3oyp/m8Td88ocPcjS0KFbFUa1KnBHVp1o2wwwQtDWRsaAGtaB1AAAAD2LIWy+aqj3xm/ffuT5qqPfGb99+5V9Efirkyfn9LczWoq08Gyrd4n4HWVvOZvKSTYvVeRxFYwWOjArwuaIwerrOxO59Kt35qqPfGb99+5Oh/xVyZnpCluZA9S8KdGayyPyhntK4fM3uQR+M3qUc0nKN9m8zgTsNz1e1an+L9wy3+oGm/8AC4f9KtL5qqPfGb99+5Pmqo98Zv337lYvJc1qVbxIPG0Hrce5EV0vo7BaJoSUtP4ejhKckpmfBQrthY55ABcQ0AE7NaN/YFIeG31g1V+drfulk/NVR74zfvv3Lc6X0fT0objqs1qxJbe18sluXpHEtGw69vUt3CYPzWU5ynpNq2x70/ga+IxVOrT0Io3qIi3TlBERAEREAREQBERAEREAREQBERAEREAREQHO/gU/VTiT/f8AzP7xi6IXO/gU/VTiT/f/ADP7xi6IQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQHO/gU/VTiT/AH/zP7xi6IXO/gU/VTiT/f8AzP7xi6IQBERAEREAREQBERAEREAREQBERAEREAREQBERAEXgnYbnsUIv8TBPIY8DjzlmAgG7LL0NU+1j9nGQe1rS0+h3qnGEp7CcISqO0VcnC5N/hHuCcvE/gozUePY6TL6QdLeEY/p1HhosgDs3AYyTf1RuA7VdB1pq1x3FTCs/smSZ2369h/2Xrsar1TbgkgnpYKaGVpY+OTpXNc0jYgg9oIVmUuJczY80rbj5UeBRwLPHTjhi6d2sZtOYjbJZUubux0bCOSI+g9I/laR28vOR2L7Srl3wfuEE3g5Y7P1NOQYyY5i863LNadIXsjG4igBAG7WAu2J6yXOPp2FseWerv/bYT/7TJlLiXMeaVtxZSKu4OIGoasgNzB07sG/WaFwtlA9jJGhp/W8KX6e1NQ1NWfLSkdzRnlmgmYY5YXep7HdY9h7COsEjrUZU5RWltXY7/wAe8qnRnT9JG1REVRSEREAREQBERAEREAREQBERAEREAREQFe67yrs1lnafjd/III2y5DY/zxd9CA/2SAXPHpBa07tc4HDAAAAGwHoWDTe6bO6mlk/nXZSRrvXs1jGt/wDy1qwNd52vpjRmbytrKR4SGpTllORlh6ZtYhp2f0f9PY7eb/S7PSrK+qSgti8ev63WPR4eCp0k/eb1Fy9h+NOvNLz6xrX48vnTV0nNqLGHP4qvRsOfG/kI6Ou7rjPO07PDXjlI9q9MfGjUejr+Xyb9aR8RMRR0XLnnsq1q8UMNx0kbYo3uibuGOHOWgnmAD9+bqI17Es+J1Oi590Rqbiw3PYuXJ1M1ewtyvM/IzZWjja0NM9C58b65r2Hvc3nDW8sgcdnb824WFoLX+uYcJwf1NmtUDNVtYTRUL2MOPggjidJVllZLG5jQ8PBh87clp5jytYNgMElVW5/X8nRrZGvLg1wcWnlcAd9j6j/1WLbNrHzsyuNBOSrNJbGHcrbDO0xP9YPoJ+idiPTvS/gx4HKUJdd2bepr2UrN1RlaxpT167I3SiwN7BcyNrud2x3aDyDc7NHUr0U4TcJaSMq1WH9S2lh4rJ181jKmQqP6StaibNE71tcAR/kVlqHcJnudoqJp+hFdvRR/8jbczWj9QAH6lMVfVioVJRXU2eZktGTQREVREIiIAiIgCIiAIiIAiIgCIiAIiICs9S0HYHWE8rgRSzPLJG8nzW2WMDXM9hcxjXD18sh9HXpdYaTx2utL5PT+XidNjchA6CZrHFrtj6WkdhB2IPrAUq1rxA0nX1fhOHuY8Zs5nUMb5a1SvVleGRx7uMzpWDaLlc1uz9wWuLSNttxgX9MahwT+WCEahpAgNkjeyK00f22uLWPPtaW7/i+u6Uc6zT1+J18NiYaGXUKjn4FRYyTJZyDUGps9qV+FtYlk13KMifNFIAWxh7Yg2Ite0ObIxoIJJdzdihPB/hXqzH5Kzhsth7uN0Dcx09bJ4nOWsdY8ZkeGtZ0PiULC0BvOHF53II6gRuugDeyLep2ms013pArNdt+sOIT5Qv8A9XM17p96j5vV3eBt3o3TUu8h2iuDlfRL+SHVOpspRjqOpVsfk77Za9aI7dTWhgLi0NAaXlxA6gesr90eDOEoab0LhI7V81NH2YrVB7pGc8ro4ZImiU8mxHLK4nlDesD8h2ml+IVPWte9Pg8dlMnDRuS4+y+CruIrEZAkjPX2t3G63Xyhf/q5mvdPvTzeruJ6dFdaI3pjhdR0hq3M5vG5XKxQZaeS3Yw7p2Oo+MScvPM1pZzhzuXc+ftuT1KU5O6+jULoYjYtPPR164OxmlP0WD8p9PoG57AvMMefvyCOnpq4wk7dNfljrxN/L5zn/wDRhUPg4/8ACjh3xHyGnNYa2pQa1oFkb2WKssVWsJI2v5YpC0s35XtDnF/MTuNmjzRlUtB6VTlfW+Wz3lNTE06UbQd2XlpXBjTencfjek6Z9eINkl/4kh63v/W4k/rW1UV0pxW0XrtzG6c1bhM5I/fljx+Qimf1Akjla4kHYE7behSpQlJybk9rOC3fWERFEwEREAREQBERAEREAREQBEVcT8VWap1brPQelI7UOrMJjhKclkMdL8mQ2ZGAwxvf1cx2ex5a3taSQTsQAJnm9U4fTUmPZlspTxsmQssp02WpmxusTuOzY4wT5zj6h1qAWTqji5BxA0plsNl+H+FjkbRxeo8fkmC5dbuTJNEGgmJuwYBvvuHO7CCBstN8LW38RpO3xEGL1trXAiSSLOPxzIhHK9wJdEzrDCA1g3G2/IHbNPULBQGo0tpmppLT+KxFWSxZhxtVlOGxdlM07mNAA55D1uJ5RufTstuiIAiIgK64J5b5XxOpX+QPzfdDn7sHivQdD8o8rm/y7boo+bpe3m2dvt9JysVQvhdi9bYrH5tmucxSzNyXMWZsdJSYGthoOI6CJ20ce72jfc7O7fpFTRAF88/4UXgKJIsbxWxNY8zOTHZvkHo7IJnfuyfbEF9DFqdV6VxWuNN5LAZ2lHkcRkYHVrVWQkCRjhsRuCC0+kOBBBAIIIBQHyT8CfA6b0TxO0zr/ibWyWG0w+WSPAZW3jwcVYvt3aHSzPBDejO5Y4DYSM5udvREH6/QTx2YY5oZGyxSND2SMcHNc0jcEEdoK02V0Np3N6Rdpa9hKFjTZrtqDFOrt8WbC0AMY1gGzQ0Acu23LsNttgucptCcQvBHmfe0Ay5xC4VB5ks6OsSGTI4lhO5dSkPXIwf8M9f5SXPAHVSKF8KeMGlONWmGZ3SeUjyFXcMnhPmT1ZPTHLGetjh7eo9oJHWpogCIiAIiIAiIgCIiALW5nPU8N0EU1qrHetl0dKpYsMidalDd+jZzHrP5N9u1bJVTxftaJr6+4Ws1RTu2c1LmJG4CSqSI4bXRHmdLs4bt5fWD1+hAYkeh8zx70HgJeI+NyGh71XKDJHC4PNO8+NjiYY7MkYG/a1xDT1OY0gt62i4AAN9htv2ryiAIiIAiIgCIiAqLwdodAY2prfG6Ez9nNOj1Lds5iK75stS9I4dLGGmNhEYLSGnYg7HZztjtbqgvEvSGpMjpyz83uYoaS1JLehuy3J6DZorvJyh0c4A5iHNa1pcPO2aADss3T3FHTWo9a57R1PKxTanwLYnZCiY3Rua17WuD2h30m+cAS0nYkAnrG4EtREQBERAUPxV8GU5TU79fcM8v5A8R2AmS3AzellR2mO5CBs8E/wBMAuHaQ4hu2fwS4/X9balv6C1tpuxpHiTiqnjlqi0GSnbr8wZ4zWlG4MZc4DYncE7bu2dtdK504Df+NvCS4461d+ErUbdXSdF/4ni0fNZbv7ZXNKA6LREQBERAEX5e9sbS5xDWtG5JOwAWt8qsL3xQ95Z8VJRlLYgbRFq/KrC98UPeWfFPKrC98UPeWfFSy58LM2ZmZGWzDj7MlKBlq4yJzoYJZeiZI8A8rS/Z3KCdhvsdt99j2L536m/hUcrRz0NSXhPVpT460+O7XvZcyzNc3drmMcIG9E8OB3JDvVsvoJ5VYXvih7yz4r5s+HB4NY1H4Q+nsro+WpJT1tYbBckge10VO23YSTSbHZrHM/CE+kslKZc+FizO3vBg472/CL4aP1fZ0u/SsL70tWtA+540LEbGs3ma/o2dXOXs227Yz1+q3FDNA0tJcN9F4XS+GydCHGYqqyrCDaj5nBo63O6+tzju4n0kkrf+VWF74oe8s+KZc+FizNoi1flVhe+KHvLPinlVhe+KHvLPimXPhYszaIsalkqmSY51S1Baa07OdBIHgH27FZKg007MwERFgBRbXmlchnNOZ1umcjDpnVV6mK1fPNqMmki5SSwODh5zQXP2B7OdxHWpSiApDWfhO6V4CYuDEcS87zasqYOPI2PEsfIyPJSb9G5tXfzXPMg+jzAAHmcWtDi3Y+DD4ReN8Jfh0/UlPHOwt2tbkp3cY+x05geNnNIfyt5muY5p35R18w6+Xc8o+HpwK478aNa1L9PTtDLaQw4mjxVTD2mPnja8t55ZhIGPdJJyM3awFrA0NG55nvg38Hnm9UcFvCFm0JqbA5bCs1VVfH4pepyQubPAx8schDgDy8gmG4G3ng77BAfUVFh3MvQx7uW1dr1neqaVrD/mVj+VWF74oe8s+KmoSetIzY86nz9bSmmstm7h5aeNqTXJjvtsyNhe7/JpVM+BDgLOL8HjB5XID/a2pbFnUFx+3032ZXOa79cfRrE8M/W0TfB51HicFer3MxnnQYWvFBM15/DytZJzbE7N6PpNyrd0rY07pXTWIwVHK0fFMbUhpQNFhn0I2Bjerf1NCzlz4WLMk6L8RSsmjD43tkY7sc07g/rX7VZgIiIDV6q+rGY/Q5v2CqswGAxj8FjnOx1RzjWjJJgbufNHsVp6q+rGY/Q5v2Cq709/uDG/o0X7AWtjJyjQjou2v4HnfLUnGFOz638B5PYvu2n9gz4J5PYvu2n9gz4LYIuLm1OJ8zymnLea/wAnsX3bT+wZ8E8nsX3bT+wZ8FFM/wActD6Yz8uGyeejrXYHsjsO6CV8FZztuVs0zWGOIncHZ7gdiD6V69RceNDaUy+SxmTzZgu4x0bb0bKdiUVQ+NsjHyuZGWsYWvaedxDe0b7ggT062995ao1nsT7yX+T2L7tp/YM+CeT2L7tp/YM+Cj2seL2kdA2KNfNZhkFi9GZq8FeCWzI+IdsnLE1xDB+OQG+1Y/BHXV3iXwq07qfIxVobuSgMsjKjXNiBD3NHKHOcdtgO0lY06ttLSdvaLVVDTd7fXyJT5PYvu2n9gz4J5PYvu2n9gz4LYIo5tTifMq05bz28LqsNPN6pjrwxwRiWueSNoaP5r1BWGoDw2+sGqvzlb90p8vTSbai3wx/Sj6HhNeHp+xeAREUDaCIiA/E00deF8sr2xRRtLnvedmtA6yST2BVnldQXtYOLop7GMwm/4KKImOe038eR30mNPaGN2dtsXEEljdzxStGShjMQCOjydvo5wd/OhYx0j29X4xa1pHpDj+RadXXyoqS2vuXzvyOrg6EZLMkauDSuGrD8HiqYPpcYGlx9PWSNz+te3yfxfdtP7BvwUEwHHDG5vi3qLQrqd2GxjDBHDZFKy6Od7o3vk5n9FyRNbyANLnbP380nsWwwnHDQ+otSswOOz0djIyySQw7QSthsSR787IpiwRyObsdwxxPUfUqXVqPW5PmdRSh1Mlfk/i+7af2Dfgh09iiCDjaZB9HQM+CiruOGh2ar8nDno/lTxoUCBBKYBZP/AJBn5eiEno5Ofm36tt1qtP8AGWtDjNd5TVVipisZp7UU2IimijeS+MMhLN2guL5HOlI2aOvq2CxmT4mNOG8ndfAQYyfxjEOfhLW4PSUdmNdt1bPj25Hj/mB9m2wKnmkNWPzRloX42QZeuwPkbECIp2E7CWPck7b9RaSSw9RJBa51faU1ditbYdmUw88lim57o+aWvJA8OadnAska1zSD6CAvflbRw9rGZiM8slK1Hzn1wyPEcrfb5rubY9W7W9m24vpzlWapzd77Pb1e41cRQjUg5R2lvoiKk4Bq9VfVjMfoc37BVd6e/wBwY39Gi/YCsTVX1YzH6HN+wVXODiZPpzHxyND431I2ua4bggsG4K1Mb9hH2/A835b9Cn7X8DZIoAPB/wCGYII0BpsEekYuH/SvH8X7hl/UDTf+Fw/6VxLR3/XM8xanvfL9ykKPD+DFZrWWmtY6c4gZb5ZzluzDNgb135LvVLMnMDKI5mxRlocWva8Dqb1c26mM+jshWPhC1ocRddWyGOgr40GB7vHA3Eti5YiR+EIcOXq3PN1dqvqCCOtBHDCxsUUbQxjGDYNaBsAB6l7FY6rZsPFSbv8AW1P4HN+iX5fhXreDMZjSufzFXN6Vw9OvZxlB9mSjNXjeJq0rB50XM57Xbu2buDudx1WD4M2Jv4PgTpCjk6NnGX4arhLUuROiliPSPOzmu6wdiFZ6iupeFOjNZZL5Qz2lcPmb3II/Gb1KOaTlG+zeZwJ2G56vasOekrMjKsqitJW2d2pEqRV//F94Zf1A03/hcP8ApUm0tovAaIpy1NPYajhKssnSyQ0K7YWPfsBzENA3OwA39ig7dRQ1C2pvl+5JOG31g1V+crfulPlAeG31g1V+crfulPl6h+jD8sf0o+g4T7vT9i8AiIom2EREBBOJ9cstabv7Exw3HwPIG/KJInBpPs5g0f8AyC1isDOYatqHE2sdca51ewzlcWHZzT2hzT6HAgEH0EAqtJJLOEvNxmY5YrhPLBYA5Yro9Do+vqdt9KPtad+1vK510k6kFbbHw2373c7GCqq2W9pT/Q5HAcbNeV58TlzU1dRoRY/L0Kb568L44pYn9NI3qiLS5rvO23Cg2nsXnsto7hRw9Zo/MYnL6Vy9Czk8hZpmOhFHUJMkkVj6Mpm7AGbn8IebbYrqRFqG+6V+v62nKMun9Qs4Rz8ImaUzLtRyZxzhm/Ez8nmI5HxoXTZ+juI9vN35+YbcqkU2n462P4rYTVGltTXKlnUzM3TtYKq58jmSCDopqz2ncyRPiLnNG5AHYd9l0YiXMZK3ldcCcnqnKaNtP1Uy6ZIshPDj7OUqircs0m7dFLPEAOSQ+cD1N3DQSBupfqaub+PioMBMl61BVaAN/pSN5j+QN5nH2ArYXL1fHwGazMyCIEDnkdsNz2D8p9S3WjNOT3chFncjXfWbE0jH1JmlsjOYbOmkafoucOpre1rS7m63FrNmgnGSqvYvHd9dRXWqKjTs3rJ0iIqzzp6LtSO/TnqygmKeN0bwDsdiNj/3UNh4SY6vCyKPLZpkbGhrWi71ADqA7FOUU1OUVZEJQjP0kn7SE/NVR74zfvv3J81VHvjN++/cpsizmPs5Ihk0uBckQn5qqPfGb99+5Pmqo98Zv337lNkTMfZyQyaXAuSIT81VHvjN++/cnzVUe+M3779ymyJmPs5IZNLgXJEJ+aqj3xm/ffuT5qqPfGb99+5TZEzH2ckMmlwLkjRaX0fT0objqs1qxJbc18sluXpHEtGw69vUt6iKMpOTuy1JJWQREUTIREQBY2RxlTL1H1b1aK3Wf9KKZgc0+rqKyUWU2ndAhkvCjDb/AMms5SiwdkcGQlLB+QOLgP1L1/NRQ73zXvv3Kbors+pvLVVqL+5kI+aih3vmvffuXkcKMfv15bNOHq8dI/7BTZEz6m8znVOJkdw2gMHhLbbcNR1i6z6Nq5M+xI3q280vJ5er8Xb0+tSJEVcpym7ydyptyd2ERFAwf//Z)

## Use it![¶](#use-it)

We can now use it! This now exposes the [same interface](https://v02.api.js.langchain.com/classes/langchain_core_runnables.Runnable.html) as all other LangChain runnables.

```
import { HumanMessage, isAIMessage } from "@langchain/core/messages";

const prettyPrint = (message: BaseMessage) => {
  let txt = `[${message._getType()}]: ${message.content}`;
  if (
    isAIMessage(message) && message?.tool_calls?.length
  ) {
    const tool_calls = message?.tool_calls
      ?.map((tc) => `- ${tc.name}(${JSON.stringify(tc.args)})`)
      .join("\n");
    txt += ` \nTools: \n${tool_calls}`;
  }
  console.log(txt);
};

const inputs = {
  messages: [new HumanMessage("what is the weather in sf")],
};

const stream = await app.stream(inputs, { streamMode: "values" });

for await (const output of stream) {
  const { messages } = output;
  prettyPrint(messages[messages.length - 1]);
  console.log("\n---\n");
}

```

```
[human]: what is the weather in sf

---

[ai]:
Tools:
- search({"query":"current weather in San Francisco"})

---

[tool]: 67 degrees. Cloudy with a chance of rain.

---

[ai]:
Tools:
- Response({"temperature":67,"other_notes":"Cloudy with a chance of rain."})

---

```

## Partially streaming JSON[¶](#partially-streaming-json)

If we want to stream the structured output as soon as it's available, we can use the [.streamEvents()](https://js.langchain.com/docs/how_to/streaming#using-stream-events) method. We'll aggregate emitted `on_chat_model_events` and inspect the name field. As soon as we detect that the model is calling the final output tool, we can start logging the relevant chunks.

Here's an example:

```
import { concat } from "@langchain/core/utils/stream";

const eventStream = await app.streamEvents(inputs, { version: "v2" });

let aggregatedChunk;
for await (const { event, data } of eventStream) {
  if (event === "on_chat_model_stream") {
    const { chunk } = data;
    if (aggregatedChunk === undefined) {
      aggregatedChunk = chunk;
    } else {
      aggregatedChunk = concat(aggregatedChunk, chunk);
    }
    const currentToolCalls = aggregatedChunk.tool_calls;
    if (
      currentToolCalls.length === 0 ||
      currentToolCalls[0].name === "" ||
      !finalResponseTool.name.startsWith(currentToolCalls[0].name)
    ) {
      // No tool calls or a different tool call in the message,
      // so drop what's currently aggregated and start over
      aggregatedChunk = undefined;
    } else if (currentToolCalls[0].name === finalResponseTool.name) {
      // Now we're sure that this event is part of the final output!
      // Log the partially aggregated args.
      console.log(aggregatedChunk.tool_call_chunks[0].args);

      // You can also log the raw args instead:
      // console.log(chunk.tool_call_chunks);

      console.log("---");
    }
  }
}
// Final aggregated tool call
console.log(aggregatedChunk.tool_calls);

```

```
---
{"
---
{"temperature
---
{"temperature":
---
{"temperature":67
---
{"temperature":67,"
---
{"temperature":67,"other
---
{"temperature":67,"other_notes
---
{"temperature":67,"other_notes":"
---
{"temperature":67,"other_notes":"Cloud
---
{"temperature":67,"other_notes":"Cloudy
---
{"temperature":67,"other_notes":"Cloudy with
---
{"temperature":67,"other_notes":"Cloudy with a
---
{"temperature":67,"other_notes":"Cloudy with a chance
---
{"temperature":67,"other_notes":"Cloudy with a chance of
---
{"temperature":67,"other_notes":"Cloudy with a chance of rain
---
{"temperature":67,"other_notes":"Cloudy with a chance of rain."
---
{"temperature":67,"other_notes":"Cloudy with a chance of rain."}
---
{"temperature":67,"other_notes":"Cloudy with a chance of rain."}
---
[
  {
    name: 'Response',
    args: { temperature: 67, other_notes: 'Cloudy with a chance of rain.' },
    id: 'call_oOhNx2SdeelXn6tbenokDtkO',
    type: 'tool_call'
  }
]

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)