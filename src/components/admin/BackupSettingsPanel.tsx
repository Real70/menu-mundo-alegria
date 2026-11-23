import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  CheckCircle2,
  Download,
  KeyRound,
  RotateCcw,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

export function BackupSettingsPanel() {
  const { exportCatalogJson, importCatalogJson, resetToDefaultCatalog, updateAdminPin } =
    useCatalog();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = await importCatalogJson(text);
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: 'Catálogo importado y guardado correctamente en el proyecto.',
        });
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Archivo inválido.' });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `No se pudo leer el archivo: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePinSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setStatusMessage({
        type: 'error',
        text: 'El nuevo PIN o contraseña debe tener al menos 4 caracteres.',
      });
      return;
    }
    if (newPin.trim() !== confirmPin.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'La confirmación del PIN no coincide.',
      });
      return;
    }
    updateAdminPin(newPin.trim());
    setNewPin('');
    setConfirmPin('');
    setStatusMessage({
      type: 'success',
      text: 'PIN de acceso del dueño actualizado correctamente.',
    });
  };

  const handleFactoryReset = async () => {
    await resetToDefaultCatalog();
    setConfirmReset(false);
    setStatusMessage({
      type: 'success',
      text: 'Menú restaurado a los 29 platos y 8 categorías originales de fábrica.',
    });
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Copia de Seguridad del Menú (JSON)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Descarga un respaldo completo con todas tus categorías, platos y precios, o restaura un
              archivo guardado anteriormente.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                exportCatalogJson();
                setStatusMessage({
                  type: 'success',
                  text: 'Copia de seguridad descargada en tu dispositivo.',
                });
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a529e] hover:bg-[#073d77] text-white text-xs font-extrabold shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Copia (.json)</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Importar Copia (.json)</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Restauración de Fábrica
            </h4>
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar menú original (29 platos)</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-2.5">
                <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    ¿Confirmas restaurar los 29 productos y 8 categorías originales?
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFactoryReset}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold cursor-pointer"
                  >
                    Sí, restaurar ahora
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-white text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handlePinSubmit}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4"
        >
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#0a529e]" />
              <span>Cambiar PIN / Contraseña del Dueño</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Personaliza la clave con la que ingresas a este panel de administración.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Nuevo PIN o Contraseña
            </label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Mínimo 4 caracteres"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-[#0a529e]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Confirmar Nuevo PIN o Contraseña
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Repite la nueva clave"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-[#0a529e]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs cursor-pointer"
          >
            <span>Actualizar Contraseña</span>
          </button>
        </form>
      </div>
    </div>
  );
}
