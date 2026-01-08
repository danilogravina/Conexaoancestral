import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const StatCard: React.FC<{ icon: string; label: string; value: number; suffix?: string; delay?: number }> = ({ icon, label, value, suffix = "", delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = value;
          const duration = 800;
          const increment = end / (duration / 16);

          const timer = setTimeout(() => {
            const handle = setInterval(() => {
              start += increment;
              if (start >= end) {
                setCount(end);
                clearInterval(handle);
              } else {
                setCount(Math.floor(start));
              }
            }, 16);
            return () => clearInterval(handle);
          }, delay);
        } else {
          setCount(0);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`stat-card-${label.replace(/\s+/g, '-')}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [value, delay, label]);

  return (
    <div id={`stat-card-${label.replace(/\s+/g, '-')}`} className="group relative flex flex-col items-center gap-2 rounded-3xl p-8 bg-primary shadow-2xl shadow-primary/30 border border-white/10 hover:scale-[1.03] transition-all duration-500 overflow-hidden cursor-default min-h-[220px] justify-center">
      {/* Background Graphic (Animated Line) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          <path
            d="M0 80 Q 25 70, 50 80 T 100 80 T 150 80 T 200 80"
            fill="none"
            stroke="white"
            strokeWidth="2"
            className="animate-wave"
          />
          <path
            d="M0 60 Q 25 50, 50 60 T 100 60 T 150 60 T 200 60"
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="animate-wave-slow opacity-50"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 p-3 bg-white/10 rounded-2xl backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
          <span className="material-symbols-outlined text-4xl text-white">{icon}</span>
        </div>
        <p className="text-white/80 text-sm font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-white text-5xl font-black tabular-nums tracking-tighter">
          {count.toLocaleString('pt-BR')}{suffix}
        </p>
      </div>

      {/* Modern Glow Effect */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 blur-[60px] rounded-full group-hover:bg-white/40 transition-colors"></div>
    </div>
  );
};

const Home: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('impact_stats')
        .select('*')
        .neq('label', 'Árvores Plantadas');

      if (error) throw error;
      if (data) setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Fallback a dados padrão se falhar
      setStats([
        { label: "Famílias Apoiadas", value: 1200, suffix: "", icon: "family_restroom" },
        { label: "Aldeias Impactadas", value: 32, suffix: "", icon: "location_on" },
        { label: "Projetos Ativos", value: 15, suffix: "", icon: "psychology_alt" }
      ]);
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes wave {
        0% { transform: translateX(-50px); }
        100% { transform: translateX(0); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      @keyframes float-delayed {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      @keyframes float-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-18px); }
      }
      .animate-wave {
        animation: wave 3s linear infinite;
        stroke-dasharray: 200;
        stroke-dashoffset: 0;
      }
      .animate-wave-slow {
        animation: wave 5s linear infinite reverse;
      }
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      .animate-float-delayed {
        animation: float-delayed 5s ease-in-out infinite;
      }
      .animate-float-slow {
        animation: float-slow 6s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden flex items-center justify-center bg-background-dark">
        {/* Parallax Background Layer */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.35) 100%), url("/assets/img/home-hero-parallax.jpg")',
            transform: `translateY(${scrollY * 0.5}px)` // Moves at half speed of scroll
          }}
        ></div>

        {/* Content Layer */}
        <div className="max-w-4xl px-4 text-center z-10 relative pt-64">
          <h1 className="text-white h1-standard mb-4 drop-shadow-lg font-black tracking-tight">
            Conexão Ancestral
          </h1>
          <h2 className="text-white text-2xl md:text-4xl font-light leading-tight max-w-3xl mx-auto drop-shadow-md mb-12">
            Tecendo o Futuro com os Povos da Floresta
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projetos" className="h-14 px-10 rounded-full bg-white hover:bg-gray-100 text-primary font-black transition-all shadow-xl shadow-black/10 flex items-center justify-center">
              Fazer Doação
            </Link>
            <Link to="/contato" className="h-14 px-10 rounded-full bg-primary hover:bg-primary-dark text-white font-black transition-all shadow-xl shadow-primary/20 flex items-center justify-center">
              Junte-se à Conexão
            </Link>
          </div>
        </div>
      </section>

      <section id="sobre" className="px-4 relative z-20 -mt-12 mb-12">
        <div className="max-w-5xl mx-auto bg-white dark:bg-[#1a2c20] rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 p-8 md:p-12 text-center transition-colors duration-500">
          <span className="material-symbols-outlined text-4xl text-primary mb-4">diversity_2</span>
          <h2 className="text-[#0d1b12] dark:text-white h2-standard mb-6">Nossa Missão</h2>
          <p className="text-stone-600 dark:text-stone-300 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Empoderar e promover a autonomia dos povos indígenas e comunidades tradicionais, fortalecendo sua autonomia cultural, social, ambiental e econômica.

          </p>
        </div>
      </section>

      <section className="px-4 py-20 md:py-24 bg-background-light dark:bg-background-dark overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.length > 0 ? (
              stats.map((stat, idx) => (
                <StatCard
                  key={idx}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  delay={idx * 100}
                />
              ))
            ) : (
              // Skeleton loading while fetching
              [1, 2, 3].map(i => (
                <div key={i} className="h-56 rounded-3xl bg-primary/20 animate-pulse"></div>
              ))
            )}
          </div>
        </div>
      </section>


      <section className="px-4 py-20 md:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="order-2 md:order-1 relative group">
            {/* Standardized Decorative Shadow/Offset - Increased Visibility */}
            <div className="absolute inset-0 bg-primary/20 rounded-3xl transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[450px] md:h-[550px] border border-stone-200 dark:border-stone-800 relative">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                style={{ backgroundImage: 'url("/assets/img/home-roots.jpg")' }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-6">
            <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">
              <span className="w-10 h-[2px] bg-primary"></span>
              Nossas Raízes
            </div>
            <h2 className="text-[#0d1b12] dark:text-white h2-standard">
              Uma História de Resiliência e Conexão
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed">
              Nossas raízes nascem do encontro com a floresta e com os povos que a protegem há milênios. Elas brotam da escuta atenta, do respeito profundo e da convivência verdadeira com os povos indígenas, guardiões de saberes ancestrais que sustentam a vida em equilíbrio com a terra.
            </p>
            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed">
              São raízes fincadas no território, na memória e na espiritualidade. Crescem a partir das histórias contadas ao redor do fogo, dos cantos que atravessam gerações, do cuidado com as plantas, os rios e os ciclos da natureza.
            </p>
            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed">
              Cada passo dado junto às comunidades fortaleceu a certeza de que preservar a floresta é preservar culturas, modos de vida e futuros possíveis.
              A Conexão Ancestral se enraíza no compromisso com a autodeterminação dos povos indígenas, no reconhecimento de seu protagonismo e na valorização de seus conhecimentos como pilares para um mundo mais justo e sustentável.
            </p>
            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed">
              É dessas raízes profundas que nasce nossa missão: caminhar junto, fortalecer laços e proteger a vida que pulsa na floresta.
            </p>

          </div>
        </div>
      </section>

      <section className="relative px-4 py-16 md:py-24 bg-primary overflow-hidden mt-8 md:mt-12">


        {/* Modern Ambient Blobs - Kept for depth */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-10">
          <div className="text-center max-w-3xl mx-auto reveal-on-scroll">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#a5d6a7] mb-4 block">Nossa Missão em Ação</span>
            <h2 className="text-white h2-standard mb-6">Nossas Iniciativas</h2>
            <div className="w-20 h-1.5 bg-white/20 mx-auto rounded-full mb-8 overflow-hidden">
              <div className="w-1/2 h-full bg-white animate-wave"></div>
            </div>
            <p className="text-white/80 text-xl leading-relaxed font-light">
              Atuamos de forma integrada para fortalecer a autonomia dos povos tradicionais, valorizando saberes ancestrais e sua cultura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Segurança Hídrica e Infraestrutura Sustentável",
                desc: "Implantação de soluções de acesso à água potável e infraestrutura básica com uso de tecnologias sustentáveis, fortalecendo a saúde, a autonomia e o bem viver das comunidades indígenas.Fortalecimento das capacidades econômicas locais através de programas de capacitação, mentoria e acesso a mercados justos.",
                impact: "Comunidades com acesso seguro e contínuo à água potável, promovendo melhorias significativas na saúde, na autonomia e na qualidade de vida.",
                icon: "handshake",
                delay: "0s"
              },
              {
                title: "Valorização Cultural e Saberes Ancestrais",
                desc: "Fortalecimento das culturas indígenas por meio da preservação das línguas, das práticas espirituais, das artes tradicionais e da transmissão dos conhecimentos ancestrais às novas gerações.",
                impact: "Fortalecimento e continuidade das línguas, práticas culturais e saberes ancestrais, assegurando sua transmissão às futuras gerações.",
                icon: "history_edu",
                delay: "0.2s"
              },
              {
                title: "Autonomia Comunitária e Sustentabilidade",
                desc: "Promoção de iniciativas que geram autonomia econômica e ambiental, integrando práticas tradicionais, cuidado com o território e desenvolvimento sustentável conduzido pelas próprias comunidades indígenas.",
                impact: "Comunidades mais autônomas econômica e ambientalmente, com iniciativas sustentáveis conduzidas e geridas pelas próprias lideranças comunitárias.",
                icon: "forest",
                delay: "0.4s"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="reveal-on-scroll group relative flex flex-col gap-6 p-8 rounded-[3rem] bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/40 hover:-translate-y-4 transition-all duration-500 overflow-hidden shadow-2xl shadow-primary-dark/40"
                style={{ transitionDelay: item.delay }}
              >
                {/* Organic Leaf Pattern Accent - Subtly Faded */}
                <div
                  className="absolute -top-8 -right-8 w-48 h-48 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700 pointer-events-none rotate-12 grayscale invert"
                  style={{
                    backgroundImage: 'url("/assets/img/leaf-pattern-bg.png")',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>

                {/* Glow on hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 blur-[60px] rounded-full group-hover:bg-white/20 transition-all duration-500"></div>

                <div className="relative z-10 w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all duration-500 shadow-xl">
                  <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">{item.icon}</span>
                </div>

                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed font-light text-lg">
                    {item.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-8 mt-auto border-t border-white/10 group-hover:border-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-[1px] bg-[#a5d6a7]"></div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a5d6a7]">Resultado</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-1 rounded-lg bg-[#a5d6a7]/20 text-[#a5d6a7] group-hover:bg-[#a5d6a7] group-hover:text-white transition-colors duration-500">
                      <span className="material-symbols-outlined text-xl">verified</span>
                    </div>
                    <p className="text-sm font-medium text-white/90 leading-relaxed italic">
                      {item.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 bg-background-light dark:bg-background-dark/30 transition-colors duration-500 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Coluna da Imagem */}
          <div className="relative group">
            {/* Standardized Decorative Shadow/Offset - Increased Visibility */}
            <div className="absolute inset-0 bg-primary/20 rounded-3xl transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[450px] md:h-[550px] border border-stone-200 dark:border-stone-800 relative">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                style={{ backgroundImage: 'url("/assets/img/home-values.png")' }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>

            {/* Elemento Decorativo flutuante */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
          </div>

          {/* Coluna do Conteúdo */}
          <div className="flex flex-col gap-10">
            <div>
              <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">
                <span className="w-10 h-[2px] bg-primary"></span>
                Nossos Valores
              </div>
              <h2 className="text-[#0d1b12] dark:text-white h2-standard">
                Princípios que Pulsam<br /> em Cada Ação
              </h2>
            </div>

            <div className="flex flex-col gap-10">
              {[
                {
                  title: "Protagonismo Indígena",
                  description: "Reconhecemos e fortalecemos o direito dos povos indígenas de decidir sobre seus territórios, modos de vida e futuros, atuando sempre em diálogo e respeito às suas lideranças.",
                  icon: "history"
                },
                {
                  title: "Saberes Ancestrais",
                  description: "Valorizamos o conhecimento tradicional como patrimônio vivo, essencial para a preservação da floresta, da cultura e do equilíbrio entre humanidade e natureza.",
                  icon: "balance"
                },
                {
                  title: "Cuidado com a Vida e a Floresta",
                  description: "Atuamos pela proteção da vida em todas as suas formas, promovendo práticas sustentáveis que respeitam os ciclos da natureza e garantem o bem viver das gerações presentes e futuras.",
                  icon: "moving"
                }
              ].map((value, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white dark:bg-surface-dark border border-stone-100 dark:border-white/5 shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">
                      {value.icon}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl md:text-2xl font-bold text-[#0d1b12] dark:text-white group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed font-light">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="relative py-24 overflow-hidden text-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/img/banner-projects-cta.jpg"
            alt="Fundo Projetos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70 dark:bg-primary/90 backdrop-blur-[1px]"></div>
        </div>

        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] z-0"></div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="material-symbols-outlined mb-6 text-6xl text-white opacity-90 inline-block">volunteer_activism</span>
          <h2 className="text-white h2-standard mb-4">
            Faça parte dessa história
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg md:text-xl text-white/80 font-light leading-relaxed">
            Junte-se a nós nesta missão de construir um futuro onde tradição e desenvolvimento caminham lado a lado.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link to="/projetos" className="h-14 px-10 rounded-full bg-white hover:bg-gray-100 text-primary font-black transition-all shadow-xl shadow-black/10 flex items-center justify-center">
              Quero Doar Mensalmente
            </Link>
            <Link to="/contato" className="h-14 px-10 rounded-full border-2 border-white/30 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center">
              Ser Voluntário
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Parceiros - Carrossel Automático */}
      <section className="py-12 bg-white border-t border-stone-100 overflow-hidden hover-pause">
        <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-primary"></span>
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary">Parceiros e Transparência</h2>
          </div>
          <Link to="/transparencia" className="text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-primary transition-colors flex items-center gap-2 group">
            Relatórios de Governança
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="overflow-hidden mask-edges py-4">
            <div className="animate-marquee flex gap-20 md:gap-32 items-center">
              {[
                { logo: "logo_eco_amazon.png", url: "https://www.medicinasagrada.com.br" },
                { logo: "logo_ancestral_fund.png", url: "https://www.sacredconnection.co" },
                { logo: "logo_green_roots.png", url: "https://www.hauxhauxshop.com" },
                { logo: "logo_forest_guardians.png", url: "https://www.mayaherbs.com" },
                { logo: "logo_ethno_voice.png", url: "https://www.shop.fourvisions.com" },
                { logo: "logo_tribal_tech.png", url: "https://www.alafiyaenterprises.com" }
              ].concat([
                { logo: "logo_eco_amazon.png", url: "https://www.medicinasagrada.com.br" },
                { logo: "logo_ancestral_fund.png", url: "https://www.sacredconnection.co" },
                { logo: "logo_green_roots.png", url: "https://www.hauxhauxshop.com" },
                { logo: "logo_forest_guardians.png", url: "https://www.mayaherbs.com" },
                { logo: "logo_ethno_voice.png", url: "https://https://www.shop.fourvisions.com" },
                { logo: "logo_tribal_tech.png", url: "https://www.alafiyaenterprises.com" }
              ]).concat([
                { logo: "logo_eco_amazon.png", url: "https://www.medicinasagrada.com.br" },
                { logo: "logo_ancestral_fund.png", url: "https://www.sacredconnection.co" },
                { logo: "logo_green_roots.png", url: "https://www.hauxhauxshop.com" },
                { logo: "logo_forest_guardians.png", url: "https://www.mayaherbs.com" },
                { logo: "logo_ethno_voice.png", url: "https://www.shop.fourvisions.com" },
                { logo: "logo_tribal_tech.png", url: "https://www.alafiyaenterprises.com" }
              ]).map((partner, idx) => (
                <a
                  key={idx}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 px-12"
                >
                  <img
                    src={`/assets/img/partners/${partner.logo}`}
                    alt="Partner Logo"
                    className="h-24 md:h-36 w-auto object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;