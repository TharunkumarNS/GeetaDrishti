from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

def convert_sanskrit(text: str, target_lang: str = "en") -> str:
    """
    Transliterates Devanagari Sanskrit text on the fly using Indic-Transliteration.
    """
    if not text:
        return ""

    # Map target language codes to Indic-Transliteration scheme constants
    scheme_mapping = {
        "en": sanscript.IAST,      # Roman script with diacritics
        "te": sanscript.TELUGU,    # Telugu script
        "hi": sanscript.DEVANAGARI,# Hindi/Devanagari
        "ta": sanscript.TAMIL,     # Tamil script
        "kn": sanscript.KANNADA    # Kannada script
    }

    # Default to IAST if target language isn't recognized
    target_scheme = scheme_mapping.get(target_lang, sanscript.IAST)

    try:
        # Transliterate from Devanagari to the chosen target scheme
        converted = transliterate(text, sanscript.DEVANAGARI, target_scheme)
        return converted
    except Exception as e:
        return text