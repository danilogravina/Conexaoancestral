import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { useUser } from './contexts/UserContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Blog = lazy(() => import('./pages/Blog'));
const Article = lazy(() => import('./pages/Article'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const UserDonations = lazy(() => import('./pages/UserDonations'));
const Settings = lazy(() => import('./pages/Settings'));
const Transparency = lazy(() => import('./pages/Transparency'));
const About = lazy(() => import('./pages/About'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjectsList = lazy(() => import('./pages/admin/AdminProjectsList'));
const AdminProjectForm = lazy(() => import('./pages/admin/AdminProjectForm'));

import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import MaintenanceGuard from './components/MaintenanceGuard';
import AdminTopBar from './components/AdminTopBar';

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
  const location = useLocation();
  const { user } = useUser();

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

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isMaintenanceRoute = location.pathname === '/maintenance';
  const showHeaderFooter = !isAdminRoute && !isMaintenanceRoute;

  return (
    <div className="flex flex-col min-h-screen font-display">
      <ScrollToTop />
      {user?.role === 'admin' && <AdminTopBar />}
      {showHeaderFooter && <Header toggleTheme={toggleTheme} />}
      <main className="flex-grow flex flex-col">
        <MaintenanceGuard>
          <Suspense fallback={
            <div className="flex-grow flex items-center justify-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/" element={<Home />} />
              <Route path="/projetos" element={<Projects />} />
              <Route path="/projetos/:id" element={<ProjectDetails />} />
              <Route path="/quem-somos" element={<About />} />
              {/* <Route path="/transparencia" element={<Transparency />} /> */}
              {/* <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<Article />} /> */}
              <Route path="/contato" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/minha-conta" element={<Dashboard />} />
              <Route path="/minha-conta/perfil" element={<Profile />} />
              <Route path="/minha-conta/doacoes" element={<UserDonations />} />
              <Route path="/minha-conta/configuracoes" element={<Settings />} />
              <Route path="/busca" element={<SearchResults />} />

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="projects" element={<AdminProjectsList />} />
                  <Route path="projects/new" element={<AdminProjectForm />} />
                  <Route path="projects/:id" element={<AdminProjectForm />} />
                </Route>
              </Route>

              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </MaintenanceGuard>
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;