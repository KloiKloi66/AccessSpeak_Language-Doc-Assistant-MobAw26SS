from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import documents

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
          "type": entry["type"],
          "date": entry["date"],
          "originalText": entry.get("originalText", "")
      })

  return entries


@app.post("/entries")
def create_entry(entry: dict):
  last = documents.find_one(sort=[("id", -1)])
  next_id = 1
  
  if last:
      next_id = last["id"] + 1
      
  document = {
      "id": next_id,
      "title": entry["title"],
      "difficulty": entry["difficulty"],
      "type": entry["type"],
      "date": entry["date"],
      "originalText": entry.get("originalText", "")
  }
  documents.insert_one(document)

  document.pop("_id", None)
  return document


@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: int):
  documents.delete_one({"id": entry_id})
  return {"success": True}