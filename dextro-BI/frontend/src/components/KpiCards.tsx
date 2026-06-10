import { Card, CardBody, Text, Grid } from '@chakra-ui/react';

interface KpiData {
  totalPago: number;
  vencidas: number;
  agendadas: number;
}

export default function KpiCards({ data }: { data: KpiData }) {
  const cards = [
    { label: 'Total Pago', value: data.totalPago, color: 'green' },
    { label: 'Vencidas', value: data.vencidas, color: 'red' },
    { label: 'Agendadas', value: data.agendadas, color: 'blue' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={6}>
      {cards.map((card) => (
        <Card key={card.label} bg={`${card.color}.100`} color={`${card.color}.800`}>
          <CardBody>
            <Text fontSize="sm" fontWeight="medium" opacity={0.8}>
              {card.label}
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {formatCurrency(card.value)}
            </Text>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}
