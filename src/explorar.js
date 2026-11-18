const {ventas} = require("./datos.js")

// Impresion de Cantidad de registros
console.log(ventas.length)

//Impresion de Primer y ultimo registro
console.log("Primer registro: ",ventas[0], " Ultimo registro: ", ventas[ventas.length -1])

//Impresion de Propiedad producto del registro 4
console.log("Producto venta 4: ", ventas[3].producto)

//Impresion tabla completa de ventas (Para la demostración del arreglo pero en tabla)
console.table(ventas)