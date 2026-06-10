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
} from '@chakra-ui/react';
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
  const toast = useToast();
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
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mt={4}>
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
            </Grid>
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
                    <Th>Nome</Th>
                    <Th>Vencimento</Th>
                    <Th>Status</Th>
                    <Th isNumeric>Valor</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contas.map((conta) => {
                    const isPago = !!conta.DataQuitacao;
                    const isVencida = !isPago && new Date(conta.DataVencimento) < new Date();
                    return (
                      <Tr key={conta.IdMovimentacaoFinanceiraParcela}>
                        <Td>{conta.Nome}</Td>
                        <Td>
                          {new Date(conta.DataVencimento).toLocaleDateString('pt-BR')}
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
                        <Td isNumeric>{formatCurrency(conta.Valor)}</Td>
                      </Tr>
                    );
                  })}
                  {contas.length === 0 && (
                    <Tr>
                      <Td colSpan={4} textAlign="center" py={8} color="gray.500">
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
