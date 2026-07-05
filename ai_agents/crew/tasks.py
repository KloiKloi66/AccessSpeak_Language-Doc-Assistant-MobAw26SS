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
        "You are NOT a translator. Rewrite the following German text in "
        "'Einfache Sprache' (German to simple German). "
        "Use short sentences (max. 12 words), common words, active voice. "
        "Explain difficult terms briefly in parentheses. "
        "Keep all information complete and correct. "
        "IMPORTANT: Your answer starts directly with the first word of the "
        "rewritten text. No introduction like 'Hier ist...', no explanations, "
        "no quotes, no formatting.\n\n"
        "Text:\n{text}"
    ),
    expected_output=(
        "Only the rewritten German text in Einfache Sprache, starting directly "
        "with the first word of the text. No extra words, no explanations, no quotes."
    ),
    agent=simplifier_agent,
)
