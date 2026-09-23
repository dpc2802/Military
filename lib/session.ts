/**
 * Autenticación del panel de administración.
 * 
 * Estrategia: iron-session (cookie encriptada httpOnly) + validación
 * contra contraseña en tabla admin_users en BD.
 * 
 * Seguridad:
 * - Cookie httpOnly: no accesible desde JS del cliente
 * - Cookie secure: solo HTTPS en producción
 * - Cookie sameSite strict: protección CSRF
 * - Contraseña hasheada con bcrypt (12 rounds)
 */

import type { SessionOptions } from "iron-session";

export type AdminSessionData = {
  admin?: {
    id: number;
    username: string;
    isLoggedIn: boolean;
  };
};

// Configuración de la sesión encriptada
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "complex_password_at_least_32_characters_long_here_change_in_prod",
  cookieName: "sgb-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 8 * 60 * 60, // 8 horas de sesión
  },
};
