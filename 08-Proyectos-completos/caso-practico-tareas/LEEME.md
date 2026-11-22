# Caso práctico resuelto: gestor de tareas

Solución del ejemplo de la Guía Metodológica (examen práctico, cuarto ciclo).
Stack: HTML + CSS + PHP (PDO) + MySQL, sin librerías ni frameworks.

## Cómo ejecutarlo

1. En el panel de XAMPP, inicia **Apache** y **MySQL**.
2. Crea la base: en phpMyAdmin (http://localhost/phpmyadmin) usa *Importar* con `database.sql`.
   También puedes hacerlo desde consola:
   `C:\xampp\mysql\bin\mysql.exe -u root < database.sql`
3. Abre http://localhost/caso-practico-tareas/

## Archivos y qué requisito cumple cada uno

| Archivo | Qué hace | Requisito del caso |
|---|---|---|
| `database.sql` | Crea la base `gestor_tareas` y la tabla `tareas` | 3. Base de datos |
| `conexion.php` | Conexión PDO + listas de valores permitidos + `e()` para escapar HTML | 2. Backend |
| `index.php` | Formulario nuevo, filtros, listado con colores, regla de "atrasada" | 1. Frontend, 2. atrasada automática |
| `guardar.php` | `INSERT` (nueva) o `UPDATE` (editar nombre, descripción, prioridad) | 2. Guardar y actualizar |
| `editar.php` | Formulario con los datos actuales de la tarea | 2. Actualizar |
| `acciones.php` | Completar (`UPDATE estado`) y eliminar (`DELETE`) | 2. Completar y eliminar |
| `estilos.css` | Verde/amarillo/rojo según prioridad, diseño legible | 1. Colores y CSS |

## La regla automática de "atrasada"

Se ejecuta al inicio de `index.php`, cada vez que se carga el listado:

```sql
UPDATE tareas SET estado = 'atrasada'
WHERE estado = 'pendiente' AND fecha_fin < CURDATE();
```

Solo afecta a las pendientes, así una tarea completada nunca vuelve a "atrasada".

## Orden recomendado para escribirlo en el examen (3 horas)

1. **Leer la rúbrica** y anotar qué puntúa cada parte. (5 min)
2. `database.sql`: crear la tabla y probarla en phpMyAdmin. (15 min)
3. `conexion.php` y probar que conecta. (10 min)
4. Formulario + `guardar.php` con `INSERT`. Probar que se guarda. (30 min)
5. Listado en `index.php` con colores por prioridad. (25 min)
6. Filtros por estado y prioridad. (20 min)
7. `acciones.php`: completar y eliminar. (20 min)
8. `editar.php` + rama `UPDATE` en `guardar.php`. (25 min)
9. Regla de "atrasada" y CSS final. (20 min)
10. Probar todo de punta a punta. (10 min)

Primero que funcione; el diseño al final.

## Lo que tienes que saber de memoria

- **Conexión PDO** con `ERRMODE_EXCEPTION` y `FETCH_ASSOC`.
- **Consultas preparadas**: `$pdo->prepare('... WHERE id = ?')->execute([$id]);`
  Nunca concatenes datos del usuario dentro del SQL (inyección SQL).
- **Leer resultados**: `fetchAll()` para varias filas, `fetch()` para una.
- **Escapar al mostrar**: `htmlspecialchars()` (aquí envuelto en `e()`).
- **Validar en el servidor** aunque el HTML tenga `required`.
- **POST para cambiar datos** (guardar, completar, eliminar) y GET para leer (listar, filtrar).
- **Redirigir después de un POST** con `header('Location: ...'); exit;` para que recargar la página no repita la acción.
- **Filtros dinámicos**: empezar con `WHERE 1 = 1` y agregar `AND campo = ?` por cada filtro.
- SQL: `CREATE TABLE`, `ENUM`, `DEFAULT`, `AUTO_INCREMENT`, `PRIMARY KEY`, `CURDATE()`, `ORDER BY`.
