const { ventas } = require("./datos")

const {
    totalVendido,
    totalVendidoM,
    unidadesVendidas,
    unidadesVendidasM,
    ventasPorCiudad,
    ventasPorCiudadM
} = require(("./analitica.js"))

function comparacionFunciones (funcion1,funcion2) {
    if (funcion1 === funcion2){
        return "OK"
    }else{
        return "DIFERENTE"
    }
}
// console.log (comparacionFunciones(totalVendido(ventas),totalVendidoM(ventas)))
// console.log (comparacionFunciones(unidadesVendidas(ventas),unidadesVendidasM(ventas)))
// console.log (comparacionFunciones(ventasPorCiudad(ventas, "medellín"),ventasPorCiudadM(ventas, "medellín")))