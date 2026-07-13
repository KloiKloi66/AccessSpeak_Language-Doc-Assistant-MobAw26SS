from faster_whisper import WhisperModel

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

def transcribe_audio(path: str):

    segments, _ = model.transcribe(
        path,
        language="de"
    )

    text = ""

    for segment in segments:
        text += segment.text

    return text