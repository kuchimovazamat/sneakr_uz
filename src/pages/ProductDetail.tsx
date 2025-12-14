import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, Product } from '@/services/api';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await api.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/catalog" className="btn-primary">
            {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const discountPercent = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    toast.success(t('products.linkCopied'));
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShare = (platform: 'telegram' | 'whatsapp') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${product.brand} ${product.name} - ${formatPrice(product.price)} ${t('common.currency')}`);
    
    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    }
    setShowShareMenu(false);
  };

  const handleOrder = () => {
    if (!selectedSize) {
      toast.error(language === 'uz' ? 'O\'lchamni tanlang' : 'Выберите размер');
      return;
    }
    navigate(`/checkout/${product.id}?size=${selectedSize}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-sneaker-light mb-4">
                <img
                  src={product.images[selectedImage]?.image_url || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img: { image_url: string }, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden transition-all ${
                        selectedImage === idx
                          ? 'ring-2 ring-primary'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                </div>

                {/* Share button */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-card rounded-xl shadow-lg border border-border p-2 min-w-[180px] z-10 animate-fade-in">
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {t('products.copyLink')}
                      </button>
                      <button
                        onClick={() => handleShare('telegram')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.832.942z"/>
                        </svg>
                        Telegram
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-6">
                {product.is_new && (
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-lg">
                    {t('nav.new')}
                  </span>
                )}
                {product.is_sale && discountPercent > 0 && (
                  <span className="discount-badge">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)} {t('common.currency')}
                </span>
                {product.original_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {/* Size selection */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">{t('products.size')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeObj: { size: number }) => (
                    <button
                      key={sizeObj.size}
                      onClick={() => setSelectedSize(sizeObj.size)}
                      className={`w-14 h-12 rounded-xl text-sm font-medium transition-all ${
                        selectedSize === sizeObj.size
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {sizeObj.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3">{t('products.description')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description[language]}
                </p>
              </div>

              {/* Order button */}
              <button onClick={handleOrder} className="w-full btn-primary text-lg py-4">
                {t('products.orderNow')}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
