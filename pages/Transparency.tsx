import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const useInView = (options?: IntersectionObserverInit) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, inView] as const;
};

const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string; prefix?: string; decimals?: number; trigger: boolean }> = ({ value, duration = 2000, suffix = "", prefix = "", decimals = 0, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      setCount(easeOutQuad(progress) * value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [trigger, value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

const DoughnutChart: React.FC<{ segments: { value: number; color: string }[]; trigger: boolean }> = ({ segments, trigger }) => {
  const radius = 80;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="relative size-48 md:size-56 shrink-0 flex items-center justify-center">
      <svg className="absolute inset-0 size-full transform -rotate-90 overflow-visible">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-100 dark:text-gray-700"
          strokeWidth={strokeWidth}
        />
        {segments.map((segment, i) => {
          const dashOffset = circumference - (segment.value / 100) * circumference;
          const rotate = (currentOffset / 100) * 360;
          currentOffset += segment.value;

          return (
            <circle
              key={i}
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={trigger ? dashOffset : circumference}
              strokeLinecap="round"
              style={{
                transform: `rotate(${rotate}deg)`,
                transformOrigin: 'center',
                transition: `stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.1}s`
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-4 bg-white dark:bg-[#1a2e22] rounded-full flex items-center justify-center flex-col shadow-inner">
        <span className="text-3xl font-black text-text-main-light dark:text-white">100%</span>
        <span className="text-xs text-gray-500 uppercase font-medium">Auditado</span>
      </div>
    </div>
  );
};

const ImpactNumbers: React.FC = () => {
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">
      <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a4a35] bg-white dark:bg-[#1a2e22] shadow-sm transition-transform hover:-translate-y-1">
        <div className="p-2 bg-primary/10 rounded-full w-fit mb-2">
          <span className="material-symbols-outlined text-primary text-[32px]">diversity_1</span>
        </div>
        <p className="text-text-main-light dark:text-gray-300 text-xs md:text-sm font-bold leading-normal uppercase tracking-[0.2em]">Famílias Atendidas</p>
        <p className="text-text-main-light dark:text-white tracking-tight text-3xl md:text-4xl font-black leading-tight">
          <AnimatedCounter value={1200} trigger={inView} suffix="+" />
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a4a35] bg-white dark:bg-[#1a2e22] shadow-sm transition-transform hover:-translate-y-1">
        <div className="p-2 bg-primary/10 rounded-full w-fit mb-2">
          <span className="material-symbols-outlined text-primary text-[32px]">payments</span>
        </div>
        <p className="text-text-main-light dark:text-gray-300 text-sm font-medium leading-normal uppercase tracking-wide">Recursos Aplicados</p>
        <p className="text-text-main-light dark:text-white tracking-tight text-3xl font-black leading-tight">
          <AnimatedCounter value={2.5} trigger={inView} prefix="R$ " suffix="M" decimals={1} />
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a4a35] bg-white dark:bg-[#1a2e22] shadow-sm transition-transform hover:-translate-y-1">
        <div className="p-2 bg-primary/10 rounded-full w-fit mb-2">
          <span className="material-symbols-outlined text-primary text-[32px]">location_on</span>
        </div>
        <p className="text-text-main-light dark:text-gray-300 text-xs md:text-sm font-bold leading-normal uppercase tracking-[0.2em]">Aldeias Parceiras</p>
        <p className="text-text-main-light dark:text-white tracking-tight text-3xl md:text-4xl font-black leading-tight">
          <AnimatedCounter value={30} trigger={inView} />
        </p>
      </div>
    </div>
  );
};

const ResourceDistribution: React.FC = () => {
  const [ref, inView] = useInView({ threshold: 0.1 });

  const segments = [
    { value: 85, color: '#284E32' },
    { value: 10, color: '#1a3421' },
    { value: 5, color: '#467a53' }
  ];

  return (
    <div ref={ref} className="mx-4 p-8 rounded-xl bg-white dark:bg-[#1a2e22] border border-[#cfe7d7] dark:border-[#2a4a35] shadow-sm">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <DoughnutChart segments={segments} trigger={inView} />
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#primary]" style={{ backgroundColor: '#284E32' }}></div>
                <span className="font-bold text-lg text-text-main-light dark:text-white">Projetos Diretos na Floresta</span>
              </div>
              <span className="font-black text-xl" style={{ color: '#284E32' }}>85%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: inView ? '85%' : '0%', backgroundColor: '#284E32' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Plantio, infraestrutura para aldeias, vigilância territorial e educação.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: '#1a3421' }}></div>
                <span className="font-bold text-lg text-text-main-light dark:text-white">Administrativo & Pessoal</span>
              </div>
              <span className="font-black text-xl" style={{ color: '#1a3421' }}>10%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-1000 ease-out delay-100"
                style={{ width: inView ? '10%' : '0%', backgroundColor: '#1a3421' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Salários da equipe fixa, aluguel de escritório e contabilidade.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: '#467a53' }}></div>
                <span className="font-bold text-lg text-text-main-light dark:text-white">Captação de Recursos</span>
              </div>
              <span className="font-black text-xl" style={{ color: '#467a53' }}>5%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-1000 ease-out delay-200"
                style={{ width: inView ? '5%' : '0%', backgroundColor: '#467a53' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Marketing, eventos de arrecadação e taxas de processamento.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Transparency: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleDownload = (fileName: string, title: string) => {
    setDownloading(fileName);

    setTimeout(() => {
      setDownloading(null);
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      alert(`O download de "${title}" começou! Verifique sua pasta de downloads.`);
    }, 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const reports = [
    {
      year: '2023',
      title: 'Relatório Anual 2023',
      description: 'Resumo completo das atividades, conquistas e balanço financeiro do ano fiscal.',
      size: '4.5 MB',
      file: 'relatorio_anual_2023.pdf'
    },
    {
      year: '2023',
      title: 'Demonstrativo Financeiro Auditado',
      description: 'Documento técnico detalhado com auditoria da PwC Brasil.',
      size: '1.2 MB',
      file: 'demonstrativo_2023.pdf'
    },
    {
      year: '2022',
      title: 'Relatório Anual 2022',
      description: 'Histórico de ações e impacto do ano de 2022.',
      size: '3.8 MB',
      file: 'relatorio_anual_2022.pdf'
    },
    {
      year: 'Estatuto',
      title: 'Estatuto Social',
      description: 'Regimento interno e diretrizes de governança da ONG.',
      size: '0.8 MB',
      file: 'estatuto_social.pdf'
    }
  ];

  const faqs = [
    {
      question: "Como as contas são auditadas?",
      answer: "Nossas contas passam por uma auditoria interna trimestral e uma auditoria externa anual realizada por uma firma independente (atualmente PwC Brasil). Todos os pareceres são publicados integralmente nesta página."
    },
    {
      question: "Posso direcionar minha doação para um projeto específico?",
      answer: "Sim! Ao realizar sua doação, você pode escolher entre o \"Fundo Geral\", que nos permite alocar recursos onde são mais necessários, ou fundos específicos como \"Saúde Indígena\" ou \"Segurança Alimentar\"."
    },
    {
      question: "Qual a porcentagem retida para taxas administrativas?",
      answer: "Mantemos nossas despesas administrativas estritamente abaixo de 15%. Em 2023, alcançamos a marca de apenas 10%, garantindo que a maior parte absoluta do seu dinheiro vá direto para o campo."
    }
  ];

  return (
    <div className="flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="relative overflow-hidden w-full">
        <div
          className="flex min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 relative overflow-hidden group shadow-xl"
          style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%), url("/assets/img/transparency-hero-bg.jpg")' }}
        >
          <div className="flex flex-col gap-6 text-center z-10 max-w-[800px] px-4">
            <h1 className="text-white h1-standard drop-shadow-lg">
              Transparência é nosso compromisso
            </h1>
            <h2 className="text-white text-lg md:text-xl font-light leading-relaxed drop-shadow-md">
              Acreditamos que cada centavo doado deve ter um destino claro. Veja como seus recursos protegem a floresta e transformam vidas.
            </h2>
          </div>
          <div className="flex gap-4 z-10 flex-wrap justify-center px-4">
            <button onClick={() => document.getElementById('relatorios')?.scrollIntoView({ behavior: 'smooth' })} className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary hover:brightness-110 transition-all text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20">
              <span className="truncate">Ver Relatórios</span>
            </button>
            <Link to="/projetos" className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-white/20 backdrop-blur-sm border border-white hover:bg-white/30 transition-all text-white text-base font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Fazer Doação</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="w-full flex-1 flex justify-center py-12 md:py-20">
        <div className="flex flex-col max-w-[1200px] flex-1 px-4 lg:px-0">

          {/* Impact Numbers */}
          <div className="mb-12">
            <h2 className="text-text-main-light dark:text-white h2-standard px-4 pb-10 pt-8">
              Nosso Impacto em Números
            </h2>
            <ImpactNumbers />
          </div>

          {/* Resource Distribution Chart */}
          <div className="mb-12">
            <h2 className="text-text-main-light dark:text-white h2-standard px-4 pb-10 pt-8">
              Distribuição de Recursos (2023)
            </h2>
            <ResourceDistribution />
          </div>

          {/* Reports Section */}
          <div className="mb-12" id="relatorios">
            <h2 className="text-text-main-light dark:text-white h2-standard px-4 pb-10 pt-8">
              Relatórios e Balanços
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
              {reports.map((report, index) => (
                <div key={index} className="group flex flex-col p-5 rounded-xl bg-white dark:bg-[#1a2e22] border border-[#cfe7d7] dark:border-[#2a4a35] hover:border-primary/50 transition-colors shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500">
                      <span className="material-symbols-outlined">picture_as_pdf</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {report.year}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-text-main-light dark:text-white mb-2">{report.title}</h3>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6 flex-1 font-normal leading-relaxed">{report.description}</p>
                  <button
                    onClick={() => handleDownload(report.file, report.title)}
                    disabled={downloading === report.file}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-[#e7f3eb] dark:border-[#2a4a35] bg-background-light dark:bg-[#102216] hover:bg-white dark:hover:bg-white/5 hover:border-primary transition-all text-sm font-bold text-text-main-light dark:text-white group-hover:text-primary ${downloading === report.file ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {downloading === report.file ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                        Baixando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px] download">download</span>
                        Baixar PDF ({report.size})
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-text-main-light dark:text-white h2-standard px-4 pb-10 pt-8">
              Perguntas Frequentes
            </h2>
            <div className="flex flex-col gap-3 px-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className={`group rounded-xl bg-white dark:bg-[#1a2e22] border transition-all duration-300 ${isOpen ? 'border-primary ring-1 ring-primary/20' : 'border-[#cfe7d7] dark:border-[#2a4a35]'}`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex w-full cursor-pointer items-center justify-between p-5 font-bold text-text-main-light dark:text-white text-left focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <span className="material-symbols-outlined">expand_more</span>
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="px-5 pb-5 pt-0 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Call to Action Footer - Full Width */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/img/banner-transparency-cta.jpg"
            alt="Fundo Transparência"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70 dark:bg-primary/90 backdrop-blur-[1px]"></div>
        </div>

        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-white/10 blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-white/5 blur-3xl z-0"></div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-2 backdrop-blur-md">
              <span className="material-symbols-outlined text-white text-[32px]">volunteer_activism</span>
            </div>
            <h2 className="text-white h2-standard mb-4">Sua confiança é a nossa força</h2>
            <p className="text-white/80 max-w-xl text-lg md:text-xl font-light leading-relaxed mb-10">Junte-se a milhares de doadores que acreditam na transparência e no poder de regeneração da Amazônia.</p>
            <div className="flex flex-col items-center justify-center">
              <Link to="/projetos" className="h-14 px-12 rounded-full bg-white hover:bg-gray-100 text-primary font-black transition-all shadow-xl shadow-black/10 flex items-center justify-center">
                Fazer Doação
              </Link>
            </div>
            <p className="text-xs text-white/40 mt-4 leading-relaxed tracking-wider">Conexão Ancestral - CNPJ 00.000.000/0001-00 <br /> Rua da Floresta, 123 - Manaus, AM</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transparency;