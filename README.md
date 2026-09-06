# CreditSmart — Aplicación Web Dinámica con React

**Estudiante:** Jonatan Dair Ávila Agamez
**GitHub:** [@JonathanAgamez25](https://github.com/JonathanAgamez25)
**Curso:** Ingeniería Web I — S30-EA2
**Institución:** Institución Universitaria Digital de Antioquia (IU Digital)

## Descripción del proyecto

Evolución de la Actividad 1 (CreditSmart estático en HTML/CSS) a una aplicación
web dinámica con React. Los datos de los créditos ahora viven en un array de
objetos (`src/data/creditsData.js`), los componentes son reutilizables
(`CreditCard`, `Navbar`), y las tres páginas originales (Inicio, Simulador,
Solicitar) se manejan con React Router en vez de ser tres archivos `.html`
independientes.

### Funcionalidades nuevas respecto a la Actividad 1

- **Inicio:** el catálogo de créditos se genera con `.map()` sobre
  `creditsData`, usando el componente `CreditCard` con props.
- **Simulador:** búsqueda por nombre en tiempo real, filtro por rango de
  monto, y opción de ordenar por tasa de interés (menor a mayor), todo con
  `useState` + `.filter()` + `.sort()`. Muestra "No hay créditos disponibles"
  cuando el resultado es vacío.
- **Solicitar:** formulario 100% controlado con `useState`, validaciones en
  tiempo real (cédula, correo, teléfono, monto y plazo según el crédito
  elegido), cálculo automático de la cuota mensual estimada (sistema de cuota
  fija / amortización francesa) que se recalcula cada vez que cambian el
  monto o el plazo, resumen antes de enviar, mensaje de éxito, y limpieza
  automática del formulario. Las solicitudes se guardan en un array en
  memoria (`useState`), no se envían a ningún servidor.

## Tecnologías utilizadas

- React 19 + Vite
- React Router DOM (enrutamiento entre Inicio / Simulador / Solicitar)
- CSS3 (mismo sistema de diseño de la Actividad 1: paleta navy/ámbar,
  tipografías Space Grotesk + Inter + IBM Plex Mono, grid responsive)

## Estructura del proyecto

```
src/
├── components/
│   ├── CreditCard.jsx   # tarjeta de crédito reutilizable (recibe props)
│   └── Navbar.jsx       # barra de navegación con menú móvil (useState)
├── data/
│   └── creditsData.js   # los 5 productos de crédito como array de objetos
├── pages/
│   ├── Home.jsx         # catálogo de créditos (Inicio)
│   ├── Simulador.jsx    # búsqueda y filtros dinámicos
│   └── Solicitar.jsx    # formulario controlado + cálculo de cuota
├── utils/
│   └── finance.js       # formatCOP() y calcularCuotaMensual()
├── App.jsx              # configuración de rutas (React Router)
├── main.jsx             # punto de entrada
└── index.css            # estilos globales
```

## Instrucciones de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/JonathanAgamez25/credi_smart_desarrollo_web.git
cd credi_smart_desarrollo_web

# 2. Instalar dependencias
npm install

# 3. Correr en modo desarrollo
npm run dev
# abre http://localhost:5173

# 4. (Opcional) generar build de producción
npm run build
```

## Capturas de pantalla

_Pendiente: agregar capturas de las 3 páginas (Inicio, Simulador, Solicitar)
en escritorio y móvil, igual que en la Actividad 1, dentro de una carpeta
`screenshots/` y enlazarlas aquí._

## Nota sobre el uso de asistencia de IA

Se usó asistencia de IA (Claude) para generar la estructura inicial de los
componentes de React de este proyecto, declarado aquí conforme a la política
del curso. El código fue revisado y puede explicarse en detalle en la
sustentación: la fórmula de cálculo de cuota (amortización francesa), la
lógica de filtros con `.filter()`/`.sort()`, y el manejo de estado en el
formulario controlado están comentados directamente en cada archivo fuente.

## Trazabilidad entre talleres

La entrega original del primer taller se conserva en `legacy/`. La rama actual representa la evolución del proyecto hacia React, manteniendo la historia previa de GitHub y agregando la nueva implementación mediante commits posteriores.
