import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { projectsData } from './Projects';
import { blogPosts } from './Blog';
import { Project, BlogPost } from '../types';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        if (!query) return;
        const lowerQuery = query.toLowerCase();

        const projects = projectsData.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );

        const posts = blogPosts.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.excerpt.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );

        setFilteredProjects(projects);
        setFilteredPosts(posts);
    }, [query]);

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search</span>
                <h2 className="text-2xl font-bold text-text-main-light dark:text-white mb-2">Digite algo para buscar</h2>
            </div>
        );
    }

    const hasResults = filteredProjects.length > 0 || filteredPosts.length > 0;

    return (
        <div className="w-full min-h-screen bg-background-light dark:bg-background-dark pb-20">
            <div className="bg-surface-white dark:bg-surface-dark border-b border-stone-100 dark:border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-text-main-light dark:text-white h1-standard mb-4">
                        Resultados para: <span className="text-white">"{query}"</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark font-light">
                        Encontramos {filteredProjects.length + filteredPosts.length} resultados.
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

                {filteredPosts.length > 0 && (
                    <section>
                        <h2 className="text-text-main-light dark:text-white h2-standard mb-8 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl md:text-5xl">article</span>
                            Blog & Notícias
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map(post => (
                                <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500" />
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-text-main-light dark:text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                            {post.date}
                                        </div>
                                        <h3 className="text-xl font-bold text-text-main-light dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2 font-normal">{post.excerpt}</p>
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