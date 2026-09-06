# Guía de sustentación — CreditSmart React

## Presentación sugerida

“Mi proyecto se llama CreditSmart y permite consultar productos de crédito, filtrar alternativas y registrar una solicitud simulada. La aplicación está desarrollada en React y utiliza componentes, estados y eventos para actualizar la interfaz sin recargar la página.”

## 1. Manejo de estado con useState

En `src/pages/Simulador.jsx` se utilizan estados separados para `searchTerm`, `rangoMonto`, `ordenarPor` y `soloDestacados`. Cada estado tiene una responsabilidad clara y se actualiza mediante su setter correspondiente. En `src/pages/Solicitar.jsx`, `formData` contiene los valores del formulario, `errors` los mensajes de validación, `touched` controla cuándo mostrar cada error, `solicitudesEnviadas` almacena las solicitudes de la sesión y `enviado` controla el mensaje de éxito.

Una explicación útil durante la sustentación es: “Separé los estados por responsabilidad para que cada interacción actualice únicamente la información que necesita. Por ejemplo, escribir en el buscador modifica `searchTerm`, mientras que seleccionar un rango modifica `rangoMonto`.”

## 2. Búsqueda y filtros dinámicos

En el simulador, el campo de búsqueda utiliza `value={searchTerm}` y `onChange={...}`. Por esa razón, la lista se filtra mientras el usuario escribe. La expresión de filtrado busca tanto en el nombre como en la descripción del crédito. Luego se aplican filtros adicionales para el rango de monto y para mostrar tasas de hasta 10,2% E.A. El botón “Limpiar filtros” restablece todos los estados a sus valores iniciales.

Para demostrarlo, escribe “vivienda”, selecciona un rango, cambia el orden y finalmente pulsa “Limpiar filtros”.

## 3. Formulario controlado

En `src/pages/Solicitar.jsx`, cada campo recibe su valor desde `formData` y actualiza ese objeto mediante `handleChange`. El evento `onSubmit` utiliza `event.preventDefault()` para evitar la recarga del navegador. La función `validar` comprueba nombre, cédula, correo, teléfono, tipo de crédito, monto, plazo e ingresos. La validación se ejecuta al cambiar los campos y los errores se muestran después de que el campo fue visitado o cuando se intenta enviar.

Para demostrarlo, intenta enviar el formulario vacío, escribe un correo inválido y después corrígelo. Finalmente completa los datos correctamente, envía la solicitud y muestra que el formulario se limpia.

## 4. Manipulación de arrays

El proyecto usa `.map()` para crear las tarjetas de crédito, las opciones del tipo de crédito y los plazos. Cada elemento tiene una `key` única, como `credit.id` o el número de meses. Usa `.filter()` para la búsqueda y los filtros combinados. Usa `.sort()` para ordenar por tasa menor, tasa mayor o monto máximo. También usa `.find()` para obtener el crédito seleccionado y aplicar su tasa, monto máximo y plazo máximo.

## 5. Cálculo de cuota mensual

La cuota se calcula en `src/utils/finance.js` mediante el sistema de cuota fija. La tasa efectiva anual del crédito seleccionado se convierte a tasa efectiva mensual y se aplica la fórmula de amortización francesa. En el formulario, `cuotaEstimada` se recalcula en cada render usando el monto, la tasa del producto y el plazo actuales. Por eso el valor cambia inmediatamente al modificar cualquiera de esos campos. El resultado se presenta con `formatCOP`, usando formato de pesos colombianos.

Durante la sustentación, selecciona un crédito, ingresa un monto y elige un plazo. Después cambia el monto o el plazo y explica que la cuota se actualiza automáticamente sin pulsar un botón adicional.

## Cierre sugerido

“Con esta implementación se aplican los fundamentos de React solicitados: estados controlados con `useState`, eventos `onChange`, formularios controlados, validación, filtros en tiempo real y transformación de arrays mediante `map`, `filter`, `sort` y `find`. Además, el cálculo financiero depende del producto seleccionado y se muestra en pesos colombianos.”

## Archivos clave para mostrar

| Criterio | Archivo | Evidencia |
|---|---|---|
| Estado y filtros | `src/pages/Simulador.jsx` | Estados, `onChange`, `filter`, `sort` |
| Formulario controlado | `src/pages/Solicitar.jsx` | `formData`, `handleChange`, `handleSubmit` |
| Cuota mensual | `src/utils/finance.js` | `calcularCuotaMensual` y `formatCOP` |
| Datos y `map` | `src/data/creditsData.js` | Array de productos con tasas y límites |
