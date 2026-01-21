import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Dashboard.css';

interface DashboardStats {
  employees: number;
  todayTimeEntries: number;
  pendingLeaveRequests: number;
  pendingMedicalCertificates: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clockedIn, setClockedIn] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    checkClockStatus();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (err: any) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkClockStatus = async () => {
    try {
      const response = await api.get('/api/time-entries/today');
      if (response.data && response.data.length > 0) {
        const lastEntry = response.data[response.data.length - 1];
        setClockedIn(lastEntry.clockOut === null);
      }
    } catch (err) {
      console.error('Erro ao verificar status do ponto:', err);
    }
  };

  const handleClockInOut = async () => {
    setClockLoading(true);
    try {
      if (clockedIn) {
        await api.post('/api/time-entries/clock-out');
        setClockedIn(false);
      } else {
        await api.post('/api/time-entries/clock-in');
        setClockedIn(true);
      }
      // Atualizar stats
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar ponto');
    } finally {
      setClockLoading(false);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo(a), {user?.firstName}!</p>
          </div>
          <div className="clock-section">
            <div className="current-time">
              <div className="time">{getCurrentTime()}</div>
              <div className="date">{getCurrentDate()}</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Clock In/Out Section */}
        <div className="clock-card">
          <h2>Registro de Ponto</h2>
          <div className="clock-content">
            <div className="clock-status">
              <span className={`status-indicator ${clockedIn ? 'clocked-in' : 'clocked-out'}`}></span>
              <span className="status-text">
                {clockedIn ? 'Você está trabalhando' : 'Você está fora do expediente'}
              </span>
            </div>
            <button 
              className={`clock-button ${clockedIn ? 'clock-out' : 'clock-in'}`}
              onClick={handleClockInOut}
              disabled={clockLoading}
            >
              {clockLoading ? 'Processando...' : clockedIn ? 'Registrar Saída' : 'Registrar Entrada'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon employees">👥</div>
            <div className="stat-content">
              <h3>{stats?.employees || 0}</h3>
              <p>Funcionários</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon time-entries">⏰</div>
            <div className="stat-content">
              <h3>{stats?.todayTimeEntries || 0}</h3>
              <p>Registros de Hoje</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon leave-requests">🏖️</div>
            <div className="stat-content">
              <h3>{stats?.pendingLeaveRequests || 0}</h3>
              <p>Férias Pendentes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon medical">🏥</div>
            <div className="stat-content">
              <h3>{stats?.pendingMedicalCertificates || 0}</h3>
              <p>Atestados Pendentes</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Ações Rápidas</h2>
          <div className="actions-grid">
            <button className="action-button" onClick={() => window.location.href = '/employees'}>
              <span className="action-icon">👥</span>
              <span>Gerenciar Funcionários</span>
            </button>
            
            <button className="action-button" onClick={() => window.location.href = '/time-tracking'}>
              <span className="action-icon">⏰</span>
              <span>Ponto Eletrônico</span>
            </button>
            
            <button className="action-button" onClick={() => window.location.href = '/leave-requests'}>
              <span className="action-icon">🏖️</span>
              <span>Solicitações de Férias</span>
            </button>
            
            <button className="action-button" onClick={() => window.location.href = '/medical-certificates'}>
              <span className="action-icon">🏥</span>
              <span>Atestados Médicos</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;