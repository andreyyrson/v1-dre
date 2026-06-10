import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const api = axios.create({ baseURL });

// Adiciona token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export async function login(username: string, password: string): Promise<{ access_token: string; user: { id: number; username: string; role: string; is_active: boolean } }> {
  const { data } = await api.post("/auth/login", { username, password });
  return data;
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function fetchUsers(): Promise<{ id: number; username: string; role: string; is_active: boolean }[]> {
  const { data } = await api.get("/users");
  return data;
}

export async function createUser(body: { username: string; password: string; role: string }) {
  const { data } = await api.post("/users", body);
  return data;
}

export async function deleteUser(userId: number) {
  await api.delete(`/users/${userId}`);
}

export async function resetPassword(userId: number, new_password: string) {
  await api.post(`/users/${userId}/reset-password`, { new_password });
}

export async function refreshContas(params: {
  id_empresa: number;
  data_inicial: string;
  data_final: string;
}) {
  const { data } = await api.post("/contas-pagar/refresh", null, { params });
  return data;
}

export async function fetchEmpresas(): Promise<Empresa[]> {
  const { data } = await api.get<Empresa[]>("/empresas");
  return data;
}

export async function fetchContasPagar(params: ContasPagarParams): Promise<ContasPagarResponse> {
  const { data } = await api.get<ContasPagarResponse>("/contas-pagar", { params });
  return data;
}

export interface ExportParams {
  id_empresa: number;
  data_inicial: string;
  data_final: string;
  apenas_abertas: boolean;
  sort_by: string;
  order: string;
  ids?: string[];
}

export async function downloadExcel(params: ExportParams): Promise<void> {
  const query: Record<string, string> = {
    id_empresa: String(params.id_empresa),
    data_inicial: params.data_inicial,
    data_final: params.data_final,
    apenas_abertas: String(params.apenas_abertas),
    sort_by: params.sort_by,
    order: params.order,
  };
  if (params.ids && params.ids.length > 0) {
    query.ids = params.ids.join(",");
  }
  const response = await api.get("/contas-pagar/export", {
    params: query,
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `contas_pagar_${params.id_empresa}_${params.data_inicial}_${params.data_final}.xlsx`,
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export interface Empresa {
  Id: number;
  Nome: string;
  Documento: string;
  Padrao: boolean;
}

export interface ContaPagar {
  id: string;
  descricao: string | null;
  observacao: string | null;
  valor: number;
  valor_bruto: number | null;
  valor_desconto: number | null;
  valor_acrescimo: number | null;
  debito: boolean;
  data_vencimento: string | null;
  data_competencia: string | null;
  data_quitacao: string | null;
  numero_parcela: number | null;
  quantidade_parcela: number | null;
  tipo_movimentacao: number | null;
  nome_tipo_movimentacao: string | null;
  id_categoria: number | null;
  categoria: string | null;
  id_conta_financeira: number | null;
  conta_financeira: string | null;
  id_empresa: number | null;
  nome_empresa: string | null;
  id_fornecedor: number | null;
  id_funcionario: number | null;
  fornecedor: string | null;
  documento_fornecedor: string | null;
}

export interface ResumoContas {
  total_contas: number;
  valor_total: number;
  valor_vencido: number;
  valor_a_vencer: number;
  valor_pago: number;
  quantidade_vencidas: number;
  quantidade_a_vencer: number;
  quantidade_pagas: number;
}

export interface Paginacao {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ContasPagarResponse {
  contas: ContaPagar[];
  resumo: ResumoContas;
  paginacao: Paginacao;
}

export interface ContasPagarParams {
  id_empresa: number;
  data_inicial: string;
  data_final: string;
  apenas_abertas: boolean;
  sort_by: string;
  order: string;
}
