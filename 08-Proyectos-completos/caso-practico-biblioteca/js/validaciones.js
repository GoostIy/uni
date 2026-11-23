// ==========================================================
//  validaciones.js
//  1. Controles mientras se escribe (oninput en index.html):
//     no dejan escribir caracteres que no van en el campo.
//  2. Validación al guardar: revisa todo antes de enviar.
// ==========================================================


// ---------- 1. Controles mientras se escribe ----------

// Nombre: solo letras (con tildes y ñ) y espacios.
// replace borra todo lo que NO esté en la lista [^ ... ]
function soloLetras(campo) {
    campo.value = campo.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü ]/g, "");
}

// Cédula: solo números del 0 al 9 y máximo 10
// (primero borra lo que no es número y después corta a 10,
//  así también funciona si se pega un texto)
function soloNumeros(campo) {
    campo.value = campo.value.replace(/[^0-9]/g, "").slice(0, 10);
}


// ---------- 2. Validación al guardar ----------
// Devuelve true si todo está bien y false si hay un error

function validarPrestamo() {

    // Campos vacíos: se revisa cada campo por su id
    var campos = ["estudiante", "cedula", "libro", "categoria", "fecha_prestamo", "fecha_limite"];
    for (var i = 0; i < campos.length; i++) {
        if (document.getElementById(campos[i]).value.trim() == "") {
            alert("Complete el campo: " + campos[i]);
            return false;
        }
    }

    // Nombre: solo letras y espacios, mínimo 3 letras
    var nombre = document.getElementById("estudiante").value.trim();
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{3,}$/.test(nombre)) {
        alert("El nombre solo puede tener letras y debe tener al menos 3.");
        return false;
    }

    // Cédula: exactamente 10 números
    // /^[0-9]{10}$/ = de principio (^) a fin ($), 10 dígitos
    var cedula = document.getElementById("cedula").value;
    if (!/^[0-9]{10}$/.test(cedula)) {
        alert("La cédula debe tener exactamente 10 números.");
        return false;
    }

    // La fecha límite no puede ser anterior a la del préstamo.
    // Las fechas vienen como "AAAA-MM-DD", así que se pueden comparar como texto.
    var inicio = document.getElementById("fecha_prestamo").value;
    var limite = document.getElementById("fecha_limite").value;
    if (limite < inicio) {
        alert("La fecha límite no puede ser anterior a la fecha del préstamo.");
        return false;
    }

    return true;   // todo bien
}
