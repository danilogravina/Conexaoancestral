import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserSidebar } from './Dashboard';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, session, isLoading: isAuthLoading, refreshProfile } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        cpf: '',
        phone: '',
        zip: '',
        street: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: ''
    });

    useEffect(() => {
        if (!isAuthLoading && !session) {
            navigate('/login');
        }
    }, [session, isAuthLoading, navigate]);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName,
                email: user.email,
                cpf: user.cpf,
                phone: user.phone,
                zip: user.address?.zip || '',
                street: user.address?.street || '',
                number: user.address?.number || '',
                complement: user.address?.complement || '',
                district: user.address?.district || '',
                city: user.address?.city || '',
                state: user.address?.state || ''
            });
        }
    }, [user]);

    if (isAuthLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark py-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark py-20">
                <div className="flex flex-col items-center gap-6 max-w-md mx-auto text-center px-6">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-main-light dark:text-white mb-2">Erro no Perfil</h2>
                        <p className="text-text-secondary-light dark:text-gray-400">
                            Não foi possível carregar suas informações de perfil. Isso pode ocorrer se o cadastro não foi concluído corretamente.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 px-6 py-3 rounded-lg bg-primary text-[#0d1b12] font-bold hover:bg-primary-dark transition-colors"
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}
                            className="flex-1 px-6 py-3 rounded-lg border border-stone-200 dark:border-white/10 text-text-main-light dark:text-white font-bold hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Sair da Conta
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let formattedValue = value;

        if (name === 'phone') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (name === 'zip') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));

        if (name === 'zip') {
            const cleanZip = value.replace(/\D/g, '');
            if (cleanZip.length === 8) {
                fetchAddress(cleanZip);
            }
        }
    };

    const fetchAddress = async (cep: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    street: data.logradouro,
                    district: data.bairro,
                    city: data.localidade,
                    state: data.uf
                }));
                document.getElementById('number')?.focus();
            }
        } catch (error) {
            console.error("Erro ao buscar CEP", error);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user) {
            setIsSaving(true);
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ avatar_url: publicUrl })
                    .eq('id', user.id);

                if (updateError) throw updateError;

                await refreshProfile();
                alert("Foto de perfil atualizada!");
            } catch (error: any) {
                alert("Erro ao enviar imagem: " + error.message);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.fullName,
                    phone: formData.phone,
                    address: {
                        zip: formData.zip,
                        street: formData.street,
                        number: formData.number,
                        complement: formData.complement,
                        district: formData.district,
                        city: formData.city,
                        state: formData.state
                    },
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            alert("Dados atualizados com sucesso!");
        } catch (error: any) {
            alert("Erro ao salvar dados: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm("Tem certeza que deseja descartar as alterações?")) {
            setFormData({
                fullName: user.fullName,
                email: user.email,
                cpf: user.cpf,
                phone: user.phone,
                zip: user.address?.zip || '',
                street: user.address?.street || '',
                number: user.address?.number || '',
                complement: user.address?.complement || '',
                district: user.address?.district || '',
                city: user.address?.city || '',
                state: user.address?.state || ''
            });
        }
    };

    return (
        <div className="flex-1 bg-background-light dark:bg-background-dark py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
                <UserSidebar onAvatarEdit={handleAvatarClick} />

                <main className="flex-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <nav className="flex flex-wrap gap-2 mb-6 items-center text-sm">
                        <Link to="/minha-conta" className="text-text-secondary-light hover:text-primary transition-colors font-medium">Início</Link>
                        <span className="text-gray-300">/</span>
                        <Link to="/minha-conta" className="text-text-secondary-light hover:text-primary transition-colors font-medium">Minha Conta</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-text-main-light font-semibold dark:text-white">Informações do Doador</span>
                    </nav>

                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main-light dark:text-white mb-2">Informações do Doador</h1>
                        <p className="text-text-secondary-light dark:text-gray-400 max-w-2xl">Mantenha seus dados atualizados para receber novidades sobre nossos projetos e relatórios de impacto na Amazônia.</p>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-stone-100 dark:border-white/10 overflow-hidden">
                        <form className="divide-y divide-stone-100 dark:divide-white/10" onSubmit={handleSave}>
                            <div className="p-6 md:p-8">
                                <h2 className="text-lg font-bold text-text-main-light dark:text-white mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">badge</span>
                                    Dados Pessoais
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="fullName">Nome Completo</label>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light placeholder-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="email">E-mail</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <span className="material-symbols-outlined text-[20px]">mail</span>
                                            </span>
                                            <input
                                                className="w-full rounded-lg border border-gray-200 bg-gray-100 pl-10 pr-4 py-2.5 text-gray-500 cursor-not-allowed dark:border-white/10 dark:bg-white/5 dark:text-gray-500 transition-all font-medium"
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                disabled
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-text-secondary-light dark:text-gray-500">O e-mail não pode ser alterado.</p>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="cpf">CPF</label>
                                        <input
                                            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-500 cursor-not-allowed dark:border-white/10 dark:bg-white/5 dark:text-gray-500"
                                            disabled
                                            id="cpf"
                                            name="cpf"
                                            type="text"
                                            value={formData.cpf}
                                        />
                                        <p className="mt-1 text-xs text-text-secondary-light dark:text-gray-500">Para cadastrar ou alterar o CPF, entre em contato.</p>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="phone">Celular / WhatsApp</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <span className="material-symbols-outlined text-[20px]">smartphone</span>
                                            </span>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-2.5 text-text-main-light placeholder-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                                id="phone"
                                                name="phone"
                                                placeholder="(00) 00000-0000"
                                                type="tel"
                                                maxLength={15}
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                <h2 className="text-lg font-bold text-text-main-light dark:text-white mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    Endereço
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="zip">CEP</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                                id="zip"
                                                name="zip"
                                                placeholder="00000-000"
                                                type="text"
                                                maxLength={9}
                                                value={formData.zip}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 md:col-span-4">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="street">Rua / Avenida</label>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                            id="street"
                                            name="street"
                                            type="text"
                                            value={formData.street}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="number">Número</label>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                            id="number"
                                            name="number"
                                            type="text"
                                            value={formData.number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-4">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="complement">Complemento (Opcional)</label>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                            id="complement"
                                            name="complement"
                                            placeholder="Apto, Bloco, etc."
                                            type="text"
                                            value={formData.complement}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="district">Bairro</label>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                            id="district"
                                            name="district"
                                            type="text"
                                            value={formData.district}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-3">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="city">Cidade</label>
                                        <input
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all"
                                            id="city"
                                            name="city"
                                            type="text"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-1">
                                        <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2" htmlFor="state">Estado</label>
                                        <select
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-text-main-light focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white transition-all appearance-none"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                        >
                                            <option value="">UF</option>
                                            <option value="SP">SP</option>
                                            <option value="RJ">RJ</option>
                                            <option value="MG">MG</option>
                                            <option value="AM">AM</option>
                                            <option value="AC">AC</option>
                                            <option value="PA">PA</option>
                                            <option value="RO">RO</option>
                                            <option value="RR">RR</option>
                                            <option value="AP">AP</option>
                                            <option value="TO">TO</option>
                                            <option value="MA">MA</option>
                                            <option value="MT">MT</option>
                                            <option value="MS">MS</option>
                                            <option value="GO">GO</option>
                                            <option value="DF">DF</option>
                                            <option value="RS">RS</option>
                                            <option value="SC">SC</option>
                                            <option value="PR">PR</option>
                                            <option value="ES">ES</option>
                                            <option value="BA">BA</option>
                                            <option value="SE">SE</option>
                                            <option value="AL">AL</option>
                                            <option value="PE">PE</option>
                                            <option value="PB">PB</option>
                                            <option value="RN">RN</option>
                                            <option value="CE">CE</option>
                                            <option value="PI">PI</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-background-light dark:bg-black/20 px-6 py-4 md:px-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
                                <button
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-stone-300 text-text-main-light font-bold text-sm hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-300 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={`w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-black font-bold text-sm shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-surface-dark transition-all flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    type="submit"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">save</span>
                                            Salvar Alterações
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;