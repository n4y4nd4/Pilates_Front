import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de requisições (debug)
api.interceptors.request.use(
  (config) => {
    if (config.method === 'patch' || config.method === 'post' || config.method === 'put') {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro com resposta do servidor
      const status = error.response.status;
      const data = error.response.data;
      
      // Erro de validação (400) - retorna objeto com erros por campo
      if (status === 400 && data && typeof data === 'object') {
        // Verifica se é um objeto de validação (tem propriedades que são arrays)
        const isValidationError = Object.keys(data).some(key => Array.isArray(data[key]));
        if (isValidationError) {
          // Retorna o objeto de erros completo para tratamento específico
          const validationError = new Error('Erro de validação');
          validationError.validationErrors = data;
          validationError.status = 400;
          // Adiciona mensagem geral se disponível
          if (data.detail || data.message) {
            validationError.message = data.detail || data.message;
          }
          return Promise.reject(validationError);
        }
      }
      
      // Prioriza mensagens mais específicas do backend
      let message = data?.detail || 
                   data?.message || 
                   data?.error ||
                   (typeof data === 'string' ? data : null) ||
                   'Erro ao processar requisição';
      
      // Se for um objeto com mensagens não estruturadas, tenta extrair
      if (!message && typeof data === 'object' && !Array.isArray(data)) {
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey]) && data[firstKey].length > 0) {
          message = data[firstKey][0];
        }
      }
      
      // Mensagens mais específicas por status
      if (status === 404) {
        message = `Endpoint não encontrado (${error.config?.url}). Verifique se a URL está correta.`;
      } else if (status === 500) {
        message = 'Erro interno do servidor. Verifique os logs do backend.';
      } else if (status === 403) {
        message = 'Acesso negado. Verifique as permissões.';
      } else if (status === 401) {
        message = 'Não autorizado. Verifique a autenticação.';
      }
      
      console.error('Erro na API:', {
        status,
        url: error.config?.url,
        data: data,
        message
      });
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Erro de rede
      console.error('Erro de rede:', error.request);
      return Promise.reject(new Error('Erro de conexão. Verifique se o servidor Django está rodando em http://localhost:8000'));
    } else {
      // Outro erro
      console.error('Erro:', error);
      return Promise.reject(error);
    }
  }
);

export default api;

