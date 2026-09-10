/* =====================================================
   validations.js - Reglas de negocio y validaciones
   Cada formulario valida en tiempo real (oninput) y al enviar (onsubmit)
   ===================================================== */

/* ---------- Helpers ---------- */

// Muestra un mensaje en el div .mensaje-error del campo
function mostrarError(campo, mensaje) {
  const error = document.getElementById("error-" + campo);
  if (error) error.textContent = mensaje;
}

// Limpia el mensaje de error
function limpiarError(campo) {
  const error = document.getElementById("error-" + campo);
  if (error) error.textContent = "";
}

// Verifica si un correo pertenece a los dominios permitidos
function correoValido(correo) {
  return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);
}

// Valida el formato del RUN chileno: 7 a 9 caracteres, sin puntos ni guion
// Acepta números + un dígito verificador (0-9 o K)
function runValido(run) {
  return /^[0-9]{6,8}[0-9K]$/.test(run.trim().toUpperCase());
}

/* ============================================
   LOGIN
   - correo: requerido, max 100, dominios @duoc.cl/@profesor.duoc.cl/@gmail.com
   - contraseña: requerida, 4 a 10 caracteres
   ============================================ */
function validarLogin(form) {
  const correo = form.correo.value.trim();
  const password = form.password.value;
  let valido = true;

  // Correo
  if (correo === "") {
    mostrarError("login-correo", "El correo es obligatorio");
    valido = false;
  } else if (correo.length > 100) {
    mostrarError("login-correo", "Máximo 100 caracteres");
    valido = false;
  } else if (!correoValido(correo)) {
    mostrarError("login-correo", "Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com");
    valido = false;
  } else {
    limpiarError("login-correo");
  }

  // Contraseña
  if (password === "") {
    mostrarError("login-password", "La contraseña es obligatoria");
    valido = false;
  } else if (password.length < 4 || password.length > 10) {
    mostrarError("login-password", "Debe tener entre 4 y 10 caracteres");
    valido = false;
  } else {
    limpiarError("login-password");
  }

  if (valido) {
    alert("Inicio de sesión correcto (simulado).");
    window.location.href = "index.html";
  }
  return false; // evita el submit real
}

/* ============================================
   REGISTRO
   - comparte reglas con la creación de usuario del admin
   ============================================ */
function validarRegistro(form) {
  const run = form.run.value.trim();
  const nombre = form.nombre.value.trim();
  const apellidos = form.apellidos.value.trim();
  const correo = form.correo.value.trim();
  const password = form.password.value;
  const direccion = form.direccion.value.trim();
  const region = form.region.value;
  const comuna = form.comuna.value;
  let valido = true;

  if (!runValido(run)) {
    mostrarError("reg-run", "RUN inválido. Sin puntos ni guion, 7-9 caracteres (ej: 19011022K)");
    valido = false;
  } else limpiarError("reg-run");

  if (nombre === "" || nombre.length > 50) {
    mostrarError("reg-nombre", "Requerido, máximo 50 caracteres");
    valido = false;
  } else limpiarError("reg-nombre");

  if (apellidos === "" || apellidos.length > 100) {
    mostrarError("reg-apellidos", "Requerido, máximo 100 caracteres");
    valido = false;
  } else limpiarError("reg-apellidos");

  if (correo === "" || correo.length > 100 || !correoValido(correo)) {
    mostrarError("reg-correo", "Correo requerido, máx 100, dominios @duoc.cl/@profesor.duoc.cl/@gmail.com");
    valido = false;
  } else limpiarError("reg-correo");

  if (password.length < 4 || password.length > 10) {
    mostrarError("reg-password", "La contraseña debe tener entre 4 y 10 caracteres");
    valido = false;
  } else limpiarError("reg-password");

  if (direccion === "" || direccion.length > 300) {
    mostrarError("reg-direccion", "Requerido, máximo 300 caracteres");
    valido = false;
  } else limpiarError("reg-direccion");

  if (region === "") {
    mostrarError("reg-region", "Selecciona una región");
    valido = false;
  } else limpiarError("reg-region");

  if (comuna === "") {
    mostrarError("reg-comuna", "Selecciona una comuna");
    valido = false;
  } else limpiarError("reg-comuna");

  if (valido) {
    mostrarExito("form-registro", "¡Registro exitoso! (simulado)");
    form.reset();
  }
  return false;
}

/* ============================================
   CONTACTO
   - nombre: requerido, max 100
   - correo: max 100, dominios permitidos
   - comentario: requerido, max 500
   ============================================ */
function validarContacto(form) {
  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim();
  const comentario = form.comentario.value.trim();
  let valido = true;

  if (nombre === "" || nombre.length > 100) {
    mostrarError("ctc-nombre", "Requerido, máximo 100 caracteres");
    valido = false;
  } else limpiarError("ctc-nombre");

  if (correo !== "" && (correo.length > 100 || !correoValido(correo))) {
    mostrarError("ctc-correo", "Si ingresas correo, debe ser válido y máximo 100 caracteres");
    valido = false;
  } else limpiarError("ctc-correo");

  if (comentario === "" || comentario.length > 500) {
    mostrarError("ctc-comentario", "Requerido, máximo 500 caracteres");
    valido = false;
  } else limpiarError("ctc-comentario");

  if (valido) {
    mostrarExito("form-contacto", "¡Mensaje enviado correctamente!");
    form.reset();
  }
  return false;
}

/* ============================================
   PRODUCTO (admin)
   - código: requerido, texto, min 3
   - nombre: requerido, max 100
   - descripción: opcional, max 500
   - precio: requerido, >= 0, decimal
   - stock: requerido, entero, >= 0
   - stockCritico: opcional, entero, >= 0
   - categoría: requerida (select)
   - imagen: opcional
   ============================================ */
function validarProducto(form) {
  const codigo = form.codigo.value.trim();
  const nombre = form.nombre.value.trim();
  const descripcion = form.descripcion.value.trim();
  const precio = form.precio.value;
  const stock = form.stock.value;
  const stockCritico = form.stockCritico.value;
  const categoria = form.categoria.value;
  let valido = true;

  if (codigo === "" || codigo.length < 3) {
    mostrarError("prod-codigo", "Requerido, mínimo 3 caracteres");
    valido = false;
  } else limpiarError("prod-codigo");

  if (nombre === "" || nombre.length > 100) {
    mostrarError("prod-nombre", "Requerido, máximo 100 caracteres");
    valido = false;
  } else limpiarError("prod-nombre");

  if (descripcion.length > 500) {
    mostrarError("prod-descripcion", "Máximo 500 caracteres");
    valido = false;
  } else limpiarError("prod-descripcion");

  if (precio === "" || isNaN(precio) || parseFloat(precio) < 0) {
    mostrarError("prod-precio", "Requerido, número decimal mayor o igual a 0");
    valido = false;
  } else limpiarError("prod-precio");

  if (stock === "" || !/^\d+$/.test(stock) || parseInt(stock) < 0) {
    mostrarError("prod-stock", "Requerido, número entero mayor o igual a 0");
    valido = false;
  } else limpiarError("prod-stock");

  if (stockCritico !== "" && (!/^\d+$/.test(stockCritico) || parseInt(stockCritico) < 0)) {
    mostrarError("prod-stockCritico", "Si lo ingresas, debe ser entero mayor o igual a 0");
    valido = false;
  } else limpiarError("prod-stockCritico");

  if (categoria === "") {
    mostrarError("prod-categoria", "Selecciona una categoría");
    valido = false;
  } else limpiarError("prod-categoria");

  if (valido) {
    mostrarExito("form-producto", "Producto guardado correctamente (simulado)");
    form.reset();
  }
  return false;
}

/* ============================================
   USUARIO (admin)
   - run: requerido, formato válido, 7-9
   - nombre: requerido, max 50
   - apellidos: requerido, max 100
   - correo: requerido, max 100, dominios válidos
   - fechaNacimiento: opcional
   - tipo: requerido (admin/cliente/vendedor)
   - region/comuna: requerido (dinámico)
   - dirección: requerido, max 300
   ============================================ */
function validarUsuario(form) {
  const run = form.run.value.trim();
  const nombre = form.nombre.value.trim();
  const apellidos = form.apellidos.value.trim();
  const correo = form.correo.value.trim();
  const tipo = form.tipo.value;
  const region = form.region.value;
  const comuna = form.comuna.value;
  const direccion = form.direccion.value.trim();
  let valido = true;

  if (!runValido(run) || run.length < 7 || run.length > 9) {
    mostrarError("usr-run", "RUN requerido, sin puntos ni guion, 7-9 caracteres");
    valido = false;
  } else limpiarError("usr-run");

  if (nombre === "" || nombre.length > 50) {
    mostrarError("usr-nombre", "Requerido, máximo 50 caracteres");
    valido = false;
  } else limpiarError("usr-nombre");

  if (apellidos === "" || apellidos.length > 100) {
    mostrarError("usr-apellidos", "Requerido, máximo 100 caracteres");
    valido = false;
  } else limpiarError("usr-apellidos");

  if (correo === "" || correo.length > 100 || !correoValido(correo)) {
    mostrarError("usr-correo", "Requerido, máximo 100, dominios @duoc.cl/@profesor.duoc.cl/@gmail.com");
    valido = false;
  } else limpiarError("usr-correo");

  if (tipo === "") {
    mostrarError("usr-tipo", "Selecciona un tipo de usuario");
    valido = false;
  } else limpiarError("usr-tipo");

  if (region === "") {
    mostrarError("usr-region", "Selecciona una región");
    valido = false;
  } else limpiarError("usr-region");

  if (comuna === "") {
    mostrarError("usr-comuna", "Selecciona una comuna");
    valido = false;
  } else limpiarError("usr-comuna");

  if (direccion === "" || direccion.length > 300) {
    mostrarError("usr-direccion", "Requerido, máximo 300 caracteres");
    valido = false;
  } else limpiarError("usr-direccion");

  if (valido) {
    mostrarExito("form-usuario", "Usuario guardado correctamente (simulado)");
    form.reset();
    cargarComunas();
  }
  return false;
}

/* ---------- Mensaje de éxito ---------- */
function mostrarExito(formId, mensaje) {
  const form = document.getElementById(formId);
  let exito = form.querySelector(".mensaje-exito");
  if (!exito) {
    exito = document.createElement("div");
    exito.className = "mensaje-exito";
    form.prepend(exito);
  }
  exito.textContent = mensaje;
  setTimeout(() => { exito.remove(); }, 4000);
}

/* ============================================
   Región / Comuna (dinámico)
   Carga las comunas según la región seleccionada
   ============================================ */
function cargarComunas() {
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");
  if (!regionSelect || !comunaSelect) return;

  const regionId = regionSelect.value;
  comunaSelect.innerHTML = '<option value="">Selecciona comuna</option>';

  if (regionId === "") return;
  const region = REGIONES.find(r => r.id === regionId);
  if (region) {
    region.comunas.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      comunaSelect.appendChild(opt);
    });
  }
}
