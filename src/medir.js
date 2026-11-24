const {
    generarVentas,
    ciudades,
    productos,
    precios
} = require("./generador.js")

const {
    totalVendidoInstrumentada,
    ventaMayorInstrumentada,
    totalPorCiudadEstandarizada,
    primeraVenta
} = require("./analitica.js")

const tamaños = [100, 1000, 10000, 100000]
const filas = []

for (const n of tamaños){
    let ventas = generarVentas(n)

    let contadorTotalVendido = {
        operaciones: 0
    } 
    totalVendidoInstrumentada(ventas, contadorTotalVendido)

    let contadorVentaMayor = {
        operaciones: 0
    }
    ventaMayorInstrumentada(ventas, contadorVentaMayor)

    let contadorTotalCiudad = {
        operaciones: 0
    }
    totalPorCiudadEstandarizada(ventas, contadorTotalCiudad)

    let contadorPrimeraVenta = {
        operaciones : 0
    }
    primeraVenta(ventas, contadorPrimeraVenta)

    filas.push({
        n: n,
        totalVendido: contadorTotalVendido.operaciones,
        ventaMayor: contadorVentaMayor.operaciones,
        totalCiudad: contadorTotalCiudad.operaciones,
        primeraVenta: contadorPrimeraVenta.operaciones
    })
}
console.table(filas)