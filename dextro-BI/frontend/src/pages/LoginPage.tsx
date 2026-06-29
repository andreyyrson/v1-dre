import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  useToast,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiBarChart2 } from 'react-icons/fi';
import { login } from '../services/api';

const MotionCard = motion(Card);

export default function LoginPage({ onLogin }: { onLogin?: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.access_token);
      onLogin?.();
      navigate('/dashboard');
      toast({
        title: 'Login realizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao fazer login');
      toast({
        title: 'Erro ao fazer login',
        description: err.response?.data?.detail || 'Credenciais inválidas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex
      minH="100vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
      bg="canvas"
      p={4}
    >
      <MotionCard
        w="full"
        maxW="400px"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <CardBody p={8}>
          <Flex justify="center" mb={5}>
            <Flex
              align="center"
              justify="center"
              boxSize="48px"
              borderRadius="lg"
              bg="canvas"
              border="1px solid"
              borderColor="borderDefault"
              color="textPrimary"
            >
              <FiBarChart2 size={22} />
            </Flex>
          </Flex>
          <Heading
            size="lg"
            textAlign="center"
            mb={1}
            color="textPrimary"
            fontWeight="700"
            letterSpacing="0.16em"
          >
            DEXTRO
          </Heading>
          <Text
            color="textSecondary"
            textAlign="center"
            mb={8}
            fontSize="sm"
            fontWeight="500"
          >
            Entre com suas credenciais
          </Text>
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel
                color="textSecondary"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.05em"
                fontWeight="600"
              >
                Usuário
              </FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="laura@dextro.com.br"
                size="lg"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel
                color="textSecondary"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.05em"
                fontWeight="600"
              >
                Senha
              </FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                size="lg"
              />
            </FormControl>
            {error && (
              <Text
                color="#EAB308"
                fontSize="sm"
                textAlign="center"
                fontWeight="500"
              >
                {error}
              </Text>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              w="full"
              isLoading={loading}
              loadingText="Entrando..."
              mt={2}
            >
              Entrar
            </Button>
          </VStack>
        </CardBody>
      </MotionCard>
      <Text color="textMuted" fontSize="xs" letterSpacing="0.04em" mt={8}>
        DEXTRO &copy; 2026 &mdash; Painel Financeiro
      </Text>
    </Flex>
  );
}
