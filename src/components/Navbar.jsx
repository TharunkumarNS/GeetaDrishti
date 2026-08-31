import { BookOpenText, Menu, NotebookPen, Search } from 'lucide-react'

export default function Navbar({ language, onLanguageChange, query, onQueryChange, onOpenStudy, onOpenMenu }) {
  const placeholder = language === 'te' ? 'అధ్యాయం, శ్లోకం లేదా పదం వెతకండి…' : 'Search chapter, verse, or keyword…'

  return (
    <header className="safe-top sticky top-0 z-30 border-b border-amber-100 bg-[#fffaf2]/95 px-4 pb-3 backdrop-blur">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-stone-700 transition hover:bg-amber-100 active:scale-95"
            aria-label="Open navigation"
          >
            <Menu size={23} />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-saffron-700 text-amber-50 shadow-sm">
              <BookOpenText size={20} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-serif text-xl font-bold leading-none text-saffron-900">GeetaDrishti</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-amber-700">
                {language === 'te' ? 'ఆఫ్‌లైన్ అధ్యయనం' : 'Offline study'}
              </p>
            </div>
          </div>

          <div className="flex rounded-xl border border-amber-200 bg-amber-50 p-0.5 text-xs font-bold">
            {['en', 'te'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onLanguageChange(option)}
                className={`rounded-lg px-2.5 py-1.5 transition ${language === option ? 'bg-saffron-700 text-white shadow-sm' : 'text-amber-800'}`}
                aria-pressed={language === option}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenStudy}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-saffron-700 transition hover:bg-amber-100 active:scale-95"
            aria-label="Open study notes"
          >
            <NotebookPen size={21} />
          </button>
        </div>

        <label className="relative mt-3 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-700" size={18} />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-full rounded-xl border border-amber-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-800 shadow-sm placeholder:text-stone-400"
            placeholder={placeholder}
            type="search"
            aria-label={placeholder}
          />
        </label>
      </div>
    </header>
  )
}
