import { useState } from 'react'
import { MessageCircleMore } from 'lucide-react'

const traditions = [
  { id: 'shankara', en: 'Shankara', te: 'శంకరులు' },
  { id: 'ramanuja', en: 'Ramanuja', te: 'రామానుజులు' },
  { id: 'prabhupada', en: 'Prabhupada', te: 'ప్రభుపాదులు' },
]

export default function CommentarySection({ commentaries, language }) {
  const [activeTradition, setActiveTradition] = useState('shankara')
  const active = traditions.find((tradition) => tradition.id === activeTradition)

  return (
    <section className="border-t border-amber-100 pt-4" aria-label={language === 'te' ? 'వ్యాఖ్యానాలు' : 'Commentaries'}>
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-saffron-900">
        <MessageCircleMore size={17} />
        {language === 'te' ? 'సంప్రదాయ వ్యాఖ్యానాలు' : 'Traditional commentaries'}
      </div>
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-amber-50 p-1" role="tablist" aria-label="Commentary traditions">
        {traditions.map((tradition) => (
          <button
            key={tradition.id}
            type="button"
            role="tab"
            aria-selected={activeTradition === tradition.id}
            onClick={() => setActiveTradition(tradition.id)}
            className={`min-w-max flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${activeTradition === tradition.id ? 'bg-white text-saffron-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {tradition[language]}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3.5">
        <p className="text-xs font-bold text-amber-800">{active[language]}</p>
        <p className="mt-1.5 text-sm leading-6 text-stone-700">{commentaries[activeTradition][language]}</p>
      </div>
    </section>
  )
}
