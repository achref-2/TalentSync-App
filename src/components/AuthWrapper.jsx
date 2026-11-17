import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const checkTokenValidity = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    return false;
  }

  return true;
};

export const AuthWrapper = ({ children, allowedRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = checkTokenValidity();
            const userType = localStorage.getItem('userType'); // e.g., 'recruiter' or 'candidate'
      // Public routes that don't need authentication
      const publicRoutes = ['/', '/Pricing','/admin' , '/Blog', '/Testing',  '/cv','/dashboard/recuiter/PendingApproval'];
      
     if (!isAuthenticated &&  !publicRoutes.includes(location.pathname)) {
        navigate('/');
      } else if (allowedRole && userType !== allowedRole) {
        // If user is not allowed, show NotFoundPage
        navigate('/notfound', { replace: true });
      }
    };
    checkAuth();

    // Check token validity every hour
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, [navigate, location]);

  return children;
};
