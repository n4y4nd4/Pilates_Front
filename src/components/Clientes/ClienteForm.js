import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientesService } from '../../services/clientesService';
import { planosService } from '../../services/planosService';

const ClienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    plano: '',
    nome: '',
    cpf: '',
    telefone_whatsapp: '',
    email: '',
    data_inicio_contrato: '',
    status_cliente: 'ATIVO',
  });

  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorPlanos, setErrorPlanos] = useState(null);
  const [loadingPlanos, setLoadingPlanos] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    carregarPlanos();
    if (isEdit) {
      carregarCliente();
    }
  }, [id]);

  const carregarPlanos = async () => {
    try {
      setErrorPlanos(null);
      const data = await planosService.listar();
      // O serviço já retorna um array (extrai results se necessário)
      setPlanos(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorPlanos(`Erro ao carregar planos: ${err.message}`);
      setPlanos([]); // Garantir que seja array mesmo em caso de erro
      console.error('Erro ao carregar planos:', err);
    } finally {
      setLoadingPlanos(false);
    }
  };

  const carregarCliente = async () => {
    try {
      setLoading(true);
      const cliente = await clientesService.buscarPorId(id);
      setFormData({
        plano: cliente.plano,
        nome: cliente.nome,
        cpf: cliente.cpf,
        telefone_whatsapp: cliente.telefone_whatsapp,
        email: cliente.email,
        data_inicio_contrato: cliente.data_inicio_contrato,
        status_cliente: cliente.status_cliente,
      });
    } catch (err) {
      setError(`Erro ao carregar cliente: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatarCPF = (valor) => {
    // Remove tudo que não é dígito
    const apenasDigitos = valor.replace(/\D/g, '');
    // Aplica a máscara: 000.000.000-00
    if (apenasDigitos.length <= 3) {
      return apenasDigitos;
    } else if (apenasDigitos.length <= 6) {
      return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3)}`;
    } else if (apenasDigitos.length <= 9) {
      return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6)}`;
    } else {
      return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6, 9)}-${apenasDigitos.slice(9, 11)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatar CPF automaticamente
    let valorFormatado = value;
    if (name === 'cpf') {
      valorFormatado = formatarCPF(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: valorFormatado,
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({}); // Limpar erros anteriores

    try {
      // Garantir que todos os campos estão presentes e com valores corretos
      const dadosParaEnvio = {
        plano: formData.plano ? parseInt(formData.plano) : formData.plano,
        nome: formData.nome,
        cpf: formData.cpf,
        telefone_whatsapp: formData.telefone_whatsapp,
        email: formData.email,
        data_inicio_contrato: formData.data_inicio_contrato,
        status_cliente: formData.status_cliente,
      };

      console.log('Dados sendo enviados:', dadosParaEnvio);

      if (isEdit) {
        const response = await clientesService.atualizar(id, dadosParaEnvio);
        console.log('Resposta da atualização:', response);
        
        // Verificar se o status foi atualizado na resposta
        if (response && response.status_cliente) {
          console.log('Status atualizado para:', response.status_cliente);
        }
        
        alert('Cliente atualizado com sucesso!');
      } else {
        await clientesService.criar(dadosParaEnvio);
        alert('Cliente criado com sucesso!');
      }
      navigate('/clientes');
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      // Verificar se é erro de validação
      if (err.validationErrors) {
        // Extrair erros por campo
        const errors = {};
        Object.keys(err.validationErrors).forEach((field) => {
          if (Array.isArray(err.validationErrors[field]) && err.validationErrors[field].length > 0) {
            errors[field] = err.validationErrors[field][0]; // Pega a primeira mensagem de erro
          }
        });
        setFieldErrors(errors);
        setError('Por favor, corrija os erros no formulário.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingPlanos) {
    return <div className="loading">Carregando planos...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>{isEdit ? 'Editar Cliente' : 'Novo Cadastro'}</h2>
        <button
          onClick={() => navigate('/clientes')}
          className="btn btn-secondary"
        >
          Voltar
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {errorPlanos && <div className="error">{errorPlanos}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="plano">Plano *</label>
            <select
              id="plano"
              name="plano"
              value={formData.plano}
              onChange={handleChange}
              required
              disabled={loadingPlanos || (Array.isArray(planos) && planos.length === 0 && !errorPlanos)}
              className={fieldErrors.plano ? 'error' : ''}
            >
              <option value="">
                {loadingPlanos 
                  ? 'Carregando planos...' 
                  : (Array.isArray(planos) && planos.length === 0 && !errorPlanos)
                    ? 'Nenhum plano disponível'
                    : 'Selecione um plano'}
              </option>
              {Array.isArray(planos) && planos.map((plano) => {
                // Converter valor_base para número (pode vir como string da API)
                const valor = typeof plano.valor_base === 'string' 
                  ? parseFloat(plano.valor_base) 
                  : (plano.valor_base || 0);
                return (
                  <option key={plano.id} value={plano.id}>
                    {plano.nome_plano} - R$ {valor.toFixed(2)}/mês
                  </option>
                );
              })}
            </select>
            {fieldErrors.plano && (
              <span className="field-error">{fieldErrors.plano}</span>
            )}
            {errorPlanos && (
              <small style={{ color: '#ef4444', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }}>
                Verifique se o backend está rodando e se o endpoint /api/planos/ está acessível.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nome">Nome Completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Ex: João Silva"
              className={fieldErrors.nome ? 'error' : ''}
            />
            {fieldErrors.nome && (
              <span className="field-error">{fieldErrors.nome}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF *</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              placeholder="000.000.000-00"
              maxLength="14"
              className={fieldErrors.cpf ? 'error' : ''}
            />
            {fieldErrors.cpf && (
              <span className="field-error">{fieldErrors.cpf}</span>
            )}
            {!fieldErrors.cpf && (
              <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Formato: 000.000.000-00 (aceita até 14 caracteres)
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefone_whatsapp">Telefone WhatsApp *</label>
            <input
              type="text"
              id="telefone_whatsapp"
              name="telefone_whatsapp"
              value={formData.telefone_whatsapp}
              onChange={handleChange}
              required
              placeholder="5521999999999"
              className={fieldErrors.telefone_whatsapp ? 'error' : ''}
            />
            {fieldErrors.telefone_whatsapp && (
              <span className="field-error">{fieldErrors.telefone_whatsapp}</span>
            )}
            {!fieldErrors.telefone_whatsapp && (
              <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Formato: código do país + DDD + número (ex: 5521999999999)
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="joao@example.com"
              className={fieldErrors.email ? 'error' : ''}
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="data_inicio_contrato">Data de Início do Contrato *</label>
            <input
              type="date"
              id="data_inicio_contrato"
              name="data_inicio_contrato"
              value={formData.data_inicio_contrato}
              onChange={handleChange}
              required
              className={fieldErrors.data_inicio_contrato ? 'error' : ''}
            />
            {fieldErrors.data_inicio_contrato && (
              <span className="field-error">{fieldErrors.data_inicio_contrato}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status_cliente">Status *</label>
            <select
              id="status_cliente"
              name="status_cliente"
              value={formData.status_cliente}
              onChange={handleChange}
              required
              className={fieldErrors.status_cliente ? 'error' : ''}
            >
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO_ATRASO">Inativo por Atraso</option>
              <option value="INATIVO_MANUAL">Inativo Manual</option>
            </select>
            {fieldErrors.status_cliente && (
              <span className="field-error">{fieldErrors.status_cliente}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-salvar-cobranca"
              disabled={loading}
            >
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'SALVAR E GERAR 1ª COBRANÇA'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/clientes')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteForm;

