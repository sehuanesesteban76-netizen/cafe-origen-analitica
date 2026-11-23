const {ventas} = require("./datos.js")
const {
    totalVendidoM,
    unidadesVendidasM,
    ticketPromedio,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    ventasDelDia
} = require("./analitica.js")


console.log("\nREPORTE DE VENTAS")

console.log("\n1. Resumen general")
const totalVendido = totalVendidoM(ventas)
console.log("Total vendido: ", totalVendido.toLocaleString("es-CO"))
console.log("Unidades vendidas", unidadesVendidasM(ventas))
console.log("Ticket promedio", ticketPromedio(ventas))

console.log("\n2. Ventas por ciudad")
let pares = Object.entries(totalPorCiudad(ventas))
pares = pares.map((par) => {
    const ciudad = par[0]
    const total = par[1]

    return {
        "Ciudad": ciudad,
        "Total Vendido (COP)": total.toLocaleString("es-CO")
    }
})
console.table(pares)

console.log("\n3. Unidades por producto")
console.table(unidadesPorProducto(ventas))

console.log("\n4. Top 3 de productos por valor")
let top3 = topProductosPorValor(ventas, 3)
top3 = top3.map((par) => {
    const ciudad = par[0]
    const total = par[1]
    return {
        "Ciudad": ciudad,
        "Total Vendido (COP)": total.toLocaleString("es-CO")
    }
})
console.table(top3)

console.log("\n5. Ventas por fecha")
console.log("Dia con ventas")
let diaConVentas = Object.entries(ventasDelDia(ventas,"2026-09-01"))
diaConVentas = diaConVentas.map((par) => {
    const referencia = par[0]
    const valor = par[1]

    return {
        "Referencia": referencia.toLocaleString("es-CO"),
        "Valor": valor.toLocaleString("es-CO")
    }
})
console.table(diaConVentas)

console.log("\nDía sin ventas")
let diaSinVentas = Object.entries(ventasDelDia(ventas,"2026-09-07"))
diaSinVentas = diaSinVentas.map((par) => {
    const referencia = par[0]
    const valor = par[1]

    return {
        "Referencia": referencia.toLocaleString("es-CO"),
        "Valor": valor.toLocaleString("es-CO")
    }
})
console.table(diaSinVentas)