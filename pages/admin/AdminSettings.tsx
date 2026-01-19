import React from 'react';

const AdminSettings: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main-light dark:text-white mb-6">Configurações</h1>
            <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-gray-400">settings</span>
                </div>
                <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">Página em Construção</h3>
                <p className="text-text-secondary-light dark:text-gray-400 max-w-md mx-auto">
                    Em breve você poderá ajustar as configurações do portal por aqui.
                </p>
            </div>
        </div>
    );
};

export default AdminSettings;
