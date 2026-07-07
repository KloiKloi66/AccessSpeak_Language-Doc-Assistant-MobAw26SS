#tools eigene Funktionen die Agenten aufrufen dürfen


from crewai.tools import BaseTool
from PIL import Image
import pytesseract

pytesseract.pytesseract.tesseract_cmd = (
    r">>>Datenpfad von Tesseract Anwendung<<<" #SPEICHERORT VON tesseract.exe EINSETZEN (DATENPFAD)
)

class OCRTool(BaseTool):
    name: str = "OCR Tool"
    description: str = "Extracts text from images"

    def _run(self, image_path: str):
        image = Image.open(image_path)

        text = pytesseract.image_to_string(
            image,
            lang="deu+eng"
        )

        return text
