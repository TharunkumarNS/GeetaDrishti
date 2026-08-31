export default function ChapterSelector({ chapters, selectedChapter, language, onChange }) {
  const heading = language === 'te' ? 'అధ్యాయం ఎంచుకోండి' : 'Choose a chapter'

  return (
    <section aria-labelledby="chapter-select-heading">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 id="chapter-select-heading" className="font-serif text-lg font-bold text-saffron-900">{heading}</h2>
        <span className="text-xs text-stone-500">18 {language === 'te' ? 'అధ్యాయాలు' : 'chapters'}</span>
      </div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-9">
        {chapters.map((chapter) => {
          const active = chapter.number === selectedChapter
          return (
            <button
              key={chapter.number}
              type="button"
              onClick={() => onChange(chapter.number)}
              className={`rounded-xl py-2 text-sm font-bold transition active:scale-95 ${active ? 'bg-saffron-700 text-white shadow-md shadow-amber-200' : 'border border-amber-200 bg-white text-stone-600 hover:border-amber-400 hover:bg-amber-50'}`}
              aria-label={`${heading}: ${chapter.number}`}
              aria-pressed={active}
            >
              {chapter.number}
            </button>
          )
        })}
      </div>
    </section>
  )
}
