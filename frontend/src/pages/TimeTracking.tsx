import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

interface TimeEntry {
  id: number;
  employeeId: number;
  employee: {
    firstName: string;
    lastName: string;
  };
  clockIn: string;
  clockOut?: string;
  date: string;
  totalHours?: number;
}

const TimeTracking: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const fetchTimeEntries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/time-entries');
      setTimeEntries(response.data);
    } catch (err: any) {
      setError('Erro ao carregar registros de ponto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando registros...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>⏰ Ponto Eletrônico</h1>
          <p>Acompanhe todos os registros de ponto dos funcionários</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2>Registros de Ponto</h2>
            <div className="filter-buttons">
              <button className="btn btn-secondary">Filtrar por Data</button>
              <button className="btn btn-secondary">Exportar Relatório</button>
            </div>
          </div>

          {timeEntries.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum registro de ponto encontrado.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Funcionário</th>
                    <th>Entrada</th>
                    <th>Saída</th>
                    <th>Total de Horas</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {timeEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{formatDate(entry.date)}</td>
                      <td>{entry.employee.firstName} {entry.employee.lastName}</td>
                      <td>{formatTime(entry.clockIn)}</td>
                      <td>{entry.clockOut ? formatTime(entry.clockOut) : '-'}</td>
                      <td>{entry.totalHours ? `${entry.totalHours}h` : '-'}</td>
                      <td>
                        <span className={`badge ${entry.clockOut ? 'badge-success' : 'badge-warning'}`}>
                          {entry.clockOut ? 'Finalizado' : 'Em andamento'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TimeTracking;