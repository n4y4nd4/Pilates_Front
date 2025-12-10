import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cobrancasService } from '../../services/cobrancasService';


const Dashboard = () => {
  const [cobrancas, setCobrancas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    vencimentosProximos: 0,
    atrasados: { count: 0, valor: 0 },
    receitaPrevista: 0,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      // Carregar todas as cobranças para vencimentos próximos e receita prevista
      const todasCobrancas = await cobrancasService.listar();
      setCobrancas(todasCobrancas);

      // Usar endpoint específico para atrasadas (melhor performance)
      const atrasadas = await cobrancasService.listarAtrasadas();

      // Calcular estatísticas
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const seteDias = new Date();
      seteDias.setDate(hoje.getDate() + 7);
      seteDias.setHours(23, 59, 59, 999);

      const vencimentosProximos = todasCobrancas.filter(c => {
        if (!c.data_vencimento || c.status_cobranca === 'PAGO' || c.status_cobranca === 'CANCELADO') return false;
        const vencimento = new Date(c.data_vencimento);
        vencimento.setHours(0, 0, 0, 0);
        return vencimento >= hoje && vencimento <= seteDias;
      });

      const receitaPrevista = todasCobrancas
        .filter(c => c.status_cobranca === 'PENDENTE' || c.status_cobranca === 'ATRASADO')
        .reduce((sum, c) => {
          const valor = typeof c.valor_total_devido === 'string' 
            ? parseFloat(c.valor_total_devido) 
            : (c.valor_total_devido || 0);
          return sum + valor;
        }, 0);

      setStats({
        vencimentosProximos: vencimentosProximos.length,
        atrasados: {
          count: atrasadas.length,
          valor: atrasadas.reduce((sum, c) => {
            const valor = typeof c.valor_total_devido === 'string' 
              ? parseFloat(c.valor_total_devido) 
              : (c.valor_total_devido || 0);
            return sum + valor;
          }, 0),
        },
        receitaPrevista,
      });
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    const valorNumerico = typeof valor === 'string' 
      ? parseFloat(valor) 
      : (valor || 0);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valorNumerico);
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // Top 5 vencimentos mais próximos
  const vencimentosProximos = cobrancas
    .filter(c => {
      if (!c.data_vencimento || c.status_cobranca === 'PAGO' || c.status_cobranca === 'CANCELADO') return false;
      const vencimento = new Date(c.data_vencimento);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return vencimento >= hoje;
    })
    .sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento))
    .slice(0, 5);

  if (loading) {
    return <div className="loading">Carregando dashboard...</div>;
  }

  return (
    <div className="dashboard">
      {/* Cabeçalho */}
      <header className="dashboard-header">
        <div className="header-left">

          <h1>Sistema de Cobrança</h1>
        </div>
        <div className="notifications-icon">🔔</div>
      </header>

      {/* Cards de Estatísticas */}
      <div className="dashboard-cards">
        {/* Card Vencimentos Próximos */}
        <div className="dashboard-card card-vencimentos">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <h3>Vencimentos Próximos</h3>
            <p className="card-subtitle">Próximos 7 dias</p>
            <p className="card-value">{stats.vencimentosProximos}</p>
          </div>
        </div>

        {/* Card Atrasados */}
        <div className="dashboard-card card-atrasados">
          <div className="card-icon">⚠️</div>
          <div className="card-content">
            <h3>Atrasados</h3>
            <p className="card-subtitle">{stats.atrasados.count} clientes</p>
            <p className="card-value">{formatarMoeda(stats.atrasados.valor)}</p>
          </div>
        </div>

        {/* Card Receita Prevista */}
        <div className="dashboard-card card-receita">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Receita Prevista</h3>
            <p className="card-subtitle">Este mês</p>
            <p className="card-value">{formatarMoeda(stats.receitaPrevista)}</p>
          </div>
        </div>
      </div>

      {/* Botão Novo Cliente */}
      <div className="dashboard-actions">
        <Link to="/clientes/novo" className="btn-novo-cliente">
          + NOVO CLIENTE
        </Link>
      </div>

      {/* Lista de Vencimentos Próximos */}
      <div className="dashboard-list">
        <h2>Próximos Vencimentos</h2>
        {vencimentosProximos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum vencimento próximo</p>
          </div>
        ) : (
          <div className="vencimentos-table">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vencimentosProximos.map((cobranca) => (
                  <tr key={cobranca.id}>
                    <td>{cobranca.cliente_nome || '-'}</td>
                    <td>{formatarMoeda(cobranca.valor_total_devido)}</td>
                    <td>{formatarData(cobranca.data_vencimento)}</td>
                    <td>
                      <span className={`status-badge status-${cobranca.status_cobranca?.toLowerCase()}`}>
                        {cobranca.status_cobranca}
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
  );
};

export default Dashboard;
