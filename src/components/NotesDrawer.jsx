import { BookmarkCheck, Check, ChevronRight, FilePenLine, NotebookPen, Pencil, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const makeId = () => globalThis.crypto?.randomUUID?.() ?? `note-${Date.now()}-${Math.random().toString(16).slice(2)}`

export default function NotesDrawer({
  isOpen,
  onClose,
  language,
  activeVerseId,
  allVerses,
  notes,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  bookmarks,
  onRemoveBookmark,
  onJumpToVerse,
}) {
  const [panel, setPanel] = useState('notes')
  const [draft, setDraft] = useState('')
  const [draftVerseId, setDraftVerseId] = useState(activeVerseId)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (isOpen && !editingId) setDraftVerseId(activeVerseId)
  }, [isOpen, activeVerseId, editingId])

  if (!isOpen) return null

  const text = language === 'te'
    ? { title: 'అధ్యయన వర్క్‌బెంచ్', notes: 'గమనికలు', bookmarks: 'బుక్‌మార్క్‌లు', new: 'కొత్త గమనిక', edit: 'గమనిక మార్చండి', verse: 'శ్లోకం', save: 'భద్రపరచండి', cancel: 'రద్దు', emptyNotes: 'ఇంకా గమనికలు లేవు.', emptyBookmarks: 'ఇంకా బుక్‌మార్క్‌లు లేవు.', placeholder: 'ఈ శ్లోకం గురించి మీ ఆలోచనను రాయండి…', updated: 'నవీకరించబడింది', go: 'చదవండి', remove: 'తొలగించండి' }
    : { title: 'Study workbench', notes: 'Notes', bookmarks: 'Bookmarks', new: 'New note', edit: 'Edit note', verse: 'Verse', save: 'Save note', cancel: 'Cancel', emptyNotes: 'No study notes yet.', emptyBookmarks: 'No bookmarked verses yet.', placeholder: 'Write your reflection on this verse…', updated: 'Updated', go: 'Read', remove: 'Remove' }

  const resetEditor = () => {
    setDraft('')
    setEditingId(null)
    setDraftVerseId(activeVerseId)
  }

  const saveNote = (event) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body) return

    if (editingId) {
      onUpdateNote(editingId, { verseId: draftVerseId, body })
    } else {
      const now = new Date().toISOString()
      onCreateNote({ id: makeId(), verseId: draftVerseId, body, createdAt: now, updatedAt: now })
    }
    resetEditor()
  }

  const beginEdit = (note) => {
    setPanel('notes')
    setEditingId(note.id)
    setDraft(note.body)
    setDraftVerseId(note.verseId)
  }

  const deleteNote = (note) => {
    const message = language === 'te' ? 'ఈ గమనికను శాశ్వతంగా తొలగించాలా?' : 'Delete this note permanently?'
    if (window.confirm(message)) {
      onDeleteNote(note.id)
      if (editingId === note.id) resetEditor()
    }
  }

  const removeBookmark = (verseId) => {
    const message = language === 'te' ? 'ఈ బుక్‌మార్క్‌ను తొలగించాలా?' : 'Remove this bookmark?'
    if (window.confirm(message)) onRemoveBookmark(verseId)
  }

  const selectedVerse = allVerses.find((verse) => verse.id === draftVerseId)

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={text.title}>
      <button type="button" onClick={onClose} className="absolute inset-0 bg-stone-950/35" aria-label="Close study workbench" />
      <aside className="safe-bottom absolute bottom-0 left-0 right-0 flex max-h-[88vh] flex-col rounded-t-[2rem] bg-[#fffdf9] shadow-2xl sm:bottom-4 sm:left-auto sm:right-4 sm:w-[30rem] sm:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-amber-100 px-5 py-4">
          <div className="flex items-center gap-2 text-saffron-900">
            <NotebookPen size={20} />
            <h2 className="font-serif text-xl font-bold">{text.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-stone-500 hover:bg-amber-50" aria-label="Close study workbench"><X size={20} /></button>
        </div>

        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 rounded-xl bg-amber-50 p-1" role="tablist" aria-label="Study content">
            <button type="button" role="tab" aria-selected={panel === 'notes'} onClick={() => setPanel('notes')} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${panel === 'notes' ? 'bg-white text-saffron-900 shadow-sm' : 'text-stone-500'}`}>
              {text.notes} ({notes.length})
            </button>
            <button type="button" role="tab" aria-selected={panel === 'bookmarks'} onClick={() => setPanel('bookmarks')} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${panel === 'bookmarks' ? 'bg-white text-saffron-900 shadow-sm' : 'text-stone-500'}`}>
              {text.bookmarks} ({bookmarks.length})
            </button>
          </div>
        </div>

        {panel === 'notes' ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <form onSubmit={saveNote} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-saffron-900">
                <FilePenLine size={16} /> {editingId ? text.edit : text.new}
              </div>
              <label className="mb-2 block text-xs font-bold text-stone-600">
                {text.verse}
                <select value={draftVerseId} onChange={(event) => setDraftVerseId(event.target.value)} className="mt-1 block w-full rounded-lg border border-amber-200 bg-white px-2.5 py-2 text-sm text-stone-700">
                  {allVerses.map((verse) => (
                    <option key={verse.id} value={verse.id}>
                      {language === 'te' ? `అధ్యాయం ${verse.chapterNumber}, శ్లోకం ${verse.number}` : `Chapter ${verse.chapterNumber}, Verse ${verse.number}`}
                    </option>
                  ))}
                </select>
              </label>
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} maxLength={1200} className="w-full resize-none rounded-lg border border-amber-200 bg-white p-2.5 text-sm leading-6 text-stone-700 placeholder:text-stone-400" placeholder={text.placeholder} />
              <div className="mt-2 flex justify-end gap-2">
                {editingId && <button type="button" onClick={resetEditor} className="rounded-lg px-3 py-2 text-xs font-bold text-stone-500 hover:bg-white">{text.cancel}</button>}
                <button type="submit" disabled={!draft.trim()} className="inline-flex items-center gap-1 rounded-lg bg-saffron-700 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-saffron-900 disabled:cursor-not-allowed disabled:opacity-45"><Check size={14} /> {text.save}</button>
              </div>
            </form>

            <div className="mt-4 space-y-3 pb-2">
              {notes.length === 0 && <EmptyState label={text.emptyNotes} />}
              {[...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((note) => {
                const verse = allVerses.find((item) => item.id === note.verseId)
                return (
                  <article key={note.id} className="rounded-2xl border border-stone-100 bg-white p-3.5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <button type="button" onClick={() => { onJumpToVerse(note.verseId); onClose() }} className="text-left text-xs font-bold text-amber-800 hover:underline">
                        {verse ? `${language === 'te' ? 'అధ్యాయం' : 'Chapter'} ${verse.chapterNumber} · ${text.verse} ${verse.number}` : note.verseId}
                      </button>
                      <div className="flex shrink-0 gap-1">
                        <button type="button" onClick={() => beginEdit(note)} className="rounded-md p-1.5 text-amber-700 hover:bg-amber-50" aria-label="Edit note"><Pencil size={15} /></button>
                        <button type="button" onClick={() => deleteNote(note)} className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50" aria-label="Delete note"><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700">{note.body}</p>
                    <p className="mt-2 text-[10px] font-medium text-stone-400">{text.updated} {new Date(note.updatedAt).toLocaleString(language === 'te' ? 'te-IN' : 'en-IN')}</p>
                  </article>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-2 pb-2">
              {bookmarks.length === 0 && <EmptyState label={text.emptyBookmarks} />}
              {bookmarks.map((verseId) => {
                const verse = allVerses.find((item) => item.id === verseId)
                if (!verse) return null
                return (
                  <article key={verseId} className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-white p-3.5 shadow-sm">
                    <BookmarkCheck className="shrink-0 text-rose-500" size={20} />
                    <button type="button" onClick={() => { onJumpToVerse(verseId); onClose() }} className="min-w-0 flex-1 text-left">
                      <p className="text-xs font-bold text-amber-800">{language === 'te' ? 'అధ్యాయం' : 'Chapter'} {verse.chapterNumber} · {text.verse} {verse.number}</p>
                      <p className="mt-0.5 truncate text-sm text-stone-600">{verse.chapterTitle[language]}</p>
                    </button>
                    <button type="button" onClick={() => { onJumpToVerse(verseId); onClose() }} className="rounded-lg p-2 text-saffron-700 hover:bg-amber-50" aria-label={text.go}><ChevronRight size={18} /></button>
                    <button type="button" onClick={() => removeBookmark(verseId)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={text.remove}><Trash2 size={17} /></button>
                  </article>
                )
              })}
            </div>
          </div>
        )}
        {selectedVerse && <div className="border-t border-amber-100 px-5 py-2 text-center text-[10px] text-stone-400">{language === 'te' ? 'ప్రస్తుతం ఎంచుకున్నది' : 'Currently selected'} · {selectedVerse.id}</div>}
      </aside>
    </div>
  )
}

function EmptyState({ label }) {
  return <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 px-4 py-8 text-center text-sm text-stone-500">{label}</div>
}
