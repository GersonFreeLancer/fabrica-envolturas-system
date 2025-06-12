export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const getEstadoColor = (estado: string): string => {
  const colors = {
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'creada': 'bg-blue-100 text-blue-800',
    'en_extrusion': 'bg-purple-100 text-purple-800',
    'en_corte': 'bg-orange-100 text-orange-800',
    'en_laminado': 'bg-pink-100 text-pink-800',
    'en_sellado': 'bg-indigo-100 text-indigo-800',
    'en_impresion': 'bg-teal-100 text-teal-800',
    'control_calidad': 'bg-amber-100 text-amber-800',
    'completada': 'bg-green-100 text-green-800',
    'en_proceso': 'bg-blue-100 text-blue-800',
    'completado': 'bg-green-100 text-green-800'
  };
  return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const getEstadoLabel = (estado: string): string => {
  const labels = {
    'pendiente': 'Pendiente',
    'creada': 'Creada',
    'en_extrusion': 'En Extrusión',
    'en_corte': 'En Corte',
    'en_laminado': 'En Laminado',
    'en_sellado': 'En Sellado',
    'en_impresion': 'En Impresión',
    'control_calidad': 'Control de Calidad',
    'completada': 'Completada',
    'en_proceso': 'En Proceso',
    'completado': 'Completado'
  };
  return labels[estado as keyof typeof labels] || estado;
};