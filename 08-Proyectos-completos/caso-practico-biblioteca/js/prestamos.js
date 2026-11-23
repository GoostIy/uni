// ==========================================================
//  prestamos.js
//  Todo lo que hace la página con AJAX (XMLHttpRequest):
//    - Leer la lista desde el archivo xml/prestamos.xml
//    - Registrar, editar, devolver y eliminar llamando a los PHP
//  La página nunca se recarga.
// ==========================================================

// Última lista de préstamos leída del XML
// (se usa para llenar el formulario al presionar "Editar")
var listaPrestamos = [];


// ==========================================================
//  READ: cargar la lista
// ==========================================================

// Paso 1: PDO-consulta.php lee la base de datos y escribe xml/prestamos.xml
function cargarPrestamos() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        // readyState 4 = terminó; status 200 = el servidor respondió bien
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "ok") {
                leerXML();                      // paso 2
            } else {
                mostrarMensaje(this.responseText);   // hubo un error en PHP
            }
        }
    };
    xhttp.open("GET", "php/PDO-consulta.php", true);
    xhttp.send();
}

// Paso 2: se lee el archivo XML con AJAX (igual que lenguajes.xml en clase)
function leerXML() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            mostrarTabla(this.responseXML);     // responseXML = el XML ya listo para recorrer
        }
    };
    // "?" + la hora actual: evita que el navegador use una copia vieja del archivo
    xhttp.open("GET", "xml/prestamos.xml?" + new Date().getTime(), true);
    xhttp.send();
}

// Devuelve el texto de una etiqueta hija. Ej.: texto(prestamo, "libro")
function texto(nodo, etiqueta) {
    var elemento = nodo.getElementsByTagName(etiqueta)[0];
    // si la etiqueta está vacía no tiene hijos: se devuelve ""
    return elemento.childNodes.length > 0 ? elemento.childNodes[0].nodeValue : "";
}

// Cambia < > & por su código HTML para que el texto del usuario
// se muestre tal cual y no se interprete como etiquetas
function limpiar(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Paso 3: se recorren las etiquetas <prestamo> y se arma la tabla.
// Aquí también se aplican los filtros (sin volver a pedir nada al servidor)
function mostrarTabla(xml) {
    var filtroEstado = document.getElementById("filtroEstado").value;
    var filtroCategoria = document.getElementById("filtroCategoria").value;

    var prestamos = xml.getElementsByTagName("prestamo");
    listaPrestamos = [];
    var filas = "";

    for (var i = 0; i < prestamos.length; i++) {
        // cada <prestamo> se pasa a un objeto de JavaScript
        var p = {
            id: texto(prestamos[i], "id"),
            estudiante: texto(prestamos[i], "estudiante"),
            cedula: texto(prestamos[i], "cedula"),
            libro: texto(prestamos[i], "libro"),
            categoria: texto(prestamos[i], "categoria"),
            fecha_prestamo: texto(prestamos[i], "fecha_prestamo"),
            fecha_limite: texto(prestamos[i], "fecha_limite"),
            estado: texto(prestamos[i], "estado")
        };

        // filtros: si no coincide, se salta este préstamo ("" = sin filtro)
        if (filtroEstado != "" && p.estado != filtroEstado) continue;
        if (filtroCategoria != "" && p.categoria != filtroCategoria) continue;

        listaPrestamos.push(p);
        var posicion = listaPrestamos.length - 1;

        filas += "<tr>" +
            "<td>" + p.id + "</td>" +
            "<td>" + limpiar(p.estudiante) + "<br><small>" + p.cedula + "</small></td>" +
            "<td>" + limpiar(p.libro) + "<br><small>" + p.categoria + "</small></td>" +
            "<td>" + p.fecha_prestamo + "</td>" +
            "<td>" + p.fecha_limite + "</td>" +
            // la clase "estado prestado / vencido / devuelto" le da el color (ver estilos.css)
            "<td><span class='estado " + p.estado + "'>" + p.estado + "</span></td>" +
            "<td class='acciones'>";

        // "Devolver" solo aparece si el libro todavía no se devolvió
        if (p.estado != "devuelto") {
            filas += "<button class='boton-chico' onclick='devolver(" + p.id + ")'>Devolver</button>";
        }
        filas += "<button class='boton-chico' onclick='editar(" + posicion + ")'>Editar</button>" +
                 "<button class='boton-chico peligro' onclick='eliminar(" + p.id + ")'>Eliminar</button>" +
                 "</td></tr>";
    }

    if (filas == "") {
        filas = "<tr><td colspan='7' class='vacio'>No hay préstamos con esos filtros</td></tr>";
    }
    document.getElementById("tablaPrestamos").innerHTML = filas;
}


// ==========================================================
//  Enviar datos a PHP (CREATE, UPDATE y DELETE)
// ==========================================================

// Envía datos por POST a un archivo PHP; cuando responde muestra
// el mensaje y vuelve a cargar la lista
function enviarPOST(archivo, datos) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            mostrarMensaje(this.responseText);
            cargarPrestamos();
        }
    };
    xhttp.open("POST", archivo, true);
    // así PHP puede leer los datos con $_POST
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(datos);
}

// Muestra el texto que respondió PHP (verde si salió bien, rojo si empieza con "¡Error!")
function mostrarMensaje(textoRespuesta) {
    var aviso = document.getElementById("mensaje");
    aviso.innerHTML = limpiar(textoRespuesta);
    aviso.className = textoRespuesta.indexOf("¡Error!") == 0 ? "mensaje error" : "mensaje ok";
}


// ---------- CREATE y UPDATE: guardar el formulario ----------

function guardarPrestamo() {
    if (!validarPrestamo()) {      // validaciones.js
        return false;
    }

    // se arma el texto "campo=valor&campo=valor..."
    // encodeURIComponent convierte tildes y espacios para que viajen bien
    var datos = "estudiante=" + encodeURIComponent(document.getElementById("estudiante").value.trim()) +
        "&cedula=" + encodeURIComponent(document.getElementById("cedula").value) +
        "&libro=" + encodeURIComponent(document.getElementById("libro").value.trim()) +
        "&categoria=" + encodeURIComponent(document.getElementById("categoria").value) +
        "&fecha_prestamo=" + encodeURIComponent(document.getElementById("fecha_prestamo").value) +
        "&fecha_limite=" + encodeURIComponent(document.getElementById("fecha_limite").value);

    var id = document.getElementById("id").value;

    if (id == "") {
        enviarPOST("php/PDO-insertar.php", datos);                               // nuevo
    } else {
        enviarPOST("php/PDO-actualizar.php", datos + "&accion=editar&id=" + id);  // editar
    }

    limpiarFormulario();
    return false;   // evita que el formulario recargue la página
}

// Pasa los datos de un préstamo al formulario para editarlo
function editar(posicion) {
    var p = listaPrestamos[posicion];
    document.getElementById("id").value = p.id;
    document.getElementById("estudiante").value = p.estudiante;
    document.getElementById("cedula").value = p.cedula;
    document.getElementById("libro").value = p.libro;
    document.getElementById("categoria").value = p.categoria;
    document.getElementById("fecha_prestamo").value = p.fecha_prestamo;
    document.getElementById("fecha_limite").value = p.fecha_limite;

    // estos tres no se cambian al editar (readOnly = solo lectura)
    document.getElementById("estudiante").readOnly = true;
    document.getElementById("cedula").readOnly = true;
    document.getElementById("fecha_prestamo").readOnly = true;

    document.getElementById("tituloFormulario").innerHTML = "Editar el préstamo " + p.id;
    document.getElementById("botonGuardar").value = "Guardar cambios";
    document.getElementById("botonCancelar").hidden = false;
    window.scrollTo(0, 0);   // sube al formulario
}

// Deja el formulario vacío y en modo "Registrar"
function limpiarFormulario() {
    document.getElementById("formulario").reset();
    document.getElementById("id").value = "";
    document.getElementById("estudiante").readOnly = false;
    document.getElementById("cedula").readOnly = false;
    document.getElementById("fecha_prestamo").readOnly = false;
    document.getElementById("tituloFormulario").innerHTML = "Registrar préstamo";
    document.getElementById("botonGuardar").value = "Registrar";
    document.getElementById("botonCancelar").hidden = true;
}


// ---------- UPDATE: marcar como devuelto ----------

function devolver(id) {
    enviarPOST("php/PDO-actualizar.php", "accion=devolver&id=" + id);
}


// ---------- DELETE: eliminar ----------

function eliminar(id) {
    // confirm() muestra Aceptar / Cancelar; si cancela no se hace nada
    if (confirm("¿Seguro que desea eliminar el préstamo " + id + "?")) {
        enviarPOST("php/PDO-eliminar.php", "id=" + id);
    }
}
