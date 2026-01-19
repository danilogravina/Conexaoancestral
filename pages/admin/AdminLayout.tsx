import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../lib/supabase';

const AdminLayout: React.FC = () => {
    const { user } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
        { path: '/admin/projects', icon: 'forest', label: 'Projetos' },
        { path: '/admin/donations', icon: 'volunteer_activism', label: 'Doações' }, // Future placeholder
        { path: '/admin/settings', icon: 'settings', label: 'Configurações' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-[#0d1b12]">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-white/10">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/assets/img/logo.png" alt="Conexão Ancestral" className="h-8 w-auto" />
                        <span className="font-bold text-lg text-primary">Admin</span>
                    </Link>
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-3 p-3 mb-6 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <img
                            src={user?.avatar}
                            alt={user?.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-text-main-light dark:text-white truncate">{user?.fullName}</p>
                            <p className="text-xs text-text-secondary-light dark:text-gray-400 truncate">Administrador</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-text-secondary-light dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-main-light dark:hover:text-white'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-gray-100 dark:border-white/10">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Sair
                    </button>
                    <Link to="/" className="flex items-center gap-3 px-3 py-2.5 w-full mt-1 rounded-lg text-sm font-medium text-text-secondary-light dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">home</span>
                        Voltar ao Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Top Admin Bar */}
                <div className="sticky top-0 z-30 w-full bg-[#111827] text-white border-b border-black/30">
                    <div className="h-12 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/admin" className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                Painel
                            </Link>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(prev => !prev)}
                                    className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    Adicionar
                                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                </button>

                                {isAddOpen && (
                                    <div className="absolute left-0 mt-2 w-48 rounded-md bg-white text-text-main-light shadow-lg border border-gray-200 dark:bg-surface-dark dark:text-white dark:border-white/10">
                                        <Link
                                            to="/admin/projects/new"
                                            onClick={() => setIsAddOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">forest</span>
                                            Projeto
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link to="/" className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">home</span>
                                Visitar site
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 text-sm font-semibold text-red-300 hover:text-red-200 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                Sair
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
