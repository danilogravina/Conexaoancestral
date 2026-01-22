import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AdminDonation {
    id: string;
    amount: number;
    currency: string;
    status: string;
    provider: string | null;
    provider_order_id: string | null;
    provider_capture_id: string | null;
    created_at: string;
    donor_name: string | null;
    donor_email: string | null;
    projects?: { title: string | null } | null;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'confirmed' | 'failed' | 'refunded' | 'canceled';
type PeriodFilter =
    | 'all'
    | 'today'
    | 'last_7_days'
    | 'this_month'
    | 'last_month'
    | 'this_year'
    | 'last_year';

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendente' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'failed', label: 'Falhou' },
    { value: 'refunded', label: 'Reembolsado' },
    { value: 'canceled', label: 'Cancelado' },
];

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

const getStatusValues = (status: StatusFilter) => {
    if (status === 'all') return null;
    if (status === 'confirmed') return ['confirmed', 'confirmado'];
    return [status];
};

const AdminDonations: React.FC = () => {
    const [donations, setDonations] = useState<AdminDonation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                let query = supabase
                    .from('donations')
                    .select('id, amount, currency, status, provider, provider_order_id, provider_capture_id, created_at, donor_name, donor_email, projects(title)');

                const statusValues = getStatusValues(statusFilter);
                if (statusValues) {
                    query = statusValues.length > 1
                        ? query.in('status', statusValues)
                        : query.eq('status', statusValues[0]);
                }

                const periodRange = getPeriodRange(periodFilter);
                if (periodRange) {
                    query = query
                        .gte('created_at', periodRange.start.toISOString())
                        .lte('created_at', periodRange.end.toISOString());
                }

                const { data, error } = await query
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (error) throw error;
                setDonations(data || []);
            } catch (err: any) {
                console.error('Erro ao carregar doações (admin):', err);
                setError(err?.message || 'Falha ao carregar doações');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [statusFilter, periodFilter]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main-light dark:text-white mb-6">Doações</h1>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20 text-red-700 dark:text-red-200 px-4 py-3">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h2 className="font-bold text-lg text-text-main-light dark:text-white">Doações (até 50)</h2>
                        {loading && <span className="text-sm text-text-secondary-light dark:text-gray-400">Carregando...</span>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="statusFilter" className="text-xs font-semibold text-text-secondary-light dark:text-gray-400">
                                Status
                            </label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                className="w-full sm:w-44 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark px-3 py-2 text-sm text-text-main-light dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
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
                </div>

                {donations.length === 0 && !loading ? (
                    <p className="text-text-secondary-light dark:text-gray-400">Nenhuma doação encontrada para os filtros selecionados.</p>
                ) : (
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-text-secondary-light dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                                    <th className="py-2 pr-4">Data</th>
                                    <th className="py-2 pr-4">Projeto</th>
                                    <th className="py-2 pr-4">Valor</th>
                                    <th className="py-2 pr-4">Status</th>
                                    <th className="py-2 pr-4">Doador</th>
                                    <th className="py-2 pr-4">Pedido</th>
                                    <th className="py-2 pr-4">Capture</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((d) => (
                                    <tr key={d.id} className="border-b border-gray-50 dark:border-gray-800">
                                        <td className="py-2 pr-4 whitespace-nowrap">{new Date(d.created_at).toLocaleString('pt-BR')}</td>
                                        <td className="py-2 pr-4">{d.projects?.title || '-'}</td>
                                        <td className="py-2 pr-4 font-semibold">{d.currency || 'BRL'} {Number(d.amount || 0).toFixed(2)}</td>
                                        <td className="py-2 pr-4 capitalize">{d.status}</td>
                                        <td className="py-2 pr-4">{d.donor_name || 'Anônimo'}{d.donor_email ? ` (${d.donor_email})` : ''}</td>
                                        <td className="py-2 pr-4 text-xs text-text-secondary-light dark:text-gray-400">{d.provider_order_id || '-'}</td>
                                        <td className="py-2 pr-4 text-xs text-text-secondary-light dark:text-gray-400">{d.provider_capture_id || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDonations;
