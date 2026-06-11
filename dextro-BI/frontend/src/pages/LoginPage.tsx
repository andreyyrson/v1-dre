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
  VStack,
} from '@chakra-ui/react';
import { login } from '../services/api';

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
      bg="#0A0A0A"
      p={4}
    >
      <Card
        w="full"
        maxW="400px"
        borderRadius="sm"
        boxShadow="none"
        bg="#141414"
        border="1px solid #27272A"
      >
        <CardBody p={8}>
          <Heading
            size="lg"
            textAlign="center"
            mb={1}
            color="#FFFFFF"
            fontWeight="700"
            letterSpacing="0.02em"
          >
            DEXTRO
          </Heading>
          <Text
            color="#A1A1AA"
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
                color="#A1A1AA"
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
                borderRadius="sm"
                bg="#0A0A0A"
                color="#FFFFFF"
                border="1px solid #27272A"
                _hover={{ borderColor: '#3F3F46' }}
                _focus={{ borderColor: '#FFFFFF', boxShadow: 'none' }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel
                color="#A1A1AA"
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
                borderRadius="sm"
                bg="#0A0A0A"
                color="#FFFFFF"
                border="1px solid #27272A"
                _hover={{ borderColor: '#3F3F46' }}
                _focus={{ borderColor: '#FFFFFF', boxShadow: 'none' }}
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
              size="lg"
              w="full"
              borderRadius="sm"
              isLoading={loading}
              loadingText="Entrando..."
              bg="#FFFFFF"
              color="#0A0A0A"
              fontWeight="700"
              _hover={{ bg: '#E4E4E7' }}
              _active={{ bg: '#D4D4D8' }}
            >
              Entrar
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
