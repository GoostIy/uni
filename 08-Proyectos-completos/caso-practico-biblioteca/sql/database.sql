-- Hace que las tildes se guarden bien al importar
SET NAMES utf8mb4;

-- Crea la base de datos y la selecciona
CREATE DATABASE IF NOT EXISTS `bd-biblioteca` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bd-biblioteca`;

-- Tabla de préstamos
CREATE TABLE IF NOT EXISTS prestamos (
  id             INT AUTO_INCREMENT PRIMARY KEY,                       -- clave primaria, se numera sola
  estudiante     VARCHAR(80) NOT NULL,
  cedula         CHAR(10) NOT NULL,
  libro          VARCHAR(120) NOT NULL,
  categoria      ENUM('Ciencia', 'Literatura', 'Tecnología') NOT NULL, -- solo acepta estas 3
  fecha_prestamo DATE NOT NULL,
  fecha_limite   DATE NOT NULL,
  estado         ENUM('prestado', 'vencido', 'devuelto') NOT NULL DEFAULT 'prestado'
);

-- Datos de ejemplo (el primero ya pasó su fecha límite: al consultar se pone vencido)
INSERT INTO prestamos (estudiante, cedula, libro, categoria, fecha_prestamo, fecha_limite, estado) VALUES
  ('María Torres',  '0201234567', 'Cien años de soledad',      'Literatura', CURDATE() - INTERVAL 20 DAY, CURDATE() - INTERVAL 5 DAY,  'prestado'),
  ('Carlos Guamán', '0209876543', 'Breve historia del tiempo', 'Ciencia',    CURDATE() - INTERVAL 3 DAY,  CURDATE() + INTERVAL 11 DAY, 'prestado'),
  ('Lucía Chimbo',  '0204567890', 'Aprende PHP desde cero',    'Tecnología', CURDATE() - INTERVAL 15 DAY, CURDATE() - INTERVAL 1 DAY,  'devuelto');
