const { ventas } = require("./datos.js")

function valorVenta(venta) {
    return venta.cantidad * venta.precio;
}

function totalVendido(ventas) {
    let total = 0
    for (let venta of ventas) {
        total += valorVenta(venta)
    }
    return total
}

function unidadesVendidas(ventas) {
    let cantidadUnidades = 0
    for (let venta of ventas) {
        cantidadUnidades += venta.cantidad
    }
    return cantidadUnidades
}

function ventaMayor(ventas) {
    let ventaMayor = ventas[0]
    for (let venta of ventas) {
        if (valorVenta(ventaMayor) < valorVenta(venta)) {
            ventaMayor = venta
        }
    }
    return ventaMayor

}

function ticketPromedio(ventas) {
    const total = totalVendido(ventas)

    let ventasValida = 0
    for (let venta of ventas) {
        if (venta.cantidad > 0) {
            ventasValida += 1
        }
    }
    const division = total / ventasValida
    return division
}

function normalizarCiudad(texto) {
    let ciudad = String(texto)
        .trim()
        .toLocaleLowerCase()

    return ciudad
}

function ventasPorCiudad(ventas, ciudad) {
    let totalVendido = 0
    const ciudadEstarandizada = normalizarCiudad(ciudad)
    for (let venta of ventas) {
        if (normalizarCiudad(venta.ciudad) === ciudadEstarandizada) {
            totalVendido += venta.cantidad * venta.precio
        }
    }
    return totalVendido
}

module.exports = {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    normalizarCiudad,
    ventasPorCiudad
};