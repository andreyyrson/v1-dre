interface KpiData {
  totalPago: number;
  vencidas: number;
  agendadas: number;
}

export default function KpiCards({ data }: { data: KpiData }) {
  const cards = [
    { label: 'Total Pago', value: data.totalPago, color: 'bg-green-100 text-green-800' },
    { label: 'Vencidas', value: data.vencidas, color: 'bg-red-100 text-red-800' },
    { label: 'Agendadas', value: data.agendadas, color: 'bg-blue-100 text-blue-800' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className={`p-4 rounded-lg ${card.color}`}>
          <p className="text-sm font-medium opacity-80">{card.label}</p>
          <p className="text-2xl font-bold">{formatCurrency(card.value)}</p>
        </div>
      ))}
    </div>
  );
}
