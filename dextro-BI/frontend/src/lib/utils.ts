export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ?? 0);
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  const [y, m, d] = value.split("T")[0].split("-");
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

/** Conta está vencida: não paga e vencimento anterior a hoje. */
export function isVencida(dataVencimento: string | null, pago: boolean): boolean {
  if (pago || !dataVencimento) return false;
  const venc = new Date(dataVencimento.split("T")[0] + "T00:00:00");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return venc < hoje;
}

/** Retorna a data de hoje no formato aaaa-mm-dd. */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/** Primeiro dia do mês atual no formato aaaa-mm-dd. */
export function firstDayOfMonthISO(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1)
    .toLocaleDateString("en-CA");
}

/** Último dia do mês atual no formato aaaa-mm-dd. */
export function lastDayOfMonthISO(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
    .toLocaleDateString("en-CA");
}
