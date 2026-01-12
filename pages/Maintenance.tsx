import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Maintenance: React.FC = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            @keyframes pulse-soft {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.05); }
            }
            @keyframes wave-bg {
                0% { transform: translateX(-100px); }
                100% { transform: translateX(0); }
            }
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-pulse-soft { animation: pulse-soft 4s ease-in-out infinite; }
            .animate-wave-slow { animation: wave-bg 8s linear infinite; }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden font-display">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse-soft"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

                {/* Decorative Waves */}
                <svg className="absolute bottom-0 left-0 w-full h-32 opacity-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path
                        d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                        fill="white"
                        className="animate-wave-slow"
                    ></path>
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center gap-8">
                <div className="relative">
                    <img
                        src="/assets/img/icons/logo-hero.svg"
                        alt="Logo Conexão Ancestral"
                        className="w-24 md:w-32 animate-float drop-shadow-[0_0_30px_rgba(46,125,50,0.3)]"
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                        Tecendo algo <br />
                        <span className="text-primary italic">extraordinário</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 font-light max-w-lg mx-auto leading-relaxed">
                        Nossa nova plataforma está sendo preparada com todo cuidado para fortalecer a conexão com os povos da floresta.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-full h-3 p-1 overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[75%] relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-wave-slow"></div>
                    </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Em breve</p>

                {/* Footer Link for Admins */}
                <div className="pt-12">
                    <Link
                        to="/login"
                        className="text-white/20 hover:text-white/60 text-xs font-medium uppercase tracking-widest transition-colors flex items-center gap-2 group"
                    >
                        <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">lock</span>
                        Acesso Restrito
                    </Link>
                </div>
            </div>

            {/* Version / Info */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/10 uppercase tracking-[0.4em] font-bold">
                Conexão Ancestral © 2026
            </div>
        </div>
    );
};

export default Maintenance;
