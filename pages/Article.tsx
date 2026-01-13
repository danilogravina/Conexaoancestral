import React, { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from './Blog';

const Article: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const post = useMemo(() => {
    return blogPosts.find(p => p.slug === slug);
  }, [slug]);

  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-4">Artigo não encontrado</h2>
        <Link to="/blog" className="text-primary font-bold hover:underline">Voltar para o Blog</Link>
      </div>
    );
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const encodedUrl = encodeURIComponent(url);
    const title = encodeURIComponent(post.title);
    let shareUrl = '';

    switch (platform) {
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'X':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'WhatsApp':
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${encodedUrl}`;
        break;
      case 'Link':
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch (err) {
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          } catch (err) {
            alert("Não foi possível copiar o link.");
          }
          document.body.removeChild(textArea);
        }
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  };

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      alert("Por favor, digite um e-mail válido.");
      return;
    }
    alert(`Obrigado! O e-mail ${email} foi inscrito na nossa newsletter.`);
    setEmail('');
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full pb-16">
      <div className="w-full max-w-[900px] px-4 lg:px-8 py-10 lg:py-16 flex flex-col gap-6 items-center text-center">
        <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
          <span className="material-symbols-outlined text-lg">category</span>
          {post.category}
        </div>
        <h1 className="text-text-main-light dark:text-text-main-dark h1-standard">
          {post.title}
        </h1>
        <p className="text-text-main-light/80 dark:text-text-main-dark/80 text-lg md:text-xl font-light leading-relaxed max-w-[750px]">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${post.author.avatar}")` }}></div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-text-main-light dark:text-text-main-dark">{post.author.name}</span>
            <div className="flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {post.date} · {post.readTime} de leitura
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] px-4 lg:px-10 mb-12">
        <div className="aspect-[16/9] w-full bg-cover bg-center rounded-2xl shadow-xl overflow-hidden" style={{ backgroundImage: `url("${post.image}")` }}></div>
      </div>

      <div className="w-full max-w-[800px] px-4 lg:px-8 flex flex-col gap-8 text-lg leading-relaxed text-text-main-light dark:text-text-main-dark/90 font-body relative">
        <div className="relative">
          <div className="hidden lg:flex absolute right-[100%] top-0 h-full mr-12 flex-col z-10">
            <div className="sticky top-32 flex flex-col gap-4">
              <span className="text-xs font-bold text-center text-gray-400 mb-1 uppercase tracking-wide">Share</span>
              <button onClick={() => handleShare('Facebook')} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all duration-300 group bg-white dark:bg-surface-dark shadow-sm" aria-label="Compartilhar no Facebook" title="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </button>
              <button onClick={() => handleShare('X')} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all duration-300 group bg-white dark:bg-surface-dark shadow-sm" aria-label="Compartilhar no X" title="X">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </button>
              <button onClick={() => handleShare('LinkedIn')} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all duration-300 group bg-white dark:bg-surface-dark shadow-sm" aria-label="Compartilhar no LinkedIn" title="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </button>
              <button
                onClick={() => handleShare('Link')}
                className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center transition-all duration-300 group ${copied ? 'bg-primary text-[#0d1b12] border-primary scale-110' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary hover:text-primary'}`}
                aria-label="Copiar Link"
                title={copied ? "Copiado!" : "Copiar Link"}
              >
                <span className={`material-symbols-outlined text-lg transition-transform ${copied ? 'scale-110 font-bold' : ''}`}>
                  {copied ? 'check' : 'link'}
                </span>
              </button>
            </div>
          </div>

          <div dangerouslySetInnerHTML={{
            __html: post.content || `
            <p>No coração da Amazônia, onde as árvores gigantes tocam o céu e os rios serpenteiam como veias da terra, uma revolução silenciosa está acontecendo. Não se trata de máquinas derrubando a floresta, mas de tecnologia sendo usada para mantê-la em pé. Os povos indígenas, guardiões milenares deste bioma, estão integrando ferramentas modernas aos seus saberes ancestrais.</p>
            <p>O uso de GPS, drones e imagens de satélite tem permitido que comunidades monitorem vastas áreas de seus territórios com uma precisão nunca antes vista. O que antes levava dias de caminhada para ser verificado, agora pode ser monitorado em questão de horas.</p>
            <h2 class="text-text-main-light dark:text-white h2-standard mt-12 mb-6">A união da tradição com a inovação</h2>
            <p>"A tecnologia é como um arco e flecha novo", explica cacique Raoni, uma liderança local. "Ela não substitui nossa sabedoria, ela amplia nosso alcance." Essa visão pragmática tem sido fundamental para a adoção dessas ferramentas.</p>
            <blockquote class="border-l-4 border-primary pl-8 py-4 my-10 bg-surface-light dark:bg-surface-dark rounded-r-2xl italic text-xl md:text-2xl font-light text-text-secondary-light dark:text-text-secondary-dark font-serif leading-relaxed">
              "Nós não estamos abandonando nossas raízes ao usar um tablet. Estamos usando as armas de hoje para proteger o que é nosso desde sempre."
            </blockquote>
            <p>Os jovens das aldeias têm desempenhado um papel crucial nesse processo. Com maior facilidade para aprender novas tecnologias, eles se tornam os operadores técnicos, enquanto os mais velhos orientam onde e o que deve ser monitorado, baseados em seu profundo conhecimento da floresta.</p>
          ` }} />
        </div>

        <div className="flex flex-wrap gap-2 mt-8 border-t border-[#e7f3eb] dark:border-[#2a4032] pt-8">
          {['#Amazônia', '#Tecnologia', '#Preservação', '#DireitosIndígenas'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-surface-light dark:bg-surface-dark border border-[#e7f3eb] dark:border-[#2a4032] rounded-full text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer">{tag}</span>
          ))}
        </div>

        <div className="w-full mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-background-light dark:bg-white/5 rounded-2xl border border-[#e7f3eb] dark:border-white/10">
          <span className="font-bold text-text-main-light dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">share</span>
            Gostou? Compartilhe:
          </span>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleShare('Facebook')} className="h-10 px-3 flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-500 hover:border-primary hover:text-primary transition-all shadow-sm" aria-label="Compartilhar no Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              <span className="font-bold text-xs">Facebook</span>
            </button>
            <button onClick={() => handleShare('X')} className="h-10 px-3 flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-500 hover:border-primary hover:text-primary transition-all shadow-sm" aria-label="Compartilhar no X">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              <span className="font-bold text-xs">X</span>
            </button>
            <button onClick={() => handleShare('WhatsApp')} className="h-10 px-3 flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-500 hover:border-primary hover:text-primary transition-all shadow-sm" aria-label="Compartilhar no WhatsApp">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              <span className="font-bold text-xs">WhatsApp</span>
            </button>
            <button onClick={() => handleShare('Link')} className="h-10 px-3 flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-500 hover:border-primary hover:text-primary transition-all shadow-sm" aria-label="Copiar link">
              <span className="material-symbols-outlined text-sm">link</span>
              <span className="font-bold text-xs">Copiar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-surface-light dark:bg-surface-dark mt-16 py-16 border-t border-[#e7f3eb] dark:border-[#2a4032]">
        <div className="layout-container flex justify-center w-full">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 px-4 lg:px-10">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-text-main-light dark:text-text-main-dark h2-standard">Artigos Relacionados</h2>
              <Link to="/blog" className="text-primary font-bold hover:underline hidden md:block">Ver todos</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.filter(p => p.slug !== slug).slice(0, 3).map((item, i) => (
                <Link to={`/blog/${item.slug}`} key={i} className="flex flex-col gap-4 group cursor-pointer">
                  <div className="w-full aspect-[4/3] bg-cover bg-center rounded-xl overflow-hidden relative" style={{ backgroundImage: `url("${item.image}")` }}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {item.date}
                    </div>
                    <h3 className="text-text-main-light dark:text-text-main-dark text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="py-24 relative overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="assets/img/banner-article-cta.jpg"
            alt="Fundo Causa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70 dark:bg-primary/90 backdrop-blur-[1px]"></div>
        </div>

        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-white/10 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 mx-auto max-w-[1000px] px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-lg">
              <h3 className="text-white h2-standard mb-4">Junte-se à nossa causa</h3>
              <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed mb-0">Receba atualizações sobre como seu apoio está protegendo a floresta.</p>
            </div>
            <div className="flex w-full md:w-auto flex-col sm:flex-row gap-6">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-72 h-14 px-6 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all backdrop-blur-sm"
                placeholder="Seu e-mail"
                type="email"
              />
              <button
                onClick={handleSubscribe}
                className="h-14 px-10 bg-white hover:bg-gray-100 text-primary font-black rounded-full transition-all shadow-xl shadow-black/10 whitespace-nowrap flex items-center justify-center"
              >
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Article;