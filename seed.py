import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Verse, Commentary

DATABASE_URL = "postgresql://postgres:postgres@localhost/geeta_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

# Wipe bad data and recreate fresh tables
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

def seed_database():
    with open("src/data/gita.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    verse_count = 0

    # 1. Loop through the exact "chapters" array
    for chapter in data.get("chapters", []):
        chapter_num = int(chapter.get("number", 0))

        # 2. Loop through the exact "verses" array inside each chapter
        for item in chapter.get("verses", []):
            verse_id = item.get("id")
            verse_num = int(verse_id.split(".")[1]) if "." in verse_id else 0

            # Insert Sanskrit Verse
            verse = Verse(
                id=verse_id,
                chapter=chapter_num,
                verse_number=verse_num,
                sanskrit=item.get("sanskrit", "")
            )
            session.add(verse)
            verse_count += 1

            # Insert Base Translations
            if item.get("english"):
                session.add(Commentary(
                    verse_id=verse_id, author_name="System", language="en",
                    text=item["english"], status="approved"
                ))
            if item.get("telugu"):
                session.add(Commentary(
                    verse_id=verse_id, author_name="System", language="te",
                    text=item["telugu"], status="approved"
                ))

            # Insert External Commentaries
            commentaries_data = item.get("commentaries", {})
            for author_name, translations in commentaries_data.items():
                for lang, text in translations.items():
                    if text and text.strip() and text != "Commentary unavailable":
                        session.add(Commentary(
                            verse_id=verse_id, 
                            author_name=author_name.capitalize(),
                            language=lang, 
                            text=text, 
                            status="approved"
                        ))

    session.commit()
    print(f"Database successfully seeded with {verse_count} verses using strict schema parsing!")

if __name__ == "__main__":
    seed_database()