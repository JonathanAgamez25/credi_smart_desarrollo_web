// creditsData.js
// -----------------------------------------------------------------------------
// Este archivo reemplaza los datos "fijos" que en la Actividad 1 estaban escritos
// directamente en el HTML (cada <article class="credit-card"> a mano).
// Ahora viven en un solo array de objetos: si mañana cambia una tasa, se edita
// aquí una sola vez y todas las páginas (Inicio, Simulador) se actualizan solas,
// porque ambas páginas hacen .map() sobre este mismo array.
//
// rate está en formato decimal (13.5% -> 0.135) para poder hacer cálculos
// matemáticos directos (ver Solicitar.jsx, cálculo de cuota mensual).

const creditsData = [
  {
    id: "libre-inversion",
    name: "Crédito Libre Inversión",
    description:
      "Dinero de libre destinación, desembolso rápido y sin necesidad de justificar el uso.",
    rate: 0.135,
    minAmount: 1_000_000,
    maxAmount: 50_000_000,
    maxTermMonths: 60,
    icon: "M3 10h18M6 15h2M3 6h18v12H3z",
  },
  {
    id: "vehiculo",
    name: "Crédito Vehículo",
    description:
      "Financia hasta el 90% de tu vehículo nuevo o usado, con seguro incluido.",
    rate: 0.102,
    minAmount: 5_000_000,
    maxAmount: 120_000_000,
    maxTermMonths: 72,
    icon: "M5 17h14M6 17V9l6-4 6 4v8M9 17v-4h6v4",
  },
  {
    id: "vivienda",
    name: "Crédito Vivienda",
    description:
      "Compra, construye o mejora tu vivienda con el plazo más largo de nuestro catálogo.",
    rate: 0.091,
    minAmount: 20_000_000,
    maxAmount: 400_000_000,
    maxTermMonths: 240,
    icon: "M4 21V10l8-6 8 6v11M9 21v-6h6v6",
  },
  {
    id: "educativo",
    name: "Crédito Educativo",
    description:
      "Pregrado, posgrado o educación técnica, con periodo de gracia mientras estudias.",
    rate: 0.078,
    minAmount: 1_500_000,
    maxAmount: 60_000_000,
    maxTermMonths: 96,
    icon: "M12 4 3 8l9 4 9-4-9-4ZM3 8v8l9 4 9-4V8M12 12v8",
  },
  {
    id: "empresarial",
    name: "Crédito Empresarial",
    description:
      "Capital de trabajo o expansión para tu negocio, con asesoría financiera incluida.",
    rate: 0.117,
    minAmount: 10_000_000,
    maxAmount: 300_000_000,
    maxTermMonths: 84,
    icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01M9 15h.01M15 15h.01",
  },
];

export default creditsData;
