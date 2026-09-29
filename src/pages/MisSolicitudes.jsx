// src/pages/MisSolicitudes.jsx
// -----------------------------------------------------------------------------
// Página que consulta las solicitudes de un usuario filtrando por email.
// Usa una query combinada: where("email", "==", email) + orderBy("fecha", "desc").
//
// Firestore exige un ÍNDICE COMPUESTO para esta combinación. La primera vez que
// se ejecute la query, Firestore devolverá un error con un link directo para
// crearlo. Es normal.

import { useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { formatCOP } from "../utils/finance";

function MisSolicitudes() {
  const [email, setEmail] = useState("");
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buscado, setBuscado] = useState(false);

  async function handleBuscar(e) {
    e.preventDefault();

    const emailLimpio = email.trim().toLowerCase();
    if (!emailLimpio) {
      setError("Ingresa un correo electrónico.");
      return;
    }

    setLoading(true);
    setError(null);
    setBuscado(true);

    try {
      const q = query(
        collection(db, "solicitudes"),
        where("email", "==", emailLimpio),
        orderBy("fecha", "desc"),
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSolicitudes(data);
    } catch (err) {
      console.error("Error al consultar solicitudes:", err);

      // Error típico la primera vez: falta índice compuesto
      if (err.code === "failed-precondition") {
        setError(
          "Firestore necesita crear un índice. Revisa la consola del navegador (F12) para ver el link que genera Firebase.",
        );
      } else {
        setError(
          "No pudimos cargar tus solicitudes. Verifica tu conexión e intenta de nuevo.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function formatearFecha(fecha) {
    if (!fecha) return "—";
    // fecha es un Timestamp de Firestore: tiene .toDate()
    if (typeof fecha.toDate === "function") {
      return fecha.toDate().toLocaleString("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
    return "—";
  }

  return (
    <section className="section" style={{ paddingTop: "var(--space-4)" }}>
      <div className="container">
        <div className="section-heading">
          <h1>Mis solicitudes</h1>
          <p>Consulta el estado de las solicitudes asociadas a tu correo.</p>
        </div>

        <form
          className="filter-bar"
          onSubmit={handleBuscar}
          style={{ marginBottom: "2rem" }}
        >
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="email-busqueda">Correo electrónico</label>
            <input
              type="email"
              id="email-busqueda"
              placeholder="El correo con el que solicitaste el crédito"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Buscando..." : "Buscar solicitudes"}
          </button>
        </form>

        {error && (
          <div className="error-state" role="alert">
            <p>{error}</p>
          </div>
        )}

        {loading && <p className="loading-state">Cargando solicitudes...</p>}

        {!loading && buscado && !error && solicitudes.length === 0 && (
          <p className="no-results">
            No encontramos solicitudes con ese correo electrónico.
          </p>
        )}

        {!loading && solicitudes.length > 0 && (
          <>
            <p className="results-count">
              {solicitudes.length}{" "}
              {solicitudes.length === 1
                ? "solicitud encontrada"
                : "solicitudes encontradas"}
            </p>

            <div className="card-grid">
              {solicitudes.map((s) => (
                <article key={s.id} className="credit-card">
                  <h3>{s.nombreCredito || "Crédito"}</h3>
                  <p className="solicitud-monto">
                    <strong>{formatCOP(s.monto)}</strong> a {s.plazo} meses
                  </p>
                  <ul className="solicitud-detalles">
                    <li>
                      <strong>Solicitante:</strong> {s.nombre}
                    </li>
                    <li>
                      <strong>Email:</strong> {s.email}
                    </li>
                    <li>
                      <strong>Teléfono:</strong> {s.telefono}
                    </li>
                    <li>
                      <strong>Cuota estimada:</strong>{" "}
                      {formatCOP(s.cuotaEstimada)}
                    </li>
                    <li>
                      <strong>Fecha:</strong> {formatearFecha(s.fecha)}
                    </li>
                  </ul>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MisSolicitudes;
