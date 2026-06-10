import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dashboard-laura.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string) {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
}

export async function fetchEmpresas() {
  const response = await api.get('/empresas');
  return response.data;
}

export async function fetchContasPagar(params: {
  id_empresa: number;
  data_inicial: string;
  data_final: string;
  apenas_abertas: boolean;
  sort_by: string;
  order: string;
}) {
  const response = await api.get('/contas-pagar', { params });
  return response.data;
}

export async function refreshContas(params: {
  id_empresa: number;
  data_inicial: string;
  data_final: string;
}) {
  const response = await api.post('/contas-pagar/refresh', null, { params });
  return response.data;
}

export async function downloadExcel(params: {
  id_empresa: number;
  data_inicial: string;
  data_final: string;
  apenas_abertas: boolean;
  sort_by: string;
  order: string;
  ids?: string[];
}) {
  const queryParams = new URLSearchParams();
  queryParams.append('id_empresa', String(params.id_empresa));
  queryParams.append('data_inicial', params.data_inicial);
  queryParams.append('data_final', params.data_final);
  queryParams.append('apenas_abertas', String(params.apenas_abertas));
  queryParams.append('sort_by', params.sort_by);
  queryParams.append('order', params.order);
  if (params.ids && params.ids.length > 0) {
    queryParams.append('ids', params.ids.join(','));
  }

  const token = localStorage.getItem('token');
  const url = `${API_BASE_URL}/contas-pagar/export?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Erro ao exportar Excel');
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('content-disposition');
  const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
  const filename = filenameMatch ? filenameMatch[1] : 'contas_pagar.xlsx';

  // Create download link
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

export default api;
