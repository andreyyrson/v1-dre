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
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiFilter } from 'react-icons/fi';
import Layout from '../components/Layout';
import KpiCards from '../components/KpiCards';
import { SkeletonTable } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { fetchEmpresas, fetchContasPagar, refreshContas, downloadExcel } from '../lib/api';

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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  colorScheme="primary"
                  onClick={handleBuscar}
                  isLoading={loading}
                  loadingText="Buscando..."
                  w="full"
                >
                  Buscar
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  colorScheme="gray"
                  onClick={handleRefresh}
                  isDisabled={!empresaId}
                  isLoading={refreshing}
                  loadingText="Atualizando..."
                  w="full"
                >
                  Atualizar
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  colorScheme="success"
                  onClick={handleExport}
                  isDisabled={contas.length === 0}
                  w="full"
                >
                  Exportar Excel
                </Button>
              </motion.div>
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

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card mb={6}>
            <CardBody>
              <Heading as="h3" size="md" mb={4} display="flex" alignItems="center">
                <motion.div
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon as={FiFilter} mr={2} color="primary.500" />
                </motion.div>
                Filtros Adicionais
              </Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <FormControl>
                  <FormLabel>Categoria</FormLabel>
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
                  <FormLabel>Fornecedor</FormLabel>
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
                  <FormLabel>Valor Mínimo</FormLabel>
                  <Input
                    type="number"
                    value={valorMin}
                    onChange={(e) => setValorMin(e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Valor Máximo</FormLabel>
                  <Input
                    type="number"
                    value={valorMax}
                    onChange={(e) => setValorMax(e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Conta Financeira</FormLabel>
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
              </Grid>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  mt={4}
                  colorScheme="gray"
                  onClick={handleLimparFiltros}
                  isDisabled={contas.length === 0}
                >
                  Limpar Filtros
                </Button>
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>

        <KpiCards data={kpis} />

        <Card>
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
                  <Table variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th width="40px">
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Checkbox
                              isChecked={selectedIds.size === filteredContas.length && filteredContas.length > 0}
                              isIndeterminate={selectedIds.size > 0 && selectedIds.size < filteredContas.length}
                              onChange={handleSelectAll}
                            />
                          </motion.div>
                        </Th>
                        <Th>Descrição</Th>
                        <Th>Vencimento</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Valor</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredContas.map((conta, i) => {
                        const isPago = !!conta.data_quitacao;
                        const isVencida = !isPago && conta.data_vencimento && new Date(conta.data_vencimento) < new Date();
                        return (
                          <motion.tr
                            key={conta.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ 
                              scale: 1.01 
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <Td>
                              <motion.div whileTap={{ scale: 0.9 }}>
                                <Checkbox
                                  isChecked={selectedIds.has(conta.id)}
                                  onChange={() => handleSelectOne(conta.id)}
                                />
                              </motion.div>
                            </Td>
                            <Td>{conta.descricao || 'Sem descrição'}</Td>
                            <Td>
                              {conta.data_vencimento ? new Date(conta.data_vencimento).toLocaleDateString('pt-BR') : '-'}
                            </Td>
                            <Td>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring' }}
                              >
                                <Badge colorScheme={isPago ? 'success' : isVencida ? 'error' : 'info'}>
                                  {isPago ? 'Pago' : isVencida ? 'Vencida' : 'Em aberto'}
                                </Badge>
                              </motion.div>
                            </Td>
                            <Td isNumeric fontFamily="mono">{formatCurrency(conta.valor)}</Td>
                          </motion.tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Hide>
                <Hide above="md">
                  <VStack spacing={4}>
                    {filteredContas.map((conta) => {
                      const isPago = !!conta.data_quitacao;
                      const isVencida = !isPago && conta.data_vencimento && new Date(conta.data_vencimento) < new Date();
                      return (
                        <motion.div
                          key={conta.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ width: '100%' }}
                        >
                          <Card p={4} boxShadow="md">
                            <Flex justify="space-between" align="center" mb={2}>
                              <ChakraText fontWeight="bold">{conta.descricao || 'Sem descrição'}</ChakraText>
                              <motion.div whileTap={{ scale: 0.9 }}>
                                <Checkbox
                                  isChecked={selectedIds.has(conta.id)}
                                  onChange={() => handleSelectOne(conta.id)}
                                />
                              </motion.div>
                            </Flex>
                            <ChakraText color="gray.500" fontSize="sm">
                              Vencimento: {conta.data_vencimento ? new Date(conta.data_vencimento).toLocaleDateString('pt-BR') : '-'}
                            </ChakraText>
                            <Flex justify="space-between" align="center" mt={2}>
                              <Badge colorScheme={isPago ? 'success' : isVencida ? 'error' : 'info'}>
                                {isPago ? 'Pago' : isVencida ? 'Vencida' : 'Em aberto'}
                              </Badge>
                              <ChakraText 
                                fontSize="lg" 
                                fontWeight="bold" 
                                color="primary.600"
                                fontFamily="mono"
                              >
                                {formatCurrency(conta.valor)}
                              </ChakraText>
                            </Flex>
                          </Card>
                        </motion.div>
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
