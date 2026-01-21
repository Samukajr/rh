import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

interface Payslip {
  id: number;
  employeeId: number;
  employee: {
    firstName: string;
    lastName: string;
  };
  referenceMonth: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
}

const Payslips: React.FC = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/payslips');
      setPayslips(response.data);
    } catch (err: any) {
      setError('Erro ao carregar folhas de pagamento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { class: 'badge-warning', text: 'Pendente' },
      approved: { class: 'badge-info', text: 'Aprovado' },
      paid: { class: 'badge-success', text: 'Pago' }
    };
    return statusMap[status as keyof typeof statusMap] || { class: 'badge-secondary', text: status };
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando folhas de pagamento...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>💰 Folhas de Pagamento</h1>
          <p>Gerencie todas as folhas de pagamento dos funcionários</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2>Folhas de Pagamento</h2>
            <div className="filter-buttons">
              <button className="btn btn-primary">+ Gerar Folha</button>
              <button className="btn btn-secondary">Filtrar por Mês</button>
              <button className="btn btn-secondary">Exportar</button>
            </div>
          </div>

          {payslips.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma folha de pagamento encontrada.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Funcionário</th>
                    <th>Mês de Referência</th>
                    <th>Salário Bruto</th>
                    <th>Descontos</th>
                    <th>Salário Líquido</th>
                    <th>Status</th>
                    <th>Criado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((payslip) => {
                    const statusInfo = getStatusBadge(payslip.status);
                    return (
                      <tr key={payslip.id}>
                        <td>{payslip.employee.firstName} {payslip.employee.lastName}</td>
                        <td>{formatMonth(payslip.referenceMonth)}</td>
                        <td>{formatCurrency(payslip.grossSalary)}</td>
                        <td>{formatCurrency(payslip.deductions)}</td>
                        <td className="font-weight-bold">
                          {formatCurrency(payslip.netSalary)}
                        </td>
                        <td>
                          <span className={`badge ${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>{formatDate(payslip.createdAt)}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-secondary">Ver PDF</button>
                            {payslip.status === 'pending' && (
                              <button className="btn btn-sm btn-success">Aprovar</button>
                            )}
                            {payslip.status === 'approved' && (
                              <button className="btn btn-sm btn-primary">Marcar como Pago</button>
                            )}
                            <button className="btn btn-sm btn-secondary">Editar</button>
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

        {/* Summary Cards */}
        <div className="stats-grid stats-grid-margin">
          <div className="stat-card">
            <div className="stat-content">
              <h3>{payslips.filter(p => p.status === 'pending').length}</h3>
              <p>Pendentes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>{payslips.filter(p => p.status === 'approved').length}</h3>
              <p>Aprovadas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>{payslips.filter(p => p.status === 'paid').length}</h3>
              <p>Pagas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>
                {formatCurrency(
                  payslips.reduce((total, p) => total + p.netSalary, 0)
                )}
              </h3>
              <p>Total</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payslips;