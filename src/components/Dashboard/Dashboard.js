import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cobrancasService } from '../../services/cobrancasService';
import { formatDateBR, toLocalDateFromApi } from '../../utils/date';


const Dashboard = () => {
  const [cobrancas, setCobrancas] = useState([]);
  const [cobrancasAtrasadas, setCobrancasAtrasadas] = useState([]);
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
      // Usar endpoints novos do backend quando disponíveis
      const proximos = await cobrancasService.listarProximosVencimentos();
      const pagamentosAtrasados = await cobrancasService.listarPagamentosAtrasados();

      // Carregar lista de vencimentos próximos para exibir na tabela
      setCobrancas(proximos);
      setCobrancasAtrasadas(pagamentosAtrasados);

      // Calcular receita prevista a partir dos próximos vencimentos
      const receitaPrevista = (proximos || []).reduce((sum, c) => {
        const valor = typeof c.valor_total_devido === 'string' ? parseFloat(c.valor_total_devido) : (c.valor_total_devido || 0);
        return sum + valor;
      }, 0);

      setStats({
        vencimentosProximos: (proximos || []).length,
        atrasados: {
          count: (pagamentosAtrasados || []).length,
          valor: (pagamentosAtrasados || []).reduce((sum, c) => {
            const valor = typeof c.valor_total_devido === 'string' ? parseFloat(c.valor_total_devido) : (c.valor_total_devido || 0);
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
    return formatDateBR(data);
  };

  // Top 5 vencimentos mais próximos
  const vencimentosProximos = (cobrancas || [])
    .sort((a, b) => {
      const da = toLocalDateFromApi(a.data_vencimento) || new Date(0);
      const db = toLocalDateFromApi(b.data_vencimento) || new Date(0);
      return da - db;
    })
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

      {/* Espaçamento entre seções */}
      <div style={{ marginTop: '30px' }}></div>

      {/* Lista de Pagamentos Atrasados */}
      <div className="dashboard-list">
        <h2>Pagamentos Atrasados</h2>
        {cobrancasAtrasadas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum pagamento atrasado</p>
          </div>
        ) : (
          <div className="atrasados-table">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Dias em Atraso</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cobrancasAtrasadas.map((cobranca) => {
                  const vencimento = toLocalDateFromApi(cobranca.data_vencimento);
                  const hoje = new Date();
                  hoje.setHours(0, 0, 0, 0);
                  const diasAtraso = vencimento ? Math.floor((hoje - vencimento) / (1000 * 60 * 60 * 24)) : 0;
                  return (
                    <tr key={cobranca.id} className="row-atrasado">
                      <td>{cobranca.cliente_nome || '-'}</td>
                      <td>{formatarMoeda(cobranca.valor_total_devido)}</td>
                      <td>{formatarData(cobranca.data_vencimento)}</td>
                      <td><strong>{diasAtraso} dias</strong></td>
                      <td>
                        <span className={`status-badge status-${cobranca.status_cobranca?.toLowerCase()}`}>
                          {cobranca.status_cobranca}
                        </span>
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
  );
};

export default Dashboard;
