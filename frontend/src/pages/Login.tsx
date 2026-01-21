import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados do Login
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // Estados do Registro
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cpf: '',
    department: '',
    position: '',
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(loginData.email, loginData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await register({
        ...registerData,
        role: 'employee',
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>RH Plus</h1>
          <p>Sistema de Gestão de Recursos Humanos</p>
        </div>

        <div className="tab-buttons">
          <button 
            className={isLogin ? 'tab-active' : 'tab-inactive'}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Entrar
          </button>
          <button 
            className={isLogin ? 'tab-inactive' : 'tab-active'}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Registrar
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Nome:</label>
                <input
                  type="text"
                  id="firstName"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Sobrenome:</label>
                <input
                  type="text"
                  id="lastName"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="registerEmail">Email:</label>
              <input
                type="email"
                id="registerEmail"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                id="cpf"
                value={registerData.cpf}
                onChange={(e) => setRegisterData({ ...registerData, cpf: e.target.value })}
                required
                maxLength={11}
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Departamento:</label>
                <input
                  type="text"
                  id="department"
                  value={registerData.department}
                  onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="position">Cargo:</label>
                <input
                  type="text"
                  id="position"
                  value={registerData.position}
                  onChange={(e) => setRegisterData({ ...registerData, position: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="registerPassword">Senha:</label>
              <input
                type="password"
                id="registerPassword"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;