import { Card, Text, Grid, Flex, Icon, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiAlertCircle, FiCalendar } from 'react-icons/fi';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface KpiData {
  totalPago: number;
  vencidas: number;
  agendadas: number;
}

export default function KpiCards({ data }: { data: KpiData }) {
  const cards = [
    { 
      label: 'Total Pago', 
      value: data.totalPago, 
      color: 'success',
      icon: FiDollarSign 
    },
    { 
      label: 'Vencidas', 
      value: data.vencidas, 
      color: 'error',
      icon: FiAlertCircle 
    },
    { 
      label: 'Agendadas', 
      value: data.agendadas, 
      color: 'info',
      icon: FiCalendar 
    },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={6}>
      {cards.map((card, index) => (
        <MotionCard
          key={card.label}
          bg="white"
          boxShadow="lg"
          borderRadius="xl"
          p={6}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: index * 0.1
          }}
          whileHover={{ 
            transform: 'translateY(-4px)',
            boxShadow: 'xl',
          }}
        >
          <Flex align="center" justify="space-between">
            <Box>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {card.label}
              </Text>
              <Text 
                fontSize="3xl" 
                fontWeight="bold" 
                color={`${card.color}.600`}
                fontFamily="mono"
                mt={2}
              >
                {formatCurrency(card.value)}
              </Text>
            </Box>
            <MotionBox
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon as={card.icon} boxSize={12} color={`${card.color}.500`} opacity={0.2} />
            </MotionBox>
          </Flex>
        </MotionCard>
      ))}
    </Grid>
  );
}
