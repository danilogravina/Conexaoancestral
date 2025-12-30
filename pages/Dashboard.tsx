import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface UserSidebarProps {
    onAvatarEdit?: () => void;
}

// Internal Sidebar Component to reuse across Dashboard pages
export const UserSidebar: React.FC<UserSidebarProps> = ({ onAvatarEdit }) => {
    const location = useLocation();
    const { user } = useUser();
    const isActive = (path: string) => location.pathname === path;

    // Get first and last name for display
    const displayName = user.fullName.split(' ').slice(0, 2).join(' ');

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
                    <p className="text-sm text-text-secondary-light dark:text-gray-400">{user.since}</p>
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
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group mt-4 border-t border-stone-100 dark:border-white/10">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-medium">Sair da conta</span>
                    </Link>
                </nav>
            </div>
        </aside>
    );
};

const Dashboard: React.FC = () => {
    const { user } = useUser();
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
                                Bem-vinda de volta, {firstName}!
                            </h1>
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg font-normal leading-normal">
                                Obrigado por ajudar a proteger a Amazônia.
                            </p>
                        </div>
                        <Link to="/projetos" className="flex items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary hover:bg-primary-dark transition-transform active:scale-95 text-[#0d1b12] gap-2 text-base font-bold shadow-lg shadow-primary/20">
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
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">+ R$ 150,00 este mês</p>
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
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Impactando 2 comunidades</p>
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
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-bold uppercase tracking-wide">Próxima Doação</p>
                            </div>
                            <div>
                                <p className="text-text-main-light dark:text-white text-3xl font-black tracking-tight">{user.stats.nextDonationDate}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-xs text-text-secondary-light dark:text-text-secondary-dark">credit_card</span>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Mastercard •••• 4242</p>
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
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-stone-100 dark:border-white/10 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-background-light dark:bg-white/5 border-b border-stone-100 dark:border-white/10">
                                            <tr>
                                                <th className="p-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Projeto</th>
                                                <th className="p-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Data</th>
                                                <th className="p-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider text-right">Valor</th>
                                                <th className="p-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100 dark:divide-white/10">
                                            {[
                                                { name: 'Proteção Xingu', type: 'Recorrente', date: '15 Out 2023', val: '50,00', img: 'assets/img/activity-xingu.jpg' },
                                                { name: 'Artesanato Local', type: 'Pontual', date: '02 Out 2023', val: '100,00', img: 'assets/img/activity-artesanato.jpg' },
                                                { name: 'Água Limpa', type: 'Recorrente', date: '15 Set 2023', val: '50,00', img: 'assets/img/activity-agua.jpg' }
                                            ].map((item, i) => (
                                                <tr key={i} className="hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${item.img}')` }}></div>
                                                            <div>
                                                                <p className="font-bold text-text-main-light dark:text-white text-sm">{item.name}</p>
                                                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{item.type}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm text-text-main-light dark:text-gray-300">{item.date}</td>
                                                    <td className="p-4 text-sm font-bold text-text-main-light dark:text-white text-right">R$ {item.val}</td>
                                                    <td className="p-4 text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                                            Concluído
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-3 border-t border-stone-100 dark:border-white/10 bg-white dark:bg-surface-dark flex justify-center">
                                    <Link to="/minha-conta/doacoes" className="text-sm font-medium text-text-secondary-light hover:text-primary transition-colors flex items-center gap-1">
                                        Ver histórico completo
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Widget / News */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-bold text-text-main-light dark:text-white">Impacto Real</h2>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-stone-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col h-full">
                                <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: 'url("assets/img/dashboard-news-planting.jpg")' }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                        <span className="bg-primary text-[#0d1b12] text-xs font-bold px-2 py-1 rounded mb-1">Novidade</span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    <h4 className="text-lg font-bold text-text-main-light dark:text-white leading-tight">1.000 novas mudas plantadas no último mês</h4>
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-3">Graças ao apoio de doadores como você, conseguimos reflorestar uma área crítica próxima ao Rio Negro. Veja as fotos do progresso.</p>
                                    <div className="mt-auto pt-2">
                                        <Link to="/blog/article-1" className="w-full block text-center py-2.5 rounded-lg border border-stone-200 hover:bg-background-light dark:border-white/20 dark:hover:bg-white/5 text-text-main-light dark:text-white text-sm font-bold transition-colors">
                                            Ler história completa
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* Mini Promo */}
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
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;