import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Grid,
  useToast,
  Spinner,
  Checkbox,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import KpiCards from '../components/KpiCards';
import { fetchEmpresas, fetchContasPagar, refreshContas, downloadCsv } from '../lib/api';

interface Empresa {
  Id: number;
  Nome: string;
  Documento: string;
}

interface Conta {
  id: string;
  descricao: string | null;
  data_vencimento: string | null;
  data_quitacao: string | null;
  valor: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [kpis, setKpis] = useState({ totalPago: 0, vencidas: 0, agendadas: 0 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [apenasAbertas, setApenasAbertas] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchEmpresas()
      .then((data) => {
        console.log('Empresas recebidas:', data);
        setEmpresas(data);
      })
      .catch((err) => {
        console.error('Erro ao buscar empresas:', err);
        toast({
          title: 'Erro ao carregar empresas',
          description: 'Tente novamente',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, [navigate, toast]);

  function calcularKpis(contas: Conta[]) {
    const hoje = new Date();
    const totalPago = contas
      .filter((c) => c.data_quitacao)
      .reduce((sum, c) => sum + c.valor, 0);
    const vencidas = contas
      .filter((c) => !c.data_quitacao && c.data_vencimento && new Date(c.data_vencimento) < hoje)
      .reduce((sum, c) => sum + c.valor, 0);
    const agendadas = contas
      .filter((c) => !c.data_quitacao && c.data_vencimento && new Date(c.data_vencimento) >= hoje)
      .reduce((sum, c) => sum + c.valor, 0);
    setKpis({ totalPago, vencidas, agendadas });
  }

  async function handleBuscar() {
    if (!empresaId || !dataInicial || !dataFinal) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Selecione empresa e período',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    setSelectedIds(new Set());
    try {
      const response = await fetchContasPagar({
        id_empresa: Number(empresaId),
        data_inicial: dataInicial,
        data_final: dataFinal,
        apenas_abertas: apenasAbertas,
        sort_by: 'data_vencimento',
        order: 'asc',
      });
      const itens = response.contas || [];
      setContas(itens);
      calcularKpis(itens);
      toast({
        title: 'Busca realizada',
        description: `${itens.length} contas encontradas`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Erro ao buscar',
        description: 'Tente novamente',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelectedIds(new Set(contas.map((c) => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  function handleSelectOne(id: string) {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  }

  async function handleExport() {
    if (!empresaId || !dataInicial || !dataFinal) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Selecione empresa e período',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await downloadCsv({
        id_empresa: Number(empresaId),
        data_inicial: dataInicial,
        data_final: dataFinal,
        apenas_abertas: apenasAbertas,
        sort_by: 'data_vencimento',
        order: 'asc',
        ids: selectedIds.size > 0 ? Array.from(selectedIds) : undefined,
      });
      toast({
        title: 'Exportação iniciada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Erro ao exportar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
      toast({
        title: 'Dados atualizados',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Erro ao atualizar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRefreshing(false);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Layout>
      <Box p={6}>
        <Card mb={6}>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} alignItems="end">
              <FormControl isRequired>
                <FormLabel>Empresa</FormLabel>
                <Select
                  value={empresaId}
                  onChange={(e) => setEmpresaId(e.target.value)}
                  placeholder="Selecione..."
                >
                  {empresas.map((e) => (
                    <option key={e.Id} value={String(e.Id)}>
                      {e.Nome} ({e.Documento})
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Data Inicial</FormLabel>
                <Input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Data Final</FormLabel>
                <Input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mt={4}>
              <Button
                colorScheme="blue"
                onClick={handleBuscar}
                isLoading={loading}
                loadingText="Buscando..."
              >
                Buscar
              </Button>
              <Button
                colorScheme="gray"
                onClick={handleRefresh}
                isDisabled={!empresaId}
                isLoading={refreshing}
                loadingText="Atualizando..."
              >
                Atualizar
              </Button>
              <Button
                colorScheme="green"
                onClick={handleExport}
                isDisabled={contas.length === 0}
              >
                Exportar CSV
              </Button>
            </Grid>
            <Box mt={4}>
              <Checkbox
                isChecked={apenasAbertas}
                onChange={(e) => setApenasAbertas(e.target.checked)}
              >
                Apenas contas em aberto
              </Checkbox>
            </Box>
          </CardBody>
        </Card>

        <KpiCards data={kpis} />

        <Card>
          <CardBody>
            {loading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <Spinner size="xl" />
              </Box>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th width="40px">
                      <Checkbox
                        isChecked={selectedIds.size === contas.length && contas.length > 0}
                        isIndeterminate={selectedIds.size > 0 && selectedIds.size < contas.length}
                        onChange={handleSelectAll}
                      />
                    </Th>
                    <Th>Nome</Th>
                    <Th>Vencimento</Th>
                    <Th>Status</Th>
                    <Th isNumeric>Valor</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contas.map((conta) => {
                    const isPago = !!conta.data_quitacao;
                    const isVencida = !isPago && conta.data_vencimento && new Date(conta.data_vencimento) < new Date();
                    return (
                      <Tr key={conta.id}>
                        <Td>
                          <Checkbox
                            isChecked={selectedIds.has(conta.id)}
                            onChange={() => handleSelectOne(conta.id)}
                          />
                        </Td>
                        <Td>{conta.descricao || 'Sem descrição'}</Td>
                        <Td>
                          {conta.data_vencimento ? new Date(conta.data_vencimento).toLocaleDateString('pt-BR') : '-'}
                        </Td>
                        <Td>
                          {isPago ? (
                            <Badge colorScheme="green">Pago</Badge>
                          ) : isVencida ? (
                            <Badge colorScheme="red">Vencida</Badge>
                          ) : (
                            <Badge colorScheme="blue">Em aberto</Badge>
                          )}
                        </Td>
                        <Td isNumeric>{formatCurrency(conta.valor)}</Td>
                      </Tr>
                    );
                  })}
                  {contas.length === 0 && (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={8} color="gray.500">
                        Nenhuma conta encontrada. Selecione uma empresa e período para buscar.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </Box>
    </Layout>
  );
}
