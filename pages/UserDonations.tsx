import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserSidebar } from './Dashboard';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';

const UserDonations: React.FC = () => {
    const navigate = useNavigate();
    const { user, session, isLoading } = useUser();
    const [donations, setDonations] = useState<any[]>([]);
    const [loadingDonations, setLoadingDonations] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        if (!isLoading && !session) {
            navigate('/login');
        }
    }, [session, isLoading, navigate]);

    useEffect(() => {
        const fetchDonations = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('donations')
                    .select(`
            id,
            amount,
            status,
            created_at,
            payment_method,
            projects (
              title,
              image_url
            )
          `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setDonations(data || []);
            } catch (error) {
                console.error('Error fetching donations:', error);
            } finally {
                setLoadingDonations(false);
            }
        };

        if (user) {
            fetchDonations();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark py-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
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

    const handleExport = () => {
        alert("Iniciando download do relatório de doações em formato PDF...");
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setIsLoadingMore(false);
            alert("Todas as doações já foram carregadas.");
        }, 1500);
    };

    const handleReceipt = (title: string) => {
        alert(`Baixando recibo referente à doação: ${title}`);
    };

    return (
        <div className="flex-1 bg-background-light dark:bg-background-dark py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
                <UserSidebar />

                <main className="flex-1">
                    <div className="flex flex-col w-full gap-6">
                        {/* Breadcrumbs */}
                        <nav className="flex flex-wrap gap-2 text-sm">
                            <Link to="/minha-conta" className="text-text-secondary-light hover:text-primary transition-colors font-medium">Início</Link>
                            <span className="text-text-secondary-light font-medium">/</span>
                            <Link to="/minha-conta" className="text-text-secondary-light hover:text-primary transition-colors font-medium">Minha Conta</Link>
                            <span className="text-text-secondary-light font-medium">/</span>
                            <span className="text-text-main-light dark:text-white font-medium">Minhas Doações</span>
                        </nav>

                        {/* Page Heading */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-text-main-light dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Minhas Doações</h1>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal max-w-xl">Acompanhe o impacto direto das suas contribuições para a floresta e comunidades indígenas.</p>
                            </div>
                            <Link to="/projetos" className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary hover:bg-primary-dark text-[#0d1b12] text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                                <span className="truncate">Fazer Nova Doação</span>
                            </Link>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-surface-dark border border-stone-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-[100px] text-primary">payments</span>
                                </div>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-bold uppercase tracking-wider">Total Doado</p>
                                <p className="text-text-main-light dark:text-white text-3xl font-black leading-tight">
                                    R$ {user.stats.totalDonated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark mt-auto pt-2">
                                    <span className="material-symbols-outlined text-base">verified</span>
                                    <span>Sua contribuição gera vida</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-surface-dark border border-stone-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-[100px] text-primary">groups</span>
                                </div>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-bold uppercase tracking-wider">Vidas Impactadas</p>
                                <p className="text-text-main-light dark:text-white text-3xl font-black leading-tight">{user.stats.projectsSupported * 3 || 0}</p>
                                <div className="flex items-center gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark mt-auto pt-2">
                                    <span className="material-symbols-outlined text-base">eco</span>
                                    <span>Estimativa de impacto local</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-surface-dark border border-stone-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-[100px] text-primary">forest</span>
                                </div>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-bold uppercase tracking-wider">Projetos Apoiados</p>
                                <p className="text-text-main-light dark:text-white text-3xl font-black leading-tight">{user.stats.projectsSupported}</p>
                                <div className="flex items-center gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark mt-auto pt-2">
                                    <span className="material-symbols-outlined text-base">verified_user</span>
                                    <span>Iniciativas certificadas</span>
                                </div>
                            </div>
                        </div>

                        {/* Donations List */}
                        {loadingDonations ? (
                            <div className="py-20 text-center">
                                <span className="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
                                <p className="text-text-secondary-light mt-2">Carregando histórico...</p>
                            </div>
                        ) : donations.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {donations.map((donation) => (
                                    <div key={donation.id} className="bg-white dark:bg-surface-dark rounded-2xl p-4 md:p-6 border border-stone-100 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow">
                                        <div className="w-full md:w-24 h-48 md:h-24 shrink-0 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url('${donation.projects?.image_url || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80'}')` }}></div>
                                        <div className="flex flex-col flex-1 gap-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-text-main-light dark:text-white bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 uppercase">{donation.payment_method || 'PONTUAL'}</span>
                                                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{new Date(donation.created_at).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-text-main-light dark:text-white leading-tight">{donation.projects?.title || 'Projeto Especial'}</h3>
                                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Obrigado por apoiar a Amazônia!</p>
                                        </div>
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-1 pl-0 md:pl-4 border-l-0 md:border-l border-stone-100 dark:border-white/10">
                                            <div className="flex flex-col items-start md:items-end">
                                                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">Valor</span>
                                                <span className="text-xl font-bold text-text-main-light dark:text-white">R$ {Number(donation.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {donation.status === 'confirmado' ? (
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                                                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                        Confirmado
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold">
                                                        <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                                                        Pendente
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden md:flex">
                                            {donation.status === 'confirmado' && (
                                                <button
                                                    onClick={() => handleReceipt(donation.projects?.title || 'Doação')}
                                                    className="size-10 rounded-full hover:bg-stone-100 dark:hover:bg-white/5 flex items-center justify-center text-text-secondary-light transition-colors"
                                                    title="Baixar Recibo"
                                                >
                                                    <span className="material-symbols-outlined">description</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-stone-100 dark:border-white/10 shadow-sm overflow-hidden">
                                <div className="p-20 text-center flex flex-col items-center gap-4">
                                    <span className="material-symbols-outlined text-6xl text-stone-200 dark:text-white/10">volunteer_activism</span>
                                    <div className="max-w-md">
                                        <h3 className="text-xl font-bold text-text-main-light dark:text-white mb-2">Você ainda não possui doações</h3>
                                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">Suas futuras doações aparecerão aqui para você acompanhar o progresso e baixar seus recibos.</p>
                                        <Link to="/projetos" className="inline-flex items-center justify-center rounded-xl h-12 px-8 bg-primary hover:bg-primary-dark text-[#0d1b12] font-bold transition-all shadow-md shadow-primary/20">
                                            Explorar Projetos
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};


export default UserDonations;