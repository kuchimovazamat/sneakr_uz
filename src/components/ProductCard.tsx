import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/services/api';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useLanguage();

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('uz-UZ').format(numPrice);
  };

  const discountPercent = product.original_price
    ? Math.round((1 - (typeof product.price === 'string' ? parseFloat(product.price) : product.price) / (typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price)) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="sneaker-card">
        {/* Image container */}
        <div className="relative aspect-square bg-sneaker-light overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-lg">
                {t('nav.new')}
              </span>
            )}
            {product.is_sale && discountPercent > 0 && (
              <span className="discount-badge">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)} {t('common.currency')}
            </span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
