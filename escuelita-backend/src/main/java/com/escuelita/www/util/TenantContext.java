package com.escuelita.www.util;
/*
    Contexto para almacenar el ID de la sede del usuario actual.
    Utiliza ThreadLocal para garantizar que cada request tenga su propio contexto aislado.

    Esta clase es fundamental para el multi-tenancy a nivel de base de datos,
    permitiendo que cada usuario solo vea datos de su sede asignada.
*/
public class TenantContext {

    private static final ThreadLocal<Long> currentSedeId = new ThreadLocal<>();
    private static final ThreadLocal<String> currentUserType = new ThreadLocal<>();

    /* Establece el ID de la sede para el request actual
    @param sedeId ID de la sede del usuario autenticado */
    public static void setSedeId(Long sedeId) {
        currentSedeId.set(sedeId);
    }

    /* Obtiene el ID de la sede del request actual
    @return ID de la sede o null si no está establecido */
    public static Long getSedeId() {
        return currentSedeId.get();
    }

    /* Establece el tipo de usuario (SUPER_ADMIN, ESCUELA, etc.)
    @param userType Tipo de usuario */
    public static void setUserType(String userType) {
        currentUserType.set(userType);
    }

    /* Obtiene el tipo de usuario actual
    @return Tipo de usuario o null */
    public static String getUserType() {
        return currentUserType.get();
    }

    /* Verifica si el usuario actual es un Super Admin
    @return true si es Super Admin */
    public static boolean isSuperAdmin() {
        String userType = currentUserType.get();
        return userType != null && userType.startsWith("SUPER_ADMIN");
    }

    /* Limpia el contexto del thread actual.
    IMPORTANTE: Debe llamarse al final de cada request para evitar memory leaks. */
    public static void clear() {
        currentSedeId.remove();
        currentUserType.remove();
    }

    /* Verifica si hay una sede establecida en el contexto
    @return true si hay una sede establecida */
    public static boolean hasSedeId() {
        return currentSedeId.get() != null;
    }
}
