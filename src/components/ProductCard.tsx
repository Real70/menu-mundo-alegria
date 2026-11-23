import { useEffect, useState } from 'react';
import { Eye, Sparkles, Users, Utensils } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../data/menuData';
import type { MenuItem } from '../types/menu';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductCardProps {
  item: MenuItem;
  index: number;
  onOpenDetail: (item: MenuItem) => void;
}

const CARD_THEMES = [
  {
    // Difuminado 1: Azul Mundo Alegría -> Cielo -> Destello Dorado
    gradient: 'bg-gradient-to-r from-blue-100/95 via-sky-50/90 to-amber-100/85',
    border: 'border-blue-300/80 hover:border-[#0a529e]',
    accentLeft: 'border-l-4 border-l-[#0a529e]',
    accentRight: 'border-r-4 border-r-[#0a529e]',
    glow: 'bg-sky-400/20',
    categoryPill: 'text-[#0a529e] bg-white/90 border-blue-200',
    priceColor: 'text-[#0a529e]',
    button:
      'bg-white/90 text-[#0a529e] border border-blue-200/80 group-hover:bg-[#0a529e] group-hover:text-white',
  },
  {
    // Difuminado 2: Ámbar Dorado -> Naranja Sol -> Coral Fiesta
    gradient: 'bg-gradient-to-r from-amber-100/95 via-orange-50/90 to-rose-100/85',
    border: 'border-amber-300/85 hover:border-amber-500',
    accentLeft: 'border-l-4 border-l-amber-500',
    accentRight: 'border-r-4 border-r-amber-500',
    glow: 'bg-amber-400/20',
    categoryPill: 'text-amber-900 bg-white/90 border-amber-200',
    priceColor: 'text-[#0a529e]',
    button:
      'bg-white/90 text-[#0a529e] border border-amber-200/90 group-hover:bg-[#0a529e] group-hover:text-white',
  },
  {
    // Difuminado 3: Esmeralda Planeta -> Agua Fresca -> Celeste Mundo
    gradient: 'bg-gradient-to-r from-emerald-100/90 via-teal-50/85 to-sky-100/95',
    border: 'border-emerald-300/80 hover:border-emerald-600',
    accentLeft: 'border-l-4 border-l-emerald-500',
    accentRight: 'border-r-4 border-r-emerald-500',
    glow: 'bg-emerald-400/20',
    categoryPill: 'text-emerald-900 bg-white/90 border-emerald-200',
    priceColor: 'text-[#0a529e]',
    button:
      'bg-white/90 text-[#0a529e] border border-emerald-200/80 group-hover:bg-[#0a529e] group-hover:text-white',
  },
] as const;

export function ProductCard({ item, index, onOpenDetail }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(item.imageUrl);
  const [hasError, setHasError] = useState(false);
  const isSoldOut = item.availability === 'sold_out';
  const isLeft = index % 2 === 0;
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const orderUrl = getWhatsAppOrderUrl(item);

  useEffect(() => {
    setImgSrc(item.imageUrl);
    setHasError(false);
  }, [item.imageUrl]);

  const handleImageError = () => {
    if (imgSrc.startsWith('/images/products/')) {
      setImgSrc(imgSrc.replace('/images/products/', '/products/'));
    } else {
      setHasError(true);
    }
  };

  return (
    <article
      id={`producto-${item.id}`}
      onClick={() => onOpenDetail(item)}
      className={`product-print-card group relative w-[96%] sm:w-[92%] md:w-[88%] ${theme.gradient} rounded-2xl border ${theme.border} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${
        isLeft
          ? `mr-auto self-start sm:flex-row print:flex-row ${theme.accentLeft}`
          : `ml-auto self-end sm:flex-row-reverse print:flex-row-reverse ${theme.accentRight}`
      } ${isSoldOut ? 'opacity-90' : ''} cursor-pointer active:scale-[0.995]`}
    >
      {/* Brillo decorativo suave de fondo */}
      <div
        className={`absolute -top-10 ${isLeft ? '-right-10' : '-left-10'} w-36 h-36 rounded-full ${theme.glow} blur-2xl pointer-events-none`}
      />

      {/* Bloque de Imagen Compacto y Panorámico */}
      <div className="product-print-image relative w-full sm:w-48 md:w-56 h-36 sm:h-36 md:h-40 shrink-0 bg-slate-100 overflow-hidden">
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4 text-center">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-[#0a529e] flex items-center justify-center mb-1.5 shadow-xs">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">{item.name}</span>
            <span className="text-[11px] text-slate-400">Mundo Alegría</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
              isSoldOut ? 'grayscale-40' : ''
            }`}
          />
        )}

        {item.badge && (
          <div className={`absolute top-2.5 ${isLeft ? 'left-2.5' : 'right-2.5'} z-10`}>
            <span className="bg-amber-400 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-slate-950" />
              {item.badge}
            </span>
          </div>
        )}

        {isSoldOut && (
          <div className={`absolute top-2.5 ${isLeft ? 'right-2.5' : 'left-2.5'} z-10`}>
            <span className="bg-rose-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Bloque de Información Compacto (Nombre, Descripción y Precio sin espacio muerto) */}
      <div className="relative z-10 px-4 py-3 sm:px-5 sm:py-3 flex flex-col justify-center flex-1 gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-[#0a529e] transition-colors leading-snug tracking-tight font-heading">
              {item.name}
            </h3>
            <span
              className={`inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider border px-2 py-0.5 rounded-full ${theme.categoryPill}`}
            >
              {item.categoryName}
            </span>
            {item.serves && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-950 bg-white/85 border border-amber-200 px-2 py-0.5 rounded-full">
                <Users className="w-3 h-3 text-amber-600" />
                <span>{item.serves}</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-snug font-semibold">
          {item.description}
        </p>

        <div className="pt-1.5 border-t border-slate-900/10 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Precio:
            </span>
            <span
              className={`text-xl sm:text-2xl font-black ${theme.priceColor} tracking-tight font-heading`}
            >
              {item.formattedPrice}
            </span>
          </div>

          {/* En la página web original se mantiene "Ver plato / Pedir" */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(item);
            }}
            aria-label={`Ver detalles de ${item.name}`}
            className={`web-only-action print:hidden inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition-all duration-200 shadow-2xs cursor-pointer ${theme.button}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver plato / Pedir</span>
          </button>

          {/* Exclusivamente en el PDF generado: hipervínculo directo "Pedir" a WhatsApp */}
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Pedir ${item.name} por WhatsApp`}
            className="pdf-only-action hidden print:inline-flex items-center gap-1.5 text-xs font-extrabold px-4 py-1.5 rounded-xl bg-[#25D366] text-white border border-emerald-700/20 shadow-xs"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
            <span>Pedir</span>
          </a>
        </div>
      </div>
    </article>
  );
}
