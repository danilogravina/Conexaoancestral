import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Project, ProjectCategory } from '../types';

export const projectsData: Project[] = [
  {
    id: 1,
    category: ProjectCategory.EDUCATION,
    title: "Escola Viva da Floresta",
    description: "Construção de espaços de aprendizado que integram o currículo tradicional com os saberes ancestrais para 120 crianças.",
    fullDescription: "A Escola Viva da Floresta é uma iniciativa vital para preservar a cultura indígena enquanto fornece educação formal de qualidade. Localizada no coração da Amazônia, a escola atende três comunidades ribeirinhas que, historicamente, precisavam viajar horas de barco para acessar o ensino básico.\n\nNosso objetivo não é apenas ensinar matemática e português, mas criar um currículo híbrido onde os anciões da comunidade ensinam botânica, história oral e artesanato, garantindo a identidade cultural fortalecida, não apagada.",
    objectives: [
      "Construção de 4 novas salas de aula bioclimáticas.",
      "Fornecimento de material didático bilíngue (Português e Língua Nativa).",
      "Alimentação diária nutritiva com produtos da agricultura familiar local."
    ],
    gallery: [
      "assets/img/project-details-gallery-1.jpg",
      "assets/img/project-details-gallery-2.jpg",
      "assets/img/project-details-gallery-3.jpg",
      "assets/img/project-details-gallery-4.jpg",
      "assets/img/project-details-gallery-5.jpg",
      "assets/img/project-details-gallery-6.jpg",
      "assets/img/project-details-gallery-7.jpg"
    ],
    image: "assets/img/project-details-gallery-1.jpg",
    raised: 45000,
    goal: 60000,
    status: "Em Andamento"
  },
  {
    id: 2,
    category: ProjectCategory.SUSTAINABILITY,
    title: "Agrofloresta Comunitária",
    description: "Implementação de sistemas agroflorestais produtivos que recuperam o solo e geram renda para 50 famílias locais.",
    fullDescription: "O projeto de Agrofloresta Comunitária foca na regeneração de áreas degradadas e na criação de sistemas produtivos biodiversos. Trabalhamos lado a lado com as famílias locais para implementar técnicas que imitam o funcionamento natural da floresta, garantindo segurança alimentar e geração de renda sustentável.",
    objectives: [
      "Plantio de 5.000 mudas de árvores nativas e frutíferas.",
      "Capacitação de 50 famílias em técnicas de manejo agroflorestal.",
      "Criação de uma cooperativa para comercialização dos produtos colhidos."
    ],
    gallery: [
      "assets/img/project-agrofloresta.jpg",
      "assets/img/project-details-gallery-2.jpg",
      "assets/img/project-details-gallery-3.jpg"
    ],
    image: "assets/img/project-agrofloresta.jpg",
    raised: 12500,
    goal: 30000,
    status: "Em Andamento"
  },
  {
    id: 3,
    category: ProjectCategory.HEALTH,
    title: "Água Limpa para Todos",
    description: "Instalação de poços artesianos e sistemas de filtragem para garantir acesso à água potável em áreas remotas.",
    fullDescription: "O acesso à água potável é um direito fundamental, mas ainda é um desafio em muitas aldeias isoladas. Este projeto instala sistemas de captação e purificação de água, reduzindo drasticamente a incidência de doenças de veiculação hídrica e melhorando a qualidade de vida de centenas de pessoas.",
    objectives: [
      "Instalação de 5 poços artesanais com bombas movidas a energia solar.",
      "Distribuição de filtros de cerâmica para 200 famílias.",
      "Treinamento comunitário sobre saneamento básico e higiene."
    ],
    gallery: [
      "assets/img/project-agua-limpa.jpg",
      "assets/img/project-details-gallery-4.jpg",
      "assets/img/project-details-gallery-5.jpg"
    ],
    image: "assets/img/project-agua-limpa.jpg",
    raised: 78000,
    goal: 80000,
    status: "Quase Lá"
  },
  {
    id: 4,
    category: ProjectCategory.CULTURE,
    title: "Artesanato Ancestral",
    description: "Projeto finalizado que capacitou 40 mulheres na produção e comercialização de artesanato tradicional.",
    fullDescription: "Este projeto celebrou a maestria das artesãs indígenas, fornecendo apoio logístico e estratégico para que seus produtos alcancem mercados maiores sem perder a essência cultural. Foi um sucesso absoluto, empoderando dezenas de mulheres e garantindo que técnicas milenares continuem vivas.",
    objectives: [
      "Criação de um catálogo digital de produtos artesanais.",
      "Workshop de precificação e gestão financeira para as artesãs.",
      "Participação em 3 feiras nacionais de artesanato."
    ],
    gallery: [
      "assets/img/project-artesanato.jpg",
      "assets/img/project-details-gallery-6.jpg",
      "assets/img/project-details-gallery-7.jpg"
    ],
    image: "assets/img/project-artesanato.jpg",
    raised: 0,
    goal: 0,
    status: "Concluído",
    beneficiaries: 40,
    year: 2023
  },
  {
    id: 5,
    category: ProjectCategory.SUSTAINABILITY,
    title: "Energia Solar na Aldeia",
    description: "Instalação de painéis solares na casa comunitária da Aldeia Yawanawa, trazendo luz limpa e internet.",
    fullDescription: "A energia solar transformou a dinâmica da Aldeia Yawanawa. Agora, a casa comunitária pode funcionar à noite para reuniões, estudos e comunicação via internet, tudo de forma limpa e silenciosa, respeitando o ambiente da floresta.",
    objectives: [
      "Instalação de um sistema fotovoltaico de 5kW.",
      "Implementação de ponto de internet via satélite.",
      "Manutenção preventiva do sistema solar por 2 anos."
    ],
    gallery: [
      "assets/img/project-energia-solar.jpg",
      "assets/img/project-details-gallery-1.jpg"
    ],
    image: "assets/img/project-energia-solar.jpg",
    raised: 0,
    goal: 0,
    status: "Concluído",
    year: 2022,
    power: "5kW"
  },
  {
    id: 6,
    category: ProjectCategory.HEALTH,
    title: "Barco da Saúde",
    description: "Unidade móvel fluvial para levar atendimento médico e odontológico às comunidades ribeirinhas mais isoladas.",
    fullDescription: "O Barco da Saúde é o nosso projeto mais ambicioso na área da saúde. Ele funcionará como uma clínica flutuante, levando especialistas, vacinas e medicamentos básicos até as portas das comunidades que não têm acesso a hospitais.",
    objectives: [
      "Aquisição e adaptação de uma embarcação de médio porte.",
      "Equipamento de um consultório odontológico e um clínico.",
      "Formação de equipe multidisciplinar fixa para viagens mensais."
    ],
    gallery: [
      "assets/img/project-barco-saude.jpg",
      "assets/img/project-details-gallery-3.jpg"
    ],
    image: "assets/img/project-barco-saude.jpg",
    raised: 5000,
    goal: 150000,
    status: "Novo"
  }
];

const Projects: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'Todos'>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | 'Ativos' | 'Concluídos'>('Todos');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      // Check if it's a valid category value
      const validCategory = Object.values(ProjectCategory).find(c => c === category);
      if (validCategory) {
        setSelectedCategory(validCategory);
      } else if (category === 'Todos') {
        setSelectedCategory('Todos');
      }
    } else {
      setSelectedCategory('Todos');
    }
  }, [searchParams]);

  // Reset filter reset visible count
  const handleCategoryChange = (category: ProjectCategory | 'Todos') => {
    setSelectedCategory(category);
    setVisibleCount(6);
  };

  const handleStatusChange = (status: 'Todos' | 'Ativos' | 'Concluídos') => {
    setSelectedStatus(status);
    setVisibleCount(6);
  };

  const filteredProjects = projectsData
    .filter(p => {
      const categoryMatch = selectedCategory === 'Todos' || p.category === selectedCategory;
      const statusMatch = selectedStatus === 'Todos' ||
        (selectedStatus === 'Ativos' && p.status !== 'Concluído') ||
        (selectedStatus === 'Concluídos' && p.status === 'Concluído');
      return categoryMatch && statusMatch;
    })
    .sort((a, b) => {
      const statusPriority: Record<string, number> = {
        'Quase Lá': 0,
        'Novo': 1,
        'Em Andamento': 2,
        'Concluído': 3
      };

      const priorityA = statusPriority[a.status] ?? 99;
      const priorityB = statusPriority[b.status] ?? 99;

      return priorityA - priorityB;
    });

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const scrollToProjects = () => {
    const element = document.getElementById('lista-projetos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="relative overflow-hidden w-full">
        <div className="relative min-h-[400px] flex flex-col items-center justify-center text-center p-8">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="h-full w-full bg-cover bg-center transition-transform duration-700" style={{ backgroundImage: 'url("assets/img/projects-hero-bg.jpg")' }}>
            </div>
          </div>
          <div className="relative z-20 flex flex-col items-center gap-6 max-w-3xl px-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs md:text-sm font-bold text-white backdrop-blur-sm border border-white/20 uppercase tracking-[0.2em]">
              <span className="material-symbols-outlined text-sm">volunteer_activism</span>
              Impacto Real
            </div>
            <h1 className="text-white h1-standard">
              Nossos Projetos <br />
              <span className="text-white">Transformam Vidas</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl font-light">
              Conheça as iniciativas que estão protegendo a biodiversidade e fortalecendo as comunidades da floresta amazônica.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setSelectedStatus('Ativos');
                  scrollToProjects();
                }}
                className="flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-bold text-white hover:brightness-110 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
              >
                Ver Projetos Ativos
              </button>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 text-base font-bold text-white hover:bg-white/20 backdrop-blur-sm transition-all border border-white/30 hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined mr-2">play_circle</span>
                Assista ao Vídeo
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full flex-1 flex justify-center py-12 md:py-20">
        <div className="flex flex-col max-w-[960px] flex-1 px-4 lg:px-0">

          {/* Video Modal */}
          {isVideoOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <button
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/BfiILjoAT-U?autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}


          <div className="sticky top-24 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur px-4 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 py-6">
              <h2 id="lista-projetos" className="text-text-main-light dark:text-white h2-standard scroll-mt-32">Explorar Projetos</h2>
              <div className="flex flex-wrap gap-2">
                {['Todos', ...Object.values(ProjectCategory)].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      handleCategoryChange(category as ProjectCategory | 'Todos');
                      setSelectedStatus('Todos'); // Reset status when picking a category for simplicity
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ring-1 ring-inset ${selectedCategory === category
                      ? 'bg-[#0d1b12] text-white ring-gray-300 dark:ring-0'
                      : 'bg-white dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-text-main-light ring-gray-200 dark:ring-gray-700'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 pb-20 pt-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project) => (
                <article key={project.id} className={`group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 ${project.status === 'Concluído' ? 'opacity-90 hover:opacity-100' : ''}`}>
                  <div className={`relative h-60 overflow-hidden ${project.status === 'Concluído' ? 'grayscale group-hover:grayscale-0' : ''} transition-all duration-500`}>
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500" style={{ backgroundImage: `url("${project.image}")` }}></div>
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${project.status === 'Em Andamento' ? 'bg-green-100 text-green-800 ring-green-600/20' :
                        project.status === 'Quase Lá' ? 'bg-blue-100 text-blue-800 ring-blue-600/20' :
                          project.status === 'Novo' ? 'bg-green-100 text-green-800 ring-green-600/20' :
                            'bg-gray-100 text-gray-800 ring-gray-600/20 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{project.category}</h4>
                      <h3 className="mt-2 text-xl md:text-2xl font-bold text-text-main-light dark:text-white group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                      {project.description}
                    </p>

                    {project.status === 'Concluído' ? (
                      <div className="mb-6 flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="flex items-center gap-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                          <span className="material-symbols-outlined text-sm">calendar_month</span>
                          {project.year}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                          {project.power ? (
                            <>
                              <span className="material-symbols-outlined text-sm">bolt</span>
                              {project.power} Gerados
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">groups</span>
                              {project.beneficiaries} Beneficiadas
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="mb-2 flex justify-between text-xs font-medium">
                          <span className="text-text-main-light dark:text-gray-300">R$ {project.raised.toLocaleString('pt-BR')} arrecadados</span>
                          <span className="text-text-secondary-light dark:text-gray-400">Meta: R$ {project.goal.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((project.raised / project.goal) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    )}

                    <Link to={`/projetos/${project.id}`} className={`inline-flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold transition-colors group/btn ${project.status === 'Concluído' ? 'bg-gray-50 dark:bg-gray-800 text-text-main-light dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700' : 'bg-background-light dark:bg-background-dark text-text-main-light dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                      {project.status === 'Concluído' ? 'Ver Relatório' : 'Saiba Mais'}
                      <span className={`material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1 ${project.status === 'Concluído' ? 'icon-description' : 'icon-arrow_forward'}`}>
                        {project.status === 'Concluído' ? 'description' : 'arrow_forward'}
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {hasMore ? (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-text-main-light transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-surface-dark dark:text-white dark:hover:bg-gray-800"
                >
                  Carregar Mais Projetos
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            ) : (
              <div className="mt-12 flex justify-center">
                <p className="text-text-secondary-light dark:text-text-secondary-dark italic">Você chegou ao fim da lista.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      <section className="py-24 relative overflow-hidden text-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="assets/img/cta-projetos-bg.jpg"
            alt="Fundo Projetos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 dark:bg-primary/90 backdrop-blur-[1px]"></div>
        </div>

        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-white/10 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white/5 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="material-symbols-outlined mb-6 text-6xl text-white opacity-90 inline-block">volunteer_activism</span>
          <h2 className="text-white h2-standard mb-4">
            Apoio direto aos Povos da Floresta
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg md:text-xl text-white/80 font-light leading-relaxed">
            Sua doação garante saúde, território e proteção para indígenas, caboclos e comunidades tradicionais da Amazônia.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link to="/projetos" className="h-14 px-10 rounded-full bg-white hover:bg-gray-100 text-primary font-black transition-all shadow-xl shadow-black/10 flex items-center justify-center">
              Doar Agora
            </Link>
            <Link to="/contato" className="h-14 px-10 rounded-full border-2 border-white/30 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center">
              Ser Voluntário
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;