import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type DashboardStats = {
    totalProjects: number;
    totalRaised: number;
    activeDonors: number;
};

type PeriodFilter =
    | 'all'
    | 'today'
    | 'last_7_days'
    | 'this_month'
    | 'last_month'
    | 'this_year'
    | 'last_year';

type ProjectSummary = {
    id: string;
    title: string;
    status: string;
    goalAmount: number;
    raisedAmount: number;
    progress: number;
};

type RecentDonation = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    donor_name: string | null;
    donor_email: string | null;
    projects?: { title: string | null } | null;
};

const PERIOD_OPTIONS: Array<{ value: PeriodFilter; label: string }> = [
    { value: 'all', label: 'Todo período' },
    { value: 'today', label: 'Hoje' },
    { value: 'last_7_days', label: 'Últimos 7 dias' },
    { value: 'this_month', label: 'Este mês' },
    { value: 'last_month', label: 'Mês anterior' },
    { value: 'this_year', label: 'Este ano' },
    { value: 'last_year', label: 'Ano anterior' },
];

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const getPeriodRange = (period: PeriodFilter) => {
    if (period === 'all') return null;

    const now = new Date();

    switch (period) {
        case 'today': {
            const start = startOfDay(now);
            const end = endOfDay(now);
            return { start, end };
        }
        case 'last_7_days': {
            const startDate = new Date(now);
            startDate.setDate(now.getDate() - 6);
            return { start: startOfDay(startDate), end: endOfDay(now) };
        }
        case 'this_month': {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
            return { start, end };
        }
        case 'last_month': {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
            return { start, end };
        }
        case 'this_year': {
            const start = new Date(now.getFullYear(), 0, 1);
            const end = endOfDay(new Date(now.getFullYear(), 11, 31));
            return { start, end };
        }
        case 'last_year': {
            const start = new Date(now.getFullYear() - 1, 0, 1);
            const end = endOfDay(new Date(now.getFullYear() - 1, 11, 31));
            return { start, end };
        }
        default:
            return null;
    }
};

const getDonationStatusBadge = (status?: string) => {
    const normalized = (status || 'pending').toLowerCase();
    const labelMap: Record<string, string> = {
        confirmed: 'Confirmado',
        confirmado: 'Confirmado',
        approved: 'Aprovado',
        pending: 'Pendente',
        refunded: 'Reembolsado',
        failed: 'Falhou',
        canceled: 'Cancelado',
    };
    const badgeClasses =
        normalized === 'confirmed' || normalized === 'confirmado'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            : normalized === 'approved'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : normalized === 'refunded'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : normalized === 'failed' || normalized === 'canceled'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';

    return {
        label: labelMap[normalized] || 'Pendente',
        className: badgeClasses,
    };
};

const getProjectStatusClasses = (status: string) => {
    if (status === 'Concluído') {
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
    if (status === 'Em Andamento') {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
    if (status === 'Quase Lá') {
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    }
    if (status === 'Em Planejamento') {
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalProjects: 0,
        totalRaised: 0,
        activeDonors: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
    const [projectsSummary, setProjectsSummary] = useState<ProjectSummary[]>([]);
    const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadStats = async () => {
            setLoading(true);
            setError(null);

            try {
                const periodRange = getPeriodRange(periodFilter);

                const projectsPromise = supabase
                    .from('projects')
                    .select('id, title, status, goal_amount, raised_amount')
                    .order('created_at', { ascending: false });

                let confirmedDonationsQuery = supabase
                    .from('donations')
                    .select('amount, project_id, status, created_at')
                    .in('status', ['confirmed', 'confirmado']);

                let recentDonationsQuery = supabase
                    .from('donations')
                    .select('id, amount, currency, status, created_at, donor_name, donor_email, projects(title)')
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (periodRange) {
                    confirmedDonationsQuery = confirmedDonationsQuery
                        .gte('created_at', periodRange.start.toISOString())
                        .lte('created_at', periodRange.end.toISOString());
                    recentDonationsQuery = recentDonationsQuery
                        .gte('created_at', periodRange.start.toISOString())
                        .lte('created_at', periodRange.end.toISOString());
                }

                const [projectsRes, confirmedDonationsRes, recentDonationsRes] = await Promise.all([
                    projectsPromise,
                    confirmedDonationsQuery,
                    recentDonationsQuery,
                ]);

                if (projectsRes.error) throw projectsRes.error;
                if (confirmedDonationsRes.error) throw confirmedDonationsRes.error;
                if (recentDonationsRes.error) throw recentDonationsRes.error;

                const projectsData = projectsRes.data || [];
                const confirmedDonations = confirmedDonationsRes.data || [];
                const recentDonationsData = recentDonationsRes.data || [];

                const totalsByProject = new Map<string, number>();
                for (const donation of confirmedDonations) {
                    if (!donation?.project_id) continue;
                    const key = String(donation.project_id);
                    const current = totalsByProject.get(key) || 0;
                    totalsByProject.set(key, current + Number(donation.amount || 0));
                }

                const useFallback = !periodRange && confirmedDonations.length === 0;
                const totalRaised = useFallback
                    ? projectsData.reduce((sum, project) => sum + Number(project.raised_amount || 0), 0)
                    : confirmedDonations.reduce((sum, donation) => sum + Number(donation.amount || 0), 0);
                const activeDonors = useFallback ? 0 : confirmedDonations.length;

                const summaries: ProjectSummary[] = projectsData
                    .map((project) => {
                        const goalAmount = Number(project.goal_amount || 0);
                        const raisedAmount = useFallback
                            ? Number(project.raised_amount || 0)
                            : totalsByProject.get(String(project.id)) || 0;
                        const progress = goalAmount > 0 ? Math.min(raisedAmount / goalAmount, 1) : 0;
                        return {
                            id: String(project.id),
                            title: project.title || 'Projeto',
                            status: project.status || 'Novo',
                            goalAmount,
                            raisedAmount,
                            progress,
                        };
                    })
                    .sort((a, b) => b.raisedAmount - a.raisedAmount);

                if (isMounted) {
                    setStats({
                        totalProjects: projectsData.length,
                        totalRaised,
                        activeDonors,
                    });
                    setProjectsSummary(summaries);
                    setRecentDonations(recentDonationsData);
                }
            } catch (err: any) {
                console.error('Erro ao carregar dados do dashboard:', err);
                if (isMounted) {
                    setError(err?.message || 'Falha ao carregar dados');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadStats();

        return () => {
            isMounted = false;
        };
    }, [periodFilter]);

    const totalProjectsLabel = loading ? '--' : stats.totalProjects.toLocaleString('pt-BR');
    const totalRaisedLabel = loading
        ? '--'
        : stats.totalRaised.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          });
    const activeDonorsLabel = loading ? '--' : stats.activeDonors.toLocaleString('pt-BR');
    const periodLabel = PERIOD_OPTIONS.find((option) => option.value === periodFilter)?.label || 'Todo período';

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-main-light dark:text-white">Visão Geral</h1>
                    <p className="text-sm text-text-secondary-light dark:text-gray-400">Período: {periodLabel}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="periodFilter" className="text-xs font-semibold text-text-secondary-light dark:text-gray-400">
                        Período
                    </label>
                    <select
                        id="periodFilter"
                        value={periodFilter}
                        onChange={(e) => setPeriodFilter(e.target.value as PeriodFilter)}
                        className="w-full sm:w-52 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark px-3 py-2 text-sm text-text-main-light dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    >
                        {PERIOD_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20 text-red-700 dark:text-red-200 px-4 py-3">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-text-secondary-light dark:text-gray-400 text-sm font-medium">Total de Projetos</p>
                            <h3 className="text-3xl font-bold text-text-main-light dark:text-white mt-2">{totalProjectsLabel}</h3>
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
                            <h3 className="text-3xl font-bold text-text-main-light dark:text-white mt-2">R$ {totalRaisedLabel}</h3>
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
                            <h3 className="text-3xl font-bold text-text-main-light dark:text-white mt-2">{activeDonorsLabel}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">group</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10 xl:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                        <h2 className="font-bold text-lg text-text-main-light dark:text-white">Arrecadação por Projeto</h2>
                        <span className="text-xs text-text-secondary-light dark:text-gray-400">Período: {periodLabel}</span>
                    </div>

                    {loading ? (
                        <p className="text-sm text-text-secondary-light dark:text-gray-400">Carregando projetos...</p>
                    ) : projectsSummary.length === 0 ? (
                        <p className="text-sm text-text-secondary-light dark:text-gray-400">Nenhum projeto encontrado.</p>
                    ) : (
                        <div className="space-y-4 max-h-[520px] overflow-auto pr-2">
                            {projectsSummary.map((project) => (
                                <div key={project.id} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-bold text-text-main-light dark:text-white">{project.title}</p>
                                            <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${getProjectStatusClasses(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-text-main-light dark:text-white">
                                                R$ {project.raisedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-xs text-text-secondary-light dark:text-gray-400">
                                                Meta: R$ {project.goalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{ width: `${Math.min(project.progress * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg text-text-main-light dark:text-white">Atividade Recente</h2>
                        <Link to="/admin/donations" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                            Ver todas
                        </Link>
                    </div>

                    {loading ? (
                        <p className="text-sm text-text-secondary-light dark:text-gray-400">Carregando doações...</p>
                    ) : recentDonations.length === 0 ? (
                        <p className="text-sm text-text-secondary-light dark:text-gray-400">Nenhuma doação no período.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentDonations.map((donation) => {
                                const badge = getDonationStatusBadge(donation.status);
                                return (
                                    <div key={donation.id} className="flex items-start justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-b-0 last:pb-0">
                                        <div>
                                            <p className="text-sm font-semibold text-text-main-light dark:text-white">
                                                {donation.projects?.title || 'Projeto'}
                                            </p>
                                            <p className="text-xs text-text-secondary-light dark:text-gray-400">
                                                {new Date(donation.created_at).toLocaleString('pt-BR')}
                                            </p>
                                            <p className="text-xs text-text-secondary-light dark:text-gray-400">
                                                {donation.donor_name || 'Anônimo'}
                                                {donation.donor_email ? ` (${donation.donor_email})` : ''}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-text-main-light dark:text-white">
                                                {donation.currency || 'BRL'} {Number(donation.amount || 0).toFixed(2)}
                                            </p>
                                            <span className={`inline-flex text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${badge.className}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
