import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';

interface UserSidebarProps {
    onAvatarEdit?: () => void;
}

// Internal Sidebar Component to reuse across Dashboard pages
export const UserSidebar: React.FC<UserSidebarProps> = ({ onAvatarEdit }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useUser();
    const isActive = (path: string) => location.pathname === path;

    if (!user) return null;

    // Get first and last name for display
    const displayName = user.fullName.split(' ').slice(0, 2).join(' ');

    const handleSignOut = async (e: React.MouseEvent) => {
        e.preventDefault();
        await signOut();
        navigate('/login');
    };

    return (
        <aside className="w-full lg:w-72 flex-shrink-0 mb-8 lg:mb-0">
            <div className="sticky top-24 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-white/10">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="relative mb-4 group">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-24 border-4 border-background-light dark:border-background-dark shadow-md transition-transform group-hover:scale-105"
                            style={{ backgroundImage: `url("${user.avatar}")` }}
                        ></div>
                        {onAvatarEdit && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onAvatarEdit();
                                }}
                                className="absolute bottom-0 right-0 p-1.5 bg-primary text-black rounded-full hover:bg-primary-dark shadow-sm transition-colors border-2 border-white dark:border-surface-dark cursor-pointer z-10 flex items-center justify-center"
                                title="Trocar foto de perfil"
                            >
                                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                            </button>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-text-main-light dark:text-white">{displayName}</h2>
                    <p className="text-sm text-text-secondary-light dark:text-gray-400">Desde {user.since}</p>
                </div>
                <nav className="flex flex-col gap-1">
                    <Link to="/minha-conta" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${isActive('/minha-conta') ? 'bg-primary/10 text-primary dark:text-primary' : 'text-text-main-light hover:bg-stone-50 dark:text-gray-200 dark:hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined ${isActive('/minha-conta') ? '' : 'text-gray-400 group-hover:text-primary transition-colors'}`}>dashboard</span>
                        <span className="text-sm font-medium">Visão Geral</span>
                    </Link>
                    <Link to="/minha-conta/doacoes" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${isActive('/minha-conta/doacoes') ? 'bg-primary/10 text-primary dark:text-primary' : 'text-text-main-light hover:bg-stone-50 dark:text-gray-200 dark:hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined ${isActive('/minha-conta/doacoes') ? '' : 'text-gray-400 group-hover:text-primary transition-colors'}`}>volunteer_activism</span>
                        <span className="text-sm font-medium">Minhas Doações</span>
                    </Link>
                    <Link to="/minha-conta/perfil" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${isActive('/minha-conta/perfil') ? 'bg-primary/10 text-primary dark:text-primary' : 'text-text-main-light hover:bg-stone-50 dark:text-gray-200 dark:hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined ${isActive('/minha-conta/perfil') ? '' : 'text-gray-400 group-hover:text-primary transition-colors'}`}>person</span>
                        <span className="text-sm font-medium">Meus Dados</span>
                    </Link>
                    <Link to="/minha-conta/configuracoes" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${isActive('/minha-conta/configuracoes') ? 'bg-primary/10 text-primary dark:text-primary' : 'text-text-main-light hover:bg-stone-50 dark:text-gray-200 dark:hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined ${isActive('/minha-conta/configuracoes') ? '' : 'text-gray-400 group-hover:text-primary transition-colors'}`}>settings</span>
                        <span className="text-sm font-medium">Configurações</span>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group mt-4 border-t border-stone-100 dark:border-white/10 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-medium">Sair da conta</span>
                    </button>
                </nav>
            </div>
        </aside>
    );
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, session, isLoading } = useUser();
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loadingActivity, setLoadingActivity] = useState(true);

    useEffect(() => {
        if (!isLoading && !session) {
            navigate('/login');
        }
    }, [session, isLoading, navigate]);

    useEffect(() => {
        const fetchRecentActivity = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('donations')
                    .select('id, amount, created_at, status, projects(title)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (error) throw error;
                setRecentActivity(data || []);
            } catch (error) {
                console.error('Erro ao buscar atividade recente:', error);
            } finally {
                setLoadingActivity(false);
            }
        };

        if (user) {
            fetchRecentActivity();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark py-20">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Carregando portal...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark py-20">
                <div className="flex flex-col items-center gap-6 max-w-md mx-auto text-center px-6">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-2">Erro no Perfil</h2>
                        <p className="text-text-secondary-light dark:text-gray-400">
                            Não foi possível carregar suas informações de perfil. Isso pode ocorrer se o cadastro não foi concluído corretamente.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 px-6 py-3 rounded-lg bg-primary text-[#0d1b12] font-bold hover:bg-primary-dark transition-colors"
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}
                            className="flex-1 px-6 py-3 rounded-lg border border-stone-200 dark:border-white/10 text-text-main-light dark:text-white font-bold hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Sair da Conta
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const firstName = user.fullName.split(' ')[0];

    const handleInvite = () => {
        const shareData = {
            title: 'Conexão Ancestral',
            text: 'Junte-se a mim para proteger a Amazônia! Confira a Conexão Ancestral.',
            url: window.location.origin
        };

        if (navigator.share) {
            navigator.share(shareData).catch((err) => { });
        } else {
            navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert('Link de convite copiado para a área de transferência!');
        }
    };

    return (
        <div className="flex-1 bg-background-light dark:bg-background-dark py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
                <UserSidebar />

                <main className="flex-1">
                    {/* Page Heading */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-text-main-light dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                                Olá, {firstName}!
                            </h1>
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg font-normal leading-normal">
                                Obrigado por ajudar a proteger a Amazônia.
                            </p>
                        </div>
                        <Link to="/projetos" className="flex items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary hover:bg-primary-dark transition-transform active:scale-95 text-white gap-2 text-base font-bold shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined">add_circle</span>
                            <span>Fazer Nova Doação</span>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-stone-100 dark:border-white/10 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-primary">savings</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-bold uppercase tracking-wide">Total Doado</p>
                            </div>
                            <div>
                                <p className="text-text-main-light dark:text-white text-3xl font-black tracking-tight">
                                    R$ {user.stats.totalDonated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Sua contribuição gera vida</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-stone-100 dark:border-white/10 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-primary">forest</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">eco</span>
                                </div>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-bold uppercase tracking-wide">Projetos Apoiados</p>
                            </div>
                            <div>
                                <p className="text-text-main-light dark:text-white text-3xl font-black tracking-tight">{user.stats.projectsSupported}</p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Fortalecendo comunidades</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-stone-100 dark:border-white/10 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-primary">calendar_month</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">event</span>
                                </div>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-bold uppercase tracking-wide">Vidas Impactadas</p>
                            </div>
                            <div>
                                <p className="text-text-main-light dark:text-white text-3xl font-black tracking-tight">{user.stats.projectsSupported * 3 || 0}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-xs text-text-secondary-light dark:text-text-secondary-dark">verified_user</span>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Impacto estimado</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activity Section */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-text-main-light dark:text-white">Atividade Recente</h2>
                                <Link to="/minha-conta/doacoes" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">Ver tudo</Link>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-stone-100 dark:border-white/10 shadow-sm overflow-hidden min-h-[200px] flex flex-col">
                                {loadingActivity ? (
                                    <div className="p-12 text-center flex flex-col items-center gap-4 flex-1 justify-center">
                                        <span className="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
                                        <p className="text-text-secondary-light">Buscando atividades...</p>
                                    </div>
                                ) : recentActivity.length > 0 ? (
                                    <div className="divide-y divide-stone-100 dark:divide-white/5">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
                                                        <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-main-light dark:text-white">Doação para {activity.projects?.title || 'Projeto'}</p>
                                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">R$ {Number(activity.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} • {new Date(activity.created_at).toLocaleDateString('pt-BR')}</p>
                                                    </div>
                                                </div>
                                                {(() => {
                                                    const normalized = (activity.status || 'pending').toLowerCase();
                                                    const isConfirmed = normalized === 'confirmed' || normalized === 'confirmado';
                                                    const isApproved = normalized === 'approved';
                                                    const isRefunded = normalized === 'refunded';
                                                    const isFailed = normalized === 'failed' || normalized === 'canceled';
                                                    const badgeClasses = isConfirmed
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : isApproved
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : isRefunded
                                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                                : isFailed
                                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                                                    const labelMap: Record<string, string> = {
                                                        confirmed: 'Confirmado',
                                                        confirmado: 'Confirmado',
                                                        approved: 'Aprovado',
                                                        pending: 'Pendente',
                                                        refunded: 'Reembolsado',
                                                        failed: 'Falhou',
                                                        canceled: 'Cancelado',
                                                    };
                                                    return (
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${badgeClasses}`}>
                                                            {labelMap[normalized] || 'Pendente'}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center flex flex-col items-center gap-4 flex-1 justify-center">
                                        <span className="material-symbols-outlined text-5xl text-stone-200 dark:text-white/10">history</span>
                                        <p className="text-text-secondary-light dark:text-text-secondary-dark">Você ainda não possui doações registradas.</p>
                                        <Link to="/projetos" className="text-primary font-bold hover:underline">Começar a apoiar agora</Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Widget / News */}

                        <div
                            className="bg-background-dark dark:bg-black rounded-2xl p-5 flex items-center gap-4 text-white relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
                            onClick={handleInvite}
                        >
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary rounded-full opacity-20 blur-xl"></div>
                            <div className="bg-white/10 p-3 rounded-full shrink-0 backdrop-blur-sm z-10">
                                <span className="material-symbols-outlined text-primary">share</span>
                            </div>
                            <div className="z-10">
                                <p className="font-bold text-sm">Convide um amigo</p>
                                <p className="text-xs text-gray-300 mt-0.5">Aumente nossa rede de proteção.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;