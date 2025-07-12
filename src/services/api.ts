import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Servicios de pedidos
export const pedidosService = {
  getAll: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  create: async (pedido: any) => {
    const response = await api.post('/pedidos', pedido);
    return response.data;
  },

  updateEstado: async (id: number, estado: string) => {
    const response = await api.put(`/pedidos/${id}/estado`, { estado });
    return response.data;
  }
};

// Servicios de clientes
export const clientesService = {
  getAll: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  create: async (cliente: any) => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  }
};

// Servicios de fichas técnicas
export const fichasService = {
  getAll: async () => {
    const response = await api.get('/fichas');
    return response.data;
  },

  create: async (ficha: any) => {
    const response = await api.post('/fichas', ficha);
    return response.data;
  },

  updateAvance: async (id: number, area: string, data: any) => {
    const response = await api.put(`/fichas/${id}/avance/${area}`, data);
    return response.data;
  },

  registrarInspeccionCalidad: async (id: number, data: any) => {
    const response = await api.post(`/fichas/${id}/inspeccion-calidad`, data);
    return response.data;
  }
};

export default api;