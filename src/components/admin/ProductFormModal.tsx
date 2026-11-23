import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Check,
  ImagePlus,
  Link2,
  Loader2,
  Sparkles,
  Users,
  Utensils,
  X,
} from 'lucide-react';
import { formatCOP } from '../../data/menuData';
import type { Category, MenuItem, ProductAvailability } from '../../types/menu';
import type { ProductInput } from '../../context/CatalogContext';

interface ProductFormModalProps {
  isOpen: boolean;
  initialItem: MenuItem | null;
  categories: Category[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSave: (input: ProductInput, editingId?: string) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
}

const BADGE_SUGGESTIONS = [
  'Recomendada',
  'Favorita',
  'Especial',
  'Tradicional',
  'Para Compartir',
  'Plato Fuerte',
  'Clásica',
  'Familiar',
  'Personal',
  'Porción Extra',
];

export function ProductFormModal({
  isOpen,
  initialItem,
  categories,
  defaultCategoryId,
  onClose,
  onSave,
  onUploadImage,
}: ProductFormModalProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('15000');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badge, setBadge] = useState('');
  const [serves, setServes] = useState('');
  const [availability, setAvailability] = useState<ProductAvailability>('available');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (initialItem) {
      setName(initialItem.name);
      setCategoryId(initialItem.categoryId);
      setPrice(String(initialItem.price));
      setDescription(initialItem.description);
      setImageUrl(initialItem.imageUrl);
      setBadge(initialItem.badge || '');
      setServes(initialItem.serves || '');
      setAvailability(initialItem.availability || 'available');
    } else {
      setName('');
      setCategoryId(defaultCategoryId && defaultCategoryId !== 'all' ? defaultCategoryId : categories[0]?.id || '');
      setPrice('18000');
      setDescription('');
      setImageUrl('');
      setBadge('');
      setServes('');
      setAvailability('available');
    }
  }, [isOpen, initialItem, categories, defaultCategoryId]);

  if (!isOpen) return null;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }
    setIsUploading(true);
    setError('');
    try {
      const uploadedUrl = await onUploadImage(file);
      setImageUrl(uploadedUrl);
    } catch (err) {
      setError(`No se pudo subir la imagen: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre del producto es obligatorio.');
      return;
    }
    if (!categoryId) {
      setError('Selecciona una categoría para el producto.');
      return;
    }
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setError('Ingresa un precio válido.');
      return;
    }
    if (!description.trim()) {
      setError('Agrega una breve descripción de los ingredientes o preparación.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      await onSave(
        {
          name: name.trim(),
          categoryId,
          price: numericPrice,
          description: description.trim(),
          imageUrl: imageUrl.trim() || '/assets/logo.svg',
          badge: badge.trim() || undefined,
          serves: serves.trim() || undefined,
          availability,
        },
        initialItem?.id
      );
      onClose();
    } catch (err) {
      setError(`Error al guardar: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
      >
        <div className="px-5 py-4 bg-gradient-to-r from-[#0a529e] to-[#0d64c0] text-white flex items-center justify-between border-b-4 border-amber-400">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold font-brand">
              {initialItem ? `Editar: ${initialItem.name}` : 'Añadir Nuevo Producto al Menú'}
            </h2>
            <p className="text-xs text-blue-100">
              Los cambios se guardan directamente en el proyecto y se actualizan al instante.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Nombre del Plato / Producto *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Hamburguesa Super Especial"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0a529e]/30 focus:border-[#0a529e]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Categoría *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0a529e]/30 focus:border-[#0a529e]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Precio en Pesos (COP) *
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 pr-24 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0a529e]/30 focus:border-[#0a529e]"
                />
                <span className="absolute right-3 text-xs font-black text-[#0a529e] bg-blue-50 px-2 py-1 rounded-lg">
                  {formatCOP(Number(price) || 0)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Disponibilidad en el Menú *
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(
                  [
                    { id: 'available', label: 'Disponible', activeClass: 'bg-emerald-600 text-white' },
                    { id: 'sold_out', label: 'Agotado', activeClass: 'bg-amber-500 text-slate-950' },
                    { id: 'hidden', label: 'Oculto', activeClass: 'bg-slate-700 text-white' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvailability(opt.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      availability === opt.id
                        ? `${opt.activeClass} shadow-xs`
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
              Descripción / Ingredientes *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los ingredientes, salsas y acompañamientos del plato..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0a529e]/30 focus:border-[#0a529e]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Insignia / Etiqueta (Opcional)</span>
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej: Recomendada, Favorita, Especial..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0a529e]/30 focus:border-[#0a529e]"
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {BADGE_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setBadge(badge === sug ? '' : sug)}
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer ${
                      badge === sug
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                <Users className="w-3.5 h-3.5 text-[#0a529e]" />
                <span>Porción / Acompañamiento (Opcional)</span>
              </label>
              <input
                type="text"
                value={serves}
                onChange={(e) => setServes(e.target.value)}
                placeholder="Ej: 1 - 2 personas, Con papas, 400 ml..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0a529e]/30 focus:border-[#0a529e]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Fotografía del Producto
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-28 h-24 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-center text-slate-400 p-2 flex flex-col items-center">
                    <Utensils className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">Sin foto</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0a529e] hover:bg-[#073d77] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Subiendo foto...</span>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-4 h-4" />
                        <span>Subir Foto desde Celular / PC</span>
                      </>
                    )}
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Se guardará en <code className="text-slate-700">public/images/products/</code>
                  </span>
                </div>

                <div className="relative flex items-center">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="O pega la ruta/URL de la imagen (/images/products/...)"
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#0a529e]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{initialItem ? 'Guardar Cambios' : 'Crear Producto'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
