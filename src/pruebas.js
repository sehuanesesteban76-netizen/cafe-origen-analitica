
const { ventas } = require("./datos.js");

const {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    normalizarCiudad,
    ventasPorCiudad
} = require("./analitica.js");



// 1. PRUEBAS DE VALOR VENTA


// PRUEBA 1: Recorrer todo.

const valoresEsperados = [
    84000, 26000, 95000, 42000,
    135000, 52000, 120000, 0,
    90000, 168000, 95000, 78000
];

let posicion = 0;

for (let venta of ventas) {
    console.log(
        valorVenta(venta) === valoresEsperados[posicion]
    );
    posicion++;
}

// PRUEBA 2: Una sola venta.

console.log(valorVenta(ventas[0]) === 84000);

// PRUEBA 3: No hay ventas.

let procesos = 0;

for (let venta of []) {
    valorVenta(venta);
    procesadas++;
}

console.log(procesos === 0);



// 2. PRUEBAS DE TOTAL VENDIDO


// PRUEBA 1: Arreglo completo.

console.log(totalVendido(ventas) === 985000);

// PRUEBA 2: Una sola venta.

console.log(totalVendido([ventas[0]]) === 84000);

// PRUEBA 3: Arreglo vacío.

console.log(totalVendido([]) === 0);



// 3. PRUEBAS DE UNIDADES VENDIDAS


// PRUEBA 1: Arreglo completo.

console.log(unidadesVendidas(ventas) === 21);

// PRUEBA 2: Una sola venta.

console.log(unidadesVendidas([ventas[0]]) === 2);

// PRUEBA 3: Arreglo vacío.

console.log(unidadesVendidas([]) === 0);



// 4. PRUEBAS DE VENTA MAYOR


// PRUEBA 1: Arreglo completo.

console.log(ventaMayor(ventas)?.id === 10);

// PRUEBA 2: Una sola venta

console.log(ventaMayor([ventas[0]]).id === 1);

// PRUEBA 3: Arreglo vacío.

console.log(ventaMayor([]) === undefined);



// 5. PRUEBAS DE TICKET PROMEDIO


// PRUEBA 1: Arreglo completo.

console.log(ticketPromedio(ventas) === 985000 / 11);

// PRUEBA 2: Una sola venta.

console.log(ticketPromedio([ventas[0]]) === 84000);

// PRUEBA 3: Arreglo vacío.

console.log(ticketPromedio([]) === 0);



// 6. PRUEBAS DE NORMALIZAR CIUDAD

// PRUEBA 1: Elimina espacios sobrantes.

console.log(
    normalizarCiudad(" Medellín ") === "medellín"
);

// PRUEBA 2: Convierte mayúsculas a minúsculas.

console.log(
    normalizarCiudad("BOGOTÁ") === "bogotá"
);

// PRUEBA 3: Recibe un texto vacío.

console.log(
    normalizarCiudad("") === ""
);



// 7. PRUEBAS DE VENTAS POR CIUDAD


// PRUEBA 1: Arreglo completo.
console.log(ventasPorCiudad(ventas, "Medellín") === 356000
);

// PRUEBA 2: Una sola venta.

console.log(
    ventasPorCiudad([ventas[0]], "Medellín") === 84000
);

// PRUEBA 3: Arreglo vacío.

console.log(
    ventasPorCiudad([], "Medellín") === 0
);




