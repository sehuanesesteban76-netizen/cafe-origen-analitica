# Bitácora · Café Origen Analítica

Registro de análisis, decisiones y pruebas del proyecto. Cada sección corresponde a un MiniReto.

---

## MiniReto 1 · Primer tueste: el repositorio y los datos

### Qué representa cada registro

Cada objeto del arreglo `ventas` es una **línea de venta**: un cliente compró, en una fecha y una ciudad, cierta cantidad de un producto a un precio unitario. Un mismo cliente puede tener varias líneas (varias compras en días distintos).

Lo observado en la muestra: 12 registros, fechas del 2026-09-01 al 2026-09-06 (dos registros por día), 8 clientes distintos, 5 productos y 4 ciudades reales.

### Diccionario de datos

| Propiedad | Tipo | Significado | Ejemplo |
|---|---|---|---|
| `id` | number (entero) | Identificador único del registro. Va del 1 al 12, sin saltos ni repetidos. | `1` |
| `fecha` | string (`AAAA-MM-DD`) | Día de la venta. Es texto, no un objeto `Date`; el formato ISO permite compararlas y ordenarlas como texto. | `"2026-09-01"` |
| `cliente` | string | Código anónimo del cliente (C01 a C08). Se repite entre registros. | `"C01"` |
| `producto` | string | Nombre comercial del producto vendido. | `"Origen Huila 500 g"` |
| `ciudad` | string | Ciudad donde se registró la venta. Es texto libre, sin estandarizar. | `"Medellín"` |
| `cantidad` | number (entero) | Unidades vendidas en esa línea. | `2` |
| `precio` | number (entero, COP) | Precio **unitario** en pesos colombianos, sin decimales. | `42000` |

Campo derivado (no viene en los datos): **valor de la venta = cantidad × precio**. No existe un campo de total; hay que calcularlo. Con la muestra completa, la suma de esos valores es 985.000.

### Posición frente a índice

El reto pide el producto del registro "en la posición 4". La **posición** es conteo humano (1.º, 2.º, 3.º, 4.º) y el **índice** de un arreglo en JavaScript empieza en 0. Por eso:

| Posición (humano) | Índice (JS) | Registro | Producto |
|---|---|---|---|
| 1 | `ventas[0]` | id 1 | Origen Huila 500 g |
| 4 | `ventas[3]` | id 4 | **Origen Huila 500 g** |
| 5 | `ventas[4]` | id 5 | Origen Sierra 500 g |
| 12 (última) | `ventas[ventas.length - 1]` = `ventas[11]` | id 12 | Origen Nariño 250 g |

Regla: `índice = posición − 1`. Confundirlos es un error típico "por uno" (off-by-one): `ventas[4]` devuelve el quinto registro, no el cuarto, y `ventas[ventas.length]` devuelve `undefined`.

### Casos borde detectados

| # | Problema | Dónde | Riesgo | Decisión |
|---|---|---|---|---|
| 1 | Ciudad escrita de forma inconsistente | id 5: `"medellín"` (minúscula) frente a `"Medellín"` | Al agrupar aparecerían dos Medellín y una búsqueda por `"Medellín"` omitiría 135.000. | No se corrige en `datos.js`. Se normaliza al comparar y agrupar (quitar espacios sobrantes, minúsculas, sin tildes en la clave) y se muestra con la regla de negocio: primera letra en mayúscula y el resto en minúscula. |
| 2 | Cantidad en cero | id 8: C06, Cali, Origen Huila 500 g, `cantidad: 0`, `precio: 42000` | Si se cuenta como venta, infla el número de ventas y baja el ticket promedio. Puede ser una venta anulada o un error de captura. | Se conserva el registro. Aporta 0 al total y a las unidades, pero **no** es una venta válida: se excluye del ticket promedio y de la venta mayor. El reporte lo muestra como "registro sin unidades". |
| 3 | Clientes repetidos | C01 en ids 1, 4 y 11; C02 en ids 2 y 7; C03 en ids 3 y 9 | 12 registros no son 12 clientes (son 8). Confundir "ventas" con "clientes" daría un gasto por cliente incorrecto. | El ticket promedio se calcula por compra (registro válido), no por cliente. Si se pide gasto por cliente, se agrupa por `cliente`. |
| 4 | No hay total por registro | Todos | Sumar `precio` directamente ignora la cantidad (daría 646.000 y no 985.000). | Un único cálculo: `valorVenta(venta) = cantidad × precio`, usado por todas las funciones. |
| 5 | La fecha es texto | Todos | Comparar con formatos distintos (`"4/9/2026"`) no encontraría nada; restar fechas como texto no funciona. | Se compara el texto exacto (sin espacios sobrantes) y se valida el formato `AAAA-MM-DD` al consultar un día. |
| 6 | Espacios sobrantes en textos | No aparece en la muestra, pero es común al exportar | `"Bogotá"` y `"Bogotá "` serían ciudades distintas. | `trim()` y colapsar espacios internos antes de comparar. (El error reportado en el MiniReto 4 confirma este riesgo.) |

---