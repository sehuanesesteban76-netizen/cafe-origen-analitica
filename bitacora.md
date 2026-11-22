# Bitácora · Café Origen Analítica

Registro de análisis, decisiones y pruebas del proyecto. Cada sección corresponde a un MiniReto.

---

## MiniReto 1 · Primer tueste: el repositorio y los datos

### Qué representa cada registro

Cada objeto del arreglo ventas es una **línea de venta**: un cliente compró, en una fecha y una ciudad, cierta cantidad de un producto a un precio unitario. Un mismo cliente puede tener varias líneas (varias compras en días distintos).

Lo observado en la muestra: 12 registros, fechas del 2026-09-01 al 2026-09-06 (dos registros por día), 8 clientes distintos, 5 productos y 4 ciudades reales.

### Diccionario de datos

| Propiedad  | Tipo                  | Significado                                                                                                 | Ejemplo                |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------- |
| id       | number (entero)       | Identificador único del registro. Va del 1 al 12, sin saltos ni repetidos.                                  | 1                    |
| fecha    | string (AAAA-MM-DD) | Día de la venta. Es texto, no un objeto Date; el formato ISO permite compararlas y ordenarlas como texto. | "2026-09-01"         |
| cliente  | string                | Código anónimo del cliente (C01 a C08). Se repite entre registros.                                          | "C01"                |
| producto | string                | Nombre comercial del producto vendido.                                                                      | "Origen Huila 500 g" |
| ciudad   | string                | Ciudad donde se registró la venta. Es texto libre, sin estandarizar.                                        | "Medellín"           |
| cantidad | number (entero)       | Unidades vendidas en esa línea.                                                                             | 2                    |
| precio   | number (entero, COP)  | Precio **unitario** en pesos colombianos, sin decimales.                                                    | 42000                |

Campo derivado (no viene en los datos): **valor de la venta = cantidad × precio**. No existe un campo de total; hay que calcularlo. Con la muestra completa, la suma de esos valores es 985.000.

### Posición frente a índice

El reto pide el producto del registro "en la posición 4". La **posición** es conteo humano (1.º, 2.º, 3.º, 4.º) y el **índice** de un arreglo en JavaScript empieza en 0. Por eso:

| Posición (humano) | Índice (JS)                                | Registro | Producto               |
| ----------------- | ------------------------------------------ | -------- | ---------------------- |
| 1                 | ventas[0]                                | id 1     | Origen Huila 500 g     |
| 4                 | ventas[3]                                | id 4     | **Origen Huila 500 g** |
| 5                 | ventas[4]                                | id 5     | Origen Sierra 500 g    |
| 12 (última)       | ventas[ventas.length - 1] = ventas[11] | id 12    | Origen Nariño 250 g    |

Regla: índice = posición − 1. Confundirlos es un error típico "por uno" (off-by-one): ventas[4] devuelve el quinto registro, no el cuarto, y ventas[ventas.length] devuelve undefined.

### Casos borde detectados

| #   | Problema                              | Dónde                                                               | Riesgo                                                                                                                           | Decisión                                                                                                                                                                                                                  |
| --- | ------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Ciudad escrita de forma inconsistente | id 5: "medellín" (minúscula) frente a "Medellín"                | Al agrupar aparecerían dos Medellín y una búsqueda por "Medellín" omitiría 135.000.                                            | No se corrige en datos.js. Se normaliza al comparar y agrupar (quitar espacios sobrantes, minúsculas, sin tildes en la clave) y se muestra con la regla de negocio: primera letra en mayúscula y el resto en minúscula. |
| 2   | Cantidad en cero                      | id 8: C06, Cali, Origen Huila 500 g, cantidad: 0, precio: 42000 | Si se cuenta como venta, infla el número de ventas y baja el ticket promedio. Puede ser una venta anulada o un error de captura. | Se conserva el registro. Aporta 0 al total y a las unidades, pero **no** es una venta válida: se excluye del ticket promedio y de la venta mayor. El reporte lo muestra como "registro sin unidades".                     |
| 3   | Clientes repetidos                    | C01 en ids 1, 4 y 11; C02 en ids 2 y 7; C03 en ids 3 y 9            | 12 registros no son 12 clientes (son 8). Confundir "ventas" con "clientes" daría un gasto por cliente incorrecto.                | El ticket promedio se calcula por compra (registro válido), no por cliente. Si se pide gasto por cliente, se agrupa por cliente.                                                                                        |
| 4   | No hay total por registro             | Todos                                                               | Sumar precio directamente ignora la cantidad (daría 646.000 y no 985.000).                                                     | Un único cálculo: valorVenta(venta) = cantidad × precio, usado por todas las funciones.                                                                                                                                 |
| 5   | La fecha es texto                     | Todos                                                               | Comparar con formatos distintos ("4/9/2026") no encontraría nada; restar fechas como texto no funciona.                        | Se compara el texto exacto (sin espacios sobrantes) y se valida el formato AAAA-MM-DD al consultar un día.                                                                                                              |
| 6   | Espacios sobrantes en textos          | No aparece en la muestra, pero es común al exportar                 | "Bogotá" y "Bogotá " serían ciudades distintas.                                                                              | trim() y colapsar espacios internos antes de comparar. (El error reportado en el MiniReto 4 confirma este riesgo.)                                                                                                      |

---


# MiniReto 2 - Los números del día: recorrer, filtrar y acumular

## 1. ¿Que se hizo?

En este mini-reto cree varias funciones en JavaScript para analizar las ventas de Café Origen utilice ciclos for..of, condicionales if, contadores y acumuladores para calcular cuánto dinero se vendio, cuantas unidades se vendieron, cual fue la venta más grande y cuál fue el promedio por compra.

También se creo una función para buscar las ventas de una ciudad, sin importar si está escrita con mayúsculas, minúsculas o espacios sobrantes.

## 2. Plan en pseudocódigo

Antes de programar, planteamos como iba a funcionar cada indicador.

### Función valorVenta

Esta función calcula cuanto dinero genero una venta.

INICIO
    Recibir una venta
    Multiplicar cantidad por precio
    Retornar el resultado
FIN

### Función totalVendido

Utilizamos un acumulador que comienza en cero y va sumando el valor de cada venta.

INICIO
    Recibir arreglo de ventas
    total = 0

    PARA CADA venta DEL arreglo
        total = total + valorVenta(venta)
    FIN PARA

    Retornar total
FIN


### Función unidadesVendidas

Recorremos las ventas y sumamos la cantidad de productos vendidos.

INICIO
    Recibir arreglo de ventas
    unidades = 0

    PARA CADA venta DEL arreglo
        unidades = unidades + venta.cantidad
    FIN PARA

    Retornar unidades
FIN

### Función ventaMayor

Buscamos el registro que genero mas dinero y guardamos el objeto completo.

INICIO
    Recibir arreglo de ventas
    mayor = primera venta

    PARA CADA venta DEL arreglo
        SI valorVenta(venta) > valorVenta(mayor)
            mayor = venta
        FIN SI
    FIN PARA

    Retornar mayor
FIN


### Función ticketPromedio

Calcule el total vendido y conte las ventas que tienen una cantidad mayor que cero.


INICIO
    Recibir arreglo de ventas
    total = totalVendido(ventas)
    ventasValidas = 0

    PARA CADA venta DEL arreglo
        SI venta.cantidad > 0
            ventasValidas = ventasValidas + 1
        FIN SI
    FIN PARA

    SI ventasValidas = 0
        Retornar 0
    FIN SI

    promedio = total / ventasValidas
    Retornar promedio
FIN


### Función normalizarCiudad

Esta función ayuda a que los nombres de las ciudades se puedan comparar correctamente.


INICIO
    Recibir un texto
    Quitar espacios al inicio y al final
    Convertir el texto a minúsculas
    Retornar el texto normalizado
FIN

### Función ventasPorCiudad

Se recorre las ventas y se suma el valor de aquellas que pertenecen a la ciudad buscada.

INICIO
    Recibir ventas y ciudad
    total = 0
    Normalizar la ciudad buscada

    PARA CADA venta DEL arreglo
        Normalizar la ciudad de la venta

        SI las ciudades son iguales
            total = total + valorVenta(venta)
        FIN SI
    FIN PARA

    Retornar total
FIN

## 3. Patrones utilizados

| Función          | Patrón                 | ¿Para qué se utilizó?                        |
|------------------|------------------------|----------------------------------------------|
| valorVenta       | Cálculo                | Multiplicar cantidad por precio              |
| totalVendido     | Acumulador             | Sumar el dinero vendido                      |
| unidadesVendidas | Acumulador             | Sumar las unidades                           |
| ventaMayor       | Máximo                 | Encontrar la venta de mayor valor            |
| ticketPromedio   | Contador y acumulador  | Contar ventas válidas y calcular el promedio |
| normalizarCiudad | Normalización          | Comparar ciudades correctamente              |
| ventasPorCiudad  | Acumulador y condición | Sumar únicamente las ventas de una ciudad    |

## 4. Casos borde y decisiones

Tambien revisamos que sucede cuando las funciones reciben un arreglo vacío o encuentran datos especiales.

| Función          | Resultado con arreglo vacío | Decisión                                   |
|------------------|-----------------------------|--------------------------------------------|
| totalVendido     | 0                           | No existen ventas para sumar               |
| unidadesVendidas | 0                           | No hay unidades vendidas                   |
| ventaMayor       | undefined                   | No existe un primer elemento para comparar |
| ticketPromedio   | 0                           | Evitamos dividir entre cero y obtener NaN  |
| ventasPorCiudad  | 0                           | No hay ventas de la ciudad buscada         |

La función valorVenta recibe un objeto individual y normalizarCiudad recibe un texto, por lo que no trabajan directamente con arreglos.
También encontramos una venta con cantidad igual a cero, esta no se cuenta como venta válida para calcular el ticket promedio.
**Nota:** En ticketPromedio debemos comprobar que el contador sea mayor que cero antes de dividir, para evitar que el resultado sea NaN.

## 5. Pruebas realizadas

Para comprobar las funciones, se prepararon pruebas con las 12 ventas, un arreglo con una sola venta y un arreglo vacío.

| Función                    | Arreglo completo | Un elemento | Arreglo vacío |
|----------------------------|------------------|-------------|---------------|
| totalVendido               | 985000           | 84000       | 0             |
| unidadesVendidas           | 21               | 2           | 0             |
| ventaMayor                 | id 10            | id 1        | undefined     |
| ticketPromedio             | 89545.45 aprox.  | 84000       | 0 esperado    |
| ventasPorCiudad (Medellín) | 356000           | 84000       | 0             |

En las pruebas utilice console.log() y el operador === para comparar los resultados obtenidos con los esperados y cuando los dos valores coinciden console.log muestra true o si son diferentes, muestra false también probe valorVenta con distintas ventas y normalizarCiudad con textos escritos de diferentes maneras.

## 6. Tabla de traza 1 - Total vendido

Verificicon manualmente cuanto dinero generaron las ventas.
En cada vuelta se multiplica la cantidad por el precio y agregamos el resultado al acumulador.

| ID | Cantidad | Precio | Valor venta | Total acumulado |
|----|----------|--------|-------------|-----------------|
| 1  | 2        | 42000  | 84000       | 84000           |
| 2  | 1        | 26000  | 26000       | 110000          |
| 3  | 1        | 95000  | 95000       | 205000          |
| 4  | 1        | 42000  | 42000       | 247000          |
| 5  | 3        | 45000  | 135000      | 382000          |
| 6  | 2        | 26000  | 52000       | 434000          |
| 7  | 1        | 120000 | 120000      | 554000          |
| 8  | 0        | 42000  | 0           | 554000          |
| 9  | 2        | 45000  | 90000       | 644000          |
| 10 | 4        | 42000  | 168000      | 812000          |
| 11 | 1        | 95000  | 95000       | 907000          |
| 12 | 3        | 26000  | 78000       | 985000          |

**Resultado que espere: 985000**

Este es el resultado que debe devolver totalVendido(ventas).

## 7. Tabla de traza 2 - Venta mayor

En esta función compare el valor de cada venta con la mayor que tenia guardada y si i encontraba una venta de mayor valor, actualizaba la variable.

| ID revisado | Valor de la venta | Venta mayor guardada |
|-------------|-------------------|----------------------|
| 1           | 84000             | ID 1                 |
| 2           | 26000             | ID 1                 |
| 3           | 95000             | ID 3                 |
| 4           | 42000             | ID 3                 |
| 5           | 135000            | ID 5                 |
| 6           | 52000             | ID 5                 |
| 7           | 120000            | ID 5                 |
| 8           | 0                 | ID 5                 |
| 9           | 90000             | ID 5                 |
| 10          | 168000            | ID 10                |
| 11          | 95000             | ID 10                |
| 12          | 78000             | ID 10                |

**Resultado que espere: venta con ID 10 por 168000**

La función devuelve el objeto completo de esa venta, no solamente su valor.

## 8. Conclusión

En este mini-reto aprendi a utilizar los ciclos for...of para recorrer arreglos de objetos y calcular información a partir de sus propiedades con este ciclo puedo acuidir directamente a la propiedad en cambio con for... in solo a la posición, tambien practique los contadores, acumuladores, condicionales y comparaciones para encontrar resultados como el total vendido, las unidades y la venta mayor, las pruebas ayudaron a identificar problemas que pueden aparecer cuando no existen ventas o cuando alguna tiene una cantidad igual a cero.

Algo que me gusto implementar y aprendi fue el signo ? para que el console.log me devuelva undefined cuando es error y asi no se me corte.


## MiniReto 3 – Del ciclo al método: rankings y agrupaciones

En este mini-reto use map, filter y reduce para calcular los indicadores de ventas, use objetos para acumular totales por ciudad y por producto y para el ranking sume el dinero que generó cada producto y ordené los resultados de mayor a menor.

### 1. totalVendidoM(ventas)

- **¿Qué recorro?** Primero recorro las ventas con map y luego recorro los valores que resultan con reduce y las sumo.
- **¿Qué filtro?** Incluyo todas las ventas.
- **¿Qué transformo?** Con map convierto cada venta en el dinero que se hizo en la venta con valorVenta(venta).
- **¿Qué acumulo?** Sumo esos valores con reduce, empezando en 0.
- **¿Cómo agrupo?** Calculo un solo total para todas las ventas.

| Prueba | Entrada               | Resultado esperado |
|--------|-----------------------|--------------------|
| 1      | Las 12 ventas         | 985000             |
| 2      | Solo la primera venta | 84000              |
| 3      | Arreglo vacío         | 0                  |

### 2. unidadesVendidasM(ventas)

- **¿Qué recorro?** Recorro todas las ventas con reduce.
- **¿Qué filtro?** Incluyo todas las ventas, incluso la que tiene cantidad 0.
- **¿Qué transformo?** Tomo venta.cantidad de cada registro.
- **¿Qué acumulo?** Sumo las cantidades desde 0.
- **¿Cómo agrupo?** Calculo un solo total de unidades para todos los productos.

| Prueba | Entrada               | Resultado esperado |
|--------|-----------------------|--------------------|
| 1      | Las 12 ventas         | 21                 |
| 2      | Solo la primera venta | 2                  |
| 3      | Arreglo vacío         | 0                  |

### 3. ventasPorCiudadM(ventas, ciudad)

- **¿Qué recorro?** Primero recorro todas las ventas con filter y despues recorro las ventas que quedaron con reduce.
- **¿Qué filtro?** Conservo solo las ventas que coinciden con la ciudad que recibo.
- **¿Qué transformo?** Quito espacios al inicio y al final de los nombres de las ciudades y los paso a minúsculas para compararlos luego calculo el valor de cada venta que paso el filtro.
- **¿Qué acumulo?** Sumo el dinero de las ventas de esa ciudad desde 0.
- **¿Cómo agrupo?** Devuelvo un solo total para la ciudad consultada.

| Prueba | Entrada                    | Resultado esperado |
|--------|----------------------------|--------------------|
| 1      | Las 12 ventas y "Medellín" | 356000             |
| 2      | Las 12 ventas y "  CALI  " | 185000             |
| 3      | Las 12 ventas y "Cartagena"| 0                  |

### 4. totalPorCiudad(ventas)

- **¿Qué recorro?** Recorro las ventas con for of.
- **¿Qué filtro?** Salto la venta si el nombre de la ciudad queda vacio despues de normalizarlo.
- **¿Qué transformo?** Normalizo el nombre de la ciudad y calculo el valor de la venta.
- **¿Qué acumulo?** Sumo el dinero de cada venta al total de su ciudad.
- **¿Cómo agrupo?** Uso el nombre normalizado de la ciudad que introduje en ciudades y o uso como clave del objeto totalCiudades , Asi "Medellín" y "medellín" quedan en la misma clave.

| Prueba | Entrada | Resultado esperado |
|--------|---------|--------------------|
| 1      | Las 12 ventas | { medellín: 356000, bogotá: 276000, cali: 185000, pereira: 168000 } |
| 2      | Las ventas con ID 1 y 5, que escriben Medellín de dos formas | { medellín: 219000 } |
| 3      | Arreglo vacío | {} |

### 5. unidadesPorProducto(ventas)

- **¿Qué recorro?** Recorro las ventas con for of.
- **¿Qué filtro?** Salto las ventas que tienen el nombre del producto vacio o sin definir.
- **¿Qué transformo?** Tomo el nombre del producto y la cantidad de unidades de cada venta.
- **¿Qué acumulo?** Sumo venta.cantidad al total de unidades de ese producto.
- **¿Cómo agrupo?** Uso el nombre del producto en producto y lo uso como clave del objeto unidadesProducto.

| Prueba | Entrada | Resultado esperado |
|--------|---------|--------------------|
| 1      | Las 12 ventas | Huila 7, Sierra 5, Prensa francesa 2, Nariño 6 y Molino manual 1 |
| 2      | Las ventas con ID 1 y 8, ambas de Huila | { "Origen Huila 500 g": 2 }, porque la venta con ID 8 aporta 0 |
| 3      | Arreglo vacío | {} |

### 6. topProductosPorValor(ventas, k)

- **¿Qué recorro?** Recorro todas las ventas con for of.
- **¿Qué filtro?** Incluyo todas las ventas para calcular los totales al final, slice(0, k) toma los primeros k productos del ranking.
- **¿Qué transformo?** Con Object.entries() convierto el objeto de totales en pares con el nombre del producto y el dinero generado.
- **¿Qué acumulo?** Sumo el valor de todas las ventas de cada producto.
- **¿Cómo agrupo?** Uso el nombre del producto como clave de totalProductos y luego copio el arreglo de pares con ... y ordeno la copia con sort segun el dinero generado.

| Prueba | Entrada | Resultado esperado |
|------|---|---|
| 1    | Las 12 ventas con k = 3 | [["Origen Huila 500 g", 294000], ["Origen Sierra 500 g", 225000], ["Prensa francesa", 190000]] |
| 2    | Las 12 ventas con k = 1 | [["Origen Huila 500 g", 294000]]. Los IDs de ventas conservan el orden del 1 al 12 antes y después de la llamada. |
| 3    | Arreglo vacío con k = 3 | [] |