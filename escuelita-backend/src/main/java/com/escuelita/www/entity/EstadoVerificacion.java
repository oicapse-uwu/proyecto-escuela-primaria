package com.escuelita.www.entity;

/**
 * Enum para el estado de verificación del pago de suscripción
 */
public enum EstadoVerificacion {
    PENDIENTE,    // Pago registrado, esperando verificación
    VERIFICADO,   // Pago verificado y aprobado
    RECHAZADO     // Pago rechazado (comprobante inválido, monto incorrecto, etc.)
}
