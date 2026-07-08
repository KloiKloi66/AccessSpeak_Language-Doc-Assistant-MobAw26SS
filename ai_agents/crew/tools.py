from crewai.tools import BaseTool
from PIL import Image
import pytesseract
import os

class OCRTool(BaseTool):
    name: str = "OCR Tool"
    description: str = "Extracts text from images using Tesseract OCR"

    def _run(self, image_path: str):

        try:
            print("OCR START")
            print("IMAGE PATH:", image_path)

            if not os.path.exists(image_path):
                error = f"Image not found: {image_path}"
                print(error)
                return error

            image = Image.open(image_path)

            text = pytesseract.image_to_string(
                image,
                lang="deu+eng"
            )

            print("OCR RESULT:")
            print(text)

            if not text.strip():
                return "No text detected in image"

            return text

        except Exception as e:
            print("OCR ERROR:", str(e))
            return f"OCR failed: {str(e)}"