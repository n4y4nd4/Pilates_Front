import React, { useState, useEffect } from 'react';
import { clientesService } from '../../services/clientesService';
import { Link } from 'react-router-dom';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientesService.listar();
      // Garantir que sempre seja um array
      const clientesArray = Array.isArray(data) ? data : (data.results || data.data || []);
      setClientes(clientesArray);
    } catch (err) {
      setError(err.message);
      setClientes([]); // Garantir que seja array mesmo em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) {
      try {
        await clientesService.deletar(id);
        carregarClientes();
      } catch (err) {
        alert(`Erro ao excluir cliente: ${err.message}`);
      }
    }
  };

  const formatarCPF = (cpf) => {
    if (!cpf) return '-';
    // Se já estiver formatado, retorna como está
    if (cpf.includes('.') || cpf.includes('-')) {
      return cpf;
    }
    // Se não estiver formatado, formata
    const apenasDigitos = cpf.replace(/\D/g, '');
    if (apenasDigitos.length === 11) {
      return apenasDigitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return '-';
    // Remove caracteres não numéricos
    const numeros = telefone.replace(/\D/g, '');
    // Formata baseado no tamanho
    if (numeros.length === 13) {
      // Formato: código país (2) + DDD (2) + número (9)
      return numeros.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
    } else if (numeros.length === 11) {
      // Formato: DDD (2) + número (9)
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ATIVO':
        return 'status-ativo';
      case 'INATIVO_ATRASO':
      case 'INATIVO_MANUAL':
        return 'status-inativo';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Carregando clientes...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Clientes</h2>
        <Link to="/clientes/novo" className="btn btn-primary">
          + Novo Cliente
        </Link>
      </div>

      {!Array.isArray(clientes) || clientes.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhum cliente cadastrado</h3>
          <p>Comece adicionando um novo cliente.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Plano</th>
                <th>Início Contrato</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(clientes) && clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{formatarCPF(cliente.cpf)}</td>
                  <td>{cliente.email}</td>
                  <td>{formatarTelefone(cliente.telefone_whatsapp)}</td>
                  <td>{cliente.plano_nome || '-'}</td>
                  <td>{formatarData(cliente.data_inicio_contrato)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(cliente.status_cliente)}`}>
                      {cliente.status_cliente}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link
                        to={`/clientes/${cliente.id}/editar`}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(cliente.id, cliente.nome)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientesList;

