import { Bookmark, Heart, NotebookPen, Quote } from 'lucide-react'
import CommentarySection from './CommentarySection'

export default function VerseCard({ verse, edition, language, isBookmarked, onToggleBookmark, onOpenNotes }) {
  const chapterName = verse.chapterTitle[language]
  const label = language === 'te' ? `అధ్యాయం ${verse.chapterNumber}` : `Chapter ${verse.chapterNumber}`

  return (
    <article className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-soft">
      <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">{label}</p>
          <h1 className="mt-1 font-serif text-xl font-bold text-saffron-900">{chapterName}</h1>
          <p className="mt-1 text-sm font-semibold text-stone-600">
            {language === 'te' ? 'శ్లోకం' : 'Verse'} {verse.number}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleBookmark(verse.id)}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition active:scale-95 ${isBookmarked ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-amber-200 bg-white text-amber-700 hover:bg-amber-100'}`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this verse'}
          aria-pressed={isBookmarked}
        >
          <Heart size={21} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="space-y-5 p-5">
        <section>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-amber-700">
            <Quote size={15} /> Sanskrit / संस्कृतम्
          </div>
          <p className="font-serif text-xl leading-9 text-stone-800">{verse.sanskrit}</p>
        </section>

        <section className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-stone-500">
            {language === 'te' ? 'అర్థం' : 'Translation'}
          </p>
          <p className="mt-2 text-[15px] leading-7 text-stone-700">{verse[language === 'te' ? 'telugu' : 'english']}</p>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-800">
            <Bookmark size={13} /> {edition[language]}
          </span>
          <button
            type="button"
            onClick={onOpenNotes}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-saffron-700 transition hover:bg-amber-50"
          >
            <NotebookPen size={15} /> {language === 'te' ? 'గమనిక రాయండి' : 'Add a note'}
          </button>
        </div>

        <CommentarySection commentaries={verse.commentaries} language={language} />
      </div>
    </article>
  )
}
