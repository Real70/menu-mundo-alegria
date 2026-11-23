import { Heart, Lock, QrCode } from 'lucide-react';
import { LOGO_URL, WHATSAPP_URL } from '../data/menuData';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  return (
    <footer
      id="menu-footer"
      className="print-hide print:hidden mt-12 bg-slate-900 text-slate-300 pt-10 pb-8 px-4 border-t border-slate-800"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-sm">
            <img
              src={LOGO_URL}
              alt="Mundo Alegría"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <span className="text-base font-extrabold text-white tracking-wide font-brand">
            Mundo Alegría
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-4">
          Restaurante • Heladería • Diversión • Comidas Rápidas • Asados
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all mb-4 cursor-pointer"
        >
          <WhatsAppIcon className="w-4 h-4 fill-white" />
          <span>Contáctanos por WhatsApp</span>
        </a>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-amber-300 mb-6">
          <QrCode className="w-4 h-4" />
          <span>Menú digital oficial para lectura por código QR</span>
        </div>

        <div className="w-full max-w-xs border-t border-slate-800 my-4" />

        <p className="text-xs text-slate-500 flex items-center gap-1">
          Hecho con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para deleitar a cada
          familia
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          © {new Date().getFullYear()} Restaurante Mundo Alegría. Todos los derechos reservados.
        </p>

        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="print-hide print:hidden mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-amber-300 text-[11px] font-semibold border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>Panel Dueño</span>
          </button>
        )}
      </div>
    </footer>
  );
}
