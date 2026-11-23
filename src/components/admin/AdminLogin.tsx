import { useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { LOGO_URL } from '../../data/menuData';
import { useCatalog } from '../../context/CatalogContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToMenu: () => void;
}

export function AdminLogin({ onSuccess, onBackToMenu }: AdminLoginProps) {
  const { verifyAdminPin, isDefaultPin } = useCatalog();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pin)) {
      setError('');
      onSuccess();
    } else {
      setError('PIN o contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a529e] via-[#0b5bb0] to-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0a529e] to-[#0d64c0] p-6 text-center text-white border-b-4 border-amber-400">
          <div className="w-20 h-20 rounded-full bg-white p-1 mx-auto shadow-lg flex items-center justify-center">
            <img
              src={LOGO_URL}
              alt="Mundo Alegría"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h1 className="mt-3 text-2xl font-extrabold font-brand">Panel del Dueño</h1>
          <p className="text-xs text-blue-100 mt-1">
            Administración de Menú Digital • Restaurante Mundo Alegría
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="owner-pin"
              className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2"
            >
              PIN o Contraseña de Acceso
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="owner-pin"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ingresa tu PIN de administrador"
                autoFocus
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0a529e]/30 focus:border-[#0a529e] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Mostrar u ocultar PIN"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {isDefaultPin && (
              <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  PIN inicial por defecto: <strong>1234</strong> (puedes cambiarlo dentro del panel).
                </span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#0a529e] hover:bg-[#073d77] active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-blue-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Ingresar al Dashboard</span>
          </button>

          <button
            type="button"
            onClick={onBackToMenu}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Menú Público</span>
          </button>
        </form>
      </div>
    </div>
  );
}
