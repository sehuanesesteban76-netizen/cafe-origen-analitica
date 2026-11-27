| Funcion                     | Que hace                        | Tiempo                 | Espacio adicional | Justificacion                                                | Evidencia con 10.000 ventas       |
|-----------------------------|---------------------------------|------------------------|-------------------|--------------------------------------------------------------|-----------------------------------|
| valorVenta                  | Calcula el valor de una venta   | O(1)                   | O(1)              | Multiplica la cantidad por el precio de una venta            | 0,000018 ms                       |
| totalVendido                | Suma el valor de las ventas     | O(n)                   | O(1)              | Recorre todas las ventas y guarda un acumulador              | 0,012435 ms                       |
| unidadesVendidas            | Suma las unidades vendidas      | O(n)                   | O(1)              | Recorre las ventas y acumula la cantidad de cada una          | 0,007930 ms                       |
| ventaMayor                  | Busca la venta de mayor valor   | O(n)                   | O(1)              | Compara las ventas y solo guarda la mayor encontrada          | 0,070775 ms                       |
| ticketPromedio              | Calcula el promedio por venta   | O(n)                   | O(1)              | Calcula el total y hace otro recorrido para contar las validas| 0,020940 ms                       |
| normalizarCiudad            | Limpia el nombre de una ciudad  | O(L)                   | O(L)              | Quita espacios y pasa a minusculas un texto de longitud L     | 0,000017 ms                       |
| ventasPorCiudad             | Suma lo vendido en una ciudad   | O(n)                   | O(1)              | Compara cada ciudad y acumula las ventas que coinciden        | 0,216965 ms                       |
| totalVendidoM               | Suma lo vendido con metodos     | O(n)                   | O(n)              | map crea un arreglo con los valores y reduce los suma         | 0,112785 ms                       |
| unidadesVendidasM           | Suma las unidades con reduce    | O(n)                   | O(1)              | reduce revisa cada venta y usa un acumulador numerico         | 0,047405 ms                       |
| ventasPorCiudadM            | Filtra por ciudad y suma        | O(n)                   | O(n)              | filter puede guardar todas las ventas y reduce suma sus valores| 0,271985 ms                      |
| totalPorCiudad              | Agrupa el valor por ciudad      | O(n × c) en peor caso  | O(c)              | Usa includes para buscar la ciudad y guarda un total por cada una | 0,775670 ms                  |
| unidadesPorProducto         | Agrupa las unidades por producto| O(n × p) en peor caso  | O(p)              | Usa includes para buscar el producto y guarda sus unidades    | 0,263185 ms                       |
| topProductosPorValor        | Saca los productos con mas valor| O(n + p log p)         | O(p)              | Acumula y ordena los totales de todos los productos           | 0,319730 ms                       |
| ventasDelDia                | Resume las ventas de una fecha  | O(n)                   | O(n)              | Filtra por fecha y calcula el resumen con las ventas filtradas| 0,230135 ms                       |
| totalVendidoInstrumentada   | Suma lo vendido y cuenta visitas| O(n)                   | O(1)              | Revisa cada venta una vez y actualiza el contador             | 0,015635 ms y 10.000 operaciones  |
| ventaMayorInstrumentada     | Busca la mayor y cuenta el trabajo | O(n)                | O(1)              | Cuenta una visita y una comparacion en cada vuelta            | 0,075550 ms y 20.000 operaciones  |
| totalPorCiudadEstandarizada | Agrupa por ciudad y cuenta el trabajo | O(n × c) en peor caso | O(c)           | Recorre las ventas y busca cada ciudad con includes           | 0,801385 ms y 30.000 operaciones  |
| primeraVenta                | Devuelve la primera venta       | O(1)                   | O(1)              | Accede directo a la posicion 0                               | 0,000004 ms y 1 operacion         |
| clientesRecurrentes         | Busca clientes con varias compras| O(n³) en peor caso     | O(n)              | Compara pares de ventas y usa includes cuando coinciden       | 377,997 ms                        |
| totalCiudadCadena           | Suma lo vendido en una ciudad   | O(n)                   | O(n)              | Usa map, filter, map y reduce. Crea tres arreglos             | 0,571105 ms                       |
| totalCiudadUnaPasada        | Suma lo vendido en una ciudad   | O(n)                   | O(1)              | Compara y suma en el mismo for of usando un acumulador        | 0,249160 ms                       |

En la tabla n es la cantidad de ventas, c la cantidad de ciudades distintas, p la cantidad de productos distintos y L la longitud del nombre de una ciudad. Use el mismo arreglo de 10.000 ventas para las pruebas y registre la mediana de cinco rondas en milisegundos por llamada. Para las consultas por ciudad use Medellin, para el resumen diario use 2026-09-01 y para el ranking pedi los 3 primeros productos. En el contador de totalPorCiudadEstandarizada cada llamada a includes cuenta como una operacion.


Proyeccion

Tome como base las mediciones de 10.000 ventas, como 1.000.000 es 100 veces 10.000, multiplique por 100 el tiempo de las funciones que crecen de forma lineal, para las funciones que trabajan con un solo dato deje el mismo tiempo por llamad y en los reportes por ciudad y por producto mantuve las mismas cuatro ciudades y los mismos cinco productos del generador.

Para clientesRecurrentes use la prueba mas cercana que hice, que fue de 100.000 ventas y se demoro unos 42 segundos. De 100.000 a 1.000.000 hay 10 veces mas ventas y  con el crecimiento cuadratico que use para estimar esta prueba, el calculo queda en 42 × 10² = 4.200 segundos, o sea 1 hora y 10 minutos.

| Funcion                     | Tiempo base medido          | Proyeccion con 1.000.000 |
|-----------------------------|-----------------------------|--------------------------|
| valorVenta                  | 0,000018 ms                 | 0,000018 ms por llamada  |
| totalVendido                | 0,012435 ms                 | 1,24 ms                  |
| unidadesVendidas            | 0,007930 ms                 | 0,79 ms                  |
| ventaMayor                  | 0,070775 ms                 | 7,08 ms                  |
| ticketPromedio              | 0,020940 ms                 | 2,09 ms                  |
| normalizarCiudad            | 0,000017 ms                 | 0,000017 ms por llamada  |
| ventasPorCiudad             | 0,216965 ms                 | 21,70 ms                 |
| totalPorCiudad              | 0,775670 ms                 | 77,57 ms                 |
| unidadesPorProducto         | 0,263185 ms                 | 26,32 ms                 |
| topProductosPorValor        | 0,319730 ms                 | 31,97 ms                 |
| ventasDelDia                | 0,230135 ms                 | 23,01 ms                 |
| totalVendidoInstrumentada   | 0,015635 ms                 | 1,56 ms                  |
| ventaMayorInstrumentada     | 0,075550 ms                 | 7,56 ms                  |
| totalPorCiudadEstandarizada | 0,801385 ms                 | 80,14 ms                 |
| primeraVenta                | 0,000004 ms                 | 0,000004 ms por llamada  |
| clientesRecurrentes         | 42 s con 100.000 ventas     | 1 h y 10 min aprox.      |
| totalCiudadCadena           | 0,571105 ms                 | 57,11 ms                 |
| totalCiudadUnaPasada        | 0,249160 ms                 | 24,92 ms                 |
| totalVendidoM               | 0,112785 ms                 | 11,28 ms                 |
| unidadesVendidasM           | 0,047405 ms                 | 4,74 ms                  |
| ventasPorCiudadM            | 0,271985 ms                 | 27,20 ms                 |


Riesgos

Ordené las funciones de mayor a menor riesgo primero miré como crece el trabajo de cada función cuando aumentan las ventas, cuando varias crecen de la misma forma y puse primero las que pueden guardar mas datos en memoria.

| Orden | Funciones | Motivo |
| ----- | --------- | ------ |
| 1 | clientesRecurrentes | Compara cada venta con las que vienen después y, cuando coinciden los clientes, busca con includes en el arreglo de recurrentes. Comparar los pares ya es un trabajo cuadrático y en el peor caso las búsquedas pueden llevarlo a O(n³) con 100.000 ventas tardó cerca de 42 segundos. |
| 2 | totalPorCiudad, totalPorCiudadEstandarizada, unidadesPorProducto | Por cada venta buscan si la ciudad o el producto ya está registrado si también aumenta la cantidad de ciudades o productos distintos, cada búsqueda puede tomar más tiempo. Con las listas fijas del generador el crecimiento se mantiene lineal. |
| 3 | topProductosPorValor | Recorre las ventas y después ordena todos los productos distintos. Si aumenta la cantidad de productos, también aumenta el trabajo de ordenar y la memoria para guardar sus totales. |
| 4 | totalCiudadCadena, ventasPorCiudadM, ventasDelDia, totalVendidoM | El tiempo crece de forma lineal y los arreglos intermedios pueden ocupar más memoria a medida que aumentan las ventas. |
| 5 | totalCiudadUnaPasada, ventasPorCiudad, totalVendido, unidadesVendidas, ventaMayor, ticketPromedio, totalVendidoInstrumentada, ventaMayorInstrumentada, unidadesVendidasM | El trabajo crece de forma lineal y solo guardan unos pocos valores mientras recorren las ventas. |
| 6 | primeraVenta, valorVenta, normalizarCiudad | Trabajan con una sola venta o con un solo texto. Aumentar el número de ventas no aumenta el trabajo de una llamada. |


Plan de optimización

La primera función que mejoraria es clientesRecurrentes porque fue la de mayor riesgo ahora el código compara cada venta con todas las que vienen despues para buscar clientes repetidos, cada vez que encuentra una coincidencia tambien usa includes para revisar si ese cliente ya quedó en el resultado.

Mi idea es recorrer las ventas una vez y usar un Map para guardar cuantas compras lleva cada cliente, ccada vez que aparece un cliente aumento su contado y al final recorro el Map y agrego al resultado los clientes que tengan dos compras o más.

Así se deja de comparar cada venta con las demás porque el contador ya tiene la información que necesito, el tiempo esperado sería O(n) y la memoria adicional dependería de cuántos clientes distintos haya, porque se guarda un contador por cliente.