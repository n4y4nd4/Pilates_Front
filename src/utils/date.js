// Utilitários de data para evitar off-by-one com strings "YYYY-MM-DD"
export function toLocalDateFromApi(apiDate) {
  if (!apiDate) return null;
  // Se vier com hora (ISO), new Date preserva corretamente
  if (apiDate.includes('T')) {
    const d = new Date(apiDate);
    return isNaN(d.getTime()) ? null : d;
  }
  // String no formato YYYY-MM-DD -> interpretar como data local (avoida parse como UTC)
  const parts = apiDate.split('-');
  if (parts.length < 3) return null;
  const [y, m, d] = parts;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return isNaN(date.getTime()) ? null : date;
}

export function formatDateBR(apiDate) {
  const d = toLocalDateFromApi(apiDate);
  if (!d) return '-';
  return d.toLocaleDateString('pt-BR');
}

export function formatDateTimeBR(apiDate) {
  const d = toLocalDateFromApi(apiDate);
  if (!d) return '-';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
