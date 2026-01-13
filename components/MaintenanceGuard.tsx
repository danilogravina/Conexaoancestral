import React from 'react';

interface MaintenanceGuardProps {
    children: React.ReactNode;
}

const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
    // Maintenance mode disabled
    return <>{children}</>;
};

export default MaintenanceGuard;
