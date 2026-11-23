<?php
// ==========================================================
//  PDO-insertar.php  (CREATE)
//  Guarda un préstamo nuevo. Los datos llegan por POST desde js/prestamos.js
//  Responde un texto con el resultado.
// ==========================================================

require 'PDO-coneccion.php';   // trae la conexión $mbd

// Datos del formulario
$estudiante=$_POST['estudiante'];
$cedula=$_POST['cedula'];
$libro=$_POST['libro'];
$categoria=$_POST['categoria'];
$fecha_prestamo=$_POST['fecha_prestamo'];
$fecha_limite=$_POST['fecha_limite'];

try {
    // Cada ? se reemplaza, en orden, por los valores del execute.
    // El estado de un préstamo nuevo siempre es 'prestado'.
    $sentencia="INSERT INTO prestamos(estudiante, cedula, libro, categoria, fecha_prestamo, fecha_limite, estado)
                VALUES (?,?,?,?,?,?,'prestado')";
    $st = $mbd->prepare($sentencia);
    $st->execute([$estudiante, $cedula, $libro, $categoria, $fecha_prestamo, $fecha_limite]);

    echo "Los datos han sido ingresados correctamente";
    $mbd = null;
} catch (PDOException $e) {
    echo "¡Error!: " . $e->getMessage();
}
