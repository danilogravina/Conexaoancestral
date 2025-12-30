import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

interface HeaderProps {
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#e7f3eb] dark:border-[#1e3a29] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="mx-auto flex h-28 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-8">
                <div className="flex-1 flex justify-start">
                    <Link to="/" className="block">
                        <Logo />
                    </Link>
                </div>

                <nav className="hidden lg:flex items-center gap-10">
                    <Link to="/" className={`relative text-sm font-bold transition-all duration-300 group ${isActive('/') && location.pathname === '/' ? 'text-donate-red' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'}`}>
                        Início
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-donate-red transition-all duration-300 ${isActive('/') && location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                    <Link to="/quem-somos" className={`relative text-sm font-bold transition-all duration-300 group ${isActive('/quem-somos') ? 'text-donate-red' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'}`}>
                        Sobre Nós
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-donate-red transition-all duration-300 ${isActive('/quem-somos') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                    <Link to="/projetos" className={`relative text-sm font-bold transition-all duration-300 group ${isActive('/projetos') ? 'text-donate-red' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'}`}>
                        Projetos
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-donate-red transition-all duration-300 ${isActive('/projetos') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                    <Link to="/transparencia" className={`relative text-sm font-bold transition-all duration-300 group ${isActive('/transparencia') ? 'text-donate-red' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'}`}>
                        Transparência
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-donate-red transition-all duration-300 ${isActive('/transparencia') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                    <Link to="/blog" className={`relative text-sm font-bold transition-all duration-300 group ${isActive('/blog') ? 'text-donate-red' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'}`}>
                        Blog
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-donate-red transition-all duration-300 ${isActive('/blog') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                </nav>

                <div className="flex-1 flex justify-end">
                    <div className="flex items-center gap-6">
                        {/* Desktop Search Bar */}
                        <div className="hidden lg:block relative group mr-2">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors text-xl">search</span>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-28 xl:w-36 pl-10 pr-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-black/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium placeholder-gray-500 text-text-main-light dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                            />
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-main-light dark:text-text-main-dark transition-colors"
                            aria-label="Toggle Theme"
                        >
                            <span className="material-symbols-outlined dark:hidden">dark_mode</span>
                            <span className="material-symbols-outlined hidden dark:block">light_mode</span>
                        </button>

                        {/* User Profile / Login Link */}
                        <Link
                            to="/login"
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-main-light dark:text-text-main-dark transition-colors"
                            aria-label="Login / Minha Conta"
                            title="Login / Minha Conta"
                        >
                            <span className="material-symbols-outlined">person</span>
                        </Link>

                        {/* Link to main projects page */}
                        <Link to="/projetos" className="hidden sm:flex h-12 items-center justify-center rounded-xl bg-donate-red px-6 xl:px-8 text-base font-extrabold text-white shadow-lg shadow-donate-red/25 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-donate-red/40 transition-all duration-200 whitespace-nowrap">
                            Doar Agora
                        </Link>

                        <button
                            className="lg:hidden p-3 text-text-main-light dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="material-symbols-outlined text-3xl">{isMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
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
                        <Link to="/transparencia" onClick={() => setIsMenuOpen(false)} className={`text-lg font-bold p-3 rounded-lg transition-all ${isActive('/transparencia') ? 'bg-donate-red/10 text-donate-red border-l-4 border-donate-red' : 'text-text-main-light dark:text-white hover:bg-primary/5'}`}>Transparência</Link>
                        <Link to="/blog" onClick={() => setIsMenuOpen(false)} className={`text-lg font-bold p-3 rounded-lg transition-all ${isActive('/blog') ? 'bg-donate-red/10 text-donate-red border-l-4 border-donate-red' : 'text-text-main-light dark:text-white hover:bg-primary/5'}`}>Blog</Link>
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