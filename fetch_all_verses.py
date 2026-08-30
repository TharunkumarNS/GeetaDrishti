import json
import os
import time
import requests
from deep_translator import GoogleTranslator

output_path = os.path.join('src', 'data', 'gita.json')
translator = GoogleTranslator(source='en', target='te')

expected_counts = {
    1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47, 
    7: 30, 8: 28, 9: 34, 10: 42, 11: 55, 12: 20, 
    13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
}

def translate_safe(text):
    if not text or text == "Commentary unavailable": 
        return ""
    try:
        return translator.translate(text)
    except Exception:
        return text

def build_and_validate():
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 1. Load existing data (The Auto-Resume Feature)
    master_data = {
        "edition": {"en": "Classical Sanskrit text · Bhagavad Gita", "te": "సాంప్రదాయ సంస్కృత పాఠం · భగవద్గీత"}, 
        "chapters": []
    }
    
    if os.path.exists(output_path):
        try:
            with open(output_path, 'r', encoding='utf-8') as f:
                master_data = json.load(f)
        except json.JSONDecodeError:
            pass # If the file was corrupted during a crash, it starts fresh

    # Map which chapters are already 100% complete
    completed_chapters = {}
    for ch in master_data.get("chapters", []):
        if len(ch.get("verses", [])) == expected_counts.get(ch.get("number")):
            completed_chapters[ch["number"]] = ch

    # 2. Fetch missing chapters
    new_chapters_list = []
    print("Starting smart extraction pipeline...")
    
    for chapter_num, total_verses in expected_counts.items():
        if chapter_num in completed_chapters:
            print(f"✅ Chapter {chapter_num} is already complete. Skipping...")
            new_chapters_list.append(completed_chapters[chapter_num])
            continue
        
        print(f"⏳ Fetching missing Chapter {chapter_num}...")
        chapter_node = {
            "number": chapter_num,
            "title": {"en": f"Chapter {chapter_num}", "te": translate_safe(f"Chapter {chapter_num}")},
            "verses": []
        }
        
        for verse_num in range(1, total_verses + 1):
            url = f"https://vedicscriptures.github.io/slok/{chapter_num}/{verse_num}"
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    
                    sanskrit_text = data.get('slok', '')
                    english_translation = data.get('siva', {}).get('et', '')
                    shankara_en = data.get('san', {}).get('et', 'Commentary unavailable')
                    ramanuja_en = data.get('raman', {}).get('et', 'Commentary unavailable')
                    prabhupada_en = data.get('prabhupad', {}).get('et', 'Commentary unavailable')
                    
                    verse_node = {
                        "id": f"{chapter_num}.{verse_num}",
                        "number": f"{chapter_num}.{verse_num}",
                        "sanskrit": sanskrit_text,
                        "english": english_translation,
                        "telugu": translate_safe(english_translation),
                        "keywords": [],
                        "commentaries": {
                            "shankara": {"en": shankara_en, "te": translate_safe(shankara_en)},
                            "ramanuja": {"en": ramanuja_en, "te": translate_safe(ramanuja_en)},
                            "prabhupada": {"en": prabhupada_en, "te": translate_safe(prabhupada_en)}
                        }
                    }
                    chapter_node["verses"].append(verse_node)
                    print(f"  -> Saved {chapter_num}.{verse_num}")
                else:
                    print(f"  -> Failed {chapter_num}.{verse_num} (Status: {response.status_code})")
            except Exception as e:
                print(f"  -> Error fetching {chapter_num}.{verse_num}: {e}")
                
            time.sleep(1.5) # Prevents IP bans from Google Translate
        
        new_chapters_list.append(chapter_node)
        
        # Save progress instantly to disk
        master_data["chapters"] = new_chapters_list
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(master_data, f, ensure_ascii=False, indent=2)

    # 3. Final Validation Check
    print("\n--- Final Validation ---")
    total = sum(len(ch.get("verses", [])) for ch in master_data.get("chapters", []))
    if total == 700:
        print("✅ SUCCESS: All 18 chapters and 700 verses are perfectly intact!")
    else:
        print(f"❌ WARNING: Database contains {total}/700 verses. Run the script again to patch missing data.")

if __name__ == "__main__":
    build_and_validate()