import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

interface MedicalCertificate {
  id: number;
  employeeId: number;
  employee: {
    firstName: string;
    lastName: string;
  };
  startDate: string;
  endDate: string;
  diagnosis: string;
  doctorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const MedicalCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<MedicalCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicalCertificates();
  }, []);

  const fetchMedicalCertificates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/medical-certificates');
      setCertificates(response.data);
    } catch (err: any) {
      setError('Erro ao carregar atestados médicos');
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
          <p>Carregando atestados...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>🏥 Atestados Médicos</h1>
          <p>Gerencie todos os atestados médicos dos funcionários</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2>Atestados Médicos</h2>
            <button className="btn btn-primary">
              + Novo Atestado
            </button>
          </div>

          {certificates.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum atestado médico encontrado.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Funcionário</th>
                    <th>Data Início</th>
                    <th>Data Fim</th>
                    <th>Diagnóstico</th>
                    <th>Médico</th>
                    <th>Status</th>
                    <th>Criado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((certificate) => {
                    const statusInfo = getStatusBadge(certificate.status);
                    return (
                      <tr key={certificate.id}>
                        <td>{certificate.employee.firstName} {certificate.employee.lastName}</td>
                        <td>{formatDate(certificate.startDate)}</td>
                        <td>{formatDate(certificate.endDate)}</td>
                        <td title={certificate.diagnosis}>
                          {certificate.diagnosis.length > 40 
                            ? certificate.diagnosis.substring(0, 40) + '...' 
                            : certificate.diagnosis
                          }
                        </td>
                        <td>{certificate.doctorName}</td>
                        <td>
                          <span className={`badge ${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>{formatDate(certificate.createdAt)}</td>
                        <td>
                          <div className="action-buttons">
                            {certificate.status === 'pending' && (
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

export default MedicalCertificates;