import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Tag, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, Product } from '@/services/api';
import { toast } from 'sonner';

const Checkout = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const selectedSize = searchParams.get('size');

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

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    paymentMethod: 'card' as 'card' | 'cash',
    coupon: '',
  });
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg">{t('common.loading') || 'Loading...'}</p>
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

  const applyCoupon = () => {
    // Demo coupon codes
    const coupons: Record<string, number> = {
      'SALE10': 10,
      'SALE20': 20,
      'FIRST': 15,
    };

    const couponDiscount = coupons[formData.coupon.toUpperCase()];
    if (couponDiscount) {
      setDiscount(couponDiscount);
      setCouponApplied(true);
      toast.success(`-${couponDiscount}%`);
    } else {
      toast.error('Invalid coupon');
    }
  };

  const finalPrice = product.price * (1 - discount / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer_name: formData.fullName,
        customer_email: '', // Optional field
        customer_phone: formData.phone,
        shipping_address: '', // Add these fields to the form if needed
        shipping_city: '',
        shipping_postal_code: '',
        total_amount: finalPrice,
        notes: `Payment method: ${formData.paymentMethod}${formData.coupon ? `, Coupon: ${formData.coupon}` : ''}`,
        items: [
          {
            product_id: product.id,
            size: parseInt(selectedSize),
            quantity: 1,
            price: parseFloat(String(product.price))
          }
        ]
      };

      console.log('Sending order data:', orderData);
      const response = await api.createOrder(orderData);
      console.log('Order response:', response);
      setOrderSuccess(true);
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('checkout.success')}</h1>
              <p className="text-muted-foreground mb-8">{t('checkout.successMsg')}</p>
              
              {/* Order summary */}
              <div className="bg-muted rounded-2xl p-6 text-left mb-8">
                <div className="flex gap-4 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm">{t('products.size')}: {selectedSize}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t('products.price')}:</span>
                    <span>{formatPrice(finalPrice)} {t('common.currency')}</span>
                  </div>
                </div>
              </div>

              <Link to="/" className="btn-primary inline-block">
                {t('nav.home')}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </button>

          <div className="max-w-2xl mx-auto">
            <h1 className="section-title mb-8">{t('checkout.title')}</h1>

            {/* Product summary */}
            <div className="bg-muted rounded-2xl p-6 mb-8">
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <p className="font-semibold text-lg">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{t('products.size')}: {selectedSize}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold">{formatPrice(product.price)} {t('common.currency')}</span>
                    {discount > 0 && (
                      <span className="text-sm text-green-600 font-medium">-{discount}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('checkout.fullName')}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ism Familiya"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('checkout.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+998 90 123 45 67"
                />
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  {t('checkout.payment')}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">{t('checkout.card')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      formData.paymentMethod === 'cash'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span className="font-medium">{t('checkout.cash')}</span>
                  </button>
                </div>
              </div>

              {/* Coupon */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('checkout.coupon')}
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.coupon}
                      onChange={(e) => setFormData({ ...formData, coupon: e.target.value })}
                      disabled={couponApplied}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      placeholder="SALE10"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponApplied || !formData.coupon}
                    className="px-6 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors disabled:opacity-50"
                  >
                    {t('checkout.apply')}
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-foreground text-background rounded-2xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span>{t('products.price')}</span>
                  <span>{formatPrice(product.price)} {t('common.currency')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center mb-2 text-green-400">
                    <span>{t('checkout.coupon')}</span>
                    <span>-{discount}%</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-background/20">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold">
                    {formatPrice(finalPrice)} {t('common.currency')}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50"
              >
                {isSubmitting ? '...' : t('checkout.confirm')}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
