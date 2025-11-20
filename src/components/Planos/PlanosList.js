import React, { useState, useEffect } from 'react';
import { planosService } from '../../services/planosService';

const PlanosList = () => {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarPlanos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await planosService.listar();
      // Garantir que sempre seja um array
      const planosArray = Array.isArray(data) ? data : (data.results || data.data || []);
      setPlanos(planosArray);
    } catch (err) {
      setError(err.message);
      setPlanos([]); // Garantir que seja array mesmo em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    // Converter para número se for string (a API pode retornar como string)
    const valorNumerico = typeof valor === 'string' 
      ? parseFloat(valor) 
      : (valor || 0);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valorNumerico);
  };

  const getPeriodicidadeLabel = (meses) => {
    const labels = {
      1: 'Mensal',
      3: 'Trimestral',
      6: 'Semestral',
      12: 'Anual',
    };
    return labels[meses] || `${meses} meses`;
  };

  if (loading) {
    return <div className="loading">Carregando planos...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Planos Disponíveis</h2>
      </div>

      {!Array.isArray(planos) || planos.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhum plano cadastrado</h3>
          <p>Não há planos ativos no sistema.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {Array.isArray(planos) && planos.map((plano) => (
            <div key={plano.id} className="card">
              <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>{plano.nome_plano}</h3>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' }}>
                  {formatarMoeda(plano.valor_base)}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {getPeriodicidadeLabel(plano.periodicidade_meses)}
                </div>
              </div>
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <span
                  className={`status-badge ${plano.ativo ? 'status-ativo' : 'status-inativo'}`}
                >
                  {plano.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanosList;

