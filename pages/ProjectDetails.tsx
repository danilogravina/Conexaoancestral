import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Project, ProjectCategory } from '../types';
import { supabase } from '../lib/supabase';
import { ensureAbsolutePath } from '../lib/utils';

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState<string>('');
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const paypalButtonRef = useRef<HTMLDivElement | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [paypalSuccess, setPaypalSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ confirmed_total: number; confirmed_count: number } | null>(null);

  // Gallery Logic
  const [activeImage, setActiveImage] = useState<string>('');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { user } = useUser();
  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  useEffect(() => {
    if (!paypalClientId || typeof document === 'undefined') return;
    const existing = document.querySelector('script[src^="https://www.paypal.com/sdk/js"]') as HTMLScriptElement | null;
    if (existing) {
      existing.onload = () => setPaypalReady(true);
      if ((existing as any).dataset?.loaded || existing.getAttribute('data-loaded') === 'true') {
        setPaypalReady(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=BRL&intent=capture`;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      setPaypalReady(true);
    };
    script.onerror = () => setPaypalError('Não foi possível carregar o SDK do PayPal. Verifique o VITE_PAYPAL_CLIENT_ID.');
    document.body.appendChild(script);
  }, [paypalClientId]);

  const fetchProject = async (projectId: string) => {
    try {
      setIsLoading(true);

      // Fallback for synthetic projects
      if (projectId === 'huni-kuin-rio-breu') {
        const huniKuinProject: Project = {
          id: 'huni-kuin-rio-breu',
          title: 'Centro Cerimonial de Cultura Huni Kuin do Rio Breu',
          category: 'Cultura',
          description: 'Criação de um Centro Cerimonial de Cultura para fortalecer a identidade, os saberes ancestrais e a continuidade cultural do povo Huni Kuin.',
          fullDescription: `Este projeto tem como objetivo fortalecer e valorizar a cultura do povo Huni Kuin, autodenominado “gente verdadeira”, promovendo a preservação de seus saberes ancestrais, de sua língua, espiritualidade e expressões culturais. Em um contexto de constantes pressões externas, a iniciativa reafirma a identidade, a autonomia e a resistência cultural profundamente enraizadas na floresta amazônica.

O foco central do projeto é a construção e manutenção de um Centro Cerimonial de Cultura, concebido como um espaço vivo de reunião, ensino e celebração. O Centro será dedicado à preservação da língua Hãtxa Kuin, ao fortalecimento das medicinas tradicionais, à realização de cerimônias, aos cantos sagrados e à valorização das artes Huni Kuin, como o kenê, a tecelagem e a cerâmica.

Mais do que uma estrutura física, o Centro Cerimonial representa um espaço de autodeterminação, onde a própria comunidade conduz a gestão de seu patrimônio cultural. Ao fortalecer a cultura, o projeto também promove sustentabilidade, geração de renda e continuidade do modo de vida tradicional, garantindo que o legado do povo Huni Kuin siga vivo para as futuras gerações.`,
          image: '/assets/img/project-huni-kuin.png',
          raised: 0,
          goal: 50000,
          status: 'Em Planejamento',
          beneficiaries: 0,
          year: 2025,
          gallery: ['/assets/img/project-huni-kuin.png'],
          objectives: [
            'Fortalecimento da identidade Huni Kuin',
            'Preservação da língua Hãtxa Kuin',
            'Construção do Centro Cerimonial',
            'Valorização das artes tradicionais (kenê, tecelagem)'
          ],
          testimonials: [
            { name: "Bixku Huni Kuin", role: "Guardião da Cultura", quote: "Nossa maloca é o lugar onde nossa língua Hãtxa Kuin volta a ecoar com força total.", avatar: "/assets/img/team-joao.jpg" },
            { name: "Kenê Huni Kuin", role: "Tecelã e Artista", quote: "Pintar nossos grafismos no novo centro cerimonial é tecer o futuro do nosso povo.", avatar: "/assets/img/team-mariana.jpg" }
          ]
        };
        setProject(huniKuinProject);
        setActiveImage(huniKuinProject.image);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      if (data) {
        const galleryData = data.gallery;
        const mainImage = ensureAbsolutePath(data.image_url);

        let gallery: string[] = [];
        if (Array.isArray(galleryData) && galleryData.length > 0) {
          gallery = galleryData.map(ensureAbsolutePath);
        } else {
          gallery = [mainImage];
        }

        const mappedProject: Project = {
          id: data.id,
          title: data.title,
          category: data.category as any,
          description: data.description,
          fullDescription: data.full_description,
          image: mainImage,
          raised: 0,
          goal: data.goal_amount,
          status: 'Em Planejamento' as const,
          beneficiaries: data.beneficiaries_count,
          year: data.year,
          gallery: gallery,
          objectives: data.impact_data?.objectives || [],
          video_url: data.video_url
        };
        if (mappedProject.title === 'Escola Viva da Floresta') {
          mappedProject.title = 'Projeto de Infraestrutura e Gestão Participativa de Água no Território Katukina';
          mappedProject.description = 'Implementação de solução sustentável de captação e distribuição de água para assegurar água de qualidade no território Katukina.';
          mappedProject.category = ProjectCategory.WATER;
          mappedProject.fullDescription = `Este projeto impulsiona o fortalecimento cultural e territorial do povo Katukina, o "povo verdadeiro". Diante das pressões da BR-364 sobre a T.I. Campinas/Katukina, 12 famílias Katukina criaram uma nova aldeia em área preservada, reafirmando sua conexão com a floresta e saberes ancestrais. Para consolidar essa resistência, o projeto implementará um sistema de água potável com poço artesiano e energia solar fotovoltaica, reduzindo a dependência de rios e riscos de contaminação. Mais que infraestrutura, é um investimento na autonomia, saúde e preservação cultural e ambiental do povo Katukina.`;
          mappedProject.objectives = [
            'Perfuração de poço artesiano',
            'Instalação de sistema de energia solar fotovoltaica',
            'Abastecimento de água potável para a nova aldeia',
            'Melhora nas condições de saúde e saneamento'
          ];
          mappedProject.testimonials = [
            { name: "Txai Katukina", role: "Liderança Local", quote: "Ter água limpa brotando na nossa nova aldeia é devolver a saúde e a dignidade para nossas crianças.", avatar: "/assets/img/team-joao.jpg" },
            { name: "Maria Katukina", role: "Agente de Saúde Indígena", quote: "O poço artesiano reduziu as doenças na comunidade. É uma vitória da nossa resistência.", avatar: "/assets/img/team-mariana.jpg" }
          ];
        }
        if (mappedProject.title === 'Agrofloresta Comunitária') {
          mappedProject.title = 'Projeto Aldeia Sagrada - Construção do Centro Yuvanapanamaritiru';
          mappedProject.description = 'O Centro Yuvanapanamaritiru é um santuário para a medicina tradicional, fortalecendo a cultura e a autonomia do povo Shawãdawa (Arara).';
          mappedProject.category = ProjectCategory.CULTURE;
          mappedProject.fullDescription = `O Centro Yuvanapanamaritiru é a concretização do sonho de resistência e fortalecimento cultural do povo Shawãdawa (Arara), no Alto Rio Juruá, Acre. Após séculos de luta, a comunidade de 1.600 indígenas busca preservar seu conhecimento ancestral. O Centro, que significa 'Cura, Cultura e Formação dos Guardiões', é um santuário para a medicina tradicional e sua transmissão. Estruturado com Kupixawa, Pousada, Casa de Cura e Banhos Curativos, o projeto também foca na sustentabilidade: poço artesiano, viveiro de plantas medicinais e cultivo orgânico, gerando renda e autonomia para o povo Shawãdawa.`;
          mappedProject.objectives = [
            'Construção do Kupixawa e Pousada de cura',
            'Implementação de viveiro para plantas medicinais',
            'Instalação de poço artesiano para a comunidade',
            'Fortalecimento da autonomia cultural e espiritual'
          ];
          mappedProject.testimonials = [
            { name: "Pajé Shawãdawa", role: "Líder Espiritual", quote: "O Centro Yuvanapanamaritiru é o coração da nossa cura. Aqui guardamos o espírito da floresta.", avatar: "/assets/img/team-joao.jpg" },
            { name: "Arara Shawã", role: "Coordenadora de Cultura", quote: "Nosso centro de cultura garante que os jovens aprendam os cantos e as medicinas dos avós.", avatar: "/assets/img/team-mariana.jpg" }
          ];
        }
        if (mappedProject.title === 'Centro Cerimonial de Cultura Huni Kuin do Rio Breu') {
          mappedProject.fullDescription = `Este projeto visa fortalecer a cultura Huni Kuin, o "gente verdadeira", preservando saberes ancestrais, língua, espiritualidade e expressões culturais frente a pressões externas. O foco é a construção de um Centro Cerimonial de Cultura, um espaço vivo para a língua Hãtxa Kuin, medicinas tradicionais, cerimônias, cantos sagrados e artes Huni Kuin (kenê, tecelagem, cerâmica). Mais que uma estrutura, o Centro representa autodeterminação, gestão comunitária do patrimônio cultural, promovendo sustentabilidade, renda e a continuidade do legado Huni Kuin para futuras gerções.`;
          mappedProject.image = '/assets/img/project-huni-kuin.png';
          mappedProject.gallery = ['/assets/img/project-huni-kuin.png'];
        }

        // Enrich with live campaign progress from server API (service role)
        try {
          const progressRes = await fetch('/api/public/campaigns');
          const progressJson = await progressRes.json();
          if (Array.isArray(progressJson)) {
            const campaign = progressJson.find((c: any) => c.slug === mappedProject.id);
            if (campaign) {
              setProgress({
                confirmed_total: Number(campaign.confirmed_total || 0),
                confirmed_count: Number(campaign.confirmed_count || 0),
              });
              mappedProject.raised = Number(campaign.confirmed_total || mappedProject.raised || 0);
              mappedProject.goal = Number(campaign.goal_amount || mappedProject.goal || 0);
            }
          }
        } catch (err) {
          console.warn('Não foi possível carregar o progresso da campanha. Exibindo dados locais.', err);
        }

        setProject(mappedProject);
        setActiveImage(mappedProject.image);
      } else {
        navigate('/projetos');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do projeto:', error);
      navigate('/projetos');
    } finally {
      setIsLoading(false);
    }
  };


  const handleAmountClick = (amount: string) => {
    setDonationAmount(amount);
  };

  const handleDonate = async () => {
    if (!donationAmount || Number(donationAmount) <= 0) {
      alert("Por favor, selecione ou digite um valor para doar.");
      return;
    }

    if (!paypalClientId) {
      setPaypalError('PayPal não configurado. Defina VITE_PAYPAL_CLIENT_ID.');
      return;
    }

    if (!project) {
      setPaypalError('Projeto não carregado.');
      return;
    }

    if (!user) {
      setPaypalError('Para doar, entre ou cadastre seu e-mail (você receberá o link para criar sua senha).');
      navigate('/login', { state: { redirectTo: `/projetos/${project.id}` } });
      return;
    }

    try {
      setIsCreatingOrder(true);
      setPaypalError(null);
      setPaypalSuccess(null);

      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignSlug: String(project.id),
          amount: Number(donationAmount),
          currency: 'BRL',
          donor: {
            name: user?.fullName,
            email: user?.email,
            isAnonymous: false,
          },
          userId: user?.id,
        }),
      });

      const raw = await response.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (parseError) {
        data = { error: raw };
      }

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível criar o pedido no PayPal.');
      }

      setOrderId(data.orderID);
      setPaypalSuccess('Pedido criado. Clique no botão do PayPal para finalizar.');
    } catch (error: any) {
      setPaypalError(error?.message || 'Erro ao iniciar a doação.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const encodedUrl = encodeURIComponent(url);
    const title = encodeURIComponent(project?.title || "Conexão Ancestral");
    const text = `Confira o projeto "${project?.title}" da Conexão Ancestral!`;
    const encodedText = encodeURIComponent(text);

    let shareUrl = '';

    switch (platform) {
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'X':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'WhatsApp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert("Link copiado para a área de transferência!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  };

  // Lightbox Navigation
  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextPhoto = useCallback(() => {
    if (!project?.gallery) return;
    setPhotoIndex((prevIndex) => (prevIndex + 1) % project.gallery!.length);
  }, [project]);

  const prevPhoto = useCallback(() => {
    if (!project?.gallery) return;
    setPhotoIndex((prevIndex) => (prevIndex + project.gallery!.length - 1) % project.gallery!.length);
  }, [project]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextPhoto, prevPhoto]);

  useEffect(() => {
    if (!paypalReady || !orderId || typeof window === 'undefined' || !paypalButtonRef.current) return;
    const paypal = (window as any).paypal;
    if (!paypal?.Buttons) return;

    paypalButtonRef.current.innerHTML = '';
    paypal
      .Buttons({
        createOrder: () => orderId,
        onApprove: async () => {
          try {
            const captureRes = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: orderId }),
            });
            const captureJson = await captureRes.json();
            if (!captureRes.ok) {
              throw new Error(captureJson.error || 'Falha ao confirmar o pagamento.');
            }
            setPaypalSuccess('Pagamento confirmado! Obrigado pela sua doação. O painel pode levar alguns segundos para atualizar.');
            setPaypalError(null);

            // Redireciona para página de agradecimento
            navigate('/doacao/obrigado', {
              state: {
                amount: Number(donationAmount),
                projectTitle: project.title,
              },
            });
          } catch (err: any) {
            setPaypalError(err?.message || 'Erro ao confirmar pagamento.');
          }
        },
        onError: (err: any) => {
          setPaypalError(err?.message || 'Erro no PayPal.');
        },
      })
      .render(paypalButtonRef.current);
  }, [orderId, paypalReady]);

  if (!project) {
    return (
      <div className="flex flex-col flex-grow items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">Carregando projeto...</p>
      </div>
    );
  }

  const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];
  const videoThumbnail = "/assets/img/projects-hero-bg.jpg"; // Using a valid fallback image

  return (
    <div className="flex flex-col flex-grow">
      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <iframe
              width="100%"
              height="100%"
              src={project.video_url?.includes('youtube.com/embed')
                ? project.video_url
                : project.video_url?.includes('watch?v=')
                  ? `https://www.youtube.com/embed/${project.video_url.split('v=')[1].split('&')[0]}?autoplay=1`
                  : project.video_url?.includes('youtu.be/')
                    ? `https://www.youtube.com/embed/${project.video_url.split('youtu.be/')[1].split('?')[0]}?autoplay=1`
                    : project.video_url}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 z-50 text-white/70 font-mono text-sm tracking-widest">
            {photoIndex + 1} / {gallery.length}
          </div>

          {/* Prev Button */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-4xl">chevron_left</span>
          </button>

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center p-4 md:p-12" onClick={closeLightbox}>
            <img
              src={gallery[photoIndex]}
              alt={`Foto detalhada do projeto: ${photoIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-4xl">chevron_right</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 pt-8">
        <nav className="flex text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/projetos" className="hover:text-primary">Projetos</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-semibold">{project.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Main Hero Image */}
        <div
          className="relative w-full h-[280px] sm:h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg group bg-gray-100 dark:bg-gray-800 cursor-zoom-in mb-10"
          onClick={() => openLightbox(gallery.indexOf(activeImage))}
        >
          <img
            alt="Imagem principal do projeto"
            className="w-full h-full object-cover transform transition duration-700"
            src={activeImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="material-symbols-outlined">open_in_full</span>
          </div>
          <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{project.category}</span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-icons-round text-sm">schedule</span> {project.status}
              </span>
              {/* Admin-only: Conclude project button (child must be pointer-events-auto because parent is pointer-events-none) */}
              {user?.role === 'admin' && project.status !== 'Concluído' && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!window.confirm('Marcar este projeto como concluído?')) return;
                    try {
                      const { error } = await supabase.from('projects').update({ status: 'Concluído' }).eq('id', project.id);
                      if (error) throw error;
                      setProject(prev => prev ? { ...prev, status: 'Concluído' } : prev);
                      alert('Projeto marcado como concluído.');
                    } catch (err) {
                      console.error('Erro ao atualizar projeto:', err);
                      alert('Erro ao marcar projeto como concluído.');
                    }
                  }}
                  className="ml-3 inline-flex items-center gap-2 rounded-md bg-green-700 text-white px-3 py-1.5 shadow hover:bg-green-800 transition-colors pointer-events-auto"
                >
                  <span className="material-symbols-outlined">task_alt</span>
                  Concluir Projeto
                </button>
              )}
            </div>
            <h1 className="text-white h1-standard mb-4">{project.title}</h1>
            <p className="text-gray-200 text-lg md:text-xl md:w-3/4 max-w-3xl font-light">{project.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-gray-900 dark:text-white h2-standard mb-8 flex items-center gap-3">
                <span className="material-icons-round text-primary text-3xl md:text-5xl">description</span> Sobre o Projeto
              </h2>
              <div className="prose dark:prose-invert prose-green max-w-none text-text-secondary-light dark:text-text-secondary-dark">
                <div className="mb-4 text-lg md:text-xl leading-relaxed font-light whitespace-pre-wrap">
                  {project.fullDescription || project.description}
                </div>

                {project.objectives && (
                  <>
                    <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Nossos Objetivos Principais</h3>
                    <ul className="space-y-3 list-none pl-0">
                      {project.objectives.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="material-icons-round text-primary mt-1">check_circle</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-gray-900 dark:text-white h2-standard mb-8 flex items-center gap-3">
                <span className="material-icons-round text-primary text-3xl md:text-5xl">photo_library</span> Galeria
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((img, index) => (
                  <div
                    key={index}
                    className="relative group rounded-2xl h-32 overflow-hidden cursor-zoom-in border-2 border-transparent hover:border-primary/50 transition-all"
                    onClick={() => {
                      setActiveImage(img);
                      openLightbox(index);
                    }}
                  >
                    <img
                      alt={`Foto detalhada do projeto: ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500"
                      src={img}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">visibility</span>
                    </div>
                  </div>
                ))}

                {project.video_url && (
                  <div
                    className="relative rounded-2xl h-32 w-full overflow-hidden md:col-span-2 group cursor-pointer border-2 border-transparent hover:border-primary/50"
                    onClick={() => setIsVideoOpen(true)}
                  >
                    <img alt="Vídeo Thumbnail" className="w-full h-full object-cover transition-transform duration-500" src={activeImage} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                      <span className="text-white font-medium flex items-center gap-2 transform group-hover:scale-110 transition-transform bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        <span className="material-icons-round text-2xl">play_circle</span>
                        <span className="text-sm">Assistir Vídeo</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-8 border border-primary/10">
              <h2 className="text-gray-900 dark:text-white h2-standard mb-10">Vozes da Comunidade</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {(project.testimonials || [
                  { name: "Maria Yawanawa", role: "Mãe e Artesã", quote: "A escola trouxe vida para nossa aldeia. É um sonho ver nossos filhos aprendendo nossos valores.", avatar: "/assets/img/team-mariana.jpg" },
                  { name: "João Tukano", role: "Líder Comunitário", quote: "O projeto nos deu ferramentas para defender nossa terra e garantir nosso futuro.", avatar: "/assets/img/team-joao.jpg" }
                ]).map((testimonial, i) => (
                  <div key={i} className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm relative">
                    <span className="material-icons-round text-primary/20 text-6xl absolute top-4 right-4 rotate-12">format_quote</span>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark italic mb-4 relative z-10">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{testimonial.name}</p>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6 transition-all duration-300">
              <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden" id="doar">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 relative z-10 tracking-tight">
                  {project.status === 'Concluído' ? 'Relatório de Impacto' : 'Faça Parte da Mudança'}
                </h3>

                <div className="mb-6 relative z-10">
                  {project.status === 'Concluído' ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                        <span className="block text-[10px] uppercase font-semibold tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-1">Impacto Final</span>
                        <div className="flex items-center gap-2">
                          <span className="material-icons-round text-primary">check_circle</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">Projeto Concluído em {project.year}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                          <span className="block text-xl font-bold text-primary">
                            {project.power || `${project.beneficiaries}+`}
                          </span>
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-primary/70">
                            {project.power ? 'Gerados' : 'Beneficiados'}
                          </span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-center">
                          <span className="block text-xl font-bold text-gray-900 dark:text-white">100%</span>
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Executado</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-start mb-2">
                        <span className="text-4xl font-extrabold text-primary tracking-tight">R$ {project.raised.toLocaleString('pt-BR')}</span>
                        <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">arrecadados da meta de <span className="text-gray-900 dark:text-white font-bold">R$ {project.goal.toLocaleString('pt-BR')}</span></span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
                        <div className="bg-primary h-4 rounded-full relative shadow-sm" style={{ width: `${Math.min((project.raised / project.goal) * 100, 100)}%` }}>
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-center">
                          <span className="block text-xl font-bold text-gray-900 dark:text-white">{Math.round((project.raised / project.goal) * 100)}%</span>
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Alcançado</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-center">
                          <span className="block text-xl font-bold text-gray-900 dark:text-white">--</span>
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Dias Restantes</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {project.status !== 'Concluído' ? (
                  <>
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6 relative z-10">
                      <div className="flex gap-3">
                        <span className="material-icons-round text-primary shrink-0">volunteer_activism</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                          <span className="font-bold text-primary">Seu impacto:</span> Sua doação direta apoia o projeto <span className="font-bold">{project.title}</span>.
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 relative z-10">
                      <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-3">Escolha o valor</label>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {['25', '50', '100', '250'].map(val => (
                          <button
                            key={val}
                            onClick={() => handleAmountClick(val)}
                            className={`py-2.5 px-1 rounded-lg border-2 font-bold text-sm transition-all transform hover:-translate-y-0.5 ${donationAmount === val ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-gray-600 bg-transparent text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:text-primary'}`}
                          >
                            R$ {val}
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm font-bold">R$</span>
                        </div>
                        <input
                          type="number"
                          className="block w-full pl-10 pr-4 py-2.5 sm:text-sm border-gray-200 dark:border-gray-600 rounded-lg dark:bg-surface-dark dark:text-white focus:ring-primary focus:border-primary placeholder-gray-400"
                          placeholder="Outro valor"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-3 relative z-10">
                      <button
                        onClick={handleDonate}
                        disabled={isCreatingOrder}
                        className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/60 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                      >
                        <span className="material-icons-round">favorite</span>
                        {isCreatingOrder ? 'Preparando pagamento...' : 'Doar para este Projeto'}
                      </button>
                      {!paypalClientId && (
                        <p className="text-xs text-red-600">Configure VITE_PAYPAL_CLIENT_ID para habilitar o pagamento via PayPal.</p>
                      )}
                      {paypalError && (
                        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-3">{paypalError}</p>
                      )}
                      {paypalSuccess && (
                        <p className="text-sm text-green-700 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-3">{paypalSuccess}</p>
                      )}
                      <div className="pt-2" ref={paypalButtonRef}></div>
                      {!paypalReady && paypalClientId && (
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">O botão do PayPal aparece assim que o SDK terminar de carregar.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                      Este projeto foi concluído com sucesso graças ao apoio de nossa comunidade. Você pode apoiar nossos projetos ativos ou doar para o fundo geral.
                    </p>
                    <Link to="/projetos" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg transition-all">
                      <span className="material-icons-round">explore</span> Ver Projetos Ativos
                    </Link>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700/50">
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-3 flex items-center justify-center gap-1">
                    <span className="material-icons-round text-xs text-green-500">lock</span> Ambiente seguro e certificado.
                  </p>
                  <div className="flex justify-center -space-x-3 overflow-hidden">
                    {[1, 2, 3].map((_, i) => (
                      <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-300" src={`/assets/img/donor-avatar-${i + 1}.jpg`} alt="Doador" />
                    ))}
                    <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">+42</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Compartilhe essa causa</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button onClick={() => handleShare('Facebook')} className="flex bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary hover:text-primary rounded-lg py-2 px-3 items-center justify-center gap-2 transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    <span className="font-bold text-xs">Facebook</span>
                  </button>
                  <button onClick={() => handleShare('X')} className="flex bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary hover:text-primary rounded-lg py-2 px-3 items-center justify-center gap-2 transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    <span className="font-bold text-xs">X</span>
                  </button>
                  <button onClick={() => handleShare('WhatsApp')} className="flex bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary hover:text-primary rounded-lg py-2 px-3 items-center justify-center gap-2 transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    <span className="font-bold text-xs">Zap</span>
                  </button>
                  <button onClick={() => handleShare('copy')} className="flex bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary hover:text-primary rounded-lg py-2 px-3 items-center justify-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-sm">link</span>
                    <span className="font-bold text-xs">Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProjectDetails;