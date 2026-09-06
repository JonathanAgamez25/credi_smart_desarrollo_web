# Cómo ejecutar CreditSmart React

El proyecto está fijado a Vite 7, una versión compatible con Node.js 20.11.1. No actualices Vite manualmente a Vite 8 si mantienes esa versión de Node.

## Opción recomendada: Vite

La aplicación está construida con React y necesita que Vite procese los imports de React. Por eso no se debe abrir directamente el `index.html` con Live Server sobre la carpeta raíz.

Abre una terminal dentro de la carpeta que contiene `package.json` y ejecuta:

```bash
npm install
npm run dev
```

Después abre en el navegador la dirección que muestra la terminal, normalmente:

```text
http://localhost:5173/
```

Para que otros dispositivos de la red puedan acceder, puedes usar:

```bash
npm run dev -- --host
```

## Opción con Go Live

Si necesitas utilizar la extensión **Live Server / Go Live**, primero genera la versión compilada:

```bash
npm install
npm run build
```

Luego haz clic derecho sobre `dist/index.html` y selecciona **Open with Live Server**. No abras el `index.html` de la carpeta raíz, porque ese archivo usa imports que deben ser procesados por Vite.

## Si aparece una pantalla en blanco

Verifica que la terminal esté ubicada en la carpeta correcta, aquella que contiene `package.json`. También confirma que la dirección abierta sea la que entrega Vite y no una ruta `file:///...` ni el `index.html` raíz servido directamente por Live Server.

Si todavía no aparece contenido, abre las herramientas del navegador con `F12`, revisa la pestaña **Console** y busca errores en rojo. Los errores como `Failed to resolve import` indican que se abrió la aplicación sin pasar por Vite.
