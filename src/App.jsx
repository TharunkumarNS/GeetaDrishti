import { BookOpenCheck, SearchX, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ChapterSelector from './components/ChapterSelector'
import Navbar from './components/Navbar'
import NavigationDrawer from './components/NavigationDrawer'
import NotesDrawer from './components/NotesDrawer'
import VerseCard from './components/VerseCard'
import { allVerses, chapters, edition, searchVerses } from './data/gitaData'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [language, setLanguage] = useLocalStorage('geeta-drishti:language', 'en')
  const [selectedChapter, setSelectedChapter] = useState(2)
  const [selectedVerseId, setSelectedVerseId] = useState('2.47')
  const [query, setQuery] = useState('')
  const [bookmarks, setBookmarks] = useLocalStorage('geeta-drishti:bookmarks', [])
  const [notes, setNotes] = useLocalStorage('geeta-drishti:notes', [])
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const safeLanguage = language === 'te' ? 'te' : 'en'
  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : []
  const safeNotes = Array.isArray(notes) ? notes : []
  const activeVerse = allVerses.find((verse) => verse.id === selectedVerseId) ?? allVerses[0]
  const results = useMemo(() => searchVerses(query), [query])

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
    const verse = allVerses.find((item) => item.id === verseId)
    if (!verse) return
    setSelectedChapter(verse.chapterNumber)
    setSelectedVerseId(verse.id)
    setQuery('')
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

  return (
    <div className="min-h-screen bg-[#fffaf2] text-stone-800">
      <Navbar
        language={safeLanguage}
        onLanguageChange={setLanguage}
        query={query}
        onQueryChange={setQuery}
        onOpenStudy={() => setIsNotesOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      <main className="safe-bottom mx-auto max-w-3xl space-y-7 px-4 py-6">
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

            <VerseCard
              key={activeVerse.id}
              verse={activeVerse}
              edition={edition}
              language={safeLanguage}
              isBookmarked={safeBookmarks.includes(activeVerse.id)}
              onToggleBookmark={toggleBookmark}
              onOpenNotes={() => setIsNotesOpen(true)}
            />
          </>
        )}
      </main>

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
        activeVerseId={activeVerse.id}
        allVerses={allVerses}
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
