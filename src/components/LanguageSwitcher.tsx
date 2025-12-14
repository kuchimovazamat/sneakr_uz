import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <button
        onClick={() => setLanguage('uz')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          language === 'uz'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        🇺🇿 UZ
      </button>
      <button
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          language === 'ru'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        🇷🇺 RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;
