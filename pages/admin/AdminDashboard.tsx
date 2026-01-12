import React from 'react';

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main-light dark:text-white mb-6">Visão Geral</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-text-secondary-light dark:text-gray-400 text-sm font-medium">Total de Projetos</p>
                            <h3 className="text-3xl font-bold text-text-main-light dark:text-white mt-2">--</h3>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400">forest</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-text-secondary-light dark:text-gray-400 text-sm font-medium">Total Arrecadado</p>
                            <h3 className="text-3xl font-bold text-text-main-light dark:text-white mt-2">R$ --</h3>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">savings</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-text-secondary-light dark:text-gray-400 text-sm font-medium">Doadores Ativos</p>
                            <h3 className="text-3xl font-bold text-text-main-light dark:text-white mt-2">--</h3>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">group</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-gray-400">construction</span>
                </div>
                <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">Painel em Construção</h3>
                <p className="text-text-secondary-light dark:text-gray-400 max-w-md mx-auto">
                    Em breve você terá acesso a estatísticas detalhadas e relatórios completos sobre a plataforma.
                    Por enquanto, utilize a aba <strong>Projetos</strong> para gerenciar o conteúdo.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
