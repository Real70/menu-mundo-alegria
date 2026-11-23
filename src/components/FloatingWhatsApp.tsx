import { Printer } from 'lucide-react';
import { WHATSAPP_URL } from '../data/menuData';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FloatingWhatsAppProps {
  onPrintMenu?: () => void;
}

export function FloatingWhatsApp({ onPrintMenu }: FloatingWhatsAppProps) {
  return (
    <aside
      aria-label="Acciones rápidas del menú"
      className="print:hidden fixed bottom-6 left-5 z-40 flex flex-col items-start gap-2.5"
    >
      {onPrintMenu && (
        <button
          type="button"
          onClick={onPrintMenu}
          aria-label="Imprimir o guardar menú completo en PDF"
          className="flex items-center gap-2 bg-[#0a529e] hover:bg-[#073d77] active:scale-95 text-white px-4 py-3 rounded-full shadow-xl shadow-blue-950/25 transition-all duration-300 border-2 border-white cursor-pointer font-extrabold text-sm"
        >
          <Printer className="w-5 h-5 text-amber-300" />
          <span>Imprimir</span>
        </button>
      )}

      <div className="relative flex items-center group">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir WhatsApp de Restaurante Mundo Alegría"
          className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white px-4 py-3 rounded-full shadow-xl shadow-emerald-950/20 transition-all duration-300 border-2 border-white cursor-pointer font-bold text-sm"
        >
          <span className="relative flex items-center justify-center">
            <WhatsAppIcon className="w-6 h-6 fill-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
          </span>
          <span className="hidden sm:inline-block font-extrabold tracking-wide">
            ¡Haz tu pedido ya!
          </span>
        </a>
        <span className="sm:hidden absolute left-14 bottom-2 bg-slate-900/90 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          ¡Haz tu pedido ya!
        </span>
      </div>
    </aside>
  );
}
