import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uz' | 'ru';

interface Translations {
  [key: string]: {
    uz: string;
    ru: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { uz: 'Bosh sahifa', ru: 'Главная' },
  'nav.catalog': { uz: 'Katalog', ru: 'Каталог' },
  'nav.men': { uz: 'Erkaklar', ru: 'Мужские' },
  'nav.women': { uz: 'Ayollar', ru: 'Женские' },
  'nav.new': { uz: 'Yangi', ru: 'Новинки' },
  'nav.sale': { uz: 'Chegirma', ru: 'Скидки' },
  
  // Hero
  'hero.title': { uz: 'Original krossovkalar.', ru: 'Оригинальные кроссовки.' },
  'hero.subtitle': { uz: 'Haqiqiy qulaylik.', ru: 'Настоящий комфорт.' },
  'hero.cta': { uz: 'Xarid qilish', ru: 'Купить сейчас' },
  'hero.explore': { uz: "Ko'rish", ru: 'Смотреть' },
  
  // Products
  'products.featured': { uz: 'Mashhur modellar', ru: 'Популярные модели' },
  'products.new': { uz: 'Yangi kelganlar', ru: 'Новые поступления' },
  'products.orderNow': { uz: 'Buyurtma berish', ru: 'Заказать' },
  'products.addToCart': { uz: 'Savatga qo\'shish', ru: 'В корзину' },
  'products.size': { uz: "O'lcham", ru: 'Размер' },
  'products.price': { uz: 'Narx', ru: 'Цена' },
  'products.description': { uz: 'Tavsif', ru: 'Описание' },
  'products.share': { uz: 'Ulashish', ru: 'Поделиться' },
  'products.copyLink': { uz: 'Havolani nusxalash', ru: 'Копировать ссылку' },
  'products.linkCopied': { uz: 'Havola nusxalandi!', ru: 'Ссылка скопирована!' },
  
  // Categories
  'categories.title': { uz: 'Kategoriyalar', ru: 'Категории' },
  'categories.men': { uz: 'Erkaklar uchun', ru: 'Для мужчин' },
  'categories.women': { uz: 'Ayollar uchun', ru: 'Для женщин' },
  'categories.new': { uz: 'Yangi kolleksiya', ru: 'Новая коллекция' },
  'categories.sale': { uz: 'Chegirmalar', ru: 'Распродажа' },
  
  // Why choose us
  'why.title': { uz: 'Nega bizni tanlaysiz?', ru: 'Почему выбирают нас?' },
  'why.original': { uz: '100% Original', ru: '100% Оригинал' },
  'why.originalDesc': { uz: "Barcha mahsulotlar sertifikatlangan va haqiqiy", ru: 'Вся продукция сертифицирована и подлинная' },
  'why.delivery': { uz: 'Tez yetkazib berish', ru: 'Быстрая доставка' },
  'why.deliveryDesc': { uz: "O'zbekiston bo'ylab 1-3 kun ichida", ru: 'По всему Узбекистану за 1-3 дня' },
  'why.easy': { uz: 'Oson buyurtma', ru: 'Простой заказ' },
  'why.easyDesc': { uz: "Ro'yxatdan o'tmasdan buyurtma bering", ru: 'Заказывайте без регистрации' },
  
  // Checkout
  'checkout.title': { uz: 'Buyurtma berish', ru: 'Оформление заказа' },
  'checkout.fullName': { uz: 'Ismingiz', ru: 'Ваше имя' },
  'checkout.phone': { uz: 'Telefon raqami', ru: 'Номер телефона' },
  'checkout.payment': { uz: "To'lov usuli", ru: 'Способ оплаты' },
  'checkout.card': { uz: 'Karta orqali', ru: 'Картой' },
  'checkout.cash': { uz: 'Naqd pul', ru: 'Наличные' },
  'checkout.coupon': { uz: 'Promo kod', ru: 'Промокод' },
  'checkout.apply': { uz: "Qo'llash", ru: 'Применить' },
  'checkout.confirm': { uz: 'Buyurtmani tasdiqlash', ru: 'Подтвердить заказ' },
  'checkout.success': { uz: 'Buyurtma qabul qilindi!', ru: 'Заказ принят!' },
  'checkout.successMsg': { uz: 'Tez orada siz bilan bog\'lanamiz', ru: 'Мы свяжемся с вами в ближайшее время' },
  
  // Filters
  'filter.brand': { uz: 'Brend', ru: 'Бренд' },
  'filter.price': { uz: 'Narx', ru: 'Цена' },
  'filter.size': { uz: "O'lcham", ru: 'Размер' },
  'filter.sort': { uz: 'Saralash', ru: 'Сортировка' },
  'filter.newest': { uz: 'Eng yangi', ru: 'Новые' },
  'filter.priceLow': { uz: 'Arzon', ru: 'Дешевле' },
  'filter.priceHigh': { uz: 'Qimmat', ru: 'Дороже' },
  'filter.all': { uz: 'Barchasi', ru: 'Все' },
  
  // Footer
  'footer.contact': { uz: "Bog'lanish", ru: 'Контакты' },
  'footer.follow': { uz: 'Bizni kuzating', ru: 'Следите за нами' },
  'footer.rights': { uz: 'Barcha huquqlar himoyalangan', ru: 'Все права защищены' },
  
  // Common
  'common.currency': { uz: "so'm", ru: 'сум' },
  'common.viewAll': { uz: "Barchasini ko'rish", ru: 'Смотреть все' },
  'common.back': { uz: 'Orqaga', ru: 'Назад' },
  'common.close': { uz: 'Yopish', ru: 'Закрыть' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
