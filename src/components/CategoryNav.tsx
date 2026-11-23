import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import type { Category } from '../types/menu';
import { CategoryIcon } from './CategoryIcon';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categoryCounts: Record<string, number>;
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeButton = scrollContainerRef.current.querySelector(
      `[data-category-id="${selectedCategory}"]`
    );
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategory]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <nav
      id="navegacion-categorias"
      aria-label="Categorías del Menú"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-2.5 px-2 sm:px-4"
    >
      <div className="max-w-5xl mx-auto flex items-center relative">
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Desplazar categorías a la izquierda"
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-xs transition-colors shrink-0 mr-1"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full py-1 px-1"
        >
          <button
            type="button"
            data-category-id="all"
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-200 shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0a529e] text-white shadow-sm ring-2 ring-[#0a529e]/30 scale-102'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Todos</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {categoryCounts.all || 0}
            </span>
          </button>

          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            const count = categoryCounts[category.id] || 0;
            return (
              <button
                key={category.id}
                type="button"
                data-category-id={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0a529e] text-white shadow-sm ring-2 ring-[#0a529e]/30 scale-102'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className={isSelected ? 'text-amber-300' : 'text-slate-500'}>
                  <CategoryIcon iconName={category.iconName} className="w-4 h-4" />
                </span>
                <span>{category.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={scrollRight}
          aria-label="Desplazar categorías a la derecha"
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-xs transition-colors shrink-0 ml-1"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
