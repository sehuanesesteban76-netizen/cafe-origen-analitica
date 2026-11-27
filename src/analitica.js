const { ventas } = require("./datos.js")

function valorVenta(venta) {
    return venta.cantidad * venta.precio;
}

function totalVendido(ventas) {
    let total = 0
    for (const venta of ventas) {
        total += valorVenta(venta)
    }
    return total
}

function unidadesVendidas(ventas) {
    let cantidadUnidades = 0
    for (const venta of ventas) {
        cantidadUnidades += venta.cantidad
    }
    return cantidadUnidades
}

function ventaMayor(ventas) {
    let ventaMayor = ventas[0]
    for (const venta of ventas) {
        if (valorVenta(ventaMayor) < valorVenta(venta)) {
            ventaMayor = venta
        }
    }
    return ventaMayor

}

function ticketPromedio(ventas) {
    const total = totalVendido(ventas)

    let ventasValida = 0
    for (const venta of ventas) {
        if (venta.cantidad > 0) {
            ventasValida += 1
        }
    }
    if (ventasValida === 0) {
        return 0
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
    for (const venta of ventas) {
        if (normalizarCiudad(venta.ciudad) === ciudadEstarandizada) {
            totalVendido += valorVenta(venta)
        }
    }
    return totalVendido
}

function totalPorCiudad(ventas) {
    let totalCiudades = {}
    let ciudades = []
    for (const venta of ventas) {
        let ciudad = normalizarCiudad(venta.ciudad)
        if (!ciudad) continue

        if (!ciudades.includes(ciudad)) {
            ciudades.push(ciudad)
            totalCiudades[ciudad] = 0
        }
        totalCiudades[ciudad] += valorVenta(venta)
    }
    return totalCiudades

}

function unidadesPorProducto(ventas) {
    let unidadesProducto = {}
    let productos = []
    for (const venta of ventas) {
        let producto = venta.producto
        if (!producto) continue

        if (!productos.includes(producto)) {
            productos.push(producto)
            unidadesProducto[producto] = 0

        }
        unidadesProducto[producto] += venta.cantidad
    }
    return unidadesProducto
}


function topProductosPorValor(ventas, k) {
    let totalProductos = {}
    for (const venta of ventas) {
        let producto = venta.producto
        if (!Object.hasOwn(totalProductos, producto)) {
            totalProductos[producto] = 0
        }
        totalProductos[producto] += valorVenta(venta)
    }
    let productosParesClaveValor = Object.entries(totalProductos) //Aca estan los productos convertidos en un arreglo de pares clave-valor
    let productosOrdenadosMayorMenor = [...productosParesClaveValor] // Aca copie el arreglo para que se tenga evidecnia de como se tenia sin ordenar y despues de ordenar 
    productosOrdenadosMayorMenor = productosOrdenadosMayorMenor.sort((a, b) => {
        return b[1] - a[1]  // Aca estan ordenados de mayor a menor y con ayuda del object.entries ahora se puede acceder a cada producto mediante de la posicion y asi poder ordenar
    })

    return productosOrdenadosMayorMenor.slice(0, k)
}

function ventasDelDia(ventas, fecha) {
    const fechaDia = fecha
    let ventasDia = ventas.filter((venta) => {
        if (venta.fecha === fechaDia) {
            return venta
        }
    })
    const unidadesVendidas = ventasDia.reduce((acumulador, venta) => {
        acumulador += venta.cantidad
        return acumulador
    }, 0)

    const Promedio = ticketPromedio(ventasDia)

    ventasDia = ventasDia.reduce((acumulador, venta) => {
        acumulador += valorVenta(venta)
        return acumulador
    }, 0)



    return {
        ventasDia,
        unidadesVendidas,
        Promedio
    }
}

// Version instrumentada de las funciones (totalVendido, ventaMayor, totalPorCiudad)

const contadorTotalVendido = {
    operaciones: 0
}
function totalVendidoInstrumentada(ventas, contador) {
    let total = 0
    for (const venta of ventas) {
        total += valorVenta(venta)
        contador.operaciones += 1
    }
    return total
}
//console.log("\nTotal vendido con la funcion totalVendido: ",totalVendidoInstrumentada(ventas,contadorTotalVendido))
//console.log("Total contador de la funcion  totalVendido: ", contadorTotalVendido)

const contadorVentaMayor = {
    operaciones: 0
}

function ventaMayorInstrumentada(ventas, contador) {
    let ventaMayor = ventas[0]
    for (const venta of ventas) {
        contador.operaciones += 1
        contador.operaciones += 1
        if (valorVenta(ventaMayor) < valorVenta(venta)) {
            ventaMayor = venta
        }
    }
    return ventaMayor

}
//console.log("\nVenta mayor: ", ventaMayorInstrumentada(ventas, contadorVentaMayor))
//console.log("Contador venta mayor", contadorVentaMayor)


const contadorTotalPorCiudad = {
    operaciones: 0
}

function totalPorCiudadEstandarizada(ventas, contador) {
    let totalCiudades = {}
    let ciudades = []
    for (const venta of ventas) {
        contador.operaciones += 1
        let ciudad = normalizarCiudad(venta.ciudad)
        contador.operaciones += 1
        if (!ciudad) continue

        contador.operaciones += 1
        if (!ciudades.includes(ciudad)) {
            ciudades.push(ciudad)
            totalCiudades[ciudad] = 0
        }

        totalCiudades[ciudad] += valorVenta(venta)
    }
    return totalCiudades

}
//console.log("\nTotal por ciudad: ",totalPorCiudadEstandarizada(ventas,contadorTotalPorCiudad))
//console.log("Contador total por ciudad: ", contadorTotalPorCiudad)

function primeraVenta(ventas, contador) {
    contador.operaciones += 1
    let venta1 = valorVenta(ventas[0])
    return venta1
}

function clientesRecurrentes(ventas) {
    const recurrentes = [];

    for (let i = 0; i < ventas.length; i++) {
        for (let j = i + 1; j < ventas.length; j++) {
            if (ventas[i].cliente === ventas[j].cliente && !recurrentes.includes(ventas[i].cliente)) {
                recurrentes.push(ventas[i].cliente);
            }
        }
    }

    return recurrentes;
}

function totalCiudadCadena(ventas, ciudad) {
    let ciudadNormalizada = normalizarCiudad(ciudad)
    let ventasCiudadesNormalizadas = ventas.map((venta) => {
        let ciudadNormalizada = normalizarCiudad(venta.ciudad)
        return {
            ...venta,
            ciudad: ciudadNormalizada
        }
    })
    let ventasCiudad = ventasCiudadesNormalizadas.filter((venta) => {
        return venta.ciudad === ciudadNormalizada
    })

    ventasCiudad = ventasCiudad.map((venta) => {
        return valorVenta(venta)
    })

    ventasCiudad = ventasCiudad.reduce((acumulador, valorVenta) => {
        acumulador += valorVenta
        return acumulador
    }, 0)
    return ventasCiudad
}


function totalCiudadUnaPasada(ventas, ciudad) {
    const ciudadNormalizada = normalizarCiudad(ciudad)
    let acumulador = 0
    for (const venta of ventas) {
        let ciudad = normalizarCiudad(venta.ciudad)
        if (ciudadNormalizada === ciudad) {
            acumulador += valorVenta(venta)
        }

    }


    return acumulador
}

//Versiones de funciones (totalVendido, unidadesVendidas, ventadPorCiudad) pero con metodos
function totalVendidoM(ventas) {
    let total = ventas.map((venta) => {
        return valorVenta(venta)
    })

    total = total.reduce((acumulador, valor) => {
        acumulador += valor
        return acumulador
    }, 0)
    return total
}


function unidadesVendidasM(ventas) {
    let unidadesVendidas = ventas.reduce((acumulador, venta) => {
        acumulador += venta.cantidad
        return acumulador
    }, 0)
    return unidadesVendidas
}

function ventasPorCiudadM(ventas, ciudad) {
    let ciudadEstandarizada = normalizarCiudad(ciudad)
    let ventasCiudad = ventas.filter((venta) => {
        return ciudadEstandarizada === normalizarCiudad(venta.ciudad)
    })
    ventasCiudad = ventasCiudad.reduce((acumulador, venta) => {
        acumulador += valorVenta(venta)
        return acumulador
    }, 0)
    return ventasCiudad
}

// Demostracion que los dos errores del agente no estan en mi funcion, para  ver la prueba se descomenta los dos console.log y se verifica que dan los mismos resultados
// console.log(ventasPorCiudadM(ventas, " bogotá"))
// console.log(ventasPorCiudadM(ventas, "Bogotá"))


module.exports = {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    normalizarCiudad,
    ventasPorCiudad,
    totalVendidoM,
    unidadesVendidasM,
    ventasPorCiudadM,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    ventasDelDia,
    totalVendidoInstrumentada,
    ventaMayorInstrumentada,
    totalPorCiudadEstandarizada,
    primeraVenta,
    clientesRecurrentes,
    totalCiudadCadena,
    totalCiudadUnaPasada
};