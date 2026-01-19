import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface ThanksState {
  amount?: number;
  projectTitle?: string;
}

const ThankYou: React.FC = () => {
  const location = useLocation();
  const state = (location.state || {}) as ThanksState;
  const amount = state.amount && !Number.isNaN(Number(state.amount)) ? Number(state.amount) : null;
  const projectTitle = state.projectTitle || 'nosso projeto';

  return (
    <div className="flex-1 flex items-center justify-center bg-surface-light dark:bg-surface-dark py-16 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-3xl shadow-lg p-8 md:p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Obrigado pela sua doação!</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg mb-6">
          Sua contribuição ajuda diretamente {projectTitle} a continuar impactando vidas.
          {amount ? ` Valor: R$ ${amount.toFixed(2)}.` : ''}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/projetos"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-white font-bold shadow hover:bg-primary-dark transition-colors"
          >
            Ver outros projetos
          </Link>
          <Link
            to="/minha-conta/doacoes"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-text-main-light dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Ver minhas doações
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
