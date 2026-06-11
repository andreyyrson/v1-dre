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
  Checkbox,
  Heading,
  Hide,
  VStack,
  Flex,
  Text as ChakraText,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import KpiCards from '../components/KpiCards';
import { SkeletonTable } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { fetchEmpresas, fetchContasPagar, refreshContas, downloadExcel } from '../services/api';

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
  id_categoria: number | null;
  categoria: string | null;
  id_fornecedor: number | null;
  fornecedor: string | null;
  id_conta_financeira: number | null;
  conta_financeira: string | null;
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
  const [categoriaId, setCategoriaId] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [contaFinanceiraId, setContaFinanceiraId] = useState('');
  const [filteredContas, setFilteredContas] = useState<Conta[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  function handleSort(column: string) {
    let newDirection: 'asc' | 'desc' = 'asc';
    if (sortColumn === column) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = [...filteredContas].sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (column) {
        case 'fornecedor':
          valA = a.fornecedor || a.descricao || '';
          valB = b.fornecedor || b.descricao || '';
          break;
        case 'vencimento':
          valA = a.data_vencimento || '';
          valB = b.data_vencimento || '';
          break;
        case 'valor':
          valA = a.valor;
          valB = b.valor;
          break;
        case 'status': {
          const getStatus = (c: Conta) => {
            if (c.data_quitacao) return 3; // Pago
            if (c.data_vencimento && new Date(c.data_vencimento) < new Date()) return 2; // Vencido
            return 1; // Aberto
          };
          valA = getStatus(a);
          valB = getStatus(b);
          break;
        }
        default:
          return 0;
      }

      if (valA < valB) return newDirection === 'asc' ? -1 : 1;
      if (valA > valB) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredContas(sorted);
  }

  function getSortIcon(column: string) {
    if (sortColumn !== column) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  }

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

  useEffect(() => {
    if (contas.length > 0) {
      applyFilters(contas);
    }
  }, [categoriaId, fornecedorId, valorMin, valorMax, contaFinanceiraId]);

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

  function applyFilters(contasList: Conta[]) {
    let filtered = contasList;

    if (categoriaId) {
      filtered = filtered.filter((c) => String(c.id_categoria) === categoriaId);
    }
    if (fornecedorId) {
      filtered = filtered.filter((c) => String(c.id_fornecedor) === fornecedorId);
    }
    if (valorMin) {
      filtered = filtered.filter((c) => c.valor >= Number(valorMin));
    }
    if (valorMax) {
      filtered = filtered.filter((c) => c.valor <= Number(valorMax));
    }
    if (contaFinanceiraId) {
      filtered = filtered.filter((c) => String(c.id_conta_financeira) === contaFinanceiraId);
    }

    setFilteredContas(filtered);
    setSortColumn('');
    calcularKpis(filtered);
  }

  function getUniqueCategorias() {
    const unique = new Map();
    contas.forEach((c) => {
      if (c.id_categoria && c.categoria) {
        unique.set(String(c.id_categoria), c.categoria);
      }
    });
    return Array.from(unique.entries()).map(([id, nome]) => ({ id, nome }));
  }

  function getUniqueFornecedores() {
    const unique = new Map();
    contas.forEach((c) => {
      if (c.id_fornecedor && c.fornecedor) {
        unique.set(String(c.id_fornecedor), c.fornecedor);
      }
    });
    return Array.from(unique.entries()).map(([id, nome]) => ({ id, nome }));
  }

  function getUniqueContasFinanceiras() {
    const unique = new Map();
    contas.forEach((c) => {
      if (c.id_conta_financeira && c.conta_financeira) {
        unique.set(String(c.id_conta_financeira), c.conta_financeira);
      }
    });
    return Array.from(unique.entries()).map(([id, nome]) => ({ id, nome }));
  }

  function handleLimparFiltros() {
    setCategoriaId('');
    setFornecedorId('');
    setValorMin('');
    setValorMax('');
    setContaFinanceiraId('');
    setFilteredContas(contas);
    calcularKpis(contas);
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
      applyFilters(itens);
      toast({
        title: 'Busca realizada',
        description: `${itens.length} contas encontradas`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      console.error('Erro ao buscar contas:', err);
      console.error('Response:', err.response);
      console.error('Response data:', err.response?.data);
      
      if (err.response?.status === 422) {
        toast({
          title: 'Período inválido',
          description: 'A data inicial deve ser anterior à data final',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Erro ao buscar',
          description: err.response?.data?.detail || err.message || 'Tente novamente',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredContas.map((c) => c.id)));
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

  // Force Vercel redeploy
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
      await downloadExcel({
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
        <Card mb={6} bg="#141414" border="1px solid #27272A">
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} alignItems="end">
              <FormControl isRequired>
                <FormLabel fontSize="xs" color="#A1A1AA" textTransform="uppercase" letterSpacing="0.05em">Empresa</FormLabel>
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
                <FormLabel fontSize="xs" color="#A1A1AA" textTransform="uppercase" letterSpacing="0.05em">Data Inicial</FormLabel>
                <Input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  color="#FFFFFF"
                  readOnly
                  onFocus={(e) => e.target.showPicker?.()}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="xs" color="#A1A1AA" textTransform="uppercase" letterSpacing="0.05em">Data Final</FormLabel>
                <Input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  color="#FFFFFF"
                  readOnly
                  onFocus={(e) => e.target.showPicker?.()}
                />
              </FormControl>
              <Button
                bg="#FFFFFF"
                color="#0A0A0A"
                _hover={{ bg: '#E4E4E7' }}
                _active={{ bg: '#D4D4D8' }}
                onClick={handleBuscar}
                isLoading={loading}
                loadingText="Buscando..."
                w="full"
              >
                Buscar
              </Button>
            </Grid>
            <Flex mt={4} justify="space-between" align="center" wrap="wrap" gap={3}>
              <Checkbox
                isChecked={apenasAbertas}
                onChange={(e) => setApenasAbertas(e.target.checked)}
              >
                Apenas em aberto
              </Checkbox>
              <Flex gap={3}>
                <Button
                  bg="transparent"
                  color="#FFFFFF"
                  border="1px solid #27272A"
                  _hover={{ bg: '#1A1A1A' }}
                  onClick={handleRefresh}
                  isDisabled={!empresaId}
                  isLoading={refreshing}
                  loadingText="Atualizando..."
                  size="sm"
                >
                  Atualizar
                </Button>
                <Button
                  bg="transparent"
                  color="#FFFFFF"
                  border="1px solid #27272A"
                  _hover={{ bg: '#1A1A1A' }}
                  onClick={handleExport}
                  isDisabled={contas.length === 0}
                  size="sm"
                >
                  Exportar Excel
                </Button>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card mb={6} bg="#141414" border="1px solid #27272A">
          <CardBody>
            <Heading as="h3" size="sm" mb={4} color="#A1A1AA" fontWeight="600" letterSpacing="0.05em" textTransform="uppercase">
              Filtros Adicionais
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              <FormControl>
                <FormLabel fontSize="xs" color="#A1A1AA" textTransform="uppercase">Categoria</FormLabel>
                <Select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  placeholder="Todas"
                >
                  {getUniqueCategorias().map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" color="#A1A1AA" textTransform="uppercase">Fornecedor</FormLabel>
                <Select
                  value={fornecedorId}
                  onChange={(e) => setFornecedorId(e.target.value)}
                  placeholder="Todos"
                >
                  {getUniqueFornecedores().map((forn) => (
                    <option key={forn.id} value={forn.id}>
                      {forn.nome}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" color="#A1A1AA" textTransform="uppercase">Conta Financeira</FormLabel>
                <Select
                  value={contaFinanceiraId}
                  onChange={(e) => setContaFinanceiraId(e.target.value)}
                  placeholder="Todas"
                >
                  {getUniqueContasFinanceiras().map((conta) => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" color="#A1A1AA" textTransform="uppercase">Valor Mínimo</FormLabel>
                <Input
                  type="number"
                  value={valorMin}
                  onChange={(e) => setValorMin(e.target.value)}
                  placeholder="R$ 0,00"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" color="#A1A1AA" textTransform="uppercase">Valor Máximo</FormLabel>
                <Input
                  type="number"
                  value={valorMax}
                  onChange={(e) => setValorMax(e.target.value)}
                  placeholder="R$ 0,00"
                />
              </FormControl>
              <Flex align="end">
                <Button
                  variant="ghost"
                  onClick={handleLimparFiltros}
                  isDisabled={contas.length === 0}
                  size="sm"
                >
                  Limpar Filtros
                </Button>
              </Flex>
            </Grid>
          </CardBody>
        </Card>

        <KpiCards data={kpis} />

        <Card bg="#141414" border="1px solid #27272A">
          <CardBody>
            {loading ? (
              <SkeletonTable count={5} />
            ) : filteredContas.length === 0 ? (
              <EmptyState
                icon="search"
                title="Nenhuma conta encontrada"
                description="Selecione uma empresa e período para buscar contas"
                actionLabel="Buscar Contas"
                onAction={handleBuscar}
              />
            ) : (
              <>
                <Hide below="md">
                  <Box overflowX="auto" bg="#0A0A0A">
                    <Table variant="unstyled" size="sm" color="#FFFFFF">
                      <Thead>
                        <Tr borderBottom="2px solid #27272A">
                          <Th width="40px" py={3}>
                            <Checkbox
                              isChecked={selectedIds.size === filteredContas.length && filteredContas.length > 0}
                              isIndeterminate={selectedIds.size > 0 && selectedIds.size < filteredContas.length}
                              onChange={handleSelectAll}
                            />
                          </Th>
                          <Th
                            py={3}
                            color="#A1A1AA"
                            fontSize="11px"
                            fontWeight="600"
                            textTransform="uppercase"
                            letterSpacing="0.05em"
                            cursor="pointer"
                            onClick={() => handleSort('fornecedor')}
                            _hover={{ color: '#FFFFFF' }}
                          >
                            Fornecedor{getSortIcon('fornecedor')}
                          </Th>
                          <Th
                            py={3}
                            color="#A1A1AA"
                            fontSize="11px"
                            fontWeight="600"
                            textTransform="uppercase"
                            letterSpacing="0.05em"
                            cursor="pointer"
                            onClick={() => handleSort('vencimento')}
                            _hover={{ color: '#FFFFFF' }}
                          >
                            Vencimento{getSortIcon('vencimento')}
                          </Th>
                          <Th
                            py={3}
                            color="#A1A1AA"
                            fontSize="11px"
                            fontWeight="600"
                            textTransform="uppercase"
                            letterSpacing="0.05em"
                            cursor="pointer"
                            onClick={() => handleSort('status')}
                            _hover={{ color: '#FFFFFF' }}
                          >
                            Status{getSortIcon('status')}
                          </Th>
                          <Th
                            py={3}
                            color="#A1A1AA"
                            fontSize="11px"
                            fontWeight="600"
                            textTransform="uppercase"
                            letterSpacing="0.05em"
                            isNumeric
                            cursor="pointer"
                            onClick={() => handleSort('valor')}
                            _hover={{ color: '#FFFFFF' }}
                          >
                            Valor{getSortIcon('valor')}
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredContas.map((conta) => {
                          const isPago = !!conta.data_quitacao;
                          const isVencida = !isPago && conta.data_vencimento && new Date(conta.data_vencimento) < new Date();
                          const statusConfig = isPago
                            ? { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', label: 'Pago' }
                            : isVencida
                            ? { bg: 'rgba(234,179,8,0.1)', color: '#EAB308', border: '1px solid rgba(234,179,8,0.2)', label: 'Vencido' }
                            : { bg: 'rgba(161,161,170,0.1)', color: '#A1A1AA', border: '1px solid rgba(161,161,170,0.2)', label: 'Aberto' };
                          return (
                            <Tr
                              key={conta.id}
                              bg="#0A0A0A"
                              borderBottom="1px solid #27272A"
                              _hover={{ bg: '#1A1A1A' }}
                              transition="background 0.15s"
                            >
                              <Td py={3} color="#FFFFFF">
                                <Checkbox
                                  isChecked={selectedIds.has(conta.id)}
                                  onChange={() => handleSelectOne(conta.id)}
                                />
                              </Td>
                              <Td py={3} color="#FFFFFF">
                                <ChakraText fontWeight="500" color="#FFFFFF" fontSize="sm">
                                  {conta.fornecedor || conta.descricao || 'Sem descrição'}
                                </ChakraText>
                                {conta.fornecedor && conta.descricao && (
                                  <ChakraText color="#71717A" fontSize="xs" mt={0.5}>
                                    {conta.descricao}
                                  </ChakraText>
                                )}
                              </Td>
                              <Td py={3} color="#A1A1AA" fontSize="sm">
                                {conta.data_vencimento ? new Date(conta.data_vencimento).toLocaleDateString('pt-BR') : '-'}
                              </Td>
                              <Td py={3} color="#FFFFFF">
                                <Badge
                                  bg={statusConfig.bg}
                                  color={statusConfig.color}
                                  border={statusConfig.border}
                                  borderRadius="full"
                                  px={2}
                                  py={0.5}
                                  fontSize="xs"
                                  fontWeight="600"
                                >
                                  {statusConfig.label}
                                </Badge>
                              </Td>
                              <Td py={3} isNumeric fontFamily="mono" color="#FFFFFF" fontSize="sm" fontWeight="600">
                                {formatCurrency(conta.valor)}
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                </Hide>
                <Hide above="md">
                  <VStack spacing={3} align="stretch">
                    {filteredContas.map((conta) => {
                      const isPago = !!conta.data_quitacao;
                      const isVencida = !isPago && conta.data_vencimento && new Date(conta.data_vencimento) < new Date();
                      const statusConfig = isPago
                        ? { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', label: 'Pago' }
                        : isVencida
                        ? { bg: 'rgba(234,179,8,0.1)', color: '#EAB308', border: '1px solid rgba(234,179,8,0.2)', label: 'Vencido' }
                        : { bg: 'rgba(161,161,170,0.1)', color: '#A1A1AA', border: '1px solid rgba(161,161,170,0.2)', label: 'Aberto' };
                      return (
                        <Card key={conta.id} p={4} borderRadius="sm">
                          <Flex justify="space-between" align="start" mb={2}>
                            <Box>
                              <ChakraText fontWeight="500" color="#FFFFFF" fontSize="sm">
                                {conta.fornecedor || conta.descricao || 'Sem descrição'}
                              </ChakraText>
                              {conta.fornecedor && conta.descricao && (
                                <ChakraText color="#52525B" fontSize="xs" mt={0.5}>
                                  {conta.descricao}
                                </ChakraText>
                              )}
                            </Box>
                            <Checkbox
                              isChecked={selectedIds.has(conta.id)}
                              onChange={() => handleSelectOne(conta.id)}
                            />
                          </Flex>
                          <Flex justify="space-between" align="center">
                            <ChakraText color="#A1A1AA" fontSize="xs">
                              {conta.data_vencimento ? new Date(conta.data_vencimento).toLocaleDateString('pt-BR') : '-'}
                            </ChakraText>
                            <Badge
                              bg={statusConfig.bg}
                              color={statusConfig.color}
                              border={statusConfig.border}
                              borderRadius="full"
                              px={2}
                              py={0.5}
                              fontSize="xs"
                              fontWeight="600"
                            >
                              {statusConfig.label}
                            </Badge>
                          </Flex>
                          <ChakraText fontSize="md" fontWeight="700" color="#FFFFFF" fontFamily="mono" mt={2} textAlign="right">
                            {formatCurrency(conta.valor)}
                          </ChakraText>
                        </Card>
                      );
                    })}
                  </VStack>
                </Hide>
              </>
            )}
          </CardBody>
        </Card>
      </Box>
    </Layout>
  );
}
