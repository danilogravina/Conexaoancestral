import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.errors.name_required');
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t('contact.form.errors.name_length');
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.errors.email_required');
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('contact.form.errors.email_invalid');
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.errors.message_required');
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.form.errors.message_length');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      alert(t('contact.form.success'));
      // Form submission logic

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setErrors({});
    } else {
      // Optional: shake effect or scroll to error could be added here
      // Validation error handled by state
    }
  };

  return (
    <>
      <section className="w-full bg-[#eef6f1] dark:bg-[#152e1e] py-12 md:py-20 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/assets/img/contact-hero-pattern.png')", backgroundSize: 'cover', mixBlendMode: 'multiply' }}></div>
        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 mb-6 text-xs md:text-sm font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full dark:text-primary dark:bg-primary/20">{t('contact.hero.badge')}</span>
            <h1 className="text-text-main-light dark:text-white h1-standard mb-6">
              {t('contact.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-text-secondary-light dark:text-gray-300 leading-relaxed max-w-lg font-light">
              {t('contact.hero.description')}
            </p>
          </div>
          <div className="hidden md:block w-64 h-64 rounded-full overflow-hidden border-8 border-white dark:border-white/10 shadow-xl shrink-0">
            <img className="w-full h-full object-cover" src="/assets/img/contact-hands-plant.jpg" alt="Hands holding green plant sprout" />
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1200px] mx-auto px-6 py-12 md:py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
            <div className="bg-white dark:bg-[#1a3324] rounded-2xl shadow-sm border border-stone-200 dark:border-white/10 p-6 md:p-10">
              <h2 className="text-text-main-light dark:text-white h2-standard mb-8">{t('contact.form.title')}</h2>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main-light dark:text-gray-200 text-sm font-bold">{t('contact.form.name')}</span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-input w-full h-12 px-4 rounded-xl border bg-background-light focus:ring-1 outline-none transition-all placeholder:text-text-secondary-light/60 dark:bg-[#102216] dark:text-white ${errors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-stone-200 focus:border-primary focus:ring-primary dark:border-white/10'
                        }`}
                      placeholder="Maria Silva"
                      type="text"
                    />
                    {errors.name && <span className="text-red-500 text-xs font-medium animate-pulse">{errors.name}</span>}
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main-light dark:text-gray-200 text-sm font-bold">{t('contact.form.email')}</span>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input w-full h-12 px-4 rounded-xl border bg-background-light focus:ring-1 outline-none transition-all placeholder:text-text-secondary-light/60 dark:bg-[#102216] dark:text-white ${errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-stone-200 focus:border-primary focus:ring-primary dark:border-white/10'
                        }`}
                      placeholder="exemplo@email.com"
                      type="email"
                    />
                    {errors.email && <span className="text-red-500 text-xs font-medium animate-pulse">{errors.email}</span>}
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main-light dark:text-gray-200 text-sm font-bold">{t('contact.form.phone')}</span>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input w-full h-12 px-4 rounded-xl border border-stone-200 bg-background-light focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-secondary-light/60 dark:bg-[#102216] dark:border-white/10 dark:text-white"
                      placeholder={t('contact.form.phone_placeholder')}
                      type="tel"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main-light dark:text-gray-200 text-sm font-bold">{t('contact.form.subject')}</span>
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-select w-full h-12 px-4 rounded-xl border border-stone-200 bg-background-light focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main-light dark:bg-[#102216] dark:border-white/10 dark:text-white cursor-pointer appearance-none"
                      >
                        <option value="">{t('contact.form.subject_placeholder')}</option>
                        <option value="voluntariado">{t('contact.form.options.volunteer')}</option>
                        <option value="doacao">{t('contact.form.options.donation')}</option>
                        <option value="parceria">{t('contact.form.options.partnership')}</option>
                        <option value="outros">{t('contact.form.options.other')}</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary-light">expand_more</span>
                    </div>
                  </label>
                </div>
                <label className="flex flex-col gap-2">
                  <span className="text-text-main-light dark:text-gray-200 text-sm font-bold">{t('contact.form.message')}</span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`form-textarea w-full h-32 px-4 py-3 rounded-xl border bg-background-light focus:ring-1 outline-none transition-all placeholder:text-text-secondary-light/60 resize-none dark:bg-[#102216] dark:text-white ${errors.message
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-stone-200 focus:border-primary focus:ring-primary dark:border-white/10'
                      }`}
                    placeholder="Escreva sua mensagem aqui..."
                  ></textarea>
                  {errors.message && <span className="text-red-500 text-xs font-medium animate-pulse">{errors.message}</span>}
                </label>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-text-secondary-light max-w-[60%] hidden md:block">{t('contact.form.privacy')}</p>
                  <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-text-main-light font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 w-full md:w-auto" type="submit">
                    <span>{t('contact.form.submit')}</span>
                    <span className="material-symbols-outlined text-sm font-bold">send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 order-1 lg:order-2">
            <div className="bg-white dark:bg-[#1a3324] rounded-2xl shadow-sm border border-stone-200 dark:border-white/10 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-text-main-light dark:text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">contact_support</span>
                {t('contact.channels.title')}
              </h2>
              <div className="flex flex-col gap-6">
                {[
                  { icon: 'mail', title: 'E-mail', text: 'contato@conexaoancestral.org', sub: 'Resposta em até 24h úteis' },
                  { icon: 'call', title: 'Telefone / WhatsApp', text: '+55 (92) 99999-9999', sub: 'Seg a Sex, das 9h às 18h' },
                  { icon: 'location_on', title: 'Sede', text: 'Manaus, Amazonas - Brasil', sub: 'Caixa Postal 1234' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <span className="material-symbols-outlined text-primary group-hover:text-text-main-light transition-colors text-[20px]">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-secondary-light mb-1">{item.title}</p>
                      <p className="text-text-main-light dark:text-white font-medium break-all">{item.text}</p>
                      <p className="text-xs text-text-secondary-light mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-stone-200 dark:bg-white/10 my-6"></div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-text-secondary-light">{t('contact.channels.follow_us')}</p>
                <div className="flex gap-3">
                  <a href="https://instagram.com/conexaoancestral" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white dark:bg-[#102216] border border-stone-200 dark:border-white/10 flex items-center justify-center hover:border-primary text-gray-500 hover:text-primary transition-all duration-300 shadow-sm" aria-label="Instagram">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                  </a>
                  <a href="https://facebook.com/conexaoancestral" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white dark:bg-[#102216] border border-stone-200 dark:border-white/10 flex items-center justify-center hover:border-primary text-gray-500 hover:text-primary transition-all duration-300 shadow-sm" aria-label="Facebook">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                  </a>
                  <a href="https://x.com/conexaoancestral" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white dark:bg-[#102216] border border-stone-200 dark:border-white/10 flex items-center justify-center hover:border-primary text-gray-500 hover:text-primary transition-all duration-300 shadow-sm" aria-label="X">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                  <a href="https://linkedin.com/company/conexaoancestral" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white dark:bg-[#102216] border border-stone-200 dark:border-white/10 flex items-center justify-center hover:border-primary text-gray-500 hover:text-primary transition-all duration-300 shadow-sm" aria-label="LinkedIn">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a3324] rounded-2xl shadow-sm border border-stone-200 dark:border-white/10 overflow-hidden h-64 relative group cursor-pointer">
              <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" src="/assets/img/contact-map-preview.jpg" alt="Map view" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 pointer-events-none">
                <div className="flex items-center gap-2 text-white">
                  <span className="material-symbols-outlined text-primary">map</span>
                  <span className="font-medium">{t('contact.channels.map_link')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="w-full bg-[#13ec5b]/10 dark:bg-background-dark py-12 px-6 mt-8">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-white/10 mb-4 shadow-sm">
            <span className="material-symbols-outlined text-primary text-2xl">help_center</span>
          </div>
          <h2 className="text-text-main-light dark:text-white h2-standard mb-4">{t('contact.faq.title')}</h2>
          <p className="text-lg md:text-xl text-text-secondary-light dark:text-gray-300 mb-8 font-light max-w-2xl mx-auto">{t('contact.faq.description')}</p>
          <a className="inline-flex items-center text-primary font-bold hover:underline gap-1" href="#">
            {t('contact.faq.link')}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </section>
    </>
  );
};

export default Contact;