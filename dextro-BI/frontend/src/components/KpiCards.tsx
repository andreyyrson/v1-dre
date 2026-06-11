import { Card, Grid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';

interface KpiData {
  totalPago: number;
  vencidas: number;
  agendadas: number;
}

export default function KpiCards({ data }: { data: KpiData }) {
  const cards = [
    { label: 'Total Pago', value: data.totalPago, trend: '—', trendColor: '#A1A1AA' },
    { label: 'Vencidas', value: data.vencidas, trend: '▼ 5%', trendColor: '#EAB308' },
    { label: 'Agendadas', value: data.agendadas, trend: '▲ 12%', trendColor: '#22C55E' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={6}>
      {cards.map((card) => (
        <Card
          key={card.label}
          bg="#141414"
          border="1px solid #27272A"
          borderRadius="sm"
          p={5}
          boxShadow="none"
        >
          <Stat>
            <StatLabel
              color="#A1A1AA"
              fontSize="xs"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              {card.label}
            </StatLabel>
            <StatHelpText
              color={card.trendColor}
              fontSize="sm"
              fontWeight="500"
              mb={1}
              mt={1}
              borderLeft={`2px solid ${card.trendColor}`}
              pl={2}
            >
              {card.trend} vs mês anterior
            </StatHelpText>
            <StatNumber
              color="#FFFFFF"
              fontSize="2xl"
              fontWeight="700"
              fontFamily="mono"
            >
              {formatCurrency(card.value)}
            </StatNumber>
          </Stat>
        </Card>
      ))}
    </Grid>
  );
}
