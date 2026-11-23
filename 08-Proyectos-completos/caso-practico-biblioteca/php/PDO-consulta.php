<?php
// ==========================================================
//  PDO-consulta.php  (READ)
//  Lee todos los préstamos de la base de datos y los guarda
//  en el archivo xml/prestamos.xml.
//  Después la página lee ese archivo con AJAX (js/prestamos.js).
// ==========================================================

require 'PDO-coneccion.php';   // trae la conexión $mbd

try {
    // 1. Regla automática: si ya pasó la fecha límite (CURDATE() = hoy)
    //    y el libro sigue prestado, el préstamo pasa a "vencido"
    $mbd->exec("UPDATE prestamos SET estado='vencido' WHERE estado='prestado' AND fecha_limite < CURDATE()");

    // 2. Se traen todos los préstamos (los filtros se aplican después en JavaScript)
    $st = $mbd->prepare("SELECT * FROM prestamos ORDER BY id");
    $st->execute();

    // 3. Se arma el texto del XML: una etiqueta <prestamo> por cada fila.
    //    htmlspecialchars evita que un texto con & o < dañe el XML
    $xml  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    $xml .= "<prestamos>\n";
    foreach ($st as $fila) {
        $xml .= "    <prestamo>\n";
        $xml .= "        <id>" . $fila['id'] . "</id>\n";
        $xml .= "        <estudiante>" . htmlspecialchars($fila['estudiante']) . "</estudiante>\n";
        $xml .= "        <cedula>" . $fila['cedula'] . "</cedula>\n";
        $xml .= "        <libro>" . htmlspecialchars($fila['libro']) . "</libro>\n";
        $xml .= "        <categoria>" . $fila['categoria'] . "</categoria>\n";
        $xml .= "        <fecha_prestamo>" . $fila['fecha_prestamo'] . "</fecha_prestamo>\n";
        $xml .= "        <fecha_limite>" . $fila['fecha_limite'] . "</fecha_limite>\n";
        $xml .= "        <estado>" . $fila['estado'] . "</estado>\n";
        $xml .= "    </prestamo>\n";
    }
    $xml .= "</prestamos>\n";

    // 4. Se guarda el texto en el archivo xml/prestamos.xml
    //    (__DIR__ es la carpeta php/ y ".." sube a la carpeta del proyecto)
    file_put_contents(__DIR__ . "/../xml/prestamos.xml", $xml);

    echo "ok";
    $mbd = null;   // cierra la conexión
} catch (PDOException $e) {
    echo "¡Error!: " . $e->getMessage();
}
