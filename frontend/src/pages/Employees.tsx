import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  department: string;
  position: string;
  role: string;
  createdAt: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/employees');
      setEmployees(response.data);
    } catch (err: any) {
      setError('Erro ao carregar funcionários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando funcionários...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>👥 Funcionários</h1>
          <p>Gerencie todos os funcionários da empresa</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2>Lista de Funcionários</h2>
            <button className="btn btn-primary">
              + Adicionar Funcionário
            </button>
          </div>

          {employees.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum funcionário encontrado.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th>Departamento</th>
                    <th>Cargo</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.firstName} {employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td>{employee.cpf}</td>
                      <td>{employee.department}</td>
                      <td>{employee.position}</td>
                      <td>
                        <span className={`badge ${employee.role === 'admin' ? 'badge-admin' : 'badge-employee'}`}>
                          {employee.role === 'admin' ? 'Administrador' : 'Funcionário'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-secondary">Editar</button>
                          <button className="btn btn-sm btn-danger">Excluir</button>
                        </div>
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

export default Employees;