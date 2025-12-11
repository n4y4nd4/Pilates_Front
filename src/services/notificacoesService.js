import api from './api';

// Função auxiliar para extrair resultados da resposta paginada do Django REST Framework
const extrairResultados = (data) => {
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results;
  }
  if (Array.isArray(data)) {
    return data;
  }
  return [];
};

export const notificacoesService = {
  // Listar todas as notificações
  listar: async () => {
    const response = await api.get('/notificacoes/');
    return extrairResultados(response.data);
  },
  
  // Listar notificações enviadas
  listarEnviadas: async () => {
    const response = await api.get('/notificacoes/enviadas/');
    return extrairResultados(response.data);
  },

  // Listar notificações agendadas
  listarAgendadas: async () => {
    const response = await api.get('/notificacoes/agendadas/');
    return extrairResultados(response.data);
  },

  // Listar notificações com falha
  listarComFalha: async () => {
    const response = await api.get('/notificacoes/com_falha/');
    return extrairResultados(response.data);
  },

  // Listar por status via query param (fallback)
  listarPorStatus: async (status) => {
    const response = await api.get(`/notificacoes/?status=${status}`);
    return extrairResultados(response.data);
  },

  // Buscar notificação por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/notificacoes/${id}/`);
    return response.data;
  },
};

