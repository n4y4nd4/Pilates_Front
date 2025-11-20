import React, { useState, useEffect } from 'react';
import { cobrancasService } from '../../services/cobrancasService';

const CobrancasList = () => {
  const [cobrancas, setCobrancas] = useState([]);
  const [cobrancasFiltradas, setCobrancasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [marcandoPago, setMarcandoPago] = useState(null);
  const [revertendoPagamento, setRevertendoPagamento] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('TODAS');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarCobrancas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [cobrancas, filtroStatus, busca]);

  const carregarCobrancas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cobrancasService.listar();
      const cobrancasArray = Array.isArray(data) ? data : (data.results || data.data || []);
      setCobrancas(cobrancasArray);
    } catch (err) {
      setError(err.message);
      setCobrancas([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...cobrancas];

    // Filtro por status
    if (filtroStatus !== 'TODAS') {
      filtradas = filtradas.filter(c => c.status_cobranca === filtroStatus);
    }

    // Filtro por busca (nome ou CPF)
    if (busca.trim()) {
      const buscaLower = busca.toLowerCase();
      filtradas = filtradas.filter(c => {
        const nome = (c.cliente_nome || '').toLowerCase();
        const cpf = (c.cliente_cpf || '').toLowerCase();
        return nome.includes(buscaLower) || cpf.includes(buscaLower);
      });
    }

    setCobrancasFiltradas(filtradas);
  };

  const handleMarcarComoPago = async (id) => {
    try {
      setMarcandoPago(id);
      setError(null);
      setSuccess(null);
      await cobrancasService.marcarComoPago(id);
      setSuccess('Cobrança marcada como paga com sucesso!');
      carregarCobrancas();
    } catch (err) {
      setError(`Erro ao marcar como pago: ${err.message}`);
    } finally {
      setMarcandoPago(null);
    }
  };

  const handleReverterPagamento = async (id) => {
    if (window.confirm('Deseja reverter o pagamento desta cobrança?')) {
      try {
        setRevertendoPagamento(id);
        setError(null);
        setSuccess(null);
        await cobrancasService.reverterPagamento(id);
        setSuccess('Pagamento revertido com sucesso!');
        carregarCobrancas();
      } catch (err) {
        setError(`Erro ao reverter pagamento: ${err.message}`);
      } finally {
        setRevertendoPagamento(null);
      }
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'PAGO':
        return 'status-pago';
      case 'PENDENTE':
        return 'status-pendente';
      case 'ATRASADO':
        return 'status-atrasado';
      case 'CANCELADO':
        return 'status-cancelado';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PAGO: 'Pago',
      PENDENTE: 'Pendente',
      ATRASADO: 'Atrasado',
      CANCELADO: 'Cancelado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div className="loading">Carregando cobranças...</div>;
  }

  return (
    <div className="cobrancas-page">
      <div className="page-header">
        <h2>Listagem de Cobranças</h2>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Filtros e Busca */}
      <div className="cobrancas-filters">
        <div className="filters-status">
          <button
            className={`filter-btn ${filtroStatus === 'TODAS' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('TODAS')}
          >
            Todas
          </button>
          <button
            className={`filter-btn ${filtroStatus === 'PENDENTE' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('PENDENTE')}
          >
            Pendentes
          </button>
          <button
            className={`filter-btn ${filtroStatus === 'ATRASADO' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('ATRASADO')}
          >
            Atrasados
          </button>
          <button
            className={`filter-btn ${filtroStatus === 'PAGO' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('PAGO')}
          >
            Pagas
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por Nome ou CPF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabela de Cobranças */}
      {cobrancasFiltradas.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhuma cobrança encontrada</h3>
          <p>
            {filtroStatus === 'TODAS' && !busca
              ? 'Não há cobranças cadastradas.'
              : `Não há cobranças que correspondam aos filtros selecionados.`}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="cobrancas-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {cobrancasFiltradas.map((cobranca) => {
                const isAtrasado = cobranca.status_cobranca === 'ATRASADO';
                return (
                  <tr key={cobranca.id} className={isAtrasado ? 'row-atrasado' : ''}>
                    <td>{cobranca.cliente_nome || '-'}</td>
                    <td>{formatarMoeda(cobranca.valor_total_devido)}</td>
                    <td>{formatarData(cobranca.data_vencimento)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(cobranca.status_cobranca)}`}>
                        {getStatusLabel(cobranca.status_cobranca)}
                      </span>
                    </td>
                    <td>
                      {(cobranca.status_cobranca === 'PENDENTE' || cobranca.status_cobranca === 'ATRASADO') ? (
                        <button
                          onClick={() => handleMarcarComoPago(cobranca.id)}
                          className="btn-check"
                          disabled={marcandoPago === cobranca.id}
                          title="Marcar como pago"
                        >
                          {marcandoPago === cobranca.id ? '⏳' : '✅'}
                        </button>
                      ) : cobranca.status_cobranca === 'PAGO' ? (
                        <button
                          onClick={() => handleReverterPagamento(cobranca.id)}
                          className="btn-reverter"
                          disabled={revertendoPagamento === cobranca.id}
                          title="Reverter pagamento"
                        >
                          {revertendoPagamento === cobranca.id ? '⏳' : '↩️'}
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CobrancasList;
