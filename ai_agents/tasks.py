# tasks.py
from crewai import Task
from ai_agents.ScanningAgent import document_agent

scan_task = Task(
    description=(
        "Analyse the document at {image_path}.\n"
        "Use OCR tool to extract text and then analyse it. ONLY use the text returned by the OCR Tool. NEVER invent names, dates, addresses or amounts.If information is missing, write 'Not found'. If OCR is unreadable, say so."
    ),
    expected_output=(
        "Return structured info: type of text, key data, summary"
    ),
    agent=document_agent,
)