import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white pt-16 pb-8 dark:bg-surface-dark border-t border-stone-100 dark:border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 md:grid-cols-2">
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <Logo />
                        </Link>
                        <p className="text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark pr-4 font-normal">
                            Empoderar e promover a autonomia dos povos e comunidades tradicionais, fomentando o desenvolvimento social, econômico e ambiental de forma integrada e contínua, respeitando e fortalecendo os modos de vida tradicionais.
                        </p>
                        {/* Redes sociais removidas */}
                    </div>
                    <div>
                        <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-text-main-light dark:text-white mb-6">Navegação</h3>
                        <ul className="space-y-3">
                            <li><Link to="/quem-somos" className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">Sobre Nós</Link></li>
                            <li><Link to="/projetos" className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">Nossos Projetos</Link></li>
                            <li><a href="/assets/img/estatuto.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">Estatuto</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-text-main-light dark:text-white mb-6">Canais de Atendimento</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-xl mt-0.5">call</span>
                                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Telefone: 22 99224-8011</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-xl mt-0.5">location_on</span>
                                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Sede: Estrada da Pedra Riscada s/n - Lumiar - Nova Friburgo Cep: 28616080</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-xs text-gray-400 text-center md:text-left">
                            © 2024 Conexão Ancestral. Todos os direitos reservados. ONG sem fins lucrativos.
                        </p>
                        <div className="flex gap-6 text-xs text-gray-500 dark:text-gray-400">
                            <Link to="/" className="hover:text-primary transition-colors">Política de Privacidade</Link>
                            <Link to="/" className="hover:text-primary transition-colors">Termos de Uso</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;