import { useState } from 'react';
import { BookOpen, RefreshCw, Sparkles } from 'lucide-react';
import { BIBLE_VERSES } from '../data/menuData';
import type { BibleVerse } from '../types/menu';

function getRandomVerse(): BibleVerse {
  const index = Math.floor(Math.random() * BIBLE_VERSES.length);
  return BIBLE_VERSES[index];
}

export function BibleVerseCard() {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse>(() => getRandomVerse());
  const [isSpinning, setIsSpinning] = useState(false);

  const handleNextVerse = () => {
    setIsSpinning(true);
    let next = getRandomVerse();
    if (BIBLE_VERSES.length > 1 && next.id === currentVerse.id) {
      next = BIBLE_VERSES.find((v) => v.id !== currentVerse.id) || next;
    }
    setTimeout(() => {
      setCurrentVerse(next);
      setIsSpinning(false);
    }, 200);
  };

  return (
    <aside
      id="recuadro-versiculo-biblico"
      aria-label="Versículo Bíblico de Bendición"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-blue-50/70 border border-amber-200/70 shadow-sm p-4 sm:p-5 transition-all duration-300 hover:shadow-md"
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-200/20 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              Palabra de Bendición
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleNextVerse}
          title="Ver otro versículo bíblico"
          aria-label="Cambiar a otro versículo"
          className="print-hide print:hidden flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 active:scale-95 rounded-full transition-all duration-150 cursor-pointer"
        >
          <RefreshCw
            className={`w-3 h-3 transition-transform duration-300 ${isSpinning ? 'rotate-180 text-amber-800' : ''}`}
          />
          <span className="hidden xs:inline text-[11px]">Otro versículo</span>
        </button>
      </div>
      <div className="mt-2.5 pl-1 relative z-10">
        <blockquote className="text-sm sm:text-base font-medium text-slate-800 italic leading-snug">
          “{currentVerse.verse}”
        </blockquote>
        <div className="mt-1.5 flex items-center justify-between text-xs text-amber-900/90 font-semibold">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            {currentVerse.reference}
          </span>
          {currentVerse.theme && (
            <span className="text-[11px] font-normal text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-amber-100">
              {currentVerse.theme}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
