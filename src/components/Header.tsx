import { LOGO_URL, WHATSAPP_URL } from '../data/menuData';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Header() {
  return (
    <header
      id="menu-header"
      className="relative overflow-hidden bg-gradient-to-r from-[#073d77] via-[#0a529e] to-[#0d64c0] text-white py-4 px-4 sm:px-6 shadow-md border-b-4 border-amber-400"
    >
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 right-10 w-48 h-48 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5 relative z-10">
        {/* Izquierda: Logo + Nombre al lado + Especialidades al lado */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white shadow-lg shadow-blue-950/40 border-2 border-amber-300 flex items-center justify-center shrink-0">
            <img
              src={LOGO_URL}
              alt="Logo Restaurante Mundo Alegría"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-xs font-brand whitespace-nowrap">
              Restaurante Mundo Alegría
            </h1>

            <span className="hidden lg:inline-block h-6 w-0.5 bg-amber-400/70 rounded-full" />

            <p className="text-xs sm:text-sm font-bold text-amber-300 bg-white/10 border border-white/15 px-3 py-1 rounded-full tracking-wide">
              Heladería • Comidas Rápidas • Asados • Diversión
            </p>
          </div>
        </div>

        {/* Esquina: Botón de WhatsApp "¡Haz tu pedido ya!" */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg shadow-emerald-950/30 transition-all border-2 border-white cursor-pointer shrink-0"
        >
          <span className="relative flex items-center justify-center">
            <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-200 rounded-full animate-ping" />
          </span>
          <span>¡Haz tu pedido ya!</span>
        </a>
      </div>
    </header>
  );
}
