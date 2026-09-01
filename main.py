from typing import Optional

from database import get_db
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import models
import schemas
from sqlalchemy.orm import Session
from transliterate import convert_sanskrit

app = FastAPI(title="GeetaDrishti API")

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------

# --- LAZY LOADED EMBEDDING MODEL ---
model = None

def get_embedding_model():
    global model
    if model is None:
        print("Lazy-loading sentence_transformers and embedding model (first search only)...")
        # Heavy import happens ONLY inside this function on demand
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    return model
# --------------------------

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

# --- SEMANTIC SEARCH ENDPOINT ---
@app.get("/search")
def semantic_search(
    q: str = Query(..., description="Search query text"),
    language: str = Query("en", description="Language code: en or te"),
    limit: int = Query(5, description="Number of results"),
    db: Session = Depends(get_db)
):
    if not q.strip():
        return []

    # 1. Lazy load model and library on demand
    embed_model = get_embedding_model()

    # 2. Convert text query into a vector embedding
    query_vector = embed_model.encode(q).tolist()

    # 3. Query PostgreSQL using pgvector cosine distance operator (<=>)
    results = db.query(models.Commentary)\
        .filter(models.Commentary.language == language)\
        .order_by(models.Commentary.embedding.cosine_distance(query_vector))\
        .limit(limit)\
        .all()

    # 4. Format response matching your schema structure
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
