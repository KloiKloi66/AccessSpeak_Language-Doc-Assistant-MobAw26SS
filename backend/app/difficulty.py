import re

LIX_EASY_MAX = 30      # below this: "leicht"
LIX_MEDIUM_MAX = 50    # below this: "mittel", above: "schwierig"

MIN_WORDS = 10

DEFAULT_DIFFICULTY = "mittel"

_SENTENCE_SPLIT = re.compile(r"[.!?:]+")
_NON_LETTER = re.compile(r"[^A-Za-zÄÖÜäöüß]")


def lix_score(text: str) -> float | None:
    raw_words = text.split()
    words = [w for w in (_NON_LETTER.sub("", w) for w in raw_words) if w]

    if len(words) < MIN_WORDS:
        return None

    sentences = [s for s in _SENTENCE_SPLIT.split(text) if s.strip()]
    sentence_count = max(len(sentences), 1)

    long_words = [w for w in words if len(w) > 6]

    avg_sentence_length = len(words) / sentence_count
    long_word_share = len(long_words) * 100 / len(words)

    return avg_sentence_length + long_word_share


def difficulty_from_text(text: str) -> str:
    """
    Maps a text to "leicht" / "mittel" / "schwierig" via its LIX score.
    Falls back to "mittel" for empty or very short texts.
    """
    if not text or not text.strip():
        return DEFAULT_DIFFICULTY

    score = lix_score(text)
    if score is None:
        return DEFAULT_DIFFICULTY

    if score < LIX_EASY_MAX:
        return "leicht"
    if score < LIX_MEDIUM_MAX:
        return "mittel"
    return "schwierig"
