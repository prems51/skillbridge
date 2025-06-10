import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}


export function ProtectedRoute({ children }) {
  const { user, loading, isInitialized } = useAuth();

  if (loading || !isInitialized) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function PublicRoute({ children }) {
  const { user, loading, isInitialized } = useAuth();

  // Show loading while Firebase determines auth state
  if (loading || !isInitialized) {
    return <LoadingSpinner />;
  }

  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // No user, show public content (login/signup)
  return children;
}

// Alternative: Auto-redirect component for your App.js
export function AuthRedirect() {
  const { user, loading, isInitialized } = useAuth();

  if (loading || !isInitialized) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}