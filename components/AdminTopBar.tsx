import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const AdminTopBar: React.FC = () => {
    const { user, signOut } = useUser();
    const location = useLocation();
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        setIsAddOpen(false);
    }, [location.pathname]);

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="sticky top-0 z-40 w-full bg-[#111827] text-white border-b border-black/30">
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
                        onClick={signOut}
                        className="flex items-center gap-2 text-sm font-semibold text-red-300 hover:text-red-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminTopBar;
