
# Café Origen Analítica v0.1

Este proyecto analiza las ventas de Café Origen con JavaScript el programa toma una muestra de 12 registros y genera un reporte en la consola para consultar cuánto se vendio, en que ciudades y cuales fueron los productos que más dinero generaron.

## Como ejecutarlo

Necesitas tener Node.js instalado y abre una terminal en la carpeta cafe-origen-analitica y ejecuta:

node src/reporte.js


El reporte muestra un resumen general, las ventas por ciudad, las unidades por producto y el top 3 de productos por valor. También incluye el resumen del 1 de septiembre de 2026, que tiene ventas, y el del 7 de septiembre de 2026, que no tiene registros.

## Que preguntas responde el reporte

- ¿Cuanto dinero se vendio en total y cuantas unidades se vendieron?
- ¿Cuanto dinero se genero en promedio por cada venta valida?
- ¿Cuanto se vendio en cada ciudad?
- ¿Cuantas unidades se vendieron de cada producto?
- ¿Cuales fueron los tres productos que mas dinero generaron?
- ¿Cuanto se vendió en las fechas que muestra el reporte?

## Que hice en los mini-retos (Esta información esta mas detallada en la bitacora)

### MiniReto 1. Primer tueste

Guarde las 12 ventas en un arreglo de objetos, hice un script para ver cuántos registros había, mostrar el primero y el ultimo, consultar el producto de la cuarta venta y revisar todos los datos y en la bitácora anote que significa cada dato y los casos que encontre, como los nombres de ciudades escritos de formas distintas, una venta con cantidad en cero y clientes que aparecen en varias compras.

### MiniReto 2. Los numeros del día

Use funciones con ciclos para calcular el total vendido, las unidades vendidas, la venta de mayor valor, el ticket promedio y el total de una ciudad. Primero escribi en la bitacora los pasos de cada calculo y después hice trazas manuales para ver como cambiaban los valores en cada vuelta.

### MiniReto 3. Del ciclo al método

Volvi a hacer algunos calculos con map, filter y reduce que fueron hacer algunas funciones que hice con ciclos ahora con metodos. Hice un script para comparar esos resultados con los de los ciclos y también agrupe las ventas por ciudad y por producto y arme un ranking por el dinero que genero cada producto, conservando el orden del arreglo original.

### MiniReto 4. El primer reporte

Junte los calculos en un reporte que se puede ejecutar desde la terminal, organice los resultados por secciones, use el formato colombiano para los montos y agregue un resumen por fecha. También revise los dos casos que reporte la gerente para agrupar Bogotá bajo una sola clave, el proyecto con la funcion quita los espacios de los extremos y pasa el nombre a minusculas y para el día sin ventas, el ticket promedio devuelve cero antes de intentar dividir entre cero.

En [bitacora.md](bitacora.md) están las decisiones sobre los datos, los pasos de los calculos y de una manera mas detallada los pasos y cosas que hice en cada mini-reto.