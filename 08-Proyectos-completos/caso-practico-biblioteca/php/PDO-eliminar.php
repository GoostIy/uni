<?php
// ==========================================================
//  PDO-eliminar.php  (DELETE)
//  Borra un préstamo por su id. El id llega por POST desde js/prestamos.js
//  Responde un texto con el resultado.
// ==========================================================

require 'PDO-coneccion.php';   // trae la conexión $mbd

$id=$_POST['id'];

try {
    $st = $mbd->prepare("DELETE FROM prestamos WHERE id=?");
    $st->execute([$id]);

    echo "El préstamo " . $id . " ha sido eliminado";
    $mbd = null;
} catch (PDOException $e) {
    echo "¡Error!: " . $e->getMessage();
}
