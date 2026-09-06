// Home.jsx (Inicio)
// -----------------------------------------------------------------------------
// Antes, index.html tenía 5 <article class="credit-card"> escritos a mano.
// Ahora, "creditsData" trae los 5 créditos como datos, y .map() los convierte
// en 5 componentes <CreditCard>. Si se agrega un 6to crédito en creditsData.js,
// aparece aquí automáticamente sin tocar este archivo.

import { Link } from "react-router-dom";
import CreditCard from "../components/CreditCard";
import creditsData from "../data/creditsData";

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">FinTech Solutions S.A.S.</span>
            <h1>Encuentra el crédito que se ajusta a tu plan, no al revés</h1>
            <p>
              Compara tasas, montos y plazos de nuestros {creditsData.length}{" "}
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

          <div className="card-grid">
            {/* key={credit.id} es obligatorio: le dice a React cuál tarjeta es
                cuál, para que no tenga que redibujar las 5 cada vez que algo
                cambia. Usamos el id (string único), nunca el índice del array. */}
            {creditsData.map((credit) => (
              <CreditCard key={credit.id} {...credit} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
