import { useState } from "react";
import CreditCard from "../components/CreditCard";
import creditsData from "../data/creditsData";

function dentroDelRango(credit, rango) {
  const millon = 1_000_000;
  if (!rango) return true;
  if (rango === "0-10") return credit.minAmount <= 10 * millon;
  if (rango === "10-50") {
    return credit.maxAmount >= 10 * millon && credit.minAmount <= 50 * millon;
  }
  if (rango === "50-150") {
    return credit.maxAmount >= 50 * millon && credit.minAmount <= 150 * millon;
  }
  if (rango === "150+") return credit.maxAmount >= 150 * millon;
  return true;
}

function Simulador() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rangoMonto, setRangoMonto] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("relevancia");
  const [soloDestacados, setSoloDestacados] = useState(false);

  const terminoNormalizado = searchTerm.trim().toLowerCase();
  const creditosFiltrados = creditsData
    .filter((credit) => {
      if (!terminoNormalizado) return true;
      return [credit.name, credit.description]
        .join(" ")
        .toLowerCase()
        .includes(terminoNormalizado);
    })
    .filter((credit) => dentroDelRango(credit, rangoMonto))
    .filter((credit) => !soloDestacados || credit.rate <= 0.102)
    .sort((a, b) => {
      if (ordenarPor === "tasa-menor") return a.rate - b.rate;
      if (ordenarPor === "tasa-mayor") return b.rate - a.rate;
      if (ordenarPor === "monto-mayor") return b.maxAmount - a.maxAmount;
      return 0;
    });

  function limpiarFiltros() {
    setSearchTerm("");
    setRangoMonto("");
    setOrdenarPor("relevancia");
    setSoloDestacados(false);
  }

  return (
    <section className="section" style={{ paddingTop: "var(--space-4)" }}>
      <div className="container">
        <div className="section-heading">
          <h1>Simulador de crédito</h1>
          <p>
            Busca mientras escribes, combina filtros y ordena las opciones para
            encontrar el producto adecuado.
          </p>
        </div>

        <form
          className="filter-bar"
          role="search"
          aria-label="Filtros de búsqueda de crédito"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="field">
            <label htmlFor="busqueda">Buscar por nombre o descripción</label>
            <input
              type="search"
              id="busqueda"
              name="busqueda"
              placeholder="Ej: vivienda, vehículo, educación"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="rango-monto">Rango de monto</label>
            <select
              id="rango-monto"
              name="rango-monto"
              value={rangoMonto}
              onChange={(event) => setRangoMonto(event.target.value)}
            >
              <option value="">Todos los rangos</option>
              <option value="0-10">Hasta $10.000.000</option>
              <option value="10-50">$10.000.000 – $50.000.000</option>
              <option value="50-150">$50.000.000 – $150.000.000</option>
              <option value="150+">Más de $150.000.000</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="ordenar-por">Ordenar resultados</label>
            <select
              id="ordenar-por"
              name="ordenar-por"
              value={ordenarPor}
              onChange={(event) => setOrdenarPor(event.target.value)}
            >
              <option value="relevancia">Relevancia</option>
              <option value="tasa-menor">Tasa menor a mayor</option>
              <option value="tasa-mayor">Tasa mayor a menor</option>
              <option value="monto-mayor">Mayor monto disponible</option>
            </select>
          </div>

          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={soloDestacados}
              onChange={(event) => setSoloDestacados(event.target.checked)}
            />
            Mostrar tasas hasta 10,2% E.A.
          </label>

          <button type="button" className="btn btn-outline" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </form>

        <p className="results-count" aria-live="polite">
          {creditosFiltrados.length} {creditosFiltrados.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>

        {creditosFiltrados.length === 0 ? (
          <p className="no-results">
            No hay créditos disponibles con esos filtros. Prueba otra búsqueda.
          </p>
        ) : (
          <div className="card-grid">
            {creditosFiltrados.map((credit) => (
              <CreditCard key={credit.id} {...credit} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Simulador;
