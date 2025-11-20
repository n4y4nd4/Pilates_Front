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

export const planosService = {
  // Listar todos os planos ativos
  listar: async () => {
    const response = await api.get('/planos/');
    return extrairResultados(response.data);
  },
};


