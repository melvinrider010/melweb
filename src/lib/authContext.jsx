import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import api, { setAuthToken, getAuthToken } from './api';
import CollegeVideoLoader from '../components/common/CollegeVideoLoader';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Authentication user object held strictly in memory
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Validate active session with backend on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setUser(null);
          setInitialCheckDone(true);
          return;
        }
        await api.initCsrf();
        const res = await api.get('/auth/me');
        const userData = res?.user || res;
        if (userData && userData.id) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
        if (err?.status === 401 || err?.status === 403) {
          setAuthToken(null);
        }
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      // 1. Initialize CSRF token
      await api.initCsrf();

      // 2. Perform live server-side authentication
      const res = await api.post('/auth/login', { email: cleanEmail, password });
      
      if (!res || !res.user) {
        throw new Error('Invalid authentication response from server.');
      }

      const authUser = res.user;
      const token = res.token || null;

      if (token) {
        setAuthToken(token);
      }

      setUser(authUser);
      setLoading(false);
      return authUser;
    } catch (err) {
      setAuthToken(null);
      setUser(null);
      setLoading(false);
      throw new Error(err?.data?.message || err?.message || 'Invalid administrator credentials. Please check your email and password.');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setAuthToken(null);
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
      <CollegeVideoLoader 
        label="Verifying departmental credentials..." 
        isFullScreen={true} 
      />
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
