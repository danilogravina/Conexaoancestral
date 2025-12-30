import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/minha-conta');
    }, 1000);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Um link de recuperação foi enviado para o seu e-mail.");
  };

  return (
    <div className="flex flex-1 w-full min-h-screen bg-background-light dark:bg-background-dark">
      {/* Left Column: Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 xl:w-[45%] px-6 py-8 sm:px-12 lg:px-20 border-r border-stone-100 dark:border-stone-800 relative z-10">
        <div className="w-full max-w-[480px] mx-auto flex flex-col flex-1 h-full justify-center">

          <div className="mb-12">
            <Link to="/" className="mb-8 block">
              <Logo />
            </Link>
            <h1 className="text-text-main-light dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-3">
              Acesse o Portal da Floresta
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal">
              Bem-vindo de volta! Insira suas credenciais para continuar.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <label className="flex flex-col w-full">
              <p className="text-text-main-light dark:text-white text-base font-medium leading-normal pb-2">E-mail</p>
              <input
                className="w-full h-14 px-4 rounded-xl border border-stone-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-stone-400 dark:bg-surface-dark dark:border-white/10 dark:text-white"
                placeholder="seu@email.com"
                type="email"
                required
              />
            </label>

            <label className="flex flex-col w-full">
              <div className="flex justify-between items-center pb-2">
                <p className="text-text-main-light dark:text-white text-base font-medium leading-normal">Senha</p>
                <button type="button" onClick={handleForgotPassword} className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">Esqueci minha senha</button>
              </div>
              <div className="flex w-full items-stretch rounded-xl relative group">
                <input
                  className="w-full h-14 px-4 pr-12 rounded-xl border border-stone-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-stone-400 dark:bg-surface-dark dark:border-white/10 dark:text-white"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 cursor-pointer text-stone-400 hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </label>

            <button
              className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-primary hover:brightness-110 active:scale-[0.98] text-white text-base font-bold leading-normal tracking-[0.015em] transition-all mt-2 shadow-lg shadow-primary/20 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  <span>Entrando...</span>
                </div>
              ) : (
                <span className="truncate">Entrar</span>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2">
            <p className="text-text-main-light dark:text-gray-400 text-base">Não tem uma conta?</p>
            <Link to="/cadastro" className="text-primary font-bold text-base hover:underline decoration-2 underline-offset-4">
              Criar Conta
            </Link>
          </div>

          <div className="mt-auto pt-10 flex gap-6 text-sm font-medium text-text-secondary-light dark:text-gray-500">
            <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
            <a className="hover:text-primary transition-colors" href="#">Termos</a>
            <a className="hover:text-primary transition-colors" href="#">Ajuda</a>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Hero */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-surface-dark overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: 'url("assets/img/login-hero-bg.jpg")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-16 xl:p-24 flex flex-col justify-end z-20">
          <div className="w-16 h-1 bg-primary mb-8 rounded-full"></div>
          <blockquote className="text-white text-3xl xl:text-4xl font-bold leading-snug tracking-tight mb-6 max-w-2xl drop-shadow-md font-display">
            "A proteção da floresta é um compromisso com o futuro de toda a humanidade."
          </blockquote>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex -space-x-3">
              {[
                "assets/img/guardian-avatar-1.jpg",
                "assets/img/guardian-avatar-2.jpg",
                "assets/img/guardian-avatar-3.jpg"
              ].map((src, i) => (
                <div key={i} className="size-10 rounded-full border-2 border-primary bg-stone-300 bg-cover bg-center" style={{ backgroundImage: `url("${src}")` }}></div>
              ))}
            </div>
            <span className="text-sm font-medium">+2.4k Guardiões ativos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;