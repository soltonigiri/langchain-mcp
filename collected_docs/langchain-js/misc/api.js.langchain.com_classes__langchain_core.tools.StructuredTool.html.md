StructuredTool | LangChain.js
- **v0.3 v0.2 v0.1 Preparing search index...The search index is not available[LangChain.js](../index.html)[](#)[LangChain.js](../index.html)[@langchain/core](../modules/_langchain_core.html)[tools](../modules/_langchain_core.tools.html)[StructuredTool](_langchain_core.tools.StructuredTool.html)Class StructuredToolAbstractBase class for Tools that accept input of any shape defined by a Zod schema. Type ParametersSchemaT = [ToolSchemaBase](../types/_langchain_core.tools.ToolSchemaBase.html)SchemaOutputT = ToolInputSchemaOutputTypeSchemaInputT = ToolInputSchemaInputTypeToolOutputT = ToolOutputType Hierarchy ([view full](../hierarchy.html#@langchain/core.tools.StructuredTool))[BaseLangChain](_langchain_core.language_models_base.BaseLangChain.html), [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1) | [ToolMessage](_langchain_core.messages_tool.ToolMessage.html)>StructuredTool[Tool](_langchain_core.tools.Tool.html)[DynamicStructuredTool](_langchain_core.tools.DynamicStructuredTool.html)[FakeTool](_langchain_core.utils_testing.FakeTool.html)Implements[StructuredToolInterface](../interfaces/_langchain_core.tools.StructuredToolInterface.html) IndexConstructors[constructor](_langchain_core.tools.StructuredTool.html#constructor) Properties[callbacks?](_langchain_core.tools.StructuredTool.html#callbacks) [defaultConfig?](_langchain_core.tools.StructuredTool.html#defaultConfig) [description](_langchain_core.tools.StructuredTool.html#description) [metadata?](_langchain_core.tools.StructuredTool.html#metadata) [name](_langchain_core.tools.StructuredTool.html#name) [responseFormat?](_langchain_core.tools.StructuredTool.html#responseFormat) [returnDirect](_langchain_core.tools.StructuredTool.html#returnDirect) [schema](_langchain_core.tools.StructuredTool.html#schema) [tags?](_langchain_core.tools.StructuredTool.html#tags) [verbose](_langchain_core.tools.StructuredTool.html#verbose) [verboseParsingErrors](_langchain_core.tools.StructuredTool.html#verboseParsingErrors) Methods[asTool](_langchain_core.tools.StructuredTool.html#asTool) [assign](_langchain_core.tools.StructuredTool.html#assign) [batch](_langchain_core.tools.StructuredTool.html#batch) [bind](_langchain_core.tools.StructuredTool.html#bind) [call](_langchain_core.tools.StructuredTool.html#call) [getGraph](_langchain_core.tools.StructuredTool.html#getGraph) [getName](_langchain_core.tools.StructuredTool.html#getName) [invoke](_langchain_core.tools.StructuredTool.html#invoke) [map](_langchain_core.tools.StructuredTool.html#map) [pick](_langchain_core.tools.StructuredTool.html#pick) [pipe](_langchain_core.tools.StructuredTool.html#pipe) [stream](_langchain_core.tools.StructuredTool.html#stream) [streamEvents](_langchain_core.tools.StructuredTool.html#streamEvents) [streamLog](_langchain_core.tools.StructuredTool.html#streamLog) [toJSON](_langchain_core.tools.StructuredTool.html#toJSON) [toJSONNotImplemented](_langchain_core.tools.StructuredTool.html#toJSONNotImplemented) [transform](_langchain_core.tools.StructuredTool.html#transform) [withConfig](_langchain_core.tools.StructuredTool.html#withConfig) [withFallbacks](_langchain_core.tools.StructuredTool.html#withFallbacks) [withListeners](_langchain_core.tools.StructuredTool.html#withListeners) [withRetry](_langchain_core.tools.StructuredTool.html#withRetry) [isRunnable](_langchain_core.tools.StructuredTool.html#isRunnable) Constructorsconstructor[](#constructor)new StructuredTool(fields?): [StructuredTool](_langchain_core.tools.StructuredTool.html)[](#constructor.new_StructuredTool)Type ParametersSchemaT = [ToolSchemaBase](../types/_langchain_core.tools.ToolSchemaBase.html)SchemaOutputT = ToolInputSchemaOutputTypeSchemaInputT = ToolInputSchemaInputTypeToolOutputT = anyParametersOptionalfields: [ToolParams](../interfaces/_langchain_core.tools.ToolParams.html)Returns [StructuredTool](_langchain_core.tools.StructuredTool.html) PropertiesOptionalcallbacks[](#callbacks)callbacks?: [Callbacks](../types/_langchain_core.callbacks_manager.Callbacks.html)OptionaldefaultConfig[](#defaultConfig)defaultConfig?: [ToolRunnableConfig](../types/_langchain_core.tools.ToolRunnableConfig.html)Default config object for the tool runnable. Abstractdescription[](#description)description: stringA description of the tool. Optionalmetadata[](#metadata)metadata?: RecordAbstractname[](#name)name: stringThe name of the tool. OptionalresponseFormat[](#responseFormat)responseFormat?: string = "content"The tool response format. If "content" then the output of the tool is interpreted as the contents of a ToolMessage. If "content_and_artifact" then the output is expected to be a two-tuple corresponding to the (content, artifact) of a ToolMessage. Default[](#Default)

```
"content"
Copy

``` returnDirect[](#returnDirect)returnDirect: boolean = falseWhether to return the tool's output directly. Setting this to true means that after the tool is called, an agent should stop looping. Abstractschema[](#schema)schema: [SchemaT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.SchemaT-1)A Zod schema representing the parameters of the tool. Optionaltags[](#tags)tags?: string[]verbose[](#verbose)verbose: booleanWhether to print out response text. verboseParsingErrors[](#verboseParsingErrors)verboseParsingErrors: boolean = false MethodsasTool[](#asTool)asTool(fields): [RunnableToolLike](_langchain_core.runnables.RunnableToolLike.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1)>[](#asTool.asTool-1)Convert a runnable to a tool. Return a new instance of RunnableToolLike which contains the runnable, name, description and schema. Type ParametersT = [StructuredToolCallInput](../types/_langchain_core.tools.StructuredToolCallInput.html)Parametersfields: { description?: string; name?: string; schema: [InteropZodType](../types/_langchain_core.utils_types.InteropZodType.html); }Optionaldescription?: stringThe description of the tool. Falls back to the description on the Zod schema if not provided, or undefined if neither are provided. Optionalname?: stringThe name of the tool. If not provided, it will default to the name of the runnable. schema: [InteropZodType](../types/_langchain_core.utils_types.InteropZodType.html)The Zod schema for the input of the tool. Infers the Zod type from the input type of the runnable. Returns [RunnableToolLike](_langchain_core.runnables.RunnableToolLike.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1)>An instance of RunnableToolLike which is a runnable that can be used as a tool. assign[](#assign)assign(mapping): [Runnable](_langchain_core.runnables.Runnable.html)>>[](#assign.assign-1)Assigns new fields to the dict output of this runnable. Returns a new runnable. Parametersmapping: RunnableMapLike, Record>Returns [Runnable](_langchain_core.runnables.Runnable.html)>>batch[](#batch)batch(inputs, options?, batchOptions?): Promise[](#batch.batch-1)Default implementation of batch, which calls invoke N times. Subclasses should override this method if they can batch more efficiently. Parametersinputs: [StructuredToolCallInput](../types/_langchain_core.tools.StructuredToolCallInput.html)[]Array of inputs to each batch call. Optionaloptions: Partial>> | Partial>>[]Either a single call options object to apply to each batch call or an array for each call. OptionalbatchOptions: [RunnableBatchOptions](../types/_langchain_core.runnables.RunnableBatchOptions.html) & { returnExceptions?: false; }Returns PromiseAn array of RunOutputs, or mixed RunOutputs and errors if batchOptions.returnExceptions is set batch(inputs, options?, batchOptions?): Promise[](#batch.batch-2)Parametersinputs: [StructuredToolCallInput](../types/_langchain_core.tools.StructuredToolCallInput.html)[]Optionaloptions: Partial>> | Partial>>[]OptionalbatchOptions: [RunnableBatchOptions](../types/_langchain_core.runnables.RunnableBatchOptions.html) & { returnExceptions: true; }Returns Promisebatch(inputs, options?, batchOptions?): Promise[](#batch.batch-3)Parametersinputs: [StructuredToolCallInput](../types/_langchain_core.tools.StructuredToolCallInput.html)[]Optionaloptions: Partial>> | Partial>>[]OptionalbatchOptions: [RunnableBatchOptions](../types/_langchain_core.runnables.RunnableBatchOptions.html)Returns Promisebind[](#bind)bind(kwargs): [Runnable](_langchain_core.runnables.Runnable.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>[](#bind.bind-1)Bind arguments to a Runnable, returning a new Runnable. Parameterskwargs: Partial>>Returns [Runnable](_langchain_core.runnables.Runnable.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>A new RunnableBinding that, when invoked, will apply the bound args. Deprecated[](#Deprecated)Use [withConfig](_langchain_core.tools.StructuredTool.html#withConfig) instead. This will be removed in the next breaking release. call[](#call)call(arg, configArg?, tags?): Promise>[](#call.call-1)Type ParametersTArgTConfig extends undefined | [ToolRunnableConfig](../types/_langchain_core.tools.ToolRunnableConfig.html)Parametersarg: [TArg](_langchain_core.tools.StructuredTool.html#call.call-1.TArg)The input argument for the tool. OptionalconfigArg: [TConfig](_langchain_core.tools.StructuredTool.html#call.call-1.TConfig)Optional configuration or callbacks for the tool. Optionaltags: string[]Optional tags for the tool. Returns Promise>A Promise that resolves with a string. Deprecated[](#Deprecated-1)Use .invoke() instead. Will be removed in 0.3.0. Calls the tool with the provided argument, configuration, and tags. It parses the input according to the schema, handles any errors, and manages callbacks. getGraph[](#getGraph)getGraph(_?): [Graph](_langchain_core.runnables_graph.Graph.html)[](#getGraph.getGraph-1)ParametersOptional_: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>Returns [Graph](_langchain_core.runnables_graph.Graph.html)getName[](#getName)getName(suffix?): string[](#getName.getName-1)ParametersOptionalsuffix: stringReturns stringinvoke[](#invoke)invoke(input, config?): Promise>[](#invoke.invoke-1)Invokes the tool with the provided input and configuration. Type ParametersTInputTConfig extends undefined | [ToolRunnableConfig](../types/_langchain_core.tools.ToolRunnableConfig.html)Parametersinput: [TInput](_langchain_core.tools.StructuredTool.html#invoke.invoke-1.TInput)The input for the tool. Optionalconfig: [TConfig](_langchain_core.tools.StructuredTool.html#invoke.invoke-1.TConfig-1)Optional configuration for the tool. Returns Promise>A Promise that resolves with the tool's output. map[](#map)map(): [Runnable](_langchain_core.runnables.Runnable.html)[], ([ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1))[], [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>[](#map.map-1)Return a new Runnable that maps a list of inputs to a list of outputs, by calling invoke() with each input. Returns [Runnable](_langchain_core.runnables.Runnable.html)[], ([ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1))[], [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>Deprecated[](#Deprecated-2)This will be removed in the next breaking release. pick[](#pick)pick(keys): [Runnable](_langchain_core.runnables.Runnable.html)>>[](#pick.pick-1)Pick keys from the dict output of this runnable. Returns a new runnable. Parameterskeys: string | string[]Returns [Runnable](_langchain_core.runnables.Runnable.html)>>pipe[](#pipe)pipe(coerceable): [Runnable](_langchain_core.runnables.Runnable.html), Exclude, [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>[](#pipe.pipe-1)Create a new runnable sequence that runs each individual runnable in series, piping the output of one runnable into another runnable or runnable-like. Type ParametersNewRunOutputParameterscoerceable: [RunnableLike](../types/_langchain_core.runnables.RunnableLike.html)>>A runnable, function, or object whose values are functions or runnables. Returns [Runnable](_langchain_core.runnables.Runnable.html), Exclude, [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>A new runnable sequence. stream[](#stream)stream(input, options?): Promise>[](#stream.stream-1)Stream output in chunks. Parametersinput: [StructuredToolCallInput](../types/_langchain_core.tools.StructuredToolCallInput.html)Optionaloptions: Partial>>Returns Promise>A readable stream that is also an iterable. streamEvents[](#streamEvents)streamEvents(input, options, streamOptions?): [IterableReadableStream](_langchain_core.utils_stream.IterableReadableStream.html)[](#streamEvents.streamEvents-1)Generate a stream of events emitted by the internal steps of the runnable. Use to create an iterator over StreamEvents that provide real-time information about the progress of the runnable, including StreamEvents from intermediate results. A StreamEvent is a dictionary with the following schema: event: string - Event names are of the format: on_[runnable_type]_(start|stream|end). name: string - The name of the runnable that generated the event. run_id: string - Randomly generated ID associated with the given execution of the runnable that emitted the event. A child runnable that gets invoked as part of the execution of a parent runnable is assigned its own unique ID. tags: string[] - The tags of the runnable that generated the event. metadata: Record - The metadata of the runnable that generated the event. data: Record Below is a table that illustrates some events that might be emitted by various chains. Metadata fields have been omitted from the table for brevity. Chain definitions have been included after the table. ATTENTION** This reference table is for the V2 version of the schema.

```
+----------------------+-----------------------------+------------------------------------------+
| event                | input                       | output/chunk                             |
+======================+=============================+==========================================+
| on_chat_model_start  | {"messages": BaseMessage[]} |                                          |
+----------------------+-----------------------------+------------------------------------------+
| on_chat_model_stream |                             | AIMessageChunk("hello")                  |
+----------------------+-----------------------------+------------------------------------------+
| on_chat_model_end    | {"messages": BaseMessage[]} | AIMessageChunk("hello world")            |
+----------------------+-----------------------------+------------------------------------------+
| on_llm_start         | {'input': 'hello'}          |                                          |
+----------------------+-----------------------------+------------------------------------------+
| on_llm_stream        |                             | 'Hello'                                  |
+----------------------+-----------------------------+------------------------------------------+
| on_llm_end           | 'Hello human!'              |                                          |
+----------------------+-----------------------------+------------------------------------------+
| on_chain_start       |                             |                                          |
+----------------------+-----------------------------+------------------------------------------+
| on_chain_stream      |                             | "hello world!"                           |
+----------------------+-----------------------------+------------------------------------------+
| on_chain_end         | [Document(...)]             | "hello world!, goodbye world!"           |
+----------------------+-----------------------------+------------------------------------------+
| on_tool_start        | {"x": 1, "y": "2"}          |                                          |
+----------------------+-----------------------------+------------------------------------------+
| on_tool_end          |                             | {"x": 1, "y": "2"}                       |
+----------------------+-----------------------------+------------------------------------------+
| on_retriever_start   | {"query": "hello"}          |                                          |
+----------------------+-----------------------------+------------------------------------------+
| on_retriever_end     | {"query": "hello"}          | [Document(...), ..]                      |
+----------------------+-----------------------------+------------------------------------------+
| on_prompt_start      | {"question": "hello"}       |                                          |
+----------------------+-----------------------------+------------------------------------------+
| on_prompt_end        | {"question": "hello"}       | ChatPromptValue(messages: BaseMessage[]) |
+----------------------+-----------------------------+------------------------------------------+
Copy

``` The "on_chain_*" events are the default for Runnables that don't fit one of the above categories. In addition to the standard events above, users can also dispatch custom events. Custom events will be only be surfaced with in the v2 version of the API! A custom event has following format:

```
+-----------+------+------------------------------------------------------------+
| Attribute | Type | Description                                                |
+===========+======+============================================================+
| name      | str  | A user defined name for the event.                         |
+-----------+------+------------------------------------------------------------+
| data      | Any  | The data associated with the event. This can be anything.  |
+-----------+------+------------------------------------------------------------+
Copy

``` Here's an example:

```
import { RunnableLambda } from "@langchain/core/runnables";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch";
// Use this import for web environments that don't support "async_hooks"
// and manually pass config to child runs.
// import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";

const slowThing = RunnableLambda.from(async (someInput: string) => {
  // Placeholder for some slow operation
  await new Promise((resolve) => setTimeout(resolve, 100));
  await dispatchCustomEvent("progress_event", {
   message: "Finished step 1 of 2",
 });
 await new Promise((resolve) => setTimeout(resolve, 100));
 return "Done";
});

const eventStream = await slowThing.streamEvents("hello world", {
  version: "v2",
});

for await (const event of eventStream) {
 if (event.event === "on_custom_event") {
   console.log(event);
 }
}
Copy

``` #### Parameters input: [StructuredToolCallInput](../types/_langchain_core.tools.StructuredToolCallInput.html)
- options: Partial>> & { version: "v1" | "v2"; }
- OptionalstreamOptions: Omit

#### Returns [IterableReadableStream](_langchain_core.utils_stream.IterableReadableStream.html)

- streamEvents(input, options, streamOptions?): [IterableReadableStream](_langchain_core.utils_stream.IterableReadableStream.html)>[](#streamEvents.streamEvents-2)
- #### Parameters input: [StructuredToolCallInput](../types/_langchain_core.tools.StructuredToolCallInput.html)
- options: Partial>> & { encoding: "text/event-stream"; version: "v1" | "v2"; }
- OptionalstreamOptions: Omit

#### Returns [IterableReadableStream](_langchain_core.utils_stream.IterableReadableStream.html)>

### streamLog[](#streamLog)

- streamLog(input, options?, streamOptions?): AsyncGenerator[](#streamLog.streamLog-1)
- Stream all output from a runnable, as reported to the callback system. This includes all inner runs of LLMs, Retrievers, Tools, etc. Output is streamed as Log objects, which include a list of jsonpatch ops that describe how the state of the run has changed in each step, and the final state of the run. The jsonpatch ops can be applied in order to construct state. #### Parameters input: [StructuredToolCallInput](../types/_langchain_core.tools.StructuredToolCallInput.html)
- Optionaloptions: Partial>>
- OptionalstreamOptions: Omit

#### Returns AsyncGenerator

### toJSON[](#toJSON)

- toJSON(): [Serialized](../types/_langchain_core.load_serializable.Serialized.html)[](#toJSON.toJSON-1)
- #### Returns [Serialized](../types/_langchain_core.load_serializable.Serialized.html)

### toJSONNotImplemented[](#toJSONNotImplemented)

- toJSONNotImplemented(): [SerializedNotImplemented](../interfaces/_langchain_core.load_serializable.SerializedNotImplemented.html)[](#toJSONNotImplemented.toJSONNotImplemented-1)
- #### Returns [SerializedNotImplemented](../interfaces/_langchain_core.load_serializable.SerializedNotImplemented.html)

### transform[](#transform)

- transform(generator, options): AsyncGenerator[](#transform.transform-1)
- Default implementation of transform, which buffers input and then calls stream. Subclasses should override this method if they can start producing output while input is still being generated. #### Parameters generator: AsyncGenerator, any, any>
- options: Partial>>

#### Returns AsyncGenerator

### withConfig[](#withConfig)

- withConfig(config): [Runnable](_langchain_core.runnables.Runnable.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>[](#withConfig.withConfig-1)
- Bind config to a Runnable, returning a new Runnable. #### Parameters config: Partial>>New configuration parameters to attach to the new runnable.

#### Returns [Runnable](_langchain_core.runnables.Runnable.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>

A new RunnableBinding with a config matching what's passed.

### withFallbacks[](#withFallbacks)

- withFallbacks(fields): [RunnableWithFallbacks](_langchain_core.runnables.RunnableWithFallbacks.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1)>[](#withFallbacks.withFallbacks-1)
- Create a new runnable from the current one that will try invoking other passed fallback runnables if the initial invocation fails. #### Parameters fields: { fallbacks: [Runnable](_langchain_core.runnables.Runnable.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>[]; } | [Runnable](_langchain_core.runnables.Runnable.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>[]

#### Returns [RunnableWithFallbacks](_langchain_core.runnables.RunnableWithFallbacks.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1)>

A new RunnableWithFallbacks.

### withListeners[](#withListeners)

- withListeners(params): [Runnable](_langchain_core.runnables.Runnable.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>[](#withListeners.withListeners-1)
- Bind lifecycle listeners to a Runnable, returning a new Runnable. The Run object contains information about the run, including its id, type, input, output, error, startTime, endTime, and any tags or metadata added to the run. #### Parameters params: { onEnd?: ((run: [Run](../interfaces/_langchain_core.tracers_base.Run.html), config?: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>) => void | Promise); onError?: ((run: [Run](../interfaces/_langchain_core.tracers_base.Run.html), config?: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>) => void | Promise); onStart?: ((run: [Run](../interfaces/_langchain_core.tracers_base.Run.html), config?: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>) => void | Promise); }The object containing the callback functions. ##### OptionalonEnd?: ((run: [Run](../interfaces/_langchain_core.tracers_base.Run.html), config?: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>) => void | Promise) Called after the runnable finishes running, with the Run object. (run, config?): void | Promise
- #### Parameters run: [Run](../interfaces/_langchain_core.tracers_base.Run.html)
- Optionalconfig: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>

#### Returns void | Promise

- ##### OptionalonError?: ((run: [Run](../interfaces/_langchain_core.tracers_base.Run.html), config?: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>) => void | Promise) Called if the runnable throws an error, with the Run object. (run, config?): void | Promise
- #### Parameters run: [Run](../interfaces/_langchain_core.tracers_base.Run.html)
- Optionalconfig: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>

#### Returns void | Promise

- ##### OptionalonStart?: ((run: [Run](../interfaces/_langchain_core.tracers_base.Run.html), config?: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>) => void | Promise) Called before the runnable starts running, with the Run object. (run, config?): void | Promise
- #### Parameters run: [Run](../interfaces/_langchain_core.tracers_base.Run.html)
- Optionalconfig: [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>

#### Returns void | Promise

#### Returns [Runnable](_langchain_core.runnables.Runnable.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>

### withRetry[](#withRetry)

- withRetry(fields?): [RunnableRetry](_langchain_core.runnables.RunnableRetry.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>[](#withRetry.withRetry-1)
- Add retry logic to an existing runnable. #### Parameters Optionalfields: { onFailedAttempt?: [RunnableRetryFailedAttemptHandler](../types/_langchain_core.runnables.RunnableRetryFailedAttemptHandler.html); stopAfterAttempt?: number; } ##### OptionalonFailedAttempt?: [RunnableRetryFailedAttemptHandler](../types/_langchain_core.runnables.RunnableRetryFailedAttemptHandler.html) A function that is called when a retry fails.
- ##### OptionalstopAfterAttempt?: number The number of attempts to retry.

#### Returns [RunnableRetry](_langchain_core.runnables.RunnableRetry.html), [ToolMessage](_langchain_core.messages_tool.ToolMessage.html) | [ToolOutputT](_langchain_core.tools.StructuredTool.html#constructor.new_StructuredTool.ToolOutputT-1), [RunnableConfig](../interfaces/_langchain_core.runnables.RunnableConfig.html)>>

A new RunnableRetry that, when invoked, will retry according to the parameters.

### StaticisRunnable[](#isRunnable)

- isRunnable(thing): thing is [Runnable](_langchain_core.runnables.Runnable.html)>>[](#isRunnable.isRunnable-1)
- #### Parameters thing: any

#### Returns thing is [Runnable](_langchain_core.runnables.Runnable.html)>>

### Settings

Member Visibility

- Protected
- Inherited
- External

ThemeOSLightDark

### On This Page

Constructors[constructor](#constructor)Properties[callbacks](#callbacks)[defaultConfig](#defaultConfig)[description](#description)[metadata](#metadata)[name](#name)[responseFormat](#responseFormat)[returnDirect](#returnDirect)[schema](#schema)[tags](#tags)[verbose](#verbose)[verboseParsingErrors](#verboseParsingErrors)Methods[asTool](#asTool)[assign](#assign)[batch](#batch)[bind](#bind)[call](#call)[getGraph](#getGraph)[getName](#getName)[invoke](#invoke)[map](#map)[pick](#pick)[pipe](#pipe)[stream](#stream)[streamEvents](#streamEvents)[streamLog](#streamLog)[toJSON](#toJSON)[toJSONNotImplemented](#toJSONNotImplemented)[transform](#transform)[withConfig](#withConfig)[withFallbacks](#withFallbacks)[withListeners](#withListeners)[withRetry](#withRetry)[isRunnable](#isRunnable)

Generated using [TypeDoc](https://typedoc.org/)