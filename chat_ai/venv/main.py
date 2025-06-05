from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
from pymongo import MongoClient
import traceback


# Încarcă modelul de limbaj
nlp = spacy.load("ro_core_news_sm")

# Conectare la MongoDB

client = MongoClient("mongodb+srv://mareflorinaveronica:Md6bLVD95NeXjj33@cluster0.epog9.mongodb.net/event-platform?retryWrites=true&w=majority")
db = client["event-platform"]
events_collection = db["events"]


app = FastAPI()

# CORS pentru frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Model Pydantic pentru request
class SuggestRequest(BaseModel):
    text: str

@app.post("/suggest")
async def suggest(payload: SuggestRequest):
    try:
        text = payload.text
        doc = nlp(text)
        keywords = [token.text.lower() for token in doc if token.pos_ in ["NOUN", "PROPN"]]

        results = []
        for word in keywords:
            matches = events_collection.find({
                "$or": [
                    {"title": {"$regex": word, "$options": "i"}},
                    {"description": {"$regex": word, "$options": "i"}},
                    {"location.address": {"$regex": word, "$options": "i"}},
                    {"type": {"$regex": word, "$options": "i"}},
                ]
            })

            for event in matches:
                results.append({
                    "title": event.get("title"),
                    "date": str(event.get("date")),
                    "location": event.get("location", {}).get("address", "Necunoscut"),
                    "type": event.get("type", ""),
                    "_id": str(event.get("_id")),
                })

        return {"suggestions": results[:5]}
    
    except Exception as e:
        print("❌ Eroare în /suggest:")
        traceback.print_exc()
        return {"error": str(e)}
