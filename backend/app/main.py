from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import documents
from app.difficulty import difficulty_from_text

DIFFICULTY_LEVELS = {"leicht", "mittel", "schwierig"}

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.get("/entries")
def get_entries():
  entries = []

  for entry in documents.find():
      entries.append({
          "id": entry["id"],
          "title": entry["title"],
          "difficulty": entry["difficulty"],
          "difficultySource": entry.get("difficultySource", "manual"),
          "type": entry["type"],
          "date": entry["date"],
          "originalText": entry.get("originalText", ""),
          "simplifiedText": entry.get("simplifiedText", ""),
          "translations": entry.get("translations", {})
      })

  return entries


@app.post("/entries")
def create_entry(entry: dict):
  last = documents.find_one(sort=[("id", -1)])
  next_id = 1
  
  if last:
      next_id = last["id"] + 1
      
  manual_difficulty = entry.get("difficulty")
  if manual_difficulty in DIFFICULTY_LEVELS:
      difficulty = manual_difficulty
      difficulty_source = "manual"
  else:
      difficulty = difficulty_from_text(entry.get("originalText", ""))
      difficulty_source = "auto"

  document = {
      "id": next_id,
      "title": entry["title"],
      "difficulty": difficulty,
      "difficultySource": difficulty_source,
      "type": entry["type"],
      "date": entry["date"],
      "originalText": entry.get("originalText", ""),
      "simplifiedText": "",
      "translations": {}
  }
  documents.insert_one(document)

  document.pop("_id", None)
  return document


@app.patch("/entries/{entry_id}")
def update_entry(entry_id: int, update: dict):
  update_fields = {}

  # Manual difficulty override — always stored as "manual" so the
  # automatic (LIX) rating never touches it again
  if "difficulty" in update:
      if update["difficulty"] not in DIFFICULTY_LEVELS:
          raise HTTPException(status_code=400, detail="Invalid difficulty")
      update_fields["difficulty"] = update["difficulty"]
      update_fields["difficultySource"] = "manual"

  # Cache the simplified version (Einfache Sprache)
  if "simplifiedText" in update:
      update_fields["simplifiedText"] = update["simplifiedText"]

  # Cache translations per language without overwriting other languages,
  # e.g. {"translations": {"Englisch": "..."}} only touches translations.Englisch
  for lang, text in (update.get("translations") or {}).items():
      update_fields[f"translations.{lang}"] = text

  if not update_fields:
      raise HTTPException(status_code=400, detail="No cacheable fields in request")

  result = documents.update_one({"id": entry_id}, {"$set": update_fields})

  if result.matched_count == 0:
      raise HTTPException(status_code=404, detail="Entry not found")

  return {"success": True}


@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: int):
  documents.delete_one({"id": entry_id})
  return {"success": True}