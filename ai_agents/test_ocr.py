from PIL import Image
import pytesseract

pytesseract.pytesseract.tesseract_cmd = (
    r"*YOUR TESSERACT SAVE LOCATION*"
)

image = Image.open("test.png")

text = pytesseract.image_to_string(
    image,
    lang="deu"
)

print(text)