import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Agar user nahi hai to login page pe redirect karo
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Agar user hai to children show karo
  return children;
};

export default ProtectedRoute;