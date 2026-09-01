import { useState } from 'react'
import { Search, Sparkles, MessageCircleMore, WifiOff } from 'lucide-react'
import { chapters, searchVerses } from '../data/gitaData'

export default function SearchPage({ language, setLanguage, isOnline }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)

    // 1. If offline, bypass backend and use local keyword search fallback
    if (!isOnline) {
      runLocalKeywordSearch(query)
      setLoading(false)
      return
    }

    // 2. Try fetching from FastAPI semantic search backend with a tight 1.2s timeout fallback
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200)

      const response = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}&language=${language}&limit=5`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        setResults(data)
      } else {
        throw new Error("Backend search error")
      }
    } catch (err) {
      console.warn("Backend search unreachable or offline. Falling back to local keyword search...", err)
      runLocalKeywordSearch(query)
    } finally {
      setLoading(false)
    }
  }

  // Fallback local keyword matching against cached local dataset
  const runLocalKeywordSearch = (searchQuery) => {
    // If using the gitaData keyword helper
    const rawMatches = searchVerses(searchQuery)
    
    // Map matches into a format similar to commentary search results
    const formatted = rawMatches.map((verse) => ({
      author_name: language === 'te' ? 'స్థానిక కీవర్డ్ శోధన' : 'Local Keyword Match',
      language: language,
      text: `Chapter ${verse.chapterNumber}, Verse ${verse.number}: ${verse[language === 'te' ? 'telugu' : 'english'] || verse.sanskrit}`
    }))

    setResults(formatted)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Offline Notice Banner inside Search */}
      {!isOnline && (
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-2.5 text-xs text-amber-900 shadow-sm">
          <WifiOff size={16} className="text-amber-700 shrink-0" />
          <span>
            {language === 'te'
              ? 'ఆఫ్‌లైన్ మోడ్: AI సెమాంటిక్ శోధన అందుబాటులో లేదు — స్థానిక కీవర్డ్ శోధన ఉపయోగించబడుతోంది.'
              : 'Offline Mode: AI semantic search is unavailable — using local keyword matching fallback.'}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3 shadow-sm">
          <Sparkles size={14} />
          {language === 'te' ? 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ శోధన' : 'AI Semantic Search'}
        </div>
        <h1 className="text-2xl font-bold text-stone-800 font-serif">
          {language === 'te' ? 'భగవద్గీత భావాలను అన్వేషించండి' : 'Explore Wisdom Through Concepts'}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          {language === 'te' ? 'ప్రశ్నలను టైప్ చేయండి, సంబంధిత వ్యాఖ్యానాలను కనుగొనండి' : 'Search by concepts, questions, or keywords in natural language.'}
        </p>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 text-stone-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'te' ? 'ఉదాహరణకు: మనసును ఎలా నియంత్రించాలి?' : 'e.g., How do I control a restless mind?'}
            className="w-full rounded-xl border border-amber-200 bg-white pl-10 pr-4 py-3 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-700 transition disabled:opacity-50"
        >
          {loading ? (language === 'te' ? 'వెతుకుతోంది...' : 'Searching...') : (language === 'te' ? 'వెతుకు' : 'Search')}
        </button>
      </form>

      {/* Results List */}
      <div className="space-y-4">
        {results.length === 0 && !loading && (
          <div className="text-center py-12 text-stone-400 text-sm">
            {language === 'te' ? 'ప్రారంభించడానికి శోధించండి...' : 'Type a query above to start exploring commentaries.'}
          </div>
        )}

        {results.map((item, index) => (
          <div key={index} className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-amber-800 shadow-sm border border-amber-100">
                <MessageCircleMore size={13} />
                {item.author_name}
              </span>
              <span className="text-xs text-stone-400 uppercase font-mono">
                {item.language}
              </span>
            </div>
            <p className="text-sm leading-7 text-stone-700">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}