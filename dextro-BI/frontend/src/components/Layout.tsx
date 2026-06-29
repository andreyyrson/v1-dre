import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Text, Button, Box, IconButton, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';

const MotionBox = motion(Box);

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Flex direction="column" minH="100vh" bg="canvas">
      <Flex
        as="header"
        position="sticky"
        top={0}
        zIndex={10}
        bg="surface"
        backdropFilter="blur(8px)"
        borderBottom="1px solid"
        borderColor="borderDefault"
        px={{ base: 4, md: 8 }}
        h="60px"
        justify="space-between"
        align="center"
      >
        <Flex align="center" gap={2.5}>
          <Flex
            align="center"
            justify="center"
            boxSize="28px"
            borderRadius="md"
            bg="canvas"
            border="1px solid"
            borderColor="borderDefault"
            color="textPrimary"
          >
            <FiBarChart2 size={15} />
          </Flex>
          <Text
            fontWeight="700"
            fontSize="sm"
            letterSpacing="0.18em"
            color="textPrimary"
            textTransform="uppercase"
          >
            DEXTRO
          </Text>
        </Flex>
        <Flex align="center" gap={1}>
          <IconButton
            aria-label="Alternar tema"
            icon={colorMode === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            onClick={toggleColorMode}
            variant="ghost"
            color="textSecondary"
            _hover={{ bg: 'surfaceHover', color: 'textPrimary' }}
            size="sm"
          />
          <Button
            variant="ghost"
            onClick={handleLogout}
            color="textSecondary"
            leftIcon={<FiLogOut size={15} />}
            _hover={{ bg: 'surfaceHover', color: 'textPrimary' }}
            size="sm"
          >
            Sair
          </Button>
        </Flex>
      </Flex>
      <MotionBox
        as="main"
        flex="1"
        w="full"
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 8 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </MotionBox>
      <Flex
        as="footer"
        borderTop="1px solid"
        borderColor="borderDefault"
        px={{ base: 4, md: 8 }}
        py={4}
        justify="center"
        align="center"
      >
        <Text color="textMuted" fontSize="xs" letterSpacing="0.04em">
          DEXTRO &copy; 2026 &mdash; Painel Financeiro
        </Text>
      </Flex>
    </Flex>
  );
}
