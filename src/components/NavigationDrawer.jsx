import { BookOpen, ChevronRight, LibraryBig, X } from 'lucide-react'

export default function NavigationDrawer({ isOpen, onClose, chapters, language, onSelectChapter, onOpenStudy }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-stone-950/35" aria-label="Close navigation" />
      <aside className="safe-bottom safe-top relative flex h-full w-[min(20rem,86vw)] flex-col bg-[#fffdf9] shadow-2xl">
        <div className="flex items-center justify-between border-b border-amber-100 px-5 pb-4">
          <div className="flex items-center gap-2 text-saffron-900">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-saffron-700 text-white"><BookOpen size={19} /></span>
            <span className="font-serif text-xl font-bold">GeetaDrishti</span>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-stone-500 hover:bg-amber-50" aria-label="Close navigation"><X size={20} /></button>
        </div>

        <div className="border-b border-amber-100 p-4">
          <button
            type="button"
            onClick={() => { onOpenStudy(); onClose() }}
            className="flex w-full items-center gap-3 rounded-xl bg-amber-50 p-3 text-left text-sm font-bold text-saffron-900 transition hover:bg-amber-100"
          >
            <LibraryBig size={19} />
            {language === 'te' ? 'నా అధ్యయన వర్క్‌బెంచ్' : 'My study workbench'}
            <ChevronRight className="ml-auto" size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-amber-700">
            {language === 'te' ? 'అధ్యాయాలు' : 'Chapters'}
          </p>
          <nav className="space-y-1">
            {chapters.map((chapter) => (
              <button
                key={chapter.number}
                type="button"
                onClick={() => { onSelectChapter(chapter.number); onClose() }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-amber-50"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-100 text-xs font-bold text-saffron-900">{chapter.number}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-stone-700">{chapter.title[language]}</span>
                <ChevronRight className="text-amber-600" size={16} />
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  )
}
