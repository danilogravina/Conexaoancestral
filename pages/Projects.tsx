import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Project, ProjectCategory } from '../types';
import { supabase } from '../lib/supabase';
import { ensureAbsolutePath } from '../lib/utils';

const Projects: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'Todos'>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | 'Ativos' | 'Concluídos'>('Todos');
  const [visibleCount, setVisibleCount] = useState(6);


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;

      if (data) {
        // Map database snake_case to frontend camelCase
        const mappedProjects: Project[] = data.map((p: any) => {
          let projectData = {
            id: p.id,
            title: p.title,
            category: p.category as ProjectCategory,
            description: p.description,
            fullDescription: p.full_description,
            image: ensureAbsolutePath(p.image_url),
            raised: 0,
            goal: p.goal_amount,
            status: 'Em Planejamento' as const,
            beneficiaries: p.beneficiaries_count,
            year: p.year,
            gallery: (p.gallery || []).map(ensureAbsolutePath),
            objectives: p.impact_data?.objectives || [],
            testimonials: p.impact_data?.testimonials || []
          };
          if (projectData.title === 'Escola Viva da Floresta') {
            projectData.title = 'Projeto de Infraestrutura e Gestão Participativa de Água no Território Katukina';
            projectData.description = 'Implementação de solução sustentável de captação e distribuição de água para assegurar água de qualidade no território Katukina.';
            projectData.category = ProjectCategory.WATER;
          }
          if (projectData.title === 'Agrofloresta Comunitária') {
            projectData.title = 'Projeto Aldeia Sagrada - Construção do Centro Yuvanapanamaritiru';
            projectData.description = 'O Centro Yuvanapanamaritiru é um santuário para a medicina tradicional, fortalecendo a cultura e a autonomia do povo Shawãdawa (Arara).';
            projectData.category = ProjectCategory.CULTURE;
          }
          return projectData;
        });

        // List of authorized titles
        const allowedTitles = [
          'Projeto de Infraestrutura e Gestão Participativa de Água no Território Katukina',
          'Projeto Aldeia Sagrada - Construção do Centro Yuvanapanamaritiru',
          'Centro Cerimonial de Cultura Huni Kuin do Rio Breu'
        ];

        // Add the new synthetic Huni Kuin project
        const huniKuinTitle = 'Centro Cerimonial de Cultura Huni Kuin do Rio Breu';
        const huniKuinProject: Project = {
          id: 'huni-kuin-rio-breu',
          title: huniKuinTitle,
          category: 'Cultura',
          description: 'Criação de um Centro Cerimonial de Cultura para fortalecer a identidade, os saberes ancestrais e a continuidade cultural do povo Huni Kuin.',
          fullDescription: '',
          image: '/assets/img/project-huni-kuin.png',
          raised: 0,
          goal: 50000,
          status: 'Em Planejamento' as const,
          beneficiaries: 0,
          year: 2025,
          gallery: ['/assets/img/project-huni-kuin.png'],
          objectives: [
            'Construção do Centro Cerimonial',
            'Santuário para medicinas tradicionais',
            'Espaço de transmissão de saberes ancestrais'
          ]
        };

        const allProjects = [...mappedProjects, huniKuinProject];

        // Filter to keep only one instance of each allowed project
        const finalProjects: Project[] = [];
        const seenTitles = new Set();

        allowedTitles.forEach(title => {
          const project = allProjects.find(p => p.title === title && !seenTitles.has(title));
          if (project) {
            finalProjects.push(project);
            seenTitles.add(title);
          }
        });

        setProjects(finalProjects);
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    } finally {
      setIsLoading(false);
    }
  };


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

  const filteredProjects = projects
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



  if (isLoading && projects.length === 0) {
    return (
      <div className="flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen">
        <div className="w-full flex-1 flex justify-center py-12 md:py-20">
          <div className="flex flex-col max-w-[960px] flex-1 px-4 lg:px-0">
            <div className="flex animate-pulse flex-col gap-8">
              <div className="h-64 w-full rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="relative overflow-hidden w-full">
        <div className="relative min-h-[400px] flex flex-col items-center justify-center text-center p-8">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="h-full w-full bg-cover bg-center transition-transform duration-700" style={{ backgroundImage: 'url("/assets/img/projects-hero1-bg.jpg?v=2")' }}>
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
              Conheça iniciativas que preservam culturas vivas, fortalecem saberes ancestrais e promovem a autonomia dos povos da floresta.
            </p>

          </div>
        </div>
      </section>

      <div className="w-full flex-1 flex justify-center py-12 md:py-20">
        <div className="flex flex-col max-w-[960px] flex-1 px-4 lg:px-0">




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
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${project.status === 'Em Planejamento' ? 'bg-indigo-100 text-indigo-800 ring-indigo-600/20 dark:bg-indigo-900/30 dark:text-indigo-300' :
                        project.status === 'Em Andamento' ? 'bg-green-100 text-green-800 ring-green-600/20' :
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
            src="/assets/img/cta-projetos-bg.jpg"
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
          <div className="flex flex-col items-center justify-center">
            <Link to="/projetos" className="h-14 px-12 rounded-full bg-white hover:bg-gray-100 text-primary font-black transition-all shadow-xl shadow-black/10 flex items-center justify-center">
              Doar Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;