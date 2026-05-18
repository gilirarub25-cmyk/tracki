/**
 * next.config.ts
 * ---------------------------------------------------------------------------
 * Fichero de configuración principal del framework Next.js. Permite ajustar
 * el comportamiento del compilador, el bundler y el servidor de desarrollo
 * sin necesidad de modificar el código de la aplicación.
 *
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Lista de orígenes adicionales permitidos durante el desarrollo.
   *
   * Por defecto el servidor de Next.js solo acepta peticiones procedentes
   * de `localhost`. Cuando se desea probar la aplicación desde otro
   * dispositivo conectado a la misma red local (por ejemplo, un smartphone
   * en la misma red WiFi), es necesario declarar explícitamente las IPs
   * de origen para evitar advertencias de "Cross origin request detected".
   *
   * Los comodines (`*`) permiten cubrir todo el rango de la subred local.
   */
  allowedDevOrigins: [
    "192.168.77.1",
    "192.168.1.*",
    "192.168.0.*",
  ],
};

export default nextConfig;
