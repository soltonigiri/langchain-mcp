How to split code | 🦜️🔗 LangChain
- [Skip to main content](#__docusaurus_skipToContent_fallback)Our new LangChain Academy Course Deep Research with LangGraph is now live! [Enroll for free](https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co).[On this page![Open In Colab ](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/langchain-ai/langchain/blob/master/docs/docs/how_to/code_splitter.ipynb)[![Open on GitHub ](https://img.shields.io/badge/Open%20on%20GitHub-grey?logo=github&logoColor=white)](https://github.com/langchain-ai/langchain/blob/master/docs/docs/how_to/code_splitter.ipynb) # How to split code [RecursiveCharacterTextSplitter](https://python.langchain.com/api_reference/text_splitters/character/langchain_text_splitters.character.RecursiveCharacterTextSplitter.html) includes pre-built lists of separators that are useful for [splitting text](/docs/concepts/text_splitters/) in a specific programming language. Supported languages are stored in the langchain_text_splitters.Language enum. They include:

```text
"cpp",
"go",
"java",
"kotlin",
"js",
"ts",
"php",
"proto",
"python",
"rst",
"ruby",
"rust",
"scala",
"swift",
"markdown",
"latex",
"html",
"sol",
"csharp",
"cobol",
"c",
"lua",
"perl",
"haskell"

``` To view the list of separators for a given language, pass a value from this enum into

```python
RecursiveCharacterTextSplitter.get_separators_for_language

``` To instantiate a splitter that is tailored for a specific language, pass a value from the enum into

```python
RecursiveCharacterTextSplitter.from_language

``` Below we demonstrate examples for the various languages.

```python
%pip install -qU langchain-text-splitters

```

```python
from langchain_text_splitters import (
    Language,
    RecursiveCharacterTextSplitter,
)

``` To view the full list of supported languages:

```python
[e.value for e in Language]

```

```output
[&#x27;cpp&#x27;,
 &#x27;go&#x27;,
 &#x27;java&#x27;,
 &#x27;kotlin&#x27;,
 &#x27;js&#x27;,
 &#x27;ts&#x27;,
 &#x27;php&#x27;,
 &#x27;proto&#x27;,
 &#x27;python&#x27;,
 &#x27;rst&#x27;,
 &#x27;ruby&#x27;,
 &#x27;rust&#x27;,
 &#x27;scala&#x27;,
 &#x27;swift&#x27;,
 &#x27;markdown&#x27;,
 &#x27;latex&#x27;,
 &#x27;html&#x27;,
 &#x27;sol&#x27;,
 &#x27;csharp&#x27;,
 &#x27;cobol&#x27;,
 &#x27;c&#x27;,
 &#x27;lua&#x27;,
 &#x27;perl&#x27;,
 &#x27;haskell&#x27;,
 &#x27;elixir&#x27;,
 &#x27;powershell&#x27;,
 &#x27;visualbasic6&#x27;]

``` You can also see the separators used for a given language:

```python
RecursiveCharacterTextSplitter.get_separators_for_language(Language.PYTHON)

```

```output
[&#x27;\nclass &#x27;, &#x27;\ndef &#x27;, &#x27;\n\tdef &#x27;, &#x27;\n\n&#x27;, &#x27;\n&#x27;, &#x27; &#x27;, &#x27;&#x27;]

``` ## Python[​](#python) Here&#x27;s an example using the PythonTextSplitter:

```python
PYTHON_CODE = """
def hello_world():
    print("Hello, World!")

# Call the function
hello_world()
"""
python_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON, chunk_size=50, chunk_overlap=0
)
python_docs = python_splitter.create_documents([PYTHON_CODE])
python_docs

```

```output
[Document(metadata={}, page_content=&#x27;def hello_world():\n    print("Hello, World!")&#x27;),
 Document(metadata={}, page_content=&#x27;# Call the function\nhello_world()&#x27;)]

``` ## JS[​](#js) Here&#x27;s an example using the JS text splitter:

```python
JS_CODE = """
function helloWorld() {
  console.log("Hello, World!");
}

// Call the function
helloWorld();
"""

js_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.JS, chunk_size=60, chunk_overlap=0
)
js_docs = js_splitter.create_documents([JS_CODE])
js_docs

```

```output
[Document(metadata={}, page_content=&#x27;function helloWorld() {\n  console.log("Hello, World!");\n}&#x27;),
 Document(metadata={}, page_content=&#x27;// Call the function\nhelloWorld();&#x27;)]

``` ## TS[​](#ts) Here&#x27;s an example using the TS text splitter:

```python
TS_CODE = """
function helloWorld(): void {
  console.log("Hello, World!");
}

// Call the function
helloWorld();
"""

ts_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.TS, chunk_size=60, chunk_overlap=0
)
ts_docs = ts_splitter.create_documents([TS_CODE])
ts_docs

```

```output
[Document(metadata={}, page_content=&#x27;function helloWorld(): void {&#x27;),
 Document(metadata={}, page_content=&#x27;console.log("Hello, World!");\n}&#x27;),
 Document(metadata={}, page_content=&#x27;// Call the function\nhelloWorld();&#x27;)]

``` ## Markdown[​](#markdown) Here&#x27;s an example using the Markdown text splitter:

```python
markdown_text = """
# 🦜️🔗 LangChain

⚡ Building applications with LLMs through composability ⚡

## What is LangChain?

# Hopefully this code block isn&#x27;t split
LangChain is a framework for...

As an open-source project in a rapidly developing field, we are extremely open to contributions.
"""

```

```python
md_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.MARKDOWN, chunk_size=60, chunk_overlap=0
)
md_docs = md_splitter.create_documents([markdown_text])
md_docs

```

```output
[Document(metadata={}, page_content=&#x27;# 🦜️🔗 LangChain&#x27;),
 Document(metadata={}, page_content=&#x27;⚡ Building applications with LLMs through composability ⚡&#x27;),
 Document(metadata={}, page_content=&#x27;## What is LangChain?&#x27;),
 Document(metadata={}, page_content="# Hopefully this code block isn&#x27;t split"),
 Document(metadata={}, page_content=&#x27;LangChain is a framework for...&#x27;),
 Document(metadata={}, page_content=&#x27;As an open-source project in a rapidly developing field, we&#x27;),
 Document(metadata={}, page_content=&#x27;are extremely open to contributions.&#x27;)]

``` ## Latex[​](#latex) Here&#x27;s an example on Latex text:

```python
latex_text = """
\documentclass{article}

\begin{document}

\maketitle

\section{Introduction}
Large language models (LLMs) are a type of machine learning model that can be trained on vast amounts of text data to generate human-like language. In recent years, LLMs have made significant advances in a variety of natural language processing tasks, including language translation, text generation, and sentiment analysis.

\subsection{History of LLMs}
The earliest LLMs were developed in the 1980s and 1990s, but they were limited by the amount of data that could be processed and the computational power available at the time. In the past decade, however, advances in hardware and software have made it possible to train LLMs on massive datasets, leading to significant improvements in performance.

\subsection{Applications of LLMs}
LLMs have many applications in industry, including chatbots, content creation, and virtual assistants. They can also be used in academia for research in linguistics, psychology, and computational linguistics.

\end{document}
"""

```

```python
latex_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.MARKDOWN, chunk_size=60, chunk_overlap=0
)
latex_docs = latex_splitter.create_documents([latex_text])
latex_docs

```

```output
[Document(metadata={}, page_content=&#x27;\\documentclass{article}\n\n\x08egin{document}\n\n\\maketitle&#x27;),
 Document(metadata={}, page_content=&#x27;\\section{Introduction}&#x27;),
 Document(metadata={}, page_content=&#x27;Large language models (LLMs) are a type of machine learning&#x27;),
 Document(metadata={}, page_content=&#x27;model that can be trained on vast amounts of text data to&#x27;),
 Document(metadata={}, page_content=&#x27;generate human-like language. In recent years, LLMs have&#x27;),
 Document(metadata={}, page_content=&#x27;made significant advances in a variety of natural language&#x27;),
 Document(metadata={}, page_content=&#x27;processing tasks, including language translation, text&#x27;),
 Document(metadata={}, page_content=&#x27;generation, and sentiment analysis.&#x27;),
 Document(metadata={}, page_content=&#x27;\\subsection{History of LLMs}&#x27;),
 Document(metadata={}, page_content=&#x27;The earliest LLMs were developed in the 1980s and 1990s,&#x27;),
 Document(metadata={}, page_content=&#x27;but they were limited by the amount of data that could be&#x27;),
 Document(metadata={}, page_content=&#x27;processed and the computational power available at the&#x27;),
 Document(metadata={}, page_content=&#x27;time. In the past decade, however, advances in hardware and&#x27;),
 Document(metadata={}, page_content=&#x27;software have made it possible to train LLMs on massive&#x27;),
 Document(metadata={}, page_content=&#x27;datasets, leading to significant improvements in&#x27;),
 Document(metadata={}, page_content=&#x27;performance.&#x27;),
 Document(metadata={}, page_content=&#x27;\\subsection{Applications of LLMs}&#x27;),
 Document(metadata={}, page_content=&#x27;LLMs have many applications in industry, including&#x27;),
 Document(metadata={}, page_content=&#x27;chatbots, content creation, and virtual assistants. They&#x27;),
 Document(metadata={}, page_content=&#x27;can also be used in academia for research in linguistics,&#x27;),
 Document(metadata={}, page_content=&#x27;psychology, and computational linguistics.&#x27;),
 Document(metadata={}, page_content=&#x27;\\end{document}&#x27;)]

``` ## HTML[​](#html) Here&#x27;s an example using an HTML text splitter:

```python
html_text = """
<!DOCTYPE html>
<html>
    <head>
        <title>🦜️🔗 LangChain</title>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            h1 {
                color: darkblue;
            }
        </style>
    </head>
    <body>
        <div>
            <h1>🦜️🔗 LangChain</h1>
            <p>⚡ Building applications with LLMs through composability ⚡</p>
        </div>
        <div>
            As an open-source project in a rapidly developing field, we are extremely open to contributions.
        </div>
    </body>
</html>
"""

```

```python
html_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.HTML, chunk_size=60, chunk_overlap=0
)
html_docs = html_splitter.create_documents([html_text])
html_docs

```

```output
[Document(metadata={}, page_content=&#x27;<!DOCTYPE html>\n<html>&#x27;),
 Document(metadata={}, page_content=&#x27;<head>\n        <title>🦜️🔗 LangChain</title>&#x27;),
 Document(metadata={}, page_content=&#x27;<style>\n            body {\n                font-family: Aria&#x27;),
 Document(metadata={}, page_content=&#x27;l, sans-serif;\n            }\n            h1 {&#x27;),
 Document(metadata={}, page_content=&#x27;color: darkblue;\n            }\n        </style>\n    </head&#x27;),
 Document(metadata={}, page_content=&#x27;>&#x27;),
 Document(metadata={}, page_content=&#x27;<body>&#x27;),
 Document(metadata={}, page_content=&#x27;<div>\n            <h1>🦜️🔗 LangChain</h1>&#x27;),
 Document(metadata={}, page_content=&#x27;<p>⚡ Building applications with LLMs through composability ⚡&#x27;),
 Document(metadata={}, page_content=&#x27;</p>\n        </div>&#x27;),
 Document(metadata={}, page_content=&#x27;<div>\n            As an open-source project in a rapidly dev&#x27;),
 Document(metadata={}, page_content=&#x27;eloping field, we are extremely open to contributions.&#x27;),
 Document(metadata={}, page_content=&#x27;</div>\n    </body>\n</html>&#x27;)]

``` ## Solidity[​](#solidity) Here&#x27;s an example using the Solidity text splitter:

```python
SOL_CODE = """
pragma solidity ^0.8.20;
contract HelloWorld {
   function add(uint a, uint b) pure public returns(uint) {
       return a + b;
   }
}
"""

sol_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.SOL, chunk_size=128, chunk_overlap=0
)
sol_docs = sol_splitter.create_documents([SOL_CODE])
sol_docs

```

```output
[Document(metadata={}, page_content=&#x27;pragma solidity ^0.8.20;&#x27;),
 Document(metadata={}, page_content=&#x27;contract HelloWorld {\n   function add(uint a, uint b) pure public returns(uint) {\n       return a + b;\n   }\n}&#x27;)]

``` ## C#[​](#c) Here&#x27;s an example using the C# text splitter:

```python
C_CODE = """
using System;
class Program
{
    static void Main()
    {
        int age = 30; // Change the age value as needed

        // Categorize the age without any console output
        if (age < 18)
        {
            // Age is under 18
        }
        else if (age >= 18 && age < 65)
        {
            // Age is an adult
        }
        else
        {
            // Age is a senior citizen
        }
    }
}
"""
c_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.CSHARP, chunk_size=128, chunk_overlap=0
)
c_docs = c_splitter.create_documents([C_CODE])
c_docs

```

```output
[Document(metadata={}, page_content=&#x27;using System;&#x27;),
 Document(metadata={}, page_content=&#x27;class Program\n{\n    static void Main()\n    {\n        int age = 30; // Change the age value as needed&#x27;),
 Document(metadata={}, page_content=&#x27;// Categorize the age without any console output\n        if (age < 18)\n        {\n            // Age is under 18&#x27;),
 Document(metadata={}, page_content=&#x27;}\n        else if (age >= 18 && age < 65)\n        {\n            // Age is an adult\n        }\n        else\n        {&#x27;),
 Document(metadata={}, page_content=&#x27;// Age is a senior citizen\n        }\n    }\n}&#x27;)]

``` ## Haskell[​](#haskell) Here&#x27;s an example using the Haskell text splitter:

```python
HASKELL_CODE = """
main :: IO ()
main = do
    putStrLn "Hello, World!"
-- Some sample functions
add :: Int -> Int -> Int
add x y = x + y
"""
haskell_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.HASKELL, chunk_size=50, chunk_overlap=0
)
haskell_docs = haskell_splitter.create_documents([HASKELL_CODE])
haskell_docs

```

```output
[Document(metadata={}, page_content=&#x27;main :: IO ()&#x27;),
 Document(metadata={}, page_content=&#x27;main = do\n    putStrLn "Hello, World!"\n-- Some&#x27;),
 Document(metadata={}, page_content=&#x27;sample functions\nadd :: Int -> Int -> Int\nadd x y&#x27;),
 Document(metadata={}, page_content=&#x27;= x + y&#x27;)]

``` ## PHP[​](#php) Here&#x27;s an example using the PHP text splitter:

```python
PHP_CODE = """<?php
namespace foo;
class Hello {
    public function __construct() { }
}
function hello() {
    echo "Hello World!";
}
interface Human {
    public function breath();
}
trait Foo { }
enum Color
{
    case Red;
    case Blue;
}"""
php_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PHP, chunk_size=50, chunk_overlap=0
)
php_docs = php_splitter.create_documents([PHP_CODE])
php_docs

```

```output
[Document(metadata={}, page_content=&#x27;<?php\nnamespace foo;&#x27;),
 Document(metadata={}, page_content=&#x27;class Hello {&#x27;),
 Document(metadata={}, page_content=&#x27;public function __construct() { }\n}&#x27;),
 Document(metadata={}, page_content=&#x27;function hello() {\n    echo "Hello World!";\n}&#x27;),
 Document(metadata={}, page_content=&#x27;interface Human {\n    public function breath();\n}&#x27;),
 Document(metadata={}, page_content=&#x27;trait Foo { }\nenum Color\n{\n    case Red;&#x27;),
 Document(metadata={}, page_content=&#x27;case Blue;\n}&#x27;)]

``` ## PowerShell[​](#powershell) Here&#x27;s an example using the PowerShell text splitter:

```python
POWERSHELL_CODE = """
$directoryPath = Get-Location

$items = Get-ChildItem -Path $directoryPath

$files = $items | Where-Object { -not $_.PSIsContainer }

$sortedFiles = $files | Sort-Object LastWriteTime

foreach ($file in $sortedFiles) {
    Write-Output ("Name: " + $file.Name + " | Last Write Time: " + $file.LastWriteTime)
}
"""
powershell_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.POWERSHELL, chunk_size=100, chunk_overlap=0
)
powershell_docs = powershell_splitter.create_documents([POWERSHELL_CODE])
powershell_docs

```

```output
[Document(metadata={}, page_content=&#x27;$directoryPath = Get-Location\n\n$items = Get-ChildItem -Path $directoryPath&#x27;),
 Document(metadata={}, page_content=&#x27;$files = $items | Where-Object { -not $_.PSIsContainer }&#x27;),
 Document(metadata={}, page_content=&#x27;$sortedFiles = $files | Sort-Object LastWriteTime&#x27;),
 Document(metadata={}, page_content=&#x27;foreach ($file in $sortedFiles) {&#x27;),
 Document(metadata={}, page_content=&#x27;Write-Output ("Name: " + $file.Name + " | Last Write Time: " + $file.LastWriteTime)\n}&#x27;)]

``` ## Visual Basic 6[​](#visual-basic-6)

```python
VISUALBASIC6_CODE = """Option Explicit

Public Sub HelloWorld()
    MsgBox "Hello, World!"
End Sub

Private Function Add(a As Integer, b As Integer) As Integer
    Add = a + b
End Function
"""
visualbasic6_splitter = RecursiveCharacterTextSplitter.from_language(
    Language.VISUALBASIC6,
    chunk_size=128,
    chunk_overlap=0,
)
visualbasic6_docs = visualbasic6_splitter.create_documents([VISUALBASIC6_CODE])
visualbasic6_docs

```

```output
[Document(metadata={}, page_content=&#x27;Option Explicit&#x27;),
 Document(metadata={}, page_content=&#x27;Public Sub HelloWorld()\n    MsgBox "Hello, World!"\nEnd Sub&#x27;),
 Document(metadata={}, page_content=&#x27;Private Function Add(a As Integer, b As Integer) As Integer\n    Add = a + b\nEnd Function&#x27;)]

```[Edit this page](https://github.com/langchain-ai/langchain/edit/master/docs/docs/how_to/code_splitter.ipynb)[Python](#python)
- [JS](#js)
- [TS](#ts)
- [Markdown](#markdown)
- [Latex](#latex)
- [HTML](#html)
- [Solidity](#solidity)
- [C#](#c)
- [Haskell](#haskell)
- [PHP](#php)
- [PowerShell](#powershell)
- [Visual Basic 6](#visual-basic-6)

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