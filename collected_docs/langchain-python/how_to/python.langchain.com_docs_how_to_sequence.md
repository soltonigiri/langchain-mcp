How to chain runnables | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/sequence.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/sequence.ipynb)How to chain runnables PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Expression Language (LCEL)](/docs/concepts/lcel/) [Prompt templates](/docs/concepts/prompt_templates/) [Chat models](/docs/concepts/chat_models/) [Output parser](/docs/concepts/output_parsers/) One point about [LangChain Expression Language](/docs/concepts/lcel/) is that any two runnables can be "chained" together into sequences. The output of the previous runnable&#x27;s .invoke() call is passed as input to the next runnable. This can be done using the pipe operator (|), or the more explicit .pipe() method, which does the same thing. The resulting [RunnableSequence](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableSequence.html) is itself a runnable, which means it can be invoked, streamed, or further chained just like any other runnable. Advantages of chaining runnables in this way are efficient streaming (the sequence will stream output as soon as it is available), and debugging and tracing with tools like [LangSmith](/docs/how_to/debugging/). The pipe operator: |[​](#the-pipe-operator-) To show off how this works, let&#x27;s go through an example. We&#x27;ll walk through a common pattern in LangChain: using a [prompt template](/docs/how_to/#prompt-templates) to format input into a [chat model](/docs/how_to/#chat-models), and finally converting the chat message output into a string with an [output parser](/docs/how_to/#output-parsers). Select [chat model](/docs/integrations/chat/):Google Gemini▾[OpenAI](#)[Anthropic](#)[Azure](#)[Google Gemini](#)[Google Vertex](#)[AWS](#)[Groq](#)[Cohere](#)[NVIDIA](#)[Fireworks AI](#)[Mistral AI](#)[Together AI](#)[IBM watsonx](#)[Databricks](#)[xAI](#)[Perplexity](#)[DeepSeek](#)

```bash
pip install -qU "langchain[google-genai]"

```

```python
import getpass
import os

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

from langchain.chat_models import init_chat_model

model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

```

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("tell me a joke about {topic}")

chain = prompt | model | StrOutputParser()

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [ChatPromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html) Prompts and models are both runnable, and the output type from the prompt call is the same as the input type of the chat model, so we can chain them together. We can then invoke the resulting sequence like any other runnable:

```python
chain.invoke({"topic": "bears"})

```**

```output
"Why don&#x27;t bears wear shoes?\n\nBecause they prefer to go bear-foot!"

``` Coercion[​](#coercion) We can even combine this chain with more runnables to create another chain. This may involve some input/output formatting using other types of runnables, depending on the required inputs and outputs of the chain components. For example, let&#x27;s say we wanted to compose the joke generating chain with another chain that evaluates whether or not the generated joke was funny. We would need to be careful with how we format the input into the next chain. In the below example, the dict in the chain is automatically parsed and converted into a [RunnableParallel](/docs/how_to/parallel/), which runs all of its values in parallel and returns a dict with the results. This happens to be the same format the next prompt template expects. Here it is in action:

```python
from langchain_core.output_parsers import StrOutputParser

analysis_prompt = ChatPromptTemplate.from_template("is this a funny joke? {joke}")

composed_chain = {"joke": chain} | analysis_prompt | model | StrOutputParser()

composed_chain.invoke({"topic": "bears"})

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html)

```output
&#x27;Yes, that\&#x27;s a funny joke! It\&#x27;s a classic pun that plays on the homophone pair "bare-foot" and "bear-foot." The humor comes from:\n\n1. The wordplay between "barefoot" (not wearing shoes) and "bear-foot" (the foot of a bear)\n2. The logical connection to the setup (bears don\&#x27;t wear shoes)\n3. It\&#x27;s family-friendly and accessible\n4. It\&#x27;s a simple, clean pun that creates an unexpected but satisfying punchline\n\nIt\&#x27;s the kind of joke that might make you groan and smile at the same time - what people often call a "dad joke."&#x27;

```**Functions will also be coerced into runnables, so you can add custom logic to your chains too. The below chain results in the same logical flow as before:

```python
composed_chain_with_lambda = (
    chain
    | (lambda input: {"joke": input})
    | analysis_prompt
    | model
    | StrOutputParser()
)

composed_chain_with_lambda.invoke({"topic": "beets"})

```

```output
&#x27;Yes, that\&#x27;s a cute and funny joke! It works well because:\n\n1. It plays on the double meaning of "roots" - both the literal roots of the beet plant and the metaphorical sense of knowing one\&#x27;s origins or foundation\n2. It\&#x27;s a simple, clean pun that doesn\&#x27;t rely on offensive content\n3. It has a satisfying logical connection (beets are root vegetables)\n\nIt\&#x27;s the kind of wholesome food pun that might make people groan a little but also smile. Perfect for sharing in casual conversation or with kids!&#x27;

``` However, keep in mind that using functions like this may interfere with operations like streaming. See [this section](/docs/how_to/functions/) for more information. The .pipe() method[​](#the-pipe-method) We could also compose the same sequence using the .pipe() method. Here&#x27;s what that looks like:

```python
from langchain_core.runnables import RunnableParallel

composed_chain_with_pipe = (
    RunnableParallel({"joke": chain})
    .pipe(analysis_prompt)
    .pipe(model)
    .pipe(StrOutputParser())
)

composed_chain_with_pipe.invoke({"topic": "battlestar galactica"})

```API Reference:**[RunnableParallel](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableParallel.html)

```output
"This joke is moderately funny! It plays on Battlestar Galactica lore where Cylons are robots with 12 different models trying to infiltrate human society. The humor comes from the idea of a Cylon accidentally revealing their non-human nature through a pickup line that references their artificial origins. It&#x27;s a decent nerd-culture joke that would land well with fans of the show, though someone unfamiliar with Battlestar Galactica might not get the reference. The punchline effectively highlights the contradiction in a Cylon trying to blend in while simultaneously revealing their true identity."

``` Or the abbreviated:

```python
composed_chain_with_pipe = RunnableParallel({"joke": chain}).pipe(
    analysis_prompt, model, StrOutputParser()
)

``` ## Related[​](#related) [Streaming](/docs/how_to/streaming/): Check out the streaming guide to understand the streaming behavior of a chain

[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/sequence.ipynb)

- [The pipe operator: |](#the-pipe-operator-)[Coercion](#coercion)

- [The .pipe() method](#the-pipe-method)
- [Related](#related)

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