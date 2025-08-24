- Run application [Skip to content](#run-application) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [Submit run](#submit-run)

- [Chat mode](#chat-mode)

- [Learn more](#learn-more)

- [Manage threads](../threads_studio/)

- [Add node to dataset](../datasets_studio/)

- [Concepts](../../../concepts/)

- [Tutorials](../../../tutorials/)

- Resources

- [Agents](../../../agents/overview/)

- [API reference](../../../reference/)

- [Versions](../../../versions/)

- [Submit run](#submit-run)

- [Chat mode](#chat-mode)

- [Learn more](#learn-more)

[Run application¶](#run-application)

Prerequisites

- [Running agents](../../../agents/run_agents/#running-agents)

This guide shows how to submit a [run](../../../concepts/assistants/#execution) to your application.

## Graph mode[¶](#graph-mode)

### Specify input[¶](#specify-input)

First define the input to your graph with in the "Input" section on the left side of the page, below the graph interface.

Studio will attempt to render a form for your input based on the graph's defined [state schema](../../../concepts/low_level/#schema). To disable this, click the "View Raw" button, which will present you with a JSON editor.

Click the up/down arrows at the top of the "Input" section to toggle through and use previously submitted inputs.

### Run settings[¶](#run-settings)

#### Assistant[¶](#assistant)

To specify the [assistant](../../../concepts/assistants/) that is used for the run click the settings button in the bottom left corner. If an assistant is currently selected the button will also list the assistant name. If no assistant is selected it will say "Manage Assistants".

Select the assistant to run and click the "Active" toggle at the top of the modal to activate it. [See here](../studio/manage_assistants/) for more information on managing assistants.

#### Streaming[¶](#streaming)

Click the dropdown next to "Submit" and click the toggle to enable/disable streaming.

#### Breakpoints[¶](#breakpoints)

To run your graph with breakpoints, click the "Interrupt" button. Select a node and whether to pause before and/or after that node has executed. Click "Continue" in the thread log to resume execution.

For more information on breakpoints see [here](../../../concepts/human_in_the_loop/).

### Submit run[¶](#submit-run)

To submit the run with the specified input and run settings, click the "Submit" button. This will add a [run](../../../concepts/assistants/#execution) to the existing selected [thread](../../../concepts/persistence/#threads). If no thread is currently selected, a new one will be created.

To cancel the ongoing run, click the "Cancel" button.

## Chat mode[¶](#chat-mode)

Specify the input to your chat application in the bottom of the conversation panel. Click the "Send message" button to submit the input as a Human message and have the response streamed back.

To cancel the ongoing run, click the "Cancel" button. Click the "Show tool calls" toggle to hide/show tool calls in the conversation.

## Learn more[¶](#learn-more)

To run your application from a specific checkpoint in an existing thread, see [this guide](../threads_studio/#edit-thread-history).

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)