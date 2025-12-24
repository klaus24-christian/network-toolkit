import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@components/layout/Navbar';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { SubnetCalculator } from '@/pages/SubnetCalculator';
import { Loader2 } from 'lucide-react';
import { Register } from './pages/Register';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subnet"
        element={
          <ProtectedRoute>
            <Navbar />
            <SubnetCalculator />
          </ProtectedRoute>
        }
      />
      <Route
  path="/register"
  element={
    <PublicRoute>
      <Register />
    </PublicRoute>
  }
/>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                404
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Page not found
              </p>
              <a
                href="/dashboard"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;