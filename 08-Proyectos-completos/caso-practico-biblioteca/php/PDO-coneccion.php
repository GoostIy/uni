<?php
// ==========================================================
//  PDO-coneccion.php
//  Abre la conexión con la base de datos.
//  Los demás archivos PHP lo incluyen con: require 'PDO-coneccion.php';
//  así la conexión se escribe una sola vez.
// ==========================================================

// Datos para entrar a MySQL (en XAMPP el usuario es root y no tiene contraseña)
$usuario="root";
$contraseña="";

try {
    // $mbd = "manejador de base de datos": aquí queda guardada la conexión.
    // Con $mbd se hacen todas las consultas en los otros archivos.
    $mbd = new PDO('mysql:host=localhost;dbname=bd-biblioteca;charset=utf8mb4', $usuario, $contraseña);

    // Si una consulta falla, PDO lanza un error (PDOException) que se atrapa con catch
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Si no se pudo conectar se muestra el error y se detiene todo
    echo "¡Error!: " . $e->getMessage();
    die();
}
