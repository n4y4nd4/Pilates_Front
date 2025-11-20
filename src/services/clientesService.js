import api from './api';

// Função auxiliar para extrair resultados da resposta paginada do Django REST Framework
const extrairResultados = (data) => {
  // Se for uma resposta paginada (tem propriedade 'results')
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results;
  }
  // Se já for um array, retorna direto
  if (Array.isArray(data)) {
    return data;
  }
  // Caso contrário, retorna array vazio
  return [];
};

export const clientesService = {
  // Listar todos os clientes
  listar: async () => {
    const response = await api.get('/clientes/');
    return extrairResultados(response.data);
  },

  // Buscar cliente por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/clientes/${id}/`);
    return response.data;
  },

  // Criar novo cliente
  criar: async (dadosCliente) => {
    const response = await api.post('/clientes/', dadosCliente);
    return response.data;
  },

  // Atualizar cliente
  atualizar: async (id, dadosCliente) => {
    const response = await api.patch(`/clientes/${id}/`, dadosCliente);
    return response.data;
  },

  // Deletar cliente
  deletar: async (id) => {
    await api.delete(`/clientes/${id}/`);
  },
};


