import uuid
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(50), nullable=False)
    role = Column(String(20), nullable=False, default="user")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    commentaries = relationship("Commentary", back_populates="user")

class Verse(Base):
    __tablename__ = "verses"
    
    id = Column(String(10), primary_key=True)
    chapter = Column(Integer, nullable=False)
    verse_number = Column(Integer, nullable=False)
    sanskrit = Column(Text, nullable=False)

    commentaries = relationship("Commentary", back_populates="verse")

class Commentary(Base):
    __tablename__ = "commentaries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    verse_id = Column(String(10), ForeignKey("verses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    author_name = Column(String(50), nullable=False)
    language = Column(String(5), nullable=False)
    text = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="pending")
    embedding = Column(Vector(384))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    verse = relationship("Verse", back_populates="commentaries")
    user = relationship("User", back_populates="commentaries")