import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Shield, Truck, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { api, Product } from '@/services/api';
import heroSneaker from '@/assets/hero-sneaker.jpg';

const Index = () => {
  const { t } = useLanguage();
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

  const featuredProducts = products.slice(0, 4);
  const newProducts = products.filter(p => p.is_new);

  const categories = [
    { key: 'men', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80', path: '/catalog?category=men' },
    { key: 'women', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80', path: '/catalog?category=women' },
    { key: 'new', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', path: '/catalog?filter=new' },
    { key: 'sale', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80', path: '/catalog?filter=sale' },
  ];

  const whyChooseUs = [
    { icon: Shield, titleKey: 'why.original', descKey: 'why.originalDesc' },
    { icon: Truck, titleKey: 'why.delivery', descKey: 'why.deliveryDesc' },
    { icon: CreditCard, titleKey: 'why.easy', descKey: 'why.easyDesc' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[80vh] py-12">
            {/* Text */}
            <div className="animate-slide-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
                {t('hero.title')}
                <br />
                <span className="text-primary">{t('hero.subtitle')}</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                {t('why.originalDesc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/catalog" className="btn-primary inline-flex items-center gap-2">
                  {t('hero.cta')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/catalog" className="btn-outline inline-flex items-center gap-2">
                  {t('hero.explore')}
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative z-10">
                <img
                  src={heroSneaker}
                  alt="Premium Sneaker"
                  className="w-full max-w-xl mx-auto animate-float"
                />
              </div>
              {/* Decorative circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 bg-sneaker-light">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">{t('categories.title')}</h2>
            <Link to="/catalog" className="hidden md:flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
              {t('common.viewAll')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                to={cat.path}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={t(`categories.${cat.key}`)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-background font-semibold text-lg md:text-xl">
                    {t(`categories.${cat.key}`)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">{t('products.featured')}</h2>
            <Link to="/catalog" className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
              {t('common.viewAll')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12 text-background">{t('why.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={item.titleKey}
                className="text-center p-8 rounded-2xl bg-background/5 hover:bg-background/10 transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-2xl flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t(item.titleKey)}</h3>
                <p className="text-background/70">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="section-title">{t('products.new')}</h2>
              <Link to="/catalog?filter=new" className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
                {t('common.viewAll')}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
