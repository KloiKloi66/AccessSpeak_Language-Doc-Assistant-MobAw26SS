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
    goal="Analyse scanned documents",
    backstory=(
        "Expert in invoices, letters and forms. "
        "Extracts structured data."
    ),
    llm=llama,
    tools=[ocr_tool],
    verbose=True,
)