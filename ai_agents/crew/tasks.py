# tasks hier definierst du die Aufgaben der Agenten
from crewai import Task
from .agents import translator_agent, simplifier_agent

translate_task = Task(
    description=(
        "Translate the following text from {source_lang} to {target_lang}.\n\n"
        "Text:\n{text}"
    ),
    expected_output=(
        "Only the translated text in {target_lang}. "
        "No extra words, no explanations, no quotes."
    ),
    agent=translator_agent,
)

simplify_task = Task(
    description=(
        "Rewrite the following German text in 'Einfache Sprache'. "
        "Use short sentences (max. 12 words), common words, active voice. "
        "Explain difficult terms briefly in parentheses. "
        "Keep all information complete and correct.\n\n"
        "Text:\n{text}"
    ),
    expected_output=(
        "Only the rewritten German text in Einfache Sprache. "
        "No extra words, no explanations, no quotes."
    ),
    agent=simplifier_agent,
)
