import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface MaintenanceGuardProps {
    children: React.ReactNode;
}

const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
    const { user, isLoading } = useUser();
    const location = useLocation();

    // Paths that should NOT be redirected to maintenance
    const publicPaths = ['/maintenance', '/login'];
    const isPublicPath = publicPaths.includes(location.pathname);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If it's a public path (like maintenance or login), allow access
    if (isPublicPath) {
        return <>{children}</>;
    }

    // If user is admin, allow access to everything
    if (user?.role === 'admin') {
        return <>{children}</>;
    }

    // Otherwise, redirect to maintenance
    return <Navigate to="/maintenance" replace />;
};

export default MaintenanceGuard;
