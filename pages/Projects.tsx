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
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | 'Ativos' | 'Concluídos'>('Ativos');
  const [visibleCount, setVisibleCount] = useState(6);


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const [{ data, error }, campaignRes] = await Promise.all([
        supabase.from('projects').select('*'),
        fetch('/api/public/campaigns').then((r) => r.json()).catch(() => []),
      ]);

      if (error) throw error;

      const campaignProgress = Array.isArray(campaignRes) ? campaignRes : [];

      if (data) {
        const mappedProjects: Project[] = data.map((p: any) => {
          const campaign = campaignProgress.find((c: any) => c.slug === p.id);
          const confirmedTotal = campaign ? Number(campaign.confirmed_total || 0) : Number(p.raised_amount) || 0;
          const goalAmount = campaign ? Number(campaign.goal_amount || p.goal_amount || 0) : Number(p.goal_amount) || 0;

          return {
            id: p.id,
            title: p.title,
            category: p.category as ProjectCategory,
            description: p.description,
            fullDescription: p.full_description,
            image: ensureAbsolutePath(p.image_url),
            raised: confirmedTotal,
            goal: goalAmount,
            status: p.status as Project['status'],
            beneficiaries: p.beneficiaries_count,
            year: p.year,
            gallery: (p.gallery || []).map(ensureAbsolutePath),
            objectives: p.impact_data?.objectives || [],
            testimonials: p.impact_data?.testimonials || []
          };
        });

        setProjects(mappedProjects);
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

  // Helper to determine if a project matches the selected status filter
  const matchesStatusFilter = (p: Project, statusFilter: typeof selectedStatus) => {
    if (statusFilter === 'Todos') return true;
    if (statusFilter === 'Ativos') return p.status !== 'Concluído';
    return statusFilter === 'Concluídos' ? p.status === 'Concluído' : true;
  };

  // Compute available categories based on current status filter so we only show filters with results
  const availableCategories = Array.from(new Set(projects.filter(p => matchesStatusFilter(p, selectedStatus)).map(p => p.category)));

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
          <div className="flex flex-col max-w-6xl flex-1 px-4 lg:px-0">
            <div className="flex animate-pulse flex-col gap-8">
              <div className="h-64 w-full rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-96 rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
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

      <div className="w-full flex-1 flex justify-center py-12 md:py-20 relative">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="pointer-events-none absolute bottom-0 left-[-120px] h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative flex flex-col max-w-6xl flex-1 px-4 lg:px-0">




          <div className="sticky top-20 z-40 mb-10 rounded-2xl border border-gray-100/80 dark:border-gray-800/80 bg-white/90 dark:bg-surface-dark/90 shadow-sm backdrop-blur px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-gray-100/70 dark:border-gray-800/70 py-6">
              <div className="flex flex-col">
                <h2 id="lista-projetos" className="text-text-main-light dark:text-white h2-standard scroll-mt-32">Explorar Projetos</h2>
                <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Mostrando {visibleProjects.length} de {filteredProjects.length} projetos
                </p>
              </div>
              <div className="flex w-full items-center justify-between flex-wrap gap-5">
                <div className="flex items-center gap-3">
                  <label htmlFor="statusFilter" className="sr-only">Filtrar por status</label>
                  <div className="relative inline-flex">
                    <select
                      id="statusFilter"
                      value={selectedStatus}
                      onChange={(e) => { setSelectedStatus(e.target.value as any); setVisibleCount(6); setSelectedCategory('Todos'); }}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-surface-dark/90 px-3 py-2 pr-8 text-sm font-medium text-text-main-light dark:text-white shadow-sm shadow-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    >
                      <option value="Ativos">Ativos</option>
                      <option value="Concluídos">Finalizados</option>
                      <option value="Todos">Todos</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 items-center">
                  <button onClick={() => handleCategoryChange('Todos')} className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === 'Todos' ? 'bg-primary text-white shadow-sm shadow-primary/20 ring-1 ring-primary/20' : 'bg-white/80 dark:bg-surface-dark/80 text-text-secondary-light dark:text-text-secondary-dark hover:bg-white dark:hover:bg-gray-800 ring-1 ring-inset ring-black/5 dark:ring-white/10'}`}>Todos</button>
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category as ProjectCategory)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === category
                        ? 'bg-primary text-white shadow-sm shadow-primary/20 ring-1 ring-primary/20'
                        : 'bg-white/80 dark:bg-surface-dark/80 text-text-secondary-light dark:text-text-secondary-dark hover:bg-white dark:hover:bg-gray-800 ring-1 ring-inset ring-black/5 dark:ring-white/10'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-20 pt-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project) => (
                <Link
                  to={`/projetos/${project.id}`}
                  key={project.id}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white/90 dark:bg-surface-dark/90 shadow-sm ring-1 ring-black/5 dark:ring-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 min-h-0 ${project.status === 'Concluído' ? 'opacity-90 hover:opacity-100' : ''}`}
                >
                  <div className={`relative h-64 overflow-hidden ${project.status === 'Concluído' ? 'grayscale group-hover:grayscale-0' : ''} transition-all duration-500`}>
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${project.image}")` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="absolute top-4 right-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset shadow-sm backdrop-blur ${project.status === 'Em Planejamento' ? 'bg-indigo-100/90 text-indigo-800 ring-indigo-600/20 dark:bg-indigo-900/40 dark:text-indigo-300' :
                        project.status === 'Em Andamento' ? 'bg-green-100/90 text-green-800 ring-green-600/20' :
                          project.status === 'Quase Lá' ? 'bg-blue-100/90 text-blue-800 ring-blue-600/20' :
                            project.status === 'Novo' ? 'bg-green-100/90 text-green-800 ring-green-600/20' :
                              'bg-gray-100/90 text-gray-800 ring-gray-600/20 dark:bg-gray-700/70 dark:text-gray-300'
                        }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6 min-h-0">
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{project.category}</h4>
                      <h3 className="mt-2 text-xl md:text-2xl font-bold text-text-main-light dark:text-white group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark line-clamp-4">
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

                    <div className={`inline-flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors group/btn ring-1 ring-inset ring-black/5 dark:ring-white/10 ${project.status === 'Concluído' ? 'bg-gray-50 dark:bg-gray-800 text-text-main-light dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700' : 'bg-background-light dark:bg-background-dark text-text-main-light dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                      {project.status === 'Concluído' ? 'Ver Relatório' : 'Saiba Mais'}
                      <span className={`material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1 ${project.status === 'Concluído' ? 'icon-description' : 'icon-arrow_forward'}`}>
                        {project.status === 'Concluído' ? 'description' : 'arrow_forward'}
                      </span>
                    </div>
                  </div>
                </Link>
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
