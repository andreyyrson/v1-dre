import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Layout from '../components/Layout';
import KpiCards from '../components/KpiCards';
import { fetchEmpresas, fetchContasPagar, refreshContas } from '../lib/api';

interface Empresa {
  Id: number;
  Nome: string;
  Documento: string;
}

interface Conta {
  IdMovimentacaoFinanceiraParcela: string;
  Nome: string;
  DataVencimento: string;
  DataQuitacao: string | null;
  Valor: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [kpis, setKpis] = useState({ totalPago: 0, vencidas: 0, agendadas: 0 });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchEmpresas().then(setEmpresas).catch(console.error);
  }, [navigate]);

  function calcularKpis(contas: Conta[]) {
    const hoje = new Date();
    const totalPago = contas
      .filter((c) => c.DataQuitacao)
      .reduce((sum, c) => sum + c.Valor, 0);
    const vencidas = contas
      .filter((c) => !c.DataQuitacao && new Date(c.DataVencimento) < hoje)
      .reduce((sum, c) => sum + c.Valor, 0);
    const agendadas = contas
      .filter((c) => !c.DataQuitacao && new Date(c.DataVencimento) >= hoje)
      .reduce((sum, c) => sum + c.Valor, 0);
    setKpis({ totalPago, vencidas, agendadas });
  }

  async function handleBuscar() {
    if (!empresaId || !dataInicial || !dataFinal) return;
    setLoading(true);
    try {
      const response = await fetchContasPagar({
        id_empresa: Number(empresaId),
        data_inicial: dataInicial,
        data_final: dataFinal,
        apenas_abertas: false,
        sort_by: 'DataVencimento',
        order: 'asc',
      });
      const itens = response.Itens || [];
      setContas(itens);
      calcularKpis(itens);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    if (!empresaId || !dataInicial || !dataFinal) return;
    setRefreshing(true);
    try {
      await refreshContas({
        id_empresa: Number(empresaId),
        data_inicial: dataInicial,
        data_final: dataFinal,
      });
      await handleBuscar();
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Empresa</label>
            <select
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecione...</option>
              {empresas.map((e) => (
                <option key={e.Id} value={e.Id}>
                  {e.Nome} ({e.Documento})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Inicial</label>
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Final</label>
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing || !empresaId}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        <KpiCards data={kpis} />

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contas.map((conta) => {
                const isPago = !!conta.DataQuitacao;
                const isVencida = !isPago && new Date(conta.DataVencimento) < new Date();
                return (
                  <tr key={conta.IdMovimentacaoFinanceiraParcela}>
                    <td className="px-6 py-4 text-sm text-gray-900">{conta.Nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(conta.DataVencimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isPago ? (
                        <span className="text-green-600 font-medium">Pago</span>
                      ) : isVencida ? (
                        <span className="text-red-600 font-medium">Vencida</span>
                      ) : (
                        <span className="text-blue-600 font-medium">Em aberto</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {formatCurrency(conta.Valor)}
                    </td>
                  </tr>
                );
              })}
              {contas.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma conta encontrada. Selecione uma empresa e período para buscar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
