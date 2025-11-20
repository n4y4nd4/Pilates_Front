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

export const cobrancasService = {
  // Listar todas as cobranças
  listar: async () => {
    const response = await api.get('/cobrancas/');
    return extrairResultados(response.data);
  },

  // Buscar cobrança por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/cobrancas/${id}/`);
    return response.data;
  },

  // Marcar cobrança como paga
  marcarComoPago: async (id) => {
    const response = await api.patch(`/cobrancas/${id}/marcar_pago/`);
    return response.data;
  },

  // Reverter pagamento (voltar para pendente)
  reverterPagamento: async (id) => {
    const response = await api.patch(`/cobrancas/${id}/`, {
      status_cobranca: 'PENDENTE',
      data_pagamento: null,
    });
    return response.data;
  },
};


