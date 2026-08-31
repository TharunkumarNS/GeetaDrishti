from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
from database import SessionLocal
import models

print("Loading multilingual embedding model...")
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

def generate_commentary_embeddings():
    db: Session = SessionLocal()
    try:
        # Query all commentaries from the database
        commentaries = db.query(models.Commentary).all()
        print(f"Found {len(commentaries)} commentaries to process.")

        for com in commentaries:
            if not com.text:
                continue
            
            # Generate vector embedding for the commentary text
            vector = model.encode(com.text).tolist()

            # Store the vector in the commentary's embedding column
            com.embedding = vector
            print(f"Embedded commentary {com.id} ({com.author_name} - {com.language})")

        db.commit()
        print("Successfully populated all commentary embeddings!")
    except Exception as e:
        db.rollback()
        print(f"Error generating commentary embeddings: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    generate_commentary_embeddings()