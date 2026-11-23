# Caso práctico 2: Control de préstamos de libros

Tiempo sugerido: **3 horas**.

## Requisitos del sistema

### 1. Frontend (HTML y CSS)

- Una sola página con:
  - Un **formulario para registrar préstamos** con: nombre del estudiante, cédula, título del libro,
    categoría (Ciencia, Literatura, Tecnología), fecha del préstamo y fecha límite de devolución.
  - **Filtros** para buscar los préstamos por **estado** o por **categoría**.
  - Una tabla con los préstamos y su estado en **colores**: prestado en azul, vencido en rojo y devuelto en verde.
- Diseñar con CSS para que la interfaz sea clara y legible.

### 2. Backend (PHP con PDO)

- **Guardar** el préstamo en la base de datos (estado inicial: prestado).
- **Marcar un préstamo como devuelto**.
- **Cambiar automáticamente el estado a vencido** cuando pasó la fecha límite y el libro no fue devuelto.
- **Actualizar** un préstamo (título del libro, categoría o fecha límite).
- **Eliminar** préstamos.

### 3. AJAX con XML

- PHP guarda la lista de préstamos en el archivo **`xml/prestamos.xml`**.
- La página lee ese archivo con **AJAX** (`XMLHttpRequest`, `responseXML` y `getElementsByTagName`).
- Registrar, filtrar, devolver, editar y eliminar **sin recargar** la página.

### 4. Validaciones (JavaScript)

- No se permiten campos vacíos.
- El nombre solo acepta letras y la cédula solo números (exactamente 10).
- La fecha límite no puede ser anterior a la fecha del préstamo.
- Pedir confirmación antes de eliminar.

### 5. Base de datos (MySQL)

Base `bd-biblioteca`, tabla `prestamos`: id (clave primaria), estudiante, cedula, libro, categoria,
fecha_prestamo, fecha_limite y estado (prestado, vencido, devuelto).

---

## Estructura de la solución

```
caso-practico-biblioteca/
├── index.html            página única
├── css/estilos.css       diseño
├── js/validaciones.js    controles de los campos
├── js/prestamos.js       AJAX: lee el XML y llama a los PHP
├── php/                  conexión y CRUD con PDO
├── xml/prestamos.xml     lo genera php/PDO-consulta.php
└── sql/database.sql      base de datos con datos de ejemplo
```

Para probarla: enciende Apache y MySQL en XAMPP, importa `sql/database.sql` en phpMyAdmin y abre
http://localhost/caso-practico-biblioteca/
