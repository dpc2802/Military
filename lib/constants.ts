/**
 * Constantes de configuración del negocio
 * Si hay variables de entorno disponibles, las usa; si no, usa los defaults.
 */

/** Horas que dura la reserva de stock antes de liberarse automáticamente */
export const STOCK_RESERVATION_HOURS = 24;

/** Cantidad mínima de stock para mostrar alerta en el admin */
export const LOW_STOCK_THRESHOLD = 3;

/** Número de WhatsApp del negocio (sin +, con código de país Colombia: 57) */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573226133232";

/** URL base del sitio (para generar links en emails y OG tags) */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgbmilitary.com";

/** Email del administrador para notificaciones */
export const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "Sgbmilitaryshop@gmail.com";

/** Máximo de imágenes por producto */
export const MAX_PRODUCT_IMAGES = 6;

/** Tamaño máximo de imagen en bytes (5MB) */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

