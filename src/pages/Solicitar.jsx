import { useState } from "react";
import creditsData from "../data/creditsData";
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

function validar(formData) {
  const errors = {};
  if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
  if (!/^\d{6,10}$/.test(formData.cedula)) {
    errors.cedula = "La cédula debe tener entre 6 y 10 dígitos.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }
  if (!/^\d{7,10}$/.test(formData.telefono)) {
    errors.telefono = "El teléfono debe tener entre 7 y 10 dígitos.";
  }
  if (!formData.tipoCredito) errors.tipoCredito = "Selecciona un tipo de crédito.";

  const creditoSeleccionado = creditsData.find(
    (credito) => credito.id === formData.tipoCredito
  );
  const monto = Number(formData.monto);
  const plazo = Number(formData.plazo);
  const ingresos = Number(formData.ingresos);

  if (!formData.monto || !Number.isFinite(monto) || monto <= 0) {
    errors.monto = "Ingresa un monto mayor que cero.";
  } else if (creditoSeleccionado && (monto < creditoSeleccionado.minAmount || monto > creditoSeleccionado.maxAmount)) {
    errors.monto = `El monto debe estar entre ${formatCOP(creditoSeleccionado.minAmount)} y ${formatCOP(creditoSeleccionado.maxAmount)}.`;
  }
  if (!formData.plazo || !Number.isFinite(plazo) || plazo <= 0) {
    errors.plazo = "Selecciona un plazo válido.";
  } else if (creditoSeleccionado && plazo > creditoSeleccionado.maxTermMonths) {
    errors.plazo = `El plazo máximo para este crédito es de ${creditoSeleccionado.maxTermMonths} meses.`;
  }
  if (!formData.ingresos || !Number.isFinite(ingresos) || ingresos <= 0) {
    errors.ingresos = "Ingresa tus ingresos mensuales.";
  }
  return errors;
}

function Solicitar() {
  const [formData, setFormData] = useState(valoresIniciales);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const creditoSeleccionado = creditsData.find(
    (credito) => credito.id === formData.tipoCredito
  );
  const cuotaEstimada = creditoSeleccionado
    ? calcularCuotaMensual(
        Number(formData.monto) || 0,
        creditoSeleccionado.rate,
        Number(formData.plazo) || 0
      )
    : 0;

  function handleChange(event) {
    const { name, value } = event.target;
    const siguienteFormData = { ...formData, [name]: value };
    const siguientesErrores = validar(siguienteFormData);
    setFormData(siguienteFormData);
    setErrors(siguientesErrores);
    setEnviado(false);
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function mostrarError(nombreCampo) {
    return touched[nombreCampo] ? errors[nombreCampo] : "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    const erroresActuales = validar(formData);
    setErrors(erroresActuales);
    setTouched(
      Object.keys(valoresIniciales).reduce(
        (campos, campo) => ({ ...campos, [campo]: true }),
        {}
      )
    );
    if (Object.keys(erroresActuales).length > 0) return;

    setSolicitudesEnviadas((prev) => [
      ...prev,
      { ...formData, cuotaEstimada, fecha: new Date().toISOString() },
    ]);
    setEnviado(true);
    setFormData(valoresIniciales);
    setErrors({});
    setTouched({});
  }

  function limpiarFormulario() {
    setFormData(valoresIniciales);
    setErrors({});
    setTouched({});
    setEnviado(false);
  }

  return (
    <section className="section" style={{ paddingTop: "var(--space-4)" }}>
      <div className="container">
        <div className="section-heading" style={{ textAlign: "center" }}>
          <h1>Solicitar crédito</h1>
          <p style={{ marginInline: "auto" }}>
            Completa los datos y observa cómo se actualiza la cuota mensual en tiempo real.
          </p>
        </div>

        {enviado && (
          <p className="success-message" role="status">
            Solicitud enviada correctamente. Se guardó en esta sesión.
          </p>
        )}

        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Datos personales</legend>
            <div className="form-grid">
              <CampoTexto label="Nombre completo" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} error={mostrarError("nombre")} wide />
              <CampoTexto label="Cédula" name="cedula" value={formData.cedula} onChange={handleChange} onBlur={handleBlur} error={mostrarError("cedula")} inputMode="numeric" />
              <CampoTexto label="Correo electrónico" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={mostrarError("email")} />
              <CampoTexto label="Teléfono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} onBlur={handleBlur} error={mostrarError("telefono")} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Datos del crédito</legend>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="tipo-credito">Tipo de crédito</label>
                <select id="tipo-credito" name="tipoCredito" value={formData.tipoCredito} onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(mostrarError("tipoCredito"))}>
                  <option value="">Selecciona un producto</option>
                  {creditsData.map((credito) => (
                    <option key={credito.id} value={credito.id}>{credito.name}</option>
                  ))}
                </select>
                {mostrarError("tipoCredito") && <span className="field-error">{mostrarError("tipoCredito")}</span>}
              </div>
              <CampoTexto label="Monto solicitado" name="monto" type="number" value={formData.monto} onChange={handleChange} onBlur={handleBlur} error={mostrarError("monto")} />
              <div className="field">
                <label htmlFor="plazo">Plazo en meses</label>
                <select id="plazo" name="plazo" value={formData.plazo} onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(mostrarError("plazo"))}>
                  <option value="">Selecciona un plazo</option>
                  {[12, 24, 36, 48, 60, 72, 84, 96, 120, 240].map((meses) => (
                    <option key={meses} value={meses}>{meses} meses</option>
                  ))}
                </select>
                {mostrarError("plazo") && <span className="field-error">{mostrarError("plazo")}</span>}
              </div>
              <div className="field field-wide">
                <label htmlFor="destino">Destino del crédito</label>
                <textarea id="destino" name="destino" value={formData.destino} onChange={handleChange} onBlur={handleBlur} placeholder="Cuéntanos brevemente para qué usarás el crédito" />
              </div>
            </div>
            {creditoSeleccionado && formData.monto && formData.plazo && (
              <div className="summary-box" aria-live="polite">
                <h4>Resumen de tu solicitud</h4>
                <p><strong>{creditoSeleccionado.name}</strong> · {formatCOP(Number(formData.monto))} a {formData.plazo} meses</p>
                <p className="summary-cuota">Cuota mensual estimada: <strong>{formatCOP(cuotaEstimada)}</strong></p>
                <small>Tasa efectiva anual aplicada: {(creditoSeleccionado.rate * 100).toFixed(1)}%.</small>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>Datos laborales</legend>
            <div className="form-grid">
              <CampoTexto label="Empresa donde trabaja" name="empresa" value={formData.empresa} onChange={handleChange} onBlur={handleBlur} wide />
              <CampoTexto label="Cargo" name="cargo" value={formData.cargo} onChange={handleChange} onBlur={handleBlur} />
              <CampoTexto label="Ingresos mensuales" name="ingresos" type="number" value={formData.ingresos} onChange={handleChange} onBlur={handleBlur} error={mostrarError("ingresos")} />
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block">Enviar solicitud</button>
            <button type="button" className="btn btn-outline btn-block" onClick={limpiarFormulario}>Limpiar formulario</button>
          </div>
        </form>

        {solicitudesEnviadas.length > 0 && (
          <p className="results-count" aria-live="polite">Solicitudes enviadas en esta sesión: {solicitudesEnviadas.length}</p>
        )}
      </div>
    </section>
  );
}

function CampoTexto({ label, name, value, onChange, onBlur, error, type = "text", inputMode, wide = false }) {
  return (
    <div className={`field${wide ? " field-wide" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} inputMode={inputMode} value={value} onChange={onChange} onBlur={onBlur} aria-invalid={Boolean(error)} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default Solicitar;
