import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Background decorativo */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      {/* Conteúdo principal */}
      <div className="home-content">
        {/* Logo YUNA */}
        <div className="logo-section">
          <div className="logo-placeholder">
            <div className="logo-content">
              <div className="hospital-icon">🏥</div>
              <div className="yuna-text">YUNA</div>
              <div className="clinic-text">Clínica</div>
            </div>
          </div>
        </div>

        {/* Título e descrição */}
        <div className="welcome-section">
          <h1 className="main-title">Bem-vindo ao RH Plus</h1>
          <p className="subtitle">Sistema de Gestão de Recursos Humanos para YUNA Clínica</p>
          
          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span className="feature-text">Gestão de Funcionários</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📋</span>
              <span className="feature-text">Solicitações de Férias</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⏰</span>
              <span className="feature-text">Ponto Eletrônico</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <span className="feature-text">Folhas de Pagamento</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏥</span>
              <span className="feature-text">Atestados Médicos</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span className="feature-text">Relatórios e Análises</span>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary btn-large"
            onClick={() => navigate('/login')}
          >
            Entrar no Sistema
          </button>
          <p className="help-text">
            Você será redirecionado para a tela de login onde poderá entrar com suas credenciais.
          </p>
        </div>

        {/* Informações de suporte */}
        <div className="support-section">
          <p className="support-text">
            💡 <strong>Primeira vez?</strong> Use as credenciais que foram fornecidas para você.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
