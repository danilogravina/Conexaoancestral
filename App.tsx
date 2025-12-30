import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UserDonations from './pages/UserDonations';
import Settings from './pages/Settings';
import Transparency from './pages/Transparency';
import About from './pages/About';
import SearchResults from './pages/SearchResults';
import Header from './components/Header';
import Footer from './components/Footer';

const ScrollToTop = () => {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, search]);

  return null;
};

const AppContent: React.FC = () => {
  useEffect(() => {
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-display">
      <ScrollToTop />
      <Header toggleTheme={toggleTheme} />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/projetos/:id" element={<ProjectDetails />} />
          <Route path="/quem-somos" element={<About />} />
          <Route path="/transparencia" element={<Transparency />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/minha-conta" element={<Dashboard />} />
          <Route path="/minha-conta/perfil" element={<Profile />} />
          <Route path="/minha-conta/doacoes" element={<UserDonations />} />
          <Route path="/minha-conta/configuracoes" element={<Settings />} />
          <Route path="/busca" element={<SearchResults />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <UserProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </UserProvider>
  );
};

export default App;