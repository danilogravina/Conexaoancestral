import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { supabase } from '../lib/supabase';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                // If the trigger isn't set up yet, we can manually create the profile
                // but usually metadata is enough for the trigger to pick up
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        { id: data.user.id, full_name: fullName, avatar_url: 'assets/img/user-avatar-default.jpg' }
                    ]);

                // We ignore profileError if it exists (e.g. if trigger already created it)
                console.log('Profile setup result:', profileError ? 'Trigger handled it or error' : 'Manually created');
            }

            alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Erro ao realizar cadastro.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-background-light dark:bg-background-dark">
            {/* Left Side: Image */}
            <div className="relative w-full lg:w-5/12 xl:w-1/2 h-64 lg:h-auto overflow-hidden bg-surface-dark order-first">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("assets/img/register-side-bg.jpg")' }}>
                    <div className="absolute inset-0 bg-black/20 lg:bg-black/10"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-8 lg:p-12 text-white z-10 hidden lg:block">
                    <div className="backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-white/10">
                        <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed mb-4 font-serif">
                            "Proteger a floresta é garantir o futuro de todas as gerações. Sua participação faz a diferença."
                        </blockquote>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">forest</span>
                            <span className="font-bold text-sm tracking-wide uppercase opacity-90">Amazônia Viva</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 w-full">
                <div className="w-full max-w-[480px] flex flex-col gap-8">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2 text-center lg:text-left">
                        <Link to="/" className="inline-block lg:self-start mb-4">
                            <Logo />
                        </Link>
                        <h1 className="text-text-main-light dark:text-white text-3xl lg:text-4xl font-black leading-tight tracking-tight">Crie sua conta</h1>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">
                            Preencha seus dados para se juntar à causa.
                        </p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                        <div className="flex flex-col gap-2">
                            <label className="text-text-main-light dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="name">Nome Completo</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none text-[20px]">person</span>
                                <input
                                    className="flex w-full rounded-xl text-text-main-light dark:text-white focus:outline-0 focus:ring-4 focus:ring-primary/10 border border-stone-200 dark:border-white/10 bg-white dark:bg-surface-dark focus:border-primary h-12 pl-12 pr-4 text-base font-normal placeholder:text-stone-400 transition-all"
                                    id="name"
                                    placeholder="Digite seu nome completo"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-text-main-light dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="email">E-mail</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none text-[20px]">mail</span>
                                <input
                                    className="flex w-full rounded-xl text-text-main-light dark:text-white focus:outline-0 focus:ring-4 focus:ring-primary/10 border border-stone-200 dark:border-white/10 bg-white dark:bg-surface-dark focus:border-primary h-12 pl-12 pr-4 text-base font-normal placeholder:text-stone-400 transition-all"
                                    id="email"
                                    placeholder="seuemail@exemplo.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-5">
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-text-main-light dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="password">Senha</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none text-[20px]">lock</span>
                                    <input
                                        className="flex w-full rounded-xl text-text-main-light dark:text-white focus:outline-0 focus:ring-4 focus:ring-primary/10 border border-stone-200 dark:border-white/10 bg-white dark:bg-surface-dark focus:border-primary h-12 pl-12 pr-10 text-base font-normal placeholder:text-stone-400 transition-all"
                                        id="password"
                                        placeholder="******"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-primary transition-colors focus:outline-none"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-text-main-light dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="confirm-password">Confirmar Senha</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none text-[20px]">lock_reset</span>
                                    <input
                                        className="flex w-full rounded-xl text-text-main-light dark:text-white focus:outline-0 focus:ring-4 focus:ring-primary/10 border border-stone-200 dark:border-white/10 bg-white dark:bg-surface-dark focus:border-primary h-12 pl-12 pr-10 text-base font-normal placeholder:text-stone-400 transition-all"
                                        id="confirm-password"
                                        placeholder="******"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-primary transition-colors focus:outline-none"
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mt-2">
                            <div className="flex h-6 items-center">
                                <input className="h-5 w-5 rounded border-stone-300 text-primary focus:ring-primary/20 bg-white dark:bg-surface-dark dark:border-white/20 transition-all cursor-pointer" id="terms" name="terms" type="checkbox" required />
                            </div>
                            <div className="text-sm leading-6">
                                <label className="font-normal text-text-main-light dark:text-gray-300" htmlFor="terms">
                                    Li e aceito os <a className="font-semibold text-primary hover:underline" href="#">Termos de Uso</a> e a <a className="font-semibold text-primary hover:underline" href="#">Política de Privacidade</a>.
                                </label>
                            </div>
                        </div>

                        <button
                            className={`group mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-primary text-[#0d1b12] text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark active:scale-[0.98] transition-all shadow-md shadow-primary/20 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            <span className="truncate group-hover:translate-x-1 transition-transform">
                                {isLoading ? 'Criando conta...' : 'Cadastrar'}
                            </span>
                            {!isLoading && <span className="material-symbols-outlined ml-2 text-[20px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span>}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm text-text-main-light dark:text-gray-400">
                            Já tem uma conta? <Link className="font-bold text-primary hover:underline" to="/login">Entrar</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;