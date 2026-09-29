// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Simulador from "./pages/Simulador";
import Solicitar from "./pages/Solicitar";
import MisSolicitudes from "./pages/MisSolicitudes";

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
          <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>&copy; 2026 CreditSmart · FinTech Solutions S.A.S.</span>
          <span>Proyecto académico — Ingeniería Web I</span>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;
