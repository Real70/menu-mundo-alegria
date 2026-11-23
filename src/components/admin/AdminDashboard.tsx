import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  CloudCheck,
  Edit3,
  ExternalLink,
  EyeOff,
  FolderKanban,
  LogOut,
  Package,
  Plus,
  QrCode,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { LOGO_URL } from '../../data/menuData';
import { useCatalog, type ProductInput } from '../../context/CatalogContext';
import type { MenuItem, ProductAvailability } from '../../types/menu';
import { ProductFormModal } from './ProductFormModal';
import { CategoryManager } from './CategoryManager';
import { BackupSettingsPanel } from './BackupSettingsPanel';
import { QrCodeManager } from './QrCodeManager';

interface AdminDashboardProps {
  onBackToMenu: () => void;
  onLogout: () => void;
}

type AdminTab = 'products' | 'categories' | 'qr' | 'settings';

export function AdminDashboard({ onBackToMenu, onLogout }: AdminDashboardProps) {
  const {
    categories,
    items,
    syncStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    setProductAvailability,
    uploadProductImage,
  } = useCatalog();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | ProductAvailability>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  const stats = useMemo(() => {
    const available = items.filter((i) => (i.availability || 'available') === 'available').length;
    const soldOut = items.filter((i) => i.availability === 'sold_out').length;
    const hidden = items.filter((i) => i.availability === 'hidden').length;
    return {
      total: items.length,
      available,
      soldOut,
      hidden,
      categoriesCount: categories.length,
    };
  }, [items, categories]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q);
      const matchesCat = categoryFilter === 'all' || item.categoryId === categoryFilter;
      const itemAvail = item.availability || 'available';
      const matchesAvail = availabilityFilter === 'all' || itemAvail === availabilityFilter;
      return matchesSearch && matchesCat && matchesAvail;
    });
  }, [items, searchQuery, categoryFilter, availabilityFilter]);

  const handleSaveProduct = async (input: ProductInput, editingId?: string) => {
    if (editingId) {
      await updateProduct(editingId, input);
    } else {
      await addProduct(input);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    await deleteProduct(deletingItem.id);
    setDeletingItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <header className="bg-gradient-to-r from-[#0a529e] via-[#0b5bb0] to-[#0d64c0] text-white border-b-4 border-amber-400 shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-md shrink-0">
              <img
                src={LOGO_URL}
                alt="Mundo Alegría"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold font-brand leading-tight">
                  Dashboard Mundo Alegría
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full">
                  <CloudCheck className="w-3.5 h-3.5" />
                  {syncStatus === 'saving'
                    ? 'Guardando...'
                    : syncStatus === 'synced'
                      ? 'Guardado en proyecto'
                      : 'Guardado en navegador'}
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Panel de administración de productos, precios, fotos y categorías
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToMenu}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Menú Público</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Productos</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.total}</span>
              <Package className="w-5 h-5 text-[#0a529e]" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Disponibles</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {stats.available}
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Agotados / Ocultos</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">
                {stats.soldOut} / {stats.hidden}
              </span>
              <EyeOff className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Categorías</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-[#0a529e]">
                {stats.categoriesCount}
              </span>
              <FolderKanban className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#0a529e] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Productos ({items.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#0a529e] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Categorías ({categories.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-[#0a529e] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Código QR para Mesas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#0a529e] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Respaldo y Seguridad</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setIsProductModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Nuevo Producto</span>
            </button>
          )}
        </div>

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar producto por nombre, ingrediente o categoría..."
                  className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#0a529e]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filtrar por categoría"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden focus:border-[#0a529e]"
                >
                  <option value="all">Todas las categorías ({items.length})</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  {(
                    [
                      { id: 'all', label: 'Todos' },
                      { id: 'available', label: 'Disponibles' },
                      { id: 'sold_out', label: 'Agotados' },
                      { id: 'hidden', label: 'Ocultos' },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setAvailabilityFilter(st.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        availabilityFilter === st.id
                          ? 'bg-white text-[#0a529e] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-700">
                  No se encontraron productos con esos filtros.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setAvailabilityFilter('all');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#0a529e] text-white text-xs font-bold cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredItems.map((item) => {
                  const avail = item.availability || 'available';
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border p-3.5 sm:p-4 shadow-2xs flex gap-3.5 transition-all ${
                        avail === 'hidden'
                          ? 'border-slate-200 opacity-75 bg-slate-50/60'
                          : avail === 'sold_out'
                            ? 'border-amber-300'
                            : 'border-slate-200/90 hover:border-blue-300'
                      }`}
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className={`w-full h-full object-cover ${avail !== 'available' ? 'grayscale-50' : ''}`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = LOGO_URL;
                          }}
                        />
                        {item.badge && (
                          <span className="absolute top-1.5 left-1.5 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0a529e] bg-blue-50 px-2 py-0.5 rounded-md">
                                {item.categoryName}
                              </span>
                              <h3 className="text-base font-black text-slate-900 mt-1 leading-snug truncate">
                                {item.name}
                              </h3>
                            </div>
                            <span className="text-base sm:text-lg font-black text-[#0a529e] shrink-0">
                              {item.formattedPrice}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg">
                            {(
                              [
                                {
                                  id: 'available',
                                  label: 'Disponible',
                                  active: 'bg-emerald-600 text-white',
                                },
                                {
                                  id: 'sold_out',
                                  label: 'Agotado',
                                  active: 'bg-amber-400 text-slate-950',
                                },
                                {
                                  id: 'hidden',
                                  label: 'Oculto',
                                  active: 'bg-slate-700 text-white',
                                },
                              ] as const
                            ).map((st) => (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => setProductAvailability(item.id, st.id)}
                                className={`px-2 py-1 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                                  avail === st.id
                                    ? st.active
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {st.label}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(item);
                                setIsProductModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0a529e] text-xs font-extrabold cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingItem(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold cursor-pointer"
                              aria-label={`Eliminar ${item.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'qr' && <QrCodeManager />}
        {activeTab === 'settings' && <BackupSettingsPanel />}
      </main>

      <ProductFormModal
        isOpen={isProductModalOpen}
        initialItem={editingItem}
        categories={categories}
        defaultCategoryId={categoryFilter}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveProduct}
        onUploadImage={uploadProductImage}
      />

      {deletingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setDeletingItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                ¿Eliminar “{deletingItem.name}”?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Esta acción quitará el plato del menú. Si solo se acabó por hoy, te recomendamos
                marcarlo como <strong>“Agotado”</strong> u <strong>“Oculto”</strong> en lugar de
                eliminarlo.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm cursor-pointer"
              >
                Sí, eliminar producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
