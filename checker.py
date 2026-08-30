import json
import os

output_path = os.path.join('src', 'data', 'gita.json')

def validate_v1_database():
    if not os.path.exists(output_path):
        print(f"Error: Could not find {output_path}")
        return

    with open(output_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_verses = 0
    empty_fields = 0
    missing_details = []

    print("Scanning database for V1 completion (Ignoring Prabhupada)...\n")

    for chapter in data.get('chapters', []):
        for verse in chapter.get('verses', []):
            total_verses += 1
            vid = verse.get('id', 'Unknown ID')
            
            for key in ['sanskrit', 'english', 'telugu']:
                val = verse.get(key, "")
                if not val or str(val).strip() == "":
                    missing_details.append(f"⚠️ Verse {vid} is missing core field: {key.upper()}")
                    empty_fields += 1

            commentaries = verse.get('commentaries', {})
            for author in ['shankara', 'ramanuja']:
                author_data = commentaries.get(author, {})
                for lang in ['en', 'te']:
                    text = author_data.get(lang, "")
                    # STRICT MATCH: Only flag if the text is exactly the error string
                    if not text or text.strip() == "" or text.strip() == "Commentary unavailable":
                        missing_details.append(f"⚠️ Verse {vid} is missing {author.upper()} ({lang.upper()})")
                        empty_fields += 1

    if missing_details:
        for detail in missing_details:
            print(detail)
        print(f"\n❌ VALIDATION FAILED: Found {empty_fields} empty fields across {total_verses} verses.")
    else:
        print(f"✅ VALIDATION PASSED: All {total_verses}/700 verses have perfect Sanskrit, English, Telugu, Shankara, and Ramanuja data!")

if __name__ == "__main__":
    validate_v1_database()
    