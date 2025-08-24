- Functional API **[Skip to content](#functional-api) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs) Guides [Task](#task) [When to use a task](#when-to-use-a-task) [Serialization](#serialization) [Determinism](#determinism) [Idempotency](#idempotency) [Functional API vs. Graph API](#functional-api-vs-graph-api) [Common Pitfalls](#common-pitfalls) [Patterns](#patterns) [LangGraph Platform](../../concepts#langgraph-platform) [Tutorials](../../tutorials/) Resources [Agents](../../agents/overview/) [API reference](../../reference/) [Versions](../../versions/) [Task](#task) [When to use a task](#when-to-use-a-task) [Serialization](#serialization) [Determinism](#determinism) [Idempotency](#idempotency) [Functional API vs. Graph API](#functional-api-vs-graph-api) [Common Pitfalls](#common-pitfalls) [Patterns](#patterns) [Functional API¶](#functional-api) Note The Functional API requires @langchain/langgraph>=0.2.42. Overview[¶](#overview) The Functional API** allows you to add LangGraph's key features -- [persistence](../persistence/), [memory](../memory/), [human-in-the-loop](../human_in_the_loop/), and [streaming](../streaming/) — to your applications with minimal changes to your existing code. It is designed to integrate these features into existing code that may use standard language primitives for branching and control flow, such as if statements, for loops, and function calls. Unlike many data orchestration frameworks that require restructuring code into an explicit pipeline or DAG, the Functional API allows you to incorporate these capabilities without enforcing a rigid execution model. The **Functional API** uses two key building blocks: **entrypoint** – An **entrypoint** is a wrapper that takes a function as the starting point of a workflow. It encapsulates workflow logic and manages execution flow, including handling *long-running tasks* and [interrupts](../human_in_the_loop/).

- **task** – Represents a discrete unit of work, such as an API call or data processing step, that can be executed asynchronously within an entrypoint. Tasks return a future-like object that can be awaited or resolved synchronously.

This provides a minimal abstraction for building workflows with state management and streaming.

Tip

For users who prefer a more declarative approach, LangGraph's [Graph API](../low_level/) allows you to define workflows using a Graph paradigm. Both APIs share the same underlying runtime, so you can use them together in the same application. Please see the [Functional API vs. Graph API](#functional-api-vs-graph-api) section for a comparison of the two paradigms.

## Example[¶](#example)

Below we demonstrate a simple application that writes an essay and [interrupts](../human_in_the_loop/) to request human review.

```
import { task, entrypoint, interrupt, MemorySaver } from "@langchain/langgraph";

const writeEssay = task("write_essay", (topic: string): string => {
  // A placeholder for a long-running task.
  return `An essay about topic: ${topic}`;
});

const workflow = entrypoint(
  { checkpointer: new MemorySaver(), name: "workflow" },
  async (topic: string) => {
    const essay = await writeEssay(topic);
    const isApproved = interrupt({
      // Any json-serializable payload provided to interrupt as argument.
      // It will be surfaced on the client side as an Interrupt when streaming data
      // from the workflow.
      essay, // The essay we want reviewed.
      // We can add any additional information that we need.
      // For example, introduce a key called "action" with some instructions.
      action: "Please approve/reject the essay",
    });

    return {
      essay, // The essay that was generated
      isApproved, // Response from HIL
    };
  }
);

```

Detailed Explanation

This workflow will write an essay about the topic "cat" and then pause to get a review from a human. The workflow can be interrupted for an indefinite amount of time until a review is provided.

When the workflow is resumed, it executes from the very start, but because the result of the `writeEssay` task was already saved, the task result will be loaded from the checkpoint instead of being recomputed.

```
import { task, entrypoint, interrupt, MemorySaver, Command } from "@langchain/langgraph";

const writeEssay = task("write_essay", (topic: string): string => {
  return `An essay about topic: ${topic}`;
});

const workflow = entrypoint(
  { checkpointer: new MemorySaver(), name: "workflow" },
  async (topic: string) => {
    const essay = await writeEssay(topic);
    const isApproved = interrupt({
      essay, // The essay we want reviewed.
      action: "Please approve/reject the essay",
    });

    return {
      essay,
      isApproved,
    };
  }
);

const threadId = crypto.randomUUID();

const config = {
  configurable: {
    thread_id: threadId,
  },
};

for await (const item of await workflow.stream("cat", config)) {
  console.log(item);
}

```

```
{ write_essay: 'An essay about topic: cat' }
{ __interrupt__: [{
  value: { essay: 'An essay about topic: cat', action: 'Please approve/reject the essay' },
  resumable: true,
  ns: ['workflow:f7b8508b-21c0-8b4c-5958-4e8de74d2684'],
  when: 'during'
}] }

```

An essay has been written and is ready for review. Once the review is provided, we can resume the workflow:

```
// Get review from a user (e.g., via a UI)
// In this case, we're using a bool, but this can be any json-serializable value.
const humanReview = true;

for await (const item of await workflow.stream(new Command({ resume: humanReview }), config)) {
  console.log(item);
}

```

```
{ workflow: { essay: 'An essay about topic: cat', isApproved: true } }

```

The workflow has been completed and the review has been added to the essay.

## Entrypoint[¶](#entrypoint)

The [entrypoint](/langgraphjs/reference/functions/langgraph.entrypoint-1.html) function can be used to create a workflow from a function. It encapsulates workflow logic and manages execution flow, including handling *long-running tasks* and [interrupts](../low_level/#interrupt).

### Definition[¶](#definition)

An **entrypoint** is defined by passing a function to the `entrypoint` function.

The function **must accept a single positional argument**, which serves as the workflow input. If you need to pass multiple pieces of data, use an object as the input type for the first argument.

You will often want to pass a **checkpointer** to the `entrypoint` function to enable persistence and use features like **human-in-the-loop**.

```
import { entrypoint, MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (someInput: Record<string, any>): Promise<number> => {
    // some logic that may involve long-running tasks like API calls,
    // and may be interrupted for human-in-the-loop.
    return result;
  }
);

```

Serialization

The **inputs** and **outputs** of entrypoints must be JSON-serializable to support checkpointing. Please see the [serialization](#serialization) section for more details.

### Injectable Parameters[¶](#injectable-parameters)

When declaring an `entrypoint`, you can access additional parameters that will be injected automatically at run time by using the [getPreviousState](/langgraphjs/reference/functions/langgraph.getPreviousState.html) function and other utilities. These parameters include:

| Parameter | Description |

| **config** | For accessing runtime configuration. Automatically populated as the second argument to the `entrypoint` function (but not `task`, since tasks can have a variable number of arguments). See [RunnableConfig](https://js.langchain.com/docs/concepts/runnables/#runnableconfig) for information. |

| **config.store** | An instance of [BaseStore](/langgraphjs/reference/classes/checkpoint.BaseStore.html). Useful for [long-term memory](#long-term-memory). |

| **config.writer** | A `writer` used for streaming back custom data. See the [guide on streaming custom data](../../how-tos/streaming-content/) |

| **getPreviousState()** | Access the state associated with the previous `checkpoint` for the given thread using [getPreviousState](/langgraphjs/reference/functions/langgraph.getPreviousState.html). See [state management](#state-management). |

Requesting Injectable Parameters

```
import {
  entrypoint,
  getPreviousState,
  BaseStore,
  InMemoryStore,
} from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";

const inMemoryStore = new InMemoryStore(...);  // An instance of InMemoryStore for long-term memory

const myWorkflow = entrypoint(
  {
    checkpointer,  // Specify the checkpointer
    store: inMemoryStore,  // Specify the store
    name: "myWorkflow",
  },
  async (someInput: Record<string, any>) => {
    const previous = getPreviousState<any>(); // For short-term memory
    // Rest of workflow logic...
  }
);

```

### Executing[¶](#executing)

Using the [entrypoint](#entrypoint) function will return an object that can be executed using the `invoke` and `stream` methods.

*InvokeStream

```
const config = {
  configurable: {
    thread_id: "some_thread_id",
  },
};
await myWorkflow.invoke(someInput, config);  // Wait for the result

```

```
const config = {
  configurable: {
    thread_id: "some_thread_id",
  },
};

for await (const chunk of await myWorkflow.stream(someInput, config)) {
  console.log(chunk);
}

``` Resuming[¶](#resuming) Resuming an execution after an [interrupt](/langgraphjs/reference/functions/langgraph.interrupt-1.html) can be done by passing a **resume** value to the [Command](/langgraphjs/reference/classes/langgraph.Command.html) primitive. InvokeStream

```
import { Command } from "@langchain/langgraph";

const config = {
  configurable: {
    thread_id: "some_thread_id",
  },
};

await myWorkflow.invoke(new Command({ resume: someResumeValue }), config);

```

```
import { Command } from "@langchain/langgraph";

const config = {
  configurable: {
    thread_id: "some_thread_id",
  },
};

const stream = await myWorkflow.stream(
  new Command({ resume: someResumeValue }),
  config,
);

for await (const chunk of stream) {
  console.log(chunk);
}

``` **Resuming after transient error** To resume after a transient error (such as a model provider outage), run the entrypoint with a null and the same **thread id** (config). This assumes that the underlying **error** has been resolved and execution can proceed successfully. InvokeStream

```
const config = {
  configurable: {
    thread_id: "some_thread_id",
  },
};

await myWorkflow.invoke(null, config);

```

```
const config = {
  configurable: {
    thread_id: "some_thread_id",
  },
};

for await (const chunk of await myWorkflow.stream(null, config)) {
  console.log(chunk);
}

``` State Management[¶](#state-management) When an entrypoint is defined with a checkpointer, it stores information between successive invocations on the same **thread id** in [checkpoints](../persistence/#checkpoints). This allows accessing the state from the previous invocation using the [getPreviousState](/langgraphjs/reference/functions/langgraph.getPreviousState.html) function. By default, the previous state is the return value of the previous invocation.

```
const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (number: number) => {
    const previous = getPreviousState<number>();
    return number + (previous ?? 0);
  }
);

const config = {
  configurable: {
    thread_id: "some_thread_id",
  },
};

await myWorkflow.invoke(1, config); // 1 (previous was undefined)
await myWorkflow.invoke(2, config); // 3 (previous was 1 from the previous invocation)

``` entrypoint.final[¶](#entrypointfinal) [entrypoint.final](/langgraphjs/reference/functions/langgraph.entrypoint.final.html) is a special primitive that can be returned from an entrypoint and allows **decoupling** the value that is **saved in the checkpoint** from the **return value of the entrypoint**. The first value is the return value of the entrypoint, and the second value is the value that will be saved in the checkpoint.

```
const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (number: number) => {
    const previous = getPreviousState<number>();
    // This will return the previous value to the caller, saving
    // 2 * number to the checkpoint, which will be used in the next invocation
    // for the previous state
    return entrypoint.final({
      value: previous ?? 0,
      save: 2 * number,
    });
  }
);

const config = {
  configurable: {
    thread_id: "1",
  },
};

await myWorkflow.invoke(3, config); // 0 (previous was undefined)
await myWorkflow.invoke(1, config); // 6 (previous was 3 * 2 from the previous invocation)

``` Task[¶](#task) A **task** represents a discrete unit of work, such as an API call or data processing step. It has three key characteristics: **Asynchronous Execution**: Tasks are designed to be executed asynchronously, allowing multiple operations to run concurrently without blocking. **Checkpointing**: Task results are saved to a checkpoint, enabling resumption of the workflow from the last saved state. (See [persistence](../persistence/) for more details). **Retries**: Tasks can be configured with a [retry policy](../low_level/#retry-policies) to handle transient errors. Definition[¶](#definition_1) Tasks are defined using the task function, which wraps a regular function.

```
import { task } from "@langchain/langgraph";

const slowComputation = task({"slowComputation", async (inputValue: any) => {
  // Simulate a long-running operation
  ...
  return result;
});

``` Serialization The **outputs** of tasks **must** be JSON-serializable to support checkpointing. Execution[¶](#execution) **Tasks** can only be called from within an **entrypoint**, another **task**, or a [state graph node](../low_level/#nodes). Tasks cannot* be called directly from the main application code.

```
const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (someInput: number) => {
    return await slowComputation(someInput);
  }
);

```

### Retry Policy[¶](#retry-policy)

You can specify a [retry policy](../low_level/#retry-policies) for a **task** by passing a `retry` parameter to the `task` function.

```
const slowComputation = task(
  {
    name: "slowComputation",
    // only attempt to run this task once before giving up
    retry: { maxAttempts: 1 },
  },
  async (inputValue: any) => {
    // A long-running operation that may fail
    return result;
  }
);

```

## When to use a task[¶](#when-to-use-a-task)

**Tasks** are useful in the following scenarios:

- **Checkpointing**: When you need to save the result of a long-running operation to a checkpoint, so you don't need to recompute it when resuming the workflow.

- **Human-in-the-loop**: If you're building a workflow that requires human intervention, you MUST use **tasks** to encapsulate any randomness (e.g., API calls) to ensure that the workflow can be resumed correctly. See the [determinism](#determinism) section for more details.

- **Parallel Execution**: For I/O-bound tasks, **tasks** enable parallel execution, allowing multiple operations to run concurrently without blocking (e.g., calling multiple APIs).

- **Observability**: Wrapping operations in **tasks** provides a way to track the progress of the workflow and monitor the execution of individual operations using [LangSmith](https://docs.smith.langchain.com/).

- **Retryable Work**: When work needs to be retried to handle failures or inconsistencies, **tasks** provide a way to encapsulate and manage the retry logic.

## Serialization[¶](#serialization)

There are two key aspects to serialization in LangGraph:

- entrypoint inputs and outputs must be JSON-serializable.

- task outputs must be JSON-serializable.

These requirements are necessary for enabling checkpointing and workflow resumption. Use JavaScript primitives like objects, arrays, strings, numbers, and booleans to ensure that your inputs and outputs are serializable.

Serialization ensures that workflow state, such as task results and intermediate values, can be reliably saved and restored. This is critical for enabling human-in-the-loop interactions, fault tolerance, and parallel execution.

Providing non-serializable inputs or outputs will result in a runtime error when a workflow is configured with a checkpointer.

## Determinism[¶](#determinism)

To utilize features like **human-in-the-loop**, any randomness should be encapsulated inside of **tasks**. This guarantees that when execution is halted (e.g., for human in the loop) and then resumed, it will follow the same *sequence of steps*, even if **task** results are non-deterministic.

LangGraph achieves this behavior by persisting **task** and [subgraph](../low_level/#subgraphs) results as they execute. A well-designed workflow ensures that resuming execution follows the *same sequence of steps*, allowing previously computed results to be retrieved correctly without having to re-execute them. This is particularly useful for long-running **tasks** or **tasks** with non-deterministic results, as it avoids repeating previously done work and allows resuming from essentially the same

While different runs of a workflow can produce different results, resuming a **specific** run should always follow the same sequence of recorded steps. This allows LangGraph to efficiently look up **task** and **subgraph** results that were executed prior to the graph being interrupted and avoid recomputing them.

## Idempotency[¶](#idempotency)

Idempotency ensures that running the same operation multiple times produces the same result. This helps prevent duplicate API calls and redundant processing if a step is rerun due to a failure. Always place API calls inside **tasks** functions for checkpointing, and design them to be idempotent in case of re-execution. Re-execution can occur if a **task** starts, but does not complete successfully. Then, if the workflow is resumed, the **task** will run again. Use idempotency keys or verify existing results to avoid duplication.

## Functional API vs. Graph API[¶](#functional-api-vs-graph-api)

The **Functional API** and the [Graph APIs (StateGraph)](../low_level/#stategraph) provide two different paradigms to create in LangGraph. Here are some key differences:

- **Control flow**: The Functional API does not require thinking about graph structure. You can use standard Python constructs to define workflows. This will usually trim the amount of code you need to write.

- **State management**: The **GraphAPI** requires declaring a [State](../low_level/#state) and may require defining [reducers](../low_level/#reducers) to manage updates to the graph state. @entrypoint and @tasks do not require explicit state management as their state is scoped to the function and is not shared across functions.

- **Checkpointing**: Both APIs generate and use checkpoints. In the **Graph API** a new checkpoint is generated after every [superstep](../low_level/). In the **Functional API**, when tasks are executed, their results are saved to an existing checkpoint associated with the given entrypoint instead of creating a new checkpoint.

- **Visualization**: The Graph API makes it easy to visualize the workflow as a graph which can be useful for debugging, understanding the workflow, and sharing with others. The Functional API does not support visualization as the graph is dynamically generated during runtime.

## Common Pitfalls[¶](#common-pitfalls)

### Handling side effects[¶](#handling-side-effects)

Encapsulate side effects (e.g., writing to a file, sending an email) in tasks to ensure they are not executed multiple times when resuming a workflow.

IncorrectCorrect

In this example, a side effect (writing to a file) is directly included in the workflow, so it will be executed a second time when resuming the workflow.

```
const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (inputs: Record<string, any>) => {
    // This code will be executed a second time when resuming the workflow.
    // Which is likely not what you want.
    await fs.writeFile("output.txt", "Side effect executed");
    const value = interrupt("question");
    return value;
  }
);

```

In this example, the side effect is encapsulated in a task, ensuring consistent execution upon resumption.

```
import { task } from "@langchain/langgraph";

const writeToFile = task("writeToFile", async () => {
  await fs.writeFile("output.txt", "Side effect executed");
});

const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (inputs: Record<string, any>) => {
    // The side effect is now encapsulated in a task.
    await writeToFile();
    const value = interrupt("question");
    return value;
  }
);

```

### Non-deterministic control flow[¶](#non-deterministic-control-flow)

Operations that might give different results each time (like getting current time or random numbers) should be encapsulated in tasks to ensure that on resume, the same result is returned.

- In a task: Get random number (5) → interrupt → resume → (returns 5 again) → ...

- Not in a task: Get random number (5) → interrupt → resume → get new random number (7) → ...

This is especially important when using **human-in-the-loop** workflows with multiple interrupts calls. LangGraph keeps a list of resume values for each task/entrypoint. When an interrupt is encountered, it's matched with the corresponding resume value. This matching is strictly **index-based**, so the order of the resume values should match the order of the interrupts.

If order of execution is not maintained when resuming, one `interrupt` call may be matched with the wrong `resume` value, leading to incorrect results.

Please read the section on [determinism](#determinism) for more details.

IncorrectCorrect

In this example, the workflow uses the current time to determine which task to execute. This is non-deterministic because the result of the workflow depends on the time at which it is executed.

```
const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (inputs: { t0: number }) => {
    const t1 = Date.now();

    const deltaT = t1 - inputs.t0;

    if (deltaT > 1000) {
      const result = await slowTask(1);
      const value = interrupt("question");
      return { result, value };
    } else {
      const result = await slowTask(2);
      const value = interrupt("question");
      return { result, value };
    }
  }
);

```

In this example, the workflow uses the input `t0` to determine which task to execute. This is deterministic because the result of the workflow depends only on the input.

```
import { task } from "@langchain/langgraph";

const getTime = task("getTime", () => Date.now());

const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (inputs: { t0: number }) => {
    const t1 = await getTime();

    const deltaT = t1 - inputs.t0;

    if (deltaT > 1000) {
      const result = await slowTask(1);
      const value = interrupt("question");
      return { result, value };
    } else {
      const result = await slowTask(2);
      const value = interrupt("question");
      return { result, value };
    }
  }
);

```

## Patterns[¶](#patterns)

Below are a few simple patterns that show examples of **how to** use the **Functional API**.

When defining an `entrypoint`, input is restricted to the first argument of the function. To pass multiple inputs, you can use an object.

```
const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (inputs: { value: number; anotherValue: number }) => {
    const value = inputs.value;
    const anotherValue = inputs.anotherValue;
    ...
  }
);

await myWorkflow.invoke([{ value: 1, anotherValue: 2 }]);

```

### Parallel execution[¶](#parallel-execution)

Tasks can be executed in parallel by invoking them concurrently and waiting for the results. This is useful for improving performance in IO bound tasks (e.g., calling APIs for LLMs).

```
const addOne = task("addOne", (number: number) => number + 1);

const graph = entrypoint(
  { checkpointer, name: "graph" },
  async (numbers: number[]) => {
    return await Promise.all(numbers.map(addOne));
  }
);

```

### Calling subgraphs[¶](#calling-subgraphs)

The **Functional API** and the [Graph API](../low_level/) can be used together in the same application as they share the same underlying runtime.

```
import { entrypoint, StateGraph } from "@langchain/langgraph";

const builder = new StateGraph();
...
const someGraph = builder.compile();

const someWorkflow = entrypoint(
  { name: "someWorkflow" },
  async (someInput: Record<string, any>) => {
    // Call a graph defined using the graph API
    const result1 = await someGraph.invoke(...);
    // Call another graph defined using the graph API
    const result2 = await anotherGraph.invoke(...);
    return {
      result1,
      result2,
    };
  }
);

```

### Calling other entrypoints[¶](#calling-other-entrypoints)

You can call other **entrypoints** from within an **entrypoint** or a **task**.

```
const someOtherWorkflow = entrypoint(
  { name: "someOtherWorkflow" }, // Will automatically use the checkpointer from the parent entrypoint
  async (inputs: { value: number }) => {
    return inputs.value;
  }
);

const myWorkflow = entrypoint(
  { checkpointer, name: "myWorkflow" },
  async (inputs: Record<string, any>) => {
    const value = await someOtherWorkflow.invoke([{ value: 1 }]);
    return value;
  }
);

```

### Streaming custom data[¶](#streaming-custom-data)

You can stream custom data from an **entrypoint** by using the `write` method on `config`. This allows you to write custom data to the `custom` stream.

```
import {
  entrypoint,
  task,
  MemorySaver,
  LangGraphRunnableConfig,
} from "@langchain/langgraph";

const addOne = task("addOne", (x: number) => x + 1);

const addTwo = task("addTwo", (x: number) => x + 2);

const checkpointer = new MemorySaver();

const main = entrypoint(
  { checkpointer, name: "main" },
  async (inputs: { number: number }, config: LangGraphRunnableConfig) => {
    config.writer?.("hello"); // Write some data to the `custom` stream
    await addOne(inputs.number); // Will write data to the `updates` stream
    config.writer?.("world"); // Write some more data to the `custom` stream
    await addTwo(inputs.number); // Will write data to the `updates` stream
    return 5;
  }
);

const config = {
  configurable: {
    thread_id: "1",
  },
};

const stream = await main.stream(
  { number: 1 },
  { streamMode: ["custom", "updates"], ...config }
);

for await (const chunk of stream) {
  console.log(chunk);
}

```

```
["updates", { addOne: 2 }][("updates", { addTwo: 3 })][("custom", "hello")][
  ("custom", "world")
][("updates", { main: 5 })];

```

### Resuming after an error[¶](#resuming-after-an-error)

```
import { entrypoint, task, MemorySaver } from "@langchain/langgraph";

// Global variable to track the number of attempts
let attempts = 0;

const getInfo = task("getInfo", () => {
  /*
   * Simulates a task that fails once before succeeding.
   * Throws an error on the first attempt, then returns "OK" on subsequent tries.
   */
  attempts += 1;

  if (attempts < 2) {
    throw new Error("Failure"); // Simulate a failure on the first attempt
  }
  return "OK";
});

// Initialize an in-memory checkpointer for persistence
const checkpointer = new MemorySaver();

const slowTask = task("slowTask", async () => {
  /*
   * Simulates a slow-running task by introducing a 1-second delay.
   */
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "Ran slow task.";
});

const main = entrypoint(
  { checkpointer, name: "main" },
  async (inputs: Record<string, any>) => {
    /*
     * Main workflow function that runs the slowTask and getInfo tasks sequentially.
     *
     * Parameters:
     * - inputs: Record<string, any> containing workflow input values.
     *
     * The workflow first executes `slowTask` and then attempts to execute `getInfo`,
     * which will fail on the first invocation.
     */
    const slowTaskResult = await slowTask(); // Blocking call to slowTask
    await getInfo(); // Error will be thrown here on the first attempt
    return slowTaskResult;
  }
);

// Workflow execution configuration with a unique thread identifier
const config = {
  configurable: {
    thread_id: "1", // Unique identifier to track workflow execution
  },
};

// This invocation will take ~1 second due to the slowTask execution
try {
  // First invocation will throw an error due to the `getInfo` task failing
  await main.invoke({ anyInput: "foobar" }, config);
} catch (err) {
  // Handle the failure gracefully
}

```

When we resume execution, we won't need to re-run the `slowTask` as its result is already saved in the checkpoint.

```
await main.invoke(null, config);

```

```
"Ran slow task.";

```

### Human-in-the-loop[¶](#human-in-the-loop)

The functional API supports [human-in-the-loop](../human_in_the_loop/) workflows using the `interrupt` function and the `Command` primitive.

Please see the following examples for more details:

- [How to wait for user input (Functional API)](../../how-tos/wait-user-input-functional/): Shows how to implement a simple human-in-the-loop workflow using the functional API.

- [How to review tool calls (Functional API)](../../how-tos/review-tool-calls-functional/): Guide demonstrates how to implement human-in-the-loop workflows in a ReAct agent using the LangGraph Functional API.

### Short-term memory[¶](#short-term-memory)

[State management](#state-management) using the [getPreviousState](/langgraphjs/reference/functions/langgraph.getPreviousState.html) function and optionally using the `entrypoint.final` primitive can be used to implement [short term memory](../memory/).

Please see the following how-to guides for more details:

- [How to add thread-level persistence (functional API)](../../how-tos/persistence-functional/): Shows how to add thread-level persistence to a functional API workflow and implements a simple chatbot.

### Long-term memory[¶](#long-term-memory)

[long-term memory](../memory/#long-term-memory) allows storing information across different **thread ids**. This could be useful for learning information about a given user in one conversation and using it in another.

Please see the following how-to guides for more details:

- [How to add cross-thread persistence (functional API)](../../how-tos/cross-thread-persistence-functional/): Shows how to add cross-thread persistence to a functional API workflow and implements a simple chatbot.

### Workflows[¶](#workflows)

- [Workflows and agent](../../tutorials/workflows/) guide for more examples of how to build workflows using the Functional API.

### Agents[¶](#agents)

- [How to create a React agent from scratch (Functional API)](../../how-tos/react-agent-from-scratch-functional/): Shows how to create a simple React agent from scratch using the functional API.

- [How to build a multi-agent network](../../how-tos/multi-agent-network-functional/): Shows how to build a multi-agent network using the functional API.

- [How to add multi-turn conversation in a multi-agent application (functional API)](../../how-tos/multi-agent-multi-turn-convo-functional/): allow an end-user to engage in a multi-turn conversation with one or more agents.

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)