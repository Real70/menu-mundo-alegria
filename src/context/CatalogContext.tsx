import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { CATEGORIES as DEFAULT_CATEGORIES, MENU_ITEMS as DEFAULT_ITEMS, formatCOP, slugify } from '../data/menuData';
import type { CatalogData, Category, MenuItem, ProductAvailability } from '../types/menu';

const STORAGE_KEY = 'mundo_alegria_catalog_v1';
const PIN_STORAGE_KEY = 'mundo_alegria_owner_pin_v1';
const DEFAULT_PIN = '1234';

type SyncStatus = 'synced' | 'saving' | 'local_only' | 'error';

export interface ProductInput {
  id?: string;
  name: string;
  categoryId: string;
  price: number;
  description: string;
  imageUrl: string;
  badge?: string;
  serves?: string;
  availability?: ProductAvailability;
}

export interface CategoryInput {
  id?: string;
  name: string;
  iconName: Category['iconName'];
  description: string;
}

interface CatalogContextValue {
  categories: Category[];
  items: MenuItem[];
  isLoading: boolean;
  syncStatus: SyncStatus;
  lastSavedAt: string | null;
  addProduct: (input: ProductInput) => Promise<MenuItem>;
  updateProduct: (id: string, input: ProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setProductAvailability: (id: string, availability: ProductAvailability) => Promise<void>;
  addCategory: (input: CategoryInput) => Promise<Category>;
  updateCategory: (id: string, input: CategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<{ ok: boolean; error?: string }>;
  reorderCategory: (id: string, direction: 'up' | 'down') => Promise<void>;
  uploadProductImage: (file: File) => Promise<string>;
  exportCatalogJson: () => void;
  importCatalogJson: (jsonText: string) => Promise<{ ok: boolean; error?: string }>;
  resetToDefaultCatalog: () => Promise<void>;
  verifyAdminPin: (pin: string) => boolean;
  updateAdminPin: (newPin: string) => void;
  isDefaultPin: boolean;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

function normalizeItems(items: MenuItem[], categories: Category[]): MenuItem[] {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  return items.map((item) => ({
    ...item,
    price: Number(item.price) || 0,
    formattedPrice: formatCOP(Number(item.price) || 0),
    categoryName: categoryMap.get(item.categoryId) || item.categoryName || 'General',
    availability: item.availability || 'available',
  }));
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [items, setItems] = useState<MenuItem[]>(DEFAULT_ITEMS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  });

  const persistCatalog = useCallback(
    async (nextCategories: Category[], nextItems: MenuItem[]) => {
      const normalized = normalizeItems(nextItems, nextCategories);
      setCategories(nextCategories);
      setItems(normalized);
      setSyncStatus('saving');

      const payload: CatalogData = {
        categories: nextCategories,
        items: normalized,
        updatedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage quota errors
      }

      try {
        const res = await fetch('/api/catalog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setLastSavedAt(data.updatedAt || payload.updatedAt);
          setSyncStatus('synced');
        } else {
          setLastSavedAt(payload.updatedAt);
          setSyncStatus('local_only');
        }
      } catch {
        setLastSavedAt(payload.updatedAt);
        setSyncStatus('local_only');
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    async function loadInitialCatalog() {
      try {
        const res = await fetch('/api/catalog');
        if (res.ok) {
          const data = (await res.json()) as CatalogData;
          if (mounted && Array.isArray(data.categories) && Array.isArray(data.items)) {
            const norm = normalizeItems(data.items, data.categories);
            setCategories(data.categories);
            setItems(norm);
            setLastSavedAt(data.updatedAt || null);
            setSyncStatus('synced');
            try {
              localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ categories: data.categories, items: norm, updatedAt: data.updatedAt })
              );
            } catch {
              // ignore
            }
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to localStorage if API is unavailable
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CatalogData;
          if (mounted && Array.isArray(parsed.categories) && Array.isArray(parsed.items)) {
            setCategories(parsed.categories);
            setItems(normalizeItems(parsed.items, parsed.categories));
            setLastSavedAt(parsed.updatedAt || null);
            setSyncStatus('local_only');
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to default data
      }

      if (mounted) {
        setCategories(DEFAULT_CATEGORIES);
        setItems(normalizeItems(DEFAULT_ITEMS, DEFAULT_CATEGORIES));
        setIsLoading(false);
      }
    }

    loadInitialCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  const addProduct = useCallback(
    async (input: ProductInput): Promise<MenuItem> => {
      const baseId = slugify(input.id || input.name);
      let uniqueId = baseId;
      let counter = 2;
      while (items.some((it) => it.id === uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }

      const category = categories.find((c) => c.id === input.categoryId);
      const newItem: MenuItem = {
        id: uniqueId,
        name: input.name.trim(),
        categoryId: input.categoryId,
        categoryName: category?.name || 'General',
        price: Math.max(0, Math.round(Number(input.price) || 0)),
        formattedPrice: formatCOP(input.price),
        description: input.description.trim(),
        imageUrl: input.imageUrl.trim() || '/assets/logo.svg',
        badge: input.badge?.trim() || undefined,
        serves: input.serves?.trim() || undefined,
        availability: input.availability || 'available',
      };

      const nextItems = [...items, newItem];
      await persistCatalog(categories, nextItems);
      return newItem;
    },
    [categories, items, persistCatalog]
  );

  const updateProduct = useCallback(
    async (id: string, input: ProductInput): Promise<void> => {
      const category = categories.find((c) => c.id === input.categoryId);
      const nextItems = items.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          name: input.name.trim(),
          categoryId: input.categoryId,
          categoryName: category?.name || item.categoryName,
          price: Math.max(0, Math.round(Number(input.price) || 0)),
          formattedPrice: formatCOP(input.price),
          description: input.description.trim(),
          imageUrl: input.imageUrl.trim() || item.imageUrl,
          badge: input.badge?.trim() || undefined,
          serves: input.serves?.trim() || undefined,
          availability: input.availability || 'available',
        };
      });
      await persistCatalog(categories, nextItems);
    },
    [categories, items, persistCatalog]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<void> => {
      const nextItems = items.filter((item) => item.id !== id);
      await persistCatalog(categories, nextItems);
    },
    [categories, items, persistCatalog]
  );

  const setProductAvailability = useCallback(
    async (id: string, availability: ProductAvailability): Promise<void> => {
      const nextItems = items.map((item) => (item.id === id ? { ...item, availability } : item));
      await persistCatalog(categories, nextItems);
    },
    [categories, items, persistCatalog]
  );

  const addCategory = useCallback(
    async (input: CategoryInput): Promise<Category> => {
      const baseId = slugify(input.id || input.name);
      let uniqueId = baseId;
      let counter = 2;
      while (categories.some((c) => c.id === uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }

      const newCategory: Category = {
        id: uniqueId,
        name: input.name.trim(),
        iconName: input.iconName,
        description: input.description.trim(),
      };

      const nextCategories = [...categories, newCategory];
      await persistCatalog(nextCategories, items);
      return newCategory;
    },
    [categories, items, persistCatalog]
  );

  const updateCategory = useCallback(
    async (id: string, input: CategoryInput): Promise<void> => {
      const nextCategories = categories.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              name: input.name.trim(),
              iconName: input.iconName,
              description: input.description.trim(),
            }
          : cat
      );
      await persistCatalog(nextCategories, items);
    },
    [categories, items, persistCatalog]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<{ ok: boolean; error?: string }> => {
      const associatedCount = items.filter((it) => it.categoryId === id).length;
      if (associatedCount > 0) {
        return {
          ok: false,
          error: `No puedes eliminar esta categoría porque tiene ${associatedCount} plato(s) asociado(s). Mueve o elimina esos platos primero.`,
        };
      }
      const nextCategories = categories.filter((c) => c.id !== id);
      await persistCatalog(nextCategories, items);
      return { ok: true };
    },
    [categories, items, persistCatalog]
  );

  const reorderCategory = useCallback(
    async (id: string, direction: 'up' | 'down'): Promise<void> => {
      const idx = categories.findIndex((c) => c.id === id);
      if (idx === -1) return;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= categories.length) return;

      const nextCategories = [...categories];
      const [moved] = nextCategories.splice(idx, 1);
      nextCategories.splice(targetIdx, 0, moved);
      await persistCatalog(nextCategories, items);
    },
    [categories, items, persistCatalog]
  );

  const uploadProductImage = useCallback(async (file: File): Promise<string> => {
    const rawDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen'));
      reader.readAsDataURL(file);
    });

    // Compresión inteligente en Canvas (máx. 900px) para rapidez en la nube (Cloudflare KV) y local
    const dataUrl = await new Promise<string>((resolve) => {
      if (file.type === 'image/svg+xml') {
        resolve(rawDataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const maxDim = 900;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    });

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, dataUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          return data.imageUrl;
        }
      }
    } catch {
      // Fallback to dataUrl when static-only
    }
    return dataUrl;
  }, []);

  const exportCatalogJson = useCallback(() => {
    const payload: CatalogData = {
      categories,
      items,
      updatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `menu-mundo-alegria-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [categories, items]);

  const importCatalogJson = useCallback(
    async (jsonText: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const parsed = JSON.parse(jsonText);
        if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.items)) {
          return {
            ok: false,
            error: 'El archivo JSON no contiene las listas "categories" e "items" válidas.',
          };
        }
        await persistCatalog(parsed.categories, parsed.items);
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: `Error al leer el archivo JSON: ${err instanceof Error ? err.message : String(err)}`,
        };
      }
    },
    [persistCatalog]
  );

  const resetToDefaultCatalog = useCallback(async () => {
    await persistCatalog(DEFAULT_CATEGORIES, DEFAULT_ITEMS);
  }, [persistCatalog]);

  const verifyAdminPin = useCallback(
    (inputPin: string) => {
      return inputPin.trim() === adminPin;
    },
    [adminPin]
  );

  const updateAdminPin = useCallback((newPin: string) => {
    const clean = newPin.trim();
    if (!clean) return;
    setAdminPin(clean);
    try {
      localStorage.setItem(PIN_STORAGE_KEY, clean);
    } catch {
      // ignore
    }
  }, []);

  return (
    <CatalogContext.Provider
      value={{
        categories,
        items,
        isLoading,
        syncStatus,
        lastSavedAt,
        addProduct,
        updateProduct,
        deleteProduct,
        setProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategory,
        uploadProductImage,
        exportCatalogJson,
        importCatalogJson,
        resetToDefaultCatalog,
        verifyAdminPin,
        updateAdminPin,
        isDefaultPin: adminPin === DEFAULT_PIN,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog debe usarse dentro de un CatalogProvider');
  }
  return ctx;
}
