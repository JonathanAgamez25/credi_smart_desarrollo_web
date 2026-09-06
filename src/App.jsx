// App.jsx
// -----------------------------------------------------------------------------
// Antes teniamos 3 archivos .html separados (index.html, simulador.html,
// solicitar.html), cada uno con su propio <header> copiado y pegado.
// Con React Router, el <Navbar /> se escribe UNA vez aqui, fuera de <Routes>,
// y se queda fijo en pantalla mientras <Routes> cambia solo el contenido de
// abajo segun la URL. Eso es lo que en React se llama "layout persistente".

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Simulador from "./pages/Simulador";
import Solicitar from "./pages/Solicitar";

function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route path="/solicitar" element={<Solicitar />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>&copy; 2026 CreditSmart · FinTech Solutions S.A.S.</span>
          <span>Proyecto academico — Ingenieria Web I</span>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;
