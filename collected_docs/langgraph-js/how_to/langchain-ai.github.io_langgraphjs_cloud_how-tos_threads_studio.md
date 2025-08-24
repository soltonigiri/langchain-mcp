- Manage threads [Skip to content](#manage-threads) Initializing search [GitHub](https://github.com/langchain-ai/langgraphjs)

- Guides

- [Edit thread history](#edit-thread-history)

- [Learn more](#learn-more)

- [Add node to dataset](../datasets_studio/)

- [Concepts](../../../concepts/)

- [Tutorials](../../../tutorials/)

- Resources

- [Agents](../../../agents/overview/)

- [API reference](../../../reference/)

- [Versions](../../../versions/)

- [Edit thread history](#edit-thread-history)

- [Learn more](#learn-more)

[Manage threads¶](#manage-threads)

Studio allows you to view [threads](../../../concepts/persistence/#threads) from the server and edit their state.

## View threads[¶](#view-threads)

### Graph mode[¶](#graph-mode)

- In the top of the right-hand pane, select the dropdown menu to view existing threads.

- Select the desired thread, and the thread history will populate in the right-hand side of the page.

- To create a new thread, click + New Thread and [submit a run](../invoke_studio/#graph-mode).

To view more granular information in the thread, drag the slider at the top of the page to the right. To view less information, drag the slider to the left. Additionally, collapse or expand individual turns, nodes, and keys of the state.

Switch between `Pretty` and `JSON` mode for different rendering formats.

### Chat mode[¶](#chat-mode)

- View all threads in the right-hand pane of the page.

- Select the desired thread and the thread history will populate in the center panel.

- To create a new thread, click the plus button and [submit a run](../invoke_studio/#chat-mode).

## Edit thread history[¶](#edit-thread-history)

### Graph mode[¶](#graph-mode_1)

To edit the state of the thread, select "edit node state" next to the desired node. Edit the node's output as desired and click "fork" to confirm. This will create a new forked run from the checkpoint of the selected node.

If you instead want to re-run the thread from a given checkpoint without editing the state, click the "Re-run from here". This will again create a new forked run from the selected checkpoint. This is useful for re-running with changes that are not specific to the state, such as the selected assistant.

### Chat mode[¶](#chat-mode_1)

To edit a human message in the thread, click the edit button below the human message. Edit the message as desired and submit. This will create a new fork of the conversation history. To re-generate an AI message, click the retry icon below the AI message.

## Learn more[¶](#learn-more)

For more information about time travel, [see here](../../../concepts/time-travel/).

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraph/)
[](https://github.com/langchain-ai/langgraphjs)
[](https://twitter.com/LangChainAI)