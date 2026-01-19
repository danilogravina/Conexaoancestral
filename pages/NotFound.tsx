import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark py-20">
            <div className="flex flex-col items-center gap-6 max-w-lg mx-auto text-center px-6">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-main-light dark:text-white mb-2">Página não encontrada</h1>
                    <p className="text-text-secondary-light dark:text-gray-400">
                        O conteúdo que você tentou acessar não existe ou foi movido.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors"
                    >
                        Voltar ao início
                    </Link>
                    <Link
                        to="/contato"
                        className="px-6 py-3 rounded-lg border border-stone-200 dark:border-white/10 text-text-main-light dark:text-white font-bold hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Fale conosco
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
