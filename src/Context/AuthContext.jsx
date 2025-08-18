import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Set base URL for axios
const API_BASE_URL = 'http://localhost:3000';
axios.defaults.baseURL = API_BASE_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await axios.get('/api/auth/me');
        setUser(data.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setMessage('');
      const { data } = await axios.post('/api/auth/register', userData);
      
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setUser(data.user);
      setMessage('Registration successful! Welcome!');
      setIsAuthenticated(true);
      
      setTimeout(() => navigate('/'), 1000);
      
      return { success: true, message: 'Registration successful!', user: data.user };
    } catch (error) {
      setIsAuthenticated(false);
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setMessage('');
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials) => {
    try {
      setMessage('');
      const { data } = await axios.post('/api/auth/login', credentials);
      
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      setMessage('Login successful! Welcome back!');
      setIsAuthenticated(true);
      
      setTimeout(() => navigate('/'), 1000);
      
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      setIsAuthenticated(false);
      const errorMessage = error.response?.data?.error || 'Login failed';
      setMessage('');
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const updateDetails = async (userData) => {
    try {
      const { data } = await axios.put('/api/auth/updatedetails', userData);
      setUser(data.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Update failed' };
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      await axios.put('/api/auth/updatepassword', passwordData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Password update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        message,
        isAuthenticated,
        register,
        login,
        logout,
        updateDetails,
        updatePassword,
        setMessage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};