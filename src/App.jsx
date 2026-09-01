import { BookOpenCheck, SearchX, Sparkles, Home, BookOpen, Search, Globe } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ChapterSelector from './components/ChapterSelector'
import Navbar from './components/Navbar'
import NavigationDrawer from './components/NavigationDrawer'
import NotesDrawer from './components/NotesDrawer'
import VerseCard from './components/VerseCard'
import SearchPage from './components/SearchPage'
import { chapters, edition, searchVerses } from './data/gitaData'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'reader' | 'search'
  const [language, setLanguage] = useLocalStorage('geeta-drishti:language', 'en')
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [selectedVerseId, setSelectedVerseId] = useState('1.1')
  const [query, setQuery] = useState('')
  const [bookmarks, setBookmarks] = useLocalStorage('geeta-drishti:bookmarks', [])
  const [notes, setNotes] = useLocalStorage('geeta-drishti:notes', [])
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // --- Network & Offline State ---
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineBannerDismissed, setOfflineBannerDismissed] = useState(false)
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState(false)

  // --- Live Backend State ---
  const [activeVerse, setActiveVerse] = useState(null)
  const [loading, setLoading] = useState(true)

  const safeLanguage = language === 'te' ? 'te' : 'en'
  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : []
  const safeNotes = Array.isArray(notes) ? notes : []
  const results = useMemo(() => searchVerses(query), [query])

  // Track online/offline status dynamically without lag
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setOfflineBannerDismissed(false)
    }
    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // --- Fetch verse data with instant offline/failover support ---
  useEffect(() => {
    async function fetchVerse() {
      if (view !== 'reader') return
      setLoading(true)

      // 1. If explicitly offline, skip network request entirely and load local
      if (!isOnline) {
        loadVerseLocally()
        return
      }

      // 2. Try fetching from FastAPI backend with a tight 1.2s timeout fallback
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 1200)

        const response = await fetch(`http://localhost:8000/verses/${selectedVerseId}?lang=${safeLanguage}`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          setActiveVerse(data)
          setIsUsingLocalFallback(false)
        } else {
          throw new Error("Backend response error")
        }
      } catch (error) {
        console.warn("Backend unreachable or offline. Falling back to local dataset...", error)
        setIsUsingLocalFallback(true)
        loadVerseLocally()
      } finally {
        setLoading(false)
      }
    }

    function loadVerseLocally() {
      const chapterNum = parseInt(selectedVerseId.split('.')[0])
      const foundChapter = chapters.find((c) => c.number === chapterNum)
      const foundVerse = foundChapter?.verses.find((v) => v.id === selectedVerseId)

      if (foundVerse) {
        setActiveVerse({
          id: foundVerse.id,
          chapterNumber: chapterNum,
          number: foundVerse.number,
          sanskrit: foundVerse.sanskrit,
          keywords: foundVerse.keywords || [],
          commentaries: foundVerse.commentaries || {}
        })
      }
      setLoading(false)
    }

    fetchVerse()
  }, [selectedVerseId, safeLanguage, view, isOnline])

  useEffect(() => {
    document.documentElement.lang = safeLanguage === 'te' ? 'te' : 'en'
  }, [safeLanguage])

  const selectChapter = (chapterNumber) => {
    const chapter = chapters.find((item) => item.number === chapterNumber)
    if (!chapter) return
    setSelectedChapter(chapterNumber)
    setSelectedVerseId(chapter.verses[0].id)
  }

  const selectVerse = (verseId) => {
    const chapterNum = parseInt(verseId.split('.')[0])
    setSelectedChapter(chapterNum)
    setSelectedVerseId(verseId)
    setQuery('')
    setView('reader')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleBookmark = (verseId) => {
    setBookmarks((saved) => {
      const current = Array.isArray(saved) ? saved : []
      return current.includes(verseId) ? current.filter((id) => id !== verseId) : [...current, verseId]
    })
  }

  const removeBookmark = (verseId) => setBookmarks((saved) => (Array.isArray(saved) ? saved.filter((id) => id !== verseId) : []))

  const addNote = (note) => setNotes((saved) => [...(Array.isArray(saved) ? saved : []), note])

  const updateNote = (noteId, patch) => {
    setNotes((saved) => (Array.isArray(saved) ? saved : []).map((note) => (
      note.id === noteId ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note
    )))
  }

  const deleteNote = (noteId) => setNotes((saved) => (Array.isArray(saved) ? saved : []).filter((note) => note.id !== noteId))

  const chapter = chapters.find((item) => item.number === selectedChapter)
  const ui = safeLanguage === 'te'
    ? { discover: 'గీతా పఠనం', title: 'శ్లోకం చదవండి, ఆలోచించండి, మీది చేసుకోండి.', sub: 'అన్ని పఠనాలు, గమనికలు, బుక్‌మార్క్‌లు ఈ పరికరంలోనే ఉంటాయి.', result: 'శోధన ఫలితాలు', noResult: 'సరిపోలే శ్లోకాలు లేవు.', current: 'ప్రస్తుత అధ్యాయం' }
    : { discover: 'Read the Gita', title: 'Read a verse, reflect, and make it yours.', sub: 'Every reading, note, and bookmark stays on this device.', result: 'Search results', noResult: 'No matching verses found.', current: 'Current chapter' }

  const currentVerseIndex = chapter?.verses.findIndex((v) => v.id === selectedVerseId) ?? 0
  const hasPreviousVerse = currentVerseIndex > 0
  const hasNextVerse = chapter ? currentVerseIndex < chapter.verses.length - 1 : false

  const goToPreviousVerse = () => {
    if (hasPreviousVerse) setSelectedVerseId(chapter.verses[currentVerseIndex - 1].id)
  }

  const goToNextVerse = () => {
    if (hasNextVerse) setSelectedVerseId(chapter.verses[currentVerseIndex + 1].id)
  }

  return (
    <div className="min-h-screen bg-[#fffaf2] text-stone-800 flex flex-col">
      {/* Offline Status Warning Banner */}
      {(!isOnline || isUsingLocalFallback) && !offlineBannerDismissed && (
        <div className="bg-amber-800 text-amber-50 px-4 py-2 text-xs text-center flex items-center justify-between shadow-inner z-50">
          <span className="mx-auto">
            ⚠️ {isOnline ? "Server unreachable." : "You are offline."} Reading from local cache. Semantic search & transliteration are using keyword fallback.
          </span>
          <button 
            onClick={() => setOfflineBannerDismissed(true)} 
            className="underline font-bold opacity-80 hover:opacity-100 ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Global Application Navbar with View Switcher */}
      <header className="border-b border-amber-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setView('home')} 
            className="font-serif font-extrabold text-stone-900 text-lg flex items-center gap-2 hover:opacity-80 transition"
          >
            <span className="text-saffron-600">🪷</span> GeetaDrishti
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setView('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                view === 'home' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Home size={14} /> Home
            </button>
            <button
              onClick={() => setView('reader')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                view === 'reader' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <BookOpen size={14} /> Reader
            </button>
            <button
              onClick={() => setView('search')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                view === 'search' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Search size={14} /> AI Search
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(safeLanguage === 'en' ? 'te' : 'en')}
              className="ml-1 inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
            >
              <Globe size={13} />
              {safeLanguage === 'en' ? 'తెలుగు' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Router */}
      <main className="flex-1">
        {view === 'home' && (
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-4 shadow-sm">
              <Sparkles size={14} />
              {safeLanguage === 'te' ? 'భగవద్గీత జ్ఞాన వేదిక' : 'Sanskrit Wisdom & AI Discovery'}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-4 font-serif">
              GeetaDrishti <span className="text-saffron-600">(గీతాదృష్టి)</span>
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-10">
              {safeLanguage === 'te' 
                ? 'భగవద్గీత శ్లోకాలను చదవండి, సాంప్రదాయ వ్యాఖ్యానాలను అన్వేషించండి మరియు AI ద్వారా లోతైన భావాలను కనుగొనండి.'
                : 'Explore verses, dive into traditional commentaries by Shankaracharya and Ramanujacharya, and search philosophy using advanced AI.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => setView('reader')}
                className="group text-left rounded-2xl border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-1">
                    {safeLanguage === 'te' ? 'శ్లోక పఠనం' : 'Verse Reader'}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {safeLanguage === 'te' ? 'అధ్యాయాలు మరియు శ్లోకాలను చదవండి.' : 'Read chapters and verses verse-by-verse with traditional commentaries.'}
                  </p>
                </div>
                <span className="mt-6 text-xs font-bold text-saffron-600 flex items-center gap-1">
                  {safeLanguage === 'te' ? 'చదవడం ప్రారంభించండి →' : 'Start Reading →'}
                </span>
              </button>

              <button
                onClick={() => setView('search')}
                className="group text-left rounded-2xl border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-saffron-100 text-saffron-800 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                    <Search size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-1">
                    {safeLanguage === 'te' ? 'AI భావాల శోధన' : 'AI Semantic Search'}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {safeLanguage === 'te' ? 'మీ ప్రశ్నలను టైప్ చేయండి మరియు సంబంధిత శ్లోక వ్యాఖ్యానాలను కనుగొనండి.' : 'Search through philosophical commentary vectors using natural language and concepts.'}
                  </p>
                </div>
                <span className="mt-6 text-xs font-bold text-saffron-600 flex items-center gap-1">
                  {safeLanguage === 'te' ? 'అన్వేషించడం ప్రారంభించండి →' : 'Explore Search →'}
                </span>
              </button>
            </div>
          </div>
        )}

        {view === 'search' && (
          <SearchPage language={safeLanguage} setLanguage={setLanguage} isOnline={isOnline} />
        )}

        {view === 'reader' && (
          <div className="mx-auto max-w-3xl space-y-7 px-4 py-6">
            <Navbar
              language={safeLanguage}
              onLanguageChange={setLanguage}
              query={query}
              onQueryChange={setQuery}
              onOpenStudy={() => setIsNotesOpen(true)}
              onOpenMenu={() => setIsMenuOpen(true)}
            />

            {query.trim() ? (
              <section aria-labelledby="search-results-heading">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-600" />
                  <h2 id="search-results-heading" className="font-serif text-lg font-bold text-saffron-900">{ui.result}</h2>
                  <span className="text-xs text-stone-500">{results.length}</span>
                </div>
                {results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((verse) => (
                      <button
                        key={verse.id}
                        type="button"
                        onClick={() => selectVerse(verse.id)}
                        className="w-full rounded-2xl border border-amber-100 bg-white p-4 text-left shadow-sm transition hover:border-amber-300 hover:bg-amber-50"
                      >
                        <p className="text-xs font-bold text-amber-800">{safeLanguage === 'te' ? 'అధ్యాయం' : 'Chapter'} {verse.chapterNumber} · {safeLanguage === 'te' ? 'శ్లోకం' : 'Verse'} {verse.number}</p>
                        <p className="mt-1 font-medium text-stone-700">{verse[ safeLanguage === 'te' ? 'telugu' : 'english' ]}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50 p-8 text-center text-sm text-stone-500"><SearchX className="mx-auto mb-2 text-amber-600" />{ui.noResult}</div>
                )}
              </section>
            ) : (
              <>
                <section className="rounded-3xl bg-gradient-to-br from-saffron-900 via-amber-800 to-orange-700 p-6 text-amber-50 shadow-soft">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15"><BookOpenCheck size={21} /></span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-200">{ui.discover}</p>
                      <h2 className="mt-1 font-serif text-2xl font-bold leading-tight">{ui.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-amber-100">{ui.sub}</p>
                    </div>
                  </div>
                </section>

                <ChapterSelector chapters={chapters} selectedChapter={selectedChapter} language={safeLanguage} onChange={selectChapter} />

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-amber-700">
                  <span className="h-px flex-1 bg-amber-200" />
                  {ui.current}: {chapter?.title[safeLanguage]}
                  <span className="h-px flex-1 bg-amber-200" />
                </div>

                {loading || !activeVerse ? (
                  <div className="p-12 text-center text-amber-800 font-medium">Loading verse from database & transliteration engine...</div>
                ) : (
                  <VerseCard
                    key={activeVerse.id}
                    verse={activeVerse}
                    edition={edition}
                    language={safeLanguage}
                    isBookmarked={safeBookmarks.includes(activeVerse.id)}
                    onToggleBookmark={toggleBookmark}
                    onOpenNotes={() => setIsNotesOpen(true)}
                  />
                )}

                <div className="mt-6 flex items-center justify-between gap-4">
                  <button
                    onClick={goToPreviousVerse}
                    disabled={!hasPreviousVerse}
                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${
                      hasPreviousVerse ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 active:scale-95' : 'bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {safeLanguage === 'te' ? '← ముందు శ్లోకం' : '← Previous Verse'}
                  </button>
                  <button
                    onClick={goToNextVerse}
                    disabled={!hasNextVerse}
                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${
                      hasNextVerse ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 active:scale-95' : 'bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {safeLanguage === 'te' ? 'తరువాతి శ్లోకం →' : 'Next Verse →'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Drawers */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        chapters={chapters}
        language={safeLanguage}
        onSelectChapter={selectChapter}
        onOpenStudy={() => setIsNotesOpen(true)}
      />
      <NotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        language={safeLanguage}
        activeVerseId={selectedVerseId}
        allVerses={chapters.flatMap(c => c.verses)}
        notes={safeNotes}
        onCreateNote={addNote}
        onUpdateNote={updateNote}
        onDeleteNote={deleteNote}
        bookmarks={safeBookmarks}
        onRemoveBookmark={removeBookmark}
        onJumpToVerse={selectVerse}
      />
    </div>
  )
}