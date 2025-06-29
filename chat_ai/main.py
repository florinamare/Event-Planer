from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
from pymongo import MongoClient
import traceback
import unicodedata
from datetime import datetime, timedelta

# Elimina diacriticile
def remove_diacritics(text):
    return ''.join(
        c for c in unicodedata.normalize('NFD', text)
        if unicodedata.category(c) != 'Mn'
    )

# Încarca modelul spaCy
nlp = spacy.load("ro_core_news_sm")

# Conectare MongoDB
client = MongoClient("mongodb+srv://mareflorinaveronica:Md6bLVD95NeXjj33@cluster0.epog9.mongodb.net/event-platform?retryWrites=true&w=majority")
db = client["event-platform"]
events_collection = db["events"]

# Initializare FastAPI
app = FastAPI()

# CORS pentru frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model Pydantic
class SuggestRequest(BaseModel):
    text: str

@app.post("/suggest")
async def suggest(payload: SuggestRequest):
    try:
        original_text = payload.text
        cleaned_text = remove_diacritics(original_text.lower())
        print(f">>> întrebare curățată: {cleaned_text}")  # DEBUG

        doc = nlp(cleaned_text)
        keywords = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"]]

        all_events = list(events_collection.find({}))
        results = []

        #  Detectare intervale de timp
        today = datetime.today().date()
        start_date = end_date = None

        if "astazi" in cleaned_text:
            start_date = end_date = today
        elif "maine" in cleaned_text:
            start_date = end_date = today + timedelta(days=1)
        elif "saptamana viitoare" in cleaned_text:
            start_date = today + timedelta(days=(7 - today.weekday()))
            end_date = start_date + timedelta(days=6)
        elif "luna viitoare" in cleaned_text:
            first_day_next_month = (today.replace(day=1) + timedelta(days=32)).replace(day=1)
            last_day_next_month = (first_day_next_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            start_date = first_day_next_month
            end_date = last_day_next_month
        else:
            for token in doc:
                if token.like_num:
                    possible_day = int(token.text)
                    next_token = token.nbor() if token.i + 1 < len(doc) else None
                    if next_token and next_token.pos_ == "NOUN":
                        try:
                            months = {
                                "ianuarie": 1, "februarie": 2, "martie": 3,
                                "aprilie": 4, "mai": 5, "iunie": 6,
                                "iulie": 7, "august": 8, "septembrie": 9,
                                "octombrie": 10, "noiembrie": 11, "decembrie": 12
                            }
                            luna = remove_diacritics(next_token.text.lower())
                            if luna in months:
                                data_exacta = datetime(datetime.now().year, months[luna], possible_day).date()
                                start_date = end_date = data_exacta
                        except:
                            pass

        # Căutare în baza de date
        for event in all_events:
            event_dt = event.get("date")
            if not isinstance(event_dt, datetime):
                event_dt = datetime.fromisoformat(str(event_dt))
            event_date = event_dt.date()

            if start_date and end_date:
                if not (start_date <= event_date <= end_date):
                    continue

            text_fields = [
                event.get("title", ""),
                event.get("description", ""),
                event.get("location", {}).get("address", ""),
                event.get("type", ""),
            ]
            normalized_text = remove_diacritics(" ".join(text_fields).lower())

            if any(word in normalized_text for word in keywords) or not keywords:
                results.append({
                    "title": event.get("title"),
                    "date": str(event_dt),
                    "location": event.get("location", {}).get("address", "Necunoscut"),
                    "type": event.get("type", ""),
                    "_id": str(event.get("_id")),
                })

        if not results:
            return {
                "suggestions": [],
                "message": "Nu s-au găsit rezultate pentru întrebarea ta."
            }

        return {
            "suggestions": results[:5],
            "message": None
        }

    except Exception as e:
        print(" Eroare în /suggest:")
        traceback.print_exc()
        return {"error": str(e)}
