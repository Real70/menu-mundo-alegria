import { useState, type FormEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit3,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import type { Category, CategoryIconName } from '../../types/menu';
import { CATEGORY_ICON_OPTIONS, CategoryIcon } from '../CategoryIcon';

export function CategoryManager() {
  const { categories, items, addCategory, updateCategory, deleteCategory, reorderCategory } =
    useCatalog();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState<CategoryIconName>('Utensils');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    null
  );

  const openNewCategory = () => {
    setEditingCategory(null);
    setName('');
    setIconName('Utensils');
    setDescription('');
    setFeedback(null);
    setIsFormOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIconName(cat.iconName);
    setDescription(cat.description);
    setFeedback(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: name.trim(),
        iconName,
        description: description.trim(),
      });
      setFeedback({ type: 'success', message: `Categoría “${name}” actualizada.` });
    } else {
      await addCategory({
        name: name.trim(),
        iconName,
        description: description.trim(),
      });
      setFeedback({ type: 'success', message: `Categoría “${name}” creada.` });
    }
    setIsFormOpen(false);
  };

  const handleDelete = async (cat: Category) => {
    const res = await deleteCategory(cat.id);
    if (!res.ok && res.error) {
      setFeedback({ type: 'error', message: res.error });
    } else {
      setFeedback({ type: 'success', message: `Categoría “${cat.name}” eliminada.` });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Categorías del Menú ({categories.length})
          </h2>
          <p className="text-xs text-slate-500">
            Crea nuevas secciones, edita sus textos o cambia el orden en que aparecen en el menú.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewCategory}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a529e] hover:bg-[#073d77] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
            feedback.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-black/5 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-2xl border-2 border-[#0a529e]/30 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              {editingCategory ? `Editar Categoría: ${editingCategory.name}` : 'Crear Nueva Categoría'}
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Heladería y Postres"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-[#0a529e]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Descripción corta
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Copas de helado artesanal, malteadas y obleas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-[#0a529e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
              Ícono de la Categoría
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORY_ICON_OPTIONS.map((opt) => {
                const selected = iconName === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setIconName(opt.name)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#0a529e] text-white border-[#0a529e] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CategoryIcon
                      iconName={opt.name}
                      className={`w-4 h-4 shrink-0 ${selected ? 'text-amber-300' : 'text-slate-500'}`}
                    />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingCategory ? 'Guardar Categoría' : 'Crear Categoría'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2.5">
        {categories.map((cat, idx) => {
          const count = items.filter((it) => it.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-amber-500 shrink-0">
                  <CategoryIcon iconName={cat.iconName} className="w-5 h-5" useCrossedForUtensils />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900">{cat.name}</h3>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-[#0a529e]">
                      {count} {count === 1 ? 'plato' : 'platos'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {cat.description || 'Sin descripción'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => reorderCategory(cat.id, 'up')}
                  title="Subir posición"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-35 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === categories.length - 1}
                  onClick={() => reorderCategory(cat.id, 'down')}
                  title="Bajar posición"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-35 cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openEditCategory(cat)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0a529e] text-xs font-extrabold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
