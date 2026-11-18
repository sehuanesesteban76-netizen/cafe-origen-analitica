# Bitácora · Café Origen Analítica

Registro de análisis, decisiones y pruebas del proyecto. Cada sección corresponde a un MiniReto.

---

## MiniReto 1 · Primer tueste: el repositorio y los datos

### Qué representa cada registro

Cada objeto del arreglo `ventas` es una **línea de venta**: un cliente compró, en una fecha y una ciudad, cierta cantidad de un producto a un precio unitario. Un mismo cliente puede tener varias líneas (varias compras en días distintos).

Lo observado en la muestra: 12 registros, fechas del 2026-09-01 al 2026-09-06 (dos registros por día), 8 clientes distintos, 5 productos y 4 ciudades reales.

### Diccionario de datos

| Propiedad  | Tipo                  | Significado                                                                                                 | Ejemplo                |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------- |
| `id`       | number (entero)       | Identificador único del registro. Va del 1 al 12, sin saltos ni repetidos.                                  | `1`                    |
| `fecha`    | string (`AAAA-MM-DD`) | Día de la venta. Es texto, no un objeto `Date`; el formato ISO permite compararlas y ordenarlas como texto. | `"2026-09-01"`         |
| `cliente`  | string                | Código anónimo del cliente (C01 a C08). Se repite entre registros.                                          | `"C01"`                |
| `producto` | string                | Nombre comercial del producto vendido.                                                                      | `"Origen Huila 500 g"` |
| `ciudad`   | string                | Ciudad donde se registró la venta. Es texto libre, sin estandarizar.                                        | `"Medellín"`           |
| `cantidad` | number (entero)       | Unidades vendidas en esa línea.                                                                             | `2`                    |
| `precio`   | number (entero, COP)  | Precio **unitario** en pesos colombianos, sin decimales.                                                    | `42000`                |

Campo derivado (no viene en los datos): **valor de la venta = cantidad × precio**. No existe un campo de total; hay que calcularlo. Con la muestra completa, la suma de esos valores es 985.000.

### Posición frente a índice

El reto pide el producto del registro "en la posición 4". La **posición** es conteo humano (1.º, 2.º, 3.º, 4.º) y el **índice** de un arreglo en JavaScript empieza en 0. Por eso:

| Posición (humano) | Índice (JS)                                | Registro | Producto               |
| ----------------- | ------------------------------------------ | -------- | ---------------------- |
| 1                 | `ventas[0]`                                | id 1     | Origen Huila 500 g     |
| 4                 | `ventas[3]`                                | id 4     | **Origen Huila 500 g** |
| 5                 | `ventas[4]`                                | id 5     | Origen Sierra 500 g    |
| 12 (última)       | `ventas[ventas.length - 1]` = `ventas[11]` | id 12    | Origen Nariño 250 g    |

Regla: `índice = posición − 1`. Confundirlos es un error típico "por uno" (off-by-one): `ventas[4]` devuelve el quinto registro, no el cuarto, y `ventas[ventas.length]` devuelve `undefined`.

### Casos borde detectados

| #   | Problema                              | Dónde                                                               | Riesgo                                                                                                                           | Decisión                                                                                                                                                                                                                  |
| --- | ------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Ciudad escrita de forma inconsistente | id 5: `"medellín"` (minúscula) frente a `"Medellín"`                | Al agrupar aparecerían dos Medellín y una búsqueda por `"Medellín"` omitiría 135.000.                                            | No se corrige en `datos.js`. Se normaliza al comparar y agrupar (quitar espacios sobrantes, minúsculas, sin tildes en la clave) y se muestra con la regla de negocio: primera letra en mayúscula y el resto en minúscula. |
| 2   | Cantidad en cero                      | id 8: C06, Cali, Origen Huila 500 g, `cantidad: 0`, `precio: 42000` | Si se cuenta como venta, infla el número de ventas y baja el ticket promedio. Puede ser una venta anulada o un error de captura. | Se conserva el registro. Aporta 0 al total y a las unidades, pero **no** es una venta válida: se excluye del ticket promedio y de la venta mayor. El reporte lo muestra como "registro sin unidades".                     |
| 3   | Clientes repetidos                    | C01 en ids 1, 4 y 11; C02 en ids 2 y 7; C03 en ids 3 y 9            | 12 registros no son 12 clientes (son 8). Confundir "ventas" con "clientes" daría un gasto por cliente incorrecto.                | El ticket promedio se calcula por compra (registro válido), no por cliente. Si se pide gasto por cliente, se agrupa por `cliente`.                                                                                        |
| 4   | No hay total por registro             | Todos                                                               | Sumar `precio` directamente ignora la cantidad (daría 646.000 y no 985.000).                                                     | Un único cálculo: `valorVenta(venta) = cantidad × precio`, usado por todas las funciones.                                                                                                                                 |
| 5   | La fecha es texto                     | Todos                                                               | Comparar con formatos distintos (`"4/9/2026"`) no encontraría nada; restar fechas como texto no funciona.                        | Se compara el texto exacto (sin espacios sobrantes) y se valida el formato `AAAA-MM-DD` al consultar un día.                                                                                                              |
| 6   | Espacios sobrantes en textos          | No aparece en la muestra, pero es común al exportar                 | `"Bogotá"` y `"Bogotá "` serían ciudades distintas.                                                                              | `trim()` y colapsar espacios internos antes de comparar. (El error reportado en el MiniReto 4 confirma este riesgo.)                                                                                                      |

---

## MiniReto 2 · Los números del día: recorrer, filtrar y acumular

### Plan en pseudocódigo

Función auxiliar de normalización usada en las comparaciones:

```
normalizar(texto)
  quitar espacios al inicio y al final; dejar un solo espacio entre palabras
  pasar a minúsculas; quitar tildes
```

```
valorVenta(venta)
  RETORNAR venta.cantidad × venta.precio      (si falta un número, usar 0)

totalVendido(ventas)                           patrón ACUMULADOR
  total ← 0
  PARA CADA venta EN ventas
    total ← total + valorVenta(venta)
  RETORNAR total

unidadesVendidas(ventas)                       patrón ACUMULADOR
  unidades ← 0
  PARA CADA venta EN ventas
    unidades ← unidades + venta.cantidad
  RETORNAR unidades

ventaMayor(ventas)                             patrón MÁXIMO
  mayor ← null                                 (todavía no hay candidata)
  PARA CADA venta EN ventas
    SI venta.cantidad <= 0 → pasar a la siguiente
    SI mayor es null O valorVenta(venta) > valorVenta(mayor)
      mayor ← venta                            (se guarda el registro completo)
  RETORNAR mayor

ticketPromedio(ventas)                         ACUMULADOR + CONTADOR
  total ← 0 ; validas ← 0
  PARA CADA venta EN ventas
    SI venta.cantidad > 0
      total ← total + valorVenta(venta)
      validas ← validas + 1
  SI validas = 0 → RETORNAR 0                  (evita 0 / 0 = NaN)
  RETORNAR total / validas

ventasPorCiudad(ventas, ciudad)                ACUMULADOR con condición
  buscada ← normalizar(ciudad)
  SI buscada está vacía → RETORNAR 0
  total ← 0
  PARA CADA venta EN ventas
    SI normalizar(venta.ciudad) = buscada
      total ← total + valorVenta(venta)
  RETORNAR total
```

| Función            | Qué recorre      | Condición                                | Qué acumula                            | Valor inicial |
| ------------------ | ---------------- | ---------------------------------------- | -------------------------------------- | ------------- |
| `totalVendido`     | todas las ventas | ninguna                                  | valor de cada venta                    | `0`           |
| `unidadesVendidas` | todas las ventas | ninguna                                  | cantidad de cada venta                 | `0`           |
| `ventaMayor`       | todas las ventas | cantidad > 0 y valor mayor que el actual | el registro de mayor valor             | `null`        |
| `ticketPromedio`   | todas las ventas | cantidad > 0                             | valor total y número de ventas válidas | `0` y `0`     |
| `ventasPorCiudad`  | todas las ventas | ciudad normalizada = ciudad buscada      | valor de cada venta que cumple         | `0`           |

### Comportamiento con el arreglo vacío (decisión documentada)

| Función                 | Con `[]` devuelve | Por qué                                                                                                                                                               |
| ----------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `totalVendido`          | `0`               | No se vendió nada.                                                                                                                                                    |
| `unidadesVendidas`      | `0`               | No salió ninguna unidad.                                                                                                                                              |
| `ventaMayor`            | `null`            | No hay ningún registro que devolver; inventar uno sería falso. Quien la use debe revisar si es `null`. También devuelve `null` si todas las ventas tienen cantidad 0. |
| `ticketPromedio`        | `0`               | Dividir entre 0 ventas da `NaN`. Se decide que `0` significa "sin ventas válidas".                                                                                    |
| `ventasPorCiudad`       | `0`               | No hay ventas en ninguna ciudad. Una ciudad vacía también devuelve `0`.                                                                                               |
| `valorVenta(undefined)` | `0`               | Un registro ausente no aporta valor.                                                                                                                                  |

En empate de la venta mayor gana la primera encontrada (se usa `>` y no `>=`).

### Pruebas con tres entradas

Se ejecutan con `node src/pruebas.js` (incluye 17 comprobaciones automáticas). Como arreglo de un elemento se usa `[ventas[0]]`.

| Función                          | Completo (12)   | Un elemento   | Vacío  |
| -------------------------------- | --------------- | ------------- | ------ |
| `totalVendido`                   | 985.000         | 84.000        | 0      |
| `unidadesVendidas`               | 21              | 2             | 0      |
| `ventaMayor`                     | id 10 (168.000) | id 1 (84.000) | `null` |
| `ticketPromedio`                 | 89.545,45       | 84.000        | 0      |
| `ventasPorCiudad(…, "Medellín")` | 356.000         | 84.000        | 0      |

### Traza manual 1 · `totalVendido(ventas)`

| Iteración | id  | cantidad × precio | valorVenta | total acumulado |
| --------- | --- | ----------------- | ---------- | --------------- |
| inicio    |     |                   |            | 0               |
| 1         | 1   | 2 × 42.000        | 84.000     | 84.000          |
| 2         | 2   | 1 × 26.000        | 26.000     | 110.000         |
| 3         | 3   | 1 × 95.000        | 95.000     | 205.000         |
| 4         | 4   | 1 × 42.000        | 42.000     | 247.000         |
| 5         | 5   | 3 × 45.000        | 135.000    | 382.000         |
| 6         | 6   | 2 × 26.000        | 52.000     | 434.000         |
| 7         | 7   | 1 × 120.000       | 120.000    | 554.000         |
| 8         | 8   | 0 × 42.000        | 0          | 554.000         |
| 9         | 9   | 2 × 45.000        | 90.000     | 644.000         |
| 10        | 10  | 4 × 42.000        | 168.000    | 812.000         |
| 11        | 11  | 1 × 95.000        | 95.000     | 907.000         |
| 12        | 12  | 3 × 26.000        | 78.000     | **985.000**     |

Resultado del programa: `985000`. **Coincide.**

### Traza manual 2 · `ventasPorCiudad(ventas, "Medellín")`

`buscada = normalizar("Medellín") = "medellin"`

| id     | ciudad original | normalizada | ¿coincide? | valorVenta | total       |
| ------ | --------------- | ----------- | ---------- | ---------- | ----------- |
| inicio |                 |             |            |            | 0           |
| 1      | Medellín        | medellin    | sí         | 84.000     | 84.000      |
| 2      | Bogotá          | bogota      | no         |            | 84.000      |
| 3      | Cali            | cali        | no         |            | 84.000      |
| 4      | Medellín        | medellin    | sí         | 42.000     | 126.000     |
| 5      | **medellín**    | medellin    | **sí**     | 135.000    | 261.000     |
| 6      | Bogotá          | bogota      | no         |            | 261.000     |
| 7      | Bogotá          | bogota      | no         |            | 261.000     |
| 8      | Cali            | cali        | no         |            | 261.000     |
| 9      | Cali            | cali        | no         |            | 261.000     |
| 10     | Pereira         | pereira     | no         |            | 261.000     |
| 11     | Medellín        | medellin    | sí         | 95.000     | 356.000     |
| 12     | Bogotá          | bogota      | no         |            | **356.000** |

Resultado del programa: `356000`. **Coincide**, y confirma que la venta escrita como "medellín" se incluye.

### Traza manual 3 · `ventaMayor(ventas)`

| id     | valor   | ¿válida?            | ¿mayor que el actual? | mayor después |
| ------ | ------- | ------------------- | --------------------- | ------------- |
| inicio |         |                     |                       | `null`        |
| 1      | 84.000  | sí                  | sí (no había)         | id 1          |
| 2      | 26.000  | sí                  | no                    | id 1          |
| 3      | 95.000  | sí                  | sí                    | id 3          |
| 4      | 42.000  | sí                  | no                    | id 3          |
| 5      | 135.000 | sí                  | sí                    | id 5          |
| 6      | 52.000  | sí                  | no                    | id 5          |
| 7      | 120.000 | sí                  | no                    | id 5          |
| 8      | 0       | **no** (cantidad 0) | se salta              | id 5          |
| 9      | 90.000  | sí                  | no                    | id 5          |
| 10     | 168.000 | sí                  | sí                    | id 10         |
| 11     | 95.000  | sí                  | no                    | id 10         |
| 12     | 78.000  | sí                  | no                    | **id 10**     |

Resultado del programa: registro con `id 10` (Origen Huila 500 g, Pereira, 4 × 42.000 = 168.000). **Coincide.**

Ticket promedio a mano: 985.000 ÷ 11 ventas válidas = 89.545,45. Resultado del programa: `89545.45454545454`. **Coincide.**

---