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


// Funciones ultilizadas por el TL Jorge, preguntarle sobre estas funciones y la explicacion de lo que hace y la estarandización que hace cada funcion
function limpiarTexto(texto) {
    if (typeof texto !== 'string') return '';
    return texto.normalize('NFC').trim().replace(/\s+/g, ' ');
}

function claveTexto(texto) {
    return limpiarTexto(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function tieneTildes(texto) {
    return /[\u0300-\u036f]/.test(limpiarTexto(texto).normalize('NFD'));
}

function formatearNombreLugar(texto) {
    const conectores = ['de', 'del', 'la', 'las', 'los', 'y', 'e'];
    const limpio = limpiarTexto(texto).toLowerCase();
    if (limpio === '') return '';

    const palabras = [];
    let posicion = 0;
    for (const palabra of limpio.split(' ')) {
        const esConector = posicion > 0 && conectores.includes(palabra);
        palabras.push(esConector ? palabra : palabra.charAt(0).toUpperCase() + palabra.slice(1));
        posicion++;
    }
    return palabras.join(' ');
}



function ventasPorCiudad(ventas, ciudad){
    const resumen = {}
    for (let venta of ventas){
        const ciudad = formatearNombreLugar(venta.ciudad)
        if(!resumen[ciudad]){
            resumen[ciudad = {
                totalVentas: 0,
                totalUnidaes: 0
            }]
        }
        resumen[ciudad].totalVentas += valorVenta(venta)
        resumen[ciudad.totalUnidaes] += venta.cantidad
    }
    return resumen
}