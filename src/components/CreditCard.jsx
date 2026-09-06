// CreditCard.jsx
// -----------------------------------------------------------------------------
// Este componente reemplaza el <article class="credit-card">...</article> que en
// la Actividad 1 estaba repetido 5 veces a mano en index.html y otras 5 veces en
// simulador.html (10 bloques de HTML casi idénticos). Ahora es UN solo componente
// que recibe los datos por props y se usa con .map() donde haga falta.
//
// Recibe el objeto "credit" completo y lo desestructura de una vez en los
// parámetros de la función (eso es "props con desestructuración").

import { Link } from "react-router-dom";
import { formatCOP } from "../utils/finance";

function CreditCard({
  name,
  description,
  rate,
  minAmount,
  maxAmount,
  maxTermMonths,
  icon,
}) {
  return (
    <article className="credit-card">
      <div className="credit-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="#E8A33D" strokeWidth="2">
          <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3>{name}</h3>
      <p className="credit-desc">{description}</p>

      {/* rate llega como decimal (0.135); toFixed(1) + "%" lo vuelve "13.5%" */}
      <div className="credit-rate">
        {(rate * 100).toFixed(1)}% <span>E.A.</span>
      </div>

      <div className="credit-meta">
        <div>
          <strong>
            {formatCOP(minAmount)} – {formatCOP(maxAmount)}
          </strong>
          Monto
        </div>
        <div>
          <strong>{maxTermMonths} meses</strong>
          Plazo máx.
        </div>
      </div>

      <div className="card-actions">
        <a href="#" className="btn btn-outline">
          Ver detalles
        </a>
        <Link to="/solicitar" className="btn btn-primary">
          Solicitar
        </Link>
      </div>
    </article>
  );
}

export default CreditCard;
