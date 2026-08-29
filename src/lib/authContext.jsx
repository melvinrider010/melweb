import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

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

  const login = (email, password) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const authUser = {
          email: email || 'admin@stphilos.ac.in',
          name: 'College Administrator',
          role: 'SUPER_ADMIN',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('stphilos_auth_user', JSON.stringify(authUser));
        setUser(authUser);
        setLoading(false);
        resolve(authUser);
      }, 600);
    });
  };

  const logout = () => {
    localStorage.removeItem('stphilos_auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
