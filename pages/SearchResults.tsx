import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import { Project, ProjectCategory } from '../types';
import { supabase } from '../lib/supabase';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const performSearch = async () => {
            if (!query) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const lowerQuery = query.toLowerCase();

            try {
                // Fetch projects from Supabase and filter them
                const { data: projectsData, error } = await supabase
                    .from('projects')
                    .select('*');

                if (error) throw error;

                const mappedProjects: Project[] = (projectsData || []).map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    category: p.category as ProjectCategory,
                    description: p.description,
                    fullDescription: p.full_description,
                    image: p.image_url,
                    raised: p.raised_amount,
                    goal: p.goal_amount,
                    status: p.status,
                    beneficiaries: p.beneficiaries_count,
                    year: p.year,
                    gallery: p.gallery,
                    objectives: p.impact_data?.objectives || []
                }));

                const projects = mappedProjects.filter(p =>
                    p.title.toLowerCase().includes(lowerQuery) ||
                    p.description.toLowerCase().includes(lowerQuery) ||
                    p.category.toLowerCase().includes(lowerQuery)
                );


                setFilteredProjects(projects);
            } catch (error) {
                console.error('Erro na busca:', error);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [query]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-medium text-text-main-light dark:text-white mb-2">Buscando na floresta...</h2>
            </div>
        );
    }

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search</span>
                <h2 className="text-2xl font-bold text-text-main-light dark:text-white mb-2">Digite algo para buscar</h2>
            </div>
        );
    }

    const hasResults = filteredProjects.length > 0;

    return (
        <div className="w-full min-h-screen bg-background-light dark:bg-background-dark pb-20">
            <div className="bg-surface-white dark:bg-surface-dark border-b border-stone-100 dark:border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-text-main-light dark:text-white h1-standard mb-4">
                        Resultados para: <span className="text-white">"{query}"</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark font-light">
                        Encontramos {filteredProjects.length} resultados.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16">

                {!hasResults && (
                    <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-surface-dark rounded-3xl border border-stone-100 dark:border-white/10 border-dashed">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                        <p className="text-xl text-text-main-light dark:text-white font-bold mb-2">Nenhum resultado encontrado</p>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                            Tente usar termos diferentes ou mais genéricos.
                        </p>
                        <Link to="/" className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-colors">
                            Voltar para o Início
                        </Link>
                    </div>
                )}

                {filteredProjects.length > 0 && (
                    <section>
                        <h2 className="text-text-main-light dark:text-white h2-standard mb-8 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl md:text-5xl">forest</span>
                            Projetos
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects.map(project => (
                                <Link to={`/projetos/${project.id}`} key={project.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500" style={{ backgroundImage: `url("${project.image}")` }}></div>
                                        <div className="absolute top-4 right-4">
                                            <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-text-main-light dark:text-white">
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-1 flex-col">
                                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">{project.category}</h4>
                                        <h3 className="text-xl font-bold text-text-main-light dark:text-white mb-3 group-hover:text-primary transition-colors tracking-tight">{project.title}</h3>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-3">{project.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}



            </div>
        </div>
    );
};

export default SearchResults;