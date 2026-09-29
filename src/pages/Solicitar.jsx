// src/pages/Solicitar.jsx
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { calcularCuotaMensual, formatCOP } from "../utils/finance";

const valoresIniciales = {
  nombre: "",
  cedula: "",
  email: "",
  telefono: "",
  tipoCredito: "",
  monto: "",
  plazo: "",
  destino: "",
  empresa: "",
  cargo: "",
  ingresos: "",
};

function validar(formData, creditos) {
  const errors = {};

  if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
  if (!/^\d{6,10}$/.test(formData.cedula))
    errors.cedula = "La cédula debe tener entre 6 y 10 dígitos.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    errors.email = "Ingresa un correo electrónico válido.";
  if (!/^\d{7,10}$/.test(formData.telefono))
    errors.telefono = "El teléfono debe tener entre 7 y 10 dígitos.";
  if (!formData.tipoCredito)
    errors.tipoCredito = "Selecciona un tipo de crédito.";

  const creditoSeleccionado = creditos.find(
    (c) => c.id === formData.tipoCredito,
  );

  if (!formData.monto) {
    errors.monto = "El monto es obligatorio.";
  } else if (creditoSeleccionado) {
    const monto = Number(formData.monto);
    if (
      monto < creditoSeleccionado.minAmount ||
      monto > creditoSeleccionado.maxAmount
    ) {
      errors.monto = `El monto debe estar entre ${formatCOP(
        creditoSeleccionado.minAmount,
      )} y ${formatCOP(creditoSeleccionado.maxAmount)} para este crédito.`;
    }
  }

  if (!formData.plazo) {
    errors.plazo = "Selecciona un plazo.";
  } else if (
    creditoSeleccionado &&
    Number(formData.plazo) > creditoSeleccionado.maxTermMonths
  ) {
    errors.plazo = `El plazo máximo para este crédito es ${creditoSeleccionado.maxTermMonths} meses.`;
  }

  return errors;
}

function Solicitar() {
  // ---- Estado del formulario ----
  const [formData, setFormData] = useState(valoresIniciales);
  const [errors, setErrors] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);

  // ---- Estado de los créditos cargados desde Firestore ----
  const [creditos, setCreditos] = useState([]);
  const [loadingCreditos, setLoadingCreditos] = useState(true);

  // Cargar catálogo de créditos una sola vez al montar
  useEffect(() => {
    async function cargarCreditos() {
      try {
        const snapshot = await getDocs(collection(db, "creditos"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCreditos(data);
      } catch (err) {
        console.error("Error al cargar créditos:", err);
      } finally {
        setLoadingCreditos(false);
      }
    }
    cargarCreditos();
  }, []);

  const creditoSeleccionado = creditos.find(
    (c) => c.id === formData.tipoCredito,
  );

  const cuotaEstimada = creditoSeleccionado
    ? calcularCuotaMensual(
        Number(formData.monto) || 0,
        creditoSeleccionado.rate,
        Number(formData.plazo) || 0,
      )
    : 0;

  function handleChange(e) {
    const { name, value } = e.target;
    const nuevoFormData = { ...formData, [name]: value };
    setFormData(nuevoFormData);
    setErrors((prev) => ({ ...prev, ...validar(nuevoFormData, creditos) }));
    setEnviado(false);
    setErrorEnvio(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // 1. Validar
    const erroresActuales = validar(formData, creditos);
    setErrors(erroresActuales);
    if (Object.keys(erroresActuales).length > 0) return;

    // 2. Guardar en Firestore
    try {
      setEnviando(true);
      setErrorEnvio(null);

      const nuevaSolicitud = {
        nombre: formData.nombre.trim(),
        cedula: formData.cedula,
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono,
        tipoCredito: formData.tipoCredito,
        nombreCredito: creditoSeleccionado?.name || "",
        monto: Number(formData.monto),
        plazo: Number(formData.plazo),
        destino: formData.destino.trim(),
        empresa: formData.empresa.trim(),
        cargo: formData.cargo.trim(),
        ingresos: Number(formData.ingresos) || 0,
        cuotaEstimada: Number(cuotaEstimada),
        fecha: serverTimestamp(),
      };

      await addDoc(collection(db, "solicitudes"), nuevaSolicitud);

      // 3. Éxito: limpiar y avisar
      setEnviado(true);
      setFormData(valoresIniciales);
      setErrors({});
    } catch (err) {
      console.error("Error al guardar solicitud:", err);
      setErrorEnvio(
        "No pudimos enviar tu solicitud. Verifica tu conexión e intenta de nuevo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: "var(--space-4)" }}>
      <div className="container">
        <div className="section-heading" style={{ textAlign: "center" }}>
          <h1>Solicitar crédito</h1>
          <p style={{ marginInline: "auto" }}>
            Completa los siguientes datos. Tu solicitud se guardará de forma
            segura.
          </p>
        </div>

        {enviado && (
          <p className="success-message" role="status">
            ✅ ¡Solicitud enviada correctamente! Hemos recibido tu información.
          </p>
        )}

        {errorEnvio && (
          <p className="error-state" role="alert">
            ❌ {errorEnvio}
          </p>
        )}

        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Datos personales</legend>
            <div className="form-grid">
              <div className="field field-wide">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Jonatan Dair Ávila Agamez"
                  value={formData.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && (
                  <span className="field-error">{errors.nombre}</span>
                )}
              </div>

              <div className="field">
                <label htmlFor="cedula">Cédula</label>
                <input
                  type="text"
                  inputMode="numeric"
                  id="cedula"
                  name="cedula"
                  placeholder="Ej: 1002345678"
                  value={formData.cedula}
                  onChange={handleChange}
                />
                {errors.cedula && (
                  <span className="field-error">{errors.cedula}</span>
                )}
              </div>

              <div className="field">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="nombre@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              <div className="field">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="Ej: 3001234567"
                  value={formData.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && (
                  <span className="field-error">{errors.telefono}</span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Datos del crédito</legend>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="tipo-credito">Tipo de crédito</label>
                <select
                  id="tipo-credito"
                  name="tipoCredito"
                  value={formData.tipoCredito}
                  onChange={handleChange}
                  disabled={loadingCreditos}
                >
                  <option value="">
                    {loadingCreditos
                      ? "Cargando créditos..."
                      : "Selecciona un producto"}
                  </option>
                  {creditos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.tipoCredito && (
                  <span className="field-error">{errors.tipoCredito}</span>
                )}
              </div>

              <div className="field">
                <label htmlFor="monto">Monto solicitado</label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  placeholder="Ej: 15000000"
                  value={formData.monto}
                  onChange={handleChange}
                />
                {errors.monto && (
                  <span className="field-error">{errors.monto}</span>
                )}
              </div>

              <div className="field">
                <label htmlFor="plazo">Plazo en meses</label>
                <select
                  id="plazo"
                  name="plazo"
                  value={formData.plazo}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un plazo</option>
                  {[12, 24, 36, 48, 60, 72, 84, 96, 120, 240].map((meses) => (
                    <option key={meses} value={meses}>
                      {meses} meses
                    </option>
                  ))}
                </select>
                {errors.plazo && (
                  <span className="field-error">{errors.plazo}</span>
                )}
              </div>

              <div className="field field-wide">
                <label htmlFor="destino">Destino del crédito</label>
                <textarea
                  id="destino"
                  name="destino"
                  placeholder="Cuéntanos brevemente para qué usarás el crédito"
                  value={formData.destino}
                  onChange={handleChange}
                />
              </div>
            </div>

            {creditoSeleccionado && formData.monto && formData.plazo && (
              <div className="summary-box">
                <h4>Resumen de tu solicitud</h4>
                <p>
                  <strong>{creditoSeleccionado.name}</strong> ·{" "}
                  {formatCOP(Number(formData.monto))} a {formData.plazo} meses
                </p>
                <p className="summary-cuota">
                  Cuota mensual estimada:{" "}
                  <strong>{formatCOP(cuotaEstimada)}</strong>
                </p>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>Datos laborales</legend>
            <div className="form-grid">
              <div className="field field-wide">
                <label htmlFor="empresa">Empresa donde trabaja</label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  placeholder="Nombre de la empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="cargo">Cargo</label>
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  placeholder="Ej: Analista"
                  value={formData.cargo}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="ingresos">Ingresos mensuales</label>
                <input
                  type="number"
                  id="ingresos"
                  name="ingresos"
                  placeholder="Ej: 3500000"
                  value={formData.ingresos}
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Enviar solicitud"}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={() => {
                setFormData(valoresIniciales);
                setErrors({});
                setEnviado(false);
                setErrorEnvio(null);
              }}
            >
              Limpiar formulario
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Solicitar;
