import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

interface HeaderProps {
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isHomePage = location.pathname === '/';

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    const headerBgClass = isHomePage
        ? (isScrolled ? 'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm' : 'bg-transparent')
        : 'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm';

    const headerTextClass = isHomePage && !isScrolled ? 'text-white' : 'text-text-secondary-light dark:text-text-secondary-dark';

    return (
        <header className={`${isHomePage ? 'fixed' : 'sticky'} top-0 z-50 w-full transition-all duration-300 ease-in-out ${isHomePage && !isScrolled ? 'pt-4 px-4' : ''} ${headerBgClass}`}>
            <div className={`mx-auto flex h-24 md:h-28 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12 transition-all duration-300 ease-in-out ${isHomePage && !isScrolled ? 'bg-primary/25 backdrop-blur-md rounded-[32px] border border-white/15 shadow-2xl' : ''}`}>
                {/* 1. Logo Section */}
                <div className="flex-1 flex justify-start">
                    <Link
                        to="/"
                        className="block scale-90 md:scale-100 transition-transform"
                        onClick={(e) => {
                            if (location.pathname === '/') {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    >
                        <Logo forceWhite={isHomePage && !isScrolled} />
                    </Link>
                </div>

                {/* 2. Desktop Navigation (Centered) */}
                <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
                    <Link to="/" className={`relative text-sm font-bold transition-all duration-300 group ${isActive('/') && location.pathname === '/' ? (isHomePage && !isScrolled ? 'text-white' : 'text-donate-red') : (isHomePage && !isScrolled ? 'text-white/90 hover:text-white' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary')}`}>
                        Início
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-donate-red transition-all duration-300 ${(isActive('/') && location.pathname === '/') ? 'w-full' : 'w-0 group-hover:w-full'} ${isHomePage && !isScrolled && 'bg-white'}`}></span>
                    </Link>
                    <Link to="/quem-somos" className={`relative text-sm font-bold transition-all duration-300 group ${isActive('/quem-somos') ? 'text-donate-red' : (isHomePage && !isScrolled ? 'text-white/90 hover:text-white' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary')}`}>
                        Sobre Nós
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-donate-red transition-all duration-300 ${isActive('/quem-somos') ? 'w-full' : 'w-0 group-hover:w-full'} ${isHomePage && !isScrolled && isActive('/quem-somos') && 'bg-white'}`}></span>
                    </Link>
                    <Link to="/projetos" className={`relative text-sm font-bold transition-all duration-300 group ${isActive('/projetos') ? 'text-donate-red' : (isHomePage && !isScrolled ? 'text-white/90 hover:text-white' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary')}`}>
                        Projetos
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-donate-red transition-all duration-300 ${isActive('/projetos') ? 'w-full' : 'w-0 group-hover:w-full'} ${isHomePage && !isScrolled && isActive('/projetos') && 'bg-white'}`}></span>
                    </Link>
                </nav>

                {/* 3. Actions Group (Right Aligned) */}
                <div className="flex items-center justify-end gap-3 sm:gap-6 flex-1">
                    {/* Desktop Search Bar */}
                    <div className="hidden lg:block relative group">
                        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors text-xl ${isHomePage && !isScrolled ? 'text-white/70 group-focus-within:text-white' : 'text-gray-500 dark:text-gray-400 group-focus-within:text-primary'}`}>search</span>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className={`w-28 xl:w-40 pl-10 pr-4 py-2.5 rounded-full border border-transparent outline-none transition-all text-sm font-medium placeholder-gray-500 ${isHomePage && !isScrolled ? 'bg-white/10 border-white/20 focus:bg-white/20 focus:border-white/40 text-white placeholder-white/50' : 'bg-stone-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:bg-white dark:focus:bg-black/20 focus:border-primary focus:ring-4 focus:ring-primary/10 text-text-main-light dark:text-white'}`}
                        />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2.5 rounded-full hover:bg-stone-50 dark:hover:bg-white/10 transition-colors ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-text-main-light dark:text-text-main-dark'}`}
                        aria-label="Alternar Tema"
                    >
                        <span className="material-symbols-outlined dark:hidden text-[22px]">dark_mode</span>
                        <span className="material-symbols-outlined hidden dark:block text-[22px]">light_mode</span>
                    </button>

                    {/* Login Link */}
                    <Link
                        to="/login"
                        className={`p-2.5 rounded-full hover:bg-stone-50 dark:hover:bg-white/10 transition-colors ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-text-main-light dark:text-text-main-dark'}`}
                        aria-label="Minha Conta"
                    >
                        <span className="material-symbols-outlined text-[26px]">person</span>
                    </Link>

                    {/* CTA Button */}
                    <Link to="/projetos" className="hidden sm:flex h-11 items-center justify-center rounded-xl bg-donate-red px-6 xl:px-8 text-sm font-extrabold text-white shadow-lg shadow-donate-red/25 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-donate-red/40 transition-all duration-200 whitespace-nowrap">
                        Doar Agora
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className={`lg:hidden p-2 rounded-xl transition-colors ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-text-main-light dark:text-white hover:bg-stone-50 dark:hover:bg-white/10'}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="material-symbols-outlined text-3xl">{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-28 left-0 w-full bg-background-light dark:bg-background-dark border-b border-[#e7f3eb] dark:border-[#1e3a29] p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-2 z-40 max-h-[calc(100vh-7rem)] overflow-y-auto">
                    {/* Mobile Search */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Buscar no site..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-primary outline-none transition-all text-text-main-light dark:text-white shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className={`text-lg font-bold p-3 rounded-lg transition-all ${isActive('/') && location.pathname === '/' ? 'bg-donate-red/10 text-donate-red border-l-4 border-donate-red' : 'text-text-main-light dark:text-white hover:bg-primary/5'}`}>Início</Link>
                        <Link to="/quem-somos" onClick={() => setIsMenuOpen(false)} className={`text-lg font-bold p-3 rounded-lg transition-all ${isActive('/quem-somos') ? 'bg-donate-red/10 text-donate-red border-l-4 border-donate-red' : 'text-text-main-light dark:text-white hover:bg-primary/5'}`}>Sobre Nós</Link>
                        <Link to="/projetos" onClick={() => setIsMenuOpen(false)} className={`text-lg font-bold p-3 rounded-lg transition-all ${isActive('/projetos') ? 'bg-donate-red/10 text-donate-red border-l-4 border-donate-red' : 'text-text-main-light dark:text-white hover:bg-primary/5'}`}>Projetos</Link>


                        <div className="border-t border-gray-100 dark:border-white/10 my-2"></div>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold p-3 hover:bg-primary/10 rounded-lg text-text-main-light dark:text-white transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined">login</span> Entrar / Minha Conta
                        </Link>
                    </div>
                    <Link to="/projetos" onClick={() => setIsMenuOpen(false)} className="w-full h-12 flex items-center justify-center rounded-xl bg-donate-red text-white font-extrabold shadow-lg hover:bg-red-600 transition-colors">Doar Agora</Link>
                </div>
            )}
        </header>
    );
};

export default Header;