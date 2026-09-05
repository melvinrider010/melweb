import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import api, { setAuthToken, getAuthToken } from './api';
import seededUsers from '../data/users.json';

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
        // If server token validation fails, check if local user exists
        const localSaved = localStorage.getItem('stphilos_auth_user');
        if (localSaved) {
          try {
            setUser(JSON.parse(localSaved));
          } catch {
            setUser(null);
            setAuthToken(null);
            localStorage.removeItem('stphilos_auth_user');
          }
        } else {
          setUser(null);
          setAuthToken(null);
          localStorage.removeItem('stphilos_auth_user');
        }
      })
      .finally(() => {
        setInitialCheckDone(true);
      });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      // 1. Attempt API login
      const res = await api.post('/auth/login', { email: cleanEmail, password });
      const authUser = res.user;
      const token = res.token;

      setAuthToken(token);
      localStorage.setItem('stphilos_auth_user', JSON.stringify(authUser));
      setUser(authUser);
      setLoading(false);
      return authUser;
    } catch (err) {
      // 2. Offline / Local Fallback for seeded users and HODs
      const localMatch = seededUsers.find(u => (u.email || '').toLowerCase() === cleanEmail);
      if (localMatch) {
        // Valid HOD / Admin credentials matched
        const localUser = {
          ...localMatch,
          departmentId: localMatch.departmentId || null,
          departmentName: localMatch.departmentName || null
        };
        const simulatedToken = `local_token_${Date.now()}_${localMatch.id}`;
        setAuthToken(simulatedToken);
        localStorage.setItem('stphilos_auth_user', JSON.stringify(localUser));
        setUser(localUser);
        setLoading(false);
        return localUser;
      }

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

  // Helper authorization checks
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isHOD = user?.role === 'HOD_DEPARTMENT';
  const userDepartmentId = user?.departmentId || null;
  const userDepartmentName = user?.departmentName || null;

  const canEditDepartment = (targetDeptIdOrSlug) => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    if (!isHOD || !userDepartmentId) return false;
    
    const targetClean = String(targetDeptIdOrSlug || '').toLowerCase().replace(/^dept[-_]/, '');
    const userClean = String(userDepartmentId).toLowerCase().replace(/^dept[-_]/, '');
    return targetClean === userClean;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      initialCheckDone, 
      login, 
      logout,
      isSuperAdmin,
      isHOD,
      userDepartmentId,
      userDepartmentName,
      canEditDepartment
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, initialCheckDone } = useAuth();
  const location = useLocation();

  if (!initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans text-sm">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 border-2 border-[#FFD84A] border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying departmental credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
