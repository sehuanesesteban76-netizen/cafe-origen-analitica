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


## MiniReto 4 - Analitica v0.1 el primer reporte

En este mini reto hice un reporte en consola para ver el total vendido, las unidades, el ticket promedio, las ventas por ciudad y los tres productos que mas dinero generaron tambien agregue un resumen para un dia con ventas y otro sin ventas.

### Caso 1. Bogota aparecia dos veces

- **Caso** La gerente reporto que Bogota salia dos veces en el reporte.
- **Entrada que lo produce** Una lista de ventas donde la misma ciudad esta escrita con distintas mayusculas o con espacios de mas. Un ejemplo es "Bogotá" y " bogotá" y este fue el ejemplo que use.
- **Hipotesis** Pense que al agrupar por el nombre tal como viene iba a salir igualmente una sola vez porque habia corroborado que mi funcion normalizarCiudad le di bien los metodos para estos errores.
- **Prueba realizada** Consulte Bogota con ventasPorCiudad usando el arreglo completo y el total fue de 276000 ,tambien revise el resultado de totalPorCiudad y vi que Bogota aparecia una sola vez con 276000 , ademas la prueba para que se consulten los dos casos la deje doumentada en el archivo analitica.js debajo de la funcion ventasPorCiudadM los dos console.log con las diferentes escrituras de Bogotá para que se compruebe.
- **Causa** Las variantes del nombre son textos diferentes si el programa usa esos textos como claves directamente, puede crear un grupo para cada variante.
- **Correccion** En totalPorCiudad uso normalizarCiudad antes de agrupar asi que la funcion quita los espacios de los extremos y pasa el nombre a minusculas y asi las ventas quedan bajo la misma clave como ya se tenia.

### Caso 2. El ticket promedio daba NaN

- **Sintoma** Al consultar un dia sin ventas, el total y las unidades salian en 0, pero el ticket promedio salia como NaN.
- **Entrada que lo produce** Consulte la fecha 2026-09-07, que no tiene ventas en el arreglo.
- **Hipotesis** Pense que el ticket promedio estaba dividiendo entre cero porque ese dia no habia ventas validas.
- **Prueba realizada** En la primera prueba obtuve 0 en el total, 0 en unidades y NaN en el ticket promedio y despues de agregar la condicion, el resultado esperado para esa misma fecha es 0.
- **Causa** El filtro devolvia un arreglo vacio El total vendido y el contador de ventas validas quedaban en 0, asi que la division era 0 / 0 y por eso daba NaN.
- **Correccion** En ticketPromedio agregue una condicion antes de dividi que fue  si el contador de ventas validas es 0, la funcion devuelve 0.


## Mini-reto 5: ¿Cuanto cuesta cada reporte?

## Punto 3. Predicción antes de medir
- Si la cantidad de ventas se multiplica por 10 espero que el numero de operaciones tambien se multiplique por 10 en las tres funciones.

- totalVendido cuenta una visita por cada venta. Si paso de 100 a 1.000 ventas, espero que el contador pase de 100 a 1.000 operaciones.

- ventaMayor cuenta una visita y una comparación por cada venta. Si paso de 100 a 1.000 ventas, espero que el contador pase de 200 a 2.000 operaciones.

- totalPorCiudad cuenta una visita, una comprobación para saber si la venta tiene ciudad y una búsqueda con includes() para saber si la ciudad ya esta registrada como todas las ventas generadas tienen ciudad y cuento cada llamada a includes() como una operación, espero pasar de 300 a 3.000 operaciones.

## Punto 6. Comparación de la predicción con los resultados

Mi prediccion fue que al multiplicar por 10 la cantidad de ventas, las operaciones de totalVendido, ventaMayor y totalPorCiudad también se multiplicarian por 10. La tabla confirmo esa predicción en los cuatro tamaños.

|Función	    |Con 100 ventas| Con 1.000 ventas|	Complejidad |
|---------------|--------------|-----------------|--------------|
|totalVendido   |100	       |1.000	         |       O(n)   |
|ventaMayor	    |200	       |2.000	         |       O(n)   |
|totalPorCiudad	|300	       |3.000	         |       O(n)   |
|primeraVenta	|1	           |1	             |       O(1)   |


- totalVendido es O(n) porque el for visita cada venta una vez cada venta agrega una operación al contador.

- ventaMayor es O(n) porque en cada vuelta visita una venta y compara su valor con la mayor encontrada el contador suma dos operaciones por venta.

- totalPorCiudad es O(n) en esta prueba porque recorre todas las ventas una vez y la busqueda con includes() revisa una lista de hasta cuatro ciudades conte una visita y dos comprobaciones por cada venta generada.

- primeraVenta es O(1) porque accede directamente a ventas[0] incluso con 100.000 ventas, el contador sigue dando una sola operación.


## Mini-reto 6: El reporte que se volvio lento 

Punto 2 - Traza de clientes recurrentes

Para la prueba use 5 ventas con estos clientes en orden

| posicion | 0   | 1   | 2   | 3   | 4   |
|----------|-----|-----|-----|-----|-----|
| cliente  | C01 | C02 | C01 | C03 | C02 |

El primer ciclo coge una venta con i y el segundo compara esa venta con las que vienen despues  
j empieza en i + 1 para comparar cada par una sola vez

| i | j | clientes que compare | coinciden | recurrentes    |
|---|---|----------------------|-----------|----------------|
| 0 | 1 | C01 y C02            | no        | []             |
| 0 | 2 | C01 y C01            | si        | ["C01"]        |
| 0 | 3 | C01 y C03            | no        | ["C01"]        |
| 0 | 4 | C01 y C02            | no        | ["C01"]        |
| 1 | 2 | C02 y C01            | no        | ["C01"]        |
| 1 | 3 | C02 y C03            | no        | ["C01"]        |
| 1 | 4 | C02 y C02            | si        | ["C01", "C02"] |
| 2 | 3 | C01 y C03            | no        | ["C01", "C02"] |
| 2 | 4 | C01 y C02            | no        | ["C01", "C02"] |
| 3 | 4 | C03 y C02            | no        | ["C01", "C02"] |

Cuando i llega a 4 ya no quedan ventas despues de esa posicion  
En total se hacen 4 + 3 + 2 + 1 + 0 = 10 comparaciones entre clientes  
La funcion devuelve ["C01", "C02"] porque ambos compraron dos veces

Comparaciones con n ventas

Con n ventas cada una tiene n - 1 posibles ventas para comparar  
Si multiplico n × (n - 1) estoy contando cada par dos veces por ejemplo la venta 0 con la 1 y la venta 1 con la 0  
Por eso divido entre 2 y queda n × (n - 1) / 2

Con 5 ventas da 5 × 4 / 2 = 10 que es lo mismo que salio en la tabla  aca conte las comparaciones entre los clientes de las ventas y el costo de includes() esto lo reviso en el punto 6

Punto 3. Medicion del tiempo de clientes recurrentes

Aca use la función generarVentas del mini-reto 5 para hacer las pruebas con diferentes cantidades de ventas, primero genere las ventas y despues use console.time para empezar a medir justo antes de llamar a clientesRecurrentes y cuando la funcion termino use console.timeEnd con el mismo nombre y asi pude ver cuanto se demoro solo la funcion.

| Cantidad de ventas | Tiempo medido |
|--------------------|--------------:|
| 1.000              | 6,589 ms      |
| 2.000              | 18,099 ms     |
| 4.000              | 74,075 ms     |
| 8.000              | 372,998 ms    |
| 16.000             | 1.278 s      |

El ultimo tiempo salio en segundos en la consola y los valores de cada cantidad pueden ir variando mediante cada vez que se corre el codigo.

Punto 4. Que pasa con el tiempo cuando duplico las ventas

Use los tiempos de la tabla del punto 3 y dividi cada tiempo por el de la prueba anterior para ver cuantas veces se multiplico.

| Cantidad de ventas  | Division de los tiempos en ms | Cuantas veces se multiplico |
|---------------------|-------------------------------|-----------------------------|
| De 1.000 a 2.000    | 18,099 / 6,589                | 2,75 veces                  |
| De 2.000 a 4.000    | 74,075 / 18,099               | 4,09 veces                  |
| De 4.000 a 8.000    | 372,998 / 74,075              | 5,04 veces                  |
| De 8.000 a 16.000   | 1.278 / 372,998               | 3,43 veces                  |

El resultado que mas se acerco a 4 fue el de 2.000 a 4.000 ventas con 4,09 veces en cambio los otros aumentos quedaron entre 2,75 y 5,04 veces y los valores pueden variar mediante cada  vez que se corre el codigo.

Esto se relaciona con O(n²) porque la función usa dos ciclos para comparar cada venta con las que vienen despues como se ve en la traza con n ventas se hacen n × (n - 1) / 2 comparaciones entre clientes. Al duplicar las ventas espero que esa cantidad de comparaciones sea casi cuatro veces mayor y eso explica por que el tiempo crece tanto aunque el aumento varie entre pruebas.


Punto 5. Estimacion para 100.000 y 1.000.000 de ventas

Primero tome el tiempo de la prueba de 16.000 ventas que me dio 1,278 segundos. Para estimar cuanto tardaria con mas ventas dividi la nueva cantidad entre 16.000 y eleve ese resultado al cuadrado. Despues multiplique ese valor por el tiempo de la prueba.

| Cantidad de ventas | Calculo                       | Tiempo estimado            |
|--------------------|-------------------------------|----------------------------|
| 100.000            | 1,278 × (100.000 / 16.000)²   | 49,92 segundos             |
| 1.000.000          | 1,278 × (1.000.000 / 16.000)² | 1 hora y 23 minutos aprox. |

Como la estimacion de 100.000 ventas quedo por debajo de 2 minutos hice la prueba y me dio aproximadamente 42 segundos la funcion tardo casi 8 segundos menos de lo que habia estimado ya que cada vez que corro el codigo me da un valor nuevo.

Con ese tiempo hice una nueva estimacion para 1.000.000 de ventas de 100.000 a 1.000.000 hay 10 veces mas ventas y con el crecimiento cuadratico el tiempo se multiplica por 10² que da 100.

42 segundos × 100 = 4200 segundos
4200 segundos ÷ 60 = 70 minutos

Con la prueba de 100.000 ventas como base ahora estimo que con 1.000.000 la funcinó tardaria aproximadamente 1 hora y 10 minutos.


Punto 6. Costo oculto de includes()

Cuando dos ventas son del mismo cliente, la funcion usa includes() para mirar si ese cliente ya estaba en el arreglo de recurrentes si el cliente esta al final o todavia no se ha agregado, includes() tiene que revisar toda la lista.

Por ejemplo si primero tengo muchos clientes que compraron dos veces, la lista de recurrentes ya tiene varios nombres guardados. Si despues tengo muchas ventas de un solo cliente, los dos ciclos encuentran muchos pares de ese mismo cliente y cada vez includes() vuelve a buscarlo hasta el final de la lista, en el peor caso puedo tener una cantidad de coincidencias que crece como n² y cada busqueda puede revisar una cantidad de clientes que crece como n por eso el trabajo total en ese caso puede llegar a O(n³).


Punto 7. Conclusión para la gerente

El reporte se demora porque para saber quienes volvieron a comprar, el sistema compara cada venta con muchas otras. Cada vez que encuentra dos compras de la misma persona tambien revisa si esa persona ya aparece en el resultado,con pocas ventas eso se hace rapido pero con todo el historial del año hay muchas mas compras por cruzar y por eso el reporte puede tardar bastante mas.


## Mini-reto 7: Tiempo, memoria y cadenas de métodos

Punto 4. Recorridos y memoria de las dos versiones

En totalCiudadCadena el primer map recorre todas las ventas para normalizar la ciudad y filter vuelve a recorrerlas para quedarse con las que coinciden despues el segundo map calcula el valor de las ventas que pasaron el filtro y reduce suma esos valores. En total hay 4 recorridos y 3 arreglos nuevos.

En totalCiudadUnaPasada el for...of recorre las ventas una sola vez, en la misma vuelta normaliza la ciudad, la compara y suma el valor si coincide y en total hay 1 recorrido y 0 arreglos nuevos.
____________________________________________________________________________________
|Funcion              |	Recorridos  |	Arreglos nuevos	|Tiempo	 | Espacio adicional
|totalCiudadCadena	  | 4	        |3	                |O(n)	 |O(n)
|totalCiudadUnaPasada |	1	        |0	                |O(n)	 |O(1)


Si n es la cantidad total de ventas y m las que coinciden con la ciudad, la cadena revisa n + n + m + m elementos. Como m puede ser igual a n, en el peor caso revisa 4n. El ciclo revisa n. En ambos casos el trabajo crece de forma lineal (m lo use como representacion de las ciudades filtradas no es  un valor de mi codigo).

En memoria la cadena es O(n) porque el primer map ya crea un arreglo del mismo tamaño que las ventas. La version de una pasada es O(1) porque usa un acumulador y la misma cantidad de variables aunque aumenten las ventas.

### Punto 5. Por que las dos versiones son O(n) en tiempo

En totalCiudadCadena los dos primeros metodos recorren todas las ventas y los dos ultimos recorren solo los elementos que quedaron despues del filtro en el peor caso todas las ventas son de la ciudad que busco y los cuatro recorridos revisan n elementos cada uno. Eso da n + n + n + n = 4n.

En totalCiudadUnaPasada uso un solo for...of y reviso cada venta una vez. Por eso el recorrido tiene n visitas.

En Big O el 4 es una constante y se elimina al simplificar O(4n) a O(n). Los recorridos de la cadena se hacen uno despues del otro y por eso sus visitas se suman. Las dos versiones tienen un crecimiento lineal porque si duplico las ventas, el maximo de visitas tambien se duplica y  por eso tambien se demoran el mismo tiempo.


### Punto 6. Complejidad espacial de las funciones del motor

Para clasificar las funciones mire que datos nuevos guarda cada una, use n para la cantidad de ventas. El arreglo original de ventas ya existe y queda fuera del conteo.

| Funcion       | Memoria adicional       | Por  que                                      |
|---------------|-------------------------|-----------------------------------------------|
| valorVenta, totalVendido, unidadesVendidas y ticketPromedio    | O(1)                    | Usan una cantidad fija de variables           |
| ventaMayor y primeraVenta                                    | O(1)                    | Guardan o devuelven una venta del arreglo      |
| normalizarCiudad                                             | O(1) respecto a n       | Trabaja con el nombre de una sola ciudad      |
| ventasPorCiudad y totalCiudadUnaPasada                        | O(1)                    | Guardan el total en un acumulador             |
| totalVendidoInstrumentada y ventaMayorInstrumentada           | O(1)                    | El contador guarda un numero                  |
| totalVendidoM                                                | O(n)                    | El map crea un arreglo con n valores          |
| unidadesVendidasM                                            | O(1)                    | El reduce usa un acumulador                  |
| ventasPorCiudadM y ventasDelDia                               | O(n) en el peor caso    | El filter puede guardar todas las ventas      |
| totalCiudadCadena                                            | O(n)                    | El primer map crea un arreglo con n ventas    |
| totalPorCiudad y totalPorCiudadEstandarizada                  | O(c) con c ciudades     | Guardan un total por cada ciudad distinta     |
| unidadesPorProducto                                          | O(p) con p productos    | Guarda un total por cada producto distinto    |
| topProductosPorValor                                         | O(p) con p productos    | Arma el ranking con todos los productos       |
| clientesRecurrentes                                          | O(n) en el peor caso    | Guarda un codigo por cada cliente recurrente   |


## Punto 7. Version que dejo en el motor

Decidi dejar totalCiudadUnaPasada para el reporte con el for of puedo ver en una sola vuelta como se normaliza la ciudad, se compara con la que busco y se suma el valor si coincide. La version con metodos tambien se entiende porque cada metodo tiene una tarea clara, como filtrar las ventas o sumar sus valores, pero de manera me personal y  el funcionamiento aunque es el mismo me gusta con for of.

Las dos versiones son O(n) en tiempo. La de una pasada recorre las ventas una vez y usa O(1) de memoria adicional porque solo guarda el total en un acumulador. La cadena hace cuatro recorridos, crea tres arreglos nuevos y usa O(n) de memoria adicional. Como el servidor tiene memoria limitada, me quedo con la version de una pasada para el reporte.

### Punto 6 - revisión del informe

En la revisión con un comapñero me señalaron que se pueden confundir los tiempos medidos con los estimados que por ejemplo en clientesRecurrentes los 42 segundos salieron de correr el código con 100.000 ventas y la hora y 10 minutos para 1.000.000 de ventas salió de multiplicar esos 42 segundos por 100, suponiendo que el tiempo crece de forma cuadrática entonces voy a aclarar eso en la sección de proyeccion para que se entienda de dónde salio cada numero.