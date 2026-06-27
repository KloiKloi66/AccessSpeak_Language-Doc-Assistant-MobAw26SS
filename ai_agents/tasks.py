# tasks.py
from crewai import Task
from ai_agents.ScanningAgent import document_agent

scan_task = Task(
    description=(
        "Analyse the document at {image_path}.\n"
        "Use OCR tool to extract text and then analyse it. You MUST NOT invent information. Only use OCR output."
    ),
    expected_output=(
        "Return structured info: type, key data, summary"
    ),
    agent=document_agent,
)