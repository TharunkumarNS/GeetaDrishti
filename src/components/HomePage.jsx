import { BookOpen, Sparkles, Compass } from 'lucide-react'

export default function HomePage({ setView, language, setLanguage }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-4 shadow-sm">
        <Sparkles size={14} />
        {language === 'te' ? 'భగవద్గీత జ్ఞాన వేదిక' : 'Sanskrit Wisdom & AI Discovery'}
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
        GeetaDrishti <span className="text-saffron-600">(గీతాదృష్టి)</span>
      </h1>
      <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-10">
        {language === 'te' 
          ? 'భగవద్గీత శ్్లోకాలను చదవండి, సాంప్రదాయ వ్యాఖ్యానాలను అన్వేషించండి మరియు AI ద్వారా లోతైన భావాలను కనుగొనండి.'
          : 'Explore verses, dive into traditional commentaries by Shankaracharya and Ramanujacharya, and search philosophy using advanced AI.'}
      </p>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Card 1: Reader */}
        <button
          onClick={() => setView('reader')}
          className="group text-left rounded-2xl border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-1">
              {language === 'te' ? 'శ్లోక పఠనం' : 'Verse Reader'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'te' 
                ? 'అధ్యాయాలు మరియు శ్లోకాలను అనువదించబడిన భావాలతో చదవండి.'
                : 'Read chapters and verses verse-by-verse with traditional commentaries and script toggles.'}
            </p>
          </div>
          <span className="mt-6 text-xs font-bold text-saffron-600 flex items-center gap-1">
            {language === 'te' ? 'చదవడం ప్రారంభించండి →' : 'Start Reading →'}
          </span>
        </button>

        {/* Card 2: AI Search */}
        <button
          onClick={() => setView('search')}
          className="group text-left rounded-2xl border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-saffron-100 text-saffron-800 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Compass size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-1">
              {language === 'te' ? 'AI భావాల శోధన' : 'AI Semantic Search'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'te' 
                ? 'మీ ప్రశ్నలను టైప్ చేయండి మరియు సంబంధిత శ్లోక వ్యాఖ్యానాలను కనుగొనండి.'
                : 'Search through philosophical commentary vectors using natural language and concepts.'}
            </p>
          </div>
          <span className="mt-6 text-xs font-bold text-saffron-600 flex items-center gap-1">
            {language === 'te' ? 'అన్వేషించడం ప్రారంభించండి →' : 'Explore Search →'}
          </span>
        </button>
      </div>
    </div>
  )
}