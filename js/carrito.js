const CLAVE_CARRITO = "carrito_tienda";

function obtenerCarrito(){
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
}