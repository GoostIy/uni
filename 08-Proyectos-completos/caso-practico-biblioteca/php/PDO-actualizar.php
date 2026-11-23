<?php
// ==========================================================
//  PDO-actualizar.php  (UPDATE)
//  Hace una de dos cosas según "accion":
//    - accion=devolver -> marca el préstamo como devuelto
//    - accion=editar   -> cambia libro, categoría y fecha límite
//  Responde un texto con el resultado.
// ==========================================================

require 'PDO-coneccion.php';   // trae la conexión $mbd

$id=$_POST['id'];
$accion=$_POST['accion'];

try {
    if ($accion == "devolver") {
        // Solo cambia el estado
        $st = $mbd->prepare("UPDATE prestamos SET estado='devuelto' WHERE id=?");
        $st->execute([$id]);
        echo "El préstamo " . $id . " quedó como devuelto";
    } else {
        // Cambia los datos que se pueden editar
        $libro=$_POST['libro'];
        $categoria=$_POST['categoria'];
        $fecha_limite=$_POST['fecha_limite'];

        $sentencia="UPDATE prestamos SET libro=?, categoria=?, fecha_limite=? WHERE id=?";
        $st = $mbd->prepare($sentencia);
        $st->execute([$libro, $categoria, $fecha_limite, $id]);
        echo "Los datos han sido actualizados correctamente";
    }
    $mbd = null;
} catch (PDOException $e) {
    echo "¡Error!: " . $e->getMessage();
}
