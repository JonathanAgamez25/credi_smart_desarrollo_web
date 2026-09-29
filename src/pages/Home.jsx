// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CreditCard from "../components/CreditCard";

function Home() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCredits() {
      try {
        setLoading(true);
        setError(null);

        const snapshot = await getDocs(collection(db, "creditos"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCredits(data);
      } catch (err) {
        console.error("Error al cargar créditos:", err);
        setError(
          "No pudimos cargar el catálogo. Verifica tu conexión e intenta de nuevo.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCredits();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">FinTech Solutions S.A.S.</span>
            <h1>Encuentra el crédito que se ajusta a tu plan, no al revés</h1>
            <p>
              Compara tasas, montos y plazos de nuestros {credits.length}{" "}
              productos crediticios y solicita en línea en minutos.
            </p>
            <Link to="/simulador" className="btn btn-primary">
              Comparar créditos
            </Link>
          </div>
          <div className="hero-figure">
            <div className="rate">6.9%</div>
            <div className="rate-label">Tasa E.A. desde</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Catálogo de créditos</h2>
            <p>Estos son los productos disponibles hoy.</p>
          </div>

          {loading && <p className="loading-state">Cargando créditos...</p>}

          {error && (
            <div className="error-state" role="alert">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && credits.length === 0 && (
            <p className="empty-state">Todavía no hay créditos disponibles.</p>
          )}

          {!loading && !error && credits.length > 0 && (
            <div className="card-grid">
              {credits.map((credit) => (
                <CreditCard key={credit.id} {...credit} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
