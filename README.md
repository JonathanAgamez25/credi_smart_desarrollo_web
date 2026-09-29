# CreditSmart — Integración con Firebase Firestore

**Estudiante:** Jonatan Dair Ávila Agamez
**GitHub:** [@JonathanAgamez25](https://github.com/JonathanAgamez25)
**Curso:** Ingeniería Web I — S40-EA3
**Institución:** Institución Universitaria Digital de Antioquia (IU Digital)

## Descripción del proyecto

Evolución de las actividades anteriores (CreditSmart estático en HTML/CSS →
aplicación React dinámica) a una aplicación web **full-stack** con backend en
la nube. Ahora el catálogo de créditos y las solicitudes **viven en Firestore**
(NoSQL), no en archivos locales.

### Funcionalidades nuevas respecto al Taller 2

- **Firestore (NoSQL):** dos colecciones — `creditos` y `solicitudes`.
- **READ:** el catálogo de créditos se carga desde Firestore con `getDocs()`,
  con `loading state`, manejo de errores y mapeo de IDs de documento.
- **CREATE:** el formulario de solicitud guarda cada envío en Firestore con
  `addDoc()`, con validaciones, `serverTimestamp()` y limpieza del formulario
  tras el éxito.
- **QUERIES:** nueva página **"Mis Solicitudes"** que consulta Firestore con
  `where("email", "==", ...)` + `orderBy("fecha", "desc")`, incluyendo índice
  compuesto.
- **Seguridad:** las credenciales se manejan con variables de entorno
  (`import.meta.env.VITE_*`), y el archivo `.env` está en `.gitignore`.

## Tecnologías utilizadas

- React 19 + Vite
- React Router DOM
- **Firebase 11** (Firestore)
- CSS3 (mismo sistema de diseño de actividades anteriores: navy/ámbar,
  tipografías Space Grotesk + Inter + IBM Plex Mono, grid responsive)

## Estructura del proyecto

src/
├── components/
│ ├── CreditCard.jsx # tarjeta de crédito reutilizable
│ └── Navbar.jsx # barra de navegación
├── data/
│ └── creditsData.js # (legacy - ya no se usa, migrado a Firestore)
├── pages/
│ ├── Home.jsx # catálogo (READ desde Firestore)
│ ├── Simulador.jsx # filtros sobre datos de Firestore
│ ├── Solicitar.jsx # formulario (CREATE en Firestore)
│ └── MisSolicitudes.jsx # queries por email (READ filtrado)
├── utils/
│ └── finance.js # formatCOP() y calcularCuotaMensual()
├── firebase.js # inicializa Firebase + exporta db
├── App.jsx # rutas (React Router)
├── main.jsx # entry point
└── index.css # estilos globales

text

## Estructura de Firestore

### Colección `creditos`

Cada documento contiene:

| Campo           | Tipo   | Ejemplo                      |
| --------------- | ------ | ---------------------------- |
| `name`          | string | `"Crédito Vehículo"`         |
| `description`   | string | `"Financia hasta el 90%..."` |
| `rate`          | number | `0.102` (10.2% E.A.)         |
| `minAmount`     | number | `5000000`                    |
| `maxAmount`     | number | `120000000`                  |
| `maxTermMonths` | number | `72`                         |
| `icon`          | string | path SVG                     |

**Reglas:** `allow read: if true; allow write: if false;` (catálogo público, solo admin puede editar desde la consola).

### Colección `solicitudes`

Cada documento contiene:

| Campo                                         | Tipo                        |
| --------------------------------------------- | --------------------------- |
| `nombre`, `cedula`, `email`, `telefono`       | string                      |
| `tipoCredito`, `nombreCredito`                | string                      |
| `monto`, `plazo`, `ingresos`, `cuotaEstimada` | number                      |
| `destino`, `empresa`, `cargo`                 | string                      |
| `fecha`                                       | timestamp (serverTimestamp) |

**Reglas:** `allow read: if true; allow create: if true; allow update, delete: if false;`

### Índice compuesto

La query `where("email", "==", ...)` + `orderBy("fecha", "desc")` requiere un
índice compuesto en Firestore:

- Colección: `solicitudes`
- Campo 1: `email` (Ascendente)
- Campo 2: `fecha` (Descendente)

## Instrucciones de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/JonathanAgamez25/credi_smart_desarrollo_web.git
cd credi_smart_desarrollo_web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env y llenar con las credenciales de tu proyecto Firebase.

# 4. Correr en modo desarrollo
npm run dev
# abre http://localhost:5173

# 5. (Opcional) build de producción
npm run build
```
