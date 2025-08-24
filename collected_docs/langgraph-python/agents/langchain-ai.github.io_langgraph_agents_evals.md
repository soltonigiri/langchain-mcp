- Evaluate performance **[Skip to content](#evals) Initializing search [GitHub](https://github.com/langchain-ai/langgraph) LangGraph APIs Core capabilities [Run evaluator](#run-evaluator) [Reference](../../reference/) [Examples](../../examples/) [Additional resources](../../additional-resources/) [Run evaluator](#run-evaluator) [](https://github.com/langchain-ai/langgraph/edit/main/docs/docs/agents/evals.md) Evals[¶](#evals) To evaluate your agent's performance you can use LangSmith [evaluations](https://docs.smith.langchain.com/evaluation). You would need to first define an evaluator function to judge the results from an agent, such as final outputs or trajectory. Depending on your evaluation technique, this may or may not involve a reference output:

```
def evaluator(*, outputs: dict, reference_outputs: dict):
    # compare agent outputs against reference outputs
    output_messages = outputs["messages"]
    reference_messages = reference_outputs["messages"]
    score = compare_messages(output_messages, reference_messages)
    return {"key": "evaluator_score", "score": score}

``` To get started, you can use prebuilt evaluators from AgentEvals package:

```
pip install -U agentevals

``` Create evaluator[¶](#create-evaluator) A common way to evaluate agent performance is by comparing its trajectory (the order in which it calls its tools) against a reference trajectory:

```
import json
from agentevals.trajectory.match import create_trajectory_match_evaluator

outputs = [
    {
        "role": "assistant",
        "tool_calls": [
            {
                "function": {
                    "name": "get_weather",
                    "arguments": json.dumps({"city": "san francisco"}),
                }
            },
            {
                "function": {
                    "name": "get_directions",
                    "arguments": json.dumps({"destination": "presidio"}),
                }
            }
        ],
    }
]
reference_outputs = [
    {
        "role": "assistant",
        "tool_calls": [
            {
                "function": {
                    "name": "get_weather",
                    "arguments": json.dumps({"city": "san francisco"}),
                }
            },
        ],
    }
]

# Create the evaluator
evaluator = create_trajectory_match_evaluator(
    trajectory_match_mode="superset",  # (1)!
)

# Run the evaluator
result = evaluator(
    outputs=outputs, reference_outputs=reference_outputs
)

``` Specify how the trajectories will be compared. superset will accept output trajectory as valid if it's a superset of the reference one. Other options include: [strict](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#strict-match), [unordered](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#unordered-match) and [subset](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#subset-and-superset-match) As a next step, learn more about how to [customize trajectory match evaluator](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#agent-trajectory-match). LLM-as-a-judge[¶](#llm-as-a-judge) You can use LLM-as-a-judge evaluator that uses an LLM to compare the trajectory against the reference outputs and output a score:

```
import json
from agentevals.trajectory.llm import (
    create_trajectory_llm_as_judge,
    TRAJECTORY_ACCURACY_PROMPT_WITH_REFERENCE
)

evaluator = create_trajectory_llm_as_judge(
    prompt=TRAJECTORY_ACCURACY_PROMPT_WITH_REFERENCE,
    model="openai:o3-mini"
)

``` Run evaluator[¶](#run-evaluator) To run an evaluator, you will first need to create a [LangSmith dataset](https://docs.smith.langchain.com/evaluation/concepts#datasets). To use the prebuilt AgentEvals evaluators, you will need a dataset with the following schema: input**: {"messages": [...]} input messages to call the agent with.

- **output**: {"messages": [...]} expected message history in the agent output. For trajectory evaluation, you can choose to keep only assistant messages.

*API Reference: [create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)*

```
from langsmith import Client
from langgraph.prebuilt import create_react_agent
from agentevals.trajectory.match import create_trajectory_match_evaluator

client = Client()
agent = create_react_agent(...)
evaluator = create_trajectory_match_evaluator(...)

experiment_results = client.evaluate(
    lambda inputs: agent.invoke(inputs),
    # replace with your dataset name
    data="<Name of your dataset>",
    evaluators=[evaluator]
)

```

  Back to top

      Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)



    Made with
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[](https://langchain-ai.github.io/langgraphjs/)
[](https://github.com/langchain-ai/langgraph)
[](https://twitter.com/LangChainAI)