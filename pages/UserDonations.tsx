import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserSidebar } from './Dashboard';
import { useUser } from '../contexts/UserContext';

const UserDonations: React.FC = () => {
  const { user } = useUser();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
                                <span className="material-symbols-outlined text-base">trending_up</span>
                                <span>+15% desde o ano passado</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-surface-dark border border-stone-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                            <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[100px] text-primary">groups</span>
                            </div>
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-bold uppercase tracking-wider">Vidas Impactadas</p>
                            <p className="text-text-main-light dark:text-white text-3xl font-black leading-tight">12</p>
                            <div className="flex items-center gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark mt-auto pt-2">
                                <span className="material-symbols-outlined text-base">eco</span>
                                <span>Famílias na Amazônia</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-surface-dark border border-stone-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                            <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[100px] text-primary">forest</span>
                            </div>
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-bold uppercase tracking-wider">Projetos Apoiados</p>
                            <p className="text-text-main-light dark:text-white text-3xl font-black leading-tight">{user.stats.projectsSupported}</p>
                            <div className="flex items-center gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark mt-auto pt-2">
                                <span className="material-symbols-outlined text-base">verified</span>
                                <span>Iniciativas certificadas</span>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 py-2">
                        {['Ano: 2023', 'Status: Todos', 'Tipo: Pontual'].map(label => (
                            <button key={label} className="flex h-10 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-surface-dark border border-stone-200 dark:border-white/10 pl-4 pr-3 hover:border-primary transition-colors group">
                                <p className="text-text-main-light dark:text-white text-sm font-medium leading-normal">{label}</p>
                                <span className="material-symbols-outlined text-text-main-light dark:text-white text-[20px] group-hover:text-primary transition-colors">arrow_drop_down</span>
                            </button>
                        ))}
                        <button onClick={handleExport} className="ml-auto text-text-secondary-light hover:text-primary text-sm font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Exportar Relatório
                        </button>
                    </div>

                    {/* Donations List */}
                    <div className="flex flex-col gap-4">
                        {[
                            {
                                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdJkVhnNRC41pPx6bMimH9WgUlXJ2b0amj4LpYIuc15xBz22dBztacmMt_sbK226q6Wglf6RNooBpt15cyW9xLbP9U7d3cxh2AaNymrz99vUPuggmEBhq93oRCt_Kg3g8_O3823xWUuYwX2cLYKI07oKZLzBxC0wdnu8uLvyoO3mcrx7JS-3aG6I2UBxgHgG-lFJPbroJyAtee2Rl7ZvOIAOZWf1o7CFtFOfREgCARWzLZ5OhBq2J37mEBLBjvDokqvTHIXiDV9tM1',
                                title: 'Proteção da Terra Indígena Yanomami',
                                desc: 'Doação recorrente para suporte médico e alimentar.',
                                type: 'MENSAL',
                                date: '12/10/2023',
                                value: 'R$ 150,00',
                                status: 'Confirmado'
                            },
                            {
                                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMVBitY792pgwkUFnn21kNGXeRlaDEa9JNWiGZ8IIBkYC8OBSonPW3XlL4dtwPVXTsB-xjtPxNFC8lEL_ms9NbziYgVHiazoXm48fedf6FiQMjVzr9iUDScpheuCaybvq1f9hTGVD9tBYhH84aY-H1zFaCYUHi_nfLP14ec7qj7RRmptQd8DsiG_PPYEpo86EgYeqWJTdclA7FYlYmD3js3p1Y0Kzi_WFOaa-ofaNbzAA0FPXkJPWhIv0a3nmDkCGnmJnmczsywhow',
                                title: 'Projeto Água Limpa',
                                desc: 'Instalação de filtros de água na comunidade ribeirinha.',
                                type: 'PONTUAL',
                                date: '28/09/2023',
                                value: 'R$ 500,00',
                                status: 'Confirmado'
                            },
                             {
                                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8tAsTMmuxGuR7ZoVrxVpk3ZyVnlSW13UvQ3nw9Y1SrXHUhKODvkQiHk2yvmYqSatoYnO71UVeT8DVq3g8a4BGWoKZhlK02UAZ6xZjF7T0DKA8RsokDJ31Lxh-K_o-BJOZgv6W0FIZQ8nhIr_gtoC_dyB74rBJqbkiqJQq7vzqF-kmsczp5zGORHPxVU2Z7L4NlcE3imFarJnSBTIom7ykb6cadnGI1dX3j9W471Tl9PNJU3kRiM4sMdnSZ3VvAtJlm8HDmcxTSKyY',
                                title: 'Reflorestamento Local',
                                desc: 'Plantio de 50 mudas de árvores nativas.',
                                type: 'PONTUAL',
                                date: '15/08/2023',
                                value: 'R$ 200,00',
                                status: 'Processando',
                                opacity: true
                            },
                            {
                                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPmR4Gb7XM9Dbja5GzwwlBxfAiL0UtQqWjILpXOUmEjxPp58SYs250usG0KkgrsxXNfLY8M3j1hT4jn_mGtwmxyhGc_0S7Y6jV5PiogMXuhnu1tD0oAvjoLmnwy04eIIHFtzoVvOhFq0FpzJcLr0s1WlOP1zRg2HeIkkfAtk0T89xT__XwMWiJnSU4zVYdc_dKGXDaYFn7TVGPS8X2BAqicswJQtuPTiK3E5gIEcSXRIGYyvB--ej6hrQTOdBCRuE7Ccr8WtbuDKw7',
                                title: 'Proteção da Terra Indígena Yanomami',
                                desc: 'Doação recorrente para suporte médico e alimentar.',
                                type: 'MENSAL',
                                date: '12/08/2023',
                                value: 'R$ 150,00',
                                status: 'Confirmado'
                            },
                             {
                                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1Y2d6VkJ07FVPKnUeHsq0yjAUzPlxu3s1Qc1q1wlRmSSNYCFV1ADhThvLElvG5BZ7jKIdJQOyh_SgW0qoofP3Z2XMEHlqkCSr388Uyq_8P992NwGoszXAnhWVx9wTGmVXtFxk0_noy-kuwwUP9nk16H9NNfiGjRT3AdXD-AkdoIAWNl5BnkSyhocUTsM-5Y1l5zHXizLFLrX37jLZApyCRP1GpFdayGli6y5B_I7_7zVSdnpGalj5VZ14URLMg70VK9vPkJbb63sg',
                                title: 'Educação na Aldeia',
                                desc: 'Material escolar para 20 crianças.',
                                type: 'PONTUAL',
                                date: '01/06/2023',
                                value: 'R$ 250,00',
                                status: 'Confirmado'
                            }
                        ].map((item, i) => (
                            <div key={i} className={`bg-white dark:bg-surface-dark rounded-2xl p-4 md:p-6 border border-stone-100 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow ${item.opacity ? 'opacity-80' : ''}`}>
                                <div className={`w-full md:w-24 h-48 md:h-24 shrink-0 rounded-xl bg-cover bg-center ${item.opacity ? 'grayscale' : ''}`} style={{backgroundImage: `url('${item.img}')`}}></div>
                                <div className="flex flex-col flex-1 gap-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${item.type === 'MENSAL' ? 'text-primary bg-primary/10 border-primary/20' : 'text-text-main-light dark:text-white bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>{item.type}</span>
                                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{item.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-text-main-light dark:text-white leading-tight">{item.title}</h3>
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{item.desc}</p>
                                </div>
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-1 pl-0 md:pl-4 border-l-0 md:border-l border-stone-100 dark:border-white/10">
                                    <div className="flex flex-col items-start md:items-end">
                                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">Valor</span>
                                        <span className="text-xl font-bold text-text-main-light dark:text-white">{item.value}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.status === 'Confirmado' ? (
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                Confirmado
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold">
                                                <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                                                Processando
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex md:hidden w-full border-t border-stone-100 dark:border-white/10 pt-3 mt-1">
                                    {item.status === 'Confirmado' && (
                                        <button 
                                            onClick={() => handleReceipt(item.title)}
                                            className="text-text-secondary-light text-sm font-bold flex items-center gap-1 hover:text-primary ml-auto"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">description</span>
                                            Recibo
                                        </button>
                                    )}
                                </div>
                                <div className="hidden md:flex">
                                     {item.status === 'Confirmado' && (
                                        <button 
                                            onClick={() => handleReceipt(item.title)}
                                            className="size-10 rounded-full hover:bg-stone-100 dark:hover:bg-white/5 flex items-center justify-center text-text-secondary-light transition-colors" 
                                            title="Baixar Recibo"
                                        >
                                            <span className="material-symbols-outlined">description</span>
                                        </button>
                                     )}
                                     {item.status !== 'Confirmado' && <div className="size-10"></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="w-full py-4 text-center text-text-secondary-light font-bold hover:text-primary hover:bg-stone-100 dark:hover:bg-white/5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {isLoadingMore ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                                Carregando...
                            </>
                        ) : (
                            'Carregar doações mais antigas'
                        )}
                    </button>
                </div>
            </main>
        </div>
    </div>
  );
};

export default UserDonations;