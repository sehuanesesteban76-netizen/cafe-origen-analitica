const ciudades = ["Medellín", "Bogotá", "Cali", "Pereira"]
const productos = ["Origen Huila 500 g", "Origen Nariño 250 g", "Prensa francesa", "Origen Sierra 500 g", "Molino manual"]
const precios = [42000, 26000, 95000, 45000, 120000]


function generarVentas(n) {
    if (n < 0)return "No valido"
    const ventas = []
    const maxClientes = Math.max(1, Math.floor(n/3))

    for (let numerador = 1; numerador <= n; numerador++) {
        
        const indiceProductoPrecio = Math.floor(Math.random() * productos.length)
        const numeroCliente = Math.floor(Math.random() * maxClientes) + 1
        let venta = {
            id: numerador,
            fecha: "2026-09-01",
            cliente: "C" + numeroCliente,
            producto: productos[indiceProductoPrecio],
            ciudad: ciudades[Math.floor(Math.random() * ciudades.length)],
            cantidad: Math.floor(Math.random() * 5) + 1,
            precio: precios[indiceProductoPrecio]
        }
        ventas.push(venta)
    }
    return ventas
}

module.exports = {
    generarVentas,
    ciudades,
    productos,
    precios
}