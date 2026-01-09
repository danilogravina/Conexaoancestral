import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
    return (
        <div className="w-full bg-background-light dark:bg-background-dark transition-colors duration-300">
            {/* Hero Section - Full Width Standardized */}
            <section className="relative overflow-hidden w-full">
                <div className="relative min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black/40 z-10"></div>
                        <img
                            src="/assets/img/about-hero-bg.jpg"
                            alt="Sobre a Conexão Ancestral"
                            className="w-full h-full object-cover transition-transform duration-1000"
                        />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-20 flex flex-col items-center gap-6 max-w-3xl px-4">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs md:text-sm font-bold text-white backdrop-blur-sm border border-white/20 uppercase tracking-[0.2em]">
                            <span className="material-symbols-outlined text-sm">foundation</span>
                            Institucional
                        </div>
                        <h1 className="text-white h1-standard drop-shadow-lg">
                            Quem Somos
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl font-light drop-shadow-md">
                            Somos uma organização dedicada a fortalecer a autonomia dos povos tradicionais por meio da valorização da cultura, dos saberes ancestrais e da sustentabilidade.
                        </p>
                    </div>
                </div>
            </section>

            {/* Nossa História - Split Layout Section */}
            <section id="historia" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Story Animations */}
                <style>{`
                    @keyframes floatStory {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes driftStory {
                        0%, 100% { transform: translate(0, 0); }
                        50% { transform: translate(15px, 10px); }
                    }
                    @keyframes softPulseStory {
                        0%, 100% { transform: scale(1); opacity: 0.8; }
                        50% { transform: scale(1.05); opacity: 1; }
                    }
                    .animate-float-story { animation: floatStory 6s ease-in-out infinite; }
                    .animate-drift-story { animation: driftStory 8s ease-in-out infinite; }
                    .animate-pulse-soft { animation: softPulseStory 4s ease-in-out infinite; }
                `}</style>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Side */}
                    <div className="flex flex-col gap-8 order-2 lg:order-1">
                        <div>
                            <span className="text-primary text-xs font-black tracking-widest uppercase mb-4 block">ONDE TUDO COMEÇOU</span>
                            <h2 className="h2-standard text-text-main-light dark:text-white mb-6">Nossa História</h2>
                            <div className="flex flex-col gap-6 text-text-secondary-light dark:text-text-secondary-dark text-lg font-light leading-relaxed">
                                <p>
                                    A <span className="text-primary font-bold">Conexão Ancestral – Povos da Floresta</span> é uma organização da sociedade civil fundada em 2025 a partir do encontro entre pessoas comprometidas com a preservação da cultura, do modo de vida e a promoção da autonomia dos povos indígenas e comunidades tradicionais.
                                </p>
                                <p>
                                    Nossa história nasce do convívio direto com comunidades indígenas do Acre, e do reconhecimento de que seus saberes ancestrais, suas culturas e seus territórios são fundamentais para a proteção da floresta e da vida no planeta.
                                </p>
                                <p>
                                    Acreditamos que os povos indígenas são protagonistas de suas próprias histórias e guardiões de conhecimentos milenares sobre o cuidado com a natureza. Por isso, atuamos como um braço de apoio, desenvolvendo projetos em diálogo com as comunidades, respeitando sua autonomia, suas tradições e seus modos de vida.
                                </p>
                                <p>
                                    A Conexão Ancestral trabalha para fortalecer a autodeterminação indígena, apoiar a preservação cultural, promover a segurança alimentar, melhorar as condições de vida nas aldeias e contribuir para a defesa dos territórios tradicionais.
                                </p>
                                <p>
                                    Mais do que uma ONG, somos uma ponte entre a floresta e a sociedade, amplificando as vozes que há séculos cuidam da Amazônia.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Image Collage Side */}
                    <div className="relative order-1 lg:order-2">
                        <div className="grid grid-cols-12 gap-4 h-[500px]">
                            {/* Large Main Image */}
                            <div className="col-span-8 h-full rounded-3xl overflow-hidden shadow-2xl relative group animate-float-story">
                                <img
                                    src="/assets/img/about-story-main.jpg"
                                    alt="Comunidade Indígena"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                            {/* Two Stacked Side Images */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <div className="h-1/2 rounded-2xl overflow-hidden shadow-xl group animate-drift-story" style={{ animationDelay: '1s' }}>
                                    <img
                                        src="/assets/img/about-story-side-1.jpg"
                                        alt="Reflorestamento"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="h-1/2 rounded-2xl overflow-hidden shadow-xl group animate-drift-story" style={{ animationDelay: '3s' }}>
                                    <img
                                        src="/assets/img/about-story-side-2.jpg"
                                        alt="Tecnologia na Floresta"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                            {/* Floating Accent Detail */}
                            <div className="absolute -bottom-12 -left-12 size-48 bg-white dark:bg-background-dark p-2 rounded-3xl shadow-2xl hidden sm:block border border-black/5 dark:border-white/5 rotate-3 animate-pulse-soft z-20">
                                <div className="w-full h-full rounded-xl overflow-hidden">
                                    <img
                                        src="/assets/img/about-story-accent.jpg"
                                        alt="Detalhe Natureza"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Nossa Jornada (Timeline) */}
            <section className="py-24 bg-[#f8fcf9] dark:bg-black/10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-1/3">
                        <h2 className="h2-standard text-text-main-light dark:text-white mb-6">Nossa Jornada</h2>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg font-light mb-8">
                            De um pequeno grupo de pessoas a um coletivo de ação. Nossa jornada é guiada pela preservação da cultura e pela promoção da autonomia indígena. Atuamos lado a lado com comunidades tradicionais, transformando o compromisso com a ancestralidade em projetos reais de soberania e sustentabilidade.
                        </p>
                    </div>

                    <div className="lg:w-2/3 relative">
                        {/* Custom Style for Walking Animation */}
                        <style>{`
                            @keyframes walkFlow {
                                from { background-position: 0 0; }
                                to { background-position: 0 40px; }
                            }
                            .walking-line {
                                background: linear-gradient(to bottom, transparent 50%, #284E32 50%);
                                background-size: 100% 12px;
                                animation: walkFlow 1.5s linear infinite;
                            }
                            .icon-pulse {
                                animation: iconPulse 2s ease-in-out infinite;
                            }
                            @keyframes iconPulse {
                                0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(40, 78, 50, 0.2); }
                                50% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(40, 78, 50, 0); }
                            }
                        `}</style>

                        {/* Vertical Line Container */}
                        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-white/5 overflow-hidden">
                            {/* Animated Walking Layer */}
                            <div className="absolute inset-0 walking-line opacity-40"></div>
                        </div>

                        <div className="flex flex-col gap-12">
                            {[
                                { year: '2015', title: 'Fundação', text: 'A ONG nasce após uma expedição ao Rio Xingu, identificando a necessidade de conectar aldeias isoladas.', icon: 'rocket_launch' },
                                { year: '2018', title: 'Primeira Comunidade Atendida', text: 'Instalação do primeiro ponto de internet via satélite na aldeia Yanomami, permitindo denúncias ambientais em tempo real.', icon: 'home_work' },
                                { year: '2020', title: 'Expansão Regional', text: 'Chegamos a 5 estados da Amazônia Legal, estabelecendo parcerias com cooperativas locais de açaí e castanha.', icon: 'map' },
                                { year: '2023', title: 'Parceria Internacional', text: 'Recebimento de apoio financeiro para o projeto "Guardiões Digitais", treinando jovens indígenas em monitoramento territorial.', icon: 'public' },
                            ].map((event, idx) => (
                                <div key={idx} className="relative pl-16 group">
                                    <div
                                        className="absolute left-0 top-0 size-12 rounded-full bg-white dark:bg-[#1a2e20] border-4 border-primary/20 flex items-center justify-center z-10 shadow-lg transition-transform duration-500 group-hover:scale-110"
                                        style={{ animation: `iconPulse 3s ease-in-out infinite ${idx * 0.5}s` }}
                                    >
                                        <span className="material-symbols-outlined text-primary text-xl font-bold">{event.icon}</span>
                                    </div>
                                    <div className="text-primary text-xs font-black mb-1 transform transition-all group-hover:translate-x-2">{event.year}</div>
                                    <h3 className="text-lg font-black text-text-main-light dark:text-white mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark font-light leading-relaxed group-hover:text-text-main-light dark:group-hover:text-gray-200 transition-colors">
                                        {event.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>





            {/* Nossa Equipe Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-primary text-xs font-black tracking-widest uppercase mb-4 block">QUEM FAZ ACONTECER</span>
                    <h2 className="h2-standard text-text-main-light dark:text-white">Diretoria Executiva</h2>
                    <p className="max-w-2xl mx-auto mt-4 text-text-secondary-light dark:text-text-secondary-dark text-lg font-light">
                        Conheça as pessoas apaixonadas que dedicam suas vidas à missão da Conexão Ancestral.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { name: 'Frans Pagnier', role: 'Presidente', img: '/assets/img/team-ana.jpg' },
                        { name: 'Cyntia Lopes', role: 'Vice Presidente', img: '/assets/img/team-carlos.jpg' },
                        { name: 'Rudisson Bezerra', role: 'Secretário', img: '/assets/img/team-joao.jpg' },
                        { name: 'Júlia Lopes', role: 'Tesoureira', img: '/assets/img/team-mariana.jpg' },
                    ].map((member, idx) => (
                        <div key={idx} className="group flex flex-col gap-4">
                            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl relative">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="px-2">
                                <h4 className="text-lg font-black text-text-main-light dark:text-white uppercase tracking-tight">{member.name}</h4>
                                <p className="text-primary text-sm font-bold">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto rounded-[2.5rem] bg-primary dark:bg-primary/20 p-12 lg:p-20 relative overflow-hidden text-center shadow-2xl">
                    {/* Background Image Layer */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/assets/img/banner-about-cta.jpg"
                            alt="Fundo Institucional"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/40 dark:bg-primary/60 backdrop-blur-[1px]"></div>
                    </div>

                    <div className="absolute top-0 right-0 -mr-20 -mt-20 size-96 bg-white/20 rounded-full blur-3xl z-0"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-80 bg-white/10 rounded-full blur-3xl z-0"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <span className="material-symbols-outlined mb-6 text-6xl text-white opacity-90 inline-block">favorite</span>
                        <h2 className="text-white h2-standard mb-4 max-w-2xl">Junte-se ao movimento</h2>
                        <p className="text-white/80 text-lg md:text-xl font-light max-w-xl mb-10 leading-relaxed">
                            Sua contribuição planta árvores, empodera comunidades e protege o nosso futuro.
                        </p>
                        <div className="flex flex-col items-center justify-center">
                            <Link to="/projetos" className="h-14 px-12 rounded-full bg-white hover:bg-gray-100 text-primary font-black transition-all shadow-xl shadow-black/10 flex items-center justify-center">
                                Doar Agora
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
