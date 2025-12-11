import React, { useState, useEffect } from 'react';
import { notificacoesService } from '../../services/notificacoesService';
import { formatDateBR, formatDateTimeBR, toLocalDateFromApi } from '../../utils/date';

const NotificacoesList = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [notificacoesFiltradas, setNotificacoesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [filtroCanal, setFiltroCanal] = useState('TODOS');
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null);
  const [stats, setStats] = useState({ total24h: 0 });

  useEffect(() => {
    carregarNotificacoes();
  }, [filtroStatus]);

  useEffect(() => {
    aplicarFiltros();
  }, [notificacoes, filtroCanal]);

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      // Usar endpoints específicos do backend quando disponível
      if (filtroStatus === 'ENVIADO') {
        data = await notificacoesService.listarEnviadas();
      } else if (filtroStatus === 'AGENDADO') {
        data = await notificacoesService.listarAgendadas();
      } else if (filtroStatus === 'FALHA') {
        data = await notificacoesService.listarComFalha();
      } else if (filtroStatus === 'TODOS') {
        data = await notificacoesService.listar();
      } else {
        // Fallback: query param
        data = await notificacoesService.listarPorStatus(filtroStatus);
      }
      const notificacoesArray = Array.isArray(data) ? data : (data.results || data.data || []);
      setNotificacoes(notificacoesArray);

      // Calcular estatísticas (últimas 24h)
      const agora = new Date();
      const vinteQuatroHorasAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
      const total24h = notificacoesArray.filter(n => {
        if (!n.data_envio_real) return false;
        const dataEnvio = toLocalDateFromApi(n.data_envio_real);
        return dataEnvio && dataEnvio >= vinteQuatroHorasAtras && n.status_envio === 'ENVIADO';
      }).length;

      setStats({ total24h });
    } catch (err) {
      setError(err.message);
      setNotificacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...notificacoes];

    // Filtro por status já aplicado pelo backend quando possível

    // Filtro por canal
    if (filtroCanal !== 'TODOS') {
      filtradas = filtradas.filter(n => n.tipo_canal === filtroCanal);
    }

    setNotificacoesFiltradas(filtradas);
  };

  const formatarDataHora = (data) => {
    return formatDateTimeBR(data);
  };

  const formatarMoeda = (valor) => {
    const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : (valor || 0);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valorNumerico);
  };

  const formatarData = (data) => {
    return formatDateBR(data);
  };

  const getTipoReguaLabel = (tipo) => {
    const labels = {
      'D-3': '3 dias antes',
      'D+1': '1 dia após',
      'D+10': '10 dias após',
    };
    return labels[tipo] || tipo;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ENVIADO':
        return 'status-enviado';
      case 'FALHA':
        return 'status-falha';
      case 'AGENDADO':
        return 'status-agendado';
      default:
        return '';
    }
  };

  const abrirModal = (notificacao) => {
    setNotificacaoSelecionada(notificacao);
  };

  const fecharModal = () => {
    setNotificacaoSelecionada(null);
  };

  if (loading) {
    return <div className="loading">Carregando notificações...</div>;
  }

  return (
    <div className="notificacoes-page">
      <div className="page-header">
        <h2>Histórico de Disparos</h2>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Card de Resumo */}
      <div className="notificacoes-resumo">
        <div className="resumo-card">
          <h3>Mensagens Enviadas</h3>
          <p className="resumo-subtitle">Últimas 24 horas</p>
          <p className="resumo-value">{stats.total24h}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="notificacoes-filters">
        <div className="filter-group">
          <label>Status de Envio:</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="filter-select"
          >
            <option value="TODOS">Todos</option>
            <option value="ENVIADO">Enviado</option>
            <option value="FALHA">Falha</option>
            <option value="AGENDADO">Agendado</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Canal:</label>
          <select
            value={filtroCanal}
            onChange={(e) => setFiltroCanal(e.target.value)}
            className="filter-select"
          >
            <option value="TODOS">Todos</option>
            <option value="EMAIL">E-mail</option>
            <option value="WHATSAPP">WhatsApp</option>
          </select>
        </div>
      </div>

      {/* Lista de Notificações */}
      {notificacoesFiltradas.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhuma notificação encontrada</h3>
          <p>Não há notificações que correspondam aos filtros selecionados.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="notificacoes-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Data/Hora</th>
                <th>Tipo da Régua</th>
                <th>Canal</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {notificacoesFiltradas.map((notificacao) => (
                <tr key={notificacao.id}>
                  <td>{notificacao.cliente_nome || notificacao.cobranca_cliente_nome || '-'}</td>
                  <td>{formatarDataHora(notificacao.data_envio_real || notificacao.data_agendada)}</td>
                  <td>{getTipoReguaLabel(notificacao.tipo_regua)}</td>
                  <td>{notificacao.tipo_canal}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(notificacao.status_envio)}`}>
                      {notificacao.status_envio}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => abrirModal(notificacao)}
                      className="btn-ver-detalhes"
                    >
                      Ver Mensagem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalhes */}
      {notificacaoSelecionada && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Conteúdo da Mensagem</h3>
              <button className="modal-close" onClick={fecharModal}>×</button>
            </div>
            <div className="modal-body">
                <div className="modal-info">
                <p><strong>Cliente:</strong> {notificacaoSelecionada.cliente_nome || notificacaoSelecionada.cobranca_cliente_nome || '-'}</p>
                <p><strong>Email:</strong> {notificacaoSelecionada.cliente_email || '-'}</p>
                <p><strong>Referência:</strong> {notificacaoSelecionada.cobranca_referencia || '-'}</p>
                <p><strong>Valor:</strong> {notificacaoSelecionada.cobranca_valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(typeof notificacaoSelecionada.cobranca_valor === 'string' ? parseFloat(notificacaoSelecionada.cobranca_valor) : (notificacaoSelecionada.cobranca_valor || 0)) : '-'}</p>
                <p><strong>Vencimento:</strong> {formatDateBR(notificacaoSelecionada.cobranca_data_vencimento)}</p>
                <p><strong>Dias em atraso:</strong> {notificacaoSelecionada.dias_em_atraso ?? 0}</p>
                <p><strong>Data/Hora:</strong> {formatarDataHora(notificacaoSelecionada.data_envio_real || notificacaoSelecionada.data_agendada)}</p>
                <p><strong>Tipo da Régua:</strong> {getTipoReguaLabel(notificacaoSelecionada.tipo_regua)}</p>
                <p><strong>Canal:</strong> {notificacaoSelecionada.tipo_canal}</p>
                <p><strong>Status:</strong> {notificacaoSelecionada.status_envio}</p>
              </div>
              <div className="modal-mensagem">
                <h4>Mensagem:</h4>
                <div className="mensagem-conteudo">
                  {notificacaoSelecionada.conteudo_mensagem || 'Nenhum conteúdo disponível'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacoesList;

