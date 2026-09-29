// src/pages/Simulador.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CreditCard from "../components/CreditCard";

function dentroDelRango(credit, rango) {
  if (!rango) return true;
  const millon = 1_000_000;
  if (rango === "0-10") return credit.minAmount <= 10 * millon;
  if (rango === "10-50")
    return credit.maxAmount >= 10 * millon && credit.minAmount <= 50 * millon;
  if (rango === "50-150")
    return credit.maxAmount >= 50 * millon && credit.minAmount <= 150 * millon;
  if (rango === "150+") return credit.maxAmount >= 150 * millon;
  return true;
}

function Simulador() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rangoMonto, setRangoMonto] = useState("");
  const [ordenarPorTasa, setOrdenarPorTasa] = useState(false);

  const [creditos, setCreditos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCreditos() {
      try {
        setLoading(true);
        setError(null);
        const snapshot = await getDocs(collection(db, "creditos"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCreditos(data);
      } catch (err) {
        console.error("Error al cargar créditos:", err);
        setError(
          "No pudimos cargar el catálogo. Verifica tu conexión e intenta de nuevo.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchCreditos();
  }, []);

  const creditosFiltrados = creditos
    .filter((credit) =>
      credit.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((credit) => dentroDelRango(credit, rangoMonto))
    .sort((a, b) => (ordenarPorTasa ? a.rate - b.rate : 0));

  function limpiarFiltros() {
    setSearchTerm("");
    setRangoMonto("");
    setOrdenarPorTasa(false);
  }

  return (
    <section className="section" style={{ paddingTop: "var(--space-4)" }}>
      <div className="container">
        <div className="section-heading">
          <h1>Simulador de crédito</h1>
          <p>Busca por nombre de producto o filtra por rango de monto.</p>
        </div>

        <form
          className="filter-bar"
          role="search"
          aria-label="Filtros de búsqueda de crédito"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="field">
            <label htmlFor="busqueda">Buscar por nombre</label>
            <input
              type="search"
              id="busqueda"
              name="busqueda"
              placeholder="Ej: Crédito Vivienda"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="rango-monto">Rango de monto</label>
            <select
              id="rango-monto"
              name="rango-monto"
              value={rangoMonto}
              onChange={(e) => setRangoMonto(e.target.value)}
            >
              <option value="">Todos los rangos</option>
              <option value="0-10">Hasta $10.000.000</option>
              <option value="10-50">$10.000.000 – $50.000.000</option>
              <option value="50-150">$50.000.000 – $150.000.000</option>
              <option value="150+">Más de $150.000.000</option>
            </select>
          </div>

          <label
            className="field"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              type="checkbox"
              checked={ordenarPorTasa}
              onChange={(e) => setOrdenarPorTasa(e.target.checked)}
            />
            Ordenar por tasa (menor a mayor)
          </label>

          <button
            type="button"
            className="btn btn-outline"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </form>

        {loading && <p className="loading-state">Cargando créditos...</p>}

        {error && (
          <div className="error-state" role="alert">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="results-count">
              {creditosFiltrados.length}{" "}
              {creditosFiltrados.length === 1
                ? "producto encontrado"
                : "productos encontrados"}
            </p>

            {creditosFiltrados.length === 0 ? (
              <p className="no-results">
                No hay créditos disponibles con esos filtros.
              </p>
            ) : (
              <div className="card-grid">
                {creditosFiltrados.map((credit) => (
                  <CreditCard key={credit.id} {...credit} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Simulador;
