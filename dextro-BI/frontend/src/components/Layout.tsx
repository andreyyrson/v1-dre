import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Heading, Button, Box } from '@chakra-ui/react';

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Flex as="header" bg="white" shadow="md" px={6} py={4} justify="space-between" align="center">
        <Heading as="h1" size="lg" color="gray.900">
          Contas a Pagar
        </Heading>
        <Button colorScheme="red" onClick={handleLogout}>
          Sair
        </Button>
      </Flex>
      <Box as="main" maxW="7xl" mx="auto" px={4} py={6}>
        {children}
      </Box>
    </Box>
  );
}
