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

const AdminDonations: React.FC = () => {
    const [donations, setDonations] = useState<AdminDonation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, error } = await supabase
                    .from('donations')
                    .select('id, amount, currency, status, provider, provider_order_id, provider_capture_id, created_at, donor_name, donor_email, projects(title)')
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
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main-light dark:text-white mb-6">Doações</h1>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20 text-red-700 dark:text-red-200 px-4 py-3">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg text-text-main-light dark:text-white">Últimas 50 doações</h2>
                    {loading && <span className="text-sm text-text-secondary-light dark:text-gray-400">Carregando...</span>}
                </div>

                {donations.length === 0 && !loading ? (
                    <p className="text-text-secondary-light dark:text-gray-400">Nenhuma doação encontrada.</p>
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
