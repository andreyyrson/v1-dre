import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Text, Button, Box } from '@chakra-ui/react';

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg="#0A0A0A">
      <Flex
        as="header"
        bg="#0A0A0A"
        borderBottom="1px solid #27272A"
        px={6}
        h="56px"
        justify="space-between"
        align="center"
      >
        <Text
          fontWeight="700"
          fontSize="sm"
          letterSpacing="0.1em"
          color="#FFFFFF"
          textTransform="uppercase"
        >
          DEXTRO
        </Text>
        <Button variant="ghost" onClick={handleLogout}>
          Sair
        </Button>
      </Flex>
      <Box as="main" maxW="7xl" mx="auto" px={6} py={6}>
        {children}
      </Box>
    </Box>
  );
}
