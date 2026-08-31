from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from sentence_transformers import SentenceTransformer

import models, schemas
from database import get_db
from transliterate import convert_sanskrit

app = FastAPI(title="GeetaDrishti API")

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
# --------------------------

# Load the multilingual embedding model globally so it stays loaded in memory
print("Loading semantic search embedding model...")
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

@app.get("/")
def root():
    return {"message": "GeetaDrishti API is running!"}

@app.get("/verses/{verse_id}", response_model=schemas.VerseResponse)
def get_verse(
    verse_id: str, 
    lang: Optional[str] = Query("en", description="Target language script (e.g., en, te, hi)"),
    db: Session = Depends(get_db)
):
    verse = db.query(models.Verse).filter(models.Verse.id == verse_id).first()
    if not verse:
        raise HTTPException(status_code=404, detail="Verse not found")

    response_data = schemas.VerseResponse.model_validate(verse).model_dump()
    response_data["transliteration"] = convert_sanskrit(verse.sanskrit, target_lang=lang)

    return response_data

# --- NEW SEMANTIC SEARCH ENDPOINT ---
@app.get("/search")
def semantic_search(
    q: str = Query(..., description="Search query text"),
    language: str = Query("en", description="Language code: en or te"),
    limit: int = Query(5, description="Number of results"),
    db: Session = Depends(get_db)
):
    if not q.strip():
        return []

    # 1. Convert text query into a vector embedding
    query_vector = model.encode(q).tolist()

    # 2. Query PostgreSQL using pgvector cosine distance operator (<=>)
    results = db.query(models.Commentary)\
        .filter(models.Commentary.language == language)\
        .order_by(models.Commentary.embedding.cosine_distance(query_vector))\
        .limit(limit)\
        .all()

    # 3. Format response matching your schema structure
    response = []
    for com in results:
        response.append({
            "id": str(com.id),
            "author_name": com.author_name,
            "language": com.language,
            "text": com.text,
            "verse_id": str(com.verse_id) if com.verse_id else None,
        })

    return response