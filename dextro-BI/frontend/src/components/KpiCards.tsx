import { Card, Grid, Stat, StatLabel, StatNumber, Flex, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface KpiData {
  totalPago: number;
  vencidas: number;
  agendadas: number;
}

const MotionCard = motion(Card);

export default function KpiCards({ data }: { data: KpiData }) {
  const cards: { label: string; value: number; icon: IconType; accent: string }[] = [
    { label: 'Total Pago', value: data.totalPago, icon: FiCheckCircle, accent: '#22C55E' },
    { label: 'Vencidas', value: data.vencidas, icon: FiAlertTriangle, accent: '#EAB308' },
    { label: 'Agendadas', value: data.agendadas, icon: FiClock, accent: '#3B82F6' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={8}>
      {cards.map((card, index) => (
        <MotionCard
          key={card.label}
          p={5}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.08, ease: 'easeOut' }}
          _hover={{ borderColor: 'borderHover' }}
          style={{ transition: 'border-color 0.15s ease' }}
        >
          <Stat>
            <Flex justify="space-between" align="center" mb={3}>
              <StatLabel
                color="textSecondary"
                fontSize="xs"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                {card.label}
              </StatLabel>
              <Flex
                align="center"
                justify="center"
                boxSize="30px"
                borderRadius="md"
                bg="canvas"
                border="1px solid"
                borderColor="borderDefault"
              >
                <Icon as={card.icon} color={card.accent} boxSize="15px" />
              </Flex>
            </Flex>
            <StatNumber
              color="textPrimary"
              fontSize="2xl"
              fontWeight="700"
              fontFamily="mono"
            >
              {formatCurrency(card.value)}
            </StatNumber>
          </Stat>
        </MotionCard>
      ))}
    </Grid>
  );
}
