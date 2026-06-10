import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  useToast,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import { login } from '../lib/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionButton = motion(Button);

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
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="linear-gradient(135deg, #FAF5FF 0%, #BEE3F8 100%)"
      p={4}
    >
      <MotionCard
        w="full"
        maxW="400px"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        borderRadius="2xl"
        boxShadow="2xl"
        bg="white"
      >
        <CardBody p={8}>
          <MotionBox
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity 
            }}
            textAlign="center"
            mb={6}
          >
            <Icon as={FiLock} boxSize={16} color="primary.600" />
          </MotionBox>
          <Heading size="lg" textAlign="center" mb={2} color="gray.800">
            Bem-vindo
          </Heading>
          <Text color="gray.500" textAlign="center" mb={6}>
            Entre com suas credenciais para acessar o dashboard
          </Text>
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Usuário</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@dextro"
                size="lg"
                borderRadius="md"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                size="lg"
                borderRadius="md"
              />
            </FormControl>
            {error && (
              <Text color="error.500" fontSize="sm" textAlign="center">
                {error}
              </Text>
            )}
            <MotionButton
              type="submit"
              colorScheme="primary"
              size="lg"
              w="full"
              borderRadius="md"
              isLoading={loading}
              loadingText="Entrando..."
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Entrar
            </MotionButton>
          </VStack>
        </CardBody>
      </MotionCard>
    </Box>
  );
}
