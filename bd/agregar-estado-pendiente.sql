-- Agregar estado "Pendiente" para suscripciones nuevas sin pagos verificados
INSERT INTO `estados_suscripcion` (`id_estado`, `nombre`, `estado`) VALUES
(5, 'Pendiente', 1);
