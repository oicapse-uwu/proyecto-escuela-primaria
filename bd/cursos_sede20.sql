-- =====================================================
-- CURSOS PARA SEDE 20
-- 16 cursos, 2 por cada área global (IDs 1-8)
-- =====================================================

INSERT INTO `cursos` (`id_area`, `nombre_curso`, `estado`, `id_sede`) VALUES
-- MATEMÁTICA (id_area = 1)
(1, 'Números y Operaciones',    1, 20),
(1, 'Geometría y Medición',     1, 20),

-- COMUNICACIÓN (id_area = 2)
(2, 'Lectura y Comprensión',    1, 20),
(2, 'Expresión Oral y Escrita', 1, 20),

-- INGLÉS (id_area = 3)
(3, 'English Básico',           1, 20),
(3, 'English Intermedio',       1, 20),

-- ARTE Y CULTURA (id_area = 4)
(4, 'Artes Plásticas',          1, 20),
(4, 'Música y Expresión',       1, 20),

-- PERSONAL SOCIAL (id_area = 5)
(5, 'Historia del Perú',        1, 20),
(5, 'Ciudadanía y Convivencia', 1, 20),

-- EDUCACIÓN FÍSICA (id_area = 6)
(6, 'Deportes y Recreación',    1, 20),
(6, 'Psicomotricidad',          1, 20),

-- EDUCACIÓN RELIGIOSA (id_area = 7)
(7, 'Valores y Ética',          1, 20),
(7, 'Formación Religiosa',      1, 20),

-- CIENCIA Y TECNOLOGÍA (id_area = 8)
(8, 'Ciencias Naturales',       1, 20),
(8, 'Tecnología e Innovación',  1, 20);
