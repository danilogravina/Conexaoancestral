import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ProjectCategory, Testimonial } from '../../types';

interface ProjectFormData {
    title: string;
    category: string;
    status: string;
    goal_amount: number;
    raised_amount: number;
    description: string;
    full_description: string;
    image_url: string;
    beneficiaries_count: number;
    year: number;
    power: string;
    gallery: string[];
    objectives: string[];
    testimonials: Testimonial[];
}

const AdminProjectForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'media' | 'impact'>('details');

    // Initial State
    const [formData, setFormData] = useState<ProjectFormData>({
        title: '',
        category: '',
        status: 'Novo',
        goal_amount: 0,
        raised_amount: 0,
        description: '',
        full_description: '',
        image_url: '',
        beneficiaries_count: 0,
        year: new Date().getFullYear(),
        power: '',
        gallery: [],
        objectives: [],
        testimonials: []
    });

    useEffect(() => {
        if (isEditing) {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    title: data.title,
                    category: data.category || '',
                    status: data.status || 'Novo',
                    goal_amount: data.goal_amount || 0,
                    raised_amount: data.raised_amount || 0,
                    description: data.description || '',
                    full_description: data.full_description || '',
                    image_url: data.image_url || '',
                    beneficiaries_count: data.beneficiaries_count || 0,
                    year: data.year || new Date().getFullYear(),
                    power: data.impact_data?.power || '',
                    gallery: data.gallery || [],
                    objectives: data.impact_data?.objectives || [],
                    testimonials: data.impact_data?.testimonials || []
                });
            }
        } catch (error) {
            console.error('Error fetching project:', error);
            alert('Erro ao carregar dados do projeto.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Dynamic List Handlers ---

    const handleArrayChange = (index: number, value: string, field: 'gallery' | 'objectives') => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field: 'gallery' | 'objectives') => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (index: number, field: 'gallery' | 'objectives') => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    // --- Testimonial Handlers ---

    const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string) => {
        const newTestimonials = [...formData.testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
    };

    const addTestimonial = () => {
        setFormData(prev => ({
            ...prev,
            testimonials: [...prev.testimonials, { name: '', role: '', quote: '', avatar: '' }]
        }));
    };

    const removeTestimonial = (index: number) => {
        const newTestimonials = [...formData.testimonials];
        newTestimonials.splice(index, 1);
        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
    };

    // --- Submit ---

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const projectData = {
            title: formData.title,
            category: formData.category,
            status: formData.status,
            goal_amount: formData.goal_amount,
            raised_amount: formData.raised_amount,
            description: formData.description,
            full_description: formData.full_description,
            image_url: formData.image_url,
            beneficiaries_count: formData.beneficiaries_count,
            year: formData.year,
            gallery: formData.gallery.filter(url => url.trim() !== ''), // Remove empty URLs
            impact_data: {
                power: formData.power,
                objectives: formData.objectives.filter(obj => obj.trim() !== ''),
                testimonials: formData.testimonials.filter(t => t.name.trim() !== '')
            }
        };

        try {
            if (isEditing) {
                const { error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('projects')
                    .insert([projectData]);
                if (error) throw error;
            }

            alert(isEditing ? 'Projeto atualizado!' : 'Projeto criado!');
            navigate('/admin/projects');
        } catch (error: any) {
            console.error('Error saving project:', error);
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-text-main-light dark:text-white">
                    {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
                </h1>
                <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'details' ? 'bg-white dark:bg-black/40 shadow-sm text-primary' : 'text-text-secondary-light dark:text-gray-400'}`}
                    >
                        Detalhes
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'media' ? 'bg-white dark:bg-black/40 shadow-sm text-primary' : 'text-text-secondary-light dark:text-gray-400'}`}
                    >
                        Mídia & Galeria
                    </button>
                    <button
                        onClick={() => setActiveTab('impact')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'impact' ? 'bg-white dark:bg-black/40 shadow-sm text-primary' : 'text-text-secondary-light dark:text-gray-400'}`}
                    >
                        Impacto & Objetivos
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-stone-100 dark:border-white/10 space-y-8">

                {/* TAB: DETAILS */}
                {activeTab === 'details' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Título do Projeto</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Categoria</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                >
                                    <option value="">Selecione...</option>
                                    {Object.values(ProjectCategory).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                >
                                    <option value="Novo">Novo</option>
                                    <option value="Em Andamento">Em Andamento</option>
                                    <option value="Quase Lá">Quase Lá</option>
                                    <option value="Concluído">Concluído</option>
                                    <option value="Em Planejamento">Em Planejamento</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Meta Financeira (R$)</label>
                                <input
                                    type="number"
                                    name="goal_amount"
                                    value={formData.goal_amount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Valor Arrecadado (R$)</label>
                                <input
                                    type="number"
                                    name="raised_amount"
                                    value={formData.raised_amount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Resumo (Card)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Descrição Completa</label>
                            <textarea
                                name="full_description"
                                value={formData.full_description}
                                onChange={handleChange}
                                rows={8}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                            />
                        </div>
                    </div>
                )}

                {/* TAB: MEDIA & GALLERY */}
                {activeTab === 'media' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10">
                            <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-4">Imagem de Capa (Banner)</h3>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">URL da Imagem</label>
                                    <input
                                        type="text"
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Recomendado: 1200x600 px</p>
                                </div>
                                <div className="w-full md:w-1/3 aspect-video bg-gray-200 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 flex items-center justify-center">
                                    {formData.image_url ? (
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '/assets/img/placeholder.jpg')} />
                                    ) : (
                                        <span className="text-gray-400 material-symbols-outlined text-4xl">image</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-text-main-light dark:text-white">Galeria de Fotos</h3>
                                <button type="button" onClick={() => addArrayItem('gallery')} className="text-sm text-primary font-bold hover:underline">+ Adicionar Foto</button>
                            </div>

                            <div className="space-y-3">
                                {formData.gallery.map((url, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => handleArrayChange(index, e.target.value, 'gallery')}
                                            placeholder="URL da foto..."
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem(index, 'gallery')}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                ))}
                                {formData.gallery.length === 0 && <p className="text-sm text-gray-500 italic">Nenhuma foto adicionada.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: IMPACT & OBJECTIVES */}
                {activeTab === 'impact' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Beneficiários</label>
                                <input
                                    type="number"
                                    name="beneficiaries_count"
                                    value={formData.beneficiaries_count}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Ano</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-main-light dark:text-gray-300 mb-2">Energia / Impacto</label>
                                <input
                                    type="text"
                                    name="power"
                                    value={formData.power}
                                    onChange={handleChange}
                                    placeholder="Ex: 5kW"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-white/10 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-text-main-light dark:text-white">Objetivos do Projeto</h3>
                                <button type="button" onClick={() => addArrayItem('objectives')} className="text-sm text-primary font-bold hover:underline">+ Adicionar Objetivo</button>
                            </div>
                            <div className="space-y-3">
                                {formData.objectives.map((obj, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={obj}
                                            onChange={(e) => handleArrayChange(index, e.target.value, 'objectives')}
                                            placeholder="Descreva um objetivo..."
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-black/20 dark:border-white/10 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem(index, 'objectives')}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                ))}
                                {formData.objectives.length === 0 && <p className="text-sm text-gray-500 italic">Nenhum objetivo adicionado.</p>}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-white/10 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-text-main-light dark:text-white">Depoimentos</h3>
                                <button type="button" onClick={addTestimonial} className="text-sm text-primary font-bold hover:underline">+ Adicionar Depoimento</button>
                            </div>
                            <div className="space-y-6">
                                {formData.testimonials.map((testimonial, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl relative border border-gray-100 dark:border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => removeTestimonial(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                value={testimonial.name}
                                                onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                                                placeholder="Nome da pessoa"
                                                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={testimonial.role}
                                                onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                                                placeholder="Cargo / Função"
                                                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={testimonial.avatar}
                                                onChange={(e) => handleTestimonialChange(index, 'avatar', e.target.value)}
                                                placeholder="URL Foto Avatar"
                                                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm"
                                            />
                                            <div className="md:col-span-2">
                                                <textarea
                                                    value={testimonial.quote}
                                                    onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                                                    placeholder="Depoimento..."
                                                    rows={2}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {formData.testimonials.length === 0 && <p className="text-sm text-gray-500 italic">Nenhum depoimento adicionado.</p>}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-white/10">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/projects')}
                        className="px-6 py-3 rounded-lg border border-gray-300 font-bold hover:bg-gray-50 transition-colors dark:text-white dark:hover:bg-white/5"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 rounded-lg bg-primary text-[#0d1b12] font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                        {isLoading ? 'Salvando...' : 'Salvar Projeto'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProjectForm;
