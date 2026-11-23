import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalResults: number;
}

export function SearchBar({ searchQuery, onSearchChange, totalResults }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar plato, ingrediente o bebida..."
          aria-label="Buscar en el menú"
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#0a529e]/30 focus:border-[#0a529e] transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Borrar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="mt-1.5 px-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            Buscando: “<strong className="text-slate-700">{searchQuery}</strong>”
          </span>
          <span>{totalResults} resultado(s)</span>
        </div>
      )}
    </div>
  );
}
