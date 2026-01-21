import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  employee?: {
    id: number;
    department: string;
    position: string;
    cpf: string;
  };
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('@RHPlus:token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('@RHPlus:token');
      
      if (storedToken) {
        try {
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          const response = await api.get('/auth/profile');
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem('@RHPlus:token');
          setToken(null);
        }
      }
      
      setLoading(false);
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('@RHPlus:token', newToken);
      api.defaults.headers.Authorization = `Bearer ${newToken}`;
      
      setToken(newToken);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem('@RHPlus:token', newToken);
      api.defaults.headers.Authorization = `Bearer ${newToken}`;
      
      setToken(newToken);
      setUser(newUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao registrar');
    }
  };

  const logout = () => {
    localStorage.removeItem('@RHPlus:token');
    api.defaults.headers.Authorization = '';
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};