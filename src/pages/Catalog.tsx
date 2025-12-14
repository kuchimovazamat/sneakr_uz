import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { api, Product } from '@/services/api';

const Catalog = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract unique brands and sizes from products
  const brands = useMemo(() => {
    const brandSet = new Set(products.map(p => p.brand));
    return Array.from(brandSet);
  }, [products]);

  const sizes = useMemo(() => {
    const sizeSet = new Set<number>();
    products.forEach(p => {
      p.sizes.forEach((s: { size: number }) => sizeSet.add(s.size));
    });
    return Array.from(sizeSet).sort((a, b) => a - b);
  }, [products]);

  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');
  const brandParam = searchParams.get('brand');
  const sortParam = searchParams.get('sort') || 'newest';

  const [selectedBrands, setSelectedBrands] = useState<string[]>(brandParam ? [brandParam] : []);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (categoryParam === 'men') {
      result = result.filter(p => p.category === 'men' || p.category === 'unisex');
    } else if (categoryParam === 'women') {
      result = result.filter(p => p.category === 'women' || p.category === 'unisex');
    }

    // Special filters
    if (filterParam === 'new') {
      result = result.filter(p => p.is_new);
    } else if (filterParam === 'sale') {
      result = result.filter(p => p.is_sale);
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some((s: { size: number }) => selectedSizes.includes(s.size)));
    }

    // Price filter
    result = result.filter(p => {
      const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sorting
    if (sortParam === 'priceLow') {
      result.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return priceA - priceB;
      });
    } else if (sortParam === 'priceHigh') {
      result.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return priceB - priceA;
      });
    }

    return result;
  }, [categoryParam, filterParam, selectedBrands, selectedSizes, priceRange, sortParam, products]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setPriceRange([0, 5000000]);
    setSearchParams({});
  };

  const getPageTitle = () => {
    if (categoryParam === 'men') return t('categories.men');
    if (categoryParam === 'women') return t('categories.women');
    if (filterParam === 'new') return t('categories.new');
    if (filterParam === 'sale') return t('categories.sale');
    return t('nav.catalog');
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedSizes.length > 0 || categoryParam || filterParam;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="section-title">{getPageTitle()}</h1>
              <p className="text-muted-foreground mt-1">
                {filteredProducts.length} {t('products.featured').toLowerCase()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortParam}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    params.set('sort', e.target.value);
                    setSearchParams(params);
                  }}
                  className="appearance-none bg-muted px-4 py-2.5 pr-10 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">{t('filter.newest')}</option>
                  <option value="priceLow">{t('filter.priceLow')}</option>
                  <option value="priceHigh">{t('filter.priceHigh')}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Filter toggle (mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 bg-muted px-4 py-2.5 rounded-xl text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                {t('filter.brand')}
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : 'hidden'} md:block md:relative md:w-64 flex-shrink-0`}>
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h2 className="text-lg font-semibold">{t('filter.brand')}</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full mb-6 py-2 text-sm text-destructive hover:underline"
                >
                  {t('common.close')} ×
                </button>
              )}

              {/* Brand filter */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">{t('filter.brand')}</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size filter */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">{t('filter.size')}</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        selectedSizes.includes(size)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply button (mobile) */}
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden w-full btn-primary"
              >
                {t('checkout.apply')}
              </button>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    {t('filter.all')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
