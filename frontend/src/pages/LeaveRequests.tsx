import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

interface LeaveRequest {
  id: number;
  employeeId: number;
  employee: {
    firstName: string;
    lastName: string;
  };
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const LeaveRequests: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/leave-requests');
      setLeaveRequests(response.data);
    } catch (err: any) {
      setError('Erro ao carregar solicitações de férias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { class: 'badge-warning', text: 'Pendente' },
      approved: { class: 'badge-success', text: 'Aprovado' },
      rejected: { class: 'badge-danger', text: 'Rejeitado' }
    };
    return statusMap[status as keyof typeof statusMap] || { class: 'badge-secondary', text: status };
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando solicitações...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>🏖️ Solicitações de Férias</h1>
          <p>Gerencie todas as solicitações de férias dos funcionários</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2>Solicitações de Férias</h2>
            <button className="btn btn-primary">
              + Nova Solicitação
            </button>
          </div>

          {leaveRequests.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma solicitação de férias encontrada.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Funcionário</th>
                    <th>Data Início</th>
                    <th>Data Fim</th>
                    <th>Motivo</th>
                    <th>Status</th>
                    <th>Solicitação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => {
                    const statusInfo = getStatusBadge(request.status);
                    return (
                      <tr key={request.id}>
                        <td>{request.employee.firstName} {request.employee.lastName}</td>
                        <td>{formatDate(request.startDate)}</td>
                        <td>{formatDate(request.endDate)}</td>
                        <td title={request.reason}>
                          {request.reason.length > 50 
                            ? request.reason.substring(0, 50) + '...' 
                            : request.reason
                          }
                        </td>
                        <td>
                          <span className={`badge ${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>{formatDate(request.createdAt)}</td>
                        <td>
                          <div className="action-buttons">
                            {request.status === 'pending' && (
                              <>
                                <button className="btn btn-sm btn-success">Aprovar</button>
                                <button className="btn btn-sm btn-danger">Rejeitar</button>
                              </>
                            )}
                            <button className="btn btn-sm btn-secondary">Ver Detalhes</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LeaveRequests;