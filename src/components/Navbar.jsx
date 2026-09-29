// Navbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-bar">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            CS
          </span>
          CreditSmart
        </NavLink>

        <button
          type="button"
          className="nav-toggle-label"
          aria-label={
            open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
          }
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span></span>
        </button>

        <nav aria-label="Navegación principal">
          <ul className={`nav-links ${open ? "nav-links-open" : ""}`}>
            <li>
              <NavLink to="/" end onClick={() => setOpen(false)}>
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink to="/simulador" onClick={() => setOpen(false)}>
                Simulador
              </NavLink>
            </li>
            <li>
              <NavLink to="/solicitar" onClick={() => setOpen(false)}>
                Solicitar crédito
              </NavLink>
            </li>
            <li>
              <NavLink to="/mis-solicitudes" onClick={() => setOpen(false)}>
                Mis solicitudes
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
