import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        slug: 'guardioes-da-floresta',
        title: "Guardiões da Floresta: Como a tecnologia ajuda na preservação",
        excerpt: "Descubra como ferramentas modernas como GPS e drones estão sendo aliadas dos saberes ancestrais na proteção do território contra o desmatamento ilegal.",
        category: "Meio Ambiente",
        date: "14 Out, 2023",
        readTime: "8 min",
        image: "assets/img/blog-guardioes-tech.jpg",
        author: {
            name: "Mariana Txucarramãe",
            avatar: "assets/img/author-mariana.jpg"
        },
        featured: true
    },
    {
        id: '2',
        slug: 'escola-yanomami',
        title: "Nova escola inaugurada na aldeia Yanomami",
        excerpt: "Um espaço construído com técnicas tradicionais e modernas para garantir educação de qualidade sem perder a identidade cultural.",
        category: "Educação",
        date: "12 Out, 2023",
        readTime: "5 min",
        image: "assets/img/blog-escola-yanomami.jpg",
        author: {
            name: "João Silva",
            avatar: "assets/img/author-joao.jpg"
        }
    },
    {
        id: '3',
        slug: 'ritual-da-chuva',
        title: "O ritual da chuva: Tradições que sobrevivem",
        excerpt: "Documentamos o ritual sagrado que marca o início da estação das águas, preservando a memória oral dos anciões.",
        category: "Cultura",
        date: "08 Out, 2023",
        readTime: "12 min",
        image: "assets/img/blog-ritual-chuva.jpg",
        author: {
            name: "Ana Terra",
            avatar: "assets/img/author-ana.jpg"
        }
    },
    {
        id: '4',
        slug: 'arte-de-tecer',
        title: "A arte de tecer: Histórias entrelaçadas",
        excerpt: "Como as mulheres da comunidade estão gerando renda e autonomia através do artesanato tradicional sustentável.",
        category: "Sustentabilidade",
        date: "01 Out, 2023",
        readTime: "6 min",
        image: "assets/img/blog-arte-tecer.jpg",
        author: {
            name: "Clara Luz",
            avatar: "assets/img/author-clara.jpg"
        }
    },
    {
        id: '5',
        slug: 'saude-que-vem-da-terra',
        title: "Saúde que vem da terra: Plantas medicinais",
        excerpt: "Um guia sobre como os saberes sobre ervas e plantas da Amazônia estão sendo catalogados para futuras gerações.",
        category: "Saúde",
        date: "25 Set, 2023",
        readTime: "7 min",
        image: "assets/img/blog-plantas-medicinais.jpg",
        author: {
            name: "Dr. André",
            avatar: "assets/img/author-andre.jpg"
        }
    }
];

const Blog: React.FC = () => {
    const [email, setEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

    const categories = ['Todos', 'Meio Ambiente', 'Educação', 'Cultura', 'Sustentabilidade', 'Saúde'];

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && categories.includes(categoryParam)) {
            setSelectedCategory(categoryParam);
        } else {
            setSelectedCategory('Todos');
        }
    }, [searchParams]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        if (category === 'Todos') {
            searchParams.delete('category');
            setSearchParams(searchParams);
        } else {
            setSearchParams({ category });
        }
    };

    const showFeaturedBanner = selectedCategory === 'Todos' && !searchQuery;
    const featuredPostData = blogPosts.find(post => post.featured);
    const featuredPost = showFeaturedBanner ? featuredPostData : null;

    const otherPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
        const query = searchQuery.toLowerCase();
        const matchesSearch = post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query);
        const isCurrentlyShownAsFeatured = featuredPost && post.id === featuredPost.id;

        return matchesCategory && matchesSearch && !isCurrentlyShownAsFeatured;
    });

    const handleSubscribe = () => {
        if (!email || !email.includes('@')) {
            alert("Por favor, digite um e-mail válido.");
            return;
        }
        alert(`Obrigado! O e-mail ${email} foi inscrito na nossa newsletter.`);
        setEmail('');
    };

    return (
        <div className="w-full">
            {/* Hero Section - Full Width Standardized */}
            <section className="relative flex items-center justify-center min-h-[400px] overflow-hidden w-full">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img
                        src="assets/img/blog-hero-bg.jpg"
                        alt="Blog Conexão Ancestral"
                        className="w-full h-full object-cover transition-transform duration-1000"
                    />
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl z-0"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        Blog & Notícias
                    </span>
                    <h1 className="text-white h1-standard mb-6">
                        Histórias da <span className="text-white">Floresta</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                        Acompanhe nossas ações, conheça as tradições e fique por dentro de tudo o que acontece na Conexão Ancestral.
                    </p>
                </div>
            </section >

            <div className="flex justify-center w-full py-16">
                <div className="max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 relative z-20">
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${selectedCategory === category
                                    ? 'bg-primary text-[#0d1b12] shadow-lg scale-105'
                                    : 'bg-white dark:bg-surface-dark text-text-secondary-light dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent dark:border-gray-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {featuredPost && (
                        <Link to={`/blog/${featuredPost.slug}`} className="group block mb-16 relative rounded-3xl overflow-hidden bg-white dark:bg-surface-dark shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="relative h-64 lg:h-auto overflow-hidden">
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-primary text-[#0d1b12] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                            Destaque
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-4 text-sm font-medium text-primary">
                                        <span className="uppercase tracking-wider">{featuredPost.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-current"></span>
                                        <span className="text-text-secondary-light dark:text-text-secondary-dark">{featuredPost.readTime} de leitura</span>
                                    </div>
                                    <h2 className="text-text-main-light dark:text-white h2-standard mb-6 group-hover:text-primary transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg md:text-xl mb-8 line-clamp-3 font-light leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-3">
                                            <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-text-main-light dark:text-white">{featuredPost.author.name}</span>
                                                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{featuredPost.date}</span>
                                            </div>
                                        </div>
                                        <span className="hidden sm:flex items-center gap-1 text-sm font-bold text-text-main-light dark:text-white group-hover:text-primary transition-colors">
                                            Ler Artigo <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                        <h2 className="text-text-main-light dark:text-white h2-standard">
                            {selectedCategory === 'Todos' ? 'Últimas Publicações' : `Publicações em ${selectedCategory}`}
                        </h2>
                        <div className="relative w-full md:w-80 group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Buscar por título ou conteúdo..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-text-main-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-400 text-sm shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {otherPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {otherPosts.map((post) => (
                                <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500"
                                        />
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
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-1"></span>
                                            <span>{post.readTime} de leitura</span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-text-main-light dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 line-clamp-3 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                                            <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover" />
                                            <span className="text-xs font-bold text-text-main-light dark:text-gray-300">{post.author.name}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 mb-16 bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-gray-800 border-dashed">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                            <p className="text-xl text-text-main-light dark:text-white font-bold mb-2">Nenhum artigo encontrado</p>
                            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                                {searchQuery ? `Não encontramos resultados para "${searchQuery}"` : `Não há publicações na categoria "${selectedCategory}"`}
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    handleCategoryChange('Todos');
                                }}
                                className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-colors"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Newsletter CTA - Full Width */}
            <section className="py-24 relative overflow-hidden">
                {/* Background Image Layer */}
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="assets/img/banner-blog-cta.jpg"
                        alt="Fundo Newsletter"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/70 dark:bg-primary/90 backdrop-blur-[1px]"></div>
                </div>

                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl z-0"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl text-center md:text-left">
                            <h2 className="text-white h2-standard mb-4">
                                Receba notícias da floresta
                            </h2>
                            <p className="text-white/80 text-lg md:text-xl font-light">
                                Junte-se a mais de 10.000 pessoas que recebem nossas atualizações mensais sobre projetos e impacto.
                            </p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="w-full sm:w-72 h-14 px-6 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all backdrop-blur-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                onClick={handleSubscribe}
                                className="w-full sm:w-auto h-14 px-10 bg-white hover:bg-gray-100 text-primary font-black rounded-full transition-all shadow-xl shadow-black/10 whitespace-nowrap"
                            >
                                Inscrever-se
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
};

export default Blog;