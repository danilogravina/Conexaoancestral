import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const currentLang = i18n.language || 'pt';

    const languages = [
        { code: 'pt', label: 'PT', flag: 'https://flagcdn.com/w20/br.png' },
        { code: 'en', label: 'EN', flag: 'https://flagcdn.com/w20/us.png' }
    ];

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLanguageChange = (code: string) => {
        changeLanguage(code);
        setIsOpen(false);
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedLang = languages.find(l => currentLang.startsWith(l.code)) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 rounded-full pl-2 pr-3 py-1.5 border border-white/20 backdrop-blur-sm transition-all"
            >
                <img
                    src={selectedLang.flag}
                    alt={selectedLang.label}
                    className="w-5 h-auto rounded-sm shadow-sm"
                />
                <span className="text-sm font-bold text-white">{selectedLang.label}</span>
                <span className="material-symbols-outlined text-white text-lg leading-none">expand_more</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${currentLang.startsWith(lang.code) ? 'bg-primary/5 text-primary font-bold' : 'text-text-main-light dark:text-white'}`}
                        >
                            <img
                                src={lang.flag}
                                alt={lang.label}
                                className="w-5 h-auto rounded-sm shadow-sm"
                            />
                            <span className="text-sm">{lang.label === 'PT' ? 'Português' : 'English'}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
