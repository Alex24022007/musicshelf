import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('musicshelf_token');
    if (!token) return setLoading(false);
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('musicshelf_token'))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = (data) => {
    localStorage.setItem('musicshelf_token', data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
  };

  const login = async (email, password) =>
    handleAuth((await api.post('/auth/login', { email, password })).data);

  const register = async (name, email, password) =>
    handleAuth((await api.post('/auth/register', { name, email, password })).data);

  const logout = () => {
    localStorage.removeItem('musicshelf_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
