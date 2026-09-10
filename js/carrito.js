const CLAVE_CARRITO = "carrito_tienda";

// Devuelve el carrito de localStorage
function obtenerCarrito(){
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito){
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
}

function agregarAlCarrito(codigo){
    const producto = PRODUCTOS.find(p => p.codigo === codigo);
    if(!producto){
        alert("Producto no encontrado")
        return;
    }
    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.codigo === codigo);
    if(item){
        item.carrito += 1;
    }else{
        carrito.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    alert(`"${producto.nombre}" añadido al carrito`)
}

function cambiarCantidad(codigo, delta){
    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.codigo === codigo);
    if(!item) return;
    item.cantidad += delta;
    if(item.cantidad<=0){
        eliminarDelCarrito(codigo);
        return;
    }
    guardarCarrito(carrito);
    renderCarrito();
}

function eliminarDelCarrito(codigo){
    let carrito = obtenerCarrito();
    carrito = carrito.filter(i=>i.codigo!==codigo);
    guardarCarrito(carrito);
    renderCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito(){
    if(!confirm("Vaciar el carrito?")) return;
    localStorage.removeItem(CLAVE_CARRITO);
    renderCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito(){
    const contador = document.getElementById("carrito-contador");
    if(!contador) return;
    const total = obtenerCarrito().reduce((acc, i)=>acc+i.cantidad, 0);
    contador.textContent = total;
}

function renderCarrito(){
    const cont = document.getElementById("carrito-contenido");
    if (!cont) return;
    const carrito = obtenerCarrito();

    if(carrito.length === 0){
        cont.innerHTML=`
        <div class="carrito-vacio">
            <p> Tu carrito esta vacio.</p>
            <p><a href="productos.html">Ver Productos</a></p>
        </div>`;
        return;
    }

    let filas = "";
    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio*item.cantidad;
        total+=subtotal;
        filas+=`
            <tr>
                <td>${item.imagen} ${item.nombre}</td>
                <td>$${item.precio.toLocaleString("es-CL")}</td>
                <td>
                    <button onclick="cambiarCantidad('${item.codigo}', -1)">-</button>
                    ${item.cantidad}
                    <button onclick="cambiarCantidad('${item.codigo}', 1)">+</button>
                </td>
                <td>$${subtotal.toLocaleString("es-CL")}</td>
                <td><button class="btn-peligro" onclick="eliminarDelCarrito('${item.codigo}')">Eliminar</button></td>
            </tr>`;
    });

    cont.innerHTML = `
        <table class="carrito-tabla">
            <thead>
                <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
        <p class="carrito-total">Total: $${total.toLocaleString("es-CL")}</p>
        <button class="btn-peligro" onclick="vaciarCarrito()">Vaciar carrito</button>`;
}

function renderProductos() {
  const cont = document.getElementById("productos-contenido");
  if (!cont) return;

  let html = '<div class="productos-grid">';
  PRODUCTOS.forEach(p => {
    const alerta = p.stock <= p.stockCritico
      ? `<div class="alerta">⚠ Stock crítico: ${p.stock} unidades</div>`
      : "";
    html += `
      <article class="producto-card">
        <div class="producto-imagen">${p.imagen}</div>
        <h3>${p.nombre}</h3>
        <p class="precio">$${p.precio.toLocaleString("es-CL")}</p>
        <a class="btn-principal" href="producto-detalle.html?codigo=${p.codigo}">Ver detalle</a>
        <button class="btn-secundario" onclick="agregarAlCarrito('${p.codigo}')">Añadir al carrito</button>
        ${alerta}
      </article>`;
  });
  html += "</div>";
  cont.innerHTML = html;
}


function renderDetalleProducto() {
  const cont = document.getElementById("detalle-contenido");
  if (!cont) return;
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  const producto = PRODUCTOS.find(p => p.codigo === codigo) || PRODUCTOS[0];

  cont.innerHTML = `
    <div class="detalle-grid">
      <div class="producto-imagen">${producto.imagen}</div>
      <div class="detalle-info">
        <h1>${producto.nombre}</h1>
        <p>Código: ${producto.codigo}</p>
        <p>Categoría: ${producto.categoria}</p>
        <p class="precio-grande">$${producto.precio.toLocaleString("es-CL")}</p>
        <p>${producto.descripcion}</p>
        <p>Stock disponible: ${producto.stock}</p>
        <button class="btn-secundario" onclick="agregarAlCarrito('${producto.codigo}')">Añadir al carrito</button>
        <a class="btn-principal" href="productos.html" style="margin-top:8px;">← Volver al listado</a>
      </div>
    </div>`;
}