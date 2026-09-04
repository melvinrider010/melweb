import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import api, { setAuthToken, getAuthToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('stphilos_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Validate existing token with server on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      localStorage.removeItem('stphilos_auth_user');
      setInitialCheckDone(true);
      return;
    }

    api.get('/auth/me')
      .then((res) => {
        const userData = res.user || res;
        setUser(userData);
        localStorage.setItem('stphilos_auth_user', JSON.stringify(userData));
      })
      .catch(() => {
        // Token expired or invalid
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem('stphilos_auth_user');
      })
      .finally(() => {
        setInitialCheckDone(true);
      });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const authUser = res.user;
      const token = res.token;

      setAuthToken(token);
      localStorage.setItem('stphilos_auth_user', JSON.stringify(authUser));
      setUser(authUser);
      setLoading(false);
      return authUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setAuthToken(null);
      localStorage.removeItem('stphilos_auth_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, initialCheckDone, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, initialCheckDone } = useAuth();
  const location = useLocation();

  if (!initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans text-sm">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 border-2 border-[#FFD84A] border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying authentication...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
