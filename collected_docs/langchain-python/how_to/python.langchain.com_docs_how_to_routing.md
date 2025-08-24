How to route between sub-chains | 🦜️🔗 LangChain
- **[Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/routing.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/routing.ipynb)How to route between sub-chains PrerequisitesThis guide assumes familiarity with the following concepts: [LangChain Expression Language (LCEL)](/docs/concepts/lcel/) [Chaining runnables](/docs/how_to/sequence/) [Configuring chain parameters at runtime](/docs/how_to/configure/) [Prompt templates](/docs/concepts/prompt_templates/) [Chat Messages](/docs/concepts/messages/) Routing allows you to create non-deterministic chains where the output of a previous step defines the next step. Routing can help provide structure and consistency around interactions with models by allowing you to define states and use information related to those states as context to model calls. There are two ways to perform routing: Conditionally return runnables from a [RunnableLambda](/docs/how_to/functions/) (recommended) Using a RunnableBranch (legacy) We&#x27;ll illustrate both methods using a two step sequence where the first step classifies an input question as being about LangChain, Anthropic, or Other, then routes to a corresponding prompt chain. Example Setup[​](#example-setup) First, let&#x27;s create a chain that will identify incoming questions as being about LangChain, Anthropic, or Other:

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

chain = (
    PromptTemplate.from_template(
        """Given the user question below, classify it as either being about `LangChain`, `Anthropic`, or `Other`.

Do not respond with more than one word.

<question>
{question}
</question>

Classification:"""
    )
    | ChatAnthropic(model_name="claude-3-haiku-20240307")
    | StrOutputParser()
)

chain.invoke({"question": "how do I call Anthropic?"})

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html)

```output
&#x27;Anthropic&#x27;

```**Now, let&#x27;s create three sub chains:

```python
langchain_chain = PromptTemplate.from_template(
    """You are an expert in langchain. \
Always answer questions starting with "As Harrison Chase told me". \
Respond to the following question:

Question: {question}
Answer:"""
) | ChatAnthropic(model_name="claude-3-haiku-20240307")
anthropic_chain = PromptTemplate.from_template(
    """You are an expert in anthropic. \
Always answer questions starting with "As Dario Amodei told me". \
Respond to the following question:

Question: {question}
Answer:"""
) | ChatAnthropic(model_name="claude-3-haiku-20240307")
general_chain = PromptTemplate.from_template(
    """Respond to the following question:

Question: {question}
Answer:"""
) | ChatAnthropic(model_name="claude-3-haiku-20240307")

``` Using a custom function (Recommended)[​](#using-a-custom-function-recommended) You can also use a custom function to route between different outputs. Here&#x27;s an example:

```python
def route(info):
    if "anthropic" in info["topic"].lower():
        return anthropic_chain
    elif "langchain" in info["topic"].lower():
        return langchain_chain
    else:
        return general_chain

```

```python
from langchain_core.runnables import RunnableLambda

full_chain = {"topic": chain, "question": lambda x: x["question"]} | RunnableLambda(
    route
)

```API Reference:**[RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html)

```python
full_chain.invoke({"question": "how do I use Anthropic?"})

```**

```output
AIMessage(content="As Dario Amodei told me, to use Anthropic, you can start by exploring the company&#x27;s website and learning about their mission, values, and the different services and products they offer. Anthropic is focused on developing safe and ethical AI systems, so they have a strong emphasis on transparency and responsible AI development. \n\nDepending on your specific needs, you can look into Anthropic&#x27;s AI research and development services, which cover areas like natural language processing, computer vision, and reinforcement learning. They also offer consulting and advisory services to help organizations navigate the challenges and opportunities of AI integration.\n\nAdditionally, Anthropic has released some open-source AI models and tools that you can explore and experiment with. These can be a great way to get hands-on experience with Anthropic&#x27;s approach to AI development.\n\nOverall, Anthropic aims to be a reliable and trustworthy partner in the AI space, so I&#x27;d encourage you to reach out to them directly to discuss how they can best support your specific requirements.", response_metadata={&#x27;id&#x27;: &#x27;msg_01CtLFgFSwvTaJomrihE87Ra&#x27;, &#x27;content&#x27;: [ContentBlock(text="As Dario Amodei told me, to use Anthropic, you can start by exploring the company&#x27;s website and learning about their mission, values, and the different services and products they offer. Anthropic is focused on developing safe and ethical AI systems, so they have a strong emphasis on transparency and responsible AI development. \n\nDepending on your specific needs, you can look into Anthropic&#x27;s AI research and development services, which cover areas like natural language processing, computer vision, and reinforcement learning. They also offer consulting and advisory services to help organizations navigate the challenges and opportunities of AI integration.\n\nAdditionally, Anthropic has released some open-source AI models and tools that you can explore and experiment with. These can be a great way to get hands-on experience with Anthropic&#x27;s approach to AI development.\n\nOverall, Anthropic aims to be a reliable and trustworthy partner in the AI space, so I&#x27;d encourage you to reach out to them directly to discuss how they can best support your specific requirements.", type=&#x27;text&#x27;)], &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;type&#x27;: &#x27;message&#x27;, &#x27;usage&#x27;: Usage(input_tokens=53, output_tokens=219)})

```

```python
full_chain.invoke({"question": "how do I use LangChain?"})

```

```output
AIMessage(content="As Harrison Chase told me, using LangChain involves a few key steps:\n\n1. **Set up your environment**: Install the necessary Python packages, including the LangChain library itself, as well as any other dependencies your application might require, such as language models or other integrations.\n\n2. **Understand the core concepts**: LangChain revolves around a few core concepts, like Agents, Chains, and Tools. Familiarize yourself with these concepts and how they work together to build powerful language-based applications.\n\n3. **Identify your use case**: Determine what kind of task or application you want to build using LangChain, such as a chatbot, a question-answering system, or a document summarization tool.\n\n4. **Choose the appropriate components**: Based on your use case, select the right LangChain components, such as agents, chains, and tools, to build your application.\n\n5. **Integrate with language models**: LangChain is designed to work seamlessly with various language models, such as OpenAI&#x27;s GPT-3 or Anthropic&#x27;s models. Connect your chosen language model to your LangChain application.\n\n6. **Implement your application logic**: Use LangChain&#x27;s building blocks to implement the specific functionality of your application, such as prompting the language model, processing the response, and integrating with other services or data sources.\n\n7. **Test and iterate**: Thoroughly test your application, gather feedback, and iterate on your design and implementation to improve its performance and user experience.\n\nAs Harrison Chase emphasized, LangChain provides a flexible and powerful framework for building language-based applications, making it easier to leverage the capabilities of modern language models. By following these steps, you can get started with LangChain and create innovative solutions tailored to your specific needs.", response_metadata={&#x27;id&#x27;: &#x27;msg_01H3UXAAHG4TwxJLpxwuuVU7&#x27;, &#x27;content&#x27;: [ContentBlock(text="As Harrison Chase told me, using LangChain involves a few key steps:\n\n1. **Set up your environment**: Install the necessary Python packages, including the LangChain library itself, as well as any other dependencies your application might require, such as language models or other integrations.\n\n2. **Understand the core concepts**: LangChain revolves around a few core concepts, like Agents, Chains, and Tools. Familiarize yourself with these concepts and how they work together to build powerful language-based applications.\n\n3. **Identify your use case**: Determine what kind of task or application you want to build using LangChain, such as a chatbot, a question-answering system, or a document summarization tool.\n\n4. **Choose the appropriate components**: Based on your use case, select the right LangChain components, such as agents, chains, and tools, to build your application.\n\n5. **Integrate with language models**: LangChain is designed to work seamlessly with various language models, such as OpenAI&#x27;s GPT-3 or Anthropic&#x27;s models. Connect your chosen language model to your LangChain application.\n\n6. **Implement your application logic**: Use LangChain&#x27;s building blocks to implement the specific functionality of your application, such as prompting the language model, processing the response, and integrating with other services or data sources.\n\n7. **Test and iterate**: Thoroughly test your application, gather feedback, and iterate on your design and implementation to improve its performance and user experience.\n\nAs Harrison Chase emphasized, LangChain provides a flexible and powerful framework for building language-based applications, making it easier to leverage the capabilities of modern language models. By following these steps, you can get started with LangChain and create innovative solutions tailored to your specific needs.", type=&#x27;text&#x27;)], &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;type&#x27;: &#x27;message&#x27;, &#x27;usage&#x27;: Usage(input_tokens=50, output_tokens=400)})

```

```python
full_chain.invoke({"question": "whats 2 + 2"})

```

```output
AIMessage(content=&#x27;4&#x27;, response_metadata={&#x27;id&#x27;: &#x27;msg_01UAKP81jTZu9fyiyFYhsbHc&#x27;, &#x27;content&#x27;: [ContentBlock(text=&#x27;4&#x27;, type=&#x27;text&#x27;)], &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;type&#x27;: &#x27;message&#x27;, &#x27;usage&#x27;: Usage(input_tokens=28, output_tokens=5)})

``` Using a RunnableBranch[​](#using-a-runnablebranch) A RunnableBranch is a special type of runnable that allows you to define a set of conditions and runnables to execute based on the input. It does not** offer anything that you can&#x27;t achieve in a custom function as described above, so we recommend using a custom function instead. A RunnableBranch is initialized with a list of (condition, runnable) pairs and a default runnable. It selects which branch by passing each condition the input it&#x27;s invoked with. It selects the first condition to evaluate to True, and runs the corresponding runnable to that condition with the input. If no provided conditions match, it runs the default runnable. Here&#x27;s an example of what it looks like in action:

```python
from langchain_core.runnables import RunnableBranch

branch = RunnableBranch(
    (lambda x: "anthropic" in x["topic"].lower(), anthropic_chain),
    (lambda x: "langchain" in x["topic"].lower(), langchain_chain),
    general_chain,
)
full_chain = {"topic": chain, "question": lambda x: x["question"]} | branch
full_chain.invoke({"question": "how do I use Anthropic?"})

```**API Reference:**[RunnableBranch](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.branch.RunnableBranch.html)

```output
AIMessage(content="As Dario Amodei told me, to use Anthropic, you should first familiarize yourself with our mission and principles. Anthropic is committed to developing safe and beneficial artificial intelligence that can help solve important problems facing humanity. \n\nTo get started, I recommend exploring the resources on our website, which cover our research, products, and approach to AI development. You can also reach out to our team to learn more about how Anthropic&#x27;s technology and services can support your specific needs.\n\nThe key is to engage with us in a way that aligns with our values of transparency, ethical AI, and a commitment to the wellbeing of humanity. We&#x27;re here to collaborate and help you harness the power of advanced AI responsibly.", response_metadata={&#x27;id&#x27;: &#x27;msg_0187BVnpniPDJnVvwf3M1LdY&#x27;, &#x27;content&#x27;: [ContentBlock(text="As Dario Amodei told me, to use Anthropic, you should first familiarize yourself with our mission and principles. Anthropic is committed to developing safe and beneficial artificial intelligence that can help solve important problems facing humanity. \n\nTo get started, I recommend exploring the resources on our website, which cover our research, products, and approach to AI development. You can also reach out to our team to learn more about how Anthropic&#x27;s technology and services can support your specific needs.\n\nThe key is to engage with us in a way that aligns with our values of transparency, ethical AI, and a commitment to the wellbeing of humanity. We&#x27;re here to collaborate and help you harness the power of advanced AI responsibly.", type=&#x27;text&#x27;)], &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;type&#x27;: &#x27;message&#x27;, &#x27;usage&#x27;: Usage(input_tokens=53, output_tokens=160)})

```**

```python
full_chain.invoke({"question": "how do I use LangChain?"})

```

```output
AIMessage(content="As Harrison Chase told me, using LangChain involves several key steps. First, you&#x27;ll need to install the LangChain library and import the necessary modules. Then, you&#x27;ll want to define your language model, any data sources you plan to use, and the specific tasks you want to accomplish, such as question answering, text generation, or agent-based reasoning. \n\nLangChain provides a flexible framework for building applications that leverage large language models. It includes abstractions for things like retrievers, prompts, and chains, which allow you to compose different components together to create powerful workflows. \n\nThe documentation on the LangChain website is excellent and covers many common use cases in detail. I&#x27;d recommend starting there to get a solid understanding of the core concepts and how to apply them to your specific needs. And of course, feel free to reach out if you have any other questions - I&#x27;m always happy to share more insights from my conversations with Harrison.", response_metadata={&#x27;id&#x27;: &#x27;msg_01T1naS99wGPkEAP4LME8iAv&#x27;, &#x27;content&#x27;: [ContentBlock(text="As Harrison Chase told me, using LangChain involves several key steps. First, you&#x27;ll need to install the LangChain library and import the necessary modules. Then, you&#x27;ll want to define your language model, any data sources you plan to use, and the specific tasks you want to accomplish, such as question answering, text generation, or agent-based reasoning. \n\nLangChain provides a flexible framework for building applications that leverage large language models. It includes abstractions for things like retrievers, prompts, and chains, which allow you to compose different components together to create powerful workflows. \n\nThe documentation on the LangChain website is excellent and covers many common use cases in detail. I&#x27;d recommend starting there to get a solid understanding of the core concepts and how to apply them to your specific needs. And of course, feel free to reach out if you have any other questions - I&#x27;m always happy to share more insights from my conversations with Harrison.", type=&#x27;text&#x27;)], &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;type&#x27;: &#x27;message&#x27;, &#x27;usage&#x27;: Usage(input_tokens=50, output_tokens=205)})

```

```python
full_chain.invoke({"question": "whats 2 + 2"})

```

```output
AIMessage(content=&#x27;4&#x27;, response_metadata={&#x27;id&#x27;: &#x27;msg_01T6T3TS6hRCtU8JayN93QEi&#x27;, &#x27;content&#x27;: [ContentBlock(text=&#x27;4&#x27;, type=&#x27;text&#x27;)], &#x27;model&#x27;: &#x27;claude-3-haiku-20240307&#x27;, &#x27;role&#x27;: &#x27;assistant&#x27;, &#x27;stop_reason&#x27;: &#x27;end_turn&#x27;, &#x27;stop_sequence&#x27;: None, &#x27;type&#x27;: &#x27;message&#x27;, &#x27;usage&#x27;: Usage(input_tokens=28, output_tokens=5)})

``` Routing by semantic similarity[​](#routing-by-semantic-similarity) One especially useful technique is to use embeddings to route a query to the most relevant prompt. Here&#x27;s an example.

```python
from langchain_community.utils.math import cosine_similarity
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_openai import OpenAIEmbeddings

physics_template = """You are a very smart physics professor. \
You are great at answering questions about physics in a concise and easy to understand manner. \
When you don&#x27;t know the answer to a question you admit that you don&#x27;t know.

Here is a question:
{query}"""

math_template = """You are a very good mathematician. You are great at answering math questions. \
You are so good because you are able to break down hard problems into their component parts, \
answer the component parts, and then put them together to answer the broader question.

Here is a question:
{query}"""

embeddings = OpenAIEmbeddings()
prompt_templates = [physics_template, math_template]
prompt_embeddings = embeddings.embed_documents(prompt_templates)

def prompt_router(input):
    query_embedding = embeddings.embed_query(input["query"])
    similarity = cosine_similarity([query_embedding], prompt_embeddings)[0]
    most_similar = prompt_templates[similarity.argmax()]
    print("Using MATH" if most_similar == math_template else "Using PHYSICS")
    return PromptTemplate.from_template(most_similar)

chain = (
    {"query": RunnablePassthrough()}
    | RunnableLambda(prompt_router)
    | ChatAnthropic(model="claude-3-haiku-20240307")
    | StrOutputParser()
)

```API Reference:**[StrOutputParser](https://python.langchain.com/api_reference/core/output_parsers/langchain_core.output_parsers.string.StrOutputParser.html) | [PromptTemplate](https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.prompt.PromptTemplate.html) | [RunnableLambda](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.base.RunnableLambda.html) | [RunnablePassthrough](https://python.langchain.com/api_reference/core/runnables/langchain_core.runnables.passthrough.RunnablePassthrough.html)

```python
print(chain.invoke("What&#x27;s a black hole"))

```

```output
Using PHYSICS
As a physics professor, I would be happy to provide a concise and easy-to-understand explanation of what a black hole is.

A black hole is an incredibly dense region of space-time where the gravitational pull is so strong that nothing, not even light, can escape from it. This means that if you were to get too close to a black hole, you would be pulled in and crushed by the intense gravitational forces.

The formation of a black hole occurs when a massive star, much larger than our Sun, reaches the end of its life and collapses in on itself. This collapse causes the matter to become extremely dense, and the gravitational force becomes so strong that it creates a point of no return, known as the event horizon.

Beyond the event horizon, the laws of physics as we know them break down, and the intense gravitational forces create a singularity, which is a point of infinite density and curvature in space-time.

Black holes are fascinating and mysterious objects, and there is still much to be learned about their properties and behavior. If I were unsure about any specific details or aspects of black holes, I would readily admit that I do not have a complete understanding and would encourage further research and investigation.

```

```python
print(chain.invoke("What&#x27;s a path integral"))

```

```output
Using MATH
A path integral is a powerful mathematical concept in physics, particularly in the field of quantum mechanics. It was developed by the renowned physicist Richard Feynman as an alternative formulation of quantum mechanics.

In a path integral, instead of considering a single, definite path that a particle might take from one point to another, as in classical mechanics, the particle is considered to take all possible paths simultaneously. Each path is assigned a complex-valued weight, and the total probability amplitude for the particle to go from one point to another is calculated by summing (integrating) over all possible paths.

The key ideas behind the path integral formulation are:

1. Superposition principle: In quantum mechanics, particles can exist in a superposition of multiple states or paths simultaneously.

2. Probability amplitude: The probability amplitude for a particle to go from one point to another is calculated by summing the complex-valued weights of all possible paths.

3. Weighting of paths: Each path is assigned a weight based on the action (the time integral of the Lagrangian) along that path. Paths with lower action have a greater weight.

4. Feynman&#x27;s approach: Feynman developed the path integral formulation as an alternative to the traditional wave function approach in quantum mechanics, providing a more intuitive and conceptual understanding of quantum phenomena.

The path integral approach is particularly useful in quantum field theory, where it provides a powerful framework for calculating transition probabilities and understanding the behavior of quantum systems. It has also found applications in various areas of physics, such as condensed matter, statistical mechanics, and even in finance (the path integral approach to option pricing).

The mathematical construction of the path integral involves the use of advanced concepts from functional analysis and measure theory, making it a powerful and sophisticated tool in the physicist&#x27;s arsenal.

``` ## Next steps[​](#next-steps) You&#x27;ve now learned how to add routing to your composed LCEL chains. Next, check out the other how-to guides on runnables in this section.[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/routing.ipynb)[Example Setup](#example-setup)
- [Using a custom function (Recommended)](#using-a-custom-function-recommended)
- [Using a RunnableBranch](#using-a-runnablebranch)
- [Routing by semantic similarity](#routing-by-semantic-similarity)
- [Next steps](#next-steps)

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