How to add tools to chatbots | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/chatbots_tools.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/chatbots_tools.ipynb)How to add tools to chatbots PrerequisitesThis guide assumes familiarity with the following concepts: [Chatbots](/docs/concepts/messages/) [Agents](/docs/tutorials/agents/) [Chat history](/docs/concepts/chat_history/) This section will cover how to create conversational agents: chatbots that can interact with other systems and APIs using tools. noteThis how-to guide previously built a chatbot using [RunnableWithMessageHistory](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.history.RunnableWithMessageHistory.html). You can access this version of the guide in the [v0.2 docs](https://python.langchain.com/v0.2/docs/how_to/chatbots_tools/).As of the v0.3 release of LangChain, we recommend that LangChain users take advantage of [LangGraph persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/) to incorporate memory into new LangChain applications.If your code is already relying on RunnableWithMessageHistory or BaseChatMessageHistory, you do not** need to make any changes. We do not plan on deprecating this functionality in the near future as it works for simple chat applications and any code that uses RunnableWithMessageHistory will continue to work as expected.Please see [How to migrate to LangGraph Memory](/docs/versions/migrating_memory/) for more details. ## Setup[​](#setup) For this guide, we&#x27;ll be using a [tool calling agent](https://langchain-ai.github.io/langgraph/concepts/agentic_concepts/#tool-calling-agent) with a single tool for searching the web. The default will be powered by [Tavily](/docs/integrations/tools/tavily_search/), but you can switch it out for any similar tool. The rest of this section will assume you&#x27;re using Tavily. You&#x27;ll need to [sign up for an account](https://tavily.com/) on the Tavily website, and install the following packages:

```python
%pip install --upgrade --quiet langchain-openai tavily-python langgraph

import getpass
import os

if not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")

if not os.environ.get("TAVILY_API_KEY"):
    os.environ["TAVILY_API_KEY"] = getpass.getpass("Tavily API Key:")

```**You will also need your OpenAI key set as OPENAI_API_KEY and your Tavily API key set as TAVILY_API_KEY. Creating an agent[​](#creating-an-agent) Our end goal is to create an agent that can respond conversationally to user questions while looking up information as needed. First, let&#x27;s initialize Tavily and an OpenAI [chat model](/docs/concepts/chat_models/) capable of tool calling:

```python
from langchain_openai import ChatOpenAI
from langchain_tavily import TavilySearch

tools = [TavilySearch(max_results=10, topic="general")]

# Choose the LLM that will drive the agent
# Only certain models support this
model = ChatOpenAI(model="gpt-4o-mini")

``` To make our agent conversational, we can also specify a prompt. Here&#x27;s an example:

```python
prompt = (
    "You are a helpful assistant. "
    "You may not need to use tools for every query - the user may just want to chat!"
)

``` Great! Now let&#x27;s assemble our agent using LangGraph&#x27;s prebuilt [create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent), which allows you to create a [tool-calling agent](https://langchain-ai.github.io/langgraph/concepts/agentic_concepts/#tool-calling-agent):

```python
from langgraph.prebuilt import create_react_agent

# prompt allows you to preprocess the inputs to the model inside ReAct agent
# in this case, since we&#x27;re passing a prompt string, we&#x27;ll just always add a SystemMessage
# with this prompt string before any other messages sent to the model
agent = create_react_agent(model, tools, prompt=prompt)

```API Reference:**[create_react_agent](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent) ## Running the agent[​](#running-the-agent) Now that we&#x27;ve set up our agent, let&#x27;s try interacting with it! It can handle both trivial queries that require no lookup:

```python
from langchain_core.messages import HumanMessage

agent.invoke({"messages": [HumanMessage(content="I&#x27;m Nemo!")]})

```**API Reference:**[HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```output
{&#x27;messages&#x27;: [HumanMessage(content="I&#x27;m Nemo!", additional_kwargs={}, response_metadata={}, id=&#x27;40b60204-1af1-40d4-b6a7-b845a2281dd6&#x27;),
  AIMessage(content=&#x27;Hi Nemo! How can I assist you today?&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 11, &#x27;prompt_tokens&#x27;: 795, &#x27;total_tokens&#x27;: 806, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_34a54ae93c&#x27;, &#x27;id&#x27;: &#x27;chatcmpl-BjsUwqprT2mVdjqu1aaSm1jVVWYVz&#x27;, &#x27;service_tier&#x27;: &#x27;default&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--08282ec6-6d3e-4495-b004-b3b08f3879c3-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 795, &#x27;output_tokens&#x27;: 11, &#x27;total_tokens&#x27;: 806, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})]}

```**Or, it can use of the passed search tool to get up to date information if needed:

```python
agent.invoke(
    {
        "messages": [
            HumanMessage(
                content="What is the current conservation status of the Great Barrier Reef?"
            )
        ],
    }
)

```

```output
{&#x27;messages&#x27;: [HumanMessage(content=&#x27;What is the current conservation status of the Great Barrier Reef?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;5240955c-d842-408d-af3d-4ee74db29dbd&#x27;),
  AIMessage(content=&#x27;&#x27;, additional_kwargs={&#x27;tool_calls&#x27;: [{&#x27;id&#x27;: &#x27;call_W37BFkNuZlJu9US1Tl71xpiX&#x27;, &#x27;function&#x27;: {&#x27;arguments&#x27;: &#x27;{"query":"current conservation status of the Great Barrier Reef","time_range":"year","topic":"general"}&#x27;, &#x27;name&#x27;: &#x27;tavily_search&#x27;}, &#x27;type&#x27;: &#x27;function&#x27;}], &#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 32, &#x27;prompt_tokens&#x27;: 804, &#x27;total_tokens&#x27;: 836, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_34a54ae93c&#x27;, &#x27;id&#x27;: &#x27;chatcmpl-BjsV6EJ7F1vDipoG4dpEiBRZvuTLo&#x27;, &#x27;service_tier&#x27;: &#x27;default&#x27;, &#x27;finish_reason&#x27;: &#x27;tool_calls&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--5f5b32d7-fb80-4913-a7ec-ca9c5acaa101-0&#x27;, tool_calls=[{&#x27;name&#x27;: &#x27;tavily_search&#x27;, &#x27;args&#x27;: {&#x27;query&#x27;: &#x27;current conservation status of the Great Barrier Reef&#x27;, &#x27;time_range&#x27;: &#x27;year&#x27;, &#x27;topic&#x27;: &#x27;general&#x27;}, &#x27;id&#x27;: &#x27;call_W37BFkNuZlJu9US1Tl71xpiX&#x27;, &#x27;type&#x27;: &#x27;tool_call&#x27;}], usage_metadata={&#x27;input_tokens&#x27;: 804, &#x27;output_tokens&#x27;: 32, &#x27;total_tokens&#x27;: 836, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}}),
  ToolMessage(content=&#x27;{"query": "current conservation status of the Great Barrier Reef", "follow_up_questions": null, "answer": null, "images": [], "results": [{"title": "The Great Barrier Reef: Current Conservation Efforts and Future Outlook", "url": "https://discoverwildscience.com/the-great-barrier-reef-current-conservation-efforts-and-future-outlook-1-279446/", "content": "The Great Barrier Reef, a mesmerizing marvel of nature, stretches over 2,300 kilometers along the northeast coast of Australia. As the largest coral reef system in the world, it is home to an incredible diversity of marine life, including more than 1,500 species of fish and 411 types of hard coral.", "score": 0.6353361, "raw_content": null}, {"title": "Monitoring progress - Protecting the Great Barrier Reef", "url": "https://www.detsi.qld.gov.au/great-barrier-reef/monitoring-progress", "content": "Stay informed about the current state of the Great Barrier Reef through comprehensive monitoring reports and reef report cards. Delve into the scientific research and advancements contributing to reef conservation. Learn about ongoing efforts to track progress and ensure the reef\&#x27;s long-term health.", "score": 0.6347929, "raw_content": null}, {"title": "Great Barrier Reef Outlook Report shows that the reef is in serious ...", "url": "https://biodiversitycouncil.org.au/news/great-barrier-reef-outlook-report-shows-that-the-reef-is-in-serious-trouble", "content": "The Great Barrier Reef is in very serious trouble. Climate change is the biggest threat to the reef. Catchment restoration activities that reduce sediment flowing to the reef will aid the health of the reef but cannot match the scale of destruction occurring due to marine heatwaves caused by climate change.", "score": 0.5183761, "raw_content": null}, {"title": "Water pollution threatens Great Barrier Reef\&#x27;s survival: new report ...", "url": "https://www.marineconservation.org.au/water-pollution-threatens-great-barrier-reefs-survival-new-report-highlights-funding-need/", "content": "While this investment has supported critical work across the Great Barrier Reef catchments, more funding is needed. At current rates, the target to cut fine sediment by 25% on 2009 levels will not be met until 2047, while the target to reduce dissolved inorganic nitrogen by 60% is not expected to be achieved until 2114.", "score": 0.51383984, "raw_content": null}, {"title": "What is the state of the Great Barrier Reef? - Tangaroa Blue", "url": "https://tangaroablue.org/the-state-of-the-great-barrier-reef/", "content": "The Great Barrier Reef Outlook Report 2024, prepared every five years by the Great Barrier Reef Marine Park Authority, summarises the Reef\&#x27;s long-term outlook based on its use, management, and risks.This year\&#x27;s report uses data from the Australian Marine Debris Initiative Database to analyse the risks and impacts of marine debris on the Great Barrier Reef and help identify areas for", "score": 0.47489962, "raw_content": null}, {"title": "New report on Great Barrier Reef shows coral cover increases before ...", "url": "https://www.aims.gov.au/information-centre/news-and-stories/new-report-great-barrier-reef-shows-coral-cover-increases-onset-serious-bleaching-cyclones", "content": "Coral cover has increased in all three regions on the Great Barrier Reef and is at regional highs in two of the three regions. But the results come with a note of caution. ... trained scientists during manta tow surveys and is a metric which allows AIMS scientists to provide an overview of the Great Barrier Reef\&#x27;s status and keep policy", "score": 0.40330887, "raw_content": null}, {"title": "Cycle of coral bleaching on the Great Barrier Reef now at \&#x27;catastrophic ...", "url": "https://www.sydney.edu.au/news-opinion/news/2025/01/21/coral-bleaching-2024-great-barrier-reef-one-tree-island.html", "content": "As the Great Barrier Reef faces increasing threats from climate change, the study calls for a collaborative approach to conservation that involves local communities, scientists and policymakers. Dr Shawna Foo , a Sydney Horizon Fellow and co-author of the study, said: \\"Seeing the impacts on a reef that has largely avoided mass bleaching until", "score": 0.3759361, "raw_content": null}, {"title": "Great Barrier Reef Outlook Report 2024: An ecosystem under pressure", "url": "https://icriforum.org/gbr-outlook-report-2024/", "content": "The 2024 Great Barrier Reef Outlook Report is the fourth in a series of comprehensive five-yearly reports on the Reef\&#x27;s health, pressures, management, and potential future. It found climate-driven threats such as warming oceans and severe cyclones have been compounding other impacts from crown-of-thorns starfish outbreaks, poor water quality", "score": 0.34634283, "raw_content": null}, {"title": "UNESCO expresses \&#x27;utmost concern\&#x27; at the state of the Great Barrier Reef", "url": "https://theconversation.com/unesco-expresses-utmost-concern-at-the-state-of-the-great-barrier-reef-257638", "content": "This 2017 photo from Ribbon Reef, near Cairns, shows what a healthy reef looks like. J Summerling/AP Poor water quality persists. Poor water quality is a major issue on the Great Barrier Reef.", "score": 0.31069487, "raw_content": null}, {"title": "Reef health updates | Reef Authority - gbrmpa", "url": "https://www2.gbrmpa.gov.au/learn/reef-health/reef-health-updates", "content": "As the lead managers of the Great Barrier Reef, the Reef Authority keeps an eye on the Reef year-round — with efforts stepped up over summer, a typically high-risk period from extreme weather. The Reef Authority releases updates on the health of Reef which includes; sea surface temperatures, rainfall and floods, cyclones, crown-of-thorns", "score": 0.18051112, "raw_content": null}], "response_time": 2.07}&#x27;, name=&#x27;tavily_search&#x27;, id=&#x27;cbf7ae84-1df7-4ead-b00d-f8fba2152720&#x27;, tool_call_id=&#x27;call_W37BFkNuZlJu9US1Tl71xpiX&#x27;),
  AIMessage(content=&#x27;The current conservation status of the Great Barrier Reef is concerning. The reef is facing significant threats primarily due to climate change, which is causing marine heatwaves and coral bleaching. A report highlights that while there have been some local efforts in conservation, such as catchment restoration to reduce sediment flow, these cannot keep pace with the destruction caused by climate impacts. Recent findings from the 2024 Great Barrier Reef Outlook Report indicate that climate-driven phenomena like warming oceans and severe cyclones are exacerbating other pressures, such as crown-of-thorns starfish outbreaks and poor water quality.\n\nSome reports have indicated that coral cover has increased in certain regions of the reef, but overall, the health of the reef remains in serious decline. There’s an urgent call for more funding and collaborative efforts between local communities, scientists, and policymakers to enhance conservation measures.\n\nFor more detailed information, you can refer to these articles:\n- [The Great Barrier Reef: Current Conservation Efforts and Future Outlook](https://discoverwildscience.com/the-great-barrier-reef-current-conservation-efforts-and-future-outlook-1-279446/)\n- [Great Barrier Reef Outlook Report 2024: An ecosystem under pressure](https://icriforum.org/gbr-outlook-report-2024/)&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 255, &#x27;prompt_tokens&#x27;: 2208, &#x27;total_tokens&#x27;: 2463, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_34a54ae93c&#x27;, &#x27;id&#x27;: &#x27;chatcmpl-BjsVAxeGL7PKGVkb2DieFPE0ZPgor&#x27;, &#x27;service_tier&#x27;: &#x27;default&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--71441b27-81a0-427f-8784-b2ea674bebd4-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 2208, &#x27;output_tokens&#x27;: 255, &#x27;total_tokens&#x27;: 2463, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})]}

``` Conversational responses[​](#conversational-responses) Because our prompt contains a placeholder for chat history messages, our agent can also take previous interactions into account and respond conversationally like a standard chatbot:

```python
from langchain_core.messages import AIMessage, HumanMessage

agent.invoke(
    {
        "messages": [
            HumanMessage(content="I&#x27;m Nemo!"),
            AIMessage(content="Hello Nemo! How can I assist you today?"),
            HumanMessage(content="What is my name?"),
        ],
    }
)

```API Reference:**[AIMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.ai.AIMessage.html) | [HumanMessage](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.human.HumanMessage.html)

```output
{&#x27;messages&#x27;: [HumanMessage(content="I&#x27;m Nemo!", additional_kwargs={}, response_metadata={}, id=&#x27;8a67dea0-acd8-40f9-8c28-292c5f81c05f&#x27;),
  AIMessage(content=&#x27;Hello Nemo! How can I assist you today?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;92a2533e-5c62-4cbe-80f1-302f5f1caf28&#x27;),
  HumanMessage(content=&#x27;What is my name?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;efa8c3d3-86d7-428f-985e-a3aadd6504bc&#x27;),
  AIMessage(content=&#x27;Your name is Nemo!&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 6, &#x27;prompt_tokens&#x27;: 818, &#x27;total_tokens&#x27;: 824, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_34a54ae93c&#x27;, &#x27;id&#x27;: &#x27;chatcmpl-BjsVIf5MX5jXUEjYCorT5bWYzc7iu&#x27;, &#x27;service_tier&#x27;: &#x27;default&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--a1a32c7d-8066-4954-86f9-3a8f43fcb48d-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 818, &#x27;output_tokens&#x27;: 6, &#x27;total_tokens&#x27;: 824, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})]}

```**If preferred, you can also add memory to the LangGraph agent to manage the history of messages. Let&#x27;s redeclare it this way:

```python
from langgraph.checkpoint.memory import MemorySaver

memory = MemorySaver()
agent = create_react_agent(model, tools, prompt=prompt, checkpointer=memory)

```API Reference:**[MemorySaver](https://langchain-ai.github.io/langgraph/reference/checkpoints/#langgraph.checkpoint.memory.MemorySaver)

```python
agent.invoke(
    {"messages": [HumanMessage("I&#x27;m Nemo!")]},
    config={"configurable": {"thread_id": "1"}},
)

```

```output
{&#x27;messages&#x27;: [HumanMessage(content="I&#x27;m Nemo!", additional_kwargs={}, response_metadata={}, id=&#x27;31c2249a-13eb-4040-b56d-0c8746fa158e&#x27;),
  AIMessage(content=&#x27;Hello, Nemo! How can I assist you today?&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 12, &#x27;prompt_tokens&#x27;: 795, &#x27;total_tokens&#x27;: 807, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_34a54ae93c&#x27;, &#x27;id&#x27;: &#x27;chatcmpl-BjsVRB0FItvtPawTTIAjNwgmlQFFw&#x27;, &#x27;service_tier&#x27;: &#x27;default&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--a9703ca1-de4c-4f76-b622-9683d86ca777-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 795, &#x27;output_tokens&#x27;: 12, &#x27;total_tokens&#x27;: 807, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})]}

``` And then if we rerun our wrapped agent executor:

```python
agent.invoke(
    {"messages": [HumanMessage("What is my name?")]},
    config={"configurable": {"thread_id": "1"}},
)

```

```output
{&#x27;messages&#x27;: [HumanMessage(content="I&#x27;m Nemo!", additional_kwargs={}, response_metadata={}, id=&#x27;31c2249a-13eb-4040-b56d-0c8746fa158e&#x27;),
  AIMessage(content=&#x27;Hello, Nemo! How can I assist you today?&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 12, &#x27;prompt_tokens&#x27;: 795, &#x27;total_tokens&#x27;: 807, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_34a54ae93c&#x27;, &#x27;id&#x27;: &#x27;chatcmpl-BjsVRB0FItvtPawTTIAjNwgmlQFFw&#x27;, &#x27;service_tier&#x27;: &#x27;default&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--a9703ca1-de4c-4f76-b622-9683d86ca777-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 795, &#x27;output_tokens&#x27;: 12, &#x27;total_tokens&#x27;: 807, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}}),
  HumanMessage(content=&#x27;What is my name?&#x27;, additional_kwargs={}, response_metadata={}, id=&#x27;0cde6457-8d4d-45d5-b175-ad846018c4d2&#x27;),
  AIMessage(content=&#x27;Your name is Nemo! How can I help you today, Nemo?&#x27;, additional_kwargs={&#x27;refusal&#x27;: None}, response_metadata={&#x27;token_usage&#x27;: {&#x27;completion_tokens&#x27;: 15, &#x27;prompt_tokens&#x27;: 819, &#x27;total_tokens&#x27;: 834, &#x27;completion_tokens_details&#x27;: {&#x27;accepted_prediction_tokens&#x27;: 0, &#x27;audio_tokens&#x27;: 0, &#x27;reasoning_tokens&#x27;: 0, &#x27;rejected_prediction_tokens&#x27;: 0}, &#x27;prompt_tokens_details&#x27;: {&#x27;audio_tokens&#x27;: 0, &#x27;cached_tokens&#x27;: 0}}, &#x27;model_name&#x27;: &#x27;gpt-4o-mini-2024-07-18&#x27;, &#x27;system_fingerprint&#x27;: &#x27;fp_34a54ae93c&#x27;, &#x27;id&#x27;: &#x27;chatcmpl-BjsVTa1plxGPNitbOcw7YVTFdmz1e&#x27;, &#x27;service_tier&#x27;: &#x27;default&#x27;, &#x27;finish_reason&#x27;: &#x27;stop&#x27;, &#x27;logprobs&#x27;: None}, id=&#x27;run--1d742bc1-5839-4837-b6f4-9a6b92fa6897-0&#x27;, usage_metadata={&#x27;input_tokens&#x27;: 819, &#x27;output_tokens&#x27;: 15, &#x27;total_tokens&#x27;: 834, &#x27;input_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;cache_read&#x27;: 0}, &#x27;output_token_details&#x27;: {&#x27;audio&#x27;: 0, &#x27;reasoning&#x27;: 0}})]}

``` This [LangSmith trace](https://smith.langchain.com/public/9e6b000d-08aa-4c5a-ac83-2fdf549523cb/r) shows what&#x27;s going on under the hood. ## Further reading[​](#further-reading) For more on how to build agents, check these [LangGraph](https://langchain-ai.github.io/langgraph/) guides: [agents conceptual guide](https://langchain-ai.github.io/langgraph/concepts/agentic_concepts/)

- [agents tutorials](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/multi-agent-collaboration/)

- [create_react_agent](https://langchain-ai.github.io/langgraph/how-tos/create-react-agent/)

For more on tool usage, you can also check out [this use case section](/docs/how_to/#tools).

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/chatbots_tools.ipynb)

- [Setup](#setup)
- [Creating an agent](#creating-an-agent)
- [Running the agent](#running-the-agent)
- [Conversational responses](#conversational-responses)
- [Further reading](#further-reading)

Community

- [LangChain Forum](https://forum.langchain.com/)
- [Twitter](https://twitter.com/LangChainAI)
- [Slack](https://www.langchain.com/join-community)

GitHub

- [Organization](https://github.com/langchain-ai)
- [Python](https://github.com/langchain-ai/langchain)
- [JS/TS](https://github.com/langchain-ai/langchainjs)

More

- [Homepage](https://langchain.com)
- [Blog](https://blog.langchain.dev)
- [YouTube](https://www.youtube.com/@LangChain)

Copyright © 2025 LangChain, Inc.