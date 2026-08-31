from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import datetime

class CommentaryResponse(BaseModel):
    id: UUID4
    author_name: str
    language: str
    text: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class VerseResponse(BaseModel):
    id: str
    chapter: int
    verse_number: int
    sanskrit: str
    transliteration: Optional[str] = None
    commentaries: List[CommentaryResponse] = []

    class Config:
        from_attributes = True