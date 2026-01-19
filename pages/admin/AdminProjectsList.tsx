import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Project } from '../../types';
import { ensureAbsolutePath } from '../../lib/utils';

const AdminProjectsList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedProjects: Project[] = data.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    category: p.category,
                    description: p.description,
                    image: ensureAbsolutePath(p.image_url),
                    raised: Number(p.raised_amount) || 0,
                    goal: Number(p.goal_amount) || 0,
                    status: p.status,
                } as Project));
                setProjects(mappedProjects);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            alert('Erro ao carregar projetos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string | number) => {
        if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Erro ao excluir projeto.');
        }
    };

    const handleMarkComplete = async (id: string | number) => {
        if (!window.confirm('Marcar este projeto como concluído?')) return;

        try {
            const { error } = await supabase
                .from('projects')
                .update({ status: 'Concluído' })
                .eq('id', id);

            if (error) throw error;

            setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'Concluído' } : p));
        } catch (error) {
            console.error('Error marking project complete:', error);
            alert('Erro ao marcar projeto como concluído.');
        }
    };

    if (isLoading) {
        return <div className="p-8">Carregando...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-text-main-light dark:text-white">Projetos</h1>
                <Link
                    to="/admin/projects/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
                >
                    <span className="material-symbols-outlined">add</span>
                    Novo Projeto
                </Link>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-stone-100 dark:border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-gray-400 uppercase tracking-wider">Projeto</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-gray-400 uppercase tracking-wider">Meta</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary-light dark:text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-200"
                                        />
                                        <div>
                                            <p className="font-bold text-text-main-light dark:text-white text-sm line-clamp-1">{project.title}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-text-secondary-light dark:text-gray-300">
                                        {project.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Concluído' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                            project.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-text-secondary-light dark:text-gray-300">
                                    R$ {project.goal.toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            to={`/admin/projects/${project.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </Link>
                                        {project.status !== 'Concluído' && (
                                            <button
                                                onClick={() => handleMarkComplete(project.id)}
                                                className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors dark:text-green-400 dark:hover:bg-green-900/20"
                                                title="Marcar como concluído"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">task_alt</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                                            title="Excluir"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {projects.length === 0 && (
                    <div className="p-8 text-center text-text-secondary-light dark:text-gray-400">
                        Nenhum projeto encontrado.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProjectsList;
