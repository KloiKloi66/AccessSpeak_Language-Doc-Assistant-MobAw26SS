from crewai.tools import BaseTool
from PIL import Image
import pytesseract

pytesseract.pytesseract.tesseract_cmd = (
    r"DATENPFAD VON TESSERACT" #SPEICHERORT VON TESSERACT EINSETZEN (DATENPFAD)
)

class OCRTool(BaseTool):
    name: str = "OCR Tool"
    description: str = "Extracts text from images"

    def _run(self, image_path: str):
        image = Image.open(image_path)

        text = pytesseract.image_to_string(
            image,
            lang="deu"
        )

        return text