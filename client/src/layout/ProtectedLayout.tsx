import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedLayout = ({ children, allowedRoles }: ProtectedLayoutProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = () => {
      const role = localStorage.getItem('role');
      if (!role || !allowedRoles.includes(role)) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuthorization();
    
    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      checkAuthorization();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [allowedRoles]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedLayout;