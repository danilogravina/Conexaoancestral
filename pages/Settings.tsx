import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserSidebar } from './Dashboard';
import { useUser } from '../contexts/UserContext';

const Toggle: React.FC<{ label: string; description: string; checked: boolean; onChange: () => void }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4">
        <div className="flex flex-col gap-1 pr-4">
            <span className="text-sm font-bold text-text-main-light dark:text-white">{label}</span>
            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{description}</span>
        </div>
        <button
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-surface-dark ${checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
            <span className="sr-only">Use setting</span>
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    </div>
);

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { user, session, isLoading } = useUser();

    const [notifications, setNotifications] = useState({
        newsletter: true,
        projects: true,
        security: true,
        partners: false
    });
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    useEffect(() => {
        if (!isLoading && !session) {
            navigate('/login');
        }
    }, [session, isLoading, navigate]);

    if (isLoading || !user) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark py-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            </div>
        );
    }

    const handleToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const key = id === 'current-password' ? 'current' : id === 'new-password' ? 'new' : 'confirm';
        setPasswordData(prev => ({ ...prev, [key]: value }));
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
            alert("Por favor, preencha todos os campos de senha.");
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            alert("A nova senha e a confirmação não coincidem.");
            return;
        }
        if (passwordData.new.length < 8) {
            alert("A nova senha deve ter pelo menos 8 caracteres.");
            return;
        }

        alert("Senha atualizada com sucesso!");
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm(
            "ATENÇÃO: Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos."
        );

        if (confirmed) {
            const doubleConfirmed = window.confirm("Confirmação final: Deseja realmente excluir permanentemente sua conta?");
            if (doubleConfirmed) {
                alert("Conta excluída. Redirecionando para a página inicial...");
                navigate('/');
            }
        }
    };

    return (
        <div className="flex-1 bg-background-light dark:bg-background-dark py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
                <UserSidebar />

                <main className="flex-1">
                    <nav className="flex flex-wrap gap-2 mb-6 items-center text-sm">
                        <Link to="/minha-conta" className="text-text-secondary-light hover:text-primary transition-colors font-medium">Início</Link>
                        <span className="text-gray-300">/</span>
                        <Link to="/minha-conta" className="text-text-secondary-light hover:text-primary transition-colors font-medium">Minha Conta</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-text-main-light font-semibold dark:text-white">Configurações</span>
                    </nav>

                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main-light dark:text-white mb-2">Configurações da Conta</h1>
                        <p className="text-text-secondary-light dark:text-gray-400 max-w-2xl">Gerencie suas preferências de notificação, segurança e privacidade.</p>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-stone-100 dark:border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-stone-100 dark:border-white/10">
                                <h3 className="text-lg font-bold text-text-main-light dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">notifications</span>
                                    Preferências de Notificação
                                </h3>
                            </div>
                            <div className="p-6 divide-y divide-stone-100 dark:divide-white/5">
                                <Toggle
                                    label="Newsletter Mensal"
                                    description="Receba um resumo das nossas atividades e impacto na floresta."
                                    checked={notifications.newsletter}
                                    onChange={() => handleToggle('newsletter')}
                                />
                                <Toggle
                                    label="Atualizações de Projetos Apoiados"
                                    description="Saiba quando um projeto que você apoiou atinge metas ou publica novidades."
                                    checked={notifications.projects}
                                    onChange={() => handleToggle('projects')}
                                />
                                <Toggle
                                    label="Alertas de Segurança"
                                    description="Notificações sobre acessos à sua conta e alterações de senha."
                                    checked={notifications.security}
                                    onChange={() => handleToggle('security')}
                                />
                                <Toggle
                                    label="Novidades de Parceiros"
                                    description="Ofertas e notícias de empresas parceiras da causa ambiental."
                                    checked={notifications.partners}
                                    onChange={() => handleToggle('partners')}
                                />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-stone-100 dark:border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-stone-100 dark:border-white/10">
                                <h3 className="text-lg font-bold text-text-main-light dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">lock</span>
                                    Segurança e Senha
                                </h3>
                            </div>
                            <div className="p-6">
                                <form className="flex flex-col gap-4" onSubmit={handleUpdatePassword}>
                                    <div>
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="current-password">Senha Atual</label>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                            id="current-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={passwordData.current}
                                            onChange={handlePasswordChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="new-password">Nova Senha</label>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                                id="new-password"
                                                type="password"
                                                placeholder="Mínimo 8 caracteres"
                                                value={passwordData.new}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="confirm-password">Confirmar Nova Senha</label>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                                id="confirm-password"
                                                type="password"
                                                placeholder="Repita a nova senha"
                                                value={passwordData.confirm}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <button type="submit" className="px-6 py-2.5 rounded-lg bg-text-main-light dark:bg-white dark:text-text-main-light text-white font-bold text-sm hover:opacity-90 transition-opacity">
                                            Atualizar Senha
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Zona de Perigo</h3>
                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                                    Ao excluir sua conta, todos os seus dados pessoais e histórico de doações serão removidos permanentemente. Esta ação não pode ser desfeita.
                                </p>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 font-bold text-sm hover:bg-red-50 dark:bg-transparent dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    Excluir minha conta
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;