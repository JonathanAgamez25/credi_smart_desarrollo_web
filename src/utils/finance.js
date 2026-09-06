// finance.js — funciones puras, sin estado, reutilizadas por varias páginas.

// Formatea un número como pesos colombianos: 15000000 -> "$15.000.000"
export function formatCOP(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

// Calcula la cuota mensual de un crédito usando el sistema de cuota fija
// (amortización francesa), que es el que usan la mayoría de bancos en Colombia.
//
//   cuota = P * i / (1 - (1 + i)^-n)
//
// donde:
//   P = monto del crédito
//   i = tasa de interés MENSUAL (la que tenemos guardada es E.A., efectiva anual,
//       así que primero hay que convertirla a mensual)
//   n = plazo en meses
export function calcularCuotaMensual(monto, tasaEA, plazoMeses) {
  if (!monto || !tasaEA || !plazoMeses || monto <= 0 || plazoMeses <= 0) return 0;

  // Conversión de tasa efectiva anual a tasa efectiva mensual:
  // i_mensual = (1 + i_anual) ^ (1/12) - 1
  const tasaMensual = Math.pow(1 + tasaEA, 1 / 12) - 1;

  const cuota =
    (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));

  return Math.round(cuota);
}
