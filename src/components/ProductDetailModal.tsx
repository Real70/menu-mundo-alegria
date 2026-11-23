import { useEffect, useState } from 'react';
import { CircleAlert, CircleCheck, Sparkles, Users, Utensils, X } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../data/menuData';
import type { MenuItem } from '../types/menu';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function ProductDetailModal({ item, onClose }: ProductDetailModalProps) {
  const [imgSrc, setImgSrc] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (item) {
      setImgSrc(item.imageUrl);
      setHasError(false);
    }
  }, [item]);

  const handleImageError = () => {
    if (!item) return;
    if (imgSrc !== item.imageUrl) {
      setImgSrc(item.imageUrl);
    } else if (imgSrc.startsWith('/images/products/')) {
      setImgSrc(imgSrc.replace('/images/products/', '/products/'));
    } else {
      setHasError(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [item, onClose]);

  if (!item) return null;

  const isSoldOut = item.availability === 'sold_out';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana de detalle"
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full h-56 sm:h-64 bg-slate-100 overflow-hidden shrink-0">
          {hasError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-200 p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#0a529e] flex items-center justify-center mb-2 shadow-xs">
                <Utensils className="w-7 h-7" />
              </div>
              <span className="text-base font-bold text-slate-800">{item.name}</span>
              <span className="text-xs text-slate-500">Mundo Alegría</span>
            </div>
          ) : (
            <img
              src={imgSrc}
              alt={item.name}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className={`w-full h-full object-cover object-center ${isSoldOut ? 'grayscale-40' : ''}`}
            />
          )}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 items-center">
            {item.badge && (
              <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {item.badge}
              </span>
            )}
            {isSoldOut && (
              <span className="bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                Agotado
              </span>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto">
          <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 id="modal-title" className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {item.name}
            </h2>
            <div className="text-right shrink-0">
              <span className="text-xs font-semibold uppercase text-slate-400 block -mb-1">Precio</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0a529e]">
                {item.formattedPrice}
              </span>
            </div>
          </div>

          {item.serves && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-[#0a529e]" />
              <span>Porción / Acompañamiento: {item.serves}</span>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Descripción del plato
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{item.description}</p>
          </div>

          {isSoldOut ? (
            <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <CircleAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-rose-950">
                  Plato temporalmente agotado
                </h4>
                <p className="text-xs text-rose-900/80 mt-0.5">
                  Este producto no está disponible en este momento. Consulta con nuestro equipo otras
                  opciones deliciosas del menú.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <CircleCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-950">¿Listo para pedir?</h4>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  Indícale a tu mesero: <strong>“Deseo ordenar {item.name}”</strong> o pulsa en el botón
                  inferior para pedirlo directamente por WhatsApp.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={getWhatsAppOrderUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Pedir por WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors cursor-pointer"
          >
            Volver al Menú
          </button>
        </div>
      </div>
    </div>
  );
}
