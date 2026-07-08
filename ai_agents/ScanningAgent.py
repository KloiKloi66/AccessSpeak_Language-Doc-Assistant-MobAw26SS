# agents.py
from crewai import Agent, LLM
from ai_agents.tools import OCRTool

llama = LLM(
    model="ollama/llama3.2",
    base_url="http://localhost:11434",
)

ocr_tool = OCRTool()

document_agent = Agent(
    role="Document Analyst",
    goal="Analyse scanned documents and texts",
    backstory=(
        "Good at reading and extracting information, wont give his own opinion or spin into it"
        "Extracts text and data and is able to summarize it."
    ),
    llm=llama,
    tools=[ocr_tool],
    verbose=True,
)