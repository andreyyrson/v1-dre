import { Card, Text, Grid } from '@chakra-ui/react';

interface KpiData {
  totalPago: number;
  vencidas: number;
  agendadas: number;
}

export default function KpiCards({ data }: { data: KpiData }) {
  const cards = [
    { label: 'Total Pago', value: data.totalPago },
    { label: 'Vencidas', value: data.vencidas },
    { label: 'Agendadas', value: data.agendadas },
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
          <Text color="#A1A1AA" fontSize="sm" fontWeight="500">
            {card.label}
          </Text>
          <Text
            fontSize="2xl"
            fontWeight="700"
            color="#FFFFFF"
            fontFamily="mono"
            mt={1}
          >
            {formatCurrency(card.value)}
          </Text>
        </Card>
      ))}
    </Grid>
  );
}
