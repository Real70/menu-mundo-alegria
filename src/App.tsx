import { useEffect, useMemo, useState } from 'react';
import { ArrowUp, CircleAlert } from 'lucide-react';
import type { MenuItem } from './types/menu';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { Header } from './components/Header';
import { BibleVerseCard } from './components/BibleVerseCard';
import { SearchBar } from './components/SearchBar';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { CategoryIcon } from './components/CategoryIcon';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const ADMIN_SESSION_KEY = 'mundo_alegria_admin_authenticated';

function MenuAndAdminRouter() {
  const { categories, items } = useCatalog();
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.pathname.startsWith('/admin') || window.location.hash === '#admin'
    );
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isPrintingAll, setIsPrintingAll] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(
        window.location.pathname.startsWith('/admin') || window.location.hash === '#admin'
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0 });
  };

  const navigateToPublicMenu = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0 });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
    navigateToPublicMenu();
  };

  const publicItems = useMemo(() => {
    return items.filter((item) => item.availability !== 'hidden');
  }, [items]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: publicItems.length };
    categories.forEach((cat) => {
      counts[cat.id] = publicItems.filter((item) => item.categoryId === cat.id).length;
    });
    return counts;
  }, [categories, publicItems]);

  const filteredItems = useMemo(() => {
    if (isPrintingAll) {
      return publicItems;
    }
    return publicItems.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [publicItems, searchQuery, selectedCategory, isPrintingAll]);

  const groupedSections = useMemo(() => {
    if (!isPrintingAll && selectedCategory !== 'all') {
      const category = categories.find((c) => c.id === selectedCategory);
      if (!category) return [];
      const sectionItems = filteredItems.filter((item) => item.categoryId === category.id);
      return sectionItems.length > 0 ? [{ ...category, items: sectionItems }] : [];
    }
    return categories
      .map((category) => {
        const sectionItems = filteredItems.filter((item) => item.categoryId === category.id);
        return { ...category, items: sectionItems };
      })
      .filter((section) => section.items.length > 0);
  }, [categories, selectedCategory, filteredItems, isPrintingAll]);

  const handlePrintMenu = () => {
    setSelectedItem(null);
    setIsPrintingAll(true);
    setTimeout(() => {
      window.print();
      setIsPrintingAll(false);
    }, 180);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (searchQuery) {
      setSearchQuery('');
    }
    if (categoryId === 'all') {
      const el = document.getElementById('menu-content');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const el = document.getElementById(`seccion-${categoryId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return <AdminLogin onSuccess={handleLoginSuccess} onBackToMenu={navigateToPublicMenu} />;
    }
    return <AdminDashboard onBackToMenu={navigateToPublicMenu} onLogout={handleLogout} />;
  }

  return (
    <div className="app-print-root relative min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <div className="relative z-10 flex-1 flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-5">
        <div className="mb-5">
          <BibleVerseCard />
        </div>

        <div className="mb-4 print-hide print:hidden">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalResults={filteredItems.length}
          />
        </div>

        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          categoryCounts={categoryCounts}
        />

        <div id="menu-content" className="mt-6 space-y-10">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center max-w-md mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <CircleAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No se encontraron productos</h3>
              <p className="text-xs text-slate-500 mt-1">
                No hay platos que coincidan con tu búsqueda “{searchQuery}”.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#0a529e] text-white text-xs font-bold hover:bg-[#073d77] transition-colors"
              >
                Ver todo el menú
              </button>
            </div>
          ) : (
            groupedSections.map((section) => (
              <section key={section.id} id={`seccion-${section.id}`} className="scroll-mt-20">
                <div className="flex items-center justify-between gap-3 border-b-2 border-slate-200/70 pb-2.5 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-2xs">
                      <CategoryIcon
                        iconName={section.iconName}
                        className="w-5 h-5 text-amber-500"
                        useCrossedForUtensils
                      />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        {section.name}
                      </h2>
                      {section.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">{section.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#0a529e] bg-blue-50 px-2.5 py-1 rounded-full shrink-0">
                    {section.items.length} {section.items.length === 1 ? 'plato' : 'platos'}
                  </span>
                </div>

                <div className="flex flex-col gap-3.5 sm:gap-4">
                  {section.items.map((item, idx) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      index={idx}
                      onOpenDetail={(it) => setSelectedItem(it)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      <ProductDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <FloatingWhatsApp onPrintMenu={handlePrintMenu} />

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Volver arriba"
          className="print-hide print:hidden fixed bottom-6 right-5 z-40 w-11 h-11 rounded-full bg-[#0a529e] text-white shadow-lg hover:bg-[#073d77] active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <Footer onOpenAdmin={navigateToAdmin} />
      </div>
    </div>
  );
}

export function App() {
  return (
    <CatalogProvider>
      <MenuAndAdminRouter />
    </CatalogProvider>
  );
}

export default App;
