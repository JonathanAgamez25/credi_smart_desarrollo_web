// Navbar.jsx
// -----------------------------------------------------------------------------
// En la Actividad 1 el menú móvil se abría/cerraba con el "truco del checkbox
// oculto" (solo CSS, sin JavaScript), documentado a propósito porque esa
// actividad pedía "sin JS". Ahora que SÍ estamos usando React, lo natural es
// controlar ese mismo comportamiento con un hook useState: el estado "open"
// dice si el menú está abierto, y el botón lo cambia con setOpen().
//
// NavLink (en vez de Link normal) le agrega automáticamente la clase/atributo
// activo a la página en la que estás — reemplaza el aria-current="page" que
// antes había que escribir a mano en cada archivo .html.

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
          aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
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
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
