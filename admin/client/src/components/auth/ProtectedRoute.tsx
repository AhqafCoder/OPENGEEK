import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('admin_token');
    
    if (token) {
      // In a real implementation, you would verify the token with your API
      // For now, we'll just check if it exists
      setIsAuthenticated(true);
    } else {
      // Redirect to login page if not authenticated
      navigate('/admin/login');
    }
    
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
